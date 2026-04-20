import test from "node:test";
import assert from "node:assert/strict";

import { Substrate } from "../src/index.js";

function createSubstrate() {
  let tick = 0;
  return new Substrate({
    now: () => `2026-04-20T00:00:${String(tick++).padStart(2, "0")}Z`,
  });
}

test("lab-01: wake/sleep continuity carries nucleus forward without collapsing branch split pressure", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "wake-basis",
    dimensions: ["motion", "shape", "attention"],
  });
  const observer = substrate.createObserver({
    label: "observer-a",
    basisId: basis.id,
  });
  const continuityBranch = substrate.createBranch({
    role: "observer",
    label: "observer-a-main",
    basisId: basis.id,
    observerId: observer.id,
  });

  const firstWake = substrate.openSegment({
    branchId: continuityBranch.id,
    summary: "initial wake",
  });
  substrate.createHappening({
    branchId: continuityBranch.id,
    segmentId: firstWake.id,
    label: "noticed salient motion",
  });

  const carry = substrate.sealSegment(firstWake.id, {
    anchor: "observer-a-wake-anchor",
  });
  const resumedWake = substrate.openSegment({
    branchId: continuityBranch.id,
    inheritedNucleusIds: [carry.nucleus.id],
    summary: "resumed wake",
  });

  const pressuredSplit = substrate.createBranch({
    role: "observer",
    label: "observer-a-forked",
    basisId: basis.id,
    observerId: observer.id,
    parentBranchIds: [continuityBranch.id],
  });
  const splitEdge = substrate.createLineageEdge({
    relation: "split",
    fromId: continuityBranch.id,
    toId: pressuredSplit.id,
    evidence: "continuity pressure exceeded simple resumption assumptions",
  });

  assert.equal(resumedWake.inheritedNucleusIds[0], carry.nucleus.id);
  assert.equal(carry.nucleus.sourceSegmentId, firstWake.id);
  assert.deepEqual(pressuredSplit.parentBranchIds, [continuityBranch.id]);
  assert.equal(splitEdge.relation, "split");

  const observerBranches = [...substrate.state.branches.values()].filter(
    (branch) => branch.observerId === observer.id,
  );
  assert.equal(observerBranches.length, 2);
});

test("lab-02: referent persistence across absence supports continuing, ambiguous, and broken", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "tracking-basis",
    dimensions: ["position", "shape"],
  });
  const observer = substrate.createObserver({
    label: "observer-a",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "observer-a-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "cup-branch",
    basisId: basis.id,
  });
  const referent = substrate.createReferent({
    label: "cup",
    anchor: "cup-anchor",
    branchId: referentBranch.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
  });
  const inertia = substrate.createInertiaModel({
    label: "persistent-object",
    strategy: "absence alone should not break tracking",
  });
  const volatility = substrate.createVolatilityModel({
    label: "busy-room",
    expectedRate: "medium",
  });

  const continuing = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "continuing",
    reasoning: "neutral absence under moderate volatility still leaves continuity plausible",
    basedOnBindingIds: [binding.id],
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });
  const ambiguous = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "ambiguous",
    reasoning: "weak negative evidence and degraded visibility underdetermine continuity",
    basedOnBindingIds: [binding.id],
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });
  const broken = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "broken",
    reasoning: "strong contradictory evidence makes prior continuity no longer plausible",
    basedOnBindingIds: [binding.id],
    inertiaModelId: inertia.id,
    volatilityModelId: volatility.id,
  });

  assert.equal(continuing.continuity, "continuing");
  assert.equal(ambiguous.continuity, "ambiguous");
  assert.equal(broken.continuity, "broken");
  assert.match(ambiguous.reasoning, /underdetermine continuity/);
  assert.match(broken.reasoning, /contradictory evidence/);
});

