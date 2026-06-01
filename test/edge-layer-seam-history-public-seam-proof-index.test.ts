import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryPublicSeamProofIndex,
  buildEdgeLayerSeamHistoryPublicSeamProofIndex,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const publicDeviceRunDir = path.resolve("proof-artifacts/public-hyperswarm-device-to-device-2026-06-01");

test("public seam proof index points at saved public artifacts without upgrading proof", async () => {
  const artifacts = await readPublicDeviceArtifacts();
  const index = buildEdgeLayerSeamHistoryPublicSeamProofIndex({
    runId: "public-hyperswarm-device-to-device-2026-06-01",
    runKind: "device_to_device_public_hyperswarm",
    artifacts,
    artifactPointers: {
      publicRunDir: publicDeviceRunDir,
      sourceManifest: path.join(publicDeviceRunDir, "public-source-manifest.json"),
      replicaReaderReport: path.join(publicDeviceRunDir, "public-replica-reader-report.json"),
      reproducibilityCheck: path.join(publicDeviceRunDir, "public-artifact-reproducibility-check.json"),
      edgeHandoffBundle: path.join(publicDeviceRunDir, "edge-projection-handoff-bundle.json"),
      observationToEdgeContract: path.join(publicDeviceRunDir, "observation-to-edge-projection-contract.json"),
      proofSummaryConsumerReadback: path.join(publicDeviceRunDir, "proof-summary-consumer-readback.json"),
      publicSwarmRefreshDecision: path.join(publicDeviceRunDir, "public-swarm-refresh-decision.json"),
    },
    emittedAt: "2026-06-01T19:20:00.000Z",
  });

  assertEdgeLayerSeamHistoryPublicSeamProofIndex(index);
  assert.equal(index.reviewStatus, "edge-layer-seam-history-public-seam-proof-index-ready");
  assert.equal(index.indexOperation.duplicatesArtifactBodies, false);
  assert.equal(index.indexOperation.artifactPointersOnly, true);
  assert.equal(
    index.proof.strongestSourceProofRungObserved,
    "public_hyperswarm_replicated_durable_seam_history_observation",
  );
  assert.equal(
    index.proof.indexOperationProofRung,
    "local_index_over_saved_public_hyperswarm_seam_proof_artifacts",
  );
  assert.equal(index.proof.liveSwarmRunClaimedByThisIndex, false);
  assert.equal(index.proof.proofRungUpgradeClaimed, false);
  assert.equal(index.validation.requiredArtifactsPresent, true);
  assert.equal(index.validation.sourceRefsPreserved, true);
  assert.equal(index.validation.proofLabelsPreserved, true);
  assert.equal(index.validation.publicSourceProofRungPreserved, true);
  assert.deepEqual(index.validation.issues, []);
  assert.equal(index.indexedArtifacts.length, 7);
  assert.equal(index.preservedRefs.requestIds.length, 2);
  assert.equal(index.preservedRefs.requestHashes.length, 2);
  assert.equal(index.preservedRefs.receiptIds.length, 2);
  assert.equal(index.preservedRefs.receiptHashes.length, 2);
  assert.equal(index.consumerSuitability.edgeMayConsumeAsObservationOnlyIndex, true);
  assert.equal(index.consumerSuitability.layerMayConsumeAsObservationOnlyFeedbackIndex, true);
  assert.equal(index.consumerSuitability.spineMayConsumeAsFamilyPressureIndex, true);
  assert.equal(index.consumerSuitability.projectionStateWritten, false);
  assert.equal(index.consumerSuitability.layerEvidenceAdmitted, false);
  assert.equal(index.boundary.readsSavedArtifactsOnly, true);
  assert.equal(index.boundary.opensSwarm, false);
  assert.equal(index.boundary.opensCorestore, false);
  assert.equal(index.boundary.callsEdge, false);
  assert.equal(index.boundary.callsLayer, false);
  assert.equal(index.boundary.writesEdgeProjection, false);
  assert.equal(index.boundary.interpretsRbc, false);
  assert.equal(index.boundary.grantsAuthority, false);
});

