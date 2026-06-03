import { createHash } from "node:crypto";

import type { GenericCausalSeamProofRung } from "./generic-causal-seam-surface.js";

export const GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_SCHEMA =
  "causal-substrate/generic-causal-seam-public-proof-index/v1" as const;

export const GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_ARTIFACT_KIND =
  "generic-causal-seam-public-proof-index" as const;

export const GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_SCHEMA =
  "causal-substrate/generic-causal-seam-public-proof-index-consumer-handoff/v1" as const;

export const GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_ARTIFACT_KIND =
  "generic-causal-seam-public-proof-index-consumer-handoff" as const;

export const GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_SCHEMA =
  "causal-substrate/generic-causal-seam-public-proof-index-consumer-handoff-readback/v1" as const;

export const GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_ARTIFACT_KIND =
  "generic-causal-seam-public-proof-index-consumer-handoff-readback" as const;

export type GenericCausalSeamPublicProofIndexStatus =
  | "generic-causal-seam-public-proof-index-ready"
  | "generic-causal-seam-public-proof-index-incomplete";

export type GenericCausalSeamPublicProofIndexConsumerHandoffStatus =
  | "generic-causal-seam-public-proof-index-consumer-handoff-ready"
  | "generic-causal-seam-public-proof-index-consumer-handoff-incomplete";

export type GenericCausalSeamPublicProofIndexConsumerHandoffReadbackStatus =
  | "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready"
  | "generic-causal-seam-public-proof-index-consumer-handoff-readback-incomplete";

interface GenericPublicProofRefs {
  historyIds: string[];
  historyHashes: string[];
  observationIds: string[];
  observationHashes: string[];
  requestIds: string[];
  requestHashes: string[];
  receiptIds: string[];
  receiptHashes: string[];
  sourceRepos: string[];
  durableRefs: string[];
  writerRefs: string[];
  evidenceIds: string[];
}

interface GenericPublicProofBoundary {
  readsSavedArtifactsOnly: true;
  opensSwarm: false;
  opensCorestore: false;
  callsConsumers: false;
  callsEdge: false;
  callsLayer: false;
  writesConsumerState: false;
  acceptsCanonicalHistory: false;
  admitsLayerEvidence: false;
  decidesLayerAdmission: false;
  interpretsRbc: false;
  grantsAuthority: false;
  publishesToMesh: false;
  writesProductionContinuity: false;
}

export interface GenericCausalSeamPublicProofIndex {
  artifactKind: typeof GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_ARTIFACT_KIND;
  schema: typeof GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  runId: string;
  runKind: "generic_public_hyperswarm";
  artifactPointers: {
    publicRunDir?: string | undefined;
    seamHistoryInput?: string | undefined;
    sourceManifest?: string | undefined;
    replicaReport?: string | undefined;
    observationResult?: string | undefined;
    observationReadback?: string | undefined;
  };
  indexedArtifacts: Array<{
    role: string;
    path?: string | undefined;
    artifactKind?: string | undefined;
    schema?: string | undefined;
    artifactId?: string | undefined;
    reviewStatus?: string | undefined;
    proofRung?: string | undefined;
  }>;
  preservedRefs: GenericPublicProofRefs;
  proof: {
    strongestSourceProofRungObserved?: GenericCausalSeamProofRung | undefined;
    proofLabels: string[];
    indexOperationProofRung: "saved_readback_seam";
    preservesHigherRung: "durable_replicated_public_swarm_seam";
    savedArtifactIndexOnly: true;
    liveSwarmRunClaimedByThisIndex: false;
    proofRungUpgradeClaimed: false;
  };
  consumerSuitability: {
    genericConsumersMayReadAsObservationOnlyIndex: boolean;
    edgeMayConsumeAsObservationOnlyInput: boolean;
    layerMayConsumeAsObservationOnlyFeedback: boolean;
    spineMayConsumeAsPostureEvidence: boolean;
    consumerStateWritten: false;
    canonicalHistoryClaimed: false;
  };
  validation: {
    status: GenericCausalSeamPublicProofIndexStatus;
    requiredArtifactsPresent: boolean;
    replicaReportCompatible: boolean;
    observationResultCompatible: boolean;
    observationReadbackValid: boolean;
    sourceRefsPreserved: boolean;
    proofLabelsPreserved: boolean;
    publicSourceProofRungPreserved: boolean;
    publicSwarmTransportPreserved: boolean;
    durableReadbackPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisIndex: true;
    issues: string[];
  };
  boundary: GenericPublicProofBoundary & {
    proofIndexOnly: true;
  };
  reviewStatus: GenericCausalSeamPublicProofIndexStatus;
  warnings: string[];
  rejections: string[];
}

