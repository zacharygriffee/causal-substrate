import { createHash } from "node:crypto";

import {
  assertEdgeLayerSeamHistoryObservationResult,
  assertEdgeLayerSeamHistoryObservationContractSnapshot,
  assertEdgeLayerSeamHistoryOutwardLaneCompletionGate,
  buildEdgeLayerSeamHistoryObservationContractSnapshot,
  buildEdgeLayerSeamHistoryOutwardLaneCompletionGate,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_COMPATIBILITY_ENVELOPE_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA,
  type EdgeLayerSeamHistoryObservationContractSnapshot,
  type EdgeLayerSeamDamageOrUnresolvedDetail,
  type EdgeLayerSeamHappeningClassification,
  type EdgeLayerSeamHistoryNormalizedProofLabel,
  type EdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryOutwardLaneCompletionGate,
  type EdgeLayerSeamHistoryProofRung,
  type EdgeLayerSeamHistorySourceRef,
  type EdgeLayerSeamLinkageStatus,
} from "./edge-layer-seam-history-observation.js";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA =
  "causal-substrate/edge-layer-seam-history-edge-projection-fixture/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-edge-projection-fixture" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_SCHEMA =
  "causal-substrate/edge-layer-seam-history-edge-projection-handoff-readback/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-edge-projection-handoff-readback" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_SCHEMA =
  "causal-substrate/edge-layer-seam-history-edge-projection-consumer-fixture/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-edge-projection-consumer-fixture" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_SCHEMA =
  "causal-substrate/edge-layer-seam-history-edge-projection-handoff-bundle/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-edge-projection-handoff-bundle" as const;

export type EdgeLayerSeamHistoryEdgeProjectionFixtureStatus =
  | "edge-layer-seam-history-edge-projection-fixture-ready"
  | "edge-layer-seam-history-edge-projection-fixture-incomplete"
  | "edge-layer-seam-history-edge-projection-fixture-malformed";

export type EdgeLayerSeamHistoryEdgeProjectionHandoffReadbackStatus =
  | "edge-layer-seam-history-edge-projection-handoff-readback-valid"
  | "edge-layer-seam-history-edge-projection-handoff-readback-invalid";

export type EdgeLayerSeamHistoryEdgeProjectionConsumerFixtureStatus =
  | "edge-layer-seam-history-edge-projection-consumer-fixture-ready"
  | "edge-layer-seam-history-edge-projection-consumer-fixture-incomplete";

export type EdgeLayerSeamHistoryEdgeProjectionHandoffBundleStatus =
  | "edge-layer-seam-history-edge-projection-handoff-bundle-ready"
  | "edge-layer-seam-history-edge-projection-handoff-bundle-incomplete";

export interface EdgeLayerSeamHistoryEdgeProjectionRef {
  sourceObservationArtifactId: string;
  sourceObservationProofRung: EdgeLayerSeamHistoryProofRung;
  observationId: string;
  classification: EdgeLayerSeamHappeningClassification;
  linkageStatus: EdgeLayerSeamLinkageStatus;
  damageOrUnresolvedDetail: EdgeLayerSeamDamageOrUnresolvedDetail;
  request: EdgeLayerSeamHistorySourceRef;
  receipt: EdgeLayerSeamHistorySourceRef;
  sourceRefs: string[];
  causalRole: "edge_projection_input_reference";
  acceptedAsCanonicalHistory: false;
  layerEvidenceAdmitted: false;
  rbcInterpreted: false;
  authorityGranted: false;
  referentPromoted: false;
}

