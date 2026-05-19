import { createHash } from "node:crypto";

export const CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA =
  "causal-substrate/edge-validated-resource-ref-result-evidence/v1" as const;

export const CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-validated-resource-ref-result-evidence" as const;

type ReviewStatus =
  | "edge-validated-resource-ref-result-evidence-emitted"
  | "edge-validated-resource-ref-result-evidence-complete"
  | "edge-validated-resource-ref-result-evidence-incomplete"
  | "edge-validated-resource-ref-result-evidence-malformed"
  | "edge-validated-resource-ref-result-evidence-guardrail-blocked";

type JsonRecord = Record<string, unknown>;

export interface EdgeValidatedResourceRefResultEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo?: string;
    sourcePath?: string;
  };
  sourceValidationRef: string | null;
  sourceResourceRef: string | null;
  sourcePointerRef: string | null;
  sourceResolutionReceiptRef: string | null;
  sourceResultEvidenceRef: string | null;
  sourceHandoffRef: string | null;
  sourceWorkPacketRef: string | null;
  targetRef: string | null;
  interpretation: {
    interpretationKind: "observer-relative-validated-resource-ref-result-evidence";
    validationIsReviewOnly: true;
    resultEvidenceIsExternalOnly: true;
    payloadTruthClaimed: false;
    successInferred: false;
    approvalInferred: false;
    acceptedContinuity: false;
    resultReceiptContinuity: false;
    bytesAuthority: false;
  };
  boundary: {
    reviewOnly: true;
    evidenceOnly: true;
    callsEdge: false;
    fetchesPayload: false;
    parsesPayload: false;
    executesWork: false;
    acceptsContinuity: false;
    grantsAuthority: false;
    grantsApproval: false;
    claimsCausalTruth: false;
    claimsReadiness: false;
  };
  validation: {
    status: ReviewStatus;
    validationArtifactPresent: boolean;
    resultEvidencePresent: boolean;
    requiredRefsPresent: boolean;
    externalEvidencePosturePreserved: boolean;
    unsafeClaimsBlocked: boolean;
    unsafeSeamRefsBlocked: boolean;
    issues: string[];
  };
  reviewStatus: ReviewStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeValidatedResourceRefResultEvidenceArtifact({
  resourceValidation,
  resultEvidence,
  emittedAt,
  artifactId,
  sourceRepo,
  sourcePath,
}: {
  resourceValidation: unknown;
  resultEvidence?: unknown;
  emittedAt: string;
  artifactId?: string;
  sourceRepo?: string;
  sourcePath?: string;
}): EdgeValidatedResourceRefResultEvidenceArtifact {
  const validation = isRecord(resourceValidation) ? resourceValidation : undefined;
  const result = isRecord(resultEvidence) ? resultEvidence : undefined;
  const refs = collectRefs(validation, result);
  const issues = validateInputs(validation, resourceValidation, result, resultEvidence, refs);
  const status = determineStatus(validation, resourceValidation, issues);
  const effectiveArtifactId = artifactId ?? createArtifactId({
    emittedAt,
    sourceValidationRef: refs.sourceValidationRef,
    sourceResultEvidenceRef: refs.sourceResultEvidenceRef,
    ...(sourcePath ? { sourcePath } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA_VERSION,
    artifactId: effectiveArtifactId,
    emittedAt,
    source: {
      ...(sourceRepo ? { sourceRepo } : {}),
      ...(sourcePath ? { sourcePath } : {}),
    },
    sourceValidationRef: refs.sourceValidationRef,
    sourceResourceRef: refs.sourceResourceRef,
    sourcePointerRef: refs.sourcePointerRef,
    sourceResolutionReceiptRef: refs.sourceResolutionReceiptRef,
    sourceResultEvidenceRef: refs.sourceResultEvidenceRef,
    sourceHandoffRef: refs.sourceHandoffRef,
    sourceWorkPacketRef: refs.sourceWorkPacketRef,
    targetRef: refs.targetRef,
    interpretation: {
      interpretationKind: "observer-relative-validated-resource-ref-result-evidence",
      validationIsReviewOnly: true,
      resultEvidenceIsExternalOnly: true,
      payloadTruthClaimed: false,
      successInferred: false,
      approvalInferred: false,
      acceptedContinuity: false,
      resultReceiptContinuity: false,
      bytesAuthority: false,
    },
    boundary: buildBoundary(),
    validation: {
      status,
      validationArtifactPresent: validation !== undefined,
      resultEvidencePresent: result !== undefined,
      requiredRefsPresent: requiredRefsPresent(refs),
      externalEvidencePosturePreserved: issues.includes("external-evidence-posture-overclaim") === false,
      unsafeClaimsBlocked: issues.includes("unsafe-authority-truth-success-approval-or-continuity-claim") === false,
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      issues,
    },
    reviewStatus: status === "edge-validated-resource-ref-result-evidence-complete"
      ? "edge-validated-resource-ref-result-evidence-emitted"
      : status,
    warnings: buildWarnings(status, result),
    rejections: status === "edge-validated-resource-ref-result-evidence-complete" ? [] : issues,
  };
}

export function assertEdgeValidatedResourceRefResultEvidenceArtifact(
  value: unknown,
): asserts value is EdgeValidatedResourceRefResultEvidenceArtifact {
  const candidate = assertObject(value, "edge validated resource ref result evidence");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_EDGE_VALIDATED_RESOURCE_REF_RESULT_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.fetchesPayload, false, "boundary.fetchesPayload");
  assertEqual(boundary.parsesPayload, false, "boundary.parsesPayload");
  assertEqual(boundary.acceptsContinuity, false, "boundary.acceptsContinuity");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
}

function collectRefs(validation: JsonRecord | undefined, result: JsonRecord | undefined) {
  const correlationRefs = isRecord(result?.correlationRefs) ? result.correlationRefs : {};
  return {
    sourceValidationRef: stringValue(validation?.validationRef) ?? stringValue(correlationRefs.sourceResourceEvidenceValidationRef),
    sourceResourceRef: stringValue(validation?.sourceResourceRef) ?? stringValue(correlationRefs.sourceResourceRef),
    sourcePointerRef: stringValue(validation?.sourcePointerRef) ?? stringValue(correlationRefs.sourcePointerRef),
    sourceResolutionReceiptRef: stringValue(validation?.sourceResolutionReceiptRef) ??
      stringValue(correlationRefs.sourceResolutionReceiptRef),
    sourceResultEvidenceRef: stringValue(result?.evidenceId),
    sourceHandoffRef: stringValue(validation?.sourceHandoffRef) ?? stringValue(result?.sourceHandoffRef),
    sourceWorkPacketRef: stringValue(validation?.sourceWorkPacketRef) ?? stringValue(result?.sourceWorkPacketRef),
    targetRef: stringValue(validation?.targetRef) ?? stringValue(result?.targetRef),
    allRefs: [
      stringValue(validation?.validationRef),
      stringValue(validation?.sourceResourceRef),
      stringValue(validation?.sourcePointerRef),
      stringValue(validation?.sourceResolutionReceiptRef),
      stringValue(result?.evidenceId),
      stringValue(result?.sourceHandoffRef),
      stringValue(result?.sourceWorkPacketRef),
      stringValue(result?.targetRef),
      ...stringArray(result?.evidenceRefs),
      ...stringArray(result?.receiptRefs),
      ...stringArray(result?.sourceArtifactRefs),
    ].filter((entry): entry is string => entry !== null),
  };
}

function validateInputs(
  validation: JsonRecord | undefined,
  originalValidation: unknown,
  result: JsonRecord | undefined,
  originalResult: unknown,
  refs: ReturnType<typeof collectRefs>,
): string[] {
  if (!isRecord(originalValidation) || !validation) return ["resource-validation-not-object"];
  const issues: string[] = [];

  if (validation.artifactKind !== "edge_resource_evidence_validation") issues.push("validation-artifact-kind-mismatch");
  if (validation.schemaVersion !== "edge_resource_evidence_validation.v0") issues.push("validation-schema-version-mismatch");
  if (validation.validationStatus !== "validated_external_evidence_ref") issues.push("validation-status-not-validated");
  if (validation.canTreatAsExternalEvidenceRef !== true) issues.push("validation-not-external-evidence-ref");
  if (!requiredRefsPresent(refs)) issues.push("required-refs-missing");
  if (validation.payloadParsed !== false || validation.payloadImported !== false) issues.push("payload-parse-or-import-claim");
  if (validation.resultEvidenceCreated !== false) issues.push("validation-claims-result-evidence-created");
  if (
    validation.reviewOnly !== true ||
    validation.externalEvidenceOnly !== true ||
    validation.acceptedContinuity !== false
  ) {
    issues.push("external-evidence-posture-overclaim");
  }
  if (
    validation.approvalGranted === true ||
    validation.executionAuthorized === true ||
    validation.authorityGranted === true ||
    validation.bytesAuthority === true ||
    validation.edgeStateMigration === true ||
    validation.compatibilityRemoved === true
  ) {
    issues.push("unsafe-authority-truth-success-approval-or-continuity-claim");
  }

  if (originalResult !== undefined) {
    if (!isRecord(originalResult) || !result) {
      issues.push("result-evidence-not-object");
    } else {
      validateResultEvidence(result, refs, issues);
    }
  }

  if (refs.allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");

  return issues;
}

function validateResultEvidence(
  result: JsonRecord,
  refs: ReturnType<typeof collectRefs>,
  issues: string[],
) {
  const correlationRefs = isRecord(result.correlationRefs) ? result.correlationRefs : {};
  if (result.artifactKind !== "edge_operator_mediated_result_evidence") issues.push("result-artifact-kind-mismatch");
  if (result.schemaVersion !== "edge_operator_mediated_result_evidence.v1") issues.push("result-schema-version-mismatch");
  if (result.evidenceState !== "recorded_for_review") issues.push("result-not-recorded-for-review");
  if (result.evidenceOnly !== true || result.reviewOnly !== true) issues.push("result-evidence-not-review-only");
  if (stringValue(correlationRefs.sourceResourceEvidenceValidationRef) !== refs.sourceValidationRef) {
    issues.push("result-validation-ref-mismatch");
  }
  if (correlationRefs.payloadParsed !== false || correlationRefs.payloadFetched !== false) {
    issues.push("result-payload-fetch-or-parse-claim");
  }
  if (
    correlationRefs.successInferred !== false ||
    correlationRefs.approvalInferred !== false ||
    correlationRefs.resultReceiptContinuityCreated !== false ||
    correlationRefs.bytesAuthority !== false
  ) {
    issues.push("unsafe-authority-truth-success-approval-or-continuity-claim");
  }
  if (
    result.deliverySuccessClaimed === true ||
    result.executionSuccessClaimed === true ||
    result.adjacentAcceptanceGranted === true ||
    result.truthClaimed === true ||
    result.completionClaimed === true ||
    result.productionProofClaimed === true ||
    result.futureAuthorizationGranted === true
  ) {
    issues.push("unsafe-authority-truth-success-approval-or-continuity-claim");
  }
}

function determineStatus(
  validation: JsonRecord | undefined,
  originalValidation: unknown,
  issues: string[],
): ReviewStatus {
  if (!isRecord(originalValidation) || !validation) return "edge-validated-resource-ref-result-evidence-malformed";
  if (
    issues.includes("unsafe-authority-truth-success-approval-or-continuity-claim") ||
    issues.includes("unsafe-seam-ref") ||
    issues.includes("payload-parse-or-import-claim") ||
    issues.includes("result-payload-fetch-or-parse-claim")
  ) {
    return "edge-validated-resource-ref-result-evidence-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-validated-resource-ref-result-evidence-incomplete";
  return "edge-validated-resource-ref-result-evidence-complete";
}

function requiredRefsPresent(refs: ReturnType<typeof collectRefs>) {
  return refs.sourceValidationRef !== null &&
    refs.sourceResourceRef !== null &&
    refs.sourcePointerRef !== null &&
    refs.sourceResolutionReceiptRef !== null &&
    refs.sourceHandoffRef !== null &&
    refs.sourceWorkPacketRef !== null;
}

function buildBoundary() {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    callsEdge: false,
    fetchesPayload: false,
    parsesPayload: false,
    executesWork: false,
    acceptsContinuity: false,
    grantsAuthority: false,
    grantsApproval: false,
    claimsCausalTruth: false,
    claimsReadiness: false,
  } as const;
}

function buildWarnings(status: ReviewStatus, result: JsonRecord | undefined): string[] {
  if (status !== "edge-validated-resource-ref-result-evidence-complete") {
    return ["validated-resource-ref-result-evidence-not-reviewable"];
  }

  return [
    "validated-resource-ref-evidence-observed",
    result ? "operator-mediated-result-evidence-observed" : "operator-mediated-result-evidence-not-supplied",
    "payload-not-fetched-or-parsed",
    "success-approval-and-continuity-not-inferred",
  ];
}

function createArtifactId(input: Record<string, unknown>) {
  return `causal-edge-validated-resource-ref-result-evidence:${hash(JSON.stringify(input))}`;
}

function hash(input: string) {
  return createHash("sha256").update(input).digest("hex").slice(0, 24);
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unsafeSeamRef(value: string): boolean {
  return /^(?:https?:\/\/|ssh:\/\/|file:\/\/|\/|\.\/|\.\.\/|localhost\b|127\.0\.0\.1\b)/iu.test(value) ||
    /\b(?:localhost|127\.0\.0\.1|:\d{2,5}\b)/iu.test(value);
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

function assertEqual(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) {
    throw new TypeError(`${label} must be ${String(expected)}`);
  }
}

function assertString(value: unknown, label: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${label} must be a non-empty string`);
  }
}
