import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertGenericCausalSeamPublicProofIndexConsumerHandoffReadback,
  buildGenericCausalSeamPublicProofIndexConsumerHandoffReadback,
} from "../src/index.js";

interface CliArgs {
  handoff?: string | undefined;
  output?: string | undefined;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.handoff) throw new Error("handoff_required_for_generic_public_proof_index_consumer_handoff_readback");
  if (!args.output) throw new Error("output_required_for_generic_public_proof_index_consumer_handoff_readback");
  const handoffPath = path.resolve(args.handoff);
  const readback = buildGenericCausalSeamPublicProofIndexConsumerHandoffReadback({
    publicProofIndexConsumerHandoff: await readJson(handoffPath),
    emittedAt: args.emittedAt,
    sourcePaths: {
      publicProofIndexConsumerHandoff: handoffPath,
    },
  });
  assertGenericCausalSeamPublicProofIndexConsumerHandoffReadback(readback);
  await writeFile(path.resolve(args.output), `${JSON.stringify(readback, null, 2)}\n`, "utf8");
  if (readback.reviewStatus !== "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready") {
    throw new Error("generic_public_proof_index_consumer_handoff_readback_not_ready");
  }
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
    if (arg === "--handoff") {
      args.handoff = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/readback-generic-causal-seam-public-proof-index-consumer-handoff.ts --handoff path --output path [--emitted-at iso]",
    "",
    "Reads a saved generic proof-index consumer handoff and writes a lower-rung readback verifier.",
    "The readback does not open Hyperswarm, open Corestore, call consumers, write consumer state, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, write production continuity, or upgrade proof.",
  ].join("\n") + "\n");
}
