import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertGenericCausalSeamPublicProofIndexConsumerHandoff,
  buildGenericCausalSeamPublicProofIndexConsumerHandoff,
} from "../src/index.js";

interface CliArgs {
  index?: string | undefined;
  runDir?: string | undefined;
  output?: string | undefined;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.output) throw new Error("output_required_for_generic_public_proof_index_consumer_handoff");
  const indexPath = resolveIndexPath(args);
  const handoff = buildGenericCausalSeamPublicProofIndexConsumerHandoff({
    publicProofIndex: await readJson(indexPath),
    emittedAt: args.emittedAt,
    sourcePaths: {
      publicProofIndex: indexPath,
    },
  });
  assertGenericCausalSeamPublicProofIndexConsumerHandoff(handoff);
  await writeFile(path.resolve(args.output), `${JSON.stringify(handoff, null, 2)}\n`, "utf8");
  if (handoff.reviewStatus !== "generic-causal-seam-public-proof-index-consumer-handoff-ready") {
    throw new Error("generic_public_proof_index_consumer_handoff_not_ready");
  }
}

function resolveIndexPath(args: CliArgs): string {
  if (args.index) return path.resolve(args.index);
  if (!args.runDir) throw new Error("index_or_run_dir_required_for_generic_public_proof_index_consumer_handoff");
  return path.join(path.resolve(args.runDir), "generic-public-seam-proof-index.json");
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
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
    if (arg === "--index") {
      args.index = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--run-dir") {
      args.runDir = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--output") {
      args.output = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--emitted-at") {
      args.emittedAt = requireNext(argv, index, arg);
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

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/handoff-generic-causal-seam-public-proof-index-to-consumers.ts --run-dir path --output path [--emitted-at iso]",
    "   or: tsx scripts/handoff-generic-causal-seam-public-proof-index-to-consumers.ts --index path --output path [--emitted-at iso]",
    "",
    "Reads a saved generic public proof index and writes an observation-only generic consumer handoff.",
    "The handoff does not open Hyperswarm, open Corestore, call consumers, write consumer state, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, write production continuity, or upgrade proof.",
  ].join("\n") + "\n");
}
