import { createHash } from "node:crypto";

import { Substrate as SubstrateKernel } from "../kernel/substrate.js";
import { StateEstimate } from "../kernel/types.js";
import { ExchangeArtifactPayload } from "./corestore-records.js";
import {
  FIRST_SERIOUS_CORESTORE_LAB_CONCERN,
  openFirstSeriousCorestoreLab,
} from "./corestore-first-serious-lab.js";
import {
  ContinuitySituationSurface,
  CorestoreReplaySummary,
  InspectabilityPicture,
  reconstructContinuitySituation,
  reconstructInspectabilityPicture,
  reconstructLocalPicture,
} from "./corestore-follow-on-labs.js";

export interface FakeSwarmLike {
  id: string;
  join: (topic: Buffer, opts?: Record<string, unknown>) => unknown;
  flush: (timeoutMs?: number) => Promise<void>;
  close: () => Promise<void>;
  on: (event: "connection", listener: (socket: unknown, peerInfo: unknown) => void) => void;
}

export interface MultipleObserverReplicationLabOptions {
  storageDirA: string;
  storageDirB: string;
  createSwarm: (seedOrOpts?: Buffer, topics?: Map<string, unknown>) => FakeSwarmLike;
  topics?: Map<string, unknown> | undefined;
  namespaceParts?: string[] | undefined;
  now?: (() => string) | undefined;
}

export interface MultipleObserverReplicationLabReport {
  namespaceParts: string[];
  primaryKeyHex: string;
  branchHappeningCount: number;
  sleepCapsuleCount: number;
  referentStateCount: number;
  exchangeArtifactCount: number;
  replicatedObserverBranchIds: string[];
  replicatedContinuity: StateEstimate["continuity"][];
  replicatedPayloadKinds: ExchangeArtifactPayload["payloadType"][];
  replicaSituation: ContinuitySituationSurface;
  replicaInspectability: InspectabilityPicture;
}

export interface IncrementalReplicationCatchupLabReport {
  namespaceParts: string[];
  primaryKeyHex: string;
  initialReplay: CorestoreReplaySummary;
  finalReplay: CorestoreReplaySummary;
  initialSituation: ContinuitySituationSurface;
  finalSituation: ContinuitySituationSurface;
  initialInspectability: InspectabilityPicture;
  finalInspectability: InspectabilityPicture;
}

