import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot,
  assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback,
  assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixture,
  assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback,
  buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot,
  buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback,
  buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture,
  buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback,
  buildEdgeLayerSeamHistoryObservationResult,
  buildLayerReceiptRuntimeEvidenceObservation,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_ARTIFACT_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_ARTIFACT_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_SCHEMA,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_SCHEMA,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_ARTIFACT_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_ARTIFACT_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_SCHEMA,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-31T15:00:00.000Z";
const execFileAsync = promisify(execFile);

function seamHistoryMaterial() {
  return {
    artifactKind: "edge_layer_seam_history_material",
    schemaVersion: "edge-layer-seam-history-material.v0",
    historyId: "layer-owned-edge-seam-status:adjacent-fixture",
    historyHash: `sha256:${"8".repeat(64)}`,
    sourceRepos: ["mesh-ecology-edge", "mesh-ecology-layer"],
    pairs: [
      {
        request: {
          sourceRepo: "mesh-ecology-edge",
          requestId: "edge-layer-report-only-seam-request:runtime-evidence:linked",
          requestHash: `sha256:${"3".repeat(64)}`,
          durableRef: "corestore:edge-runtime-requests:request:linked",
          writerRef: "autobase-writer:edge-runtime-requests",
        },
        receipt: {
          sourceRepo: "mesh-ecology-layer",
          receiptId: "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
          receiptHash: `sha256:${"2".repeat(64)}`,
          sourceRequestId: "edge-layer-report-only-seam-request:runtime-evidence:linked",
          sourceRequestHash: `sha256:${"3".repeat(64)}`,
          durableRef: "corestore:layer-runtime-receipts:receipt:linked",
          writerRef: "autobase-writer:layer-runtime-receipts",
        },
        linkage: {
          linked: true,
          source: "receipt_source_request_refs",
        },
      },
      {
        request: {
          sourceRepo: "mesh-ecology-edge",
          requestId: "edge-layer-report-only-seam-request:runtime-evidence:damaged",
          requestHash: `sha256:${"5".repeat(64)}`,
          durableRef: "corestore:edge-runtime-requests:request:damaged",
          writerRef: "autobase-writer:edge-runtime-requests",
        },
        receipt: {
          sourceRepo: "mesh-ecology-layer",
          receiptId: "layer-report-only-edge-seam-receipt:runtime-evidence:damaged",
          receiptHash: `sha256:${"6".repeat(64)}`,
          sourceRequestId: "edge-layer-report-only-seam-request:runtime-evidence:damaged",
          sourceRequestHash: `sha256:${"7".repeat(64)}`,
          durableRef: "corestore:layer-runtime-receipts:receipt:damaged",
          writerRef: "autobase-writer:layer-runtime-receipts",
        },
        linkage: {
          linked: true,
          source: "receipt_source_request_refs",
        },
      },
    ],
  };
}

function layerReceiptRuntimeEvidenceReport() {
  return {
    artifactKind: "layer_receipt_runtime_evidence_report",
    schemaVersion: "layer-receipt-runtime-evidence-report.v0",
    sourceRepo: "mesh-ecology-layer",
    sourceRepos: ["mesh-ecology-layer", "mesh-ecology-edge"],
    reportId: "layer-receipt-runtime-evidence-report:edge-layer-seam:linked",
    reportHash: `sha256:${"1".repeat(64)}`,
    sourceRefs: [
      "layer-receipt-runtime-evidence-report:edge-layer-seam:linked",
      `sha256:${"1".repeat(64)}`,
      "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
      `sha256:${"2".repeat(64)}`,
      "edge-layer-report-only-seam-request:runtime-evidence:linked",
      `sha256:${"3".repeat(64)}`,
      "corestore:layer-runtime-receipts:receipt:linked",
      "autobase-writer:layer-runtime-receipts",
      "layer-receipt-runtime-trace:linked",
    ],
    receipt: {
      receiptId: "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
      receiptHash: `sha256:${"2".repeat(64)}`,
      sourceRequestId: "edge-layer-report-only-seam-request:runtime-evidence:linked",
      sourceRequestHash: `sha256:${"3".repeat(64)}`,
      durableRef: "corestore:layer-runtime-receipts:receipt:linked",
      writerRef: "autobase-writer:layer-runtime-receipts",
    },
    runtimeEvidence: {
      runtimeEvidenceId: "layer-receipt-runtime-evidence:linked",
      runtimeEvidenceHash: `sha256:${"4".repeat(64)}`,
      runtimeTraceRef: "layer-receipt-runtime-trace:linked",
      durableReceiptRef: "corestore:layer-runtime-receipts:receipt:linked",
    },
    posture: {
      layerEvidenceAdmitted: false,
      layerAdmissionDecided: false,
      rbcInterpreted: false,
      authorityGranted: false,
      canonicalHistoryClaimed: false,
    },
    boundary: {
      reportOnly: true,
      admitsLayerEvidence: false,
      decidesLayerAdmission: false,
      interpretsRbc: false,
      grantsAuthority: false,
      claimsCanonicalHistory: false,
    },
    nonClaims: {
      layerEvidenceAdmitted: false,
      layerAdmissionDecided: false,
      rbcInterpreted: false,
      authorityGranted: false,
      canonicalHistoryClaimed: false,
    },
  };
}

