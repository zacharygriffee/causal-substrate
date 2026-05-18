import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeLocalLayerOperatorRecordedPromotionDecisionEvidenceArtifact,
  CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-17T21:10:00.000Z";

function promotionDecision() {
  return {
    artifactKind: "edge_local_layer_operator_recorded_promotion_decision",
    schemaVersion: "edge_local_layer_operator_recorded_promotion_decision.v0",
    decisionId: "edge-local-layer-operator-recorded-promotion-decision:aaaaaaaaaaaaaaaaaaaaaaaa",
    decisionHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    createdAt: "2026-05-17T21:00:00.000Z",
    operatorRef: "operator:edge-operator",
    operatorDecisionRef: "operator-decision:record-local-layer-promotion-fields",
    decisionRecordRef: "operator-recorded-promotion-decision:record-local-layer-promotion-fields",
    sourceWriterAdmissionPacketRef: "edge-local-layer-writer-admission-v0:bbbbbbbbbbbbbbbbbbbbbbbb",
    sourceWriterAdmissionPacketHash: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    sourceLayerRef: "local-layer:operator-owned-devices",
    sourceLaneRef: "local-layer-continuity-lane:operator-owned-devices-lab",
    sourceRefs: [
      "edge-local-layer-writer-admission-v0:bbbbbbbbbbbbbbbbbbbbbbbb",
      "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "edge-continuity-lane-autobase-lab-review-chain:fixture",
      "local-layer-continuity-lane-entry:aaaaaaaaaaaaaaaaaaaaaaaa",
      "continuity:edge-repo-work-packet:continuity-lane-lab",
      "causal-edge-local-layer-continuity-lane-autobase-lab-evidence:fixture",
    ],
    decisionNotesRefs: ["operator-note:promotion-fields-reviewed"],
    supersedesDecisionRefs: [],
    decisionStatus: {
      operatorDecisionRecorded: true,
      reversibleReviewArtifact: true,
      candidateProductionLaneFieldsNamed: true,
      productionLanePromoted: false,
      productionBackendStarted: false,
      productionExecutionAuthorized: false,
      edgeStateMigrationAllowed: false,
      writerAuthorityGranted: false,
      durableLocalLayerContinuityClaimed: false,
    },
    candidateProductionLaneFields: {
      promotedSemanticInputKind: "mesh_ecology_local_layer_continuity_event",
      promotedSemanticInputSchema: "mesh-ecology-spine:local-layer-continuity-event:v0",
      storageEnvelopeKind: "mesh_ecology_local_layer_lane_entry",
      storageEnvelopeSchema: "mesh_ecology_local_layer_lane_entry.v0",
      storageLaneKind: "bounded_autobase_local_layer_continuity_lane",
      productionBackendKind: "autobase_candidate_not_started",
      namespacePolicy: "one-corestore-per-role-process-stable-local-layer-continuity-namespace",
      schemaPath: "json_contract_first_with_hyperschema_trigger",
      dispatchPath: "hyperdispatch_deferred_until_dispatch_pressure",
      rollbackPosture: "supersession_and_import_rollback_before_state_migration",
      writerPolicyRef: "writer-admission-policy:operator-owned-device-writer-admission-v0",
      readerPolicyRef: "reader-policy:operator-owned-local-layer-readers-by-explicit-refs",
      acceptanceRuleRef: "acceptance-rule:deterministic-apply-validates-admitted-writer-input",
      causalInterpretationRef: "causal-substrate:observer-relative-continuity-interpretation",
      testbedPressureRef: "testbed:fail-closed-promotion-pressure-required",
      promotedNow: false,
      productionBackendStarted: false,
      edgeStateMigrationAllowed: false,
    },
    writerPolicySummary: {
      policyKind: "operator_owned_device_writer_admission_v0",
      admittedWriterRefs: ["local-layer-writer:operator-laptop"],
      candidateAppenderRefs: ["local-layer-candidate-appender:operator-tablet"],
      operatorApproverRefs: ["operator-approver:primary-operator"],
      explicitOperatorApprovalRequiredForAdmission: true,
      writerAdmissionRequiredBeforeAcceptance: true,
      deterministicApplyRequired: true,
      writerAuthorityGranted: false,
      writabilityIsAuthority: false,
    },
    readerPolicySummary: {
      readerPolicyKind: "operator_owned_local_layer_readers_by_explicit_refs",
      observerRefs: ["local-layer-observer:operator-phone"],
      readerRefs: ["local-layer-reader:operator-laptop"],
      explicitKeyOrProofRequired: true,
      readAccessImpliesWriteAccess: false,
      readAccessImpliesAuthority: false,
      localPathReadSeam: false,
      httpReadSeam: false,
      sshReadSeam: false,
    },
    acceptanceRule: {
      ruleKind: "operator_recorded_decision_names_promotion_fields_only",
      appendSuccessIsAcceptance: false,
      candidateAppendIsAcceptance: false,
      replicaVisibilityIsContinuity: false,
      linearizationIsTruth: false,
      operatorDecisionIsExecution: false,
      operatorDecisionIsTruth: false,
      testbedReviewIsReadiness: false,
      causalReviewIsTruth: false,
      productionPromotionRequiresSeparateGate: true,
      productionPromotionRequiresFailClosedTestbedPressure: true,
      productionPromotionRequiresCausalSubstrateInterpretation: true,
      productionPromotionRequiresRollbackPlan: true,
    },
    implementationRoute: {
      currentStage: "operator_recorded_promotion_decision",
      previousStage: "writer_admission_v0",
      nextImplementationGate: "production_backend_wedge",
      finalPromotionGate: "production_local_layer_lane_promotion_decision",
      productionCheckpointRequired: true,
      productionBackendAllowed: false,
      productionLanePromotionAllowed: false,
      edgeStateMigrationAllowed: false,
    },
    boundary: {
      decisionRecordOnly: true,
      reviewArtifactOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      writesAutobase: false,
      writesContinuityRecords: false,
      startsBackend: false,
      productionLocalLayerState: false,
      migratesEdgeState: false,
      grantsWriterAuthority: false,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      writerAuthorityGranted: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      canonicalHistoryClaimed: false,
      causalTruthClaimed: false,
      productionProofClaimed: false,
      productionLanePromoted: false,
    },
  };
}

