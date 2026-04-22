import { Substrate as SubstrateKernel } from "../kernel/substrate.js";
import { StateEstimate } from "../kernel/types.js";
import {
  BranchHappeningRecord,
  ExchangeArtifactRecord,
  ExchangeArtifactPayload,
  ReceiptPayload,
  ReferentStateRecord,
  SleepCapsuleRecord,
} from "./corestore-records.js";
import {
  FirstSeriousCorestoreLabHandle,
  openFirstSeriousCorestoreLab,
} from "./corestore-first-serious-lab.js";

export interface CorestoreReplaySummary {
  namespaceParts: string[];
  branchHappeningCount: number;
  sleepCapsuleCount: number;
  referentStateCount: number;
  exchangeArtifactCount: number;
  branchIds: string[];
  segmentIds: string[];
  referentIds: string[];
  exchangePayloadKinds: ExchangeArtifactPayload["payloadType"][];
  latestContinuityByReferentId: Record<string, StateEstimate["continuity"]>;
  branchSurfaces: ReplayBranchSurface[];
  referentSurfaces: ReplayReferentSurface[];
  artifactSurfaces: ReplayArtifactSurface[];
  contextSurfaces: ReplayContextSurface[];
  portalSurfaces: ReplayPortalSurface[];
  comparisonSurfaces: ReplayComparisonSurface[];
}

export interface ReplayBranchSurface {
  branchId: string;
  segmentIds: string[];
  branchHappeningIds: string[];
  sleepCapsuleIds: string[];
  branchHappeningCount: number;
  sleepCapsuleCount: number;
  latestSegmentId?: string;
  latestHappeningLabel?: string;
  latestHappeningObservedAt?: string;
  latestSleepAnchor?: string;
}

export interface ReplayReferentSurface {
  referentId: string;
  branchId: string;
  anchor: string;
  estimateIds: string[];
  continuityHistory: StateEstimate["continuity"][];
  latestContinuity: StateEstimate["continuity"];
  reasoningHistory: string[];
  latestReasoning: string;
  latestEstimatedAt: string;
  latestBasedOnBindingIds: string[];
}

export interface ReplayArtifactSurface {
  artifactId: string;
  kind: string;
  payloadType: ExchangeArtifactPayload["payloadType"];
  payloadId: string;
  sourceIds: string[];
  payloadSourceIds: string[];
  locality: string;
  emittedAt: string;
  emitterId?: string;
  basisId?: string;
  provenanceSource?: string;
  provenanceNote?: string;
  summary?: string;
}

export interface ReplayContextSurface {
  contextId: string;
  branchId: string;
  label: string;
  parentContextId?: string;
  containmentPolicy?: string;
  artifactId: string;
}

export interface ReplayPortalSurface {
  portalId: string;
  branchId: string;
  label: string;
  sourceContextId: string;
  targetContextId: string;
  exposureRule: string;
  transform?: string;
  artifactId: string;
}

export interface ReplayComparisonSurface {
  comparisonId: string;
  artifactId: string;
  label: string;
  sourceIds: string[];
  basisId?: string;
  projection?: string;
  comparability: string;
  compatibility: string;
  equivalence?: string;
  convergence: string;
  reasonCodes: string[];
  evidenceSourceIds: string[];
  summary?: string;
}

export interface BranchReplayPicture {
  branchId: string;
  happenings: BranchHappeningRecord[];
  sleepCapsules: SleepCapsuleRecord[];
  latestSegmentId?: string;
}

export interface ReferentReplayPicture {
  referentId: string;
  branchId: string;
  anchor: string;
  estimates: ReferentStateRecord[];
  continuityHistory: StateEstimate["continuity"][];
  latestContinuity: StateEstimate["continuity"];
}

export interface BranchInspectabilitySurface {
  branchId: string;
  latestSegmentId?: string;
  latestHappeningId?: string;
  latestHappeningLabel?: string;
  latestHappeningObservedAt?: string;
  latestSleepCapsuleId?: string;
  latestSleepAnchor?: string;
}

export interface ReferentInspectabilitySurface {
  referentId: string;
  branchId: string;
  anchor: string;
  continuity: StateEstimate["continuity"];
  reasoning: string;
  estimatedAt: string;
  basedOnBindingIds: string[];
  sourceRecordId: string;
}

export interface ArtifactInspectabilitySurface {
  artifactId: string;
  kind: string;
  payloadType: ExchangeArtifactPayload["payloadType"];
  payloadId: string;
  emittedAt: string;
  sourceIds: string[];
  payloadSourceIds: string[];
  emitterId?: string;
  basisId?: string;
  provenanceSource?: string;
  provenanceNote?: string;
  summary: string;
}

export interface InspectabilityPicture {
  namespaceParts: string[];
  branchClaims: BranchInspectabilitySurface[];
  referentClaims: ReferentInspectabilitySurface[];
  contextClaims: ContextInspectabilitySurface[];
  portalClaims: PortalInspectabilitySurface[];
  comparisonClaims: ComparisonInspectabilitySurface[];
  artifactClaims: ArtifactInspectabilitySurface[];
}

export interface ContextInspectabilitySurface {
  contextId: string;
  branchId: string;
  label: string;
  artifactId: string;
  parentContextId?: string;
  containmentPolicy?: string;
}

export interface PortalInspectabilitySurface {
  portalId: string;
  branchId: string;
  label: string;
  sourceContextId: string;
  targetContextId: string;
  exposureRule: string;
  artifactId: string;
  transform?: string;
}

export interface ComparisonInspectabilitySurface {
  comparisonId: string;
  artifactId: string;
  label: string;
  sourceIds: string[];
  basisId?: string;
  projection?: string;
  comparability: string;
  compatibility: string;
  equivalence?: string;
  convergence: string;
  reasonCodes: string[];
  evidenceSourceIds: string[];
  summary?: string;
}

export type ContinuitySituationState = StateEstimate["continuity"] | "mixed" | "none";

export type ContinuitySituationAmbiguityState =
  | "none"
  | "continuity"
  | "context-placement"
  | "mixed";

export interface ContinuitySituationSurface {
  namespaceParts: string[];
  primaryBranchId?: string;
  primaryContextId?: string;
  portalVisibleContextIds: string[];
  activeReferentIds: string[];
  continuityState: ContinuitySituationState;
  ambiguityState: ContinuitySituationAmbiguityState;
  reasonCodes: string[];
  evidenceSourceIds: string[];
}

export interface ContinuitySituationOptions {
  asOf?: string;
}

export type TransitionDecisionKind = "stay" | "branch" | "cross-context" | "ambiguous";

export interface ContinuityTransitionDecisionSurface {
  namespaceParts: string[];
  fromAsOf: string;
  toAsOf: string;
  transitionKind: TransitionDecisionKind;
  fromSituation: ContinuitySituationSurface;
  toSituation: ContinuitySituationSurface;
  reasonCodes: string[];
  evidenceSourceIds: string[];
}

export interface ContextTemporalClaim {
  artifactId: string;
  emittedAt: string;
  contextId: string;
  branchId: string;
  label: string;
  parentContextId?: string;
  containmentPolicy?: string;
}

export interface PortalTemporalClaim {
  artifactId: string;
  emittedAt: string;
  portalId: string;
  branchId: string;
  label: string;
  sourceContextId: string;
  targetContextId: string;
  exposureRule: string;
  transform?: string;
}

export interface PrimaryContextResolutionEntry {
  asOf: string;
  sourceEventId: string;
  sourceEventType: "context-artifact" | "portal-artifact" | "branch-happening" | "sleep-capsule";
  primaryContextId?: string;
  ambiguityState: ContinuitySituationAmbiguityState;
  reasonCodes: string[];
  evidenceSourceIds: string[];
}

export interface ContextPortalTemporalReplay {
  namespaceParts: string[];
  contextTimeline: ContextTemporalClaim[];
  portalTimeline: PortalTemporalClaim[];
  primaryContextTimeline: PrimaryContextResolutionEntry[];
}

export interface FollowOnLabOptions {
  storageDir: string;
  namespaceParts?: string[] | undefined;
  now?: (() => string) | undefined;
}

export interface MultiSegmentContinuityLabReport {
  replay: CorestoreReplaySummary;
  carriedNucleusIds: string[];
}

export interface ReferentTrackingLabReport {
  replay: CorestoreReplaySummary;
  continuityHistory: StateEstimate["continuity"][];
}

export interface ExchangeArtifactLabReport {
  replay: CorestoreReplaySummary;
  payloadKinds: ExchangeArtifactPayload["payloadType"][];
}

export interface ObservedContinuityNarrativeEntry {
  step: "basis-revision" | "fork";
  claim: string;
  explanation: string;
  evidenceSourceIds: string[];
}

