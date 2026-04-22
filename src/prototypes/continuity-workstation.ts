import { Substrate } from "../kernel/substrate.js";

export function buildContinuityWorkstationReport() {
  let tick = 0;
  const substrate = new Substrate({
    now: () => `2026-04-21T00:00:${String(tick++).padStart(2, "0")}Z`,
  });

  const basis = substrate.createBasis({
    label: "workstation-basis",
    dimensions: ["shape", "position", "boundary", "behavior"],
  });
  const degradedBasis = substrate.createBasis({
    label: "workstation-degraded-basis",
    dimensions: ["shape", "position"],
    partial: true,
    degradedFrom: [basis.id],
  });

  const roomContextBranch = substrate.createBranch({
    role: "context",
    label: "workstation-room-context-branch",
    basisId: basis.id,
  });
  const roomContext = substrate.createContext({
    label: "workstation-room-context",
    branchId: roomContextBranch.id,
  });
  const corridorContextBranch = substrate.createBranch({
    role: "context",
    label: "workstation-corridor-context-branch",
    basisId: basis.id,
  });
  const corridorContext = substrate.createContext({
    label: "workstation-corridor-context",
    branchId: corridorContextBranch.id,
  });

  const observer = substrate.createObserver({
    label: "workstation-observer",
    basisId: basis.id,
    saliencePolicy: "promote continuity shifts and boundary anomalies",
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "workstation-observer-branch",
    basisId: basis.id,
    observerId: observer.id,
    contextId: roomContext.id,
  });
  const wake = substrate.openSegment({
    branchId: observerBranch.id,
    summary: "initial active workstation wake",
  });

  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "workstation-referent-branch",
    basisId: basis.id,
    contextId: roomContext.id,
  });
  const referent = substrate.createReferent({
    label: "tracked-object",
    anchor: "tracked-object-anchor",
    branchId: referentBranch.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    contextId: roomContext.id,
    strength: 0.9,
  });

  const thresholdTrigger = substrate.createTrigger({
    label: "boundary-drift-threshold",
    threshold: "boundary drift > 0.3",
    basisId: basis.id,
  });
  const notableHappening = substrate.createHappening({
    branchId: observerBranch.id,
    segmentId: wake.id,
    label: "tracked object drifts toward corridor threshold",
    triggerIds: [thresholdTrigger.id],
    salience: 0.91,
  });

  const carry = substrate.sealSegment(wake.id, {
    anchor: "workstation-wake-anchor",
  });
  const resumed = substrate.openSegment({
    branchId: observerBranch.id,
    inheritedNucleusIds: [carry.nucleus.id],
    summary: "resumed workstation wake",
  });

  const fork = substrate.forkBranch({
    sourceBranchId: referentBranch.id,
    label: "workstation-referent-fork",
    relation: "split",
    lineageEvidence: "boundary drift plus degraded reacquisition pressure",
  });
  const merge = substrate.createMergeSuccessor({
    label: "workstation-merge-pressure",
    role: "referent",
    basisId: basis.id,
    sourceBranchIds: [referentBranch.id, fork.branch.id],
    inheritedNucleusIds: [carry.nucleus.id],
    summary: "authored merge-pressure surface",
  });

  const degradedObserver = substrate.createObserver({
    label: "workstation-degraded-observer",
    basisId: degradedBasis.id,
  });
  const degradedObserverBranch = substrate.createBranch({
    role: "observer",
    label: "workstation-degraded-observer-branch",
    basisId: degradedBasis.id,
    observerId: degradedObserver.id,
    contextId: roomContext.id,
  });
  const degradedBinding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: degradedObserverBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    contextId: roomContext.id,
    strength: 0.43,
  });

  const continuationEstimate = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "continuing",
    reasoning: "full basis preserves strong continuity signal",
    basedOnBindingIds: [binding.id],
  });
  const ambiguityEstimate = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "ambiguous",
    reasoning: "degraded basis leaves re-identification underdetermined",
    basedOnBindingIds: [degradedBinding.id],
  });

  const portalBranch = substrate.createBranch({
    role: "portal",
    label: "workstation-doorway-portal-branch",
    basisId: basis.id,
    contextId: roomContext.id,
  });
  const portal = substrate.createPortal({
    label: "workstation-doorway-portal",
    branchId: portalBranch.id,
    sourceContextId: corridorContext.id,
    targetContextId: roomContext.id,
    exposureRule: "coarse motion and sound only",
    transform: "compress corridor detail into doorway cues",
  });
  const comparison = substrate.createComparisonSurface({
    label: "workstation-comparison-surface",
    sourceIds: [continuationEstimate.id, ambiguityEstimate.id, binding.id, degradedBinding.id],
    basisId: basis.id,
    projection: "shared continuity workstation comparison surface",
    comparability: "partial",
    compatibility: "unresolved",
    equivalence: "unresolved",
    convergence: "not-forced",
    reasonCodes: ["shared-projection-partial", "basis-degradation-present"],
    evidenceSourceIds: [continuationEstimate.id, ambiguityEstimate.id, binding.id, degradedBinding.id],
    summary: "two observers maintain different judgments over one tracked continuity",
  });
  const artifact = substrate.createArtifactEnvelope({
    kind: "comparability-surface",
    label: "workstation-comparison-artifact",
    sourceIds: [comparison.id, portal.id],
    payloadIds: [binding.id, degradedBinding.id],
    provenance: {
      basisId: basis.id,
      emitterId: observer.id,
      source: "continuity-workstation",
      note: "prototype-emitted comparison artifact",
    },
  });

  const timeline = substrate.materializeBranchTimeline(observerBranch.id);

  return {
    substrate,
    summary: {
      observerBranchId: observerBranch.id,
      referentBranchId: referentBranch.id,
      resumedSegmentId: resumed.id,
      forkedBranchId: fork.branch.id,
      mergeBranchId: merge.branch.id,
      portalId: portal.id,
      comparisonId: comparison.id,
      artifactId: artifact.id,
      timelineSegmentCount: timeline.segments.length,
      artifactCount: substrate.state.artifacts.size,
      comparisonSurfaceCount: substrate.state.comparisonSurfaces.size,
    },
  };
}
