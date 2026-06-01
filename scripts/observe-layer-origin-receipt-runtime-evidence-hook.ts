import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertLayerReceiptRuntimeEvidenceOperationalFixtureHook,
  buildLayerReceiptRuntimeEvidenceOperationalFixtureHook,
} from "../src/index.js";

interface CliArgs {
  input?: string;
  output?: string;
  sourcePath?: string;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) throw new Error("input_required_for_layer_origin_receipt_runtime_evidence_hook");
  if (!args.output) throw new Error("output_required_for_layer_origin_receipt_runtime_evidence_hook");

  const input = JSON.parse(await readFile(path.resolve(args.input), "utf8")) as unknown;
  const hook = buildLayerReceiptRuntimeEvidenceOperationalFixtureHook({
    layerOriginReceiptRuntimeEvidence: input,
    emittedAt: args.emittedAt,
    sourcePath: args.sourcePath,
  });
  assertLayerReceiptRuntimeEvidenceOperationalFixtureHook(hook);
  await writeFile(path.resolve(args.output), `${JSON.stringify(hook, null, 2)}\n`, "utf8");
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
    if (arg === "--input") {
      args.input = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--output") {
      args.output = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--source-path") {
      args.sourcePath = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/observe-layer-origin-receipt-runtime-evidence-hook.ts --input path --output path [--source-path ref] [--emitted-at iso]",
    "",
    "Reads supplied Layer-origin receipt runtime material and writes a local operational fixture hook.",
    "The command does not call Layer, open Layer runtime, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, or claim DHT/Hyperswarm proof.",
  ].join("\n") + "\n");
}
