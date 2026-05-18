import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_DECISION_CONTINUITY_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-operator-decision-continuity-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_DECISION_CONTINUITY_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_DECISION_CONTINUITY_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-operator-decision-continuity-evidence" as const;

type JsonRecord = Record<string, unknown>;

const EXPECTED_KIND = "edge_local_layer_production_continuity_lane_result";
const EXPECTED_SCHEMA = "edge_local_layer_production_continuity_lane_result.v0";
const EXPECTED_LANE = "local-layer-continuity-lane:operator-owned-devices";
const EXPECTED_NAMESPACE = "local-layer/continuity";
const EXPECTED_EVENT_KIND = "operator_recorded_local_layer_decision";

const ALLOWED_DECISION_KINDS = [
  "approve_repo_work_packet",
  "reject_repo_work_packet",
  "mark_local_layer_work_blocked",
  "mark_local_layer_work_held",
  "mark_local_layer_work_continued",
  "record_causal_testbed_pressure_review",
] as const;

const DEFERRED_ROOT_ADJACENT_DECISION_KINDS = [
  "approve_production_promotion_gate",
  "reject_production_promotion_gate",
  "approve_writer_admission",
  "reject_writer_admission",
  "approve_reader_admission",
  "reject_reader_admission",
  "approve_state_migration",
  "reject_state_migration",
  "approve_schema_promotion",
  "reject_schema_promotion",
  "approve_compatibility_removal",
  "reject_compatibility_removal",
] as const;

