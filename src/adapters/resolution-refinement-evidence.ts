import { createHash } from "node:crypto";

export const CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA =
  "causal-substrate/resolution-refinement-evidence/v1" as const;

export const CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_ARTIFACT_KIND =
  "causal-resolution-refinement-evidence" as const;

export type ResolutionRefinementStatus =
  | "resolution-refinement-evidence-emitted"
  | "resolution-refinement-compatible"
  | "resolution-refinement-divergence-declared"
  | "resolution-refinement-divergence-posture-required"
  | "resolution-refinement-incomplete"
  | "resolution-refinement-malformed"
  | "resolution-refinement-guardrail-blocked";

export interface ResolutionRefinementBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  opensAutobase: false;
  opensCorestore: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsCausalTruth: false;
  claimsUniversalObserverPerspective: false;
  claimsRuntimeAuthority: false;
  startsBackend: false;
}

export interface ResolutionRefinementRefs {
  coarseHappeningRef?: string;
  coarseBranchRef?: string;
  observerRef?: string;
  referentRef?: string;
  refinedHappeningRefs: string[];
  refinedBranchRefs: string[];
  sourceEvidenceRefs: string[];
}

export interface ResolutionRefinementRelation {
  relationKind?: "decomposition" | "refinement" | "aggregation" | "composite";
  aggregatesToCoarse: boolean;
  contradictsCoarse: boolean;
  coarseRemainsValidSourceRef: boolean;
  currentResolutionLeaf: boolean;
  observerResolution?: string;
  basisResolution?: string;
  schemaResolution?: string;
  instrumentationResolution?: string;
  divergencePosture?: "divergent" | "ambiguous" | "broken" | "reconciliation-required" | "re-stabilized";
}

export interface ResolutionRefinementValidation {
  status: ResolutionRefinementStatus;
  parseableObject: boolean;
  coarseHappeningRefPresent: boolean;
  coarseBranchRefPresent: boolean;
  observerRefPresent: boolean;
  referentRefPresent: boolean;
  refinedHappeningRefsPresent: boolean;
  sourceEvidenceRefsPresent: boolean;
  aggregationCompatibilityDeclared: boolean;
  coarsePreserved: boolean;
  divergencePosturePresentWhenNeeded: boolean;
  unsafeSeamRefsBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  issues: string[];
}

export interface ResolutionRefinementEvidenceArtifact {
  artifactKind: typeof CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo?: string;
    sourcePath?: string;
  };
  refs: ResolutionRefinementRefs;
  relation: ResolutionRefinementRelation;
  boundary: ResolutionRefinementBoundary;
  validation: ResolutionRefinementValidation;
  reviewStatus: ResolutionRefinementStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildResolutionRefinementEvidenceInput {
  refinement: unknown;
  emittedAt: string;
  artifactId?: string;
  sourceRepo?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

export function buildResolutionRefinementEvidenceArtifact(
  input: BuildResolutionRefinementEvidenceInput,
): ResolutionRefinementEvidenceArtifact {
  const candidate = isRecord(input.refinement) ? input.refinement : undefined;
  const refs = collectRefs(candidate);
  const relation = collectRelation(candidate);
  const issues = validateRefinement(candidate, input.refinement, refs, relation);
  const status = determineStatus(candidate, issues, relation);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    refinedHappeningRefs: refs.refinedHappeningRefs,
    ...(refs.coarseHappeningRef ? { coarseHappeningRef: refs.coarseHappeningRef } : {}),
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
  });

  return {
    artifactKind: CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(input.sourceRepo ? { sourceRepo: input.sourceRepo } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    refs,
    relation,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: candidate !== undefined,
      coarseHappeningRefPresent: Boolean(refs.coarseHappeningRef),
      coarseBranchRefPresent: Boolean(refs.coarseBranchRef),
      observerRefPresent: Boolean(refs.observerRef),
      referentRefPresent: Boolean(refs.referentRef),
      refinedHappeningRefsPresent: refs.refinedHappeningRefs.length > 0,
      sourceEvidenceRefsPresent: refs.sourceEvidenceRefs.length > 0,
      aggregationCompatibilityDeclared: relation.aggregatesToCoarse === true,
      coarsePreserved: relation.coarseRemainsValidSourceRef === true,
      divergencePosturePresentWhenNeeded: relation.contradictsCoarse !== true || Boolean(relation.divergencePosture),
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("truth-authority-runtime-or-consensus-claim") === false,
      issues,
    },
    reviewStatus: status === "resolution-refinement-compatible" ||
      status === "resolution-refinement-divergence-declared"
      ? "resolution-refinement-evidence-emitted"
      : status,
    warnings: buildWarnings(status, relation),
    rejections: buildRejections(status, issues),
  };
}

