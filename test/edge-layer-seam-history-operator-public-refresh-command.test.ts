import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryOperatorPublicRefreshCommand,
  buildEdgeLayerSeamHistoryOperatorPublicRefreshCommand,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const publicDeviceRunDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-2026-06-01");

test("operator public refresh command prepares exact public swarm instructions without running swarm", async () => {
  const command = buildEdgeLayerSeamHistoryOperatorPublicRefreshCommand({
    publicSeamProofIndex: await readJson(path.join(publicDeviceRunDir, "public-seam-proof-index.json")),
    publicSwarmRefreshDecision: await readJson(path.join(publicDeviceRunDir, "public-swarm-refresh-decision.json")),
    emittedAt: "2026-06-01T19:35:00.000Z",
    operatorSelectedRefresh: true,
    refreshRunId: "public-hyperswarm-device-to-device-operator-refresh",
    outputDir: "proof-artifacts/public-hyperswarm-device-to-device-operator-refresh",
    namespace: "public,device,seam-history,operator-refresh",
  });

  assertEdgeLayerSeamHistoryOperatorPublicRefreshCommand(command);
  assert.equal(command.reviewStatus, "edge-layer-seam-history-operator-public-refresh-command-ready");
  assert.equal(command.operatorSelection.operatorSelectedRefresh, true);
  assert.equal(command.operatorSelection.refreshCommandPrepared, true);
  assert.equal(command.operatorSelection.publicRefreshExecutedByThisCommand, false);
  assert.equal(command.prerequisites.publicHyperswarmOnly, true);
  assert.equal(command.prerequisites.noBootstrapOverride, true);
  assert.equal(command.prerequisites.bootstrapOverrideAllowed, false);
  assert.deepEqual(command.prerequisites.forbiddenEnvironment, ["CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP"]);
  assert.match(command.commands.sourceDeviceCommand, /env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP/);
  assert.match(command.commands.sourceDeviceCommand, /CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1/);
  assert.match(command.commands.sourceDeviceCommand, /CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1/);
  assert.match(command.commands.sourceDeviceCommand, /run-edge-layer-seam-history-public-source-device\.ts/);
  assert.match(command.commands.replicaDeviceCommand, /run-edge-layer-seam-history-public-replica-device\.ts/);
  assert.equal(command.validation.commandsNamePublicSwarm, true);
  assert.equal(command.validation.commandsUnsetBootstrapOverride, true);
  assert.equal(command.validation.expectedOutputsNamed, true);
  assert.equal(command.sourceRefs.requestIds.length, 2);
  assert.equal(command.sourceRefs.requestHashes.length, 2);
  assert.equal(command.sourceRefs.receiptIds.length, 2);
  assert.equal(command.sourceRefs.receiptHashes.length, 2);
  assert.equal(
    command.proof.strongestSourceProofRungObserved,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(
    command.proof.commandOperationProofRung,
    "local_operator_refresh_command_preparation_over_saved_public_hyperswarm_artifacts",
  );
  assert.equal(command.proof.instructionsOnly, true);
  assert.equal(command.proof.liveSwarmRunClaimedByThisCommand, false);
  assert.equal(command.proof.publicRefreshExecutedByThisCommand, false);
  assert.equal(command.proof.proofRungUpgradeClaimed, false);
  assert.equal(command.boundary.runsPublicRefresh, false);
  assert.equal(command.boundary.opensSwarm, false);
  assert.equal(command.boundary.opensCorestore, false);
  assert.equal(command.boundary.callsEdge, false);
  assert.equal(command.boundary.callsLayer, false);
  assert.equal(command.boundary.writesEdgeProjection, false);
  assert.equal(command.boundary.interpretsRbc, false);
  assert.equal(command.boundary.grantsAuthority, false);
  assert.deepEqual(command.validation.issues, []);
});

test("operator public refresh command rejects missing operator selection", async () => {
  const command = buildEdgeLayerSeamHistoryOperatorPublicRefreshCommand({
    publicSeamProofIndex: await readJson(path.join(publicDeviceRunDir, "public-seam-proof-index.json")),
    publicSwarmRefreshDecision: await readJson(path.join(publicDeviceRunDir, "public-swarm-refresh-decision.json")),
    emittedAt: "2026-06-01T19:35:30.000Z",
    operatorSelectedRefresh: false,
  });

  assertEdgeLayerSeamHistoryOperatorPublicRefreshCommand(command);
  assert.equal(command.reviewStatus, "edge-layer-seam-history-operator-public-refresh-command-incomplete");
  assert.equal(command.operatorSelection.refreshCommandPrepared, false);
  assert.equal(command.proof.liveSwarmRunClaimedByThisCommand, false);
  assert.equal(command.boundary.runsPublicRefresh, false);
  assert.ok(command.validation.issues.includes("operator-selected-refresh-required"));
});

test("operator public refresh command CLI writes instructions-only artifact", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-operator-public-refresh-command-"));
  const outputPath = path.join(tempRoot, "operator-selected-public-refresh-command.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/prepare-edge-layer-seam-history-operator-public-refresh-command.ts",
      "--run-dir",
      publicDeviceRunDir,
      "--output",
      outputPath,
      "--operator-selected-refresh",
      "--refresh-run-id",
      "public-hyperswarm-device-to-device-operator-refresh",
      "--refresh-output-dir",
      "proof-artifacts/public-hyperswarm-device-to-device-operator-refresh",
      "--emitted-at",
      "2026-06-01T19:36:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const command = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryOperatorPublicRefreshCommand(command);
    assert.equal(command.reviewStatus, "edge-layer-seam-history-operator-public-refresh-command-ready");
    assert.equal(command.validation.noLiveSwarmClaimByThisCommand, true);
    assert.equal(command.boundary.publishesToMesh, false);
    assert.equal(command.boundary.writesProductionContinuity, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