test("combined seam-history and Layer receipt adjacent fixture preserves matching refs without overclaims", () => {
  const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: EMITTED_AT,
    sourcePath: "layer-owned-edge-seam-status:adjacent-fixture",
  });
  const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: "2026-05-31T15:00:01.000Z",
  });

  const fixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    emittedAt: "2026-05-31T15:00:02.000Z",
  });

  assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixture(fixture);
  assert.equal(fixture.artifactKind, CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_ARTIFACT_KIND);
  assert.equal(fixture.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_SCHEMA);
  assert.equal(fixture.reviewStatus, "edge-layer-seam-history-layer-receipt-adjacent-fixture-ready");
  assert.equal(fixture.source.seamHistoryObservationArtifactId, seamObservation.artifactId);
  assert.equal(fixture.source.layerReceiptObservationArtifactId, layerReceiptObservation.artifactId);
  assert.equal(fixture.source.seamHistoryProofLabel, "local_supplied_material");
  assert.equal(fixture.source.layerReceiptProofLabel, "local_supplied_layer_receipt_runtime_evidence");
  assert.equal(fixture.correlation.receiptRefMatched, true);
  assert.equal(fixture.correlation.sourceRequestRefMatched, true);
  assert.deepEqual(fixture.correlation.matchedReceiptIds, [
    "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
  ]);
  assert.deepEqual(fixture.correlation.matchedReceiptHashes, [`sha256:${"2".repeat(64)}`]);
  assert.deepEqual(fixture.correlation.matchedRequestIds, [
    "edge-layer-report-only-seam-request:runtime-evidence:linked",
  ]);
  assert.deepEqual(fixture.correlation.matchedRequestHashes, [`sha256:${"3".repeat(64)}`]);
  assert.ok(fixture.correlation.preservedSourceRepos.includes("mesh-ecology-edge"));
  assert.ok(fixture.correlation.preservedSourceRepos.includes("mesh-ecology-layer"));
  assert.ok(fixture.correlation.preservedSourceRefs.includes("corestore:layer-runtime-receipts:receipt:linked"));
  assert.ok(fixture.correlation.preservedSourceRefs.includes("autobase-writer:layer-runtime-receipts"));
  assert.equal(
    fixture.proof.strongestProofRung,
    "local_causal_observation_over_supplied_adjacent_observation_artifacts",
  );
  assert.equal(fixture.proof.dhtOrHyperswarmInputObservedByThisOperation, false);
  assert.equal(fixture.proof.doesNotUpgradeSourceProof, true);
  assert.equal(fixture.validation.seamHistoryObservationConsumed, true);
  assert.equal(fixture.validation.layerReceiptObservationConsumed, true);
  assert.equal(fixture.validation.matchingReceiptRefsPreserved, true);
  assert.equal(fixture.validation.matchingRequestRefsPreserved, true);
  assert.equal(fixture.validation.sourceRefsPreserved, true);
  assert.deepEqual(fixture.validation.issues, []);
  assert.equal(fixture.nonClaims.canonicalHistoryAccepted, false);
  assert.equal(fixture.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(fixture.nonClaims.layerAdmissionDecided, false);
  assert.equal(fixture.nonClaims.rbcInterpreted, false);
  assert.equal(fixture.nonClaims.authorityGranted, false);
  assert.equal(fixture.boundary.fixtureOnly, true);
  assert.equal(fixture.boundary.readsObservationArtifactsOnly, true);
  assert.equal(fixture.boundary.callsLayer, false);
  assert.equal(fixture.boundary.opensLayerRuntime, false);
  assert.equal(fixture.boundary.writesLayerEvidence, false);
  assert.equal(fixture.boundary.acceptsCanonicalHistory, false);
  assert.equal(fixture.boundary.admitsLayerEvidence, false);
  assert.equal(fixture.boundary.decidesLayerAdmission, false);
  assert.equal(fixture.boundary.interpretsRbc, false);
  assert.equal(fixture.boundary.grantsAuthority, false);
  assert.equal(fixture.boundary.publishesToMesh, false);
  assert.deepEqual(fixture.rejections, []);
});

