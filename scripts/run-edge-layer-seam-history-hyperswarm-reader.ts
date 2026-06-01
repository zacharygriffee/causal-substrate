import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback,
  buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback,
  buildEdgeLayerSeamHistoryRealHyperswarmProofRunInstructions,
  createHyperswarmReplicationSwarm,
  parseHyperswarmBootstrap,
  runEdgeLayerSeamHistoryHyperswarmReader,
} from "../src/index.js";

interface CliArgs {
  input?: string;
  reportOutput?: string;
  readbackOutput?: string;
  instructionsOutput?: string;
  storageDirA?: string;
  storageDirB?: string;
  namespaceParts?: string[];
  emittedAt: string;
  recordedAt?: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const instructions = buildEdgeLayerSeamHistoryRealHyperswarmProofRunInstructions({
    emittedAt: args.emittedAt,
    namespaceParts: args.namespaceParts,
  });

  if (process.env.CAUSAL_SUBSTRATE_REAL_HYPERSWARM !== "1") {
    if (args.instructionsOutput) {
      await writeFile(path.resolve(args.instructionsOutput), `${JSON.stringify(instructions, null, 2)}\n`, "utf8");
    } else {
      process.stdout.write(`${JSON.stringify(instructions, null, 2)}\n`);
    }
    return;
  }

  if (!args.input) throw new Error("input_required_for_real_hyperswarm_reader");
  if (!args.reportOutput) throw new Error("report_output_required_for_real_hyperswarm_reader");
  if (!args.storageDirA) throw new Error("storage_dir_a_required_for_real_hyperswarm_reader");
  if (!args.storageDirB) throw new Error("storage_dir_b_required_for_real_hyperswarm_reader");

  const seamHistory = JSON.parse(await readFile(path.resolve(args.input), "utf8")) as unknown;
  const bootstrap = parseHyperswarmBootstrap(process.env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP);
  const report = await runEdgeLayerSeamHistoryHyperswarmReader({
    storageDirA: path.resolve(args.storageDirA),
    storageDirB: path.resolve(args.storageDirB),
    createSwarm: async (seed) => {
      const swarm = await createHyperswarmReplicationSwarm({
        seed,
        ...(bootstrap.length > 0 ? { bootstrap } : {}),
      });
      await swarm.listen();
      return swarm;
    },
    seamHistory,
    emittedAt: args.emittedAt,
    recordedAt: args.recordedAt,
    namespaceParts: args.namespaceParts,
  });

  await writeFile(path.resolve(args.reportOutput), `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (args.readbackOutput) {
    const readback = buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback({
      report,
      emittedAt: args.emittedAt,
    });
    assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(readback);
    if (readback.reviewStatus !== "edge-layer-seam-history-hyperswarm-reader-report-readback-valid") {
      throw new Error("hyperswarm_reader_report_readback_invalid");
    }
    await writeFile(path.resolve(args.readbackOutput), `${JSON.stringify(readback, null, 2)}\n`, "utf8");
  }
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
    if (arg === "--input") {
      args.input = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--report-output") {
      args.reportOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--readback-output") {
      args.readbackOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--instructions-output") {
      args.instructionsOutput = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--storage-dir-a") {
      args.storageDirA = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--storage-dir-b") {
      args.storageDirB = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--namespace") {
      args.namespaceParts = requireNext(argv, index, arg)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      index += 1;
      continue;
    }
    if (arg === "--emitted-at") {
      args.emittedAt = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--recorded-at") {
      args.recordedAt = requireNext(argv, index, arg);
      index += 1;
      continue;
    }
    throw new Error(`unknown_argument:${arg}`);
  }

  return args;
}

function requireNext(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`missing_value_for:${flag}`);
  }
  return value;
}

function printUsage(): void {
  process.stdout.write([
    "Usage: tsx scripts/run-edge-layer-seam-history-hyperswarm-reader.ts --input path --report-output path --storage-dir-a path --storage-dir-b path [--readback-output path] [--instructions-output path] [--namespace comma,list] [--emitted-at iso] [--recorded-at iso]",
    "",
    "Without CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1, emits instructions only and does not open swarm or Corestore.",
    "With CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1, runs the durable Hyperswarm reader and writes a report.",
    "With --readback-output, checks the report readback and fails unless source refs and proof labels are preserved.",
  ].join("\n") + "\n");
}