test("imports operator recorded promotion decision as passive causal evidence", () => {
  const evidence = buildEdgeLocalLayerOperatorRecordedPromotionDecisionEvidenceArtifact({
    promotionDecision: promotionDecision(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_ARTIFACT_KIND);
  assert.equal(evidence.schema, CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_SCHEMA);
  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-recorded-promotion-decision-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-local-layer-operator-recorded-promotion-decision-valid-evidence");
  assert.equal(evidence.refs.nextGate, "production_backend_wedge");
  assert.equal(evidence.candidateProductionLaneFields.storageLaneKind, "bounded_autobase_local_layer_continuity_lane");
  assert.equal(evidence.decisionStatus.productionLanePromoted, false);
  assert.equal(evidence.acceptanceRule.operatorDecisionIsExecution, false);
  assert.equal(evidence.causalInterpretation.productionLanePromoted, false);
  assert.equal(evidence.boundary.opensAutobase, false);
  assert.equal(evidence.boundary.writesContinuityRecords, false);
  assert.equal(evidence.boundary.claimsCausalTruth, false);
});

test("blocks operator decision unsafe refs", () => {
  const decision = promotionDecision();
  decision.operatorDecisionRef = "http://127.0.0.1:8787/decision";
  const evidence = buildEdgeLocalLayerOperatorRecordedPromotionDecisionEvidenceArtifact({
    promotionDecision: decision,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-recorded-promotion-decision-guardrail-blocked");
  assert.equal(evidence.validation.refsSafe, false);
  assert.equal(evidence.rejections.includes("unsafe-ref"), true);
});

test("blocks operator decision production execution and authority overclaims", () => {
  const decision = promotionDecision();
  decision.decisionStatus.productionExecutionAuthorized = true;
  decision.implementationRoute.productionBackendAllowed = true;
  decision.boundary.opensAutobase = true;
  decision.nonClaims.durableStateClaimed = true;
  const evidence = buildEdgeLocalLayerOperatorRecordedPromotionDecisionEvidenceArtifact({
    promotionDecision: decision,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-recorded-promotion-decision-guardrail-blocked");
  assert.equal(evidence.validation.noProductionOverclaim, false);
  assert.equal(evidence.rejections.includes("production-execution-authority-or-truth-overclaim"), true);
});
