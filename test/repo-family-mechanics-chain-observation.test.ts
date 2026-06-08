import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  buildRepoFamilyMechanicsChainObservation,
  buildRepoFamilyMechanicsChainReadback,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(".");

test("observes real repo-family Layer activation mechanics chain as compatible supplied material", async () => {
  const observation = buildRepoFamilyMechanicsChainObservation({
    ...(await inputs()),
    emittedAt: "2026-06-08T17:00:00.000Z",
  });
  const readback = buildRepoFamilyMechanicsChainReadback(observation, "2026-06-08T17:00:01.000Z");

  assert.equal(observation.classification, "compatible");
  assert.equal(observation.proof.operationProofRung, "local_supplied_material");
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.equal(observation.chainFit.packsLayerTarget, true);
  assert.equal(observation.chainFit.platformActivatedLayerTarget, true);
  assert.equal(observation.chainFit.layerVerifiedStatusRefs, true);
  assert.equal(observation.chainFit.edgeProjectedVisibility, true);
  assert.ok(observation.preservedRefs.packsRefs.includes("packs-installable-participation-bundle:3d5fcff10259d8ef"));
  assert.ok(observation.preservedRefs.platformRefs.includes("platform-installable-bundle-human-approved-activation:926a6d33ea94922a"));
  assert.ok(observation.preservedRefs.layerRefs.includes("layer-platform-hosted-status-review:9328b73ee7e99c73"));
  assert.ok(observation.preservedRefs.edgeRefs.includes("edge-platform-installable-bundle-activation-public-status-review:45c97d565581712c"));
  assert.equal(observation.boundary.opensSwarm, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.interpretsRbc, false);
  assert.equal(observation.nonClaims.authority, false);
  assert.equal(readback.readbackStatus, "repo-family-mechanics-chain-observation-readback-verified");
});

test("repo-family mechanics observation rejects authority overclaims", async () => {
  const source = await inputs();
  const edgeVisibilityReview = JSON.parse(JSON.stringify(source.edgeVisibilityReview));
  edgeVisibilityReview.nonClaims.authority = true;
  const observation = buildRepoFamilyMechanicsChainObservation({
    ...source,
    edgeVisibilityReview,
    emittedAt: "2026-06-08T17:00:00.000Z",
  });

  assert.equal(observation.classification, "damaged");
  assert.ok(observation.validation.issues.includes("edge_review_nonClaims_authority_overclaim"));
  assert.equal(observation.proof.proofRungUpgradeClaimed, false);
});

test("repo-family mechanics chain CLI writes observation and readback", async () => {
  const tmp = await mkdtemp(path.join(tmpdir(), "causal-repo-family-mechanics-"));
  try {
    const { stdout } = await execFileAsync("npm", [
      "run",
      "observe:repo-family-mechanics-chain",
      "--",
      "--packs-proof",
      "../mesh-ecology-packs/proof-artifacts/layer-installable-participation-bundle-20260608T150000Z/proof.json",
      "--bytes-proof",
      "../mesh-ecology-bytes/proof-artifacts/layer-installable-bundle-public-seeder-20260608T153000Z/proof.json",
      "--conduit-proof",
      "../conduit/proof-artifacts/layer-installable-bundle-retained-distribution-20260608T153500Z/proof.json",
      "--platform-activation-proof",
      "../mesh-ecology-platform/proof-artifacts/layer-installable-bundle-human-approved-activation-20260608T161000Z/proof.json",
      "--platform-public-status-proof",
      "../mesh-ecology-platform/proof-artifacts/layer-installable-bundle-activation-public-status-20260608T163000Z/proof.json",
      "--layer-status-review",
      "../mesh-ecology-layer/proof-artifacts/layer-platform-hosted-status-review-20260608T164000Z/review.json",
      "--edge-visibility-review",
      "../mesh-ecology-edge/proof-artifacts/layer-installable-bundle-activation-public-status-review-20260608T165000Z/edge-layer-installable-bundle-activation-public-status-review.json",
      "--output",
      path.join(tmp, "observation.json"),
      "--readback-output",
      path.join(tmp, "readback.json"),
      "--emitted-at",
      "2026-06-08T17:00:00.000Z",
      "--read-at",
      "2026-06-08T17:00:01.000Z",
    ], { cwd: repoRoot });
    const commandResult = JSON.parse(stdout.slice(stdout.indexOf("{")));
    const observation = JSON.parse(await readFile(path.join(tmp, "observation.json"), "utf8"));
    const readback = JSON.parse(await readFile(path.join(tmp, "readback.json"), "utf8"));

    assert.equal(commandResult.classification, "compatible");
    assert.equal(observation.classification, "compatible");
    assert.equal(readback.readbackStatus, "repo-family-mechanics-chain-observation-readback-verified");
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

async function inputs() {
  return {
    packsProof: await readJson("../mesh-ecology-packs/proof-artifacts/layer-installable-participation-bundle-20260608T150000Z/proof.json"),
    bytesProof: await readJson("../mesh-ecology-bytes/proof-artifacts/layer-installable-bundle-public-seeder-20260608T153000Z/proof.json"),
    conduitProof: await readJson("../conduit/proof-artifacts/layer-installable-bundle-retained-distribution-20260608T153500Z/proof.json"),
    platformActivationProof: await readJson("../mesh-ecology-platform/proof-artifacts/layer-installable-bundle-human-approved-activation-20260608T161000Z/proof.json"),
    platformPublicStatusProof: await readJson("../mesh-ecology-platform/proof-artifacts/layer-installable-bundle-activation-public-status-20260608T163000Z/proof.json"),
    layerStatusReview: await readJson("../mesh-ecology-layer/proof-artifacts/layer-platform-hosted-status-review-20260608T164000Z/review.json"),
    edgeVisibilityReview: await readJson("../mesh-ecology-edge/proof-artifacts/layer-installable-bundle-activation-public-status-review-20260608T165000Z/edge-layer-installable-bundle-activation-public-status-review.json"),
  };
}

async function readJson(relativePath: string): Promise<unknown> {
  return JSON.parse(await readFile(path.resolve(repoRoot, relativePath), "utf8")) as unknown;
}
