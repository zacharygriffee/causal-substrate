import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_CONSUMER_READBACK_SCHEMA =
  "causal-substrate/edge-layer-seam-history-proof-summary-consumer-readback/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_CONSUMER_READBACK_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-proof-summary-consumer-readback" as const;

export type EdgeLayerSeamHistoryProofSummaryConsumerReadbackStatus =
  | "edge-layer-seam-history-proof-summary-consumer-readback-ready"
  | "edge-layer-seam-history-proof-summary-consumer-readback-incomplete";

export interface EdgeLayerSeamHistoryProofSummaryConsumerReadback {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_CONSUMER_READBACK_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_CONSUMER_READBACK_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    proofSummary?: string | undefined;
    observationToEdgeContract?: string | undefined;
  };
  sourceSummary: {
    artifactId?: string | undefined;
    reviewStatus?: string | undefined;
    strongestSourceProofRungObserved?: string | undefined;
    strongestSourceProofLabelObserved?: string | undefined;
    summaryOperationProofRung?: string | undefined;
    publicHyperswarmProofObservedInSourceArtifacts: boolean;
  };
  consumerReadback: {
    spineMayConsumeAsFamilyPressureSignal: boolean;
    edgeMayConsumeAsObservationOnlyProjectionContext: boolean;
    sourceProofRungPreservedForConsumers: boolean;
    savedArtifactReadbackOnly: true;
    doesNotUpgradeSavedImports: true;
    edgeContractObserved: boolean;
    sourceRefsAvailableFromEdgeContract: boolean;
  };
  preservedRefs: {
    requestIds: string[];
    requestHashes: string[];
    receiptIds: string[];
    receiptHashes: string[];
    sourceRepos: string[];
  };
  proof: {
    strongestSourceProofRungObserved?: string | undefined;
    strongestSourceProofLabelObserved?: string | undefined;
    consumerReadbackOperationProofRung:
      "local_consumer_readback_over_saved_edge_layer_seam_history_proof_summary";
    savedArtifactReadbackOnly: true;
    liveSwarmRunClaimedByThisReadback: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryProofSummaryConsumerReadbackStatus;
    proofSummaryReady: boolean;
    summaryOperationLowerProof: boolean;
    sourceProofLabelsPreserved: boolean;
    edgeContractReadyWhenPresent: boolean;
    sourceRefsPreservedWhenPresent: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noEdgeProjectionWriteClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisReadback: true;
    issues: string[];
  };
  boundary: {
    consumerReadbackOnly: true;
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
  reviewStatus: EdgeLayerSeamHistoryProofSummaryConsumerReadbackStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryProofSummaryConsumerReadback(input: {
  proofSummary: unknown;
  observationToEdgeContract?: unknown;
  emittedAt: string;
  sourcePaths?: EdgeLayerSeamHistoryProofSummaryConsumerReadback["sourcePaths"] | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryProofSummaryConsumerReadback {
  const proofSummary = maybeRecord(input.proofSummary);
  const summary = maybeRecord(proofSummary?.summary);
  const contract = maybeRecord(input.observationToEdgeContract);
  const contractRefs = maybeRecord(contract?.preservedRefs);
  const contractValidation = maybeRecord(contract?.validation);
  const issues: string[] = [];

  const proofSummaryReady = proofSummary?.reviewStatus === "edge-layer-seam-history-proof-summary-ready";
  const summaryOperationLowerProof =
    summary?.strongestProofRungProvenByThisOperation ===
      "local_causal_summary_over_supplied_edge_layer_seam_history_artifacts" &&
    summary?.proofRungUpgradeClaimed === false;
  const sourceProofLabelsPreserved =
    summary?.sourceProofLabelsPreserved === true &&
    typeof summary?.strongestSourceProofRungObserved === "string" &&
    typeof summary?.strongestSourceProofLabelObserved === "string";
  const edgeContractPresent = contract !== undefined;
  const edgeContractReadyWhenPresent =
    !edgeContractPresent ||
    contract?.reviewStatus === "edge-layer-seam-history-observation-to-edge-projection-contract-ready";
  const sourceRefsPreservedWhenPresent =
    !edgeContractPresent ||
    contractValidation?.sourceRefsMatchBetweenCausalAndEdge === true &&
      nonEmptyStrings(contractRefs?.requestIds).length > 0 &&
      nonEmptyStrings(contractRefs?.requestHashes).length > 0 &&
      nonEmptyStrings(contractRefs?.receiptIds).length > 0 &&
      nonEmptyStrings(contractRefs?.receiptHashes).length > 0;

  if (!proofSummaryReady) issues.push("proof-summary-not-ready");
  if (!summaryOperationLowerProof) issues.push("summary-operation-proof-rung-not-lower");
  if (!sourceProofLabelsPreserved) issues.push("source-proof-labels-not-preserved");
  if (!edgeContractReadyWhenPresent) issues.push("edge-contract-not-ready");
  if (!sourceRefsPreservedWhenPresent) issues.push("edge-contract-source-refs-not-preserved");
  if (hasOverclaim(proofSummary) || hasOverclaim(contract)) issues.push("consumer-readback-source-overclaim");

  const status: EdgeLayerSeamHistoryProofSummaryConsumerReadbackStatus = issues.length === 0
    ? "edge-layer-seam-history-proof-summary-consumer-readback-ready"
    : "edge-layer-seam-history-proof-summary-consumer-readback-incomplete";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-proof-summary-consumer-readback:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      summaryArtifactId: proofSummary?.artifactId,
      contractArtifactId: contract?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_CONSUMER_READBACK_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_CONSUMER_READBACK_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    sourceSummary: {
      ...(typeof proofSummary?.artifactId === "string" ? { artifactId: proofSummary.artifactId } : {}),
      ...(typeof proofSummary?.reviewStatus === "string" ? { reviewStatus: proofSummary.reviewStatus } : {}),
      ...(typeof summary?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: summary.strongestSourceProofRungObserved }
        : {}),
      ...(typeof summary?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: summary.strongestSourceProofLabelObserved }
        : {}),
      ...(typeof summary?.strongestProofRungProvenByThisOperation === "string"
        ? { summaryOperationProofRung: summary.strongestProofRungProvenByThisOperation }
        : {}),
      publicHyperswarmProofObservedInSourceArtifacts:
        summary?.publicHyperswarmProofObservedInSourceArtifacts === true,
    },
    consumerReadback: {
      spineMayConsumeAsFamilyPressureSignal: proofSummaryReady && sourceProofLabelsPreserved,
      edgeMayConsumeAsObservationOnlyProjectionContext: edgeContractPresent && sourceRefsPreservedWhenPresent,
      sourceProofRungPreservedForConsumers: sourceProofLabelsPreserved,
      savedArtifactReadbackOnly: true,
      doesNotUpgradeSavedImports: true,
      edgeContractObserved: edgeContractPresent,
      sourceRefsAvailableFromEdgeContract: edgeContractPresent && sourceRefsPreservedWhenPresent,
    },
    preservedRefs: {
      requestIds: nonEmptyStrings(contractRefs?.requestIds),
      requestHashes: nonEmptyStrings(contractRefs?.requestHashes),
      receiptIds: nonEmptyStrings(contractRefs?.receiptIds),
      receiptHashes: nonEmptyStrings(contractRefs?.receiptHashes),
      sourceRepos: nonEmptyStrings(contractRefs?.sourceRepos),
    },
    proof: {
      ...(typeof summary?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: summary.strongestSourceProofRungObserved }
        : {}),
      ...(typeof summary?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: summary.strongestSourceProofLabelObserved }
        : {}),
      consumerReadbackOperationProofRung:
        "local_consumer_readback_over_saved_edge_layer_seam_history_proof_summary",
      savedArtifactReadbackOnly: true,
      liveSwarmRunClaimedByThisReadback: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      proofSummaryReady,
      summaryOperationLowerProof,
      sourceProofLabelsPreserved,
      edgeContractReadyWhenPresent,
      sourceRefsPreservedWhenPresent,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noEdgeProjectionWriteClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisReadback: true,
      issues,
    },
    boundary: {
      consumerReadbackOnly: true,
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
      "proof-summary-consumer-readback-reads-saved-artifacts-only",
      "proof-summary-consumer-readback-does-not-upgrade-source-proof",
      "proof-summary-consumer-readback-does-not-write-edge-projection",
    ],
    rejections: status === "edge-layer-seam-history-proof-summary-consumer-readback-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryProofSummaryConsumerReadback(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryProofSummaryConsumerReadback {
  const candidate = assertObject(value, "edge layer seam history proof summary consumer readback");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_CONSUMER_READBACK_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PROOF_SUMMARY_CONSUMER_READBACK_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.consumerReadbackOperationProofRung,
    "local_consumer_readback_over_saved_edge_layer_seam_history_proof_summary",
    "proof.consumerReadbackOperationProofRung",
  );
  assertEqual(proof.savedArtifactReadbackOnly, true, "proof.savedArtifactReadbackOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisReadback, false, "proof.liveSwarmRunClaimedByThisReadback");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.consumerReadbackOnly, true, "boundary.consumerReadbackOnly");
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
  const validation = assertObject(candidate.validation, "validation");
  assertReadbackStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noEdgeProjectionWriteClaim, true, "validation.noEdgeProjectionWriteClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisReadback, true, "validation.noLiveSwarmClaimByThisReadback");
  assertReadbackStatus(candidate.reviewStatus, "reviewStatus");
}

function hasOverclaim(value: Record<string, unknown> | undefined): boolean {
  const boundary = maybeRecord(value?.boundary);
  if (!boundary) return false;
  return [
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

function assertReadbackStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryProofSummaryConsumerReadbackStatus {
  if (
    value !== "edge-layer-seam-history-proof-summary-consumer-readback-ready" &&
    value !== "edge-layer-seam-history-proof-summary-consumer-readback-incomplete"
  ) {
    throw new Error(`${label} must be a proof summary consumer readback status`);
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
