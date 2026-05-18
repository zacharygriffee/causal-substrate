import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-disposable-production-shaped-backend-lab-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-disposable-production-shaped-backend-lab-evidence" as const;

type JsonRecord = Record<string, unknown>;

const EXPECTED_KIND = "edge_local_layer_disposable_production_shaped_backend_lab_result";
const EXPECTED_SCHEMA = "edge_local_layer_disposable_production_shaped_backend_lab_result.v0";

export function buildEdgeLocalLayerDisposableProductionShapedBackendLabEvidenceArtifact({
  labResult,
  emittedAt,
  artifactId,
}: {
  labResult: unknown;
  emittedAt: string;
  artifactId?: string;
}) {
  const result = isRecord(labResult) ? labResult : undefined;
  const refs = collectRefs(result);
  const backendShape = collectBackendShape(result);
  const issues = validateLabResult(result, labResult, refs, backendShape);
  const status = statusFor(result, issues);
  const id = artifactId ?? `causal-edge-local-layer-disposable-production-shaped-backend-lab-evidence:${hash(JSON.stringify({
    emittedAt,
    artifactId: refs.sourceArtifactId,
    wedgeRef: refs.sourceProductionBackendWedgeRef,
    laneEntryRef: refs.laneEntryRef,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_SCHEMA_VERSION,
    artifactId: id,
    emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(result?.artifactKind === EXPECTED_KIND ? { sourceArtifactKind: EXPECTED_KIND } : {}),
      ...(result?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    backendShape,
    laneEntry: collectLaneEntry(result),
    acceptancePosture: collectAcceptancePosture(result),
    storageRootPosture: collectStorageRootPosture(result),
    productionGateDecision: collectProductionGateDecision(result),
    labPosture: collectLabPosture(result),
    causalInterpretation: {
      interpretationKind: "observer-relative-local-layer-disposable-production-shaped-backend-lab-evidence",
      disposableBackendLabEvidenceOnly: true,
      laneEntryPreservedAsStorageEnvelope: collectLaneEntry(result).preservesSemanticContinuityEvent,
      productionBackendStarted: false,
      productionLanePromoted: false,
      edgeStateMigrated: false,
      causalSubstrateOwnsBackend: false,
      causalSubstrateAcceptsTruth: false,
    },
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
      observesDisposableAutobaseLab: true,
      opensAutobase: false,
      opensCorestore: false,
      writesContinuityRecords: false,
      startsProductionBackend: false,
      grantsWriterAuthority: false,
      claimsCausalTruth: false,
      migratesEdgeState: false,
    },
    validation: {
      status,
      parseableObject: result !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      refsPresent: issues.includes("refs-missing") === false,
      backendShapeSafe: issues.includes("backend-shape-missing-or-unsafe") === false,
      laneEntrySafe: issues.includes("lane-entry-missing-or-unsafe") === false,
      acceptancePostureSafe: issues.includes("acceptance-posture-missing-or-unsafe") === false,
      storageRootPostureSafe: issues.includes("storage-root-posture-missing-or-unsafe") === false,
      productionGateSafe: issues.includes("production-gate-missing-or-unsafe") === false,
      labPostureSafe: issues.includes("lab-posture-missing-or-unsafe") === false,
      refsSafe: issues.includes("unsafe-ref") === false,
      noProductionOverclaim: issues.includes("production-backend-lab-authority-or-state-overclaim") === false,
      issues,
    },
    reviewStatus: status === "edge-local-layer-disposable-production-shaped-backend-lab-valid-evidence"
      ? "edge-local-layer-disposable-production-shaped-backend-lab-evidence-emitted"
      : status,
    warnings: status === "edge-local-layer-disposable-production-shaped-backend-lab-valid-evidence"
      ? [
          "disposable-production-shaped-backend-lab-observed",
          "autobase-corestore-lab-opened-in-disposable-storage",
          "production-backend-still-blocked",
          "production-lane-promotion-still-blocked",
        ]
      : ["edge-local-layer-disposable-production-shaped-backend-lab-not-reviewable"],
    rejections: status === "edge-local-layer-disposable-production-shaped-backend-lab-valid-evidence" ? [] : issues,
  };
}

function validateLabResult(
  result: JsonRecord | undefined,
  original: unknown,
  refs: ReturnType<typeof collectRefs>,
  backendShape: ReturnType<typeof collectBackendShape>,
) {
  const issues: string[] = [];
  if (!isRecord(original)) return ["disposable-production-shaped-backend-lab-result-not-object"];
  if (!result) return ["disposable-production-shaped-backend-lab-result-not-object"];
  if (result.artifactKind !== EXPECTED_KIND) issues.push("artifact-kind-mismatch");
  if (result.schemaVersion !== EXPECTED_SCHEMA) issues.push("source-schema-mismatch");
  if (
    !refs.sourceArtifactId ||
    !refs.sourceArtifactHash ||
    !refs.sourceProductionBackendWedgeRef ||
    !refs.sourceOperatorPromotionDecisionRef ||
    !refs.sourceWriterAdmissionPacketRef ||
    !refs.laneEntryRef ||
    refs.sourceRefs.length < 12 ||
    refs.writerRefs.length < 1 ||
    refs.headRefs.length < 1 ||
    refs.linearizedEntryRefs.length < 1
  ) {
    issues.push("refs-missing");
  }
  if (allRefs(refs, backendShape).some(unsafeRef)) issues.push("unsafe-ref");
  if (!validBackendShape(backendShape)) issues.push("backend-shape-missing-or-unsafe");
  if (!validLaneEntry(collectLaneEntry(result), backendShape)) issues.push("lane-entry-missing-or-unsafe");
  if (!validAcceptancePosture(collectAcceptancePosture(result))) issues.push("acceptance-posture-missing-or-unsafe");
  if (!validStorageRootPosture(collectStorageRootPosture(result))) issues.push("storage-root-posture-missing-or-unsafe");
  if (!validProductionGate(collectProductionGateDecision(result))) issues.push("production-gate-missing-or-unsafe");
  if (!validLabPosture(collectLabPosture(result))) issues.push("lab-posture-missing-or-unsafe");
  if (productionOverclaim(result)) issues.push("production-backend-lab-authority-or-state-overclaim");
  return [...new Set(issues)];
}

function statusFor(result: JsonRecord | undefined, issues: string[]) {
  if (!result) return "edge-local-layer-disposable-production-shaped-backend-lab-malformed-evidence";
  if (issues.some((issue) => issue.includes("unsafe") || issue.includes("overclaim"))) {
    return "edge-local-layer-disposable-production-shaped-backend-lab-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-disposable-production-shaped-backend-lab-incomplete-evidence";
  return "edge-local-layer-disposable-production-shaped-backend-lab-valid-evidence";
}

function collectRefs(result: JsonRecord | undefined) {
  const laneEntry = isRecord(result?.laneEntry) ? result.laneEntry : {};
  return {
    sourceArtifactId: stringValue(result?.artifactId),
    sourceArtifactHash: stringValue(result?.artifactHash),
    sourceProductionBackendWedgeRef: stringValue(result?.sourceProductionBackendWedgeRef),
    sourceProductionBackendWedgeHash: stringValue(result?.sourceProductionBackendWedgeHash),
    sourceOperatorPromotionDecisionRef: stringValue(result?.sourceOperatorPromotionDecisionRef),
    sourceWriterAdmissionPacketRef: stringValue(result?.sourceWriterAdmissionPacketRef),
    sourceRefs: stringArray(result?.sourceRefs),
    laneEntryRef: stringValue(laneEntry.entryId),
    laneEntryHash: stringValue(laneEntry.entryHash),
    semanticEventRef: stringValue(laneEntry.semanticEventRef),
    writerRefs: stringArray(result?.writerRefs),
    headRefs: stringArray(result?.headRefs),
    linearizedEntryRefs: stringArray(result?.linearizedEntryRefs),
  };
}

function collectBackendShape(result: JsonRecord | undefined) {
  const backend = isRecord(result?.backendShape) ? result.backendShape : {};
  return {
    backendKind: stringValue(backend.backendKind),
    corestoreRole: stringValue(backend.corestoreRole),
    corestorePolicy: stringValue(backend.corestorePolicy),
    namespacePolicy: stringValue(backend.namespacePolicy),
    namespaceRef: stringValue(backend.namespaceRef),
    laneRef: stringValue(backend.laneRef),
    storageLaneKind: stringValue(backend.storageLaneKind),
    semanticInputKind: stringValue(backend.semanticInputKind),
    semanticInputSchema: stringValue(backend.semanticInputSchema),
    storageEnvelopeKind: stringValue(backend.storageEnvelopeKind),
    storageEnvelopeSchema: stringValue(backend.storageEnvelopeSchema),
  };
}

function collectLaneEntry(result: JsonRecord | undefined) {
  const entry = isRecord(result?.laneEntry) ? result.laneEntry : {};
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
    semanticEventKind: stringValue(entry.semanticEventKind),
    semanticEventRef: stringValue(entry.semanticEventRef),
    semanticPayloadHash: stringValue(entry.semanticPayloadHash),
    sourceRefs: stringArray(entry.sourceRefs),
    labStorageEnvelope: posture.labStorageEnvelope === true,
    semanticContinuityUnit: posture.semanticContinuityUnit === true,
    preservesSemanticContinuityEvent: posture.preservesSemanticContinuityEvent === true,
    productionLaneEntry: posture.productionLaneEntry === true,
    productionLocalLayerState: posture.productionLocalLayerState === true,
    durableLocalLayerContinuity: posture.durableLocalLayerContinuity === true,
    edgeStateMigration: posture.edgeStateMigration === true,
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    linearizationIsTruth: posture.linearizationIsTruth === true,
    replicaVisibilityIsContinuity: posture.replicaVisibilityIsContinuity === true,
    truthClaimed: nonClaims.truthClaimed === true,
    authorityGranted: nonClaims.authorityGranted === true,
    durableStateClaimed: nonClaims.durableStateClaimed === true,
    replicatedStateClaimed: nonClaims.replicatedStateClaimed === true,
  };
}

function collectAcceptancePosture(result: JsonRecord | undefined) {
  const posture = isRecord(result?.acceptancePosture) ? result.acceptancePosture : {};
  return {
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    applySuccessIsTruth: posture.applySuccessIsTruth === true,
    linearizationIsTruth: posture.linearizationIsTruth === true,
    replicaVisibilityIsContinuity: posture.replicaVisibilityIsContinuity === true,
    labSuccessIsProductionReadiness: posture.labSuccessIsProductionReadiness === true,
    wedgePacketIsProductionPromotion: posture.wedgePacketIsProductionPromotion === true,
    acceptedProductionContinuity: posture.acceptedProductionContinuity === true,
    requiresSeparateProductionPromotionGate: posture.requiresSeparateProductionPromotionGate === true,
  };
}

function collectStorageRootPosture(result: JsonRecord | undefined) {
  const posture = isRecord(result?.storageRootPosture) ? result.storageRootPosture : {};
  return {
    disposableStorageRootRequired: posture.disposableStorageRootRequired === true,
    localPathIsLabInputOnly: posture.localPathIsLabInputOnly === true,
    localPathIsContinuitySeam: posture.localPathIsContinuitySeam === true,
    localPathIsCanonicalIdentity: posture.localPathIsCanonicalIdentity === true,
    edgeStateMigration: posture.edgeStateMigration === true,
  };
}

function collectProductionGateDecision(result: JsonRecord | undefined) {
  const gate = isRecord(result?.productionGateDecision) ? result.productionGateDecision : {};
  return {
    gateState: stringValue(gate.gateState),
    decision: stringValue(gate.decision),
    nextGate: stringValue(gate.nextGate),
    productionIsExpectedFutureWork: gate.productionIsExpectedFutureWork === true,
    productionBackendStarted: gate.productionBackendStarted === true,
    productionLanePromoted: gate.productionLanePromoted === true,
    edgeStateMigrationAllowed: gate.edgeStateMigrationAllowed === true,
    requiredBeforeNextGate: stringArray(gate.requiredBeforeNextGate),
  };
}

function collectLabPosture(result: JsonRecord | undefined) {
  const posture = isRecord(result?.labPosture) ? result.labPosture : {};
  return {
    disposableProductionShapedBackendLab: posture.disposableProductionShapedBackendLab === true,
    sandboxedAutobaseLab: posture.sandboxedAutobaseLab === true,
    productionShapedNamespace: posture.productionShapedNamespace === true,
    autobaseBackendOpened: posture.autobaseBackendOpened === true,
    corestoreOpened: posture.corestoreOpened === true,
    writesAutobase: posture.writesAutobase === true,
    derivedViewMaterialized: posture.derivedViewMaterialized === true,
    implementationWedge: posture.implementationWedge === true,
    productionBackendStarted: posture.productionBackendStarted === true,
    productionLocalLayerState: posture.productionLocalLayerState === true,
    productionLanePromoted: posture.productionLanePromoted === true,
    writesDurableLocalLayerState: posture.writesDurableLocalLayerState === true,
    edgeStateMigration: posture.edgeStateMigration === true,
    localStoreRootIsIntegrationSeam: posture.localStoreRootIsIntegrationSeam === true,
    httpSeam: posture.httpSeam === true,
    sshSeam: posture.sshSeam === true,
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    applySuccessIsTruth: posture.applySuccessIsTruth === true,
    labResultIsReadiness: posture.labResultIsReadiness === true,
  };
}

function validBackendShape(backend: ReturnType<typeof collectBackendShape>) {
  return backend.backendKind === "autobase" &&
    backend.corestoreRole === "local-layer-node" &&
    backend.corestorePolicy === "one-corestore-per-role-process" &&
    backend.namespacePolicy === "stable-namespaces-within-role-corestore" &&
    backend.namespaceRef === "corestore-namespace:local-layer-continuity-production-shaped-lab" &&
    backend.laneRef === "local-layer-continuity-lane:operator-owned-devices-production-shaped-lab" &&
    backend.storageLaneKind === "bounded_autobase_local_layer_continuity_lane" &&
    backend.semanticInputKind === "mesh_ecology_local_layer_continuity_event" &&
    backend.storageEnvelopeKind === "mesh_ecology_local_layer_lane_entry";
}

function validLaneEntry(entry: ReturnType<typeof collectLaneEntry>, backend: ReturnType<typeof collectBackendShape>) {
  return entry.artifactKind === "mesh_ecology_local_layer_lane_entry" &&
    entry.schemaVersion === "mesh_ecology_local_layer_lane_entry.v0" &&
    entry.entryId !== undefined &&
    entry.entryHash !== undefined &&
    entry.laneRef === backend.laneRef &&
    entry.namespaceRef === backend.namespaceRef &&
    entry.writerRef !== undefined &&
    entry.semanticEventKind === "mesh_ecology_local_layer_continuity_event" &&
    entry.semanticEventRef !== undefined &&
    entry.semanticPayloadHash !== undefined &&
    entry.sourceRefs.length >= 6 &&
    entry.labStorageEnvelope === true &&
    entry.semanticContinuityUnit === false &&
    entry.preservesSemanticContinuityEvent === true &&
    entry.productionLaneEntry === false &&
    entry.productionLocalLayerState === false &&
    entry.durableLocalLayerContinuity === false &&
    entry.edgeStateMigration === false &&
    entry.appendSuccessIsAcceptance === false &&
    entry.linearizationIsTruth === false &&
    entry.replicaVisibilityIsContinuity === false &&
    entry.truthClaimed === false &&
    entry.authorityGranted === false &&
    entry.durableStateClaimed === false &&
    entry.replicatedStateClaimed === false;
}

function validAcceptancePosture(posture: ReturnType<typeof collectAcceptancePosture>) {
  return posture.appendSuccessIsAcceptance === false &&
    posture.applySuccessIsTruth === false &&
    posture.linearizationIsTruth === false &&
    posture.replicaVisibilityIsContinuity === false &&
    posture.labSuccessIsProductionReadiness === false &&
    posture.wedgePacketIsProductionPromotion === false &&
    posture.acceptedProductionContinuity === false &&
    posture.requiresSeparateProductionPromotionGate === true;
}

function validStorageRootPosture(posture: ReturnType<typeof collectStorageRootPosture>) {
  return posture.disposableStorageRootRequired === true &&
    posture.localPathIsLabInputOnly === true &&
    posture.localPathIsContinuitySeam === false &&
    posture.localPathIsCanonicalIdentity === false &&
    posture.edgeStateMigration === false;
}

function validProductionGate(gate: ReturnType<typeof collectProductionGateDecision>) {
  return gate.gateState === "disposable_production_shaped_backend_lab_allowed_production_promotion_blocked" &&
    gate.decision === "continue_lab_backed_wedge_only" &&
    gate.nextGate === "production_local_layer_lane_promotion_decision" &&
    gate.productionIsExpectedFutureWork === true &&
    gate.productionBackendStarted === false &&
    gate.productionLanePromoted === false &&
    gate.edgeStateMigrationAllowed === false &&
    gate.requiredBeforeNextGate.includes("production_lane_promotion_decision");
}

function validLabPosture(posture: ReturnType<typeof collectLabPosture>) {
  return posture.disposableProductionShapedBackendLab === true &&
    posture.sandboxedAutobaseLab === true &&
    posture.productionShapedNamespace === true &&
    posture.autobaseBackendOpened === true &&
    posture.corestoreOpened === true &&
    posture.writesAutobase === true &&
    posture.derivedViewMaterialized === true &&
    posture.implementationWedge === true &&
    posture.productionBackendStarted === false &&
    posture.productionLocalLayerState === false &&
    posture.productionLanePromoted === false &&
    posture.writesDurableLocalLayerState === false &&
    posture.edgeStateMigration === false &&
    posture.localStoreRootIsIntegrationSeam === false &&
    posture.httpSeam === false &&
    posture.sshSeam === false &&
    posture.appendSuccessIsAcceptance === false &&
    posture.applySuccessIsTruth === false &&
    posture.labResultIsReadiness === false;
}

function productionOverclaim(result: JsonRecord) {
  const entry = collectLaneEntry(result);
  const acceptance = collectAcceptancePosture(result);
  const storage = collectStorageRootPosture(result);
  const gate = collectProductionGateDecision(result);
  const posture = collectLabPosture(result);
  const nonClaims = isRecord(result.nonClaims) ? result.nonClaims : {};
  return entry.productionLaneEntry === true ||
    entry.productionLocalLayerState === true ||
    entry.durableLocalLayerContinuity === true ||
    entry.edgeStateMigration === true ||
    entry.appendSuccessIsAcceptance === true ||
    entry.linearizationIsTruth === true ||
    entry.replicaVisibilityIsContinuity === true ||
    entry.truthClaimed === true ||
    entry.authorityGranted === true ||
    entry.durableStateClaimed === true ||
    entry.replicatedStateClaimed === true ||
    acceptance.appendSuccessIsAcceptance === true ||
    acceptance.applySuccessIsTruth === true ||
    acceptance.linearizationIsTruth === true ||
    acceptance.replicaVisibilityIsContinuity === true ||
    acceptance.labSuccessIsProductionReadiness === true ||
    acceptance.wedgePacketIsProductionPromotion === true ||
    acceptance.acceptedProductionContinuity === true ||
    storage.localPathIsContinuitySeam === true ||
    storage.localPathIsCanonicalIdentity === true ||
    storage.edgeStateMigration === true ||
    gate.productionBackendStarted === true ||
    gate.productionLanePromoted === true ||
    gate.edgeStateMigrationAllowed === true ||
    posture.productionBackendStarted === true ||
    posture.productionLocalLayerState === true ||
    posture.productionLanePromoted === true ||
    posture.writesDurableLocalLayerState === true ||
    posture.edgeStateMigration === true ||
    posture.localStoreRootIsIntegrationSeam === true ||
    posture.httpSeam === true ||
    posture.sshSeam === true ||
    posture.appendSuccessIsAcceptance === true ||
    posture.applySuccessIsTruth === true ||
    posture.labResultIsReadiness === true ||
    nonClaims.truthClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.writerAuthorityGranted === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.canonicalHistoryClaimed === true ||
    nonClaims.runtimeAuthorityClaimed === true ||
    nonClaims.productionProofClaimed === true;
}

function allRefs(refs: ReturnType<typeof collectRefs>, backendShape: ReturnType<typeof collectBackendShape>) {
  return [
    refs.sourceArtifactId,
    refs.sourceArtifactHash,
    refs.sourceProductionBackendWedgeRef,
    refs.sourceProductionBackendWedgeHash,
    refs.sourceOperatorPromotionDecisionRef,
    refs.sourceWriterAdmissionPacketRef,
    ...refs.sourceRefs,
    refs.laneEntryRef,
    refs.laneEntryHash,
    refs.semanticEventRef,
    ...refs.writerRefs,
    ...refs.headRefs,
    ...refs.linearizedEntryRefs,
    backendShape.namespaceRef,
    backendShape.laneRef,
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
