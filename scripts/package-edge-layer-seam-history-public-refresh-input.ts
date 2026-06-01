import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryPublicRefreshInputPackage,
  buildEdgeLayerSeamHistoryPublicRefreshInputPackage,
} from "../src/index.js";

interface CliArgs {
  command?: string | undefined;
  input?: string | undefined;
  outputDir?: string | undefined;
  manifestOutput?: string | undefined;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.command) throw new Error("command_required_for_public_refresh_input_package");
  if (!args.input) throw new Error("input_required_for_public_refresh_input_package");

  const commandPath = path.resolve(args.command);
  const inputPath = path.resolve(args.input);
  const command = await readJson(commandPath);
  const outputDir = args.outputDir ?? requireCommandOutputDir(command);
  const refreshInputPath = path.join(outputDir, "seam-history-input.json");
  const manifestOutputPath = args.manifestOutput ?? path.join(outputDir, "public-refresh-input-package.json");
  const inputBytes = await readFile(inputPath, "utf8");
  const seamHistoryInput = JSON.parse(inputBytes) as unknown;
  const manifest = buildEdgeLayerSeamHistoryPublicRefreshInputPackage({
    operatorPublicRefreshCommand: command,
    seamHistoryInput,
    seamHistoryInputBytes: inputBytes,
    emittedAt: args.emittedAt,
    sourcePaths: {
      operatorPublicRefreshCommand: commandPath,
      previousSeamHistoryInput: inputPath,
    },
    outputPaths: {
      refreshOutputDir: outputDir,
      refreshSeamHistoryInput: refreshInputPath,
      packageManifest: manifestOutputPath,
    },
  });
  assertEdgeLayerSeamHistoryPublicRefreshInputPackage(manifest);
  await mkdir(path.resolve(outputDir), { recursive: true });
  await writeFile(path.resolve(refreshInputPath), inputBytes.endsWith("\n") ? inputBytes : `${inputBytes}\n`, "utf8");
  await writeFile(path.resolve(manifestOutputPath), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  if (manifest.reviewStatus !== "edge-layer-seam-history-public-refresh-input-package-ready") {
    throw new Error("public_refresh_input_package_not_ready");
  }
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

function requireCommandOutputDir(command: unknown): string {
  if (!isRecord(command)) throw new Error("operator_public_refresh_command_must_be_object");
  const commandPlan = isRecord(command.commandPlan) ? command.commandPlan : undefined;
  if (typeof commandPlan?.outputDir !== "string" || commandPlan.outputDir.trim() === "") {
    throw new Error("command_output_dir_required_for_public_refresh_input_package");
  }
  return commandPlan.outputDir;
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
    if (arg === "--command") {
      args.command = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--input") {
      args.input = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--output-dir") {
      args.outputDir = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--manifest-output") {
      args.manifestOutput = requireNext(argv, index, arg);
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/package-edge-layer-seam-history-public-refresh-input.ts --command path --input path [--output-dir path] [--manifest-output path] [--emitted-at iso]",
    "",
    "Copies current seam-history input into the prepared public refresh output directory and writes a local input package manifest.",
    "This does not open Hyperswarm, open Corestore, call Edge, call Layer, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, write Edge projection state, write production continuity, or run a public refresh.",
  ].join("\n") + "\n");
}
