import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertFileResourceSourceContinuityAcceptanceObservation,
  buildFileResourceSourceContinuityAcceptanceObservation,
} from "../src/adapters/file-resource-source-continuity-acceptance-observation.js";

interface Args {
  layerAppend?: string;
  layerAppendReadback?: string;
  output?: string;
  emittedAt?: string;
}

const args = parseArgs(process.argv.slice(2));
if (!args.layerAppend) throw new Error("--layer-append is required");
if (!args.layerAppendReadback) throw new Error("--layer-append-readback is required");
if (!args.output) throw new Error("--output is required");

const layerAppend = await readJson(args.layerAppend);
const layerAppendReadback = await readJson(args.layerAppendReadback);
const observation = buildFileResourceSourceContinuityAcceptanceObservation({
  layerAppend,
  layerAppendReadback,
  emittedAt: args.emittedAt ?? new Date().toISOString(),
});
assertFileResourceSourceContinuityAcceptanceObservation(observation);
await mkdir(path.dirname(path.resolve(args.output)), { recursive: true });
await writeFile(path.resolve(args.output), `${JSON.stringify(observation, null, 2)}\n`, "utf8");

process.stdout.write(`${JSON.stringify({
  commandStatus: "causal_file_resource_source_continuity_acceptance_observation_emitted",
  output: path.resolve(args.output),
  observationId: observation.observationId,
  observationHash: observation.observationHash,
  status: observation.status,
  nextPressure: observation.nextPressure,
  issues: observation.validation.issues,
}, null, 2)}\n`);

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(path.resolve(filePath), "utf8")) as unknown;
}

function parseArgs(argv: string[]): Args {
  const parsed: Args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === "--layer-append") {
      parsed.layerAppend = requireNext(next, arg);
      index += 1;
    } else if (arg === "--layer-append-readback") {
      parsed.layerAppendReadback = requireNext(next, arg);
      index += 1;
    } else if (arg === "--output") {
      parsed.output = requireNext(next, arg);
      index += 1;
    } else if (arg === "--emitted-at") {
      parsed.emittedAt = requireNext(next, arg);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function requireNext(value: string | undefined, arg: string): string {
  if (!value) throw new Error(`${arg} requires a value`);
  return value;
}
