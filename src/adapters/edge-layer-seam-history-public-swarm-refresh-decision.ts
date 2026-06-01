import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SWARM_REFRESH_DECISION_SCHEMA =
  "causal-substrate/edge-layer-seam-history-public-swarm-refresh-decision/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SWARM_REFRESH_DECISION_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-public-swarm-refresh-decision" as const;

export type EdgeLayerSeamHistoryPublicSwarmRefreshDecisionStatus =
  | "edge-layer-seam-history-public-swarm-refresh-decision-ready"
  | "edge-layer-seam-history-public-swarm-refresh-decision-incomplete";

export type EdgeLayerSeamHistoryPublicSwarmRefreshDecision =
  | "not_required_artifacts_stable"
  | "operator_selected_public_refresh_ready"
  | "refresh_blocked_saved_artifacts_incomplete";

export interface EdgeLayerSeamHistoryPublicSwarmRefreshDecisionArtifact {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SWARM_REFRESH_DECISION_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SWARM_REFRESH_DECISION_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    reproducibilityCheck?: string | undefined;
    observationToEdgeContract?: string | undefined;
    proofSummaryConsumerReadback?: string | undefined;
  };
  decision: {
    status: EdgeLayerSeamHistoryPublicSwarmRefreshDecisionStatus;
    recommendation: EdgeLayerSeamHistoryPublicSwarmRefreshDecision;
    rationale: string[];
    publicRefreshCommandPrepared: boolean;
    publicRefreshExecutedByThisDecision: false;
  };
  proof: {
    strongestSourceProofRungObserved?: string | undefined;
    strongestSourceProofLabelObserved?: string | undefined;
    decisionOperationProofRung: "local_refresh_decision_over_saved_public_hyperswarm_artifacts";
    savedArtifactDecisionOnly: true;
    liveSwarmRunClaimedByThisDecision: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryPublicSwarmRefreshDecisionStatus;
    reproducibilityCheckReady: boolean;
    edgeContractReady: boolean;
    consumerReadbackReady: boolean;
    sourceRefsPreserved: boolean;
    publicSourceProofRungPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noEdgeProjectionWriteClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisDecision: true;
    issues: string[];
  };
  boundary: {
    refreshDecisionOnly: true;
    readsSavedArtifactsOnly: true;
    opensSwarm: false;
    opensCorestore: false;
    runsPublicRefresh: false;
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
  reviewStatus: EdgeLayerSeamHistoryPublicSwarmRefreshDecisionStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryPublicSwarmRefreshDecision(input: {
  reproducibilityCheck: unknown;
  observationToEdgeContract: unknown;
  proofSummaryConsumerReadback: unknown;
  emittedAt: string;
  sourcePaths?: EdgeLayerSeamHistoryPublicSwarmRefreshDecisionArtifact["sourcePaths"] | undefined;
  operatorSelectedRefresh?: boolean | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryPublicSwarmRefreshDecisionArtifact {
  const reproducibilityCheck = maybeRecord(input.reproducibilityCheck);
  const contract = maybeRecord(input.observationToEdgeContract);
  const consumerReadback = maybeRecord(input.proofSummaryConsumerReadback);
  const reproProof = maybeRecord(reproducibilityCheck?.proof);
  const issues: string[] = [];

  const reproducibilityCheckReady =
    reproducibilityCheck?.reviewStatus === "edge-layer-seam-history-public-artifacts-reproducible";
  const edgeContractReady =
    contract?.reviewStatus === "edge-layer-seam-history-observation-to-edge-projection-contract-ready";
  const consumerReadbackReady =
    consumerReadback?.reviewStatus === "edge-layer-seam-history-proof-summary-consumer-readback-ready";
  const sourceRefsPreserved =
    maybeRecord(contract?.validation)?.sourceRefsMatchBetweenCausalAndEdge === true &&
    maybeRecord(consumerReadback?.validation)?.sourceRefsPreservedWhenPresent === true;
  const publicSourceProofRungPreserved =
    reproProof?.strongestSourceProofRungObserved ===
      "public_hyperswarm_replicated_durable_seam_history_observation" &&
    maybeRecord(contract?.validation)?.publicSourceProofRungPreserved === true &&
    maybeRecord(consumerReadback?.sourceSummary)?.publicHyperswarmProofObservedInSourceArtifacts === true;

  if (!reproducibilityCheckReady) issues.push("reproducibility-check-not-ready");
  if (!edgeContractReady) issues.push("observation-to-edge-contract-not-ready");
  if (!consumerReadbackReady) issues.push("proof-summary-consumer-readback-not-ready");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!publicSourceProofRungPreserved) issues.push("public-source-proof-rung-not-preserved");
  if (hasOverclaim(reproducibilityCheck) || hasOverclaim(contract) || hasOverclaim(consumerReadback)) {
    issues.push("refresh-decision-source-overclaim");
  }

  const status: EdgeLayerSeamHistoryPublicSwarmRefreshDecisionStatus = issues.length === 0
    ? "edge-layer-seam-history-public-swarm-refresh-decision-ready"
    : "edge-layer-seam-history-public-swarm-refresh-decision-incomplete";
  const recommendation: EdgeLayerSeamHistoryPublicSwarmRefreshDecision = status !==
      "edge-layer-seam-history-public-swarm-refresh-decision-ready"
    ? "refresh_blocked_saved_artifacts_incomplete"
    : input.operatorSelectedRefresh === true
    ? "operator_selected_public_refresh_ready"
    : "not_required_artifacts_stable";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-public-swarm-refresh-decision:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      recommendation,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SWARM_REFRESH_DECISION_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SWARM_REFRESH_DECISION_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    decision: {
      status,
      recommendation,
      rationale: buildRationale(recommendation),
      publicRefreshCommandPrepared: recommendation === "operator_selected_public_refresh_ready",
      publicRefreshExecutedByThisDecision: false,
    },
    proof: {
      ...(typeof reproProof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: reproProof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof reproProof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: reproProof.strongestSourceProofLabelObserved }
        : {}),
      decisionOperationProofRung: "local_refresh_decision_over_saved_public_hyperswarm_artifacts",
      savedArtifactDecisionOnly: true,
      liveSwarmRunClaimedByThisDecision: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      reproducibilityCheckReady,
      edgeContractReady,
      consumerReadbackReady,
      sourceRefsPreserved,
      publicSourceProofRungPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noEdgeProjectionWriteClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisDecision: true,
      issues,
    },
    boundary: {
      refreshDecisionOnly: true,
      readsSavedArtifactsOnly: true,
      opensSwarm: false,
      opensCorestore: false,
      runsPublicRefresh: false,
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
      "public-swarm-refresh-decision-reads-saved-artifacts-only",
      "public-swarm-refresh-decision-does-not-run-public-swarm",
      "public-swarm-refresh-decision-does-not-upgrade-proof",
    ],
    rejections: status === "edge-layer-seam-history-public-swarm-refresh-decision-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryPublicSwarmRefreshDecision(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryPublicSwarmRefreshDecisionArtifact {
  const candidate = assertObject(value, "edge layer seam history public swarm refresh decision");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SWARM_REFRESH_DECISION_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_SWARM_REFRESH_DECISION_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.decisionOperationProofRung,
    "local_refresh_decision_over_saved_public_hyperswarm_artifacts",
    "proof.decisionOperationProofRung",
  );
  assertEqual(proof.savedArtifactDecisionOnly, true, "proof.savedArtifactDecisionOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisDecision, false, "proof.liveSwarmRunClaimedByThisDecision");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const decision = assertObject(candidate.decision, "decision");
  assertEqual(decision.publicRefreshExecutedByThisDecision, false, "decision.publicRefreshExecutedByThisDecision");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.refreshDecisionOnly, true, "boundary.refreshDecisionOnly");
  assertEqual(boundary.readsSavedArtifactsOnly, true, "boundary.readsSavedArtifactsOnly");
  for (const key of [
    "opensSwarm",
    "opensCorestore",
    "runsPublicRefresh",
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
  assertDecisionStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noEdgeProjectionWriteClaim, true, "validation.noEdgeProjectionWriteClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisDecision, true, "validation.noLiveSwarmClaimByThisDecision");
  assertDecisionStatus(candidate.reviewStatus, "reviewStatus");
}

function buildRationale(recommendation: EdgeLayerSeamHistoryPublicSwarmRefreshDecision): string[] {
  if (recommendation === "refresh_blocked_saved_artifacts_incomplete") {
    return ["saved public artifact chain is incomplete; do not run refresh from this decision"];
  }
  if (recommendation === "operator_selected_public_refresh_ready") {
    return ["saved public artifact chain is stable; operator may choose a new public swarm run"];
  }
  return ["saved public artifact chain is stable; no immediate Causal-owned public refresh is required"];
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

function assertDecisionStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryPublicSwarmRefreshDecisionStatus {
  if (
    value !== "edge-layer-seam-history-public-swarm-refresh-decision-ready" &&
    value !== "edge-layer-seam-history-public-swarm-refresh-decision-incomplete"
  ) {
    throw new Error(`${label} must be a public swarm refresh decision status`);
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
