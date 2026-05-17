import { createHash } from "node:crypto";

export const CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_SCHEMA =
  "causal-substrate/edge-repo-work-packet-projection-log-apply-result-evidence/v1" as const;

export const CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-repo-work-packet-projection-log-apply-result-evidence" as const;

export type EdgeRepoWorkPacketProjectionLogApplyResultEvidenceStatus =
  | "edge-repo-work-packet-projection-log-apply-result-evidence-emitted"
  | "edge-repo-work-packet-projection-log-apply-result-valid-evidence"
  | "edge-repo-work-packet-projection-log-apply-result-incomplete-evidence"
  | "edge-repo-work-packet-projection-log-apply-result-malformed-evidence"
  | "edge-repo-work-packet-projection-log-apply-result-guardrail-blocked";

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "edge_repo_work_packet_projection_log_apply_result";
const EXPECTED_SCHEMA = "edge_repo_work_packet_projection_log_apply_result.v0";
const EXPECTED_CANDIDATE_KIND = "edge_repo_work_packet_projection_log_candidate";
const EXPECTED_APPEND_KIND = "edge_repo_work_packet_projection_log_lab_append_record";
const ACCEPTED_LAB = "accepted_lab";

export interface BuildEdgeRepoWorkPacketProjectionLogApplyResultEvidenceInput {
  applyResult: unknown;
  emittedAt: string;
  artifactId?: string;
}