test("combined Edge Layer consumer contract snapshot carries seam classifications and Layer runtime refs only", () => {
  const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: EMITTED_AT,
    sourcePath: "layer-owned-edge-seam-status:edge-layer-consumer-snapshot",
  });
  const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: "2026-05-31T15:00:03.000Z",
  });
  const adjacentFixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    emittedAt: "2026-05-31T15:00:04.000Z",
  });

  const snapshot = buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    adjacentFixture,
    emittedAt: "2026-05-31T15:00:05.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot(snapshot);
  assert.equal(snapshot.artifactKind, CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_ARTIFACT_KIND);
  assert.equal(snapshot.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_SCHEMA);
  assert.equal(snapshot.reviewStatus, "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-ready");
  assert.equal(snapshot.source.seamHistoryObservationArtifactId, seamObservation.artifactId);
  assert.equal(snapshot.source.layerReceiptObservationArtifactId, layerReceiptObservation.artifactId);
  assert.equal(snapshot.source.adjacentFixtureArtifactId, adjacentFixture.artifactId);
  assert.equal(snapshot.source.seamHistoryProofLabel, "local_supplied_material");
  assert.equal(snapshot.source.layerReceiptProofLabel, "local_supplied_layer_receipt_runtime_evidence");
  assert.equal(
    snapshot.source.adjacentFixtureProofLabel,
    "local_supplied_seam_history_layer_receipt_adjacent_fixture",
  );
  assert.equal(snapshot.contract.contractKind, "edge_layer_seam_history_layer_receipt_consumer_contract_snapshot");
  assert.equal(snapshot.contract.consumeAs, "causal_observation_snapshot_only");
  assert.equal(snapshot.contract.seamClassifications.compatibilityBasis, "request_receipt_linkage_only");
  assert.equal(snapshot.contract.seamClassifications.compatibleObservationIds.length, 1);
  assert.equal(snapshot.contract.seamClassifications.unresolvedOrDamagedObservationIds.length, 1);
  assert.deepEqual(snapshot.contract.layerRuntimeRefs, {
    receiptId: "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
    receiptHash: `sha256:${"2".repeat(64)}`,
    sourceRequestId: "edge-layer-report-only-seam-request:runtime-evidence:linked",
    sourceRequestHash: `sha256:${"3".repeat(64)}`,
    runtimeEvidenceId: "layer-receipt-runtime-evidence:linked",
    runtimeEvidenceHash: `sha256:${"4".repeat(64)}`,
    runtimeTraceRef: "layer-receipt-runtime-trace:linked",
    durableReceiptRef: "corestore:layer-runtime-receipts:receipt:linked",
  });
  assert.deepEqual(snapshot.contract.adjacentMatchedRefs.matchedReceiptIds, [
    "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
  ]);
  assert.deepEqual(snapshot.contract.adjacentMatchedRefs.matchedRequestIds, [
    "edge-layer-report-only-seam-request:runtime-evidence:linked",
  ]);
  assert.ok(snapshot.contract.preservedSourceRefs.sourceRepos.includes("mesh-ecology-edge"));
  assert.ok(snapshot.contract.preservedSourceRefs.sourceRepos.includes("mesh-ecology-layer"));
  assert.ok(snapshot.contract.preservedSourceRefs.sourceRefs.includes("corestore:layer-runtime-receipts:receipt:linked"));
  assert.equal(
    snapshot.proof.strongestProofRung,
    "local_causal_observation_over_supplied_edge_layer_observation_artifacts",
  );
  assert.equal(snapshot.proof.normalizedProofLabel, "local_supplied_edge_layer_consumer_contract_snapshot");
  assert.equal(snapshot.proof.dhtOrHyperswarmInputObservedByThisOperation, false);
  assert.equal(snapshot.proof.doesNotUpgradeSourceProof, true);
  assert.equal(snapshot.validation.seamHistoryObservationConsumed, true);
  assert.equal(snapshot.validation.layerReceiptObservationConsumed, true);
  assert.equal(snapshot.validation.adjacentFixtureConsumed, true);
  assert.equal(snapshot.validation.compatibleClassificationPreserved, true);
  assert.equal(snapshot.validation.unresolvedOrDamagedClassificationPreserved, true);
  assert.equal(snapshot.validation.layerRuntimeRefsPreserved, true);
  assert.equal(snapshot.validation.adjacentMatchedRefsPreserved, true);
  assert.equal(snapshot.validation.sourceRefsPreserved, true);
  assert.deepEqual(snapshot.validation.issues, []);
  assert.equal(snapshot.nonClaims.canonicalHistoryAccepted, false);
  assert.equal(snapshot.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(snapshot.nonClaims.layerAdmissionDecided, false);
  assert.equal(snapshot.nonClaims.rbcInterpreted, false);
  assert.equal(snapshot.nonClaims.authorityGranted, false);
  assert.equal(snapshot.boundary.snapshotOnly, true);
  assert.equal(snapshot.boundary.edgeMayConsume, true);
  assert.equal(snapshot.boundary.layerMayConsume, true);
  assert.equal(snapshot.boundary.opensEdgeRuntime, false);
  assert.equal(snapshot.boundary.opensLayerRuntime, false);
  assert.equal(snapshot.boundary.callsEdge, false);
  assert.equal(snapshot.boundary.callsLayer, false);
  assert.equal(snapshot.boundary.writesEdgeProjection, false);
  assert.equal(snapshot.boundary.writesLayerEvidence, false);
  assert.equal(snapshot.boundary.acceptsCanonicalHistory, false);
  assert.equal(snapshot.boundary.admitsLayerEvidence, false);
  assert.equal(snapshot.boundary.decidesLayerAdmission, false);
  assert.equal(snapshot.boundary.interpretsRbc, false);
  assert.equal(snapshot.boundary.grantsAuthority, false);
  assert.equal(snapshot.boundary.publishesToMesh, false);
  assert.equal(snapshot.boundary.writesProductionContinuity, false);
});

