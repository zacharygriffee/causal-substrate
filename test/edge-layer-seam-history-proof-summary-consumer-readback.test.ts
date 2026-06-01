import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryProofSummaryConsumerReadback,
  buildEdgeLayerSeamHistoryProofSummaryConsumerReadback,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

const publicDeviceRunDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-2026-06-01");
const proofSummaryPath = path.join(publicDeviceRunDir, "edge-layer-seam-history-proof-summary.json");
const edgeContractPath = path.join(publicDeviceRunDir, "observation-to-edge-projection-contract.json");

test("proof summary consumer readback gives Spine and Edge a lower-rung saved-artifact view", async () => {
  const readback = buildEdgeLayerSeamHistoryProofSummaryConsumerReadback({
    proofSummary: await readJson(proofSummaryPath),
    observationToEdgeContract: await readJson(edgeContractPath),
    emittedAt: "2026-06-01T18:50:00.000Z",
  });

  assertEdgeLayerSeamHistoryProofSummaryConsumerReadback(readback);
  assert.equal(readback.reviewStatus, "edge-layer-seam-history-proof-summary-consumer-readback-ready");
  assert.equal(
    readback.proof.strongestSourceProofRungObserved,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(
    readback.proof.consumerReadbackOperationProofRung,
    "local_consumer_readback_over_saved_edge_layer_seam_history_proof_summary",
  );
  assert.equal(readback.proof.liveSwarmRunClaimedByThisReadback, false);
  assert.equal(readback.proof.proofRungUpgradeClaimed, false);
  assert.equal(readback.consumerReadback.spineMayConsumeAsFamilyPressureSignal, true);
  assert.equal(readback.consumerReadback.edgeMayConsumeAsObservationOnlyProjectionContext, true);
  assert.equal(readback.consumerReadback.savedArtifactReadbackOnly, true);
  assert.equal(readback.consumerReadback.doesNotUpgradeSavedImports, true);
  assert.equal(readback.validation.summaryOperationLowerProof, true);
  assert.equal(readback.validation.sourceProofLabelsPreserved, true);
  assert.equal(readback.validation.sourceRefsPreservedWhenPresent, true);
  assert.deepEqual(readback.validation.issues, []);
  assert.equal(readback.preservedRefs.requestIds.length, 2);
  assert.equal(readback.preservedRefs.receiptHashes.length, 2);
  assert.equal(readback.boundary.readsSavedArtifactsOnly, true);
  assert.equal(readback.boundary.opensSwarm, false);
  assert.equal(readback.boundary.callsEdge, false);
  assert.equal(readback.boundary.writesEdgeProjection, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
});

test("proof summary consumer readback CLI writes Spine and Edge readback", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-proof-summary-consumer-readback-"));
  const outputPath = path.join(tempRoot, "consumer-readback.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/readback-edge-layer-seam-history-proof-summary-for-consumers.ts",
      "--proof-summary",
      proofSummaryPath,
      "--observation-to-edge-contract",
      edgeContractPath,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-01T18:50:30.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const readback = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryProofSummaryConsumerReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-proof-summary-consumer-readback-ready");
    assert.equal(readback.validation.noLiveSwarmClaimByThisReadback, true);
    assert.equal(readback.validation.noEdgeProjectionWriteClaim, true);
    assert.equal(readback.boundary.opensCorestore, false);
    assert.equal(readback.boundary.publishesToMesh, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
