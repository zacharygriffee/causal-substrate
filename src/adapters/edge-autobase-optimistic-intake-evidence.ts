import { createHash } from "node:crypto";

export const CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA =
  "causal-substrate/edge-autobase-optimistic-intake-evidence/v1" as const;

export const CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-autobase-optimistic-intake-evidence" as const;

export const EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_ARTIFACT_KIND =
  "edge_sandboxed_autobase_optimistic_intake_lab_result" as const;

export const EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_SCHEMA =
  "edge_sandboxed_autobase_optimistic_intake_lab_result.v0" as const;

export type EdgeAutobaseOptimisticIntakeEvidenceStatus =
  | "edge-autobase-optimistic-intake-evidence-emitted"
  | "edge-autobase-optimistic-intake-valid-evidence"
  | "edge-autobase-optimistic-intake-incomplete-evidence"
  | "edge-autobase-optimistic-intake-malformed-evidence"
  | "edge-autobase-optimistic-intake-guardrail-blocked";

export interface EdgeAutobaseOptimisticIntakeBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  opensAutobase: false;
  opensCorestore: false;
  callsEdge: false;
  callsMesh: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  acceptsAppendAsAcceptance: false;
  grantsWriterAuthority: false;
  claimsCausalTruth: false;
  claimsLayerSettlement: false;
  publishesToMesh: false;
  startsBackend: false;
}

export interface EdgeAutobaseOptimisticIntakeRefs {
  acceptedCandidateWriterRef?: string;
  rejectedCandidateWriterRef?: string;
  acceptedSourceProjectionEventRefs: string[];
  rejectedSourceProjectionEventRefs: string[];
}

export interface EdgeAutobaseOptimisticIntakePosture {
  sandboxedAutobaseLab: boolean;
  optimisticIntakeLab: boolean;
  nonWriterIntakeAllowed: boolean;
  acceptedViaAckWriter: boolean;
  rejectedWithoutAckWriter: boolean;
  appendSuccessIsAcceptance: boolean;
  acceptanceSource?: string;
  productionLocalLayerState: boolean;
  writesDurableLocalLayerState: boolean;
  localStoreRootIsIntegrationSeam: boolean;
  httpSeam: boolean;
  sshSeam: boolean;
  wallClockDefinesCausalOrder: boolean;
}

export interface EdgeAutobaseOptimisticIntakeValidation {
  status: EdgeAutobaseOptimisticIntakeEvidenceStatus;
  parseableObject: boolean;
  expectedSourceSchemaPresent: boolean;
  acceptedCandidateMaterialized: boolean;
  rejectedCandidateNotMaterialized: boolean;
  nonWriterBeforeAppend: boolean;
  ackWriterAcceptancePresent: boolean;
  appendSuccessAcceptanceBlocked: boolean;
  unsafeSeamRefsBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  issues: string[];
}

