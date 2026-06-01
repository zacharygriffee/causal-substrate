import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_TO_EDGE_PROJECTION_CONTRACT_SCHEMA =
  "causal-substrate/edge-layer-seam-history-observation-to-edge-projection-contract/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_TO_EDGE_PROJECTION_CONTRACT_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-observation-to-edge-projection-contract" as const;

export type EdgeLayerSeamHistoryObservationToEdgeProjectionContractStatus =
  | "edge-layer-seam-history-observation-to-edge-projection-contract-ready"
  | "edge-layer-seam-history-observation-to-edge-projection-contract-incomplete";

export interface EdgeLayerSeamHistoryObservationToEdgeProjectionContract {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_TO_EDGE_PROJECTION_CONTRACT_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_TO_EDGE_PROJECTION_CONTRACT_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    publicRunDir?: string | undefined;
    reproducibilityCheck?: string | undefined;
    handoffBundle?: string | undefined;
    edgeReceipt?: string | undefined;
  };
  chain: {
    reproducibilityCheck: {
      artifactId?: string | undefined;
      reviewStatus?: string | undefined;
      runId?: string | undefined;
      runKind?: string | undefined;
    };
    causalHandoffBundle: {
      artifactId?: string | undefined;
      reviewStatus?: string | undefined;
    };
    edgeReceipt: {
      receiptId?: string | undefined;
      status?: string | undefined;
      sourcePath?: string | undefined;
      sourceBundleHash?: string | undefined;
    };
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
    contractOperationProofRung: "local_contract_check_over_saved_causal_handoff_and_edge_receipt";
    savedArtifactCheckOnly: true;
    liveSwarmRunClaimedByThisContract: false;
    edgeProjectionWriteClaimed: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryObservationToEdgeProjectionContractStatus;
    reproducibilityCheckReady: boolean;
    handoffBundleReady: boolean;
    edgeReceiptAccepted: boolean;
    edgeConsumedCausalHandoff: boolean;
    edgeAcceptedObservationOnlyProjectionInput: boolean;
    sourceRefsMatchBetweenCausalAndEdge: boolean;
    sourceIdsAndHashesPreserved: boolean;
    proofLabelsPreserved: boolean;
    publicSourceProofRungPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProjectionStateWrite: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisContract: true;
    issues: string[];
  };
  boundary: {
    observationToEdgeProjectionContractOnly: true;
    readsSavedArtifactsOnly: true;
    opensCausalSubstrateRuntime: false;
    opensEdgeRuntime: false;
    opensLayerRuntime: false;
    opensSwarm: false;
    opensCorestore: false;
    writesEdgeProjection: false;
    writesEdgeState: false;
    writesLayerEvidence: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    decidesLayerAdmission: false;
    interpretsRbc: false;
    grantsAuthority: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  reviewStatus: EdgeLayerSeamHistoryObservationToEdgeProjectionContractStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryObservationToEdgeProjectionContract(input: {
  reproducibilityCheck: unknown;
  handoffBundle: unknown;
  edgeReceipt: unknown;
  emittedAt: string;
  sourcePaths?: EdgeLayerSeamHistoryObservationToEdgeProjectionContract["sourcePaths"] | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryObservationToEdgeProjectionContract {
  const reproducibilityCheck = maybeRecord(input.reproducibilityCheck);
  const handoffBundle = maybeRecord(input.handoffBundle);
  const edgeReceipt = maybeRecord(input.edgeReceipt);
  const handoffRefs = maybeRecord(handoffBundle?.sourceReferences);
  const edgeRefs = maybeRecord(edgeReceipt?.preservedSourceReferences);
  const reproProof = maybeRecord(reproducibilityCheck?.proof);
  const edgeObservation = maybeRecord(edgeReceipt?.sourceObservation);
  const edgeProjectionInput = maybeRecord(edgeReceipt?.projectionInput);
  const edgeValidation = maybeRecord(edgeReceipt?.validation);
  const issues: string[] = [];

  const reproducibilityCheckReady =
    reproducibilityCheck?.reviewStatus === "edge-layer-seam-history-public-artifacts-reproducible" &&
    maybeRecord(reproducibilityCheck.validation)?.publicProofLabelsPreserved === true;
  const handoffBundleReady =
    handoffBundle?.reviewStatus === "edge-layer-seam-history-edge-projection-handoff-bundle-ready" &&
    maybeRecord(handoffBundle.validation)?.sourceRefsPreserved === true;
  const edgeReceiptAccepted =
    edgeValidation?.status === "edge_causal_seam_handoff_projection_input_accepted" &&
    edgeValidation?.handoffBundleConsumed === true &&
    edgeValidation?.handoffBundleReady === true;
  const edgeConsumedCausalHandoff =
    maybeRecord(edgeReceipt?.sourceBundle)?.artifactKind ===
      "causal-edge-layer-seam-history-edge-projection-handoff-bundle" &&
    maybeRecord(edgeReceipt?.sourceBundle)?.reviewStatus ===
      "edge-layer-seam-history-edge-projection-handoff-bundle-ready";
  const edgeAcceptedObservationOnlyProjectionInput =
    edgeProjectionInput?.acceptedAsObservationOnlyProjectionInput === true &&
    edgeProjectionInput?.projectionCandidateOnly === true &&
    edgeProjectionInput?.projectionStateWritten === false &&
    edgeProjectionInput?.semanticContinuityAccepted === false &&
    edgeProjectionInput?.causalTruthAccepted === false &&
    edgeProjectionInput?.layerAdmissionAccepted === false &&
    edgeProjectionInput?.rbcInterpreted === false &&
    edgeProjectionInput?.authorityGranted === false;
  const sourceRefsMatchBetweenCausalAndEdge = sourceRefsMatch(handoffRefs, edgeRefs);
  const sourceIdsAndHashesPreserved =
    nonEmptyStrings(edgeRefs?.requestIds).length > 0 &&
    nonEmptyStrings(edgeRefs?.requestHashes).length > 0 &&
    nonEmptyStrings(edgeRefs?.receiptIds).length > 0 &&
    nonEmptyStrings(edgeRefs?.receiptHashes).length > 0;
  const proofLabelsPreserved =
    edgeValidation?.proofLabelsPreserved === true &&
    edgeObservation?.proofRung === reproProof?.strongestSourceProofRungObserved &&
    edgeObservation?.normalizedProofLabel === reproProof?.strongestSourceProofLabelObserved;
  const publicSourceProofRungPreserved =
    reproProof?.strongestSourceProofRungObserved ===
      "public_hyperswarm_replicated_durable_seam_history_observation" &&
    edgeObservation?.proofRung === "public_hyperswarm_replicated_durable_seam_history_observation";

  if (!reproducibilityCheckReady) issues.push("reproducibility-check-not-ready");
  if (!handoffBundleReady) issues.push("handoff-bundle-not-ready");
  if (!edgeReceiptAccepted) issues.push("edge-receipt-not-accepted");
  if (!edgeConsumedCausalHandoff) issues.push("edge-receipt-did-not-consume-causal-handoff");
  if (!edgeAcceptedObservationOnlyProjectionInput) {
    issues.push("edge-receipt-not-observation-only-projection-input");
  }
  if (!sourceRefsMatchBetweenCausalAndEdge) issues.push("source-refs-do-not-match-between-causal-and-edge");
  if (!sourceIdsAndHashesPreserved) issues.push("source-ids-and-hashes-not-preserved");
  if (!proofLabelsPreserved) issues.push("proof-labels-not-preserved");
  if (!publicSourceProofRungPreserved) issues.push("public-source-proof-rung-not-preserved");
  if (hasCausalOverclaim(handoffBundle) || hasEdgeOverclaim(edgeReceipt)) issues.push("contract-artifact-overclaim");

  const status: EdgeLayerSeamHistoryObservationToEdgeProjectionContractStatus = issues.length === 0
    ? "edge-layer-seam-history-observation-to-edge-projection-contract-ready"
    : "edge-layer-seam-history-observation-to-edge-projection-contract-incomplete";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-observation-to-edge-projection-contract:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      handoffArtifactId: handoffBundle?.artifactId,
      edgeReceiptId: edgeReceipt?.receiptId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_TO_EDGE_PROJECTION_CONTRACT_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_TO_EDGE_PROJECTION_CONTRACT_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    chain: {
      reproducibilityCheck: {
        ...(typeof reproducibilityCheck?.artifactId === "string"
          ? { artifactId: reproducibilityCheck.artifactId }
          : {}),
        ...(typeof reproducibilityCheck?.reviewStatus === "string"
          ? { reviewStatus: reproducibilityCheck.reviewStatus }
          : {}),
        ...(typeof reproducibilityCheck?.runId === "string" ? { runId: reproducibilityCheck.runId } : {}),
        ...(typeof reproducibilityCheck?.runKind === "string" ? { runKind: reproducibilityCheck.runKind } : {}),
      },
      causalHandoffBundle: {
        ...(typeof handoffBundle?.artifactId === "string" ? { artifactId: handoffBundle.artifactId } : {}),
        ...(typeof handoffBundle?.reviewStatus === "string" ? { reviewStatus: handoffBundle.reviewStatus } : {}),
      },
      edgeReceipt: {
        ...(typeof edgeReceipt?.receiptId === "string" ? { receiptId: edgeReceipt.receiptId } : {}),
        ...(typeof edgeValidation?.status === "string" ? { status: edgeValidation.status } : {}),
        ...(typeof edgeReceipt?.sourcePath === "string" ? { sourcePath: edgeReceipt.sourcePath } : {}),
        ...(typeof edgeReceipt?.sourceBundleHash === "string"
          ? { sourceBundleHash: edgeReceipt.sourceBundleHash }
          : {}),
      },
    },
    preservedRefs: {
      requestIds: nonEmptyStrings(edgeRefs?.requestIds),
      requestHashes: nonEmptyStrings(edgeRefs?.requestHashes),
      receiptIds: nonEmptyStrings(edgeRefs?.receiptIds),
      receiptHashes: nonEmptyStrings(edgeRefs?.receiptHashes),
      sourceRepos: nonEmptyStrings(edgeRefs?.sourceRepos),
      durableRefs: [
        ...new Set([
          ...nonEmptyStrings(edgeRefs?.requestDurableRefs),
          ...nonEmptyStrings(edgeRefs?.receiptDurableRefs),
        ]),
      ],
      writerRefs: [
        ...new Set([
          ...nonEmptyStrings(edgeRefs?.requestWriterRefs),
          ...nonEmptyStrings(edgeRefs?.receiptWriterRefs),
        ]),
      ],
    },
    proof: {
      ...(typeof reproProof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: reproProof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof reproProof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: reproProof.strongestSourceProofLabelObserved }
        : {}),
      contractOperationProofRung: "local_contract_check_over_saved_causal_handoff_and_edge_receipt",
      savedArtifactCheckOnly: true,
      liveSwarmRunClaimedByThisContract: false,
      edgeProjectionWriteClaimed: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      reproducibilityCheckReady,
      handoffBundleReady,
      edgeReceiptAccepted,
      edgeConsumedCausalHandoff,
      edgeAcceptedObservationOnlyProjectionInput,
      sourceRefsMatchBetweenCausalAndEdge,
      sourceIdsAndHashesPreserved,
      proofLabelsPreserved,
      publicSourceProofRungPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProjectionStateWrite: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisContract: true,
      issues,
    },
    boundary: {
      observationToEdgeProjectionContractOnly: true,
      readsSavedArtifactsOnly: true,
      opensCausalSubstrateRuntime: false,
      opensEdgeRuntime: false,
      opensLayerRuntime: false,
      opensSwarm: false,
      opensCorestore: false,
      writesEdgeProjection: false,
      writesEdgeState: false,
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
      "observation-to-edge-contract-reads-saved-artifacts-only",
      "observation-to-edge-contract-does-not-call-edge",
      "observation-to-edge-contract-does-not-upgrade-public-swarm-proof",
      "observation-to-edge-contract-does-not-write-edge-projection-state",
    ],
    rejections: status === "edge-layer-seam-history-observation-to-edge-projection-contract-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryObservationToEdgeProjectionContract(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryObservationToEdgeProjectionContract {
  const candidate = assertObject(value, "edge layer seam history observation to edge projection contract");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_TO_EDGE_PROJECTION_CONTRACT_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_TO_EDGE_PROJECTION_CONTRACT_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.contractOperationProofRung,
    "local_contract_check_over_saved_causal_handoff_and_edge_receipt",
    "proof.contractOperationProofRung",
  );
  assertEqual(proof.savedArtifactCheckOnly, true, "proof.savedArtifactCheckOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisContract, false, "proof.liveSwarmRunClaimedByThisContract");
  assertEqual(proof.edgeProjectionWriteClaimed, false, "proof.edgeProjectionWriteClaimed");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(
    boundary.observationToEdgeProjectionContractOnly,
    true,
    "boundary.observationToEdgeProjectionContractOnly",
  );
  assertEqual(boundary.readsSavedArtifactsOnly, true, "boundary.readsSavedArtifactsOnly");
  for (const key of [
    "opensCausalSubstrateRuntime",
    "opensEdgeRuntime",
    "opensLayerRuntime",
    "opensSwarm",
    "opensCorestore",
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
  ]) {
    assertEqual(boundary[key], false, `boundary.${key}`);
  }
  const validation = assertObject(candidate.validation, "validation");
  assertContractStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noProjectionStateWrite, true, "validation.noProjectionStateWrite");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisContract, true, "validation.noLiveSwarmClaimByThisContract");
  assertContractStatus(candidate.reviewStatus, "reviewStatus");
}

