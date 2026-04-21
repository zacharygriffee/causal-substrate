import test from "node:test";
import assert from "node:assert/strict";

import { Substrate, assessContinuityPressure } from "../src/index.js";

function createSubstrate() {
  let tick = 0;
  return new Substrate({
    now: () => `2026-04-21T00:00:${String(tick++).padStart(2, "0")}Z`,
  });
}

test("phase-3: neutral loss of sight keeps a co-tracked ball continuing under high inertia", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "corridor-camera-basis",
    dimensions: ["position", "occlusion", "motion"],
  });
  const observer = substrate.createObserver({
    label: "corridor-camera",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "corridor-camera-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "rolling-ball-branch",
    basisId: basis.id,
  });
  const inertia = substrate.createInertiaModel({
    label: "slow-ball-inertia",
    strategy: "short occlusion should not break continuity",
  });
  const volatility = substrate.createVolatilityModel({
    label: "quiet-corridor-volatility",
    expectedRate: "low",
  });
  const ball = substrate.createReferent({
    label: "ball",
    anchor: "ball-anchor",
    branchId: referentBranch.id,
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: ball.id,
    strength: 0.9,
  });

  const assessment = assessContinuityPressure({
    inertia: "high",
    volatility: "low",
    basisReliability: "high",
    absenceKind: "neutral",
  });

  const estimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: referentBranch.id,
    continuity: assessment.suggestedContinuity,
    reasoning: assessment.reasoning,
    basedOnBindingIds: [binding.id],
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
    metadata: { negativeEvidence: assessment.negativeEvidence },
  });

  assert.equal(assessment.negativeEvidence, "neutral-absence");
  assert.equal(estimate.continuity, "continuing");
  assert.match(estimate.reasoning, /absence alone/);
});

test("phase-3: an expected missed re-encounter weakens ball continuity without forcing breakage", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "corner-camera-basis",
    dimensions: ["position", "trajectory"],
    partial: true,
  });
  const observer = substrate.createObserver({
    label: "corner-camera",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "corner-camera-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "hall-ball-branch",
    basisId: basis.id,
  });
  const inertia = substrate.createInertiaModel({
    label: "ordinary-ball-inertia",
    strategy: "expected return should matter, but a miss alone should not force breakage",
  });
  const volatility = substrate.createVolatilityModel({
    label: "busy-hall-volatility",
    expectedRate: "high",
  });
  const ball = substrate.createReferent({
    label: "ball",
    anchor: "hall-ball-anchor",
    branchId: referentBranch.id,
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: ball.id,
    strength: 0.6,
  });

  const assessment = assessContinuityPressure({
    inertia: "medium",
    volatility: "high",
    basisReliability: "partial",
    absenceKind: "expected-miss",
    missedExpectedEncounterCount: 2,
  });

  const estimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: referentBranch.id,
    continuity: assessment.suggestedContinuity,
    reasoning: assessment.reasoning,
    basedOnBindingIds: [binding.id],
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
    metadata: { negativeEvidence: assessment.negativeEvidence },
  });

  assert.equal(assessment.negativeEvidence, "weak-negative-evidence");
  assert.equal(estimate.continuity, "ambiguous");
  assert.match(estimate.reasoning, /does not justify breakage/);
});

test("phase-3: contradiction pressure breaks continuity when the basis is strong enough", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "stereo-camera-basis",
    dimensions: ["position", "shape", "collision"],
  });
  const observer = substrate.createObserver({
    label: "stereo-camera",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "stereo-camera-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "impact-ball-branch",
    basisId: basis.id,
  });
  const inertia = substrate.createInertiaModel({
    label: "fragile-ball-inertia",
    strategy: "continuity should break when contradictory impact evidence appears",
  });
  const volatility = substrate.createVolatilityModel({
    label: "impact-zone-volatility",
    expectedRate: "medium",
  });
  const ball = substrate.createReferent({
    label: "ball",
    anchor: "impact-ball-anchor",
    branchId: referentBranch.id,
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: ball.id,
    strength: 0.95,
  });

  const assessment = assessContinuityPressure({
    inertia: "medium",
    volatility: "medium",
    basisReliability: "high",
    absenceKind: "expected-miss",
    contradictionObserved: true,
  });

  const estimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: referentBranch.id,
    continuity: assessment.suggestedContinuity,
    reasoning: assessment.reasoning,
    basedOnBindingIds: [binding.id],
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
    metadata: { negativeEvidence: assessment.negativeEvidence },
  });

  assert.equal(assessment.negativeEvidence, "strong-negative-evidence");
  assert.equal(estimate.continuity, "broken");
  assert.match(estimate.reasoning, /contradictory evidence/);
});

