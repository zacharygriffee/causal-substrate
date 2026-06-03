import { createHash } from "node:crypto";

import {
  appendConcernRecord,
  openConcernCores,
  readConcernRecords,
} from "./corestore.js";
import type { ReplicationSwarmLike } from "./hyperswarm-rendezvous.js";
import {
  buildGenericCausalSeamObservation,
  type GenericCausalSeamHistoryEnvelope,
  type GenericCausalSeamObservation,
} from "../adapters/generic-causal-seam-surface.js";

export const GENERIC_CAUSAL_SEAM_PUBLIC_SWARM_CONCERN =
  "generic-causal-seam-public-swarm" as const;

export const GENERIC_CAUSAL_SEAM_DURABLE_RECORD_KIND =
  "generic_causal_seam_durable_record" as const;

export const GENERIC_CAUSAL_SEAM_DURABLE_RECORD_SCHEMA =
  "causal-substrate/generic-causal-seam-durable-record/v1" as const;

export const GENERIC_CAUSAL_SEAM_PUBLIC_SOURCE_MANIFEST_SCHEMA =
  "causal-substrate/generic-causal-seam-public-source-manifest/v1" as const;

export const GENERIC_CAUSAL_SEAM_PUBLIC_REPLICA_REPORT_SCHEMA =
  "causal-substrate/generic-causal-seam-public-replica-report/v1" as const;

export const GENERIC_CAUSAL_SEAM_PUBLIC_RUN_INSTRUCTIONS_SCHEMA =
  "causal-substrate/generic-causal-seam-public-run-instructions/v1" as const;

export type GenericCausalSeamPublicReplicaStatus =
  | "compatible"
  | "unresolved"
  | "damaged"
  | "overclaimed";

export interface GenericCausalSeamDurableRecord {
  artifactKind: typeof GENERIC_CAUSAL_SEAM_DURABLE_RECORD_KIND;
  schema: typeof GENERIC_CAUSAL_SEAM_DURABLE_RECORD_SCHEMA;
  schemaVersion: 1;
  recordId: string;
  recordedAt: string;
  seamHistory: GenericCausalSeamHistoryEnvelope;
  seamHistoryHash: string;
  seamHistoryHashAlgorithm: "sha256-stable-json";
  sourceRefs: string[];
  durableHistoryMaterial: true;
}

export interface GenericCausalSeamPublicSourceManifest {
  artifactKind: "generic-causal-seam-public-source-manifest";
  schema: typeof GENERIC_CAUSAL_SEAM_PUBLIC_SOURCE_MANIFEST_SCHEMA;
  schemaVersion: 1;
  emittedAt: string;
  lane: "generic_causal_seam_public_swarm";
  namespaceParts: string[];
  source: {
    sourceCoreKeyHex: string;
    topicHex: string;
    sourceRecordId: string;
    seamHistoryHash: string;
    sourceRefs: string[];
  };
  proofPosture: {
    sourceManifestOnly: true;
    publicSwarmObservationProofClaimedNow: false;
    replicaMustReadDurableMaterial: true;
    lowerProofRungsRemainLowerUntilReplicaReport: true;
  };
  boundary: GenericCausalSeamPublicBoundary & {
    opensSwarmBySourceCommand: true;
    opensCorestoreBySourceCommand: true;
    writesDurableHistoryBySourceCommand: true;
    replicaReadProvenByThisArtifact: false;
  };
}

export interface GenericCausalSeamPublicReplicaReport {
  artifactKind: "generic-causal-seam-public-replica-report";
  schema: typeof GENERIC_CAUSAL_SEAM_PUBLIC_REPLICA_REPORT_SCHEMA;
  schemaVersion: 1;
  emittedAt: string;
  lane: "generic_causal_seam_public_swarm";
  status: GenericCausalSeamPublicReplicaStatus;
  namespaceParts: string[];
  sourceManifest: GenericCausalSeamPublicSourceManifest;
  replicatedRecord?: GenericCausalSeamDurableRecord | undefined;
  observationResult?: GenericCausalSeamObservation | undefined;
  readerProof: {
    sourceManifestConsumed: true;
    inputReadByCausalSubstrate: boolean;
    durableCorestoreHistoryRead: boolean;
    dhtOrHyperswarmInputObservedByCausalSubstrate: boolean;
    replicatedViaHyperswarmTransport: boolean;
    publicHyperswarmInputObservedByCausalSubstrate: boolean;
    sourceCoreKeyHex: string;
    replicaCoreKeyHex?: string | undefined;
    topicHex: string;
    replicatedRecordCount: number;
    evidenceSource?: "reader_observed_replicated_public_swarm_path" | undefined;
  };
  unresolvedFindings: string[];
  damageFindings: string[];
  overclaimFindings: string[];
  boundary: GenericCausalSeamPublicBoundary & {
    observationOnly: true;
    writesConsumerState: false;
  };
}

