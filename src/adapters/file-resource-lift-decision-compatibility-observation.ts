import { createHash } from "node:crypto";

export const CAUSAL_FILE_RESOURCE_LIFT_DECISION_COMPATIBILITY_OBSERVATION_SCHEMA =
  "causal-substrate/file-resource-lift-decision-compatibility-observation/v1" as const;

export const CAUSAL_FILE_RESOURCE_LIFT_DECISION_COMPATIBILITY_OBSERVATION_ARTIFACT_KIND =
  "causal_file_resource_lift_decision_compatibility_observation" as const;

export type FileResourceLiftDecisionCompatibilityStatus =
  | "file-resource-lift-compatibility-question-ready"
  | "file-resource-lift-compatibility-held"
  | "file-resource-lift-compatibility-blocked";

export interface FileResourceLiftDecisionCompatibilityObservation {
  artifactKind: typeof CAUSAL_FILE_RESOURCE_LIFT_DECISION_COMPATIBILITY_OBSERVATION_ARTIFACT_KIND;
  schema: typeof CAUSAL_FILE_RESOURCE_LIFT_DECISION_COMPATIBILITY_OBSERVATION_SCHEMA;
  schemaVersion: 1;
  observationId: string;
  observationHash: string;
  emittedAt: string;
  proofRung: "local_supplied_material";
  sourcePaths: {
    layerDecisionBoundaryReview?: string | undefined;
    layerDecisionBoundaryReviewReadback?: string | undefined;
  };
  sourceRefs: {
    layerDecisionBoundaryReviewRef: string | null;
    layerDecisionBoundaryReviewHash: string | null;
    layerDecisionBoundaryReviewReadbackRef: string | null;
    layerDecisionBoundaryReviewReadbackHash: string | null;
    edgeOperatorDecisionRef: string | null;
    edgeOperatorDecisionHash: string | null;
    rbcReceiptRef: string | null;
    rbcReceiptHash: string | null;
    studioLiftSourceCandidateRef: string | null;
    bytesVisibilityEvidenceRef: string | null;
  };
  status: FileResourceLiftDecisionCompatibilityStatus;
  classification: "compatibility_question_ready" | "compatibility_question_held" | "compatibility_question_blocked";
  interpretation: {
    concreteCompatibilityQuestionExists: boolean;
    sourceContinuityQuestionPreserved: true;
    viewsDoNotReplaceSourceContinuity: true;
    admissionCandidateBoundaryPreserved: true;
    convergenceNotAttempted: true;
  };
  validation: {
    layerReviewObserved: boolean;
    layerReadbackObserved: boolean;
    layerReadbackVerified: boolean;
    layerReviewIsReady: boolean;
    layerReviewIsHeld: boolean;
    noLayerAdmissionClaim: true;
    noAcceptedContinuityClaim: true;
    noCanonicalHistoryClaim: true;
    noViewAsSourceContinuityClaim: true;
    noAuthorityClaim: true;
    issues: string[];
  };
  boundary: {
    observesLayerReviewOnly: true;
    opensLayerRuntime: false;
    writesLayerState: false;
    appendsCausalContinuity: false;
    admitsLayerEvidence: false;
    acceptsCanonicalHistory: false;
    attemptsConvergence: false;
    grantsAuthority: false;
  };
  nonClaims: {
    layerAdmission: false;
    acceptedContinuity: false;
    canonicalHistory: false;
    convergence: false;
    causalTruth: false;
    viewAsSourceContinuity: false;
    authority: false;
  };
  nextPressure: string;
}