test("phase-15: degraded reappearance keeps continuity ambiguous without forcing breakage", () => {
  const substrate = createSubstrate();
  const fullBasis = substrate.createBasis({
    label: "full-drone-basis",
    dimensions: ["shape", "trajectory", "marker-pattern"],
  });
  const degradedBasis = substrate.createBasis({
    label: "degraded-drone-basis",
    dimensions: ["shape", "trajectory"],
    partial: true,
  });
  const firstObserver = substrate.createObserver({
    label: "roof-camera",
    basisId: fullBasis.id,
  });
  const secondObserver = substrate.createObserver({
    label: "street-camera",
    basisId: degradedBasis.id,
  });
  const firstBranch = substrate.createBranch({
    role: "observer",
    label: "roof-camera-branch",
    basisId: fullBasis.id,
    observerId: firstObserver.id,
  });
  const secondBranch = substrate.createBranch({
    role: "observer",
    label: "street-camera-branch",
    basisId: degradedBasis.id,
    observerId: secondObserver.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "drone-branch",
    basisId: fullBasis.id,
  });
  const inertia = substrate.createInertiaModel({
    label: "drone-inertia",
    strategy: "reappearance after a short gap should remain plausible",
  });
  const volatility = substrate.createVolatilityModel({
    label: "urban-air-volatility",
    expectedRate: "medium",
  });
  const drone = substrate.createReferent({
    label: "drone",
    anchor: "drone-anchor",
    branchId: referentBranch.id,
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });
  const firstBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: firstBranch.id,
    referentBranchId: referentBranch.id,
    referentId: drone.id,
    strength: 0.92,
  });
  const secondBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: secondBranch.id,
    referentBranchId: referentBranch.id,
    referentId: drone.id,
    strength: 0.58,
  });

  const initialAssessment = assessContinuityPressure({
    inertia: "high",
    volatility: "medium",
    basisReliability: "high",
    absenceKind: "neutral",
  });
  const reappearanceAssessment = assessContinuityPressure({
    inertia: "medium",
    volatility: "high",
    basisReliability: "partial",
    absenceKind: "neutral",
  });

  const initialEstimate = substrate.createStateEstimate({
    referentId: drone.id,
    branchId: referentBranch.id,
    continuity: initialAssessment.suggestedContinuity,
    reasoning: initialAssessment.reasoning,
    basedOnBindingIds: [firstBinding.id],
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });
  const reappearanceEstimate = substrate.createStateEstimate({
    referentId: drone.id,
    branchId: referentBranch.id,
    continuity: reappearanceAssessment.suggestedContinuity,
    reasoning: `${reappearanceAssessment.reasoning}; degraded reappearance remains underdetermined`,
    basedOnBindingIds: [secondBinding.id],
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });

  assert.equal(initialEstimate.continuity, "continuing");
  assert.equal(reappearanceEstimate.continuity, "ambiguous");
  assert.match(reappearanceEstimate.reasoning, /underdetermined/);
});