test("lab-03: one primary context plus directional portal keeps colocated and external relevance distinct", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "spatial-basis",
    dimensions: ["inside", "outside", "threshold"],
  });
  const roomBranch = substrate.createBranch({
    role: "context",
    label: "room-context-branch",
    basisId: basis.id,
  });
  const room = substrate.createContext({
    label: "room",
    branchId: roomBranch.id,
  });
  const hallwayBranch = substrate.createBranch({
    role: "context",
    label: "hallway-context-branch",
    basisId: basis.id,
  });
  const hallway = substrate.createContext({
    label: "hallway",
    branchId: hallwayBranch.id,
  });

  const observer = substrate.createObserver({
    label: "observer-a",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "observer-room-branch",
    basisId: basis.id,
    observerId: observer.id,
    contextId: room.id,
  });
  const roomReferentBranch = substrate.createBranch({
    role: "referent",
    label: "table-branch",
    basisId: basis.id,
    contextId: room.id,
  });
  const hallwayReferentBranch = substrate.createBranch({
    role: "referent",
    label: "figure-branch",
    basisId: basis.id,
    contextId: hallway.id,
  });
  const portalBranch = substrate.createBranch({
    role: "portal",
    label: "doorway-branch",
    basisId: basis.id,
    contextId: room.id,
  });
  const portal = substrate.createPortal({
    label: "doorway",
    branchId: portalBranch.id,
    sourceContextId: hallway.id,
    targetContextId: room.id,
    exposureRule: "motion silhouettes only",
    transform: "reduce hallway detail to doorway silhouettes",
  });
  const portalView = substrate.createView({
    kind: "context-surface",
    label: "room-facing-hallway-surface",
    sourceIds: [hallwayReferentBranch.id, portal.id],
    projection: "hallway exposure into room through doorway portal",
  });

  assert.equal(observerBranch.contextId, room.id);
  assert.equal(roomReferentBranch.contextId, room.id);
  assert.equal(hallwayReferentBranch.contextId, hallway.id);
  assert.equal(portal.sourceContextId, hallway.id);
  assert.equal(portal.targetContextId, room.id);
  assert.deepEqual(portalView.sourceIds, [hallwayReferentBranch.id, portal.id]);
});

test("lab-04: degraded basis re-identification can support continuation or ambiguity without forced breakage", () => {
  const substrate = createSubstrate();
  const fullBasis = substrate.createBasis({
    label: "visual-full",
    dimensions: ["shape", "color", "position"],
  });
  const degradedBasis = substrate.createBasis({
    label: "visual-degraded",
    dimensions: ["shape", "position"],
    partial: true,
    degradedFrom: [fullBasis.id],
  });

  const fullObserver = substrate.createObserver({
    label: "full-observer",
    basisId: fullBasis.id,
  });
  const degradedObserver = substrate.createObserver({
    label: "degraded-observer",
    basisId: degradedBasis.id,
  });
  const fullBranch = substrate.createBranch({
    role: "observer",
    label: "full-observer-branch",
    basisId: fullBasis.id,
    observerId: fullObserver.id,
  });
  const degradedBranch = substrate.createBranch({
    role: "observer",
    label: "degraded-observer-branch",
    basisId: degradedBasis.id,
    observerId: degradedObserver.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "vehicle-branch",
    basisId: fullBasis.id,
  });
  const referent = substrate.createReferent({
    label: "vehicle",
    anchor: "vehicle-anchor",
    branchId: referentBranch.id,
  });
  const fullBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: fullBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    strength: 0.95,
  });
  const degradedBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: degradedBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    strength: 0.45,
  });

  const continuing = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "continuing",
    reasoning: "full basis preserves enough distinctions for continuity",
    basedOnBindingIds: [fullBinding.id],
  });
  const ambiguous = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "ambiguous",
    reasoning: "degraded basis loses color distinction and cannot settle re-identification",
    basedOnBindingIds: [degradedBinding.id],
  });

  assert.deepEqual(degradedBasis.degradedFrom, [fullBasis.id]);
  assert.equal(continuing.continuity, "continuing");
  assert.equal(ambiguous.continuity, "ambiguous");
  assert.ok((degradedBinding.strength ?? 0) < (fullBinding.strength ?? 0));
});

