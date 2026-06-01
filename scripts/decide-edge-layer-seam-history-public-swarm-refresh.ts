import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryPublicSwarmRefreshDecision,
  buildEdgeLayerSeamHistoryPublicSwarmRefreshDecision,
} from "../src/index.js";

interface CliArgs {
  runDir?: string | undefined;
  output?: string | undefined;
  emittedAt: string;
  operatorSelectedRefresh: boolean;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir) throw new Error("run_dir_required_for_public_swarm_refresh_decision");
  if (!args.output) throw new Error("output_required_for_public_swarm_refresh_decision");

  const runDir = path.resolve(args.runDir);
  const reproducibilityCheckPath = path.join(runDir, "public-artifact-reproducibility-check.json");
  const contractPath = path.join(runDir, "observation-to-edge-projection-contract.json");
  const consumerReadbackPath = path.join(runDir, "proof-summary-consumer-readback.json");
  const decision = buildEdgeLayerSeamHistoryPublicSwarmRefreshDecision({
    reproducibilityCheck: await readJson(reproducibilityCheckPath),
    observationToEdgeContract: await readJson(contractPath),
    proofSummaryConsumerReadback: await readJson(consumerReadbackPath),
    emittedAt: args.emittedAt,
    operatorSelectedRefresh: args.operatorSelectedRefresh,
    sourcePaths: {
      reproducibilityCheck: reproducibilityCheckPath,
      observationToEdgeContract: contractPath,
      proofSummaryConsumerReadback: consumerReadbackPath,
    },
  });
  assertEdgeLayerSeamHistoryPublicSwarmRefreshDecision(decision);
  await writeFile(path.resolve(args.output), `${JSON.stringify(decision, null, 2)}\n`, "utf8");
  if (decision.reviewStatus !== "edge-layer-seam-history-public-swarm-refresh-decision-ready") {
    throw new Error("public_swarm_refresh_decision_not_ready");
  }
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    emittedAt: new Date().toISOString(),
    operatorSelectedRefresh: false,
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
    if (arg === "--operator-selected-refresh") {
      args.operatorSelectedRefresh = true;
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
    "Usage: tsx scripts/decide-edge-layer-seam-history-public-swarm-refresh.ts --run-dir path --output path [--operator-selected-refresh] [--emitted-at iso]",
    "",
    "Reads saved public-run artifacts and writes a public swarm refresh decision without running swarm.",
    "The command does not open Hyperswarm, open Corestore, call Edge, call Layer, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, write Edge projection state, or write production continuity.",
  ].join("\n") + "\n");
}
