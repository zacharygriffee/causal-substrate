import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-production-backend-wedge-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-production-backend-wedge-evidence" as const;

type JsonRecord = Record<string, unknown>;

const EXPECTED_KIND = "edge_local_layer_production_backend_wedge_packet";
const EXPECTED_SCHEMA = "edge_local_layer_production_backend_wedge_packet.v0";

export function buildEdgeLocalLayerProductionBackendWedgeEvidenceArtifact({
  backendWedgePacket,
  emittedAt,
  artifactId,
}: {
  backendWedgePacket: unknown;
  emittedAt: string;
  artifactId?: string;
}) {
  const packet = isRecord(backendWedgePacket) ? backendWedgePacket : undefined;
  const refs = collectRefs(packet);
  const wedge = collectBackendWedge(packet);
  const issues = validatePacket(packet, backendWedgePacket, refs, wedge);
  const status = statusFor(packet, issues);
  const id = artifactId ?? `causal-edge-local-layer-production-backend-wedge-evidence:${hash(JSON.stringify({
    emittedAt,
    wedgeId: refs.wedgeId,
    decisionRef: refs.sourceOperatorPromotionDecisionRef,
    nextGate: refs.nextGate,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_SCHEMA_VERSION,
    artifactId: id,
    emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(packet?.artifactKind === EXPECTED_KIND ? { sourceArtifactKind: EXPECTED_KIND } : {}),
      ...(packet?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    labAuthorization: collectLabAuthorization(packet),
    backendWedge: wedge,
    acceptanceRule: collectAcceptanceRule(packet),
    implementationRoute: collectImplementationRoute(packet),
    causalInterpretation: {
      interpretationKind: "observer-relative-local-layer-production-backend-wedge-evidence",
      backendWedgeEvidenceOnly: true,
      disposableLabAuthorizationObserved: collectLabAuthorization(packet).authorizesDisposableProductionShapedBackendLab,
      productionBackendStarted: false,
      productionLanePromoted: false,
      causalSubstrateOwnsBackend: false,
      causalSubstrateAcceptsTruth: false,
    },
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
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
      parseableObject: packet !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      refsPresent: issues.includes("refs-missing") === false,
      labAuthorizationSafe: issues.includes("lab-authorization-missing-or-unsafe") === false,
      backendWedgeSafe: issues.includes("backend-wedge-missing-or-unsafe") === false,
      acceptanceRuleSafe: issues.includes("acceptance-rule-missing-or-unsafe") === false,
      implementationRouteSafe: issues.includes("implementation-route-missing-or-unsafe") === false,
      refsSafe: issues.includes("unsafe-ref") === false,
      noProductionOverclaim: issues.includes("production-backend-authority-or-state-overclaim") === false,
      issues,
    },
    reviewStatus: status === "edge-local-layer-production-backend-wedge-valid-evidence"
      ? "edge-local-layer-production-backend-wedge-evidence-emitted"
      : status,
    warnings: status === "edge-local-layer-production-backend-wedge-valid-evidence"
      ? [
          "production-backend-wedge-observed",
          "disposable-production-shaped-lab-authorized",
          "production-backend-still-blocked",
          "production-lane-promotion-still-blocked",
        ]
      : ["edge-local-layer-production-backend-wedge-not-reviewable"],
    rejections: status === "edge-local-layer-production-backend-wedge-valid-evidence" ? [] : issues,
  };
}

function validatePacket(packet: JsonRecord | undefined, original: unknown, refs: ReturnType<typeof collectRefs>, wedge: ReturnType<typeof collectBackendWedge>) {
  const issues: string[] = [];
  if (!isRecord(original)) return ["backend-wedge-packet-not-object"];
  if (!packet) return ["backend-wedge-packet-not-object"];
  if (packet.artifactKind !== EXPECTED_KIND) issues.push("artifact-kind-mismatch");
  if (packet.schemaVersion !== EXPECTED_SCHEMA) issues.push("source-schema-mismatch");
  if (!refs.wedgeId || !refs.wedgeHash || !refs.sourceOperatorPromotionDecisionRef || !refs.sourceWriterAdmissionPacketRef || refs.sourceRefs.length < 8) {
    issues.push("refs-missing");
  }
  if (allRefs(refs, wedge).some(unsafeRef)) issues.push("unsafe-ref");
  if (!validLabAuthorization(collectLabAuthorization(packet))) issues.push("lab-authorization-missing-or-unsafe");
  if (!validBackendWedge(wedge)) issues.push("backend-wedge-missing-or-unsafe");
  if (!validAcceptanceRule(collectAcceptanceRule(packet))) issues.push("acceptance-rule-missing-or-unsafe");
  if (!validImplementationRoute(collectImplementationRoute(packet))) issues.push("implementation-route-missing-or-unsafe");
  if (productionOverclaim(packet)) issues.push("production-backend-authority-or-state-overclaim");
  return [...new Set(issues)];
}

function statusFor(packet: JsonRecord | undefined, issues: string[]) {
  if (!packet) return "edge-local-layer-production-backend-wedge-malformed-evidence";
  if (issues.some((issue) => issue.includes("unsafe") || issue.includes("overclaim"))) {
    return "edge-local-layer-production-backend-wedge-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-production-backend-wedge-incomplete-evidence";
  return "edge-local-layer-production-backend-wedge-valid-evidence";
}

function collectRefs(packet: JsonRecord | undefined) {
  const route = isRecord(packet?.implementationRoute) ? packet.implementationRoute : {};
  return {
    wedgeId: stringValue(packet?.wedgeId),
    wedgeHash: stringValue(packet?.wedgeHash),
    sourceOperatorPromotionDecisionRef: stringValue(packet?.sourceOperatorPromotionDecisionRef),
    sourceOperatorPromotionDecisionHash: stringValue(packet?.sourceOperatorPromotionDecisionHash),
    sourceWriterAdmissionPacketRef: stringValue(packet?.sourceWriterAdmissionPacketRef),
    sourceLayerRef: stringValue(packet?.sourceLayerRef),
    sourceLaneRef: stringValue(packet?.sourceLaneRef),
    sourceRefs: stringArray(packet?.sourceRefs),
    nextGate: stringValue(route.nextImplementationGate),
    finalGate: stringValue(route.finalPromotionGate),
  };
}

function collectLabAuthorization(packet: JsonRecord | undefined) {
  const auth = isRecord(packet?.labAuthorization) ? packet.labAuthorization : {};
  return {
    labAuthorizationRef: stringValue(auth.labAuthorizationRef),
    authorizesDisposableProductionShapedBackendLab: auth.authorizesDisposableProductionShapedBackendLab === true,
    authorizesProductionBackend: auth.authorizesProductionBackend === true,
    authorizesProductionLanePromotion: auth.authorizesProductionLanePromotion === true,
    authorizesEdgeStateMigration: auth.authorizesEdgeStateMigration === true,
    requiresDisposableStorageRoot: auth.requiresDisposableStorageRoot === true,
    requiresNoLocalPathAsContinuitySeam: auth.requiresNoLocalPathAsContinuitySeam === true,
    requiresNoHttpOrSshSeam: auth.requiresNoHttpOrSshSeam === true,
    requiresNoWriterAuthorityGrant: auth.requiresNoWriterAuthorityGrant === true,
  };
}

function collectBackendWedge(packet: JsonRecord | undefined) {
  const wedge = isRecord(packet?.backendWedge) ? packet.backendWedge : {};
  return {
    backendKind: stringValue(wedge.backendKind),
    namespaceRef: stringValue(wedge.namespaceRef),
    laneRef: stringValue(wedge.laneRef),
    storageLaneKind: stringValue(wedge.storageLaneKind),
    semanticInputKind: stringValue(wedge.semanticInputKind),
    storageEnvelopeKind: stringValue(wedge.storageEnvelopeKind),
    writerPolicyRef: stringValue(wedge.writerPolicyRef),
    readerPolicyRef: stringValue(wedge.readerPolicyRef),
    acceptanceRuleRef: stringValue(wedge.acceptanceRuleRef),
    productionBackendStarted: wedge.productionBackendStarted === true,
    productionLanePromoted: wedge.productionLanePromoted === true,
    edgeStateMigrationAllowed: wedge.edgeStateMigrationAllowed === true,
  };
}

function collectAcceptanceRule(packet: JsonRecord | undefined) {
  const rule = isRecord(packet?.acceptanceRule) ? packet.acceptanceRule : {};
  return {
    ruleKind: stringValue(rule.ruleKind),
    appendSuccessIsAcceptance: rule.appendSuccessIsAcceptance === true,
    applySuccessIsTruth: rule.applySuccessIsTruth === true,
    labSuccessIsProductionReadiness: rule.labSuccessIsProductionReadiness === true,
    wedgePacketIsProductionPromotion: rule.wedgePacketIsProductionPromotion === true,
    requiresSeparateProductionPromotionGate: rule.requiresSeparateProductionPromotionGate === true,
  };
}

function collectImplementationRoute(packet: JsonRecord | undefined) {
  const route = isRecord(packet?.implementationRoute) ? packet.implementationRoute : {};
  return {
    currentStage: stringValue(route.currentStage),
    previousStage: stringValue(route.previousStage),
    nextImplementationGate: stringValue(route.nextImplementationGate),
    finalPromotionGate: stringValue(route.finalPromotionGate),
    disposableLabAuthorized: route.disposableLabAuthorized === true,
    productionBackendAllowed: route.productionBackendAllowed === true,
    productionLanePromotionAllowed: route.productionLanePromotionAllowed === true,
    edgeStateMigrationAllowed: route.edgeStateMigrationAllowed === true,
  };
}

function validLabAuthorization(auth: ReturnType<typeof collectLabAuthorization>) {
  return auth.labAuthorizationRef !== undefined &&
    auth.authorizesDisposableProductionShapedBackendLab === true &&
    auth.authorizesProductionBackend === false &&
    auth.authorizesProductionLanePromotion === false &&
    auth.authorizesEdgeStateMigration === false &&
    auth.requiresDisposableStorageRoot === true &&
    auth.requiresNoLocalPathAsContinuitySeam === true &&
    auth.requiresNoHttpOrSshSeam === true &&
    auth.requiresNoWriterAuthorityGrant === true;
}

function validBackendWedge(wedge: ReturnType<typeof collectBackendWedge>) {
  return wedge.backendKind === "autobase" &&
    wedge.namespaceRef === "corestore-namespace:local-layer-continuity-production-shaped-lab" &&
    wedge.laneRef === "local-layer-continuity-lane:operator-owned-devices-production-shaped-lab" &&
    wedge.storageLaneKind === "bounded_autobase_local_layer_continuity_lane" &&
    wedge.semanticInputKind === "mesh_ecology_local_layer_continuity_event" &&
    wedge.storageEnvelopeKind === "mesh_ecology_local_layer_lane_entry" &&
    wedge.writerPolicyRef === "writer-admission-policy:operator-owned-device-writer-admission-v0" &&
    wedge.readerPolicyRef === "reader-policy:operator-owned-local-layer-readers-by-explicit-refs" &&
    wedge.productionBackendStarted === false &&
    wedge.productionLanePromoted === false &&
    wedge.edgeStateMigrationAllowed === false;
}

function validAcceptanceRule(rule: ReturnType<typeof collectAcceptanceRule>) {
  return rule.ruleKind === "production_backend_wedge_authorizes_disposable_lab_only" &&
    rule.appendSuccessIsAcceptance === false &&
    rule.applySuccessIsTruth === false &&
    rule.labSuccessIsProductionReadiness === false &&
    rule.wedgePacketIsProductionPromotion === false &&
    rule.requiresSeparateProductionPromotionGate === true;
}

function validImplementationRoute(route: ReturnType<typeof collectImplementationRoute>) {
  return route.currentStage === "production_backend_wedge" &&
    route.previousStage === "operator_recorded_promotion_decision" &&
    route.nextImplementationGate === "disposable_production_shaped_backend_lab" &&
    route.finalPromotionGate === "production_local_layer_lane_promotion_decision" &&
    route.disposableLabAuthorized === true &&
    route.productionBackendAllowed === false &&
    route.productionLanePromotionAllowed === false &&
    route.edgeStateMigrationAllowed === false;
}

function productionOverclaim(packet: JsonRecord) {
  const auth = collectLabAuthorization(packet);
  const wedge = collectBackendWedge(packet);
  const route = collectImplementationRoute(packet);
  const boundary = isRecord(packet.boundary) ? packet.boundary : {};
  const nonClaims = isRecord(packet.nonClaims) ? packet.nonClaims : {};
  return auth.authorizesProductionBackend === true ||
    auth.authorizesProductionLanePromotion === true ||
    auth.authorizesEdgeStateMigration === true ||
    wedge.productionBackendStarted === true ||
    wedge.productionLanePromoted === true ||
    wedge.edgeStateMigrationAllowed === true ||
    route.productionBackendAllowed === true ||
    route.productionLanePromotionAllowed === true ||
    route.edgeStateMigrationAllowed === true ||
    boundary.opensAutobase === true ||
    boundary.opensCorestore === true ||
    boundary.writesAutobase === true ||
    boundary.writesContinuityRecords === true ||
    boundary.startsProductionBackend === true ||
    boundary.productionLocalLayerState === true ||
    boundary.migratesEdgeState === true ||
    boundary.grantsWriterAuthority === true ||
    nonClaims.writerAuthorityGranted === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.causalTruthClaimed === true ||
    nonClaims.productionProofClaimed === true ||
    nonClaims.productionLanePromoted === true ||
    nonClaims.productionBackendStarted === true;
}

function allRefs(refs: ReturnType<typeof collectRefs>, wedge: ReturnType<typeof collectBackendWedge>) {
  return [
    refs.wedgeId,
    refs.wedgeHash,
    refs.sourceOperatorPromotionDecisionRef,
    refs.sourceOperatorPromotionDecisionHash,
    refs.sourceWriterAdmissionPacketRef,
    refs.sourceLayerRef,
    refs.sourceLaneRef,
    ...refs.sourceRefs,
    refs.nextGate,
    refs.finalGate,
    wedge.namespaceRef,
    wedge.laneRef,
    wedge.writerPolicyRef,
    wedge.readerPolicyRef,
    wedge.acceptanceRuleRef,
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
