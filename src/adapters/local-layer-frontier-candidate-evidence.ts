import { createHash } from "node:crypto";

export const CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA =
  "causal-substrate/local-layer-frontier-candidate-evidence/v1" as const;

export const CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_ARTIFACT_KIND =
  "causal-local-layer-frontier-candidate-evidence" as const;

export const LOCAL_LAYER_FRONTIER_CANDIDATE_ARTIFACT_KIND =
  "local_layer_collaborative_projection_frontier_candidate" as const;

export const LOCAL_LAYER_FRONTIER_CANDIDATE_SCHEMA =
  "mesh-ecology-spine/local-layer-collaborative-frontier/v0" as const;

export type LocalLayerFrontierCandidateEvidenceStatus =
  | "local-layer-frontier-candidate-evidence-emitted"
  | "local-layer-frontier-candidate-valid-evidence"
  | "local-layer-frontier-candidate-incomplete-evidence"
  | "local-layer-frontier-candidate-malformed-evidence"
  | "local-layer-frontier-candidate-guardrail-blocked";

export interface LocalLayerFrontierCandidateEvidenceBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  opensAutobase: false;
  opensCorestore: false;
  callsEdge: false;
  callsMesh: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsCausalTruth: false;
  claimsLayerSettlement: false;
  publishesToMesh: false;
  startsBackend: false;
}

export interface LocalLayerFrontierCandidateRefs {
  frontierId?: string;
  projectionLaneRef?: string;
  layerRef?: string;
  observerRef?: string;
  writerRefs: string[];
  headRefs: string[];
  linearizedEntryRefs: string[];
  causalFrontierRefs: string[];
  sourceProjectionEventRefs: string[];
  sourceHappeningRefs: string[];
}

export interface LocalLayerFrontierCandidateOrderingEvidence {
  orderingSource?: string;
  wallClockDefinesCausalOrder: boolean;
  headsRequired: boolean;
  writerRefsRequired: boolean;
  sourceRefsRequired: boolean;
  lineageRefsRequired: boolean;
  collaborativeCausalOrderCandidate: "autobase-or-equivalent-linearization";
}

export interface LocalLayerFrontierCandidateEvidenceValidation {
  status: LocalLayerFrontierCandidateEvidenceStatus;
  parseableObject: boolean;
  expectedSourceSchemaPresent: boolean;
  writerRefsPresent: boolean;
  headRefsPresent: boolean;
  linearizedEntryRefsPresent: boolean;
  causalFrontierRefsPresent: boolean;
  sourceRefsPresent: boolean;
  wallClockCausalOrderBlocked: boolean;
  unsafeSeamRefsBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  issues: string[];
}

export interface LocalLayerFrontierCandidateEvidenceArtifact {
  artifactKind: typeof CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-spine";
    sourceArtifactKind?: typeof LOCAL_LAYER_FRONTIER_CANDIDATE_ARTIFACT_KIND;
    sourceSchema?: typeof LOCAL_LAYER_FRONTIER_CANDIDATE_SCHEMA;
    sourcePath?: string;
  };
  frontierRefs: LocalLayerFrontierCandidateRefs;
  orderingEvidence: LocalLayerFrontierCandidateOrderingEvidence;
  boundary: LocalLayerFrontierCandidateEvidenceBoundary;
  validation: LocalLayerFrontierCandidateEvidenceValidation;
  reviewStatus: LocalLayerFrontierCandidateEvidenceStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildLocalLayerFrontierCandidateEvidenceInput {
  frontierCandidate: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

export function buildLocalLayerFrontierCandidateEvidenceArtifact(
  input: BuildLocalLayerFrontierCandidateEvidenceInput,
): LocalLayerFrontierCandidateEvidenceArtifact {
  const candidate = isRecord(input.frontierCandidate) ? input.frontierCandidate : undefined;
  const issues = validateFrontierCandidate(candidate, input.frontierCandidate);
  const status = determineStatus(candidate, issues);
  const frontierRefs = collectFrontierRefs(candidate);
  const orderingEvidence = collectOrderingEvidence(candidate);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    ...(frontierRefs.frontierId ? { frontierId: frontierRefs.frontierId } : {}),
  });
  const sourceArtifactKind = candidate?.artifactKind === LOCAL_LAYER_FRONTIER_CANDIDATE_ARTIFACT_KIND
    ? LOCAL_LAYER_FRONTIER_CANDIDATE_ARTIFACT_KIND
    : undefined;
  const sourceSchema = candidate?.schemaVersion === LOCAL_LAYER_FRONTIER_CANDIDATE_SCHEMA
    ? LOCAL_LAYER_FRONTIER_CANDIDATE_SCHEMA
    : undefined;

  return {
    artifactKind: CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-spine",
      ...(sourceArtifactKind ? { sourceArtifactKind } : {}),
      ...(sourceSchema ? { sourceSchema } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    frontierRefs,
    orderingEvidence,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: candidate !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      writerRefsPresent: issues.includes("writer-refs-missing") === false,
      headRefsPresent: issues.includes("head-refs-missing") === false,
      linearizedEntryRefsPresent: issues.includes("linearized-entry-refs-missing") === false,
      causalFrontierRefsPresent: issues.includes("causal-frontier-refs-missing") === false,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      wallClockCausalOrderBlocked: issues.includes("wall-clock-causal-order-claim") === false,
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("truth-authority-settlement-or-consensus-claim") === false,
      issues,
    },
    reviewStatus: status === "local-layer-frontier-candidate-valid-evidence"
      ? "local-layer-frontier-candidate-evidence-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: buildRejections(status, issues),
  };
}