export interface ContinuityEvolutionForkLabReport {
  replay: CorestoreReplaySummary;
  inspectability: InspectabilityPicture;
  evolvingBranchPicture: BranchReplayPicture;
  forkedBranchPicture: BranchReplayPicture;
  transition: ContinuityTransitionDecisionSurface;
  observedNarrative: ObservedContinuityNarrativeEntry[];
  summary: {
    evolvingBranchId: string;
    forkedBranchId: string;
    trackedReferentId: string;
    sourceNucleusId: string;
    inheritedNucleusId: string;
    continuityShift: {
      from: StateEstimate["continuity"];
      to: StateEstimate["continuity"];
    };
    transitionKind: TransitionDecisionKind;
    lineageRelation: string;
  };
}

export interface ComparisonPressureLabReport {
  replay: CorestoreReplaySummary;
  inspectability: InspectabilityPicture;
  observedComparisons: Array<{
    comparisonId: string;
    label: string;
    comparability: string;
    compatibility: string;
    reasonCodes: string[];
    evidenceSourceIds: string[];
  }>;
}

export interface EquivalencePressureLabReport {
  replay: CorestoreReplaySummary;
  inspectability: InspectabilityPicture;
  observedComparisons: Array<{
    comparisonId: string;
    label: string;
    basisId?: string;
    projection?: string;
    equivalence?: string;
    reasonCodes: string[];
  }>;
}

export interface ConvergencePressureLabReport {
  replay: CorestoreReplaySummary;
  inspectability: InspectabilityPicture;
  observedComparisons: Array<{
    comparisonId: string;
    label: string;
    convergence: string;
    reasonCodes: string[];
    evidenceSourceIds: string[];
  }>;
}

export async function runMultiSegmentContinuityLab(
  options: FollowOnLabOptions,
): Promise<MultiSegmentContinuityLabReport> {
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDir,
    namespaceParts: options.namespaceParts,
  });
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "continuity-replay-basis",
      dimensions: ["position", "motion", "time"],
    });
    const observer = substrate.createObserver({
      label: "continuity-observer",
      basisId: basis.id,
    });
    const branch = substrate.createBranch({
      role: "observer",
      label: "continuity-branch",
      basisId: basis.id,
      observerId: observer.id,
    });

    const carriedNucleusIds: string[] = [];
    let inheritedNucleusIds: string[] = [];

    for (let cycle = 0; cycle < 3; cycle += 1) {
      const segment = substrate.openSegment({
        branchId: branch.id,
        inheritedNucleusIds,
        summary: `wake cycle ${cycle + 1}`,
      });
      const trigger = substrate.createTrigger({
        label: `trigger cycle ${cycle + 1}`,
        threshold: "delta > threshold",
        basisId: basis.id,
      });
      const happening = substrate.createHappening({
        branchId: branch.id,
        segmentId: segment.id,
        label: `continuity event ${cycle + 1}`,
        triggerIds: [trigger.id],
        salience: 0.75 + cycle * 0.05,
      });
      await lab.appendBranchHappening({
        branchId: branch.id,
        segmentId: segment.id,
        happening,
      });

      const carry = substrate.sealSegment(segment.id, {
        anchor: `continuity-anchor-${cycle + 1}`,
      });
      const sealedSegment = substrate.state.segments.get(carry.segmentId);
      if (!sealedSegment) {
        throw new Error(`missing sealed segment ${carry.segmentId}`);
      }
      await lab.appendSleepCapsule({
        branchId: branch.id,
        segment: sealedSegment,
        nucleus: carry.nucleus,
      });

      carriedNucleusIds.push(carry.nucleus.id);
      inheritedNucleusIds = [carry.nucleus.id];
    }

    return {
      replay: await reconstructLocalPicture(lab),
      carriedNucleusIds,
    };
  } finally {
    await lab.close();
  }
}

export async function runReferentTrackingLab(
  options: FollowOnLabOptions,
): Promise<ReferentTrackingLabReport> {
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDir,
    namespaceParts: options.namespaceParts,
  });
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "referent-tracking-basis",
      dimensions: ["appearance", "location"],
    });
    const observer = substrate.createObserver({
      label: "tracking-observer",
      basisId: basis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "tracking-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "tracked-referent-branch",
      basisId: basis.id,
    });
    const referent = substrate.createReferent({
      label: "tracked-referent",
      anchor: "tracked-referent-anchor",
      branchId: referentBranch.id,
    });
    const binding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: observerBranch.id,
      referentBranchId: referentBranch.id,
      referentId: referent.id,
      strength: 0.78,
    });

    const continuityHistory: StateEstimate["continuity"][] = [
      "continuing",
      "ambiguous",
      "broken",
    ];

    for (const continuity of continuityHistory) {
      const estimate = substrate.createStateEstimate({
        referentId: referent.id,
        branchId: referentBranch.id,
        continuity,
        reasoning: `${continuity} continuity judgment preserved as append-only history`,
        basedOnBindingIds: [binding.id],
      });
      await lab.appendReferentState({
        referent,
        estimate,
      });
    }

    return {
      replay: await reconstructLocalPicture(lab),
      continuityHistory,
    };
  } finally {
    await lab.close();
  }
}

export async function runExchangeArtifactLab(
  options: FollowOnLabOptions,
): Promise<ExchangeArtifactLabReport> {
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDir,
    namespaceParts: options.namespaceParts,
  });
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "artifact-basis",
      dimensions: ["position", "identity-claim"],
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
    const sourceReferentBranch = substrate.createBranch({
      role: "referent",
      label: "artifact-source-branch",
      basisId: basis.id,
    });
    const sourceReferent = substrate.createReferent({
      label: "artifact-source-referent",
      anchor: "artifact-source-anchor",
      branchId: sourceReferentBranch.id,
    });
    const successor = substrate.forkBranch({
      sourceBranchId: sourceReferentBranch.id,
      label: "artifact-successor-branch",
      role: "referent",
      relation: "continuation",
      basisId: basis.id,
    });
    const binding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: observerBranch.id,
      referentBranchId: sourceReferentBranch.id,
      referentId: sourceReferent.id,
      strength: 0.84,
    });
    const lineage = successor.lineage;
    const view = substrate.createView({
      kind: "binding-map",
      label: "artifact-binding-map",
      sourceIds: [observerBranch.id, sourceReferent.id, binding.id],
      projection: "derive exchange-facing binding map",
    });

    const payloadKinds: ExchangeArtifactPayload["payloadType"][] = [];

    const viewArtifact = substrate.createArtifactEnvelope({
      kind: "view",
      label: "artifact-view-envelope",
      sourceIds: [observerBranch.id, sourceReferent.id],
      payloadIds: [view.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "exchange-artifact-lab",
      },
    });
    await lab.appendViewArtifact({
      artifact: viewArtifact,
      view,
    });
    payloadKinds.push("view");

    const bindingArtifact = substrate.createArtifactEnvelope({
      kind: "binding",
      label: "artifact-binding-envelope",
      sourceIds: [binding.id],
      payloadIds: [binding.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "exchange-artifact-lab",
      },
    });
    await lab.appendBindingArtifact({
      artifact: bindingArtifact,
      binding,
    });
    payloadKinds.push("binding");

    const lineageArtifact = substrate.createArtifactEnvelope({
      kind: "lineage-claim",
      label: "artifact-lineage-envelope",
      sourceIds: [sourceReferentBranch.id, successor.branch.id],
      payloadIds: [lineage.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "exchange-artifact-lab",
      },
    });
    await lab.appendLineageClaimArtifact({
      artifact: lineageArtifact,
      lineage,
    });
    payloadKinds.push("lineage-claim");

    const receipt: ReceiptPayload = {
      id: "exchange-receipt",
      label: "exchange-receipt",
      summary: "Explicit artifact emission occurred without sharing raw continuity.",
      sourceIds: [viewArtifact.id, bindingArtifact.id, lineageArtifact.id],
    };
    const receiptArtifact = substrate.createArtifactEnvelope({
      kind: "receipt",
      label: "artifact-receipt-envelope",
      sourceIds: [viewArtifact.id, bindingArtifact.id, lineageArtifact.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "exchange-artifact-lab",
      },
    });
    await lab.appendReceiptArtifact({
      artifact: receiptArtifact,
      receipt,
    });
    payloadKinds.push("receipt");

    return {
      replay: await reconstructLocalPicture(lab),
      payloadKinds,
    };
  } finally {
    await lab.close();
  }
}

