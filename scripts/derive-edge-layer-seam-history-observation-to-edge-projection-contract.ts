import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryObservationToEdgeProjectionContract,
  buildEdgeLayerSeamHistoryObservationToEdgeProjectionContract,
} from "../src/index.js";

interface CliArgs {
  runDir?: string | undefined;
  edgeReceipt?: string | undefined;
  output?: string | undefined;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir) throw new Error("run_dir_required_for_observation_to_edge_projection_contract");
  if (!args.edgeReceipt) throw new Error("edge_receipt_required_for_observation_to_edge_projection_contract");
  if (!args.output) throw new Error("output_required_for_observation_to_edge_projection_contract");

  const runDir = path.resolve(args.runDir);
  const reproducibilityCheckPath = path.join(runDir, "public-artifact-reproducibility-check.json");
  const handoffBundlePath = path.join(runDir, "edge-projection-handoff-bundle.json");
  const edgeReceiptPath = path.resolve(args.edgeReceipt);
  const contract = buildEdgeLayerSeamHistoryObservationToEdgeProjectionContract({
    reproducibilityCheck: await readJson(reproducibilityCheckPath),
    handoffBundle: await readJson(handoffBundlePath),
    edgeReceipt: await readJson(edgeReceiptPath),
    emittedAt: args.emittedAt,
    sourcePaths: {
      publicRunDir: runDir,
      reproducibilityCheck: reproducibilityCheckPath,
      handoffBundle: handoffBundlePath,
      edgeReceipt: edgeReceiptPath,
    },
  });
  assertEdgeLayerSeamHistoryObservationToEdgeProjectionContract(contract);
  await writeFile(path.resolve(args.output), `${JSON.stringify(contract, null, 2)}\n`, "utf8");
  if (contract.reviewStatus !== "edge-layer-seam-history-observation-to-edge-projection-contract-ready") {
    throw new Error("observation_to_edge_projection_contract_not_ready");
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
    if (arg === "--run-dir") {
      args.runDir = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--edge-receipt") {
      args.edgeReceipt = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/derive-edge-layer-seam-history-observation-to-edge-projection-contract.ts --run-dir path --edge-receipt path --output path [--emitted-at iso]",
    "",
    "Reads a saved public Causal run directory plus a saved Edge import receipt and writes an observation-to-Edge projection contract.",
    "This command does not open Hyperswarm, open Corestore, call Edge, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, or write Edge projection state.",
  ].join("\n") + "\n");
}
