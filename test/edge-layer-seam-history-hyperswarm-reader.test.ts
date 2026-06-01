import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  activeManagedCorestoreCount,
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
  assertEdgeLayerSeamHistoryObservationResult,
  assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback,
  assertEdgeLayerSeamHistoryPublicDeviceReplicaReportReadback,
  buildEdgeLayerSeamHistoryObservationResult,
  buildEdgeLayerSeamHistoryDurableRecordSourceRefCompleteness,
  buildEdgeLayerSeamHistoryHyperswarmInputLaneReadiness,
  buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback,
  buildEdgeLayerSeamHistoryPublicDeviceReplicaReportReadback,
  buildEdgeLayerSeamHistoryPublicDeviceRunInstructions,
  buildEdgeLayerSeamHistoryPublicDeviceSourceManifest,
  buildEdgeLayerSeamHistoryRealHyperswarmProofRunInstructions,
  createHyperswarmReplicationSwarm,
  openEdgeLayerSeamHistoryPublicDeviceSourcePublisher,
  parseHyperswarmBootstrap,
  runEdgeLayerSeamHistoryPublicDeviceReplicaReader,
  runEdgeLayerSeamHistoryHyperswarmReader,
  type HyperswarmReplicationSwarm,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const SHOULD_RUN_REAL_HYPERSWARM = process.env.CAUSAL_SUBSTRATE_REAL_HYPERSWARM === "1";
const SHOULD_USE_PUBLIC_HYPERSWARM = process.env.CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC === "1";
const CONFIGURED_HYPERSWARM_BOOTSTRAP = parseHyperswarmBootstrap(
  process.env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP,
);
const SHOULD_RUN_PUBLIC_HYPERSWARM = SHOULD_RUN_REAL_HYPERSWARM &&
  SHOULD_USE_PUBLIC_HYPERSWARM &&
  CONFIGURED_HYPERSWARM_BOOTSTRAP.length === 0;

interface HyperswarmHarness {
  bootstrap?: string[];
  close: () => Promise<void>;
}

async function openHyperswarmHarness(): Promise<HyperswarmHarness> {
  if (!SHOULD_RUN_PUBLIC_HYPERSWARM) {
    throw new Error("public_hyperswarm_required_for_public_seam_proof");
  }
  return {
    close: async () => {},
  };
}

