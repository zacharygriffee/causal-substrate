import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertFileResourceLiftDecisionCompatibilityObservation,
  buildFileResourceLiftDecisionCompatibilityObservation,
} from "../src/adapters/file-resource-lift-decision-compatibility-observation.js";

interface Args {
  layerReview?: string;
  layerReadback?: string;
  output?: string;
  emittedAt?: string;
}

const args = parseArgs(process.argv.slice(2));
if (!args.layerReview) throw new Error("--layer-review is required");
if (!args.layerReadback) throw new Error("--layer-readback is required");
if (!args.output) throw new Error("--output is required");

const layerDecisionBoundaryReview = await readJson(args.layerReview);
const layerDecisionBoundaryReviewReadback = await readJson(args.layerReadback);
const observation = buildFileResourceLiftDecisionCompatibilityObservation({
  layerDecisionBoundaryReview,
  layerDecisionBoundaryReviewReadback,
  emittedAt: args.emittedAt ?? new Date().toISOString(),
  sourcePaths: {
    layerDecisionBoundaryReview: path.resolve(args.layerReview),
    layerDecisionBoundaryReviewReadback: path.resolve(args.layerReadback),
  },
});
assertFileResourceLiftDecisionCompatibilityObservation(observation);
await mkdir(path.dirname(path.resolve(args.output)), { recursive: true });
await writeFile(path.resolve(args.output), `${JSON.stringify(observation, null, 2)}\n`, "utf8");

process.stdout.write(`${JSON.stringify({
  commandStatus: "causal_file_resource_lift_decision_compatibility_observation_emitted",
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
    if (arg === "--layer-review") {
      parsed.layerReview = requireNext(next, arg);
      index += 1;
    } else if (arg === "--layer-readback") {
      parsed.layerReadback = requireNext(next, arg);
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