export function buildEdgeLocalLayerOperatorDecisionContinuityEvidenceArtifact({
  productionLaneResult,
  emittedAt,
  artifactId,
}: {
  productionLaneResult: unknown;
  emittedAt: string;
  artifactId?: string;
}) {
  const result = isRecord(productionLaneResult) ? productionLaneResult : undefined;
  const refs = collectRefs(result);
  const backend = collectBackend(result);
  const laneEntry = collectLaneEntry(result);
  const operatorDecision = collectOperatorDecision(result);
  const acceptedEventsView = collectAcceptedEventsView(result);
  const readerObservation = collectReaderObservation(result);
  const productionPosture = collectProductionPosture(result);
  const issues = validateResult({
    original: productionLaneResult,
    result,
    refs,
    backend,
    laneEntry,
    operatorDecision,
    acceptedEventsView,
    readerObservation,
    productionPosture,
  });
  const status = statusFor(result, issues);
  const id = artifactId ?? `causal-edge-local-layer-operator-decision-continuity-evidence:${hash(JSON.stringify({
    emittedAt,
    resultRef: refs.sourceResultRef,
    laneEntryRef: refs.laneEntryRef,
    operatorDecisionRef: operatorDecision.operatorDecisionRef,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_DECISION_CONTINUITY_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_DECISION_CONTINUITY_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_OPERATOR_DECISION_CONTINUITY_EVIDENCE_SCHEMA_VERSION,
    artifactId: id,
    emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(result?.artifactKind === EXPECTED_KIND ? { sourceArtifactKind: EXPECTED_KIND } : {}),
      ...(result?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    backend,
    laneEntry,
    operatorDecision,
    acceptedEventsView,
    readerObservation,
    productionPosture,
    causalInterpretation: {
      interpretationKind: "observer-relative-local-layer-operator-decision-continuity-evidence",
      interpretsProductionLaneResultAsEvidence: true,
      interpretsOperatorDecisionAsContinuityEvidence: status === "edge-local-layer-operator-decision-continuity-valid-evidence",
      operatorDecisionIsTruth: false,
      operatorDecisionIsExecution: false,
      operatorDecisionIsGlobalAuthority: false,
      operatorDecisionIsMeshSettlement: false,
      operatorDecisionIsReadiness: false,
      observerRelativeContinuity: true,
      branchSettlementClaimed: false,
      lineageSettlementClaimed: false,
      causalTruthClaimed: false,
      causalSubstrateOwnsBackend: false,
    },
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
      observesProductionLaneResult: true,
      opensAutobase: false,
      opensCorestore: false,
      writesContinuityRecords: false,
      executesOperatorDecision: false,
      grantsWriterAuthority: false,
      approvesProductionPromotion: false,
      claimsCausalTruth: false,
      claimsMeshTruth: false,
      claimsLineageSettlement: false,
      migratesEdgeState: false,
    },
    validation: {
      status,
      parseableObject: result !== undefined,
      expectedSourceSchemaPresent: !issues.includes("source-schema-mismatch"),
      refsPresent: !issues.includes("refs-missing"),
      backendSafe: !issues.includes("backend-missing-or-unsafe"),
      laneEntrySafe: !issues.includes("lane-entry-missing-or-unsafe"),
      operatorDecisionSafe: !issues.includes("operator-decision-missing-or-unsafe"),
      acceptedEventsViewSafe: !issues.includes("accepted-events-view-missing-or-unsafe"),
      readerObservationSafe: !issues.includes("reader-observation-missing-or-unsafe"),
      productionPostureSafe: !issues.includes("production-posture-missing-or-unsafe"),
      refsSafe: !issues.includes("unsafe-ref"),
      noAuthorityOrTruthOverclaim: !issues.includes("operator-decision-authority-truth-or-execution-overclaim"),
      issues,
    },
    reviewStatus: status === "edge-local-layer-operator-decision-continuity-valid-evidence"
      ? "edge-local-layer-operator-decision-continuity-evidence-emitted"
      : status,
    warnings: status === "edge-local-layer-operator-decision-continuity-valid-evidence"
      ? [
          "operator-decision-continuity-observed",
          "operator-decision-is-not-truth",
          "operator-decision-is-not-execution",
          "filtered-reader-posture-required",
          "causal-substrate-review-is-not-truth",
        ]
      : ["edge-local-layer-operator-decision-continuity-not-reviewable"],
    rejections: status === "edge-local-layer-operator-decision-continuity-valid-evidence" ? [] : issues,
  };
}

function validateResult({
  original,
  result,
  refs,
  backend,
  laneEntry,
  operatorDecision,
  acceptedEventsView,
  readerObservation,
  productionPosture,
}: {
  original: unknown;
  result: JsonRecord | undefined;
  refs: ReturnType<typeof collectRefs>;
  backend: ReturnType<typeof collectBackend>;
  laneEntry: ReturnType<typeof collectLaneEntry>;
  operatorDecision: ReturnType<typeof collectOperatorDecision>;
  acceptedEventsView: ReturnType<typeof collectAcceptedEventsView>;
  readerObservation: ReturnType<typeof collectReaderObservation>;
  productionPosture: ReturnType<typeof collectProductionPosture>;
}) {
  const issues: string[] = [];
  if (!isRecord(original)) return ["operator-decision-continuity-result-not-object"];
  if (!result) return ["operator-decision-continuity-result-not-object"];
  if (result.artifactKind !== EXPECTED_KIND) issues.push("artifact-kind-mismatch");
  if (result.schemaVersion !== EXPECTED_SCHEMA) issues.push("source-schema-mismatch");
  if (
    !refs.sourceResultRef ||
    !refs.sourceResultHash ||
    !refs.laneEntryRef ||
    !refs.laneEntryHash ||
    !refs.semanticEventRef ||
    refs.writerRefs.length < 1 ||
    refs.headRefs.length < 1 ||
    refs.linearizedEntryRefs.length < 1
  ) {
    issues.push("refs-missing");
  }
  if (allRefs(refs, backend, laneEntry, operatorDecision, acceptedEventsView, readerObservation).some(unsafeRef)) issues.push("unsafe-ref");
  if (!validBackend(backend)) issues.push("backend-missing-or-unsafe");
  if (!validLaneEntry(laneEntry)) issues.push("lane-entry-missing-or-unsafe");
  if (!validOperatorDecision(operatorDecision)) issues.push("operator-decision-missing-or-unsafe");
  if (!validAcceptedEventsView(acceptedEventsView, laneEntry, operatorDecision)) issues.push("accepted-events-view-missing-or-unsafe");
  if (!validReaderObservation(readerObservation, laneEntry)) issues.push("reader-observation-missing-or-unsafe");
  if (!validProductionPosture(productionPosture)) issues.push("production-posture-missing-or-unsafe");
  if (overclaim(result, laneEntry, operatorDecision, acceptedEventsView, readerObservation, productionPosture, backend)) {
    issues.push("operator-decision-authority-truth-or-execution-overclaim");
  }
  return [...new Set(issues)];
}

function statusFor(result: JsonRecord | undefined, issues: string[]) {
  if (!result) return "edge-local-layer-operator-decision-continuity-malformed-evidence";
  if (issues.some((issue) => issue.includes("unsafe") || issue.includes("overclaim"))) {
    return "edge-local-layer-operator-decision-continuity-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-operator-decision-continuity-incomplete-evidence";
  return "edge-local-layer-operator-decision-continuity-valid-evidence";
}

function collectRefs(result: JsonRecord | undefined) {
  const laneEntry = isRecord(result?.laneEntry) ? result.laneEntry : {};
  return {
    sourceResultRef: stringValue(result?.resultRef),
    sourceResultHash: stringValue(result?.resultHash),
    laneEntryRef: stringValue(laneEntry.entryId),
    laneEntryHash: stringValue(laneEntry.entryHash),
    semanticEventRef: stringValue(laneEntry.semanticEventRef),
    writerRefs: stringArray(result?.writerRefs),
    headRefs: stringArray(result?.headRefs),
    linearizedEntryRefs: stringArray(result?.linearizedEntryRefs),
  };
}

function collectBackend(result: JsonRecord | undefined) {
  const backend = isRecord(result?.backend) ? result.backend : {};
  return {
    backendKind: stringValue(backend.backendKind),
    corestoreOpened: backend.corestoreOpened === true,
    autobaseOpened: backend.autobaseOpened === true,
    productionBackendStarted: backend.productionBackendStarted === true,
    storageRootIsCanonicalSeam: backend.storageRootIsCanonicalSeam === true,
    edgeStateMigration: backend.edgeStateMigration === true,
    laneRef: stringValue(result?.laneRef),
    namespaceRef: stringValue(result?.namespaceRef),
  };
}

function collectLaneEntry(result: JsonRecord | undefined) {
  const entry = isRecord(result?.laneEntry) ? result.laneEntry : {};
  const semanticEvent = isRecord(entry.semanticEvent) ? entry.semanticEvent : {};
  const posture = isRecord(entry.entryPosture) ? entry.entryPosture : {};
  const nonClaims = isRecord(entry.nonClaims) ? entry.nonClaims : {};
  return {
    artifactKind: stringValue(entry.artifactKind),
    schemaVersion: stringValue(entry.schemaVersion),
    entryId: stringValue(entry.entryId),
    entryHash: stringValue(entry.entryHash),
    laneRef: stringValue(entry.laneRef),
    namespaceRef: stringValue(entry.namespaceRef),
    writerRef: stringValue(entry.writerRef),
    writerAdmissionRef: stringValue(entry.writerAdmissionRef),
    semanticEventKind: stringValue(entry.semanticEventKind),
    semanticEventRef: stringValue(entry.semanticEventRef),
    semanticEventEventKind: stringValue(semanticEvent.eventKind),
    semanticPayloadHash: stringValue(entry.semanticPayloadHash),
    sourceRefs: stringArray(entry.sourceRefs),
    productionLaneEntry: posture.productionLaneEntry === true,
    storageEnvelope: posture.storageEnvelope === true,
    semanticContinuityUnit: posture.semanticContinuityUnit === true,
    preservesSemanticContinuityEvent: posture.preservesSemanticContinuityEvent === true,
    acceptedContinuityInputBeforeApply: posture.acceptedContinuityInputBeforeApply === true,
    edgeStateMigration: posture.edgeStateMigration === true,
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    linearizationIsTruth: posture.linearizationIsTruth === true,
    replicaVisibilityIsContinuity: posture.replicaVisibilityIsContinuity === true,
    viewOutputIsSourceContinuity: posture.viewOutputIsSourceContinuity === true,
    localPathIsCanonicalSeam: posture.localPathIsCanonicalSeam === true,
    httpOrSshIsCanonicalSeam: posture.httpOrSshIsCanonicalSeam === true,
    truthClaimed: nonClaims.truthClaimed === true,
    authorityGranted: nonClaims.authorityGranted === true,
    meshTruthClaimed: nonClaims.meshTruthClaimed === true,
    causalTruthClaimed: nonClaims.causalTruthClaimed === true,
    testbedReadinessClaimed: nonClaims.testbedReadinessClaimed === true,
  };
}

function collectOperatorDecision(result: JsonRecord | undefined) {
  const entry = isRecord(result?.laneEntry) ? result.laneEntry : {};
  const event = isRecord(entry.semanticEvent) ? entry.semanticEvent : {};
  const approvedScope = isRecord(event.approvedScope) ? event.approvedScope : {};
  const forbiddenScope = isRecord(event.forbiddenScope) ? event.forbiddenScope : {};
  const visibility = isRecord(event.readerVisibilityPosture) ? event.readerVisibilityPosture : {};
  const posture = isRecord(event.operatorDecisionPosture) ? event.operatorDecisionPosture : {};
  const nonClaims = isRecord(event.nonClaims) ? event.nonClaims : {};
  return {
    eventKind: stringValue(event.eventKind),
    decisionKind: stringValue(event.decisionKind),
    operatorDecisionRef: stringValue(event.operatorDecisionRef),
    operatorSeatRef: stringValue(event.operatorSeatRef),
    targetRef: stringValue(event.targetRef),
    affectedArtifactRefs: stringArray(event.affectedArtifactRefs),
    sourceWorkPacketRef: stringValue(event.sourceWorkPacketRef),
    sourceReviewRefs: stringArray(event.sourceReviewRefs),
    approvedScopeRef: stringValue(approvedScope.scopeRef),
    approvedScopeSummary: stringValue(approvedScope.summary),
    forbiddenScopeRef: stringValue(forbiddenScope.scopeRef),
    forbiddenScopeSummary: stringValue(forbiddenScope.summary),
    decisionValue: stringValue(event.decisionValue),
    decisionReasonPresent: stringValue(event.decisionReason) !== undefined,
    decisionReasonDigest: stringValue(event.decisionReasonDigest),
    issuedAt: stringValue(event.issuedAt),
    provenanceRefs: stringArray(event.provenanceRefs),
    defaultReadOnlyObserverVisibility: stringValue(visibility.defaultReadOnlyObserverVisibility),
    fullDecisionReasonVisibleToReadOnlyObservers: visibility.fullDecisionReasonVisibleToReadOnlyObservers === true,
    fullDecisionReasonRequiresExplicitReaderPolicy: visibility.fullDecisionReasonRequiresExplicitReaderPolicy === true,
    viewAccessIsAuthority: visibility.viewAccessIsAuthority === true,
    viewAccessIsApproval: visibility.viewAccessIsApproval === true,
    rootAdjacentDecisionKind: posture.rootAdjacentDecisionKind === true,
    decisionIsExecution: posture.decisionIsExecution === true,
    decisionIsGlobalAuthority: posture.decisionIsGlobalAuthority === true,
    decisionIsReadiness: posture.decisionIsReadiness === true,
    decisionIsMaterialization: posture.decisionIsMaterialization === true,
    decisionIsWriterAdmission: posture.decisionIsWriterAdmission === true,
    decisionIsProductionPromotion: posture.decisionIsProductionPromotion === true,
    agentDraftIsOperatorApproval: posture.agentDraftIsOperatorApproval === true,
    edgeStatusIsApproval: posture.edgeStatusIsApproval === true,
    causalReviewIsTruth: posture.causalReviewIsTruth === true,
    testbedReviewIsReadiness: posture.testbedReviewIsReadiness === true,
    truthClaimed: nonClaims.truthClaimed === true,
    authorityGranted: nonClaims.authorityGranted === true,
    globalAuthorityGranted: nonClaims.globalAuthorityGranted === true,
    meshTruthClaimed: nonClaims.meshTruthClaimed === true,
    materializationClaimed: nonClaims.materializationClaimed === true,
    readinessClaimed: nonClaims.readinessClaimed === true,
    executionClaimed: nonClaims.executionClaimed === true,
    writerAdmissionClaimed: nonClaims.writerAdmissionClaimed === true,
    productionPromotionClaimed: nonClaims.productionPromotionClaimed === true,
    causalTruthClaimed: nonClaims.causalTruthClaimed === true,
    testbedReadinessClaimed: nonClaims.testbedReadinessClaimed === true,
    edgeStatusApprovalClaimed: nonClaims.edgeStatusApprovalClaimed === true,
  };
}

function collectAcceptedEventsView(result: JsonRecord | undefined) {
  const view = isRecord(result?.acceptedEventsView) ? result.acceptedEventsView : {};
  const posture = isRecord(view.viewPosture) ? view.viewPosture : {};
  const nonClaims = isRecord(view.nonClaims) ? view.nonClaims : {};
  const acceptedEvents = (Array.isArray(view.acceptedEvents) ? view.acceptedEvents : []).filter(isRecord);
  return {
    artifactKind: stringValue(view.artifactKind),
    schemaVersion: stringValue(view.schemaVersion),
    viewRef: stringValue(view.viewRef),
    acceptedEventCount: numberValue(view.acceptedEventCount),
    acceptedOperatorDecisionCount: numberValue(view.acceptedOperatorDecisionCount),
    acceptedDecisionKinds: stringArray(view.acceptedDecisionKinds),
    acceptedEventRefs: acceptedEvents.map((event) => stringValue(event.entryRef)).filter((ref): ref is string => ref !== undefined),
    fullDecisionReasonVisible: acceptedEvents.some((event) => stringValue(event.decisionReason) !== undefined),
    filteredReaderVisibility: acceptedEvents.some((event) => {
      const visibility = isRecord(event.readerVisibility) ? event.readerVisibility : {};
      return visibility.defaultReadOnlyObserverVisibility === "filtered_decision_posture" &&
        visibility.fullDecisionReasonVisible === false &&
        visibility.explicitReaderPolicyRequiredForFullReason === true &&
        visibility.viewAccessIsAuthority === false;
    }),
    derivedOnly: posture.derivedOnly === true,
    reconstructableFromSourceLane: posture.reconstructableFromSourceLane === true,
    viewIsSourceContinuity: posture.viewIsSourceContinuity === true,
    viewDeletionLosesSourceContinuity: posture.viewDeletionLosesSourceContinuity === true,
    rejectedEntriesAreAcceptedContinuity: posture.rejectedEntriesAreAcceptedContinuity === true,
    truthClaimed: nonClaims.truthClaimed === true,
    authorityGranted: nonClaims.authorityGranted === true,
    sourceContinuityClaimed: nonClaims.sourceContinuityClaimed === true,
  };
}

function collectReaderObservation(result: JsonRecord | undefined) {
  const observation = isRecord(result?.readerObservation) ? result.readerObservation : {};
  const transportPosture = isRecord(observation.transportPosture) ? observation.transportPosture : {};
  const nonClaims = isRecord(observation.nonClaims) ? observation.nonClaims : {};
  return {
    artifactKind: stringValue(observation.artifactKind),
    schemaVersion: stringValue(observation.schemaVersion),
    observationRef: stringValue(observation.observationRef),
    observerPath: stringValue(observation.observerPath),
    realReplicaProof: observation.realReplicaProof === true,
    readerRef: stringValue(observation.readerRef),
    readerDeviceRef: stringValue(observation.readerDeviceRef),
    observedAcceptedEventRefs: stringArray(observation.observedAcceptedEventRefs),
    readOnlyObserverCanReadAllowedView: observation.readOnlyObserverCanReadAllowedView === true,
    observerAppendBlocked: observation.observerAppendBlocked === true,
    readOnlyObserverCannotWriteAcceptedContinuity: observation.readOnlyObserverCannotWriteAcceptedContinuity === true,
    replicaVisibilityIsContinuity: observation.replicaVisibilityIsContinuity === true,
    viewOutputIsSourceContinuity: observation.viewOutputIsSourceContinuity === true,
    authorityGranted: observation.authorityGranted === true,
    transportKind: stringValue(transportPosture.transportKind),
    readOnlyReplica: transportPosture.readOnlyReplica === true,
    httpSeam: transportPosture.httpSeam === true,
    sshSeam: transportPosture.sshSeam === true,
    localPathIsCanonicalSeam: transportPosture.localPathIsCanonicalSeam === true,
    truthClaimed: nonClaims.truthClaimed === true,
    authorityNonClaimGranted: nonClaims.authorityGranted === true,
    writerGranted: nonClaims.writerGranted === true,
    continuityAcceptanceClaimed: nonClaims.continuityAcceptanceClaimed === true,
    sourceContinuityClaimed: nonClaims.sourceContinuityClaimed === true,
    readinessClaimed: nonClaims.readinessClaimed === true,
  };
}

function collectProductionPosture(result: JsonRecord | undefined) {
  const posture = isRecord(result?.productionPosture) ? result.productionPosture : {};
  const nonClaims = isRecord(result?.nonClaims) ? result.nonClaims : {};
  return {
    productionLanePromoted: posture.productionLanePromoted === true,
    productionLocalLayerContinuity: posture.productionLocalLayerContinuity === true,
    acceptedContinuityInputs: numberValue(posture.acceptedContinuityInputs),
    edgeStateMigration: posture.edgeStateMigration === true,
    defaultBackendSwitch: posture.defaultBackendSwitch === true,
    jsonCompatibilityRemoved: posture.jsonCompatibilityRemoved === true,
    httpOrSshCanonicalSeam: posture.httpOrSshCanonicalSeam === true,
    causalSubstrateBackendOwner: posture.causalSubstrateBackendOwner === true,
    testbedReadinessClaimed: posture.testbedReadinessClaimed === true,
    edgeStatusIsPromotionApproval: posture.edgeStatusIsPromotionApproval === true,
    truthClaimed: nonClaims.truthClaimed === true,
    completionClaimed: nonClaims.completionClaimed === true,
    authorityGranted: nonClaims.authorityGranted === true,
    meshTruthClaimed: nonClaims.meshTruthClaimed === true,
    causalTruthClaimed: nonClaims.causalTruthClaimed === true,
    rendererAuthorityClaimed: nonClaims.rendererAuthorityClaimed === true,
  };
}

function validBackend(backend: ReturnType<typeof collectBackend>) {
  return backend.backendKind === "autobase" &&
    backend.corestoreOpened === true &&
    backend.autobaseOpened === true &&
    backend.productionBackendStarted === true &&
    backend.storageRootIsCanonicalSeam === false &&
    backend.edgeStateMigration === false &&
    backend.laneRef === EXPECTED_LANE &&
    backend.namespaceRef === EXPECTED_NAMESPACE;
}

function validLaneEntry(entry: ReturnType<typeof collectLaneEntry>) {
  return entry.artifactKind === "mesh_ecology_local_layer_lane_entry" &&
    entry.schemaVersion === "mesh_ecology_local_layer_lane_entry.v0" &&
    entry.entryId !== undefined &&
    entry.entryHash !== undefined &&
    entry.laneRef === EXPECTED_LANE &&
    entry.namespaceRef === EXPECTED_NAMESPACE &&
    entry.writerRef !== undefined &&
    entry.writerAdmissionRef !== undefined &&
    entry.semanticEventKind === "mesh_ecology_local_layer_continuity_event" &&
    entry.semanticEventEventKind === EXPECTED_EVENT_KIND &&
    entry.semanticEventRef !== undefined &&
    entry.semanticPayloadHash !== undefined &&
    entry.sourceRefs.length >= 8 &&
    entry.productionLaneEntry === true &&
    entry.storageEnvelope === true &&
    entry.semanticContinuityUnit === false &&
    entry.preservesSemanticContinuityEvent === true &&
    entry.acceptedContinuityInputBeforeApply === false &&
    entry.edgeStateMigration === false &&
    entry.appendSuccessIsAcceptance === false &&
    entry.linearizationIsTruth === false &&
    entry.replicaVisibilityIsContinuity === false &&
    entry.viewOutputIsSourceContinuity === false &&
    entry.localPathIsCanonicalSeam === false &&
    entry.httpOrSshIsCanonicalSeam === false &&
    entry.truthClaimed === false &&
    entry.authorityGranted === false &&
    entry.meshTruthClaimed === false &&
    entry.causalTruthClaimed === false &&
    entry.testbedReadinessClaimed === false;
}

function validOperatorDecision(decision: ReturnType<typeof collectOperatorDecision>) {
  return decision.eventKind === EXPECTED_EVENT_KIND &&
    decision.decisionKind !== undefined &&
    ALLOWED_DECISION_KINDS.includes(decision.decisionKind as (typeof ALLOWED_DECISION_KINDS)[number]) &&
    !DEFERRED_ROOT_ADJACENT_DECISION_KINDS.includes(decision.decisionKind as (typeof DEFERRED_ROOT_ADJACENT_DECISION_KINDS)[number]) &&
    decision.operatorDecisionRef !== undefined &&
    decision.operatorSeatRef !== undefined &&
    (decision.targetRef !== undefined || decision.affectedArtifactRefs.length > 0) &&
    (decision.sourceWorkPacketRef !== undefined || decision.sourceReviewRefs.length > 0) &&
    decision.approvedScopeRef !== undefined &&
    decision.approvedScopeSummary !== undefined &&
    decision.forbiddenScopeRef !== undefined &&
    decision.forbiddenScopeSummary !== undefined &&
    decision.decisionValue !== undefined &&
    decision.decisionReasonDigest !== undefined &&
    decision.issuedAt !== undefined &&
    decision.provenanceRefs.length >= 6 &&
    decision.defaultReadOnlyObserverVisibility === "filtered_decision_posture" &&
    decision.fullDecisionReasonVisibleToReadOnlyObservers === false &&
    decision.fullDecisionReasonRequiresExplicitReaderPolicy === true &&
    decision.viewAccessIsAuthority === false &&
    decision.viewAccessIsApproval === false &&
    decision.rootAdjacentDecisionKind === false &&
    decision.decisionIsExecution === false &&
    decision.decisionIsGlobalAuthority === false &&
    decision.decisionIsReadiness === false &&
    decision.decisionIsMaterialization === false &&
    decision.decisionIsWriterAdmission === false &&
    decision.decisionIsProductionPromotion === false &&
    decision.agentDraftIsOperatorApproval === false &&
    decision.edgeStatusIsApproval === false &&
    decision.causalReviewIsTruth === false &&
    decision.testbedReviewIsReadiness === false &&
    decision.truthClaimed === false &&
    decision.authorityGranted === false &&
    decision.globalAuthorityGranted === false &&
    decision.meshTruthClaimed === false &&
    decision.materializationClaimed === false &&
    decision.readinessClaimed === false &&
    decision.executionClaimed === false &&
    decision.writerAdmissionClaimed === false &&
    decision.productionPromotionClaimed === false &&
    decision.causalTruthClaimed === false &&
    decision.testbedReadinessClaimed === false &&
    decision.edgeStatusApprovalClaimed === false;
}

function validAcceptedEventsView(
  view: ReturnType<typeof collectAcceptedEventsView>,
  entry: ReturnType<typeof collectLaneEntry>,
  decision: ReturnType<typeof collectOperatorDecision>,
) {
  return view.artifactKind === "edge_local_layer_production_accepted_events_view" &&
    view.schemaVersion === "edge_local_layer_production_accepted_events_view.v0" &&
    view.viewRef === "local-layer-continuity-accepted-events-view" &&
    view.acceptedEventCount >= 1 &&
    view.acceptedOperatorDecisionCount >= 1 &&
    view.acceptedEventRefs.includes(entry.entryId ?? "") &&
    view.acceptedDecisionKinds.includes(decision.decisionKind ?? "") &&
    view.filteredReaderVisibility === true &&
    view.fullDecisionReasonVisible === false &&
    view.derivedOnly === true &&
    view.reconstructableFromSourceLane === true &&
    view.viewIsSourceContinuity === false &&
    view.viewDeletionLosesSourceContinuity === false &&
    view.rejectedEntriesAreAcceptedContinuity === false &&
    view.truthClaimed === false &&
    view.authorityGranted === false &&
    view.sourceContinuityClaimed === false;
}

function validReaderObservation(
  observation: ReturnType<typeof collectReaderObservation>,
  entry: ReturnType<typeof collectLaneEntry>,
) {
  return observation.artifactKind === "edge_local_layer_production_reader_observation" &&
    observation.schemaVersion === "edge_local_layer_production_reader_observation.v0" &&
    observation.observationRef !== undefined &&
    observation.observerPath === "read-only-observer-view-replica-proof" &&
    observation.realReplicaProof === true &&
    observation.readerRef !== undefined &&
    observation.readerDeviceRef !== undefined &&
    observation.observedAcceptedEventRefs.includes(entry.entryId ?? "") &&
    observation.readOnlyObserverCanReadAllowedView === true &&
    observation.observerAppendBlocked === true &&
    observation.readOnlyObserverCannotWriteAcceptedContinuity === true &&
    observation.replicaVisibilityIsContinuity === false &&
    observation.viewOutputIsSourceContinuity === false &&
    observation.authorityGranted === false &&
    observation.transportKind === "corestore-protocol-stream" &&
    observation.readOnlyReplica === true &&
    observation.httpSeam === false &&
    observation.sshSeam === false &&
    observation.localPathIsCanonicalSeam === false &&
    observation.truthClaimed === false &&
    observation.authorityNonClaimGranted === false &&
    observation.writerGranted === false &&
    observation.continuityAcceptanceClaimed === false &&
    observation.sourceContinuityClaimed === false &&
    observation.readinessClaimed === false;
}

function validProductionPosture(posture: ReturnType<typeof collectProductionPosture>) {
  return posture.productionLanePromoted === true &&
    posture.productionLocalLayerContinuity === true &&
    posture.acceptedContinuityInputs >= 1 &&
    posture.edgeStateMigration === false &&
    posture.defaultBackendSwitch === false &&
    posture.jsonCompatibilityRemoved === false &&
    posture.httpOrSshCanonicalSeam === false &&
    posture.causalSubstrateBackendOwner === false &&
    posture.testbedReadinessClaimed === false &&
    posture.edgeStatusIsPromotionApproval === false &&
    posture.truthClaimed === false &&
    posture.completionClaimed === false &&
    posture.authorityGranted === false &&
    posture.meshTruthClaimed === false &&
    posture.causalTruthClaimed === false &&
    posture.rendererAuthorityClaimed === false;
}

function overclaim(
  result: JsonRecord,
  laneEntry: ReturnType<typeof collectLaneEntry>,
  decision: ReturnType<typeof collectOperatorDecision>,
  view: ReturnType<typeof collectAcceptedEventsView>,
  readerObservation: ReturnType<typeof collectReaderObservation>,
  posture: ReturnType<typeof collectProductionPosture>,
  backend: ReturnType<typeof collectBackend>,
) {
  return backend.storageRootIsCanonicalSeam ||
    backend.edgeStateMigration ||
    laneEntry.appendSuccessIsAcceptance ||
    laneEntry.linearizationIsTruth ||
    laneEntry.replicaVisibilityIsContinuity ||
    laneEntry.viewOutputIsSourceContinuity ||
    laneEntry.localPathIsCanonicalSeam ||
    laneEntry.httpOrSshIsCanonicalSeam ||
    laneEntry.truthClaimed ||
    laneEntry.authorityGranted ||
    laneEntry.meshTruthClaimed ||
    laneEntry.causalTruthClaimed ||
    decision.fullDecisionReasonVisibleToReadOnlyObservers ||
    decision.viewAccessIsAuthority ||
    decision.viewAccessIsApproval ||
    decision.rootAdjacentDecisionKind ||
    decision.decisionIsExecution ||
    decision.decisionIsGlobalAuthority ||
    decision.decisionIsReadiness ||
    decision.decisionIsMaterialization ||
    decision.decisionIsWriterAdmission ||
    decision.decisionIsProductionPromotion ||
    decision.agentDraftIsOperatorApproval ||
    decision.edgeStatusIsApproval ||
    decision.causalReviewIsTruth ||
    decision.testbedReviewIsReadiness ||
    decision.truthClaimed ||
    decision.authorityGranted ||
    decision.globalAuthorityGranted ||
    decision.meshTruthClaimed ||
    decision.materializationClaimed ||
    decision.readinessClaimed ||
    decision.executionClaimed ||
    decision.writerAdmissionClaimed ||
    decision.productionPromotionClaimed ||
    decision.causalTruthClaimed ||
    decision.testbedReadinessClaimed ||
    decision.edgeStatusApprovalClaimed ||
    view.fullDecisionReasonVisible ||
    view.viewIsSourceContinuity ||
    view.truthClaimed ||
    view.authorityGranted ||
    view.sourceContinuityClaimed ||
    readerObservation.replicaVisibilityIsContinuity ||
    readerObservation.viewOutputIsSourceContinuity ||
    readerObservation.authorityGranted ||
    readerObservation.httpSeam ||
    readerObservation.sshSeam ||
    readerObservation.localPathIsCanonicalSeam ||
    readerObservation.truthClaimed ||
    readerObservation.authorityNonClaimGranted ||
    readerObservation.writerGranted ||
    readerObservation.continuityAcceptanceClaimed ||
    readerObservation.sourceContinuityClaimed ||
    readerObservation.readinessClaimed ||
    posture.edgeStateMigration ||
    posture.defaultBackendSwitch ||
    posture.jsonCompatibilityRemoved ||
    posture.httpOrSshCanonicalSeam ||
    posture.causalSubstrateBackendOwner ||
    posture.testbedReadinessClaimed ||
    posture.edgeStatusIsPromotionApproval ||
    posture.truthClaimed ||
    posture.authorityGranted ||
    posture.meshTruthClaimed ||
    posture.causalTruthClaimed ||
    isRecord(result.nonClaims) === false;
}

function allRefs(
  refs: ReturnType<typeof collectRefs>,
  backend: ReturnType<typeof collectBackend>,
  entry: ReturnType<typeof collectLaneEntry>,
  decision: ReturnType<typeof collectOperatorDecision>,
  view: ReturnType<typeof collectAcceptedEventsView>,
  readerObservation: ReturnType<typeof collectReaderObservation>,
) {
  return [
    refs.sourceResultRef,
    refs.sourceResultHash,
    refs.laneEntryRef,
    refs.laneEntryHash,
    refs.semanticEventRef,
    ...refs.writerRefs,
    ...refs.headRefs,
    ...refs.linearizedEntryRefs,
    backend.laneRef,
    entry.entryId,
    entry.entryHash,
    entry.writerRef,
    entry.writerAdmissionRef,
    entry.semanticEventRef,
    ...entry.sourceRefs,
    decision.operatorDecisionRef,
    decision.operatorSeatRef,
    decision.targetRef,
    decision.sourceWorkPacketRef,
    ...decision.affectedArtifactRefs,
    ...decision.sourceReviewRefs,
    ...decision.provenanceRefs,
    view.viewRef,
    ...view.acceptedEventRefs,
    readerObservation.observationRef,
    readerObservation.readerRef,
    readerObservation.readerDeviceRef,
    ...readerObservation.observedAcceptedEventRefs,
  ].filter((ref): ref is string => typeof ref === "string");
}

function unsafeRef(ref: string) {
  return /^https?:\/\//i.test(ref) ||
    /^ssh:\/\//i.test(ref) ||
    /^git@/i.test(ref) ||
    ref.includes("\\") ||
    /\blocalhost\b/i.test(ref) ||
    /\b127\.0\.0\.1\b/.test(ref) ||
    ref.startsWith("/") ||
    ref.startsWith("./") ||
    ref.startsWith("../") ||
    ref.startsWith("~");
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
