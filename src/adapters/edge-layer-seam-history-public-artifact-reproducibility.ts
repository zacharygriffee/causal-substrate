import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_ARTIFACT_REPRODUCIBILITY_SCHEMA =
  "causal-substrate/edge-layer-seam-history-public-artifact-reproducibility/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_ARTIFACT_REPRODUCIBILITY_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-public-artifact-reproducibility" as const;

export type EdgeLayerSeamHistoryPublicArtifactReproducibilityStatus =
  | "edge-layer-seam-history-public-artifacts-reproducible"
  | "edge-layer-seam-history-public-artifacts-inconsistent";

export interface EdgeLayerSeamHistoryPublicArtifactReproducibility {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_ARTIFACT_REPRODUCIBILITY_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_ARTIFACT_REPRODUCIBILITY_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  runId: string;
  runKind: "single_machine_public_hyperswarm" | "device_to_device_public_hyperswarm" | "unknown_public_hyperswarm";
  sourcePaths: string[];
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
    reproducibilityOperationProofRung: "local_reproducibility_check_over_saved_public_hyperswarm_artifacts";
    savedArtifactCheckOnly: true;
    liveSwarmRunClaimedByThisCheck: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryPublicArtifactReproducibilityStatus;
    artifactsConsumed: boolean;
    publicReaderReportPresent: boolean;
    reportReadbackValid: boolean;
    handoffBundleReady: boolean;
    handoffReadbackValid: boolean;
    proofSummaryReady: boolean;
    linkedPairDetected: boolean;
    damagedOrUnlinkedPairDetected: boolean;
    sourceRefsPreserved: boolean;
    publicProofLabelsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisCheck: true;
    issues: string[];
  };
  boundary: {
    reproducibilityCheckOnly: true;
    readsSavedArtifactsOnly: true;
    opensSwarm: false;
    opensCorestore: false;
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
  reviewStatus: EdgeLayerSeamHistoryPublicArtifactReproducibilityStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryPublicArtifactReproducibility(input: {
  runId: string;
  runKind?: EdgeLayerSeamHistoryPublicArtifactReproducibility["runKind"] | undefined;
  artifacts: Record<string, unknown>;
  sourcePaths?: string[] | undefined;
  emittedAt: string;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryPublicArtifactReproducibility {
  const report = firstRecord(input.artifacts.readerReport, input.artifacts.replicaReport);
  const reportReadback = firstRecord(input.artifacts.reportReadback, input.artifacts.replicaReportReadback);
  const handoffBundle = maybeRecord(input.artifacts.handoffBundle);
  const handoffReadback = maybeRecord(input.artifacts.handoffReadback);
  const proofSummary = maybeRecord(input.artifacts.proofSummary);
  const observationResult = maybeRecord(report?.observationResult);
  const reportValidation = maybeRecord(observationResult?.validation);
  const reportProof = maybeRecord(observationResult?.proof);
  const sourceReferences = maybeRecord(handoffBundle?.sourceReferences);
  const proofSummarySummary = maybeRecord(proofSummary?.summary);
  const issues: string[] = [];

  const reportPresent = report !== undefined;
  const reportReadbackValid =
    reportReadback?.reviewStatus === "edge-layer-seam-history-hyperswarm-reader-report-readback-valid" ||
    reportReadback?.reviewStatus === "edge-layer-seam-history-public-device-replica-report-readback-valid";
  const handoffReady = handoffBundle?.reviewStatus === "edge-layer-seam-history-edge-projection-handoff-bundle-ready";
  const handoffReadbackValid =
    handoffReadback?.reviewStatus === "edge-layer-seam-history-edge-projection-handoff-bundle-readback-valid";
  const proofSummaryReady = proofSummary?.reviewStatus === "edge-layer-seam-history-proof-summary-ready";
  const linkedPairDetected = reportValidation?.linkedPairDetected === true;
  const damagedOrUnlinkedPairDetected = reportValidation?.damagedOrUnlinkedPairDetected === true;
  const sourceRefsPreserved =
    handoffBundle?.validation !== undefined &&
    maybeRecord(handoffBundle.validation)?.sourceRefsPreserved === true &&
    nonEmptyStrings(sourceReferences?.requestIds).length > 0 &&
    nonEmptyStrings(sourceReferences?.requestHashes).length > 0 &&
    nonEmptyStrings(sourceReferences?.receiptIds).length > 0 &&
    nonEmptyStrings(sourceReferences?.receiptHashes).length > 0;
  const publicProofLabelsPreserved =
    reportProof?.strongestProofRung === "public_hyperswarm_replicated_durable_seam_history_observation" &&
    reportProof?.normalizedProofLabel === "public_hyperswarm_durable_seam_history_material" &&
    proofSummarySummary?.strongestSourceProofRungObserved ===
      "public_hyperswarm_replicated_durable_seam_history_observation" &&
    proofSummarySummary?.strongestSourceProofLabelObserved ===
      "public_hyperswarm_durable_seam_history_material" &&
    proofSummarySummary?.strongestProofRungProvenByThisOperation ===
      "local_causal_summary_over_supplied_edge_layer_seam_history_artifacts" &&
    proofSummarySummary?.proofRungUpgradeClaimed === false;

  if (!reportPresent) issues.push("public-reader-report-missing");
  if (!reportReadbackValid) issues.push("report-readback-not-valid");
  if (!handoffReady) issues.push("handoff-bundle-not-ready");
  if (!handoffReadbackValid) issues.push("handoff-readback-not-valid");
  if (!proofSummaryReady) issues.push("proof-summary-not-ready");
  if (!linkedPairDetected) issues.push("linked-pair-not-detected");
  if (!damagedOrUnlinkedPairDetected) issues.push("damaged-or-unlinked-pair-not-detected");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!publicProofLabelsPreserved) issues.push("public-proof-labels-not-preserved");
  if (hasOverclaim(handoffBundle) || hasOverclaim(handoffReadback) || hasOverclaim(reportReadback)) {
    issues.push("artifact-boundary-overclaim");
  }

  const status: EdgeLayerSeamHistoryPublicArtifactReproducibilityStatus = issues.length === 0
    ? "edge-layer-seam-history-public-artifacts-reproducible"
    : "edge-layer-seam-history-public-artifacts-inconsistent";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-public-artifact-reproducibility:${hash(stableJson({
      runId: input.runId,
      runKind: input.runKind,
      sourcePaths: input.sourcePaths ?? [],
      emittedAt: input.emittedAt,
    })).slice(0, 16)}`;

  const requestDurableRefs = nonEmptyStrings(sourceReferences?.requestDurableRefs);
  const receiptDurableRefs = nonEmptyStrings(sourceReferences?.receiptDurableRefs);
  const requestWriterRefs = nonEmptyStrings(sourceReferences?.requestWriterRefs);
  const receiptWriterRefs = nonEmptyStrings(sourceReferences?.receiptWriterRefs);

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_ARTIFACT_REPRODUCIBILITY_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_ARTIFACT_REPRODUCIBILITY_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    runId: input.runId,
    runKind: input.runKind ?? "unknown_public_hyperswarm",
    sourcePaths: [...(input.sourcePaths ?? [])],
    preservedRefs: {
      requestIds: nonEmptyStrings(sourceReferences?.requestIds),
      requestHashes: nonEmptyStrings(sourceReferences?.requestHashes),
      receiptIds: nonEmptyStrings(sourceReferences?.receiptIds),
      receiptHashes: nonEmptyStrings(sourceReferences?.receiptHashes),
      sourceRepos: nonEmptyStrings(sourceReferences?.sourceRepos),
      durableRefs: [...new Set([...requestDurableRefs, ...receiptDurableRefs])],
      writerRefs: [...new Set([...requestWriterRefs, ...receiptWriterRefs])],
    },
    proof: {
      ...(typeof proofSummarySummary?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: proofSummarySummary.strongestSourceProofRungObserved }
        : {}),
      ...(typeof proofSummarySummary?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: proofSummarySummary.strongestSourceProofLabelObserved }
        : {}),
      reproducibilityOperationProofRung: "local_reproducibility_check_over_saved_public_hyperswarm_artifacts",
      savedArtifactCheckOnly: true,
      liveSwarmRunClaimedByThisCheck: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      artifactsConsumed: Object.keys(input.artifacts).length > 0,
      publicReaderReportPresent: reportPresent,
      reportReadbackValid,
      handoffBundleReady: handoffReady,
      handoffReadbackValid,
      proofSummaryReady,
      linkedPairDetected,
      damagedOrUnlinkedPairDetected,
      sourceRefsPreserved,
      publicProofLabelsPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisCheck: true,
      issues,
    },
    boundary: {
      reproducibilityCheckOnly: true,
      readsSavedArtifactsOnly: true,
      opensSwarm: false,
      opensCorestore: false,
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
      "reproducibility-check-reads-saved-artifacts-only",
      "reproducibility-check-does-not-open-public-swarm",
      "reproducibility-check-does-not-upgrade-proof-rung",
    ],
    rejections: status === "edge-layer-seam-history-public-artifacts-reproducible" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryPublicArtifactReproducibility(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryPublicArtifactReproducibility {
  const candidate = assertObject(value, "edge layer seam history public artifact reproducibility");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_ARTIFACT_REPRODUCIBILITY_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_ARTIFACT_REPRODUCIBILITY_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  assertString(candidate.runId, "runId");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.reproducibilityOperationProofRung,
    "local_reproducibility_check_over_saved_public_hyperswarm_artifacts",
    "proof.reproducibilityOperationProofRung",
  );
  assertEqual(proof.savedArtifactCheckOnly, true, "proof.savedArtifactCheckOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisCheck, false, "proof.liveSwarmRunClaimedByThisCheck");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reproducibilityCheckOnly, true, "boundary.reproducibilityCheckOnly");
  assertEqual(boundary.readsSavedArtifactsOnly, true, "boundary.readsSavedArtifactsOnly");
  for (const key of [
    "opensSwarm",
    "opensCorestore",
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
  assertReproducibilityStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisCheck, true, "validation.noLiveSwarmClaimByThisCheck");
  assertReproducibilityStatus(candidate.reviewStatus, "reviewStatus");
}

function hasOverclaim(value: Record<string, unknown> | undefined): boolean {
  const boundary = maybeRecord(value?.boundary);
  if (!boundary) return false;
  return [
    "acceptsCanonicalHistory",
    "admitsLayerEvidence",
    "decidesLayerAdmission",
    "interpretsRbc",
    "grantsAuthority",
    "publishesToMesh",
    "writesProductionContinuity",
    "writesEdgeProjection",
  ].some((key) => boundary[key] === true);
}

function firstRecord(...values: unknown[]): Record<string, unknown> | undefined {
  for (const value of values) {
    const record = maybeRecord(value);
    if (record) return record;
  }
  return undefined;
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

function assertReproducibilityStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryPublicArtifactReproducibilityStatus {
  if (
    value !== "edge-layer-seam-history-public-artifacts-reproducible" &&
    value !== "edge-layer-seam-history-public-artifacts-inconsistent"
  ) {
    throw new Error(`${label} must be a public artifact reproducibility status`);
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
