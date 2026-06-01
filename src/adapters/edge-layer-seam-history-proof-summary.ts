import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_SCHEMA =
  "causal-substrate/edge-layer-seam-history-proof-summary/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-proof-summary" as const;

export type EdgeLayerSeamHistoryProofSummaryStatus =
  | "edge-layer-seam-history-proof-summary-ready"
  | "edge-layer-seam-history-proof-summary-incomplete";

export interface EdgeLayerSeamHistoryProofSummaryInputArtifactRef {
  artifactKind?: string | undefined;
  schema?: string | undefined;
  artifactId?: string | undefined;
  reviewStatus?: string | undefined;
  sourcePath?: string | undefined;
  proofRung?: string | undefined;
  proofLabel?: string | undefined;
}

export interface EdgeLayerSeamHistoryProofSummary {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  inputs: {
    artifactCount: number;
    artifacts: EdgeLayerSeamHistoryProofSummaryInputArtifactRef[];
  };
  summary: {
    strongestSourceProofRungObserved?: string | undefined;
    strongestSourceProofLabelObserved?: string | undefined;
    sourceProofLabelsObserved: string[];
    publicHyperswarmProofObservedInSourceArtifacts: boolean;
    strongestProofRungProvenByThisOperation:
      "local_causal_summary_over_supplied_edge_layer_seam_history_artifacts";
    proofRungUpgradeClaimed: false;
    sourceProofLabelsPreserved: boolean;
  };
  boundary: {
    summaryOnly: true;
    readsSuppliedArtifactsOnly: true;
    opensSwarm: false;
    opensCorestore: false;
    writesEdgeProjection: false;
    writesLayerEvidence: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    decidesLayerAdmission: false;
    interpretsRbc: false;
    grantsAuthority: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryProofSummaryStatus;
    artifactsConsumed: boolean;
    sourceProofLabelsPreserved: boolean;
    noProofUpgradeClaim: true;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryProofSummaryStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryProofSummary(input: {
  artifacts: unknown[];
  emittedAt: string;
  sourcePaths?: string[] | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryProofSummary {
  const artifacts = input.artifacts.map((artifact, index) =>
    summarizeArtifact(artifact, input.sourcePaths?.[index])
  );
  const labels = uniqueStrings(artifacts.map((artifact) => artifact.proofLabel));
  const strongest = strongestProofArtifact(artifacts);
  const issues: string[] = [];
  if (artifacts.length === 0) issues.push("summary-input-artifacts-missing");
  if (labels.length === 0) issues.push("source-proof-labels-missing");
  const status: EdgeLayerSeamHistoryProofSummaryStatus = issues.length === 0
    ? "edge-layer-seam-history-proof-summary-ready"
    : "edge-layer-seam-history-proof-summary-incomplete";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-proof-summary:${hash(stableJson({
      emittedAt: input.emittedAt,
      artifacts,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    inputs: {
      artifactCount: artifacts.length,
      artifacts,
    },
    summary: {
      ...(strongest?.proofRung ? { strongestSourceProofRungObserved: strongest.proofRung } : {}),
      ...(strongest?.proofLabel ? { strongestSourceProofLabelObserved: strongest.proofLabel } : {}),
      sourceProofLabelsObserved: labels,
      publicHyperswarmProofObservedInSourceArtifacts: artifacts.some((artifact) =>
        artifact.proofRung === "public_hyperswarm_replicated_durable_seam_history_observation" ||
        artifact.proofLabel === "public_hyperswarm_durable_seam_history_material"
      ),
      strongestProofRungProvenByThisOperation:
        "local_causal_summary_over_supplied_edge_layer_seam_history_artifacts",
      proofRungUpgradeClaimed: false,
      sourceProofLabelsPreserved: labels.length > 0,
    },
    boundary: {
      summaryOnly: true,
      readsSuppliedArtifactsOnly: true,
      opensSwarm: false,
      opensCorestore: false,
      writesEdgeProjection: false,
      writesLayerEvidence: false,
      acceptsCanonicalHistory: false,
      admitsLayerEvidence: false,
      decidesLayerAdmission: false,
      interpretsRbc: false,
      grantsAuthority: false,
      publishesToMesh: false,
      writesProductionContinuity: false,
    },
    validation: {
      status,
      artifactsConsumed: artifacts.length > 0,
      sourceProofLabelsPreserved: labels.length > 0,
      noProofUpgradeClaim: true,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      issues,
    },
    reviewStatus: status,
    warnings: [
      "proof-summary-is-local-import-summary-only",
      "proof-summary-does-not-upgrade-source-proof-rungs",
      "proof-summary-does-not-admit-layer-evidence",
      "proof-summary-does-not-interpret-rbc",
      "proof-summary-does-not-grant-authority",
    ],
    rejections: status === "edge-layer-seam-history-proof-summary-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryProofSummary(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryProofSummary {
  const candidate = assertObject(value, "edge layer seam history proof summary");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const summary = assertObject(candidate.summary, "summary");
  assertEqual(
    summary.strongestProofRungProvenByThisOperation,
    "local_causal_summary_over_supplied_edge_layer_seam_history_artifacts",
    "summary.strongestProofRungProvenByThisOperation",
  );
  assertEqual(summary.proofRungUpgradeClaimed, false, "summary.proofRungUpgradeClaimed");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.summaryOnly, true, "boundary.summaryOnly");
  assertEqual(boundary.readsSuppliedArtifactsOnly, true, "boundary.readsSuppliedArtifactsOnly");
  assertEqual(boundary.opensSwarm, false, "boundary.opensSwarm");
  assertEqual(boundary.opensCorestore, false, "boundary.opensCorestore");
  assertEqual(boundary.writesEdgeProjection, false, "boundary.writesEdgeProjection");
  assertEqual(boundary.writesLayerEvidence, false, "boundary.writesLayerEvidence");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.decidesLayerAdmission, false, "boundary.decidesLayerAdmission");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertProofSummaryStatus(validation.status, "validation.status");
  assertEqual(validation.noProofUpgradeClaim, true, "validation.noProofUpgradeClaim");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertProofSummaryStatus(candidate.reviewStatus, "reviewStatus");
}

function summarizeArtifact(
  value: unknown,
  sourcePath: string | undefined,
): EdgeLayerSeamHistoryProofSummaryInputArtifactRef {
  if (!isRecord(value)) return { ...(sourcePath ? { sourcePath } : {}) };
  const proof = isRecord(value.proof) ? value.proof : {};
  const source = isRecord(value.source) ? value.source : {};
  const validation = isRecord(value.validation) ? value.validation : {};
  return {
    ...(typeof value.artifactKind === "string" ? { artifactKind: value.artifactKind } : {}),
    ...(typeof value.schema === "string" ? { schema: value.schema } : {}),
    ...(typeof value.artifactId === "string" ? { artifactId: value.artifactId } : {}),
    ...(typeof value.reviewStatus === "string" ? { reviewStatus: value.reviewStatus } : {}),
    ...(sourcePath ? { sourcePath } : {}),
    ...(typeof proof.strongestProofRung === "string" ? { proofRung: proof.strongestProofRung } : {}),
    ...(typeof proof.normalizedProofLabel === "string" ? { proofLabel: proof.normalizedProofLabel } : {}),
    ...(typeof source.sourceObservationProofRung === "string" ? { proofRung: source.sourceObservationProofRung } : {}),
    ...(typeof source.sourceObservationNormalizedProofLabel === "string"
      ? { proofLabel: source.sourceObservationNormalizedProofLabel }
      : {}),
    ...(typeof validation.strongestProofRung === "string" ? { proofRung: validation.strongestProofRung } : {}),
    ...(typeof validation.normalizedProofLabel === "string" ? { proofLabel: validation.normalizedProofLabel } : {}),
  };
}

function strongestProofArtifact(
  artifacts: EdgeLayerSeamHistoryProofSummaryInputArtifactRef[],
): EdgeLayerSeamHistoryProofSummaryInputArtifactRef | undefined {
  return [...artifacts].sort((left, right) => proofRank(right) - proofRank(left))[0];
}

function proofRank(artifact: EdgeLayerSeamHistoryProofSummaryInputArtifactRef): number {
  if (artifact.proofRung === "public_hyperswarm_replicated_durable_seam_history_observation") return 4;
  if (artifact.proofLabel === "public_hyperswarm_durable_seam_history_material") return 4;
  if (artifact.proofRung === "dht_hyperswarm_replicated_durable_seam_history_observation") return 3;
  if (artifact.proofLabel === "dht_hyperswarm_durable_seam_history_material") return 3;
  if (artifact.proofRung === "local_causal_observation_over_supplied_edge_layer_observation_artifacts") return 2;
  if (artifact.proofRung === "local_causal_observation_over_supplied_seam_history_material") return 1;
  return artifact.proofLabel ? 1 : 0;
}

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertObject(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertString(value: unknown, label: string): void {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label} must be a non-empty string`);
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) throw new Error(`${label} mismatch`);
}

function assertProofSummaryStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryProofSummaryStatus {
  if (
    value !== "edge-layer-seam-history-proof-summary-ready" &&
    value !== "edge-layer-seam-history-proof-summary-incomplete"
  ) {
    throw new Error(`${label} must be an edge layer seam history proof summary status`);
  }
}
