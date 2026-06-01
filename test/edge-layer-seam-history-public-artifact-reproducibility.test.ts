import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryPublicArtifactReproducibility,
  buildEdgeLayerSeamHistoryPublicArtifactReproducibility,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

test("public artifact reproducibility check validates preserved device-to-device public run", async () => {
  const runDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-2026-06-01");
  const artifacts = {
    replicaReport: await readJson(path.join(runDir, "public-replica-reader-report.json")),
    replicaReportReadback: await readJson(path.join(runDir, "public-replica-reader-report-readback.json")),
    handoffBundle: await readJson(path.join(runDir, "edge-projection-handoff-bundle.json")),
    handoffReadback: await readJson(path.join(runDir, "edge-projection-handoff-bundle-readback.json")),
    proofSummary: await readJson(path.join(runDir, "edge-layer-seam-history-proof-summary.json")),
  };

  const check = buildEdgeLayerSeamHistoryPublicArtifactReproducibility({
    runId: "public-hyperswarm-device-to-device-2026-06-01",
    runKind: "device_to_device_public_hyperswarm",
    artifacts,
    sourcePaths: Object.keys(artifacts),
    emittedAt: "2026-06-01T18:11:00.000Z",
  });

  assertEdgeLayerSeamHistoryPublicArtifactReproducibility(check);
  assert.equal(check.reviewStatus, "edge-layer-seam-history-public-artifacts-reproducible");
  assert.equal(
    check.proof.strongestSourceProofRungObserved,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(
    check.proof.reproducibilityOperationProofRung,
    "local_reproducibility_check_over_saved_public_hyperswarm_artifacts",
  );
  assert.equal(check.proof.liveSwarmRunClaimedByThisCheck, false);
  assert.equal(check.proof.proofRungUpgradeClaimed, false);
  assert.equal(check.validation.linkedPairDetected, true);
  assert.equal(check.validation.damagedOrUnlinkedPairDetected, true);
  assert.equal(check.validation.sourceRefsPreserved, true);
  assert.equal(check.validation.publicProofLabelsPreserved, true);
  assert.equal(check.preservedRefs.requestIds.length, 2);
  assert.equal(check.preservedRefs.requestHashes.length, 2);
  assert.equal(check.preservedRefs.receiptIds.length, 2);
  assert.equal(check.preservedRefs.receiptHashes.length, 2);
  assert.deepEqual(check.validation.issues, []);
  assert.equal(check.boundary.readsSavedArtifactsOnly, true);
  assert.equal(check.boundary.opensSwarm, false);
  assert.equal(check.boundary.opensCorestore, false);
  assert.equal(check.boundary.writesEdgeProjection, false);
  assert.equal(check.boundary.admitsLayerEvidence, false);
  assert.equal(check.boundary.interpretsRbc, false);
  assert.equal(check.boundary.grantsAuthority, false);
  assert.equal(check.boundary.publishesToMesh, false);
  assert.equal(check.boundary.writesProductionContinuity, false);
});

test("public artifact reproducibility CLI writes local checks for preserved public runs", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-public-artifact-reproducibility-"));
  const singleOutput = path.join(tempRoot, "single-machine-check.json");
  const deviceOutput = path.join(tempRoot, "device-check.json");
  try {
    for (const [runDir, output] of [
      ["proof-artifacts/public-hyperswarm-single-machine-2026-06-01", singleOutput],
      ["proof-artifacts/public-hyperswarm-device-to-device-2026-06-01", deviceOutput],
    ] as const) {
      const { stdout, stderr } = await execFileAsync("npx", [
        "tsx",
        "scripts/check-edge-layer-seam-history-public-artifacts.ts",
        "--run-dir",
        runDir,
        "--output",
        output,
        "--emitted-at",
        "2026-06-01T18:11:30.000Z",
      ], {
        cwd: path.resolve("."),
      });

      assert.equal(stdout, "");
      assert.equal(stderr, "");
      const check = JSON.parse(await readFile(output, "utf8"));
      assertEdgeLayerSeamHistoryPublicArtifactReproducibility(check);
      assert.equal(check.reviewStatus, "edge-layer-seam-history-public-artifacts-reproducible");
      assert.equal(check.validation.reportReadbackValid, true);
      assert.equal(check.validation.handoffBundleReady, true);
      assert.equal(check.validation.handoffReadbackValid, true);
      assert.equal(check.validation.proofSummaryReady, true);
      assert.equal(check.validation.noLiveSwarmClaimByThisCheck, true);
      assert.equal(check.proof.savedArtifactCheckOnly, true);
      assert.equal(check.boundary.readsSavedArtifactsOnly, true);
      assert.equal(check.boundary.opensSwarm, false);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
