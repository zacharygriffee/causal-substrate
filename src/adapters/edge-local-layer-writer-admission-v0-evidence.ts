import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-writer-admission-v0-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-writer-admission-v0-evidence" as const;

type JsonRecord = Record<string, unknown>;

const EXPECTED_KIND = "edge_local_layer_writer_admission_v0_packet";
const EXPECTED_SCHEMA = "edge_local_layer_writer_admission_v0_packet.v0";
const EXPECTED_CURRENT_STAGE = "writer_admission_v0";
const EXPECTED_NEXT_GATE = "operator_recorded_promotion_decision";
const EXPECTED_FINAL_GATE = "production_local_layer_lane_promotion_decision";

export function buildEdgeLocalLayerWriterAdmissionV0EvidenceArtifact({
  writerAdmissionPacket,
  emittedAt,
  artifactId,
}: {
  writerAdmissionPacket: unknown;
  emittedAt: string;
  artifactId?: string;
}) {
  const packet = isRecord(writerAdmissionPacket) ? writerAdmissionPacket : undefined;
  const refs = collectRefs(packet);
  const issues = validatePacket(packet, writerAdmissionPacket, refs);
  const status = statusFor(packet, issues);
  const id = artifactId ?? `causal-edge-local-layer-writer-admission-v0-evidence:${hash(JSON.stringify({
    emittedAt,
    packetId: refs.packetId,
    laneRef: refs.laneRef,
    nextGate: refs.nextGate,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_SCHEMA_VERSION,
    artifactId: id,
    emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(packet?.artifactKind === EXPECTED_KIND ? { sourceArtifactKind: EXPECTED_KIND } : {}),
      ...(packet?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    roleSeparation: collectRoleSeparation(packet),
    writerAdmissionPolicy: collectWriterAdmissionPolicy(packet),
    readerPolicy: collectReaderPolicy(packet),
    acceptanceRule: collectAcceptanceRule(packet),
    implementationRoute: collectImplementationRoute(packet),
    causalInterpretation: {
      interpretationKind: "observer-relative-local-layer-writer-admission-policy-evidence",
      policyShapeOnly: true,
      observerRelative: true,
      branchRelative: true,
      sourceShareBoundaryPreserved: refs.sourceRefs.length > 0,
      roleSeparationPreserved: validRoleSeparation(collectRoleSeparation(packet)),
      writerAdmissionGrantsAuthority: false,
      candidateAppendIsContinuity: false,
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
      parseableObject: packet !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      packetRefsPresent: issues.includes("packet-refs-missing") === false,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      roleRefsPresent: issues.includes("role-refs-missing") === false,
      roleSeparationPresent: issues.includes("role-separation-missing-or-unsafe") === false,
      writerPolicyPresent: issues.includes("writer-policy-missing-or-unsafe") === false,
      readerPolicyPresent: issues.includes("reader-policy-missing-or-unsafe") === false,
      acceptanceRulePresent: issues.includes("acceptance-rule-missing-or-unsafe") === false,
      implementationRoutePresent: issues.includes("implementation-route-missing-or-unsafe") === false,
      refsSafe: issues.includes("unsafe-ref") === false,
      noProductionOverclaim: issues.includes("production-continuity-authority-or-truth-overclaim") === false,
      issues,
    },
    reviewStatus: status === "edge-local-layer-writer-admission-v0-valid-evidence"
      ? "edge-local-layer-writer-admission-v0-evidence-emitted"
      : status,
    warnings: status === "edge-local-layer-writer-admission-v0-valid-evidence"
      ? [
          "writer-admission-v0-policy-shape-observed",
          "observability-readability-writability-and-authority-remain-distinct",
          "candidate-append-and-operator-approval-are-not-continuity-acceptance",
          "production-lane-promotion-still-blocked",
        ]
      : ["edge-local-layer-writer-admission-v0-not-reviewable"],
    rejections: status === "edge-local-layer-writer-admission-v0-valid-evidence" ? [] : issues,
  };
}

function validatePacket(
  packet: JsonRecord | undefined,
  original: unknown,
  refs: ReturnType<typeof collectRefs>,
): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["writer-admission-packet-not-object"];
  if (!packet) return ["writer-admission-packet-not-object"];

  if (packet.artifactKind !== EXPECTED_KIND) issues.push("artifact-kind-mismatch");
  if (packet.schemaVersion !== EXPECTED_SCHEMA) issues.push("source-schema-mismatch");
  if (!refs.packetId || !refs.packetHash || !refs.layerRef || !refs.laneRef || !refs.operatorRef) {
    issues.push("packet-refs-missing");
  }
  if (!refs.sourceFixtureRef || !refs.sourceLaneEntryRef || !refs.sourceSemanticEventRef || refs.sourceRefs.length < 5) {
    issues.push("source-refs-missing");
  }
  if (
    refs.observerRefs.length === 0 ||
    refs.readerRefs.length === 0 ||
    refs.proposerRefs.length === 0 ||
    refs.candidateAppenderRefs.length === 0 ||
    refs.admittedWriterRefs.length === 0 ||
    refs.operatorApproverRefs.length === 0
  ) {
    issues.push("role-refs-missing");
  }
  if (allRefs(refs).some(unsafeRef)) issues.push("unsafe-ref");
  if (!validRoleSeparation(collectRoleSeparation(packet))) issues.push("role-separation-missing-or-unsafe");
  if (!validWriterAdmissionPolicy(collectWriterAdmissionPolicy(packet))) issues.push("writer-policy-missing-or-unsafe");
  if (!validReaderPolicy(collectReaderPolicy(packet))) issues.push("reader-policy-missing-or-unsafe");
  if (!validAcceptanceRule(collectAcceptanceRule(packet))) issues.push("acceptance-rule-missing-or-unsafe");
  if (!validImplementationRoute(collectImplementationRoute(packet))) issues.push("implementation-route-missing-or-unsafe");
  if (hasUnsafeOverlap(refs.rejectedWriterRefs, refs.admittedWriterRefs) || hasUnsafeOverlap(refs.rejectedWriterRefs, refs.candidateAppenderRefs)) {
    issues.push("role-overlap-unsafe");
  }
  if (productionOverclaim(packet)) issues.push("production-continuity-authority-or-truth-overclaim");
  return [...new Set(issues)];
}

function statusFor(packet: JsonRecord | undefined, issues: string[]) {
  if (!packet) return "edge-local-layer-writer-admission-v0-malformed-evidence";
  if (
    issues.includes("unsafe-ref") ||
    issues.includes("role-separation-missing-or-unsafe") ||
    issues.includes("writer-policy-missing-or-unsafe") ||
    issues.includes("reader-policy-missing-or-unsafe") ||
    issues.includes("acceptance-rule-missing-or-unsafe") ||
    issues.includes("implementation-route-missing-or-unsafe") ||
    issues.includes("role-overlap-unsafe") ||
    issues.includes("production-continuity-authority-or-truth-overclaim")
  ) {
    return "edge-local-layer-writer-admission-v0-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-writer-admission-v0-incomplete-evidence";
  return "edge-local-layer-writer-admission-v0-valid-evidence";
}

function collectRefs(packet: JsonRecord | undefined) {
  const roles = isRecord(packet?.roleRefs) ? packet.roleRefs : {};
  const route = isRecord(packet?.implementationRoute) ? packet.implementationRoute : {};
  return {
    packetId: stringValue(packet?.packetId),
    packetHash: stringValue(packet?.packetHash),
    layerRef: stringValue(packet?.layerRef),
    laneRef: stringValue(packet?.laneRef),
    operatorRef: stringValue(packet?.operatorRef),
    sourceFixtureRef: stringValue(packet?.sourceFixtureRef),
    sourceLaneEntryRef: stringValue(packet?.sourceLaneEntryRef),
    sourceSemanticEventRef: stringValue(packet?.sourceSemanticEventRef),
    sourceRefs: stringArray(packet?.sourceRefs),
    observerRefs: stringArray(roles.observerRefs),
    readerRefs: stringArray(roles.readerRefs),
    proposerRefs: stringArray(roles.proposerRefs),
    candidateAppenderRefs: stringArray(roles.candidateAppenderRefs),
    admittedWriterRefs: stringArray(roles.admittedWriterRefs),
    operatorApproverRefs: stringArray(roles.operatorApproverRefs),
    rejectedWriterRefs: stringArray(roles.rejectedWriterRefs),
    supersedesAdmissionRefs: stringArray(roles.supersedesAdmissionRefs),
    nextGate: stringValue(route.nextImplementationGate),
    finalGate: stringValue(route.finalPromotionGate),
  };
}

function collectRoleSeparation(packet: JsonRecord | undefined) {
  const role = isRecord(packet?.roleSeparation) ? packet.roleSeparation : {};
  return {
    observabilityIsAuthority: role.observabilityIsAuthority === true,
    observabilityIsWritability: role.observabilityIsWritability === true,
    readabilityIsWritability: role.readabilityIsWritability === true,
    proposerIsWriter: role.proposerIsWriter === true,
    candidateAppendIsWriterAdmission: role.candidateAppendIsWriterAdmission === true,
    candidateAppendIsAcceptedContinuity: role.candidateAppendIsAcceptedContinuity === true,
    writabilityIsAuthority: role.writabilityIsAuthority === true,
    admittedWriterIsAuthority: role.admittedWriterIsAuthority === true,
    operatorApprovalIsContinuityAcceptance: role.operatorApprovalIsContinuityAcceptance === true,
    appendSuccessIsAcceptance: role.appendSuccessIsAcceptance === true,
    applyValidationOwnsAcceptance: role.applyValidationOwnsAcceptance === true,
    operatorMediationRequired: role.operatorMediationRequired === true,
  };
}

function collectWriterAdmissionPolicy(packet: JsonRecord | undefined) {
  const policy = isRecord(packet?.writerAdmissionPolicy) ? packet.writerAdmissionPolicy : {};
  return {
    policyKind: stringValue(policy.policyKind),
    writerPolicyVersion: numberValue(policy.writerPolicyVersion),
    admittedWriterRefs: stringArray(policy.admittedWriterRefs),
    candidateAppenderRefs: stringArray(policy.candidateAppenderRefs),
    rejectedWriterRefs: stringArray(policy.rejectedWriterRefs),
    operatorApproverRefs: stringArray(policy.operatorApproverRefs),
    explicitOperatorApprovalRequiredForAdmission: policy.explicitOperatorApprovalRequiredForAdmission === true,
    writerAdmissionRequiredBeforeAcceptance: policy.writerAdmissionRequiredBeforeAcceptance === true,
    deterministicApplyRequired: policy.deterministicApplyRequired === true,
    candidateAppenderCanAppendProvisional: policy.candidateAppenderCanAppendProvisional === true,
    candidateAppendRequiresAcceptanceGate: policy.candidateAppendRequiresAcceptanceGate === true,
    candidateAppendMaterializesContinuity: policy.candidateAppendMaterializesContinuity === true,
    generalWriterAuthorityGranted: policy.generalWriterAuthorityGranted === true,
    writerAuthorityGranted: policy.writerAuthorityGranted === true,
    authorityGranted: policy.authorityGranted === true,
  };
}

function collectReaderPolicy(packet: JsonRecord | undefined) {
  const policy = isRecord(packet?.readerPolicy) ? packet.readerPolicy : {};
  return {
    readerPolicyKind: stringValue(policy.readerPolicyKind),
    observerRefs: stringArray(policy.observerRefs),
    readerRefs: stringArray(policy.readerRefs),
    explicitKeyOrProofRequired: policy.explicitKeyOrProofRequired === true,
    readAccessImpliesWriteAccess: policy.readAccessImpliesWriteAccess === true,
    readAccessImpliesAuthority: policy.readAccessImpliesAuthority === true,
    publicRead: policy.publicRead === true,
    localPathReadSeam: policy.localPathReadSeam === true,
    httpReadSeam: policy.httpReadSeam === true,
    sshReadSeam: policy.sshReadSeam === true,
  };
}

function collectAcceptanceRule(packet: JsonRecord | undefined) {
  const rule = isRecord(packet?.acceptanceRule) ? packet.acceptanceRule : {};
  return {
    ruleKind: stringValue(rule.ruleKind),
    appendSuccessIsAcceptance: rule.appendSuccessIsAcceptance === true,
    candidateAppendIsAcceptance: rule.candidateAppendIsAcceptance === true,
    replicaVisibilityIsContinuity: rule.replicaVisibilityIsContinuity === true,
    linearizationIsTruth: rule.linearizationIsTruth === true,
    operatorApprovalIsTruth: rule.operatorApprovalIsTruth === true,
    testbedReviewIsReadiness: rule.testbedReviewIsReadiness === true,
    causalReviewIsTruth: rule.causalReviewIsTruth === true,
    requiresValidSchema: rule.requiresValidSchema === true,
    requiresSourceRefs: rule.requiresSourceRefs === true,
    requiresCausalSubstrateInterpretation: rule.requiresCausalSubstrateInterpretation === true,
    requiresFailClosedTestbedPressure: rule.requiresFailClosedTestbedPressure === true,
    requiresOperatorApprovalForAdmission: rule.requiresOperatorApprovalForAdmission === true,
    requiresAdmittedWriterForAcceptedContinuity: rule.requiresAdmittedWriterForAcceptedContinuity === true,
    requiresDeterministicApplyValidation: rule.requiresDeterministicApplyValidation === true,
  };
}

function collectImplementationRoute(packet: JsonRecord | undefined) {
  const route = isRecord(packet?.implementationRoute) ? packet.implementationRoute : {};
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

function validRoleSeparation(role: ReturnType<typeof collectRoleSeparation>) {
  return role.observabilityIsAuthority === false &&
    role.observabilityIsWritability === false &&
    role.readabilityIsWritability === false &&
    role.proposerIsWriter === false &&
    role.candidateAppendIsWriterAdmission === false &&
    role.candidateAppendIsAcceptedContinuity === false &&
    role.writabilityIsAuthority === false &&
    role.admittedWriterIsAuthority === false &&
    role.operatorApprovalIsContinuityAcceptance === false &&
    role.appendSuccessIsAcceptance === false &&
    role.applyValidationOwnsAcceptance === true &&
    role.operatorMediationRequired === true;
}

function validWriterAdmissionPolicy(policy: ReturnType<typeof collectWriterAdmissionPolicy>) {
  return policy.policyKind === "operator_owned_device_writer_admission_v0" &&
    policy.writerPolicyVersion === 0 &&
    policy.admittedWriterRefs.length > 0 &&
    policy.candidateAppenderRefs.length > 0 &&
    policy.operatorApproverRefs.length > 0 &&
    policy.explicitOperatorApprovalRequiredForAdmission === true &&
    policy.writerAdmissionRequiredBeforeAcceptance === true &&
    policy.deterministicApplyRequired === true &&
    policy.candidateAppenderCanAppendProvisional === true &&
    policy.candidateAppendRequiresAcceptanceGate === true &&
    policy.candidateAppendMaterializesContinuity === false &&
    policy.generalWriterAuthorityGranted === false &&
    policy.writerAuthorityGranted === false &&
    policy.authorityGranted === false;
}

function validReaderPolicy(policy: ReturnType<typeof collectReaderPolicy>) {
  return policy.readerPolicyKind === "operator_owned_local_layer_readers_by_explicit_refs" &&
    policy.observerRefs.length > 0 &&
    policy.readerRefs.length > 0 &&
    policy.explicitKeyOrProofRequired === true &&
    policy.readAccessImpliesWriteAccess === false &&
    policy.readAccessImpliesAuthority === false &&
    policy.publicRead === false &&
    policy.localPathReadSeam === false &&
    policy.httpReadSeam === false &&
    policy.sshReadSeam === false;
}

function validAcceptanceRule(rule: ReturnType<typeof collectAcceptanceRule>) {
  return rule.ruleKind === "deterministic_apply_validates_admitted_writer_input" &&
    rule.appendSuccessIsAcceptance === false &&
    rule.candidateAppendIsAcceptance === false &&
    rule.replicaVisibilityIsContinuity === false &&
    rule.linearizationIsTruth === false &&
    rule.operatorApprovalIsTruth === false &&
    rule.testbedReviewIsReadiness === false &&
    rule.causalReviewIsTruth === false &&
    rule.requiresValidSchema === true &&
    rule.requiresSourceRefs === true &&
    rule.requiresCausalSubstrateInterpretation === true &&
    rule.requiresFailClosedTestbedPressure === true &&
    rule.requiresOperatorApprovalForAdmission === true &&
    rule.requiresAdmittedWriterForAcceptedContinuity === true &&
    rule.requiresDeterministicApplyValidation === true;
}

function validImplementationRoute(route: ReturnType<typeof collectImplementationRoute>) {
  return route.currentStage === EXPECTED_CURRENT_STAGE &&
    route.previousStage === "review_chain_fixture_reproducible" &&
    route.nextImplementationGate === EXPECTED_NEXT_GATE &&
    route.finalPromotionGate === EXPECTED_FINAL_GATE &&
    route.productionCheckpointRequired === true &&
    route.productionBackendAllowed === false &&
    route.productionLanePromotionAllowed === false &&
    route.edgeStateMigrationAllowed === false;
}

function productionOverclaim(packet: JsonRecord) {
  const boundary = isRecord(packet.boundary) ? packet.boundary : {};
  const nonClaims = isRecord(packet.nonClaims) ? packet.nonClaims : {};
  const route = collectImplementationRoute(packet);
  const writerPolicy = collectWriterAdmissionPolicy(packet);
  return boundary.opensAutobase === true ||
    boundary.opensCorestore === true ||
    boundary.writesAutobase === true ||
    boundary.writesContinuityRecords === true ||
    boundary.startsBackend === true ||
    boundary.productionLocalLayerState === true ||
    boundary.migratesEdgeState === true ||
    boundary.grantsWriterAuthority === true ||
    boundary.grantsRuntimeAuthority === true ||
    route.productionBackendAllowed === true ||
    route.productionLanePromotionAllowed === true ||
    route.edgeStateMigrationAllowed === true ||
    writerPolicy.writerAuthorityGranted === true ||
    writerPolicy.authorityGranted === true ||
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.writerAuthorityGranted === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.canonicalHistoryClaimed === true ||
    nonClaims.causalTruthClaimed === true ||
    nonClaims.meshTruthClaimed === true ||
    nonClaims.runtimeAuthorityClaimed === true ||
    nonClaims.rendererAuthorityClaimed === true ||
    nonClaims.productionProofClaimed === true;
}

function allRefs(refs: ReturnType<typeof collectRefs>) {
  return [
    refs.packetId,
    refs.packetHash,
    refs.layerRef,
    refs.laneRef,
    refs.operatorRef,
    refs.sourceFixtureRef,
    refs.sourceLaneEntryRef,
    refs.sourceSemanticEventRef,
    ...refs.sourceRefs,
    ...refs.observerRefs,
    ...refs.readerRefs,
    ...refs.proposerRefs,
    ...refs.candidateAppenderRefs,
    ...refs.admittedWriterRefs,
    ...refs.operatorApproverRefs,
    ...refs.rejectedWriterRefs,
    ...refs.supersedesAdmissionRefs,
    refs.nextGate,
    refs.finalGate,
  ].filter((ref): ref is string => typeof ref === "string" && ref.trim() !== "");
}

function hasUnsafeOverlap(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.some((ref) => rightSet.has(ref));
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

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function unsafeRef(value: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|ssh|http/iu.test(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
