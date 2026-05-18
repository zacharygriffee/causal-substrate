import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_CONTINUITY_LANE_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-production-continuity-lane-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_CONTINUITY_LANE_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_CONTINUITY_LANE_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-production-continuity-lane-evidence" as const;

type JsonRecord = Record<string, unknown>;

const EXPECTED_KIND = "edge_local_layer_production_continuity_lane_result";
const EXPECTED_SCHEMA = "edge_local_layer_production_continuity_lane_result.v0";
const EXPECTED_LANE = "local-layer-continuity-lane:operator-owned-devices";
const EXPECTED_NAMESPACE = "local-layer/continuity";
const EXPECTED_EVENT_KIND = "repo_work_packet_continuity_event";
const EXPECTED_READER_OBSERVATION_KIND = "edge_local_layer_production_reader_observation";
const EXPECTED_READER_OBSERVATION_SCHEMA = "edge_local_layer_production_reader_observation.v0";

export function buildEdgeLocalLayerProductionContinuityLaneEvidenceArtifact({
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
  const laneEntry = collectLaneEntry(result);
  const acceptedEventsView = collectAcceptedEventsView(result);
  const readerObservation = collectReaderObservation(result);
  const productionPosture = collectProductionPosture(result);
  const backend = collectBackend(result);
  const issues = validateResult(result, productionLaneResult, refs, laneEntry, acceptedEventsView, readerObservation, productionPosture, backend);
  const status = statusFor(result, issues);
  const id = artifactId ?? `causal-edge-local-layer-production-continuity-lane-evidence:${hash(JSON.stringify({
    emittedAt,
    resultRef: refs.sourceResultRef,
    laneEntryRef: refs.laneEntryRef,
    semanticEventRef: refs.semanticEventRef,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_CONTINUITY_LANE_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_CONTINUITY_LANE_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_CONTINUITY_LANE_EVIDENCE_SCHEMA_VERSION,
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
    acceptedEventsView,
    readerObservation,
    productionPosture,
    causalInterpretation: {
      interpretationKind: "observer-relative-local-layer-production-continuity-lane-evidence",
      interpretsProductionLaneResultAsEvidence: true,
      interpretsAcceptedContinuityInput: status === "edge-local-layer-production-continuity-lane-valid-evidence",
      semanticEventKind: laneEntry.semanticEventEventKind,
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
      grantsWriterAuthority: false,
      claimsCausalTruth: false,
      claimsMeshTruth: false,
      claimsLineageSettlement: false,
      migratesEdgeState: false,
    },
    validation: {
      status,
      parseableObject: result !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      refsPresent: issues.includes("refs-missing") === false,
      backendSafe: issues.includes("backend-missing-or-unsafe") === false,
      laneEntrySafe: issues.includes("lane-entry-missing-or-unsafe") === false,
      acceptedEventsViewSafe: issues.includes("accepted-events-view-missing-or-unsafe") === false,
      readerObservationSafe: issues.includes("reader-observation-missing-or-unsafe") === false,
      productionPostureSafe: issues.includes("production-posture-missing-or-unsafe") === false,
      refsSafe: issues.includes("unsafe-ref") === false,
      noAuthorityOrTruthOverclaim: issues.includes("production-continuity-authority-or-truth-overclaim") === false,
      issues,
    },
    reviewStatus: status === "edge-local-layer-production-continuity-lane-valid-evidence"
      ? "edge-local-layer-production-continuity-lane-evidence-emitted"
      : status,
    warnings: status === "edge-local-layer-production-continuity-lane-valid-evidence"
      ? [
          "production-continuity-lane-result-observed",
          "causal-substrate-review-is-not-truth",
          "accepted-lane-entry-is-not-mesh-truth",
          "read-only-observer-replica-proof-observed",
          "edge-state-migration-still-false",
        ]
      : ["edge-local-layer-production-continuity-lane-not-reviewable"],
    rejections: status === "edge-local-layer-production-continuity-lane-valid-evidence" ? [] : issues,
  };
}

function validateResult(
  result: JsonRecord | undefined,
  original: unknown,
  refs: ReturnType<typeof collectRefs>,
  laneEntry: ReturnType<typeof collectLaneEntry>,
  acceptedEventsView: ReturnType<typeof collectAcceptedEventsView>,
  readerObservation: ReturnType<typeof collectReaderObservation>,
  productionPosture: ReturnType<typeof collectProductionPosture>,
  backend: ReturnType<typeof collectBackend>,
) {
  const issues: string[] = [];
  if (!isRecord(original)) return ["production-continuity-lane-result-not-object"];
  if (!result) return ["production-continuity-lane-result-not-object"];
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
  if (allRefs(refs, backend, laneEntry, acceptedEventsView, readerObservation).some(unsafeRef)) issues.push("unsafe-ref");
  if (!validBackend(backend)) issues.push("backend-missing-or-unsafe");
  if (!validLaneEntry(laneEntry)) issues.push("lane-entry-missing-or-unsafe");
  if (!validAcceptedEventsView(acceptedEventsView, laneEntry)) issues.push("accepted-events-view-missing-or-unsafe");
  if (!validReaderObservation(readerObservation, laneEntry)) issues.push("reader-observation-missing-or-unsafe");
  if (!validProductionPosture(productionPosture)) issues.push("production-posture-missing-or-unsafe");
  if (overclaim(result, laneEntry, acceptedEventsView, readerObservation, productionPosture, backend)) {
    issues.push("production-continuity-authority-or-truth-overclaim");
  }
  return [...new Set(issues)];
}

function statusFor(result: JsonRecord | undefined, issues: string[]) {
  if (!result) return "edge-local-layer-production-continuity-lane-malformed-evidence";
  if (issues.some((issue) => issue.includes("unsafe") || issue.includes("overclaim"))) {
    return "edge-local-layer-production-continuity-lane-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-production-continuity-lane-incomplete-evidence";
  return "edge-local-layer-production-continuity-lane-valid-evidence";
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
    semanticEventSchema: stringValue(entry.semanticEventSchema),
    semanticEventRef: stringValue(entry.semanticEventRef),
    semanticEventEventKind: stringValue(semanticEvent.eventKind),
    semanticPayloadHash: stringValue(entry.semanticPayloadHash),
    sourceRefs: stringArray(entry.sourceRefs),
    parentEventRefs: stringArray(entry.parentEventRefs),
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

function collectAcceptedEventsView(result: JsonRecord | undefined) {
  const view = isRecord(result?.acceptedEventsView) ? result.acceptedEventsView : {};
  const posture = isRecord(view.viewPosture) ? view.viewPosture : {};
  const nonClaims = isRecord(view.nonClaims) ? view.nonClaims : {};
  return {
    artifactKind: stringValue(view.artifactKind),
    schemaVersion: stringValue(view.schemaVersion),
    viewRef: stringValue(view.viewRef),
    acceptedEventCount: numberValue(view.acceptedEventCount),
    acceptedEventRefs: (Array.isArray(view.acceptedEvents) ? view.acceptedEvents : [])
      .filter(isRecord)
      .map((event) => stringValue(event.entryRef))
      .filter((ref): ref is string => ref !== undefined),
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
    sourceViewKey: stringValue(observation.sourceViewKey),
    observerViewKey: stringValue(observation.observerViewKey),
    observedResultCount: numberValue(observation.observedResultCount),
    observedAcceptedEventCount: numberValue(observation.observedAcceptedEventCount),
    observedAcceptedEventRefs: stringArray(observation.observedAcceptedEventRefs),
    observedRejectedDiagnosticCount: numberValue(observation.observedRejectedDiagnosticCount),
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

function validAcceptedEventsView(
  view: ReturnType<typeof collectAcceptedEventsView>,
  entry: ReturnType<typeof collectLaneEntry>,
) {
  return view.artifactKind === "edge_local_layer_production_accepted_events_view" &&
    view.schemaVersion === "edge_local_layer_production_accepted_events_view.v0" &&
    view.viewRef === "local-layer-continuity-accepted-events-view" &&
    view.acceptedEventCount >= 1 &&
    view.acceptedEventRefs.includes(entry.entryId ?? "") &&
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
  return observation.artifactKind === EXPECTED_READER_OBSERVATION_KIND &&
    observation.schemaVersion === EXPECTED_READER_OBSERVATION_SCHEMA &&
    observation.observationRef !== undefined &&
    observation.observerPath === "read-only-observer-view-replica-proof" &&
    observation.realReplicaProof === true &&
    observation.readerRef !== undefined &&
    observation.readerDeviceRef !== undefined &&
    observation.sourceViewKey !== undefined &&
    observation.observerViewKey !== undefined &&
    observation.observedResultCount >= 1 &&
    observation.observedAcceptedEventCount >= 1 &&
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
    view.viewRef,
    ...view.acceptedEventRefs,
    readerObservation.observationRef,
    readerObservation.readerRef,
    readerObservation.readerDeviceRef,
    readerObservation.sourceViewKey,
    readerObservation.observerViewKey,
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
