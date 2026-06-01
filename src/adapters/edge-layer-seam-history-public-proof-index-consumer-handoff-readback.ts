import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_SCHEMA =
  "causal-substrate/edge-layer-seam-history-public-proof-index-consumer-handoff-readback/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-public-proof-index-consumer-handoff-readback" as const;

export type EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadbackStatus =
  | "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready"
  | "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-incomplete";

export interface EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    publicProofIndexConsumerHandoff?: string | undefined;
  };
  handoffSummary: {
    artifactId?: string | undefined;
    reviewStatus?: string | undefined;
    strongestSourceProofRungObserved?: string | undefined;
    strongestSourceProofLabelObserved?: string | undefined;
    consumerHandoffOperationProofRung?: string | undefined;
  };
  consumerReadback: {
    edgeObservationOnlyIndexAvailable: boolean;
    layerObservationOnlyFeedbackIndexAvailable: boolean;
    spineFamilyPressureIndexAvailable: boolean;
    savedHandoffReadbackOnly: true;
    doesNotUpgradeSavedHandoff: true;
  };
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
    readbackOperationProofRung:
      "local_readback_over_saved_public_proof_index_consumer_handoff";
    savedHandoffReadbackOnly: true;
    liveSwarmRunClaimedByThisReadback: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadbackStatus;
    handoffReady: boolean;
    sourceRefsPreserved: boolean;
    sourceProofRungPreserved: boolean;
    consumerSuitabilityPreserved: boolean;
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
    consumerHandoffReadbackOnly: true;
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
  reviewStatus: EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadbackStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback(input: {
  publicProofIndexConsumerHandoff: unknown;
  emittedAt: string;
  sourcePaths?: EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback["sourcePaths"] | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback {
  const handoff = maybeRecord(input.publicProofIndexConsumerHandoff);
  const proof = maybeRecord(handoff?.proof);
  const validation = maybeRecord(handoff?.validation);
  const consumerHandoff = maybeRecord(handoff?.consumerHandoff);
  const refs = maybeRecord(handoff?.preservedRefs);
  const issues: string[] = [];
  const preservedRefs = {
    requestIds: nonEmptyStrings(refs?.requestIds),
    requestHashes: nonEmptyStrings(refs?.requestHashes),
    receiptIds: nonEmptyStrings(refs?.receiptIds),
    receiptHashes: nonEmptyStrings(refs?.receiptHashes),
    sourceRepos: nonEmptyStrings(refs?.sourceRepos),
    durableRefs: nonEmptyStrings(refs?.durableRefs),
    writerRefs: nonEmptyStrings(refs?.writerRefs),
  };

  const handoffReady =
    handoff?.reviewStatus === "edge-layer-seam-history-public-proof-index-consumer-handoff-ready" &&
    validation?.status === "edge-layer-seam-history-public-proof-index-consumer-handoff-ready";
  const sourceRefsPreserved =
    validation?.sourceRefsPreserved === true &&
    preservedRefs.requestIds.length > 0 &&
    preservedRefs.requestHashes.length > 0 &&
    preservedRefs.receiptIds.length > 0 &&
    preservedRefs.receiptHashes.length > 0;
  const sourceProofRungPreserved =
    validation?.publicSourceProofRungPreserved === true &&
    proof?.strongestSourceProofRungObserved ===
      "public_hyperswarm_replicated_durable_seam_history_observation";
  const consumerSuitabilityPreserved =
    consumerHandoff?.edgeMayConsumeAsObservationOnlyIndex === true &&
    consumerHandoff?.layerMayConsumeAsObservationOnlyFeedbackIndex === true &&
    consumerHandoff?.spineMayConsumeAsFamilyPressureIndex === true &&
    consumerHandoff?.savedIndexHandoffOnly === true &&
    consumerHandoff?.doesNotUpgradeSavedIndex === true;

  if (!handoffReady) issues.push("consumer-handoff-not-ready");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!sourceProofRungPreserved) issues.push("source-proof-rung-not-preserved");
  if (!consumerSuitabilityPreserved) issues.push("consumer-suitability-not-preserved");
  if (hasOverclaim(handoff)) issues.push("consumer-handoff-overclaim");

  const status: EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadbackStatus = issues.length === 0
    ? "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready"
    : "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-incomplete";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-public-proof-index-consumer-handoff-readback:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      handoffArtifactId: handoff?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    handoffSummary: {
      ...(typeof handoff?.artifactId === "string" ? { artifactId: handoff.artifactId } : {}),
      ...(typeof handoff?.reviewStatus === "string" ? { reviewStatus: handoff.reviewStatus } : {}),
      ...(typeof proof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: proof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof proof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: proof.strongestSourceProofLabelObserved }
        : {}),
      ...(typeof proof?.consumerHandoffOperationProofRung === "string"
        ? { consumerHandoffOperationProofRung: proof.consumerHandoffOperationProofRung }
        : {}),
    },
    consumerReadback: {
      edgeObservationOnlyIndexAvailable: status ===
        "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready",
      layerObservationOnlyFeedbackIndexAvailable: status ===
        "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready",
      spineFamilyPressureIndexAvailable: status ===
        "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready",
      savedHandoffReadbackOnly: true,
      doesNotUpgradeSavedHandoff: true,
    },
    preservedRefs,
    proof: {
      ...(typeof proof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: proof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof proof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: proof.strongestSourceProofLabelObserved }
        : {}),
      readbackOperationProofRung:
        "local_readback_over_saved_public_proof_index_consumer_handoff",
      savedHandoffReadbackOnly: true,
      liveSwarmRunClaimedByThisReadback: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      handoffReady,
      sourceRefsPreserved,
      sourceProofRungPreserved,
      consumerSuitabilityPreserved,
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
      consumerHandoffReadbackOnly: true,
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
      "public-proof-index-consumer-handoff-readback-reads-saved-handoff-only",
      "public-proof-index-consumer-handoff-readback-does-not-upgrade-source-proof",
      "public-proof-index-consumer-handoff-readback-does-not-call-edge-layer-or-spine",
    ],
    rejections: status === "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback {
  const candidate = assertObject(value, "edge layer seam history public proof index consumer handoff readback");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.readbackOperationProofRung,
    "local_readback_over_saved_public_proof_index_consumer_handoff",
    "proof.readbackOperationProofRung",
  );
  assertEqual(proof.savedHandoffReadbackOnly, true, "proof.savedHandoffReadbackOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisReadback, false, "proof.liveSwarmRunClaimedByThisReadback");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
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
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.consumerHandoffReadbackOnly, true, "boundary.consumerHandoffReadbackOnly");
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

function assertReadbackStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadbackStatus {
  if (
    value !== "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready" &&
    value !== "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-incomplete"
  ) {
    throw new Error(`${label} must be a public proof index consumer handoff readback status`);
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