export interface EdgeLayerSeamHistoryEdgeProjectionHandoffEnvelope {
  envelopeKind: "edge_projection_handoff_envelope";
  sourceObservation: {
    artifactId?: string;
    schema?: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA;
    proofRung?: EdgeLayerSeamHistoryProofRung;
    normalizedProofLabel?: EdgeLayerSeamHistoryNormalizedProofLabel;
  };
  sourceReferences: {
    sourceRepos: string[];
    requestIds: string[];
    requestHashes: string[];
    requestDurableRefs: string[];
    requestWriterRefs: string[];
    receiptIds: string[];
    receiptHashes: string[];
    receiptDurableRefs: string[];
    receiptWriterRefs: string[];
  };
  classificationSummary: {
    compatibleObservationIds: string[];
    unresolvedOrDamagedObservationIds: string[];
    linkageStatuses: EdgeLayerSeamLinkageStatus[];
    damageOrUnresolvedDetails: EdgeLayerSeamDamageOrUnresolvedDetail[];
  };
  deferredAttachmentPoints: EdgeLayerSeamHistoryObservationResult["deferredAttachmentPoints"] | Record<string, never>;
  nonClaims: {
    canonicalHistoryClaimed: false;
    layerEvidenceAdmitted: false;
    layerAdmissionDecided: false;
    rbcInterpreted: false;
    quorumSatisfied: false;
    authorityGranted: false;
    referentPromoted: false;
    meshPublished: false;
    productionContinuityWritten: false;
  };
  consumerBoundary: {
    edgeMayConsume: true;
    projectionCandidateOnly: true;
    consumeAsObservationOnly: true;
    writesEdgeProjection: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
}

export interface EdgeLayerSeamHistoryEdgeProjectionFixture {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceObservationArtifactId?: string;
    sourceObservationSchema?: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA;
    sourceObservationProofRung?: EdgeLayerSeamHistoryProofRung;
    sourceRepos: string[];
  };
  edgeProjectionMaterial: {
    candidateKind: "edge_projection_seam_history_observation_candidate";
    projectionSource: "causal_substrate_observation_result";
    compatibilityEnvelopeKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_COMPATIBILITY_ENVELOPE_KIND;
    compatibilityBasis: "request_receipt_linkage_only";
    projectionSuitability: "edge_projection_candidate" | "not_edge_projection_ready";
    compatibleRefs: EdgeLayerSeamHistoryEdgeProjectionRef[];
    unresolvedOrDamagedRefs: EdgeLayerSeamHistoryEdgeProjectionRef[];
  };
  handoffEnvelope: EdgeLayerSeamHistoryEdgeProjectionHandoffEnvelope;
  boundary: {
    fixtureOnly: true;
    edgeProjectionCandidateOnly: true;
    consumeAsObservationOnly: true;
    opensEdgeRuntime: false;
    callsEdge: false;
    edgeProjectionWritten: false;
    writesContinuityRecords: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryEdgeProjectionFixtureStatus;
    observationResultConsumed: boolean;
    compatibilityEnvelopeConsumed: boolean;
    sourceRefsPreserved: boolean;
    compatibleRefsPresent: boolean;
    unresolvedOrDamagedRefsPresent: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noReferentPromotion: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryEdgeProjectionFixtureStatus;
  warnings: string[];
  rejections: string[];
}

export interface EdgeLayerSeamHistoryEdgeProjectionHandoffReadback {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceFixtureArtifactId?: string;
    sourceFixtureSchema?: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA;
    sourceObservationArtifactId?: string;
    sourceObservationProofRung?: EdgeLayerSeamHistoryProofRung;
    sourceObservationNormalizedProofLabel?: EdgeLayerSeamHistoryNormalizedProofLabel;
  };
  readback: {
    fixtureReadable: boolean;
    fixtureValid: boolean;
    handoffEnvelopeReadable: boolean;
    sourceRefsPreserved: boolean;
    classificationSummaryPreserved: boolean;
    proofLabelPreserved: boolean;
    nonClaimsPreserved: boolean;
  };
  preservedSourceRefs: EdgeLayerSeamHistoryEdgeProjectionHandoffEnvelope["sourceReferences"];
  boundary: {
    readbackOnly: true;
    writesEdgeProjection: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryEdgeProjectionHandoffReadbackStatus;
    handoffFixtureConsumed: boolean;
    sourceRefsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noReferentPromotion: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryEdgeProjectionHandoffReadbackStatus;
  warnings: string[];
  rejections: string[];
}

export interface EdgeLayerSeamHistoryEdgeProjectionConsumerFixture {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceFixtureArtifactId?: string;
    sourceObservationArtifactId?: string;
    sourceObservationProofRung?: EdgeLayerSeamHistoryProofRung;
    sourceObservationNormalizedProofLabel?: EdgeLayerSeamHistoryNormalizedProofLabel;
  };
  consumerMaterial: {
    materialKind: "edge_projection_observation_consumer_material";
    consumeAs: "causal_observation_projection_input_only";
    compatibleRefs: EdgeLayerSeamHistoryEdgeProjectionRef[];
    unresolvedOrDamagedRefs: EdgeLayerSeamHistoryEdgeProjectionRef[];
    sourceReferences: EdgeLayerSeamHistoryEdgeProjectionHandoffEnvelope["sourceReferences"];
    classificationSummary: EdgeLayerSeamHistoryEdgeProjectionHandoffEnvelope["classificationSummary"];
  };
  boundary: {
    consumerFixtureOnly: true;
    edgeMayConsume: true;
    consumeAsObservationOnly: true;
    writesEdgeProjection: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryEdgeProjectionConsumerFixtureStatus;
    sourceFixtureConsumed: boolean;
    compatibleRefsPresent: boolean;
    unresolvedOrDamagedRefsPresent: boolean;
    sourceRefsPreserved: boolean;
    classificationSummaryPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noReferentPromotion: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryEdgeProjectionConsumerFixtureStatus;
  warnings: string[];
  rejections: string[];
}

export interface EdgeLayerSeamHistoryEdgeProjectionHandoffBundle {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceObservationArtifactId: string;
    sourceObservationProofRung: EdgeLayerSeamHistoryProofRung;
    sourceObservationNormalizedProofLabel: EdgeLayerSeamHistoryNormalizedProofLabel;
  };
  artifacts: {
    observationResult: EdgeLayerSeamHistoryObservationResult;
    contractSnapshot: EdgeLayerSeamHistoryObservationContractSnapshot;
    handoffFixture: EdgeLayerSeamHistoryEdgeProjectionFixture;
    consumerFixture: EdgeLayerSeamHistoryEdgeProjectionConsumerFixture;
    completionGate: EdgeLayerSeamHistoryOutwardLaneCompletionGate;
  };
  sourceReferences: EdgeLayerSeamHistoryEdgeProjectionHandoffEnvelope["sourceReferences"];
  boundary: {
    bundleOnly: true;
    edgeMayConsume: true;
    writesEdgeProjection: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryEdgeProjectionHandoffBundleStatus;
    observationResultConsumed: boolean;
    contractSnapshotIncluded: boolean;
    handoffFixtureIncluded: boolean;
    consumerFixtureIncluded: boolean;
    completionGateIncluded: boolean;
    completionGateComplete: boolean;
    sourceRefsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noReferentPromotion: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryEdgeProjectionHandoffBundleStatus;
}

export interface BuildEdgeLayerSeamHistoryEdgeProjectionHandoffReadbackInput {
  fixture: unknown;
  emittedAt: string;
  artifactId?: string;
}

export interface BuildEdgeLayerSeamHistoryEdgeProjectionConsumerFixtureInput {
  fixture: unknown;
  emittedAt: string;
  artifactId?: string;
}

export interface BuildEdgeLayerSeamHistoryEdgeProjectionFixtureInput {
  observationResult: unknown;
  emittedAt: string;
  artifactId?: string;
}

export interface BuildEdgeLayerSeamHistoryEdgeProjectionHandoffBundleInput {
  observationResult: unknown;
  emittedAt: string;
  artifactId?: string;
}

export function buildEdgeLayerSeamHistoryEdgeProjectionFixture(
  input: BuildEdgeLayerSeamHistoryEdgeProjectionFixtureInput,
): EdgeLayerSeamHistoryEdgeProjectionFixture {
  const observationResult = parseObservationResult(input.observationResult);
  const issues = validateObservationResultForEdgeProjection(observationResult);
  const compatibleRefs = observationResult
    ? collectProjectionRefs(observationResult, "compatible_seam_happening")
    : [];
  const unresolvedOrDamagedRefs = observationResult
    ? collectProjectionRefs(observationResult, "unresolved_or_damaged_seam_happening")
    : [];
  const status = determineStatus(observationResult, issues);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(observationResult ? { sourceObservationArtifactId: observationResult.artifactId } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(observationResult ? { sourceObservationArtifactId: observationResult.artifactId } : {}),
      ...(observationResult ? { sourceObservationSchema: observationResult.schema } : {}),
      ...(observationResult ? { sourceObservationProofRung: observationResult.proof.strongestProofRung } : {}),
      sourceRepos: observationResult?.source.sourceRepos ?? [],
    },
    edgeProjectionMaterial: {
      candidateKind: "edge_projection_seam_history_observation_candidate",
      projectionSource: "causal_substrate_observation_result",
      compatibilityEnvelopeKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_COMPATIBILITY_ENVELOPE_KIND,
      compatibilityBasis: "request_receipt_linkage_only",
      projectionSuitability: observationResult?.compatibilityEnvelope.projectionSuitability ??
        "not_edge_projection_ready",
      compatibleRefs,
      unresolvedOrDamagedRefs,
    },
    handoffEnvelope: buildHandoffEnvelope(observationResult),
    boundary: buildBoundary(),
    validation: {
      status,
      observationResultConsumed: observationResult !== undefined,
      compatibilityEnvelopeConsumed: observationResult !== undefined,
      sourceRefsPreserved: issues.includes("source-refs-not-preserved") === false && observationResult !== undefined,
      compatibleRefsPresent: compatibleRefs.length > 0,
      unresolvedOrDamagedRefsPresent: unresolvedOrDamagedRefs.length > 0,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noReferentPromotion: true,
      issues,
    },
    reviewStatus: status,
    warnings: buildWarnings(status),
    rejections: status === "edge-layer-seam-history-edge-projection-fixture-ready" ? [] : issues,
  };
}

