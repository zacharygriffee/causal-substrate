import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  assertFileResourceLiftDecisionCompatibilityObservation,
  buildFileResourceLiftDecisionCompatibilityObservation,
} from "../src/adapters/file-resource-lift-decision-compatibility-observation.js";

const layerReview = JSON.parse(readFileSync(
  new URL("../../mesh-ecology-layer/proof-artifacts/layer-file-resource-lift-decision-boundary-review-20260609T142000Z/review.json", import.meta.url),
  "utf8",
)) as unknown;
const layerReadback = JSON.parse(readFileSync(
  new URL("../../mesh-ecology-layer/proof-artifacts/layer-file-resource-lift-decision-boundary-review-20260609T142000Z/readback.json", import.meta.url),
  "utf8",
)) as unknown;

test("observes ready Layer file/resource lift decision boundary as compatibility question", () => {
  const observation = buildFileResourceLiftDecisionCompatibilityObservation({
    layerDecisionBoundaryReview: layerReview,
    layerDecisionBoundaryReviewReadback: layerReadback,
    emittedAt: "2026-06-09T14:30:00.000Z",
  });

  assert.equal(observation.artifactKind, "causal_file_resource_lift_decision_compatibility_observation");
  assert.equal(observation.status, "file-resource-lift-compatibility-question-ready");
  assert.equal(observation.classification, "compatibility_question_ready");
  assert.equal(observation.interpretation.concreteCompatibilityQuestionExists, true);
  assert.equal(observation.interpretation.sourceContinuityQuestionPreserved, true);
  assert.equal(observation.interpretation.viewsDoNotReplaceSourceContinuity, true);
  assert.equal(observation.boundary.appendsCausalContinuity, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.nonClaims.layerAdmission, false);
  assert.equal(observation.nonClaims.acceptedContinuity, false);
  assert.equal(observation.nonClaims.causalTruth, false);
  assert.equal(observation.nonClaims.viewAsSourceContinuity, false);
  assertFileResourceLiftDecisionCompatibilityObservation(observation);
});

test("observes held Layer decision boundary without creating compatibility question", () => {
  const heldReview = structuredClone(layerReview) as Record<string, unknown>;
  heldReview.classification = "held_by_operator";
  const observation = buildFileResourceLiftDecisionCompatibilityObservation({
    layerDecisionBoundaryReview: heldReview,
    layerDecisionBoundaryReviewReadback: layerReadback,
    emittedAt: "2026-06-09T14:30:00.000Z",
  });

  assert.equal(observation.status, "file-resource-lift-compatibility-held");
  assert.equal(observation.interpretation.concreteCompatibilityQuestionExists, false);
});

test("blocks Layer review overclaims before compatibility question", () => {
  const damagedReview = structuredClone(layerReview) as Record<string, unknown>;
  damagedReview.nonClaims = {
    ...damagedReview.nonClaims as Record<string, unknown>,
    viewAsSourceContinuity: true,
  };
  const observation = buildFileResourceLiftDecisionCompatibilityObservation({
    layerDecisionBoundaryReview: damagedReview,
    layerDecisionBoundaryReviewReadback: layerReadback,
    emittedAt: "2026-06-09T14:30:00.000Z",
  });

  assert.equal(observation.status, "file-resource-lift-compatibility-blocked");
  assert.ok(observation.validation.issues.includes("layer-review-non-claim-viewAsSourceContinuity-overclaim"));
  assert.equal(observation.nonClaims.authority, false);
});
