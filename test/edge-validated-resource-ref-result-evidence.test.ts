import assert from "node:assert/strict";
import test from "node:test";

import {
  assertEdgeValidatedResourceRefResultEvidenceArtifact,
  buildEdgeValidatedResourceRefResultEvidenceArtifact,
  CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA,
  CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

const EMITTED_AT = "2026-05-19T20:00:00.000Z";

function validValidation(): any {
  return {
    artifactKind: "edge_resource_evidence_validation",
    schemaVersion: "edge_resource_evidence_validation.v0",
    validationRef: "edge-resource-evidence-validation:fixture",
    validationStatus: "validated_external_evidence_ref",
    sourcePendingImportRef: "edge-operator-mediated-result-resource-ref-import:fixture",
    sourceResourceRef: "bytes-resource:handoff-result:fixture",
    sourcePointerRef: "bytes_external_resource_pointer:fixture",
    sourceResolutionReceiptRef: "bytes-resource-resolution-receipt:fixture",
    sourceHandoffRef: "edge-operator-mediated-handoff:fixture",
    sourceWorkPacketRef: "edge-cross-project-work-packet:fixture",
    targetRef: "repo-worker-seat:codex",
    validationScope: "operator_mediated_handoff_result_resource_ref_import",
    canTreatAsExternalEvidenceRef: true,
    payloadParsed: false,
    payloadImported: false,
    resultEvidenceCreated: false,
    reviewOnly: true,
    externalEvidenceOnly: true,
    acceptedContinuity: false,
    approvalGranted: false,
    executionAuthorized: false,
    authorityGranted: false,
    bytesAuthority: false,
    writerAdmissionChanged: false,
    edgeStateMigration: false,
    compatibilityRemoved: false,
    nonClaims: {
      validationIsTruth: false,
      validationIsApproval: false,
      validationIsExecution: false,
      validationIsAcceptedContinuity: false,
      validationIsBytesAuthority: false,
    },
    issues: [],
  };
}

function validResultEvidence(): any {
  return {
    artifactKind: "edge_operator_mediated_result_evidence",
    schemaVersion: "edge_operator_mediated_result_evidence.v1",
    evidenceId: "edge-operator-mediated-result-evidence:fixture",
    evidenceState: "recorded_for_review",
    sourceHandoffRef: "edge-operator-mediated-handoff:fixture",
    sourceWorkPacketRef: "edge-cross-project-work-packet:fixture",
    targetRef: "repo-worker-seat:codex",
    resultStatus: "reported",
    resultSummary: "agent supplied bounded review evidence through visible refs",
    receiptRefs: ["bytes-resource-resolution-receipt:fixture"],
    evidenceRefs: [
      "bytes-resource:handoff-result:fixture",
      "bytes_external_resource_pointer:fixture",
      "bytes-resource-resolution-receipt:fixture",
      "edge-resource-evidence-validation:fixture",
    ],
    sourceArtifactRefs: [
      "edge-resource-evidence-validation:fixture",
      "edge-operator-mediated-result-resource-ref-import:fixture",
      "bytes_external_resource_pointer:fixture",
      "bytes-resource-resolution-receipt:fixture",
    ],
    sourceReasonCodes: [
      "validated_external_evidence_ref",
      "payload_not_parsed",
      "payload_not_fetched",
      "success_not_inferred",
      "approval_not_inferred",
      "continuity_not_accepted",
    ],
    correlationRefs: {
      sourceResourceEvidenceValidationRef: "edge-resource-evidence-validation:fixture",
      sourcePendingResourceRefImportRef: "edge-operator-mediated-result-resource-ref-import:fixture",
      sourceResourceRef: "bytes-resource:handoff-result:fixture",
      sourcePointerRef: "bytes_external_resource_pointer:fixture",
      sourceResolutionReceiptRef: "bytes-resource-resolution-receipt:fixture",
      payloadParsed: false,
      payloadFetched: false,
      successInferred: false,
      approvalInferred: false,
      resultReceiptContinuityCreated: false,
      bytesAuthority: false,
    },
    evidenceOnly: true,
    reviewOnly: true,
    operatorMediated: true,
    deliverySuccessClaimed: false,
    executionSuccessClaimed: false,
    adjacentAcceptanceGranted: false,
    truthClaimed: false,
    completionClaimed: false,
    productionProofClaimed: false,
    futureAuthorizationGranted: false,
  };
}

function build(resourceValidation = validValidation(), resultEvidence = validResultEvidence()) {
  return buildEdgeValidatedResourceRefResultEvidenceArtifact({
    resourceValidation,
    resultEvidence,
    emittedAt: EMITTED_AT,
    sourceRepo: "causal-substrate",
    sourcePath: "test/edge-validated-resource-ref-result-evidence.test.ts",
  });
}

test("valid Edge validated resource-ref result evidence emits causal review evidence only", () => {
  const artifact = build();

  assertEdgeValidatedResourceRefResultEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-validated-resource-ref-result-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-validated-resource-ref-result-evidence-complete");
  assert.equal(artifact.sourceValidationRef, "edge-resource-evidence-validation:fixture");
  assert.equal(artifact.sourceResourceRef, "bytes-resource:handoff-result:fixture");
  assert.equal(artifact.sourceResultEvidenceRef, "edge-operator-mediated-result-evidence:fixture");
  assert.equal(artifact.interpretation.resultEvidenceIsExternalOnly, true);
  assert.equal(artifact.interpretation.acceptedContinuity, false);
  assert.equal(artifact.interpretation.resultReceiptContinuity, false);
  assert.equal(artifact.interpretation.bytesAuthority, false);
  assert.equal(artifact.boundary.fetchesPayload, false);
  assert.equal(artifact.boundary.parsesPayload, false);
  assert.deepEqual(artifact.rejections, []);
});

test("validated resource-ref evidence can be reviewed before result evidence exists", () => {
  const artifact = buildEdgeValidatedResourceRefResultEvidenceArtifact({
    resourceValidation: validValidation(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(artifact.reviewStatus, "edge-validated-resource-ref-result-evidence-emitted");
  assert.equal(artifact.validation.resultEvidencePresent, false);
  assert.ok(artifact.warnings.includes("operator-mediated-result-evidence-not-supplied"));
});

test("unsafe payload success approval and continuity claims fail closed", () => {
  const validation = validValidation();
  validation.payloadParsed = true;
  validation.bytesAuthority = true;
  const result = validResultEvidence();
  result.correlationRefs.successInferred = true;
  result.truthClaimed = true;

  const artifact = build(validation, result);

  assert.equal(artifact.reviewStatus, "edge-validated-resource-ref-result-evidence-guardrail-blocked");
  assert.ok(artifact.rejections.includes("payload-parse-or-import-claim"));
  assert.ok(artifact.rejections.includes("unsafe-authority-truth-success-approval-or-continuity-claim"));
  assert.equal(artifact.validation.unsafeClaimsBlocked, false);
});

test("missing refs and unsafe seams fail closed without causal truth", () => {
  const validation = validValidation();
  validation.sourcePointerRef = "http://127.0.0.1/pointer.json";
  validation.sourceResolutionReceiptRef = null;
  const result = validResultEvidence();
  result.correlationRefs.sourceResolutionReceiptRef = null;
  result.receiptRefs = [];

  const artifact = build(validation, result);

  assert.equal(artifact.reviewStatus, "edge-validated-resource-ref-result-evidence-guardrail-blocked");
  assert.ok(artifact.rejections.includes("required-refs-missing"));
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.equal(artifact.boundary.claimsReadiness, false);
});

test("malformed validation remains non-accepted review evidence", () => {
  const artifact = build(null, validResultEvidence());

  assert.equal(artifact.reviewStatus, "edge-validated-resource-ref-result-evidence-malformed");
  assert.equal(artifact.validation.validationArtifactPresent, false);
  assert.deepEqual(artifact.rejections, ["resource-validation-not-object"]);
});