export interface GenericCausalSeamPublicProofIndexConsumerHandoff {
  artifactKind: typeof GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_ARTIFACT_KIND;
  schema: typeof GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    publicProofIndex?: string | undefined;
  };
  indexSummary: {
    artifactId?: string | undefined;
    runId?: string | undefined;
    reviewStatus?: string | undefined;
    strongestSourceProofRungObserved?: string | undefined;
    indexOperationProofRung?: string | undefined;
  };
  consumerHandoff: {
    genericConsumersMayReadAsObservationOnlyIndex: boolean;
    edgeMayConsumeAsObservationOnlyInput: boolean;
    layerMayConsumeAsObservationOnlyFeedback: boolean;
    spineMayConsumeAsPostureEvidence: boolean;
    sourceProofRungPreservedForConsumers: boolean;
    savedIndexHandoffOnly: true;
    doesNotUpgradeSavedIndex: true;
  };
  preservedRefs: GenericPublicProofRefs;
  proof: {
    strongestSourceProofRungObserved?: GenericCausalSeamProofRung | undefined;
    proofLabels: string[];
    consumerHandoffOperationProofRung: "consumer_handoff_seam";
    preservesHigherRung: "durable_replicated_public_swarm_seam";
    savedIndexHandoffOnly: true;
    liveSwarmRunClaimedByThisHandoff: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: GenericCausalSeamPublicProofIndexConsumerHandoffStatus;
    publicProofIndexReady: boolean;
    sourceRefsPreserved: boolean;
    proofLabelsPreserved: boolean;
    publicSourceProofRungPreserved: boolean;
    consumerSuitabilityPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisHandoff: true;
    issues: string[];
  };
  boundary: GenericPublicProofBoundary & {
    consumerHandoffOnly: true;
  };
  reviewStatus: GenericCausalSeamPublicProofIndexConsumerHandoffStatus;
  warnings: string[];
  rejections: string[];
}

export interface GenericCausalSeamPublicProofIndexConsumerHandoffReadback {
  artifactKind: typeof GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_ARTIFACT_KIND;
  schema: typeof GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_SCHEMA;
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
    consumerHandoffOperationProofRung?: string | undefined;
  };
  consumerReadback: {
    genericConsumerHandoffAvailable: boolean;
    edgeObservationOnlyInputAvailable: boolean;
    layerObservationOnlyFeedbackAvailable: boolean;
    spinePostureEvidenceAvailable: boolean;
    savedHandoffReadbackOnly: true;
    doesNotUpgradeSavedHandoff: true;
  };
  preservedRefs: GenericPublicProofRefs;
  proof: {
    strongestSourceProofRungObserved?: GenericCausalSeamProofRung | undefined;
    proofLabels: string[];
    readbackOperationProofRung: "saved_readback_seam";
    preservesHigherRung: "durable_replicated_public_swarm_seam";
    savedHandoffReadbackOnly: true;
    liveSwarmRunClaimedByThisReadback: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: GenericCausalSeamPublicProofIndexConsumerHandoffReadbackStatus;
    handoffReady: boolean;
    sourceRefsPreserved: boolean;
    sourceProofRungPreserved: boolean;
    consumerSuitabilityPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisReadback: true;
    issues: string[];
  };
  boundary: GenericPublicProofBoundary & {
    consumerHandoffReadbackOnly: true;
  };
  reviewStatus: GenericCausalSeamPublicProofIndexConsumerHandoffReadbackStatus;
  warnings: string[];
  rejections: string[];
}

