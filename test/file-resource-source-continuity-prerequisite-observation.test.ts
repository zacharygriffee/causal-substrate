import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  assertFileResourceSourceContinuityPrerequisiteObservation,
  buildFileResourceSourceContinuityPrerequisiteObservation,
} from "../src/adapters/file-resource-source-continuity-prerequisite-observation.js";

const layerPrerequisitePacket = JSON.parse(readFileSync(
  new URL("../../mesh-ecology-layer/proof-artifacts/layer-file-resource-source-continuity-prerequisite-packet-20260609T161000Z/packet.json", import.meta.url),
  "utf8",
)) as unknown;
const layerPrerequisiteReadback = JSON.parse(readFileSync(
  new URL("../../mesh-ecology-layer/proof-artifacts/layer-file-resource-source-continuity-prerequisite-packet-20260609T161000Z/readback.json", import.meta.url),
  "utf8",
)) as unknown;
const edgePrerequisiteVisibility = JSON.parse(readFileSync(
  new URL("../../mesh-ecology-edge/proof-artifacts/file-resource-source-continuity-prerequisite-visibility-20260609T162000Z/visibility.json", import.meta.url),
  "utf8",
)) as unknown;

test("observes Layer file/resource source-continuity prerequisite without admission or append", () => {
  const observation = buildFileResourceSourceContinuityPrerequisiteObservation({
    layerPrerequisitePacket,
    layerPrerequisiteReadback,
    edgePrerequisiteVisibility,
    emittedAt: "2026-06-09T16:30:00.000Z",
  });

  assert.equal(observation.artifactKind, "causal_file_resource_source_continuity_prerequisite_observation");
  assert.equal(observation.status, "file-resource-source-continuity-prerequisite-observed");
  assert.equal(observation.classification, "source_continuity_prerequisite_question_ready");
  assert.equal(observation.sourceRefs.layerPrerequisitePacketRef, "layer-file-resource-source-continuity-prerequisite-packet:23f837e658c7878f");
  assert.equal(observation.sourceRefs.edgePrerequisiteVisibilityRef, "edge-file-resource-source-continuity-prerequisite-visibility:e5e4c71d6f76d781");
  assert.equal(observation.sourceRefs.causalCompatibilityObservationRef, "causal-file-resource-lift-decision-compatibility:dfb1bc7e2c17a35d");
  assert.equal(observation.interpretation.concreteSourceContinuityPrerequisiteObserved, true);
  assert.equal(observation.interpretation.sourceContinuityQuestionPreserved, true);
  assert.equal(observation.interpretation.viewsDoNotReplaceSourceContinuity, true);
  assert.equal(observation.interpretation.acceptedSourceContinuityNotCreated, true);
  assert.equal(observation.boundary.appendsCausalContinuity, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.acceptsSourceContinuity, false);
  assert.equal(observation.nonClaims.layerAdmission, false);
  assert.equal(observation.nonClaims.acceptedSourceContinuity, false);
  assert.equal(observation.nonClaims.causalContinuityAppend, false);
  assert.equal(observation.nonClaims.canonicalHistory, false);
  assert.equal(observation.nonClaims.causalTruth, false);
  assert.equal(observation.nonClaims.viewAsSourceContinuity, false);
  assert.deepEqual(observation.validation.issues, []);
  assertFileResourceSourceContinuityPrerequisiteObservation(observation);
});

test("blocks damaged source-continuity prerequisite material", () => {
  const damagedPacket = structuredClone(layerPrerequisitePacket) as Record<string, unknown>;
  damagedPacket.sourceContinuityPrerequisite = {
    ...damagedPacket.sourceContinuityPrerequisite as Record<string, unknown>,
    acceptedSourceContinuityCreated: true,
  };
  const observation = buildFileResourceSourceContinuityPrerequisiteObservation({
    layerPrerequisitePacket: damagedPacket,
    layerPrerequisiteReadback,
    edgePrerequisiteVisibility,
    emittedAt: "2026-06-09T16:30:00.000Z",
  });

  assert.equal(observation.status, "file-resource-source-continuity-prerequisite-blocked");
  assert.equal(observation.interpretation.concreteSourceContinuityPrerequisiteObserved, false);
  assert.ok(observation.validation.issues.includes("accepted-source-continuity-created-overclaim"));
  assert.equal(observation.nonClaims.acceptedSourceContinuity, false);
  assert.equal(observation.boundary.acceptsSourceContinuity, false);
});

test("assertion rejects Causal observation overclaims", () => {
  const observation = buildFileResourceSourceContinuityPrerequisiteObservation({
    layerPrerequisitePacket,
    layerPrerequisiteReadback,
    edgePrerequisiteVisibility,
    emittedAt: "2026-06-09T16:30:00.000Z",
  });
  const overclaim = {
    ...observation,
    nonClaims: {
      ...observation.nonClaims,
      causalTruth: true,
    },
  };

  assert.throws(
    () => assertFileResourceSourceContinuityPrerequisiteObservation(overclaim),
    /nonClaims.causalTruth must be false/,
  );
});
