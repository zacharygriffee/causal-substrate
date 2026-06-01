import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_READINESS_GATE_SCHEMA =
  "causal-substrate/edge-layer-seam-history-public-refresh-readiness-gate/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_READINESS_GATE_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-public-refresh-readiness-gate" as const;

export type EdgeLayerSeamHistoryPublicRefreshReadinessGateStatus =
  | "edge-layer-seam-history-public-refresh-readiness-gate-ready"
  | "edge-layer-seam-history-public-refresh-readiness-gate-blocked";

export interface EdgeLayerSeamHistoryPublicRefreshReadinessGate {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_READINESS_GATE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_READINESS_GATE_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  sourcePaths: {
    operatorPublicRefreshCommand?: string | undefined;
  };
  readiness: {
    status: EdgeLayerSeamHistoryPublicRefreshReadinessGateStatus;
    operatorMayRunPreparedPublicRefreshCommands: boolean;
    preparedCommandArtifactReady: boolean;
    publicRefreshRunByThisGate: false;
    rationale: string[];
  };
  commandSummary: {
    refreshRunId?: string | undefined;
    outputDir?: string | undefined;
    namespace?: string | undefined;
    sourceDevice?: string | undefined;
    replicaDevice?: string | undefined;
    expectedOutputCount: number;
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
    gateOperationProofRung: "local_readiness_gate_over_operator_public_refresh_command_artifact";
    readsPreparedCommandOnly: true;
    liveSwarmRunClaimedByThisGate: false;
    publicRefreshExecutedByThisGate: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryPublicRefreshReadinessGateStatus;
    operatorSelectedRefresh: boolean;
    commandArtifactReady: boolean;
    commandArtifactInstructionsOnly: boolean;
    sourceRefsPreserved: boolean;
    publicSourceProofRungPreserved: boolean;
    publicSwarmCommandsPresent: boolean;
    bootstrapOverrideRejected: boolean;
    expectedOutputsNamed: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noEdgeProjectionWriteClaim: true;
    noProductionContinuityWriteClaim: true;
    noLiveSwarmClaimByThisGate: true;
    issues: string[];
  };
  boundary: {
    readinessGateOnly: true;
    readsSavedCommandArtifactOnly: true;
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
  reviewStatus: EdgeLayerSeamHistoryPublicRefreshReadinessGateStatus;
  warnings: string[];
  rejections: string[];
}

export function buildEdgeLayerSeamHistoryPublicRefreshReadinessGate(input: {
  operatorPublicRefreshCommand: unknown;
  emittedAt: string;
  sourcePaths?: EdgeLayerSeamHistoryPublicRefreshReadinessGate["sourcePaths"] | undefined;
  artifactId?: string | undefined;
}): EdgeLayerSeamHistoryPublicRefreshReadinessGate {
  const command = maybeRecord(input.operatorPublicRefreshCommand);
  const commandProof = maybeRecord(command?.proof);
  const commandValidation = maybeRecord(command?.validation);
  const operatorSelection = maybeRecord(command?.operatorSelection);
  const commandPlan = maybeRecord(command?.commandPlan);
  const prerequisites = maybeRecord(command?.prerequisites);
  const commands = maybeRecord(command?.commands);
  const sourceRefsInput = maybeRecord(command?.sourceRefs);
  const issues: string[] = [];
  const sourceRefs = {
    requestIds: nonEmptyStrings(sourceRefsInput?.requestIds),
    requestHashes: nonEmptyStrings(sourceRefsInput?.requestHashes),
    receiptIds: nonEmptyStrings(sourceRefsInput?.receiptIds),
    receiptHashes: nonEmptyStrings(sourceRefsInput?.receiptHashes),
    sourceRepos: nonEmptyStrings(sourceRefsInput?.sourceRepos),
    durableRefs: nonEmptyStrings(sourceRefsInput?.durableRefs),
    writerRefs: nonEmptyStrings(sourceRefsInput?.writerRefs),
  };
  const expectedOutputs = nonEmptyStrings(command?.expectedOutputs);
  const sourceCommand = typeof commands?.sourceDeviceCommand === "string" ? commands.sourceDeviceCommand : "";
  const replicaCommand = typeof commands?.replicaDeviceCommand === "string" ? commands.replicaDeviceCommand : "";
  const downstreamCommands = nonEmptyStrings(commands?.downstreamCommands);
  const allCommands = [sourceCommand, replicaCommand, ...downstreamCommands];

  const operatorSelectedRefresh = operatorSelection?.operatorSelectedRefresh === true;
  const commandArtifactReady =
    command?.reviewStatus === "edge-layer-seam-history-operator-public-refresh-command-ready" &&
    commandValidation?.status === "edge-layer-seam-history-operator-public-refresh-command-ready";
  const commandArtifactInstructionsOnly =
    commandProof?.instructionsOnly === true &&
    commandProof?.liveSwarmRunClaimedByThisCommand === false &&
    commandProof?.publicRefreshExecutedByThisCommand === false;
  const sourceRefsPreserved =
    sourceRefs.requestIds.length > 0 &&
    sourceRefs.requestHashes.length > 0 &&
    sourceRefs.receiptIds.length > 0 &&
    sourceRefs.receiptHashes.length > 0;
  const publicSourceProofRungPreserved =
    commandProof?.strongestSourceProofRungObserved ===
    "public_hyperswarm_replicated_durable_seam_history_observation";
  const publicSwarmCommandsPresent =
    sourceCommand.includes("CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1") &&
    sourceCommand.includes("CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1") &&
    replicaCommand.includes("CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1") &&
    replicaCommand.includes("CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1") &&
    sourceCommand.includes("run-edge-layer-seam-history-public-source-device.ts") &&
    replicaCommand.includes("run-edge-layer-seam-history-public-replica-device.ts");
  const bootstrapOverrideRejected =
    prerequisites?.bootstrapOverrideAllowed === false &&
    prerequisites?.noBootstrapOverride === true &&
    allCommands.every((commandLine) =>
      commandLine.includes("env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP") ||
      !commandLine.includes("CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP")
    ) &&
    allCommands.every((commandLine) => !commandLine.includes("CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP="));
  const expectedOutputsNamed = expectedOutputs.length > 0;

  if (!operatorSelectedRefresh) issues.push("operator-selected-refresh-required");
  if (!commandArtifactReady) issues.push("operator-public-refresh-command-not-ready");
  if (!commandArtifactInstructionsOnly) issues.push("operator-public-refresh-command-not-instructions-only");
  if (!sourceRefsPreserved) issues.push("source-refs-not-preserved");
  if (!publicSourceProofRungPreserved) issues.push("public-source-proof-rung-not-preserved");
  if (!publicSwarmCommandsPresent) issues.push("public-swarm-commands-missing");
  if (!bootstrapOverrideRejected) issues.push("bootstrap-override-not-rejected");
  if (!expectedOutputsNamed) issues.push("expected-outputs-not-named");
  if (hasOverclaim(command)) issues.push("operator-public-refresh-command-overclaim");

  const status: EdgeLayerSeamHistoryPublicRefreshReadinessGateStatus = issues.length === 0
    ? "edge-layer-seam-history-public-refresh-readiness-gate-ready"
    : "edge-layer-seam-history-public-refresh-readiness-gate-blocked";
  const artifactId = input.artifactId ??
    `causal-edge-layer-seam-history-public-refresh-readiness-gate:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      commandArtifactId: command?.artifactId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_READINESS_GATE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_READINESS_GATE_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    readiness: {
      status,
      operatorMayRunPreparedPublicRefreshCommands:
        status === "edge-layer-seam-history-public-refresh-readiness-gate-ready",
      preparedCommandArtifactReady: commandArtifactReady,
      publicRefreshRunByThisGate: false,
      rationale: buildRationale(status),
    },
    commandSummary: {
      ...(typeof commandPlan?.refreshRunId === "string" ? { refreshRunId: commandPlan.refreshRunId } : {}),
      ...(typeof commandPlan?.outputDir === "string" ? { outputDir: commandPlan.outputDir } : {}),
      ...(typeof commandPlan?.namespace === "string" ? { namespace: commandPlan.namespace } : {}),
      ...(typeof commandPlan?.sourceDevice === "string" ? { sourceDevice: commandPlan.sourceDevice } : {}),
      ...(typeof commandPlan?.replicaDevice === "string" ? { replicaDevice: commandPlan.replicaDevice } : {}),
      expectedOutputCount: expectedOutputs.length,
    },
    sourceRefs,
    proof: {
      ...(typeof commandProof?.strongestSourceProofRungObserved === "string"
        ? { strongestSourceProofRungObserved: commandProof.strongestSourceProofRungObserved }
        : {}),
      ...(typeof commandProof?.strongestSourceProofLabelObserved === "string"
        ? { strongestSourceProofLabelObserved: commandProof.strongestSourceProofLabelObserved }
        : {}),
      gateOperationProofRung: "local_readiness_gate_over_operator_public_refresh_command_artifact",
      readsPreparedCommandOnly: true,
      liveSwarmRunClaimedByThisGate: false,
      publicRefreshExecutedByThisGate: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      operatorSelectedRefresh,
      commandArtifactReady,
      commandArtifactInstructionsOnly,
      sourceRefsPreserved,
      publicSourceProofRungPreserved,
      publicSwarmCommandsPresent,
      bootstrapOverrideRejected,
      expectedOutputsNamed,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noEdgeProjectionWriteClaim: true,
      noProductionContinuityWriteClaim: true,
      noLiveSwarmClaimByThisGate: true,
      issues,
    },
    boundary: {
      readinessGateOnly: true,
      readsSavedCommandArtifactOnly: true,
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
      "public-refresh-readiness-gate-reads-prepared-command-only",
      "public-refresh-readiness-gate-does-not-run-public-swarm",
      "public-refresh-readiness-gate-does-not-upgrade-saved-public-proof",
    ],
    rejections: status === "edge-layer-seam-history-public-refresh-readiness-gate-ready" ? [] : issues,
  };
}

export function assertEdgeLayerSeamHistoryPublicRefreshReadinessGate(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryPublicRefreshReadinessGate {
  const candidate = assertObject(value, "edge layer seam history public refresh readiness gate");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_READINESS_GATE_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_PUBLIC_REFRESH_READINESS_GATE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const readiness = assertObject(candidate.readiness, "readiness");
  assertGateStatus(readiness.status, "readiness.status");
  assertEqual(readiness.publicRefreshRunByThisGate, false, "readiness.publicRefreshRunByThisGate");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.gateOperationProofRung,
    "local_readiness_gate_over_operator_public_refresh_command_artifact",
    "proof.gateOperationProofRung",
  );
  assertEqual(proof.readsPreparedCommandOnly, true, "proof.readsPreparedCommandOnly");
  assertEqual(proof.liveSwarmRunClaimedByThisGate, false, "proof.liveSwarmRunClaimedByThisGate");
  assertEqual(proof.publicRefreshExecutedByThisGate, false, "proof.publicRefreshExecutedByThisGate");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const validation = assertObject(candidate.validation, "validation");
  assertGateStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noEdgeProjectionWriteClaim, true, "validation.noEdgeProjectionWriteClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  assertEqual(validation.noLiveSwarmClaimByThisGate, true, "validation.noLiveSwarmClaimByThisGate");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.readinessGateOnly, true, "boundary.readinessGateOnly");
  assertEqual(boundary.readsSavedCommandArtifactOnly, true, "boundary.readsSavedCommandArtifactOnly");
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
  assertGateStatus(candidate.reviewStatus, "reviewStatus");
}

function buildRationale(status: EdgeLayerSeamHistoryPublicRefreshReadinessGateStatus): string[] {
  if (status === "edge-layer-seam-history-public-refresh-readiness-gate-ready") {
    return ["operator-selected public refresh command artifact is ready for an operator-run public swarm refresh"];
  }
  return ["operator-selected public refresh command artifact is blocked; do not run refresh from this gate"];
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

function assertGateStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryPublicRefreshReadinessGateStatus {
  if (
    value !== "edge-layer-seam-history-public-refresh-readiness-gate-ready" &&
    value !== "edge-layer-seam-history-public-refresh-readiness-gate-blocked"
  ) {
    throw new Error(`${label} must be a public refresh readiness gate status`);
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
