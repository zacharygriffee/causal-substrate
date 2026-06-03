import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  createHyperswarmReplicationSwarm,
  parseHyperswarmBootstrap,
  readGenericCausalSeamReplicaReportFromDurableObservation,
  runGenericCausalSeamPublicReplicaReader,
  type GenericCausalSeamPublicReplicaReport,
  type GenericCausalSeamPublicSourceManifest,
} from "../src/index.js";

type PublicObserverCommand = "up" | "status" | "down" | "observe";

interface CliArgs {
  command: PublicObserverCommand;
  emittedAt: string;
  state?: string;
  stateOutput?: string;
  statusOutput?: string;
  instructionsOutput?: string;
  manifest?: string;
  reportOutput?: string;
  readbackOutput?: string;
  storageDir?: string;
  namespaceParts?: string[];
  edgeDescriptor?: string;
  layerDescriptor?: string;
  flushTimeoutMs?: number;
  replicationTimeoutMs?: number;
}

interface DescriptorRef {
  role: "edge_descriptor" | "layer_descriptor" | "source_manifest";
  path: string;
  sha256: string;
}

interface PublicObserverLifecycleState {
  artifactKind: "causal-public-observer-lifecycle-state";
  schema: "causal-substrate/public-observer-lifecycle-state/v1";
  schemaVersion: 1;
  emittedAt: string;
  observerStatus: "ready_for_public_swarm_observe" | "stopped";
  operationProofRung: "local_artifact_seam";
  higherRungPressure: "durable_replicated_public_swarm_seam";
  chainTarget: string[];
  descriptorRefs: DescriptorRef[];
  proofGate: {
    lifecycleStateDoesNotClaimSwarmProof: true;
    publicSwarmProofRequiresObserveCommand: true;
    observeRequiresRealHyperswarmEnv: "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1";
    observeRequiresPublicHyperswarmEnv: "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1";
    configuredBootstrapRejectedForPublicProof: true;
    durableReadRequiredForDurableReplicatedPublicSwarmProof: true;
  };
  boundary: PublicObserverBoundary;
  nextPressure: string;
}

interface PublicObserverStatusReport {
  artifactKind: "causal-public-observer-status-report";
  schema: "causal-substrate/public-observer-status-report/v1";
  schemaVersion: 1;
  emittedAt: string;
  operationProofRung: "local_artifact_seam";
  observedState: PublicObserverLifecycleState;
  publicSwarmProofClaimedNow: false;
  boundary: PublicObserverBoundary;
  nextPressure: string;
}

interface PublicObserverInstructions {
  artifactKind: "causal-public-observer-instructions";
  schema: "causal-substrate/public-observer-instructions/v1";
  schemaVersion: 1;
  emittedAt: string;
  command: PublicObserverCommand;
  operationProofRung: "local_artifact_seam";
  instructionsOnly: true;
  publicSwarmProofClaimedNow: false;
  requiredEnvironment: PublicObserverLifecycleState["proofGate"];
  commands: {
    up: string;
    observe: string;
    status: string;
    down: string;
  };
  boundary: PublicObserverBoundary;
  nextPressure: string;
}

interface PublicObserverBoundary {
  observationOnly: true;
  writesEdgeState: false;
  writesLayerState: false;
  acceptsCanonicalHistory: false;
  admitsLayerEvidence: false;
  interpretsRbc: false;
  claimsQuorum: false;
  grantsAuthority: false;
  publishesToMesh: false;
  writesProductionContinuity: false;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  switch (args.command) {
    case "up":
      await commandUp(args);
      return;
    case "status":
      await commandStatus(args);
      return;
    case "down":
      await commandDown(args);
      return;
    case "observe":
      await commandObserve(args);
      return;
  }
}

async function commandUp(args: CliArgs): Promise<void> {
  if (!args.stateOutput) throw new Error("state_output_required_for_causal_public_observer_up");
  const descriptorRefs = await collectDescriptorRefs(args);
  const state = buildLifecycleState({
    emittedAt: args.emittedAt,
    observerStatus: "ready_for_public_swarm_observe",
    descriptorRefs,
  });
  await writeJson(args.stateOutput, state);
}

async function commandStatus(args: CliArgs): Promise<void> {
  if (!args.state) throw new Error("state_required_for_causal_public_observer_status");
  const state = JSON.parse(await readFile(path.resolve(args.state), "utf8")) as PublicObserverLifecycleState;
  const report: PublicObserverStatusReport = {
    artifactKind: "causal-public-observer-status-report",
    schema: "causal-substrate/public-observer-status-report/v1",
    schemaVersion: 1,
    emittedAt: args.emittedAt,
    operationProofRung: "local_artifact_seam",
    observedState: state,
    publicSwarmProofClaimedNow: false,
    boundary: boundary(),
    nextPressure: state.observerStatus === "ready_for_public_swarm_observe"
      ? "run_observe_against_edge_layer_public_descriptor_when_live_material_is_available"
      : "run_up_before_observe",
  };
  await writeJson(args.statusOutput, report);
}

