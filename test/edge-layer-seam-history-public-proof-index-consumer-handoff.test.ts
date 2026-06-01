import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff,
  buildEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const operatorRefreshRunDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-operator-refresh");
const publicSeamProofIndexPath = path.join(operatorRefreshRunDir, "public-seam-proof-index.json");

test("public proof index consumer handoff preserves refs for Edge Layer and Spine without upgrading proof", async () => {
  const handoff = buildEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff({
    publicSeamProofIndex: await readJson(publicSeamProofIndexPath),
    emittedAt: "2026-06-01T08:40:00.000Z",
    sourcePaths: {
      publicSeamProofIndex: publicSeamProofIndexPath,
    },
  });

  assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff(handoff);
  assert.equal(handoff.reviewStatus, "edge-layer-seam-history-public-proof-index-consumer-handoff-ready");
  assert.equal(handoff.consumerHandoff.edgeMayConsumeAsObservationOnlyIndex, true);
  assert.equal(handoff.consumerHandoff.layerMayConsumeAsObservationOnlyFeedbackIndex, true);
  assert.equal(handoff.consumerHandoff.spineMayConsumeAsFamilyPressureIndex, true);
  assert.equal(handoff.consumerHandoff.savedIndexHandoffOnly, true);
  assert.equal(handoff.consumerHandoff.doesNotUpgradeSavedIndex, true);
  assert.equal(handoff.preservedRefs.requestIds.length, 2);
  assert.equal(handoff.preservedRefs.requestHashes.length, 2);
  assert.equal(handoff.preservedRefs.receiptIds.length, 2);
  assert.equal(handoff.preservedRefs.receiptHashes.length, 2);
  assert.equal(
    handoff.proof.strongestSourceProofRungObserved,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(
    handoff.proof.consumerHandoffOperationProofRung,
    "local_consumer_handoff_over_saved_public_seam_proof_index",
  );
  assert.equal(handoff.proof.liveSwarmRunClaimedByThisHandoff, false);
  assert.equal(handoff.proof.proofRungUpgradeClaimed, false);
  assert.equal(handoff.validation.publicSeamProofIndexReady, true);
  assert.equal(handoff.validation.configuredBootstrapEvidenceAbsent, true);
  assert.deepEqual(handoff.validation.issues, []);
  assert.equal(handoff.boundary.opensSwarm, false);
  assert.equal(handoff.boundary.callsEdge, false);
  assert.equal(handoff.boundary.callsLayer, false);
  assert.equal(handoff.boundary.writesEdgeProjection, false);
  assert.equal(handoff.boundary.admitsLayerEvidence, false);
  assert.equal(handoff.boundary.interpretsRbc, false);
  assert.equal(handoff.boundary.grantsAuthority, false);
});

test("public proof index consumer handoff rejects weakened index suitability and bootstrap evidence", async () => {
  const cases: Array<{
    name: string;
    mutate: (index: any) => void;
    issue: string;
  }> = [
    {
      name: "missing refs",
      mutate: (index) => {
        index.validation.sourceRefsPreserved = false;
        index.preservedRefs.requestHashes = [];
      },
      issue: "source-refs-not-preserved",
    },
    {
      name: "configured bootstrap",
      mutate: (index) => {
        index.validation.configuredBootstrapEvidenceAbsent = false;
      },
      issue: "configured-bootstrap-evidence-present",
    },
    {
      name: "projection suitability overclaim",
      mutate: (index) => {
        index.consumerSuitability.projectionStateWritten = true;
      },
      issue: "consumer-suitability-not-preserved",
    },
    {
      name: "authority overclaim",
      mutate: (index) => {
        index.boundary.grantsAuthority = true;
      },
      issue: "public-seam-proof-index-overclaim",
    },
  ];

  for (const testCase of cases) {
    const index = await readJson(publicSeamProofIndexPath) as any;
    testCase.mutate(index);
    const handoff = buildEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff({
      publicSeamProofIndex: index,
      emittedAt: "2026-06-01T08:40:30.000Z",
    });

    assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff(handoff);
    assert.equal(handoff.reviewStatus, "edge-layer-seam-history-public-proof-index-consumer-handoff-incomplete");
    assert.equal(handoff.consumerHandoff.edgeMayConsumeAsObservationOnlyIndex, false);
    assert.equal(handoff.proof.liveSwarmRunClaimedByThisHandoff, false);
    assert.equal(handoff.boundary.writesEdgeProjection, false);
    assert.ok(handoff.validation.issues.includes(testCase.issue), testCase.name);
  }
});

test("public proof index consumer handoff CLI writes saved-index handoff", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-public-proof-index-handoff-"));
  const outputPath = path.join(tempRoot, "public-proof-index-consumer-handoff.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/handoff-edge-layer-seam-history-public-proof-index-to-consumers.ts",
      "--run-dir",
      operatorRefreshRunDir,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-01T08:41:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const handoff = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryPublicProofIndexConsumerHandoff(handoff);
    assert.equal(handoff.reviewStatus, "edge-layer-seam-history-public-proof-index-consumer-handoff-ready");
    assert.equal(handoff.validation.noLiveSwarmClaimByThisHandoff, true);
    assert.equal(handoff.boundary.publishesToMesh, false);
    assert.equal(handoff.boundary.writesProductionContinuity, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
