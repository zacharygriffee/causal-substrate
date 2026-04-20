import {
  ArtifactEnvelope,
  Binding,
  Happening,
  LineageEdge,
  Nucleus,
  Referent,
  Segment,
  StateEstimate,
  View,
} from "../kernel/types.js";
import { Substrate as SubstrateKernel } from "../kernel/substrate.js";
import {
  appendConcernRecord,
  OpenConcernHandle,
  openConcernCores,
  readConcernRecords,
} from "./corestore.js";
import {
  BranchHappeningRecord,
  CORESTORE_RECORD_SCHEMA,
  ExchangeArtifactRecord,
  ExchangeArtifactPayload,
  ReceiptPayload,
  ReferentStateRecord,
  SleepCapsuleRecord,
} from "./corestore-records.js";

export const FIRST_SERIOUS_CORESTORE_LAB_CONCERN = "first-serious-causal-lab";

export interface OpenFirstSeriousCorestoreLabOptions {
  storageDir: string;
  namespaceParts?: string[] | undefined;
}

export interface FirstSeriousCorestoreLabHandle {
  handle: OpenConcernHandle;
  close: () => Promise<void>;
  appendBranchHappening: (input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    branchId: string;
    segmentId: string;
    happening: Happening;
  }) => Promise<BranchHappeningRecord>;
  appendSleepCapsule: (input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    branchId: string;
    segment: Segment;
    nucleus: Nucleus;
  }) => Promise<SleepCapsuleRecord>;
  appendReferentState: (input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    referent: Referent;
    estimate: StateEstimate;
  }) => Promise<ReferentStateRecord>;
  appendExchangeArtifact: (input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    artifact: ArtifactEnvelope;
    payload: ExchangeArtifactPayload;
  }) => Promise<ExchangeArtifactRecord>;
  appendViewArtifact: (input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    artifact: ArtifactEnvelope;
    view: View;
  }) => Promise<ExchangeArtifactRecord>;
  appendBindingArtifact: (input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    artifact: ArtifactEnvelope;
    binding: Binding;
  }) => Promise<ExchangeArtifactRecord>;
  appendLineageClaimArtifact: (input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    artifact: ArtifactEnvelope;
    lineage: LineageEdge;
  }) => Promise<ExchangeArtifactRecord>;
  appendReceiptArtifact: (input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    artifact: ArtifactEnvelope;
    receipt: ReceiptPayload;
  }) => Promise<ExchangeArtifactRecord>;
  readBranchHappenings: () => Promise<BranchHappeningRecord[]>;
  readSleepCapsules: () => Promise<SleepCapsuleRecord[]>;
  readReferentState: () => Promise<ReferentStateRecord[]>;
  readExchangeArtifacts: () => Promise<ExchangeArtifactRecord[]>;
}

export interface FirstSeriousCorestoreLabReport {
  namespaceParts: string[];
  branchHappenings: BranchHappeningRecord[];
  sleepCapsules: SleepCapsuleRecord[];
  referentState: ReferentStateRecord[];
  exchangeArtifacts: ExchangeArtifactRecord[];
}

export interface RunFirstSeriousCorestoreLabOptions {
  storageDir: string;
  namespaceParts?: string[] | undefined;
  now?: (() => string) | undefined;
}