export function buildEdgeLayerSeamHistoryEdgeProjectionHandoffReadback(
  input: BuildEdgeLayerSeamHistoryEdgeProjectionHandoffReadbackInput,
): EdgeLayerSeamHistoryEdgeProjectionHandoffReadback {
  const fixture = parseProjectionFixture(input.fixture);
  const issues = validateHandoffReadback(fixture);
  const status: EdgeLayerSeamHistoryEdgeProjectionHandoffReadbackStatus = issues.length === 0
    ? "edge-layer-seam-history-edge-projection-handoff-readback-valid"
    : "edge-layer-seam-history-edge-projection-handoff-readback-invalid";
  const artifactId = input.artifactId ?? createHandoffReadbackArtifactId({
    emittedAt: input.emittedAt,
    ...(fixture ? { sourceFixtureArtifactId: fixture.artifactId } : {}),
  });
  const handoffEnvelope = fixture?.handoffEnvelope;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(fixture ? { sourceFixtureArtifactId: fixture.artifactId } : {}),
      ...(fixture ? { sourceFixtureSchema: fixture.schema } : {}),
      ...(handoffEnvelope?.sourceObservation.artifactId
        ? { sourceObservationArtifactId: handoffEnvelope.sourceObservation.artifactId }
        : {}),
      ...(handoffEnvelope?.sourceObservation.proofRung
        ? { sourceObservationProofRung: handoffEnvelope.sourceObservation.proofRung }
        : {}),
      ...(handoffEnvelope?.sourceObservation.normalizedProofLabel
        ? { sourceObservationNormalizedProofLabel: handoffEnvelope.sourceObservation.normalizedProofLabel }
        : {}),
    },
    readback: {
      fixtureReadable: fixture !== undefined,
      fixtureValid: fixture !== undefined,
      handoffEnvelopeReadable: handoffEnvelope !== undefined,
      sourceRefsPreserved: issues.includes("handoff-source-refs-not-preserved") === false && fixture !== undefined,
      classificationSummaryPreserved:
        issues.includes("handoff-classification-summary-not-preserved") === false && fixture !== undefined,
      proofLabelPreserved: issues.includes("handoff-proof-label-not-preserved") === false && fixture !== undefined,
      nonClaimsPreserved: issues.includes("handoff-non-claims-not-preserved") === false && fixture !== undefined,
    },
    preservedSourceRefs: handoffEnvelope?.sourceReferences ?? {
      sourceRepos: [],
      requestIds: [],
      requestHashes: [],
      requestDurableRefs: [],
      requestWriterRefs: [],
      receiptIds: [],
      receiptHashes: [],
      receiptDurableRefs: [],
      receiptWriterRefs: [],
    },
    boundary: buildHandoffReadbackBoundary(),
    validation: {
      status,
      handoffFixtureConsumed: fixture !== undefined,
      sourceRefsPreserved: issues.includes("handoff-source-refs-not-preserved") === false && fixture !== undefined,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noReferentPromotion: true,
      issues,
    },
    reviewStatus: status,
    warnings: buildHandoffReadbackWarnings(status),
    rejections: status === "edge-layer-seam-history-edge-projection-handoff-readback-valid" ? [] : issues,
  };
}

