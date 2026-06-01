import { createHash } from "node:crypto";

import {
  assertEdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryObservationResult,
} from "./edge-layer-seam-history-observation.js";
import {
  assertLayerReceiptRuntimeEvidenceObservation,
  type LayerReceiptRuntimeEvidenceObservation,
} from "./layer-receipt-runtime-evidence-observation.js";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_SCHEMA =
  "causal-substrate/edge-layer-seam-history-layer-receipt-adjacent-fixture/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-layer-receipt-adjacent-fixture" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_SCHEMA =
  "causal-substrate/edge-layer-seam-history-layer-receipt-adjacent-fixture-readback/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-layer-receipt-adjacent-fixture-readback" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_SCHEMA =
  "causal-substrate/edge-layer-seam-history-edge-layer-consumer-contract-snapshot/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-edge-layer-consumer-contract-snapshot" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_SCHEMA =
  "causal-substrate/edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback" as const;

export type EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureStatus =
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-ready"
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-incomplete"
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-invalid";

export type EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadbackStatus =
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-valid"
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-invalid";

export type EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotStatus =
  | "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-ready"
  | "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-incomplete"
  | "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-invalid";

export type EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadbackStatus =
  | "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-valid"
  | "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-invalid";

export interface EdgeLayerSeamHistoryLayerReceiptAdjacentFixture {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  source: {
    seamHistoryObservationArtifactId?: string | undefined;
    seamHistoryObservationStatus?: string | undefined;
    seamHistoryProofRung?: string | undefined;
    seamHistoryProofLabel?: string | undefined;
    layerReceiptObservationArtifactId?: string | undefined;
    layerReceiptObservationStatus?: string | undefined;
    layerReceiptProofRung?: string | undefined;
    layerReceiptProofLabel?: string | undefined;
  };
  correlation: {
    receiptRefMatched: boolean;
    sourceRequestRefMatched: boolean;
    matchingSeamObservationIds: string[];
    matchedReceiptIds: string[];
    matchedReceiptHashes: string[];
    matchedRequestIds: string[];
    matchedRequestHashes: string[];
    preservedSourceRepos: string[];
    preservedSourceRefs: string[];
  };
  proof: {
    strongestProofRung: "local_causal_observation_over_supplied_adjacent_observation_artifacts";
    normalizedProofLabel: "local_supplied_seam_history_layer_receipt_adjacent_fixture";
    suppliedObservationArtifactsOnly: true;
    dhtOrHyperswarmInputObservedByThisOperation: false;
    doesNotUpgradeSourceProof: true;
  };
  nonClaims: {
    canonicalHistoryAccepted: false;
    layerEvidenceAdmitted: false;
    layerAdmissionDecided: false;
    rbcInterpreted: false;
    quorumSatisfied: false;
    authorityGranted: false;
    referentPromoted: false;
    meshPublished: false;
    productionContinuityWritten: false;
  };
  boundary: {
    fixtureOnly: true;
    readsObservationArtifactsOnly: true;
    opensEdgeRuntime: false;
    opensLayerRuntime: false;
    callsEdge: false;
    callsLayer: false;
    writesEdgeProjection: false;
    writesLayerEvidence: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    decidesLayerAdmission: false;
    interpretsRbc: false;
    claimsQuorumSatisfaction: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureStatus;
    seamHistoryObservationConsumed: boolean;
    layerReceiptObservationConsumed: boolean;
    matchingReceiptRefsPreserved: boolean;
    matchingRequestRefsPreserved: boolean;
    sourceRefsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noQuorumSatisfactionClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureStatus;
  warnings: string[];
  rejections: string[];
}

export interface EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceFixtureArtifactId?: string | undefined;
    sourceFixtureStatus?: EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureStatus | undefined;
    seamHistoryObservationArtifactId?: string | undefined;
    layerReceiptObservationArtifactId?: string | undefined;
    fixtureProofRung?: "local_causal_observation_over_supplied_adjacent_observation_artifacts" | undefined;
    fixtureProofLabel?: "local_supplied_seam_history_layer_receipt_adjacent_fixture" | undefined;
  };
  readback: {
    fixtureReadable: boolean;
    fixtureValid: boolean;
    sourceObservationRefsPreserved: boolean;
    matchedReceiptRefsPreserved: boolean;
    matchedRequestRefsPreserved: boolean;
    sourceReposPreserved: boolean;
    sourceRefsPreserved: boolean;
    proofLabelsPreserved: boolean;
    nonClaimsPreserved: boolean;
  };
  preservedRefs: {
    matchingSeamObservationIds: string[];
    matchedReceiptIds: string[];
    matchedReceiptHashes: string[];
    matchedRequestIds: string[];
    matchedRequestHashes: string[];
    preservedSourceRepos: string[];
    preservedSourceRefs: string[];
  };
  boundary: {
    readbackOnly: true;
    writesAdjacentFixture: false;
    opensEdgeRuntime: false;
    opensLayerRuntime: false;
    callsEdge: false;
    callsLayer: false;
    writesEdgeProjection: false;
    writesLayerEvidence: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    decidesLayerAdmission: false;
    interpretsRbc: false;
    claimsQuorumSatisfaction: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadbackStatus;
    fixtureArtifactConsumed: boolean;
    sourceObservationRefsPreserved: boolean;
    matchedReceiptRefsPreserved: boolean;
    matchedRequestRefsPreserved: boolean;
    sourceReposPreserved: boolean;
    sourceRefsPreserved: boolean;
    proofLabelsPreserved: boolean;
    nonClaimsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noQuorumSatisfactionClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadbackStatus;
  warnings: string[];
  rejections: string[];
}