export async function openFirstSeriousCorestoreLab(
  options: OpenFirstSeriousCorestoreLabOptions,
): Promise<FirstSeriousCorestoreLabHandle> {
  const handle = await openConcernCores({
    storageDir: options.storageDir,
    concern: FIRST_SERIOUS_CORESTORE_LAB_CONCERN,
    namespaceParts: options.namespaceParts,
  });

  return {
    handle,
    close: async () => {
      await handle.close();
    },
    appendBranchHappening: async (input) => {
      const record: BranchHappeningRecord = {
        schema: CORESTORE_RECORD_SCHEMA,
        schemaVersion: 1,
        recordId: input.recordId ?? input.happening.id,
        recordType: "branch-happening",
        recordedAt: input.recordedAt ?? input.happening.observedAt,
        branchId: input.branchId,
        segmentId: input.segmentId,
        happening: input.happening,
      };
      await appendConcernRecord(handle, "branch-happenings", record);
      return record;
    },
    appendSleepCapsule: async (input) => {
      const record: SleepCapsuleRecord = {
        schema: CORESTORE_RECORD_SCHEMA,
        schemaVersion: 1,
        recordId: input.recordId ?? input.nucleus.id,
        recordType: "sleep-capsule",
        recordedAt: input.recordedAt ?? input.segment.closedAt ?? input.segment.openedAt,
        branchId: input.branchId,
        segmentId: input.segment.id,
        nucleusId: input.nucleus.id,
        segment: input.segment,
        nucleus: input.nucleus,
      };
      await appendConcernRecord(handle, "segments", record);
      return record;
    },
    appendReferentState: async (input) => {
      const record: ReferentStateRecord = {
        schema: CORESTORE_RECORD_SCHEMA,
        schemaVersion: 1,
        recordId: input.recordId ?? input.estimate.id,
        recordType: "referent-state-estimate",
        recordedAt: input.recordedAt ?? input.estimate.estimatedAt,
        branchId: input.estimate.branchId,
        referentId: input.referent.id,
        anchor: input.referent.anchor,
        continuity: input.estimate.continuity,
        referent: input.referent,
        estimate: input.estimate,
      };
      await appendConcernRecord(handle, "referent-state", record);
      return record;
    },
    appendExchangeArtifact: async (input) => {
      const record: ExchangeArtifactRecord = {
        schema: CORESTORE_RECORD_SCHEMA,
        schemaVersion: 1,
        recordId: input.recordId ?? input.artifact.id,
        recordType: "exchange-artifact",
        recordedAt: input.recordedAt ?? input.artifact.provenance.emittedAt,
        artifact: input.artifact,
        payload: input.payload,
      };
      await appendConcernRecord(handle, "exchange-artifacts", record);
      return record;
    },
    appendViewArtifact: async (input) =>
      appendExchangeArtifact(handle, {
        recordId: input.recordId,
        recordedAt: input.recordedAt,
        artifact: input.artifact,
        payload: {
          payloadType: "view",
          view: input.view,
        },
      }),
    appendBindingArtifact: async (input) =>
      appendExchangeArtifact(handle, {
        recordId: input.recordId,
        recordedAt: input.recordedAt,
        artifact: input.artifact,
        payload: {
          payloadType: "binding",
          binding: input.binding,
        },
      }),
    appendLineageClaimArtifact: async (input) =>
      appendExchangeArtifact(handle, {
        recordId: input.recordId,
        recordedAt: input.recordedAt,
        artifact: input.artifact,
        payload: {
          payloadType: "lineage-claim",
          lineage: input.lineage,
        },
      }),
    appendReceiptArtifact: async (input) =>
      appendExchangeArtifact(handle, {
        recordId: input.recordId,
        recordedAt: input.recordedAt,
        artifact: input.artifact,
        payload: {
          payloadType: "receipt",
          receipt: input.receipt,
        },
      }),
    readBranchHappenings: async () =>
      readConcernRecords(handle, "branch-happenings") as Promise<BranchHappeningRecord[]>,
    readSleepCapsules: async () =>
      readConcernRecords(handle, "segments") as Promise<SleepCapsuleRecord[]>,
    readReferentState: async () =>
      readConcernRecords(handle, "referent-state") as Promise<ReferentStateRecord[]>,
    readExchangeArtifacts: async () =>
      readConcernRecords(handle, "exchange-artifacts") as Promise<ExchangeArtifactRecord[]>,
  };
}

