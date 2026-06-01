import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryPublicRefreshInputPackage,
  buildEdgeLayerSeamHistoryPublicRefreshInputPackage,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const publicDeviceRunDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-2026-06-01");
const commandPath = path.join(publicDeviceRunDir, "operator-selected-public-refresh-command.json");
const seamHistoryInputPath = path.join(publicDeviceRunDir, "seam-history-input.json");
const refreshOutputDir = "proof-artifacts/public-hyperswarm-device-to-device-operator-refresh";

test("public refresh input package preserves seam-history input as local supplied material", async () => {
  const inputBytes = await readFile(seamHistoryInputPath, "utf8");
  const manifest = buildEdgeLayerSeamHistoryPublicRefreshInputPackage({
    operatorPublicRefreshCommand: await readJson(commandPath),
    seamHistoryInput: JSON.parse(inputBytes),
    seamHistoryInputBytes: inputBytes,
    emittedAt: "2026-06-01T20:05:00.000Z",
    outputPaths: {
      refreshOutputDir,
      refreshSeamHistoryInput: `${refreshOutputDir}/seam-history-input.json`,
      packageManifest: `${refreshOutputDir}/public-refresh-input-package.json`,
    },
  });

  assertEdgeLayerSeamHistoryPublicRefreshInputPackage(manifest);
  assert.equal(manifest.reviewStatus, "edge-layer-seam-history-public-refresh-input-package-ready");
  assert.equal(manifest.packageOperation.packagesInputOnly, true);
  assert.equal(manifest.packageOperation.copiesCurrentSeamHistoryMaterial, true);
  assert.equal(manifest.packageOperation.localSuppliedInputUntilPublicReaderConsumes, true);
  assert.equal(manifest.packageOperation.publicRefreshRunByThisPackage, false);
  assert.equal(manifest.validation.commandArtifactReady, true);
  assert.equal(manifest.validation.commandArtifactInstructionsOnly, true);
  assert.equal(manifest.validation.refreshOutputDirMatchesCommand, true);
  assert.equal(manifest.validation.refreshInputPathMatchesCommand, true);
  assert.equal(manifest.validation.seamHistoryInputPresent, true);
  assert.equal(manifest.validation.linkedPairPresent, true);
  assert.equal(manifest.validation.damagedOrUnlinkedPairPresent, true);
  assert.equal(manifest.validation.sourceRefsPreserved, true);
  assert.equal(manifest.packagedMaterial.linkedPairCount, 1);
  assert.equal(manifest.packagedMaterial.damagedOrUnlinkedPairCount, 1);
  assert.equal(manifest.sourceRefs.requestIds.length, 2);
  assert.equal(manifest.sourceRefs.requestHashes.length, 2);
  assert.equal(manifest.sourceRefs.receiptIds.length, 2);
  assert.equal(manifest.sourceRefs.receiptHashes.length, 2);
  assert.equal(
    manifest.proof.packageOperationProofRung,
    "local_refresh_input_package_over_saved_public_hyperswarm_material",
  );
  assert.equal(manifest.proof.localSuppliedInputUntilPublicReaderConsumes, true);
  assert.equal(manifest.proof.liveSwarmRunClaimedByThisPackage, false);
  assert.equal(manifest.proof.publicRefreshExecutedByThisPackage, false);
  assert.equal(manifest.proof.proofRungUpgradeClaimed, false);
  assert.equal(manifest.boundary.opensSwarm, false);
  assert.equal(manifest.boundary.opensCorestore, false);
  assert.equal(manifest.boundary.runsPublicRefresh, false);
  assert.equal(manifest.boundary.callsEdge, false);
  assert.equal(manifest.boundary.callsLayer, false);
  assert.equal(manifest.boundary.writesEdgeProjection, false);
  assert.equal(manifest.boundary.interpretsRbc, false);
  assert.equal(manifest.boundary.grantsAuthority, false);
  assert.deepEqual(manifest.validation.issues, []);
});

test("public refresh input package rejects mismatched refresh input path", async () => {
  const inputBytes = await readFile(seamHistoryInputPath, "utf8");
  const manifest = buildEdgeLayerSeamHistoryPublicRefreshInputPackage({
    operatorPublicRefreshCommand: await readJson(commandPath),
    seamHistoryInput: JSON.parse(inputBytes),
    seamHistoryInputBytes: inputBytes,
    emittedAt: "2026-06-01T20:05:30.000Z",
    outputPaths: {
      refreshOutputDir,
      refreshSeamHistoryInput: `${refreshOutputDir}/wrong-input.json`,
      packageManifest: `${refreshOutputDir}/public-refresh-input-package.json`,
    },
  });

  assertEdgeLayerSeamHistoryPublicRefreshInputPackage(manifest);
  assert.equal(manifest.reviewStatus, "edge-layer-seam-history-public-refresh-input-package-incomplete");
  assert.equal(manifest.proof.liveSwarmRunClaimedByThisPackage, false);
  assert.equal(manifest.boundary.runsPublicRefresh, false);
  assert.ok(manifest.validation.issues.includes("refresh-input-path-does-not-match-command"));
});

test("public refresh input package CLI writes expected input and manifest", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-public-refresh-input-package-"));
  const outputDir = path.join(tempRoot, "public-hyperswarm-device-to-device-operator-refresh");
  const tempCommandPath = path.join(tempRoot, "operator-selected-public-refresh-command.json");
  const outputInputPath = path.join(outputDir, "seam-history-input.json");
  const manifestPath = path.join(outputDir, "public-refresh-input-package.json");
  try {
    const command = await readJson(commandPath) as any;
    command.commandPlan.outputDir = outputDir;
    command.expectedOutputs[0] = outputInputPath;
    await writeFile(tempCommandPath, `${JSON.stringify(command, null, 2)}\n`, "utf8");

    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/package-edge-layer-seam-history-public-refresh-input.ts",
      "--command",
      tempCommandPath,
      "--input",
      seamHistoryInputPath,
      "--manifest-output",
      manifestPath,
      "--emitted-at",
      "2026-06-01T20:06:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    assert.deepEqual(JSON.parse(await readFile(outputInputPath, "utf8")), await readJson(seamHistoryInputPath));
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    assertEdgeLayerSeamHistoryPublicRefreshInputPackage(manifest);
    assert.equal(manifest.reviewStatus, "edge-layer-seam-history-public-refresh-input-package-ready");
    assert.equal(manifest.validation.noLiveSwarmClaimByThisPackage, true);
    assert.equal(manifest.boundary.publishesToMesh, false);
    assert.equal(manifest.boundary.writesProductionContinuity, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
