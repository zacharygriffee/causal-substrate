import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertAdjacentPublicMaterialObservation,
  buildAdjacentPublicMaterialObservation,
} from "../src/index.js";

interface CliArgs {
  layerPublicMaterial?: string | undefined;
  edgeHandoffReadback?: string | undefined;
  output?: string | undefined;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.output) throw new Error("output_required_for_adjacent_public_material_observation");
  if (!args.layerPublicMaterial && !args.edgeHandoffReadback) {
    throw new Error("adjacent_material_input_required");
  }

  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: args.layerPublicMaterial ? await readJson(args.layerPublicMaterial) : undefined,
    edgeHandoffReadback: args.edgeHandoffReadback ? await readJson(args.edgeHandoffReadback) : undefined,
    emittedAt: args.emittedAt,
    sourcePaths: {
      ...(args.layerPublicMaterial ? { layerPublicMaterial: path.resolve(args.layerPublicMaterial) } : {}),
      ...(args.edgeHandoffReadback ? { edgeHandoffReadback: path.resolve(args.edgeHandoffReadback) } : {}),
    },
  });
  assertAdjacentPublicMaterialObservation(observation);
  await writeFile(path.resolve(args.output), `${JSON.stringify(observation, null, 2)}\n`, "utf8");
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(path.resolve(filePath), "utf8")) as unknown;
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
    if (arg === "--layer-public-material") {
      args.layerPublicMaterial = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--edge-handoff-readback") {
      args.edgeHandoffReadback = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/observe-adjacent-public-material.ts --output path [--layer-public-material path] [--edge-handoff-readback path] [--emitted-at iso]",
    "",
    "Reads supplied/exported adjacent Layer or Edge material and writes a Causal observation artifact.",
    "The command preserves ids, hashes, durable refs, writer refs, source refs, proof labels, linkage status, and non-claims.",
    "The command does not open swarm, call Layer or Edge, admit Layer evidence, interpret RBC, grant authority, publish Mesh, write production continuity, or claim live Causal swarm proof.",
  ].join("\n") + "\n");
}
