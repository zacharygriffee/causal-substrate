import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback,
  buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback,
} from "../src/index.js";

interface CliArgs {
  input?: string;
  output?: string;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) throw new Error("input_required_for_edge_layer_seam_history_handoff_bundle_readback");
  if (!args.output) throw new Error("output_required_for_edge_layer_seam_history_handoff_bundle_readback");

  const bundle = JSON.parse(await readFile(path.resolve(args.input), "utf8")) as unknown;
  const readback = buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback({
    bundle,
    emittedAt: args.emittedAt,
  });
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback(readback);
  await writeFile(path.resolve(args.output), `${JSON.stringify(readback, null, 2)}\n`, "utf8");
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
    if (arg === "--input" || arg === "--input-bundle") {
      args.input = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--output" || arg === "--readback-output") {
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
    "Usage: tsx scripts/readback-edge-layer-seam-history-handoff-bundle.ts --input-bundle path --readback-output path [--emitted-at iso]",
    "",
    "Reads an existing Edge projection handoff bundle from disk and writes a readback-only verifier artifact.",
    "The command does not write Edge projection state, accept canonical history, admit Layer evidence, interpret RBC, grant authority, promote referents, publish to Mesh, or write production continuity.",
  ].join("\n") + "\n");
}