export async function runFirstSeriousCorestoreLab(
  options: RunFirstSeriousCorestoreLabOptions,
): Promise<FirstSeriousCorestoreLabReport> {
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: options.storageDir,
    namespaceParts: options.namespaceParts,
  });
  const substrate = new SubstrateKernel(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "room-presence-basis",
      dimensions: ["position", "motion", "aperture-visibility"],
    });
    const observer = substrate.createObserver({
      label: "room-observer",
      basisId: basis.id,
      saliencePolicy: "threshold-first",
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "observer-room-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const roomContextBranch = substrate.createBranch({
      role: "context",
      label: "room-context-branch",
      basisId: basis.id,
    });
    const roomContext = substrate.createContext({
      branchId: roomContextBranch.id,
      label: "room-context",
      containmentPolicy: "single-primary-situated-context",
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "tracked-light-branch",
      basisId: basis.id,
      contextId: roomContext.id,
    });
    const referent = substrate.createReferent({
      label: "tracked-light",
      anchor: "light-anchor",
      branchId: referentBranch.id,
      metadata: {
        anchorKind: "fixture",
      },
    });
    const observerWake = substrate.openSegment({
      branchId: observerBranch.id,
      summary: "observer active in room context",
    });
    const trigger = substrate.createTrigger({
      label: "light threshold crossed",
      threshold: "brightness delta > 0.2",
      basisId: basis.id,
    });
    const happening = substrate.createHappening({
      branchId: observerBranch.id,
      segmentId: observerWake.id,
      label: "observer registered light shift",
      triggerIds: [trigger.id],
      salience: 0.86,
      summary: "The light change mattered enough to preserve.",
    });

    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: observerWake.id,
      happening,
    });

    const carry = substrate.sealSegment(observerWake.id, {
      anchor: "observer-room-anchor",
      notes: "sealed after meaningful registration",
    });
    const sealedSegment = substrate.state.segments.get(carry.segmentId);
    if (!sealedSegment) {
      throw new Error(`missing sealed segment ${carry.segmentId}`);
    }

    await lab.appendSleepCapsule({
      branchId: observerBranch.id,
      segment: sealedSegment,
      nucleus: carry.nucleus,
    });

    const binding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: observerBranch.id,
      referentBranchId: referentBranch.id,
      referentId: referent.id,
      contextId: roomContext.id,
      strength: 0.79,
    });
    const estimate = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "The referent remained plausible under local wake/sleep carry-forward.",
      basedOnBindingIds: [binding.id],
    });

    await lab.appendReferentState({
      referent,
      estimate,
    });

    const view = substrate.createView({
      kind: "segment-summary",
      label: "room-light-summary",
      sourceIds: [observerBranch.id, referent.id, sealedSegment.id],
      projection: "derive a replaceable local summary over room continuity",
    });
    const artifact = substrate.createArtifactEnvelope({
      kind: "view",
      label: "room-light-summary-artifact",
      sourceIds: [observerBranch.id, referent.id, sealedSegment.id],
      payloadIds: [view.id],
      locality: "shared-candidate",
      provenance: {
        source: "first-serious-corestore-lab",
        emitterId: observer.id,
        basisId: basis.id,
      },
      metadata: {
        derived: true,
      },
    });

    await lab.appendViewArtifact({
      artifact,
      view,
    });

    return {
      namespaceParts: lab.handle.namespaceParts,
      branchHappenings: await lab.readBranchHappenings(),
      sleepCapsules: await lab.readSleepCapsules(),
      referentState: await lab.readReferentState(),
      exchangeArtifacts: await lab.readExchangeArtifacts(),
    };
  } finally {
    await lab.close();
  }
}

async function appendExchangeArtifact(
  handle: OpenConcernHandle,
  input: {
    recordId?: string | undefined;
    recordedAt?: string | undefined;
    artifact: ArtifactEnvelope;
    payload: ExchangeArtifactPayload;
  },
) {
  const record: ExchangeArtifactRecord = {
    schema: CORESTORE_RECORD_SCHEMA,
    schemaVersion: 1,
    recordId: input.recordId ?? input.artifact.id,
    recordType: "exchange-artifact",
    recordedAt: input.recordedAt ?? input.artifact.provenance.emittedAt,
    artifact: input.artifact,
    payload: input.payload,
  };
  await appendConcernRecord(handle, "exchange-artifacts", record);
  return record;
}