export async function runContinuityEvolutionForkLab(
  options: FollowOnLabOptions,
): Promise<ContinuityEvolutionForkLabReport> {
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDir,
    namespaceParts: options.namespaceParts,
  });
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});

  try {
    const fullBasis = substrate.createBasis({
      label: "finish-line-rgb-basis",
      dimensions: ["red", "green", "blue", "position"],
    });
    const degradedBasis = substrate.createBasis({
      label: "finish-line-rb-basis",
      dimensions: ["red", "blue", "position"],
      partial: true,
      degradedFrom: [fullBasis.id],
      revisedFrom: [fullBasis.id],
    });
    const observer = substrate.createObserver({
      label: "finish-line-camera",
      basisId: fullBasis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "finish-line-camera-branch",
      basisId: fullBasis.id,
      observerId: observer.id,
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "finish-line-cube-branch",
      basisId: fullBasis.id,
    });
    const referent = substrate.createReferent({
      label: "finish-line-cube",
      anchor: "finish-line-cube-anchor",
      branchId: referentBranch.id,
    });
    const binding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: observerBranch.id,
      referentBranchId: referentBranch.id,
      referentId: referent.id,
      strength: 0.91,
    });

    const sourceSegment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "full-basis continuity before revision",
    });
    const initialHappening = {
      id: "finish-line-evolution-happening-1",
      branchId: observerBranch.id,
      segmentId: sourceSegment.id,
      label: "full-color observation before capability loss",
      triggerIds: [],
      observedAt: "2026-04-22T01:00:00.000Z",
    };
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: sourceSegment.id,
      happening: initialHappening,
    });
    await lab.appendReferentState({
      referent,
      estimate: {
        id: "finish-line-evolution-estimate-1",
        referentId: referent.id,
        branchId: referentBranch.id,
        estimatedAt: "2026-04-22T01:00:10.000Z",
        continuity: "continuing",
        reasoning: "full color basis preserves enough distinction for a continuing judgment",
        basedOnBindingIds: [binding.id],
        metadata: {
          effectiveBasisId: fullBasis.id,
        },
      },
    });

    const revisedBranch = substrate.reviseBranchBasis({
      branchId: observerBranch.id,
      basisId: degradedBasis.id,
      reason: "camera lost the ability to preserve green distinctions",
    });
    const revisionView = substrate.createView({
      kind: "segment-summary",
      label: "basis-revision-surface",
      sourceIds: [observerBranch.id, fullBasis.id, degradedBasis.id],
      projection:
        "observer branch revised basis from rgb to rb without forcing a branch split",
      metadata: {
        basisRevision: {
          fromBasisId: fullBasis.id,
          toBasisId: degradedBasis.id,
        },
      },
    });
    const revisionArtifact = substrate.createArtifactEnvelope({
      kind: "view",
      label: "basis-revision-artifact",
      sourceIds: [observerBranch.id, fullBasis.id, degradedBasis.id],
      payloadIds: [revisionView.id],
      locality: "shared-candidate",
      provenance: {
        basisId: degradedBasis.id,
        emitterId: observer.id,
        emittedAt: "2026-04-22T01:00:20.000Z",
        source: "continuity-evolution-fork-lab",
      },
    });
    await lab.appendViewArtifact({
      artifact: revisionArtifact,
      view: revisionView,
    });

    const revisedHappening = {
      id: "finish-line-evolution-happening-2",
      branchId: revisedBranch.id,
      segmentId: sourceSegment.id,
      label: "degraded-basis observation after capability loss",
      triggerIds: [],
      observedAt: "2026-04-22T01:00:30.000Z",
    };
    await lab.appendBranchHappening({
      branchId: revisedBranch.id,
      segmentId: sourceSegment.id,
      happening: revisedHappening,
    });
    await lab.appendReferentState({
      referent,
      estimate: {
        id: "finish-line-evolution-estimate-2",
        referentId: referent.id,
        branchId: referentBranch.id,
        estimatedAt: "2026-04-22T01:00:40.000Z",
        continuity: "ambiguous",
        reasoning:
          "green loss weakens re-identification enough to keep continuity unresolved",
        basedOnBindingIds: [binding.id],
        metadata: {
          effectiveBasisId: degradedBasis.id,
        },
      },
    });

    const sourceCarry = substrate.sealSegment(sourceSegment.id, {
      anchor: "finish-line-source-anchor",
    });
    const sealedSourceSegment = substrate.state.segments.get(sourceCarry.segmentId);
    if (!sealedSourceSegment) {
      throw new Error(`missing sealed source segment ${sourceCarry.segmentId}`);
    }
    await lab.appendSleepCapsule({
      branchId: observerBranch.id,
      segment: {
        ...sealedSourceSegment,
        closedAt: "2026-04-22T01:01:00.000Z",
      },
      nucleus: sourceCarry.nucleus,
    });

    const fork = substrate.forkBranch({
      sourceBranchId: observerBranch.id,
      label: "finish-line-camera-branch-fork",
      relation: "split",
      lineageEvidence: "fork pressure exceeded simple basis revision and produced a successor branch",
    });
    const childSegment = substrate.openSegment({
      branchId: fork.branch.id,
      inheritedNucleusIds: [sourceCarry.nucleus.id],
      summary: "forked continuity after pressure exceeded revision-only posture",
    });
    const childHappening = {
      id: "finish-line-evolution-happening-3",
      branchId: fork.branch.id,
      segmentId: childSegment.id,
      label: "forked successor observation after split pressure",
      triggerIds: [],
      observedAt: "2026-04-22T01:01:10.000Z",
    };
    await lab.appendBranchHappening({
      branchId: fork.branch.id,
      segmentId: childSegment.id,
      happening: childHappening,
    });

    const childCarry = substrate.sealSegment(childSegment.id, {
      anchor: "finish-line-child-anchor",
    });
    const sealedChildSegment = substrate.state.segments.get(childCarry.segmentId);
    if (!sealedChildSegment) {
      throw new Error(`missing sealed child segment ${childCarry.segmentId}`);
    }
    await lab.appendSleepCapsule({
      branchId: fork.branch.id,
      segment: {
        ...sealedChildSegment,
        closedAt: "2026-04-22T01:01:20.000Z",
      },
      nucleus: childCarry.nucleus,
    });

    const lineageArtifact = substrate.createArtifactEnvelope({
      kind: "lineage-claim",
      label: "finish-line-fork-lineage-artifact",
      sourceIds: [observerBranch.id, fork.branch.id],
      payloadIds: [fork.lineage.id],
      locality: "shared-candidate",
      provenance: {
        basisId: degradedBasis.id,
        emitterId: observer.id,
        emittedAt: "2026-04-22T01:01:15.000Z",
        source: "continuity-evolution-fork-lab",
      },
    });
    await lab.appendLineageClaimArtifact({
      artifact: lineageArtifact,
      lineage: fork.lineage,
    });

    const replay = await reconstructLocalPicture(lab);
    const inspectability = await reconstructInspectabilityPicture(lab);
    const evolvingBranchPicture = await reconstructBranchPicture(lab, observerBranch.id);
    const forkedBranchPicture = await reconstructBranchPicture(lab, fork.branch.id);
    const transition = await reconstructTransitionDecision(lab, {
      fromAsOf: "2026-04-22T01:00:10.000Z",
      toAsOf: "2026-04-22T01:00:40.000Z",
    });

    return {
      replay,
      inspectability,
      evolvingBranchPicture,
      forkedBranchPicture,
      transition,
      observedNarrative: [
        {
          step: "basis-revision",
          claim: "one branch can survive capability revision without forcing a fork",
          explanation:
            "The same observer branch remained active while a basis-revision artifact was emitted and the tracked referent judgment weakened from continuing to ambiguous.",
          evidenceSourceIds: [
            revisionArtifact.id,
            "finish-line-evolution-estimate-1",
            "finish-line-evolution-estimate-2",
          ],
        },
        {
          step: "fork",
          claim: "fork pressure creates a successor branch with inherited continuity rather than erasing ancestry",
          explanation:
            "The successor branch carries the source nucleus forward, records its own wake, and publishes an explicit split lineage claim instead of pretending the fork replaced prior history.",
          evidenceSourceIds: [sourceCarry.nucleus.id, childCarry.nucleus.id, lineageArtifact.id],
        },
      ],
      summary: {
        evolvingBranchId: observerBranch.id,
        forkedBranchId: fork.branch.id,
        trackedReferentId: referent.id,
        sourceNucleusId: sourceCarry.nucleus.id,
        inheritedNucleusId: childCarry.nucleus.id,
        continuityShift: {
          from: "continuing",
          to: "ambiguous",
        },
        transitionKind: transition.transitionKind,
        lineageRelation: fork.lineage.relation,
      },
    };
  } finally {
    await lab.close();
  }
}