function sourceRefsMatch(
  handoffRefs: Record<string, unknown> | undefined,
  edgeRefs: Record<string, unknown> | undefined,
): boolean {
  return [
    "sourceRepos",
    "requestIds",
    "requestHashes",
    "requestDurableRefs",
    "requestWriterRefs",
    "receiptIds",
    "receiptHashes",
    "receiptDurableRefs",
    "receiptWriterRefs",
  ].every((key) => sameStringSet(handoffRefs?.[key], edgeRefs?.[key]));
}

function sameStringSet(left: unknown, right: unknown): boolean {
  const leftValues = nonEmptyStrings(left).sort();
  const rightValues = nonEmptyStrings(right).sort();
  return leftValues.length > 0 &&
    leftValues.length === rightValues.length &&
    leftValues.every((value, index) => value === rightValues[index]);
}

function hasCausalOverclaim(value: Record<string, unknown> | undefined): boolean {
  const boundary = maybeRecord(value?.boundary);
  if (!boundary) return false;
  return [
    "writesEdgeProjection",
    "acceptsCanonicalHistory",
    "admitsLayerEvidence",
    "interpretsRbc",
    "grantsAuthority",
    "publishesToMesh",
    "writesProductionContinuity",
  ].some((key) => boundary[key] === true);
}