export function buildEdgeLayerSeamHistoryEdgeProjectionConsumerFixture(
  input: BuildEdgeLayerSeamHistoryEdgeProjectionConsumerFixtureInput,
): EdgeLayerSeamHistoryEdgeProjectionConsumerFixture {
  const fixture = parseProjectionFixture(input.fixture);
  const issues = validateConsumerFixture(fixture);
  const status: EdgeLayerSeamHistoryEdgeProjectionConsumerFixtureStatus = issues.length === 0
    ? "edge-layer-seam-history-edge-projection-consumer-fixture-ready"
    : "edge-layer-seam-history-edge-projection-consumer-fixture-incomplete";
  const artifactId = input.artifactId ?? createConsumerFixtureArtifactId({
    emittedAt: input.emittedAt,
    ...(fixture ? { sourceFixtureArtifactId: fixture.artifactId } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(fixture ? { sourceFixtureArtifactId: fixture.artifactId } : {}),
      ...(fixture?.handoffEnvelope.sourceObservation.artifactId
        ? { sourceObservationArtifactId: fixture.handoffEnvelope.sourceObservation.artifactId }
        : {}),
      ...(fixture?.handoffEnvelope.sourceObservation.proofRung
        ? { sourceObservationProofRung: fixture.handoffEnvelope.sourceObservation.proofRung }
        : {}),
      ...(fixture?.handoffEnvelope.sourceObservation.normalizedProofLabel
        ? { sourceObservationNormalizedProofLabel: fixture.handoffEnvelope.sourceObservation.normalizedProofLabel }
        : {}),
    },
    consumerMaterial: {
      materialKind: "edge_projection_observation_consumer_material",
      consumeAs: "causal_observation_projection_input_only",
      compatibleRefs: fixture?.edgeProjectionMaterial.compatibleRefs ?? [],
      unresolvedOrDamagedRefs: fixture?.edgeProjectionMaterial.unresolvedOrDamagedRefs ?? [],
      sourceReferences: fixture?.handoffEnvelope.sourceReferences ?? emptySourceReferences(),
      classificationSummary: fixture?.handoffEnvelope.classificationSummary ?? {
        compatibleObservationIds: [],
        unresolvedOrDamagedObservationIds: [],
        linkageStatuses: [],
        damageOrUnresolvedDetails: [],
      },
    },
    boundary: {
      consumerFixtureOnly: true,
      edgeMayConsume: true,
      consumeAsObservationOnly: true,
      writesEdgeProjection: false,
      acceptsCanonicalHistory: false,
      admitsLayerEvidence: false,
      interpretsRbc: false,
      grantsAuthority: false,
      promotesReferents: false,
      publishesToMesh: false,
      writesProductionContinuity: false,
    },
    validation: {
      status,
      sourceFixtureConsumed: fixture !== undefined,
      compatibleRefsPresent: (fixture?.edgeProjectionMaterial.compatibleRefs.length ?? 0) > 0,
      unresolvedOrDamagedRefsPresent: (fixture?.edgeProjectionMaterial.unresolvedOrDamagedRefs.length ?? 0) > 0,
      sourceRefsPreserved: issues.includes("consumer-source-refs-not-preserved") === false && fixture !== undefined,
      classificationSummaryPreserved:
        issues.includes("consumer-classification-summary-not-preserved") === false && fixture !== undefined,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noReferentPromotion: true,
      issues,
    },
    reviewStatus: status,
    warnings: status === "edge-layer-seam-history-edge-projection-consumer-fixture-ready"
      ? []
      : ["edge-projection-consumer-fixture-is-incomplete"],
    rejections: status === "edge-layer-seam-history-edge-projection-consumer-fixture-ready" ? [] : issues,
  };
}

export function buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle(
  input: BuildEdgeLayerSeamHistoryEdgeProjectionHandoffBundleInput,
): EdgeLayerSeamHistoryEdgeProjectionHandoffBundle {
  assertEdgeLayerSeamHistoryObservationResult(input.observationResult);
  const observationResult = input.observationResult;
  const contractSnapshot = buildEdgeLayerSeamHistoryObservationContractSnapshot(observationResult);
  assertEdgeLayerSeamHistoryObservationContractSnapshot(contractSnapshot);
  const handoffFixture = buildEdgeLayerSeamHistoryEdgeProjectionFixture({
    observationResult,
    emittedAt: input.emittedAt,
  });
  assertEdgeLayerSeamHistoryEdgeProjectionFixture(handoffFixture);
  const consumerFixture = buildEdgeLayerSeamHistoryEdgeProjectionConsumerFixture({
    fixture: handoffFixture,
    emittedAt: input.emittedAt,
  });
  assertEdgeLayerSeamHistoryEdgeProjectionConsumerFixture(consumerFixture);
  const completionGate = buildEdgeLayerSeamHistoryOutwardLaneCompletionGate(observationResult);
  assertEdgeLayerSeamHistoryOutwardLaneCompletionGate(completionGate);
  const issues = collectHandoffBundleIssues({
    handoffFixture,
    consumerFixture,
    completionGate,
  });
  const status: EdgeLayerSeamHistoryEdgeProjectionHandoffBundleStatus = issues.length === 0
    ? "edge-layer-seam-history-edge-projection-handoff-bundle-ready"
    : "edge-layer-seam-history-edge-projection-handoff-bundle-incomplete";
  const artifactId = input.artifactId ?? createHandoffBundleArtifactId({
    emittedAt: input.emittedAt,
    sourceObservationArtifactId: observationResult.artifactId,
  });

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceObservationArtifactId: observationResult.artifactId,
      sourceObservationProofRung: observationResult.proof.strongestProofRung,
      sourceObservationNormalizedProofLabel: observationResult.proof.normalizedProofLabel,
    },
    artifacts: {
      observationResult,
      contractSnapshot,
      handoffFixture,
      consumerFixture,
      completionGate,
    },
    sourceReferences: handoffFixture.handoffEnvelope.sourceReferences,
    boundary: {
      bundleOnly: true,
      edgeMayConsume: true,
      writesEdgeProjection: false,
      acceptsCanonicalHistory: false,
      admitsLayerEvidence: false,
      interpretsRbc: false,
      grantsAuthority: false,
      promotesReferents: false,
      publishesToMesh: false,
      writesProductionContinuity: false,
    },
    validation: {
      status,
      observationResultConsumed: true,
      contractSnapshotIncluded: true,
      handoffFixtureIncluded: true,
      consumerFixtureIncluded: true,
      completionGateIncluded: true,
      completionGateComplete: completionGate.completion.currentLaneComplete,
      sourceRefsPreserved:
        handoffFixture.validation.sourceRefsPreserved && consumerFixture.validation.sourceRefsPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noReferentPromotion: true,
      issues,
    },
    reviewStatus: status,
  };
}

export function assertEdgeLayerSeamHistoryEdgeProjectionFixture(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryEdgeProjectionFixture {
  const candidate = assertObject(value, "edge layer seam history edge projection fixture");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA, "schema");
  assertEqual(
    candidate.schemaVersion,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_FIXTURE_SCHEMA_VERSION,
    "schemaVersion",
  );
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const material = assertObject(candidate.edgeProjectionMaterial, "edgeProjectionMaterial");
  assertEqual(
    material.candidateKind,
    "edge_projection_seam_history_observation_candidate",
    "edgeProjectionMaterial.candidateKind",
  );
  assertEqual(
    material.projectionSource,
    "causal_substrate_observation_result",
    "edgeProjectionMaterial.projectionSource",
  );
  assertEqual(
    material.compatibilityEnvelopeKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_COMPATIBILITY_ENVELOPE_KIND,
    "edgeProjectionMaterial.compatibilityEnvelopeKind",
  );
  assertEqual(material.compatibilityBasis, "request_receipt_linkage_only", "edgeProjectionMaterial.compatibilityBasis");
  assertProjectionRefs(arrayRecords(material.compatibleRefs), "edgeProjectionMaterial.compatibleRefs");
  assertProjectionRefs(
    arrayRecords(material.unresolvedOrDamagedRefs),
    "edgeProjectionMaterial.unresolvedOrDamagedRefs",
  );
  assertHandoffEnvelope(candidate.handoffEnvelope);
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.fixtureOnly, true, "boundary.fixtureOnly");
  assertEqual(boundary.edgeProjectionCandidateOnly, true, "boundary.edgeProjectionCandidateOnly");
  assertEqual(boundary.consumeAsObservationOnly, true, "boundary.consumeAsObservationOnly");
  assertEqual(boundary.opensEdgeRuntime, false, "boundary.opensEdgeRuntime");
  assertEqual(boundary.callsEdge, false, "boundary.callsEdge");
  assertEqual(boundary.edgeProjectionWritten, false, "boundary.edgeProjectionWritten");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noReferentPromotion, true, "validation.noReferentPromotion");
}