export async function runComparisonPressureLab(
  options: FollowOnLabOptions,
): Promise<ComparisonPressureLabReport> {
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDir,
    namespaceParts: options.namespaceParts,
  });
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});

  try {
    const sharedBasis = substrate.createBasis({
      label: "comparison-shared-basis",
      dimensions: ["shape", "position"],
    });
    const foreignBasis = substrate.createBasis({
      label: "comparison-foreign-basis",
      dimensions: ["temperature", "chemical-signature"],
      partial: true,
    });
    const observerA = substrate.createObserver({
      label: "comparison-observer-a",
      basisId: sharedBasis.id,
    });
    const observerB = substrate.createObserver({
      label: "comparison-observer-b",
      basisId: sharedBasis.id,
    });
    const observerC = substrate.createObserver({
      label: "comparison-observer-c",
      basisId: foreignBasis.id,
    });
    const branchA = substrate.createBranch({
      role: "observer",
      label: "comparison-branch-a",
      basisId: sharedBasis.id,
      observerId: observerA.id,
    });
    const branchB = substrate.createBranch({
      role: "observer",
      label: "comparison-branch-b",
      basisId: sharedBasis.id,
      observerId: observerB.id,
    });
    const branchC = substrate.createBranch({
      role: "observer",
      label: "comparison-branch-c",
      basisId: foreignBasis.id,
      observerId: observerC.id,
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "comparison-ball-branch",
      basisId: sharedBasis.id,
    });
    const ball = substrate.createReferent({
      label: "comparison-ball",
      anchor: "comparison-ball-anchor",
      branchId: referentBranch.id,
    });

    const bindingA = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branchA.id,
      referentBranchId: referentBranch.id,
      referentId: ball.id,
    });
    const bindingB = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branchB.id,
      referentBranchId: referentBranch.id,
      referentId: ball.id,
    });
    const bindingC = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branchC.id,
      referentBranchId: referentBranch.id,
      referentId: ball.id,
    });

    const estimateA = substrate.createStateEstimate({
      referentId: ball.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "observer A keeps a stable shared-basis judgment",
      basedOnBindingIds: [bindingA.id],
    });
    const estimateB = substrate.createStateEstimate({
      referentId: ball.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "observer B agrees under the same shared basis",
      basedOnBindingIds: [bindingB.id],
    });
    const estimateConflict = substrate.createStateEstimate({
      referentId: ball.id,
      branchId: referentBranch.id,
      continuity: "broken",
      reasoning: "observer B now carries a contradictory shared-basis claim",
      basedOnBindingIds: [bindingB.id],
    });
    const estimateForeign = substrate.createStateEstimate({
      referentId: ball.id,
      branchId: referentBranch.id,
      continuity: "ambiguous",
      reasoning: "observer C tracks with foreign basis dimensions only",
      basedOnBindingIds: [bindingC.id],
    });

    const compatibleComparison = substrate.createComparisonSurface({
      label: "shared-basis-compatible-comparison",
      sourceIds: [estimateA.id, estimateB.id],
      basisId: sharedBasis.id,
      projection: "shared shape-position projection",
      comparability: "strong",
      compatibility: "compatible",
      equivalence: "unresolved",
      convergence: "not-forced",
      reasonCodes: ["shared-basis-available", "no-contradiction-under-projection"],
      evidenceSourceIds: [bindingA.id, bindingB.id, estimateA.id, estimateB.id],
      summary: "two shared-basis estimates remain comparable and compatible",
    });
    await lab.appendComparisonArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "comparability-surface",
        label: "shared-basis-compatible-artifact",
        sourceIds: [compatibleComparison.id, estimateA.id, estimateB.id],
        payloadIds: [compatibleComparison.id],
        provenance: {
          basisId: sharedBasis.id,
          emitterId: observerA.id,
          source: "comparison-pressure-lab",
        },
      }),
      comparison: compatibleComparison,
    });

    const incompatibleComparison = substrate.createComparisonSurface({
      label: "shared-basis-incompatible-comparison",
      sourceIds: [estimateA.id, estimateConflict.id],
      basisId: sharedBasis.id,
      projection: "shared shape-position projection",
      comparability: "strong",
      compatibility: "incompatible",
      equivalence: "none",
      convergence: "divergent",
      reasonCodes: ["shared-basis-available", "contradictory-continuity-claim"],
      evidenceSourceIds: [bindingA.id, bindingB.id, estimateA.id, estimateConflict.id],
      summary: "shared-basis comparison reveals contradiction rather than coexistence",
    });
    await lab.appendComparisonArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "comparability-surface",
        label: "shared-basis-incompatible-artifact",
        sourceIds: [incompatibleComparison.id, estimateA.id, estimateConflict.id],
        payloadIds: [incompatibleComparison.id],
        provenance: {
          basisId: sharedBasis.id,
          emitterId: observerB.id,
          source: "comparison-pressure-lab",
        },
      }),
      comparison: incompatibleComparison,
    });

    const incomparableComparison = substrate.createComparisonSurface({
      label: "foreign-basis-incomparable-comparison",
      sourceIds: [estimateA.id, estimateForeign.id],
      basisId: foreignBasis.id,
      comparability: "none",
      compatibility: "unknown",
      equivalence: "unresolved",
      convergence: "not-forced",
      reasonCodes: ["no-shared-projection"],
      evidenceSourceIds: [bindingA.id, bindingC.id, estimateA.id, estimateForeign.id],
      summary: "comparison is not claimed because no useful shared projection is available",
    });
    await lab.appendComparisonArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "comparability-surface",
        label: "foreign-basis-incomparable-artifact",
        sourceIds: [incomparableComparison.id, estimateA.id, estimateForeign.id],
        payloadIds: [incomparableComparison.id],
        provenance: {
          basisId: foreignBasis.id,
          emitterId: observerC.id,
          source: "comparison-pressure-lab",
        },
      }),
      comparison: incomparableComparison,
    });

    const replay = await reconstructLocalPicture(lab);
    const inspectability = await reconstructInspectabilityPicture(lab);

    return {
      replay,
      inspectability,
      observedComparisons: replay.comparisonSurfaces.map((surface) => ({
        comparisonId: surface.comparisonId,
        label: surface.label,
        comparability: surface.comparability,
        compatibility: surface.compatibility,
        reasonCodes: [...surface.reasonCodes],
        evidenceSourceIds: [...surface.evidenceSourceIds],
      })),
    };
  } finally {
    await lab.close();
  }
}

export async function runEquivalencePressureLab(
  options: FollowOnLabOptions,
): Promise<EquivalencePressureLabReport> {
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDir,
    namespaceParts: options.namespaceParts,
  });
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});

  try {
    const richBasis = substrate.createBasis({
      label: "equivalence-rich-basis",
      dimensions: ["shape", "color", "position"],
    });
    const coarseBasis = substrate.createBasis({
      label: "equivalence-coarse-basis",
      dimensions: ["shape", "position"],
      partial: true,
      projectedFrom: [richBasis.id],
    });
    const observer = substrate.createObserver({
      label: "equivalence-observer",
      basisId: richBasis.id,
    });
    const branch = substrate.createBranch({
      role: "observer",
      label: "equivalence-observer-branch",
      basisId: richBasis.id,
      observerId: observer.id,
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "equivalence-referent-branch",
      basisId: richBasis.id,
    });
    const referent = substrate.createReferent({
      label: "equivalence-cube",
      anchor: "equivalence-cube-anchor",
      branchId: referentBranch.id,
    });
    const binding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branch.id,
      referentBranchId: referentBranch.id,
      referentId: referent.id,
    });
    const firstEstimate = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "first observation preserves coarse and rich distinctions",
      basedOnBindingIds: [binding.id],
    });
    const secondEstimate = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "second observation preserves shape and position but color remains uncertain",
      basedOnBindingIds: [binding.id],
    });

    const coarseComparison = substrate.createComparisonSurface({
      label: "coarse-equivalence-comparison",
      sourceIds: [firstEstimate.id, secondEstimate.id],
      basisId: coarseBasis.id,
      projection: "shape-position coarse projection",
      comparability: "strong",
      compatibility: "compatible",
      equivalence: "strong",
      convergence: "not-forced",
      reasonCodes: ["coarse-projection-preserves-distinctions", "same-enough-under-projection"],
      evidenceSourceIds: [binding.id, firstEstimate.id, secondEstimate.id],
      summary: "coarse projection supports same-enough judgment without settling identity globally",
    });
    await lab.appendComparisonArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "comparability-surface",
        label: "coarse-equivalence-artifact",
        sourceIds: [coarseComparison.id, firstEstimate.id, secondEstimate.id],
        payloadIds: [coarseComparison.id],
        provenance: {
          basisId: coarseBasis.id,
          emitterId: observer.id,
          source: "equivalence-pressure-lab",
        },
      }),
      comparison: coarseComparison,
    });

    const richComparison = substrate.createComparisonSurface({
      label: "rich-equivalence-comparison",
      sourceIds: [firstEstimate.id, secondEstimate.id],
      basisId: richBasis.id,
      projection: "shape-color-position rich projection",
      comparability: "strong",
      compatibility: "compatible",
      equivalence: "unresolved",
      convergence: "not-forced",
      reasonCodes: ["rich-projection-available", "color-distinction-underdetermined"],
      evidenceSourceIds: [binding.id, firstEstimate.id, secondEstimate.id],
      summary: "richer basis keeps equivalence provisional instead of collapsing to identity",
    });
    await lab.appendComparisonArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "comparability-surface",
        label: "rich-equivalence-artifact",
        sourceIds: [richComparison.id, firstEstimate.id, secondEstimate.id],
        payloadIds: [richComparison.id],
        provenance: {
          basisId: richBasis.id,
          emitterId: observer.id,
          source: "equivalence-pressure-lab",
        },
      }),
      comparison: richComparison,
    });

    const replay = await reconstructLocalPicture(lab);
    const inspectability = await reconstructInspectabilityPicture(lab);

    return {
      replay,
      inspectability,
      observedComparisons: replay.comparisonSurfaces.map((surface) => ({
        comparisonId: surface.comparisonId,
        label: surface.label,
        reasonCodes: [...surface.reasonCodes],
        ...(surface.basisId ? { basisId: surface.basisId } : {}),
        ...(surface.projection ? { projection: surface.projection } : {}),
        ...(surface.equivalence ? { equivalence: surface.equivalence } : {}),
      })),
    };
  } finally {
    await lab.close();
  }
}

