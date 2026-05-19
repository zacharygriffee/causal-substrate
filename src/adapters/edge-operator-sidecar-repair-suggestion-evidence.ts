import { createHash } from "node:crypto";

export const CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA =
  "causal-substrate/edge-operator-sidecar-repair-suggestion-evidence/v1" as const;

export const CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-operator-sidecar-repair-suggestion-evidence" as const;

type SidecarSuggestionStatus =
  | "edge-operator-sidecar-repair-suggestion-evidence-emitted"
  | "edge-operator-sidecar-repair-suggestion-complete"
  | "edge-operator-sidecar-repair-suggestion-incomplete"
  | "edge-operator-sidecar-repair-suggestion-malformed"
  | "edge-operator-sidecar-repair-suggestion-guardrail-blocked";

type JsonRecord = Record<string, unknown>;

export interface EdgeOperatorSidecarRepairSuggestionEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo?: string;
    sourcePath?: string;
  };
  sourceSuggestionRef: string | null;
  sourceFailureRef: string | null;
  sourceWorkPacketRef: string | null;
  sourceOperatorDecisionRef: string | null;
  sourceAgentRunRef: string | null;
  failureKind: string | null;
  sameScope: boolean;
  scopeChanged: boolean;
  requiresOperatorApproval: boolean;
  targetRefs: string[];
  proposedRepairRefs: string[];
  preservedEvidenceRefs: string[];
  boundary: {
    reviewOnly: true;
    evidenceOnly: true;
    callsEdge: false;
    executesWork: false;
    writesContinuityRecords: false;
    acceptsContinuity: false;
    grantsAuthority: false;
    grantsApproval: false;
    claimsCausalTruth: false;
    claimsReadiness: false;
    startsBackend: false;
  };
  validation: {
    status: SidecarSuggestionStatus;
    parseableObject: boolean;
    requiredRefsPresent: boolean;
    repairRefsPresent: boolean;
    preservedFailureEvidencePresent: boolean;
    unsafeSeamRefsBlocked: boolean;
    unsafeClaimsBlocked: boolean;
    issues: string[];
  };
  reviewStatus: SidecarSuggestionStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeOperatorSidecarRepairSuggestionEvidenceArtifact({
  suggestion,
  emittedAt,
  artifactId,
  sourceRepo,
  sourcePath,
}: {
  suggestion: unknown;
  emittedAt: string;
  artifactId?: string;
  sourceRepo?: string;
  sourcePath?: string;
}): EdgeOperatorSidecarRepairSuggestionEvidenceArtifact {
  const candidate = isRecord(suggestion) ? suggestion : undefined;
  const refs = collectRefs(candidate);
  const issues = validateSuggestion(candidate, suggestion, refs);
  const status = determineStatus(candidate, issues);
  const effectiveArtifactId = artifactId ?? createArtifactId({
    emittedAt,
    suggestionRef: stringValue(candidate?.suggestionRef),
    sourceFailureRef: stringValue(candidate?.sourceFailureRef),
    ...(sourcePath ? { sourcePath } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA_VERSION,
    artifactId: effectiveArtifactId,
    emittedAt,
    source: {
      ...(sourceRepo ? { sourceRepo } : {}),
      ...(sourcePath ? { sourcePath } : {}),
    },
    sourceSuggestionRef: stringValue(candidate?.suggestionRef),
    sourceFailureRef: stringValue(candidate?.sourceFailureRef),
    sourceWorkPacketRef: stringValue(candidate?.sourceWorkPacketRef),
    sourceOperatorDecisionRef: stringValue(candidate?.operatorDecisionRef),
    sourceAgentRunRef: stringValue(candidate?.agentRunRef),
    failureKind: stringValue(candidate?.failureKind),
    sameScope: candidate?.sameScope === true,
    scopeChanged: candidate?.scopeChanged === true,
    requiresOperatorApproval: candidate?.requiresOperatorApproval === true,
    targetRefs: refs.targetRefs,
    proposedRepairRefs: refs.proposedRepairRefs,
    preservedEvidenceRefs: refs.preservedEvidenceRefs,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: candidate !== undefined,
      requiredRefsPresent: requiredRefsPresent(candidate),
      repairRefsPresent: refs.proposedRepairRefs.length > 0,
      preservedFailureEvidencePresent: stringValue(candidate?.sourceFailureRef) !== null &&
        refs.preservedEvidenceRefs.includes(stringValue(candidate?.sourceFailureRef) ?? ""),
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("approval-execution-authority-truth-or-continuity-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-operator-sidecar-repair-suggestion-complete"
      ? "edge-operator-sidecar-repair-suggestion-evidence-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: status === "edge-operator-sidecar-repair-suggestion-complete" ? [] : issues,
  };
}

export function assertEdgeOperatorSidecarRepairSuggestionEvidenceArtifact(
  value: unknown,
): asserts value is EdgeOperatorSidecarRepairSuggestionEvidenceArtifact {
  const candidate = assertObject(value, "edge operator sidecar repair suggestion evidence");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_EDGE_OPERATOR_SIDECAR_REPAIR_SUGGESTION_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.executesWork, false, "boundary.executesWork");
  assertEqual(boundary.acceptsContinuity, false, "boundary.acceptsContinuity");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
}

function collectRefs(candidate: JsonRecord | undefined): {
  targetRefs: string[];
  proposedRepairRefs: string[];
  preservedEvidenceRefs: string[];
  allRefs: string[];
} {
  const targetRefs = stringArray(candidate?.targetRefs);
  const proposedRepairRefs = stringArray(candidate?.proposedRepairRefs);
  const preservedEvidenceRefs = stringArray(candidate?.preservedEvidenceRefs);
  const allRefs = [
    stringValue(candidate?.suggestionRef),
    stringValue(candidate?.sourceFailureRef),
    stringValue(candidate?.sourceWorkPacketRef),
    stringValue(candidate?.operatorDecisionRef),
    stringValue(candidate?.agentRunRef),
    ...targetRefs,
    ...proposedRepairRefs,
    ...preservedEvidenceRefs,
  ].filter((entry): entry is string => entry !== null);

  return { targetRefs, proposedRepairRefs, preservedEvidenceRefs, allRefs };
}

function validateSuggestion(
  candidate: JsonRecord | undefined,
  original: unknown,
  refs: { proposedRepairRefs: string[]; preservedEvidenceRefs: string[]; allRefs: string[] },
): string[] {
  if (!isRecord(original) || !candidate) return ["suggestion-not-object"];
  const issues: string[] = [];
  const nonClaims = isRecord(candidate.nonClaims) ? candidate.nonClaims : {};

  if (candidate.artifactKind !== "edge_operator_sidecar_repair_suggestion") issues.push("artifact-kind-mismatch");
  if (candidate.schemaVersion !== "edge_operator_sidecar_repair_suggestion.v0") issues.push("schema-version-mismatch");
  if (candidate.reviewOnly !== true) issues.push("review-only-posture-missing");
  if (stringValue(candidate.suggestionRef) === null) issues.push("suggestion-ref-missing");
  if (stringValue(candidate.sourceFailureRef) === null) issues.push("source-failure-ref-missing");
  if (stringValue(candidate.sourceWorkPacketRef) === null) issues.push("source-work-packet-ref-missing");
  if (stringValue(candidate.operatorDecisionRef) === null) issues.push("operator-decision-ref-missing");
  if (stringValue(candidate.failureKind) === null) issues.push("failure-kind-missing");
  if (!isRecord(candidate.diagnosis)) issues.push("diagnosis-missing");
  if (refs.proposedRepairRefs.length === 0) issues.push("proposed-repair-refs-missing");
  if (refs.preservedEvidenceRefs.length === 0) issues.push("preserved-evidence-refs-missing");
  if (!refs.preservedEvidenceRefs.includes(stringValue(candidate.sourceFailureRef) ?? "")) {
    issues.push("source-failure-not-preserved");
  }
  if (candidate.requiresOperatorApproval !== true) issues.push("operator-approval-required-posture-missing");
  if (candidate.currentProductionEventFamilies !== undefined) {
    const families = stringArray(candidate.currentProductionEventFamilies);
    if (
      families.length !== 2 ||
      !families.includes("repo_work_packet_continuity_event") ||
      !families.includes("operator_recorded_local_layer_decision")
    ) {
      issues.push("production-event-families-expanded");
    }
  }
  if (refs.allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");
  if (
    candidate.approvalGranted === true ||
    candidate.executionAuthorized === true ||
    candidate.authorityGranted === true ||
    candidate.truthClaimed === true ||
    candidate.acceptedContinuity === true ||
    candidate.automaticRerun === true ||
    candidate.edgeStateMigration === true ||
    candidate.compatibilityRemoved === true ||
    candidate.thirdFamilyPressureIncreased === true ||
    nonClaims.suggestionIsApproval === true ||
    nonClaims.suggestionIsExecution === true ||
    nonClaims.suggestionIsAuthority === true ||
    nonClaims.suggestionIsTruth === true ||
    nonClaims.suggestionIsAcceptedContinuity === true ||
    nonClaims.sidecarBecomesOperator === true ||
    nonClaims.admitsWritersOrReaders === true ||
    nonClaims.promotesEventFamilies === true ||
    nonClaims.rerunsWorkWithoutApproval === true ||
    nonClaims.resultContinuityPromoted === true ||
    nonClaims.resultReceiptEventFamilyAccepted === true
  ) {
    issues.push("approval-execution-authority-truth-or-continuity-claim");
  }

  return [...new Set(issues)];
}

function determineStatus(candidate: JsonRecord | undefined, issues: string[]): SidecarSuggestionStatus {
  if (!candidate) return "edge-operator-sidecar-repair-suggestion-malformed";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("approval-execution-authority-truth-or-continuity-claim") ||
    issues.includes("production-event-families-expanded")
  ) {
    return "edge-operator-sidecar-repair-suggestion-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-operator-sidecar-repair-suggestion-incomplete";
  return "edge-operator-sidecar-repair-suggestion-complete";
}

function requiredRefsPresent(candidate: JsonRecord | undefined): boolean {
  return stringValue(candidate?.suggestionRef) !== null &&
    stringValue(candidate?.sourceFailureRef) !== null &&
    stringValue(candidate?.sourceWorkPacketRef) !== null &&
    stringValue(candidate?.operatorDecisionRef) !== null;
}

function buildBoundary(): EdgeOperatorSidecarRepairSuggestionEvidenceArtifact["boundary"] {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    callsEdge: false,
    executesWork: false,
    writesContinuityRecords: false,
    acceptsContinuity: false,
    grantsAuthority: false,
    grantsApproval: false,
    claimsCausalTruth: false,
    claimsReadiness: false,
    startsBackend: false,
  };
}

function buildWarnings(status: SidecarSuggestionStatus): string[] {
  if (status === "edge-operator-sidecar-repair-suggestion-complete") {
    return [
      "sidecar-suggestion-preserved-as-review-evidence-only",
      "sidecar-suggestion-does-not-approve-or-execute-work",
      "testbed-pressure-expected-before-operator-use",
    ];
  }
  return ["edge-operator-sidecar-repair-suggestion-not-accepted-as-complete"];
}

function unsafeSeamRef(ref: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|(^|[.-])\.\.($|[.-])|ssh|http/iu.test(ref);
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "").map((entry) => entry.trim())
    : [];
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function createArtifactId(input: {
  emittedAt: string;
  suggestionRef: string | null;
  sourceFailureRef: string | null;
  sourcePath?: string;
}): string {
  return `causal-edge-operator-sidecar-repair-suggestion-evidence:${hash(JSON.stringify(input)).slice(0, 16)}`;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label} must be a non-empty string`);
}

function assertEqual<T>(actual: unknown, expected: T, label: string): asserts actual is T {
  if (actual !== expected) throw new Error(`${label} mismatch`);
}
