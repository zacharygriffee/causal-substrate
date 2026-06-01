import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OPERATOR_PUBLIC_REFRESH_COMMAND_SCHEMA =
  "causal-substrate/edge-layer-seam-history-operator-public-refresh-command/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OPERATOR_PUBLIC_REFRESH_COMMAND_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-operator-public-refresh-command" as const;

export type EdgeLayerSeamHistoryOperatorPublicRefreshCommandStatus =
  | "edge-layer-seam-history-operator-public-refresh-command-ready"
  | "edge-layer-seam-history-operator-public-refresh-command-incomplete";

export interface EdgeLayerSeamHistoryOperatorPublicRefreshCommand {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OPERATOR_PUBLIC_REFRESH_COMMAND_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OPERATOR_PUBLIC_REFRESH_COMMAND_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    publicSeamProofIndex?: string | undefined;
    publicSwarmRefreshDecision?: string | undefined;
  };
  operatorSelection: {
    operatorSelectedRefresh: boolean;
    refreshCommandPrepared: boolean;
    publicRefreshExecutedByThisCommand: false;
  };
  commandPlan: {
    refreshRunId: string;
    outputDir: string;
    namespace: string;
    sourceDevice: string;
    replicaDevice: string;
    sourceKeepsAliveUntilReplicaCompletes: true;
  };
  prerequisites: {
    publicHyperswarmOnly: true;
    noBootstrapOverride: true;
    bootstrapOverrideAllowed: false;
    requiredEnvironment: string[];
    forbiddenEnvironment: string[];
    sourceDevice: string;
    replicaDevice: string;
  };
  commands: {
    sourceDeviceCommand: string;
    replicaDeviceCommand: string;
    downstreamCommands: string[];
  };
  expectedOutputs: string[];
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
    commandOperationProofRung: "local_operator_refresh_command_preparation_over_saved_public_hyperswarm_artifacts";
    instructionsOnly: true;
    liveSwarmRunClaimedByThisCommand: false;
    publicRefreshExecutedByThisCommand: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryOperatorPublicRefreshCommandStatus;
    operatorSelectedRefresh: boolean;
    publicSeamProofIndexReady: boolean;
    publicSwarmRefreshDecisionReady: boolean;
    sourceRefsPreserved: boolean;
    publicSourceProofRungPreserved: boolean;
    commandsNamePublicSwarm: boolean;
    commandsUnsetBootstrapOverride: boolean;
    expectedOutputsNamed: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noEdgeProjectionWriteClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisCommand: true;
    issues: string[];
  };
  boundary: {
    refreshCommandArtifactOnly: true;
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
  reviewStatus: EdgeLayerSeamHistoryOperatorPublicRefreshCommandStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryOperatorPublicRefreshCommand(input: {
  publicSeamProofIndex: unknown;
  publicSwarmRefreshDecision: unknown;
  emittedAt: string;
  operatorSelectedRefresh: boolean;
  sourcePaths?: EdgeLayerSeamHistoryOperatorPublicRefreshCommand["sourcePaths"] | undefined;
  refreshRunId?: string | undefined;
  outputDir?: string | undefined;
  namespace?: string | undefined;
  sourceDevice?: string | undefined;
  replicaDevice?: string | undefined;
  sourceStorageDir?: string | undefined;
  replicaStorageDir?: string | undefined;
  keepAliveMs?: number | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryOperatorPublicRefreshCommand {
  const publicSeamProofIndex = maybeRecord(input.publicSeamProofIndex);
  const publicSwarmRefreshDecision = maybeRecord(input.publicSwarmRefreshDecision);
  const indexProof = maybeRecord(publicSeamProofIndex?.proof);
  const indexRefs = maybeRecord(publicSeamProofIndex?.preservedRefs);
  const decisionProof = maybeRecord(publicSwarmRefreshDecision?.proof);
  const issues: string[] = [];

  const refreshRunId = input.refreshRunId ?? "public-hyperswarm-device-to-device-operator-refresh";
  const outputDir = input.outputDir ?? `proof-artifacts/${refreshRunId}`;
  const namespace = input.namespace ?? "public,device,seam-history,operator-refresh";
  const sourceDevice = input.sourceDevice ?? "platform-lab";
  const replicaDevice = input.replicaDevice ?? "mesh-lab";
  const sourceStorageDir = input.sourceStorageDir ?? `.tmp/${refreshRunId}-source`;
  const replicaStorageDir = input.replicaStorageDir ?? `.tmp/${refreshRunId}-replica`;
  const keepAliveMs = input.keepAliveMs ?? 600000;
  const sourceRefs = {
    requestIds: nonEmptyStrings(indexRefs?.requestIds),
    requestHashes: nonEmptyStrings(indexRefs?.requestHashes),
    receiptIds: nonEmptyStrings(indexRefs?.receiptIds),
    receiptHashes: nonEmptyStrings(indexRefs?.receiptHashes),
    sourceRepos: nonEmptyStrings(indexRefs?.sourceRepos),
    durableRefs: nonEmptyStrings(indexRefs?.durableRefs),
    writerRefs: nonEmptyStrings(indexRefs?.writerRefs),
  };
  const commands = buildCommands({
    outputDir,
    namespace,
    sourceStorageDir,
    replicaStorageDir,
    keepAliveMs,
  });
  const expectedOutputs = [
    `${outputDir}/seam-history-input.json`,
    `${outputDir}/public-source-manifest.json`,
    `${outputDir}/public-replica-reader-report.json`,
    `${outputDir}/public-replica-reader-report-readback.json`,
    `${outputDir}/edge-projection-handoff-bundle.json`,
    `${outputDir}/edge-projection-handoff-bundle-readback.json`,
    `${outputDir}/edge-layer-seam-history-proof-summary.json`,
    `${outputDir}/public-artifact-reproducibility-check.json`,
  ];

  const publicSeamProofIndexReady =
    publicSeamProofIndex?.reviewStatus === "edge-layer-seam-history-public-seam-proof-index-ready";
  const publicSwarmRefreshDecisionReady =
    publicSwarmRefreshDecision?.reviewStatus === "edge-layer-seam-history-public-swarm-refresh-decision-ready";
  const sourceRefsPreserved =
    sourceRefs.requestIds.length > 0 &&
    sourceRefs.requestHashes.length > 0 &&
    sourceRefs.receiptIds.length > 0 &&
    sourceRefs.receiptHashes.length > 0;
  const publicSourceProofRungPreserved =
    indexProof?.strongestSourceProofRungObserved ===
      "public_hyperswarm_replicated_durable_seam_history_observation" &&
    decisionProof?.strongestSourceProofRungObserved ===
      "public_hyperswarm_replicated_durable_seam_history_observation";
  const allCommands = [commands.sourceDeviceCommand, commands.replicaDeviceCommand, ...commands.downstreamCommands];
  const commandsNamePublicSwarm =
    commands.sourceDeviceCommand.includes("CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1") &&
    commands.replicaDeviceCommand.includes("CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1") &&
    commands.sourceDeviceCommand.includes("run-edge-layer-seam-history-public-source-device.ts") &&
    commands.replicaDeviceCommand.includes("run-edge-layer-seam-history-public-replica-device.ts");
  const commandsUnsetBootstrapOverride =
    commands.sourceDeviceCommand.includes("env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP") &&
    commands.replicaDeviceCommand.includes("env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP") &&
    allCommands.every((command) => !command.includes("CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP="));
  const expectedOutputsNamed = expectedOutputs.length === 8 && expectedOutputs.every((entry) => entry.trim() !== "");

  if (!input.operatorSelectedRefresh) issues.push("operator-selected-refresh-required");
  if (!publicSeamProofIndexReady) issues.push("public-seam-proof-index-not-ready");
  if (!publicSwarmRefreshDecisionReady) issues.push("public-swarm-refresh-decision-not-ready");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!publicSourceProofRungPreserved) issues.push("public-source-proof-rung-not-preserved");
  if (!commandsNamePublicSwarm) issues.push("public-swarm-commands-not-named");
  if (!commandsUnsetBootstrapOverride) issues.push("bootstrap-override-not-explicitly-unset");
  if (!expectedOutputsNamed) issues.push("expected-outputs-not-named");
  if (hasOverclaim(publicSeamProofIndex) || hasOverclaim(publicSwarmRefreshDecision)) {
    issues.push("refresh-command-source-overclaim");
  }

  const status: EdgeLayerSeamHistoryOperatorPublicRefreshCommandStatus = issues.length === 0
    ? "edge-layer-seam-history-operator-public-refresh-command-ready"
    : "edge-layer-seam-history-operator-public-refresh-command-incomplete";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-operator-public-refresh-command:${hash(stableJson({
      emittedAt: input.emittedAt,
      refreshRunId,
      sourcePaths: input.sourcePaths ?? {},
      operatorSelectedRefresh: input.operatorSelectedRefresh,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OPERATOR_PUBLIC_REFRESH_COMMAND_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OPERATOR_PUBLIC_REFRESH_COMMAND_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    operatorSelection: {
      operatorSelectedRefresh: input.operatorSelectedRefresh,
      refreshCommandPrepared: status === "edge-layer-seam-history-operator-public-refresh-command-ready",
      publicRefreshExecutedByThisCommand: false,
    },
    commandPlan: {
      refreshRunId,
      outputDir,
      namespace,
      sourceDevice,
      replicaDevice,
      sourceKeepsAliveUntilReplicaCompletes: true,
    },
    prerequisites: {
      publicHyperswarmOnly: true,
      noBootstrapOverride: true,
      bootstrapOverrideAllowed: false,
      requiredEnvironment: [
        "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1",
        "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1",
      ],
      forbiddenEnvironment: ["CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP"],
      sourceDevice,
      replicaDevice,
    },
    commands,
    expectedOutputs,
    sourceRefs,
    proof: {
      ...(typeof indexProof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: indexProof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof indexProof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: indexProof.strongestSourceProofLabelObserved }
        : {}),
      commandOperationProofRung: "local_operator_refresh_command_preparation_over_saved_public_hyperswarm_artifacts",
      instructionsOnly: true,
      liveSwarmRunClaimedByThisCommand: false,
      publicRefreshExecutedByThisCommand: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      operatorSelectedRefresh: input.operatorSelectedRefresh,
      publicSeamProofIndexReady,
      publicSwarmRefreshDecisionReady,
      sourceRefsPreserved,
      publicSourceProofRungPreserved,
      commandsNamePublicSwarm,
      commandsUnsetBootstrapOverride,
      expectedOutputsNamed,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noEdgeProjectionWriteClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisCommand: true,
      issues,
    },
    boundary: {
      refreshCommandArtifactOnly: true,
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
      "operator-public-refresh-command-is-instructions-only",
      "operator-public-refresh-command-does-not-run-public-swarm",
      "operator-public-refresh-command-does-not-upgrade-saved-public-proof",
    ],
    rejections: status === "edge-layer-seam-history-operator-public-refresh-command-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryOperatorPublicRefreshCommand(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryOperatorPublicRefreshCommand {
  const candidate = assertObject(value, "edge layer seam history operator public refresh command");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_OPERATOR_PUBLIC_REFRESH_COMMAND_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OPERATOR_PUBLIC_REFRESH_COMMAND_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const operatorSelection = assertObject(candidate.operatorSelection, "operatorSelection");
  assertEqual(operatorSelection.publicRefreshExecutedByThisCommand, false, "operatorSelection.publicRefreshExecutedByThisCommand");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.commandOperationProofRung,
    "local_operator_refresh_command_preparation_over_saved_public_hyperswarm_artifacts",
    "proof.commandOperationProofRung",
  );
  assertEqual(proof.instructionsOnly, true, "proof.instructionsOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisCommand, false, "proof.liveSwarmRunClaimedByThisCommand");
  assertEqual(proof.publicRefreshExecutedByThisCommand, false, "proof.publicRefreshExecutedByThisCommand");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const prerequisites = assertObject(candidate.prerequisites, "prerequisites");
  assertEqual(prerequisites.publicHyperswarmOnly, true, "prerequisites.publicHyperswarmOnly");
  assertEqual(prerequisites.noBootstrapOverride, true, "prerequisites.noBootstrapOverride");
  assertEqual(prerequisites.bootstrapOverrideAllowed, false, "prerequisites.bootstrapOverrideAllowed");
  const validation = assertObject(candidate.validation, "validation");
  assertCommandStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noEdgeProjectionWriteClaim, true, "validation.noEdgeProjectionWriteClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisCommand, true, "validation.noLiveSwarmClaimByThisCommand");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.refreshCommandArtifactOnly, true, "boundary.refreshCommandArtifactOnly");
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
  assertCommandStatus(candidate.reviewStatus, "reviewStatus");
}

function buildCommands(input: {
  outputDir: string;
  namespace: string;
  sourceStorageDir: string;
  replicaStorageDir: string;
  keepAliveMs: number;
}): EdgeLayerSeamHistoryOperatorPublicRefreshCommand["commands"] {
  return {
    sourceDeviceCommand: [
      "env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP",
      "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1",
      "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1",
      "npx tsx scripts/run-edge-layer-seam-history-public-source-device.ts",
      `--input ${input.outputDir}/seam-history-input.json`,
      `--manifest-output ${input.outputDir}/public-source-manifest.json`,
      `--storage-dir ${input.sourceStorageDir}`,
      `--namespace ${input.namespace}`,
      `--keep-alive-ms ${input.keepAliveMs}`,
    ].join(" "),
    replicaDeviceCommand: [
      "env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP",
      "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1",
      "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1",
      "npx tsx scripts/run-edge-layer-seam-history-public-replica-device.ts",
      `--manifest ${input.outputDir}/public-source-manifest.json`,
      `--report-output ${input.outputDir}/public-replica-reader-report.json`,
      `--storage-dir ${input.replicaStorageDir}`,
      `--namespace ${input.namespace}`,
    ].join(" "),
    downstreamCommands: [
      [
        "npx tsx scripts/derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report.ts",
        `--input-report ${input.outputDir}/public-replica-reader-report.json`,
        `--report-readback-output ${input.outputDir}/public-replica-reader-report-readback.json`,
        `--handoff-bundle-output ${input.outputDir}/edge-projection-handoff-bundle.json`,
      ].join(" "),
      [
        "npx tsx scripts/readback-edge-layer-seam-history-handoff-bundle.ts",
        `--input-bundle ${input.outputDir}/edge-projection-handoff-bundle.json`,
        `--readback-output ${input.outputDir}/edge-projection-handoff-bundle-readback.json`,
      ].join(" "),
      [
        "npx tsx scripts/summarize-edge-layer-seam-history-proof.ts",
        `--input ${input.outputDir}/public-source-manifest.json`,
        `--input ${input.outputDir}/public-replica-reader-report.json`,
        `--input ${input.outputDir}/public-replica-reader-report-readback.json`,
        `--input ${input.outputDir}/edge-projection-handoff-bundle.json`,
        `--input ${input.outputDir}/edge-projection-handoff-bundle-readback.json`,
        `--output ${input.outputDir}/edge-layer-seam-history-proof-summary.json`,
      ].join(" "),
      [
        "npx tsx scripts/check-edge-layer-seam-history-public-artifacts.ts",
        `--run-dir ${input.outputDir}`,
        `--output ${input.outputDir}/public-artifact-reproducibility-check.json`,
      ].join(" "),
    ],
  };
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

function assertCommandStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryOperatorPublicRefreshCommandStatus {
  if (
    value !== "edge-layer-seam-history-operator-public-refresh-command-ready" &&
    value !== "edge-layer-seam-history-operator-public-refresh-command-incomplete"
  ) {
    throw new Error(`${label} must be an operator public refresh command status`);
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
