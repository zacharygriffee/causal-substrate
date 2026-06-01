import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryPublicRefreshReadinessGate,
  buildEdgeLayerSeamHistoryPublicRefreshReadinessGate,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const publicDeviceRunDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-2026-06-01");
const commandPath = path.join(publicDeviceRunDir, "operator-selected-public-refresh-command.json");

test("public refresh readiness gate marks prepared public commands operator-runnable without running them", async () => {
  const gate = buildEdgeLayerSeamHistoryPublicRefreshReadinessGate({
    operatorPublicRefreshCommand: await readJson(commandPath),
    emittedAt: "2026-06-01T19:42:00.000Z",
    sourcePaths: {
      operatorPublicRefreshCommand: commandPath,
    },
  });

  assertEdgeLayerSeamHistoryPublicRefreshReadinessGate(gate);
  assert.equal(gate.reviewStatus, "edge-layer-seam-history-public-refresh-readiness-gate-ready");
  assert.equal(gate.readiness.operatorMayRunPreparedPublicRefreshCommands, true);
  assert.equal(gate.readiness.preparedCommandArtifactReady, true);
  assert.equal(gate.readiness.publicRefreshRunByThisGate, false);
  assert.equal(gate.commandSummary.refreshRunId, "public-hyperswarm-device-to-device-operator-refresh");
  assert.equal(gate.commandSummary.sourceDevice, "platform-lab");
  assert.equal(gate.commandSummary.replicaDevice, "mesh-lab");
  assert.equal(gate.commandSummary.expectedOutputCount, 8);
  assert.equal(gate.validation.operatorSelectedRefresh, true);
  assert.equal(gate.validation.commandArtifactReady, true);
  assert.equal(gate.validation.commandArtifactInstructionsOnly, true);
  assert.equal(gate.validation.sourceRefsPreserved, true);
  assert.equal(gate.validation.publicSourceProofRungPreserved, true);
  assert.equal(gate.validation.publicSwarmCommandsPresent, true);
  assert.equal(gate.validation.bootstrapOverrideRejected, true);
  assert.equal(gate.validation.expectedOutputsNamed, true);
  assert.deepEqual(gate.validation.issues, []);
  assert.equal(
    gate.proof.strongestSourceProofRungObserved,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(gate.proof.gateOperationProofRung, "local_readiness_gate_over_operator_public_refresh_command_artifact");
  assert.equal(gate.proof.readsPreparedCommandOnly, true);
  assert.equal(gate.proof.liveSwarmRunClaimedByThisGate, false);
  assert.equal(gate.proof.publicRefreshExecutedByThisGate, false);
  assert.equal(gate.proof.proofRungUpgradeClaimed, false);
  assert.equal(gate.boundary.opensSwarm, false);
  assert.equal(gate.boundary.opensCorestore, false);
  assert.equal(gate.boundary.runsPublicRefresh, false);
  assert.equal(gate.boundary.callsEdge, false);
  assert.equal(gate.boundary.callsLayer, false);
  assert.equal(gate.boundary.writesEdgeProjection, false);
  assert.equal(gate.boundary.interpretsRbc, false);
  assert.equal(gate.boundary.grantsAuthority, false);
});

test("public refresh readiness gate blocks bootstrap override and command overclaims", async () => {
  const command = await readJson(commandPath) as any;
  command.commands.sourceDeviceCommand = command.commands.sourceDeviceCommand.replace(
    "env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP ",
    "CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP=127.0.0.1:49737 ",
  );
  command.boundary.runsPublicRefresh = true;

  const gate = buildEdgeLayerSeamHistoryPublicRefreshReadinessGate({
    operatorPublicRefreshCommand: command,
    emittedAt: "2026-06-01T19:42:30.000Z",
  });

  assertEdgeLayerSeamHistoryPublicRefreshReadinessGate(gate);
  assert.equal(gate.reviewStatus, "edge-layer-seam-history-public-refresh-readiness-gate-blocked");
  assert.equal(gate.readiness.operatorMayRunPreparedPublicRefreshCommands, false);
  assert.equal(gate.proof.liveSwarmRunClaimedByThisGate, false);
  assert.equal(gate.boundary.runsPublicRefresh, false);
  assert.ok(gate.validation.issues.includes("bootstrap-override-not-rejected"));
  assert.ok(gate.validation.issues.includes("operator-public-refresh-command-overclaim"));
});

test("public refresh readiness gate CLI writes readiness artifact", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-public-refresh-readiness-gate-"));
  const outputPath = path.join(tempRoot, "public-refresh-readiness-gate.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/gate-edge-layer-seam-history-public-refresh-readiness.ts",
      "--run-dir",
      publicDeviceRunDir,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-01T19:43:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const gate = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryPublicRefreshReadinessGate(gate);
    assert.equal(gate.reviewStatus, "edge-layer-seam-history-public-refresh-readiness-gate-ready");
    assert.equal(gate.validation.noLiveSwarmClaimByThisGate, true);
    assert.equal(gate.boundary.publishesToMesh, false);
    assert.equal(gate.boundary.writesProductionContinuity, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
