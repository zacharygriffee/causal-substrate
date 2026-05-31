import { createHash } from "node:crypto";

import {
  assertEdgeLayerSeamHistoryObservationResult,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA,
  type EdgeLayerSeamHistoryNormalizedProofLabel,
  type EdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryProofRung,
} from "./edge-layer-seam-history-observation.js";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_SCHEMA =
  "causal-substrate/edge-layer-seam-history-observation-readback-contract/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-observation-readback-contract" as const;

export type EdgeLayerSeamHistoryObservationReadbackContractStatus =
  | "edge-layer-seam-history-observation-readback-contract-valid"
  | "edge-layer-seam-history-observation-readback-contract-invalid";

export interface EdgeLayerSeamHistoryObservationReadbackContract {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceObservationArtifactId?: string;
    sourceObservationSchema?: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA;
    sourceObservationProofRung?: EdgeLayerSeamHistoryProofRung;
    sourceObservationNormalizedProofLabel?: EdgeLayerSeamHistoryNormalizedProofLabel;
    sourceRepos: string[];
  };
  readback: {
    artifactReadable: boolean;
    observationResultValid: boolean;
    sourceIdsAndHashesPreserved: boolean;
    sourceReposPreserved: boolean;
    durableRefsPreserved: boolean;
    writerRefsPreserved: boolean;
    linkageStatusPreserved: boolean;
    boundaryAndNonClaimsPreserved: boolean;
    proofRungPreserved?: EdgeLayerSeamHistoryProofRung;
    normalizedProofLabelPreserved?: EdgeLayerSeamHistoryNormalizedProofLabel;
    pairCount: number;
    compatiblePairCount: number;
    unresolvedOrDamagedPairCount: number;
  };
  preservedSourceRefs: {
    sourceRepos: string[];
    requestIds: string[];
    requestHashes: string[];
    requestDurableRefs: string[];
    requestWriterRefs: string[];
    receiptIds: string[];
    receiptHashes: string[];
    receiptDurableRefs: string[];
    receiptWriterRefs: string[];
    linkageStatuses: string[];
  };
  boundary: {
    readbackOnly: true;
    writesObservationArtifact: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
    publishesToMesh: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryObservationReadbackContractStatus;
    observationArtifactConsumed: boolean;
    sourceRefsPreserved: boolean;
    sourceReposPreserved: boolean;
    durableRefsPreserved: boolean;
    writerRefsPreserved: boolean;
    linkageStatusPreserved: boolean;
    boundaryAndNonClaimsPreserved: boolean;
    proofLabelsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryObservationReadbackContractStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeLayerSeamHistoryObservationReadbackContractInput {
  observationResult: unknown;
  emittedAt: string;
  artifactId?: string;
}

export function buildEdgeLayerSeamHistoryObservationReadbackContract(
  input: BuildEdgeLayerSeamHistoryObservationReadbackContractInput,
): EdgeLayerSeamHistoryObservationReadbackContract {
  const observationResult = parseObservationResult(input.observationResult);
  const issues = observationResult ? validateObservationResult(observationResult) : ["observation-result-invalid"];
  const sourceRefsPreserved = issues.includes("source-refs-not-preserved") === false &&
    observationResult !== undefined;
  const sourceReposPreserved = issues.includes("source-repos-not-preserved") === false &&
    observationResult !== undefined;
  const durableRefsPreserved = issues.includes("durable-refs-not-preserved") === false &&
    observationResult !== undefined;
  const writerRefsPreserved = issues.includes("writer-refs-not-preserved") === false &&
    observationResult !== undefined;
  const linkageStatusPreserved = issues.includes("linkage-status-not-preserved") === false &&
    observationResult !== undefined;
  const boundaryAndNonClaimsPreserved = issues.includes("observation-boundary-or-non-claims-not-preserved") === false &&
    observationResult !== undefined;
  const proofLabelsPreserved = issues.includes("proof-labels-not-preserved") === false &&
    observationResult !== undefined;
  const status: EdgeLayerSeamHistoryObservationReadbackContractStatus = issues.length === 0
    ? "edge-layer-seam-history-observation-readback-contract-valid"
    : "edge-layer-seam-history-observation-readback-contract-invalid";
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(observationResult ? { sourceObservationArtifactId: observationResult.artifactId } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(observationResult ? { sourceObservationArtifactId: observationResult.artifactId } : {}),
      ...(observationResult ? { sourceObservationSchema: observationResult.schema } : {}),
      ...(observationResult ? { sourceObservationProofRung: observationResult.proof.strongestProofRung } : {}),
      ...(observationResult ? { sourceObservationNormalizedProofLabel: observationResult.proof.normalizedProofLabel } : {}),
      sourceRepos: observationResult?.source.sourceRepos ?? [],
    },
    readback: {
      artifactReadable: observationResult !== undefined,
      observationResultValid: observationResult !== undefined,
      sourceIdsAndHashesPreserved: sourceRefsPreserved,
      sourceReposPreserved,
      durableRefsPreserved,
      writerRefsPreserved,
      linkageStatusPreserved,
      boundaryAndNonClaimsPreserved,
      ...(observationResult ? { proofRungPreserved: observationResult.proof.strongestProofRung } : {}),
      ...(observationResult ? { normalizedProofLabelPreserved: observationResult.proof.normalizedProofLabel } : {}),
      pairCount: observationResult?.validation.pairCount ?? 0,
      compatiblePairCount: observationResult?.validation.compatiblePairCount ?? 0,
      unresolvedOrDamagedPairCount: observationResult?.validation.unresolvedOrDamagedPairCount ?? 0,
    },
    preservedSourceRefs: collectPreservedSourceRefs(observationResult),
    boundary: buildBoundary(),
    validation: {
      status,
      observationArtifactConsumed: observationResult !== undefined,
      sourceRefsPreserved,
      sourceReposPreserved,
      durableRefsPreserved,
      writerRefsPreserved,
      linkageStatusPreserved,
      boundaryAndNonClaimsPreserved,
      proofLabelsPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      issues,
    },
    reviewStatus: status,
    warnings: buildWarnings(status),
    rejections: status === "edge-layer-seam-history-observation-readback-contract-valid" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryObservationReadbackContract(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryObservationReadbackContract {
  const candidate = assertObject(value, "edge layer seam history observation readback contract");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_SCHEMA, "schema");
  assertEqual(
    candidate.schemaVersion,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_READBACK_CONTRACT_SCHEMA_VERSION,
    "schemaVersion",
  );
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.readbackOnly, true, "boundary.readbackOnly");
  assertEqual(boundary.writesObservationArtifact, false, "boundary.writesObservationArtifact");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  const validation = assertObject(candidate.validation, "validation");
  assertStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertStatus(candidate.reviewStatus, "reviewStatus");
  const readback = assertObject(candidate.readback, "readback");
  if (validation.status === "edge-layer-seam-history-observation-readback-contract-valid") {
    assertEqual(validation.observationArtifactConsumed, true, "validation.observationArtifactConsumed");
    assertEqual(validation.sourceRefsPreserved, true, "validation.sourceRefsPreserved");
    assertEqual(validation.sourceReposPreserved, true, "validation.sourceReposPreserved");
    assertEqual(validation.durableRefsPreserved, true, "validation.durableRefsPreserved");
    assertEqual(validation.writerRefsPreserved, true, "validation.writerRefsPreserved");
    assertEqual(validation.linkageStatusPreserved, true, "validation.linkageStatusPreserved");
    assertEqual(validation.boundaryAndNonClaimsPreserved, true, "validation.boundaryAndNonClaimsPreserved");
    assertEqual(validation.proofLabelsPreserved, true, "validation.proofLabelsPreserved");
    assertEqual(readback.artifactReadable, true, "readback.artifactReadable");
    assertEqual(readback.observationResultValid, true, "readback.observationResultValid");
    assertEqual(readback.sourceIdsAndHashesPreserved, true, "readback.sourceIdsAndHashesPreserved");
    assertEqual(readback.sourceReposPreserved, true, "readback.sourceReposPreserved");
    assertEqual(readback.durableRefsPreserved, true, "readback.durableRefsPreserved");
    assertEqual(readback.writerRefsPreserved, true, "readback.writerRefsPreserved");
    assertEqual(readback.linkageStatusPreserved, true, "readback.linkageStatusPreserved");
    assertEqual(readback.boundaryAndNonClaimsPreserved, true, "readback.boundaryAndNonClaimsPreserved");
  }
}

function parseObservationResult(value: unknown): EdgeLayerSeamHistoryObservationResult | undefined {
  try {
    assertEdgeLayerSeamHistoryObservationResult(value);
    return value;
  } catch {
    return undefined;
  }
}

function validateObservationResult(observationResult: EdgeLayerSeamHistoryObservationResult): string[] {
  const issues: string[] = [];
  if (!observationResult.validation.sourceIdsAndHashesPreserved) {
    issues.push("source-refs-not-preserved");
  }
  if (!observationResult.validation.sourceReposPreserved) {
    issues.push("source-repos-not-preserved");
  }
  if (!observationResult.validation.durableRefsPreserved) {
    issues.push("durable-refs-not-preserved");
  }
  if (!observationResult.validation.writerRefsPreserved) {
    issues.push("writer-refs-not-preserved");
  }
  if (!observationResult.validation.linkageStatusPreserved) {
    issues.push("linkage-status-not-preserved");
  }
  if (!observationResult.validation.seamHistoryInputConsumed) {
    issues.push("seam-history-input-not-consumed");
  }
  if (
    !observationResult.boundary.reviewOnly ||
    !observationResult.boundary.observationOnly ||
    observationResult.boundary.acceptsCanonicalHistory ||
    observationResult.boundary.admitsLayerEvidence ||
    observationResult.boundary.interpretsRbc ||
    observationResult.boundary.grantsAuthority ||
    observationResult.nonClaims.canonicalHistoryClaimed ||
    observationResult.nonClaims.layerEvidenceAdmitted ||
    observationResult.nonClaims.rbcInterpreted ||
    observationResult.nonClaims.authorityGranted
  ) {
    issues.push("observation-boundary-or-non-claims-not-preserved");
  }
  if (
    observationResult.validation.strongestProofRung !== observationResult.proof.strongestProofRung ||
    observationResult.validation.normalizedProofLabel !== observationResult.proof.normalizedProofLabel
  ) {
    issues.push("proof-labels-not-preserved");
  }
  return issues;
}

function collectPreservedSourceRefs(
  observationResult: EdgeLayerSeamHistoryObservationResult | undefined,
): EdgeLayerSeamHistoryObservationReadbackContract["preservedSourceRefs"] {
  const observations = observationResult?.observations ?? [];
  return {
    sourceRepos: uniqueStrings(observations.flatMap((observation) => [
      observation.request.sourceRepo,
      observation.receipt.sourceRepo,
    ])),
    requestIds: uniqueStrings(observations.map((observation) => observation.request.id)),
    requestHashes: uniqueStrings(observations.map((observation) => observation.request.hash)),
    requestDurableRefs: uniqueStrings(observations.map((observation) => observation.request.durableRef)),
    requestWriterRefs: uniqueStrings(observations.map((observation) => observation.request.writerRef)),
    receiptIds: uniqueStrings(observations.map((observation) => observation.receipt.id)),
    receiptHashes: uniqueStrings(observations.map((observation) => observation.receipt.hash)),
    receiptDurableRefs: uniqueStrings(observations.map((observation) => observation.receipt.durableRef)),
    receiptWriterRefs: uniqueStrings(observations.map((observation) => observation.receipt.writerRef)),
    linkageStatuses: uniqueStrings(observations.map((observation) => observation.linkageStatus)),
  };
}

function buildBoundary(): EdgeLayerSeamHistoryObservationReadbackContract["boundary"] {
  return {
    readbackOnly: true,
    writesObservationArtifact: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    interpretsRbc: false,
    grantsAuthority: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeLayerSeamHistoryObservationReadbackContractStatus): string[] {
  const warnings = [
    "readback-contract-preserves-observation-source-refs-only",
    "readback-contract-does-not-claim-canonical-history",
    "readback-contract-does-not-admit-layer-evidence",
    "readback-contract-does-not-interpret-rbc",
    "readback-contract-does-not-grant-authority",
  ];
  if (status !== "edge-layer-seam-history-observation-readback-contract-valid") {
    warnings.push("readback-contract-invalid");
  }
  return warnings;
}

function createArtifactId(input: { emittedAt: string; sourceObservationArtifactId?: string }): string {
  return `causal-edge-layer-seam-history-observation-readback-contract:${hash(stableJson(input)).slice(0, 16)}`;
}

type JsonRecord = Record<string, unknown>;

function uniqueStrings(values: unknown[]): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.trim() !== ""))];
}

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

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label} must be ${String(expected)}`);
  }
}

function assertStatus(value: unknown, label: string): asserts value is EdgeLayerSeamHistoryObservationReadbackContractStatus {
  if (
    value !== "edge-layer-seam-history-observation-readback-contract-valid" &&
    value !== "edge-layer-seam-history-observation-readback-contract-invalid"
  ) {
    throw new Error(`${label} must be a readback contract status`);
  }
}

function assertString(value: unknown, label: string): void {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}