export async function runConvergencePressureLab(
  options: FollowOnLabOptions,
): Promise<ConvergencePressureLabReport> {
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDir,
    namespaceParts: options.namespaceParts,
  });
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "convergence-basis",
      dimensions: ["shape", "position", "motion"],
    });
    const observer = substrate.createObserver({
      label: "convergence-observer",
      basisId: basis.id,
    });
    const branch = substrate.createBranch({
      role: "observer",
      label: "convergence-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "convergence-referent-branch",
      basisId: basis.id,
    });
    const referent = substrate.createReferent({
      label: "convergence-ball",
      anchor: "convergence-ball-anchor",
      branchId: referentBranch.id,
    });
    const binding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branch.id,
      referentBranchId: referentBranch.id,
      referentId: referent.id,
    });
    const estimateA = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "first witness stays aligned with the tracked ball",
      basedOnBindingIds: [binding.id],
    });
    const estimateB = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "second witness still clusters around the same candidate ball",
      basedOnBindingIds: [binding.id],
    });
    const estimateC = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "broken",
      reasoning: "third witness diverges sharply from the clustered reading",
      basedOnBindingIds: [binding.id],
    });

    const clusteredComparison = substrate.createComparisonSurface({
      label: "clustered-convergence-comparison",
      sourceIds: [estimateA.id, estimateB.id],
      basisId: basis.id,
      projection: "shared motion-shape projection",
      comparability: "strong",
      compatibility: "compatible",
      equivalence: "unresolved",
      convergence: "clustered",
      reasonCodes: ["shared-projection-available", "set-level-clustering-observed"],
      evidenceSourceIds: [binding.id, estimateA.id, estimateB.id],
      summary: "several claims cluster, but the cluster remains evidence rather than authority",
    });
    await lab.appendComparisonArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "comparability-surface",
        label: "clustered-convergence-artifact",
        sourceIds: [clusteredComparison.id, estimateA.id, estimateB.id],
        payloadIds: [clusteredComparison.id],
        provenance: {
          basisId: basis.id,
          emitterId: observer.id,
          source: "convergence-pressure-lab",
        },
      }),
      comparison: clusteredComparison,
    });

    const divergentComparison = substrate.createComparisonSurface({
      label: "divergent-convergence-comparison",
      sourceIds: [estimateA.id, estimateC.id],
      basisId: basis.id,
      projection: "shared motion-shape projection",
      comparability: "strong",
      compatibility: "incompatible",
      equivalence: "none",
      convergence: "divergent",
      reasonCodes: ["shared-projection-available", "set-level-clustering-broken"],
      evidenceSourceIds: [binding.id, estimateA.id, estimateC.id],
      summary: "divergence is recorded as pressure, not as a truth verdict",
    });
    await lab.appendComparisonArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "comparability-surface",
        label: "divergent-convergence-artifact",
        sourceIds: [divergentComparison.id, estimateA.id, estimateC.id],
        payloadIds: [divergentComparison.id],
        provenance: {
          basisId: basis.id,
          emitterId: observer.id,
          source: "convergence-pressure-lab",
        },
      }),
      comparison: divergentComparison,
    });

    const replay = await reconstructLocalPicture(lab);
    const inspectability = await reconstructInspectabilityPicture(lab);

    return {
      replay,
      inspectability,
      observedComparisons: replay.comparisonSurfaces.map((surface) => ({
        comparisonId: surface.comparisonId,
        label: surface.label,
        convergence: surface.convergence,
        reasonCodes: [...surface.reasonCodes],
        evidenceSourceIds: [...surface.evidenceSourceIds],
      })),
    };
  } finally {
    await lab.close();
  }
}

export async function reconstructLocalPicture(
  lab: Pick<
    FirstSeriousCorestoreLabHandle,
    | "handle"
    | "readBranchHappenings"
    | "readSleepCapsules"
    | "readReferentState"
    | "readExchangeArtifacts"
  >,
): Promise<CorestoreReplaySummary> {
  const branchHappenings = await lab.readBranchHappenings();
  const sleepCapsules = await lab.readSleepCapsules();
  const referentState = await lab.readReferentState();
  const exchangeArtifacts = await lab.readExchangeArtifacts();

  const branchIds = new Set<string>();
  const segmentIds = new Set<string>();
  const referentIds = new Set<string>();
  const latestContinuityByReferentId = new Map<string, StateEstimate["continuity"]>();
  const branchSurfaces = new Map<string, ReplayBranchSurface>();
  const referentSurfaces = new Map<string, ReplayReferentSurface>();

  for (const record of branchHappenings) {
    branchIds.add(record.branchId);
    segmentIds.add(record.segmentId);
    const branchSurface = getOrCreateBranchSurface(branchSurfaces, record.branchId);
    branchSurface.segmentIds.push(record.segmentId);
    branchSurface.branchHappeningIds.push(record.happening.id);
    branchSurface.branchHappeningCount += 1;
    branchSurface.latestSegmentId = record.segmentId;
    branchSurface.latestHappeningLabel = record.happening.label;
    branchSurface.latestHappeningObservedAt = record.happening.observedAt;
  }
  for (const record of sleepCapsules) {
    branchIds.add(record.branchId);
    segmentIds.add(record.segmentId);
    const branchSurface = getOrCreateBranchSurface(branchSurfaces, record.branchId);
    if (!branchSurface.segmentIds.includes(record.segmentId)) {
      branchSurface.segmentIds.push(record.segmentId);
    }
    branchSurface.sleepCapsuleIds.push(record.nucleusId);
    branchSurface.sleepCapsuleCount += 1;
    branchSurface.latestSegmentId = record.segmentId;
    branchSurface.latestSleepAnchor = record.nucleus.anchor;
  }
  for (const record of referentState) {
    branchIds.add(record.branchId);
    referentIds.add(record.referentId);
    latestContinuityByReferentId.set(record.referentId, record.continuity);
    const referentSurface = getOrCreateReferentSurface(referentSurfaces, record);
    referentSurface.estimateIds.push(record.estimate.id);
    referentSurface.continuityHistory.push(record.continuity);
    referentSurface.reasoningHistory.push(record.estimate.reasoning);
    referentSurface.latestContinuity = record.continuity;
    referentSurface.latestReasoning = record.estimate.reasoning;
    referentSurface.latestEstimatedAt = record.estimate.estimatedAt;
    referentSurface.latestBasedOnBindingIds = [...record.estimate.basedOnBindingIds];
  }

  const artifactSurfaces = exchangeArtifacts.map((record) => {
    const surface: ReplayArtifactSurface = {
      artifactId: record.artifact.id,
      kind: record.artifact.kind,
      payloadType: record.payload.payloadType,
      payloadId: getPayloadId(record.payload),
      sourceIds: [...record.artifact.sourceIds],
      payloadSourceIds: getPayloadSourceIds(record.payload),
      locality: record.artifact.locality,
      emittedAt: record.artifact.provenance.emittedAt,
      summary: describeArtifactPayload(record.payload),
    };

    if (record.artifact.provenance.emitterId) {
      surface.emitterId = record.artifact.provenance.emitterId;
    }
    if (record.artifact.provenance.basisId) {
      surface.basisId = record.artifact.provenance.basisId;
    }
    if (record.artifact.provenance.source) {
      surface.provenanceSource = record.artifact.provenance.source;
    }
    if (record.artifact.provenance.note) {
      surface.provenanceNote = record.artifact.provenance.note;
    }

    return surface;
  });
  const contextSurfaces = exchangeArtifacts.flatMap((record) =>
    record.payload.payloadType === "context"
      ? [toReplayContextSurface(record.artifact.id, record.payload.context)]
      : [],
  );
  const portalSurfaces = exchangeArtifacts.flatMap((record) =>
    record.payload.payloadType === "portal"
      ? [toReplayPortalSurface(record.artifact.id, record.payload.portal)]
      : [],
  );
  const comparisonSurfaces = exchangeArtifacts.flatMap((record) =>
    record.payload.payloadType === "comparison"
      ? [toReplayComparisonSurface(record.artifact.id, record.payload.comparison)]
      : [],
  );

  return {
    namespaceParts: lab.handle.namespaceParts,
    branchHappeningCount: branchHappenings.length,
    sleepCapsuleCount: sleepCapsules.length,
    referentStateCount: referentState.length,
    exchangeArtifactCount: exchangeArtifacts.length,
    branchIds: [...branchIds],
    segmentIds: [...segmentIds],
    referentIds: [...referentIds],
    exchangePayloadKinds: exchangeArtifacts.map((record) => record.payload.payloadType),
    latestContinuityByReferentId: Object.fromEntries(latestContinuityByReferentId),
    branchSurfaces: [...branchSurfaces.values()],
    referentSurfaces: [...referentSurfaces.values()],
    artifactSurfaces,
    contextSurfaces,
    portalSurfaces,
    comparisonSurfaces,
  };
}