export function buildFileResourceLiftDecisionCompatibilityObservation(input: {
  layerDecisionBoundaryReview?: unknown;
  layerDecisionBoundaryReviewReadback?: unknown;
  emittedAt: string;
  sourcePaths?: FileResourceLiftDecisionCompatibilityObservation["sourcePaths"] | undefined;
  observationId?: string | undefined;
}): FileResourceLiftDecisionCompatibilityObservation {
  const review = objectOrNull(input.layerDecisionBoundaryReview);
  const readback = objectOrNull(input.layerDecisionBoundaryReviewReadback);
  const issues = reviewIssues(review, readback);
  const ready = issues.length === 0 && stringValue(review?.classification) === "ready_for_layer_admission_candidate";
  const held = issues.length === 0 && stringValue(review?.classification) === "held_by_operator";
  const status: FileResourceLiftDecisionCompatibilityStatus = ready
    ? "file-resource-lift-compatibility-question-ready"
    : held
      ? "file-resource-lift-compatibility-held"
      : "file-resource-lift-compatibility-blocked";
  const classification = ready
    ? "compatibility_question_ready"
    : held
      ? "compatibility_question_held"
      : "compatibility_question_blocked";
  const sourcePaths = sanitizeSourcePaths(input.sourcePaths ?? {});
  const reviewSourceRefs = objectOrNull(review?.sourceRefs);
  const sourceRefs = {
    layerDecisionBoundaryReviewRef: stringValue(review?.reviewRef),
    layerDecisionBoundaryReviewHash: stringValue(review?.reviewHash),
    layerDecisionBoundaryReviewReadbackRef: stringValue(readback?.readbackRef),
    layerDecisionBoundaryReviewReadbackHash: stringValue(readback?.readbackHash),
    edgeOperatorDecisionRef: stringValue(reviewSourceRefs?.edgeOperatorDecisionRef),
    edgeOperatorDecisionHash: stringValue(reviewSourceRefs?.edgeOperatorDecisionHash),
    rbcReceiptRef: stringValue(reviewSourceRefs?.rbcReceiptRef),
    rbcReceiptHash: stringValue(reviewSourceRefs?.rbcReceiptHash),
    studioLiftSourceCandidateRef: stringValue(reviewSourceRefs?.studioLiftSourceCandidateRef),
    bytesVisibilityEvidenceRef: stringValue(reviewSourceRefs?.bytesVisibilityEvidenceRef),
  };
  const observationId = input.observationId ??
    `causal-file-resource-lift-decision-compatibility:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourceRefs,
      status,
    })).slice(0, 16)}`;
  const observationHash = `sha256:${hash(stableJson({
    sourceRefs,
    status,
    classification,
    issues,
  }))}`;

  return {
    artifactKind: CAUSAL_FILE_RESOURCE_LIFT_DECISION_COMPATIBILITY_OBSERVATION_ARTIFACT_KIND,
    schema: CAUSAL_FILE_RESOURCE_LIFT_DECISION_COMPATIBILITY_OBSERVATION_SCHEMA,
    schemaVersion: 1,
    observationId,
    observationHash,
    emittedAt: input.emittedAt,
    proofRung: "local_supplied_material",
    sourcePaths,
    sourceRefs,
    status,
    classification,
    interpretation: {
      concreteCompatibilityQuestionExists: ready,
      sourceContinuityQuestionPreserved: true,
      viewsDoNotReplaceSourceContinuity: true,
      admissionCandidateBoundaryPreserved: true,
      convergenceNotAttempted: true,
    },
    validation: {
      layerReviewObserved: review !== null,
      layerReadbackObserved: readback !== null,
      layerReadbackVerified: readback?.reviewHashMatches === true,
      layerReviewIsReady: ready,
      layerReviewIsHeld: held,
      noLayerAdmissionClaim: true,
      noAcceptedContinuityClaim: true,
      noCanonicalHistoryClaim: true,
      noViewAsSourceContinuityClaim: true,
      noAuthorityClaim: true,
      issues,
    },
    boundary: {
      observesLayerReviewOnly: true,
      opensLayerRuntime: false,
      writesLayerState: false,
      appendsCausalContinuity: false,
      admitsLayerEvidence: false,
      acceptsCanonicalHistory: false,
      attemptsConvergence: false,
      grantsAuthority: false,
    },
    nonClaims: {
      layerAdmission: false,
      acceptedContinuity: false,
      canonicalHistory: false,
      convergence: false,
      causalTruth: false,
      viewAsSourceContinuity: false,
      authority: false,
    },
    nextPressure: ready
      ? "spine_repo_family_reassessment_after_file_resource_lift_decision_boundary"
      : held
        ? "operator_hold_preserved_no_causal_compatibility_question"
        : "repair_layer_file_resource_lift_decision_boundary_review",
  };
}

