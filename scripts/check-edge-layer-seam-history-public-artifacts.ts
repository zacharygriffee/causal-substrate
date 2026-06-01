import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryPublicArtifactReproducibility,
  buildEdgeLayerSeamHistoryPublicArtifactReproducibility,
  type EdgeLayerSeamHistoryPublicArtifactReproducibility,
} from "../src/index.js";

interface CliArgs {
  runDir?: string | undefined;
  output?: string | undefined;
  runId?: string | undefined;
  runKind?: EdgeLayerSeamHistoryPublicArtifactReproducibility["runKind"] | undefined;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir) throw new Error("run_dir_required_for_public_artifact_reproducibility");
  if (!args.output) throw new Error("output_required_for_public_artifact_reproducibility");

  const runDir = path.resolve(args.runDir);
  const loaded = await loadRunArtifacts(runDir);
  const result = buildEdgeLayerSeamHistoryPublicArtifactReproducibility({
    runId: args.runId ?? path.basename(runDir),
    runKind: args.runKind ?? inferRunKind(loaded.artifacts),
    artifacts: loaded.artifacts,
    sourcePaths: loaded.sourcePaths,
    emittedAt: args.emittedAt,
  });
  assertEdgeLayerSeamHistoryPublicArtifactReproducibility(result);
  await writeFile(path.resolve(args.output), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  if (result.reviewStatus !== "edge-layer-seam-history-public-artifacts-reproducible") {
    throw new Error("public_artifacts_not_reproducible");
  }
}

async function loadRunArtifacts(runDir: string): Promise<{
  artifacts: Record<string, unknown>;
  sourcePaths: string[];
}> {
  const candidates: Array<[string, string[]]> = [
    ["readerReport", ["hyperswarm-reader-report.json"]],
    ["replicaReport", ["public-replica-reader-report.json"]],
    ["reportReadback", ["hyperswarm-reader-report-readback.json", "public-replica-reader-report-readback.json"]],
    ["handoffBundle", ["edge-projection-handoff-bundle.json"]],
    ["handoffReadback", ["edge-projection-handoff-bundle-readback.json"]],
    ["proofSummary", ["edge-layer-seam-history-proof-summary.json"]],
  ];
  const artifacts: Record<string, unknown> = {};
  const sourcePaths: string[] = [];
  for (const [key, fileNames] of candidates) {
    for (const fileName of fileNames) {
      const artifactPath = path.join(runDir, fileName);
      const artifact = await readJsonIfPresent(artifactPath);
      if (artifact !== undefined) {
        artifacts[key] = artifact;
        sourcePaths.push(artifactPath);
        break;
      }
    }
  }
  return { artifacts, sourcePaths };
}

async function readJsonIfPresent(filePath: string): Promise<unknown | undefined> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as unknown;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") return undefined;
    throw error;
  }
}

function inferRunKind(
  artifacts: Record<string, unknown>,
): EdgeLayerSeamHistoryPublicArtifactReproducibility["runKind"] {
  if (artifacts.replicaReport !== undefined) return "device_to_device_public_hyperswarm";
  if (artifacts.readerReport !== undefined) return "single_machine_public_hyperswarm";
  return "unknown_public_hyperswarm";
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

function parseRunKind(raw: string): EdgeLayerSeamHistoryPublicArtifactReproducibility["runKind"] {
  if (
    raw === "single_machine_public_hyperswarm" ||
    raw === "device_to_device_public_hyperswarm" ||
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

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/check-edge-layer-seam-history-public-artifacts.ts --run-dir path --output path [--run-id id] [--run-kind kind] [--emitted-at iso]",
    "",
    "Reads saved public seam-history proof artifacts and writes a reproducibility check.",
    "This command does not open Hyperswarm, open Corestore, claim a new live run, admit Layer evidence, interpret RBC, grant authority, publish to Mesh, or write production continuity.",
  ].join("\n") + "\n");
}
