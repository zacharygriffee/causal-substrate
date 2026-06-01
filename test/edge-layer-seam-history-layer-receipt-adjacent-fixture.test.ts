import assert from "node:assert/strict";
import test from "node:test";

import {
  assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixture,
  buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture,
  buildEdgeLayerSeamHistoryObservationResult,
  buildLayerReceiptRuntimeEvidenceObservation,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_ARTIFACT_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-31T15:00:00.000Z";

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
