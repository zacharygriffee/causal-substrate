import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SEAM_PROOF_INDEX_SCHEMA =
  "causal-substrate/edge-layer-seam-history-public-seam-proof-index/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SEAM_PROOF_INDEX_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-public-seam-proof-index" as const;

export type EdgeLayerSeamHistoryPublicSeamProofIndexStatus =
  | "edge-layer-seam-history-public-seam-proof-index-ready"
  | "edge-layer-seam-history-public-seam-proof-index-incomplete";

export interface EdgeLayerSeamHistoryPublicSeamProofIndex {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SEAM_PROOF_INDEX_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SEAM_PROOF_INDEX_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  runId: string;
  runKind: "device_to_device_public_hyperswarm" | "single_machine_public_hyperswarm" | "unknown_public_hyperswarm";
  indexOperation: {
    indexOnly: true;
    duplicatesArtifactBodies: false;
    artifactPointersOnly: true;
    savedArtifactIndexOnly: true;
  };
  artifactPointers: {
    publicRunDir?: string | undefined;
    sourceManifest?: string | undefined;
    replicaReaderReport?: string | undefined;
    reproducibilityCheck?: string | undefined;
    edgeHandoffBundle?: string | undefined;
    observationToEdgeContract?: string | undefined;
    proofSummaryConsumerReadback?: string | undefined;
    publicSwarmRefreshDecision?: string | undefined;
  };
  indexedArtifacts: Array<{
    role: string;
    path?: string | undefined;
    artifactKind?: string | undefined;
    schema?: string | undefined;
    artifactId?: string | undefined;
    reviewStatus?: string | undefined;
    proofRung?: string | undefined;
    proofLabel?: string | undefined;
  }>;
  preservedRefs: {
    requestIds: string[];
    requestHashes: string[];
    receiptIds: string[];
    receiptHashes: string[];
    sourceRepos: string[];
    durableRefs: string[];
    writerRefs: string[];
  };
  proof: {
    strongestSourceProofRungObserved?: string | undefined;
    strongestSourceProofLabelObserved?: string | undefined;
    indexOperationProofRung: "local_index_over_saved_public_hyperswarm_seam_proof_artifacts";
    savedArtifactIndexOnly: true;
    liveSwarmRunClaimedByThisIndex: false;
    proofRungUpgradeClaimed: false;
  };
  consumerSuitability: {
    edgeMayConsumeAsObservationOnlyIndex: boolean;
    layerMayConsumeAsObservationOnlyFeedbackIndex: boolean;
    spineMayConsumeAsFamilyPressureIndex: boolean;
    projectionStateWritten: false;
    layerEvidenceAdmitted: false;
    canonicalHistoryClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryPublicSeamProofIndexStatus;
    requiredArtifactsPresent: boolean;
    reproducibilityCheckReady: boolean;
    observationToEdgeContractReady: boolean;
    consumerReadbackReady: boolean;
    refreshDecisionReady: boolean;
    sourceRefsPreserved: boolean;
    proofLabelsPreserved: boolean;
    publicSourceProofRungPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noEdgeProjectionWriteClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisIndex: true;
    issues: string[];
  };
  boundary: {
    proofIndexOnly: true;
    readsSavedArtifactsOnly: true;
    opensSwarm: false;
    opensCorestore: false;
    callsEdge: false;
    callsLayer: false;
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
  reviewStatus: EdgeLayerSeamHistoryPublicSeamProofIndexStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryPublicSeamProofIndex(input: {
  runId: string;
  runKind?: EdgeLayerSeamHistoryPublicSeamProofIndex["runKind"] | undefined;
  artifacts: {
    sourceManifest?: unknown;
    replicaReaderReport?: unknown;
    reproducibilityCheck?: unknown;
    edgeHandoffBundle?: unknown;
    observationToEdgeContract?: unknown;
    proofSummaryConsumerReadback?: unknown;
    publicSwarmRefreshDecision?: unknown;
  };
  artifactPointers?: EdgeLayerSeamHistoryPublicSeamProofIndex["artifactPointers"] | undefined;
  emittedAt: string;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryPublicSeamProofIndex {
  const sourceManifest = maybeRecord(input.artifacts.sourceManifest);
  const replicaReaderReport = maybeRecord(input.artifacts.replicaReaderReport);
  const reproducibilityCheck = maybeRecord(input.artifacts.reproducibilityCheck);
  const edgeHandoffBundle = maybeRecord(input.artifacts.edgeHandoffBundle);
  const observationToEdgeContract = maybeRecord(input.artifacts.observationToEdgeContract);
  const proofSummaryConsumerReadback = maybeRecord(input.artifacts.proofSummaryConsumerReadback);
  const publicSwarmRefreshDecision = maybeRecord(input.artifacts.publicSwarmRefreshDecision);
  const reproProof = maybeRecord(reproducibilityCheck?.proof);
  const contractValidation = maybeRecord(observationToEdgeContract?.validation);
  const contractRefs = maybeRecord(observationToEdgeContract?.preservedRefs);
  const consumerValidation = maybeRecord(proofSummaryConsumerReadback?.validation);
  const refreshDecisionValidation = maybeRecord(publicSwarmRefreshDecision?.validation);
  const issues: string[] = [];

  const requiredArtifactsPresent = [
    sourceManifest,
    replicaReaderReport,
    reproducibilityCheck,
    edgeHandoffBundle,
    observationToEdgeContract,
    proofSummaryConsumerReadback,
    publicSwarmRefreshDecision,
  ].every((artifact) => artifact !== undefined);
  const reproducibilityCheckReady =
    reproducibilityCheck?.reviewStatus === "edge-layer-seam-history-public-artifacts-reproducible";
  const observationToEdgeContractReady =
    observationToEdgeContract?.reviewStatus === "edge-layer-seam-history-observation-to-edge-projection-contract-ready";
  const consumerReadbackReady =
    proofSummaryConsumerReadback?.reviewStatus === "edge-layer-seam-history-proof-summary-consumer-readback-ready";
  const refreshDecisionReady =
    publicSwarmRefreshDecision?.reviewStatus === "edge-layer-seam-history-public-swarm-refresh-decision-ready";
  const sourceRefsPreserved =
    contractValidation?.sourceRefsMatchBetweenCausalAndEdge === true &&
    consumerValidation?.sourceRefsPreservedWhenPresent === true &&
    refreshDecisionValidation?.sourceRefsPreserved === true &&
    nonEmptyStrings(contractRefs?.requestIds).length > 0 &&
    nonEmptyStrings(contractRefs?.requestHashes).length > 0 &&
    nonEmptyStrings(contractRefs?.receiptIds).length > 0 &&
    nonEmptyStrings(contractRefs?.receiptHashes).length > 0;
  const proofLabelsPreserved =
    reproProof?.strongestSourceProofLabelObserved === "public_hyperswarm_durable_seam_history_material" &&
    contractValidation?.proofLabelsPreserved === true &&
    consumerValidation?.sourceProofLabelsPreserved === true;
  const publicSourceProofRungPreserved =
    reproProof?.strongestSourceProofRungObserved ===
      "public_hyperswarm_replicated_durable_seam_history_observation" &&
    contractValidation?.publicSourceProofRungPreserved === true &&
    refreshDecisionValidation?.publicSourceProofRungPreserved === true;

  if (!requiredArtifactsPresent) issues.push("required-index-artifacts-missing");
  if (!reproducibilityCheckReady) issues.push("reproducibility-check-not-ready");
  if (!observationToEdgeContractReady) issues.push("observation-to-edge-contract-not-ready");
  if (!consumerReadbackReady) issues.push("proof-summary-consumer-readback-not-ready");
  if (!refreshDecisionReady) issues.push("public-swarm-refresh-decision-not-ready");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!proofLabelsPreserved) issues.push("proof-labels-not-preserved");
  if (!publicSourceProofRungPreserved) issues.push("public-source-proof-rung-not-preserved");
  if (
    hasOverclaim(reproducibilityCheck) ||
    hasOverclaim(edgeHandoffBundle) ||
    hasOverclaim(observationToEdgeContract) ||
    hasOverclaim(proofSummaryConsumerReadback) ||
    hasOverclaim(publicSwarmRefreshDecision)
  ) {
    issues.push("indexed-artifact-overclaim");
  }

  const status: EdgeLayerSeamHistoryPublicSeamProofIndexStatus = issues.length === 0
    ? "edge-layer-seam-history-public-seam-proof-index-ready"
    : "edge-layer-seam-history-public-seam-proof-index-incomplete";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-public-seam-proof-index:${hash(stableJson({
      emittedAt: input.emittedAt,
      runId: input.runId,
      artifactPointers: input.artifactPointers ?? {},
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SEAM_PROOF_INDEX_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SEAM_PROOF_INDEX_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    runId: input.runId,
    runKind: input.runKind ?? "unknown_public_hyperswarm",
    indexOperation: {
      indexOnly: true,
      duplicatesArtifactBodies: false,
      artifactPointersOnly: true,
      savedArtifactIndexOnly: true,
    },
    artifactPointers: { ...(input.artifactPointers ?? {}) },
    indexedArtifacts: [
      summarizeArtifact("public_source_manifest", sourceManifest, input.artifactPointers?.sourceManifest),
      summarizeArtifact("public_replica_reader_report", replicaReaderReport, input.artifactPointers?.replicaReaderReport),
      summarizeArtifact("public_artifact_reproducibility_check", reproducibilityCheck, input.artifactPointers?.reproducibilityCheck),
      summarizeArtifact("edge_handoff_bundle", edgeHandoffBundle, input.artifactPointers?.edgeHandoffBundle),
      summarizeArtifact(
        "observation_to_edge_projection_contract",
        observationToEdgeContract,
        input.artifactPointers?.observationToEdgeContract,
      ),
      summarizeArtifact(
        "proof_summary_consumer_readback",
        proofSummaryConsumerReadback,
        input.artifactPointers?.proofSummaryConsumerReadback,
      ),
      summarizeArtifact(
        "public_swarm_refresh_decision",
        publicSwarmRefreshDecision,
        input.artifactPointers?.publicSwarmRefreshDecision,
      ),
    ],
    preservedRefs: {
      requestIds: nonEmptyStrings(contractRefs?.requestIds),
      requestHashes: nonEmptyStrings(contractRefs?.requestHashes),
      receiptIds: nonEmptyStrings(contractRefs?.receiptIds),
      receiptHashes: nonEmptyStrings(contractRefs?.receiptHashes),
      sourceRepos: nonEmptyStrings(contractRefs?.sourceRepos),
      durableRefs: nonEmptyStrings(contractRefs?.durableRefs),
      writerRefs: nonEmptyStrings(contractRefs?.writerRefs),
    },
    proof: {
      ...(typeof reproProof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: reproProof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof reproProof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: reproProof.strongestSourceProofLabelObserved }
        : {}),
      indexOperationProofRung: "local_index_over_saved_public_hyperswarm_seam_proof_artifacts",
      savedArtifactIndexOnly: true,
      liveSwarmRunClaimedByThisIndex: false,
      proofRungUpgradeClaimed: false,
    },
    consumerSuitability: {
      edgeMayConsumeAsObservationOnlyIndex: status === "edge-layer-seam-history-public-seam-proof-index-ready",
      layerMayConsumeAsObservationOnlyFeedbackIndex: status === "edge-layer-seam-history-public-seam-proof-index-ready",
      spineMayConsumeAsFamilyPressureIndex: status === "edge-layer-seam-history-public-seam-proof-index-ready",
      projectionStateWritten: false,
      layerEvidenceAdmitted: false,
      canonicalHistoryClaimed: false,
    },
    validation: {
      status,
      requiredArtifactsPresent,
      reproducibilityCheckReady,
      observationToEdgeContractReady,
      consumerReadbackReady,
      refreshDecisionReady,
      sourceRefsPreserved,
      proofLabelsPreserved,
      publicSourceProofRungPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noEdgeProjectionWriteClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisIndex: true,
      issues,
    },
    boundary: {
      proofIndexOnly: true,
      readsSavedArtifactsOnly: true,
      opensSwarm: false,
      opensCorestore: false,
      callsEdge: false,
      callsLayer: false,
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
    reviewStatus: status,
    warnings: [
      "public-seam-proof-index-points-at-saved-artifacts-only",
      "public-seam-proof-index-does-not-duplicate-artifact-bodies",
      "public-seam-proof-index-does-not-upgrade-public-swarm-proof",
    ],
    rejections: status === "edge-layer-seam-history-public-seam-proof-index-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryPublicSeamProofIndex(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryPublicSeamProofIndex {
  const candidate = assertObject(value, "edge layer seam history public seam proof index");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SEAM_PROOF_INDEX_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SEAM_PROOF_INDEX_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  assertString(candidate.runId, "runId");
  const indexOperation = assertObject(candidate.indexOperation, "indexOperation");
  assertEqual(indexOperation.indexOnly, true, "indexOperation.indexOnly");
  assertEqual(indexOperation.duplicatesArtifactBodies, false, "indexOperation.duplicatesArtifactBodies");
  assertEqual(indexOperation.artifactPointersOnly, true, "indexOperation.artifactPointersOnly");
  assertEqual(indexOperation.savedArtifactIndexOnly, true, "indexOperation.savedArtifactIndexOnly");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.indexOperationProofRung,
    "local_index_over_saved_public_hyperswarm_seam_proof_artifacts",
    "proof.indexOperationProofRung",
  );
  assertEqual(proof.savedArtifactIndexOnly, true, "proof.savedArtifactIndexOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisIndex, false, "proof.liveSwarmRunClaimedByThisIndex");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const consumerSuitability = assertObject(candidate.consumerSuitability, "consumerSuitability");
  assertEqual(consumerSuitability.projectionStateWritten, false, "consumerSuitability.projectionStateWritten");
  assertEqual(consumerSuitability.layerEvidenceAdmitted, false, "consumerSuitability.layerEvidenceAdmitted");
  assertEqual(consumerSuitability.canonicalHistoryClaimed, false, "consumerSuitability.canonicalHistoryClaimed");
  const validation = assertObject(candidate.validation, "validation");
  assertIndexStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noEdgeProjectionWriteClaim, true, "validation.noEdgeProjectionWriteClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisIndex, true, "validation.noLiveSwarmClaimByThisIndex");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.proofIndexOnly, true, "boundary.proofIndexOnly");
  assertEqual(boundary.readsSavedArtifactsOnly, true, "boundary.readsSavedArtifactsOnly");
  for (const key of [
    "opensSwarm",
    "opensCorestore",
    "callsEdge",
    "callsLayer",
    "writesEdgeProjection",
    "writesLayerEvidence",
    "acceptsCanonicalHistory",
    "admitsLayerEvidence",
    "decidesLayerAdmission",
    "interpretsRbc",
    "grantsAuthority",
    "publishesToMesh",
    "writesProductionContinuity",
  ]) {
    assertEqual(boundary[key], false, `boundary.${key}`);
  }
  assertIndexStatus(candidate.reviewStatus, "reviewStatus");
}

function summarizeArtifact(
  role: string,
  artifact: Record<string, unknown> | undefined,
  artifactPath: string | undefined,
): EdgeLayerSeamHistoryPublicSeamProofIndex["indexedArtifacts"][number] {
  const proof = maybeRecord(artifact?.proof);
  const observationProof = maybeRecord(maybeRecord(artifact?.observationResult)?.proof);
  const sourceSummary = maybeRecord(artifact?.sourceSummary);
  const validation = maybeRecord(artifact?.validation);
  return {
    role,
    ...(artifactPath ? { path: artifactPath } : {}),
    ...(typeof artifact?.artifactKind === "string" ? { artifactKind: artifact.artifactKind } : {}),
    ...(typeof artifact?.schema === "string" ? { schema: artifact.schema } : {}),
    ...(typeof artifact?.artifactId === "string" ? { artifactId: artifact.artifactId } : {}),
    ...(typeof artifact?.reviewStatus === "string" ? { reviewStatus: artifact.reviewStatus } : {}),
    ...(typeof proof?.strongestSourceProofRungObserved === "string"
      ? { proofRung: proof.strongestSourceProofRungObserved }
      : {}),
    ...(typeof proof?.strongestProofRung === "string" ? { proofRung: proof.strongestProofRung } : {}),
    ...(typeof observationProof?.strongestProofRung === "string"
      ? { proofRung: observationProof.strongestProofRung }
      : {}),
    ...(typeof sourceSummary?.strongestSourceProofRungObserved === "string"
      ? { proofRung: sourceSummary.strongestSourceProofRungObserved }
      : {}),
    ...(typeof proof?.strongestSourceProofLabelObserved === "string"
      ? { proofLabel: proof.strongestSourceProofLabelObserved }
      : {}),
    ...(typeof proof?.normalizedProofLabel === "string" ? { proofLabel: proof.normalizedProofLabel } : {}),
    ...(typeof observationProof?.normalizedProofLabel === "string"
      ? { proofLabel: observationProof.normalizedProofLabel }
      : {}),
    ...(typeof validation?.status === "string" && typeof artifact?.reviewStatus !== "string"
      ? { reviewStatus: validation.status }
      : {}),
  };
}

function hasOverclaim(value: Record<string, unknown> | undefined): boolean {
  const boundary = maybeRecord(value?.boundary);
  if (!boundary) return false;
  return [
    "opensSwarm",
    "opensCorestore",
    "runsPublicRefresh",
    "callsEdge",
    "callsLayer",
    "writesEdgeProjection",
    "writesEdgeState",
    "writesLayerEvidence",
    "acceptsCanonicalHistory",
    "admitsLayerEvidence",
    "decidesLayerAdmission",
    "interpretsRbc",
    "grantsAuthority",
    "publishesToMesh",
    "writesProductionContinuity",
  ].some((key) => boundary[key] === true);
}

function maybeRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function nonEmptyStrings(value: unknown): string[] {
  return (Array.isArray(value) ? value : []).filter((entry): entry is string =>
    typeof entry === "string" && entry.trim() !== ""
  );
}

function assertObject(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) throw new Error(`${label} must be ${String(expected)}`);
}

function assertString(value: unknown, label: string): void {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label} must be a non-empty string`);
}

function assertIndexStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryPublicSeamProofIndexStatus {
  if (
    value !== "edge-layer-seam-history-public-seam-proof-index-ready" &&
    value !== "edge-layer-seam-history-public-seam-proof-index-incomplete"
  ) {
    throw new Error(`${label} must be a public seam proof index status`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