test("combined Edge Layer consumer contract snapshot stays incomplete when adjacent refs are not matched", () => {
  const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: EMITTED_AT,
    sourcePath: "layer-owned-edge-seam-status:edge-layer-consumer-snapshot-incomplete",
  });
  const layerReport = layerReceiptRuntimeEvidenceReport();
  layerReport.receipt.receiptHash = `sha256:${"f".repeat(64)}`;
  const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReport,
    emittedAt: "2026-05-31T15:00:06.000Z",
  });
  const adjacentFixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    emittedAt: "2026-05-31T15:00:07.000Z",
  });

  const snapshot = buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    adjacentFixture,
    emittedAt: "2026-05-31T15:00:08.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot(snapshot);
  assert.equal(snapshot.reviewStatus, "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-incomplete");
  assert.equal(snapshot.validation.compatibleClassificationPreserved, true);
  assert.equal(snapshot.validation.unresolvedOrDamagedClassificationPreserved, true);
  assert.equal(snapshot.validation.layerRuntimeRefsPreserved, true);
  assert.equal(snapshot.validation.adjacentMatchedRefsPreserved, false);
  assert.ok(snapshot.validation.issues.includes("adjacent-matched-refs-not-preserved"));
  assert.equal(snapshot.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(snapshot.nonClaims.rbcInterpreted, false);
  assert.equal(snapshot.nonClaims.authorityGranted, false);
  assert.equal(snapshot.boundary.writesEdgeProjection, false);
  assert.equal(snapshot.boundary.writesLayerEvidence, false);
  assert.equal(snapshot.boundary.admitsLayerEvidence, false);
  assert.equal(snapshot.boundary.interpretsRbc, false);
  assert.equal(snapshot.boundary.grantsAuthority, false);
});