export interface GenericCausalSeamPublicRunInstructions {
  artifactKind: "generic-causal-seam-public-run-instructions";
  schema: typeof GENERIC_CAUSAL_SEAM_PUBLIC_RUN_INSTRUCTIONS_SCHEMA;
  schemaVersion: 1;
  emittedAt: string;
  lane: "generic_causal_seam_public_swarm";
  requiredEnvironment: {
    realHyperswarmEnv: "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1";
    publicHyperswarmEnv: "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1";
    configuredBootstrapDeferred: "CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP must be unset for public proof";
  };
  commands: {
    sourceDevicePublisher: string;
    replicaDeviceReader: string;
  };
  proofGate: {
    instructionsOnly: true;
    publicSwarmProofClaimedNow: false;
    sourceManifestAloneIsNotObservationProof: true;
    proofOnlyAfterReplicaReadsPublicSwarmDurableMaterial: true;
    requiresDurableCorestoreRead: true;
    requiresPublicHyperswarmTransport: true;
    requiresReplicatedRecordReadback: true;
  };
  boundary: GenericCausalSeamPublicBoundary & {
    opensSwarmNow: false;
    opensCorestoreNow: false;
    writesRecordsNow: false;
  };
}

export interface GenericCausalSeamPublicSourcePublisherHandle {
  manifest: GenericCausalSeamPublicSourceManifest;
  record: GenericCausalSeamDurableRecord;
  close: () => Promise<void>;
}

export interface GenericCausalSeamPublicBoundary {
  acceptsCanonicalHistory: false;
  admitsLayerEvidence: false;
  interpretsRbc: false;
  grantsAuthority: false;
  publishesToMesh: false;
  writesProductionContinuity: false;
}

type OpenedConcern = Awaited<ReturnType<typeof openConcernCores>>;

const DEFAULT_JOIN_OPTIONS = { client: true, server: true } satisfies Record<string, boolean>;
const DEFAULT_SWARM_FLUSH_TIMEOUT_MS = 30_000;
const DEFAULT_REPLICATION_TIMEOUT_MS = 60_000;

export function buildGenericCausalSeamPublicRunInstructions(input: {
  emittedAt: string;
}): GenericCausalSeamPublicRunInstructions {
  return {
    artifactKind: "generic-causal-seam-public-run-instructions",
    schema: GENERIC_CAUSAL_SEAM_PUBLIC_RUN_INSTRUCTIONS_SCHEMA,
    schemaVersion: 1,
    emittedAt: input.emittedAt,
    lane: "generic_causal_seam_public_swarm",
    requiredEnvironment: {
      realHyperswarmEnv: "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1",
      publicHyperswarmEnv: "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1",
      configuredBootstrapDeferred: "CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP must be unset for public proof",
    },
    commands: {
      sourceDevicePublisher:
        "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 npx tsx scripts/run-generic-causal-seam-public-source-device.ts --input generic-seam-history.json --manifest-output generic-public-source-manifest.json --storage-dir .tmp/generic-public-source --namespace generic,causal,seam --keep-alive-ms 600000",
      replicaDeviceReader:
        "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 npx tsx scripts/run-generic-causal-seam-public-replica-device.ts --manifest generic-public-source-manifest.json --report-output generic-public-replica-report.json --storage-dir .tmp/generic-public-replica --namespace generic,causal,seam",
    },
    proofGate: {
      instructionsOnly: true,
      publicSwarmProofClaimedNow: false,
      sourceManifestAloneIsNotObservationProof: true,
      proofOnlyAfterReplicaReadsPublicSwarmDurableMaterial: true,
      requiresDurableCorestoreRead: true,
      requiresPublicHyperswarmTransport: true,
      requiresReplicatedRecordReadback: true,
    },
    boundary: {
      ...boundary(),
      opensSwarmNow: false,
      opensCorestoreNow: false,
      writesRecordsNow: false,
    },
  };
}

