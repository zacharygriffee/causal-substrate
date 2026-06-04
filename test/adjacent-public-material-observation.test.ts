import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertAdjacentPublicMaterialObservation,
  buildAdjacentPublicMaterialObservation,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

const requestRef = {
  eventId: "edge-layer-report-only-seam-request:fresh-layer-33321fbe",
  eventHash: `sha256:${"1".repeat(64)}`,
  writerRef: "edge-writer:fresh-layer-request",
  sourceRepo: "mesh-ecology-edge",
  targetRepo: "mesh-ecology-layer",
};

const receiptRef = {
  eventId: "layer-owned-edge-seam-receipt:fresh-layer-33321fbe",
  eventHash: `sha256:${"2".repeat(64)}`,
  writerRef: "layer-writer:fresh-layer-receipt",
  sourceRequestId: requestRef.eventId,
  sourceRequestHash: requestRef.eventHash,
};

const evidenceRef = {
  evidenceId: "layer-public-hyperdht-evidence:fresh-layer-33321fbe",
  evidenceHash: `sha256:${"3".repeat(64)}`,
  observedRequestHash: requestRef.eventHash,
  emittedReceiptHash: receiptRef.eventHash,
};

test("observes fresh Layer public/readiness material as compatible without upgrading proof", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: buildLayerPublicMaterial(),
    emittedAt: "2026-06-03T18:00:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "compatible");
  assert.equal(observation.sourceClassifications.layer, "compatible");
  assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
  assert.equal(observation.proof.strongestSourceProofRungObserved, "default_public_hyperdht_hyperswarm_feed_backed");
  assert.equal(observation.proof.layerPublicProofObserved, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.equal(observation.proof.proofRungUpgradeClaimed, false);
  assert.deepEqual(observation.validation.issues, []);
  assert.deepEqual(observation.preservedRefs.requestIds, [requestRef.eventId]);
  assert.deepEqual(observation.preservedRefs.requestHashes, [requestRef.eventHash]);
  assert.deepEqual(observation.preservedRefs.receiptIds, [receiptRef.eventId]);
  assert.deepEqual(observation.preservedRefs.receiptHashes, [receiptRef.eventHash]);
  assert.deepEqual(observation.preservedRefs.evidenceIds, [evidenceRef.evidenceId]);
  assert.deepEqual(observation.preservedRefs.evidenceHashes, [evidenceRef.evidenceHash]);
  assert.ok(observation.preservedRefs.durableRefs.includes("autobase:layer-public-default-hyperdht"));
  assert.ok(observation.preservedRefs.writerRefs.includes("layer-writer:fresh-layer-receipt"));
  assert.ok(observation.preservedRefs.sourceRepos.includes("mesh-ecology-layer"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("request_receipt_evidence_linked"));
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.interpretsRbc, false);
  assert.equal(observation.boundary.grantsAuthority, false);
  assert.equal(observation.boundary.publishesToMesh, false);
  assert.equal(observation.boundary.writesProductionContinuity, false);
});

test("classifies damaged Layer linkage honestly while preserving refs and non-claims", () => {
  const material = buildLayerPublicMaterial();
  const readiness = (material.objectiveProof as any).causalReadiness;
  readiness.receiptRef.sourceRequestHash = `sha256:${"9".repeat(64)}`;

  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: material,
    emittedAt: "2026-06-03T18:01:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "damaged");
  assert.equal(observation.sourceClassifications.layer, "damaged");
  assert.ok(observation.validation.issues.includes("layer-request-receipt-evidence-linkage-mismatch"));
  assert.deepEqual(observation.preservedRefs.requestIds, [requestRef.eventId]);
  assert.deepEqual(observation.preservedRefs.receiptIds, [receiptRef.eventId]);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
});

