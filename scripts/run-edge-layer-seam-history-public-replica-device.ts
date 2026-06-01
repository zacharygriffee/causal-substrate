import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildEdgeLayerSeamHistoryPublicDeviceRunInstructions,
  createHyperswarmReplicationSwarm,
  parseHyperswarmBootstrap,
  runEdgeLayerSeamHistoryPublicDeviceReplicaReader,
  type EdgeLayerSeamHistoryPublicDeviceSourceManifest,
} from "../src/index.js";

interface CliArgs {
  manifest?: string;
  reportOutput?: string;
  instructionsOutput?: string;
  storageDir?: string;
  namespaceParts?: string[];
  emittedAt: string;
  flushTimeoutMs?: number;
  replicationTimeoutMs?: number;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const instructions = buildEdgeLayerSeamHistoryPublicDeviceRunInstructions({
    emittedAt: args.emittedAt,
    namespaceParts: args.namespaceParts,
  });

  if (process.env.CAUSAL_SUBSTRATE_REAL_HYPERSWARM !== "1") {
    await writeInstructions(args.instructionsOutput, instructions);
    return;
  }

  requirePublicHyperswarmLane();
  if (!args.manifest) throw new Error("manifest_required_for_public_replica_device");
  if (!args.reportOutput) throw new Error("report_output_required_for_public_replica_device");
  if (!args.storageDir) throw new Error("storage_dir_required_for_public_replica_device");

  const sourceManifest = JSON.parse(
    await readFile(path.resolve(args.manifest), "utf8"),
  ) as EdgeLayerSeamHistoryPublicDeviceSourceManifest;
  const report = await runEdgeLayerSeamHistoryPublicDeviceReplicaReader({
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
  });

  await writeFile(path.resolve(args.reportOutput), `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

async function writeInstructions(
  outputPath: string | undefined,
  instructions: ReturnType<typeof buildEdgeLayerSeamHistoryPublicDeviceRunInstructions>,
) {
  if (outputPath) {
    await writeFile(path.resolve(outputPath), `${JSON.stringify(instructions, null, 2)}\n`, "utf8");
  } else {
    process.stdout.write(`${JSON.stringify(instructions, null, 2)}\n`);
  }
}

function requirePublicHyperswarmLane(): void {
  if (process.env.CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC !== "1") {
    throw new Error("public_hyperswarm_required_for_public_device_seam_proof");
  }
  if (parseHyperswarmBootstrap(process.env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP).length > 0) {
    throw new Error("configured_bootstrap_deferred_for_public_hyperswarm_proof_lane");
  }
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    emittedAt: new Date().toISOString(),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
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
    if (arg === "--instructions-output") {
      args.instructionsOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--storage-dir") {
      args.storageDir = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--namespace") {
      args.namespaceParts = requireNext(argv, index, arg)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      index += 1;
      continue;
    }
    if (arg === "--emitted-at") {
      args.emittedAt = requireNext(argv, index, arg);
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

function parseNonNegativeNumber(raw: string, flag: string): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${flag}_must_be_non_negative_number`);
  }
  return parsed;
}

function requireNext(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`missing_value_for:${flag}`);
  }
  return value;
}

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/run-edge-layer-seam-history-public-replica-device.ts --manifest path --report-output path --storage-dir path [--instructions-output path] [--namespace comma,list] [--emitted-at iso] [--flush-timeout-ms ms] [--replication-timeout-ms ms]",
    "",
    "Without CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1, emits instructions only and does not open swarm or Corestore.",
    "With CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 and CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1, consumes a source manifest over public Hyperswarm and emits a bounded causal observation report.",
    "Configured bootstrap is deferred for this public proof lane and is rejected for now.",
    "The report does not claim canonical history, Layer admission, RBC interpretation, Mesh publication, or authority.",
  ].join("\n") + "\n");
}
