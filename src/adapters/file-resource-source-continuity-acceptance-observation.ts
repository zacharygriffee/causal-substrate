import { createHash } from "node:crypto";

export const CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_ACCEPTANCE_OBSERVATION_SCHEMA =
  "causal-substrate/file-resource-source-continuity-acceptance-observation/v1" as const;
export const CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_ACCEPTANCE_OBSERVATION_ARTIFACT_KIND =
  "causal_file_resource_source_continuity_acceptance_observation" as const;

export interface FileResourceSourceContinuityAcceptanceObservation {
  artifactKind: typeof CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_ACCEPTANCE_OBSERVATION_ARTIFACT_KIND;
  schema: typeof CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_ACCEPTANCE_OBSERVATION_SCHEMA;
  schemaVersion: 1;
  observationId: string;
  observationHash: string;
  emittedAt: string;
  proofRung: "local_supplied_material";
  sourceRefs: {
    layerAppendRef: string | null;
    layerAppendHash: string | null;
    layerAppendReadbackRef: string | null;
    layerAppendReadbackHash: string | null;
    edgeIntentRef: string | null;
    rbcReceiptRef: string | null;
    bytesVisibilityEvidenceRef: string | null;
  };
  status: "file-resource-source-continuity-acceptance-compatible" | "file-resource-source-continuity-acceptance-blocked";
  interpretation: {
    layerAcceptedSourceContinuityObserved: boolean;
    acceptedOnlyForLayerScope: boolean;
    causalCompatibilityObserved: boolean;
    causalAuthorityClaimed: false;
    globalCanonClaimed: false;
    productionDurabilityClaimed: false;
  };
  validation: {
    layerAppendObserved: boolean;
    layerAppendReadbackObserved: boolean;
    layerAppendHashVerified: boolean;
    acceptedSourceContinuityVisible: boolean;
    noGlobalCanonClaim: true;
    noProductionDurabilityClaim: true;
    noAuthorityClaim: true;
    issues: string[];
  };
  nonClaims: {
    layerAdmission: false;
    durableAppend: false;
    causalContinuityAppend: false;
    canonicalAdmission: false;
    canonicalHistory: false;
    causalTruth: false;
    globalCanon: false;
    authority: false;
    productionDurability: false;
  };
  nextPressure: string;
}

export function buildFileResourceSourceContinuityAcceptanceObservation(input: {
  layerAppend?: unknown;
  layerAppendReadback?: unknown;
  emittedAt: string;
  observationId?: string | undefined;
}): FileResourceSourceContinuityAcceptanceObservation {
  const append = objectOrNull(input.layerAppend);
  const readback = objectOrNull(input.layerAppendReadback);
  const issues = observationIssues(append, readback);
  const compatible = issues.length === 0;
  const sourceRefs = {
    layerAppendRef: stringValue(append?.appendRef),
    layerAppendHash: stringValue(append?.appendHash),
    layerAppendReadbackRef: stringValue(readback?.readbackRef),
    layerAppendReadbackHash: stringValue(readback?.readbackHash),
    edgeIntentRef: stringValue(objectOrNull(append?.sourceRefs)?.edgeIntentRef),
    rbcReceiptRef: stringValue(objectOrNull(append?.sourceRefs)?.rbcReceiptRef),
    bytesVisibilityEvidenceRef: stringValue(objectOrNull(append?.sourceRefs)?.bytesVisibilityEvidenceRef),
  };
  const status = compatible
    ? "file-resource-source-continuity-acceptance-compatible"
    : "file-resource-source-continuity-acceptance-blocked";
  const observationId = input.observationId ??
    `causal-file-resource-source-continuity-acceptance:${hash(stableJson({ sourceRefs, status })).slice(0, 16)}`;
  const observationHash = `sha256:${hash(stableJson({ sourceRefs, status, issues }))}`;
  return {
    artifactKind: CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_ACCEPTANCE_OBSERVATION_ARTIFACT_KIND,
    schema: CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_ACCEPTANCE_OBSERVATION_SCHEMA,
    schemaVersion: 1,
    observationId,
    observationHash,
    emittedAt: input.emittedAt,
    proofRung: "local_supplied_material",
    sourceRefs,
    status,
    interpretation: {
      layerAcceptedSourceContinuityObserved: compatible,
      acceptedOnlyForLayerScope: append?.acceptedSourceContinuity?.acceptedForLayerScopeOnly === true,
      causalCompatibilityObserved: compatible,
      causalAuthorityClaimed: false,
      globalCanonClaimed: false,
      productionDurabilityClaimed: false,
    },
    validation: {
      layerAppendObserved: append !== null,
      layerAppendReadbackObserved: readback !== null,
      layerAppendHashVerified: appendHashVerified(append, readback),
      acceptedSourceContinuityVisible: append?.acceptedSourceContinuity?.sourceContinuityAccepted === true,
      noGlobalCanonClaim: true,
      noProductionDurabilityClaim: true,
      noAuthorityClaim: true,
      issues,
    },
    nonClaims: {
      layerAdmission: false,
      durableAppend: false,
      causalContinuityAppend: false,
      canonicalAdmission: false,
      canonicalHistory: false,
      causalTruth: false,
      globalCanon: false,
      authority: false,
      productionDurability: false,
    },
    nextPressure: compatible
      ? "bytes_post_acceptance_material_visibility_check"
      : "repair_layer_source_continuity_acceptance_append_before_causal_observation",
  };
}

