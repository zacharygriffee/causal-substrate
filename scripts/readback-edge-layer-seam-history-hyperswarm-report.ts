import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback,
  buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback,
} from "../src/index.js";

interface CliArgs {
  inputReport?: string;
  readbackOutput?: string;
  emittedAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.inputReport) throw new Error("input_report_required_for_hyperswarm_report_readback");
  if (!args.readbackOutput) throw new Error("readback_output_required_for_hyperswarm_report_readback");

  const report = JSON.parse(await readFile(path.resolve(args.inputReport), "utf8")) as unknown;
  const readback = buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback({
    report,
    emittedAt: args.emittedAt,
  });
  assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(readback);
  await writeFile(path.resolve(args.readbackOutput), `${JSON.stringify(readback, null, 2)}\n`, "utf8");
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
    if (arg === "--input-report" || arg === "--input") {
      args.inputReport = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--readback-output" || arg === "--output") {
      args.readbackOutput = requireNext(argv, index, arg);
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
    "Usage: tsx scripts/readback-edge-layer-seam-history-hyperswarm-report.ts --input-report path --readback-output path [--emitted-at iso]",
    "",
    "Reads a saved Edge Layer seam-history Hyperswarm reader report and writes a bounded readback artifact.",
    "This command does not open Hyperswarm, open Corestore, write records, admit Layer evidence, interpret RBC, grant authority, or claim a new live swarm proof.",
  ].join("\n") + "\n");
}