test("lab-05: trigger flow can preserve clustered happenings while leaving some triggers raw", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "attention-basis",
    dimensions: ["movement", "glint", "sound"],
  });

  const highObserver = substrate.createObserver({
    label: "high-salience-observer",
    basisId: basis.id,
    saliencePolicy: "promote clustered motion and glint",
  });
  const lowObserver = substrate.createObserver({
    label: "low-salience-observer",
    basisId: basis.id,
    saliencePolicy: "ignore isolated low-amplitude changes",
  });

  const highBranch = substrate.createBranch({
    role: "observer",
    label: "high-salience-branch",
    basisId: basis.id,
    observerId: highObserver.id,
  });
  const lowBranch = substrate.createBranch({
    role: "observer",
    label: "low-salience-branch",
    basisId: basis.id,
    observerId: lowObserver.id,
  });
  const highSegment = substrate.openSegment({ branchId: highBranch.id });
  const lowSegment = substrate.openSegment({ branchId: lowBranch.id });

  const motion = substrate.createTrigger({
    label: "shared-threshold-crossing",
    threshold: "movement > 0.3",
    basisId: basis.id,
  });
  const glint = substrate.createTrigger({
    label: "glint-threshold-crossing",
    threshold: "glint > 0.5",
    basisId: basis.id,
  });
  const lowOnly = substrate.createTrigger({
    label: "shared-threshold-crossing",
    threshold: "movement > 0.3",
    basisId: basis.id,
  });

  const clustered = substrate.createHappening({
    branchId: highBranch.id,
    segmentId: highSegment.id,
    label: "movement-and-glint cluster",
    triggerIds: [motion.id, glint.id],
    salience: 0.92,
  });

  const highSegmentState = substrate.state.segments.get(highSegment.id);
  const lowSegmentState = substrate.state.segments.get(lowSegment.id);
  assert.equal(highSegmentState?.happeningIds.length, 1);
  assert.equal(lowSegmentState?.happeningIds.length, 0);
  assert.deepEqual(clustered.triggerIds, [motion.id, glint.id]);

  const referencedTriggerIds = new Set(
    [...substrate.state.happenings.values()].flatMap((happening) => happening.triggerIds),
  );
  assert.equal(referencedTriggerIds.has(lowOnly.id), false);
  assert.equal(substrate.state.triggers.size, 3);
});

test("lab-06: boundary ambiguity can remain unresolved without forcing premature context placement", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "boundary-basis",
    dimensions: ["inside", "outside", "threshold", "motion"],
  });
  const roomBranch = substrate.createBranch({
    role: "context",
    label: "room-branch",
    basisId: basis.id,
  });
  const room = substrate.createContext({
    label: "room",
    branchId: roomBranch.id,
  });
  const hallwayBranch = substrate.createBranch({
    role: "context",
    label: "hallway-branch",
    basisId: basis.id,
  });
  const hallway = substrate.createContext({
    label: "hallway",
    branchId: hallwayBranch.id,
  });
  const observer = substrate.createObserver({
    label: "boundary-observer",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "boundary-observer-branch",
    basisId: basis.id,
    observerId: observer.id,
    contextId: room.id,
  });
  const boundaryReferentBranch = substrate.createBranch({
    role: "referent",
    label: "threshold-figure-branch",
    basisId: basis.id,
    metadata: { placement: "ambiguous-boundary" },
  });
  const portalBranch = substrate.createBranch({
    role: "portal",
    label: "doorway-threshold-branch",
    basisId: basis.id,
    contextId: room.id,
  });
  const portal = substrate.createPortal({
    label: "doorway-threshold",
    branchId: portalBranch.id,
    sourceContextId: hallway.id,
    targetContextId: room.id,
    exposureRule: "edge silhouettes only",
    transform: "compress threshold detail into edge motion hints",
  });
  const ambiguityView = substrate.createView({
    kind: "context-surface",
    label: "threshold-ambiguity-surface",
    sourceIds: [observerBranch.id, boundaryReferentBranch.id, portal.id],
    projection: "unresolved placement near the doorway threshold",
    metadata: { ambiguityKind: "placement" },
  });

  assert.equal(boundaryReferentBranch.contextId, undefined);
  assert.equal(boundaryReferentBranch.metadata?.placement, "ambiguous-boundary");
  assert.equal(observerBranch.contextId, room.id);
  assert.equal(portal.targetContextId, room.id);
  assert.equal(ambiguityView.metadata?.ambiguityKind, "placement");
});

test("lab-07: mutual exposure can be modeled as two directional portals with asymmetric rules", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "mutual-exposure-basis",
    dimensions: ["light", "sound", "motion"],
  });
  const gardenBranch = substrate.createBranch({
    role: "context",
    label: "garden-branch",
    basisId: basis.id,
  });
  const garden = substrate.createContext({
    label: "garden",
    branchId: gardenBranch.id,
  });
  const workshopBranch = substrate.createBranch({
    role: "context",
    label: "workshop-branch",
    basisId: basis.id,
  });
  const workshop = substrate.createContext({
    label: "workshop",
    branchId: workshopBranch.id,
  });
  const gardenToWorkshopBranch = substrate.createBranch({
    role: "portal",
    label: "window-in-branch",
    basisId: basis.id,
    contextId: workshop.id,
  });
  const workshopToGardenBranch = substrate.createBranch({
    role: "portal",
    label: "window-out-branch",
    basisId: basis.id,
    contextId: garden.id,
  });
  const gardenToWorkshop = substrate.createPortal({
    label: "garden-to-workshop",
    branchId: gardenToWorkshopBranch.id,
    sourceContextId: garden.id,
    targetContextId: workshop.id,
    exposureRule: "light and coarse motion only",
  });
  const workshopToGarden = substrate.createPortal({
    label: "workshop-to-garden",
    branchId: workshopToGardenBranch.id,
    sourceContextId: workshop.id,
    targetContextId: garden.id,
    exposureRule: "sound and sparks only",
  });

  assert.equal(substrate.state.portals.size, 2);
  assert.equal(gardenToWorkshop.sourceContextId, garden.id);
  assert.equal(gardenToWorkshop.targetContextId, workshop.id);
  assert.equal(workshopToGarden.sourceContextId, workshop.id);
  assert.equal(workshopToGarden.targetContextId, garden.id);
  assert.notEqual(gardenToWorkshop.exposureRule, workshopToGarden.exposureRule);
});