test("classifies unresolved Layer readiness without treating timeout or missing acceptance as success", () => {
  const material = buildLayerPublicMaterial();
  const objectiveProof = material.objectiveProof as any;
  objectiveProof.causalReadiness.readinessStatus = "not_ready_for_causal_substrate_read_only_observation";
  objectiveProof.causalReadinessConsumer.consumerStatus = "rejected_for_causal_read_only_consumer_projection";
  material.operationProof.causalReadinessConsumerAccepted = false;

  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: material,
    emittedAt: "2026-06-03T18:02:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "unresolved");
  assert.equal(observation.sourceClassifications.layer, "unresolved");
  assert.ok(observation.validation.issues.includes("layer-causal-readiness-not-accepted"));
  assert.equal(observation.proof.layerPublicProofObserved, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
});

test("observes Layer public seam lifecycle smoke without inventing missing ids", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: buildLayerLifecycleSmoke(),
    emittedAt: "2026-06-03T18:02:30.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "compatible");
  assert.equal(observation.sourceClassifications.layer, "compatible");
  assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
  assert.equal(observation.proof.strongestSourceProofRungObserved, "default_public_hyperdht_hyperswarm_feed_backed");
  assert.equal(observation.proof.layerPublicProofObserved, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.equal(observation.validation.layerRefsPreserved, true);
  assert.equal(observation.validation.layerRequestReceiptEvidenceLinked, true);
  assert.deepEqual(observation.preservedRefs.requestIds, []);
  assert.deepEqual(observation.preservedRefs.receiptIds, []);
  assert.deepEqual(observation.preservedRefs.requestHashes, [`sha256:${"6".repeat(64)}`]);
  assert.deepEqual(observation.preservedRefs.receiptHashes, [`sha256:${"7".repeat(64)}`]);
  assert.deepEqual(observation.preservedRefs.evidenceIds, ["layer-owned-edge-seam-evidence:lifecycle:2"]);
  assert.ok(observation.preservedRefs.durableRefs.includes("layer-public-seam-lifecycle-smoke"));
  assert.ok(observation.preservedRefs.durableRefs.includes("b".repeat(64)));
  assert.ok(observation.preservedRefs.writerRefs.includes("autobase-writer:layer-lifecycle"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("layer_public_seam_lifecycle_linked"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("linkedPairCount:2"));
  assert.equal(observation.boundary.opensSwarm, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
});

test("classifies unresolved Layer lifecycle smoke linkage without upgrading proof", () => {
  const material = buildLayerLifecycleSmoke();
  material.status.unlinkedCount = 1;
  material.lifecycleStatus = "public_seam_lifecycle_completed_with_unresolved_history";

  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: material,
    emittedAt: "2026-06-03T18:02:45.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "unresolved");
  assert.equal(observation.sourceClassifications.layer, "unresolved");
  assert.ok(observation.validation.issues.includes("layer-lifecycle-linkage-unresolved"));
  assert.equal(observation.proof.layerPublicProofObserved, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.equal(observation.boundary.opensSwarm, false);
});

test("classifies unresolved Layer device-boundary handoff without treating timeout as damage", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: buildLayerDeviceBoundaryUnresolvedHandoff(),
    emittedAt: "2026-06-04T03:16:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "unresolved");
  assert.equal(observation.sourceClassifications.layer, "unresolved");
  assert.equal(observation.validation.layerRefsPreserved, true);
  assert.equal(observation.validation.layerRequestReceiptEvidenceLinked, false);
  assert.equal(observation.validation.layerPublicBoundaryPreserved, false);
  assert.equal(observation.proof.layerPublicProofObserved, false);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.ok(observation.validation.issues.includes("layer-device-boundary-public-swarm-timeout"));
  assert.ok(observation.preservedRefs.durableRefs.includes("device:edge-public-client"));
  assert.ok(observation.preservedRefs.durableRefs.includes("device:layer-public-participant"));
  assert.ok(observation.preservedRefs.durableRefs.includes("8c4c6941ef676bb0496a71a7f193956b321e61b844cc0939d8dbed45f18aecf7"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("unresolved_public_swarm_timeout"));
  assert.equal(observation.boundary.admitsLayerEvidence, false);
});

test("observes completed Layer device-boundary handoff as compatible adjacent material", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: buildLayerDeviceBoundaryCompleteHandoff(),
    emittedAt: "2026-06-04T05:20:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "compatible");
  assert.equal(observation.sourceClassifications.layer, "compatible");
  assert.deepEqual(observation.preservedRefs.requestIds, [
    "compatible-layer-report-only-seam-request:two-device-public-client:v0",
  ]);
  assert.deepEqual(observation.preservedRefs.requestHashes, [
    "sha256:329f6154dcf79612c1287cfe1a160f3c19bdf7b973cc455c02be3690124d3e7a",
  ]);
  assert.deepEqual(observation.preservedRefs.receiptIds, [
    "layer-report-only-edge-seam-receipt:compatible-layer-report-only-seam-request:two-device-public-client:v0",
  ]);
  assert.deepEqual(observation.preservedRefs.receiptHashes, [
    "sha256:89065e33bdcae4a1c29774c8ed08e8b655433004221e4456d6cd8cdf5740196f",
  ]);
  assert.ok(observation.preservedRefs.evidenceIds.includes(
    "layer-owned-edge-seam-evidence:compatible-layer-report-only-seam-request:two-device-public-client:v0:0",
  ));
  assert.ok(observation.preservedRefs.writerRefs.includes(
    "autobase-writer:70d13f7ee7773d745300ca7178a9bbf643276d3311a31bf6d63d5d8b4a0d6693",
  ));
  assert.ok(observation.preservedRefs.durableRefs.includes(
    "bfe596e9381a81a9b37b82a4c9abe864d1518500688d687a08aa027d333fc622",
  ));
  assert.ok(observation.preservedRefs.proofRungs.includes("default_public_hyperdht_hyperswarm_feed_backed"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("device_boundary_public_swarm_complete"));
  assert.equal(observation.validation.layerRefsPreserved, true);
  assert.equal(observation.validation.layerRequestReceiptEvidenceLinked, true);
  assert.equal(observation.validation.layerPublicBoundaryPreserved, true);
  assert.equal(observation.validation.layerCausalReadinessAccepted, true);
  assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
  assert.equal(observation.proof.layerPublicProofObserved, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.equal(observation.boundary.opensSwarm, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
});

test("observes Edge compatible handoff readback as lower-rung exported material", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    edgeHandoffReadback: {
      causalHandoffExport: {
        artifactKind: "edge_compatible_swarm_seam_causal_handoff_export",
        targetConsumer: "causal-substrate",
        operationProofRung: "saved_readback_seam",
        proofRungNotUpgraded: true,
        edgeHandoffReadback: buildEdgeHandoffReadback(),
        operationProof: {
          causalObservationRan: false,
        },
      },
    },
    emittedAt: "2026-06-03T18:03:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "compatible");
  assert.equal(observation.sourceClassifications.edge, "compatible");
  assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
  assert.equal(observation.proof.edgeReadbackProofRungNotUpgraded, true);
  assert.equal(observation.validation.edgeReadbackOnly, true);
  assert.equal(observation.validation.edgeProofRungNotUpgraded, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.deepEqual(observation.preservedRefs.requestIds, ["edge-compatible-request:fresh-edge-727bf1f9"]);
  assert.deepEqual(observation.preservedRefs.receiptIds, ["edge-compatible-receipt:fresh-edge-727bf1f9"]);
  assert.ok(observation.preservedRefs.durableRefs.includes("edge-handoff-feed:fresh-edge-727bf1f9"));
  assert.ok(observation.preservedRefs.writerRefs.includes("edge-compatible-writer:fresh-edge-727bf1f9"));
  assert.ok(observation.preservedRefs.sourceRepos.includes("mesh-ecology-edge"));
  assert.ok(observation.preservedRefs.sourceRepos.includes("mesh-ecology-layer"));
  assert.ok(observation.preservedRefs.proofRungs.includes("consumer_handoff_seam"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("linkedPairCount:1"));
});

test("observes unresolved Edge live public process export as adjacent material", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    edgePublicProcessExport: buildEdgePublicProcessExport({ linked: false }),
    emittedAt: "2026-06-04T11:10:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "unresolved");
  assert.equal(observation.sourceClassifications.edge, "unresolved");
  assert.equal(observation.observedSources.edgePublicProcessExportObserved, true);
  assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
  assert.equal(observation.proof.edgeReadbackProofRungNotUpgraded, true);
  assert.equal(observation.validation.edgeRefsPreserved, true);
  assert.equal(observation.validation.edgeReadbackOnly, true);
  assert.equal(observation.validation.edgeProofRungNotUpgraded, true);
  assert.ok(observation.validation.issues.includes("edge-public-process-request-receipt-linkage-unresolved"));
  assert.deepEqual(observation.preservedRefs.requestIds, []);
  assert.deepEqual(observation.preservedRefs.receiptIds, []);
  assert.ok(observation.preservedRefs.durableRefs.includes("edge-compatible-swarm-seam-public-process-readback:live-process"));
  assert.ok(observation.preservedRefs.durableRefs.includes("edge-compatible-endpoint-descriptor:layer-current-live-public-seam:smoke"));
  assert.ok(observation.preservedRefs.writerRefs.includes("autobase-writer:edge-live-process"));
  assert.ok(observation.preservedRefs.sourceRepos.includes("mesh-ecology-edge"));
  assert.ok(observation.preservedRefs.proofRungs.includes("saved_readback_seam"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("edge_public_process_request_receipt_unresolved"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("defaultPublicAttemptCount:1"));
  assert.equal(observation.boundary.opensSwarm, false);
  assert.equal(observation.boundary.callsEdge, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
});

test("observes linked Edge live public process export as compatible adjacent material", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    edgePublicProcessExport: buildEdgePublicProcessExport({ linked: true }),
    emittedAt: "2026-06-04T11:11:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "compatible");
  assert.equal(observation.sourceClassifications.edge, "compatible");
  assert.equal(observation.observedSources.edgePublicProcessExportObserved, true);
  assert.equal(observation.validation.edgeRefsPreserved, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.deepEqual(observation.preservedRefs.requestIds, ["edge-public-process-request:smoke"]);
  assert.deepEqual(observation.preservedRefs.requestHashes, [`sha256:${"8".repeat(64)}`]);
  assert.deepEqual(observation.preservedRefs.receiptIds, ["layer-public-process-receipt:smoke"]);
  assert.deepEqual(observation.preservedRefs.receiptHashes, [`sha256:${"9".repeat(64)}`]);
  assert.ok(observation.preservedRefs.linkageStatuses.includes("edge_public_process_request_receipt_linked"));
});

test("adjacent public material CLI consumes Layer and Edge shapes", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "adjacent-public-material-"));
  const layerPath = path.join(tempRoot, "layer-public-material.json");
  const edgePath = path.join(tempRoot, "edge-handoff-readback.json");
  const outputPath = path.join(tempRoot, "adjacent-observation.json");
  try {
    await writeFile(layerPath, `${JSON.stringify(buildLayerPublicMaterial(), null, 2)}\n`, "utf8");
    await writeFile(edgePath, `${JSON.stringify(buildEdgeHandoffReadback(), null, 2)}\n`, "utf8");
    const run = await execFileAsync("npx", [
      "tsx",
      "scripts/observe-adjacent-public-material.ts",
      "--layer-public-material",
      layerPath,
      "--edge-handoff-readback",
      edgePath,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-03T18:04:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(run.stdout, "");
    assert.equal(run.stderr, "");
    const observation = JSON.parse(await readFile(outputPath, "utf8")) as unknown;
    assertAdjacentPublicMaterialObservation(observation);
    assert.equal(observation.classification, "compatible");
    assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
    assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("adjacent public material CLI consumes Edge live public process export", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "adjacent-public-process-export-"));
  const edgePath = path.join(tempRoot, "edge-public-process-export.json");
  const outputPath = path.join(tempRoot, "adjacent-observation.json");
  try {
    await writeFile(edgePath, `${JSON.stringify({ processExport: buildEdgePublicProcessExport({ linked: false }) }, null, 2)}\n`, "utf8");
    const run = await execFileAsync("npx", [
      "tsx",
      "scripts/observe-adjacent-public-material.ts",
      "--edge-public-process-export",
      edgePath,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-04T11:12:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(run.stdout, "");
    assert.equal(run.stderr, "");
    const observation = JSON.parse(await readFile(outputPath, "utf8")) as unknown;
    assertAdjacentPublicMaterialObservation(observation);
    assert.equal(observation.classification, "unresolved");
    assert.equal(observation.observedSources.edgePublicProcessExportObserved, true);
    assert.equal(observation.validation.edgeRefsPreserved, true);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

function buildLayerPublicMaterial(): any {
  return {
    artifactKind: "layer_edge_seam_public_hyperdht_proof_result",
    strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
    namespace: "layer-public-default-hyperdht",
    autobaseKey: "autobase:layer-public-default-hyperdht",
    operationProof: {
      causalReadinessConsumerAccepted: true,
      consumerReplayAllTriplesLinked: true,
      rbcEnforced: false,
      authorityGrantOccurred: false,
      layerAdmissionOccurred: false,
      canonicalTruthClaimed: false,
    },
    proofBoundary: {
      defaultPublicHyperDht: true,
      publicSwarmProof: true,
      explicitBootstrapNodes: false,
      localBootstrapper: false,
      strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
    },
    objectiveProof: {
      causalReadinessConsumer: {
        consumerStatus: "accepted_for_causal_read_only_consumer_projection",
        operationProof: {
          requestReceiptEvidenceRefsLinked: true,
          publicHyperDhtProofObserved: true,
          sourceRefsPreserved: true,
          writerRefsPreserved: true,
          rbcEnforced: false,
          authorityGrantOccurred: false,
        },
      },
      causalReadiness: {
        artifactKind: "layer_owned_edge_seam_causal_handoff_readiness_export",
        readinessStatus: "ready_for_causal_substrate_read_only_observation",
        strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
        requestRef: { ...requestRef },
        receiptRef: { ...receiptRef },
        evidenceRef: { ...evidenceRef },
        writerRefs: {
          requestWriterRef: requestRef.writerRef,
          receiptWriterRef: receiptRef.writerRef,
          layerWriterRef: receiptRef.writerRef,
        },
        durableHistoryRefs: {
          storageRoot: "storage:layer-public-default-hyperdht",
          autobaseKey: "autobase:layer-public-default-hyperdht",
          seamViewName: "edge-layer-report-only-seam",
          layerEvidenceCoreName: "layer-public-evidence-core",
        },
        proofBoundary: {
          defaultPublicHyperDht: true,
          publicSwarmProof: true,
          explicitBootstrapNodes: false,
          localBootstrapper: false,
          strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
        },
        operationProof: {
          rbcEnforced: false,
          authorityGrantOccurred: false,
          layerAdmissionOccurred: false,
          canonicalTruthClaimed: false,
        },
        readOnly: true,
        reportOnly: true,
        mutatesLayer: false,
        grantsAuthority: false,
        admitsEvidence: false,
        rbcEnforced: false,
      },
    },
  };
}

function buildLayerLifecycleSmoke(): any {
  return {
    artifactKind: "layer_public_seam_lifecycle_smoke_result",
    schemaVersion: "layer-public-seam-lifecycle-smoke-result.v0",
    createdAt: "2026-05-30T00:00:00.000Z",
    namespace: "layer-public-seam-lifecycle-smoke",
    sourceStorageRoot: "/tmp/layer-public-seam-source",
    layerStorageRoot: "/tmp/layer-public-seam-layer",
    autobaseKey: "a".repeat(64),
    strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
    lifecycleStatus: "public_seam_lifecycle_completed_with_durable_readback",
    up: {
      artifactKind: "layer_public_seam_up_descriptor",
      endpointDescriptor: {
        transportKind: "hyperswarm",
        bootstrapMode: "default_public_hyperdht",
        defaultPublicHyperDht: true,
        topicHex: "b".repeat(64),
        autobaseKey: "a".repeat(64),
        namespace: "layer-public-seam-lifecycle-smoke",
        layerWriterRef: "autobase-writer:layer-lifecycle",
        reportOnly: true,
      },
    },
    status: {
      artifactKind: "layer_public_seam_status",
      lifecycleState: "receipt_evidence_observed",
      requestCount: 2,
      receiptCount: 2,
      evidenceCount: 2,
      linkedPairCount: 2,
      unlinkedCount: 0,
      latestRequestHash: `sha256:${"6".repeat(64)}`,
      latestReceiptHash: `sha256:${"7".repeat(64)}`,
      latestEvidenceRef: "layer-owned-edge-seam-evidence:lifecycle:2",
      derivedFromReopenedDurableHistory: true,
    },
    down: {
      lifecycleState: "participant_stopped_cleanly_after_smoke",
      durableHistoryRemainsReadable: true,
    },
    operationProof: {
      publicHyperDhtParticipantStarted: true,
      defaultPublicHyperDhtObserved: true,
      swarmConnectionObserved: true,
      durableRequestObservedByLayer: true,
      layerOwnedReceiptEmitted: true,
      receiptCausallyReferencesRequest: true,
      layerLocalEvidenceRecorded: true,
      reopenedReadbackRecoveredHistory: true,
      participantStoppedBeforeFinalReadback: true,
      layerMutationOccurred: false,
      evidenceAdmissionOccurred: false,
      authorityGrantOccurred: false,
      rbcEnforced: false,
    },
    reportOnly: true,
    readOnly: true,
    mutatesLayer: false,
    admitsEvidence: false,
    acceptsResult: false,
    executesWork: false,
    grantsAuthority: false,
    rbcEnforced: false,
  };
}

function buildLayerDeviceBoundaryUnresolvedHandoff(): any {
  return {
    artifactKind: "layer_public_device_boundary_handoff_packet",
    schemaVersion: "layer-public-device-boundary-handoff-packet.v0",
    packetStatus: "device_boundary_handoff_unresolved_or_blocked",
    sourceClassificationRef: "proof-artifacts/layer-convergence/layer-public-device-boundary-classification.json",
    classification: "unresolved_public_swarm_timeout",
    sourceMaterialKind: "held_participant_or_unknown_result",
    deviceBoundaryCrossed: false,
    sourceDeviceRef: "device:edge-public-client",
    layerDeviceRef: "device:layer-public-participant",
    distinctDeviceRefsObserved: true,
    distinctDeviceFingerprintsObserved: true,
    syntheticClassifierFixture: false,
    deviceBoundaryProofClaimed: false,
    issues: ["public_swarm_timeout_or_connection_not_observed"],
    proofSummary: {
      artifactKind: "layer_public_device_boundary_compatible_client_result",
      namespace: "layer-device-boundary-convergence",
      strongestProofRung: null,
      requestCount: null,
      receiptCount: null,
      evidenceCount: null,
      linkedPairCount: null,
      unlinkedCount: null,
      latestRequestHash: null,
      latestReceiptHash: null,
      latestEvidenceRef: null,
    },
    preservedRefs: {
      requestRefs: [],
      receiptRefs: [],
      layerWriterRef: null,
      autobaseKey: "8c4c6941ef676bb0496a71a7f193956b321e61b844cc0939d8dbed45f18aecf7",
      topicHex: "5d676672f0280751974c640ae3846f9075d42b36a9dbddb3a1a0e670b2589f18",
    },
    expectedNonClaims: {
      readOnly: true,
      reportOnly: true,
      mutatesLayer: false,
      admitsEvidence: false,
      grantsAuthority: false,
      rbcEnforced: false,
      meshPublished: false,
      productionDurabilityClaimed: false,
    },
    operationProof: {
      builtFromClassificationOnly: true,
      sourceRefsPreserved: true,
      realDeviceBoundaryProofConsumed: false,
      noLayerRuntimeImportRequired: true,
      noLayerMutation: true,
      noAuthorityGrant: true,
      noRbcEnforcement: true,
    },
    readOnly: true,
    reportOnly: true,
    mutatesLayer: false,
    admitsEvidence: false,
    grantsAuthority: false,
    rbcEnforced: false,
  };
}

function buildLayerDeviceBoundaryCompleteHandoff(): any {
  return {
    artifactKind: "layer_public_device_boundary_handoff_packet",
    schemaVersion: "layer-public-device-boundary-handoff-packet.v0",
    packetStatus: "device_boundary_handoff_ready_for_edge_or_causal",
    sourceClassificationRef: "proof-artifacts/layer-convergence-20260604T040145Z/layer-public-device-boundary-classification.json",
    classification: "device_boundary_public_swarm_complete",
    sourceMaterialKind: "returned_device_boundary_result",
    deviceBoundaryCrossed: true,
    sourceDeviceRef: "device:edge-public-client",
    layerDeviceRef: "device:layer-public-participant",
    distinctDeviceRefsObserved: true,
    distinctDeviceFingerprintsObserved: true,
    syntheticClassifierFixture: false,
    deviceBoundaryProofClaimed: true,
    issues: [],
    proofSummary: {
      artifactKind: "layer_public_device_boundary_compatible_client_result",
      namespace: "layer-device-boundary-convergence-layer-convergence-20260604T040145Z",
      strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
      requestCount: 1,
      receiptCount: 1,
      evidenceCount: 1,
      linkedPairCount: 1,
      unlinkedCount: 0,
      latestRequestHash: "sha256:329f6154dcf79612c1287cfe1a160f3c19bdf7b973cc455c02be3690124d3e7a",
      latestReceiptHash: "sha256:89065e33bdcae4a1c29774c8ed08e8b655433004221e4456d6cd8cdf5740196f",
      latestEvidenceRef: "layer-owned-edge-seam-evidence:compatible-layer-report-only-seam-request:two-device-public-client:v0:0",
    },
    preservedRefs: {
      requestRefs: [
        {
          eventId: "compatible-layer-report-only-seam-request:two-device-public-client:v0",
          eventHash: "sha256:329f6154dcf79612c1287cfe1a160f3c19bdf7b973cc455c02be3690124d3e7a",
        },
      ],
      receiptRefs: [
        {
          eventId: "layer-report-only-edge-seam-receipt:compatible-layer-report-only-seam-request:two-device-public-client:v0",
          eventHash: "sha256:89065e33bdcae4a1c29774c8ed08e8b655433004221e4456d6cd8cdf5740196f",
          writerRef: "autobase-writer:70d13f7ee7773d745300ca7178a9bbf643276d3311a31bf6d63d5d8b4a0d6693",
          sourceRequestId: "compatible-layer-report-only-seam-request:two-device-public-client:v0",
          sourceRequestHash: "sha256:329f6154dcf79612c1287cfe1a160f3c19bdf7b973cc455c02be3690124d3e7a",
          validationIssues: [],
        },
      ],
      layerWriterRef: null,
      autobaseKey: "bfe596e9381a81a9b37b82a4c9abe864d1518500688d687a08aa027d333fc622",
      topicHex: "a4d774d58afe44c5736a4430aecf92fa73633af1c582b7c98f892c1306777f57",
      participantResultRef: "proof-artifacts/layer-convergence-20260604T040145Z/layer-participant-result.json",
    },
    expectedNonClaims: {
      readOnly: true,
      reportOnly: true,
      mutatesLayer: false,
      admitsEvidence: false,
      grantsAuthority: false,
      rbcEnforced: false,
      meshPublished: false,
      productionDurabilityClaimed: false,
    },
    operationProof: {
      builtFromClassificationOnly: true,
      sourceRefsPreserved: true,
      realDeviceBoundaryProofConsumed: true,
      syntheticFixtureOnly: false,
      noLayerRuntimeImportRequired: true,
      noLayerMutation: true,
      noAuthorityGrant: true,
      noRbcEnforcement: true,
    },
    nextAdjacentRepoAction: "edge_or_causal_consume_layer_device_boundary_handoff_packet",
    nextPosture: "handoff_layer_device_boundary_material_to_edge_or_causal",
    readOnly: true,
    reportOnly: true,
    mutatesLayer: false,
    admitsEvidence: false,
    grantsAuthority: false,
    rbcEnforced: false,
  };
}

function buildEdgeHandoffReadback(): any {
  return {
    artifactKind: "edge_compatible_swarm_seam_handoff_readback",
    readbackMode: "exported_compatible_handoff_material_readback",
    proofBoundary: "handoff_export_file_readback_only",
    compatibleContractReady: true,
    compatibleContractStatus: "compatible_handoff_contract_ready_for_adjacent_observation",
    strongestProofRung: "consumer_handoff_seam",
    proofRungNotUpgraded: true,
    handoffEntries: [
      {
        sourceRepo: "mesh-ecology-edge",
        targetRepo: "mesh-ecology-layer",
        requestId: "edge-compatible-request:fresh-edge-727bf1f9",
        requestHash: `sha256:${"4".repeat(64)}`,
        receiptId: "edge-compatible-receipt:fresh-edge-727bf1f9",
        receiptHash: `sha256:${"5".repeat(64)}`,
        durableRefs: {
          handoffFeed: "edge-handoff-feed:fresh-edge-727bf1f9",
          sourceReadback: "edge-exported-readback:fresh-edge-727bf1f9",
        },
        writerRefs: {
          edgeWriterRef: "edge-compatible-writer:fresh-edge-727bf1f9",
          layerWriterRef: "layer-compatible-writer:fresh-edge-727bf1f9",
        },
        strongestProofRung: "consumer_handoff_seam",
        linkageStatus: {
          linkedPairCount: 1,
          requestReceiptLinked: true,
        },
        nonClaims: {
          doesNotRunLayer: true,
          doesNotUpgradeProofRung: true,
          doesNotAdmitLayerEvidence: true,
          doesNotClaimCausalTruth: true,
          doesNotGrantAuthority: true,
        },
      },
    ],
    nonClaimFlags: {
      doesNotRunLayer: true,
      doesNotUpgradeProofRung: true,
      doesNotAdmitLayerEvidence: true,
      doesNotClaimCausalTruth: true,
      doesNotGrantAuthority: true,
    },
  };
}

function buildEdgePublicProcessExport({ linked }: { linked: boolean }): any {
  const requestIds = linked ? ["edge-public-process-request:smoke"] : [];
  const requestHashes = linked ? [`sha256:${"8".repeat(64)}`] : [];
  const receiptIds = linked ? ["layer-public-process-receipt:smoke"] : [];
  const receiptHashes = linked ? [`sha256:${"9".repeat(64)}`] : [];
  return {
    artifactKind: "edge_compatible_swarm_seam_public_process_export",
    schemaVersion: "edge-compatible-swarm-seam-public-process-export.v0",
    targetConsumers: ["causal-substrate", "spine"],
    exportMode: "edge_public_process_lifecycle_visibility_for_adjacent_material_consumption",
    sourceProcessReadbackRef: "edge-compatible-swarm-seam-public-process-readback:live-process",
    sourceProcessCardRef: "edge-compatible-swarm-seam-public-process-card:live-process",
    namespace: "edge-live-public-process-smoke",
    autobaseKey: "edge-live-process-autobase",
    latestEndpointDescriptorRef: "edge-compatible-endpoint-descriptor:layer-current-live-public-seam:smoke",
    latestTargetRepo: "mesh-ecology-layer",
    latestProcessStatus: linked
      ? "edge_public_process_probe_result_linked"
      : "edge_public_process_needs_inspection",
    sourceProofRung: linked ? "swarm_discovered_peer" : "saved_readback_seam",
    operationProofRung: "saved_readback_seam",
    proofBoundary: "edge_public_process_export_over_reopened_lifecycle_feed",
    proofRungNotUpgraded: true,
    defaultPublicAttemptCount: 1,
    probeFailureCount: 0,
    deviceBoundaryRequiredCount: 0,
    deviceBoundaryObservedCount: 0,
    damagedOrUnresolvedVisible: !linked,
    requestIds,
    requestHashes,
    receiptIds,
    receiptHashes,
    writerRefs: ["autobase-writer:edge-live-process"],
    durableFeedReadbackRefs: [
      "edge-compatible-swarm-seam-public-process-readback:live-process",
      "edge-live-process-autobase",
      `sha256:${"a".repeat(64)}`,
    ],
    processReadback: {
      artifactKind: "edge_compatible_swarm_seam_public_process_readback",
      entries: [
        {
          eventType: "probe_result",
          endpointDescriptorRef: "edge-compatible-endpoint-descriptor:layer-current-live-public-seam:smoke",
          targetRepo: "mesh-ecology-layer",
          defaultPublicHyperDhtAttempted: true,
          operationProofRung: linked ? "swarm_discovered_peer" : "not_proven",
          packetId: "compatible-public-seam-process-event:live-probe",
          journalEventHash: `sha256:${"a".repeat(64)}`,
          journalWriterRef: "autobase-writer:edge-live-process",
          linkedPairCount: linked ? 1 : 0,
        },
      ],
    },
    processCard: {
      latestTargetRepo: "mesh-ecology-layer",
      latestProcessStatus: linked
        ? "edge_public_process_probe_result_linked"
        : "edge_public_process_needs_inspection",
      strongestProofRung: linked ? "swarm_discovered_peer" : "saved_readback_seam",
    },
    operationProof: {
      causalObservationRan: false,
      publicDeviceBoundaryClaimedByEdge: false,
      layerAdmissionOccurred: false,
      causalTruthClaimed: false,
      rbcEnforced: false,
      authorityGrantOccurred: false,
    },
    readOnly: true,
    reportOnly: true,
    mutatesLayer: false,
    mutatesRepo: false,
    admitsEvidence: false,
    acceptsResult: false,
    executesWork: false,
    grantsAuthority: false,
    rbcEnforced: false,
    nonClaimFlags: {
      exportDoesNotRunCausal: true,
      exportDoesNotAdmitLayerEvidence: true,
      exportDoesNotClaimCausalTruth: true,
      exportDoesNotGrantAuthority: true,
      exportDoesNotClaimProductionDurability: true,
    },
  };
}