function createDirectPeerHyperswarmFactory(bootstrap?: string[]) {
  const swarms: HyperswarmReplicationSwarm[] = [];

  return async (seed?: Buffer, topics?: Map<string, unknown>) => {
    const swarm = await createHyperswarmReplicationSwarm({
      seed,
      bootstrap,
    });
    swarms.push(swarm);
    await swarm.listen();

    return {
      ...swarm,
      async flush(timeoutMs?: number) {
        const deadlineMs = timeoutMs ?? 60_000;
        const startedAt = Date.now();

        while (Date.now() - startedAt < deadlineMs) {
          if (swarm.connectionCount() > 0) return;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        throw new Error(`timed out waiting for direct hyperswarm peer after ${deadlineMs}ms`);
      },
      join(topic: Buffer) {
        const key = Buffer.from(topic).toString("hex");
        const peers = getTopicPeers(topics, key);

        if (!peers.some((peer) => peer.publicKey.equals(swarm.publicKey))) {
          peers.push(swarm);
        }

        for (const peer of peers) {
          if (peer.publicKey.equals(swarm.publicKey)) continue;
          swarm.joinPeer(peer.publicKey);
        }

        return {
          flushed: async () => {},
        };
      },
    };
  };
}

function getTopicPeers(
  topics: Map<string, unknown> | undefined,
  key: string,
): HyperswarmReplicationSwarm[] {
  if (!topics) return [];
  const existing = topics.get(key);
  if (Array.isArray(existing)) return existing as HyperswarmReplicationSwarm[];
  const peers: HyperswarmReplicationSwarm[] = [];
  topics.set(key, peers);
  return peers;
}

function seamHistoryMaterial(): any {
  return {
    artifactKind: "edge_layer_seam_history_material",
    schemaVersion: "edge-layer-seam-history-material.v0",
    historyId: "layer-owned-edge-seam-status:hyperswarm-reader-test",
    historyHash: `sha256:${"8".repeat(64)}`,
    sourceRepos: ["mesh-ecology-edge", "mesh-ecology-layer"],
    pairs: [
      {
        request: {
          sourceRepo: "mesh-ecology-edge",
          requestId: "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
          requestHash: `sha256:${"a".repeat(64)}`,
          durableRef: "corestore:edge-layer-seam-history:request:0",
          writerRef: "autobase-writer:edge-hyperswarm-reader",
        },
        receipt: {
          sourceRepo: "mesh-ecology-layer",
          receiptId: "layer-report-only-edge-seam-receipt:hyperswarm-reader:linked",
          receiptHash: `sha256:${"b".repeat(64)}`,
          sourceRequestId: "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
          sourceRequestHash: `sha256:${"a".repeat(64)}`,
          durableRef: "corestore:edge-layer-seam-history:receipt:1",
          writerRef: "autobase-writer:layer-hyperswarm-reader",
        },
        linkage: {
          linked: true,
          source: "receipt_source_request_refs",
        },
      },
      {
        request: {
          sourceRepo: "mesh-ecology-edge",
          requestId: "edge-layer-report-only-seam-request:hyperswarm-reader:unlinked",
          requestHash: `sha256:${"c".repeat(64)}`,
          durableRef: "corestore:edge-layer-seam-history:request:2",
          writerRef: "autobase-writer:edge-hyperswarm-reader",
        },
        receipt: {
          sourceRepo: "mesh-ecology-layer",
          receiptId: "layer-report-only-edge-seam-receipt:hyperswarm-reader:unlinked",
          receiptHash: `sha256:${"d".repeat(64)}`,
          sourceRequestId: "edge-layer-report-only-seam-request:hyperswarm-reader:different",
          sourceRequestHash: `sha256:${"e".repeat(64)}`,
          durableRef: "corestore:edge-layer-seam-history:receipt:3",
          writerRef: "autobase-writer:layer-hyperswarm-reader",
        },
        linkage: {
          linked: false,
          source: "receipt_source_request_refs",
        },
      },
    ],
  };
}

test("Hyperswarm seam-history input lane readiness is explicit without claiming proof", () => {
  const ready = buildEdgeLayerSeamHistoryHyperswarmInputLaneReadiness({
    durableCorestoreReaderAvailable: true,
    hyperswarmFactoryAvailable: true,
    namespaceParts: ["hyperswarm-seam-history-reader", "readiness"],
    seamHistoryInputAvailable: true,
  });

  assert.equal(ready.status, "edge-layer-seam-history-hyperswarm-input-lane-ready-to-run");
  assert.equal(ready.gates.durableCorestoreReaderAvailable, true);
  assert.equal(ready.gates.hyperswarmFactoryAvailable, true);
  assert.equal(ready.gates.namespaceConfigured, true);
  assert.equal(ready.gates.seamHistoryInputAvailable, true);
  assert.equal(ready.proofPosture.readinessOnly, true);
  assert.equal(ready.proofPosture.dhtHyperswarmProofClaimedNow, false);
  assert.equal(ready.proofPosture.canReachHigherProofRungOnlyAfterRun, true);
  assert.equal(ready.boundary.opensSwarm, false);
  assert.equal(ready.boundary.opensCorestore, false);
  assert.equal(ready.boundary.readsDurableHistory, false);
  assert.equal(ready.boundary.writesRecords, false);
  assert.deepEqual(ready.issues, []);

  const incomplete = buildEdgeLayerSeamHistoryHyperswarmInputLaneReadiness({
    durableCorestoreReaderAvailable: true,
    hyperswarmFactoryAvailable: false,
    namespaceParts: [],
    seamHistoryInputAvailable: false,
  });

  assert.equal(incomplete.status, "edge-layer-seam-history-hyperswarm-input-lane-incomplete");
  assert.equal(incomplete.proofPosture.dhtHyperswarmProofClaimedNow, false);
  assert.equal(incomplete.proofPosture.canReachHigherProofRungOnlyAfterRun, false);
  assert.ok(incomplete.issues.includes("hyperswarm-factory-missing"));
  assert.ok(incomplete.issues.includes("namespace-parts-missing"));
  assert.ok(incomplete.issues.includes("seam-history-input-missing"));
});

test("durable seam-history record source-ref completeness reports complete and incomplete material", () => {
  const complete = buildEdgeLayerSeamHistoryDurableRecordSourceRefCompleteness(seamHistoryMaterial());

  assert.equal(complete.reportKind, "edge_layer_seam_history_durable_record_source_ref_completeness");
  assert.equal(complete.complete, true);
  assert.equal(complete.sourceRefsPresent, true);
  assert.deepEqual(complete.missingRefKinds, []);
  assert.equal(complete.requiredRefs.historyId, true);
  assert.equal(complete.requiredRefs.historyHash, true);
  assert.equal(complete.requiredRefs.requestIds, true);
  assert.equal(complete.requiredRefs.requestHashes, true);
  assert.equal(complete.requiredRefs.requestDurableRefs, true);
  assert.equal(complete.requiredRefs.requestWriterRefs, true);
  assert.equal(complete.requiredRefs.receiptIds, true);
  assert.equal(complete.requiredRefs.receiptHashes, true);
  assert.equal(complete.requiredRefs.receiptDurableRefs, true);
  assert.equal(complete.requiredRefs.receiptWriterRefs, true);
  assert.equal(complete.boundary.reportOnly, true);
  assert.equal(complete.boundary.durableRecordMetadataOnly, true);
  assert.equal(complete.boundary.acceptsCanonicalHistory, false);
  assert.equal(complete.boundary.admitsLayerEvidence, false);
  assert.equal(complete.boundary.interpretsRbc, false);
  assert.equal(complete.boundary.grantsAuthority, false);

  const incompleteMaterial = seamHistoryMaterial();
  delete incompleteMaterial.historyHash;
  delete incompleteMaterial.pairs[1].receipt.receiptHash;
  delete incompleteMaterial.pairs[1].receipt.durableRef;
  delete incompleteMaterial.pairs[1].receipt.writerRef;
  const incomplete = buildEdgeLayerSeamHistoryDurableRecordSourceRefCompleteness(incompleteMaterial);

  assert.equal(incomplete.complete, false);
  assert.equal(incomplete.sourceRefsPresent, true);
  assert.equal(incomplete.requiredRefs.historyHash, false);
  assert.equal(incomplete.requiredRefs.receiptHashes, false);
  assert.equal(incomplete.requiredRefs.receiptDurableRefs, false);
  assert.equal(incomplete.requiredRefs.receiptWriterRefs, false);
  assert.ok(incomplete.missingRefKinds.includes("historyHash"));
  assert.ok(incomplete.missingRefKinds.includes("receiptHashes"));
  assert.ok(incomplete.missingRefKinds.includes("receiptDurableRefs"));
  assert.ok(incomplete.missingRefKinds.includes("receiptWriterRefs"));
  assert.equal(incomplete.boundary.acceptsCanonicalHistory, false);
  assert.equal(incomplete.boundary.admitsLayerEvidence, false);
  assert.equal(incomplete.boundary.interpretsRbc, false);
  assert.equal(incomplete.boundary.grantsAuthority, false);
});

test("real Hyperswarm proof run instructions artifact stays instructions-only", () => {
  const instructions = buildEdgeLayerSeamHistoryRealHyperswarmProofRunInstructions({
    emittedAt: "2026-05-31T12:21:00.000Z",
    namespaceParts: ["hyperswarm-seam-history-reader", "real-proof"],
  });

  assert.equal(
    instructions.artifactKind,
    "edge-layer-seam-history-real-hyperswarm-proof-run-instructions",
  );
  assert.equal(
    instructions.schema,
    "causal-substrate/edge-layer-seam-history-real-hyperswarm-proof-run-instructions/v1",
  );
  assert.equal(instructions.lane, "real_hyperswarm_edge_layer_seam_history_observation");
  assert.equal(instructions.requiredEnvironment.realHyperswarmEnv, "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1");
  assert.match(
    instructions.commands.localTestnetProofRun,
    /CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 npx tsx --test test\/edge-layer-seam-history-hyperswarm-reader\.test\.ts/,
  );
  assert.match(
    instructions.commands.publicOrConfiguredBootstrapProofRun,
    /CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 npx tsx --test test\/edge-layer-seam-history-hyperswarm-reader\.test\.ts/,
  );
  assert.match(
    instructions.commands.checkedCliOutputProofRun,
    /run-edge-layer-seam-history-hyperswarm-reader\.ts --input seam-history\.json --report-output hyperswarm-reader-report\.json --readback-output hyperswarm-reader-report-readback\.json/,
  );
  assert.match(
    instructions.commands.savedReportImportReadback,
    /readback-edge-layer-seam-history-hyperswarm-report\.ts --input-report hyperswarm-reader-report\.json --readback-output hyperswarm-reader-report-import-readback\.json/,
  );
  assert.match(
    instructions.commands.deriveHandoffBundleFromSavedReport,
    /derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report\.ts --input-report hyperswarm-reader-report\.json --handoff-bundle-output edge-projection-handoff-bundle\.json/,
  );
  assert.match(
    instructions.commands.savedHandoffBundleReadback,
    /readback-edge-layer-seam-history-handoff-bundle\.ts --input-bundle edge-projection-handoff-bundle\.json --readback-output edge-projection-handoff-bundle-readback\.json/,
  );
  assert.equal(instructions.proofGate.instructionsOnly, true);
  assert.equal(instructions.proofGate.dhtHyperswarmProofClaimedNow, false);
  assert.equal(instructions.proofGate.proofOnlyIfCommandRunsAndPasses, true);
  assert.equal(instructions.proofGate.importReadbackDoesNotVerifyLiveSwarmRun, true);
  assert.equal(instructions.proofGate.handoffBundleReadbackDoesNotVerifyLiveSwarmRun, true);
  assert.equal(instructions.proofGate.lowerProofRungsRemainLowerUntilLiveRun, true);
  assert.equal(instructions.proofGate.requiresDurableCorestoreRead, true);
  assert.equal(instructions.proofGate.requiresHyperswarmTransport, true);
  assert.equal(instructions.proofGate.requiresReplicatedRecordReadback, true);
  assert.equal(
    instructions.proofGate.expectedStrongestProofRungAfterPassingRun,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(instructions.expectedOutputRefs.observationResult, "observationResult");
  assert.equal(instructions.expectedOutputRefs.readerProof, "readerProof");
  assert.equal(instructions.expectedOutputRefs.reportOutputArtifact, "report-output");
  assert.equal(instructions.expectedOutputRefs.readbackOutputArtifact, "readback-output");
  assert.equal(
    instructions.expectedOutputRefs.savedReportImportReadbackOutputArtifact,
    "saved-report-import-readback-output",
  );
  assert.equal(
    instructions.expectedOutputRefs.derivedHandoffBundleOutputArtifact,
    "derived-handoff-bundle-output",
  );
  assert.equal(
    instructions.expectedOutputRefs.handoffBundleReadbackOutputArtifact,
    "handoff-bundle-readback-output",
  );
  assert.deepEqual(instructions.namespaceParts, ["hyperswarm-seam-history-reader", "real-proof"]);
  assert.equal(instructions.boundary.opensSwarmNow, false);
  assert.equal(instructions.boundary.opensCorestoreNow, false);
  assert.equal(instructions.boundary.readsDurableHistoryNow, false);
  assert.equal(instructions.boundary.writesRecordsNow, false);
  assert.equal(instructions.boundary.publishesToMesh, false);
  assert.equal(instructions.boundary.grantsAuthority, false);
  assert.equal(instructions.boundary.admitsLayerEvidence, false);
  assert.equal(instructions.boundary.interpretsRbc, false);
});

test("public device-to-device run instructions stay instructions-only", () => {
  const instructions = buildEdgeLayerSeamHistoryPublicDeviceRunInstructions({
    emittedAt: "2026-06-01T09:00:00.000Z",
    namespaceParts: ["public-device", "seam-history"],
  });

  assert.equal(instructions.artifactKind, "edge-layer-seam-history-public-device-run-instructions");
  assert.equal(
    instructions.schema,
    "causal-substrate/edge-layer-seam-history-public-device-run-instructions/v1",
  );
  assert.equal(instructions.lane, "public_hyperswarm_device_to_device_seam_history_observation");
  assert.equal(instructions.requiredEnvironment.realHyperswarmEnv, "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1");
  assert.equal(instructions.requiredEnvironment.publicHyperswarmEnv, "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1");
  assert.match(instructions.commands.sourceDevicePublisher, /run-edge-layer-seam-history-public-source-device\.ts/);
  assert.match(instructions.commands.replicaDeviceReader, /run-edge-layer-seam-history-public-replica-device\.ts/);
  assert.equal(instructions.proofGate.instructionsOnly, true);
  assert.equal(instructions.proofGate.publicSwarmProofClaimedNow, false);
  assert.equal(instructions.proofGate.sourceManifestAloneIsNotObservationProof, true);
  assert.equal(instructions.proofGate.proofOnlyAfterReplicaReadsPublicSwarmDurableMaterial, true);
  assert.equal(instructions.proofGate.requiresTwoDeviceOrDeviceShapedPublicRun, true);
  assert.equal(instructions.proofGate.requiresDurableCorestoreRead, true);
  assert.equal(instructions.proofGate.requiresPublicHyperswarmTransport, true);
  assert.equal(instructions.proofGate.requiresReplicatedRecordReadback, true);
  assert.equal(
    instructions.proofGate.expectedStrongestProofRungAfterPassingReplicaRun,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.deepEqual(instructions.namespaceParts, ["public-device", "seam-history"]);
  assert.equal(instructions.boundary.opensSwarmNow, false);
  assert.equal(instructions.boundary.opensCorestoreNow, false);
  assert.equal(instructions.boundary.readsDurableHistoryNow, false);
  assert.equal(instructions.boundary.writesRecordsNow, false);
  assert.equal(instructions.boundary.publishesToMesh, false);
  assert.equal(instructions.boundary.grantsAuthority, false);
  assert.equal(instructions.boundary.admitsLayerEvidence, false);
  assert.equal(instructions.boundary.interpretsRbc, false);
});

test("public source manifest preserves durable refs without claiming observation proof", () => {
  const seamHistory = seamHistoryMaterial();
  const sourceRefCompleteness = buildEdgeLayerSeamHistoryDurableRecordSourceRefCompleteness(seamHistory);
  const sourceRefs = [
    "layer-owned-edge-seam-status:hyperswarm-reader-test",
    `sha256:${"8".repeat(64)}`,
    "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
    `sha256:${"a".repeat(64)}`,
    "layer-report-only-edge-seam-receipt:hyperswarm-reader:linked",
    `sha256:${"b".repeat(64)}`,
  ];
  const manifest = buildEdgeLayerSeamHistoryPublicDeviceSourceManifest({
    emittedAt: "2026-06-01T09:02:00.000Z",
    namespaceParts: ["public-device", "manifest"],
    sourceCoreKeyHex: "11".repeat(32),
    topicHex: "22".repeat(32),
    record: {
      artifactKind: "edge_layer_seam_history_durable_record",
      schema: "causal-substrate/edge-layer-seam-history-durable-record/v1",
      schemaVersion: 1,
      recordId: "edge-layer-seam-history-durable-record:public-source-manifest",
      recordedAt: "2026-06-01T09:01:00.000Z",
      seamHistory,
      seamHistoryHash: `sha256:${"9".repeat(64)}`,
      seamHistoryHashAlgorithm: "sha256-stable-json",
      sourceRefs,
      sourceRefCompleteness,
      durableHistoryMaterial: true,
    },
  });

  assert.equal(manifest.artifactKind, "edge-layer-seam-history-public-device-source-manifest");
  assert.equal(
    manifest.schema,
    "causal-substrate/edge-layer-seam-history-public-device-source-manifest/v1",
  );
  assert.equal(manifest.source.sourceCoreKeyHex, "11".repeat(32));
  assert.equal(manifest.source.topicHex, "22".repeat(32));
  assert.equal(manifest.source.sourceRecordId, "edge-layer-seam-history-durable-record:public-source-manifest");
  assert.equal(manifest.source.seamHistoryHash, `sha256:${"9".repeat(64)}`);
  assert.deepEqual(manifest.source.sourceRefs, sourceRefs);
  assert.equal(manifest.source.sourceRefCompleteness.complete, true);
  assert.equal(manifest.proofPosture.sourceManifestOnly, true);
  assert.equal(manifest.proofPosture.publicSwarmObservationProofClaimedNow, false);
  assert.equal(manifest.proofPosture.replicaDeviceMustReadDurableMaterial, true);
  assert.equal(manifest.proofPosture.replicaDeviceMustEmitObservation, true);
  assert.equal(manifest.boundary.replicaReadProvenByThisArtifact, false);
  assert.equal(manifest.boundary.acceptsCanonicalHistory, false);
  assert.equal(manifest.boundary.admitsLayerEvidence, false);
  assert.equal(manifest.boundary.interpretsRbc, false);
  assert.equal(manifest.boundary.grantsAuthority, false);
  assert.equal(manifest.boundary.publishesToMesh, false);
});

test("real Hyperswarm reader CLI emits instructions only until explicitly enabled", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-cli-"));
  const instructionsPath = path.join(tempRoot, "real-hyperswarm-instructions.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/run-edge-layer-seam-history-hyperswarm-reader.ts",
      "--instructions-output",
      instructionsPath,
      "--namespace",
      "hyperswarm-seam-history-reader,cli-surface",
      "--emitted-at",
      "2026-05-31T13:05:00.000Z",
    ], {
      cwd: path.resolve("."),
      env: {
        ...process.env,
        CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "0",
      },
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const instructions = JSON.parse(await readFile(instructionsPath, "utf8"));
    assert.equal(
      instructions.schema,
      "causal-substrate/edge-layer-seam-history-real-hyperswarm-proof-run-instructions/v1",
    );
    assert.equal(instructions.proofGate.instructionsOnly, true);
    assert.equal(instructions.proofGate.dhtHyperswarmProofClaimedNow, false);
    assert.equal(instructions.proofGate.proofOnlyIfCommandRunsAndPasses, true);
    assert.equal(instructions.proofGate.importReadbackDoesNotVerifyLiveSwarmRun, true);
    assert.equal(instructions.proofGate.handoffBundleReadbackDoesNotVerifyLiveSwarmRun, true);
    assert.equal(instructions.proofGate.lowerProofRungsRemainLowerUntilLiveRun, true);
    assert.match(
      instructions.commands.savedReportImportReadback,
      /readback-edge-layer-seam-history-hyperswarm-report\.ts/,
    );
    assert.match(
      instructions.commands.deriveHandoffBundleFromSavedReport,
      /derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report\.ts/,
    );
    assert.match(
      instructions.commands.savedHandoffBundleReadback,
      /readback-edge-layer-seam-history-handoff-bundle\.ts/,
    );
    assert.deepEqual(instructions.namespaceParts, ["hyperswarm-seam-history-reader", "cli-surface"]);
    assert.equal(instructions.boundary.opensSwarmNow, false);
    assert.equal(instructions.boundary.opensCorestoreNow, false);
    assert.equal(instructions.boundary.readsDurableHistoryNow, false);
    assert.equal(instructions.boundary.publishesToMesh, false);
    assert.equal(instructions.boundary.grantsAuthority, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("public device CLIs emit instructions only until explicitly enabled", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-public-device-cli-"));
  const sourceInstructionsPath = path.join(tempRoot, "source-instructions.json");
  const replicaInstructionsPath = path.join(tempRoot, "replica-instructions.json");
  try {
    const source = await execFileAsync("npx", [
      "tsx",
      "scripts/run-edge-layer-seam-history-public-source-device.ts",
      "--instructions-output",
      sourceInstructionsPath,
      "--namespace",
      "public-device,cli-surface",
      "--emitted-at",
      "2026-06-01T09:05:00.000Z",
    ], {
      cwd: path.resolve("."),
      env: {
        ...process.env,
        CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "0",
      },
    });
    const replica = await execFileAsync("npx", [
      "tsx",
      "scripts/run-edge-layer-seam-history-public-replica-device.ts",
      "--instructions-output",
      replicaInstructionsPath,
      "--namespace",
      "public-device,cli-surface",
      "--emitted-at",
      "2026-06-01T09:05:00.000Z",
    ], {
      cwd: path.resolve("."),
      env: {
        ...process.env,
        CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "0",
      },
    });

    assert.equal(source.stdout, "");
    assert.equal(source.stderr, "");
    assert.equal(replica.stdout, "");
    assert.equal(replica.stderr, "");
    const sourceInstructions = JSON.parse(await readFile(sourceInstructionsPath, "utf8"));
    const replicaInstructions = JSON.parse(await readFile(replicaInstructionsPath, "utf8"));
    assert.equal(
      sourceInstructions.schema,
      "causal-substrate/edge-layer-seam-history-public-device-run-instructions/v1",
    );
    assert.equal(sourceInstructions.proofGate.instructionsOnly, true);
    assert.equal(sourceInstructions.proofGate.publicSwarmProofClaimedNow, false);
    assert.equal(sourceInstructions.proofGate.sourceManifestAloneIsNotObservationProof, true);
    assert.deepEqual(sourceInstructions.namespaceParts, ["public-device", "cli-surface"]);
    assert.equal(replicaInstructions.schema, sourceInstructions.schema);
    assert.equal(replicaInstructions.proofGate.instructionsOnly, true);
    assert.equal(replicaInstructions.boundary.opensSwarmNow, false);
    assert.equal(replicaInstructions.boundary.opensCorestoreNow, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("public device CLIs require public swarm and reject configured bootstrap for proof", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-public-device-gate-"));
  const inputPath = path.join(tempRoot, "seam-history.json");
  const manifestPath = path.join(tempRoot, "public-source-manifest.json");
  const reportPath = path.join(tempRoot, "public-replica-report.json");
  try {
    await writeFile(inputPath, JSON.stringify(seamHistoryMaterial(), null, 2), "utf8");
    await writeFile(manifestPath, JSON.stringify({
      artifactKind: "edge-layer-seam-history-public-device-source-manifest",
      schema: "causal-substrate/edge-layer-seam-history-public-device-source-manifest/v1",
      schemaVersion: 1,
      emittedAt: "2026-06-01T09:10:00.000Z",
      lane: "public_hyperswarm_device_to_device_seam_history_observation",
      namespaceParts: ["public-device", "gate"],
      source: {
        sourceCoreKeyHex: "11".repeat(32),
        topicHex: "22".repeat(32),
        sourceRecordId: "edge-layer-seam-history-durable-record:gate",
        seamHistoryHash: `sha256:${"9".repeat(64)}`,
        sourceRefs: ["edge-layer-seam-history-durable-record:gate"],
        sourceRefCompleteness: buildEdgeLayerSeamHistoryDurableRecordSourceRefCompleteness(seamHistoryMaterial()),
      },
      proofPosture: {
        sourceManifestOnly: true,
        publicSwarmObservationProofClaimedNow: false,
        replicaDeviceMustReadDurableMaterial: true,
        replicaDeviceMustEmitObservation: true,
        lowerProofRungsRemainLowerUntilReplicaReport: true,
      },
      boundary: {
        opensSwarmBySourceCommand: true,
        opensCorestoreBySourceCommand: true,
        writesDurableHistoryBySourceCommand: true,
        replicaReadProvenByThisArtifact: false,
        acceptsCanonicalHistory: false,
        admitsLayerEvidence: false,
        interpretsRbc: false,
        grantsAuthority: false,
        publishesToMesh: false,
      },
    }, null, 2), "utf8");

    await assert.rejects(
      execFileAsync("npx", [
        "tsx",
        "scripts/run-edge-layer-seam-history-public-source-device.ts",
        "--input",
        inputPath,
        "--manifest-output",
        manifestPath,
        "--storage-dir",
        path.join(tempRoot, "source-no-public"),
        "--keep-alive-ms",
        "0",
      ], {
        cwd: path.resolve("."),
        env: {
          ...process.env,
          CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "1",
          CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC: "0",
        },
      }),
      /public_hyperswarm_required_for_public_device_seam_proof/,
    );

    await assert.rejects(
      execFileAsync("npx", [
        "tsx",
        "scripts/run-edge-layer-seam-history-public-replica-device.ts",
        "--manifest",
        manifestPath,
        "--report-output",
        reportPath,
        "--storage-dir",
        path.join(tempRoot, "replica-bootstrap"),
      ], {
        cwd: path.resolve("."),
        env: {
          ...process.env,
          CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "1",
          CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC: "1",
          CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP: "127.0.0.1:12345",
        },
      }),
      /configured_bootstrap_deferred_for_public_hyperswarm_proof_lane/,
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("real Hyperswarm reader CLI requires public swarm and rejects configured bootstrap for proof", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-public-gate-"));
  const inputPath = path.join(tempRoot, "seam-history.json");
  const reportPath = path.join(tempRoot, "hyperswarm-reader-report.json");
  try {
    await writeFile(inputPath, JSON.stringify(seamHistoryMaterial(), null, 2), "utf8");

    await assert.rejects(
      execFileAsync("npx", [
        "tsx",
        "scripts/run-edge-layer-seam-history-hyperswarm-reader.ts",
        "--input",
        inputPath,
        "--report-output",
        reportPath,
        "--storage-dir-a",
        path.join(tempRoot, "source-no-public"),
        "--storage-dir-b",
        path.join(tempRoot, "replica-no-public"),
      ], {
        cwd: path.resolve("."),
        env: {
          ...process.env,
          CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "1",
          CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC: "0",
        },
      }),
      /public_hyperswarm_required_for_public_seam_proof/,
    );

    await assert.rejects(
      execFileAsync("npx", [
        "tsx",
        "scripts/run-edge-layer-seam-history-hyperswarm-reader.ts",
        "--input",
        inputPath,
        "--report-output",
        reportPath,
        "--storage-dir-a",
        path.join(tempRoot, "source-bootstrap"),
        "--storage-dir-b",
        path.join(tempRoot, "replica-bootstrap"),
      ], {
        cwd: path.resolve("."),
        env: {
          ...process.env,
          CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "1",
          CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC: "1",
          CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP: "127.0.0.1:12345",
        },
      }),
      /configured_bootstrap_deferred_for_public_hyperswarm_proof_lane/,
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("Hyperswarm reader report readback preserves durable refs without verifying a live swarm run", () => {
  const seamHistory = seamHistoryMaterial();
  const seamHistoryHash = `sha256:${"7".repeat(64)}`;
  const sourceRefs = [
    "layer-owned-edge-seam-status:hyperswarm-reader-test",
    `sha256:${"8".repeat(64)}`,
    "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
    `sha256:${"a".repeat(64)}`,
    "layer-report-only-edge-seam-receipt:hyperswarm-reader:linked",
    `sha256:${"b".repeat(64)}`,
  ];
  const record = {
    artifactKind: "edge_layer_seam_history_durable_record",
    schema: "causal-substrate/edge-layer-seam-history-durable-record/v1",
    schemaVersion: 1,
    recordId: "edge-layer-seam-history-durable-record:source-readback",
    recordedAt: "2026-05-31T13:10:00.000Z",
    seamHistory,
    seamHistoryHash,
    seamHistoryHashAlgorithm: "sha256-stable-json",
    sourceRefs,
    durableHistoryMaterial: true,
  };
  const replicatedRecord = {
    ...record,
    recordId: "edge-layer-seam-history-durable-record:replica-readback",
  };
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory,
    emittedAt: "2026-05-31T13:10:01.000Z",
    sourcePath: replicatedRecord.recordId,
    inputReadByCausalSubstrate: true,
    durableCorestoreHistoryRead: true,
    dhtOrHyperswarmInputObservedByCausalSubstrate: true,
    replicatedViaHyperswarmTransport: true,
    publicHyperswarmInputObservedByCausalSubstrate: true,
  });

  const readback = buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback({
    report: {
      namespaceParts: ["hyperswarm-seam-history-reader", "report-readback"],
      record,
      replicatedRecord,
      observationResult,
      readerProof: {
        inputReadByCausalSubstrate: true,
        durableCorestoreHistoryRead: true,
        dhtOrHyperswarmInputObservedByCausalSubstrate: true,
        replicatedViaHyperswarmTransport: true,
        publicHyperswarmInputObservedByCausalSubstrate: true,
        sourceCoreKeyHex: "11".repeat(32),
        replicaCoreKeyHex: "11".repeat(32),
        topicHex: "22".repeat(32),
        sourceRecordCount: 1,
        replicaRecordCount: 1,
      },
    },
    emittedAt: "2026-05-31T13:10:02.000Z",
  });

  assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(readback);
  assert.equal(readback.reviewStatus, "edge-layer-seam-history-hyperswarm-reader-report-readback-valid");
  assert.equal(readback.validation.reportConsumed, true);
  assert.equal(readback.validation.seamHistoryHashPreserved, true);
  assert.equal(readback.validation.durableSourceRefsPreserved, true);
  assert.equal(readback.validation.readerProofPreserved, true);
  assert.equal(readback.readback.seamHistoryHashPreserved, true);
  assert.equal(readback.readback.observationProofLabelsPreserved, true);
  assert.equal(readback.source.sourceRecordId, record.recordId);
  assert.equal(readback.source.replicatedRecordId, replicatedRecord.recordId);
  assert.equal(readback.source.sourceObservationArtifactId, observationResult.artifactId);
  assert.equal(readback.source.sourceObservationNormalizedProofLabel, "public_hyperswarm_durable_seam_history_material");
  assert.equal(readback.durableRecordRefs.seamHistoryHash, seamHistoryHash);
  assert.equal(readback.durableRecordRefs.replicatedSeamHistoryHash, seamHistoryHash);
  assert.deepEqual(readback.durableRecordRefs.sourceRefs, sourceRefs);
  assert.deepEqual(readback.durableRecordRefs.replicatedSourceRefs, sourceRefs);
  assert.equal(readback.readerProof.inputReadByCausalSubstrate, true);
  assert.equal(readback.readerProof.durableCorestoreHistoryRead, true);
  assert.equal(readback.readerProof.dhtOrHyperswarmInputObservedByCausalSubstrate, true);
  assert.equal(readback.readerProof.replicatedViaHyperswarmTransport, true);
  assert.equal(readback.readerProof.publicHyperswarmInputObservedByCausalSubstrate, true);
  assert.equal(readback.boundary.reportReadbackOnly, true);
  assert.equal(readback.boundary.verifiesLiveSwarmRun, false);
  assert.equal(readback.boundary.opensSwarm, false);
  assert.equal(readback.boundary.opensCorestore, false);
  assert.equal(readback.boundary.acceptsCanonicalHistory, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
});

test("Hyperswarm reader report import CLI emits readback without running a live swarm", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-report-import-"));
  const reportPath = path.join(tempRoot, "hyperswarm-reader-report.json");
  const readbackPath = path.join(tempRoot, "hyperswarm-reader-report-readback.json");
  try {
    const seamHistory = seamHistoryMaterial();
    const seamHistoryHash = `sha256:${"7".repeat(64)}`;
    const sourceRefs = [
      "layer-owned-edge-seam-status:hyperswarm-reader-test",
      `sha256:${"8".repeat(64)}`,
      "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
      `sha256:${"a".repeat(64)}`,
      "layer-report-only-edge-seam-receipt:hyperswarm-reader:linked",
      `sha256:${"b".repeat(64)}`,
    ];
    const record: any = {
      artifactKind: "edge_layer_seam_history_durable_record",
      schema: "causal-substrate/edge-layer-seam-history-durable-record/v1",
      schemaVersion: 1,
      recordId: "edge-layer-seam-history-durable-record:source-import-readback",
      recordedAt: "2026-05-31T13:12:00.000Z",
      seamHistory,
      seamHistoryHash,
      seamHistoryHashAlgorithm: "sha256-stable-json",
      sourceRefs,
      durableHistoryMaterial: true,
    };
    const replicatedRecord = {
      ...record,
      recordId: "edge-layer-seam-history-durable-record:replica-import-readback",
    };
    const observationResult = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory,
      emittedAt: "2026-05-31T13:12:01.000Z",
      sourcePath: replicatedRecord.recordId,
      inputReadByCausalSubstrate: true,
      durableCorestoreHistoryRead: true,
      dhtOrHyperswarmInputObservedByCausalSubstrate: true,
      replicatedViaHyperswarmTransport: true,
      publicHyperswarmInputObservedByCausalSubstrate: true,
    });
    const report = {
      namespaceParts: ["hyperswarm-seam-history-reader", "report-import-readback"],
      record,
      replicatedRecord,
      observationResult,
      readerProof: {
        inputReadByCausalSubstrate: true,
        durableCorestoreHistoryRead: true,
        dhtOrHyperswarmInputObservedByCausalSubstrate: true,
        replicatedViaHyperswarmTransport: true,
        publicHyperswarmInputObservedByCausalSubstrate: true,
        sourceCoreKeyHex: "11".repeat(32),
        replicaCoreKeyHex: "11".repeat(32),
        topicHex: "22".repeat(32),
        sourceRecordCount: 1,
        replicaRecordCount: 1,
      },
    };
    await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/readback-edge-layer-seam-history-hyperswarm-report.ts",
      "--input-report",
      reportPath,
      "--readback-output",
      readbackPath,
      "--emitted-at",
      "2026-05-31T13:12:02.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const readback = JSON.parse(await readFile(readbackPath, "utf8"));
    assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-hyperswarm-reader-report-readback-valid");
    assert.equal(readback.validation.reportConsumed, true);
    assert.equal(readback.validation.seamHistoryHashPreserved, true);
    assert.equal(readback.validation.durableSourceRefsPreserved, true);
    assert.equal(readback.validation.readerProofPreserved, true);
    assert.equal(readback.source.sourceRecordId, record.recordId);
    assert.equal(readback.source.replicatedRecordId, replicatedRecord.recordId);
    assert.equal(readback.source.sourceObservationArtifactId, observationResult.artifactId);
    assert.deepEqual(readback.source.namespaceParts, [
      "hyperswarm-seam-history-reader",
      "report-import-readback",
    ]);
    assert.equal(readback.durableRecordRefs.seamHistoryHash, seamHistoryHash);
    assert.equal(readback.durableRecordRefs.replicatedSeamHistoryHash, seamHistoryHash);
    assert.deepEqual(readback.durableRecordRefs.sourceRefs, sourceRefs);
    assert.deepEqual(readback.durableRecordRefs.replicatedSourceRefs, sourceRefs);
    assert.equal(readback.readerProof.inputReadByCausalSubstrate, true);
    assert.equal(readback.readerProof.durableCorestoreHistoryRead, true);
    assert.equal(readback.readerProof.dhtOrHyperswarmInputObservedByCausalSubstrate, true);
    assert.equal(readback.readerProof.replicatedViaHyperswarmTransport, true);
    assert.equal(readback.readerProof.publicHyperswarmInputObservedByCausalSubstrate, true);
    assert.equal(readback.boundary.reportReadbackOnly, true);
    assert.equal(readback.boundary.verifiesLiveSwarmRun, false);
    assert.equal(readback.boundary.opensSwarm, false);
    assert.equal(readback.boundary.opensCorestore, false);
    assert.equal(readback.boundary.writesRecords, false);
    assert.equal(readback.boundary.acceptsCanonicalHistory, false);
    assert.equal(readback.boundary.admitsLayerEvidence, false);
    assert.equal(readback.boundary.interpretsRbc, false);
    assert.equal(readback.boundary.grantsAuthority, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("saved Hyperswarm report can derive an Edge handoff bundle after readback validates", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-report-derive-handoff-"));
  const reportPath = path.join(tempRoot, "hyperswarm-reader-report.json");
  const readbackPath = path.join(tempRoot, "hyperswarm-reader-report-readback.json");
  const handoffBundlePath = path.join(tempRoot, "edge-projection-handoff-bundle.json");
  try {
    const seamHistory = seamHistoryMaterial();
    const seamHistoryHash = `sha256:${"7".repeat(64)}`;
    const sourceRefs = [
      "layer-owned-edge-seam-status:hyperswarm-reader-test",
      `sha256:${"8".repeat(64)}`,
      "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
      `sha256:${"a".repeat(64)}`,
      "layer-report-only-edge-seam-receipt:hyperswarm-reader:linked",
      `sha256:${"b".repeat(64)}`,
    ];
    const record = {
      artifactKind: "edge_layer_seam_history_durable_record",
      schema: "causal-substrate/edge-layer-seam-history-durable-record/v1",
      schemaVersion: 1,
      recordId: "edge-layer-seam-history-durable-record:source-derive-handoff",
      recordedAt: "2026-06-01T10:20:00.000Z",
      seamHistory,
      seamHistoryHash,
      seamHistoryHashAlgorithm: "sha256-stable-json",
      sourceRefs,
      durableHistoryMaterial: true,
    };
    const replicatedRecord = {
      ...record,
      recordId: "edge-layer-seam-history-durable-record:replica-derive-handoff",
    };
    const observationResult = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory,
      emittedAt: "2026-06-01T10:20:01.000Z",
      sourcePath: replicatedRecord.recordId,
      inputReadByCausalSubstrate: true,
      durableCorestoreHistoryRead: true,
      dhtOrHyperswarmInputObservedByCausalSubstrate: true,
      replicatedViaHyperswarmTransport: true,
      publicHyperswarmInputObservedByCausalSubstrate: true,
    });
    const report = {
      namespaceParts: ["hyperswarm-seam-history-reader", "derive-handoff"],
      record,
      replicatedRecord,
      observationResult,
      readerProof: {
        inputReadByCausalSubstrate: true,
        durableCorestoreHistoryRead: true,
        dhtOrHyperswarmInputObservedByCausalSubstrate: true,
        replicatedViaHyperswarmTransport: true,
        publicHyperswarmInputObservedByCausalSubstrate: true,
        sourceCoreKeyHex: "11".repeat(32),
        replicaCoreKeyHex: "11".repeat(32),
        topicHex: "22".repeat(32),
        sourceRecordCount: 1,
        replicaRecordCount: 1,
      },
    };
    await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report.ts",
      "--input-report",
      reportPath,
      "--handoff-bundle-output",
      handoffBundlePath,
      "--report-readback-output",
      readbackPath,
      "--emitted-at",
      "2026-06-01T10:20:02.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const readback = JSON.parse(await readFile(readbackPath, "utf8"));
    const handoffBundle = JSON.parse(await readFile(handoffBundlePath, "utf8"));
    assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-hyperswarm-reader-report-readback-valid");
    assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle(handoffBundle);
    assert.equal(handoffBundle.reviewStatus, "edge-layer-seam-history-edge-projection-handoff-bundle-ready");
    assert.equal(handoffBundle.source.sourceObservationArtifactId, observationResult.artifactId);
    assert.equal(
      handoffBundle.source.sourceObservationProofRung,
      "public_hyperswarm_replicated_durable_seam_history_observation",
    );
    assert.equal(handoffBundle.source.sourceObservationNormalizedProofLabel, "public_hyperswarm_durable_seam_history_material");
    assert.deepEqual(handoffBundle.sourceReferences.requestHashes, [
      `sha256:${"a".repeat(64)}`,
      `sha256:${"c".repeat(64)}`,
    ]);
    assert.equal(handoffBundle.validation.noCanonicalHistoryClaim, true);
    assert.equal(handoffBundle.validation.noLayerAdmissionClaim, true);
    assert.equal(handoffBundle.validation.noRbcInterpretationClaim, true);
    assert.equal(handoffBundle.validation.noAuthorityClaim, true);
    assert.equal(handoffBundle.boundary.writesEdgeProjection, false);
    assert.equal(handoffBundle.boundary.admitsLayerEvidence, false);
    assert.equal(handoffBundle.boundary.interpretsRbc, false);
    assert.equal(handoffBundle.boundary.grantsAuthority, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("saved public device replica report can derive an Edge handoff bundle after readback validates", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-public-device-report-derive-handoff-"));
  const reportPath = path.join(tempRoot, "public-replica-reader-report.json");
  const readbackPath = path.join(tempRoot, "public-replica-reader-report-readback.json");
  const handoffBundlePath = path.join(tempRoot, "edge-projection-handoff-bundle.json");
  try {
    const seamHistory = seamHistoryMaterial();
    const sourceRefs = [
      "layer-owned-edge-seam-status:hyperswarm-reader-test",
      `sha256:${"8".repeat(64)}`,
      "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
      `sha256:${"a".repeat(64)}`,
      "layer-report-only-edge-seam-receipt:hyperswarm-reader:linked",
      `sha256:${"b".repeat(64)}`,
      "edge-layer-report-only-seam-request:hyperswarm-reader:unlinked",
      `sha256:${"c".repeat(64)}`,
      "layer-report-only-edge-seam-receipt:hyperswarm-reader:unlinked",
      `sha256:${"d".repeat(64)}`,
    ];
    const record: any = {
      artifactKind: "edge_layer_seam_history_durable_record",
      schema: "causal-substrate/edge-layer-seam-history-durable-record/v1",
      schemaVersion: 1,
      recordId: "edge-layer-seam-history-durable-record:public-device-source-derive-handoff",
      recordedAt: "2026-06-01T10:30:00.000Z",
      seamHistory,
      seamHistoryHash: `sha256:${"7".repeat(64)}`,
      seamHistoryHashAlgorithm: "sha256-stable-json",
      sourceRefs,
      sourceRefCompleteness: buildEdgeLayerSeamHistoryDurableRecordSourceRefCompleteness(seamHistory, sourceRefs),
      durableHistoryMaterial: true,
    };
    const sourceManifest = buildEdgeLayerSeamHistoryPublicDeviceSourceManifest({
      emittedAt: "2026-06-01T10:30:01.000Z",
      namespaceParts: ["public-device", "derive-handoff"],
      sourceCoreKeyHex: "11".repeat(32),
      topicHex: "22".repeat(32),
      record,
    });
    const replicatedRecord = {
      ...record,
      recordId: "edge-layer-seam-history-durable-record:public-device-replica-derive-handoff",
    };
    const observationResult = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory,
      emittedAt: "2026-06-01T10:30:02.000Z",
      sourcePath: replicatedRecord.recordId,
      inputReadByCausalSubstrate: true,
      durableCorestoreHistoryRead: true,
      dhtOrHyperswarmInputObservedByCausalSubstrate: true,
      replicatedViaHyperswarmTransport: true,
      publicHyperswarmInputObservedByCausalSubstrate: true,
    });
    const report = {
      artifactKind: "edge-layer-seam-history-public-device-replica-report",
      schema: "causal-substrate/edge-layer-seam-history-public-device-replica-report/v1",
      schemaVersion: 1,
      emittedAt: "2026-06-01T10:30:03.000Z",
      namespaceParts: ["public-device", "derive-handoff"],
      sourceManifest,
      replicatedRecord,
      observationResult,
      readerProof: {
        inputReadByCausalSubstrate: true,
        durableCorestoreHistoryRead: true,
        dhtOrHyperswarmInputObservedByCausalSubstrate: true,
        replicatedViaHyperswarmTransport: true,
        publicHyperswarmInputObservedByCausalSubstrate: true,
        sourceManifestConsumed: true,
        sourceCoreKeyHex: "11".repeat(32),
        replicaCoreKeyHex: "33".repeat(32),
        topicHex: "22".repeat(32),
        replicatedRecordCount: 1,
      },
      boundary: {
        observationOnly: true,
        acceptsCanonicalHistory: false,
        admitsLayerEvidence: false,
        interpretsRbc: false,
        grantsAuthority: false,
        publishesToMesh: false,
      },
    };
    const directReadback = buildEdgeLayerSeamHistoryPublicDeviceReplicaReportReadback({
      report,
      emittedAt: "2026-06-01T10:30:04.000Z",
    });
    assertEdgeLayerSeamHistoryPublicDeviceReplicaReportReadback(directReadback);
    assert.equal(
      directReadback.reviewStatus,
      "edge-layer-seam-history-public-device-replica-report-readback-valid",
    );
    await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report.ts",
      "--input-report",
      reportPath,
      "--handoff-bundle-output",
      handoffBundlePath,
      "--report-readback-output",
      readbackPath,
      "--emitted-at",
      "2026-06-01T10:30:05.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const readback = JSON.parse(await readFile(readbackPath, "utf8"));
    const handoffBundle = JSON.parse(await readFile(handoffBundlePath, "utf8"));
    assertEdgeLayerSeamHistoryPublicDeviceReplicaReportReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-public-device-replica-report-readback-valid");
    assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle(handoffBundle);
    assert.equal(handoffBundle.reviewStatus, "edge-layer-seam-history-edge-projection-handoff-bundle-ready");
    assert.equal(handoffBundle.source.sourceObservationArtifactId, observationResult.artifactId);
    assert.equal(
      handoffBundle.source.sourceObservationProofRung,
      "public_hyperswarm_replicated_durable_seam_history_observation",
    );
    assert.equal(handoffBundle.source.sourceObservationNormalizedProofLabel, "public_hyperswarm_durable_seam_history_material");
    assert.equal(handoffBundle.boundary.writesEdgeProjection, false);
    assert.equal(handoffBundle.boundary.admitsLayerEvidence, false);
    assert.equal(handoffBundle.boundary.interpretsRbc, false);
    assert.equal(handoffBundle.boundary.grantsAuthority, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("saved Hyperswarm report handoff derivation rejects invalid report readback", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-report-derive-handoff-invalid-"));
  const reportPath = path.join(tempRoot, "hyperswarm-reader-report.json");
  const readbackPath = path.join(tempRoot, "hyperswarm-reader-report-readback.json");
  const handoffBundlePath = path.join(tempRoot, "edge-projection-handoff-bundle.json");
  try {
    const seamHistory = seamHistoryMaterial();
    const record = {
      artifactKind: "edge_layer_seam_history_durable_record",
      schema: "causal-substrate/edge-layer-seam-history-durable-record/v1",
      schemaVersion: 1,
      recordId: "edge-layer-seam-history-durable-record:source-derive-handoff-invalid",
      recordedAt: "2026-06-01T10:21:00.000Z",
      seamHistory,
      seamHistoryHash: `sha256:${"7".repeat(64)}`,
      seamHistoryHashAlgorithm: "sha256-stable-json",
      sourceRefs: ["layer-owned-edge-seam-status:hyperswarm-reader-test"],
      durableHistoryMaterial: true,
    };
    const observationResult = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory,
      emittedAt: "2026-06-01T10:21:01.000Z",
      sourcePath: record.recordId,
      inputReadByCausalSubstrate: true,
    });
    await writeFile(reportPath, JSON.stringify({
      namespaceParts: ["hyperswarm-seam-history-reader", "derive-handoff-invalid"],
      record,
      replicatedRecord: {
        ...record,
        recordId: "edge-layer-seam-history-durable-record:replica-derive-handoff-invalid",
        seamHistoryHash: `sha256:${"6".repeat(64)}`,
      },
      observationResult,
      readerProof: {
        inputReadByCausalSubstrate: true,
        durableCorestoreHistoryRead: true,
        dhtOrHyperswarmInputObservedByCausalSubstrate: true,
        replicatedViaHyperswarmTransport: true,
        publicHyperswarmInputObservedByCausalSubstrate: false,
        sourceCoreKeyHex: "11".repeat(32),
        replicaCoreKeyHex: "11".repeat(32),
        topicHex: "22".repeat(32),
        sourceRecordCount: 0,
        replicaRecordCount: 0,
      },
    }, null, 2), "utf8");

    await assert.rejects(
      execFileAsync("npx", [
        "tsx",
        "scripts/derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report.ts",
        "--input-report",
        reportPath,
        "--handoff-bundle-output",
        handoffBundlePath,
        "--report-readback-output",
        readbackPath,
        "--emitted-at",
        "2026-06-01T10:21:02.000Z",
      ], {
        cwd: path.resolve("."),
      }),
      /hyperswarm_reader_report_readback_invalid_for_handoff_derivation/,
    );
    const readback = JSON.parse(await readFile(readbackPath, "utf8"));
    assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-hyperswarm-reader-report-readback-invalid");
    assert.equal(readback.validation.reportConsumed, true);
    assert.equal(readback.validation.seamHistoryHashPreserved, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("Hyperswarm reader report readback rejects weakened durable refs and proof labels", () => {
  const seamHistory = seamHistoryMaterial();
  const seamHistoryHash = `sha256:${"7".repeat(64)}`;
  const sourceRefs = [
    "layer-owned-edge-seam-status:hyperswarm-reader-test",
    `sha256:${"8".repeat(64)}`,
    "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
    `sha256:${"a".repeat(64)}`,
    "layer-report-only-edge-seam-receipt:hyperswarm-reader:linked",
    `sha256:${"b".repeat(64)}`,
  ];
  const record = {
    artifactKind: "edge_layer_seam_history_durable_record",
    schema: "causal-substrate/edge-layer-seam-history-durable-record/v1",
    schemaVersion: 1,
    recordId: "edge-layer-seam-history-durable-record:source-readback-negative",
    recordedAt: "2026-05-31T13:11:00.000Z",
    seamHistory,
    seamHistoryHash,
    seamHistoryHashAlgorithm: "sha256-stable-json",
    sourceRefs,
    durableHistoryMaterial: true,
  };
  const replicatedRecord = {
    ...record,
    recordId: "edge-layer-seam-history-durable-record:replica-readback-negative",
    seamHistoryHash: `sha256:${"6".repeat(64)}`,
    sourceRefs: ["edge-layer-seam-history-durable-record:weakened-source-ref"],
  };
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory,
    emittedAt: "2026-05-31T13:11:01.000Z",
    sourcePath: replicatedRecord.recordId,
    inputReadByCausalSubstrate: true,
  });
  observationResult.validation.normalizedProofLabel = "dht_hyperswarm_durable_seam_history_material";

  const readback = buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback({
    report: {
      namespaceParts: ["hyperswarm-seam-history-reader", "report-readback-negative"],
      record,
      replicatedRecord,
      observationResult,
      readerProof: {
        inputReadByCausalSubstrate: true,
        durableCorestoreHistoryRead: true,
        dhtOrHyperswarmInputObservedByCausalSubstrate: true,
        replicatedViaHyperswarmTransport: true,
        publicHyperswarmInputObservedByCausalSubstrate: false,
        sourceCoreKeyHex: "11".repeat(32),
        replicaCoreKeyHex: "11".repeat(32),
        topicHex: "22".repeat(32),
        sourceRecordCount: 0,
        replicaRecordCount: 0,
      },
    },
    emittedAt: "2026-05-31T13:11:02.000Z",
  });

  assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(readback);
  assert.equal(readback.reviewStatus, "edge-layer-seam-history-hyperswarm-reader-report-readback-invalid");
  assert.equal(readback.validation.reportConsumed, true);
  assert.equal(readback.validation.seamHistoryHashPreserved, false);
  assert.equal(readback.validation.durableSourceRefsPreserved, false);
  assert.equal(readback.validation.readerProofPreserved, false);
  assert.equal(readback.readback.seamHistoryHashPreserved, false);
  assert.equal(readback.readback.durableSourceRefsPreserved, false);
  assert.equal(readback.readback.readerProofPreserved, false);
  assert.equal(readback.readback.observationProofLabelsPreserved, false);
  assert.ok(readback.validation.issues.includes("seam-history-hash-not-preserved"));
  assert.ok(readback.validation.issues.includes("durable-source-refs-not-preserved"));
  assert.ok(readback.validation.issues.includes("reader-proof-not-preserved"));
  assert.ok(readback.validation.issues.includes("observation-proof-labels-not-preserved"));
  assert.equal(readback.durableRecordRefs.seamHistoryHash, seamHistoryHash);
  assert.equal(readback.durableRecordRefs.replicatedSeamHistoryHash, `sha256:${"6".repeat(64)}`);
  assert.deepEqual(readback.durableRecordRefs.sourceRefs, sourceRefs);
  assert.deepEqual(readback.durableRecordRefs.replicatedSourceRefs, [
    "edge-layer-seam-history-durable-record:weakened-source-ref",
  ]);
  assert.equal(readback.readerProof.sourceRecordCount, 0);
  assert.equal(readback.readerProof.replicaRecordCount, 0);
  assert.equal(readback.validation.noCanonicalHistoryClaim, true);
  assert.equal(readback.validation.noLayerAdmissionClaim, true);
  assert.equal(readback.validation.noRbcInterpretationClaim, true);
  assert.equal(readback.validation.noAuthorityClaim, true);
  assert.equal(readback.boundary.reportReadbackOnly, true);
  assert.equal(readback.boundary.verifiesLiveSwarmRun, false);
  assert.equal(readback.boundary.opensSwarm, false);
  assert.equal(readback.boundary.opensCorestore, false);
  assert.equal(readback.boundary.writesRecords, false);
  assert.equal(readback.boundary.acceptsCanonicalHistory, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
});

test(
  "Hyperswarm reader consumes replicated durable Edge Layer seam history before observing it",
  {
    skip: !SHOULD_RUN_PUBLIC_HYPERSWARM,
    timeout: 120_000,
  },
  async () => {
    const sourceDir = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-source-"));
    const replicaDir = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-replica-"));
    const readbackPath = path.join(replicaDir, "observation-readback.json");
    const harness = await openHyperswarmHarness();
    try {
      const report = await runEdgeLayerSeamHistoryHyperswarmReader({
        storageDirA: sourceDir,
        storageDirB: replicaDir,
        createSwarm: createDirectPeerHyperswarmFactory(harness.bootstrap),
        seamHistory: seamHistoryMaterial(),
        emittedAt: "2026-05-31T13:00:00.000Z",
        namespaceParts: ["hyperswarm-seam-history-reader", randomUUID()],
        flushTimeoutMs: 60_000,
        replicationTimeoutMs: 60_000,
      });

      assert.equal(report.record.seamHistoryHash, report.replicatedRecord.seamHistoryHash);
      assert.equal(report.readerProof.inputReadByCausalSubstrate, true);
      assert.equal(report.readerProof.durableCorestoreHistoryRead, true);
      assert.equal(report.readerProof.dhtOrHyperswarmInputObservedByCausalSubstrate, true);
      assert.equal(report.readerProof.replicatedViaHyperswarmTransport, true);
      assert.equal(report.readerProof.sourceCoreKeyHex, report.readerProof.replicaCoreKeyHex);
      assert.equal(report.readerProof.sourceRecordCount, 1);
      assert.equal(report.readerProof.replicaRecordCount, 1);

      assert.equal(report.observationResult.validation.seamHistoryInputConsumed, true);
      assert.equal(
        report.observationResult.proof.strongestProofRung,
        "public_hyperswarm_replicated_durable_seam_history_observation",
      );
      assert.equal(
        report.observationResult.proof.normalizedProofLabel,
        "public_hyperswarm_durable_seam_history_material",
      );
      assert.equal(report.observationResult.proof.durableCorestoreHistoryRead, true);
      assert.equal(report.observationResult.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, true);
      assert.equal(report.observationResult.proof.replicatedViaHyperswarmTransport, true);
      assert.equal(report.observationResult.proof.publicHyperswarmInputObservedByCausalSubstrate, true);
      assert.equal(report.observationResult.proof.decentralizedSeamProofClaimed, true);
      assert.equal(
        report.observationResult.outwardLaneTriggerNote.currentProofLabel,
        "public_hyperswarm_durable_seam_history_material",
      );
      assert.equal(report.observationResult.outwardLaneTriggerNote.shouldLookOutwardForDurableSeamHistory, false);
      assert.equal(report.observationResult.validation.decentralizedSeamProofClaimed, true);
      assert.equal(report.observationResult.validation.linkedPairDetected, true);
      assert.equal(report.observationResult.validation.damagedOrUnlinkedPairDetected, true);
      assert.equal(report.observationResult.validation.sourceIdsAndHashesPreserved, true);
      assert.equal(report.observationResult.validation.sourceReposPreserved, true);
      assert.equal(report.observationResult.validation.durableRefsPreserved, true);
      assert.equal(report.observationResult.validation.writerRefsPreserved, true);
      assert.equal(report.observationResult.validation.linkageStatusPreserved, true);
      assert.equal(report.observationResult.observations[0]?.classification, "compatible_seam_happening");
      assert.equal(
        report.observationResult.observations[1]?.classification,
        "unresolved_or_damaged_seam_happening",
      );
      assert.equal(
        report.observationResult.observations[0]?.request.id,
        "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
      );
      assert.equal(
        report.observationResult.observations[0]?.receipt.hash,
        `sha256:${"b".repeat(64)}`,
      );

      await writeFile(readbackPath, JSON.stringify(report.observationResult, null, 2), "utf8");
      const readback = JSON.parse(await readFile(readbackPath, "utf8")) as unknown;
      assertEdgeLayerSeamHistoryObservationResult(readback);
      assert.equal(
        readback.proof.strongestProofRung,
        "public_hyperswarm_replicated_durable_seam_history_observation",
      );
      assert.equal(readback.proof.normalizedProofLabel, "public_hyperswarm_durable_seam_history_material");
      assert.equal(
        readback.observations[0]?.request.id,
        "edge-layer-report-only-seam-request:hyperswarm-reader:linked",
      );
      assert.equal(readback.observations[0]?.request.hash, `sha256:${"a".repeat(64)}`);
      assert.equal(
        readback.observations[0]?.receipt.id,
        "layer-report-only-edge-seam-receipt:hyperswarm-reader:linked",
      );
      assert.equal(readback.observations[0]?.receipt.hash, `sha256:${"b".repeat(64)}`);
      assert.equal(
        readback.observations[1]?.request.id,
        "edge-layer-report-only-seam-request:hyperswarm-reader:unlinked",
      );
      assert.equal(readback.observations[1]?.request.hash, `sha256:${"c".repeat(64)}`);
      assert.equal(
        readback.observations[1]?.receipt.id,
        "layer-report-only-edge-seam-receipt:hyperswarm-reader:unlinked",
      );
      assert.equal(readback.observations[1]?.receipt.hash, `sha256:${"d".repeat(64)}`);
      assert.equal(activeManagedCorestoreCount(), 0);
    } finally {
      await harness.close();
      await rm(sourceDir, { recursive: true, force: true });
      await rm(replicaDir, { recursive: true, force: true });
    }
  },
);

test(
  "real Hyperswarm reader CLI writes checked report and readback outputs",
  {
    skip: !SHOULD_RUN_PUBLIC_HYPERSWARM,
    timeout: 120_000,
  },
  async () => {
    const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-cli-real-"));
    const sourceDir = path.join(tempRoot, "source");
    const replicaDir = path.join(tempRoot, "replica");
    const inputPath = path.join(tempRoot, "seam-history.json");
    const reportPath = path.join(tempRoot, "hyperswarm-reader-report.json");
    const readbackPath = path.join(tempRoot, "hyperswarm-reader-report-readback.json");
    const harness = await openHyperswarmHarness();
    try {
      await writeFile(inputPath, JSON.stringify(seamHistoryMaterial(), null, 2), "utf8");
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "1",
        CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC: "1",
      };
      delete env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP;

      const { stdout, stderr } = await execFileAsync("npx", [
        "tsx",
        "scripts/run-edge-layer-seam-history-hyperswarm-reader.ts",
        "--input",
        inputPath,
        "--report-output",
        reportPath,
        "--readback-output",
        readbackPath,
        "--storage-dir-a",
        sourceDir,
        "--storage-dir-b",
        replicaDir,
        "--namespace",
        `hyperswarm-seam-history-reader,checked-cli-output,${randomUUID()}`,
        "--emitted-at",
        "2026-05-31T13:20:00.000Z",
      ], {
        cwd: path.resolve("."),
        env,
        timeout: 120_000,
      });

      assert.equal(stdout, "");
      assert.equal(stderr, "");
      const report = JSON.parse(await readFile(reportPath, "utf8"));
      const readback = JSON.parse(await readFile(readbackPath, "utf8"));

      assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(readback);
      assert.equal(readback.reviewStatus, "edge-layer-seam-history-hyperswarm-reader-report-readback-valid");
      assert.equal(readback.validation.reportConsumed, true);
      assert.equal(readback.validation.seamHistoryHashPreserved, true);
      assert.equal(readback.validation.durableSourceRefsPreserved, true);
      assert.equal(readback.validation.readerProofPreserved, true);
      assert.equal(report.record.seamHistoryHash, report.replicatedRecord.seamHistoryHash);
      assert.deepEqual(report.record.sourceRefs, report.replicatedRecord.sourceRefs);
      assert.equal(
        report.observationResult.proof.strongestProofRung,
        "public_hyperswarm_replicated_durable_seam_history_observation",
      );
      assert.equal(report.observationResult.proof.normalizedProofLabel, "public_hyperswarm_durable_seam_history_material");
      assert.equal(report.observationResult.validation.decentralizedSeamProofClaimed, true);
      assert.equal(report.observationResult.validation.linkedPairDetected, true);
      assert.equal(report.observationResult.validation.damagedOrUnlinkedPairDetected, true);
      assert.equal(readback.source.sourceObservationProofRung, report.observationResult.proof.strongestProofRung);
      assert.equal(
        readback.source.sourceObservationNormalizedProofLabel,
        report.observationResult.proof.normalizedProofLabel,
      );
      assert.equal(readback.boundary.reportReadbackOnly, true);
      assert.equal(readback.boundary.verifiesLiveSwarmRun, false);
      assert.equal(readback.boundary.acceptsCanonicalHistory, false);
      assert.equal(readback.boundary.admitsLayerEvidence, false);
      assert.equal(readback.boundary.interpretsRbc, false);
      assert.equal(readback.boundary.grantsAuthority, false);
    } finally {
      await harness.close();
      await rm(tempRoot, { recursive: true, force: true });
    }
  },
);

test(
  "public device-shaped source manifest can be consumed by a public replica reader",
  {
    skip: !SHOULD_RUN_PUBLIC_HYPERSWARM,
    timeout: 120_000,
  },
  async () => {
    const sourceDir = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-public-device-source-"));
    const replicaDir = await mkdtemp(path.join(tmpdir(), "causal-seam-hs-public-device-replica-"));
    const namespaceParts = ["public-device", "device-shaped", randomUUID()];
    const harness = await openHyperswarmHarness();
    let source: Awaited<ReturnType<typeof openEdgeLayerSeamHistoryPublicDeviceSourcePublisher>> | undefined;
    try {
      source = await openEdgeLayerSeamHistoryPublicDeviceSourcePublisher({
        storageDir: sourceDir,
        createSwarm: async (seed) => {
          const swarm = await createHyperswarmReplicationSwarm({ seed });
          await swarm.listen();
          return swarm;
        },
        seamHistory: seamHistoryMaterial(),
        emittedAt: "2026-06-01T09:20:00.000Z",
        namespaceParts,
        flushTimeoutMs: 60_000,
      });

      assert.equal(source.manifest.proofPosture.sourceManifestOnly, true);
      assert.equal(source.manifest.proofPosture.publicSwarmObservationProofClaimedNow, false);
      assert.equal(source.manifest.boundary.replicaReadProvenByThisArtifact, false);
      assert.equal(source.manifest.source.sourceRecordId, source.record.recordId);
      assert.equal(source.manifest.source.seamHistoryHash, source.record.seamHistoryHash);
      assert.deepEqual(source.manifest.source.sourceRefs, source.record.sourceRefs);

      const report = await runEdgeLayerSeamHistoryPublicDeviceReplicaReader({
        storageDir: replicaDir,
        createSwarm: async (seed) => {
          const swarm = await createHyperswarmReplicationSwarm({ seed });
          await swarm.listen();
          return swarm;
        },
        sourceManifest: source.manifest,
        emittedAt: "2026-06-01T09:21:00.000Z",
        namespaceParts,
        flushTimeoutMs: 60_000,
        replicationTimeoutMs: 60_000,
      });

      assert.equal(report.artifactKind, "edge-layer-seam-history-public-device-replica-report");
      assert.equal(
        report.schema,
        "causal-substrate/edge-layer-seam-history-public-device-replica-report/v1",
      );
      assert.equal(report.replicatedRecord.recordId, source.record.recordId);
      assert.equal(report.replicatedRecord.seamHistoryHash, source.record.seamHistoryHash);
      assert.deepEqual(report.replicatedRecord.sourceRefs, source.record.sourceRefs);
      assert.equal(report.readerProof.inputReadByCausalSubstrate, true);
      assert.equal(report.readerProof.durableCorestoreHistoryRead, true);
      assert.equal(report.readerProof.dhtOrHyperswarmInputObservedByCausalSubstrate, true);
      assert.equal(report.readerProof.replicatedViaHyperswarmTransport, true);
      assert.equal(report.readerProof.publicHyperswarmInputObservedByCausalSubstrate, true);
      assert.equal(report.readerProof.sourceManifestConsumed, true);
      assert.equal(report.observationResult.proof.strongestProofRung, "public_hyperswarm_replicated_durable_seam_history_observation");
      assert.equal(report.observationResult.proof.normalizedProofLabel, "public_hyperswarm_durable_seam_history_material");
      assert.equal(report.observationResult.validation.linkedPairDetected, true);
      assert.equal(report.observationResult.validation.damagedOrUnlinkedPairDetected, true);
      assert.equal(report.boundary.observationOnly, true);
      assert.equal(report.boundary.acceptsCanonicalHistory, false);
      assert.equal(report.boundary.admitsLayerEvidence, false);
      assert.equal(report.boundary.interpretsRbc, false);
      assert.equal(report.boundary.grantsAuthority, false);
      assert.equal(report.boundary.publishesToMesh, false);
    } finally {
      await source?.close();
      await harness.close();
      await rm(sourceDir, { recursive: true, force: true });
      await rm(replicaDir, { recursive: true, force: true });
    }
  },
);