export function assertEdgeLayerSeamHistoryEdgeProjectionHandoffReadback(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryEdgeProjectionHandoffReadback {
  const candidate = assertObject(value, "edge layer seam history edge projection handoff readback");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_SCHEMA, "schema");
  assertEqual(
    candidate.schemaVersion,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_READBACK_SCHEMA_VERSION,
    "schemaVersion",
  );
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.readbackOnly, true, "boundary.readbackOnly");
  assertEqual(boundary.writesEdgeProjection, false, "boundary.writesEdgeProjection");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertHandoffReadbackStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noReferentPromotion, true, "validation.noReferentPromotion");
  if (validation.status === "edge-layer-seam-history-edge-projection-handoff-readback-valid") {
    const readback = assertObject(candidate.readback, "readback");
    assertEqual(validation.handoffFixtureConsumed, true, "validation.handoffFixtureConsumed");
    assertEqual(validation.sourceRefsPreserved, true, "validation.sourceRefsPreserved");
    assertEqual(readback.fixtureReadable, true, "readback.fixtureReadable");
    assertEqual(readback.fixtureValid, true, "readback.fixtureValid");
    assertEqual(readback.handoffEnvelopeReadable, true, "readback.handoffEnvelopeReadable");
    assertEqual(readback.sourceRefsPreserved, true, "readback.sourceRefsPreserved");
    assertEqual(readback.classificationSummaryPreserved, true, "readback.classificationSummaryPreserved");
    assertEqual(readback.proofLabelPreserved, true, "readback.proofLabelPreserved");
    assertEqual(readback.nonClaimsPreserved, true, "readback.nonClaimsPreserved");
  } else {
    const readback = assertObject(candidate.readback, "readback");
    assertEqual(readback.fixtureValid, false, "readback.fixtureValid");
    assertNonEmptyArray(candidate.rejections, "rejections");
  }
  assertHandoffReadbackStatus(candidate.reviewStatus, "reviewStatus");
}

export function assertEdgeLayerSeamHistoryEdgeProjectionConsumerFixture(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryEdgeProjectionConsumerFixture {
  const candidate = assertObject(value, "edge layer seam history edge projection consumer fixture");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_SCHEMA, "schema");
  assertEqual(
    candidate.schemaVersion,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_CONSUMER_FIXTURE_SCHEMA_VERSION,
    "schemaVersion",
  );
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const material = assertObject(candidate.consumerMaterial, "consumerMaterial");
  assertEqual(material.materialKind, "edge_projection_observation_consumer_material", "consumerMaterial.materialKind");
  assertEqual(material.consumeAs, "causal_observation_projection_input_only", "consumerMaterial.consumeAs");
  assertProjectionRefs(arrayRecords(material.compatibleRefs), "consumerMaterial.compatibleRefs");
  assertProjectionRefs(arrayRecords(material.unresolvedOrDamagedRefs), "consumerMaterial.unresolvedOrDamagedRefs");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.consumerFixtureOnly, true, "boundary.consumerFixtureOnly");
  assertEqual(boundary.edgeMayConsume, true, "boundary.edgeMayConsume");
  assertEqual(boundary.consumeAsObservationOnly, true, "boundary.consumeAsObservationOnly");
  assertEqual(boundary.writesEdgeProjection, false, "boundary.writesEdgeProjection");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertConsumerFixtureStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noReferentPromotion, true, "validation.noReferentPromotion");
  assertConsumerFixtureStatus(candidate.reviewStatus, "reviewStatus");
}

export function assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryEdgeProjectionHandoffBundle {
  const candidate = assertObject(value, "edge layer seam history edge projection handoff bundle");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_SCHEMA, "schema");
  assertEqual(
    candidate.schemaVersion,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_EDGE_PROJECTION_HANDOFF_BUNDLE_SCHEMA_VERSION,
    "schemaVersion",
  );
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.bundleOnly, true, "boundary.bundleOnly");
  assertEqual(boundary.edgeMayConsume, true, "boundary.edgeMayConsume");
  assertEqual(boundary.writesEdgeProjection, false, "boundary.writesEdgeProjection");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesProductionContinuity, false, "boundary.writesProductionContinuity");
  const validation = assertObject(candidate.validation, "validation");
  assertHandoffBundleStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noReferentPromotion, true, "validation.noReferentPromotion");
  assertHandoffBundleStatus(candidate.reviewStatus, "reviewStatus");
}

function parseObservationResult(value: unknown): EdgeLayerSeamHistoryObservationResult | undefined {
  try {
    assertEdgeLayerSeamHistoryObservationResult(value);
    return value;
  } catch {
    return undefined;
  }
}

function parseProjectionFixture(value: unknown): EdgeLayerSeamHistoryEdgeProjectionFixture | undefined {
  try {
    assertEdgeLayerSeamHistoryEdgeProjectionFixture(value);
    return value;
  } catch {
    return undefined;
  }
}

function validateHandoffReadback(fixture: EdgeLayerSeamHistoryEdgeProjectionFixture | undefined): string[] {
  const issues: string[] = [];
  if (!fixture) return ["handoff-fixture-invalid"];
  const handoffEnvelope = fixture.handoffEnvelope;
  if (
    handoffEnvelope.sourceReferences.sourceRepos.length === 0 ||
    handoffEnvelope.sourceReferences.requestIds.length === 0 ||
    handoffEnvelope.sourceReferences.requestHashes.length === 0 ||
    handoffEnvelope.sourceReferences.receiptIds.length === 0 ||
    handoffEnvelope.sourceReferences.receiptHashes.length === 0
  ) {
    issues.push("handoff-source-refs-not-preserved");
  }
  if (
    handoffEnvelope.classificationSummary.compatibleObservationIds.length === 0 ||
    handoffEnvelope.classificationSummary.unresolvedOrDamagedObservationIds.length === 0 ||
    handoffEnvelope.classificationSummary.linkageStatuses.length === 0
  ) {
    issues.push("handoff-classification-summary-not-preserved");
  }
  if (
    fixture.source.sourceObservationProofRung !== handoffEnvelope.sourceObservation.proofRung ||
    handoffEnvelope.sourceObservation.normalizedProofLabel === undefined
  ) {
    issues.push("handoff-proof-label-not-preserved");
  }
  if (
    handoffEnvelope.nonClaims.canonicalHistoryClaimed ||
    handoffEnvelope.nonClaims.layerEvidenceAdmitted ||
    handoffEnvelope.nonClaims.layerAdmissionDecided ||
    handoffEnvelope.nonClaims.rbcInterpreted ||
    handoffEnvelope.nonClaims.quorumSatisfied ||
    handoffEnvelope.nonClaims.authorityGranted ||
    handoffEnvelope.nonClaims.referentPromoted ||
    handoffEnvelope.nonClaims.meshPublished ||
    handoffEnvelope.nonClaims.productionContinuityWritten ||
    handoffEnvelope.consumerBoundary.writesEdgeProjection ||
    handoffEnvelope.consumerBoundary.acceptsCanonicalHistory ||
    handoffEnvelope.consumerBoundary.admitsLayerEvidence ||
    handoffEnvelope.consumerBoundary.interpretsRbc ||
    handoffEnvelope.consumerBoundary.grantsAuthority ||
    handoffEnvelope.consumerBoundary.promotesReferents ||
    handoffEnvelope.consumerBoundary.publishesToMesh ||
    handoffEnvelope.consumerBoundary.writesProductionContinuity
  ) {
    issues.push("handoff-non-claims-not-preserved");
  }
  return [...new Set(issues)];
}