export async function runMultipleObserverReplicationLab(
  options: MultipleObserverReplicationLabOptions,
): Promise<MultipleObserverReplicationLabReport> {
  const first = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDirA,
    namespaceParts: options.namespaceParts,
  });

  const primaryKey = first.handle.lease.store.primaryKey as Buffer | undefined;
  if (!primaryKey) {
    await first.close();
    throw new Error("missing primaryKey on source Corestore");
  }

  const second = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDirB,
    namespaceParts: options.namespaceParts,
    rootOptions: {
      primaryKey,
      unsafe: true,
      writable: false,
    },
  });

  const topics = options.topics ?? new Map<string, unknown>();
  const swarmA = options.createSwarm(Buffer.alloc(32, 1), topics);
  const swarmB = options.createSwarm(Buffer.alloc(32, 2), topics);

  try {
    swarmA.on("connection", (socket) => {
      first.handle.session.replicate(socket);
    });
    swarmB.on("connection", (socket) => {
      second.handle.session.replicate(socket);
    });

    const topic = createReplicationTopic(options.namespaceParts ?? []);
    swarmA.join(topic);
    swarmB.join(topic);
    await Promise.all([swarmA.flush(500), swarmB.flush(500)]);

    const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});
    const basis = substrate.createBasis({
      label: "multi-observer-replication-basis",
      dimensions: ["position", "motion", "threshold"],
    });
    const observerA = substrate.createObserver({
      label: "observer-a",
      basisId: basis.id,
      saliencePolicy: "high-threshold",
    });
    const observerB = substrate.createObserver({
      label: "observer-b",
      basisId: basis.id,
      saliencePolicy: "medium-threshold",
    });
    const observerBranchA = substrate.createBranch({
      role: "observer",
      label: "observer-a-branch",
      basisId: basis.id,
      observerId: observerA.id,
    });
    const observerBranchB = substrate.createBranch({
      role: "observer",
      label: "observer-b-branch",
      basisId: basis.id,
      observerId: observerB.id,
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "replicated-referent-branch",
      basisId: basis.id,
    });
    const referent = substrate.createReferent({
      label: "replicated-referent",
      anchor: "replicated-referent-anchor",
      branchId: referentBranch.id,
    });

    const recordedObserverBranchIds: string[] = [];

    for (const [index, branch] of [observerBranchA, observerBranchB].entries()) {
      const segment = substrate.openSegment({
        branchId: branch.id,
        summary: `observer wake ${index + 1}`,
      });
      const trigger = substrate.createTrigger({
        label: `observer ${index + 1} threshold crossing`,
        threshold: "delta > 0.1",
        basisId: basis.id,
      });
      const happening = substrate.createHappening({
        branchId: branch.id,
        segmentId: segment.id,
        label: `observer ${index + 1} preserved happening`,
        triggerIds: [trigger.id],
        salience: 0.7 + index * 0.1,
      });
      await first.appendBranchHappening({
        branchId: branch.id,
        segmentId: segment.id,
        happening,
      });

      const carry = substrate.sealSegment(segment.id, {
        anchor: `observer-${index + 1}-anchor`,
      });
      const sealedSegment = substrate.state.segments.get(carry.segmentId);
      if (!sealedSegment) {
        throw new Error(`missing sealed segment ${carry.segmentId}`);
      }
      await first.appendSleepCapsule({
        branchId: branch.id,
        segment: sealedSegment,
        nucleus: carry.nucleus,
      });

      recordedObserverBranchIds.push(branch.id);
    }

    const bindingA = substrate.createBinding({
      kind: "tracking",
      observerBranchId: observerBranchA.id,
      referentBranchId: referentBranch.id,
      referentId: referent.id,
      strength: 0.8,
    });
    const bindingB = substrate.createBinding({
      kind: "tracking",
      observerBranchId: observerBranchB.id,
      referentBranchId: referentBranch.id,
      referentId: referent.id,
      strength: 0.74,
    });
    const estimate = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "Two observers preserved compatible append-only continuity.",
      basedOnBindingIds: [bindingA.id, bindingB.id],
    });
    await first.appendReferentState({
      referent,
      estimate,
    });

    const view = substrate.createView({
      kind: "binding-map",
      label: "replicated-observer-view",
      sourceIds: [observerBranchA.id, observerBranchB.id, referent.id],
      projection: "derive a replaceable multi-observer surface",
    });
    const artifact = substrate.createArtifactEnvelope({
      kind: "view",
      label: "replicated-observer-artifact",
      sourceIds: [observerBranchA.id, observerBranchB.id, referent.id],
      payloadIds: [view.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observerA.id,
        source: "multiple-observer-replication-lab",
      },
    });
    await first.appendViewArtifact({
      artifact,
      view,
    });

    await waitFor(async () => {
      return (
        second.handle.cores["branch-happenings"].length === 2 &&
        second.handle.cores.segments.length === 2 &&
        second.handle.cores["referent-state"].length === 1 &&
        second.handle.cores["exchange-artifacts"].length === 1
      );
    }, 4000);

    const remoteBranchHappenings = await second.readBranchHappenings();
    const remoteSleepCapsules = await second.readSleepCapsules();
    const remoteReferentState = await second.readReferentState();
    const remoteExchange = await second.readExchangeArtifacts();
    const replicaSituation = await reconstructContinuitySituation(second);
    const replicaInspectability = await reconstructInspectabilityPicture(second);

    return {
      namespaceParts: second.handle.namespaceParts,
      primaryKeyHex: Buffer.from(primaryKey).toString("hex"),
      branchHappeningCount: remoteBranchHappenings.length,
      sleepCapsuleCount: remoteSleepCapsules.length,
      referentStateCount: remoteReferentState.length,
      exchangeArtifactCount: remoteExchange.length,
      replicatedObserverBranchIds: [
        ...new Set(remoteBranchHappenings.map((record) => record.branchId)),
      ],
      replicatedContinuity: remoteReferentState.map((record) => record.continuity),
      replicatedPayloadKinds: remoteExchange.map((record) => record.payload.payloadType),
      replicaSituation,
      replicaInspectability,
    };
  } finally {
    await Promise.allSettled([
      swarmA.close(),
      swarmB.close(),
      first.close(),
      second.close(),
    ]);
  }
}

