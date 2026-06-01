import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryPublicSeamProofIndex,
  buildEdgeLayerSeamHistoryPublicSeamProofIndex,
  type EdgeLayerSeamHistoryPublicSeamProofIndex,
} from "../src/index.js";

interface CliArgs {
  runDir?: string | undefined;
  output?: string | undefined;
  runId?: string | undefined;
  runKind?: EdgeLayerSeamHistoryPublicSeamProofIndex["runKind"] | undefined;
  emittedAt: string;
}

interface PublicSeamProofIndexArtifactPaths {
  sourceManifest: string;
  replicaReaderReport: string;
  reproducibilityCheck: string;
  edgeHandoffBundle: string;
  observationToEdgeContract: string;
  proofSummaryConsumerReadback: string;
  publicSwarmRefreshDecision: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir) throw new Error("run_dir_required_for_public_seam_proof_index");
  if (!args.output) throw new Error("output_required_for_public_seam_proof_index");

  const runDir = path.resolve(args.runDir);
  const paths = buildArtifactPaths(runDir);
  const index = buildEdgeLayerSeamHistoryPublicSeamProofIndex({
    runId: args.runId ?? path.basename(runDir),
    runKind: args.runKind ?? inferRunKind(paths),
    artifacts: {
      sourceManifest: await readJson(paths.sourceManifest),
      replicaReaderReport: await readJson(paths.replicaReaderReport),
      reproducibilityCheck: await readJson(paths.reproducibilityCheck),
      edgeHandoffBundle: await readJson(paths.edgeHandoffBundle),
      observationToEdgeContract: await readJson(paths.observationToEdgeContract),
      proofSummaryConsumerReadback: await readJson(paths.proofSummaryConsumerReadback),
      publicSwarmRefreshDecision: await readJson(paths.publicSwarmRefreshDecision),
    },
    artifactPointers: {
      publicRunDir: runDir,
      ...paths,
    },
    emittedAt: args.emittedAt,
  });
  assertEdgeLayerSeamHistoryPublicSeamProofIndex(index);
  await writeFile(path.resolve(args.output), `${JSON.stringify(index, null, 2)}\n`, "utf8");
  if (index.reviewStatus !== "edge-layer-seam-history-public-seam-proof-index-ready") {
    throw new Error("public_seam_proof_index_not_ready");
  }
}

function buildArtifactPaths(runDir: string): PublicSeamProofIndexArtifactPaths {
  return {
    sourceManifest: path.join(runDir, "public-source-manifest.json"),
    replicaReaderReport: path.join(runDir, "public-replica-reader-report.json"),
    reproducibilityCheck: path.join(runDir, "public-artifact-reproducibility-check.json"),
    edgeHandoffBundle: path.join(runDir, "edge-projection-handoff-bundle.json"),
    observationToEdgeContract: path.join(runDir, "observation-to-edge-projection-contract.json"),
    proofSummaryConsumerReadback: path.join(runDir, "proof-summary-consumer-readback.json"),
    publicSwarmRefreshDecision: path.join(runDir, "public-swarm-refresh-decision.json"),
  };
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

function inferRunKind(paths: PublicSeamProofIndexArtifactPaths): EdgeLayerSeamHistoryPublicSeamProofIndex["runKind"] {
  return paths.replicaReaderReport ? "device_to_device_public_hyperswarm" : "unknown_public_hyperswarm";
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
    if (arg === "--run-kind") {
      args.runKind = parseRunKind(requireNext(argv, index, arg));
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

function parseRunKind(raw: string): EdgeLayerSeamHistoryPublicSeamProofIndex["runKind"] {
  if (
    raw === "device_to_device_public_hyperswarm" ||
    raw === "single_machine_public_hyperswarm" ||
    raw === "unknown_public_hyperswarm"
  ) {
    return raw;
  }
  throw new Error(`unknown_run_kind:${raw}`);
}

function requireNext(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`missing_value_for:${flag}`);
  return value;
}

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/index-edge-layer-seam-history-public-proof.ts --run-dir path --output path [--run-id id] [--run-kind kind] [--emitted-at iso]",
    "",
    "Reads saved public seam proof artifacts and writes a compact proof index for Edge, Layer, and Spine.",
    "The command does not duplicate artifact bodies, open Hyperswarm, open Corestore, call Edge, call Layer, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, or write projection/production state.",
  ].join("\n") + "\n");
}
