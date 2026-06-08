import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildRepoFamilyMechanicsChainObservation,
  buildRepoFamilyMechanicsChainReadback,
} from "../src/index.js";

interface CliArgs {
  packsProof?: string;
  bytesProof?: string;
  conduitProof?: string;
  platformActivationProof?: string;
  platformPublicStatusProof?: string;
  layerStatusReview?: string;
  edgeVisibilityReview?: string;
  output?: string;
  readbackOutput?: string;
  emittedAt: string;
  readAt: string;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.output) throw new Error("output_required");
  if (!args.readbackOutput) throw new Error("readback_output_required");

  const sourcePaths = {
    ...(args.packsProof ? { packsProof: path.resolve(args.packsProof) } : {}),
    ...(args.bytesProof ? { bytesProof: path.resolve(args.bytesProof) } : {}),
    ...(args.conduitProof ? { conduitProof: path.resolve(args.conduitProof) } : {}),
    ...(args.platformActivationProof ? { platformActivationProof: path.resolve(args.platformActivationProof) } : {}),
    ...(args.platformPublicStatusProof ? { platformPublicStatusProof: path.resolve(args.platformPublicStatusProof) } : {}),
    ...(args.layerStatusReview ? { layerStatusReview: path.resolve(args.layerStatusReview) } : {}),
    ...(args.edgeVisibilityReview ? { edgeVisibilityReview: path.resolve(args.edgeVisibilityReview) } : {}),
  };
  const observation = buildRepoFamilyMechanicsChainObservation({
    packsProof: args.packsProof ? await readJson(args.packsProof) : undefined,
    bytesProof: args.bytesProof ? await readJson(args.bytesProof) : undefined,
    conduitProof: args.conduitProof ? await readJson(args.conduitProof) : undefined,
    platformActivationProof: args.platformActivationProof ? await readJson(args.platformActivationProof) : undefined,
    platformPublicStatusProof: args.platformPublicStatusProof ? await readJson(args.platformPublicStatusProof) : undefined,
    layerStatusReview: args.layerStatusReview ? await readJson(args.layerStatusReview) : undefined,
    edgeVisibilityReview: args.edgeVisibilityReview ? await readJson(args.edgeVisibilityReview) : undefined,
    emittedAt: args.emittedAt,
    sourcePaths,
  });
  const readback = buildRepoFamilyMechanicsChainReadback(observation, args.readAt);

  await writeJson(args.output, observation);
  await writeJson(args.readbackOutput, readback);
  process.stdout.write(`${JSON.stringify({
    observationId: observation.observationId,
    observationHash: observation.observationHash,
    readbackHash: readback.readbackHash,
    classification: observation.classification,
    proofRung: observation.proof.operationProofRung,
    nextPressure: observation.nextPressure,
    issues: observation.validation.issues,
  }, null, 2)}\n`);
  if (observation.classification !== "compatible") process.exitCode = 2;
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(path.resolve(filePath), "utf8")) as unknown;
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  const resolved = path.resolve(filePath);
  await mkdir(path.dirname(resolved), { recursive: true });
  await writeFile(resolved, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    emittedAt: new Date().toISOString(),
    readAt: new Date().toISOString(),
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--packs-proof") args.packsProof = requireNext(argv, index++, arg);
    else if (arg === "--bytes-proof") args.bytesProof = requireNext(argv, index++, arg);
    else if (arg === "--conduit-proof") args.conduitProof = requireNext(argv, index++, arg);
    else if (arg === "--platform-activation-proof") args.platformActivationProof = requireNext(argv, index++, arg);
    else if (arg === "--platform-public-status-proof") args.platformPublicStatusProof = requireNext(argv, index++, arg);
    else if (arg === "--layer-status-review") args.layerStatusReview = requireNext(argv, index++, arg);
    else if (arg === "--edge-visibility-review") args.edgeVisibilityReview = requireNext(argv, index++, arg);
    else if (arg === "--output") args.output = requireNext(argv, index++, arg);
    else if (arg === "--readback-output") args.readbackOutput = requireNext(argv, index++, arg);
    else if (arg === "--emitted-at") args.emittedAt = requireNext(argv, index++, arg);
    else if (arg === "--read-at") args.readAt = requireNext(argv, index++, arg);
    else throw new Error(`unknown_argument:${arg}`);
  }
  return args;
}

function requireNext(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`missing_value_for:${flag}`);
  return value;
}