test("combined Edge Layer consumer contract snapshot readback preserves classifications refs and non-claims", () => {
  const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: EMITTED_AT,
    sourcePath: "layer-owned-edge-seam-status:edge-layer-consumer-snapshot-readback",
  });
  const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: "2026-05-31T15:04:01.000Z",
  });
  const adjacentFixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    emittedAt: "2026-05-31T15:04:02.000Z",
  });
  const snapshot = buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    adjacentFixture,
    emittedAt: "2026-05-31T15:04:03.000Z",
  });
  const roundTripped = JSON.parse(JSON.stringify(snapshot)) as unknown;

  const readback = buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback({
    snapshot: roundTripped,
    emittedAt: "2026-05-31T15:04:04.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback(readback);
  assert.equal(
    readback.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_ARTIFACT_KIND,
  );
  assert.equal(
    readback.schema,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_SCHEMA,
  );
  assert.equal(
    readback.reviewStatus,
    "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-valid",
  );
  assert.equal(readback.source.sourceSnapshotArtifactId, snapshot.artifactId);
  assert.equal(readback.source.sourceSnapshotStatus, "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-ready");
  assert.equal(readback.source.seamHistoryObservationArtifactId, seamObservation.artifactId);
  assert.equal(readback.source.layerReceiptObservationArtifactId, layerReceiptObservation.artifactId);
  assert.equal(readback.source.adjacentFixtureArtifactId, adjacentFixture.artifactId);
  assert.equal(readback.source.snapshotProofLabel, "local_supplied_edge_layer_consumer_contract_snapshot");
  assert.equal(readback.readback.snapshotReadable, true);
  assert.equal(readback.readback.snapshotValid, true);
  assert.equal(readback.readback.sourceObservationRefsPreserved, true);
  assert.equal(readback.readback.seamClassificationsPreserved, true);
  assert.equal(readback.readback.layerRuntimeRefsPreserved, true);
  assert.equal(readback.readback.adjacentMatchedRefsPreserved, true);
  assert.equal(readback.readback.sourceRefsPreserved, true);
  assert.equal(readback.readback.proofLabelsPreserved, true);
  assert.equal(readback.readback.nonClaimsPreserved, true);
  assert.deepEqual(
    readback.preservedRefs.compatibleObservationIds,
    snapshot.contract.seamClassifications.compatibleObservationIds,
  );
  assert.deepEqual(
    readback.preservedRefs.unresolvedOrDamagedObservationIds,
    snapshot.contract.seamClassifications.unresolvedOrDamagedObservationIds,
  );
  assert.deepEqual(readback.preservedRefs.layerRuntimeRefs, snapshot.contract.layerRuntimeRefs);
  assert.deepEqual(readback.preservedRefs.matchedReceiptIds, [
    "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
  ]);
  assert.deepEqual(readback.preservedRefs.matchedReceiptHashes, [`sha256:${"2".repeat(64)}`]);
  assert.deepEqual(readback.preservedRefs.matchedRequestIds, [
    "edge-layer-report-only-seam-request:runtime-evidence:linked",
  ]);
  assert.deepEqual(readback.preservedRefs.matchedRequestHashes, [`sha256:${"3".repeat(64)}`]);
  assert.ok(readback.preservedRefs.preservedSourceRepos.includes("mesh-ecology-edge"));
  assert.ok(readback.preservedRefs.preservedSourceRepos.includes("mesh-ecology-layer"));
  assert.ok(readback.preservedRefs.preservedSourceRefs.includes("corestore:layer-runtime-receipts:receipt:linked"));
  assert.equal(readback.validation.snapshotArtifactConsumed, true);
  assert.equal(readback.validation.noCanonicalHistoryClaim, true);
  assert.equal(readback.validation.noLayerAdmissionClaim, true);
  assert.equal(readback.validation.noLayerEvidenceAdmissionClaim, true);
  assert.equal(readback.validation.noRbcInterpretationClaim, true);
  assert.equal(readback.validation.noAuthorityClaim, true);
  assert.deepEqual(readback.validation.issues, []);
  assert.equal(readback.boundary.readbackOnly, true);
  assert.equal(readback.boundary.writesSnapshot, false);
  assert.equal(readback.boundary.opensEdgeRuntime, false);
  assert.equal(readback.boundary.opensLayerRuntime, false);
  assert.equal(readback.boundary.writesEdgeProjection, false);
  assert.equal(readback.boundary.writesLayerEvidence, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
  assert.equal(readback.boundary.publishesToMesh, false);
});

test("combined Edge Layer consumer contract snapshot readback rejects weakened refs", () => {
  const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: EMITTED_AT,
    sourcePath: "layer-owned-edge-seam-status:edge-layer-consumer-snapshot-readback-negative",
  });
  const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: "2026-05-31T15:05:01.000Z",
  });
  const adjacentFixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    emittedAt: "2026-05-31T15:05:02.000Z",
  });
  const snapshot = buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    adjacentFixture,
    emittedAt: "2026-05-31T15:05:03.000Z",
  });
  const weakened = JSON.parse(JSON.stringify(snapshot)) as any;
  weakened.contract.seamClassifications.compatibleObservationIds = [];
  delete weakened.contract.layerRuntimeRefs.runtimeEvidenceHash;
  weakened.contract.adjacentMatchedRefs.matchedReceiptHashes = [];
  weakened.contract.preservedSourceRefs.sourceRefs = [];

  const readback = buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback({
    snapshot: weakened,
    emittedAt: "2026-05-31T15:05:04.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback(readback);
  assert.equal(
    readback.reviewStatus,
    "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-invalid",
  );
  assert.equal(readback.validation.snapshotArtifactConsumed, true);
  assert.equal(readback.validation.seamClassificationsPreserved, false);
  assert.equal(readback.validation.layerRuntimeRefsPreserved, false);
  assert.equal(readback.validation.adjacentMatchedRefsPreserved, false);
  assert.equal(readback.validation.sourceRefsPreserved, false);
  assert.equal(readback.validation.proofLabelsPreserved, true);
  assert.equal(readback.validation.nonClaimsPreserved, true);
  assert.ok(readback.validation.issues.includes("seam-classifications-not-preserved"));
  assert.ok(readback.validation.issues.includes("layer-runtime-refs-not-preserved"));
  assert.ok(readback.validation.issues.includes("adjacent-matched-refs-not-preserved"));
  assert.ok(readback.validation.issues.includes("source-refs-not-preserved"));
  assert.equal(readback.boundary.readbackOnly, true);
  assert.equal(readback.boundary.writesEdgeProjection, false);
  assert.equal(readback.boundary.writesLayerEvidence, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
});

test("combined Edge Layer consumer contract snapshot readback CLI writes readback artifact from disk", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-edge-layer-snapshot-readback-"));
  const snapshotPath = path.join(tempRoot, "edge-layer-consumer-contract-snapshot.json");
  const readbackPath = path.join(tempRoot, "edge-layer-consumer-contract-snapshot-readback.json");
  try {
    const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory: seamHistoryMaterial(),
      emittedAt: EMITTED_AT,
      sourcePath: "layer-owned-edge-seam-status:edge-layer-consumer-snapshot-readback-cli",
    });
    const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
      layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
      emittedAt: "2026-05-31T15:06:01.000Z",
    });
    const adjacentFixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
      seamHistoryObservation: seamObservation,
      layerReceiptObservation,
      emittedAt: "2026-05-31T15:06:02.000Z",
    });
    const snapshot = buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot({
      seamHistoryObservation: seamObservation,
      layerReceiptObservation,
      adjacentFixture,
      emittedAt: "2026-05-31T15:06:03.000Z",
    });
    await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/readback-edge-layer-consumer-contract-snapshot.ts",
      "--input-snapshot",
      snapshotPath,
      "--readback-output",
      readbackPath,
      "--emitted-at",
      "2026-05-31T15:06:04.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const readback = JSON.parse(await readFile(readbackPath, "utf8"));
    assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback(readback);
    assert.equal(
      readback.reviewStatus,
      "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-valid",
    );
    assert.equal(readback.source.sourceSnapshotArtifactId, snapshot.artifactId);
    assert.equal(readback.source.seamHistoryObservationArtifactId, seamObservation.artifactId);
    assert.equal(readback.source.layerReceiptObservationArtifactId, layerReceiptObservation.artifactId);
    assert.equal(readback.source.adjacentFixtureArtifactId, adjacentFixture.artifactId);
    assert.equal(readback.validation.snapshotArtifactConsumed, true);
    assert.equal(readback.validation.seamClassificationsPreserved, true);
    assert.equal(readback.validation.layerRuntimeRefsPreserved, true);
    assert.equal(readback.validation.adjacentMatchedRefsPreserved, true);
    assert.equal(readback.validation.sourceRefsPreserved, true);
    assert.equal(readback.validation.proofLabelsPreserved, true);
    assert.equal(readback.validation.nonClaimsPreserved, true);
    assert.equal(readback.boundary.readbackOnly, true);
    assert.equal(readback.boundary.writesSnapshot, false);
    assert.equal(readback.boundary.admitsLayerEvidence, false);
    assert.equal(readback.boundary.interpretsRbc, false);
    assert.equal(readback.boundary.grantsAuthority, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("combined seam-history and Layer receipt adjacent fixture stays incomplete when refs do not match", () => {
  const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: EMITTED_AT,
    sourcePath: "layer-owned-edge-seam-status:adjacent-fixture",
  });
  const layerReport = layerReceiptRuntimeEvidenceReport();
  layerReport.receipt.receiptHash = `sha256:${"f".repeat(64)}`;
  const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReport,
    emittedAt: "2026-05-31T15:01:01.000Z",
  });

  const fixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    emittedAt: "2026-05-31T15:01:02.000Z",
  });

  assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixture(fixture);
  assert.equal(fixture.reviewStatus, "edge-layer-seam-history-layer-receipt-adjacent-fixture-incomplete");
  assert.equal(fixture.correlation.receiptRefMatched, false);
  assert.equal(fixture.correlation.sourceRequestRefMatched, false);
  assert.ok(fixture.validation.issues.includes("matching-receipt-refs-not-found"));
  assert.ok(fixture.validation.issues.includes("matching-request-refs-not-found"));
  assert.equal(fixture.boundary.admitsLayerEvidence, false);
  assert.equal(fixture.boundary.interpretsRbc, false);
  assert.equal(fixture.boundary.grantsAuthority, false);
});

