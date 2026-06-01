import assert from "node:assert/strict";
import test from "node:test";

import {
  assertLayerReceiptRuntimeEvidenceObservation,
  buildLayerReceiptRuntimeEvidenceObservation,
  CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_ARTIFACT_KIND,
  CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-31T14:00:00.000Z";

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

test("Layer receipt runtime evidence is observed as adjacent local material only", () => {
  const observation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: EMITTED_AT,
  });

  assertLayerReceiptRuntimeEvidenceObservation(observation);
  assert.equal(observation.artifactKind, CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_ARTIFACT_KIND);
  assert.equal(observation.schema, CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_SCHEMA);
  assert.equal(observation.reviewStatus, "layer-receipt-runtime-evidence-observation-emitted");
  assert.equal(observation.validation.status, "layer-receipt-runtime-evidence-observation-emitted");
  assert.equal(observation.validation.reportConsumed, true);
  assert.equal(observation.validation.layerSourceRepoPreserved, true);
  assert.equal(observation.validation.reportRefsPreserved, true);
  assert.equal(observation.validation.receiptRefsPreserved, true);
  assert.equal(observation.validation.runtimeRefsPreserved, true);
  assert.equal(observation.validation.durableAndWriterRefsPreserved, true);
  assert.equal(observation.validation.sourceRefsPreserved, true);
  assert.deepEqual(observation.validation.issues, []);
  assert.equal(observation.source.sourceRepo, "mesh-ecology-layer");
  assert.equal(observation.source.sourceReportId, "layer-receipt-runtime-evidence-report:edge-layer-seam:linked");
  assert.equal(observation.source.sourceReportHash, `sha256:${"1".repeat(64)}`);
  assert.equal(observation.receiptRefs.receiptId, "layer-report-only-edge-seam-receipt:runtime-evidence:linked");
  assert.equal(observation.receiptRefs.receiptHash, `sha256:${"2".repeat(64)}`);
  assert.equal(observation.receiptRefs.sourceRequestId, "edge-layer-report-only-seam-request:runtime-evidence:linked");
  assert.equal(observation.receiptRefs.sourceRequestHash, `sha256:${"3".repeat(64)}`);
  assert.equal(observation.receiptRefs.durableRef, "corestore:layer-runtime-receipts:receipt:linked");
  assert.equal(observation.receiptRefs.writerRef, "autobase-writer:layer-runtime-receipts");
  assert.deepEqual(observation.receiptRefs.sourceRepos, ["mesh-ecology-layer", "mesh-ecology-edge"]);
  assert.equal(observation.runtimeRefs.runtimeEvidenceId, "layer-receipt-runtime-evidence:linked");
  assert.equal(observation.runtimeRefs.runtimeEvidenceHash, `sha256:${"4".repeat(64)}`);
  assert.equal(observation.runtimeRefs.runtimeTraceRef, "layer-receipt-runtime-trace:linked");
  assert.equal(
    observation.proof.strongestProofRung,
    "local_causal_observation_over_supplied_layer_receipt_runtime_evidence",
  );
  assert.equal(observation.proof.normalizedProofLabel, "local_supplied_layer_receipt_runtime_evidence");
  assert.equal(observation.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
  assert.equal(observation.nonClaims.canonicalHistoryAccepted, false);
  assert.equal(observation.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(observation.nonClaims.layerAdmissionDecided, false);
  assert.equal(observation.nonClaims.rbcInterpreted, false);
  assert.equal(observation.nonClaims.authorityGranted, false);
  assert.equal(observation.boundary.adjacentInputOnly, true);
  assert.equal(observation.boundary.callsLayer, false);
  assert.equal(observation.boundary.opensLayerRuntime, false);
  assert.equal(observation.boundary.writesLayerEvidence, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.decidesLayerAdmission, false);
  assert.equal(observation.boundary.interpretsRbc, false);
  assert.equal(observation.boundary.acceptsCanonicalHistory, false);
  assert.equal(observation.boundary.grantsAuthority, false);
  assert.equal(observation.deferredAttachmentPoints.layerAdmission.status, "deferred");
  assert.equal(observation.deferredAttachmentPoints.rbcInterpretation.active, false);
  assert.equal(observation.deferredAttachmentPoints.authorityDecision.writes, false);
});