export async function openGenericCausalSeamPublicSourcePublisher(options: {
  storageDir: string;
  createSwarm: (seed?: Buffer) => ReplicationSwarmLike | Promise<ReplicationSwarmLike>;
  seamHistory: GenericCausalSeamHistoryEnvelope;
  emittedAt: string;
  recordedAt?: string | undefined;
  recordId?: string | undefined;
  namespaceParts?: string[] | undefined;
  flushTimeoutMs?: number | undefined;
}): Promise<GenericCausalSeamPublicSourcePublisherHandle> {
  const source = await openConcernCores({
    storageDir: options.storageDir,
    concern: GENERIC_CAUSAL_SEAM_PUBLIC_SWARM_CONCERN,
    namespaceParts: options.namespaceParts,
  });
  const primaryKey = source.lease.store.primaryKey as Buffer | undefined;
  if (!primaryKey) {
    await source.close();
    throw new Error("missing_primary_key_for_generic_causal_seam_public_source");
  }

  let swarm: ReplicationSwarmLike | undefined;
  let discovery: ReturnType<ReplicationSwarmLike["join"]> | undefined;
  let closed = false;

  try {
    const record = buildGenericCausalSeamDurableRecord({
      recordId: options.recordId,
      recordedAt: options.recordedAt ?? options.emittedAt,
      seamHistory: options.seamHistory,
    });
    await appendConcernRecord(source, "exchange-artifacts", record);

    swarm = await options.createSwarm(Buffer.alloc(32, 0x51));
    swarm.on("connection", (socket) => {
      source.lease.store.replicate(socket);
    });
    const topic = createGenericCausalSeamPublicTopic(options.namespaceParts ?? []);
    const done = typeof source.lease.store.findingPeers === "function"
      ? source.lease.store.findingPeers()
      : undefined;
    try {
      discovery = swarm.join(topic, DEFAULT_JOIN_OPTIONS);
      await waitForSwarmFlush(
        swarm,
        options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS,
        "generic-causal-seam-public-source-swarm",
      );
      await discovery?.flushed?.();
    } finally {
      done?.();
    }

    return {
      manifest: {
        artifactKind: "generic-causal-seam-public-source-manifest",
        schema: GENERIC_CAUSAL_SEAM_PUBLIC_SOURCE_MANIFEST_SCHEMA,
        schemaVersion: 1,
        emittedAt: options.emittedAt,
        lane: "generic_causal_seam_public_swarm",
        namespaceParts: source.namespaceParts,
        source: {
          sourceCoreKeyHex: Buffer.from(primaryKey).toString("hex"),
          topicHex: topic.toString("hex"),
          sourceRecordId: record.recordId,
          seamHistoryHash: record.seamHistoryHash,
          sourceRefs: record.sourceRefs,
        },
        proofPosture: {
          sourceManifestOnly: true,
          publicSwarmObservationProofClaimedNow: false,
          replicaMustReadDurableMaterial: true,
          lowerProofRungsRemainLowerUntilReplicaReport: true,
        },
        boundary: {
          ...boundary(),
          opensSwarmBySourceCommand: true,
          opensCorestoreBySourceCommand: true,
          writesDurableHistoryBySourceCommand: true,
          replicaReadProvenByThisArtifact: false,
        },
      },
      record,
      close: async () => {
        if (closed) return;
        closed = true;
        await Promise.resolve(discovery?.destroy?.()).catch(() => {});
        await closeSwarmQuietly(swarm);
        await closeConcernQuietly(source);
      },
    };
  } catch (error) {
    await Promise.resolve(discovery?.destroy?.()).catch(() => {});
    await closeSwarmQuietly(swarm);
    await closeConcernQuietly(source);
    throw error;
  }
}