export function buildGenericCausalSeamPublicProofIndex(input: {
  runId: string;
  artifacts: {
    seamHistoryInput?: unknown;
    sourceManifest?: unknown;
    replicaReport?: unknown;
    observationResult?: unknown;
    observationReadback?: unknown;
  };
  artifactPointers?: GenericCausalSeamPublicProofIndex["artifactPointers"] | undefined;
  emittedAt: string;
  artifactId?: string | undefined;
}): GenericCausalSeamPublicProofIndex {
  const seamHistoryInput = maybeRecord(input.artifacts.seamHistoryInput);
  const sourceManifest = maybeRecord(input.artifacts.sourceManifest);
  const replicaReport = maybeRecord(input.artifacts.replicaReport);
  const observationResult = maybeRecord(input.artifacts.observationResult);
  const observationReadback = maybeRecord(input.artifacts.observationReadback);
  const readerProof = maybeRecord(replicaReport?.readerProof);
  const observationProof = maybeRecord(observationResult?.proof);
  const transportBooleans = maybeRecord(observationResult?.transportBooleans);
  const readback = maybeRecord(observationReadback?.readback);
  const readbackValidation = maybeRecord(observationReadback?.validation);
  const refs = preservedRefsFromObservation(observationResult);
  const proofLabels = nonEmptyStrings(observationProof?.proofLabels);
  const issues: string[] = [];

  const requiredArtifactsPresent = [
    seamHistoryInput,
    sourceManifest,
    replicaReport,
    observationResult,
    observationReadback,
  ].every((artifact) => artifact !== undefined);
  const replicaReportCompatible =
    replicaReport?.status === "compatible" &&
    readerProof?.sourceManifestConsumed === true &&
    readerProof?.inputReadByCausalSubstrate === true &&
    readerProof?.durableCorestoreHistoryRead === true &&
    readerProof?.replicatedViaHyperswarmTransport === true &&
    readerProof?.publicHyperswarmInputObservedByCausalSubstrate === true &&
    readerProof?.evidenceSource === "reader_observed_replicated_public_swarm_path";
  const observationResultCompatible =
    observationResult?.finalClassification === "compatible" &&
    observationResult?.strongestProofRung === "durable_replicated_public_swarm_seam" &&
    observationProof?.sourceProofRung === "durable_replicated_public_swarm_seam";
  const observationReadbackValid =
    readbackValidation?.status === "generic-causal-seam-public-observation-readback-valid" &&
    readback?.observationResultReadable === true &&
    readback?.observationHashPreserved === true &&
    readback?.sourceRefsPreserved === true;
  const sourceRefsPreserved = refs.requestIds.length > 0 &&
    refs.requestHashes.length > 0 &&
    refs.receiptIds.length > 0 &&
    refs.receiptHashes.length > 0 &&
    refs.sourceRepos.length > 0 &&
    refs.durableRefs.length > 0 &&
    refs.writerRefs.length > 0;
  const proofLabelsPreserved = proofLabels.length > 0;
  const publicSourceProofRungPreserved =
    observationResult?.strongestProofRung === "durable_replicated_public_swarm_seam" &&
    observationResult?.sourceProofRung === "durable_replicated_public_swarm_seam" &&
    readback?.strongestProofRung === "durable_replicated_public_swarm_seam";
  const publicSwarmTransportPreserved =
    observationResult?.publicSwarmTransportHappened === true &&
    transportBooleans?.publicSwarmTransportHappened === true &&
    readback?.publicSwarmTransportHappened === true;
  const durableReadbackPreserved =
    transportBooleans?.durableFeedBackedHistoryObserved === true &&
    transportBooleans?.receivingRepoObservedReplicatedPath === true &&
    transportBooleans?.durableObservationResultEmitted === true &&
    transportBooleans?.reopenedReadbackDerivedFromDurableHistory === true &&
    readback?.durableFeedBackedHistoryObserved === true &&
    readback?.receivingRepoObservedReplicatedPath === true &&
    readback?.durableObservationResultEmitted === true &&
    readback?.reopenedReadbackDerivedFromDurableHistory === true;

  if (!requiredArtifactsPresent) issues.push("required-artifacts-missing");
  if (!replicaReportCompatible) issues.push("replica-report-not-compatible");
  if (!observationResultCompatible) issues.push("observation-result-not-compatible");
  if (!observationReadbackValid) issues.push("observation-readback-not-valid");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!proofLabelsPreserved) issues.push("proof-labels-not-preserved");
  if (!publicSourceProofRungPreserved) issues.push("public-source-proof-rung-not-preserved");
  if (!publicSwarmTransportPreserved) issues.push("public-swarm-transport-not-preserved");
  if (!durableReadbackPreserved) issues.push("durable-readback-not-preserved");
  if (
    hasOverclaim(seamHistoryInput) ||
    hasOverclaim(sourceManifest) ||
    hasOverclaim(replicaReport) ||
    hasOverclaim(observationResult) ||
    hasOverclaim(observationReadback)
  ) {
    issues.push("indexed-artifact-overclaim");
  }

  const status: GenericCausalSeamPublicProofIndexStatus = issues.length === 0
    ? "generic-causal-seam-public-proof-index-ready"
    : "generic-causal-seam-public-proof-index-incomplete";
  const artifactId = input.artifactId ??
    `generic-causal-seam-public-proof-index:${hash(stableJson({
      emittedAt: input.emittedAt,
      runId: input.runId,
      artifactPointers: input.artifactPointers ?? {},
    })).slice(0, 16)}`;
  const strongestSourceProofRungObserved = observationResult?.strongestProofRung ===
    "durable_replicated_public_swarm_seam"
    ? "durable_replicated_public_swarm_seam"
    : undefined;

  return {
    artifactKind: GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_ARTIFACT_KIND,
    schema: GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    runId: input.runId,
    runKind: "generic_public_hyperswarm",
    artifactPointers: { ...(input.artifactPointers ?? {}) },
    indexedArtifacts: [
      summarizeArtifact("generic_seam_history_input", seamHistoryInput, input.artifactPointers?.seamHistoryInput),
      summarizeArtifact("generic_public_source_manifest", sourceManifest, input.artifactPointers?.sourceManifest),
      summarizeArtifact("generic_public_replica_report", replicaReport, input.artifactPointers?.replicaReport),
      summarizeArtifact("generic_public_observation_result", observationResult, input.artifactPointers?.observationResult),
      summarizeArtifact("generic_public_observation_readback", observationReadback, input.artifactPointers?.observationReadback),
    ],
    preservedRefs: refs,
    proof: {
      ...(strongestSourceProofRungObserved ? { strongestSourceProofRungObserved } : {}),
      proofLabels,
      indexOperationProofRung: "saved_readback_seam",
      preservesHigherRung: "durable_replicated_public_swarm_seam",
      savedArtifactIndexOnly: true,
      liveSwarmRunClaimedByThisIndex: false,
      proofRungUpgradeClaimed: false,
    },
    consumerSuitability: {
      genericConsumersMayReadAsObservationOnlyIndex: status === "generic-causal-seam-public-proof-index-ready",
      edgeMayConsumeAsObservationOnlyInput: status === "generic-causal-seam-public-proof-index-ready",
      layerMayConsumeAsObservationOnlyFeedback: status === "generic-causal-seam-public-proof-index-ready",
      spineMayConsumeAsPostureEvidence: status === "generic-causal-seam-public-proof-index-ready",
      consumerStateWritten: false,
      canonicalHistoryClaimed: false,
    },
    validation: {
      status,
      requiredArtifactsPresent,
      replicaReportCompatible,
      observationResultCompatible,
      observationReadbackValid,
      sourceRefsPreserved,
      proofLabelsPreserved,
      publicSourceProofRungPreserved,
      publicSwarmTransportPreserved,
      durableReadbackPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisIndex: true,
      issues,
    },
    boundary: {
      proofIndexOnly: true,
      ...readOnlyBoundary(),
    },
    reviewStatus: status,
    warnings: [
      "generic-public-proof-index-reads-saved-artifacts-only",
      "generic-public-proof-index-does-not-upgrade-source-proof",
      "generic-public-proof-index-preserves-public-swarm-run-refs-for-consumers",
    ],
    rejections: status === "generic-causal-seam-public-proof-index-ready" ? [] : issues,
  };
}