export async function reconstructBranchPicture(
  lab: Pick<FirstSeriousCorestoreLabHandle, "readBranchHappenings" | "readSleepCapsules">,
  branchId: string,
): Promise<BranchReplayPicture> {
  const happenings = (await lab.readBranchHappenings()).filter(
    (record) => record.branchId === branchId,
  );
  const sleepCapsules = (await lab.readSleepCapsules()).filter(
    (record) => record.branchId === branchId,
  );

  const latestSegmentId =
    sleepCapsules.at(-1)?.segmentId ?? happenings.at(-1)?.segmentId;

  const picture: BranchReplayPicture = {
    branchId,
    happenings,
    sleepCapsules,
  };
  if (latestSegmentId) {
    picture.latestSegmentId = latestSegmentId;
  }
  return picture;
}

export async function reconstructReferentPicture(
  lab: Pick<FirstSeriousCorestoreLabHandle, "readReferentState">,
  referentId: string,
): Promise<ReferentReplayPicture | undefined> {
  const estimates = (await lab.readReferentState()).filter(
    (record) => record.referentId === referentId,
  );
  const first = estimates[0];
  const latest = estimates.at(-1);

  if (!first || !latest) {
    return undefined;
  }

  return {
    referentId,
    branchId: first.branchId,
    anchor: first.anchor,
    estimates,
    continuityHistory: estimates.map((record) => record.continuity),
    latestContinuity: latest.continuity,
  };
}

export async function reconstructInspectabilityPicture(
  lab: Pick<
    FirstSeriousCorestoreLabHandle,
    | "handle"
    | "readBranchHappenings"
    | "readSleepCapsules"
    | "readReferentState"
    | "readExchangeArtifacts"
  >,
): Promise<InspectabilityPicture> {
  const branchHappenings = await lab.readBranchHappenings();
  const sleepCapsules = await lab.readSleepCapsules();
  const referentState = await lab.readReferentState();
  const exchangeArtifacts = await lab.readExchangeArtifacts();

  const branchClaimsById = new Map<string, BranchInspectabilitySurface>();
  for (const record of branchHappenings) {
    const existing = branchClaimsById.get(record.branchId) ?? { branchId: record.branchId };
    existing.latestSegmentId = record.segmentId;
    existing.latestHappeningId = record.happening.id;
    existing.latestHappeningLabel = record.happening.label;
    existing.latestHappeningObservedAt = record.happening.observedAt;
    branchClaimsById.set(record.branchId, existing);
  }
  for (const record of sleepCapsules) {
    const existing = branchClaimsById.get(record.branchId) ?? { branchId: record.branchId };
    existing.latestSegmentId = record.segmentId;
    existing.latestSleepCapsuleId = record.nucleusId;
    existing.latestSleepAnchor = record.nucleus.anchor;
    branchClaimsById.set(record.branchId, existing);
  }

  const referentClaims = referentState.map((record) => ({
    referentId: record.referentId,
    branchId: record.branchId,
    anchor: record.anchor,
    continuity: record.continuity,
    reasoning: record.estimate.reasoning,
    estimatedAt: record.estimate.estimatedAt,
    basedOnBindingIds: [...record.estimate.basedOnBindingIds],
    sourceRecordId: record.recordId,
  }));

  const artifactClaims = exchangeArtifacts.map((record) => {
    const claim: ArtifactInspectabilitySurface = {
      artifactId: record.artifact.id,
      kind: record.artifact.kind,
      payloadType: record.payload.payloadType,
      payloadId: getPayloadId(record.payload),
      emittedAt: record.artifact.provenance.emittedAt,
      sourceIds: [...record.artifact.sourceIds],
      payloadSourceIds: getPayloadSourceIds(record.payload),
      summary: describeArtifactPayload(record.payload),
    };

    if (record.artifact.provenance.emitterId) {
      claim.emitterId = record.artifact.provenance.emitterId;
    }
    if (record.artifact.provenance.basisId) {
      claim.basisId = record.artifact.provenance.basisId;
    }
    if (record.artifact.provenance.source) {
      claim.provenanceSource = record.artifact.provenance.source;
    }
    if (record.artifact.provenance.note) {
      claim.provenanceNote = record.artifact.provenance.note;
    }

    return claim;
  });
  const contextClaims = exchangeArtifacts.flatMap((record) =>
    record.payload.payloadType === "context"
      ? [toContextInspectabilitySurface(record.artifact.id, record.payload.context)]
      : [],
  );
  const portalClaims = exchangeArtifacts.flatMap((record) =>
    record.payload.payloadType === "portal"
      ? [toPortalInspectabilitySurface(record.artifact.id, record.payload.portal)]
      : [],
  );
  const comparisonClaims = exchangeArtifacts.flatMap((record) =>
    record.payload.payloadType === "comparison"
      ? [toComparisonInspectabilitySurface(record.artifact.id, record.payload.comparison)]
      : [],
  );

  return {
    namespaceParts: lab.handle.namespaceParts,
    branchClaims: [...branchClaimsById.values()],
    referentClaims,
    contextClaims,
    portalClaims,
    comparisonClaims,
    artifactClaims,
  };
}

export async function reconstructContinuitySituation(
  lab: Pick<
    FirstSeriousCorestoreLabHandle,
    | "handle"
    | "readBranchHappenings"
    | "readSleepCapsules"
    | "readReferentState"
    | "readExchangeArtifacts"
  >,
  options: ContinuitySituationOptions = {},
): Promise<ContinuitySituationSurface> {
  const branchHappenings = filterRecordsAsOf(
    await lab.readBranchHappenings(),
    options.asOf,
  );
  const sleepCapsules = filterRecordsAsOf(await lab.readSleepCapsules(), options.asOf);
  const referentState = filterRecordsAsOf(await lab.readReferentState(), options.asOf);
  const exchangeArtifacts = filterRecordsAsOf(await lab.readExchangeArtifacts(), options.asOf);

  const reasonCodes: string[] = [];
  const evidenceSourceIds: string[] = [];

  const latestBranchRecord = getLatestBranchEvidence(branchHappenings, sleepCapsules);
  const primaryBranchId = latestBranchRecord?.branchId;
  if (latestBranchRecord) {
    pushUnique(reasonCodes, "latest-branch-activity");
    pushUnique(evidenceSourceIds, latestBranchRecord.recordId);
  }

  const contextArtifacts = exchangeArtifacts.filter(isContextArtifactRecord);
  const primarySituatedContexts = contextArtifacts.filter(
    (record) => record.payload.context.containmentPolicy === "primary-situated",
  );

  let primaryContextId: string | undefined;
  if (primarySituatedContexts.length > 0) {
    const latestPrimaryContext = getLatestByTimestamp(
      primarySituatedContexts,
      (record) => record.artifact.provenance.emittedAt,
    );
    primaryContextId = latestPrimaryContext?.payload.context.id;
    if (latestPrimaryContext) {
      pushUnique(reasonCodes, "primary-context-declared");
      pushUnique(evidenceSourceIds, latestPrimaryContext.artifact.id);
    }
  } else if (contextArtifacts.length === 1) {
    primaryContextId = contextArtifacts[0]?.payload.context.id;
    if (contextArtifacts[0]) {
      pushUnique(reasonCodes, "single-context-declaration");
      pushUnique(evidenceSourceIds, contextArtifacts[0].artifact.id);
    }
  } else if (contextArtifacts.length > 1) {
    pushUnique(reasonCodes, "primary-context-ambiguity");
    for (const record of contextArtifacts) {
      pushUnique(evidenceSourceIds, record.artifact.id);
    }
  }

  const portalVisibleContextIds: string[] = [];
  if (primaryContextId) {
    const portalArtifacts = exchangeArtifacts.filter(isPortalArtifactRecord);
    for (const record of portalArtifacts) {
      if (record.payload.portal.targetContextId !== primaryContextId) {
        continue;
      }
      pushUnique(portalVisibleContextIds, record.payload.portal.sourceContextId);
      pushUnique(evidenceSourceIds, record.artifact.id);
    }
    if (portalVisibleContextIds.length > 0) {
      pushUnique(reasonCodes, "portal-visible-contexts");
    }
  }

  const latestReferentById = new Map<string, ReferentStateRecord>();
  for (const record of referentState) {
    latestReferentById.set(record.referentId, record);
  }
  const latestReferentClaims = [...latestReferentById.values()];
  const activeReferentIds = latestReferentClaims
    .filter((record) => record.continuity !== "broken")
    .map((record) => record.referentId);
  for (const record of latestReferentClaims) {
    pushUnique(evidenceSourceIds, record.recordId);
  }
  if (latestReferentClaims.length > 0) {
    pushUnique(reasonCodes, "latest-referent-continuity");
  }
  if (latestReferentClaims.some((record) => record.continuity === "broken")) {
    pushUnique(reasonCodes, "broken-referents-excluded-from-active");
  }

  const continuityState = summarizeContinuitySituationState(
    latestReferentClaims.map((record) => record.continuity),
  );
  const hasContinuityAmbiguity = latestReferentClaims.some(
    (record) => record.continuity === "ambiguous",
  );
  const hasContextPlacementAmbiguity = !primaryContextId && contextArtifacts.length > 1;

  if (hasContinuityAmbiguity) {
    pushUnique(reasonCodes, "continuity-ambiguity-present");
  }
  const ambiguityState = summarizeContinuitySituationAmbiguity(
    hasContinuityAmbiguity,
    hasContextPlacementAmbiguity,
  );

  return {
    namespaceParts: lab.handle.namespaceParts,
    portalVisibleContextIds,
    activeReferentIds,
    continuityState,
    ambiguityState,
    reasonCodes,
    evidenceSourceIds,
    ...(primaryBranchId ? { primaryBranchId } : {}),
    ...(primaryContextId ? { primaryContextId } : {}),
  };
}

