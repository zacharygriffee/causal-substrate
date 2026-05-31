import { createHash } from "node:crypto";

import {
  assertEdgeLayerSeamHistoryObservationResult,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_COMPATIBILITY_ENVELOPE_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA,
  type EdgeLayerSeamHappeningClassification,
  type EdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryProofRung,
  type EdgeLayerSeamHistorySourceRef,
  type EdgeLayerSeamLinkageStatus,
} from "./edge-layer-seam-history-observation.js";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA =
  "causal-substrate/edge-layer-seam-history-edge-projection-fixture/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-edge-projection-fixture" as const;

export type EdgeLayerSeamHistoryEdgeProjectionFixtureStatus =
  | "edge-layer-seam-history-edge-projection-fixture-ready"
  | "edge-layer-seam-history-edge-projection-fixture-incomplete"
  | "edge-layer-seam-history-edge-projection-fixture-malformed";

export interface EdgeLayerSeamHistoryEdgeProjectionRef {
  sourceObservationArtifactId: string;
  sourceObservationProofRung: EdgeLayerSeamHistoryProofRung;
  observationId: string;
  classification: EdgeLayerSeamHappeningClassification;
  linkageStatus: EdgeLayerSeamLinkageStatus;
  request: EdgeLayerSeamHistorySourceRef;
  receipt: EdgeLayerSeamHistorySourceRef;
  sourceRefs: string[];
  causalRole: "edge_projection_input_reference";
  acceptedAsCanonicalHistory: false;
  layerEvidenceAdmitted: false;
  rbcInterpreted: false;
  authorityGranted: false;
  referentPromoted: false;
}