export function assertLocalLayerFrontierCandidateEvidenceArtifact(
  value: unknown,
): asserts value is LocalLayerFrontierCandidateEvidenceArtifact {
  const candidate = assertObject(value, "local layer frontier candidate evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.opensAutobase, false, "boundary.opensAutobase");
  assertEqual(boundary.opensCorestore, false, "boundary.opensCorestore");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
}

function validateFrontierCandidate(candidate: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["frontier-candidate-not-object"];
  if (!candidate) return ["frontier-candidate-not-object"];

  const writerRefs = stringArray(candidate.writerRefs);
  const headRefs = stringArray(candidate.headRefs);
  const linearizedEntryRefs = stringArray(candidate.linearizedEntryRefs);
  const causalFrontierRefs = stringArray(candidate.causalFrontierRefs);
  const sourceProjectionEventRefs = stringArray(candidate.sourceProjectionEventRefs);
  const sourceHappeningRefs = stringArray(candidate.sourceHappeningRefs);
  const basis = isRecord(candidate.basis) ? candidate.basis : {};
  const nonClaims = isRecord(candidate.nonClaims) ? candidate.nonClaims : {};
  const allRefs = [
    stringValue(candidate.frontierId),
    stringValue(candidate.projectionLaneRef),
    stringValue(candidate.layerRef),
    stringValue(candidate.observerRef),
    ...writerRefs,
    ...headRefs,
    ...linearizedEntryRefs,
    ...causalFrontierRefs,
    ...sourceProjectionEventRefs,
    ...sourceHappeningRefs,
  ].filter((ref): ref is string => Boolean(ref));

  if (candidate.artifactKind !== LOCAL_LAYER_FRONTIER_CANDIDATE_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (candidate.schemaVersion !== LOCAL_LAYER_FRONTIER_CANDIDATE_SCHEMA) issues.push("source-schema-mismatch");
  if (!stringValue(candidate.frontierId)) issues.push("frontier-id-missing");
  if (!stringValue(candidate.projectionLaneRef)) issues.push("projection-lane-ref-missing");
  if (!stringValue(candidate.layerRef)) issues.push("layer-ref-missing");
  if (!stringValue(candidate.observerRef)) issues.push("observer-ref-missing");
  if (writerRefs.length === 0) issues.push("writer-refs-missing");
  if (headRefs.length === 0) issues.push("head-refs-missing");
  if (linearizedEntryRefs.length === 0) issues.push("linearized-entry-refs-missing");
  if (causalFrontierRefs.length === 0) issues.push("causal-frontier-refs-missing");
  if (sourceProjectionEventRefs.length === 0 || sourceHappeningRefs.length === 0) issues.push("source-refs-missing");
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");

  if (basis.orderingSource !== "autobase_linearization") issues.push("ordering-source-missing-or-unsupported");
  if (basis.wallClockDefinesCausalOrder !== false) issues.push("wall-clock-causal-order-claim");
  if (
    basis.headsRequired !== true ||
    basis.writerRefsRequired !== true ||
    basis.sourceRefsRequired !== true ||
    basis.lineageRefsRequired !== true
  ) {
    issues.push("basis-required-flags-missing");
  }

  if (
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.universalConsensusClaimed === true ||
    nonClaims.meshSettlementClaimed === true
  ) {
    issues.push("truth-authority-settlement-or-consensus-claim");
  }

  return [...new Set(issues)];
}

function determineStatus(
  candidate: JsonRecord | undefined,
  issues: string[],
): LocalLayerFrontierCandidateEvidenceStatus {
  if (!candidate) return "local-layer-frontier-candidate-malformed-evidence";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("wall-clock-causal-order-claim") ||
    issues.includes("truth-authority-settlement-or-consensus-claim")
  ) {
    return "local-layer-frontier-candidate-guardrail-blocked";
  }
  if (issues.length > 0) return "local-layer-frontier-candidate-incomplete-evidence";
  return "local-layer-frontier-candidate-valid-evidence";
}

function collectFrontierRefs(candidate: JsonRecord | undefined): LocalLayerFrontierCandidateRefs {
  const safeCandidate = candidate ?? {};
  const frontierId = stringValue(safeCandidate.frontierId);
  const projectionLaneRef = stringValue(safeCandidate.projectionLaneRef);
  const layerRef = stringValue(safeCandidate.layerRef);
  const observerRef = stringValue(safeCandidate.observerRef);
  const refs: LocalLayerFrontierCandidateRefs = {
    writerRefs: stringArray(safeCandidate.writerRefs),
    headRefs: stringArray(safeCandidate.headRefs),
    linearizedEntryRefs: stringArray(safeCandidate.linearizedEntryRefs),
    causalFrontierRefs: stringArray(safeCandidate.causalFrontierRefs),
    sourceProjectionEventRefs: stringArray(safeCandidate.sourceProjectionEventRefs),
    sourceHappeningRefs: stringArray(safeCandidate.sourceHappeningRefs),
  };
  if (frontierId) refs.frontierId = frontierId;
  if (projectionLaneRef) refs.projectionLaneRef = projectionLaneRef;
  if (layerRef) refs.layerRef = layerRef;
  if (observerRef) refs.observerRef = observerRef;
  return refs;
}

function collectOrderingEvidence(candidate: JsonRecord | undefined): LocalLayerFrontierCandidateOrderingEvidence {
  const basis = isRecord(candidate?.basis) ? candidate.basis : {};
  const orderingSource = stringValue(basis.orderingSource);
  const evidence: LocalLayerFrontierCandidateOrderingEvidence = {
    wallClockDefinesCausalOrder: basis.wallClockDefinesCausalOrder === true,
    headsRequired: basis.headsRequired === true,
    writerRefsRequired: basis.writerRefsRequired === true,
    sourceRefsRequired: basis.sourceRefsRequired === true,
    lineageRefsRequired: basis.lineageRefsRequired === true,
    collaborativeCausalOrderCandidate: "autobase-or-equivalent-linearization",
  };
  if (orderingSource) evidence.orderingSource = orderingSource;
  return evidence;
}

function buildBoundary(): LocalLayerFrontierCandidateEvidenceBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    opensAutobase: false,
    opensCorestore: false,
    callsEdge: false,
    callsMesh: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    claimsLayerSettlement: false,
    publishesToMesh: false,
    startsBackend: false,
  };
}

function buildWarnings(status: LocalLayerFrontierCandidateEvidenceStatus): string[] {
  if (status === "local-layer-frontier-candidate-valid-evidence") {
    return [
      "frontier-candidate-preserved-as-evidence-only",
      "autobase-linearization-named-without-opening-autobase",
      "wall-clock-time-is-observation-metadata-not-causal-order",
    ];
  }
  return ["frontier-candidate-not-accepted-as-canonical-history"];
}

function buildRejections(status: LocalLayerFrontierCandidateEvidenceStatus, issues: string[]): string[] {
  if (status === "local-layer-frontier-candidate-valid-evidence") return [];
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

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function createArtifactId(input: { emittedAt: string; sourcePath?: string; frontierId?: string }): string {
  return `causal-local-layer-frontier-candidate-evidence:${hash(JSON.stringify(input)).slice(0, 16)}`;
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