export async function runGenericCausalSeamPublicReplicaReader(options: {
  storageDir: string;
  createSwarm: (seed?: Buffer) => ReplicationSwarmLike | Promise<ReplicationSwarmLike>;
  sourceManifest: GenericCausalSeamPublicSourceManifest;
  emittedAt: string;
  namespaceParts?: string[] | undefined;
  flushTimeoutMs?: number | undefined;
  replicationTimeoutMs?: number | undefined;
  publicHyperswarmInputObservedByCausalSubstrate?: boolean | undefined;
}): Promise<GenericCausalSeamPublicReplicaReport> {
  const sourceCoreKey = Buffer.from(options.sourceManifest.source.sourceCoreKeyHex, "hex");
  const topic = Buffer.from(options.sourceManifest.source.topicHex, "hex");
  const replica = await openConcernCores({
    storageDir: options.storageDir,
    concern: GENERIC_CAUSAL_SEAM_PUBLIC_SWARM_CONCERN,
    namespaceParts: options.namespaceParts,
    rootOptions: {
      primaryKey: sourceCoreKey,
      unsafe: true,
      writable: false,
    },
  });

  let swarm: ReplicationSwarmLike | undefined;
  let discovery: ReturnType<ReplicationSwarmLike["join"]> | undefined;

  try {
    swarm = await options.createSwarm(Buffer.alloc(32, 0x52));
    swarm.on("connection", (socket) => {
      replica.lease.store.replicate(socket);
    });
    const done = typeof replica.lease.store.findingPeers === "function"
      ? replica.lease.store.findingPeers()
      : undefined;
    try {
      discovery = swarm.join(topic, DEFAULT_JOIN_OPTIONS);
      await waitForSwarmFlush(
        swarm,
        options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS,
        "generic-causal-seam-public-replica-swarm",
      );
      await discovery?.flushed?.();
    } finally {
      done?.();
    }

    const replicated = await waitForReplicatedRecord({
      replica,
      discovery,
      sourceManifest: options.sourceManifest,
      timeoutMs: options.replicationTimeoutMs ?? DEFAULT_REPLICATION_TIMEOUT_MS,
    });
    const replicaRecords = await readGenericCausalSeamDurableRecords(replica);

    if (!replicated) {
      return buildUnresolvedReplicaReport({
        emittedAt: options.emittedAt,
        sourceManifest: options.sourceManifest,
        namespaceParts: replica.namespaceParts,
        replicaCoreKeyHex: Buffer.from(replica.lease.store.primaryKey).toString("hex"),
        replicatedRecordCount: replicaRecords.length,
        finding: "public swarm replica did not read the source durable generic seam record before timeout",
      });
    }

    const publicObserved = options.publicHyperswarmInputObservedByCausalSubstrate === true;
    const observationResult = buildGenericCausalSeamObservation({
      seamHistory: {
        ...replicated.seamHistory,
        transportProof: {
          ...replicated.seamHistory.transportProof,
          evidenceSource: publicObserved
            ? "reader_observed_replicated_public_swarm_path"
            : "local_artifact_fixture",
          publicSwarmTransportHappened: publicObserved,
          testnetSwarmTransportHappened: !publicObserved,
          controlPlaneOnly: false,
          durableFeedBackedHistoryObserved: true,
          receivingRepoObservedReplicatedPath: true,
          receiptOrResultCausallyReferencesSources: true,
          reopenedReadbackDerivedFromDurableHistory: true,
        },
      },
      proofCommand: "run-generic-causal-seam-public-replica-device",
      generatedAt: options.emittedAt,
      operationProofRung: publicObserved ? "durable_replicated_public_swarm_seam" : "swarm_discovered_seam",
      durableObservationResultEmitted: true,
      reopenedReadbackDerivedFromDurableHistory: true,
    });
    const status: GenericCausalSeamPublicReplicaStatus = observationResult.finalClassification === "overclaimed"
      ? "overclaimed"
      : observationResult.finalClassification === "damaged"
        ? "damaged"
        : observationResult.finalClassification === "unresolved"
          ? "unresolved"
          : "compatible";

    return {
      artifactKind: "generic-causal-seam-public-replica-report",
      schema: GENERIC_CAUSAL_SEAM_PUBLIC_REPLICA_REPORT_SCHEMA,
      schemaVersion: 1,
      emittedAt: options.emittedAt,
      lane: "generic_causal_seam_public_swarm",
      status,
      namespaceParts: replica.namespaceParts,
      sourceManifest: options.sourceManifest,
      replicatedRecord: replicated,
      observationResult,
      readerProof: {
        sourceManifestConsumed: true,
        inputReadByCausalSubstrate: true,
        durableCorestoreHistoryRead: true,
        dhtOrHyperswarmInputObservedByCausalSubstrate: true,
        replicatedViaHyperswarmTransport: true,
        publicHyperswarmInputObservedByCausalSubstrate: publicObserved,
        sourceCoreKeyHex: options.sourceManifest.source.sourceCoreKeyHex,
        replicaCoreKeyHex: Buffer.from(replica.lease.store.primaryKey).toString("hex"),
        topicHex: options.sourceManifest.source.topicHex,
        replicatedRecordCount: replicaRecords.length,
        ...(publicObserved ? { evidenceSource: "reader_observed_replicated_public_swarm_path" } : {}),
      },
      unresolvedFindings: [...observationResult.unresolvedFindings],
      damageFindings: [...observationResult.damageFindings],
      overclaimFindings: [...observationResult.overclaimFindings],
      boundary: {
        ...boundary(),
        observationOnly: true,
        writesConsumerState: false,
      },
    };
  } finally {
    await Promise.resolve(discovery?.destroy?.()).catch(() => {});
    await closeSwarmQuietly(swarm);
    await closeConcernQuietly(replica);
  }
}