export interface EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  source: {
    seamHistoryObservationArtifactId?: string | undefined;
    seamHistoryObservationStatus?: string | undefined;
    seamHistoryProofRung?: string | undefined;
    seamHistoryProofLabel?: string | undefined;
    layerReceiptObservationArtifactId?: string | undefined;
    layerReceiptObservationStatus?: string | undefined;
    layerReceiptProofRung?: string | undefined;
    layerReceiptProofLabel?: string | undefined;
    adjacentFixtureArtifactId?: string | undefined;
    adjacentFixtureStatus?: EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureStatus | undefined;
    adjacentFixtureProofRung?: string | undefined;
    adjacentFixtureProofLabel?: string | undefined;
  };
  contract: {
    contractKind: "edge_layer_seam_history_layer_receipt_consumer_contract_snapshot";
    consumeAs: "causal_observation_snapshot_only";
    seamClassifications: {
      compatibleObservationIds: string[];
      unresolvedOrDamagedObservationIds: string[];
      damagedObservationIds: string[];
      unresolvedObservationIds: string[];
      compatibilityBasis: "request_receipt_linkage_only";
    };
    layerRuntimeRefs: {
      receiptId?: string | undefined;
      receiptHash?: string | undefined;
      sourceRequestId?: string | undefined;
      sourceRequestHash?: string | undefined;
      runtimeEvidenceId?: string | undefined;
      runtimeEvidenceHash?: string | undefined;
      runtimeTraceRef?: string | undefined;
      durableReceiptRef?: string | undefined;
    };
    adjacentMatchedRefs: EdgeLayerSeamHistoryLayerReceiptAdjacentFixture["correlation"];
    preservedSourceRefs: {
      sourceRepos: string[];
      sourceRefs: string[];
    };
  };
  proof: {
    strongestProofRung: "local_causal_observation_over_supplied_edge_layer_observation_artifacts";
    normalizedProofLabel: "local_supplied_edge_layer_consumer_contract_snapshot";
    suppliedObservationArtifactsOnly: true;
    dhtOrHyperswarmInputObservedByThisOperation: false;
    doesNotUpgradeSourceProof: true;
  };
  nonClaims: {
    canonicalHistoryAccepted: false;
    layerEvidenceAdmitted: false;
    layerAdmissionDecided: false;
    rbcInterpreted: false;
    quorumSatisfied: false;
    authorityGranted: false;
    referentPromoted: false;
    meshPublished: false;
    productionContinuityWritten: false;
  };
  boundary: {
    snapshotOnly: true;
    readsObservationArtifactsOnly: true;
    edgeMayConsume: true;
    layerMayConsume: true;
    opensEdgeRuntime: false;
    opensLayerRuntime: false;
    callsEdge: false;
    callsLayer: false;
    writesEdgeProjection: false;
    writesLayerEvidence: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    decidesLayerAdmission: false;
    interpretsRbc: false;
    claimsQuorumSatisfaction: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotStatus;
    seamHistoryObservationConsumed: boolean;
    layerReceiptObservationConsumed: boolean;
    adjacentFixtureConsumed: boolean;
    compatibleClassificationPreserved: boolean;
    unresolvedOrDamagedClassificationPreserved: boolean;
    layerRuntimeRefsPreserved: boolean;
    adjacentMatchedRefsPreserved: boolean;
    sourceRefsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noQuorumSatisfactionClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotStatus;
  warnings: string[];
  rejections: string[];
}

