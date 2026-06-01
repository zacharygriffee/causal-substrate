import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_INPUT_PACKAGE_SCHEMA =
  "causal-substrate/edge-layer-seam-history-public-refresh-input-package/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_INPUT_PACKAGE_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-public-refresh-input-package" as const;

export type EdgeLayerSeamHistoryPublicRefreshInputPackageStatus =
  | "edge-layer-seam-history-public-refresh-input-package-ready"
  | "edge-layer-seam-history-public-refresh-input-package-incomplete";

export interface EdgeLayerSeamHistoryPublicRefreshInputPackage {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_INPUT_PACKAGE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_INPUT_PACKAGE_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    operatorPublicRefreshCommand?: string | undefined;
    previousSeamHistoryInput?: string | undefined;
  };
  outputPaths: {
    refreshOutputDir?: string | undefined;
    refreshSeamHistoryInput?: string | undefined;
    packageManifest?: string | undefined;
  };
  packageOperation: {
    packagesInputOnly: true;
    copiesCurrentSeamHistoryMaterial: boolean;
    localSuppliedInputUntilPublicReaderConsumes: true;
    publicRefreshRunByThisPackage: false;
  };
  commandSummary: {
    refreshRunId?: string | undefined;
    outputDir?: string | undefined;
    namespace?: string | undefined;
    sourceDevice?: string | undefined;
    replicaDevice?: string | undefined;
  };
  packagedMaterial: {
    seamHistoryInputHash: string;
    historyId?: string | undefined;
    historyHash?: string | undefined;
    linkedPairCount: number;
    damagedOrUnlinkedPairCount: number;
  };
  sourceRefs: {
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
    packageOperationProofRung: "local_refresh_input_package_over_saved_public_hyperswarm_material";
    localSuppliedInputUntilPublicReaderConsumes: true;
    liveSwarmRunClaimedByThisPackage: false;
    publicRefreshExecutedByThisPackage: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryPublicRefreshInputPackageStatus;
    commandArtifactReady: boolean;
    commandArtifactInstructionsOnly: boolean;
    refreshOutputDirMatchesCommand: boolean;
    refreshInputPathMatchesCommand: boolean;
    seamHistoryInputPresent: boolean;
    linkedPairPresent: boolean;
    damagedOrUnlinkedPairPresent: boolean;
    sourceRefsPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noEdgeProjectionWriteClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisPackage: true;
    issues: string[];
  };
  boundary: {
    inputPackageOnly: true;
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
  reviewStatus: EdgeLayerSeamHistoryPublicRefreshInputPackageStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryPublicRefreshInputPackage(input: {
  operatorPublicRefreshCommand: unknown;
  seamHistoryInput: unknown;
  seamHistoryInputBytes?: string | undefined;
  emittedAt: string;
  sourcePaths?: EdgeLayerSeamHistoryPublicRefreshInputPackage["sourcePaths"] | undefined;
  outputPaths?: EdgeLayerSeamHistoryPublicRefreshInputPackage["outputPaths"] | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryPublicRefreshInputPackage {
  const command = maybeRecord(input.operatorPublicRefreshCommand);
  const commandProof = maybeRecord(command?.proof);
  const commandValidation = maybeRecord(command?.validation);
  const commandPlan = maybeRecord(command?.commandPlan);
  const seamHistory = maybeRecord(input.seamHistoryInput);
  const pairs = Array.isArray(seamHistory?.pairs) ? seamHistory.pairs : [];
  const expectedOutputs = nonEmptyStrings(command?.expectedOutputs);
  const expectedInputPath = expectedOutputs[0];
  const commandOutputDir = typeof commandPlan?.outputDir === "string" ? commandPlan.outputDir : undefined;
  const outputDir = input.outputPaths?.refreshOutputDir;
  const refreshSeamHistoryInput = input.outputPaths?.refreshSeamHistoryInput;
  const issues: string[] = [];
  const sourceRefs = collectSourceRefs(pairs);
  const linkedPairCount = pairs.filter((pair) => maybeRecord(maybeRecord(pair)?.linkage)?.linked === true).length;
  const damagedOrUnlinkedPairCount = pairs.filter((pair) => maybeRecord(maybeRecord(pair)?.linkage)?.linked !== true).length;

  const commandArtifactReady =
    command?.reviewStatus === "edge-layer-seam-history-operator-public-refresh-command-ready" &&
    commandValidation?.status === "edge-layer-seam-history-operator-public-refresh-command-ready";
  const commandArtifactInstructionsOnly =
    commandProof?.instructionsOnly === true &&
    commandProof?.liveSwarmRunClaimedByThisCommand === false &&
    commandProof?.publicRefreshExecutedByThisCommand === false;
  const refreshOutputDirMatchesCommand = commandOutputDir !== undefined && outputDir === commandOutputDir;
  const refreshInputPathMatchesCommand = expectedInputPath !== undefined && refreshSeamHistoryInput === expectedInputPath;
  const seamHistoryInputPresent =
    seamHistory?.artifactKind === "edge_layer_seam_history_material" &&
    typeof seamHistory.historyId === "string" &&
    typeof seamHistory.historyHash === "string" &&
    pairs.length > 0;
  const linkedPairPresent = linkedPairCount > 0;
  const damagedOrUnlinkedPairPresent = damagedOrUnlinkedPairCount > 0;
  const sourceRefsPreserved =
    sourceRefs.requestIds.length > 0 &&
    sourceRefs.requestHashes.length > 0 &&
    sourceRefs.receiptIds.length > 0 &&
    sourceRefs.receiptHashes.length > 0;

  if (!commandArtifactReady) issues.push("operator-public-refresh-command-not-ready");
  if (!commandArtifactInstructionsOnly) issues.push("operator-public-refresh-command-not-instructions-only");
  if (!refreshOutputDirMatchesCommand) issues.push("refresh-output-dir-does-not-match-command");
  if (!refreshInputPathMatchesCommand) issues.push("refresh-input-path-does-not-match-command");
  if (!seamHistoryInputPresent) issues.push("seam-history-input-not-present");
  if (!linkedPairPresent) issues.push("linked-pair-not-present");
  if (!damagedOrUnlinkedPairPresent) issues.push("damaged-or-unlinked-pair-not-present");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (hasOverclaim(command)) issues.push("operator-public-refresh-command-overclaim");

  const status: EdgeLayerSeamHistoryPublicRefreshInputPackageStatus = issues.length === 0
    ? "edge-layer-seam-history-public-refresh-input-package-ready"
    : "edge-layer-seam-history-public-refresh-input-package-incomplete";
  const seamHistoryInputHash = `sha256:${hash(input.seamHistoryInputBytes ?? stableJson(input.seamHistoryInput))}`;
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-public-refresh-input-package:${hash(stableJson({
      emittedAt: input.emittedAt,
      seamHistoryInputHash,
      outputPaths: input.outputPaths ?? {},
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_INPUT_PACKAGE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_INPUT_PACKAGE_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    outputPaths: { ...(input.outputPaths ?? {}) },
    packageOperation: {
      packagesInputOnly: true,
      copiesCurrentSeamHistoryMaterial: status === "edge-layer-seam-history-public-refresh-input-package-ready",
      localSuppliedInputUntilPublicReaderConsumes: true,
      publicRefreshRunByThisPackage: false,
    },
    commandSummary: {
      ...(typeof commandPlan?.refreshRunId === "string" ? { refreshRunId: commandPlan.refreshRunId } : {}),
      ...(typeof commandPlan?.outputDir === "string" ? { outputDir: commandPlan.outputDir } : {}),
      ...(typeof commandPlan?.namespace === "string" ? { namespace: commandPlan.namespace } : {}),
      ...(typeof commandPlan?.sourceDevice === "string" ? { sourceDevice: commandPlan.sourceDevice } : {}),
      ...(typeof commandPlan?.replicaDevice === "string" ? { replicaDevice: commandPlan.replicaDevice } : {}),
    },
    packagedMaterial: {
      seamHistoryInputHash,
      ...(typeof seamHistory?.historyId === "string" ? { historyId: seamHistory.historyId } : {}),
      ...(typeof seamHistory?.historyHash === "string" ? { historyHash: seamHistory.historyHash } : {}),
      linkedPairCount,
      damagedOrUnlinkedPairCount,
    },
    sourceRefs,
    proof: {
      ...(typeof commandProof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: commandProof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof commandProof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: commandProof.strongestSourceProofLabelObserved }
        : {}),
      packageOperationProofRung: "local_refresh_input_package_over_saved_public_hyperswarm_material",
      localSuppliedInputUntilPublicReaderConsumes: true,
      liveSwarmRunClaimedByThisPackage: false,
      publicRefreshExecutedByThisPackage: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      commandArtifactReady,
      commandArtifactInstructionsOnly,
      refreshOutputDirMatchesCommand,
      refreshInputPathMatchesCommand,
      seamHistoryInputPresent,
      linkedPairPresent,
      damagedOrUnlinkedPairPresent,
      sourceRefsPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noEdgeProjectionWriteClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisPackage: true,
      issues,
    },
    boundary: {
      inputPackageOnly: true,
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
      "public-refresh-input-package-is-local-supplied-input-until-public-reader-consumes-it",
      "public-refresh-input-package-does-not-run-public-swarm",
      "public-refresh-input-package-does-not-upgrade-saved-public-proof",
    ],
    rejections: status === "edge-layer-seam-history-public-refresh-input-package-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryPublicRefreshInputPackage(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryPublicRefreshInputPackage {
  const candidate = assertObject(value, "edge layer seam history public refresh input package");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_INPUT_PACKAGE_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_INPUT_PACKAGE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const packageOperation = assertObject(candidate.packageOperation, "packageOperation");
  assertEqual(packageOperation.packagesInputOnly, true, "packageOperation.packagesInputOnly");
  assertEqual(
    packageOperation.localSuppliedInputUntilPublicReaderConsumes,
    true,
    "packageOperation.localSuppliedInputUntilPublicReaderConsumes",
  );
  assertEqual(packageOperation.publicRefreshRunByThisPackage, false, "packageOperation.publicRefreshRunByThisPackage");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.packageOperationProofRung,
    "local_refresh_input_package_over_saved_public_hyperswarm_material",
    "proof.packageOperationProofRung",
  );
  assertEqual(
    proof.localSuppliedInputUntilPublicReaderConsumes,
    true,
    "proof.localSuppliedInputUntilPublicReaderConsumes",
  );
  assertEqual(proof.liveSwarmRunClaimedByThisPackage, false, "proof.liveSwarmRunClaimedByThisPackage");
  assertEqual(proof.publicRefreshExecutedByThisPackage, false, "proof.publicRefreshExecutedByThisPackage");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const validation = assertObject(candidate.validation, "validation");
  assertPackageStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noEdgeProjectionWriteClaim, true, "validation.noEdgeProjectionWriteClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisPackage, true, "validation.noLiveSwarmClaimByThisPackage");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.inputPackageOnly, true, "boundary.inputPackageOnly");
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
  assertPackageStatus(candidate.reviewStatus, "reviewStatus");
}

function collectSourceRefs(pairs: unknown[]): EdgeLayerSeamHistoryPublicRefreshInputPackage["sourceRefs"] {
  const requestIds: string[] = [];
  const requestHashes: string[] = [];
  const receiptIds: string[] = [];
  const receiptHashes: string[] = [];
  const sourceRepos: string[] = [];
  const durableRefs: string[] = [];
  const writerRefs: string[] = [];

  for (const pair of pairs) {
    const request = maybeRecord(maybeRecord(pair)?.request);
    const receipt = maybeRecord(maybeRecord(pair)?.receipt);
    pushString(requestIds, request?.requestId);
    pushString(requestHashes, request?.requestHash);
    pushString(receiptIds, receipt?.receiptId);
    pushString(receiptHashes, receipt?.receiptHash);
    pushString(sourceRepos, request?.sourceRepo);
    pushString(sourceRepos, receipt?.sourceRepo);
    pushString(durableRefs, request?.durableRef);
    pushString(durableRefs, receipt?.durableRef);
    pushString(writerRefs, request?.writerRef);
    pushString(writerRefs, receipt?.writerRef);
  }

  return {
    requestIds,
    requestHashes,
    receiptIds,
    receiptHashes,
    sourceRepos: unique(sourceRepos),
    durableRefs: unique(durableRefs),
    writerRefs: unique(writerRefs),
  };
}

function pushString(target: string[], value: unknown): void {
  if (typeof value === "string" && value.trim() !== "") target.push(value);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
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

function assertPackageStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryPublicRefreshInputPackageStatus {
  if (
    value !== "edge-layer-seam-history-public-refresh-input-package-ready" &&
    value !== "edge-layer-seam-history-public-refresh-input-package-incomplete"
  ) {
    throw new Error(`${label} must be a public refresh input package status`);
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
