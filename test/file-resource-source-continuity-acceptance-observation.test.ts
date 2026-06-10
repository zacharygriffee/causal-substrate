import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  assertFileResourceSourceContinuityAcceptanceObservation,
  buildFileResourceSourceContinuityAcceptanceObservation,
} from "../src/adapters/file-resource-source-continuity-acceptance-observation.js";

const layerAppend = JSON.parse(readFileSync(
  new URL("../../mesh-ecology-layer/proof-artifacts/layer-file-resource-source-continuity-acceptance-append-20260610T082000Z/append.json", import.meta.url),
  "utf8"
));
const layerAppendReadback = JSON.parse(readFileSync(
  new URL("../../mesh-ecology-layer/proof-artifacts/layer-file-resource-source-continuity-acceptance-append-20260610T082000Z/readback.json", import.meta.url),
  "utf8"
));

test("observes Layer source-continuity acceptance append as compatible without authority", () => {
  const observation = buildFileResourceSourceContinuityAcceptanceObservation({
    layerAppend,
    layerAppendReadback,
    emittedAt: "2026-06-10T08:25:00.000Z",
  });

  assert.equal(observation.artifactKind, "causal_file_resource_source_continuity_acceptance_observation");
  assert.equal(observation.status, "file-resource-source-continuity-acceptance-compatible");
  assert.equal(observation.interpretation.layerAcceptedSourceContinuityObserved, true);
  assert.equal(observation.interpretation.acceptedOnlyForLayerScope, true);
  assert.equal(observation.interpretation.causalCompatibilityObserved, true);
  assert.equal(observation.validation.layerAppendHashVerified, true);
  assert.equal(observation.validation.acceptedSourceContinuityVisible, true);
  assert.deepEqual(observation.validation.issues, []);
  assert.equal(observation.nonClaims.causalTruth, false);
  assert.equal(observation.nonClaims.globalCanon, false);
  assert.equal(observation.nonClaims.authority, false);
  assert.equal(observation.nonClaims.productionDurability, false);

  assertFileResourceSourceContinuityAcceptanceObservation(observation);
});

test("blocks damaged source-continuity acceptance append observation", () => {
  const damagedAppend = structuredClone(layerAppend);
  damagedAppend.nonClaims.authority = true;
  damagedAppend.acceptedSourceContinuity.acceptedForLayerScopeOnly = false;
  const observation = buildFileResourceSourceContinuityAcceptanceObservation({
    layerAppend: damagedAppend,
    layerAppendReadback,
    emittedAt: "2026-06-10T08:25:00.000Z",
  });

  assert.equal(observation.status, "file-resource-source-continuity-acceptance-blocked");
  assert.ok(observation.validation.issues.includes("source_continuity_not_layer_scope_only"));
  assert.ok(observation.validation.issues.includes("append_claims_authority"));
});

test("CLI emits source-continuity acceptance observation", () => {
  const result = spawnSync("npx", [
    "tsx",
    "scripts/observe-file-resource-source-continuity-acceptance.ts",
    "--layer-append",
    "../mesh-ecology-layer/proof-artifacts/layer-file-resource-source-continuity-acceptance-append-20260610T082000Z/append.json",
    "--layer-append-readback",
    "../mesh-ecology-layer/proof-artifacts/layer-file-resource-source-continuity-acceptance-append-20260610T082000Z/readback.json",
    "--output",
    ".tmp/test-file-resource-source-continuity-acceptance-observation/observation.json",
    "--emitted-at",
    "2026-06-10T08:25:00.000Z"
  ], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.commandStatus, "causal_file_resource_source_continuity_acceptance_observation_emitted");
  assert.equal(output.status, "file-resource-source-continuity-acceptance-compatible");
});