export interface EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceSnapshotArtifactId?: string | undefined;
    sourceSnapshotStatus?: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotStatus | undefined;
    seamHistoryObservationArtifactId?: string | undefined;
    layerReceiptObservationArtifactId?: string | undefined;
    adjacentFixtureArtifactId?: string | undefined;
    snapshotProofRung?: "local_causal_observation_over_supplied_edge_layer_observation_artifacts" | undefined;
    snapshotProofLabel?: "local_supplied_edge_layer_consumer_contract_snapshot" | undefined;
  };
  readback: {
    snapshotReadable: boolean;
    snapshotValid: boolean;
    sourceObservationRefsPreserved: boolean;
    seamClassificationsPreserved: boolean;
    layerRuntimeRefsPreserved: boolean;
    adjacentMatchedRefsPreserved: boolean;
    sourceRefsPreserved: boolean;
    proofLabelsPreserved: boolean;
    nonClaimsPreserved: boolean;
  };
  preservedRefs: {
    compatibleObservationIds: string[];
    unresolvedOrDamagedObservationIds: string[];
    damagedObservationIds: string[];
    unresolvedObservationIds: string[];
    layerRuntimeRefs: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot["contract"]["layerRuntimeRefs"];
    matchedReceiptIds: string[];
    matchedReceiptHashes: string[];
    matchedRequestIds: string[];
    matchedRequestHashes: string[];
    preservedSourceRepos: string[];
    preservedSourceRefs: string[];
  };
  boundary: {
    readbackOnly: true;
    writesSnapshot: false;
    opensEdgeRuntime: false;
    opensLayerRuntime: false;
    callsEdge: false;
    callsLayer: false;
    writesEdgeProjection: false;
    writesLayerEvidence: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    decidesLayerAdmission: false;
    interpretsRbc: false;
    claimsQuorumSatisfaction: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadbackStatus;
    snapshotArtifactConsumed: boolean;
    sourceObservationRefsPreserved: boolean;
    seamClassificationsPreserved: boolean;
    layerRuntimeRefsPreserved: boolean;
    adjacentMatchedRefsPreserved: boolean;
    sourceRefsPreserved: boolean;
    proofLabelsPreserved: boolean;
    nonClaimsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noQuorumSatisfactionClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadbackStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixture(input: {
  seamHistoryObservation: unknown;
  layerReceiptObservation: unknown;
  emittedAt: string;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryLayerReceiptAdjacentFixture {
  const seamHistoryObservation = parseSeamHistoryObservation(input.seamHistoryObservation);
  const layerReceiptObservation = parseLayerReceiptObservation(input.layerReceiptObservation);
  const issues: string[] = [];
  if (!seamHistoryObservation) issues.push("seam-history-observation-invalid");
  if (!layerReceiptObservation) issues.push("layer-receipt-observation-invalid");

  const layerReceiptRefs = layerReceiptObservation?.receiptRefs;
  const matchingSeamObservations = seamHistoryObservation && layerReceiptRefs
    ? seamHistoryObservation.observations.filter((observation) =>
        observation.receipt.id === layerReceiptRefs.receiptId &&
        observation.receipt.hash === layerReceiptRefs.receiptHash
      )
    : [];
  const sourceRequestMatches = matchingSeamObservations.filter((observation) =>
    observation.request.id === layerReceiptRefs?.sourceRequestId &&
    observation.request.hash === layerReceiptRefs?.sourceRequestHash
  );
  if (seamHistoryObservation && layerReceiptObservation && matchingSeamObservations.length === 0) {
    issues.push("matching-receipt-refs-not-found");
  }
  if (seamHistoryObservation && layerReceiptObservation && sourceRequestMatches.length === 0) {
    issues.push("matching-request-refs-not-found");
  }

  const status: EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureStatus =
    !seamHistoryObservation || !layerReceiptObservation
      ? "edge-layer-seam-history-layer-receipt-adjacent-fixture-invalid"
      : issues.length === 0
        ? "edge-layer-seam-history-layer-receipt-adjacent-fixture-ready"
        : "edge-layer-seam-history-layer-receipt-adjacent-fixture-incomplete";
  const preservedSourceRepos = uniqueStrings([
    ...(seamHistoryObservation?.source.sourceRepos ?? []),
    ...(layerReceiptObservation?.receiptRefs.sourceRepos ?? []),
  ]);
  const preservedSourceRefs = uniqueStrings([
    ...(matchingSeamObservations.flatMap((observation) => observation.sourceRefs)),
    ...(layerReceiptObservation?.receiptRefs.sourceRefs ?? []),
  ]);
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-layer-receipt-adjacent-fixture:${hash(stableJson({
      emittedAt: input.emittedAt,
      seamHistoryObservationArtifactId: seamHistoryObservation?.artifactId,
      layerReceiptObservationArtifactId: layerReceiptObservation?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(seamHistoryObservation ? { seamHistoryObservationArtifactId: seamHistoryObservation.artifactId } : {}),
      ...(seamHistoryObservation ? { seamHistoryObservationStatus: seamHistoryObservation.reviewStatus } : {}),
      ...(seamHistoryObservation ? { seamHistoryProofRung: seamHistoryObservation.proof.strongestProofRung } : {}),
      ...(seamHistoryObservation ? { seamHistoryProofLabel: seamHistoryObservation.proof.normalizedProofLabel } : {}),
      ...(layerReceiptObservation ? { layerReceiptObservationArtifactId: layerReceiptObservation.artifactId } : {}),
      ...(layerReceiptObservation ? { layerReceiptObservationStatus: layerReceiptObservation.reviewStatus } : {}),
      ...(layerReceiptObservation ? { layerReceiptProofRung: layerReceiptObservation.proof.strongestProofRung } : {}),
      ...(layerReceiptObservation ? { layerReceiptProofLabel: layerReceiptObservation.proof.normalizedProofLabel } : {}),
    },
    correlation: {
      receiptRefMatched: matchingSeamObservations.length > 0,
      sourceRequestRefMatched: sourceRequestMatches.length > 0,
      matchingSeamObservationIds: sourceRequestMatches.map((observation) => observation.observationId),
      matchedReceiptIds: uniqueStrings(sourceRequestMatches.map((observation) => observation.receipt.id)),
      matchedReceiptHashes: uniqueStrings(sourceRequestMatches.map((observation) => observation.receipt.hash)),
      matchedRequestIds: uniqueStrings(sourceRequestMatches.map((observation) => observation.request.id)),
      matchedRequestHashes: uniqueStrings(sourceRequestMatches.map((observation) => observation.request.hash)),
      preservedSourceRepos,
      preservedSourceRefs,
    },
    proof: {
      strongestProofRung: "local_causal_observation_over_supplied_adjacent_observation_artifacts",
      normalizedProofLabel: "local_supplied_seam_history_layer_receipt_adjacent_fixture",
      suppliedObservationArtifactsOnly: true,
      dhtOrHyperswarmInputObservedByThisOperation: false,
      doesNotUpgradeSourceProof: true,
    },
    nonClaims: buildNonClaims(),
    boundary: buildBoundary(),
    validation: {
      status,
      seamHistoryObservationConsumed: seamHistoryObservation !== undefined,
      layerReceiptObservationConsumed: layerReceiptObservation !== undefined,
      matchingReceiptRefsPreserved: matchingSeamObservations.length > 0,
      matchingRequestRefsPreserved: sourceRequestMatches.length > 0,
      sourceRefsPreserved: preservedSourceRefs.length > 0,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noQuorumSatisfactionClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      issues,
    },
    reviewStatus: status,
    warnings: [
      "adjacent-fixture-does-not-upgrade-source-proof-rungs",
      "adjacent-fixture-does-not-admit-layer-evidence",
      "adjacent-fixture-does-not-interpret-rbc",
      "adjacent-fixture-does-not-grant-authority",
    ],
    rejections: status === "edge-layer-seam-history-layer-receipt-adjacent-fixture-ready" ? [] : issues,
  };
}

export function buildEdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback(input: {
  fixture: unknown;
  emittedAt: string;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback {
  const fixture = parseAdjacentFixture(input.fixture);
  const issues = validateAdjacentFixtureReadback(fixture);
  const status: EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadbackStatus = issues.length === 0
    ? "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-valid"
    : "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-invalid";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-layer-receipt-adjacent-fixture-readback:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourceFixtureArtifactId: fixture?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(fixture ? { sourceFixtureArtifactId: fixture.artifactId } : {}),
      ...(fixture ? { sourceFixtureStatus: fixture.reviewStatus } : {}),
      ...(fixture?.source.seamHistoryObservationArtifactId
        ? { seamHistoryObservationArtifactId: fixture.source.seamHistoryObservationArtifactId }
        : {}),
      ...(fixture?.source.layerReceiptObservationArtifactId
        ? { layerReceiptObservationArtifactId: fixture.source.layerReceiptObservationArtifactId }
        : {}),
      ...(fixture ? { fixtureProofRung: fixture.proof.strongestProofRung } : {}),
      ...(fixture ? { fixtureProofLabel: fixture.proof.normalizedProofLabel } : {}),
    },
    readback: {
      fixtureReadable: fixture !== undefined,
      fixtureValid: fixture !== undefined,
      sourceObservationRefsPreserved:
        issues.includes("source-observation-refs-not-preserved") === false && fixture !== undefined,
      matchedReceiptRefsPreserved:
        issues.includes("matched-receipt-refs-not-preserved") === false && fixture !== undefined,
      matchedRequestRefsPreserved:
        issues.includes("matched-request-refs-not-preserved") === false && fixture !== undefined,
      sourceReposPreserved: issues.includes("source-repos-not-preserved") === false && fixture !== undefined,
      sourceRefsPreserved: issues.includes("source-refs-not-preserved") === false && fixture !== undefined,
      proofLabelsPreserved: issues.includes("proof-labels-not-preserved") === false && fixture !== undefined,
      nonClaimsPreserved: issues.includes("non-claims-not-preserved") === false && fixture !== undefined,
    },
    preservedRefs: {
      matchingSeamObservationIds: fixture?.correlation.matchingSeamObservationIds ?? [],
      matchedReceiptIds: fixture?.correlation.matchedReceiptIds ?? [],
      matchedReceiptHashes: fixture?.correlation.matchedReceiptHashes ?? [],
      matchedRequestIds: fixture?.correlation.matchedRequestIds ?? [],
      matchedRequestHashes: fixture?.correlation.matchedRequestHashes ?? [],
      preservedSourceRepos: fixture?.correlation.preservedSourceRepos ?? [],
      preservedSourceRefs: fixture?.correlation.preservedSourceRefs ?? [],
    },
    boundary: buildReadbackBoundary(),
    validation: {
      status,
      fixtureArtifactConsumed: fixture !== undefined,
      sourceObservationRefsPreserved:
        issues.includes("source-observation-refs-not-preserved") === false && fixture !== undefined,
      matchedReceiptRefsPreserved:
        issues.includes("matched-receipt-refs-not-preserved") === false && fixture !== undefined,
      matchedRequestRefsPreserved:
        issues.includes("matched-request-refs-not-preserved") === false && fixture !== undefined,
      sourceReposPreserved: issues.includes("source-repos-not-preserved") === false && fixture !== undefined,
      sourceRefsPreserved: issues.includes("source-refs-not-preserved") === false && fixture !== undefined,
      proofLabelsPreserved: issues.includes("proof-labels-not-preserved") === false && fixture !== undefined,
      nonClaimsPreserved: issues.includes("non-claims-not-preserved") === false && fixture !== undefined,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noQuorumSatisfactionClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      issues,
    },
    reviewStatus: status,
    warnings: status === "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-valid"
      ? [
          "adjacent-fixture-readback-preserves-supplied-fixture-only",
          "adjacent-fixture-readback-does-not-admit-layer-evidence",
          "adjacent-fixture-readback-does-not-interpret-rbc",
          "adjacent-fixture-readback-does-not-grant-authority",
        ]
      : ["adjacent-fixture-readback-invalid"],
    rejections: status === "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-valid" ? [] : issues,
  };
}

export function buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot(input: {
  seamHistoryObservation: unknown;
  layerReceiptObservation: unknown;
  adjacentFixture: unknown;
  emittedAt: string;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot {
  const seamHistoryObservation = parseSeamHistoryObservation(input.seamHistoryObservation);
  const layerReceiptObservation = parseLayerReceiptObservation(input.layerReceiptObservation);
  const adjacentFixture = parseAdjacentFixture(input.adjacentFixture);
  const issues = validateEdgeLayerConsumerContractSnapshot({
    seamHistoryObservation,
    layerReceiptObservation,
    adjacentFixture,
  });
  const status: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotStatus =
    !seamHistoryObservation || !layerReceiptObservation || !adjacentFixture
      ? "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-invalid"
      : issues.length === 0
        ? "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-ready"
        : "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-incomplete";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-edge-layer-consumer-contract-snapshot:${hash(stableJson({
      emittedAt: input.emittedAt,
      seamHistoryObservationArtifactId: seamHistoryObservation?.artifactId,
      layerReceiptObservationArtifactId: layerReceiptObservation?.artifactId,
      adjacentFixtureArtifactId: adjacentFixture?.artifactId,
    })).slice(0, 16)}`;
  const seamClassifications = seamHistoryObservation?.compatibilityEnvelope.classificationSummary;
  const receiptRefs = layerReceiptObservation?.receiptRefs;
  const runtimeRefs = layerReceiptObservation?.runtimeRefs;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(seamHistoryObservation ? { seamHistoryObservationArtifactId: seamHistoryObservation.artifactId } : {}),
      ...(seamHistoryObservation ? { seamHistoryObservationStatus: seamHistoryObservation.reviewStatus } : {}),
      ...(seamHistoryObservation ? { seamHistoryProofRung: seamHistoryObservation.proof.strongestProofRung } : {}),
      ...(seamHistoryObservation ? { seamHistoryProofLabel: seamHistoryObservation.proof.normalizedProofLabel } : {}),
      ...(layerReceiptObservation ? { layerReceiptObservationArtifactId: layerReceiptObservation.artifactId } : {}),
      ...(layerReceiptObservation ? { layerReceiptObservationStatus: layerReceiptObservation.reviewStatus } : {}),
      ...(layerReceiptObservation ? { layerReceiptProofRung: layerReceiptObservation.proof.strongestProofRung } : {}),
      ...(layerReceiptObservation ? { layerReceiptProofLabel: layerReceiptObservation.proof.normalizedProofLabel } : {}),
      ...(adjacentFixture ? { adjacentFixtureArtifactId: adjacentFixture.artifactId } : {}),
      ...(adjacentFixture ? { adjacentFixtureStatus: adjacentFixture.reviewStatus } : {}),
      ...(adjacentFixture ? { adjacentFixtureProofRung: adjacentFixture.proof.strongestProofRung } : {}),
      ...(adjacentFixture ? { adjacentFixtureProofLabel: adjacentFixture.proof.normalizedProofLabel } : {}),
    },
    contract: {
      contractKind: "edge_layer_seam_history_layer_receipt_consumer_contract_snapshot",
      consumeAs: "causal_observation_snapshot_only",
      seamClassifications: {
        compatibleObservationIds: seamClassifications?.compatibleObservationIds ?? [],
        unresolvedOrDamagedObservationIds: seamClassifications?.unresolvedOrDamagedObservationIds ?? [],
        damagedObservationIds: seamClassifications?.damagedObservationIds ?? [],
        unresolvedObservationIds: seamClassifications?.unresolvedObservationIds ?? [],
        compatibilityBasis: "request_receipt_linkage_only",
      },
      layerRuntimeRefs: {
        ...(receiptRefs?.receiptId ? { receiptId: receiptRefs.receiptId } : {}),
        ...(receiptRefs?.receiptHash ? { receiptHash: receiptRefs.receiptHash } : {}),
        ...(receiptRefs?.sourceRequestId ? { sourceRequestId: receiptRefs.sourceRequestId } : {}),
        ...(receiptRefs?.sourceRequestHash ? { sourceRequestHash: receiptRefs.sourceRequestHash } : {}),
        ...(runtimeRefs?.runtimeEvidenceId ? { runtimeEvidenceId: runtimeRefs.runtimeEvidenceId } : {}),
        ...(runtimeRefs?.runtimeEvidenceHash ? { runtimeEvidenceHash: runtimeRefs.runtimeEvidenceHash } : {}),
        ...(runtimeRefs?.runtimeTraceRef ? { runtimeTraceRef: runtimeRefs.runtimeTraceRef } : {}),
        ...(runtimeRefs?.durableReceiptRef ? { durableReceiptRef: runtimeRefs.durableReceiptRef } : {}),
      },
      adjacentMatchedRefs: adjacentFixture?.correlation ?? emptyCorrelation(),
      preservedSourceRefs: {
        sourceRepos: uniqueStrings([
          ...(seamHistoryObservation?.source.sourceRepos ?? []),
          ...(layerReceiptObservation?.receiptRefs.sourceRepos ?? []),
          ...(adjacentFixture?.correlation.preservedSourceRepos ?? []),
        ]),
        sourceRefs: uniqueStrings([
          ...(seamHistoryObservation?.observations.flatMap((observation) => observation.sourceRefs) ?? []),
          ...(layerReceiptObservation?.receiptRefs.sourceRefs ?? []),
          ...(adjacentFixture?.correlation.preservedSourceRefs ?? []),
        ]),
      },
    },
    proof: {
      strongestProofRung: "local_causal_observation_over_supplied_edge_layer_observation_artifacts",
      normalizedProofLabel: "local_supplied_edge_layer_consumer_contract_snapshot",
      suppliedObservationArtifactsOnly: true,
      dhtOrHyperswarmInputObservedByThisOperation: false,
      doesNotUpgradeSourceProof: true,
    },
    nonClaims: buildNonClaims(),
    boundary: buildConsumerContractSnapshotBoundary(),
    validation: {
      status,
      seamHistoryObservationConsumed: seamHistoryObservation !== undefined,
      layerReceiptObservationConsumed: layerReceiptObservation !== undefined,
      adjacentFixtureConsumed: adjacentFixture !== undefined,
      compatibleClassificationPreserved:
        issues.includes("compatible-classification-not-preserved") === false && seamHistoryObservation !== undefined,
      unresolvedOrDamagedClassificationPreserved:
        issues.includes("unresolved-or-damaged-classification-not-preserved") === false &&
        seamHistoryObservation !== undefined,
      layerRuntimeRefsPreserved: issues.includes("layer-runtime-refs-not-preserved") === false &&
        layerReceiptObservation !== undefined,
      adjacentMatchedRefsPreserved: issues.includes("adjacent-matched-refs-not-preserved") === false &&
        adjacentFixture !== undefined,
      sourceRefsPreserved: issues.includes("source-refs-not-preserved") === false &&
        seamHistoryObservation !== undefined &&
        layerReceiptObservation !== undefined &&
        adjacentFixture !== undefined,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noQuorumSatisfactionClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      issues,
    },
    reviewStatus: status,
    warnings: [
      "edge-layer-consumer-contract-snapshot-is-local-supplied-observation-material-only",
      "edge-layer-consumer-contract-snapshot-does-not-admit-layer-evidence",
      "edge-layer-consumer-contract-snapshot-does-not-interpret-rbc",
      "edge-layer-consumer-contract-snapshot-does-not-grant-authority",
      "edge-layer-consumer-contract-snapshot-does-not-write-edge-or-layer-state",
    ],
    rejections: status === "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-ready" ? [] : issues,
  };
}

export function buildEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback(input: {
  snapshot: unknown;
  emittedAt: string;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback {
  const snapshot = parseEdgeLayerConsumerContractSnapshot(input.snapshot);
  const issues = validateEdgeLayerConsumerContractSnapshotReadback(snapshot);
  const status: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadbackStatus = issues.length === 0
    ? "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-valid"
    : "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-invalid";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourceSnapshotArtifactId: snapshot?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(snapshot ? { sourceSnapshotArtifactId: snapshot.artifactId } : {}),
      ...(snapshot ? { sourceSnapshotStatus: snapshot.reviewStatus } : {}),
      ...(snapshot?.source.seamHistoryObservationArtifactId
        ? { seamHistoryObservationArtifactId: snapshot.source.seamHistoryObservationArtifactId }
        : {}),
      ...(snapshot?.source.layerReceiptObservationArtifactId
        ? { layerReceiptObservationArtifactId: snapshot.source.layerReceiptObservationArtifactId }
        : {}),
      ...(snapshot?.source.adjacentFixtureArtifactId
        ? { adjacentFixtureArtifactId: snapshot.source.adjacentFixtureArtifactId }
        : {}),
      ...(snapshot ? { snapshotProofRung: snapshot.proof.strongestProofRung } : {}),
      ...(snapshot ? { snapshotProofLabel: snapshot.proof.normalizedProofLabel } : {}),
    },
    readback: {
      snapshotReadable: snapshot !== undefined,
      snapshotValid: snapshot !== undefined,
      sourceObservationRefsPreserved:
        issues.includes("source-observation-refs-not-preserved") === false && snapshot !== undefined,
      seamClassificationsPreserved:
        issues.includes("seam-classifications-not-preserved") === false && snapshot !== undefined,
      layerRuntimeRefsPreserved:
        issues.includes("layer-runtime-refs-not-preserved") === false && snapshot !== undefined,
      adjacentMatchedRefsPreserved:
        issues.includes("adjacent-matched-refs-not-preserved") === false && snapshot !== undefined,
      sourceRefsPreserved: issues.includes("source-refs-not-preserved") === false && snapshot !== undefined,
      proofLabelsPreserved: issues.includes("proof-labels-not-preserved") === false && snapshot !== undefined,
      nonClaimsPreserved: issues.includes("non-claims-not-preserved") === false && snapshot !== undefined,
    },
    preservedRefs: {
      compatibleObservationIds: snapshot?.contract.seamClassifications.compatibleObservationIds ?? [],
      unresolvedOrDamagedObservationIds:
        snapshot?.contract.seamClassifications.unresolvedOrDamagedObservationIds ?? [],
      damagedObservationIds: snapshot?.contract.seamClassifications.damagedObservationIds ?? [],
      unresolvedObservationIds: snapshot?.contract.seamClassifications.unresolvedObservationIds ?? [],
      layerRuntimeRefs: snapshot?.contract.layerRuntimeRefs ?? {},
      matchedReceiptIds: snapshot?.contract.adjacentMatchedRefs.matchedReceiptIds ?? [],
      matchedReceiptHashes: snapshot?.contract.adjacentMatchedRefs.matchedReceiptHashes ?? [],
      matchedRequestIds: snapshot?.contract.adjacentMatchedRefs.matchedRequestIds ?? [],
      matchedRequestHashes: snapshot?.contract.adjacentMatchedRefs.matchedRequestHashes ?? [],
      preservedSourceRepos: snapshot?.contract.preservedSourceRefs.sourceRepos ?? [],
      preservedSourceRefs: snapshot?.contract.preservedSourceRefs.sourceRefs ?? [],
    },
    boundary: buildConsumerContractSnapshotReadbackBoundary(),
    validation: {
      status,
      snapshotArtifactConsumed: snapshot !== undefined,
      sourceObservationRefsPreserved:
        issues.includes("source-observation-refs-not-preserved") === false && snapshot !== undefined,
      seamClassificationsPreserved:
        issues.includes("seam-classifications-not-preserved") === false && snapshot !== undefined,
      layerRuntimeRefsPreserved:
        issues.includes("layer-runtime-refs-not-preserved") === false && snapshot !== undefined,
      adjacentMatchedRefsPreserved:
        issues.includes("adjacent-matched-refs-not-preserved") === false && snapshot !== undefined,
      sourceRefsPreserved: issues.includes("source-refs-not-preserved") === false && snapshot !== undefined,
      proofLabelsPreserved: issues.includes("proof-labels-not-preserved") === false && snapshot !== undefined,
      nonClaimsPreserved: issues.includes("non-claims-not-preserved") === false && snapshot !== undefined,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noQuorumSatisfactionClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      issues,
    },
    reviewStatus: status,
    warnings: status === "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-valid"
      ? [
          "edge-layer-consumer-contract-snapshot-readback-preserves-supplied-snapshot-only",
          "edge-layer-consumer-contract-snapshot-readback-does-not-admit-layer-evidence",
          "edge-layer-consumer-contract-snapshot-readback-does-not-interpret-rbc",
          "edge-layer-consumer-contract-snapshot-readback-does-not-grant-authority",
        ]
      : ["edge-layer-consumer-contract-snapshot-readback-invalid"],
    rejections: status === "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-valid"
      ? []
      : issues,
  };
}

export function assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixture(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryLayerReceiptAdjacentFixture {
  const candidate = assertObject(value, "edge layer seam history layer receipt adjacent fixture");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.strongestProofRung,
    "local_causal_observation_over_supplied_adjacent_observation_artifacts",
    "proof.strongestProofRung",
  );
  assertEqual(
    proof.normalizedProofLabel,
    "local_supplied_seam_history_layer_receipt_adjacent_fixture",
    "proof.normalizedProofLabel",
  );
  assertEqual(proof.suppliedObservationArtifactsOnly, true, "proof.suppliedObservationArtifactsOnly");
  assertEqual(
    proof.dhtOrHyperswarmInputObservedByThisOperation,
    false,
    "proof.dhtOrHyperswarmInputObservedByThisOperation",
  );
  assertEqual(proof.doesNotUpgradeSourceProof, true, "proof.doesNotUpgradeSourceProof");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.fixtureOnly, true, "boundary.fixtureOnly");
  assertEqual(boundary.readsObservationArtifactsOnly, true, "boundary.readsObservationArtifactsOnly");
  assertEqual(boundary.opensEdgeRuntime, false, "boundary.opensEdgeRuntime");
  assertEqual(boundary.opensLayerRuntime, false, "boundary.opensLayerRuntime");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.callsLayer, false, "boundary.callsLayer");
  assertEqual(boundary.writesEdgeProjection, false, "boundary.writesEdgeProjection");
  assertEqual(boundary.writesLayerEvidence, false, "boundary.writesLayerEvidence");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.decidesLayerAdmission, false, "boundary.decidesLayerAdmission");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.claimsQuorumSatisfaction, false, "boundary.claimsQuorumSatisfaction");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noQuorumSatisfactionClaim, true, "validation.noQuorumSatisfactionClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(
    validation.noProductionContinuityWriteClaim,
    true,
    "validation.noProductionContinuityWriteClaim",
  );
  const nonClaims = assertObject(candidate.nonClaims, "nonClaims");
  assertEqual(nonClaims.canonicalHistoryAccepted, false, "nonClaims.canonicalHistoryAccepted");
  assertEqual(nonClaims.layerEvidenceAdmitted, false, "nonClaims.layerEvidenceAdmitted");
  assertEqual(nonClaims.layerAdmissionDecided, false, "nonClaims.layerAdmissionDecided");
  assertEqual(nonClaims.rbcInterpreted, false, "nonClaims.rbcInterpreted");
  assertEqual(nonClaims.quorumSatisfied, false, "nonClaims.quorumSatisfied");
  assertEqual(nonClaims.authorityGranted, false, "nonClaims.authorityGranted");
  assertEqual(nonClaims.referentPromoted, false, "nonClaims.referentPromoted");
  assertEqual(nonClaims.meshPublished, false, "nonClaims.meshPublished");
  assertEqual(nonClaims.productionContinuityWritten, false, "nonClaims.productionContinuityWritten");
  assertStatus(candidate.reviewStatus, "reviewStatus");
}

export function assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback {
  const candidate = assertObject(value, "edge layer seam history layer receipt adjacent fixture readback");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_LAYER_RECEIPT_ADJACENT_FIXTURE_READBACK_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.readbackOnly, true, "boundary.readbackOnly");
  assertEqual(boundary.writesAdjacentFixture, false, "boundary.writesAdjacentFixture");
  assertEqual(boundary.opensEdgeRuntime, false, "boundary.opensEdgeRuntime");
  assertEqual(boundary.opensLayerRuntime, false, "boundary.opensLayerRuntime");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.callsLayer, false, "boundary.callsLayer");
  assertEqual(boundary.writesEdgeProjection, false, "boundary.writesEdgeProjection");
  assertEqual(boundary.writesLayerEvidence, false, "boundary.writesLayerEvidence");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.decidesLayerAdmission, false, "boundary.decidesLayerAdmission");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.claimsQuorumSatisfaction, false, "boundary.claimsQuorumSatisfaction");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertReadbackStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noQuorumSatisfactionClaim, true, "validation.noQuorumSatisfactionClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(
    validation.noProductionContinuityWriteClaim,
    true,
    "validation.noProductionContinuityWriteClaim",
  );
  assertReadbackStatus(candidate.reviewStatus, "reviewStatus");
}

export function assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot {
  const candidate = assertObject(value, "edge layer consumer contract snapshot");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(
    candidate.schema,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_SCHEMA,
    "schema",
  );
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const contract = assertObject(candidate.contract, "contract");
  assertEqual(
    contract.contractKind,
    "edge_layer_seam_history_layer_receipt_consumer_contract_snapshot",
    "contract.contractKind",
  );
  assertEqual(contract.consumeAs, "causal_observation_snapshot_only", "contract.consumeAs");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.strongestProofRung,
    "local_causal_observation_over_supplied_edge_layer_observation_artifacts",
    "proof.strongestProofRung",
  );
  assertEqual(
    proof.normalizedProofLabel,
    "local_supplied_edge_layer_consumer_contract_snapshot",
    "proof.normalizedProofLabel",
  );
  assertEqual(proof.suppliedObservationArtifactsOnly, true, "proof.suppliedObservationArtifactsOnly");
  assertEqual(proof.dhtOrHyperswarmInputObservedByThisOperation, false, "proof.dhtOrHyperswarmInputObservedByThisOperation");
  assertEqual(proof.doesNotUpgradeSourceProof, true, "proof.doesNotUpgradeSourceProof");
  assertNonClaims(candidate.nonClaims, "nonClaims");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.snapshotOnly, true, "boundary.snapshotOnly");
  assertEqual(boundary.readsObservationArtifactsOnly, true, "boundary.readsObservationArtifactsOnly");
  assertEqual(boundary.edgeMayConsume, true, "boundary.edgeMayConsume");
  assertEqual(boundary.layerMayConsume, true, "boundary.layerMayConsume");
  assertEqual(boundary.opensEdgeRuntime, false, "boundary.opensEdgeRuntime");
  assertEqual(boundary.opensLayerRuntime, false, "boundary.opensLayerRuntime");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.callsLayer, false, "boundary.callsLayer");
  assertEqual(boundary.writesEdgeProjection, false, "boundary.writesEdgeProjection");
  assertEqual(boundary.writesLayerEvidence, false, "boundary.writesLayerEvidence");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.decidesLayerAdmission, false, "boundary.decidesLayerAdmission");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.claimsQuorumSatisfaction, false, "boundary.claimsQuorumSatisfaction");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertConsumerContractSnapshotStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noQuorumSatisfactionClaim, true, "validation.noQuorumSatisfactionClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertConsumerContractSnapshotStatus(candidate.reviewStatus, "reviewStatus");
}

export function assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback {
  const candidate = assertObject(value, "edge layer consumer contract snapshot readback");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(
    candidate.schema,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_LAYER_CONSUMER_CONTRACT_SNAPSHOT_READBACK_SCHEMA,
    "schema",
  );
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.readbackOnly, true, "boundary.readbackOnly");
  assertEqual(boundary.writesSnapshot, false, "boundary.writesSnapshot");
  assertEqual(boundary.opensEdgeRuntime, false, "boundary.opensEdgeRuntime");
  assertEqual(boundary.opensLayerRuntime, false, "boundary.opensLayerRuntime");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.callsLayer, false, "boundary.callsLayer");
  assertEqual(boundary.writesEdgeProjection, false, "boundary.writesEdgeProjection");
  assertEqual(boundary.writesLayerEvidence, false, "boundary.writesLayerEvidence");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.decidesLayerAdmission, false, "boundary.decidesLayerAdmission");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.claimsQuorumSatisfaction, false, "boundary.claimsQuorumSatisfaction");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertConsumerContractSnapshotReadbackStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noQuorumSatisfactionClaim, true, "validation.noQuorumSatisfactionClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertConsumerContractSnapshotReadbackStatus(candidate.reviewStatus, "reviewStatus");
}

function parseEdgeLayerConsumerContractSnapshot(
  value: unknown,
): EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot | undefined {
  try {
    assertEdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot(value);
    return value;
  } catch {
    return undefined;
  }
}

function parseAdjacentFixture(value: unknown): EdgeLayerSeamHistoryLayerReceiptAdjacentFixture | undefined {
  try {
    assertEdgeLayerSeamHistoryLayerReceiptAdjacentFixture(value);
    return value;
  } catch {
    return undefined;
  }
}

function parseSeamHistoryObservation(value: unknown): EdgeLayerSeamHistoryObservationResult | undefined {
  try {
    assertEdgeLayerSeamHistoryObservationResult(value);
    return value;
  } catch {
    return undefined;
  }
}

function parseLayerReceiptObservation(value: unknown): LayerReceiptRuntimeEvidenceObservation | undefined {
  try {
    assertLayerReceiptRuntimeEvidenceObservation(value);
    return value;
  } catch {
    return undefined;
  }
}

function validateAdjacentFixtureReadback(
  fixture: EdgeLayerSeamHistoryLayerReceiptAdjacentFixture | undefined,
): string[] {
  const issues: string[] = [];
  if (!fixture) return ["adjacent-fixture-invalid"];
  if (!fixture.source.seamHistoryObservationArtifactId || !fixture.source.layerReceiptObservationArtifactId) {
    issues.push("source-observation-refs-not-preserved");
  }
  if (fixture.correlation.matchedReceiptIds.length === 0 || fixture.correlation.matchedReceiptHashes.length === 0) {
    issues.push("matched-receipt-refs-not-preserved");
  }
  if (fixture.correlation.matchedRequestIds.length === 0 || fixture.correlation.matchedRequestHashes.length === 0) {
    issues.push("matched-request-refs-not-preserved");
  }
  if (fixture.correlation.preservedSourceRepos.length === 0) {
    issues.push("source-repos-not-preserved");
  }
  if (fixture.correlation.preservedSourceRefs.length === 0) {
    issues.push("source-refs-not-preserved");
  }
  if (
    fixture.proof.strongestProofRung !== "local_causal_observation_over_supplied_adjacent_observation_artifacts" ||
    fixture.proof.normalizedProofLabel !== "local_supplied_seam_history_layer_receipt_adjacent_fixture" ||
    fixture.proof.dhtOrHyperswarmInputObservedByThisOperation !== false ||
    fixture.proof.doesNotUpgradeSourceProof !== true
  ) {
    issues.push("proof-labels-not-preserved");
  }
  if (
    fixture.nonClaims.canonicalHistoryAccepted ||
    fixture.nonClaims.layerEvidenceAdmitted ||
    fixture.nonClaims.layerAdmissionDecided ||
    fixture.nonClaims.rbcInterpreted ||
    fixture.nonClaims.quorumSatisfied ||
    fixture.nonClaims.authorityGranted ||
    fixture.nonClaims.referentPromoted ||
    fixture.nonClaims.meshPublished ||
    fixture.nonClaims.productionContinuityWritten ||
    fixture.boundary.acceptsCanonicalHistory ||
    fixture.boundary.admitsLayerEvidence ||
    fixture.boundary.decidesLayerAdmission ||
    fixture.boundary.interpretsRbc ||
    fixture.boundary.claimsQuorumSatisfaction ||
    fixture.boundary.grantsAuthority ||
    fixture.boundary.promotesReferents ||
    fixture.boundary.publishesToMesh ||
    fixture.boundary.writesProductionContinuity
  ) {
    issues.push("non-claims-not-preserved");
  }
  return [...new Set(issues)];
}

function validateEdgeLayerConsumerContractSnapshotReadback(
  snapshot: EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot | undefined,
): string[] {
  const issues: string[] = [];
  if (!snapshot) return ["edge-layer-consumer-contract-snapshot-invalid"];
  if (
    !snapshot.source.seamHistoryObservationArtifactId ||
    !snapshot.source.layerReceiptObservationArtifactId ||
    !snapshot.source.adjacentFixtureArtifactId
  ) {
    issues.push("source-observation-refs-not-preserved");
  }
  if (
    snapshot.contract.seamClassifications.compatibilityBasis !== "request_receipt_linkage_only" ||
    snapshot.contract.seamClassifications.compatibleObservationIds.length === 0 ||
    snapshot.contract.seamClassifications.unresolvedOrDamagedObservationIds.length === 0
  ) {
    issues.push("seam-classifications-not-preserved");
  }
  if (
    !snapshot.contract.layerRuntimeRefs.receiptId ||
    !snapshot.contract.layerRuntimeRefs.receiptHash ||
    !snapshot.contract.layerRuntimeRefs.sourceRequestId ||
    !snapshot.contract.layerRuntimeRefs.sourceRequestHash ||
    !snapshot.contract.layerRuntimeRefs.runtimeEvidenceId ||
    !snapshot.contract.layerRuntimeRefs.runtimeEvidenceHash ||
    !snapshot.contract.layerRuntimeRefs.runtimeTraceRef ||
    !snapshot.contract.layerRuntimeRefs.durableReceiptRef
  ) {
    issues.push("layer-runtime-refs-not-preserved");
  }
  if (
    snapshot.contract.adjacentMatchedRefs.matchedReceiptIds.length === 0 ||
    snapshot.contract.adjacentMatchedRefs.matchedReceiptHashes.length === 0 ||
    snapshot.contract.adjacentMatchedRefs.matchedRequestIds.length === 0 ||
    snapshot.contract.adjacentMatchedRefs.matchedRequestHashes.length === 0
  ) {
    issues.push("adjacent-matched-refs-not-preserved");
  }
  if (
    snapshot.contract.preservedSourceRefs.sourceRepos.length === 0 ||
    snapshot.contract.preservedSourceRefs.sourceRefs.length === 0
  ) {
    issues.push("source-refs-not-preserved");
  }
  if (
    snapshot.proof.strongestProofRung !==
      "local_causal_observation_over_supplied_edge_layer_observation_artifacts" ||
    snapshot.proof.normalizedProofLabel !== "local_supplied_edge_layer_consumer_contract_snapshot" ||
    snapshot.proof.suppliedObservationArtifactsOnly !== true ||
    snapshot.proof.dhtOrHyperswarmInputObservedByThisOperation !== false ||
    snapshot.proof.doesNotUpgradeSourceProof !== true
  ) {
    issues.push("proof-labels-not-preserved");
  }
  if (
    snapshot.nonClaims.canonicalHistoryAccepted ||
    snapshot.nonClaims.layerEvidenceAdmitted ||
    snapshot.nonClaims.layerAdmissionDecided ||
    snapshot.nonClaims.rbcInterpreted ||
    snapshot.nonClaims.quorumSatisfied ||
    snapshot.nonClaims.authorityGranted ||
    snapshot.nonClaims.referentPromoted ||
    snapshot.nonClaims.meshPublished ||
    snapshot.nonClaims.productionContinuityWritten ||
    snapshot.boundary.acceptsCanonicalHistory ||
    snapshot.boundary.admitsLayerEvidence ||
    snapshot.boundary.decidesLayerAdmission ||
    snapshot.boundary.interpretsRbc ||
    snapshot.boundary.claimsQuorumSatisfaction ||
    snapshot.boundary.grantsAuthority ||
    snapshot.boundary.promotesReferents ||
    snapshot.boundary.publishesToMesh ||
    snapshot.boundary.writesProductionContinuity
  ) {
    issues.push("non-claims-not-preserved");
  }
  return [...new Set(issues)];
}

function validateEdgeLayerConsumerContractSnapshot(input: {
  seamHistoryObservation: EdgeLayerSeamHistoryObservationResult | undefined;
  layerReceiptObservation: LayerReceiptRuntimeEvidenceObservation | undefined;
  adjacentFixture: EdgeLayerSeamHistoryLayerReceiptAdjacentFixture | undefined;
}): string[] {
  const issues: string[] = [];
  if (!input.seamHistoryObservation) issues.push("seam-history-observation-invalid");
  if (!input.layerReceiptObservation) issues.push("layer-receipt-observation-invalid");
  if (!input.adjacentFixture) issues.push("adjacent-fixture-invalid");
  if (!input.seamHistoryObservation || !input.layerReceiptObservation || !input.adjacentFixture) {
    return [...new Set(issues)];
  }
  const classifications = input.seamHistoryObservation.compatibilityEnvelope.classificationSummary;
  if (classifications.compatibleObservationIds.length === 0) {
    issues.push("compatible-classification-not-preserved");
  }
  if (classifications.unresolvedOrDamagedObservationIds.length === 0) {
    issues.push("unresolved-or-damaged-classification-not-preserved");
  }
  if (
    !input.layerReceiptObservation.runtimeRefs.runtimeEvidenceId ||
    !input.layerReceiptObservation.runtimeRefs.runtimeEvidenceHash ||
    !input.layerReceiptObservation.runtimeRefs.runtimeTraceRef ||
    !input.layerReceiptObservation.runtimeRefs.durableReceiptRef
  ) {
    issues.push("layer-runtime-refs-not-preserved");
  }
  if (
    input.adjacentFixture.reviewStatus !== "edge-layer-seam-history-layer-receipt-adjacent-fixture-ready" ||
    input.adjacentFixture.correlation.matchedReceiptIds.length === 0 ||
    input.adjacentFixture.correlation.matchedRequestIds.length === 0
  ) {
    issues.push("adjacent-matched-refs-not-preserved");
  }
  if (
    input.seamHistoryObservation.observations.flatMap((observation) => observation.sourceRefs).length === 0 ||
    input.layerReceiptObservation.receiptRefs.sourceRefs.length === 0 ||
    input.adjacentFixture.correlation.preservedSourceRefs.length === 0
  ) {
    issues.push("source-refs-not-preserved");
  }
  return [...new Set(issues)];
}

function buildNonClaims(): EdgeLayerSeamHistoryLayerReceiptAdjacentFixture["nonClaims"] {
  return {
    canonicalHistoryAccepted: false,
    layerEvidenceAdmitted: false,
    layerAdmissionDecided: false,
    rbcInterpreted: false,
    quorumSatisfied: false,
    authorityGranted: false,
    referentPromoted: false,
    meshPublished: false,
    productionContinuityWritten: false,
  };
}

function buildReadbackBoundary(): EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadback["boundary"] {
  return {
    readbackOnly: true,
    writesAdjacentFixture: false,
    opensEdgeRuntime: false,
    opensLayerRuntime: false,
    callsEdge: false,
    callsLayer: false,
    writesEdgeProjection: false,
    writesLayerEvidence: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    decidesLayerAdmission: false,
    interpretsRbc: false,
    claimsQuorumSatisfaction: false,
    grantsAuthority: false,
    promotesReferents: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
}

function buildConsumerContractSnapshotBoundary(): EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshot["boundary"] {
  return {
    snapshotOnly: true,
    readsObservationArtifactsOnly: true,
    edgeMayConsume: true,
    layerMayConsume: true,
    opensEdgeRuntime: false,
    opensLayerRuntime: false,
    callsEdge: false,
    callsLayer: false,
    writesEdgeProjection: false,
    writesLayerEvidence: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    decidesLayerAdmission: false,
    interpretsRbc: false,
    claimsQuorumSatisfaction: false,
    grantsAuthority: false,
    promotesReferents: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
}

function buildConsumerContractSnapshotReadbackBoundary():
  EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadback["boundary"] {
  return {
    readbackOnly: true,
    writesSnapshot: false,
    opensEdgeRuntime: false,
    opensLayerRuntime: false,
    callsEdge: false,
    callsLayer: false,
    writesEdgeProjection: false,
    writesLayerEvidence: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    decidesLayerAdmission: false,
    interpretsRbc: false,
    claimsQuorumSatisfaction: false,
    grantsAuthority: false,
    promotesReferents: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
}

function emptyCorrelation(): EdgeLayerSeamHistoryLayerReceiptAdjacentFixture["correlation"] {
  return {
    receiptRefMatched: false,
    sourceRequestRefMatched: false,
    matchingSeamObservationIds: [],
    matchedReceiptIds: [],
    matchedReceiptHashes: [],
    matchedRequestIds: [],
    matchedRequestHashes: [],
    preservedSourceRepos: [],
    preservedSourceRefs: [],
  };
}

function buildBoundary(): EdgeLayerSeamHistoryLayerReceiptAdjacentFixture["boundary"] {
  return {
    fixtureOnly: true,
    readsObservationArtifactsOnly: true,
    opensEdgeRuntime: false,
    opensLayerRuntime: false,
    callsEdge: false,
    callsLayer: false,
    writesEdgeProjection: false,
    writesLayerEvidence: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    decidesLayerAdmission: false,
    interpretsRbc: false,
    claimsQuorumSatisfaction: false,
    grantsAuthority: false,
    promotesReferents: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
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

function assertStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureStatus {
  if (
    value !== "edge-layer-seam-history-layer-receipt-adjacent-fixture-ready" &&
    value !== "edge-layer-seam-history-layer-receipt-adjacent-fixture-incomplete" &&
    value !== "edge-layer-seam-history-layer-receipt-adjacent-fixture-invalid"
  ) {
    throw new Error(`${label} must be an edge layer seam history layer receipt adjacent fixture status`);
  }
}

function assertReadbackStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadbackStatus {
  if (
    value !== "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-valid" &&
    value !== "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-invalid"
  ) {
    throw new Error(`${label} must be an edge layer seam history layer receipt adjacent fixture readback status`);
  }
}

function assertNonClaims(value: unknown, label: string): void {
  const nonClaims = assertObject(value, label);
  assertEqual(nonClaims.canonicalHistoryAccepted, false, `${label}.canonicalHistoryAccepted`);
  assertEqual(nonClaims.layerEvidenceAdmitted, false, `${label}.layerEvidenceAdmitted`);
  assertEqual(nonClaims.layerAdmissionDecided, false, `${label}.layerAdmissionDecided`);
  assertEqual(nonClaims.rbcInterpreted, false, `${label}.rbcInterpreted`);
  assertEqual(nonClaims.quorumSatisfied, false, `${label}.quorumSatisfied`);
  assertEqual(nonClaims.authorityGranted, false, `${label}.authorityGranted`);
  assertEqual(nonClaims.referentPromoted, false, `${label}.referentPromoted`);
  assertEqual(nonClaims.meshPublished, false, `${label}.meshPublished`);
  assertEqual(nonClaims.productionContinuityWritten, false, `${label}.productionContinuityWritten`);
}

function assertConsumerContractSnapshotStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotStatus {
  if (
    value !== "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-ready" &&
    value !== "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-incomplete" &&
    value !== "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-invalid"
  ) {
    throw new Error(`${label} must be an edge layer consumer contract snapshot status`);
  }
}

function assertConsumerContractSnapshotReadbackStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryEdgeLayerConsumerContractSnapshotReadbackStatus {
  if (
    value !== "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-valid" &&
    value !== "edge-layer-seam-history-edge-layer-consumer-contract-snapshot-readback-invalid"
  ) {
    throw new Error(`${label} must be an edge layer consumer contract snapshot readback status`);
  }
}