export function buildGenericCausalSeamPublicProofIndexConsumerHandoff(input: {
  publicProofIndex: unknown;
  emittedAt: string;
  sourcePaths?: GenericCausalSeamPublicProofIndexConsumerHandoff["sourcePaths"] | undefined;
  artifactId?: string | undefined;
}): GenericCausalSeamPublicProofIndexConsumerHandoff {
  const index = maybeRecord(input.publicProofIndex);
  const proof = maybeRecord(index?.proof);
  const validation = maybeRecord(index?.validation);
  const suitability = maybeRecord(index?.consumerSuitability);
  const refs = refsFromRecord(index?.preservedRefs);
  const proofLabels = nonEmptyStrings(proof?.proofLabels);
  const issues: string[] = [];
  const publicProofIndexReady =
    index?.reviewStatus === "generic-causal-seam-public-proof-index-ready" &&
    validation?.status === "generic-causal-seam-public-proof-index-ready";
  const sourceRefsPreserved =
    validation?.sourceRefsPreserved === true &&
    refs.requestIds.length > 0 &&
    refs.requestHashes.length > 0 &&
    refs.receiptIds.length > 0 &&
    refs.receiptHashes.length > 0;
  const proofLabelsPreserved = validation?.proofLabelsPreserved === true && proofLabels.length > 0;
  const publicSourceProofRungPreserved =
    validation?.publicSourceProofRungPreserved === true &&
    proof?.strongestSourceProofRungObserved === "durable_replicated_public_swarm_seam";
  const consumerSuitabilityPreserved =
    suitability?.genericConsumersMayReadAsObservationOnlyIndex === true &&
    suitability?.edgeMayConsumeAsObservationOnlyInput === true &&
    suitability?.layerMayConsumeAsObservationOnlyFeedback === true &&
    suitability?.spineMayConsumeAsPostureEvidence === true &&
    suitability?.consumerStateWritten === false &&
    suitability?.canonicalHistoryClaimed === false;

  if (!publicProofIndexReady) issues.push("public-proof-index-not-ready");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!proofLabelsPreserved) issues.push("proof-labels-not-preserved");
  if (!publicSourceProofRungPreserved) issues.push("public-source-proof-rung-not-preserved");
  if (!consumerSuitabilityPreserved) issues.push("consumer-suitability-not-preserved");
  if (hasOverclaim(index)) issues.push("public-proof-index-overclaim");

  const status: GenericCausalSeamPublicProofIndexConsumerHandoffStatus = issues.length === 0
    ? "generic-causal-seam-public-proof-index-consumer-handoff-ready"
    : "generic-causal-seam-public-proof-index-consumer-handoff-incomplete";
  const artifactId = input.artifactId ??
    `generic-causal-seam-public-proof-index-consumer-handoff:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      indexArtifactId: index?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_ARTIFACT_KIND,
    schema: GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_SCHEMA,
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
      ...(typeof proof?.indexOperationProofRung === "string"
        ? { indexOperationProofRung: proof.indexOperationProofRung }
        : {}),
    },
    consumerHandoff: {
      genericConsumersMayReadAsObservationOnlyIndex:
        status === "generic-causal-seam-public-proof-index-consumer-handoff-ready",
      edgeMayConsumeAsObservationOnlyInput:
        status === "generic-causal-seam-public-proof-index-consumer-handoff-ready",
      layerMayConsumeAsObservationOnlyFeedback:
        status === "generic-causal-seam-public-proof-index-consumer-handoff-ready",
      spineMayConsumeAsPostureEvidence:
        status === "generic-causal-seam-public-proof-index-consumer-handoff-ready",
      sourceProofRungPreservedForConsumers: publicSourceProofRungPreserved,
      savedIndexHandoffOnly: true,
      doesNotUpgradeSavedIndex: true,
    },
    preservedRefs: refs,
    proof: {
      ...(proof?.strongestSourceProofRungObserved === "durable_replicated_public_swarm_seam"
        ? { strongestSourceProofRungObserved: proof.strongestSourceProofRungObserved }
        : {}),
      proofLabels,
      consumerHandoffOperationProofRung: "consumer_handoff_seam",
      preservesHigherRung: "durable_replicated_public_swarm_seam",
      savedIndexHandoffOnly: true,
      liveSwarmRunClaimedByThisHandoff: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      publicProofIndexReady,
      sourceRefsPreserved,
      proofLabelsPreserved,
      publicSourceProofRungPreserved,
      consumerSuitabilityPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisHandoff: true,
      issues,
    },
    boundary: {
      consumerHandoffOnly: true,
      ...readOnlyBoundary(),
    },
    reviewStatus: status,
    warnings: [
      "generic-public-proof-index-consumer-handoff-reads-saved-index-only",
      "generic-public-proof-index-consumer-handoff-does-not-call-consumers",
      "generic-public-proof-index-consumer-handoff-does-not-upgrade-source-proof",
    ],
    rejections: status === "generic-causal-seam-public-proof-index-consumer-handoff-ready" ? [] : issues,
  };
}

export function buildGenericCausalSeamPublicProofIndexConsumerHandoffReadback(input: {
  publicProofIndexConsumerHandoff: unknown;
  emittedAt: string;
  sourcePaths?: GenericCausalSeamPublicProofIndexConsumerHandoffReadback["sourcePaths"] | undefined;
  artifactId?: string | undefined;
}): GenericCausalSeamPublicProofIndexConsumerHandoffReadback {
  const handoff = maybeRecord(input.publicProofIndexConsumerHandoff);
  const proof = maybeRecord(handoff?.proof);
  const validation = maybeRecord(handoff?.validation);
  const consumerHandoff = maybeRecord(handoff?.consumerHandoff);
  const refs = refsFromRecord(handoff?.preservedRefs);
  const proofLabels = nonEmptyStrings(proof?.proofLabels);
  const issues: string[] = [];
  const handoffReady =
    handoff?.reviewStatus === "generic-causal-seam-public-proof-index-consumer-handoff-ready" &&
    validation?.status === "generic-causal-seam-public-proof-index-consumer-handoff-ready";
  const sourceRefsPreserved =
    validation?.sourceRefsPreserved === true &&
    refs.requestIds.length > 0 &&
    refs.requestHashes.length > 0 &&
    refs.receiptIds.length > 0 &&
    refs.receiptHashes.length > 0;
  const sourceProofRungPreserved =
    validation?.publicSourceProofRungPreserved === true &&
    proof?.strongestSourceProofRungObserved === "durable_replicated_public_swarm_seam";
  const consumerSuitabilityPreserved =
    consumerHandoff?.genericConsumersMayReadAsObservationOnlyIndex === true &&
    consumerHandoff?.edgeMayConsumeAsObservationOnlyInput === true &&
    consumerHandoff?.layerMayConsumeAsObservationOnlyFeedback === true &&
    consumerHandoff?.spineMayConsumeAsPostureEvidence === true &&
    consumerHandoff?.savedIndexHandoffOnly === true &&
    consumerHandoff?.doesNotUpgradeSavedIndex === true;

  if (!handoffReady) issues.push("consumer-handoff-not-ready");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!sourceProofRungPreserved) issues.push("source-proof-rung-not-preserved");
  if (!consumerSuitabilityPreserved) issues.push("consumer-suitability-not-preserved");
  if (hasOverclaim(handoff)) issues.push("consumer-handoff-overclaim");

  const status: GenericCausalSeamPublicProofIndexConsumerHandoffReadbackStatus = issues.length === 0
    ? "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready"
    : "generic-causal-seam-public-proof-index-consumer-handoff-readback-incomplete";
  const artifactId = input.artifactId ??
    `generic-causal-seam-public-proof-index-consumer-handoff-readback:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      handoffArtifactId: handoff?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_ARTIFACT_KIND,
    schema: GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_SCHEMA,
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
      ...(typeof proof?.consumerHandoffOperationProofRung === "string"
        ? { consumerHandoffOperationProofRung: proof.consumerHandoffOperationProofRung }
        : {}),
    },
    consumerReadback: {
      genericConsumerHandoffAvailable:
        status === "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready",
      edgeObservationOnlyInputAvailable:
        status === "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready",
      layerObservationOnlyFeedbackAvailable:
        status === "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready",
      spinePostureEvidenceAvailable:
        status === "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready",
      savedHandoffReadbackOnly: true,
      doesNotUpgradeSavedHandoff: true,
    },
    preservedRefs: refs,
    proof: {
      ...(proof?.strongestSourceProofRungObserved === "durable_replicated_public_swarm_seam"
        ? { strongestSourceProofRungObserved: proof.strongestSourceProofRungObserved }
        : {}),
      proofLabels,
      readbackOperationProofRung: "saved_readback_seam",
      preservesHigherRung: "durable_replicated_public_swarm_seam",
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
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisReadback: true,
      issues,
    },
    boundary: {
      consumerHandoffReadbackOnly: true,
      ...readOnlyBoundary(),
    },
    reviewStatus: status,
    warnings: [
      "generic-public-proof-index-consumer-handoff-readback-reads-saved-handoff-only",
      "generic-public-proof-index-consumer-handoff-readback-does-not-call-consumers",
      "generic-public-proof-index-consumer-handoff-readback-does-not-upgrade-source-proof",
    ],
    rejections: status === "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready" ? [] : issues,
  };
}