export async function reconstructTransitionDecision(
  lab: Pick<
    FirstSeriousCorestoreLabHandle,
    | "handle"
    | "readBranchHappenings"
    | "readSleepCapsules"
    | "readReferentState"
    | "readExchangeArtifacts"
  >,
  options: {
    fromAsOf: string;
    toAsOf: string;
  },
): Promise<ContinuityTransitionDecisionSurface> {
  const fromSituation = await reconstructContinuitySituation(lab, {
    asOf: options.fromAsOf,
  });
  const toSituation = await reconstructContinuitySituation(lab, {
    asOf: options.toAsOf,
  });

  const reasonCodes: string[] = [];
  const evidenceSourceIds: string[] = [];
  for (const id of fromSituation.evidenceSourceIds) {
    pushUnique(evidenceSourceIds, id);
  }
  for (const id of toSituation.evidenceSourceIds) {
    pushUnique(evidenceSourceIds, id);
  }

  let transitionKind: TransitionDecisionKind;
  if (toSituation.ambiguityState !== "none") {
    transitionKind = "ambiguous";
    pushUnique(reasonCodes, "target-situation-ambiguous");
  } else if (isPortalLinkedContextShift(fromSituation, toSituation)) {
    transitionKind = "cross-context";
    pushUnique(reasonCodes, "portal-linked-context-shift");
  } else if (hasBranchShift(fromSituation, toSituation)) {
    transitionKind = "branch";
    pushUnique(reasonCodes, "primary-branch-shift");
  } else if (hasContextShift(fromSituation, toSituation)) {
    transitionKind = "ambiguous";
    pushUnique(reasonCodes, "context-shift-without-portal-evidence");
  } else {
    transitionKind = "stay";
    pushUnique(reasonCodes, "same-primary-branch-and-context");
  }

  return {
    namespaceParts: lab.handle.namespaceParts,
    fromAsOf: options.fromAsOf,
    toAsOf: options.toAsOf,
    transitionKind,
    fromSituation,
    toSituation,
    reasonCodes,
    evidenceSourceIds,
  };
}

export async function reconstructContextPortalTemporalReplay(
  lab: Pick<
    FirstSeriousCorestoreLabHandle,
    | "handle"
    | "readBranchHappenings"
    | "readSleepCapsules"
    | "readReferentState"
    | "readExchangeArtifacts"
  >,
): Promise<ContextPortalTemporalReplay> {
  const branchHappenings = await lab.readBranchHappenings();
  const sleepCapsules = await lab.readSleepCapsules();
  const exchangeArtifacts = await lab.readExchangeArtifacts();

  const contextTimeline = exchangeArtifacts
    .filter(isContextArtifactRecord)
    .map((record) => ({
      artifactId: record.artifact.id,
      emittedAt: record.recordedAt,
      contextId: record.payload.context.id,
      branchId: record.payload.context.branchId,
      label: record.payload.context.label,
      ...(record.payload.context.parentContextId
        ? { parentContextId: record.payload.context.parentContextId }
        : {}),
      ...(record.payload.context.containmentPolicy
        ? { containmentPolicy: record.payload.context.containmentPolicy }
        : {}),
    }));

  const portalTimeline = exchangeArtifacts
    .filter(isPortalArtifactRecord)
    .map((record) => ({
      artifactId: record.artifact.id,
      emittedAt: record.recordedAt,
      portalId: record.payload.portal.id,
      branchId: record.payload.portal.branchId,
      label: record.payload.portal.label,
      sourceContextId: record.payload.portal.sourceContextId,
      targetContextId: record.payload.portal.targetContextId,
      exposureRule: record.payload.portal.exposureRule,
      ...(record.payload.portal.transform
        ? { transform: record.payload.portal.transform }
        : {}),
    }));

  const timelineEvents = [
    ...contextTimeline.map((claim) => ({
      timestamp: claim.emittedAt,
      sourceEventId: claim.artifactId,
      sourceEventType: "context-artifact" as const,
    })),
    ...portalTimeline.map((claim) => ({
      timestamp: claim.emittedAt,
      sourceEventId: claim.artifactId,
      sourceEventType: "portal-artifact" as const,
    })),
    ...branchHappenings.map((record) => ({
      timestamp: record.recordedAt,
      sourceEventId: record.recordId,
      sourceEventType: "branch-happening" as const,
    })),
    ...sleepCapsules.map((record) => ({
      timestamp: record.recordedAt,
      sourceEventId: record.recordId,
      sourceEventType: "sleep-capsule" as const,
    })),
  ].sort((left, right) => left.timestamp.localeCompare(right.timestamp));

  const primaryContextTimeline: PrimaryContextResolutionEntry[] = [];
  for (const event of timelineEvents) {
    const situation = await reconstructContinuitySituation(lab, {
      asOf: event.timestamp,
    });
    primaryContextTimeline.push({
      asOf: event.timestamp,
      sourceEventId: event.sourceEventId,
      sourceEventType: event.sourceEventType,
      ambiguityState: situation.ambiguityState,
      reasonCodes: [...situation.reasonCodes],
      evidenceSourceIds: [...situation.evidenceSourceIds],
      ...(situation.primaryContextId ? { primaryContextId: situation.primaryContextId } : {}),
    });
  }

  return {
    namespaceParts: lab.handle.namespaceParts,
    contextTimeline,
    portalTimeline,
    primaryContextTimeline,
  };
}

function getOrCreateBranchSurface(
  surfaces: Map<string, ReplayBranchSurface>,
  branchId: string,
): ReplayBranchSurface {
  const existing = surfaces.get(branchId);
  if (existing) {
    return existing;
  }

  const created: ReplayBranchSurface = {
    branchId,
    segmentIds: [],
    branchHappeningIds: [],
    sleepCapsuleIds: [],
    branchHappeningCount: 0,
    sleepCapsuleCount: 0,
  };
  surfaces.set(branchId, created);
  return created;
}

function getOrCreateReferentSurface(
  surfaces: Map<string, ReplayReferentSurface>,
  record: {
    referentId: string;
    branchId: string;
    anchor: string;
    estimate: {
      id: string;
      reasoning: string;
      estimatedAt: string;
      basedOnBindingIds: string[];
    };
    continuity: StateEstimate["continuity"];
  },
): ReplayReferentSurface {
  const existing = surfaces.get(record.referentId);
  if (existing) {
    return existing;
  }

  const created: ReplayReferentSurface = {
    referentId: record.referentId,
    branchId: record.branchId,
    anchor: record.anchor,
    estimateIds: [],
    continuityHistory: [],
    reasoningHistory: [],
    latestContinuity: record.continuity,
    latestReasoning: record.estimate.reasoning,
    latestEstimatedAt: record.estimate.estimatedAt,
    latestBasedOnBindingIds: [...record.estimate.basedOnBindingIds],
  };
  surfaces.set(record.referentId, created);
  return created;
}

function getPayloadId(payload: ExchangeArtifactPayload): string {
  switch (payload.payloadType) {
    case "view":
      return payload.view.id;
    case "binding":
      return payload.binding.id;
    case "comparison":
      return payload.comparison.id;
    case "context":
      return payload.context.id;
    case "portal":
      return payload.portal.id;
    case "lineage-claim":
      return payload.lineage.id;
    case "receipt":
      return payload.receipt.id;
  }
}

function getPayloadSourceIds(payload: ExchangeArtifactPayload): string[] {
  switch (payload.payloadType) {
    case "view":
      return [...payload.view.sourceIds];
    case "binding":
      return [
        payload.binding.observerBranchId,
        payload.binding.referentBranchId,
        payload.binding.referentId,
      ];
    case "comparison":
      return [...payload.comparison.sourceIds];
    case "context":
      return [
        payload.context.branchId,
        ...(payload.context.parentContextId ? [payload.context.parentContextId] : []),
      ];
    case "portal":
      return [
        payload.portal.branchId,
        payload.portal.sourceContextId,
        payload.portal.targetContextId,
      ];
    case "lineage-claim":
      return [payload.lineage.fromId, payload.lineage.toId];
    case "receipt":
      return [...payload.receipt.sourceIds];
  }
}