test("lab-08: local artifact emission keeps raw continuity local while explicit artifacts carry provenance", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "artifact-basis",
    dimensions: ["shape", "position", "binding"],
  });
  const observer = substrate.createObserver({
    label: "artifact-observer",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "artifact-observer-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const segment = substrate.openSegment({
    branchId: observerBranch.id,
    summary: "local-only continuity segment",
  });
  const trigger = substrate.createTrigger({
    label: "local-threshold",
    threshold: "shape drift > 0.2",
    basisId: basis.id,
  });
  substrate.createHappening({
    branchId: observerBranch.id,
    segmentId: segment.id,
    label: "local-only happening",
    triggerIds: [trigger.id],
  });

  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "artifact-referent-branch",
    basisId: basis.id,
  });
  const referent = substrate.createReferent({
    label: "artifact-referent",
    anchor: "artifact-anchor",
    branchId: referentBranch.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    metadata: { provenance: "local-lab-08-binding" },
  });
  const lineage = substrate.createLineageEdge({
    relation: "projection",
    fromId: observerBranch.id,
    toId: referentBranch.id,
    evidence: "explicit emitted relation for local lab artifact surface",
    metadata: { provenance: "local-lab-08-lineage" },
  });
  const view = substrate.createView({
    kind: "binding-map",
    label: "artifact-surface",
    sourceIds: [observerBranch.id, referentBranch.id, binding.id],
    projection: "explicit local artifact surface for later exchange consideration",
    metadata: { provenance: "local-lab-08-view", effectiveBasis: basis.id },
  });
  const estimate = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "continuing",
    reasoning: "artifact emission does not change local continuity posture",
    basedOnBindingIds: [binding.id],
    metadata: { provenance: "local-lab-08-estimate" },
  });

  const emittedArtifacts = [binding.id, lineage.id, view.id, estimate.id];

  assert.equal(substrate.state.segments.size, 1);
  assert.equal(substrate.state.triggers.size, 1);
  assert.equal(substrate.state.happenings.size, 1);
  assert.equal(emittedArtifacts.length, 4);
  assert.equal(view.metadata?.provenance, "local-lab-08-view");
  assert.equal(binding.metadata?.provenance, "local-lab-08-binding");
  assert.equal(lineage.metadata?.provenance, "local-lab-08-lineage");
  assert.equal(estimate.metadata?.provenance, "local-lab-08-estimate");
});

