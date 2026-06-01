import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_SCHEMA =
  "causal-substrate/edge-layer-seam-history-public-proof-index-consumer-handoff/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-public-proof-index-consumer-handoff" as const;

export type EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffStatus =
  | "edge-layer-seam-history-public-proof-index-consumer-handoff-ready"
  | "edge-layer-seam-history-public-proof-index-consumer-handoff-incomplete";

export interface EdgeLayerSeamHistoryPublicProofIndexConsumerHandoff {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    publicSeamProofIndex?: string | undefined;
  };
  indexSummary: {
    artifactId?: string | undefined;
    runId?: string | undefined;
    reviewStatus?: string | undefined;
    strongestSourceProofRungObserved?: string | undefined;
    strongestSourceProofLabelObserved?: string | undefined;
    indexOperationProofRung?: string | undefined;
  };
  consumerHandoff: {
    edgeMayConsumeAsObservationOnlyIndex: boolean;
    layerMayConsumeAsObservationOnlyFeedbackIndex: boolean;
    spineMayConsumeAsFamilyPressureIndex: boolean;
    sourceProofRungPreservedForConsumers: boolean;
    savedIndexHandoffOnly: true;
    doesNotUpgradeSavedIndex: true;
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
    consumerHandoffOperationProofRung:
      "local_consumer_handoff_over_saved_public_seam_proof_index";
    savedIndexHandoffOnly: true;
    liveSwarmRunClaimedByThisHandoff: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffStatus;
    publicSeamProofIndexReady: boolean;
    sourceRefsPreserved: boolean;
    proofLabelsPreserved: boolean;
    publicSourceProofRungPreserved: boolean;
    configuredBootstrapEvidenceAbsent: boolean;
    consumerSuitabilityPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noEdgeProjectionWriteClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisHandoff: true;
    issues: string[];
  };
  boundary: {
    consumerHandoffOnly: true;
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
  reviewStatus: EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff(input: {
  publicSeamProofIndex: unknown;
  emittedAt: string;
  sourcePaths?: EdgeLayerSeamHistoryPublicProofIndexConsumerHandoff["sourcePaths"] | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryPublicProofIndexConsumerHandoff {
  const index = maybeRecord(input.publicSeamProofIndex);
  const proof = maybeRecord(index?.proof);
  const validation = maybeRecord(index?.validation);
  const suitability = maybeRecord(index?.consumerSuitability);
  const refs = maybeRecord(index?.preservedRefs);
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
  const publicSeamProofIndexReady =
    index?.reviewStatus === "edge-layer-seam-history-public-seam-proof-index-ready" &&
    validation?.status === "edge-layer-seam-history-public-seam-proof-index-ready";
  const sourceRefsPreserved =
    validation?.sourceRefsPreserved === true &&
    preservedRefs.requestIds.length > 0 &&
    preservedRefs.requestHashes.length > 0 &&
    preservedRefs.receiptIds.length > 0 &&
    preservedRefs.receiptHashes.length > 0;
  const proofLabelsPreserved = validation?.proofLabelsPreserved === true &&
    typeof proof?.strongestSourceProofLabelObserved === "string";
  const publicSourceProofRungPreserved =
    validation?.publicSourceProofRungPreserved === true &&
    proof?.strongestSourceProofRungObserved ===
      "public_hyperswarm_replicated_durable_seam_history_observation";
  const configuredBootstrapEvidenceAbsent = validation?.configuredBootstrapEvidenceAbsent === true;
  const consumerSuitabilityPreserved =
    suitability?.edgeMayConsumeAsObservationOnlyIndex === true &&
    suitability?.layerMayConsumeAsObservationOnlyFeedbackIndex === true &&
    suitability?.spineMayConsumeAsFamilyPressureIndex === true &&
    suitability?.projectionStateWritten === false &&
    suitability?.layerEvidenceAdmitted === false &&
    suitability?.canonicalHistoryClaimed === false;

  if (!publicSeamProofIndexReady) issues.push("public-seam-proof-index-not-ready");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!proofLabelsPreserved) issues.push("proof-labels-not-preserved");
  if (!publicSourceProofRungPreserved) issues.push("public-source-proof-rung-not-preserved");
  if (!configuredBootstrapEvidenceAbsent) issues.push("configured-bootstrap-evidence-present");
  if (!consumerSuitabilityPreserved) issues.push("consumer-suitability-not-preserved");
  if (hasOverclaim(index)) issues.push("public-seam-proof-index-overclaim");

  const status: EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffStatus = issues.length === 0
    ? "edge-layer-seam-history-public-proof-index-consumer-handoff-ready"
    : "edge-layer-seam-history-public-proof-index-consumer-handoff-incomplete";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-public-proof-index-consumer-handoff:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      indexArtifactId: index?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    indexSummary: {
      ...(typeof index?.artifactId === "string" ? { artifactId: index.artifactId } : {}),
      ...(typeof index?.runId === "string" ? { runId: index.runId } : {}),
      ...(typeof index?.reviewStatus === "string" ? { reviewStatus: index.reviewStatus } : {}),
      ...(typeof proof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: proof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof proof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: proof.strongestSourceProofLabelObserved }
        : {}),
      ...(typeof proof?.indexOperationProofRung === "string"
        ? { indexOperationProofRung: proof.indexOperationProofRung }
        : {}),
    },
    consumerHandoff: {
      edgeMayConsumeAsObservationOnlyIndex:
        status === "edge-layer-seam-history-public-proof-index-consumer-handoff-ready",
      layerMayConsumeAsObservationOnlyFeedbackIndex:
        status === "edge-layer-seam-history-public-proof-index-consumer-handoff-ready",
      spineMayConsumeAsFamilyPressureIndex:
        status === "edge-layer-seam-history-public-proof-index-consumer-handoff-ready",
      sourceProofRungPreservedForConsumers: publicSourceProofRungPreserved,
      savedIndexHandoffOnly: true,
      doesNotUpgradeSavedIndex: true,
    },
    preservedRefs,
    proof: {
      ...(typeof proof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: proof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof proof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: proof.strongestSourceProofLabelObserved }
        : {}),
      consumerHandoffOperationProofRung:
        "local_consumer_handoff_over_saved_public_seam_proof_index",
      savedIndexHandoffOnly: true,
      liveSwarmRunClaimedByThisHandoff: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      publicSeamProofIndexReady,
      sourceRefsPreserved,
      proofLabelsPreserved,
      publicSourceProofRungPreserved,
      configuredBootstrapEvidenceAbsent,
      consumerSuitabilityPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noEdgeProjectionWriteClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisHandoff: true,
      issues,
    },
    boundary: {
      consumerHandoffOnly: true,
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
      "public-proof-index-consumer-handoff-reads-saved-index-only",
      "public-proof-index-consumer-handoff-does-not-upgrade-source-proof",
      "public-proof-index-consumer-handoff-does-not-call-edge-layer-or-spine",
    ],
    rejections: status === "edge-layer-seam-history-public-proof-index-consumer-handoff-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryPublicProofIndexConsumerHandoff {
  const candidate = assertObject(value, "edge layer seam history public proof index consumer handoff");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.consumerHandoffOperationProofRung,
    "local_consumer_handoff_over_saved_public_seam_proof_index",
    "proof.consumerHandoffOperationProofRung",
  );
  assertEqual(proof.savedIndexHandoffOnly, true, "proof.savedIndexHandoffOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisHandoff, false, "proof.liveSwarmRunClaimedByThisHandoff");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const validation = assertObject(candidate.validation, "validation");
  assertHandoffStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noEdgeProjectionWriteClaim, true, "validation.noEdgeProjectionWriteClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisHandoff, true, "validation.noLiveSwarmClaimByThisHandoff");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.consumerHandoffOnly, true, "boundary.consumerHandoffOnly");
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
  assertHandoffStatus(candidate.reviewStatus, "reviewStatus");
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

function assertHandoffStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryPublicProofIndexConsumerHandoffStatus {
  if (
    value !== "edge-layer-seam-history-public-proof-index-consumer-handoff-ready" &&
    value !== "edge-layer-seam-history-public-proof-index-consumer-handoff-incomplete"
  ) {
    throw new Error(`${label} must be a public proof index consumer handoff status`);
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