function validateConsumerFixture(fixture: EdgeLayerSeamHistoryEdgeProjectionFixture | undefined): string[] {
  const issues: string[] = [];
  if (!fixture) return ["consumer-source-fixture-invalid"];
  if (fixture.edgeProjectionMaterial.compatibleRefs.length === 0) {
    issues.push("consumer-compatible-refs-missing");
  }
  if (fixture.edgeProjectionMaterial.unresolvedOrDamagedRefs.length === 0) {
    issues.push("consumer-unresolved-or-damaged-refs-missing");
  }
  if (
    fixture.handoffEnvelope.sourceReferences.sourceRepos.length === 0 ||
    fixture.handoffEnvelope.sourceReferences.requestIds.length === 0 ||
    fixture.handoffEnvelope.sourceReferences.requestHashes.length === 0 ||
    fixture.handoffEnvelope.sourceReferences.receiptIds.length === 0 ||
    fixture.handoffEnvelope.sourceReferences.receiptHashes.length === 0
  ) {
    issues.push("consumer-source-refs-not-preserved");
  }
  if (
    fixture.handoffEnvelope.classificationSummary.compatibleObservationIds.length === 0 ||
    fixture.handoffEnvelope.classificationSummary.unresolvedOrDamagedObservationIds.length === 0
  ) {
    issues.push("consumer-classification-summary-not-preserved");
  }
  if (
    fixture.boundary.edgeProjectionWritten ||
    fixture.boundary.acceptsCanonicalHistory ||
    fixture.boundary.admitsLayerEvidence ||
    fixture.boundary.interpretsRbc ||
    fixture.boundary.grantsAuthority ||
    fixture.boundary.promotesReferents ||
    fixture.boundary.publishesToMesh ||
    fixture.boundary.writesProductionContinuity
  ) {
    issues.push("consumer-boundary-overclaim");
  }
  return [...new Set(issues)];
}

function collectHandoffBundleIssues(input: {
  handoffFixture: EdgeLayerSeamHistoryEdgeProjectionFixture;
  consumerFixture: EdgeLayerSeamHistoryEdgeProjectionConsumerFixture;
  completionGate: EdgeLayerSeamHistoryOutwardLaneCompletionGate;
}): string[] {
  const issues: string[] = [];
  if (input.handoffFixture.reviewStatus !== "edge-layer-seam-history-edge-projection-fixture-ready") {
    issues.push("handoff-fixture-not-ready");
  }
  if (input.consumerFixture.reviewStatus !== "edge-layer-seam-history-edge-projection-consumer-fixture-ready") {
    issues.push("consumer-fixture-not-ready");
  }
  if (!input.completionGate.completion.currentLaneComplete) {
    issues.push("completion-gate-not-complete");
  }
  if (!input.handoffFixture.validation.sourceRefsPreserved || !input.consumerFixture.validation.sourceRefsPreserved) {
    issues.push("bundle-source-refs-not-preserved");
  }
  return [...new Set(issues)];
}

function validateObservationResultForEdgeProjection(
  observationResult: EdgeLayerSeamHistoryObservationResult | undefined,
): string[] {
  const issues: string[] = [];
  if (!observationResult) return ["observation-result-invalid"];
  if (observationResult.compatibilityEnvelope.projectionSuitability !== "edge_projection_candidate") {
    issues.push("observation-not-edge-projection-candidate");
  }
  if (!observationResult.compatibilityEnvelope.sourceReferenceContract.sourceRefsPreserved) {
    issues.push("source-refs-not-preserved");
  }
  if (!observationResult.compatibilityEnvelope.classificationSummary.linkedPairDetected) {
    issues.push("compatible-seam-happening-missing");
  }
  if (!observationResult.compatibilityEnvelope.classificationSummary.damagedOrUnlinkedPairDetected) {
    issues.push("unresolved-or-damaged-seam-happening-missing");
  }
  if (!observationResult.validation.noCanonicalHistoryClaim) issues.push("canonical-history-overclaim");
  if (!observationResult.validation.noLayerAdmissionClaim) issues.push("layer-admission-overclaim");
  if (!observationResult.validation.noRbcInterpretationClaim) issues.push("rbc-interpretation-overclaim");
  if (!observationResult.validation.noAuthorityClaim) issues.push("authority-overclaim");
  return [...new Set(issues)];
}

function collectProjectionRefs(
  observationResult: EdgeLayerSeamHistoryObservationResult,
  classification: EdgeLayerSeamHappeningClassification,
): EdgeLayerSeamHistoryEdgeProjectionRef[] {
  return observationResult.observations
    .filter((observation) => observation.classification === classification)
    .map((observation) => ({
      sourceObservationArtifactId: observationResult.artifactId,
      sourceObservationProofRung: observationResult.proof.strongestProofRung,
      observationId: observation.observationId,
      classification: observation.classification,
      linkageStatus: observation.linkageStatus,
      damageOrUnresolvedDetail: observation.damageOrUnresolvedDetail,
      request: observation.request,
      receipt: observation.receipt,
      sourceRefs: observation.sourceRefs,
      causalRole: "edge_projection_input_reference",
      acceptedAsCanonicalHistory: false,
      layerEvidenceAdmitted: false,
      rbcInterpreted: false,
      authorityGranted: false,
      referentPromoted: false,
    }));
}