test("lab-09: split and merge pressure can be represented lineage-first while nucleus composition stays explicit", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "lineage-pressure-basis",
    dimensions: ["shape", "motion", "continuity"],
  });

  const seedBranch = substrate.createBranch({
    role: "referent",
    label: "seed-referent-branch",
    basisId: basis.id,
  });
  const seedSegment = substrate.openSegment({
    branchId: seedBranch.id,
    summary: "pre-split continuity",
  });
  substrate.createHappening({
    branchId: seedBranch.id,
    segmentId: seedSegment.id,
    label: "pressure toward split",
  });
  const seedCarry = substrate.sealSegment(seedSegment.id, {
    anchor: "seed-nucleus-anchor",
  });

  const leftBranch = substrate.createBranch({
    role: "referent",
    label: "left-successor-branch",
    basisId: basis.id,
    parentBranchIds: [seedBranch.id],
  });
  const rightBranch = substrate.createBranch({
    role: "referent",
    label: "right-successor-branch",
    basisId: basis.id,
    parentBranchIds: [seedBranch.id],
  });
  const leftSegment = substrate.openSegment({
    branchId: leftBranch.id,
    inheritedNucleusIds: [seedCarry.nucleus.id],
  });
  const rightSegment = substrate.openSegment({
    branchId: rightBranch.id,
    inheritedNucleusIds: [seedCarry.nucleus.id],
  });
  const leftCarry = substrate.sealSegment(leftSegment.id, {
    anchor: "left-nucleus-anchor",
  });
  const rightCarry = substrate.sealSegment(rightSegment.id, {
    anchor: "right-nucleus-anchor",
  });

  const splitLeft = substrate.createLineageEdge({
    relation: "split",
    fromId: seedBranch.id,
    toId: leftBranch.id,
  });
  const splitRight = substrate.createLineageEdge({
    relation: "split",
    fromId: seedBranch.id,
    toId: rightBranch.id,
  });

  const mergeBranch = substrate.createBranch({
    role: "referent",
    label: "merge-pressure-branch",
    basisId: basis.id,
    parentBranchIds: [leftBranch.id, rightBranch.id],
  });
  const mergeSegment = substrate.openSegment({
    branchId: mergeBranch.id,
    inheritedNucleusIds: [leftCarry.nucleus.id, rightCarry.nucleus.id],
    summary: "merge-pressure continuity",
  });
  const mergeLeft = substrate.createLineageEdge({
    relation: "merge",
    fromId: leftBranch.id,
    toId: mergeBranch.id,
  });
  const mergeRight = substrate.createLineageEdge({
    relation: "merge",
    fromId: rightBranch.id,
    toId: mergeBranch.id,
  });

  assert.equal(splitLeft.relation, "split");
  assert.equal(splitRight.relation, "split");
  assert.equal(mergeLeft.relation, "merge");
  assert.equal(mergeRight.relation, "merge");
  assert.deepEqual(leftBranch.parentBranchIds, [seedBranch.id]);
  assert.deepEqual(rightBranch.parentBranchIds, [seedBranch.id]);
  assert.deepEqual(mergeBranch.parentBranchIds, [leftBranch.id, rightBranch.id]);
  assert.deepEqual(mergeSegment.inheritedNucleusIds, [leftCarry.nucleus.id, rightCarry.nucleus.id]);
});

test("lab-10: multi-observer non-agreement can coexist without forced convergence", () => {
  const substrate = createSubstrate();
  const richBasis = substrate.createBasis({
    label: "rich-observer-basis",
    dimensions: ["shape", "color", "position", "behavior"],
  });
  const narrowBasis = substrate.createBasis({
    label: "narrow-observer-basis",
    dimensions: ["shape", "position"],
    partial: true,
    degradedFrom: [richBasis.id],
  });

  const observerA = substrate.createObserver({
    label: "observer-a",
    basisId: richBasis.id,
    saliencePolicy: "track stable rich continuity",
  });
  const observerB = substrate.createObserver({
    label: "observer-b",
    basisId: narrowBasis.id,
    saliencePolicy: "treat degraded continuity conservatively",
  });
  const branchA = substrate.createBranch({
    role: "observer",
    label: "observer-a-branch",
    basisId: richBasis.id,
    observerId: observerA.id,
  });
  const branchB = substrate.createBranch({
    role: "observer",
    label: "observer-b-branch",
    basisId: narrowBasis.id,
    observerId: observerB.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "overlap-referent-branch",
    basisId: richBasis.id,
  });
  const referent = substrate.createReferent({
    label: "overlap-referent",
    anchor: "overlap-anchor",
    branchId: referentBranch.id,
  });
  const bindingA = substrate.createBinding({
    kind: "tracking",
    observerBranchId: branchA.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    strength: 0.92,
  });
  const bindingB = substrate.createBinding({
    kind: "tracking",
    observerBranchId: branchB.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    strength: 0.47,
  });

  const estimateA = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "continuing",
    reasoning: "rich basis preserves enough detail for continuing judgment",
    basedOnBindingIds: [bindingA.id],
    metadata: { observerId: observerA.id },
  });
  const estimateB = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "ambiguous",
    reasoning: "narrow basis cannot decide whether the overlap is the same continuity",
    basedOnBindingIds: [bindingB.id],
    metadata: { observerId: observerB.id },
  });
  const comparabilityView = substrate.createView({
    kind: "binding-map",
    label: "partial-comparability-surface",
    sourceIds: [bindingA.id, bindingB.id, estimateA.id, estimateB.id],
    projection: "partial shared surface without forced convergence",
    metadata: { comparability: "partial", convergence: "not-forced" },
  });

  assert.equal(estimateA.continuity, "continuing");
  assert.equal(estimateB.continuity, "ambiguous");
  assert.equal(substrate.state.bindings.size, 2);
  assert.equal(comparabilityView.metadata?.comparability, "partial");
  assert.equal(comparabilityView.metadata?.convergence, "not-forced");
  assert.ok((bindingA.strength ?? 0) > (bindingB.strength ?? 0));
});
