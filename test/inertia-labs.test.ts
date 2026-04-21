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
