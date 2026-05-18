import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-operator-recorded-promotion-decision-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-operator-recorded-promotion-decision-evidence" as const;

type JsonRecord = Record<string, unknown>;

const EXPECTED_KIND = "edge_local_layer_operator_recorded_promotion_decision";
const EXPECTED_SCHEMA = "edge_local_layer_operator_recorded_promotion_decision.v0";
const EXPECTED_CURRENT_STAGE = "operator_recorded_promotion_decision";
const EXPECTED_NEXT_GATE = "production_backend_wedge";
const EXPECTED_FINAL_GATE = "production_local_layer_lane_promotion_decision";

export function buildEdgeLocalLayerOperatorRecordedPromotionDecisionEvidenceArtifact({
  promotionDecision,
  emittedAt,
  artifactId,
}: {
  promotionDecision: unknown;
  emittedAt: string;
  artifactId?: string;
}) {
  const decision = isRecord(promotionDecision) ? promotionDecision : undefined;
  const refs = collectRefs(decision);
  const fields = collectCandidateFields(decision);
  const issues = validateDecision(decision, promotionDecision, refs, fields);
  const status = statusFor(decision, issues);
  const id = artifactId ?? `causal-edge-local-layer-operator-recorded-promotion-decision-evidence:${hash(JSON.stringify({
    emittedAt,
    decisionId: refs.decisionId,
    writerPacketRef: refs.sourceWriterAdmissionPacketRef,
    nextGate: refs.nextGate,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_RECORDED_PROMOTION_DECISION_EVIDENCE_SCHEMA_VERSION,
    artifactId: id,
    emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(decision?.artifactKind === EXPECTED_KIND ? { sourceArtifactKind: EXPECTED_KIND } : {}),
      ...(decision?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    candidateProductionLaneFields: fields,
    decisionStatus: collectDecisionStatus(decision),
    writerPolicySummary: collectWriterPolicy(decision),
    readerPolicySummary: collectReaderPolicy(decision),
    acceptanceRule: collectAcceptanceRule(decision),
    implementationRoute: collectImplementationRoute(decision),
    causalInterpretation: {
      interpretationKind: "observer-relative-local-layer-operator-recorded-promotion-decision-evidence",
      decisionFieldEvidenceOnly: true,
      observerRelative: true,
      branchRelative: true,
      sourceShareBoundaryPreserved: refs.sourceRefs.length > 0,
      operatorDecisionIsExecution: false,
      productionLanePromoted: false,
      causalSubstrateOwnsBackend: false,
      causalSubstrateAcceptsTruth: false,
    },
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      callsEdge: false,
      writesContinuityRecords: false,
      acceptsProductionContinuity: false,
      grantsWriterAuthority: false,
      claimsCausalTruth: false,
      startsProductionBackend: false,
      migratesEdgeState: false,
    },
    validation: {
      status,
      parseableObject: decision !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      decisionRefsPresent: issues.includes("decision-refs-missing") === false,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      candidateFieldsPresent: issues.includes("candidate-fields-missing-or-unsafe") === false,
      decisionStatusSafe: issues.includes("decision-status-missing-or-unsafe") === false,
      writerPolicySafe: issues.includes("writer-policy-missing-or-unsafe") === false,
      readerPolicySafe: issues.includes("reader-policy-missing-or-unsafe") === false,
      acceptanceRuleSafe: issues.includes("acceptance-rule-missing-or-unsafe") === false,
      implementationRouteSafe: issues.includes("implementation-route-missing-or-unsafe") === false,
      refsSafe: issues.includes("unsafe-ref") === false,
      noProductionOverclaim: issues.includes("production-execution-authority-or-truth-overclaim") === false,
      issues,
    },
    reviewStatus: status === "edge-local-layer-operator-recorded-promotion-decision-valid-evidence"
      ? "edge-local-layer-operator-recorded-promotion-decision-evidence-emitted"
      : status,
    warnings: status === "edge-local-layer-operator-recorded-promotion-decision-valid-evidence"
      ? [
          "operator-recorded-promotion-decision-observed",
          "decision-fields-named-without-production-execution",
          "production-backend-wedge-is-next-gate",
          "production-lane-promotion-still-blocked",
        ]
      : ["edge-local-layer-operator-recorded-promotion-decision-not-reviewable"],
    rejections: status === "edge-local-layer-operator-recorded-promotion-decision-valid-evidence" ? [] : issues,
  };
}

function validateDecision(
  decision: JsonRecord | undefined,
  original: unknown,
  refs: ReturnType<typeof collectRefs>,
  fields: ReturnType<typeof collectCandidateFields>,
): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["promotion-decision-not-object"];
  if (!decision) return ["promotion-decision-not-object"];

  if (decision.artifactKind !== EXPECTED_KIND) issues.push("artifact-kind-mismatch");
  if (decision.schemaVersion !== EXPECTED_SCHEMA) issues.push("source-schema-mismatch");
  if (!refs.decisionId || !refs.decisionHash || !refs.operatorRef || !refs.operatorDecisionRef || !refs.decisionRecordRef) {
    issues.push("decision-refs-missing");
  }
  if (!refs.sourceWriterAdmissionPacketRef || !refs.sourceWriterAdmissionPacketHash || refs.sourceRefs.length < 6) {
    issues.push("source-refs-missing");
  }
  if (allRefs(refs, fields).some(unsafeRef)) issues.push("unsafe-ref");
  if (!validCandidateFields(fields)) issues.push("candidate-fields-missing-or-unsafe");
  if (!validDecisionStatus(collectDecisionStatus(decision))) issues.push("decision-status-missing-or-unsafe");
  if (!validWriterPolicy(collectWriterPolicy(decision))) issues.push("writer-policy-missing-or-unsafe");
  if (!validReaderPolicy(collectReaderPolicy(decision))) issues.push("reader-policy-missing-or-unsafe");
  if (!validAcceptanceRule(collectAcceptanceRule(decision))) issues.push("acceptance-rule-missing-or-unsafe");
  if (!validImplementationRoute(collectImplementationRoute(decision))) issues.push("implementation-route-missing-or-unsafe");
  if (productionOverclaim(decision)) issues.push("production-execution-authority-or-truth-overclaim");
  return [...new Set(issues)];
}

function statusFor(decision: JsonRecord | undefined, issues: string[]) {
  if (!decision) return "edge-local-layer-operator-recorded-promotion-decision-malformed-evidence";
  if (
    issues.includes("unsafe-ref") ||
    issues.includes("candidate-fields-missing-or-unsafe") ||
    issues.includes("decision-status-missing-or-unsafe") ||
    issues.includes("writer-policy-missing-or-unsafe") ||
    issues.includes("reader-policy-missing-or-unsafe") ||
    issues.includes("acceptance-rule-missing-or-unsafe") ||
    issues.includes("implementation-route-missing-or-unsafe") ||
    issues.includes("production-execution-authority-or-truth-overclaim")
  ) {
    return "edge-local-layer-operator-recorded-promotion-decision-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-operator-recorded-promotion-decision-incomplete-evidence";
  return "edge-local-layer-operator-recorded-promotion-decision-valid-evidence";
}

function collectRefs(decision: JsonRecord | undefined) {
  const route = isRecord(decision?.implementationRoute) ? decision.implementationRoute : {};
  return {
    decisionId: stringValue(decision?.decisionId),
    decisionHash: stringValue(decision?.decisionHash),
    operatorRef: stringValue(decision?.operatorRef),
    operatorDecisionRef: stringValue(decision?.operatorDecisionRef),
    decisionRecordRef: stringValue(decision?.decisionRecordRef),
    sourceWriterAdmissionPacketRef: stringValue(decision?.sourceWriterAdmissionPacketRef),
    sourceWriterAdmissionPacketHash: stringValue(decision?.sourceWriterAdmissionPacketHash),
    sourceLayerRef: stringValue(decision?.sourceLayerRef),
    sourceLaneRef: stringValue(decision?.sourceLaneRef),
    sourceRefs: stringArray(decision?.sourceRefs),
    decisionNotesRefs: stringArray(decision?.decisionNotesRefs),
    supersedesDecisionRefs: stringArray(decision?.supersedesDecisionRefs),
    nextGate: stringValue(route.nextImplementationGate),
    finalGate: stringValue(route.finalPromotionGate),
  };
}

function collectCandidateFields(decision: JsonRecord | undefined) {
  const fields = isRecord(decision?.candidateProductionLaneFields) ? decision.candidateProductionLaneFields : {};
  return {
    promotedSemanticInputKind: stringValue(fields.promotedSemanticInputKind),
    promotedSemanticInputSchema: stringValue(fields.promotedSemanticInputSchema),
    storageEnvelopeKind: stringValue(fields.storageEnvelopeKind),
    storageEnvelopeSchema: stringValue(fields.storageEnvelopeSchema),
    storageLaneKind: stringValue(fields.storageLaneKind),
    productionBackendKind: stringValue(fields.productionBackendKind),
    namespacePolicy: stringValue(fields.namespacePolicy),
    schemaPath: stringValue(fields.schemaPath),
    dispatchPath: stringValue(fields.dispatchPath),
    rollbackPosture: stringValue(fields.rollbackPosture),
    writerPolicyRef: stringValue(fields.writerPolicyRef),
    readerPolicyRef: stringValue(fields.readerPolicyRef),
    acceptanceRuleRef: stringValue(fields.acceptanceRuleRef),
    causalInterpretationRef: stringValue(fields.causalInterpretationRef),
    testbedPressureRef: stringValue(fields.testbedPressureRef),
    promotedNow: fields.promotedNow === true,
    productionBackendStarted: fields.productionBackendStarted === true,
    edgeStateMigrationAllowed: fields.edgeStateMigrationAllowed === true,
  };
}

function collectDecisionStatus(decision: JsonRecord | undefined) {
  const status = isRecord(decision?.decisionStatus) ? decision.decisionStatus : {};
  return {
    operatorDecisionRecorded: status.operatorDecisionRecorded === true,
    reversibleReviewArtifact: status.reversibleReviewArtifact === true,
    candidateProductionLaneFieldsNamed: status.candidateProductionLaneFieldsNamed === true,
    productionLanePromoted: status.productionLanePromoted === true,
    productionBackendStarted: status.productionBackendStarted === true,
    productionExecutionAuthorized: status.productionExecutionAuthorized === true,
    edgeStateMigrationAllowed: status.edgeStateMigrationAllowed === true,
    writerAuthorityGranted: status.writerAuthorityGranted === true,
    durableLocalLayerContinuityClaimed: status.durableLocalLayerContinuityClaimed === true,
  };
}

function collectWriterPolicy(decision: JsonRecord | undefined) {
  const policy = isRecord(decision?.writerPolicySummary) ? decision.writerPolicySummary : {};
  return {
    policyKind: stringValue(policy.policyKind),
    admittedWriterRefs: stringArray(policy.admittedWriterRefs),
    candidateAppenderRefs: stringArray(policy.candidateAppenderRefs),
    operatorApproverRefs: stringArray(policy.operatorApproverRefs),
    explicitOperatorApprovalRequiredForAdmission: policy.explicitOperatorApprovalRequiredForAdmission === true,
    writerAdmissionRequiredBeforeAcceptance: policy.writerAdmissionRequiredBeforeAcceptance === true,
    deterministicApplyRequired: policy.deterministicApplyRequired === true,
    writerAuthorityGranted: policy.writerAuthorityGranted === true,
    writabilityIsAuthority: policy.writabilityIsAuthority === true,
  };
}

function collectReaderPolicy(decision: JsonRecord | undefined) {
  const policy = isRecord(decision?.readerPolicySummary) ? decision.readerPolicySummary : {};
  return {
    readerPolicyKind: stringValue(policy.readerPolicyKind),
    observerRefs: stringArray(policy.observerRefs),
    readerRefs: stringArray(policy.readerRefs),
    explicitKeyOrProofRequired: policy.explicitKeyOrProofRequired === true,
    readAccessImpliesWriteAccess: policy.readAccessImpliesWriteAccess === true,
    readAccessImpliesAuthority: policy.readAccessImpliesAuthority === true,
    localPathReadSeam: policy.localPathReadSeam === true,
    httpReadSeam: policy.httpReadSeam === true,
    sshReadSeam: policy.sshReadSeam === true,
  };
}

function collectAcceptanceRule(decision: JsonRecord | undefined) {
  const rule = isRecord(decision?.acceptanceRule) ? decision.acceptanceRule : {};
  return {
    ruleKind: stringValue(rule.ruleKind),
    appendSuccessIsAcceptance: rule.appendSuccessIsAcceptance === true,
    candidateAppendIsAcceptance: rule.candidateAppendIsAcceptance === true,
    replicaVisibilityIsContinuity: rule.replicaVisibilityIsContinuity === true,
    linearizationIsTruth: rule.linearizationIsTruth === true,
    operatorDecisionIsExecution: rule.operatorDecisionIsExecution === true,
    operatorDecisionIsTruth: rule.operatorDecisionIsTruth === true,
    testbedReviewIsReadiness: rule.testbedReviewIsReadiness === true,
    causalReviewIsTruth: rule.causalReviewIsTruth === true,
    productionPromotionRequiresSeparateGate: rule.productionPromotionRequiresSeparateGate === true,
    productionPromotionRequiresFailClosedTestbedPressure: rule.productionPromotionRequiresFailClosedTestbedPressure === true,
    productionPromotionRequiresCausalSubstrateInterpretation: rule.productionPromotionRequiresCausalSubstrateInterpretation === true,
    productionPromotionRequiresRollbackPlan: rule.productionPromotionRequiresRollbackPlan === true,
  };
}

function collectImplementationRoute(decision: JsonRecord | undefined) {
  const route = isRecord(decision?.implementationRoute) ? decision.implementationRoute : {};
  return {
    currentStage: stringValue(route.currentStage),
    previousStage: stringValue(route.previousStage),
    nextImplementationGate: stringValue(route.nextImplementationGate),
    finalPromotionGate: stringValue(route.finalPromotionGate),
    productionCheckpointRequired: route.productionCheckpointRequired === true,
    productionBackendAllowed: route.productionBackendAllowed === true,
    productionLanePromotionAllowed: route.productionLanePromotionAllowed === true,
    edgeStateMigrationAllowed: route.edgeStateMigrationAllowed === true,
  };
}

function validCandidateFields(fields: ReturnType<typeof collectCandidateFields>) {
  return fields.promotedSemanticInputKind === "mesh_ecology_local_layer_continuity_event" &&
    fields.storageEnvelopeKind === "mesh_ecology_local_layer_lane_entry" &&
    fields.storageLaneKind === "bounded_autobase_local_layer_continuity_lane" &&
    fields.productionBackendKind === "autobase_candidate_not_started" &&
    fields.namespacePolicy === "one-corestore-per-role-process-stable-local-layer-continuity-namespace" &&
    fields.schemaPath === "json_contract_first_with_hyperschema_trigger" &&
    fields.dispatchPath === "hyperdispatch_deferred_until_dispatch_pressure" &&
    fields.rollbackPosture === "supersession_and_import_rollback_before_state_migration" &&
    fields.writerPolicyRef === "writer-admission-policy:operator-owned-device-writer-admission-v0" &&
    fields.readerPolicyRef === "reader-policy:operator-owned-local-layer-readers-by-explicit-refs" &&
    fields.acceptanceRuleRef === "acceptance-rule:deterministic-apply-validates-admitted-writer-input" &&
    fields.causalInterpretationRef === "causal-substrate:observer-relative-continuity-interpretation" &&
    fields.testbedPressureRef === "testbed:fail-closed-promotion-pressure-required" &&
    fields.promotedNow === false &&
    fields.productionBackendStarted === false &&
    fields.edgeStateMigrationAllowed === false &&
    [
      fields.promotedSemanticInputSchema,
      fields.storageEnvelopeSchema,
    ].every((value) => typeof value === "string" && value.trim() !== "");
}

function validDecisionStatus(status: ReturnType<typeof collectDecisionStatus>) {
  return status.operatorDecisionRecorded === true &&
    status.reversibleReviewArtifact === true &&
    status.candidateProductionLaneFieldsNamed === true &&
    status.productionLanePromoted === false &&
    status.productionBackendStarted === false &&
    status.productionExecutionAuthorized === false &&
    status.edgeStateMigrationAllowed === false &&
    status.writerAuthorityGranted === false &&
    status.durableLocalLayerContinuityClaimed === false;
}

function validWriterPolicy(policy: ReturnType<typeof collectWriterPolicy>) {
  return policy.policyKind === "operator_owned_device_writer_admission_v0" &&
    policy.admittedWriterRefs.length > 0 &&
    policy.candidateAppenderRefs.length > 0 &&
    policy.operatorApproverRefs.length > 0 &&
    policy.explicitOperatorApprovalRequiredForAdmission === true &&
    policy.writerAdmissionRequiredBeforeAcceptance === true &&
    policy.deterministicApplyRequired === true &&
    policy.writerAuthorityGranted === false &&
    policy.writabilityIsAuthority === false;
}

function validReaderPolicy(policy: ReturnType<typeof collectReaderPolicy>) {
  return policy.readerPolicyKind === "operator_owned_local_layer_readers_by_explicit_refs" &&
    policy.observerRefs.length > 0 &&
    policy.readerRefs.length > 0 &&
    policy.explicitKeyOrProofRequired === true &&
    policy.readAccessImpliesWriteAccess === false &&
    policy.readAccessImpliesAuthority === false &&
    policy.localPathReadSeam === false &&
    policy.httpReadSeam === false &&
    policy.sshReadSeam === false;
}

function validAcceptanceRule(rule: ReturnType<typeof collectAcceptanceRule>) {
  return rule.ruleKind === "operator_recorded_decision_names_promotion_fields_only" &&
    rule.appendSuccessIsAcceptance === false &&
    rule.candidateAppendIsAcceptance === false &&
    rule.replicaVisibilityIsContinuity === false &&
    rule.linearizationIsTruth === false &&
    rule.operatorDecisionIsExecution === false &&
    rule.operatorDecisionIsTruth === false &&
    rule.testbedReviewIsReadiness === false &&
    rule.causalReviewIsTruth === false &&
    rule.productionPromotionRequiresSeparateGate === true &&
    rule.productionPromotionRequiresFailClosedTestbedPressure === true &&
    rule.productionPromotionRequiresCausalSubstrateInterpretation === true &&
    rule.productionPromotionRequiresRollbackPlan === true;
}

function validImplementationRoute(route: ReturnType<typeof collectImplementationRoute>) {
  return route.currentStage === EXPECTED_CURRENT_STAGE &&
    route.previousStage === "writer_admission_v0" &&
    route.nextImplementationGate === EXPECTED_NEXT_GATE &&
    route.finalPromotionGate === EXPECTED_FINAL_GATE &&
    route.productionCheckpointRequired === true &&
    route.productionBackendAllowed === false &&
    route.productionLanePromotionAllowed === false &&
    route.edgeStateMigrationAllowed === false;
}

function productionOverclaim(decision: JsonRecord) {
  const status = collectDecisionStatus(decision);
  const route = collectImplementationRoute(decision);
  const fields = collectCandidateFields(decision);
  const boundary = isRecord(decision.boundary) ? decision.boundary : {};
  const nonClaims = isRecord(decision.nonClaims) ? decision.nonClaims : {};
  return status.productionLanePromoted === true ||
    status.productionBackendStarted === true ||
    status.productionExecutionAuthorized === true ||
    status.edgeStateMigrationAllowed === true ||
    status.writerAuthorityGranted === true ||
    status.durableLocalLayerContinuityClaimed === true ||
    fields.promotedNow === true ||
    fields.productionBackendStarted === true ||
    fields.edgeStateMigrationAllowed === true ||
    route.productionBackendAllowed === true ||
    route.productionLanePromotionAllowed === true ||
    route.edgeStateMigrationAllowed === true ||
    boundary.opensAutobase === true ||
    boundary.opensCorestore === true ||
    boundary.writesAutobase === true ||
    boundary.writesContinuityRecords === true ||
    boundary.startsBackend === true ||
    boundary.productionLocalLayerState === true ||
    boundary.migratesEdgeState === true ||
    boundary.grantsWriterAuthority === true ||
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.writerAuthorityGranted === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.canonicalHistoryClaimed === true ||
    nonClaims.causalTruthClaimed === true ||
    nonClaims.productionProofClaimed === true ||
    nonClaims.productionLanePromoted === true;
}

function allRefs(refs: ReturnType<typeof collectRefs>, fields: ReturnType<typeof collectCandidateFields>) {
  return [
    refs.decisionId,
    refs.decisionHash,
    refs.operatorRef,
    refs.operatorDecisionRef,
    refs.decisionRecordRef,
    refs.sourceWriterAdmissionPacketRef,
    refs.sourceWriterAdmissionPacketHash,
    refs.sourceLayerRef,
    refs.sourceLaneRef,
    ...refs.sourceRefs,
    ...refs.decisionNotesRefs,
    ...refs.supersedesDecisionRefs,
    refs.nextGate,
    refs.finalGate,
    ...Object.values(fields).filter((value): value is string => typeof value === "string"),
  ].filter((ref): ref is string => typeof ref === "string" && ref.trim() !== "");
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function unsafeRef(value: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|ssh|http/iu.test(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