test("public seam proof index CLI writes compact saved-artifact index", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-public-seam-proof-index-"));
  const outputPath = path.join(tempRoot, "public-seam-proof-index.json");
  try {
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/index-edge-layer-seam-history-public-proof.ts",
      "--run-dir",
      publicDeviceRunDir,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-01T19:20:30.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const index = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryPublicSeamProofIndex(index);
    assert.equal(index.reviewStatus, "edge-layer-seam-history-public-seam-proof-index-ready");
    assert.equal(index.validation.noLiveSwarmClaimByThisIndex, true);
    assert.equal(index.boundary.publishesToMesh, false);
    assert.equal(index.artifactPointers.publicRunDir, publicDeviceRunDir);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("public seam proof index rejects weakened refs proof labels and overclaims", async () => {
  const cases: Array<{
    name: string;
    mutate: (artifacts: Awaited<ReturnType<typeof readPublicDeviceArtifacts>>) => void;
    issue: string;
  }> = [
    {
      name: "missing source refs",
      mutate: (artifacts) => {
        const contract = artifacts.observationToEdgeContract as any;
        contract.validation.sourceRefsMatchBetweenCausalAndEdge = false;
        contract.preservedRefs.requestIds = [];
      },
      issue: "source-refs-not-preserved",
    },
    {
      name: "weakened proof label",
      mutate: (artifacts) => {
        const reproducibilityCheck = artifacts.reproducibilityCheck as any;
        reproducibilityCheck.proof.strongestSourceProofLabelObserved = "local_supplied_material";
      },
      issue: "proof-labels-not-preserved",
    },
    {
      name: "projection overclaim",
      mutate: (artifacts) => {
        const handoffBundle = artifacts.edgeHandoffBundle as any;
        handoffBundle.boundary.writesEdgeProjection = true;
      },
      issue: "indexed-artifact-overclaim",
    },
  ];

  for (const testCase of cases) {
    const artifacts = await readPublicDeviceArtifacts();
    testCase.mutate(artifacts);

    const index = buildEdgeLayerSeamHistoryPublicSeamProofIndex({
      runId: `public-hyperswarm-device-to-device-2026-06-01:${testCase.name}`,
      runKind: "device_to_device_public_hyperswarm",
      artifacts,
      emittedAt: "2026-06-01T19:24:00.000Z",
    });

    assertEdgeLayerSeamHistoryPublicSeamProofIndex(index);
    assert.equal(index.reviewStatus, "edge-layer-seam-history-public-seam-proof-index-incomplete");
    assert.equal(index.consumerSuitability.edgeMayConsumeAsObservationOnlyIndex, false);
    assert.equal(index.consumerSuitability.layerMayConsumeAsObservationOnlyFeedbackIndex, false);
    assert.equal(index.consumerSuitability.spineMayConsumeAsFamilyPressureIndex, false);
    assert.equal(index.proof.liveSwarmRunClaimedByThisIndex, false);
    assert.equal(index.boundary.opensSwarm, false);
    assert.equal(index.boundary.writesEdgeProjection, false);
    assert.ok(index.validation.issues.includes(testCase.issue), testCase.name);
  }
});

async function readPublicDeviceArtifacts(): Promise<Parameters<typeof buildEdgeLayerSeamHistoryPublicSeamProofIndex>[0]["artifacts"]> {
  return {
    sourceManifest: await readJson(path.join(publicDeviceRunDir, "public-source-manifest.json")),
    replicaReaderReport: await readJson(path.join(publicDeviceRunDir, "public-replica-reader-report.json")),
    reproducibilityCheck: await readJson(path.join(publicDeviceRunDir, "public-artifact-reproducibility-check.json")),
    edgeHandoffBundle: await readJson(path.join(publicDeviceRunDir, "edge-projection-handoff-bundle.json")),
    observationToEdgeContract: await readJson(path.join(publicDeviceRunDir, "observation-to-edge-projection-contract.json")),
    proofSummaryConsumerReadback: await readJson(path.join(publicDeviceRunDir, "proof-summary-consumer-readback.json")),
    publicSwarmRefreshDecision: await readJson(path.join(publicDeviceRunDir, "public-swarm-refresh-decision.json")),
  };
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}
