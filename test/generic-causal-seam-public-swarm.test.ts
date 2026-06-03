import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  buildGenericCausalSeamPublicRunInstructions,
  createHyperswarmReplicationSwarm,
  openGenericCausalSeamPublicSourcePublisher,
  runGenericCausalSeamPublicReplicaReader,
  type GenericCausalSeamHistoryEnvelope,
  type HyperswarmReplicationSwarm,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

function neutralSeamHistory(): GenericCausalSeamHistoryEnvelope {
  return {
    historyId: "generic-public-seam-history:neutral-compatible",
    historyHash: `sha256:${"7".repeat(64)}`,
    sourceRepos: ["neutral-source-repo", "neutral-receipt-repo"],
    sourceSchemaRefs: ["neutral/request/v1", "neutral/receipt/v1"],
    transportProof: {
      evidenceSource: "local_artifact_fixture",
      publicSwarmTransportHappened: false,
      testnetSwarmTransportHappened: false,
      controlPlaneOnly: true,
      durableFeedBackedHistoryObserved: false,
      receivingRepoObservedReplicatedPath: false,
      receiptOrResultCausallyReferencesSources: true,
    },
    durableRefs: ["generic-core:request:0", "generic-core:receipt:1"],
    writerRefs: ["generic-writer:request", "generic-writer:receipt"],
    requests: [
      {
        id: "generic-request:linked",
        hash: `sha256:${"a".repeat(64)}`,
        sourceRepo: "neutral-source-repo",
        durableRef: "generic-core:request:0",
        writerRef: "generic-writer:request",
        schemaRef: "neutral/request/v1",
        observedProofRung: "local_artifact_seam",
      },
    ],
    receipts: [
      {
        id: "generic-receipt:linked",
        hash: `sha256:${"b".repeat(64)}`,
        sourceRepo: "neutral-receipt-repo",
        durableRef: "generic-core:receipt:1",
        writerRef: "generic-writer:receipt",
        schemaRef: "neutral/receipt/v1",
        sourceRequestId: "generic-request:linked",
        sourceRequestHash: `sha256:${"a".repeat(64)}`,
        observedProofRung: "local_artifact_seam",
      },
    ],
    evidenceRefs: [],
    linkage: [
      {
        requestId: "generic-request:linked",
        requestHash: `sha256:${"a".repeat(64)}`,
        receiptId: "generic-receipt:linked",
        receiptHash: `sha256:${"b".repeat(64)}`,
      },
    ],
    proofLabels: ["neutral_generic_seam_history_material"],
    warnings: [],
  };
}

function createDirectPeerHyperswarmFactory() {
  const topics = new Map<string, HyperswarmReplicationSwarm[]>();
  const swarms: HyperswarmReplicationSwarm[] = [];

  return async (seed?: Buffer) => {
    const swarm = await createHyperswarmReplicationSwarm({ seed });
    swarms.push(swarm);
    await swarm.listen();

    return {
      ...swarm,
      async flush() {},
      join(topic: Buffer) {
        const key = topic.toString("hex");
        const peers = topics.get(key) ?? [];
        topics.set(key, peers);

        if (!peers.some((peer) => peer.publicKey.equals(swarm.publicKey))) {
          peers.push(swarm);
        }

        for (const peer of peers) {
          if (peer.publicKey.equals(swarm.publicKey)) continue;
          swarm.joinPeer(peer.publicKey);
          peer.joinPeer(swarm.publicKey);
        }

        return {
          flushed: async () => {},
          refresh: async () => {
            for (const peer of peers) {
              if (peer.publicKey.equals(swarm.publicKey)) continue;
              swarm.joinPeer(peer.publicKey);
              peer.joinPeer(swarm.publicKey);
            }
          },
        };
      },
    };
  };
}

function createNoPeerSwarmFactory() {
  return async (seed?: Buffer) => {
    const swarm = await createHyperswarmReplicationSwarm({ seed });
    await swarm.listen();
    return {
      ...swarm,
      async flush() {},
      join() {
        return {
          flushed: async () => {},
          refresh: async () => {},
        };
      },
    };
  };
}

test("generic public run instructions stay instructions-only", () => {
  const instructions = buildGenericCausalSeamPublicRunInstructions({
    emittedAt: "2026-06-03T13:00:00.000Z",
  });

  assert.equal(instructions.schema, "causal-substrate/generic-causal-seam-public-run-instructions/v1");
  assert.equal(instructions.proofGate.instructionsOnly, true);
  assert.equal(instructions.proofGate.publicSwarmProofClaimedNow, false);
  assert.equal(instructions.proofGate.sourceManifestAloneIsNotObservationProof, true);
  assert.equal(instructions.boundary.opensSwarmNow, false);
  assert.match(instructions.commands.sourceDevicePublisher, /run-generic-causal-seam-public-source-device/);
  assert.match(instructions.commands.replicaDeviceReader, /run-generic-causal-seam-public-replica-device/);
});