export function assertFileResourceSourceContinuityAcceptanceObservation(
  value: unknown,
): asserts value is FileResourceSourceContinuityAcceptanceObservation {
  const candidate = objectOrNull(value);
  if (!candidate) throw new TypeError("observation must be an object");
  if (candidate.artifactKind !== CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_ACCEPTANCE_OBSERVATION_ARTIFACT_KIND) {
    throw new TypeError("observation artifactKind is invalid");
  }
  if (candidate.schema !== CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_ACCEPTANCE_OBSERVATION_SCHEMA) {
    throw new TypeError("observation schema is invalid");
  }
  if (candidate.validation?.noAuthorityClaim !== true) throw new TypeError("observation must not claim authority");
  if (candidate.nonClaims?.globalCanon !== false) throw new TypeError("observation must not claim global canon");
  if (candidate.nonClaims?.productionDurability !== false) throw new TypeError("observation must not claim production durability");
}

function observationIssues(append: Record<string, any> | null, readback: Record<string, any> | null): string[] {
  const issues: string[] = [];
  if (append?.artifactKind !== "layer_file_resource_source_continuity_acceptance_append") issues.push("layer_append_kind_invalid");
  if (append?.appendStatus !== "layer_file_resource_source_continuity_acceptance_appended") issues.push("layer_append_status_invalid");
  if (append?.acceptedSourceContinuity?.sourceContinuityAccepted !== true) issues.push("source_continuity_not_accepted");
  if (append?.acceptedSourceContinuity?.acceptedForLayerScopeOnly !== true) issues.push("source_continuity_not_layer_scope_only");
  if (!appendHashVerified(append, readback)) issues.push("layer_append_readback_not_verified");
  if (append?.nonClaims?.globalCanon !== false) issues.push("append_claims_global_canon");
  if (append?.nonClaims?.productionDurability !== false) issues.push("append_claims_production_durability");
  if (append?.nonClaims?.authority !== false) issues.push("append_claims_authority");
  return issues;
}

function appendHashVerified(append: Record<string, any> | null, readback: Record<string, any> | null): boolean {
  return readback?.sourceAppendRef === append?.appendRef &&
    readback?.sourceAppendHash === append?.appendHash &&
    readback?.appendHashMatches === true;
}

function objectOrNull(value: unknown): Record<string, any> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, any> : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${stableJson(object[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
