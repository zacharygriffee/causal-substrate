import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildGenericCausalSeamPublicRunInstructions,
  createHyperswarmReplicationSwarm,
  parseHyperswarmBootstrap,
  runGenericCausalSeamPublicReplicaReader,
  type GenericCausalSeamPublicSourceManifest,
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
  const instructions = buildGenericCausalSeamPublicRunInstructions({
    emittedAt: args.emittedAt,
  });

  if (process.env.CAUSAL_SUBSTRATE_REAL_HYPERSWARM !== "1") {
    await writeJson(args.instructionsOutput, instructions);
    return;
  }

  requirePublicHyperswarmLane();
  if (!args.manifest) throw new Error("manifest_required_for_generic_public_replica_device");
  if (!args.reportOutput) throw new Error("report_output_required_for_generic_public_replica_device");
  if (!args.storageDir) throw new Error("storage_dir_required_for_generic_public_replica_device");

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
}

function requirePublicHyperswarmLane(): void {
  if (process.env.CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC !== "1") {
    throw new Error("public_hyperswarm_required_for_generic_causal_seam_public_replica");
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
      args.namespaceParts = requireNext(argv, index, arg).split(",").map((part) => part.trim()).filter(Boolean);
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
    "Usage: tsx scripts/run-generic-causal-seam-public-replica-device.ts --manifest path --report-output path --storage-dir path [--instructions-output path] [--namespace comma,list] [--emitted-at iso] [--flush-timeout-ms ms] [--replication-timeout-ms ms]",
    "",
    "Without CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1, emits instructions only and does not open swarm or Corestore.",
    "With CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 and CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1, consumes generic seam material over public Hyperswarm and emits a bounded observation report.",
    "Configured bootstrap is rejected for this public proof lane.",
    "Timeouts are unresolved evidence, not success and not doctrine failure.",
  ].join("\n") + "\n");
}