function buildHandoffEnvelope(
  observationResult: EdgeLayerSeamHistoryObservationResult | undefined,
): EdgeLayerSeamHistoryEdgeProjectionHandoffEnvelope {
  const observations = observationResult?.observations ?? [];
  return {
    envelopeKind: "edge_projection_handoff_envelope",
    sourceObservation: {
      ...(observationResult ? { artifactId: observationResult.artifactId } : {}),
      ...(observationResult ? { schema: observationResult.schema } : {}),
      ...(observationResult ? { proofRung: observationResult.proof.strongestProofRung } : {}),
      ...(observationResult ? { normalizedProofLabel: observationResult.proof.normalizedProofLabel } : {}),
    },
    sourceReferences: {
      sourceRepos: observationResult?.source.sourceRepos ?? [],
      requestIds: uniqueStrings(observations.map((observation) => observation.request.id)),
      requestHashes: uniqueStrings(observations.map((observation) => observation.request.hash)),
      requestDurableRefs: uniqueStrings(observations.map((observation) => observation.request.durableRef)),
      requestWriterRefs: uniqueStrings(observations.map((observation) => observation.request.writerRef)),
      receiptIds: uniqueStrings(observations.map((observation) => observation.receipt.id)),
      receiptHashes: uniqueStrings(observations.map((observation) => observation.receipt.hash)),
      receiptDurableRefs: uniqueStrings(observations.map((observation) => observation.receipt.durableRef)),
      receiptWriterRefs: uniqueStrings(observations.map((observation) => observation.receipt.writerRef)),
    },
    classificationSummary: {
      compatibleObservationIds: observations
        .filter((observation) => observation.classification === "compatible_seam_happening")
        .map((observation) => observation.observationId),
      unresolvedOrDamagedObservationIds: observations
        .filter((observation) => observation.classification === "unresolved_or_damaged_seam_happening")
        .map((observation) => observation.observationId),
      linkageStatuses: uniqueStrings(observations.map((observation) => observation.linkageStatus))
        .filter(isLinkageStatus),
      damageOrUnresolvedDetails: uniqueStrings(
        observations.map((observation) => observation.damageOrUnresolvedDetail),
      ).filter(isDamageOrUnresolvedDetail),
    },
    deferredAttachmentPoints: observationResult?.deferredAttachmentPoints ?? {},
    nonClaims: {
      canonicalHistoryClaimed: false,
      layerEvidenceAdmitted: false,
      layerAdmissionDecided: false,
      rbcInterpreted: false,
      quorumSatisfied: false,
      authorityGranted: false,
      referentPromoted: false,
      meshPublished: false,
      productionContinuityWritten: false,
    },
    consumerBoundary: {
      edgeMayConsume: true,
      projectionCandidateOnly: true,
      consumeAsObservationOnly: true,
      writesEdgeProjection: false,
      acceptsCanonicalHistory: false,
      admitsLayerEvidence: false,
      interpretsRbc: false,
      grantsAuthority: false,
      promotesReferents: false,
      publishesToMesh: false,
      writesProductionContinuity: false,
    },
  };
}

function determineStatus(
  observationResult: EdgeLayerSeamHistoryObservationResult | undefined,
  issues: string[],
): EdgeLayerSeamHistoryEdgeProjectionFixtureStatus {
  if (!observationResult) return "edge-layer-seam-history-edge-projection-fixture-malformed";
  return issues.length === 0
    ? "edge-layer-seam-history-edge-projection-fixture-ready"
    : "edge-layer-seam-history-edge-projection-fixture-incomplete";
}

