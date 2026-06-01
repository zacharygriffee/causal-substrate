import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertLayerReceiptRuntimeEvidenceObservation,
  assertLayerReceiptRuntimeEvidenceReadbackContract,
  buildLayerReceiptRuntimeEvidenceObservation,
  buildLayerReceiptRuntimeEvidenceReadbackContract,
} from "../src/index.js";

interface CliArgs {
  input?: string;
  output?: string;
  readbackOutput?: string;
  emittedAt: string;
  readbackEmittedAt?: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) throw new Error("input_required_for_layer_receipt_runtime_evidence_observation");
  if (!args.output) throw new Error("output_required_for_layer_receipt_runtime_evidence_observation");

  const input = JSON.parse(await readFile(path.resolve(args.input), "utf8")) as unknown;
  const observation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: input,
    emittedAt: args.emittedAt,
  });
  assertLayerReceiptRuntimeEvidenceObservation(observation);
  await writeFile(path.resolve(args.output), `${JSON.stringify(observation, null, 2)}\n`, "utf8");

  if (args.readbackOutput) {
    const readback = buildLayerReceiptRuntimeEvidenceReadbackContract({
      observation,
      emittedAt: args.readbackEmittedAt ?? args.emittedAt,
    });
    assertLayerReceiptRuntimeEvidenceReadbackContract(readback);
    await writeFile(path.resolve(args.readbackOutput), `${JSON.stringify(readback, null, 2)}\n`, "utf8");
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
    if (arg === "--readback-output") {
      args.readbackOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--emitted-at") {
      args.emittedAt = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--readback-emitted-at") {
      args.readbackEmittedAt = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/observe-layer-receipt-runtime-evidence.ts --input path --output path [--readback-output path] [--emitted-at iso] [--readback-emitted-at iso]",
    "",
    "Reads supplied Layer receipt runtime evidence and writes a bounded local observation artifact.",
    "The command does not call Layer, admit evidence, interpret RBC, grant authority, publish to Mesh, or claim DHT/Hyperswarm proof.",
    "With --readback-output, writes a readback contract over the emitted observation.",
  ].join("\n") + "\n");
}