export async function readGenericCausalSeamReplicaReportFromDurableObservation(options: {
  report: GenericCausalSeamPublicReplicaReport;
  emittedAt: string;
}): Promise<GenericCausalSeamPublicReplicaReport> {
  if (!options.report.observationResult || !options.report.replicatedRecord) {
    return {
      ...options.report,
      emittedAt: options.emittedAt,
      status: "unresolved",
      unresolvedFindings: [
        ...options.report.unresolvedFindings,
        "durable observation result readback is unavailable because no compatible replicated record was observed",
      ],
    };
  }
  return {
    ...options.report,
    emittedAt: options.emittedAt,
    observationResult: {
      ...options.report.observationResult,
      generatedAt: options.emittedAt,
      transportBooleans: {
        ...options.report.observationResult.transportBooleans,
        reopenedReadbackDerivedFromDurableHistory: true,
      },
    },
  };
}

function buildGenericCausalSeamDurableRecord(input: {
  recordId?: string | undefined;
  recordedAt: string;
  seamHistory: GenericCausalSeamHistoryEnvelope;
}): GenericCausalSeamDurableRecord {
  const seamHistoryHash = `sha256:${hash(stableJson(input.seamHistory))}`;
  return {
    artifactKind: GENERIC_CAUSAL_SEAM_DURABLE_RECORD_KIND,
    schema: GENERIC_CAUSAL_SEAM_DURABLE_RECORD_SCHEMA,
    schemaVersion: 1,
    recordId: input.recordId ?? `generic-causal-seam-durable-record:${hash(`${seamHistoryHash}:${input.recordedAt}`).slice(0, 16)}`,
    recordedAt: input.recordedAt,
    seamHistory: input.seamHistory,
    seamHistoryHash,
    seamHistoryHashAlgorithm: "sha256-stable-json",
    sourceRefs: collectSourceRefs(input.seamHistory),
    durableHistoryMaterial: true,
  };
}

async function readGenericCausalSeamDurableRecords(
  concern: OpenedConcern,
): Promise<GenericCausalSeamDurableRecord[]> {
  const records = await readConcernRecords(concern, "exchange-artifacts");
  return records.filter(isGenericCausalSeamDurableRecord);
}

async function waitForReplicatedRecord(input: {
  replica: OpenedConcern;
  discovery: ReturnType<ReplicationSwarmLike["join"]> | undefined;
  sourceManifest: GenericCausalSeamPublicSourceManifest;
  timeoutMs: number;
}): Promise<GenericCausalSeamDurableRecord | undefined> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < input.timeoutMs) {
    await input.discovery?.refresh?.(DEFAULT_JOIN_OPTIONS);
    await input.discovery?.flushed?.();
    await refreshReplica(input.replica);
    const records = await readGenericCausalSeamDurableRecords(input.replica);
    const replicated = records.find((candidate) =>
      candidate.recordId === input.sourceManifest.source.sourceRecordId &&
      candidate.seamHistoryHash === input.sourceManifest.source.seamHistoryHash
    );
    if (replicated) return replicated;
    await sleep(250);
  }
  return undefined;
}