export function assertResolutionRefinementEvidenceArtifact(
  value: unknown,
): asserts value is ResolutionRefinementEvidenceArtifact {
  const candidate = assertObject(value, "resolution refinement evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
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

function collectRefs(candidate: JsonRecord | undefined): ResolutionRefinementRefs {
  const safeCandidate = candidate ?? {};
  const refs: ResolutionRefinementRefs = {
    refinedHappeningRefs: stringArray(safeCandidate.refinedHappeningRefs),
    refinedBranchRefs: stringArray(safeCandidate.refinedBranchRefs),
    sourceEvidenceRefs: stringArray(safeCandidate.sourceEvidenceRefs),
  };
  const coarseHappeningRef = stringValue(safeCandidate.coarseHappeningRef);
  const coarseBranchRef = stringValue(safeCandidate.coarseBranchRef);
  const observerRef = stringValue(safeCandidate.observerRef);
  const referentRef = stringValue(safeCandidate.referentRef);
  if (coarseHappeningRef) refs.coarseHappeningRef = coarseHappeningRef;
  if (coarseBranchRef) refs.coarseBranchRef = coarseBranchRef;
  if (observerRef) refs.observerRef = observerRef;
  if (referentRef) refs.referentRef = referentRef;
  return refs;
}

function collectRelation(candidate: JsonRecord | undefined): ResolutionRefinementRelation {
  const relation = isRecord(candidate?.relation) ? candidate.relation : {};
  const relationKind = stringValue(relation.relationKind);
  const divergencePosture = stringValue(relation.divergencePosture);
  const result: ResolutionRefinementRelation = {
    aggregatesToCoarse: relation.aggregatesToCoarse === true,
    contradictsCoarse: relation.contradictsCoarse === true,
    coarseRemainsValidSourceRef: relation.coarseRemainsValidSourceRef === true,
    currentResolutionLeaf: relation.currentResolutionLeaf !== false,
  };

  if (isRelationKind(relationKind)) result.relationKind = relationKind;
  if (isDivergencePosture(divergencePosture)) result.divergencePosture = divergencePosture;
  const observerResolution = stringValue(relation.observerResolution);
  const basisResolution = stringValue(relation.basisResolution);
  const schemaResolution = stringValue(relation.schemaResolution);
  const instrumentationResolution = stringValue(relation.instrumentationResolution);
  if (observerResolution) result.observerResolution = observerResolution;
  if (basisResolution) result.basisResolution = basisResolution;
  if (schemaResolution) result.schemaResolution = schemaResolution;
  if (instrumentationResolution) result.instrumentationResolution = instrumentationResolution;
  return result;
}

function validateRefinement(
  candidate: JsonRecord | undefined,
  original: unknown,
  refs: ResolutionRefinementRefs,
  relation: ResolutionRefinementRelation,
): string[] {
  if (!isRecord(original) || !candidate) return ["refinement-not-object"];
  const issues: string[] = [];
  const nonClaims = isRecord(candidate.nonClaims) ? candidate.nonClaims : {};
  const allRefs = [
    refs.coarseHappeningRef,
    refs.coarseBranchRef,
    refs.observerRef,
    refs.referentRef,
    ...refs.refinedHappeningRefs,
    ...refs.refinedBranchRefs,
    ...refs.sourceEvidenceRefs,
  ].filter((ref): ref is string => Boolean(ref));

  if (!refs.coarseHappeningRef) issues.push("coarse-happening-ref-missing");
  if (!refs.coarseBranchRef) issues.push("coarse-branch-ref-missing");
  if (!refs.observerRef) issues.push("observer-ref-missing");
  if (!refs.referentRef) issues.push("referent-ref-missing");
  if (refs.refinedHappeningRefs.length === 0) issues.push("refined-happening-refs-missing");
  if (refs.sourceEvidenceRefs.length === 0) issues.push("source-evidence-refs-missing");
  if (!relation.relationKind) issues.push("relation-kind-missing-or-unsupported");
  if (relation.aggregatesToCoarse !== true && relation.contradictsCoarse !== true) {
    issues.push("aggregation-compatibility-missing");
  }
  if (relation.coarseRemainsValidSourceRef !== true) issues.push("coarse-source-ref-not-preserved");
  if (relation.contradictsCoarse === true && !relation.divergencePosture) {
    issues.push("divergence-posture-required");
  }
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.runtimeAuthorityClaimed === true ||
    nonClaims.consensusClaimed === true ||
    nonClaims.universalObserverPerspectiveClaimed === true ||
    nonClaims.backendOwnershipClaimed === true
  ) {
    issues.push("truth-authority-runtime-or-consensus-claim");
  }
  if (candidate.everyProgramVariableBecomesHappening === true) {
    issues.push("every-program-variable-branchification-claim");
  }

  return [...new Set(issues)];
}

function determineStatus(
  candidate: JsonRecord | undefined,
  issues: string[],
  relation: ResolutionRefinementRelation,
): ResolutionRefinementStatus {
  if (!candidate) return "resolution-refinement-malformed";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("truth-authority-runtime-or-consensus-claim") ||
    issues.includes("every-program-variable-branchification-claim")
  ) {
    return "resolution-refinement-guardrail-blocked";
  }
  if (issues.includes("divergence-posture-required")) {
    return "resolution-refinement-divergence-posture-required";
  }
  if (issues.length > 0) return "resolution-refinement-incomplete";
  if (relation.contradictsCoarse === true) return "resolution-refinement-divergence-declared";
  return "resolution-refinement-compatible";
}