test("adjacent fixture readback preserves matched refs and non-claims across JSON round trip", () => {
  const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: EMITTED_AT,
    sourcePath: "layer-owned-edge-seam-status:adjacent-fixture-readback",
  });
  const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: "2026-05-31T15:02:01.000Z",
  });
  const fixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    emittedAt: "2026-05-31T15:02:02.000Z",
  });
  const roundTripped = JSON.parse(JSON.stringify(fixture)) as unknown;

  const readback = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback({
    fixture: roundTripped,
    emittedAt: "2026-05-31T15:02:03.000Z",
  });

  assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback(readback);
  assert.equal(readback.artifactKind, CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_ARTIFACT_KIND);
  assert.equal(readback.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_SCHEMA);
  assert.equal(readback.reviewStatus, "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-valid");
  assert.equal(readback.source.sourceFixtureArtifactId, fixture.artifactId);
  assert.equal(readback.source.sourceFixtureStatus, "edge-layer-seam-history-layer-receipt-adjacent-fixture-ready");
  assert.equal(readback.source.seamHistoryObservationArtifactId, seamObservation.artifactId);
  assert.equal(readback.source.layerReceiptObservationArtifactId, layerReceiptObservation.artifactId);
  assert.equal(readback.source.fixtureProofLabel, "local_supplied_seam_history_layer_receipt_adjacent_fixture");
  assert.equal(readback.readback.fixtureReadable, true);
  assert.equal(readback.readback.fixtureValid, true);
  assert.equal(readback.readback.sourceObservationRefsPreserved, true);
  assert.equal(readback.readback.matchedReceiptRefsPreserved, true);
  assert.equal(readback.readback.matchedRequestRefsPreserved, true);
  assert.equal(readback.readback.sourceReposPreserved, true);
  assert.equal(readback.readback.sourceRefsPreserved, true);
  assert.equal(readback.readback.proofLabelsPreserved, true);
  assert.equal(readback.readback.nonClaimsPreserved, true);
  assert.deepEqual(readback.preservedRefs.matchedReceiptIds, [
    "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
  ]);
  assert.deepEqual(readback.preservedRefs.matchedReceiptHashes, [`sha256:${"2".repeat(64)}`]);
  assert.deepEqual(readback.preservedRefs.matchedRequestIds, [
    "edge-layer-report-only-seam-request:runtime-evidence:linked",
  ]);
  assert.deepEqual(readback.preservedRefs.matchedRequestHashes, [`sha256:${"3".repeat(64)}`]);
  assert.ok(readback.preservedRefs.preservedSourceRepos.includes("mesh-ecology-edge"));
  assert.ok(readback.preservedRefs.preservedSourceRepos.includes("mesh-ecology-layer"));
  assert.ok(readback.preservedRefs.preservedSourceRefs.includes("corestore:layer-runtime-receipts:receipt:linked"));
  assert.equal(readback.validation.fixtureArtifactConsumed, true);
  assert.equal(readback.validation.noCanonicalHistoryClaim, true);
  assert.equal(readback.validation.noLayerAdmissionClaim, true);
  assert.equal(readback.validation.noRbcInterpretationClaim, true);
  assert.equal(readback.validation.noAuthorityClaim, true);
  assert.deepEqual(readback.validation.issues, []);
  assert.equal(readback.boundary.readbackOnly, true);
  assert.equal(readback.boundary.writesAdjacentFixture, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.decidesLayerAdmission, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
  assert.equal(readback.boundary.publishesToMesh, false);
});