function buildBoundary(): EdgeLayerSeamHistoryEdgeProjectionFixture["boundary"] {
  return {
    fixtureOnly: true,
    edgeProjectionCandidateOnly: true,
    consumeAsObservationOnly: true,
    opensEdgeRuntime: false,
    callsEdge: false,
    edgeProjectionWritten: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    interpretsRbc: false,
    grantsAuthority: false,
    promotesReferents: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
}

function buildHandoffReadbackBoundary(): EdgeLayerSeamHistoryEdgeProjectionHandoffReadback["boundary"] {
  return {
    readbackOnly: true,
    writesEdgeProjection: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    interpretsRbc: false,
    grantsAuthority: false,
    promotesReferents: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
}

function emptySourceReferences(): EdgeLayerSeamHistoryEdgeProjectionHandoffEnvelope["sourceReferences"] {
  return {
    sourceRepos: [],
    requestIds: [],
    requestHashes: [],
    requestDurableRefs: [],
    requestWriterRefs: [],
    receiptIds: [],
    receiptHashes: [],
    receiptDurableRefs: [],
    receiptWriterRefs: [],
  };
}

function buildWarnings(status: EdgeLayerSeamHistoryEdgeProjectionFixtureStatus): string[] {
  const warnings = [
    "edge-projection-fixture-is-derived-from-causal-observation-result",
    "edge-projection-handoff-envelope-is-consumable-by-edge-as-observation-only",
    "edge-projection-fixture-does-not-write-edge-projection-records",
    "edge-projection-fixture-does-not-promote-referents",
    "edge-projection-fixture-does-not-claim-canonical-history",
    "edge-projection-fixture-does-not-admit-layer-evidence",
    "edge-projection-fixture-does-not-interpret-rbc",
    "edge-projection-fixture-does-not-grant-authority",
  ];
  if (status !== "edge-layer-seam-history-edge-projection-fixture-ready") {
    warnings.push("edge-projection-fixture-not-ready");
  }
  return warnings;
}

function buildHandoffReadbackWarnings(status: EdgeLayerSeamHistoryEdgeProjectionHandoffReadbackStatus): string[] {
  const warnings = [
    "edge-projection-handoff-readback-consumes-generated-fixture-only",
    "edge-projection-handoff-readback-does-not-write-edge-projection-records",
    "edge-projection-handoff-readback-does-not-claim-canonical-history",
    "edge-projection-handoff-readback-does-not-admit-layer-evidence",
    "edge-projection-handoff-readback-does-not-interpret-rbc",
    "edge-projection-handoff-readback-does-not-grant-authority",
    "edge-projection-handoff-readback-does-not-promote-referents",
  ];
  if (status !== "edge-layer-seam-history-edge-projection-handoff-readback-valid") {
    warnings.push("edge-projection-handoff-readback-invalid");
  }
  return warnings;
}

function assertProjectionRefs(refs: JsonRecord[], label: string): void {
  refs.forEach((ref, index) => {
    assertEqual(
      ref.acceptedAsCanonicalHistory,
      false,
      `${label}[${index}].acceptedAsCanonicalHistory`,
    );
    assertEqual(ref.layerEvidenceAdmitted, false, `${label}[${index}].layerEvidenceAdmitted`);
    assertEqual(ref.rbcInterpreted, false, `${label}[${index}].rbcInterpreted`);
    assertEqual(ref.authorityGranted, false, `${label}[${index}].authorityGranted`);
    assertEqual(ref.referentPromoted, false, `${label}[${index}].referentPromoted`);
  });
}

function assertHandoffEnvelope(value: unknown): void {
  const envelope = assertObject(value, "handoffEnvelope");
  assertEqual(envelope.envelopeKind, "edge_projection_handoff_envelope", "handoffEnvelope.envelopeKind");
  const sourceReferences = assertObject(envelope.sourceReferences, "handoffEnvelope.sourceReferences");
  assertNonEmptyArray(sourceReferences.sourceRepos, "handoffEnvelope.sourceReferences.sourceRepos");
  assertNonEmptyArray(sourceReferences.requestIds, "handoffEnvelope.sourceReferences.requestIds");
  assertNonEmptyArray(sourceReferences.requestHashes, "handoffEnvelope.sourceReferences.requestHashes");
  assertNonEmptyArray(sourceReferences.receiptIds, "handoffEnvelope.sourceReferences.receiptIds");
  assertNonEmptyArray(sourceReferences.receiptHashes, "handoffEnvelope.sourceReferences.receiptHashes");
  const classificationSummary = assertObject(envelope.classificationSummary, "handoffEnvelope.classificationSummary");
  assertNonEmptyArray(
    classificationSummary.compatibleObservationIds,
    "handoffEnvelope.classificationSummary.compatibleObservationIds",
  );
  assertNonEmptyArray(
    classificationSummary.unresolvedOrDamagedObservationIds,
    "handoffEnvelope.classificationSummary.unresolvedOrDamagedObservationIds",
  );
  assertNonEmptyArray(classificationSummary.linkageStatuses, "handoffEnvelope.classificationSummary.linkageStatuses");
  assertNonEmptyArray(
    classificationSummary.damageOrUnresolvedDetails,
    "handoffEnvelope.classificationSummary.damageOrUnresolvedDetails",
  );
  const consumerBoundary = assertObject(envelope.consumerBoundary, "handoffEnvelope.consumerBoundary");
  assertEqual(consumerBoundary.edgeMayConsume, true, "handoffEnvelope.consumerBoundary.edgeMayConsume");
  assertEqual(consumerBoundary.projectionCandidateOnly, true, "handoffEnvelope.consumerBoundary.projectionCandidateOnly");
  assertEqual(consumerBoundary.consumeAsObservationOnly, true, "handoffEnvelope.consumerBoundary.consumeAsObservationOnly");
  assertEqual(consumerBoundary.writesEdgeProjection, false, "handoffEnvelope.consumerBoundary.writesEdgeProjection");
  assertEqual(consumerBoundary.acceptsCanonicalHistory, false, "handoffEnvelope.consumerBoundary.acceptsCanonicalHistory");
  assertEqual(consumerBoundary.admitsLayerEvidence, false, "handoffEnvelope.consumerBoundary.admitsLayerEvidence");
  assertEqual(consumerBoundary.interpretsRbc, false, "handoffEnvelope.consumerBoundary.interpretsRbc");
  assertEqual(consumerBoundary.grantsAuthority, false, "handoffEnvelope.consumerBoundary.grantsAuthority");
  assertEqual(consumerBoundary.promotesReferents, false, "handoffEnvelope.consumerBoundary.promotesReferents");
  assertEqual(consumerBoundary.publishesToMesh, false, "handoffEnvelope.consumerBoundary.publishesToMesh");
  assertEqual(
    consumerBoundary.writesProductionContinuity,
    false,
    "handoffEnvelope.consumerBoundary.writesProductionContinuity",
  );
  const nonClaims = assertObject(envelope.nonClaims, "handoffEnvelope.nonClaims");
  assertEqual(nonClaims.canonicalHistoryClaimed, false, "handoffEnvelope.nonClaims.canonicalHistoryClaimed");
  assertEqual(nonClaims.layerEvidenceAdmitted, false, "handoffEnvelope.nonClaims.layerEvidenceAdmitted");
  assertEqual(nonClaims.layerAdmissionDecided, false, "handoffEnvelope.nonClaims.layerAdmissionDecided");
  assertEqual(nonClaims.rbcInterpreted, false, "handoffEnvelope.nonClaims.rbcInterpreted");
  assertEqual(nonClaims.quorumSatisfied, false, "handoffEnvelope.nonClaims.quorumSatisfied");
  assertEqual(nonClaims.authorityGranted, false, "handoffEnvelope.nonClaims.authorityGranted");
  assertEqual(nonClaims.referentPromoted, false, "handoffEnvelope.nonClaims.referentPromoted");
  assertEqual(nonClaims.meshPublished, false, "handoffEnvelope.nonClaims.meshPublished");
  assertEqual(nonClaims.productionContinuityWritten, false, "handoffEnvelope.nonClaims.productionContinuityWritten");
}

function createArtifactId(input: { emittedAt: string; sourceObservationArtifactId?: string }): string {
  return `causal-edge-layer-seam-history-edge-projection-fixture:${hash(stableJson(input)).slice(0, 16)}`;
}

function createHandoffReadbackArtifactId(input: { emittedAt: string; sourceFixtureArtifactId?: string }): string {
  return `causal-edge-layer-seam-history-edge-projection-handoff-readback:${hash(stableJson(input)).slice(0, 16)}`;
}

function createConsumerFixtureArtifactId(input: { emittedAt: string; sourceFixtureArtifactId?: string }): string {
  return `causal-edge-layer-seam-history-edge-projection-consumer-fixture:${hash(stableJson(input)).slice(0, 16)}`;
}

function createHandoffBundleArtifactId(input: { emittedAt: string; sourceObservationArtifactId?: string }): string {
  return `causal-edge-layer-seam-history-edge-projection-handoff-bundle:${hash(stableJson(input)).slice(0, 16)}`;
}

type JsonRecord = Record<string, unknown>;

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

function arrayRecords(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function uniqueStrings(values: unknown[]): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.trim() !== ""))];
}

function isLinkageStatus(value: string): value is EdgeLayerSeamLinkageStatus {
  return value === "linked" || value === "unlinked" || value === "damaged";
}

function isDamageOrUnresolvedDetail(value: string): value is EdgeLayerSeamDamageOrUnresolvedDetail {
  return value === "none_compatible_linked_request_receipt" ||
    value === "damaged_partial_or_mismatched_request_receipt_refs" ||
    value === "unresolved_unlinked_or_missing_request_receipt_refs";
}

function assertNonEmptyArray(value: unknown, label: string): void {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array`);
  }
}

function assertHandoffReadbackStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryEdgeProjectionHandoffReadbackStatus {
  if (
    value !== "edge-layer-seam-history-edge-projection-handoff-readback-valid" &&
    value !== "edge-layer-seam-history-edge-projection-handoff-readback-invalid"
  ) {
    throw new Error(`${label} must be a handoff readback status`);
  }
}

function assertConsumerFixtureStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryEdgeProjectionConsumerFixtureStatus {
  if (
    value !== "edge-layer-seam-history-edge-projection-consumer-fixture-ready" &&
    value !== "edge-layer-seam-history-edge-projection-consumer-fixture-incomplete"
  ) {
    throw new Error(`${label} must be a consumer fixture status`);
  }
}

function assertHandoffBundleStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryEdgeProjectionHandoffBundleStatus {
  if (
    value !== "edge-layer-seam-history-edge-projection-handoff-bundle-ready" &&
    value !== "edge-layer-seam-history-edge-projection-handoff-bundle-incomplete"
  ) {
    throw new Error(`${label} must be a handoff bundle status`);
  }
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label} must be ${String(expected)}`);
  }
}

function assertString(value: unknown, label: string): void {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}
