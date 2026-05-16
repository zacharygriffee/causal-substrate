import { createHash } from "node:crypto";

export const CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA =
  "causal-substrate/edge-self-work-trace-evidence/v1" as const;

export const CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-self-work-trace-evidence" as const;

export type EdgeSelfWorkTraceStatus =
  | "edge-self-work-trace-evidence-emitted"
  | "edge-self-work-trace-complete"
  | "edge-self-work-trace-incomplete"
  | "edge-self-work-trace-malformed"
  | "edge-self-work-trace-guardrail-blocked";

export interface EdgeSelfWorkTraceBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  opensAutobase: false;
  opensCorestore: false;
  callsEdge: false;
  callsPlatform: false;
  callsMesh: false;
  executesWork: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsCausalTruth: false;
  claimsCompletion: false;
  claimsRuntimeAuthority: false;
  startsBackend: false;
}

export interface EdgeSelfWorkTraceRefs {
  operatorIntentRefs: string[];
  workPacketRefs: string[];
  operatorDecisionRefs: string[];
  proposalRefs: string[];
  approvalRefs: string[];
  executorReceiptRefs: string[];
  verificationRefs: string[];
  causalHappeningRefs: string[];
  causalFrontierRefs: string[];
  operatorReturnSurfaceRefs: string[];
  sourceRepoRefs: string[];
}

export interface EdgeSelfWorkTraceProgress {
  observationPresent: boolean;
  workPacketPresent: boolean;
  operatorMediationPresent: boolean;
  executionReceiptPresent: boolean;
  verificationPresent: boolean;
  causalInterpretationPresent: boolean;
  testbedPressureExpected: boolean;
  operatorReturnPresent: boolean;
}

export interface EdgeSelfWorkTraceValidation {
  status: EdgeSelfWorkTraceStatus;
  parseableObject: boolean;
  requiredLoopRefsPresent: boolean;
  causalRefsPresent: boolean;
  verificationRefsPresent: boolean;
  unsafeSeamRefsBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  issues: string[];
}

export interface EdgeSelfWorkTraceEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo?: string;
    sourcePath?: string;
  };
  refs: EdgeSelfWorkTraceRefs;
  progress: EdgeSelfWorkTraceProgress;
  boundary: EdgeSelfWorkTraceBoundary;
  validation: EdgeSelfWorkTraceValidation;
  reviewStatus: EdgeSelfWorkTraceStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeSelfWorkTraceEvidenceInput {
  trace: unknown;
  emittedAt: string;
  artifactId?: string;
  sourceRepo?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

export function buildEdgeSelfWorkTraceEvidenceArtifact(
  input: BuildEdgeSelfWorkTraceEvidenceInput,
): EdgeSelfWorkTraceEvidenceArtifact {
  const candidate = isRecord(input.trace) ? input.trace : undefined;
  const refs = collectRefs(candidate);
  const progress = collectProgress(candidate, refs);
  const issues = validateTrace(candidate, input.trace, refs, progress);
  const status = determineStatus(candidate, issues);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    workPacketRefs: refs.workPacketRefs,
    executorReceiptRefs: refs.executorReceiptRefs,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(input.sourceRepo ? { sourceRepo: input.sourceRepo } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    refs,
    progress,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: candidate !== undefined,
      requiredLoopRefsPresent: requiredLoopRefsPresent(refs),
      causalRefsPresent: refs.causalHappeningRefs.length > 0 || refs.causalFrontierRefs.length > 0,
      verificationRefsPresent: refs.verificationRefs.length > 0,
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("truth-completion-authority-runtime-or-consensus-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-self-work-trace-complete"
      ? "edge-self-work-trace-evidence-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: buildRejections(status, issues),
  };
}

export function assertEdgeSelfWorkTraceEvidenceArtifact(
  value: unknown,
): asserts value is EdgeSelfWorkTraceEvidenceArtifact {
  const candidate = assertObject(value, "edge self-work trace evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.executesWork, false, "boundary.executesWork");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
}

function collectRefs(candidate: JsonRecord | undefined): EdgeSelfWorkTraceRefs {
  const safeCandidate = candidate ?? {};
  return {
    operatorIntentRefs: stringArray(safeCandidate.operatorIntentRefs),
    workPacketRefs: stringArray(safeCandidate.workPacketRefs),
    operatorDecisionRefs: stringArray(safeCandidate.operatorDecisionRefs),
    proposalRefs: stringArray(safeCandidate.proposalRefs),
    approvalRefs: stringArray(safeCandidate.approvalRefs),
    executorReceiptRefs: stringArray(safeCandidate.executorReceiptRefs),
    verificationRefs: stringArray(safeCandidate.verificationRefs),
    causalHappeningRefs: stringArray(safeCandidate.causalHappeningRefs),
    causalFrontierRefs: stringArray(safeCandidate.causalFrontierRefs),
    operatorReturnSurfaceRefs: stringArray(safeCandidate.operatorReturnSurfaceRefs),
    sourceRepoRefs: stringArray(safeCandidate.sourceRepoRefs),
  };
}

function collectProgress(
  candidate: JsonRecord | undefined,
  refs: EdgeSelfWorkTraceRefs,
): EdgeSelfWorkTraceProgress {
  const progress = isRecord(candidate?.progress) ? candidate.progress : {};
  return {
    observationPresent: progress.observationPresent === true || refs.sourceRepoRefs.length > 0,
    workPacketPresent: progress.workPacketPresent === true || refs.workPacketRefs.length > 0,
    operatorMediationPresent: progress.operatorMediationPresent === true || refs.operatorDecisionRefs.length > 0 || refs.approvalRefs.length > 0,
    executionReceiptPresent: progress.executionReceiptPresent === true || refs.executorReceiptRefs.length > 0,
    verificationPresent: progress.verificationPresent === true || refs.verificationRefs.length > 0,
    causalInterpretationPresent: progress.causalInterpretationPresent === true || refs.causalHappeningRefs.length > 0 || refs.causalFrontierRefs.length > 0,
    testbedPressureExpected: progress.testbedPressureExpected !== false,
    operatorReturnPresent: progress.operatorReturnPresent === true || refs.operatorReturnSurfaceRefs.length > 0,
  };
}

function validateTrace(
  candidate: JsonRecord | undefined,
  original: unknown,
  refs: EdgeSelfWorkTraceRefs,
  progress: EdgeSelfWorkTraceProgress,
): string[] {
  if (!isRecord(original) || !candidate) return ["trace-not-object"];
  const issues: string[] = [];
  const nonClaims = isRecord(candidate.nonClaims) ? candidate.nonClaims : {};
  const allRefs = Object.values(refs).flat();

  if (refs.operatorIntentRefs.length === 0) issues.push("operator-intent-refs-missing");
  if (refs.workPacketRefs.length === 0) issues.push("work-packet-refs-missing");
  if (refs.operatorDecisionRefs.length === 0 && refs.approvalRefs.length === 0) issues.push("operator-mediation-refs-missing");
  if (refs.executorReceiptRefs.length === 0) issues.push("executor-receipt-refs-missing");
  if (refs.verificationRefs.length === 0) issues.push("verification-refs-missing");
  if (refs.causalHappeningRefs.length === 0 && refs.causalFrontierRefs.length === 0) issues.push("causal-refs-missing");
  if (refs.operatorReturnSurfaceRefs.length === 0) issues.push("operator-return-surface-refs-missing");
  if (refs.sourceRepoRefs.length === 0) issues.push("source-repo-refs-missing");
  if (progress.testbedPressureExpected !== true) issues.push("testbed-pressure-not-expected");
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.runtimeAuthorityClaimed === true ||
    nonClaims.consensusClaimed === true ||
    nonClaims.backendOwnershipClaimed === true ||
    nonClaims.edgeOwnsPlatform === true ||
    nonClaims.edgeOwnsMeshRuntime === true
  ) {
    issues.push("truth-completion-authority-runtime-or-consensus-claim");
  }

  return [...new Set(issues)];
}

function determineStatus(candidate: JsonRecord | undefined, issues: string[]): EdgeSelfWorkTraceStatus {
  if (!candidate) return "edge-self-work-trace-malformed";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("truth-completion-authority-runtime-or-consensus-claim")
  ) {
    return "edge-self-work-trace-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-self-work-trace-incomplete";
  return "edge-self-work-trace-complete";
}

function requiredLoopRefsPresent(refs: EdgeSelfWorkTraceRefs): boolean {
  return refs.operatorIntentRefs.length > 0 &&
    refs.workPacketRefs.length > 0 &&
    (refs.operatorDecisionRefs.length > 0 || refs.approvalRefs.length > 0) &&
    refs.executorReceiptRefs.length > 0 &&
    refs.verificationRefs.length > 0 &&
    refs.operatorReturnSurfaceRefs.length > 0;
}

function buildBoundary(): EdgeSelfWorkTraceBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    opensAutobase: false,
    opensCorestore: false,
    callsEdge: false,
    callsPlatform: false,
    callsMesh: false,
    executesWork: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    claimsCompletion: false,
    claimsRuntimeAuthority: false,
    startsBackend: false,
  };
}

function buildWarnings(status: EdgeSelfWorkTraceStatus): string[] {
  if (status === "edge-self-work-trace-complete") {
    return [
      "self-work-trace-preserved-as-evidence-only",
      "causal-substrate-interprets-history-without-executing-edge",
      "testbed-pressure-expected-before-treating-loop-as-proven",
    ];
  }
  return ["edge-self-work-trace-not-accepted-as-complete"];
}

function buildRejections(status: EdgeSelfWorkTraceStatus, issues: string[]): string[] {
  if (status === "edge-self-work-trace-complete") return [];
  return issues.length > 0 ? issues : [status];
}

function unsafeSeamRef(ref: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|(^|[.-])\.\.($|[.-])|ssh|http/iu.test(ref);
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
  workPacketRefs: string[];
  executorReceiptRefs: string[];
  sourcePath?: string;
}): string {
  return `causal-edge-self-work-trace-evidence:${hash(JSON.stringify(input)).slice(0, 16)}`;
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
