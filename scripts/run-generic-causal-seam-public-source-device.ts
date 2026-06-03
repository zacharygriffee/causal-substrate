import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildGenericCausalSeamPublicRunInstructions,
  createHyperswarmReplicationSwarm,
  openGenericCausalSeamPublicSourcePublisher,
  parseHyperswarmBootstrap,
  type GenericCausalSeamHistoryEnvelope,
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
  const instructions = buildGenericCausalSeamPublicRunInstructions({
    emittedAt: args.emittedAt,
  });

  if (process.env.CAUSAL_SUBSTRATE_REAL_HYPERSWARM !== "1") {
    await writeJson(args.instructionsOutput, instructions);
    return;
  }

  requirePublicHyperswarmLane();
  if (!args.input) throw new Error("input_required_for_generic_public_source_device");
  if (!args.manifestOutput) throw new Error("manifest_output_required_for_generic_public_source_device");
  if (!args.storageDir) throw new Error("storage_dir_required_for_generic_public_source_device");

  const seamHistory = JSON.parse(
    await readFile(path.resolve(args.input), "utf8"),
  ) as GenericCausalSeamHistoryEnvelope;
  const handle = await openGenericCausalSeamPublicSourcePublisher({
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
    await writeJson(args.manifestOutput, handle.manifest);
    await sleep(args.keepAliveMs);
  } finally {
    await stop();
  }
}

function requirePublicHyperswarmLane(): void {
  if (process.env.CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC !== "1") {
    throw new Error("public_hyperswarm_required_for_generic_causal_seam_public_source");
  }
  if (parseHyperswarmBootstrap(process.env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP).length > 0) {
    throw new Error("configured_bootstrap_deferred_for_generic_causal_seam_public_lane");
  }
}

async function writeJson(outputPath: string | undefined, value: unknown) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (outputPath) {
    await writeFile(path.resolve(outputPath), text, "utf8");
  } else {
    process.stdout.write(text);
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
      args.namespaceParts = requireNext(argv, index, arg).split(",").map((part) => part.trim()).filter(Boolean);
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
  if (!value || value.startsWith("--")) throw new Error(`missing_value_for:${flag}`);
  return value;
}

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/run-generic-causal-seam-public-source-device.ts --input path --manifest-output path --storage-dir path [--instructions-output path] [--namespace comma,list] [--emitted-at iso] [--recorded-at iso] [--keep-alive-ms ms]",
    "",
    "Without CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1, emits instructions only and does not open swarm or Corestore.",
    "With CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 and CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1, writes generic seam history, joins public Hyperswarm, and emits a source manifest.",
    "Configured bootstrap is rejected for this public proof lane.",
    "The source manifest alone is not observation proof; a replica reader must consume the durable material.",
  ].join("\n") + "\n");
}
