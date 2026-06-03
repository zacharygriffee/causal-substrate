import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertGenericCausalSeamPublicProofIndex,
  assertGenericCausalSeamPublicProofIndexConsumerHandoff,
  assertGenericCausalSeamPublicProofIndexConsumerHandoffReadback,
  buildGenericCausalSeamPublicProofIndex,
  buildGenericCausalSeamPublicProofIndexConsumerHandoff,
  buildGenericCausalSeamPublicProofIndexConsumerHandoffReadback,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const genericPublicRunDir = path.resolve("proof-artifacts/generic-causal-seam-public-swarm-2026-06-03");

test("generic public proof index preserves public source rung without upgrading saved artifacts", async () => {
  const artifacts = await readGenericPublicArtifacts();
  const index = buildGenericCausalSeamPublicProofIndex({
    runId: "generic-causal-seam-public-swarm-2026-06-03",
    artifacts,
    artifactPointers: artifactPointers(genericPublicRunDir),
    emittedAt: "2026-06-03T14:03:00.000Z",
  });

  assertGenericCausalSeamPublicProofIndex(index);
  assert.equal(index.reviewStatus, "generic-causal-seam-public-proof-index-ready");
  assert.equal(index.proof.strongestSourceProofRungObserved, "durable_replicated_public_swarm_seam");
  assert.equal(index.proof.indexOperationProofRung, "saved_readback_seam");
  assert.equal(index.proof.liveSwarmRunClaimedByThisIndex, false);
  assert.equal(index.proof.proofRungUpgradeClaimed, false);
  assert.deepEqual(index.validation.issues, []);
  assert.equal(index.validation.replicaReportCompatible, true);
  assert.equal(index.validation.publicSourceProofRungPreserved, true);
  assert.equal(index.validation.publicSwarmTransportPreserved, true);
  assert.equal(index.validation.durableReadbackPreserved, true);
  assert.equal(index.consumerSuitability.genericConsumersMayReadAsObservationOnlyIndex, true);
  assert.equal(index.consumerSuitability.edgeMayConsumeAsObservationOnlyInput, true);
  assert.equal(index.consumerSuitability.layerMayConsumeAsObservationOnlyFeedback, true);
  assert.equal(index.consumerSuitability.spineMayConsumeAsPostureEvidence, true);
  assert.deepEqual(index.preservedRefs.requestIds, ["generic-request:2026-06-03:linked"]);
  assert.deepEqual(index.preservedRefs.receiptIds, ["generic-receipt:2026-06-03:linked"]);
  assert.equal(index.boundary.opensSwarm, false);
  assert.equal(index.boundary.opensCorestore, false);
  assert.equal(index.boundary.callsConsumers, false);
  assert.equal(index.boundary.writesConsumerState, false);
  assert.equal(index.boundary.interpretsRbc, false);
  assert.equal(index.boundary.grantsAuthority, false);
});

test("generic public proof index handoff and readback preserve refs for generic consumers", async () => {
  const index = buildGenericCausalSeamPublicProofIndex({
    runId: "generic-causal-seam-public-swarm-2026-06-03",
    artifacts: await readGenericPublicArtifacts(),
    emittedAt: "2026-06-03T14:03:30.000Z",
  });
  const handoff = buildGenericCausalSeamPublicProofIndexConsumerHandoff({
    publicProofIndex: index,
    emittedAt: "2026-06-03T14:04:00.000Z",
  });
  const readback = buildGenericCausalSeamPublicProofIndexConsumerHandoffReadback({
    publicProofIndexConsumerHandoff: handoff,
    emittedAt: "2026-06-03T14:04:30.000Z",
  });

  assertGenericCausalSeamPublicProofIndexConsumerHandoff(handoff);
  assertGenericCausalSeamPublicProofIndexConsumerHandoffReadback(readback);
  assert.equal(handoff.reviewStatus, "generic-causal-seam-public-proof-index-consumer-handoff-ready");
  assert.equal(handoff.proof.consumerHandoffOperationProofRung, "consumer_handoff_seam");
  assert.equal(handoff.proof.liveSwarmRunClaimedByThisHandoff, false);
  assert.equal(handoff.consumerHandoff.genericConsumersMayReadAsObservationOnlyIndex, true);
  assert.equal(handoff.consumerHandoff.sourceProofRungPreservedForConsumers, true);
  assert.equal(readback.reviewStatus, "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready");
  assert.equal(readback.proof.readbackOperationProofRung, "saved_readback_seam");
  assert.equal(readback.proof.liveSwarmRunClaimedByThisReadback, false);
  assert.equal(readback.consumerReadback.genericConsumerHandoffAvailable, true);
  assert.equal(readback.preservedRefs.requestHashes[0], `sha256:${"a".repeat(64)}`);
  assert.equal(readback.boundary.publishesToMesh, false);
  assert.equal(readback.boundary.writesProductionContinuity, false);
});