async function commandDown(args: CliArgs): Promise<void> {
  if (!args.state) throw new Error("state_required_for_causal_public_observer_down");
  const state = JSON.parse(await readFile(path.resolve(args.state), "utf8")) as PublicObserverLifecycleState;
  const stopped = buildLifecycleState({
    emittedAt: args.emittedAt,
    observerStatus: "stopped",
    descriptorRefs: state.descriptorRefs,
  });
  await writeJson(args.statusOutput ?? args.state, stopped);
}

async function commandObserve(args: CliArgs): Promise<void> {
  if (process.env.CAUSAL_SUBSTRATE_REAL_HYPERSWARM !== "1") {
    await writeJson(args.instructionsOutput, buildInstructions(args));
    return;
  }

  requirePublicHyperswarmLane();
  if (!args.manifest) throw new Error("manifest_required_for_causal_public_observer_observe");
  if (!args.reportOutput) throw new Error("report_output_required_for_causal_public_observer_observe");
  if (!args.storageDir) throw new Error("storage_dir_required_for_causal_public_observer_observe");

  const sourceManifest = JSON.parse(
    await readFile(path.resolve(args.manifest), "utf8"),
  ) as GenericCausalSeamPublicSourceManifest;
  const report = await runGenericCausalSeamPublicReplicaReader({
    storageDir: path.resolve(args.storageDir),
    createSwarm: async (seed) => {
      const swarm = await createHyperswarmReplicationSwarm({ seed });
      await swarm.listen();
      return swarm;
    },
    sourceManifest,
    emittedAt: args.emittedAt,
    namespaceParts: args.namespaceParts,
    flushTimeoutMs: args.flushTimeoutMs,
    replicationTimeoutMs: args.replicationTimeoutMs,
    publicHyperswarmInputObservedByCausalSubstrate: true,
  });

  await writeJson(args.reportOutput, report);
  if (args.readbackOutput) {
    const readback = await readGenericCausalSeamReplicaReportFromDurableObservation({
      report,
      emittedAt: args.emittedAt,
    });
    await writeJson(args.readbackOutput, readback);
  }
}

function buildLifecycleState(input: {
  emittedAt: string;
  observerStatus: PublicObserverLifecycleState["observerStatus"];
  descriptorRefs: DescriptorRef[];
}): PublicObserverLifecycleState {
  return {
    artifactKind: "causal-public-observer-lifecycle-state",
    schema: "causal-substrate/public-observer-lifecycle-state/v1",
    schemaVersion: 1,
    emittedAt: input.emittedAt,
    observerStatus: input.observerStatus,
    operationProofRung: "local_artifact_seam",
    higherRungPressure: "durable_replicated_public_swarm_seam",
    chainTarget: [
      "edge_persistent_public_seam_client_intent",
      "layer_persistent_public_participant",
      "layer_durable_receipt_evidence",
      "edge_readback_projection",
      "causal_public_swarm_derived_observation",
      "spine_posture_evidence",
    ],
    descriptorRefs: input.descriptorRefs,
    proofGate: proofGate(),
    boundary: boundary(),
    nextPressure: input.observerStatus === "ready_for_public_swarm_observe"
      ? "observe_edge_layer_durable_history_descriptor_through_public_hyperswarm"
      : "public_observer_stopped_no_swarm_claim",
  };
}

function buildInstructions(args: CliArgs): PublicObserverInstructions {
  return {
    artifactKind: "causal-public-observer-instructions",
    schema: "causal-substrate/public-observer-instructions/v1",
    schemaVersion: 1,
    emittedAt: args.emittedAt,
    command: args.command,
    operationProofRung: "local_artifact_seam",
    instructionsOnly: true,
    publicSwarmProofClaimedNow: false,
    requiredEnvironment: proofGate(),
    commands: {
      up: "npx tsx scripts/causal-public-observer.ts up --state-output causal-public-observer-state.json --source-manifest public-source-manifest.json",
      observe: "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 npx tsx scripts/causal-public-observer.ts observe --manifest public-source-manifest.json --report-output causal-public-observer-report.json --readback-output causal-public-observer-readback.json --storage-dir .tmp/causal-public-observer",
      status: "npx tsx scripts/causal-public-observer.ts status --state causal-public-observer-state.json --status-output causal-public-observer-status.json",
      down: "npx tsx scripts/causal-public-observer.ts down --state causal-public-observer-state.json --status-output causal-public-observer-stopped.json",
    },
    boundary: boundary(),
    nextPressure: "rerun_observe_with_real_public_hyperswarm_env_and_edge_layer_descriptor",
  };
}

