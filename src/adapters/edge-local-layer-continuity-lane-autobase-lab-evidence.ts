import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-continuity-lane-autobase-lab-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-continuity-lane-autobase-lab-evidence" as const;

type JsonRecord = Record<string, unknown>;

const EXPECTED_KIND = "edge_local_layer_continuity_lane_autobase_lab_result";
const EXPECTED_SCHEMA = "edge_local_layer_continuity_lane_autobase_lab_result.v0";
const EXPECTED_LANE_ENTRY_KIND = "mesh_ecology_local_layer_lane_entry";
const EXPECTED_LANE_ENTRY_SCHEMA = "mesh_ecology_local_layer_lane_entry.v0";
const EXPECTED_GATE_STATE = "implementation_wedge_allowed_production_promotion_blocked";
const EXPECTED_NEXT_GATE = "production_local_layer_lane_promotion_decision";

export function buildEdgeLocalLayerContinuityLaneAutobaseLabEvidenceArtifact({
  labResult,
  emittedAt,
  artifactId,
}: {
  labResult: unknown;
  emittedAt: string;
  artifactId?: string;
}) {
  const result = isRecord(labResult) ? labResult : undefined;
  const issues = validateLabResult(result, labResult);
  const status = statusFor(result, issues);
  const refs = collectRefs(result);
  const id = artifactId ?? `causal-edge-local-layer-continuity-lane-autobase-lab-evidence:${hash(JSON.stringify({
    emittedAt,
    laneEntryId: refs.laneEntryId,
    semanticEventRef: refs.semanticEventRef,
    nextGate: refs.nextGate,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_SCHEMA_VERSION,
    artifactId: id,
    emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(result?.artifactKind === EXPECTED_KIND ? { sourceArtifactKind: EXPECTED_KIND } : {}),
      ...(result?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    laneEntryPosture: collectLaneEntryPosture(result),
    labPosture: collectLabPosture(result),
    productionGateDecision: collectGate(result),
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      callsEdge: false,
      writesContinuityRecords: false,
      acceptsProductionContinuity: false,
      claimsCausalTruth: false,
      startsProductionBackend: false,
      migratesEdgeState: false,
      grantsWriterAuthority: false,
    },
    interpretation: {
      interpretsAs: "observer-relative-continuity-lane-entry-lab-evidence",
      continuityEventPreserved: refs.semanticEventRef !== undefined,
      laneEntryEnvelopeObserved: refs.laneEntryId !== undefined,
      productionPromotionBlocked: collectGate(result).productionLanePromoted === false,
      nextGate: collectGate(result).nextGate,
    },
    validation: {
      status,
      parseableObject: result !== undefined,
      laneEntryPresent: issues.includes("lane-entry-missing-or-unsafe") === false,
      sourceRefsPresent: issues.includes("refs-missing") === false,
      sandboxAutobaseObserved: issues.includes("sandbox-autobase-posture-missing-or-unsafe") === false,
      productionGatePresent: issues.includes("production-gate-missing-or-unsafe") === false,
      refsSafe: issues.includes("unsafe-ref") === false,
      noProductionOverclaim: issues.includes("production-continuity-or-authority-overclaim") === false,
      issues,
    },
    reviewStatus: status === "edge-local-layer-continuity-lane-autobase-lab-valid-evidence"
      ? "edge-local-layer-continuity-lane-autobase-lab-evidence-emitted"
      : status,
    warnings: status === "edge-local-layer-continuity-lane-autobase-lab-valid-evidence"
      ? [
          "sandboxed-autobase-continuity-lane-lab-observed",
          "implementation-wedge-observed",
          "production-promotion-still-blocked",
        ]
      : ["edge-local-layer-continuity-lane-autobase-lab-not-reviewable"],
    rejections: status === "edge-local-layer-continuity-lane-autobase-lab-valid-evidence" ? [] : issues,
  };
}

function validateLabResult(result: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["lab-result-not-object"];
  if (!result) return ["lab-result-not-object"];
  const refs = collectRefs(result);
  if (result.artifactKind !== EXPECTED_KIND) issues.push("artifact-kind-mismatch");
  if (result.schemaVersion !== EXPECTED_SCHEMA) issues.push("schema-mismatch");
  if (result.labStatus !== "continuity_lane_entry_materialized_in_sandboxed_autobase") issues.push("lab-status-mismatch");
  if (!validLaneEntry(result)) issues.push("lane-entry-missing-or-unsafe");
  if (!refs.laneEntryId || !refs.semanticEventRef || refs.sourceRefs.length === 0) issues.push("refs-missing");
  if ([
    refs.laneEntryId,
    refs.laneEntryHash,
    refs.semanticPayloadHash,
    refs.semanticEventRef,
    refs.nextGate,
    ...refs.sourceRefs,
    ...refs.writerRefs,
    ...refs.headRefs,
    ...refs.linearizedEntryRefs,
  ].filter(Boolean).some((ref) => unsafeRef(ref as string))) {
    issues.push("unsafe-ref");
  }
  if (!validLaneEntryPosture(collectLaneEntryPosture(result))) issues.push("lane-entry-posture-missing-or-unsafe");
  if (!validLabPosture(collectLabPosture(result))) issues.push("sandbox-autobase-posture-missing-or-unsafe");
  if (!validGate(collectGate(result))) issues.push("production-gate-missing-or-unsafe");
  const nonClaims = isRecord(result.nonClaims) ? result.nonClaims : {};
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.canonicalHistoryClaimed === true ||
    collectLaneEntryPosture(result).productionLaneEntry === true ||
    collectLaneEntryPosture(result).productionLocalLayerState === true ||
    collectLabPosture(result).productionLanePromoted === true ||
    collectGate(result).productionLanePromoted === true ||
    collectGate(result).edgeStateMigrationAllowed === true
  ) {
    issues.push("production-continuity-or-authority-overclaim");
  }
  return [...new Set(issues)];
}

function statusFor(result: JsonRecord | undefined, issues: string[]) {
  if (!result) return "edge-local-layer-continuity-lane-autobase-lab-malformed-evidence";
  if (
    issues.includes("unsafe-ref") ||
    issues.includes("lane-entry-missing-or-unsafe") ||
    issues.includes("lane-entry-posture-missing-or-unsafe") ||
    issues.includes("sandbox-autobase-posture-missing-or-unsafe") ||
    issues.includes("production-gate-missing-or-unsafe") ||
    issues.includes("production-continuity-or-authority-overclaim")
  ) {
    return "edge-local-layer-continuity-lane-autobase-lab-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-continuity-lane-autobase-lab-incomplete-evidence";
  return "edge-local-layer-continuity-lane-autobase-lab-valid-evidence";
}

function validLaneEntry(result: JsonRecord | undefined) {
  const entry = isRecord(result?.laneEntry) ? result.laneEntry : {};
  return entry.artifactKind === EXPECTED_LANE_ENTRY_KIND &&
    entry.schemaVersion === EXPECTED_LANE_ENTRY_SCHEMA &&
    stringValue(entry.entryId) !== undefined &&
    stringValue(entry.entryHash)?.startsWith("sha256:") === true &&
    entry.semanticEventKind === "mesh_ecology_local_layer_continuity_event" &&
    stringValue(entry.semanticEventRef) !== undefined &&
    stringValue(entry.semanticPayloadHash)?.startsWith("sha256:") === true &&
    stringArray(entry.sourceRefs).length > 0;
}

function collectRefs(result: JsonRecord | undefined) {
  const entry = isRecord(result?.laneEntry) ? result.laneEntry : {};
  const gate = isRecord(result?.productionGateDecision) ? result.productionGateDecision : {};
  return {
    laneEntryId: stringValue(entry.entryId),
    laneEntryHash: stringValue(entry.entryHash),
    semanticEventRef: stringValue(entry.semanticEventRef),
    semanticPayloadHash: stringValue(entry.semanticPayloadHash),
    sourceRefs: stringArray(entry.sourceRefs),
    writerRefs: stringArray(result?.writerRefs),
    headRefs: stringArray(result?.headRefs),
    linearizedEntryRefs: stringArray(result?.linearizedEntryRefs),
    nextGate: stringValue(gate.nextGate),
  };
}

function collectLaneEntryPosture(result: JsonRecord | undefined) {
  const entry = isRecord(result?.laneEntry) ? result.laneEntry : {};
  const posture = isRecord(entry.entryPosture) ? entry.entryPosture : {};
  return {
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
    wallClockDefinesIdentity: posture.wallClockDefinesIdentity === true,
  };
}

function collectLabPosture(result: JsonRecord | undefined) {
  const posture = isRecord(result?.labPosture) ? result.labPosture : {};
  return {
    sandboxedAutobaseLab: posture.sandboxedAutobaseLab === true,
    autobaseBackendOpened: posture.autobaseBackendOpened === true,
    writesAutobase: posture.writesAutobase === true,
    derivedViewMaterialized: posture.derivedViewMaterialized === true,
    implementationWedge: posture.implementationWedge === true,
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

function collectGate(result: JsonRecord | undefined) {
  const gate = isRecord(result?.productionGateDecision) ? result.productionGateDecision : {};
  return {
    gateState: stringValue(gate.gateState),
    decision: stringValue(gate.decision),
    productionIsExpectedFutureWork: gate.productionIsExpectedFutureWork === true,
    productionLanePromoted: gate.productionLanePromoted === true,
    edgeStateMigrationAllowed: gate.edgeStateMigrationAllowed === true,
    nextGate: stringValue(gate.nextGate),
    requiredBeforeNextGate: stringArray(gate.requiredBeforeNextGate),
  };
}

function validLaneEntryPosture(posture: ReturnType<typeof collectLaneEntryPosture>) {
  return posture.labStorageEnvelope === true &&
    posture.semanticContinuityUnit === false &&
    posture.preservesSemanticContinuityEvent === true &&
    posture.productionLaneEntry === false &&
    posture.productionLocalLayerState === false &&
    posture.durableLocalLayerContinuity === false &&
    posture.edgeStateMigration === false &&
    posture.appendSuccessIsAcceptance === false &&
    posture.linearizationIsTruth === false &&
    posture.replicaVisibilityIsContinuity === false &&
    posture.wallClockDefinesIdentity === false;
}

function validLabPosture(posture: ReturnType<typeof collectLabPosture>) {
  return posture.sandboxedAutobaseLab === true &&
    posture.autobaseBackendOpened === true &&
    posture.writesAutobase === true &&
    posture.derivedViewMaterialized === true &&
    posture.implementationWedge === true &&
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

function validGate(gate: ReturnType<typeof collectGate>) {
  return gate.gateState === EXPECTED_GATE_STATE &&
    gate.decision === "continue_lab_backed_wedge_only" &&
    gate.productionIsExpectedFutureWork === true &&
    gate.productionLanePromoted === false &&
    gate.edgeStateMigrationAllowed === false &&
    gate.nextGate === EXPECTED_NEXT_GATE &&
    gate.requiredBeforeNextGate.includes("writer_admission_v0") &&
    gate.requiredBeforeNextGate.includes("operator_recorded_promotion_decision");
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