export function buildEdgeRepoWorkPacketProjectionLogApplyResultEvidenceArtifact(
  input: BuildEdgeRepoWorkPacketProjectionLogApplyResultEvidenceInput,
) {
  const applyResult = isRecord(input.applyResult) ? input.applyResult : undefined;
  const issues = validateApplyResult(applyResult, input.applyResult);
  const status = determineStatus(applyResult, issues);
  const refs = collectRefs(applyResult);
  const artifactId = input.artifactId ?? `causal-edge-repo-work-packet-projection-log-apply-result-evidence:${hash(JSON.stringify({
    emittedAt: input.emittedAt,
    applyResultId: refs.applyResultId,
    candidateId: refs.candidateRef.id,
    appendId: refs.appendRef.id,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(applyResult?.artifactKind === EXPECTED_ARTIFACT_KIND ? { sourceArtifactKind: EXPECTED_ARTIFACT_KIND } : {}),
      ...(applyResult?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
    },
    refs,
    applyState: stringValue(applyResult?.applyState),
    acceptedContinuity: applyResult?.acceptedContinuity === true,
    acceptedProductionContinuity: applyResult?.acceptedProductionContinuity === true,
    checks: collectChecks(applyResult),
    boundedShape: collectBoundedShape(applyResult),
    posture: collectPosture(applyResult),
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      callsEdge: false,
      writesContinuityRecords: false,
      acceptsProductionContinuity: false,
      claimsCausalTruth: false,
      startsBackend: false,
      migratesEdgeState: false,
    },
    validation: {
      status,
      parseableObject: applyResult !== undefined,
      acceptedLabOnly: applyResult?.applyState === ACCEPTED_LAB &&
        applyResult?.acceptedContinuity === false &&
        applyResult?.acceptedProductionContinuity === false,
      checksSafe: issues.includes("apply-checks-missing-or-unsafe") === false,
      boundedShapeSafe: issues.includes("bounded-shape-missing-or-unsafe") === false,
      postureSafe: issues.includes("posture-overclaim") === false,
      refsSafe: issues.includes("unsafe-ref") === false,
      noAuthorityOrTruthClaim: issues.includes("truth-authority-readiness-or-state-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-repo-work-packet-projection-log-apply-result-valid-evidence"
      ? "edge-repo-work-packet-projection-log-apply-result-evidence-emitted"
      : status,
    warnings: status === "edge-repo-work-packet-projection-log-apply-result-valid-evidence"
      ? [
          "repo-work-packet-projection-log-apply-result-is-lab-pressure-only",
          "accepted-lab-is-not-production-continuity",
          "append-success-and-apply-success-are-not-truth-readiness-or-authority",
        ]
      : ["repo-work-packet-projection-log-apply-result-not-accepted-as-continuity"],
    rejections: status === "edge-repo-work-packet-projection-log-apply-result-valid-evidence" ? [] : issues,
  };
}

function validateApplyResult(applyResult: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["apply-result-not-object"];
  if (!applyResult) return ["apply-result-not-object"];
  const refs = collectRefs(applyResult);
  const allRefs = [
    refs.applyResultId,
    refs.candidateRef.id,
    refs.candidateRef.hash,
    refs.appendRef.id,
    refs.appendRef.hash,
  ].filter((ref): ref is string => Boolean(ref));

  if (applyResult.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (applyResult.schemaVersion !== EXPECTED_SCHEMA) issues.push("schema-mismatch");
  if (!refs.applyResultId) issues.push("apply-result-id-missing");
  if (refs.candidateRef.kind !== EXPECTED_CANDIDATE_KIND || !refs.candidateRef.id || !refs.candidateRef.hash?.startsWith("sha256:")) {
    issues.push("candidate-ref-missing-or-unsafe");
  }
  if (refs.appendRef.kind !== EXPECTED_APPEND_KIND || !refs.appendRef.id || !refs.appendRef.hash?.startsWith("sha256:")) {
    issues.push("append-ref-missing-or-unsafe");
  }
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-ref");
  if (applyResult.applyState !== ACCEPTED_LAB && applyResult.applyState !== "blocked" && applyResult.applyState !== "malformed") {
    issues.push("apply-state-unknown");
  }
  if (applyResult.acceptedContinuity !== false || applyResult.acceptedProductionContinuity !== false) {
    issues.push("truth-authority-readiness-or-state-claim");
  }
  if (!validChecks(collectChecks(applyResult))) issues.push("apply-checks-missing-or-unsafe");
  if (!validBoundedShape(collectBoundedShape(applyResult))) issues.push("bounded-shape-missing-or-unsafe");
  if (!validPosture(collectPosture(applyResult))) issues.push("posture-overclaim");
  if (applyResult.applyState === ACCEPTED_LAB && stringArray(applyResult.blockedReasons).length > 0) {
    issues.push("accepted-lab-with-blocked-reasons");
  }
  return [...new Set(issues)];
}

function determineStatus(
  applyResult: JsonRecord | undefined,
  issues: string[],
): EdgeRepoWorkPacketProjectionLogApplyResultEvidenceStatus {
  if (!applyResult) return "edge-repo-work-packet-projection-log-apply-result-malformed-evidence";
  if (
    issues.includes("unsafe-ref") ||
    issues.includes("apply-checks-missing-or-unsafe") ||
    issues.includes("bounded-shape-missing-or-unsafe") ||
    issues.includes("posture-overclaim") ||
    issues.includes("truth-authority-readiness-or-state-claim")
  ) {
    return "edge-repo-work-packet-projection-log-apply-result-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-repo-work-packet-projection-log-apply-result-incomplete-evidence";
  return "edge-repo-work-packet-projection-log-apply-result-valid-evidence";
}

function collectRefs(applyResult: JsonRecord | undefined) {
  const safe = applyResult ?? {};
  return {
    applyResultId: stringValue(safe.applyResultId),
    candidateRef: collectRef(isRecord(safe.candidateRef) ? safe.candidateRef : {}),
    appendRef: collectRef(isRecord(safe.appendRef) ? safe.appendRef : {}),
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

function collectChecks(applyResult: JsonRecord | undefined) {
  const checks = isRecord(applyResult?.checks) ? applyResult.checks : {};
  return {
    schemaValid: checks.schemaValid === true,
    sourceRefsPresent: checks.sourceRefsPresent === true,
    causalRefsOrDeferralValid: checks.causalRefsOrDeferralValid === true,
    storageEnvelopeOnly: checks.storageEnvelopeOnly === true,
    writerPolicyLabOnly: checks.writerPolicyLabOnly === true,
    unsafeCanonicalSeamsAbsent: checks.unsafeCanonicalSeamsAbsent === true,
    nonClaimsPreserved: checks.nonClaimsPreserved === true,
  };
}

function collectBoundedShape(applyResult: JsonRecord | undefined) {
  const shape = isRecord(applyResult?.boundedShape) ? applyResult.boundedShape : {};
  return {
    refsOnly: shape.refsOnly === true,
    candidatePayloadEmbedded: shape.candidatePayloadEmbedded === true,
    appendPayloadEmbedded: shape.appendPayloadEmbedded === true,
    arbitraryMetadataAllowed: shape.arbitraryMetadataAllowed === true,
    arbitraryNotesAllowed: shape.arbitraryNotesAllowed === true,
    maxBlockedReasons: numberValue(shape.maxBlockedReasons),
    blobPayloadsUseExternalRefs: shape.blobPayloadsUseExternalRefs === true,
  };
}

function collectPosture(applyResult: JsonRecord | undefined) {
  const posture = isRecord(applyResult?.posture) ? applyResult.posture : {};
  return {
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    applySuccessIsTruth: posture.applySuccessIsTruth === true,
    labResultIsReadiness: posture.labResultIsReadiness === true,
    productionAutobaseStarted: posture.productionAutobaseStarted === true,
    durableContinuityPromoted: posture.durableContinuityPromoted === true,
    edgeStateMigrated: posture.edgeStateMigrated === true,
  };
}

function validChecks(checks: ReturnType<typeof collectChecks>): boolean {
  return Object.values(checks).every((value) => value === true);
}

function validBoundedShape(shape: ReturnType<typeof collectBoundedShape>): boolean {
  return shape.refsOnly === true &&
    shape.candidatePayloadEmbedded === false &&
    shape.appendPayloadEmbedded === false &&
    shape.arbitraryMetadataAllowed === false &&
    shape.arbitraryNotesAllowed === false &&
    typeof shape.maxBlockedReasons === "number" &&
    shape.maxBlockedReasons > 0 &&
    shape.maxBlockedReasons <= 12 &&
    shape.blobPayloadsUseExternalRefs === true;
}

function validPosture(posture: ReturnType<typeof collectPosture>): boolean {
  return posture.appendSuccessIsAcceptance === false &&
    posture.applySuccessIsTruth === false &&
    posture.labResultIsReadiness === false &&
    posture.productionAutobaseStarted === false &&
    posture.durableContinuityPromoted === false &&
    posture.edgeStateMigrated === false;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function unsafeSeamRef(value: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|ssh|http/iu.test(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
