import { createHash } from "node:crypto";

export const CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_SCHEMA =
  "causal-substrate/edge-repo-work-packet-projection-log-candidate-evidence/v1" as const;

export const CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-repo-work-packet-projection-log-candidate-evidence" as const;

export type EdgeRepoWorkPacketProjectionLogCandidateEvidenceStatus =
  | "edge-repo-work-packet-projection-log-candidate-evidence-emitted"
  | "edge-repo-work-packet-projection-log-candidate-valid-evidence"
  | "edge-repo-work-packet-projection-log-candidate-incomplete-evidence"
  | "edge-repo-work-packet-projection-log-candidate-malformed-evidence"
  | "edge-repo-work-packet-projection-log-candidate-guardrail-blocked";

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "edge_repo_work_packet_projection_log_candidate";
const EXPECTED_SCHEMA = "edge_repo_work_packet_projection_log_candidate.v0";

export interface BuildEdgeRepoWorkPacketProjectionLogCandidateEvidenceInput {
  candidate: unknown;
  emittedAt: string;
  artifactId?: string;
}

export function buildEdgeRepoWorkPacketProjectionLogCandidateEvidenceArtifact(
  input: BuildEdgeRepoWorkPacketProjectionLogCandidateEvidenceInput,
) {
  const candidate = isRecord(input.candidate) ? input.candidate : undefined;
  const issues = validateCandidate(candidate, input.candidate);
  const status = determineStatus(candidate, issues);
  const refs = collectRefs(candidate);
  const artifactId = input.artifactId ?? `causal-edge-repo-work-packet-projection-log-candidate-evidence:${hash(JSON.stringify({
    emittedAt: input.emittedAt,
    candidateId: refs.candidateId,
    continuityEventId: refs.continuityEventId,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(candidate?.artifactKind === EXPECTED_ARTIFACT_KIND ? { sourceArtifactKind: EXPECTED_ARTIFACT_KIND } : {}),
      ...(candidate?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    storageEnvelope: collectStorageEnvelope(candidate),
    writerAdmission: collectWriterAdmission(candidate),
    acceptanceRule: collectAcceptanceRule(candidate),
    storageLanePosture: collectStorageLanePosture(candidate),
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      callsEdge: false,
      writesContinuityRecords: false,
      acceptsContinuity: false,
      claimsCausalTruth: false,
      startsBackend: false,
      migratesEdgeState: false,
    },
    validation: {
      status,
      parseableObject: candidate !== undefined,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      storageEnvelopeSafe: issues.includes("storage-envelope-overclaim") === false,
      writerAdmissionSafe: issues.includes("writer-admission-missing-or-unsafe") === false,
      acceptanceRuleSafe: issues.includes("acceptance-rule-missing-or-unsafe") === false,
      storageLanePostureSafe: issues.includes("storage-lane-posture-missing-or-unsafe") === false,
      boundarySafe: issues.includes("boundary-overclaim") === false,
      noAuthorityOrTruthClaim: issues.includes("truth-authority-or-state-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-repo-work-packet-projection-log-candidate-valid-evidence"
      ? "edge-repo-work-packet-projection-log-candidate-evidence-emitted"
      : status,
    warnings: status === "edge-repo-work-packet-projection-log-candidate-valid-evidence"
      ? [
          "repo-work-packet-projection-log-candidate-preserved-as-decision-pressure",
          "storage-envelope-is-not-semantic-continuity",
          "append-success-storage-visibility-and-review-visibility-are-not-acceptance",
        ]
      : ["repo-work-packet-projection-log-candidate-not-accepted-as-continuity"],
    rejections: status === "edge-repo-work-packet-projection-log-candidate-valid-evidence" ? [] : issues,
  };
}

function validateCandidate(candidate: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["candidate-not-object"];
  if (!candidate) return ["candidate-not-object"];
  const refs = collectRefs(candidate);
  const allRefs = [
    refs.candidateId,
    refs.workPacketRef,
    refs.continuityEventId,
    refs.projectionLaneRef,
    refs.observerRef,
    ...refs.sourceRefs,
    ...stringArray(isRecord(candidate.writerAdmission) ? candidate.writerAdmission.admittedWriterRefs : []),
    ...stringArray(isRecord(candidate.writerAdmission) ? candidate.writerAdmission.candidateWriterRefs : []),
  ].filter((ref): ref is string => Boolean(ref));

  if (candidate.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (candidate.schemaVersion !== EXPECTED_SCHEMA) issues.push("schema-mismatch");
  if (!refs.candidateId) issues.push("candidate-id-missing");
  if (!refs.workPacketRef) issues.push("work-packet-ref-missing");
  if (!refs.continuityEventId) issues.push("continuity-event-ref-missing");
  if (candidate.continuityEventRole !== "edge_repo_work_packet_scaffold") issues.push("continuity-event-role-mismatch");
  if (candidate.continuityEventCategory !== "repo_work_packet") issues.push("continuity-event-category-mismatch");
  if (refs.sourceRefs.length === 0) issues.push("source-refs-missing");
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");
  if (!validStorageEnvelope(isRecord(candidate.storageEnvelope) ? candidate.storageEnvelope : {})) {
    issues.push("storage-envelope-overclaim");
  }
  if (!validWriterAdmission(isRecord(candidate.writerAdmission) ? candidate.writerAdmission : {})) {
    issues.push("writer-admission-missing-or-unsafe");
  }
  if (!validAcceptanceRule(isRecord(candidate.acceptanceRule) ? candidate.acceptanceRule : {})) {
    issues.push("acceptance-rule-missing-or-unsafe");
  }
  if (!validStorageLanePosture(isRecord(candidate.storageLanePosture) ? candidate.storageLanePosture : {})) {
    issues.push("storage-lane-posture-missing-or-unsafe");
  }
  if (!validBoundary(isRecord(candidate.boundary) ? candidate.boundary : {})) issues.push("boundary-overclaim");
  const nonClaims = isRecord(candidate.nonClaims) ? candidate.nonClaims : {};
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.writerAuthorityGranted === true ||
    nonClaims.appendAcceptanceClaimed === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.causalTruthClaimed === true
  ) {
    issues.push("truth-authority-or-state-claim");
  }
  return [...new Set(issues)];
}

function determineStatus(
  candidate: JsonRecord | undefined,
  issues: string[],
): EdgeRepoWorkPacketProjectionLogCandidateEvidenceStatus {
  if (!candidate) return "edge-repo-work-packet-projection-log-candidate-malformed-evidence";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("storage-envelope-overclaim") ||
    issues.includes("writer-admission-missing-or-unsafe") ||
    issues.includes("acceptance-rule-missing-or-unsafe") ||
    issues.includes("storage-lane-posture-missing-or-unsafe") ||
    issues.includes("boundary-overclaim") ||
    issues.includes("truth-authority-or-state-claim")
  ) {
    return "edge-repo-work-packet-projection-log-candidate-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-repo-work-packet-projection-log-candidate-incomplete-evidence";
  return "edge-repo-work-packet-projection-log-candidate-valid-evidence";
}

function collectRefs(candidate: JsonRecord | undefined) {
  const safe = candidate ?? {};
  return {
    candidateId: stringValue(safe.candidateId),
    workPacketRef: stringValue(safe.workPacketRef),
    continuityEventId: stringValue(safe.continuityEventId),
    projectionLaneRef: stringValue(safe.projectionLaneRef),
    observerRef: stringValue(safe.observerRef),
    sourceReviewFixtureRef: stringValue(safe.sourceReviewFixtureRef),
    sourceEdgeReviewStatusRef: stringValue(safe.sourceEdgeReviewStatusRef),
    sourceCausalEvidenceRef: stringValue(safe.sourceCausalEvidenceRef),
    sourceTestbedEvidenceRef: stringValue(safe.sourceTestbedEvidenceRef),
    sourceRefs: stringArray(safe.sourceRefs),
  };
}

function collectStorageEnvelope(candidate: JsonRecord | undefined) {
  const envelope = isRecord(candidate?.storageEnvelope) ? candidate.storageEnvelope : {};
  return {
    envelopeKind: stringValue(envelope.envelopeKind),
    envelopeSchema: stringValue(envelope.envelopeSchema),
    storageEnvelopeOnly: envelope.storageEnvelopeOnly === true,
    semanticContinuityUnit: envelope.semanticContinuityUnit === true,
    preservesSemanticInput: stringValue(envelope.preservesSemanticInput),
    productionStorageRecord: envelope.productionStorageRecord === true,
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
    writerAdmissionRequiredBeforeAcceptance: writer.writerAdmissionRequiredBeforeAcceptance === true,
    operatorMediationRequired: writer.operatorMediationRequired === true,
  };
}

function collectAcceptanceRule(candidate: JsonRecord | undefined) {
  const rule = isRecord(candidate?.acceptanceRule) ? candidate.acceptanceRule : {};
  return {
    ruleKind: stringValue(rule.ruleKind),
    appendSuccessIsAcceptance: rule.appendSuccessIsAcceptance === true,
    storageVisibilityIsContinuity: rule.storageVisibilityIsContinuity === true,
    replicaVisibilityIsContinuity: rule.replicaVisibilityIsContinuity === true,
    reviewVisibilityIsReadiness: rule.reviewVisibilityIsReadiness === true,
    requiresCausalSubstrateInterpretation: rule.requiresCausalSubstrateInterpretation === true,
    requiresFailClosedTestbedPressure: rule.requiresFailClosedTestbedPressure === true,
  };
}

function collectStorageLanePosture(candidate: JsonRecord | undefined) {
  const posture = isRecord(candidate?.storageLanePosture) ? candidate.storageLanePosture : {};
  return {
    intendedStorageLane: stringValue(posture.intendedStorageLane),
    productionBackendPromoted: posture.productionBackendPromoted === true,
    productionAutobaseStarted: posture.productionAutobaseStarted === true,
    storageRecordPromoted: posture.storageRecordPromoted === true,
    edgeStateMigration: posture.edgeStateMigration === true,
    localFileStorageIsSubstrate: posture.localFileStorageIsSubstrate === true,
    localPathSeam: posture.localPathSeam === true,
    httpSeam: posture.httpSeam === true,
    sshSeam: posture.sshSeam === true,
  };
}

function validStorageEnvelope(envelope: JsonRecord): boolean {
  return envelope.envelopeKind === "edge_repo_work_packet_projection_log_entry_candidate" &&
    envelope.storageEnvelopeOnly === true &&
    envelope.semanticContinuityUnit === false &&
    envelope.preservesSemanticInput === "mesh_ecology_local_layer_continuity_event" &&
    envelope.productionStorageRecord === false;
}

function validWriterAdmission(writer: JsonRecord): boolean {
  return writer.policyKind === "operator_owned_local_layer_explicit_writer_admission" &&
    stringArray(writer.admittedWriterRefs).length > 0 &&
    writer.generalWriterAuthorityGranted === false &&
    writer.writerAdmissionRequiredBeforeAcceptance === true &&
    writer.operatorMediationRequired === true;
}

function validAcceptanceRule(rule: JsonRecord): boolean {
  return rule.appendSuccessIsAcceptance === false &&
    rule.storageVisibilityIsContinuity === false &&
    rule.replicaVisibilityIsContinuity === false &&
    rule.reviewVisibilityIsReadiness === false &&
    rule.requiresCausalSubstrateInterpretation === true &&
    rule.requiresFailClosedTestbedPressure === true;
}

function validStorageLanePosture(posture: JsonRecord): boolean {
  return posture.intendedStorageLane === "bounded_autobase_equivalent_projection_lane" &&
    posture.productionBackendPromoted === false &&
    posture.productionAutobaseStarted === false &&
    posture.storageRecordPromoted === false &&
    posture.edgeStateMigration === false &&
    posture.localFileStorageIsSubstrate === false &&
    posture.localPathSeam === false &&
    posture.httpSeam === false &&
    posture.sshSeam === false;
}

function validBoundary(boundary: JsonRecord): boolean {
  return boundary.candidateOnly === true &&
    boundary.fixtureBacked === true &&
    boundary.reviewOnly === true &&
    boundary.evidenceOnly === true &&
    boundary.writesFiles === false &&
    boundary.networkCalls === false &&
    boundary.opensCorestore === false &&
    boundary.opensAutobase === false &&
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