test("adjacent fixture readback rejects weakened refs proof labels and non-claims", () => {
  const seamObservation = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: EMITTED_AT,
    sourcePath: "layer-owned-edge-seam-status:adjacent-fixture-readback-negative",
  });
  const layerReceiptObservation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: "2026-05-31T15:03:01.000Z",
  });
  const fixture = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture({
    seamHistoryObservation: seamObservation,
    layerReceiptObservation,
    emittedAt: "2026-05-31T15:03:02.000Z",
  });
  const weakened = JSON.parse(JSON.stringify(fixture)) as any;
  delete weakened.source.layerReceiptObservationArtifactId;
  weakened.correlation.matchedReceiptHashes = [];
  weakened.correlation.matchedRequestHashes = [];
  weakened.correlation.preservedSourceRefs = [];
  weakened.proof.normalizedProofLabel = "dht_hyperswarm_durable_seam_history_material";
  weakened.nonClaims.rbcInterpreted = true;

  const readback = buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback({
    fixture: weakened,
    emittedAt: "2026-05-31T15:03:03.000Z",
  });

  assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback(readback);
  assert.equal(readback.reviewStatus, "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-invalid");
  assert.equal(readback.validation.fixtureArtifactConsumed, false);
  assert.equal(readback.validation.sourceObservationRefsPreserved, false);
  assert.equal(readback.validation.matchedReceiptRefsPreserved, false);
  assert.equal(readback.validation.matchedRequestRefsPreserved, false);
  assert.equal(readback.validation.sourceRefsPreserved, false);
  assert.equal(readback.validation.proofLabelsPreserved, false);
  assert.equal(readback.validation.nonClaimsPreserved, false);
  assert.ok(readback.validation.issues.includes("adjacent-fixture-invalid"));
  assert.deepEqual(readback.preservedRefs.matchedReceiptIds, []);
  assert.equal(readback.boundary.readbackOnly, true);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
});