test("phase-15: conflicting multi-observer persistence judgments can coexist without forced convergence", () => {
  const substrate = createSubstrate();
  const strongBasis = substrate.createBasis({
    label: "strong-ball-basis",
    dimensions: ["shape", "impact", "position"],
  });
  const weakBasis = substrate.createBasis({
    label: "weak-ball-basis",
    dimensions: ["position"],
    partial: true,
  });
  const observerA = substrate.createObserver({
    label: "stereo-rig",
    basisId: strongBasis.id,
  });
  const observerB = substrate.createObserver({
    label: "single-camera",
    basisId: weakBasis.id,
  });
  const branchA = substrate.createBranch({
    role: "observer",
    label: "stereo-rig-branch",
    basisId: strongBasis.id,
    observerId: observerA.id,
  });
  const branchB = substrate.createBranch({
    role: "observer",
    label: "single-camera-branch",
    basisId: weakBasis.id,
    observerId: observerB.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "shared-ball-branch",
    basisId: strongBasis.id,
  });
  const ball = substrate.createReferent({
    label: "shared-ball",
    anchor: "shared-ball-anchor",
    branchId: referentBranch.id,
  });
  const bindingA = substrate.createBinding({
    kind: "tracking",
    observerBranchId: branchA.id,
    referentBranchId: referentBranch.id,
    referentId: ball.id,
    strength: 0.96,
  });
  const bindingB = substrate.createBinding({
    kind: "tracking",
    observerBranchId: branchB.id,
    referentBranchId: referentBranch.id,
    referentId: ball.id,
    strength: 0.52,
  });

  const brokenAssessment = assessContinuityPressure({
    inertia: "medium",
    volatility: "medium",
    basisReliability: "high",
    absenceKind: "expected-miss",
    contradictionObserved: true,
  });
  const continuingAssessment = assessContinuityPressure({
    inertia: "high",
    volatility: "low",
    basisReliability: "low",
    absenceKind: "neutral",
  });

  const brokenEstimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: referentBranch.id,
    continuity: brokenAssessment.suggestedContinuity,
    reasoning: brokenAssessment.reasoning,
    basedOnBindingIds: [bindingA.id],
  });
  const continuingEstimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: referentBranch.id,
    continuity: continuingAssessment.suggestedContinuity,
    reasoning: continuingAssessment.reasoning,
    basedOnBindingIds: [bindingB.id],
  });

  assert.equal(brokenEstimate.continuity, "broken");
  assert.equal(continuingEstimate.continuity, "continuing");
  assert.notEqual(brokenEstimate.continuity, continuingEstimate.continuity);
});

test("phase-15: co-observed non-observer can diverge between continuing and ambiguous under different pressure", () => {
  const substrate = createSubstrate();
  const leftBasis = substrate.createBasis({
    label: "left-camera-basis",
    dimensions: ["position", "occlusion", "trajectory"],
  });
  const rightBasis = substrate.createBasis({
    label: "right-camera-basis",
    dimensions: ["position", "trajectory"],
    partial: true,
  });
  const leftObserver = substrate.createObserver({
    label: "left-camera",
    basisId: leftBasis.id,
  });
  const rightObserver = substrate.createObserver({
    label: "right-camera",
    basisId: rightBasis.id,
  });
  const leftBranch = substrate.createBranch({
    role: "observer",
    label: "left-camera-branch",
    basisId: leftBasis.id,
    observerId: leftObserver.id,
  });
  const rightBranch = substrate.createBranch({
    role: "observer",
    label: "right-camera-branch",
    basisId: rightBasis.id,
    observerId: rightObserver.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "co-observed-ball-branch",
    basisId: leftBasis.id,
  });
  const ball = substrate.createReferent({
    label: "ball",
    anchor: "co-observed-ball-anchor",
    branchId: referentBranch.id,
  });
  const leftBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: leftBranch.id,
    referentBranchId: referentBranch.id,
    referentId: ball.id,
    strength: 0.88,
  });
  const rightBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: rightBranch.id,
    referentBranchId: referentBranch.id,
    referentId: ball.id,
    strength: 0.63,
  });

  const leftAssessment = assessContinuityPressure({
    inertia: "high",
    volatility: "low",
    basisReliability: "high",
    absenceKind: "neutral",
  });
  const rightAssessment = assessContinuityPressure({
    inertia: "medium",
    volatility: "high",
    basisReliability: "partial",
    absenceKind: "expected-miss",
    missedExpectedEncounterCount: 1,
  });

  const leftEstimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: referentBranch.id,
    continuity: leftAssessment.suggestedContinuity,
    reasoning: leftAssessment.reasoning,
    basedOnBindingIds: [leftBinding.id],
  });
  const rightEstimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: referentBranch.id,
    continuity: rightAssessment.suggestedContinuity,
    reasoning: rightAssessment.reasoning,
    basedOnBindingIds: [rightBinding.id],
  });

  assert.equal(leftEstimate.continuity, "continuing");
  assert.equal(rightEstimate.continuity, "ambiguous");
  assert.match(rightEstimate.reasoning, /does not justify breakage/);
});