test("generic public CLIs emit instructions only until explicitly enabled", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "generic-causal-cli-instructions-"));
  try {
    const sourceInstructions = path.join(root, "source-instructions.json");
    const replicaInstructions = path.join(root, "replica-instructions.json");
    await execFileAsync("npx", [
      "tsx",
      "scripts/run-generic-causal-seam-public-source-device.ts",
      "--instructions-output",
      sourceInstructions,
      "--emitted-at",
      "2026-06-03T13:01:00.000Z",
    ]);
    await execFileAsync("npx", [
      "tsx",
      "scripts/run-generic-causal-seam-public-replica-device.ts",
      "--instructions-output",
      replicaInstructions,
      "--emitted-at",
      "2026-06-03T13:02:00.000Z",
    ]);

    const source = JSON.parse(await readFile(sourceInstructions, "utf8"));
    const replica = JSON.parse(await readFile(replicaInstructions, "utf8"));
    assert.equal(source.proofGate.publicSwarmProofClaimedNow, false);
    assert.equal(replica.proofGate.publicSwarmProofClaimedNow, false);
    assert.equal(source.boundary.opensSwarmNow, false);
    assert.equal(replica.boundary.opensCorestoreNow, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("generic source manifest is lower proof until a replica reads durable material", async () => {
  const sourceDir = await mkdtemp(path.join(tmpdir(), "generic-causal-source-"));
  const source = await openGenericCausalSeamPublicSourcePublisher({
    storageDir: sourceDir,
    createSwarm: createNoPeerSwarmFactory(),
    seamHistory: neutralSeamHistory(),
    emittedAt: "2026-06-03T13:03:00.000Z",
    namespaceParts: ["generic", "source-only", randomUUID()],
  });

  try {
    assert.equal(source.manifest.proofPosture.sourceManifestOnly, true);
    assert.equal(source.manifest.proofPosture.publicSwarmObservationProofClaimedNow, false);
    assert.equal(source.manifest.boundary.replicaReadProvenByThisArtifact, false);
    assert.equal(source.manifest.source.sourceRecordId, source.record.recordId);
    assert.equal(source.manifest.source.seamHistoryHash, source.record.seamHistoryHash);
    assert.deepEqual(source.manifest.source.sourceRefs, source.record.sourceRefs);
  } finally {
    await source.close();
    await rm(sourceDir, { recursive: true, force: true });
  }
});

test("generic replica reader classifies timeout as unresolved rather than public proof", async () => {
  const sourceDir = await mkdtemp(path.join(tmpdir(), "generic-causal-timeout-source-"));
  const replicaDir = await mkdtemp(path.join(tmpdir(), "generic-causal-timeout-replica-"));
  const source = await openGenericCausalSeamPublicSourcePublisher({
    storageDir: sourceDir,
    createSwarm: createNoPeerSwarmFactory(),
    seamHistory: neutralSeamHistory(),
    emittedAt: "2026-06-03T13:04:00.000Z",
    namespaceParts: ["generic", "timeout", randomUUID()],
  });

  try {
    const report = await runGenericCausalSeamPublicReplicaReader({
      storageDir: replicaDir,
      createSwarm: createNoPeerSwarmFactory(),
      sourceManifest: source.manifest,
      emittedAt: "2026-06-03T13:05:00.000Z",
      namespaceParts: ["generic", "timeout", randomUUID()],
      replicationTimeoutMs: 10,
      flushTimeoutMs: 10,
      publicHyperswarmInputObservedByCausalSubstrate: true,
    });

    assert.equal(report.status, "unresolved");
    assert.equal(report.readerProof.replicatedViaHyperswarmTransport, false);
    assert.equal(report.readerProof.publicHyperswarmInputObservedByCausalSubstrate, false);
    assert.equal(report.observationResult, undefined);
    assert.match(report.unresolvedFindings[0]!, /did not read/);
    assert.equal(report.boundary.observationOnly, true);
    assert.equal(report.boundary.grantsAuthority, false);
  } finally {
    await source.close();
    await rm(sourceDir, { recursive: true, force: true });
    await rm(replicaDir, { recursive: true, force: true });
  }
});

test("generic replica reader emits compatible observation after replicated durable read", async () => {
  const sourceDir = await mkdtemp(path.join(tmpdir(), "generic-causal-public-source-"));
  const replicaDir = await mkdtemp(path.join(tmpdir(), "generic-causal-public-replica-"));
  const namespaceParts = ["generic", "direct-peer", randomUUID()];
  const createSwarm = createDirectPeerHyperswarmFactory();
  const source = await openGenericCausalSeamPublicSourcePublisher({
    storageDir: sourceDir,
    createSwarm,
    seamHistory: neutralSeamHistory(),
    emittedAt: "2026-06-03T13:06:00.000Z",
    namespaceParts,
  });

  try {
    const report = await runGenericCausalSeamPublicReplicaReader({
      storageDir: replicaDir,
      createSwarm,
      sourceManifest: source.manifest,
      emittedAt: "2026-06-03T13:07:00.000Z",
      namespaceParts,
      replicationTimeoutMs: 20_000,
      flushTimeoutMs: 1_000,
      publicHyperswarmInputObservedByCausalSubstrate: false,
    });

    assert.equal(report.status, "compatible");
    assert.equal(report.replicatedRecord?.recordId, source.record.recordId);
    assert.equal(report.replicatedRecord?.seamHistoryHash, source.record.seamHistoryHash);
    assert.equal(report.readerProof.replicatedViaHyperswarmTransport, true);
    assert.equal(report.readerProof.publicHyperswarmInputObservedByCausalSubstrate, false);
    assert.equal(report.observationResult?.finalClassification, "compatible");
    assert.equal(report.observationResult?.publicSwarmTransportHappened, false);
    assert.equal(report.observationResult?.testnetSwarmTransportHappened, true);
    assert.equal(report.observationResult?.sourceProofRung, "swarm_discovered_seam");
    assert.equal(report.observationResult?.transportBooleans.durableObservationResultEmitted, true);
    assert.equal(report.observationResult?.transportBooleans.reopenedReadbackDerivedFromDurableHistory, true);
    assert.equal(report.boundary.writesConsumerState, false);
  } finally {
    await source.close();
    await rm(sourceDir, { recursive: true, force: true });
    await rm(replicaDir, { recursive: true, force: true });
  }
});