function buildBoundary(): ResolutionRefinementBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    opensAutobase: false,
    opensCorestore: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    claimsUniversalObserverPerspective: false,
    claimsRuntimeAuthority: false,
    startsBackend: false,
  };
}

function buildWarnings(
  status: ResolutionRefinementStatus,
  relation: ResolutionRefinementRelation,
): string[] {
  if (status === "resolution-refinement-compatible") {
    return [
      "coarse-happening-preserved-as-valid-source-ref",
      "higher-resolution-refinement-does-not-erase-coarse-observation",
      "compatible-refinement-is-not-causal-truth-or-settlement",
    ];
  }
  if (status === "resolution-refinement-divergence-declared") {
    return [
      `divergence-posture-declared:${relation.divergencePosture}`,
      "contradictory-refinement-requires-explicit-review-before-re-stabilization",
    ];
  }
  return ["resolution-refinement-not-accepted-as-compatible-history"];
}

function buildRejections(status: ResolutionRefinementStatus, issues: string[]): string[] {
  if (
    status === "resolution-refinement-compatible" ||
    status === "resolution-refinement-divergence-declared"
  ) {
    return [];
  }
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

function isRelationKind(value: string | undefined): value is NonNullable<ResolutionRefinementRelation["relationKind"]> {
  return value === "decomposition" ||
    value === "refinement" ||
    value === "aggregation" ||
    value === "composite";
}

function isDivergencePosture(value: string | undefined): value is NonNullable<ResolutionRefinementRelation["divergencePosture"]> {
  return value === "divergent" ||
    value === "ambiguous" ||
    value === "broken" ||
    value === "reconciliation-required" ||
    value === "re-stabilized";
}

function createArtifactId(input: {
  emittedAt: string;
  coarseHappeningRef?: string;
  refinedHappeningRefs: string[];
  sourcePath?: string;
}): string {
  return `causal-resolution-refinement-evidence:${hash(JSON.stringify(input)).slice(0, 16)}`;
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