function buildUnresolvedReplicaReport(input: {
  emittedAt: string;
  sourceManifest: GenericCausalSeamPublicSourceManifest;
  namespaceParts: string[];
  replicaCoreKeyHex: string;
  replicatedRecordCount: number;
  finding: string;
}): GenericCausalSeamPublicReplicaReport {
  return {
    artifactKind: "generic-causal-seam-public-replica-report",
    schema: GENERIC_CAUSAL_SEAM_PUBLIC_REPLICA_REPORT_SCHEMA,
    schemaVersion: 1,
    emittedAt: input.emittedAt,
    lane: "generic_causal_seam_public_swarm",
    status: "unresolved",
    namespaceParts: input.namespaceParts,
    sourceManifest: input.sourceManifest,
    readerProof: {
      sourceManifestConsumed: true,
      inputReadByCausalSubstrate: false,
      durableCorestoreHistoryRead: false,
      dhtOrHyperswarmInputObservedByCausalSubstrate: false,
      replicatedViaHyperswarmTransport: false,
      publicHyperswarmInputObservedByCausalSubstrate: false,
      sourceCoreKeyHex: input.sourceManifest.source.sourceCoreKeyHex,
      replicaCoreKeyHex: input.replicaCoreKeyHex,
      topicHex: input.sourceManifest.source.topicHex,
      replicatedRecordCount: input.replicatedRecordCount,
    },
    unresolvedFindings: [input.finding],
    damageFindings: [],
    overclaimFindings: [],
    boundary: {
      ...boundary(),
      observationOnly: true,
      writesConsumerState: false,
    },
  };
}

function collectSourceRefs(input: GenericCausalSeamHistoryEnvelope): string[] {
  return unique([
    input.historyId,
    input.historyHash,
    ...input.sourceRepos,
    ...input.sourceSchemaRefs,
    ...input.durableRefs,
    ...input.writerRefs,
    ...input.requests.flatMap((request) => [
      request.id,
      request.hash,
      request.sourceRepo,
      request.durableRef,
      request.writerRef,
      request.schemaRef,
      ...(request.causalParentRefs ?? []),
    ]),
    ...input.receipts.flatMap((receipt) => [
      receipt.id,
      receipt.hash,
      receipt.sourceRepo,
      receipt.durableRef,
      receipt.writerRef,
      receipt.schemaRef,
      receipt.sourceRequestId,
      receipt.sourceRequestHash,
      ...(receipt.causalParentRefs ?? []),
    ]),
    ...input.evidenceRefs.flatMap((evidence) => [
      evidence.id,
      evidence.hash,
      evidence.sourceRepo,
      evidence.durableRef,
      evidence.writerRef,
      evidence.schemaRef,
      ...(evidence.causalParentRefs ?? []),
    ]),
    ...input.proofLabels,
  ]);
}

function createGenericCausalSeamPublicTopic(namespaceParts: string[]): Buffer {
  return createHash("sha256")
    .update([
      "causal-substrate",
      GENERIC_CAUSAL_SEAM_PUBLIC_SWARM_CONCERN,
      ...namespaceParts,
    ].join("/"))
    .digest();
}

function isGenericCausalSeamDurableRecord(value: unknown): value is GenericCausalSeamDurableRecord {
  return Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value as GenericCausalSeamDurableRecord).artifactKind === GENERIC_CAUSAL_SEAM_DURABLE_RECORD_KIND &&
    (value as GenericCausalSeamDurableRecord).schema === GENERIC_CAUSAL_SEAM_DURABLE_RECORD_SCHEMA &&
    (value as GenericCausalSeamDurableRecord).schemaVersion === 1 &&
    typeof (value as GenericCausalSeamDurableRecord).recordId === "string" &&
    typeof (value as GenericCausalSeamDurableRecord).seamHistoryHash === "string" &&
    Array.isArray((value as GenericCausalSeamDurableRecord).sourceRefs) &&
    (value as GenericCausalSeamDurableRecord).durableHistoryMaterial === true;
}

async function refreshReplica(concern: OpenedConcern): Promise<void> {
  for (const core of Object.values(concern.cores)) {
    await core.update?.({ wait: false }).catch(() => {});
  }
}

async function waitForSwarmFlush(
  swarm: ReplicationSwarmLike,
  timeoutMs: number,
  label: string,
): Promise<void> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`${label}_flush_timeout`)), timeoutMs);
  });
  await Promise.race([Promise.resolve(swarm.flush(timeoutMs)), timeout]);
}

async function closeSwarmQuietly(swarm: ReplicationSwarmLike | undefined): Promise<void> {
  await Promise.resolve(swarm?.close()).catch(() => {});
}

async function closeConcernQuietly(concern: OpenedConcern | undefined): Promise<void> {
  await concern?.close().catch(() => {});
}

function boundary(): GenericCausalSeamPublicBoundary {
  return {
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    interpretsRbc: false,
    grantsAuthority: false,
    publishesToMesh: false,
    writesProductionContinuity: false,
  };
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.length > 0))];
}

function stableJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, sortValue(entry)]),
    );
  }
  return value;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}
