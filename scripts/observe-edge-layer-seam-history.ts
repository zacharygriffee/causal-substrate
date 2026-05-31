import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryObservationResult,
  buildEdgeLayerSeamHistoryObservationResult,
} from "../src/index.js";

interface CliArgs {
  input?: string;
  output?: string;
  emittedAt: string;
  readback: boolean;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputText = args.input
    ? await readFile(path.resolve(args.input), "utf8")
    : await readStdin();
  const seamHistory = JSON.parse(inputText) as unknown;
  const result = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory,
    emittedAt: args.emittedAt,
    ...(args.input ? { sourcePath: path.resolve(args.input) } : {}),
    inputReadByCausalSubstrate: true,
  });

  const outputText = `${JSON.stringify(result, null, 2)}\n`;
  if (args.output) {
    const outputPath = path.resolve(args.output);
    await writeFile(outputPath, outputText, "utf8");
    if (args.readback) {
      const readback = JSON.parse(await readFile(outputPath, "utf8")) as unknown;
      assertObservationReadback(readback);
    }
    return;
  }

  process.stdout.write(outputText);
}

function assertObservationReadback(value: unknown): void {
  assertEdgeLayerSeamHistoryObservationResult(value);
  if (value.validation.seamHistoryInputConsumed !== true) {
    throw new Error("seam_history_input_not_consumed");
  }
  if (value.validation.linkedPairDetected !== true) {
    throw new Error("linked_pair_not_detected");
  }
  if (value.validation.damagedOrUnlinkedPairDetected !== true) {
    throw new Error("damaged_or_unlinked_pair_not_detected");
  }
  if (value.validation.sourceIdsAndHashesPreserved !== true) {
    throw new Error("source_ids_and_hashes_not_preserved");
  }
  if (value.proof.strongestProofRung !== "local_causal_observation_over_supplied_seam_history_material") {
    throw new Error("proof_rung_overclaimed");
  }
  if (value.proof.dhtOrHyperswarmInputObservedByCausalSubstrate !== false) {
    throw new Error("dht_or_hyperswarm_input_overclaimed");
  }
  if (value.proof.decentralizedSeamProofClaimed !== false) {
    throw new Error("decentralized_seam_proof_overclaimed");
  }
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    emittedAt: new Date().toISOString(),
    readback: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
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
    if (arg === "--emitted-at") {
      args.emittedAt = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--readback") {
      args.readback = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    throw new Error(`unknown_argument:${arg ?? ""}`);
  }
  return args;
}

function requireNext(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag}_requires_value`);
  }
  return value;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (text.trim() === "") {
    throw new Error("stdin_seam_history_json_required");
  }
  return text;
}

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/observe-edge-layer-seam-history.ts [--input path] [--output path] [--emitted-at iso] [--readback]",
    "",
    "Reads supplied Edge/Layer seam-history JSON and emits a bounded local causal observation.",
    "This command does not claim DHT/Hyperswarm or decentralized seam proof.",
    "",
  ].join("\n"));
}
