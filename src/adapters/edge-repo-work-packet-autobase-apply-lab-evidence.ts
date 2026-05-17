import { createHash } from "node:crypto";

export const CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_SCHEMA =
  "causal-substrate/edge-repo-work-packet-autobase-apply-lab-evidence/v1" as const;

export const CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-repo-work-packet-autobase-apply-lab-evidence" as const;

type JsonRecord = Record<string, unknown>;

const EXPECTED_KIND = "edge_sandboxed_autobase_repo_work_packet_projection_log_apply_lab_result";
const EXPECTED_SCHEMA = "edge_sandboxed_autobase_repo_work_packet_projection_log_apply_lab_result.v0";
const CHECKPOINT_STATE = "pre_production_autobase_apply_lab_passed";
const NEXT_CHECKPOINT = "production_local_layer_lane_promotion_decision";

export function buildEdgeRepoWorkPacketAutobaseApplyLabEvidenceArtifact({
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
  const id = artifactId ?? `causal-edge-repo-work-packet-autobase-apply-lab-evidence:${hash(JSON.stringify({
    emittedAt,
    labResultId: refs.labResultId,
    checkpointRef: refs.checkpointRef,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_SCHEMA_VERSION,
    artifactId: id,
    emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(result?.artifactKind === EXPECTED_KIND ? { sourceArtifactKind: EXPECTED_KIND } : {}),
      ...(result?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    labPosture: collectLabPosture(result),
    productionPromotionCheckpoint: collectCheckpoint(result),
    storageLanePosture: collectStorageLanePosture(result),
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
    },
    validation: {
      status,
      parseableObject: result !== undefined,
      sourceRefsPresent: issues.includes("refs-missing") === false,
      sandboxAutobaseObserved: issues.includes("sandbox-autobase-posture-missing-or-unsafe") === false,
      checkpointPresent: issues.includes("production-checkpoint-missing-or-unsafe") === false,
      storageLaneSafe: issues.includes("storage-lane-posture-missing-or-unsafe") === false,
      refsSafe: issues.includes("unsafe-ref") === false,
      noProductionOverclaim: issues.includes("production-continuity-or-authority-overclaim") === false,
      issues,
    },
    reviewStatus: status === "edge-repo-work-packet-autobase-apply-lab-valid-evidence"
      ? "edge-repo-work-packet-autobase-apply-lab-evidence-emitted"
      : status,
    warnings: status === "edge-repo-work-packet-autobase-apply-lab-valid-evidence"
      ? [
          "sandboxed-autobase-apply-lab-observed",
          "pre-production-checkpoint-reached",
          "production-promotion-decision-still-required",
        ]
      : ["repo-work-packet-autobase-apply-lab-not-reviewable"],
    rejections: status === "edge-repo-work-packet-autobase-apply-lab-valid-evidence" ? [] : issues,
  };
}

function validateLabResult(result: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["lab-result-not-object"];
  if (!result) return ["lab-result-not-object"];
  const refs = collectRefs(result);
  if (result.artifactKind !== EXPECTED_KIND) issues.push("artifact-kind-mismatch");
  if (result.schemaVersion !== EXPECTED_SCHEMA) issues.push("schema-mismatch");
  if (result.labStatus !== "autobase_apply_record_materialized") issues.push("lab-status-mismatch");
  if (!refs.labResultId || !refs.sourceApplyResultRef || !refs.checkpointRef) issues.push("refs-missing");
  if ([
    refs.labResultId,
    refs.sourceApplyResultRef,
    refs.sourceCandidateRef.id,
    refs.sourceCandidateRef.hash,
    refs.sourceAppendRef.id,
    refs.sourceAppendRef.hash,
    refs.checkpointRef,
    ...refs.writerRefs,
    ...refs.headRefs,
    ...refs.linearizedEntryRefs,
  ].filter(Boolean).some((ref) => unsafeRef(ref as string))) {
    issues.push("unsafe-ref");
  }
  if (!validLabPosture(collectLabPosture(result))) issues.push("sandbox-autobase-posture-missing-or-unsafe");
  if (!validCheckpoint(collectCheckpoint(result))) issues.push("production-checkpoint-missing-or-unsafe");
  if (!validStorageLanePosture(collectStorageLanePosture(result))) issues.push("storage-lane-posture-missing-or-unsafe");
  const nonClaims = isRecord(result.nonClaims) ? result.nonClaims : {};
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.canonicalHistoryClaimed === true ||
    collectLabPosture(result).productionLocalLayerState === true ||
    collectStorageLanePosture(result).productionBackendPromoted === true ||
    collectStorageLanePosture(result).storageRecordPromoted === true
  ) {
    issues.push("production-continuity-or-authority-overclaim");
  }
  return [...new Set(issues)];
}

function statusFor(result: JsonRecord | undefined, issues: string[]) {
  if (!result) return "edge-repo-work-packet-autobase-apply-lab-malformed-evidence";
  if (
    issues.includes("unsafe-ref") ||
    issues.includes("sandbox-autobase-posture-missing-or-unsafe") ||
    issues.includes("production-checkpoint-missing-or-unsafe") ||
    issues.includes("storage-lane-posture-missing-or-unsafe") ||
    issues.includes("production-continuity-or-authority-overclaim")
  ) {
    return "edge-repo-work-packet-autobase-apply-lab-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-repo-work-packet-autobase-apply-lab-incomplete-evidence";
  return "edge-repo-work-packet-autobase-apply-lab-valid-evidence";
}

function collectRefs(result: JsonRecord | undefined) {
  return {
    labResultId: stringValue(result?.artifactKind) && stringValue(result?.schemaVersion)
      ? `edge-autobase-apply-lab:${hash(JSON.stringify({
          sourceApplyResultRef: result?.sourceApplyResultRef,
          checkpoint: isRecord(result?.productionPromotionCheckpoint) ? result.productionPromotionCheckpoint.checkpointRef : undefined,
        })).slice(0, 16)}`
      : undefined,
    sourceApplyResultRef: stringValue(result?.sourceApplyResultRef),
    sourceCandidateRef: collectRef(isRecord(result?.sourceCandidateRef) ? result.sourceCandidateRef : {}),
    sourceAppendRef: collectRef(isRecord(result?.sourceAppendRef) ? result.sourceAppendRef : {}),
    writerRefs: stringArray(result?.writerRefs),
    headRefs: stringArray(result?.headRefs),
    linearizedEntryRefs: stringArray(result?.linearizedEntryRefs),
    checkpointRef: stringValue(isRecord(result?.productionPromotionCheckpoint) ? result.productionPromotionCheckpoint.checkpointRef : undefined),
  };
}

function collectRef(ref: JsonRecord) {
  return {
    kind: stringValue(ref.kind),
    schemaVersion: stringValue(ref.schemaVersion),
    id: stringValue(ref.id),
    hash: stringValue(ref.hash),
  };
}

function collectLabPosture(result: JsonRecord | undefined) {
  const posture = isRecord(result?.labPosture) ? result.labPosture : {};
  return {
    sandboxedAutobaseLab: posture.sandboxedAutobaseLab === true,
    autobaseBackend: posture.autobaseBackend === true,
    writesAutobase: posture.writesAutobase === true,
    derivedViewMaterialized: posture.derivedViewMaterialized === true,
    productionCheckpointReached: posture.productionCheckpointReached === true,
    productionLocalLayerState: posture.productionLocalLayerState === true,
    writesDurableLocalLayerState: posture.writesDurableLocalLayerState === true,
    localStoreRootIsIntegrationSeam: posture.localStoreRootIsIntegrationSeam === true,
    httpSeam: posture.httpSeam === true,
    sshSeam: posture.sshSeam === true,
    wallClockDefinesCausalOrder: posture.wallClockDefinesCausalOrder === true,
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    applySuccessIsTruth: posture.applySuccessIsTruth === true,
    labResultIsReadiness: posture.labResultIsReadiness === true,
  };
}

function collectCheckpoint(result: JsonRecord | undefined) {
  const checkpoint = isRecord(result?.productionPromotionCheckpoint) ? result.productionPromotionCheckpoint : {};
  return {
    checkpointRef: stringValue(checkpoint.checkpointRef),
    checkpointState: stringValue(checkpoint.checkpointState),
    nextCheckpoint: stringValue(checkpoint.nextCheckpoint),
    productionIsExpectedFutureWork: checkpoint.productionIsExpectedFutureWork === true,
    promotionDecisionStillRequired: checkpoint.promotionDecisionStillRequired === true,
    requiredBeforePromotion: stringArray(checkpoint.requiredBeforePromotion),
  };
}

function collectStorageLanePosture(result: JsonRecord | undefined) {
  const posture = isRecord(result?.storageLanePosture) ? result.storageLanePosture : {};
  return {
    intendedStorageLane: stringValue(posture.intendedStorageLane),
    inputSemanticUnit: stringValue(posture.inputSemanticUnit),
    productionBackendPromoted: posture.productionBackendPromoted === true,
    productionPromotionCheckpointReached: posture.productionPromotionCheckpointReached === true,
    storageRecordPromoted: posture.storageRecordPromoted === true,
    edgeStateMigration: posture.edgeStateMigration === true,
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    linearizationIsTruth: posture.linearizationIsTruth === true,
    replicaVisibilityIsContinuity: posture.replicaVisibilityIsContinuity === true,
    wallClockDefinesCausalOrder: posture.wallClockDefinesCausalOrder === true,
  };
}

function validLabPosture(posture: ReturnType<typeof collectLabPosture>) {
  return posture.sandboxedAutobaseLab === true &&
    posture.autobaseBackend === true &&
    posture.writesAutobase === true &&
    posture.derivedViewMaterialized === true &&
    posture.productionCheckpointReached === true &&
    posture.productionLocalLayerState === false &&
    posture.writesDurableLocalLayerState === false &&
    posture.localStoreRootIsIntegrationSeam === false &&
    posture.httpSeam === false &&
    posture.sshSeam === false &&
    posture.wallClockDefinesCausalOrder === false &&
    posture.appendSuccessIsAcceptance === false &&
    posture.applySuccessIsTruth === false &&
    posture.labResultIsReadiness === false;
}

function validCheckpoint(checkpoint: ReturnType<typeof collectCheckpoint>) {
  return checkpoint.checkpointRef?.startsWith("edge-local-layer-production-checkpoint:") === true &&
    checkpoint.checkpointState === CHECKPOINT_STATE &&
    checkpoint.nextCheckpoint === NEXT_CHECKPOINT &&
    checkpoint.productionIsExpectedFutureWork === true &&
    checkpoint.promotionDecisionStillRequired === true &&
    checkpoint.requiredBeforePromotion.includes("explicit_writer_admission_policy") &&
    checkpoint.requiredBeforePromotion.includes("operator_recorded_promotion_decision");
}

function validStorageLanePosture(posture: ReturnType<typeof collectStorageLanePosture>) {
  return posture.intendedStorageLane === "bounded_autobase_equivalent_linearization" &&
    posture.inputSemanticUnit === "mesh_ecology_local_layer_continuity_event" &&
    posture.productionBackendPromoted === false &&
    posture.productionPromotionCheckpointReached === true &&
    posture.storageRecordPromoted === false &&
    posture.edgeStateMigration === false &&
    posture.appendSuccessIsAcceptance === false &&
    posture.linearizationIsTruth === false &&
    posture.replicaVisibilityIsContinuity === false &&
    posture.wallClockDefinesCausalOrder === false;
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
