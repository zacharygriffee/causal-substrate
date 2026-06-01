import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback,
  buildEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const handoffPath = path.resolve(
  "proof-artifacts/public-hyperswarm-device-to-device-operator-refresh/public-proof-index-consumer-handoff.json",
);

test("public proof index consumer handoff readback preserves consumer refs without upgrading proof", async () => {
  const readback = buildEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback({
    publicProofIndexConsumerHandoff: await readJson(handoffPath),
    emittedAt: "2026-06-01T08:50:00.000Z",
    sourcePaths: {
      publicProofIndexConsumerHandoff: handoffPath,
    },
  });

  assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback(readback);
  assert.equal(readback.reviewStatus, "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready");
  assert.equal(readback.consumerReadback.edgeObservationOnlyIndexAvailable, true);
  assert.equal(readback.consumerReadback.layerObservationOnlyFeedbackIndexAvailable, true);
  assert.equal(readback.consumerReadback.spineFamilyPressureIndexAvailable, true);
  assert.equal(readback.consumerReadback.savedHandoffReadbackOnly, true);
  assert.equal(readback.consumerReadback.doesNotUpgradeSavedHandoff, true);
  assert.equal(readback.preservedRefs.requestIds.length, 2);
  assert.equal(readback.preservedRefs.requestHashes.length, 2);
  assert.equal(readback.preservedRefs.receiptIds.length, 2);
  assert.equal(readback.preservedRefs.receiptHashes.length, 2);
  assert.equal(
    readback.proof.strongestSourceProofRungObserved,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(
    readback.proof.readbackOperationProofRung,
    "local_readback_over_saved_public_proof_index_consumer_handoff",
  );
  assert.equal(readback.proof.liveSwarmRunClaimedByThisReadback, false);
  assert.equal(readback.proof.proofRungUpgradeClaimed, false);
  assert.deepEqual(readback.validation.issues, []);
  assert.equal(readback.boundary.opensSwarm, false);
  assert.equal(readback.boundary.callsEdge, false);
  assert.equal(readback.boundary.callsLayer, false);
  assert.equal(readback.boundary.writesEdgeProjection, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
});

test("public proof index consumer handoff readback rejects weakened refs and overclaims", async () => {
  const cases: Array<{
    name: string;
    mutate: (handoff: any) => void;
    issue: string;
  }> = [
    {
      name: "missing refs",
      mutate: (handoff) => {
        handoff.validation.sourceRefsPreserved = false;
        handoff.preservedRefs.receiptHashes = [];
      },
      issue: "source-refs-not-preserved",
    },
    {
      name: "weakened consumer suitability",
      mutate: (handoff) => {
        handoff.consumerHandoff.layerMayConsumeAsObservationOnlyFeedbackIndex = false;
      },
      issue: "consumer-suitability-not-preserved",
    },
    {
      name: "authority overclaim",
      mutate: (handoff) => {
        handoff.boundary.grantsAuthority = true;
      },
      issue: "consumer-handoff-overclaim",
    },
  ];

  for (const testCase of cases) {
    const handoff = await readJson(handoffPath) as any;
    testCase.mutate(handoff);
    const readback = buildEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback({
      publicProofIndexConsumerHandoff: handoff,
      emittedAt: "2026-06-01T08:50:30.000Z",
    });

    assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-incomplete");
    assert.equal(readback.consumerReadback.edgeObservationOnlyIndexAvailable, false);
    assert.equal(readback.proof.liveSwarmRunClaimedByThisReadback, false);
    assert.equal(readback.boundary.writesEdgeProjection, false);
    assert.ok(readback.validation.issues.includes(testCase.issue), testCase.name);
  }
});

test("public proof index consumer handoff readback CLI writes lower-rung verifier", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-public-proof-index-handoff-readback-"));
  const outputPath = path.join(tempRoot, "public-proof-index-consumer-handoff-readback.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/readback-edge-layer-seam-history-public-proof-index-consumer-handoff.ts",
      "--handoff",
      handoffPath,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-01T08:51:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const readback = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoffReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-public-proof-index-consumer-handoff-readback-ready");
    assert.equal(readback.validation.noLiveSwarmClaimByThisReadback, true);
    assert.equal(readback.boundary.publishesToMesh, false);
    assert.equal(readback.boundary.writesProductionContinuity, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
