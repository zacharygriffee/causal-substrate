import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryOperatorPublicRefreshCommand,
  buildEdgeLayerSeamHistoryOperatorPublicRefreshCommand,
} from "../src/index.js";

interface CliArgs {
  runDir?: string | undefined;
  output?: string | undefined;
  emittedAt: string;
  operatorSelectedRefresh: boolean;
  refreshRunId?: string | undefined;
  outputDir?: string | undefined;
  namespace?: string | undefined;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir) throw new Error("run_dir_required_for_operator_public_refresh_command");
  if (!args.output) throw new Error("output_required_for_operator_public_refresh_command");
  if (!args.operatorSelectedRefresh) throw new Error("operator_selected_refresh_required");

  const runDir = path.resolve(args.runDir);
  const publicSeamProofIndexPath = path.join(runDir, "public-seam-proof-index.json");
  const publicSwarmRefreshDecisionPath = path.join(runDir, "public-swarm-refresh-decision.json");
  const command = buildEdgeLayerSeamHistoryOperatorPublicRefreshCommand({
    publicSeamProofIndex: await readJson(publicSeamProofIndexPath),
    publicSwarmRefreshDecision: await readJson(publicSwarmRefreshDecisionPath),
    emittedAt: args.emittedAt,
    operatorSelectedRefresh: args.operatorSelectedRefresh,
    ...(args.refreshRunId ? { refreshRunId: args.refreshRunId } : {}),
    ...(args.outputDir ? { outputDir: args.outputDir } : {}),
    ...(args.namespace ? { namespace: args.namespace } : {}),
    sourcePaths: {
      publicSeamProofIndex: publicSeamProofIndexPath,
      publicSwarmRefreshDecision: publicSwarmRefreshDecisionPath,
    },
  });
  assertEdgeLayerSeamHistoryOperatorPublicRefreshCommand(command);
  await writeFile(path.resolve(args.output), `${JSON.stringify(command, null, 2)}\n`, "utf8");
  if (command.reviewStatus !== "edge-layer-seam-history-operator-public-refresh-command-ready") {
    throw new Error("operator_public_refresh_command_not_ready");
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
    if (arg === "--refresh-run-id") {
      args.refreshRunId = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--refresh-output-dir") {
      args.outputDir = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--namespace") {
      args.namespace = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/prepare-edge-layer-seam-history-operator-public-refresh-command.ts --run-dir path --output path --operator-selected-refresh [--refresh-run-id id] [--refresh-output-dir path] [--namespace topic] [--emitted-at iso]",
    "",
    "Reads saved public proof index and refresh decision artifacts, then writes an instructions-only operator public refresh command artifact.",
    "The command artifact names public Hyperswarm commands and expected outputs, but this CLI does not open Hyperswarm, open Corestore, call Edge, call Layer, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, write Edge projection state, write production continuity, or run the refresh.",
  ].join("\n") + "\n");
}