export async function runIncrementalReplicationCatchupLab(
  options: MultipleObserverReplicationLabOptions,
): Promise<IncrementalReplicationCatchupLabReport> {
  const first = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDirA,
    namespaceParts: options.namespaceParts,
  });

  const primaryKey = first.handle.lease.store.primaryKey as Buffer | undefined;
  if (!primaryKey) {
    await first.close();
    throw new Error("missing primaryKey on source Corestore");
  }

  const topics = options.topics ?? new Map<string, unknown>();
  const topic = createReplicationTopic(options.namespaceParts ?? []);
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});
  const basis = substrate.createBasis({
    label: "incremental-replication-basis",
    dimensions: ["position", "motion", "occlusion"],
  });
  const observer = substrate.createObserver({
    label: "incremental-observer",
    basisId: basis.id,
    saliencePolicy: "continuity-first",
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "incremental-observer-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "incremental-referent-branch",
    basisId: basis.id,
  });
  const referent = substrate.createReferent({
    label: "incremental-referent",
    anchor: "incremental-referent-anchor",
    branchId: referentBranch.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    strength: 0.82,
  });

  let second:
    | Awaited<ReturnType<typeof openFirstSeriousCorestoreLab>>
    | undefined;
  let swarmA: FakeSwarmLike | undefined;
  let swarmB: FakeSwarmLike | undefined;

  try {
    second = await openReadonlyReplica(options.storageDirB, primaryKey, options.namespaceParts);
    swarmA = options.createSwarm(Buffer.alloc(32, 11), topics);
    swarmB = options.createSwarm(Buffer.alloc(32, 12), topics);
    bindReplication(first, second, swarmA, swarmB, topic);
    await Promise.all([swarmA.flush(500), swarmB.flush(500)]);

    const firstSegment = substrate.openSegment({
      branchId: observerBranch.id,
      summary: "initial observed continuity",
    });
    const firstTrigger = substrate.createTrigger({
      label: "initial threshold crossing",
      threshold: "delta > 0.05",
      basisId: basis.id,
    });
    const firstHappening = substrate.createHappening({
      branchId: observerBranch.id,
      segmentId: firstSegment.id,
      label: "initial preserved happening",
      triggerIds: [firstTrigger.id],
      salience: 0.77,
    });
    await first.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: firstSegment.id,
      happening: firstHappening,
    });

    const firstCarry = substrate.sealSegment(firstSegment.id, {
      anchor: "incremental-anchor-1",
    });
    const firstSealedSegment = substrate.state.segments.get(firstCarry.segmentId);
    if (!firstSealedSegment) {
      throw new Error(`missing sealed segment ${firstCarry.segmentId}`);
    }
    await first.appendSleepCapsule({
      branchId: observerBranch.id,
      segment: firstSealedSegment,
      nucleus: firstCarry.nucleus,
    });

    const firstEstimate = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "Initial continuity remains plausible before any loss of sight.",
      basedOnBindingIds: [binding.id],
    });
    await first.appendReferentState({
      referent,
      estimate: firstEstimate,
    });

    const initialView = substrate.createView({
      kind: "binding-map",
      label: "incremental-view-1",
      sourceIds: [observerBranch.id, referent.id, binding.id],
      projection: "derive initial local replay surface",
    });
    const initialArtifact = substrate.createArtifactEnvelope({
      kind: "view",
      label: "incremental-view-artifact-1",
      sourceIds: [observerBranch.id, referent.id],
      payloadIds: [initialView.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "incremental-replication-catchup-lab",
      },
    });
    await first.appendViewArtifact({
      artifact: initialArtifact,
      view: initialView,
    });

    await waitFor(async () => {
      return (
        second?.handle.cores["branch-happenings"].length === 1 &&
        second?.handle.cores.segments.length === 1 &&
        second?.handle.cores["referent-state"].length === 1 &&
        second?.handle.cores["exchange-artifacts"].length === 1
      );
    }, 4000);

    const initialReplay = await reconstructLocalPicture(second);
    const initialSituation = await reconstructContinuitySituation(second);
    const initialInspectability = await reconstructInspectabilityPicture(second);

    await Promise.allSettled([swarmA.close(), swarmB.close(), second.close()]);
    second = undefined;
    swarmA = undefined;
    swarmB = undefined;

    const secondSegment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [firstCarry.nucleus.id],
      summary: "reopened after replica went offline",
    });
    const secondTrigger = substrate.createTrigger({
      label: "follow-up threshold crossing",
      threshold: "delta > 0.07",
      basisId: basis.id,
    });
    const secondHappening = substrate.createHappening({
      branchId: observerBranch.id,
      segmentId: secondSegment.id,
      label: "follow-up preserved happening",
      triggerIds: [secondTrigger.id],
      salience: 0.81,
    });
    await first.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: secondSegment.id,
      happening: secondHappening,
    });

    const secondCarry = substrate.sealSegment(secondSegment.id, {
      anchor: "incremental-anchor-2",
    });
    const secondSealedSegment = substrate.state.segments.get(secondCarry.segmentId);
    if (!secondSealedSegment) {
      throw new Error(`missing sealed segment ${secondCarry.segmentId}`);
    }
    await first.appendSleepCapsule({
      branchId: observerBranch.id,
      segment: secondSealedSegment,
      nucleus: secondCarry.nucleus,
    });

    const secondEstimate = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "ambiguous",
      reasoning: "Replica catch-up includes continuity weakening after loss of sight.",
      basedOnBindingIds: [binding.id],
    });
    await first.appendReferentState({
      referent,
      estimate: secondEstimate,
    });

    const receipt = {
      id: "incremental-receipt",
      label: "incremental-receipt",
      summary: "Replica can catch up after reopening without an index layer.",
      sourceIds: [initialArtifact.id, secondHappening.id, secondEstimate.id],
    };
    const receiptArtifact = substrate.createArtifactEnvelope({
      kind: "receipt",
      label: "incremental-receipt-artifact",
      sourceIds: [initialArtifact.id, secondHappening.id, secondEstimate.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "incremental-replication-catchup-lab",
      },
    });
    await first.appendReceiptArtifact({
      artifact: receiptArtifact,
      receipt,
    });

    second = await openReadonlyReplica(options.storageDirB, primaryKey, options.namespaceParts);
    swarmA = options.createSwarm(Buffer.alloc(32, 14), topics);
    swarmB = options.createSwarm(Buffer.alloc(32, 13), topics);
    bindReplication(first, second, swarmA, swarmB, topic);
    await Promise.all([swarmA.flush(500), swarmB.flush(500)]);

    await waitFor(async () => {
      return (
        second?.handle.cores["branch-happenings"].length === 2 &&
        second?.handle.cores.segments.length === 2 &&
        second?.handle.cores["referent-state"].length === 2 &&
        second?.handle.cores["exchange-artifacts"].length === 2
      );
    }, 4000);

    const finalReplay = await reconstructLocalPicture(second);
    const finalSituation = await reconstructContinuitySituation(second);
    const finalInspectability = await reconstructInspectabilityPicture(second);

    return {
      namespaceParts: second.handle.namespaceParts,
      primaryKeyHex: Buffer.from(primaryKey).toString("hex"),
      initialReplay,
      finalReplay,
      initialSituation,
      finalSituation,
      initialInspectability,
      finalInspectability,
    };
  } finally {
    await Promise.allSettled([
      swarmA?.close(),
      swarmB?.close(),
      first.close(),
      second?.close(),
    ]);
  }
}

