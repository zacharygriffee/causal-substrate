import { Substrate as SubstrateKernel } from "../kernel/substrate.js";
import { StateEstimate } from "../kernel/types.js";
import {
  ExchangeArtifactPayload,
  ExchangeArtifactRecord,
  ReceiptPayload,
  ReferentStateRecord,
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

  for (const record of branchHappenings) {
    branchIds.add(record.branchId);
    segmentIds.add(record.segmentId);
  }
  for (const record of sleepCapsules) {
    branchIds.add(record.branchId);
    segmentIds.add(record.segmentId);
  }
  for (const record of referentState) {
    branchIds.add(record.branchId);
    referentIds.add(record.referentId);
    latestContinuityByReferentId.set(record.referentId, record.continuity);
  }

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
  };
}
