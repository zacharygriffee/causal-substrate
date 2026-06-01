import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryProofSummary,
  buildEdgeLayerSeamHistoryProofSummary,
} from "../src/index.js";

interface CliArgs {
  inputs: string[];
  output?: string;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.inputs.length === 0) throw new Error("input_required_for_edge_layer_seam_history_proof_summary");
  if (!args.output) throw new Error("output_required_for_edge_layer_seam_history_proof_summary");

  const artifacts = await Promise.all(args.inputs.map(async (inputPath) =>
    JSON.parse(await readFile(path.resolve(inputPath), "utf8")) as unknown
  ));
  const summary = buildEdgeLayerSeamHistoryProofSummary({
    artifacts,
    sourcePaths: args.inputs.map((inputPath) => path.resolve(inputPath)),
    emittedAt: args.emittedAt,
  });
  assertEdgeLayerSeamHistoryProofSummary(summary);
  await writeFile(path.resolve(args.output), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    emittedAt: new Date().toISOString(),
    inputs: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    if (arg === "--input") {
      args.inputs.push(requireNext(argv, index, arg));
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
    "Usage: tsx scripts/summarize-edge-layer-seam-history-proof.ts --input artifact.json [--input artifact2.json] --output summary.json [--emitted-at iso]",
    "",
    "Reads saved seam-history artifacts and writes a local proof summary that preserves source proof labels without upgrading them.",
    "The command does not open Hyperswarm, open Corestore, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, or write production continuity.",
  ].join("\n") + "\n");
}