function createReplicationTopic(namespaceParts: string[]) {
  return createHash("sha256")
    .update(
      [
        "causal-substrate",
        "replication-lab",
        FIRST_SERIOUS_CORESTORE_LAB_CONCERN,
        ...namespaceParts,
      ].join("/"),
    )
    .digest();
}

async function waitFor(
  predicate: () => boolean | Promise<boolean>,
  timeoutMs: number,
  intervalMs = 25,
) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await predicate()) return;
    await sleep(intervalMs);
  }
  throw new Error(`timed out waiting after ${timeoutMs}ms`);
}

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

function bindReplication(
  first: Awaited<ReturnType<typeof openFirstSeriousCorestoreLab>>,
  second: Awaited<ReturnType<typeof openFirstSeriousCorestoreLab>>,
  swarmA: FakeSwarmLike,
  swarmB: FakeSwarmLike,
  topic: Buffer,
) {
  swarmA.on("connection", (socket) => {
    first.handle.session.replicate(socket);
  });
  swarmB.on("connection", (socket) => {
    second.handle.session.replicate(socket);
  });
  swarmA.join(topic);
  swarmB.join(topic);
}

async function openReadonlyReplica(
  storageDir: string,
  primaryKey: Buffer,
  namespaceParts: string[] | undefined,
) {
  return openFirstSeriousCorestoreLab({
    storageDir,
    namespaceParts,
    rootOptions: {
      primaryKey,
      unsafe: true,
      writable: false,
    },
  });
}