test("generic public proof index rejects weakened public evidence and overclaims", async () => {
  const cases: Array<{
    name: string;
    mutate: (artifacts: Awaited<ReturnType<typeof readGenericPublicArtifacts>>) => void;
    issue: string;
  }> = [
    {
      name: "missing public reader evidence",
      mutate: (artifacts) => {
        const report = artifacts.replicaReport as any;
        report.readerProof.publicHyperswarmInputObservedByCausalSubstrate = false;
      },
      issue: "replica-report-not-compatible",
    },
    {
      name: "weakened source proof rung",
      mutate: (artifacts) => {
        const observation = artifacts.observationResult as any;
        observation.strongestProofRung = "swarm_discovered_seam";
      },
      issue: "observation-result-not-compatible",
    },
    {
      name: "authority overclaim",
      mutate: (artifacts) => {
        const observation = artifacts.observationResult as any;
        observation.boundary = { grantsAuthority: true };
      },
      issue: "indexed-artifact-overclaim",
    },
  ];

  for (const testCase of cases) {
    const artifacts = await readGenericPublicArtifacts();
    testCase.mutate(artifacts);
    const index = buildGenericCausalSeamPublicProofIndex({
      runId: `generic-causal-seam-public-swarm-2026-06-03:${testCase.name}`,
      artifacts,
      emittedAt: "2026-06-03T14:05:00.000Z",
    });

    assertGenericCausalSeamPublicProofIndex(index);
    assert.equal(index.reviewStatus, "generic-causal-seam-public-proof-index-incomplete");
    assert.equal(index.consumerSuitability.genericConsumersMayReadAsObservationOnlyIndex, false);
    assert.equal(index.proof.liveSwarmRunClaimedByThisIndex, false);
    assert.equal(index.boundary.opensSwarm, false);
    assert.ok(index.validation.issues.includes(testCase.issue), testCase.name);
  }
});

test("generic public proof index CLIs write index handoff and readback", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "generic-public-proof-index-"));
  const indexPath = path.join(tempRoot, "generic-public-seam-proof-index.json");
  const handoffPath = path.join(tempRoot, "generic-public-proof-index-consumer-handoff.json");
  const readbackPath = path.join(tempRoot, "generic-public-proof-index-consumer-handoff-readback.json");
  try {
    const indexRun = await execFileAsync("npx", [
      "tsx",
      "scripts/index-generic-causal-seam-public-proof.ts",
      "--run-dir",
      genericPublicRunDir,
      "--output",
      indexPath,
      "--emitted-at",
      "2026-06-03T14:06:00.000Z",
    ], {
      cwd: path.resolve("."),
    });
    const handoffRun = await execFileAsync("npx", [
      "tsx",
      "scripts/handoff-generic-causal-seam-public-proof-index-to-consumers.ts",
      "--index",
      indexPath,
      "--output",
      handoffPath,
      "--emitted-at",
      "2026-06-03T14:06:30.000Z",
    ], {
      cwd: path.resolve("."),
    });
    const readbackRun = await execFileAsync("npx", [
      "tsx",
      "scripts/readback-generic-causal-seam-public-proof-index-consumer-handoff.ts",
      "--handoff",
      handoffPath,
      "--output",
      readbackPath,
      "--emitted-at",
      "2026-06-03T14:07:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(indexRun.stdout, "");
    assert.equal(indexRun.stderr, "");
    assert.equal(handoffRun.stdout, "");
    assert.equal(handoffRun.stderr, "");
    assert.equal(readbackRun.stdout, "");
    assert.equal(readbackRun.stderr, "");
    const index = JSON.parse(await readFile(indexPath, "utf8"));
    const handoff = JSON.parse(await readFile(handoffPath, "utf8"));
    const readback = JSON.parse(await readFile(readbackPath, "utf8"));
    assertGenericCausalSeamPublicProofIndex(index);
    assertGenericCausalSeamPublicProofIndexConsumerHandoff(handoff);
    assertGenericCausalSeamPublicProofIndexConsumerHandoffReadback(readback);
    assert.equal(index.reviewStatus, "generic-causal-seam-public-proof-index-ready");
    assert.equal(handoff.reviewStatus, "generic-causal-seam-public-proof-index-consumer-handoff-ready");
    assert.equal(readback.reviewStatus, "generic-causal-seam-public-proof-index-consumer-handoff-readback-ready");
    assert.equal(readback.validation.noLiveSwarmClaimByThisReadback, true);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readGenericPublicArtifacts(): Promise<{
  seamHistoryInput: unknown;
  sourceManifest: unknown;
  replicaReport: unknown;
  observationResult: unknown;
  observationReadback: unknown;
}> {
  const pointers = artifactPointers(genericPublicRunDir);
  return {
    seamHistoryInput: await readJson(pointers.seamHistoryInput),
    sourceManifest: await readJson(pointers.sourceManifest),
    replicaReport: await readJson(pointers.replicaReport),
    observationResult: await readJson(pointers.observationResult),
    observationReadback: await readJson(pointers.observationReadback),
  };
}

function artifactPointers(runDir: string): {
  publicRunDir: string;
  seamHistoryInput: string;
  sourceManifest: string;
  replicaReport: string;
  observationResult: string;
  observationReadback: string;
} {
  return {
    publicRunDir: runDir,
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
