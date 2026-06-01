import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryProofSummaryConsumerReadback,
  buildEdgeLayerSeamHistoryProofSummaryConsumerReadback,
} from "../src/index.js";

interface CliArgs {
  proofSummary?: string | undefined;
  observationToEdgeContract?: string | undefined;
  output?: string | undefined;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.proofSummary) throw new Error("proof_summary_required_for_consumer_readback");
  if (!args.output) throw new Error("output_required_for_consumer_readback");

  const proofSummaryPath = path.resolve(args.proofSummary);
  const contractPath = args.observationToEdgeContract ? path.resolve(args.observationToEdgeContract) : undefined;
  const readback = buildEdgeLayerSeamHistoryProofSummaryConsumerReadback({
    proofSummary: await readJson(proofSummaryPath),
    ...(contractPath ? { observationToEdgeContract: await readJson(contractPath) } : {}),
    emittedAt: args.emittedAt,
    sourcePaths: {
      proofSummary: proofSummaryPath,
      ...(contractPath ? { observationToEdgeContract: contractPath } : {}),
    },
  });
  assertEdgeLayerSeamHistoryProofSummaryConsumerReadback(readback);
  await writeFile(path.resolve(args.output), `${JSON.stringify(readback, null, 2)}\n`, "utf8");
  if (readback.reviewStatus !== "edge-layer-seam-history-proof-summary-consumer-readback-ready") {
    throw new Error("proof_summary_consumer_readback_not_ready");
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
    if (arg === "--proof-summary") {
      args.proofSummary = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--observation-to-edge-contract") {
      args.observationToEdgeContract = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/readback-edge-layer-seam-history-proof-summary-for-consumers.ts --proof-summary path [--observation-to-edge-contract path] --output path [--emitted-at iso]",
    "",
    "Reads saved proof-summary artifacts and writes a consumer-facing Spine/Edge readback without upgrading proof.",
    "The command does not open Hyperswarm, open Corestore, call Edge, call Layer, write Edge projection state, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, or write production continuity.",
  ].join("\n") + "\n");
}