function hasEdgeOverclaim(value: Record<string, unknown> | undefined): boolean {
  const boundary = maybeRecord(value?.boundary);
  const projectionInput = maybeRecord(value?.projectionInput);
  if (!boundary || !projectionInput) return true;
  return [
    boundary.opensCausalSubstrate,
    boundary.opensLayer,
    boundary.opensSwarm,
    boundary.opensCorestore,
    boundary.writesEdgeProjection,
    boundary.writesEdgeState,
    boundary.acceptsCanonicalHistory,
    boundary.admitsLayerEvidence,
    boundary.decidesLayerAdmission,
    boundary.interpretsRbc,
    boundary.grantsAuthority,
    boundary.publishesToMesh,
    boundary.writesProductionContinuity,
    projectionInput.projectionStateWritten,
    projectionInput.semanticContinuityAccepted,
    projectionInput.causalTruthAccepted,
    projectionInput.layerAdmissionAccepted,
    projectionInput.rbcInterpreted,
    projectionInput.authorityGranted,
  ].some((value) => value === true);
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

function assertContractStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryObservationToEdgeProjectionContractStatus {
  if (
    value !== "edge-layer-seam-history-observation-to-edge-projection-contract-ready" &&
    value !== "edge-layer-seam-history-observation-to-edge-projection-contract-incomplete"
  ) {
    throw new Error(`${label} must be an observation to edge projection contract status`);
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
