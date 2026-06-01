import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryPublicRefreshReadinessGate,
  buildEdgeLayerSeamHistoryPublicRefreshReadinessGate,
} from "../src/index.js";

interface CliArgs {
  runDir?: string | undefined;
  command?: string | undefined;
  output?: string | undefined;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.output) throw new Error("output_required_for_public_refresh_readiness_gate");
  const commandPath = resolveCommandPath(args);
  const gate = buildEdgeLayerSeamHistoryPublicRefreshReadinessGate({
    operatorPublicRefreshCommand: await readJson(commandPath),
    emittedAt: args.emittedAt,
    sourcePaths: {
      operatorPublicRefreshCommand: commandPath,
    },
  });
  assertEdgeLayerSeamHistoryPublicRefreshReadinessGate(gate);
  await writeFile(path.resolve(args.output), `${JSON.stringify(gate, null, 2)}\n`, "utf8");
  if (gate.reviewStatus !== "edge-layer-seam-history-public-refresh-readiness-gate-ready") {
    throw new Error("public_refresh_readiness_gate_not_ready");
  }
}

function resolveCommandPath(args: CliArgs): string {
  if (args.command) return path.resolve(args.command);
  if (!args.runDir) throw new Error("run_dir_or_command_required_for_public_refresh_readiness_gate");
  return path.join(path.resolve(args.runDir), "operator-selected-public-refresh-command.json");
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
    if (arg === "--command") {
      args.command = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/gate-edge-layer-seam-history-public-refresh-readiness.ts --run-dir path --output path [--emitted-at iso]",
    "   or: tsx scripts/gate-edge-layer-seam-history-public-refresh-readiness.ts --command path --output path [--emitted-at iso]",
    "",
    "Reads an operator-selected public refresh command artifact and writes a readiness gate.",
    "The gate may mark prepared public commands operator-runnable, but it does not open Hyperswarm, open Corestore, call Edge, call Layer, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, write Edge projection state, write production continuity, or run the refresh.",
  ].join("\n") + "\n");
}