export interface EdgeAutobaseOptimisticIntakeEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceArtifactKind?: typeof EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_ARTIFACT_KIND;
    sourceSchema?: typeof EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_SCHEMA;
    sourcePath?: string;
  };
  candidateRefs: EdgeAutobaseOptimisticIntakeRefs;
  intakePosture: EdgeAutobaseOptimisticIntakePosture;
  boundary: EdgeAutobaseOptimisticIntakeBoundary;
  validation: EdgeAutobaseOptimisticIntakeValidation;
  reviewStatus: EdgeAutobaseOptimisticIntakeEvidenceStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeAutobaseOptimisticIntakeEvidenceInput {
  labResult: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

export function buildEdgeAutobaseOptimisticIntakeEvidenceArtifact(
  input: BuildEdgeAutobaseOptimisticIntakeEvidenceInput,
): EdgeAutobaseOptimisticIntakeEvidenceArtifact {
  const labResult = isRecord(input.labResult) ? input.labResult : undefined;
  const issues = validateLabResult(labResult, input.labResult);
  const status = determineStatus(labResult, issues);
  const candidateRefs = collectCandidateRefs(labResult);
  const intakePosture = collectIntakePosture(labResult);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    ...(candidateRefs.acceptedCandidateWriterRef
      ? { acceptedCandidateWriterRef: candidateRefs.acceptedCandidateWriterRef }
      : {}),
    ...(candidateRefs.rejectedCandidateWriterRef
      ? { rejectedCandidateWriterRef: candidateRefs.rejectedCandidateWriterRef }
      : {}),
  });
  const sourceArtifactKind = labResult?.artifactKind === EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_ARTIFACT_KIND
    ? EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_ARTIFACT_KIND
    : undefined;
  const sourceSchema = labResult?.schemaVersion === EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_SCHEMA
    ? EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_SCHEMA
    : undefined;

  return {
    artifactKind: CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(sourceArtifactKind ? { sourceArtifactKind } : {}),
      ...(sourceSchema ? { sourceSchema } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    candidateRefs,
    intakePosture,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: labResult !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      acceptedCandidateMaterialized: issues.includes("accepted-candidate-not-materialized") === false,
      rejectedCandidateNotMaterialized: issues.includes("rejected-candidate-materialized") === false,
      nonWriterBeforeAppend: issues.includes("candidate-writable-before-append") === false,
      ackWriterAcceptancePresent: issues.includes("ack-writer-acceptance-missing") === false,
      appendSuccessAcceptanceBlocked: issues.includes("append-success-treated-as-acceptance") === false,
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("truth-authority-settlement-or-state-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-autobase-optimistic-intake-valid-evidence"
      ? "edge-autobase-optimistic-intake-evidence-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: buildRejections(status, issues),
  };
}

export function assertEdgeAutobaseOptimisticIntakeEvidenceArtifact(
  value: unknown,
): asserts value is EdgeAutobaseOptimisticIntakeEvidenceArtifact {
  const artifact = assertObject(value, "edge autobase optimistic intake evidence artifact");
  assertEqual(artifact.artifactKind, CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(artifact.schema, CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA, "schema");
  assertEqual(artifact.schemaVersion, CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(artifact.artifactId, "artifactId");
  assertString(artifact.emittedAt, "emittedAt");
  const boundary = assertObject(artifact.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.opensAutobase, false, "boundary.opensAutobase");
  assertEqual(boundary.opensCorestore, false, "boundary.opensCorestore");
  assertEqual(boundary.acceptsAppendAsAcceptance, false, "boundary.acceptsAppendAsAcceptance");
  assertEqual(boundary.grantsWriterAuthority, false, "boundary.grantsWriterAuthority");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
}

function validateLabResult(labResult: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["lab-result-not-object"];
  if (!labResult) return ["lab-result-not-object"];

  const refs = collectCandidateRefs(labResult);
  const labPosture = isRecord(labResult.labPosture) ? labResult.labPosture : {};
  const nonClaims = isRecord(labResult.nonClaims) ? labResult.nonClaims : {};
  const allRefs = [
    refs.acceptedCandidateWriterRef,
    refs.rejectedCandidateWriterRef,
    ...refs.acceptedSourceProjectionEventRefs,
    ...refs.rejectedSourceProjectionEventRefs,
  ].filter((ref): ref is string => Boolean(ref));

  if (labResult.artifactKind !== EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (labResult.schemaVersion !== EDGE_AUTOBASE_OPTIMISTIC_INTAKE_LAB_SCHEMA) issues.push("source-schema-mismatch");
  if (labResult.labStatus !== "optimistic_intake_candidate_materialized") issues.push("lab-status-mismatch");
  if (numberValue(labResult.acceptedCandidateCount) < 1) issues.push("accepted-candidate-not-materialized");
  if (numberValue(labResult.rejectedCandidateInputCount) < 1) issues.push("rejected-candidate-input-missing");
  if (numberValue(labResult.rejectedMaterializedCount) !== 0) issues.push("rejected-candidate-materialized");
  if (labResult.acceptedCandidateWasWritableBeforeAppend !== false) issues.push("candidate-writable-before-append");
  if (labResult.rejectedCandidateWasWritableBeforeAppend !== false) issues.push("candidate-writable-before-append");
  if (!refs.acceptedCandidateWriterRef || !refs.rejectedCandidateWriterRef) issues.push("candidate-writer-ref-missing");
  if (refs.acceptedSourceProjectionEventRefs.length === 0) issues.push("accepted-source-ref-missing");
  if (refs.rejectedSourceProjectionEventRefs.length === 0) issues.push("rejected-source-ref-missing");
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");

  if (labPosture.sandboxedAutobaseLab !== true) issues.push("sandboxed-autobase-lab-missing");
  if (labPosture.optimisticIntakeLab !== true) issues.push("optimistic-intake-lab-missing");
  if (labPosture.nonWriterIntakeAllowed !== true) issues.push("non-writer-intake-posture-missing");
  if (labPosture.acceptedViaAckWriter !== true) issues.push("ack-writer-acceptance-missing");
  if (labPosture.rejectedWithoutAckWriter !== true) issues.push("rejected-without-ack-writer-missing");
  if (labPosture.appendSuccessIsAcceptance !== false) issues.push("append-success-treated-as-acceptance");
  if (labPosture.acceptanceSource !== "deterministic_apply_ackWriter_and_derived_view_materialization") {
    issues.push("acceptance-source-mismatch");
  }
  if (
    labPosture.productionLocalLayerState === true ||
    labPosture.writesDurableLocalLayerState === true ||
    labPosture.localStoreRootIsIntegrationSeam === true ||
    labPosture.httpSeam === true ||
    labPosture.sshSeam === true ||
    labPosture.wallClockDefinesCausalOrder === true
  ) {
    issues.push("backend-or-seam-overclaim");
  }
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.universalConsensusClaimed === true ||
    nonClaims.meshSettlementClaimed === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true
  ) {
    issues.push("truth-authority-settlement-or-state-claim");
  }

  return [...new Set(issues)];
}

function determineStatus(
  labResult: JsonRecord | undefined,
  issues: string[],
): EdgeAutobaseOptimisticIntakeEvidenceStatus {
  if (!labResult) return "edge-autobase-optimistic-intake-malformed-evidence";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("rejected-candidate-materialized") ||
    issues.includes("candidate-writable-before-append") ||
    issues.includes("append-success-treated-as-acceptance") ||
    issues.includes("backend-or-seam-overclaim") ||
    issues.includes("truth-authority-settlement-or-state-claim")
  ) {
    return "edge-autobase-optimistic-intake-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-autobase-optimistic-intake-incomplete-evidence";
  return "edge-autobase-optimistic-intake-valid-evidence";
}

function collectCandidateRefs(labResult: JsonRecord | undefined): EdgeAutobaseOptimisticIntakeRefs {
  const safeLabResult = labResult ?? {};
  const refs: EdgeAutobaseOptimisticIntakeRefs = {
    acceptedSourceProjectionEventRefs: stringArray(safeLabResult.acceptedSourceProjectionEventRefs),
    rejectedSourceProjectionEventRefs: stringArray(safeLabResult.rejectedSourceProjectionEventRefs),
  };
  const acceptedCandidateWriterRef = stringValue(safeLabResult.acceptedCandidateWriterRef);
  const rejectedCandidateWriterRef = stringValue(safeLabResult.rejectedCandidateWriterRef);
  if (acceptedCandidateWriterRef) refs.acceptedCandidateWriterRef = acceptedCandidateWriterRef;
  if (rejectedCandidateWriterRef) refs.rejectedCandidateWriterRef = rejectedCandidateWriterRef;
  return refs;
}

function collectIntakePosture(labResult: JsonRecord | undefined): EdgeAutobaseOptimisticIntakePosture {
  const labPosture = isRecord(labResult?.labPosture) ? labResult.labPosture : {};
  const acceptanceSource = stringValue(labPosture.acceptanceSource);
  const posture: EdgeAutobaseOptimisticIntakePosture = {
    sandboxedAutobaseLab: labPosture.sandboxedAutobaseLab === true,
    optimisticIntakeLab: labPosture.optimisticIntakeLab === true,
    nonWriterIntakeAllowed: labPosture.nonWriterIntakeAllowed === true,
    acceptedViaAckWriter: labPosture.acceptedViaAckWriter === true,
    rejectedWithoutAckWriter: labPosture.rejectedWithoutAckWriter === true,
    appendSuccessIsAcceptance: labPosture.appendSuccessIsAcceptance === true,
    productionLocalLayerState: labPosture.productionLocalLayerState === true,
    writesDurableLocalLayerState: labPosture.writesDurableLocalLayerState === true,
    localStoreRootIsIntegrationSeam: labPosture.localStoreRootIsIntegrationSeam === true,
    httpSeam: labPosture.httpSeam === true,
    sshSeam: labPosture.sshSeam === true,
    wallClockDefinesCausalOrder: labPosture.wallClockDefinesCausalOrder === true,
  };
  if (acceptanceSource) posture.acceptanceSource = acceptanceSource;
  return posture;
}

function buildBoundary(): EdgeAutobaseOptimisticIntakeBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    opensAutobase: false,
    opensCorestore: false,
    callsEdge: false,
    callsMesh: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    acceptsAppendAsAcceptance: false,
    grantsWriterAuthority: false,
    claimsCausalTruth: false,
    claimsLayerSettlement: false,
    publishesToMesh: false,
    startsBackend: false,
  };
}

function buildWarnings(status: EdgeAutobaseOptimisticIntakeEvidenceStatus): string[] {
  if (status === "edge-autobase-optimistic-intake-valid-evidence") {
    return [
      "optimistic-intake-preserved-as-evidence-only",
      "append-success-is-not-acceptance",
      "ack-writer-and-derived-view-materialization-are-acceptance-evidence",
      "non-writer-intake-does-not-grant-authority",
    ];
  }
  return ["optimistic-intake-not-accepted-as-canonical-history"];
}

function buildRejections(status: EdgeAutobaseOptimisticIntakeEvidenceStatus, issues: string[]): string[] {
  if (status === "edge-autobase-optimistic-intake-valid-evidence") return [];
  return issues.length > 0 ? issues : [status];
}

function unsafeSeamRef(ref: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|(^|[.-])\.\.($|[.-])|ssh|http/iu.test(ref);
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "").map((entry) => entry.trim())
    : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function createArtifactId(input: {
  emittedAt: string;
  sourcePath?: string;
  acceptedCandidateWriterRef?: string;
  rejectedCandidateWriterRef?: string;
}): string {
  return `causal-edge-autobase-optimistic-intake-evidence:${hash(JSON.stringify(input)).slice(0, 16)}`;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertString(value: unknown, label: string): asserts value is string {
  if (!stringValue(value)) throw new Error(`${label} must be a non-empty string`);
}

function assertEqual<T>(actual: unknown, expected: T, label: string): asserts actual is T {
  if (actual !== expected) throw new Error(`${label} mismatch`);
}