async function collectDescriptorRefs(args: CliArgs): Promise<DescriptorRef[]> {
  const refs: DescriptorRef[] = [];
  if (args.edgeDescriptor) refs.push(await descriptorRef("edge_descriptor", args.edgeDescriptor));
  if (args.layerDescriptor) refs.push(await descriptorRef("layer_descriptor", args.layerDescriptor));
  if (args.manifest) refs.push(await descriptorRef("source_manifest", args.manifest));
  return refs;
}

async function descriptorRef(role: DescriptorRef["role"], inputPath: string): Promise<DescriptorRef> {
  const absolute = path.resolve(inputPath);
  const bytes = await readFile(absolute);
  return {
    role,
    path: inputPath,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

function requirePublicHyperswarmLane(): void {
  if (process.env.CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC !== "1") {
    throw new Error("public_hyperswarm_required_for_causal_public_observer");
  }
  if (parseHyperswarmBootstrap(process.env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP).length > 0) {
    throw new Error("configured_bootstrap_deferred_for_causal_public_observer");
  }
}

function proofGate(): PublicObserverLifecycleState["proofGate"] {
  return {
    lifecycleStateDoesNotClaimSwarmProof: true,
    publicSwarmProofRequiresObserveCommand: true,
    observeRequiresRealHyperswarmEnv: "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1",
    observeRequiresPublicHyperswarmEnv: "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1",
    configuredBootstrapRejectedForPublicProof: true,
    durableReadRequiredForDurableReplicatedPublicSwarmProof: true,
  };
}

function boundary(): PublicObserverBoundary {
  return {
    observationOnly: true,
    writesEdgeState: false,
    writesLayerState: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    interpretsRbc: false,
    claimsQuorum: false,
    grantsAuthority: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
}

async function writeJson(outputPath: string | undefined, value: GenericCausalSeamPublicReplicaReport | unknown): Promise<void> {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (!outputPath) {
    process.stdout.write(text);
    return;
  }
  const absolute = path.resolve(outputPath);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, text, "utf8");
}

function parseArgs(argv: string[]): CliArgs {
  const command = argv[0];
  if (command === "--help" || command === "-h" || !command) {
    printUsage();
    process.exit(command ? 0 : 1);
  }
  if (!isCommand(command)) throw new Error(`unknown_causal_public_observer_command:${command}`);
  const args: CliArgs = {
    command,
    emittedAt: new Date().toISOString(),
  };

  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    if (arg === "--emitted-at") {
      args.emittedAt = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--state") {
      args.state = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--state-output") {
      args.stateOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--status-output") {
      args.statusOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--instructions-output") {
      args.instructionsOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--manifest") {
      args.manifest = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--report-output") {
      args.reportOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--readback-output") {
      args.readbackOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--storage-dir") {
      args.storageDir = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--namespace") {
      args.namespaceParts = requireNext(argv, index, arg).split(",").map((part) => part.trim()).filter(Boolean);
      index += 1;
      continue;
    }
    if (arg === "--edge-descriptor") {
      args.edgeDescriptor = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--layer-descriptor") {
      args.layerDescriptor = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--flush-timeout-ms") {
      args.flushTimeoutMs = parseNonNegativeNumber(requireNext(argv, index, arg), arg);
      index += 1;
      continue;
    }
    if (arg === "--replication-timeout-ms") {
      args.replicationTimeoutMs = parseNonNegativeNumber(requireNext(argv, index, arg), arg);
      index += 1;
      continue;
    }
    throw new Error(`unknown_argument:${arg}`);
  }

  return args;
}

function isCommand(value: string): value is PublicObserverCommand {
  return value === "up" || value === "status" || value === "down" || value === "observe";
}

function parseNonNegativeNumber(raw: string, flag: string): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${flag}_must_be_non_negative_number`);
  return parsed;
}

function requireNext(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`missing_value_for:${flag}`);
  return value;
}

function printUsage(): void {
  process.stdout.write([
    "Usage:",
    "  tsx scripts/causal-public-observer.ts up --state-output path [--edge-descriptor path] [--layer-descriptor path] [--manifest path]",
    "  tsx scripts/causal-public-observer.ts status --state path [--status-output path]",
    "  tsx scripts/causal-public-observer.ts down --state path [--status-output path]",
    "  tsx scripts/causal-public-observer.ts observe --manifest path --report-output path --storage-dir path [--readback-output path] [--instructions-output path]",
    "",
    "Lifecycle files are local_artifact_seam posture only.",
    "Observe emits instructions only until CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 is set.",
    "Public proof also requires CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 and an unset CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP.",
  ].join("\n") + "\n");
}
