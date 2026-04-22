import test from "node:test";
import assert from "node:assert/strict";

import { Substrate } from "../src/index.js";

function createSubstrate() {
  let tick = 0;
  return new Substrate({
    now: () => `2026-04-21T00:00:${String(tick++).padStart(2, "0")}Z`,
  });
}

test("phase-2: mutual observers can exchange mediated self-access without overwriting source continuity", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "mutual-camera-basis",
    dimensions: ["shape", "pose", "aperture-facing"],
  });
  const observerOne = substrate.createObserver({
    label: "camera-1",
    basisId: basis.id,
  });
  const observerTwo = substrate.createObserver({
    label: "camera-2",
    basisId: basis.id,
  });
  const branchOne = substrate.createBranch({
    role: "observer",
    label: "camera-1-branch",
    basisId: basis.id,
    observerId: observerOne.id,
  });
  const branchTwo = substrate.createBranch({
    role: "observer",
    label: "camera-2-branch",
    basisId: basis.id,
    observerId: observerTwo.id,
  });
  const referentOneBranch = substrate.createBranch({
    role: "referent",
    label: "camera-1-as-seen-by-2",
    basisId: basis.id,
  });
  const referentTwoBranch = substrate.createBranch({
    role: "referent",
    label: "camera-2-as-seen-by-1",
    basisId: basis.id,
  });
  const referentOne = substrate.createReferent({
    label: "camera-1-visible-surface",
    anchor: "camera-1-external-anchor",
    branchId: referentOneBranch.id,
  });
  const referentTwo = substrate.createReferent({
    label: "camera-2-visible-surface",
    anchor: "camera-2-external-anchor",
    branchId: referentTwoBranch.id,
  });

  const bindingOneToTwo = substrate.createBinding({
    kind: "tracking",
    observerBranchId: branchOne.id,
    referentBranchId: referentTwoBranch.id,
    referentId: referentTwo.id,
    strength: 0.84,
  });
  const bindingTwoToOne = substrate.createBinding({
    kind: "tracking",
    observerBranchId: branchTwo.id,
    referentBranchId: referentOneBranch.id,
    referentId: referentOne.id,
    strength: 0.86,
  });
  const externalSelfView = substrate.createView({
    kind: "binding-map",
    label: "camera-1-from-camera-2",
    sourceIds: [branchTwo.id, referentOne.id, bindingTwoToOne.id],
    projection: "camera-2 exposes a replaceable view about camera-1",
  });
  const externalSelfArtifact = substrate.createArtifactEnvelope({
    kind: "view",
    label: "camera-1-mediated-self-artifact",
    sourceIds: [branchTwo.id, referentOne.id],
    payloadIds: [externalSelfView.id],
    locality: "shared-candidate",
    provenance: {
      emitterId: observerTwo.id,
      basisId: basis.id,
      source: "mutual-observer-lab",
    },
  });
  const adoptedSelfView = substrate.createView({
    kind: "branch-timeline",
    label: "camera-1-mediated-self-surface",
    sourceIds: [branchOne.id, externalSelfArtifact.id],
    projection: "camera-1 integrates a view about itself without overwriting direct continuity",
  });

  assert.equal(branchOne.role, "observer");
  assert.equal(referentOneBranch.role, "referent");
  assert.equal(bindingOneToTwo.referentId, referentTwo.id);
  assert.equal(bindingTwoToOne.referentId, referentOne.id);
  assert.equal(externalSelfArtifact.provenance.emitterId, observerTwo.id);
  assert.deepEqual(adoptedSelfView.sourceIds, [branchOne.id, externalSelfArtifact.id]);
  assert.equal(substrate.state.happenings.size, 0);
});

