import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryPublicSwarmRefreshDecision,
  buildEdgeLayerSeamHistoryPublicSwarmRefreshDecision,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

const publicDeviceRunDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-2026-06-01");

test("public swarm refresh decision marks stable saved artifacts as no immediate refresh required", async () => {
  const decision = buildEdgeLayerSeamHistoryPublicSwarmRefreshDecision({
    reproducibilityCheck: await readJson(path.join(publicDeviceRunDir, "public-artifact-reproducibility-check.json")),
    observationToEdgeContract: await readJson(path.join(publicDeviceRunDir, "observation-to-edge-projection-contract.json")),
    proofSummaryConsumerReadback: await readJson(path.join(publicDeviceRunDir, "proof-summary-consumer-readback.json")),
    emittedAt: "2026-06-01T19:02:00.000Z",
  });

  assertEdgeLayerSeamHistoryPublicSwarmRefreshDecision(decision);
  assert.equal(decision.reviewStatus, "edge-layer-seam-history-public-swarm-refresh-decision-ready");
  assert.equal(decision.decision.recommendation, "not_required_artifacts_stable");
  assert.equal(decision.decision.publicRefreshCommandPrepared, false);
  assert.equal(decision.decision.publicRefreshExecutedByThisDecision, false);
  assert.equal(
    decision.proof.decisionOperationProofRung,
    "local_refresh_decision_over_saved_public_hyperswarm_artifacts",
  );
  assert.equal(decision.proof.liveSwarmRunClaimedByThisDecision, false);
  assert.equal(decision.validation.reproducibilityCheckReady, true);
  assert.equal(decision.validation.edgeContractReady, true);
  assert.equal(decision.validation.consumerReadbackReady, true);
  assert.equal(decision.validation.sourceRefsPreserved, true);
  assert.equal(decision.validation.publicSourceProofRungPreserved, true);
  assert.deepEqual(decision.validation.issues, []);
  assert.equal(decision.boundary.readsSavedArtifactsOnly, true);
  assert.equal(decision.boundary.runsPublicRefresh, false);
  assert.equal(decision.boundary.opensSwarm, false);
  assert.equal(decision.boundary.writesEdgeProjection, false);
});

test("public swarm refresh decision CLI writes saved-artifact decision", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-public-refresh-decision-"));
  const outputPath = path.join(tempRoot, "decision.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/decide-edge-layer-seam-history-public-swarm-refresh.ts",
      "--run-dir",
      publicDeviceRunDir,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-01T19:02:30.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const decision = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryPublicSwarmRefreshDecision(decision);
    assert.equal(decision.decision.recommendation, "not_required_artifacts_stable");
    assert.equal(decision.validation.noLiveSwarmClaimByThisDecision, true);
    assert.equal(decision.boundary.opensCorestore, false);
    assert.equal(decision.boundary.publishesToMesh, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
