import { Substrate } from "../src/index.js";

const substrate = new Substrate({
  now: (() => {
    let tick = 0;
    return () => `2026-04-19T00:00:0${tick++}Z`;
  })(),
});

const basis = substrate.createBasis({
  label: "visual-local-basis",
  dimensions: ["position", "shape", "occlusion"],
  partial: true,
});

const observer = substrate.createObserver({
  label: "room-observer",
  basisId: basis.id,
  saliencePolicy: "movement above stillness threshold",
});

const roomContextBranch = substrate.createBranch({
  role: "context",
  label: "room-context-branch",
  basisId: basis.id,
});
const roomContext = substrate.createContext({
  label: "room-context",
  branchId: roomContextBranch.id,
  containmentPolicy: "contains locally situated observers and referents",
});

const observerBranch = substrate.createBranch({
  role: "observer",
  label: "observer-room-branch",
  basisId: basis.id,
  observerId: observer.id,
  contextId: roomContext.id,
});
const wake1 = substrate.openSegment({
  branchId: observerBranch.id,
  summary: "initial active wake",
});

const movementTrigger = substrate.createTrigger({
  label: "movement-crossed-threshold",
  threshold: "delta-position > 0.2",
  basisId: basis.id,
});
substrate.createHappening({
  branchId: observerBranch.id,
  segmentId: wake1.id,
  label: "noticed movement near table",
  triggerIds: [movementTrigger.id],
  salience: 0.9,
  summary: "movement becomes important enough to register",
});

const referentBranch = substrate.createBranch({
  role: "referent",
  label: "cup-branch",
  basisId: basis.id,
  contextId: roomContext.id,
});
const inertia = substrate.createInertiaModel({
  label: "cup-inertia",
  strategy: "assume continuity unless strong contradictory evidence appears",
});
const volatility = substrate.createVolatilityModel({
  label: "room-volatility",
  expectedRate: "medium",
});
const cup = substrate.createReferent({
  label: "cup",
  anchor: "cup-on-table",
  branchId: referentBranch.id,
  inertiaModelId: inertia.id,
  volatilityModelId: volatility.id,
});

const binding = substrate.createBinding({
  kind: "tracking",
  observerBranchId: observerBranch.id,
  referentBranchId: referentBranch.id,
  referentId: cup.id,
  contextId: roomContext.id,
  strength: 0.8,
});

const carry = substrate.sealSegment(wake1.id, {
  anchor: "observer-room-nucleus-1",
  notes: "carry forward what still matters after sleep",
});

const wake2 = substrate.openSegment({
  branchId: observerBranch.id,
  inheritedNucleusIds: [carry.nucleus.id],
  summary: "resumed wake",
});

substrate.createStateEstimate({
  referentId: cup.id,
  branchId: referentBranch.id,
  continuity: "continuing",
  reasoning: "no contradictory trigger, continuity supported by inertia and moderate volatility",
  basedOnBindingIds: [binding.id],
  inertiaModelId: inertia.id,
  volatilityModelId: volatility.id,
});

const hallwayContextBranch = substrate.createBranch({
  role: "context",
  label: "hallway-context-branch",
  basisId: basis.id,
});
const hallwayContext = substrate.createContext({
  label: "hallway-context",
  branchId: hallwayContextBranch.id,
});
const portalBranch = substrate.createBranch({
  role: "portal",
  label: "doorway-portal-branch",
  basisId: basis.id,
  contextId: roomContext.id,
});
substrate.createPortal({
  label: "doorway-portal",
  branchId: portalBranch.id,
  sourceContextId: hallwayContext.id,
  targetContextId: roomContext.id,
  exposureRule: "only motion silhouettes pass through",
  transform: "hallway detail reduced to coarse movement cues",
});

const timeline = substrate.materializeBranchTimeline(observerBranch.id);
const view = substrate.createView({
  kind: "branch-timeline",
  label: "observer-room-timeline",
  sourceIds: [observerBranch.id, wake2.id],
  projection: "timeline of observer wake segments and salient happenings",
});

console.log(
  JSON.stringify(
    {
      observer,
      roomContext,
      cup,
      carryForwardNucleus: carry.nucleus,
      resumedSegment: wake2,
      portalCount: substrate.state.portals.size,
      timeline,
      view,
    },
    null,
    2,
  ),
);
