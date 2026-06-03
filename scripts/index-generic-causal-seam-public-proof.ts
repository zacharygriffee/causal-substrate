import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertGenericCausalSeamPublicProofIndex,
  buildGenericCausalSeamPublicProofIndex,
} from "../src/index.js";

interface CliArgs {
  runDir?: string | undefined;
  output?: string | undefined;
  runId?: string | undefined;
  emittedAt: string;
}

interface GenericPublicProofArtifactPaths {
  seamHistoryInput: string;
  sourceManifest: string;
  replicaReport: string;
  observationResult: string;
  observationReadback: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir) throw new Error("run_dir_required_for_generic_public_proof_index");
  if (!args.output) throw new Error("output_required_for_generic_public_proof_index");

  const runDir = path.resolve(args.runDir);
  const paths = buildArtifactPaths(runDir);
  const index = buildGenericCausalSeamPublicProofIndex({
    runId: args.runId ?? path.basename(runDir),
    artifacts: {
      seamHistoryInput: await readJson(paths.seamHistoryInput),
      sourceManifest: await readJson(paths.sourceManifest),
      replicaReport: await readJson(paths.replicaReport),
      observationResult: await readJson(paths.observationResult),
      observationReadback: await readJson(paths.observationReadback),
    },
    artifactPointers: {
      publicRunDir: runDir,
      ...paths,
    },
    emittedAt: args.emittedAt,
  });
  assertGenericCausalSeamPublicProofIndex(index);
  await writeFile(path.resolve(args.output), `${JSON.stringify(index, null, 2)}\n`, "utf8");
  if (index.reviewStatus !== "generic-causal-seam-public-proof-index-ready") {
    throw new Error("generic_public_proof_index_not_ready");
  }
}

function buildArtifactPaths(runDir: string): GenericPublicProofArtifactPaths {
  return {
    seamHistoryInput: path.join(runDir, "generic-seam-history-input.json"),
    sourceManifest: path.join(runDir, "generic-public-source-manifest.json"),
    replicaReport: path.join(runDir, "generic-public-replica-report.json"),
    observationResult: path.join(runDir, "generic-public-observation-result.json"),
    observationReadback: path.join(runDir, "generic-public-observation-readback.json"),
  };
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
    if (arg === "--output") {
      args.output = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--run-id") {
      args.runId = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/index-generic-causal-seam-public-proof.ts --run-dir path --output path [--run-id id] [--emitted-at iso]",
    "",
    "Reads saved generic public seam proof artifacts and writes a compact lower-rung proof index.",
    "The command does not open Hyperswarm, open Corestore, call consumers, write consumer state, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, write production continuity, or upgrade proof.",
  ].join("\n") + "\n");
}
