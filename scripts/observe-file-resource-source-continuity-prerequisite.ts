import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertFileResourceSourceContinuityPrerequisiteObservation,
  buildFileResourceSourceContinuityPrerequisiteObservation,
} from "../src/adapters/file-resource-source-continuity-prerequisite-observation.js";

interface Args {
  layerPrerequisitePacket?: string;
  layerPrerequisiteReadback?: string;
  edgePrerequisiteVisibility?: string;
  output?: string;
  emittedAt?: string;
}

const args = parseArgs(process.argv.slice(2));
if (!args.layerPrerequisitePacket) throw new Error("--layer-prerequisite-packet is required");
if (!args.layerPrerequisiteReadback) throw new Error("--layer-prerequisite-readback is required");
if (!args.edgePrerequisiteVisibility) throw new Error("--edge-prerequisite-visibility is required");
if (!args.output) throw new Error("--output is required");

const layerPrerequisitePacket = await readJson(args.layerPrerequisitePacket);
const layerPrerequisiteReadback = await readJson(args.layerPrerequisiteReadback);
const edgePrerequisiteVisibility = await readJson(args.edgePrerequisiteVisibility);
const observation = buildFileResourceSourceContinuityPrerequisiteObservation({
  layerPrerequisitePacket,
  layerPrerequisiteReadback,
  edgePrerequisiteVisibility,
  emittedAt: args.emittedAt ?? new Date().toISOString(),
  sourcePaths: {
    layerPrerequisitePacket: path.resolve(args.layerPrerequisitePacket),
    layerPrerequisiteReadback: path.resolve(args.layerPrerequisiteReadback),
    edgePrerequisiteVisibility: path.resolve(args.edgePrerequisiteVisibility),
  },
});
assertFileResourceSourceContinuityPrerequisiteObservation(observation);
await mkdir(path.dirname(path.resolve(args.output)), { recursive: true });
await writeFile(path.resolve(args.output), `${JSON.stringify(observation, null, 2)}\n`, "utf8");

process.stdout.write(`${JSON.stringify({
  commandStatus: "causal_file_resource_source_continuity_prerequisite_observation_emitted",
  output: path.resolve(args.output),
  observationId: observation.observationId,
  observationHash: observation.observationHash,
  status: observation.status,
  classification: observation.classification,
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
    if (arg === "--layer-prerequisite-packet") {
      parsed.layerPrerequisitePacket = requireNext(next, arg);
      index += 1;
    } else if (arg === "--layer-prerequisite-readback") {
      parsed.layerPrerequisiteReadback = requireNext(next, arg);
      index += 1;
    } else if (arg === "--edge-prerequisite-visibility") {
      parsed.edgePrerequisiteVisibility = requireNext(next, arg);
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
