import { createHash } from "node:crypto";

export const CAUSAL_EDGE_STORAGE_LANE_CANDIDATE_EVIDENCE_SCHEMA =
  "causal-substrate/edge-storage-lane-candidate-evidence/v1" as const;

export const CAUSAL_EDGE_STORAGE_LANE_CANDIDATE_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_STORAGE_LANE_CANDIDATE_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-storage-lane-candidate-evidence" as const;

export type EdgeStorageLaneCandidateEvidenceStatus =
  | "edge-storage-lane-candidate-evidence-emitted"
  | "edge-storage-lane-candidate-valid-evidence"
  | "edge-storage-lane-candidate-incomplete-evidence"
  | "edge-storage-lane-candidate-malformed-evidence"
  | "edge-storage-lane-candidate-guardrail-blocked";

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "edge_local_layer_storage_lane_candidate";
const EXPECTED_SCHEMA = "edge_local_layer_storage_lane_candidate.v0";

export interface BuildEdgeStorageLaneCandidateEvidenceInput {
  storageLaneCandidate: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

export function buildEdgeStorageLaneCandidateEvidenceArtifact(
  input: BuildEdgeStorageLaneCandidateEvidenceInput,
) {
  const candidate = isRecord(input.storageLaneCandidate) ? input.storageLaneCandidate : undefined;
  const issues = validateCandidate(candidate, input.storageLaneCandidate);
  const status = determineStatus(candidate, issues);
  const refs = collectRefs(candidate);
  const artifactId = input.artifactId ?? `causal-edge-storage-lane-candidate-evidence:${hash(JSON.stringify({
    emittedAt: input.emittedAt,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    ...(refs.candidateId ? { candidateId: refs.candidateId } : {}),
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_STORAGE_LANE_CANDIDATE_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_STORAGE_LANE_CANDIDATE_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_STORAGE_LANE_CANDIDATE_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(candidate?.artifactKind === EXPECTED_ARTIFACT_KIND ? { sourceArtifactKind: EXPECTED_ARTIFACT_KIND } : {}),
      ...(candidate?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    refs,
    storageLanePosture: collectStoragePosture(candidate),
    writerAdmission: collectWriterAdmission(candidate),
    acceptanceRule: collectAcceptanceRule(candidate),
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      callsEdge: false,
      writesContinuityRecords: false,
      acceptsCanonicalHistory: false,
      claimsCausalTruth: false,
      startsBackend: false,
      migratesEdgeState: false,
    },
    validation: {
      status,
      parseableObject: candidate !== undefined,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      writerAdmissionPresent: issues.includes("writer-admission-missing-or-unsafe") === false,
      acceptanceRulePresent: issues.includes("acceptance-rule-missing-or-unsafe") === false,
      storageLanePosturePresent: issues.includes("storage-lane-posture-missing-or-unsafe") === false,
      readerPolicyPresent: issues.includes("reader-policy-missing-or-unsafe") === false,
      boundarySafe: issues.includes("boundary-overclaim") === false,
      noAuthorityOrTruthClaim: issues.includes("truth-authority-or-state-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-storage-lane-candidate-valid-evidence"
      ? "edge-storage-lane-candidate-evidence-emitted"
      : status,
    warnings: status === "edge-storage-lane-candidate-valid-evidence"
      ? [
          "storage-lane-candidate-preserved-as-decision-pressure",
          "production-autobase-not-started",
          "append-success-replica-visibility-and-linearization-are-not-acceptance",
        ]
      : ["storage-lane-candidate-not-accepted-as-continuity"],
    rejections: status === "edge-storage-lane-candidate-valid-evidence" ? [] : issues,
  };
}

function validateCandidate(candidate: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["storage-lane-candidate-not-object"];
  if (!candidate) return ["storage-lane-candidate-not-object"];

  const refs = collectRefs(candidate);
  const storage = isRecord(candidate.storageLanePosture) ? candidate.storageLanePosture : {};
  const writer = isRecord(candidate.writerAdmission) ? candidate.writerAdmission : {};
  const acceptance = isRecord(candidate.acceptanceRule) ? candidate.acceptanceRule : {};
  const reader = isRecord(candidate.readerPolicy) ? candidate.readerPolicy : {};
  const boundary = isRecord(candidate.boundary) ? candidate.boundary : {};
  const nonClaims = isRecord(candidate.nonClaims) ? candidate.nonClaims : {};
  const allRefs = [
    refs.candidateId,
    refs.layerRef,
    refs.projectionLaneRef,
    refs.observerRef,
    ...refs.sourceProjectionEventRefs,
    ...refs.sourceEntryRefs,
    ...refs.sourceIdentityHashes,
    ...refs.sourceRefs,
    ...stringArray(writer.admittedWriterRefs),
    ...stringArray(writer.candidateWriterRefs),
    ...stringArray(writer.rejectedWriterRefs),
  ].filter((ref): ref is string => Boolean(ref));

  if (candidate.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (candidate.schemaVersion !== EXPECTED_SCHEMA) issues.push("schema-mismatch");
  if (!stringValue(candidate.candidateId)) issues.push("candidate-id-missing");
  if (!stringValue(candidate.layerRef)) issues.push("layer-ref-missing");
  if (!stringValue(candidate.projectionLaneRef)) issues.push("projection-lane-ref-missing");
  if (!stringValue(candidate.observerRef)) issues.push("observer-ref-missing");
  if (refs.sourceProjectionEventRefs.length === 0 || refs.sourceEntryRefs.length === 0 || refs.sourceRefs.length === 0) {
    issues.push("source-refs-missing");
  }
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");
  if (!validWriterAdmission(writer)) issues.push("writer-admission-missing-or-unsafe");
  if (!validAcceptanceRule(acceptance)) issues.push("acceptance-rule-missing-or-unsafe");
  if (!validStoragePosture(storage)) issues.push("storage-lane-posture-missing-or-unsafe");
  if (!validReaderPolicy(reader)) issues.push("reader-policy-missing-or-unsafe");
  if (!validBoundary(boundary)) issues.push("boundary-overclaim");
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.writerAuthorityGranted === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.canonicalHistoryClaimed === true ||
    nonClaims.runtimeAuthorityClaimed === true
  ) {
    issues.push("truth-authority-or-state-claim");
  }
  return [...new Set(issues)];
}

function determineStatus(
  candidate: JsonRecord | undefined,
  issues: string[],
): EdgeStorageLaneCandidateEvidenceStatus {
  if (!candidate) return "edge-storage-lane-candidate-malformed-evidence";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("writer-admission-missing-or-unsafe") ||
    issues.includes("acceptance-rule-missing-or-unsafe") ||
    issues.includes("storage-lane-posture-missing-or-unsafe") ||
    issues.includes("reader-policy-missing-or-unsafe") ||
    issues.includes("boundary-overclaim") ||
    issues.includes("truth-authority-or-state-claim")
  ) {
    return "edge-storage-lane-candidate-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-storage-lane-candidate-incomplete-evidence";
  return "edge-storage-lane-candidate-valid-evidence";
}

function collectRefs(candidate: JsonRecord | undefined) {
  const safe = candidate ?? {};
  return {
    candidateId: stringValue(safe.candidateId),
    layerRef: stringValue(safe.layerRef),
    projectionLaneRef: stringValue(safe.projectionLaneRef),
    observerRef: stringValue(safe.observerRef),
    sourceProjectionEventRefs: stringArray(safe.sourceProjectionEventRefs),
    sourceEntryRefs: stringArray(safe.sourceEntryRefs),
    sourceIdentityHashes: stringArray(safe.sourceIdentityHashes),
    sourceRefs: stringArray(safe.sourceRefs),
  };
}

function collectWriterAdmission(candidate: JsonRecord | undefined) {
  const writer = isRecord(candidate?.writerAdmission) ? candidate.writerAdmission : {};
  return {
    policyKind: stringValue(writer.policyKind),
    admittedWriterRefs: stringArray(writer.admittedWriterRefs),
    candidateWriterRefs: stringArray(writer.candidateWriterRefs),
    rejectedWriterRefs: stringArray(writer.rejectedWriterRefs),
    generalWriterAuthorityGranted: writer.generalWriterAuthorityGranted === true,
    nonWriterOptimisticAppendAllowed: writer.nonWriterOptimisticAppendAllowed === true,
    optimisticAppendRequiresAcceptanceGate: writer.optimisticAppendRequiresAcceptanceGate === true,
    writerAdmissionRequiredBeforeAcceptance: writer.writerAdmissionRequiredBeforeAcceptance === true,
    operatorMediationRequired: writer.operatorMediationRequired === true,
  };
}

function collectAcceptanceRule(candidate: JsonRecord | undefined) {
  const rule = isRecord(candidate?.acceptanceRule) ? candidate.acceptanceRule : {};
  return {
    ruleKind: stringValue(rule.ruleKind),
    appendSuccessIsAcceptance: rule.appendSuccessIsAcceptance === true,
    replicaVisibilityIsContinuity: rule.replicaVisibilityIsContinuity === true,
    linearizationIsTruth: rule.linearizationIsTruth === true,
    requiresWriterAdmission: rule.requiresWriterAdmission === true,
    requiresCausalSubstrateInterpretation: rule.requiresCausalSubstrateInterpretation === true,
    requiresFailClosedTestbedPressure: rule.requiresFailClosedTestbedPressure === true,
  };
}

function collectStoragePosture(candidate: JsonRecord | undefined) {
  const posture = isRecord(candidate?.storageLanePosture) ? candidate.storageLanePosture : {};
  return {
    intendedStorageLane: stringValue(posture.intendedStorageLane),
    storageDirection: stringValue(posture.storageDirection),
    promotedSemanticUnit: stringValue(posture.promotedSemanticUnit),
    storageEnvelopeKind: stringValue(posture.storageEnvelopeKind),
    storageEnvelopeSchema: stringValue(posture.storageEnvelopeSchema),
    productionBackendPromoted: posture.productionBackendPromoted === true,
    productionAutobaseStarted: posture.productionAutobaseStarted === true,
    storageRecordPromoted: posture.storageRecordPromoted === true,
    edgeStateMigration: posture.edgeStateMigration === true,
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    linearizationIsTruth: posture.linearizationIsTruth === true,
    replicaVisibilityIsContinuity: posture.replicaVisibilityIsContinuity === true,
    wallClockDefinesCausalOrder: posture.wallClockDefinesCausalOrder === true,
  };
}

function validWriterAdmission(writer: JsonRecord): boolean {
  return writer.policyKind === "operator_owned_local_layer_explicit_writer_admission" &&
    stringArray(writer.admittedWriterRefs).length > 0 &&
    writer.generalWriterAuthorityGranted === false &&
    writer.nonWriterOptimisticAppendAllowed === true &&
    writer.optimisticAppendRequiresAcceptanceGate === true &&
    writer.writerAdmissionRequiredBeforeAcceptance === true &&
    writer.operatorMediationRequired === true;
}

function validAcceptanceRule(rule: JsonRecord): boolean {
  return rule.ruleKind === "apply_validation_accepts_projection_lane_entry" &&
    rule.appendSuccessIsAcceptance === false &&
    rule.replicaVisibilityIsContinuity === false &&
    rule.linearizationIsTruth === false &&
    rule.requiresValidSchema === true &&
    rule.requiresPromotedProjectionEvent === true &&
    rule.requiresSourceRefs === true &&
    rule.requiresIdentityHash === true &&
    rule.requiresCausalRefsOrDeferral === true &&
    rule.requiresWriterAdmission === true &&
    rule.requiresReaderPolicy === true &&
    rule.requiresCausalSubstrateInterpretation === true &&
    rule.requiresFailClosedTestbedPressure === true;
}

function validStoragePosture(posture: JsonRecord): boolean {
  return posture.intendedStorageLane === "bounded_autobase_equivalent_projection_lane" &&
    posture.storageDirection === "bounded_autobase_equivalent_linearization" &&
    posture.promotedSemanticUnit === "mesh_ecology_local_layer_projection_event" &&
    posture.storageEnvelopeKind === "edge_local_layer_projection_lane_entry" &&
    posture.storageEnvelopeSchema === "edge_local_layer_projection_lane_entry.v0" &&
    posture.productionBackendPromoted === false &&
    posture.productionAutobaseStarted === false &&
    posture.storageRecordPromoted === false &&
    posture.edgeStateMigration === false &&
    posture.appendSuccessIsAcceptance === false &&
    posture.linearizationIsTruth === false &&
    posture.replicaVisibilityIsContinuity === false &&
    posture.wallClockDefinesCausalOrder === false &&
    posture.localPathSeam === false &&
    posture.httpSeam === false &&
    posture.sshSeam === false;
}

function validReaderPolicy(reader: JsonRecord): boolean {
  return reader.readerKind === "operator_owned_local_layer_readers_by_explicit_refs" &&
    reader.explicitKeyOrProofRequired === true &&
    reader.publicRead === false &&
    reader.localPathReadSeam === false &&
    reader.httpReadSeam === false &&
    reader.sshReadSeam === false;
}

function validBoundary(boundary: JsonRecord): boolean {
  return boundary.candidateOnly === true &&
    boundary.opensAutobase === false &&
    boundary.opensCorestore === false &&
    boundary.writesAutobase === false &&
    boundary.writesContinuityRecords === false &&
    boundary.migratesEdgeState === false &&
    boundary.startsBackend === false &&
    boundary.productionLocalLayerState === false;
}

function unsafeSeamRef(ref: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|ssh|http/iu.test(ref);
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

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