test("phase-2: a co-observed ball can materialize from seed pressure without observer ownership", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "ball-basis",
    dimensions: ["shape", "motion", "position"],
  });
  const observerOne = substrate.createObserver({
    label: "camera-1",
    basisId: basis.id,
  });
  const observerTwo = substrate.createObserver({
    label: "camera-2",
    basisId: basis.id,
  });
  const branchOne = substrate.createBranch({
    role: "observer",
    label: "camera-1-branch",
    basisId: basis.id,
    observerId: observerOne.id,
  });
  const branchTwo = substrate.createBranch({
    role: "observer",
    label: "camera-2-branch",
    basisId: basis.id,
    observerId: observerTwo.id,
  });
  const seedBranch = substrate.createBranch({
    role: "referent",
    label: "ball-seed-branch",
    basisId: basis.id,
  });
  const ballBranch = substrate.createBranch({
    role: "referent",
    label: "ball-materialized-branch",
    basisId: basis.id,
    parentBranchIds: [seedBranch.id],
  });
  const seedLineage = substrate.createLineageEdge({
    relation: "seed-origin",
    fromId: seedBranch.id,
    toId: ballBranch.id,
    basisId: basis.id,
    evidence: "ball realization emerged from precursor seed pressure",
  });
  const ball = substrate.createReferent({
    label: "ball",
    anchor: "ball-anchor",
    branchId: ballBranch.id,
  });

  const segmentOne = substrate.openSegment({
    branchId: branchOne.id,
    summary: "camera-1 sees candidate ball",
  });
  const segmentTwo = substrate.openSegment({
    branchId: branchTwo.id,
    summary: "camera-2 sees candidate ball",
  });
  const happeningOne = substrate.createHappening({
    branchId: branchOne.id,
    segmentId: segmentOne.id,
    label: "camera-1 registered ball motion",
  });
  const happeningTwo = substrate.createHappening({
    branchId: branchTwo.id,
    segmentId: segmentTwo.id,
    label: "camera-2 registered ball motion",
  });
  const bindingOne = substrate.createBinding({
    kind: "tracking",
    observerBranchId: branchOne.id,
    referentBranchId: ballBranch.id,
    referentId: ball.id,
    strength: 0.82,
  });
  const bindingTwo = substrate.createBinding({
    kind: "tracking",
    observerBranchId: branchTwo.id,
    referentBranchId: ballBranch.id,
    referentId: ball.id,
    strength: 0.8,
  });

  assert.equal(seedLineage.relation, "seed-origin");
  assert.deepEqual(ballBranch.parentBranchIds, [seedBranch.id]);
  assert.equal(bindingOne.referentId, ball.id);
  assert.equal(bindingTwo.referentId, ball.id);
  assert.equal(happeningOne.branchId, branchOne.id);
  assert.equal(happeningTwo.branchId, branchTwo.id);
  assert.equal(ball.branchId, ballBranch.id);
  assert.equal(substrate.state.referents.size, 1);
});

test("phase-2: orthogonal cameras can hold divergent ball interpretations without forcing consensus", () => {
  const substrate = createSubstrate();
  const sideBasis = substrate.createBasis({
    label: "side-camera-basis",
    dimensions: ["shape", "position", "occlusion"],
  });
  const topBasis = substrate.createBasis({
    label: "top-camera-basis",
    dimensions: ["size", "speed", "position"],
    partial: true,
  });
  const sideObserver = substrate.createObserver({
    label: "side-camera",
    basisId: sideBasis.id,
  });
  const topObserver = substrate.createObserver({
    label: "top-camera",
    basisId: topBasis.id,
  });
  const sideBranch = substrate.createBranch({
    role: "observer",
    label: "side-camera-branch",
    basisId: sideBasis.id,
    observerId: sideObserver.id,
  });
  const topBranch = substrate.createBranch({
    role: "observer",
    label: "top-camera-branch",
    basisId: topBasis.id,
    observerId: topObserver.id,
  });
  const ballBranch = substrate.createBranch({
    role: "referent",
    label: "orthogonal-ball-branch",
    basisId: sideBasis.id,
  });
  const ball = substrate.createReferent({
    label: "orthogonal-ball",
    anchor: "orthogonal-ball-anchor",
    branchId: ballBranch.id,
  });
  const sideBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: sideBranch.id,
    referentBranchId: ballBranch.id,
    referentId: ball.id,
    strength: 0.86,
  });
  const topBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: topBranch.id,
    referentBranchId: ballBranch.id,
    referentId: ball.id,
    strength: 0.55,
  });
  const sideEstimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: ballBranch.id,
    continuity: "continuing",
    reasoning: "side camera retains enough shape and position continuity",
    basedOnBindingIds: [sideBinding.id],
  });
  const topEstimate = substrate.createStateEstimate({
    referentId: ball.id,
    branchId: ballBranch.id,
    continuity: "ambiguous",
    reasoning: "top camera loses enough detail that co-reference stays underdetermined",
    basedOnBindingIds: [topBinding.id],
  });
  const comparison = substrate.createComparisonSurface({
    label: "orthogonal-ball-comparison",
    sourceIds: [sideBinding.id, topBinding.id, ball.id],
    projection: "shared ball projection through orthogonal observer bases",
    comparability: "partial",
    compatibility: "unresolved",
    equivalence: "unresolved",
    convergence: "not-forced",
    reasonCodes: ["shared-ball-projection-partial", "observer-bases-diverge"],
    evidenceSourceIds: [sideBinding.id, topBinding.id, ball.id],
    summary: "Both cameras may be tracking the same ball, but basis mismatch prevents forced agreement.",
  });

  assert.equal(sideEstimate.continuity, "continuing");
  assert.equal(topEstimate.continuity, "ambiguous");
  assert.equal(comparison.comparability, "partial");
  assert.equal(comparison.compatibility, "unresolved");
  assert.equal(comparison.convergence, "not-forced");
  assert.ok((topBinding.strength ?? 0) < (sideBinding.strength ?? 0));
});
