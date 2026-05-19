import assert from "node:assert/strict";
import test from "node:test";

import {
  assertEdgeOperatorSidecarRepairSuggestionEvidenceArtifact,
  buildEdgeOperatorSidecarRepairSuggestionEvidenceArtifact,
  CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA,
  CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

const EMITTED_AT = "2026-05-19T15:00:00.000Z";

function validSuggestion(): any {
  return {
    artifactKind: "edge_operator_sidecar_repair_suggestion",
    schemaVersion: "edge_operator_sidecar_repair_suggestion.v0",
    suggestionRef: "edge-operator-sidecar-repair-suggestion:fixture",
    createdAt: "2026-05-19T14:59:00.000Z",
    suggestionState: "review_ready",
    reviewOnly: true,
    sourceFailureRef: "edge-self-work-patch-executor-receipt:fixture:failed",
    sourceWorkPacketRef: "edge-cross-project-work-packet:fixture",
    operatorDecisionRef: "edge-operator-decision:fixture",
    agentRunRef: "agent-run:codex:fixture",
    failureKind: "patch_context_mismatch",
    diagnosis: {
      summary: "Patch context no longer matched the target file.",
      reasonCodes: ["patch_context_mismatch"],
    },
    sameScope: true,
    scopeChanged: false,
    targetRefs: ["repo:mesh-ecology-edge"],
    proposedRepairRefs: ["edge-self-work-patch-proposal:fixture:repair"],
    requiresOperatorApproval: true,
    reasonApprovalRequired: "rerun_requires_operator_approval",
    suggestedNextMove: "operator_review_same_scope_repair_before_rerun",
    preservedEvidenceRefs: ["edge-self-work-patch-executor-receipt:fixture:failed"],
    nonClaims: {
      suggestionIsApproval: false,
      suggestionIsExecution: false,
      suggestionIsAuthority: false,
      suggestionIsTruth: false,
      suggestionIsAcceptedContinuity: false,
      sidecarBecomesOperator: false,
      admitsWritersOrReaders: false,
      promotesEventFamilies: false,
      rerunsWorkWithoutApproval: false,
      resultContinuityPromoted: false,
      resultReceiptEventFamilyAccepted: false,
    },
    currentProductionEventFamilies: [
      "repo_work_packet_continuity_event",
      "operator_recorded_local_layer_decision",
    ],
    sourceContinuity: false,
    approvalGranted: false,
    executionAuthorized: false,
    authorityGranted: false,
    truthClaimed: false,
    acceptedContinuity: false,
    automaticRerun: false,
    edgeStateMigration: false,
    compatibilityRemoved: false,
    thirdFamilyPressureIncreased: false,
  };
}

function build(suggestion = validSuggestion()) {
  return buildEdgeOperatorSidecarRepairSuggestionEvidenceArtifact({
    suggestion,
    emittedAt: EMITTED_AT,
    sourceRepo: "causal-substrate",
    sourcePath: "test/edge-operator-sidecar-repair-suggestion-evidence.test.ts",
  });
}

test("valid Edge sidecar repair suggestion emits causal review evidence only", () => {
  const artifact = build();

  assertEdgeOperatorSidecarRepairSuggestionEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-operator-sidecar-repair-suggestion-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-operator-sidecar-repair-suggestion-complete");
  assert.equal(artifact.validation.requiredRefsPresent, true);
  assert.equal(artifact.validation.repairRefsPresent, true);
  assert.equal(artifact.validation.preservedFailureEvidencePresent, true);
  assert.equal(artifact.boundary.reviewOnly, true);
  assert.equal(artifact.boundary.evidenceOnly, true);
  assert.equal(artifact.boundary.callsEdge, false);
  assert.equal(artifact.boundary.executesWork, false);
  assert.equal(artifact.boundary.acceptsContinuity, false);
  assert.equal(artifact.boundary.grantsAuthority, false);
  assert.deepEqual(artifact.rejections, []);
});

test("sidecar repair suggestion is incomplete when failure evidence or approval posture is missing", () => {
  const suggestion = validSuggestion();
  suggestion.preservedEvidenceRefs = [];
  suggestion.requiresOperatorApproval = false;

  const artifact = build(suggestion);

  assert.equal(artifact.reviewStatus, "edge-operator-sidecar-repair-suggestion-incomplete");
  assert.ok(artifact.rejections.includes("preserved-evidence-refs-missing"));
  assert.ok(artifact.rejections.includes("source-failure-not-preserved"));
  assert.ok(artifact.rejections.includes("operator-approval-required-posture-missing"));
  assert.equal(artifact.validation.preservedFailureEvidencePresent, false);
});

test("sidecar repair suggestion blocks authority, approval, execution, continuity, and unsafe seams", () => {
  const suggestion = validSuggestion();
  suggestion.proposedRepairRefs = ["http://127.0.0.1/repair.json"];
  suggestion.executionAuthorized = true;
  suggestion.nonClaims.sidecarBecomesOperator = true;

  const artifact = build(suggestion);

  assert.equal(artifact.reviewStatus, "edge-operator-sidecar-repair-suggestion-guardrail-blocked");
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.ok(artifact.rejections.includes("approval-execution-authority-truth-or-continuity-claim"));
  assert.equal(artifact.validation.unsafeSeamRefsBlocked, false);
  assert.equal(artifact.validation.unsafeClaimsBlocked, false);
});

test("malformed sidecar repair suggestion remains non-accepted evidence", () => {
  const artifact = build(null);

  assert.equal(artifact.reviewStatus, "edge-operator-sidecar-repair-suggestion-malformed");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.rejections, ["suggestion-not-object"]);
});