export function assertFileResourceLiftDecisionCompatibilityObservation(
  value: unknown,
): asserts value is FileResourceLiftDecisionCompatibilityObservation {
  const candidate = objectOrNull(value);
  if (!candidate) throw new Error("file-resource-lift-decision-compatibility-observation must be an object");
  if (candidate.artifactKind !== CAUSAL_FILE_RESOURCE_LIFT_DECISION_COMPATIBILITY_OBSERVATION_ARTIFACT_KIND) {
    throw new Error("file-resource-lift-decision-compatibility-observation artifactKind mismatch");
  }
  if (candidate.schema !== CAUSAL_FILE_RESOURCE_LIFT_DECISION_COMPATIBILITY_OBSERVATION_SCHEMA) {
    throw new Error("file-resource-lift-decision-compatibility-observation schema mismatch");
  }
  const nonClaims = objectOrNull(candidate.nonClaims);
  for (const field of [
    "layerAdmission",
    "acceptedContinuity",
    "canonicalHistory",
    "convergence",
    "causalTruth",
    "viewAsSourceContinuity",
    "authority",
  ]) {
    if (nonClaims?.[field] !== false) {
      throw new Error(`file-resource-lift-decision-compatibility-observation nonClaims.${field} must be false`);
    }
  }
}

function reviewIssues(review: Record<string, unknown> | null, readback: Record<string, unknown> | null): string[] {
  const issues: string[] = [];
  if (!review) issues.push("layer-decision-boundary-review-missing");
  if (review?.artifactKind !== "layer_file_resource_lift_decision_boundary_review") {
    issues.push("layer-decision-boundary-review-kind-invalid");
  }
  if (review?.schemaVersion !== "layer_file_resource_lift_decision_boundary_review.v0") {
    issues.push("layer-decision-boundary-review-schema-invalid");
  }
  if (review?.requiredNextBoundary !== "layer_file_resource_admission_candidate_after_explicit_operator_or_rbc_lift_decision") {
    issues.push("layer-decision-boundary-review-next-boundary-invalid");
  }
  const proofBoundary = objectOrNull(review?.proofBoundary);
  const nonClaims = objectOrNull(review?.nonClaims);
  for (const field of [
    "layerAdmission",
    "acceptedContinuity",
    "durableAppend",
    "storageRefAsAdmission",
    "externalReferenceAsCanon",
    "localPathAsCanon",
    "viewAsSourceContinuity",
    "operatorReviewAsCanon",
    "rbcDecisionAsAdmission",
    "canonicalTruth",
    "authority",
  ]) {
    if (proofBoundary?.[field] !== false) issues.push(`layer-review-proof-boundary-${field}-overclaim`);
    if (nonClaims?.[field] !== false) issues.push(`layer-review-non-claim-${field}-overclaim`);
  }
  if (readback?.artifactKind !== "layer_file_resource_lift_decision_boundary_review_readback") {
    issues.push("layer-decision-boundary-review-readback-kind-invalid");
  }
  if (readback?.sourceReviewHash !== review?.reviewHash) {
    issues.push("layer-decision-boundary-review-readback-hash-mismatch");
  }
  if (readback?.reviewHashMatches !== true) {
    issues.push("layer-decision-boundary-review-readback-not-verified");
  }
  return issues;
}

function objectOrNull(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function sanitizeSourcePaths(
  sourcePaths: FileResourceLiftDecisionCompatibilityObservation["sourcePaths"],
): FileResourceLiftDecisionCompatibilityObservation["sourcePaths"] {
  return {
    ...(typeof sourcePaths.layerDecisionBoundaryReview === "string"
      ? { layerDecisionBoundaryReview: sourcePaths.layerDecisionBoundaryReview }
      : {}),
    ...(typeof sourcePaths.layerDecisionBoundaryReviewReadback === "string"
      ? { layerDecisionBoundaryReviewReadback: sourcePaths.layerDecisionBoundaryReviewReadback }
      : {}),
  };
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value as Record<string, unknown>).sort().map((key) =>
      `${JSON.stringify(key)}:${stableJson((value as Record<string, unknown>)[key])}`
    ).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