export interface EdgeLayerSeamHistoryEdgeProjectionFixture {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceObservationArtifactId?: string;
    sourceObservationSchema?: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA;
    sourceObservationProofRung?: EdgeLayerSeamHistoryProofRung;
    sourceRepos: string[];
  };
  edgeProjectionMaterial: {
    candidateKind: "edge_projection_seam_history_observation_candidate";
    projectionSource: "causal_substrate_observation_result";
    compatibilityEnvelopeKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_COMPATIBILITY_ENVELOPE_KIND;
    compatibilityBasis: "request_receipt_linkage_only";
    projectionSuitability: "edge_projection_candidate" | "not_edge_projection_ready";
    compatibleRefs: EdgeLayerSeamHistoryEdgeProjectionRef[];
    unresolvedOrDamagedRefs: EdgeLayerSeamHistoryEdgeProjectionRef[];
  };
  boundary: {
    fixtureOnly: true;
    edgeProjectionCandidateOnly: true;
    consumeAsObservationOnly: true;
    opensEdgeRuntime: false;
    callsEdge: false;
    edgeProjectionWritten: false;
    writesContinuityRecords: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryEdgeProjectionFixtureStatus;
    observationResultConsumed: boolean;
    compatibilityEnvelopeConsumed: boolean;
    sourceRefsPreserved: boolean;
    compatibleRefsPresent: boolean;
    unresolvedOrDamagedRefsPresent: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noReferentPromotion: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryEdgeProjectionFixtureStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeLayerSeamHistoryEdgeProjectionFixtureInput {
  observationResult: unknown;
  emittedAt: string;
  artifactId?: string;
}

export function buildEdgeLayerSeamHistoryEdgeProjectionFixture(
  input: BuildEdgeLayerSeamHistoryEdgeProjectionFixtureInput,
): EdgeLayerSeamHistoryEdgeProjectionFixture {
  const observationResult = parseObservationResult(input.observationResult);
  const issues = validateObservationResultForEdgeProjection(observationResult);
  const compatibleRefs = observationResult
    ? collectProjectionRefs(observationResult, "compatible_seam_happening")
    : [];
  const unresolvedOrDamagedRefs = observationResult
    ? collectProjectionRefs(observationResult, "unresolved_or_damaged_seam_happening")
    : [];
  const status = determineStatus(observationResult, issues);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(observationResult ? { sourceObservationArtifactId: observationResult.artifactId } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(observationResult ? { sourceObservationArtifactId: observationResult.artifactId } : {}),
      ...(observationResult ? { sourceObservationSchema: observationResult.schema } : {}),
      ...(observationResult ? { sourceObservationProofRung: observationResult.proof.strongestProofRung } : {}),
      sourceRepos: observationResult?.source.sourceRepos ?? [],
    },
    edgeProjectionMaterial: {
      candidateKind: "edge_projection_seam_history_observation_candidate",
      projectionSource: "causal_substrate_observation_result",
      compatibilityEnvelopeKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_COMPATIBILITY_ENVELOPE_KIND,
      compatibilityBasis: "request_receipt_linkage_only",
      projectionSuitability: observationResult?.compatibilityEnvelope.projectionSuitability ??
        "not_edge_projection_ready",
      compatibleRefs,
      unresolvedOrDamagedRefs,
    },
    boundary: buildBoundary(),
    validation: {
      status,
      observationResultConsumed: observationResult !== undefined,
      compatibilityEnvelopeConsumed: observationResult !== undefined,
      sourceRefsPreserved: issues.includes("source-refs-not-preserved") === false && observationResult !== undefined,
      compatibleRefsPresent: compatibleRefs.length > 0,
      unresolvedOrDamagedRefsPresent: unresolvedOrDamagedRefs.length > 0,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noReferentPromotion: true,
      issues,
    },
    reviewStatus: status,
    warnings: buildWarnings(status),
    rejections: status === "edge-layer-seam-history-edge-projection-fixture-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryEdgeProjectionFixture(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryEdgeProjectionFixture {
  const candidate = assertObject(value, "edge layer seam history edge projection fixture");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA, "schema");
  assertEqual(
    candidate.schemaVersion,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA_VERSION,
    "schemaVersion",
  );
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const material = assertObject(candidate.edgeProjectionMaterial, "edgeProjectionMaterial");
  assertEqual(
    material.candidateKind,
    "edge_projection_seam_history_observation_candidate",
    "edgeProjectionMaterial.candidateKind",
  );
  assertEqual(
    material.projectionSource,
    "causal_substrate_observation_result",
    "edgeProjectionMaterial.projectionSource",
  );
  assertEqual(
    material.compatibilityEnvelopeKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_COMPATIBILITY_ENVELOPE_KIND,
    "edgeProjectionMaterial.compatibilityEnvelopeKind",
  );
  assertEqual(material.compatibilityBasis, "request_receipt_linkage_only", "edgeProjectionMaterial.compatibilityBasis");
  assertProjectionRefs(arrayRecords(material.compatibleRefs), "edgeProjectionMaterial.compatibleRefs");
  assertProjectionRefs(
    arrayRecords(material.unresolvedOrDamagedRefs),
    "edgeProjectionMaterial.unresolvedOrDamagedRefs",
  );
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.fixtureOnly, true, "boundary.fixtureOnly");
  assertEqual(boundary.edgeProjectionCandidateOnly, true, "boundary.edgeProjectionCandidateOnly");
  assertEqual(boundary.consumeAsObservationOnly, true, "boundary.consumeAsObservationOnly");
  assertEqual(boundary.opensEdgeRuntime, false, "boundary.opensEdgeRuntime");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.edgeProjectionWritten, false, "boundary.edgeProjectionWritten");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  const validation = assertObject(candidate.validation, "validation");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noReferentPromotion, true, "validation.noReferentPromotion");
}

function parseObservationResult(value: unknown): EdgeLayerSeamHistoryObservationResult | undefined {
  try {
    assertEdgeLayerSeamHistoryObservationResult(value);
    return value;
  } catch {
    return undefined;
  }
}

function validateObservationResultForEdgeProjection(
  observationResult: EdgeLayerSeamHistoryObservationResult | undefined,
): string[] {
  const issues: string[] = [];
  if (!observationResult) return ["observation-result-invalid"];
  if (observationResult.compatibilityEnvelope.projectionSuitability !== "edge_projection_candidate") {
    issues.push("observation-not-edge-projection-candidate");
  }
  if (!observationResult.compatibilityEnvelope.sourceReferenceContract.sourceRefsPreserved) {
    issues.push("source-refs-not-preserved");
  }
  if (!observationResult.compatibilityEnvelope.classificationSummary.linkedPairDetected) {
    issues.push("compatible-seam-happening-missing");
  }
  if (!observationResult.compatibilityEnvelope.classificationSummary.damagedOrUnlinkedPairDetected) {
    issues.push("unresolved-or-damaged-seam-happening-missing");
  }
  if (!observationResult.validation.noCanonicalHistoryClaim) issues.push("canonical-history-overclaim");
  if (!observationResult.validation.noLayerAdmissionClaim) issues.push("layer-admission-overclaim");
  if (!observationResult.validation.noRbcInterpretationClaim) issues.push("rbc-interpretation-overclaim");
  if (!observationResult.validation.noAuthorityClaim) issues.push("authority-overclaim");
  return [...new Set(issues)];
}

