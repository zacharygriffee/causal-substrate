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

export type EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureStatus =
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-ready"
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-incomplete"
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-invalid";

export type EdgeLayerSeamHistoryLayerReceiptAdjacentFixtureReadbackStatus =
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-valid"
  | "edge-layer-seam-history-layer-receipt-adjacent-fixture-readback-invalid";

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