function describeArtifactPayload(payload: ExchangeArtifactPayload): string {
  switch (payload.payloadType) {
    case "view":
      return `derived view: ${payload.view.label}`;
    case "binding":
      return `binding from ${payload.binding.observerBranchId} to ${payload.binding.referentId}`;
    case "comparison":
      return `comparison ${payload.comparison.comparability}/${payload.comparison.compatibility}`;
    case "context":
      return `context declaration: ${payload.context.label}`;
    case "portal":
      return `portal declaration: ${payload.portal.label}`;
    case "lineage-claim":
      return `lineage ${payload.lineage.relation} from ${payload.lineage.fromId} to ${payload.lineage.toId}`;
    case "receipt":
      return payload.receipt.summary;
  }
}

function toReplayComparisonSurface(
  artifactId: string,
  comparison: {
    id: string;
    label: string;
    sourceIds: string[];
    basisId?: string;
    projection?: string;
    comparability: string;
    compatibility: string;
    equivalence?: string;
    convergence: string;
    reasonCodes: string[];
    evidenceSourceIds: string[];
    summary?: string;
  },
): ReplayComparisonSurface {
  return compact<ReplayComparisonSurface>({
    comparisonId: comparison.id,
    artifactId,
    label: comparison.label,
    sourceIds: [...comparison.sourceIds],
    basisId: comparison.basisId,
    projection: comparison.projection,
    comparability: comparison.comparability,
    compatibility: comparison.compatibility,
    equivalence: comparison.equivalence,
    convergence: comparison.convergence,
    reasonCodes: [...comparison.reasonCodes],
    evidenceSourceIds: [...comparison.evidenceSourceIds],
    summary: comparison.summary,
  });
}

function toComparisonInspectabilitySurface(
  artifactId: string,
  comparison: {
    id: string;
    label: string;
    sourceIds: string[];
    basisId?: string;
    projection?: string;
    comparability: string;
    compatibility: string;
    equivalence?: string;
    convergence: string;
    reasonCodes: string[];
    evidenceSourceIds: string[];
    summary?: string;
  },
): ComparisonInspectabilitySurface {
  return compact<ComparisonInspectabilitySurface>({
    comparisonId: comparison.id,
    artifactId,
    label: comparison.label,
    sourceIds: [...comparison.sourceIds],
    basisId: comparison.basisId,
    projection: comparison.projection,
    comparability: comparison.comparability,
    compatibility: comparison.compatibility,
    equivalence: comparison.equivalence,
    convergence: comparison.convergence,
    reasonCodes: [...comparison.reasonCodes],
    evidenceSourceIds: [...comparison.evidenceSourceIds],
    summary: comparison.summary,
  });
}

function compact<T extends object>(value: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

function toReplayContextSurface(
  artifactId: string,
  context: {
    id: string;
    branchId: string;
    label: string;
    parentContextId?: string;
    containmentPolicy?: string;
  },
): ReplayContextSurface {
  const surface: ReplayContextSurface = {
    contextId: context.id,
    branchId: context.branchId,
    label: context.label,
    artifactId,
  };
  if (context.parentContextId) {
    surface.parentContextId = context.parentContextId;
  }
  if (context.containmentPolicy) {
    surface.containmentPolicy = context.containmentPolicy;
  }
  return surface;
}

function toReplayPortalSurface(
  artifactId: string,
  portal: {
    id: string;
    branchId: string;
    label: string;
    sourceContextId: string;
    targetContextId: string;
    exposureRule: string;
    transform?: string;
  },
): ReplayPortalSurface {
  const surface: ReplayPortalSurface = {
    portalId: portal.id,
    branchId: portal.branchId,
    label: portal.label,
    sourceContextId: portal.sourceContextId,
    targetContextId: portal.targetContextId,
    exposureRule: portal.exposureRule,
    artifactId,
  };
  if (portal.transform) {
    surface.transform = portal.transform;
  }
  return surface;
}

function toContextInspectabilitySurface(
  artifactId: string,
  context: {
    id: string;
    branchId: string;
    label: string;
    parentContextId?: string;
    containmentPolicy?: string;
  },
): ContextInspectabilitySurface {
  const surface: ContextInspectabilitySurface = {
    contextId: context.id,
    branchId: context.branchId,
    label: context.label,
    artifactId,
  };
  if (context.parentContextId) {
    surface.parentContextId = context.parentContextId;
  }
  if (context.containmentPolicy) {
    surface.containmentPolicy = context.containmentPolicy;
  }
  return surface;
}

function toPortalInspectabilitySurface(
  artifactId: string,
  portal: {
    id: string;
    branchId: string;
    label: string;
    sourceContextId: string;
    targetContextId: string;
    exposureRule: string;
    transform?: string;
  },
): PortalInspectabilitySurface {
  const surface: PortalInspectabilitySurface = {
    portalId: portal.id,
    branchId: portal.branchId,
    label: portal.label,
    sourceContextId: portal.sourceContextId,
    targetContextId: portal.targetContextId,
    exposureRule: portal.exposureRule,
    artifactId,
  };
  if (portal.transform) {
    surface.transform = portal.transform;
  }
  return surface;
}

function getLatestBranchEvidence(
  branchHappenings: BranchHappeningRecord[],
  sleepCapsules: SleepCapsuleRecord[],
):
  | {
      branchId: string;
      recordId: string;
      recordedAt: string;
    }
  | undefined {
  const candidates = [
    ...branchHappenings.map((record) => ({
      branchId: record.branchId,
      recordId: record.recordId,
      recordedAt: record.recordedAt,
    })),
    ...sleepCapsules.map((record) => ({
      branchId: record.branchId,
      recordId: record.recordId,
      recordedAt: record.recordedAt,
    })),
  ];

  return getLatestByTimestamp(candidates, (record) => record.recordedAt);
}

function summarizeContinuitySituationState(
  continuityHistory: StateEstimate["continuity"][],
): ContinuitySituationState {
  if (continuityHistory.length === 0) {
    return "none";
  }

  const distinct = [...new Set(continuityHistory)];
  if (distinct.length === 1) {
    return distinct[0] ?? "none";
  }

  return "mixed";
}

function summarizeContinuitySituationAmbiguity(
  hasContinuityAmbiguity: boolean,
  hasContextPlacementAmbiguity: boolean,
): ContinuitySituationAmbiguityState {
  if (hasContinuityAmbiguity && hasContextPlacementAmbiguity) {
    return "mixed";
  }
  if (hasContinuityAmbiguity) {
    return "continuity";
  }
  if (hasContextPlacementAmbiguity) {
    return "context-placement";
  }
  return "none";
}

function getLatestByTimestamp<T>(
  records: T[],
  getTimestamp: (record: T) => string,
): T | undefined {
  let latest: T | undefined;
  let latestTimestamp = "";

  for (const record of records) {
    const timestamp = getTimestamp(record);
    if (!latest || timestamp >= latestTimestamp) {
      latest = record;
      latestTimestamp = timestamp;
    }
  }

  return latest;
}

function pushUnique(values: string[], value: string): void {
  if (!values.includes(value)) {
    values.push(value);
  }
}

function filterRecordsAsOf<T extends { recordedAt: string }>(
  records: T[],
  asOf?: string,
): T[] {
  if (!asOf) {
    return records;
  }
  return records.filter((record) => record.recordedAt <= asOf);
}

function hasBranchShift(
  fromSituation: ContinuitySituationSurface,
  toSituation: ContinuitySituationSurface,
): boolean {
  return Boolean(
    fromSituation.primaryBranchId &&
      toSituation.primaryBranchId &&
      fromSituation.primaryBranchId !== toSituation.primaryBranchId,
  );
}

function hasContextShift(
  fromSituation: ContinuitySituationSurface,
  toSituation: ContinuitySituationSurface,
): boolean {
  return Boolean(
    fromSituation.primaryContextId &&
      toSituation.primaryContextId &&
      fromSituation.primaryContextId !== toSituation.primaryContextId,
  );
}

function isPortalLinkedContextShift(
  fromSituation: ContinuitySituationSurface,
  toSituation: ContinuitySituationSurface,
): boolean {
  if (!hasContextShift(fromSituation, toSituation)) {
    return false;
  }

  return Boolean(
    (toSituation.primaryContextId &&
      fromSituation.portalVisibleContextIds.includes(toSituation.primaryContextId)) ||
      (fromSituation.primaryContextId &&
        toSituation.portalVisibleContextIds.includes(fromSituation.primaryContextId)),
  );
}

function isContextArtifactRecord(
  record: ExchangeArtifactRecord,
): record is ExchangeArtifactRecord & {
  payload: Extract<ExchangeArtifactPayload, { payloadType: "context" }>;
} {
  return record.payload.payloadType === "context";
}

function isPortalArtifactRecord(
  record: ExchangeArtifactRecord,
): record is ExchangeArtifactRecord & {
  payload: Extract<ExchangeArtifactPayload, { payloadType: "portal" }>;
} {
  return record.payload.payloadType === "portal";
}