function collectProjectionRefs(
  observationResult: EdgeLayerSeamHistoryObservationResult,
  classification: EdgeLayerSeamHappeningClassification,
): EdgeLayerSeamHistoryEdgeProjectionRef[] {
  return observationResult.observations
    .filter((observation) => observation.classification === classification)
    .map((observation) => ({
      sourceObservationArtifactId: observationResult.artifactId,
      sourceObservationProofRung: observationResult.proof.strongestProofRung,
      observationId: observation.observationId,
      classification: observation.classification,
      linkageStatus: observation.linkageStatus,
      request: observation.request,
      receipt: observation.receipt,
      sourceRefs: observation.sourceRefs,
      causalRole: "edge_projection_input_reference",
      acceptedAsCanonicalHistory: false,
      layerEvidenceAdmitted: false,
      rbcInterpreted: false,
      authorityGranted: false,
      referentPromoted: false,
    }));
}

function determineStatus(
  observationResult: EdgeLayerSeamHistoryObservationResult | undefined,
  issues: string[],
): EdgeLayerSeamHistoryEdgeProjectionFixtureStatus {
  if (!observationResult) return "edge-layer-seam-history-edge-projection-fixture-malformed";
  return issues.length === 0
    ? "edge-layer-seam-history-edge-projection-fixture-ready"
    : "edge-layer-seam-history-edge-projection-fixture-incomplete";
}

function buildBoundary(): EdgeLayerSeamHistoryEdgeProjectionFixture["boundary"] {
  return {
    fixtureOnly: true,
    edgeProjectionCandidateOnly: true,
    consumeAsObservationOnly: true,
    opensEdgeRuntime: false,
    callsEdge: false,
    edgeProjectionWritten: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    interpretsRbc: false,
    grantsAuthority: false,
    promotesReferents: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeLayerSeamHistoryEdgeProjectionFixtureStatus): string[] {
  const warnings = [
    "edge-projection-fixture-is-derived-from-causal-observation-result",
    "edge-projection-fixture-does-not-write-edge-projection-records",
    "edge-projection-fixture-does-not-promote-referents",
    "edge-projection-fixture-does-not-claim-canonical-history",
    "edge-projection-fixture-does-not-admit-layer-evidence",
    "edge-projection-fixture-does-not-interpret-rbc",
    "edge-projection-fixture-does-not-grant-authority",
  ];
  if (status !== "edge-layer-seam-history-edge-projection-fixture-ready") {
    warnings.push("edge-projection-fixture-not-ready");
  }
  return warnings;
}

function assertProjectionRefs(refs: JsonRecord[], label: string): void {
  refs.forEach((ref, index) => {
    assertEqual(
      ref.acceptedAsCanonicalHistory,
      false,
      `${label}[${index}].acceptedAsCanonicalHistory`,
    );
    assertEqual(ref.layerEvidenceAdmitted, false, `${label}[${index}].layerEvidenceAdmitted`);
    assertEqual(ref.rbcInterpreted, false, `${label}[${index}].rbcInterpreted`);
    assertEqual(ref.authorityGranted, false, `${label}[${index}].authorityGranted`);
    assertEqual(ref.referentPromoted, false, `${label}[${index}].referentPromoted`);
  });
}

function createArtifactId(input: { emittedAt: string; sourceObservationArtifactId?: string }): string {
  return `causal-edge-layer-seam-history-edge-projection-fixture:${hash(stableJson(input)).slice(0, 16)}`;
}

type JsonRecord = Record<string, unknown>;

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (isRecord(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function arrayRecords(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label} must be ${String(expected)}`);
  }
}

function assertString(value: unknown, label: string): void {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}
