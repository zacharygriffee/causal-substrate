import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryObservationToEdgeProjectionContract,
  buildEdgeLayerSeamHistoryObservationToEdgeProjectionContract,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

const publicDeviceRunDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-2026-06-01");
const edgeReceiptPath = path.resolve(
  "../mesh-ecology-edge/proof-artifacts/causal-substrate-public-device-handoff-2026-06-01/edge-causal-seam-handoff-projection-input-receipt.json",
);

test("observation to Edge projection contract preserves source refs and observation-only Edge receipt", async () => {
  const contract = buildEdgeLayerSeamHistoryObservationToEdgeProjectionContract({
    reproducibilityCheck: await readJson(path.join(publicDeviceRunDir, "public-artifact-reproducibility-check.json")),
    handoffBundle: await readJson(path.join(publicDeviceRunDir, "edge-projection-handoff-bundle.json")),
    edgeReceipt: await readJson(edgeReceiptPath),
    emittedAt: "2026-06-01T18:36:00.000Z",
    sourcePaths: {
      publicRunDir: publicDeviceRunDir,
      edgeReceipt: edgeReceiptPath,
    },
  });

  assertEdgeLayerSeamHistoryObservationToEdgeProjectionContract(contract);
  assert.equal(contract.reviewStatus, "edge-layer-seam-history-observation-to-edge-projection-contract-ready");
  assert.equal(
    contract.proof.strongestSourceProofRungObserved,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(
    contract.proof.contractOperationProofRung,
    "local_contract_check_over_saved_causal_handoff_and_edge_receipt",
  );
  assert.equal(contract.proof.liveSwarmRunClaimedByThisContract, false);
  assert.equal(contract.proof.edgeProjectionWriteClaimed, false);
  assert.equal(contract.proof.proofRungUpgradeClaimed, false);
  assert.equal(contract.validation.reproducibilityCheckReady, true);
  assert.equal(contract.validation.handoffBundleReady, true);
  assert.equal(contract.validation.edgeReceiptAccepted, true);
  assert.equal(contract.validation.edgeConsumedCausalHandoff, true);
  assert.equal(contract.validation.edgeAcceptedObservationOnlyProjectionInput, true);
  assert.equal(contract.validation.sourceRefsMatchBetweenCausalAndEdge, true);
  assert.equal(contract.validation.sourceIdsAndHashesPreserved, true);
  assert.equal(contract.validation.proofLabelsPreserved, true);
  assert.equal(contract.validation.publicSourceProofRungPreserved, true);
  assert.deepEqual(contract.validation.issues, []);
  assert.equal(contract.preservedRefs.requestIds.length, 2);
  assert.equal(contract.preservedRefs.requestHashes.length, 2);
  assert.equal(contract.preservedRefs.receiptIds.length, 2);
  assert.equal(contract.preservedRefs.receiptHashes.length, 2);
  assert.equal(contract.boundary.readsSavedArtifactsOnly, true);
  assert.equal(contract.boundary.opensEdgeRuntime, false);
  assert.equal(contract.boundary.opensSwarm, false);
  assert.equal(contract.boundary.writesEdgeProjection, false);
  assert.equal(contract.boundary.admitsLayerEvidence, false);
  assert.equal(contract.boundary.interpretsRbc, false);
  assert.equal(contract.boundary.grantsAuthority, false);
});

test("observation to Edge projection contract CLI writes saved-artifact contract", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-observation-to-edge-contract-"));
  const outputPath = path.join(tempRoot, "contract.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/derive-edge-layer-seam-history-observation-to-edge-projection-contract.ts",
      "--run-dir",
      publicDeviceRunDir,
      "--edge-receipt",
      edgeReceiptPath,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-01T18:36:30.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const contract = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryObservationToEdgeProjectionContract(contract);
    assert.equal(contract.reviewStatus, "edge-layer-seam-history-observation-to-edge-projection-contract-ready");
    assert.equal(contract.validation.sourceRefsMatchBetweenCausalAndEdge, true);
    assert.equal(contract.validation.noProjectionStateWrite, true);
    assert.equal(contract.validation.noLiveSwarmClaimByThisContract, true);
    assert.equal(contract.proof.savedArtifactCheckOnly, true);
    assert.equal(contract.boundary.opensSwarm, false);
    assert.equal(contract.boundary.writesEdgeState, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