export function assertGenericCausalSeamPublicProofIndex(
  value: unknown,
): asserts value is GenericCausalSeamPublicProofIndex {
  const candidate = assertObject(value, "generic causal seam public proof index");
  assertEqual(candidate.artifactKind, GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  assertString(candidate.runId, "runId");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(proof.indexOperationProofRung, "saved_readback_seam", "proof.indexOperationProofRung");
  assertEqual(proof.preservesHigherRung, "durable_replicated_public_swarm_seam", "proof.preservesHigherRung");
  assertEqual(proof.savedArtifactIndexOnly, true, "proof.savedArtifactIndexOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisIndex, false, "proof.liveSwarmRunClaimedByThisIndex");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const validation = assertObject(candidate.validation, "validation");
  assertIndexStatus(validation.status, "validation.status");
  assertNonClaimValidation(validation);
  assertEqual(validation.noLiveSwarmClaimByThisIndex, true, "validation.noLiveSwarmClaimByThisIndex");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.proofIndexOnly, true, "boundary.proofIndexOnly");
  assertReadOnlyBoundary(boundary);
  assertIndexStatus(candidate.reviewStatus, "reviewStatus");
}

export function assertGenericCausalSeamPublicProofIndexConsumerHandoff(
  value: unknown,
): asserts value is GenericCausalSeamPublicProofIndexConsumerHandoff {
  const candidate = assertObject(value, "generic causal seam public proof index consumer handoff");
  assertEqual(
    candidate.artifactKind,
    GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(proof.consumerHandoffOperationProofRung, "consumer_handoff_seam", "proof.consumerHandoffOperationProofRung");
  assertEqual(proof.preservesHigherRung, "durable_replicated_public_swarm_seam", "proof.preservesHigherRung");
  assertEqual(proof.savedIndexHandoffOnly, true, "proof.savedIndexHandoffOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisHandoff, false, "proof.liveSwarmRunClaimedByThisHandoff");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const validation = assertObject(candidate.validation, "validation");
  assertHandoffStatus(validation.status, "validation.status");
  assertNonClaimValidation(validation);
  assertEqual(validation.noLiveSwarmClaimByThisHandoff, true, "validation.noLiveSwarmClaimByThisHandoff");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.consumerHandoffOnly, true, "boundary.consumerHandoffOnly");
  assertReadOnlyBoundary(boundary);
  assertHandoffStatus(candidate.reviewStatus, "reviewStatus");
}

export function assertGenericCausalSeamPublicProofIndexConsumerHandoffReadback(
  value: unknown,
): asserts value is GenericCausalSeamPublicProofIndexConsumerHandoffReadback {
  const candidate = assertObject(value, "generic causal seam public proof index consumer handoff readback");
  assertEqual(
    candidate.artifactKind,
    GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, GENERIC_CAUSAL_SEAM_PUBLIC_PROOF_INDEX_CONSUMER_HANDOFF_READBACK_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(proof.readbackOperationProofRung, "saved_readback_seam", "proof.readbackOperationProofRung");
  assertEqual(proof.preservesHigherRung, "durable_replicated_public_swarm_seam", "proof.preservesHigherRung");
  assertEqual(proof.savedHandoffReadbackOnly, true, "proof.savedHandoffReadbackOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisReadback, false, "proof.liveSwarmRunClaimedByThisReadback");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const validation = assertObject(candidate.validation, "validation");
  assertReadbackStatus(validation.status, "validation.status");
  assertNonClaimValidation(validation);
  assertEqual(validation.noLiveSwarmClaimByThisReadback, true, "validation.noLiveSwarmClaimByThisReadback");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.consumerHandoffReadbackOnly, true, "boundary.consumerHandoffReadbackOnly");
  assertReadOnlyBoundary(boundary);
  assertReadbackStatus(candidate.reviewStatus, "reviewStatus");
}

function summarizeArtifact(
  role: string,
  artifact: Record<string, unknown> | undefined,
  artifactPath: string | undefined,
): GenericCausalSeamPublicProofIndex["indexedArtifacts"][number] {
  const proof = maybeRecord(artifact?.proof);
  const observationResult = maybeRecord(artifact?.observationResult);
  const observationProof = maybeRecord(observationResult?.proof);
  const readback = maybeRecord(artifact?.readback);
  const validation = maybeRecord(artifact?.validation);
  return {
    role,
    ...(artifactPath ? { path: artifactPath } : {}),
    ...(typeof artifact?.artifactKind === "string" ? { artifactKind: artifact.artifactKind } : {}),
    ...(typeof artifact?.schema === "string" ? { schema: artifact.schema } : {}),
    ...(typeof artifact?.artifactId === "string" ? { artifactId: artifact.artifactId } : {}),
    ...(typeof artifact?.observationId === "string" ? { artifactId: artifact.observationId } : {}),
    ...(typeof artifact?.reviewStatus === "string" ? { reviewStatus: artifact.reviewStatus } : {}),
    ...(typeof validation?.status === "string" ? { reviewStatus: validation.status } : {}),
    ...(typeof artifact?.strongestProofRung === "string" ? { proofRung: artifact.strongestProofRung } : {}),
    ...(typeof proof?.strongestProofRung === "string" ? { proofRung: proof.strongestProofRung } : {}),
    ...(typeof observationProof?.strongestProofRung === "string" ? { proofRung: observationProof.strongestProofRung } : {}),
    ...(typeof readback?.strongestProofRung === "string" ? { proofRung: readback.strongestProofRung } : {}),
  };
}

function preservedRefsFromObservation(observation: Record<string, unknown> | undefined): GenericPublicProofRefs {
  const sourceRefs = maybeRecord(observation?.sourceRefsPreserved);
  return {
    historyIds: nonEmptyStrings([observation?.observedHistoryId]),
    historyHashes: nonEmptyStrings([observation?.observedHistoryHash]),
    observationIds: nonEmptyStrings([observation?.observationId]),
    observationHashes: nonEmptyStrings([observation?.observationHash]),
    requestIds: nonEmptyStrings(sourceRefs?.requestIds),
    requestHashes: nonEmptyStrings(sourceRefs?.requestHashes),
    receiptIds: nonEmptyStrings(sourceRefs?.receiptIds),
    receiptHashes: nonEmptyStrings(sourceRefs?.receiptHashes),
    sourceRepos: nonEmptyStrings(sourceRefs?.sourceRepos),
    durableRefs: nonEmptyStrings(sourceRefs?.durableRefs),
    writerRefs: nonEmptyStrings(sourceRefs?.writerRefs),
    evidenceIds: nonEmptyStrings(sourceRefs?.evidenceIds),
  };
}

function refsFromRecord(value: unknown): GenericPublicProofRefs {
  const refs = maybeRecord(value);
  return {
    historyIds: nonEmptyStrings(refs?.historyIds),
    historyHashes: nonEmptyStrings(refs?.historyHashes),
    observationIds: nonEmptyStrings(refs?.observationIds),
    observationHashes: nonEmptyStrings(refs?.observationHashes),
    requestIds: nonEmptyStrings(refs?.requestIds),
    requestHashes: nonEmptyStrings(refs?.requestHashes),
    receiptIds: nonEmptyStrings(refs?.receiptIds),
    receiptHashes: nonEmptyStrings(refs?.receiptHashes),
    sourceRepos: nonEmptyStrings(refs?.sourceRepos),
    durableRefs: nonEmptyStrings(refs?.durableRefs),
    writerRefs: nonEmptyStrings(refs?.writerRefs),
    evidenceIds: nonEmptyStrings(refs?.evidenceIds),
  };
}

function hasOverclaim(value: Record<string, unknown> | undefined): boolean {
  if (!value) return false;
  const boundary = maybeRecord(value.boundary);
  const nonClaims = maybeRecord(value.nonClaims);
  return [
    boundary?.acceptsCanonicalHistory,
    boundary?.admitsLayerEvidence,
    boundary?.decidesLayerAdmission,
    boundary?.interpretsRbc,
    boundary?.grantsAuthority,
    boundary?.publishesToMesh,
    boundary?.writesProductionContinuity,
    boundary?.writesConsumerState,
    nonClaims?.canonicalHistoryClaimed,
    nonClaims?.layerEvidenceAdmitted,
    nonClaims?.layerAdmissionDecided,
    nonClaims?.rbcInterpreted,
    nonClaims?.authorityGranted,
    nonClaims?.meshPublished,
    nonClaims?.productionContinuityWritten,
  ].some((entry) => entry === true);
}

function readOnlyBoundary(): GenericPublicProofBoundary {
  return {
    readsSavedArtifactsOnly: true,
    opensSwarm: false,
    opensCorestore: false,
    callsConsumers: false,
    callsEdge: false,
    callsLayer: false,
    writesConsumerState: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    decidesLayerAdmission: false,
    interpretsRbc: false,
    grantsAuthority: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
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

function assertIndexStatus(value: unknown, label: string): asserts value is GenericCausalSeamPublicProofIndexStatus {
  if (
    value !== "generic-causal-seam-public-proof-index-ready" &&
    value !== "generic-causal-seam-public-proof-index-incomplete"
  ) {
    throw new Error(`${label} must be a generic public proof index status`);
  }
}

function assertHandoffStatus(
  value: unknown,
  label: string,
): asserts value is GenericCausalSeamPublicProofIndexConsumerHandoffStatus {
  if (
    value !== "generic-causal-seam-public-proof-index-consumer-handoff-ready" &&
    value !== "generic-causal-seam-public-proof-index-consumer-handoff-incomplete"
  ) {
    throw new Error(`${label} must be a generic public proof index consumer handoff status`);
  }
}

function assertReadbackStatus(
  value: unknown,
  label: string,
): asserts value is GenericCausalSeamPublicProofIndexConsumerHandoffReadbackStatus {
  if (
    value !== "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready" &&
    value !== "generic-causal-seam-public-proof-index-consumer-handoff-readback-incomplete"
  ) {
    throw new Error(`${label} must be a generic public proof index consumer handoff readback status`);
  }
}

function assertNonClaimValidation(validation: Record<string, unknown>): void {
  for (const key of [
    "noCanonicalHistoryClaim",
    "noLayerAdmissionClaim",
    "noRbcInterpretationClaim",
    "noAuthorityClaim",
    "noMeshPublicationClaim",
    "noProductionContinuityWriteClaim",
  ]) {
    assertEqual(validation[key], true, `validation.${key}`);
  }
}

function assertReadOnlyBoundary(boundary: Record<string, unknown>): void {
  assertEqual(boundary.readsSavedArtifactsOnly, true, "boundary.readsSavedArtifactsOnly");
  for (const key of [
    "opensSwarm",
    "opensCorestore",
    "callsConsumers",
    "callsEdge",
    "callsLayer",
    "writesConsumerState",
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
