import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildEdgeLayerSeamHistoryPublicDeviceRunInstructions,
  createHyperswarmReplicationSwarm,
  openEdgeLayerSeamHistoryPublicDeviceSourcePublisher,
  parseHyperswarmBootstrap,
} from "../src/index.js";

interface CliArgs {
  input?: string;
  manifestOutput?: string;
  instructionsOutput?: string;
  storageDir?: string;
  namespaceParts?: string[];
  emittedAt: string;
  recordedAt?: string;
  keepAliveMs: number;
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
  if (!args.input) throw new Error("input_required_for_public_source_device");
  if (!args.manifestOutput) throw new Error("manifest_output_required_for_public_source_device");
  if (!args.storageDir) throw new Error("storage_dir_required_for_public_source_device");

  const seamHistory = JSON.parse(await readFile(path.resolve(args.input), "utf8")) as unknown;
  const handle = await openEdgeLayerSeamHistoryPublicDeviceSourcePublisher({
    storageDir: path.resolve(args.storageDir),
    createSwarm: async (seed) => {
      const swarm = await createHyperswarmReplicationSwarm({ seed });
      await swarm.listen();
      return swarm;
    },
    seamHistory,
    emittedAt: args.emittedAt,
    recordedAt: args.recordedAt,
    namespaceParts: args.namespaceParts,
  });

  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    await handle.close();
  };
  process.once("SIGINT", () => {
    void stop().finally(() => process.exit(130));
  });
  process.once("SIGTERM", () => {
    void stop().finally(() => process.exit(143));
  });

  try {
    await writeFile(path.resolve(args.manifestOutput), `${JSON.stringify(handle.manifest, null, 2)}\n`, "utf8");
    await sleep(args.keepAliveMs);
  } finally {
    await stop();
  }
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
    keepAliveMs: 600_000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    if (arg === "--input") {
      args.input = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--manifest-output") {
      args.manifestOutput = requireNext(argv, index, arg);
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
    if (arg === "--recorded-at") {
      args.recordedAt = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--keep-alive-ms") {
      args.keepAliveMs = Number(requireNext(argv, index, arg));
      if (!Number.isFinite(args.keepAliveMs) || args.keepAliveMs < 0) {
        throw new Error("keep_alive_ms_must_be_non_negative_number");
      }
      index += 1;
      continue;
    }
    throw new Error(`unknown_argument:${arg}`);
  }

  return args;
}

function requireNext(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`missing_value_for:${flag}`);
  }
  return value;
}

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/run-edge-layer-seam-history-public-source-device.ts --input path --manifest-output path --storage-dir path [--instructions-output path] [--namespace comma,list] [--emitted-at iso] [--recorded-at iso] [--keep-alive-ms ms]",
    "",
    "Without CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1, emits instructions only and does not open swarm or Corestore.",
    "With CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 and CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1, writes durable seam history, joins public Hyperswarm, and emits a source manifest.",
    "Configured bootstrap is deferred for this public proof lane and is rejected for now.",
    "The source manifest alone is not observation proof; the replica device must consume it and emit the observation report.",
  ].join("\n") + "\n");
}
