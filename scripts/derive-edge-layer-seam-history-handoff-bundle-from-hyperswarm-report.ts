import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
  assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback,
  assertEdgeLayerSeamHistoryObservationResult,
  buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
  buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback,
} from "../src/index.js";

interface CliArgs {
  inputReport?: string;
  handoffBundleOutput?: string;
  reportReadbackOutput?: string;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.inputReport) throw new Error("input_report_required_for_handoff_bundle_derivation");
  if (!args.handoffBundleOutput) throw new Error("handoff_bundle_output_required_for_handoff_bundle_derivation");

  const report = JSON.parse(await readFile(path.resolve(args.inputReport), "utf8")) as unknown;
  const reportReadback = buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback({
    report,
    emittedAt: args.emittedAt,
  });
  assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(reportReadback);
  if (args.reportReadbackOutput) {
    await writeFile(path.resolve(args.reportReadbackOutput), `${JSON.stringify(reportReadback, null, 2)}\n`, "utf8");
  }
  if (reportReadback.reviewStatus !== "edge-layer-seam-history-hyperswarm-reader-report-readback-valid") {
    throw new Error("hyperswarm_reader_report_readback_invalid_for_handoff_derivation");
  }

  const observationResult = observationResultFromReport(report);
  assertEdgeLayerSeamHistoryObservationResult(observationResult);
  const handoffBundle = buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle({
    observationResult,
    emittedAt: args.emittedAt,
  });
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle(handoffBundle);
  await writeFile(path.resolve(args.handoffBundleOutput), `${JSON.stringify(handoffBundle, null, 2)}\n`, "utf8");
}

function observationResultFromReport(report: unknown): unknown {
  if (!isRecord(report)) return undefined;
  return report.observationResult;
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
    if (arg === "--input-report") {
      args.inputReport = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--handoff-bundle-output") {
      args.handoffBundleOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--report-readback-output") {
      args.reportReadbackOutput = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report.ts --input-report path --handoff-bundle-output path [--report-readback-output path] [--emitted-at iso]",
    "",
    "Reads a saved Hyperswarm reader report, validates its readback, and derives an Edge handoff bundle from the contained observation result.",
    "This command does not open Hyperswarm, open Corestore, claim a new live swarm run, write Edge projection state, admit Layer evidence, interpret RBC, grant authority, or publish to Mesh.",
  ].join("\n") + "\n");
}
