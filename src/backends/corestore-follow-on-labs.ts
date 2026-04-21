import { Substrate as SubstrateKernel } from "../kernel/substrate.js";
import { StateEstimate } from "../kernel/types.js";
import {
  BranchHappeningRecord,
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

  return {
    namespaceParts: lab.handle.namespaceParts,
    branchClaims: [...branchClaimsById.values()],
    referentClaims,
    contextClaims,
    portalClaims,
    artifactClaims,
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
