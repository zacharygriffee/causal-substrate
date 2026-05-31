import { createHash } from "node:crypto";

import {
  appendConcernRecord,
  openConcernCores,
  readConcernRecords,
} from "./corestore.js";
import type { ReplicationSwarmLike } from "./hyperswarm-rendezvous.js";
import { waitForDiscoveryRendezvous } from "./hyperswarm-rendezvous.js";
import {
  buildEdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryObservationResult,
} from "../adapters/edge-layer-seam-history-observation.js";

export const EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_CONCERN =
  "edge-layer-seam-history-reader" as const;

export const EDGE_LAYER_SEAM_HISTORY_DURABLE_RECORD_KIND =
  "edge_layer_seam_history_durable_record" as const;

export const EDGE_LAYER_SEAM_HISTORY_DURABLE_RECORD_SCHEMA =
  "causal-substrate/edge-layer-seam-history-durable-record/v1" as const;

export const EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_INPUT_LANE_READINESS_SCHEMA =
  "causal-substrate/edge-layer-seam-history-hyperswarm-input-lane-readiness/v1" as const;

export const EDGE_LAYER_SEAM_HISTORY_REAL_HYPERSWARM_PROOF_RUN_INSTRUCTIONS_SCHEMA =
  "causal-substrate/edge-layer-seam-history-real-hyperswarm-proof-run-instructions/v1" as const;

export const EDGE_LAYER_SEAM_HISTORY_REAL_HYPERSWARM_PROOF_RUN_INSTRUCTIONS_ARTIFACT_KIND =
  "edge-layer-seam-history-real-hyperswarm-proof-run-instructions" as const;

export type EdgeLayerSeamHistoryHyperswarmInputLaneReadinessStatus =
  | "edge-layer-seam-history-hyperswarm-input-lane-ready-to-run"
  | "edge-layer-seam-history-hyperswarm-input-lane-incomplete";

export interface EdgeLayerSeamHistoryDurableRecord {
  artifactKind: typeof EDGE_LAYER_SEAM_HISTORY_DURABLE_RECORD_KIND;
  schema: typeof EDGE_LAYER_SEAM_HISTORY_DURABLE_RECORD_SCHEMA;
  schemaVersion: 1;
  recordId: string;
  recordedAt: string;
  seamHistory: unknown;
  seamHistoryHash: string;
  seamHistoryHashAlgorithm: "sha256-stable-json";
  sourceRefs: string[];
  durableHistoryMaterial: true;
}

export interface EdgeLayerSeamHistoryHyperswarmReaderProof {
  inputReadByCausalSubstrate: true;
  durableCorestoreHistoryRead: true;
  dhtOrHyperswarmInputObservedByCausalSubstrate: true;
  replicatedViaHyperswarmTransport: true;
  sourceCoreKeyHex: string;
  replicaCoreKeyHex: string;
  topicHex: string;
  sourceRecordCount: number;
  replicaRecordCount: number;
}

export interface EdgeLayerSeamHistoryHyperswarmReaderReport {
  namespaceParts: string[];
  record: EdgeLayerSeamHistoryDurableRecord;
  replicatedRecord: EdgeLayerSeamHistoryDurableRecord;
  observationResult: EdgeLayerSeamHistoryObservationResult;
  readerProof: EdgeLayerSeamHistoryHyperswarmReaderProof;
}

export interface EdgeLayerSeamHistoryHyperswarmInputLaneReadiness {
  schema: typeof EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_INPUT_LANE_READINESS_SCHEMA;
  schemaVersion: 1;
  status: EdgeLayerSeamHistoryHyperswarmInputLaneReadinessStatus;
  gates: {
    durableCorestoreReaderAvailable: boolean;
    hyperswarmFactoryAvailable: boolean;
    namespaceConfigured: boolean;
    seamHistoryInputAvailable: boolean;
  };
  proofPosture: {
    readinessOnly: true;
    dhtHyperswarmProofClaimedNow: false;
    canReachHigherProofRungOnlyAfterRun: boolean;
    higherProofRequiresDurableCorestoreRead: true;
    higherProofRequiresHyperswarmTransport: true;
    higherProofRequiresReplicatedRecordReadback: true;
  };
  boundary: {
    opensSwarm: false;
    opensCorestore: false;
    readsDurableHistory: false;
    writesRecords: false;
    publishesToMesh: false;
    grantsAuthority: false;
  };
  issues: string[];
}

export interface EdgeLayerSeamHistoryRealHyperswarmProofRunInstructions {
  artifactKind: typeof EDGE_LAYER_SEAM_HISTORY_REAL_HYPERSWARM_PROOF_RUN_INSTRUCTIONS_ARTIFACT_KIND;
  schema: typeof EDGE_LAYER_SEAM_HISTORY_REAL_HYPERSWARM_PROOF_RUN_INSTRUCTIONS_SCHEMA;
  schemaVersion: 1;
  emittedAt: string;
  lane: "real_hyperswarm_edge_layer_seam_history_observation";
  requiredEnvironment: {
    realHyperswarmEnv: "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1";
    publicHyperswarmEnv: "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1";
    optionalBootstrapEnv: "CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP=host:port,host:port";
  };
  commands: {
    localTestnetProofRun: string;
    publicOrConfiguredBootstrapProofRun: string;
  };
  proofGate: {
    instructionsOnly: true;
    dhtHyperswarmProofClaimedNow: false;
    proofOnlyIfCommandRunsAndPasses: true;
    requiresDurableCorestoreRead: true;
    requiresHyperswarmTransport: true;
    requiresReplicatedRecordReadback: true;
    expectedStrongestProofRungAfterPassingRun:
      "dht_hyperswarm_replicated_durable_seam_history_observation";
  };
  expectedOutputRefs: {
    observationResult: "observationResult";
    readerProof: "readerProof";
    sourceRecord: "record";
    replicatedRecord: "replicatedRecord";
  };
  namespaceParts: string[];
  boundary: {
    opensSwarmNow: false;
    opensCorestoreNow: false;
    readsDurableHistoryNow: false;
    writesRecordsNow: false;
    publishesToMesh: false;
    grantsAuthority: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
  };
}

export interface EdgeLayerSeamHistoryHyperswarmReaderOptions {
  storageDirA: string;
  storageDirB: string;
  createSwarm: (
    seed?: Buffer,
    topics?: Map<string, unknown>,
  ) => ReplicationSwarmLike | Promise<ReplicationSwarmLike>;
  seamHistory: unknown;
  emittedAt: string;
  namespaceParts?: string[] | undefined;
  recordId?: string | undefined;
  recordedAt?: string | undefined;
  topics?: Map<string, unknown> | undefined;
  flushTimeoutMs?: number | undefined;
  replicationTimeoutMs?: number | undefined;
}

export interface BuildEdgeLayerSeamHistoryHyperswarmInputLaneReadinessInput {
  durableCorestoreReaderAvailable: boolean;
  hyperswarmFactoryAvailable: boolean;
  namespaceParts?: string[] | undefined;
  seamHistoryInputAvailable: boolean;
}

export interface BuildEdgeLayerSeamHistoryRealHyperswarmProofRunInstructionsInput {
  emittedAt: string;
  namespaceParts?: string[] | undefined;
}

type OpenedConcern = Awaited<ReturnType<typeof openConcernCores>>;

const DEFAULT_SWARM_FLUSH_TIMEOUT_MS = 30_000;
const DEFAULT_REPLICATION_TIMEOUT_MS = 60_000;
const DEFAULT_JOIN_OPTIONS = {
  client: true,
  server: true,
} satisfies Record<string, boolean>;

export function buildEdgeLayerSeamHistoryHyperswarmInputLaneReadiness(
  input: BuildEdgeLayerSeamHistoryHyperswarmInputLaneReadinessInput,
): EdgeLayerSeamHistoryHyperswarmInputLaneReadiness {
  const namespaceConfigured = Array.isArray(input.namespaceParts) && input.namespaceParts.length > 0;
  const issues: string[] = [];
  if (!input.durableCorestoreReaderAvailable) issues.push("durable-corestore-reader-missing");
  if (!input.hyperswarmFactoryAvailable) issues.push("hyperswarm-factory-missing");
  if (!namespaceConfigured) issues.push("namespace-parts-missing");
  if (!input.seamHistoryInputAvailable) issues.push("seam-history-input-missing");
  const ready = issues.length === 0;

  return {
    schema: EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_INPUT_LANE_READINESS_SCHEMA,
    schemaVersion: 1,
    status: ready
      ? "edge-layer-seam-history-hyperswarm-input-lane-ready-to-run"
      : "edge-layer-seam-history-hyperswarm-input-lane-incomplete",
    gates: {
      durableCorestoreReaderAvailable: input.durableCorestoreReaderAvailable,
      hyperswarmFactoryAvailable: input.hyperswarmFactoryAvailable,
      namespaceConfigured,
      seamHistoryInputAvailable: input.seamHistoryInputAvailable,
    },
    proofPosture: {
      readinessOnly: true,
      dhtHyperswarmProofClaimedNow: false,
      canReachHigherProofRungOnlyAfterRun: ready,
      higherProofRequiresDurableCorestoreRead: true,
      higherProofRequiresHyperswarmTransport: true,
      higherProofRequiresReplicatedRecordReadback: true,
    },
    boundary: {
      opensSwarm: false,
      opensCorestore: false,
      readsDurableHistory: false,
      writesRecords: false,
      publishesToMesh: false,
      grantsAuthority: false,
    },
    issues,
  };
}

export function buildEdgeLayerSeamHistoryRealHyperswarmProofRunInstructions(
  input: BuildEdgeLayerSeamHistoryRealHyperswarmProofRunInstructionsInput,
): EdgeLayerSeamHistoryRealHyperswarmProofRunInstructions {
  return {
    artifactKind: EDGE_LAYER_SEAM_HISTORY_REAL_HYPERSWARM_PROOF_RUN_INSTRUCTIONS_ARTIFACT_KIND,
    schema: EDGE_LAYER_SEAM_HISTORY_REAL_HYPERSWARM_PROOF_RUN_INSTRUCTIONS_SCHEMA,
    schemaVersion: 1,
    emittedAt: input.emittedAt,
    lane: "real_hyperswarm_edge_layer_seam_history_observation",
    requiredEnvironment: {
      realHyperswarmEnv: "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1",
      publicHyperswarmEnv: "CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1",
      optionalBootstrapEnv: "CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP=host:port,host:port",
    },
    commands: {
      localTestnetProofRun:
        "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 npx tsx --test test/edge-layer-seam-history-hyperswarm-reader.test.ts",
      publicOrConfiguredBootstrapProofRun:
        "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 npx tsx --test test/edge-layer-seam-history-hyperswarm-reader.test.ts",
    },
    proofGate: {
      instructionsOnly: true,
      dhtHyperswarmProofClaimedNow: false,
      proofOnlyIfCommandRunsAndPasses: true,
      requiresDurableCorestoreRead: true,
      requiresHyperswarmTransport: true,
      requiresReplicatedRecordReadback: true,
      expectedStrongestProofRungAfterPassingRun:
        "dht_hyperswarm_replicated_durable_seam_history_observation",
    },
    expectedOutputRefs: {
      observationResult: "observationResult",
      readerProof: "readerProof",
      sourceRecord: "record",
      replicatedRecord: "replicatedRecord",
    },
    namespaceParts: input.namespaceParts ?? [],
    boundary: {
      opensSwarmNow: false,
      opensCorestoreNow: false,
      readsDurableHistoryNow: false,
      writesRecordsNow: false,
      publishesToMesh: false,
      grantsAuthority: false,
      admitsLayerEvidence: false,
      interpretsRbc: false,
    },
  };
}

export async function runEdgeLayerSeamHistoryHyperswarmReader(
  options: EdgeLayerSeamHistoryHyperswarmReaderOptions,
): Promise<EdgeLayerSeamHistoryHyperswarmReaderReport> {
  const source = await openConcernCores({
    storageDir: options.storageDirA,
    concern: EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_CONCERN,
    namespaceParts: options.namespaceParts,
  });
  const primaryKey = source.lease.store.primaryKey as Buffer | undefined;
  if (!primaryKey) {
    await source.close();
    throw new Error("missing_primary_key_for_edge_layer_seam_history_reader");
  }

  let replica: OpenedConcern | undefined;
  let swarmA: ReplicationSwarmLike | undefined;
  let swarmB: ReplicationSwarmLike | undefined;

  try {
    replica = await openConcernCores({
      storageDir: options.storageDirB,
      concern: EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_CONCERN,
      namespaceParts: options.namespaceParts,
      rootOptions: {
        primaryKey,
        unsafe: true,
        writable: false,
      },
    });

    const topics = options.topics ?? new Map<string, unknown>();
    swarmA = await options.createSwarm(Buffer.alloc(32, 0x31), topics);
    swarmB = await options.createSwarm(Buffer.alloc(32, 0x32), topics);
    wireReplicationSockets(source, replica, swarmA, swarmB);
    const topic = createReaderTopic(options.namespaceParts ?? []);

    await connectReaderPeers({
      source,
      replica,
      swarmA,
      swarmB,
      timeoutMs: options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS,
      topic,
    });

    const record = buildDurableRecord({
      recordId: options.recordId,
      recordedAt: options.recordedAt ?? options.emittedAt,
      seamHistory: options.seamHistory,
    });
    await appendConcernRecord(source, "exchange-artifacts", record);
    const expectedHash = record.seamHistoryHash;

    await waitFor(async () => {
      await refreshReplica(replica);
      const records = await readDurableRecords(replica);
      return records.some((candidate) => candidate.seamHistoryHash === expectedHash);
    }, options.replicationTimeoutMs ?? DEFAULT_REPLICATION_TIMEOUT_MS);

    const sourceRecords = await readDurableRecords(source);
    const replicaRecords = await readDurableRecords(replica);
    const replicatedRecord = replicaRecords.find((candidate) =>
      candidate.seamHistoryHash === expectedHash
    );
    if (!replicatedRecord) {
      throw new Error("replicated_edge_layer_seam_history_record_not_found");
    }

    const observationResult = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory: replicatedRecord.seamHistory,
      emittedAt: options.emittedAt,
      sourcePath: replicatedRecord.recordId,
      inputReadByCausalSubstrate: true,
      durableCorestoreHistoryRead: true,
      dhtOrHyperswarmInputObservedByCausalSubstrate: true,
      replicatedViaHyperswarmTransport: true,
    });

    return {
      namespaceParts: replica.namespaceParts,
      record,
      replicatedRecord,
      observationResult,
      readerProof: {
        inputReadByCausalSubstrate: true,
        durableCorestoreHistoryRead: true,
        dhtOrHyperswarmInputObservedByCausalSubstrate: true,
        replicatedViaHyperswarmTransport: true,
        sourceCoreKeyHex: Buffer.from(source.lease.store.primaryKey).toString("hex"),
        replicaCoreKeyHex: Buffer.from(replica.lease.store.primaryKey).toString("hex"),
        topicHex: topic.toString("hex"),
        sourceRecordCount: sourceRecords.length,
        replicaRecordCount: replicaRecords.length,
      },
    };
  } finally {
    await closeSwarmQuietly(swarmA);
    await closeSwarmQuietly(swarmB);
    await closeConcernQuietly(replica);
    await closeConcernQuietly(source);
  }
}

function buildDurableRecord(input: {
  seamHistory: unknown;
  recordId?: string | undefined;
  recordedAt: string;
}): EdgeLayerSeamHistoryDurableRecord {
  const seamHistoryHash = `sha256:${hash(stableJson(input.seamHistory))}`;
  return {
    artifactKind: EDGE_LAYER_SEAM_HISTORY_DURABLE_RECORD_KIND,
    schema: EDGE_LAYER_SEAM_HISTORY_DURABLE_RECORD_SCHEMA,
    schemaVersion: 1,
    recordId: input.recordId ??
      `edge-layer-seam-history-durable-record:${seamHistoryHash.slice("sha256:".length, "sha256:".length + 16)}`,
    recordedAt: input.recordedAt,
    seamHistory: input.seamHistory,
    seamHistoryHash,
    seamHistoryHashAlgorithm: "sha256-stable-json",
    sourceRefs: collectSourceRefs(input.seamHistory),
    durableHistoryMaterial: true,
  };
}

async function readDurableRecords(
  concern: OpenedConcern | undefined,
): Promise<EdgeLayerSeamHistoryDurableRecord[]> {
  if (!concern) return [];
  const records = await readConcernRecords(concern, "exchange-artifacts");
  return records.filter(isDurableRecord);
}

function isDurableRecord(value: unknown): value is EdgeLayerSeamHistoryDurableRecord {
  return isRecord(value) &&
    value.artifactKind === EDGE_LAYER_SEAM_HISTORY_DURABLE_RECORD_KIND &&
    value.schema === EDGE_LAYER_SEAM_HISTORY_DURABLE_RECORD_SCHEMA &&
    value.schemaVersion === 1 &&
    typeof value.recordId === "string" &&
    typeof value.seamHistoryHash === "string" &&
    value.durableHistoryMaterial === true;
}

function wireReplicationSockets(
  source: OpenedConcern,
  replica: OpenedConcern,
  swarmA: ReplicationSwarmLike,
  swarmB: ReplicationSwarmLike,
): void {
  swarmA.on("connection", (socket) => {
    source.lease.store.replicate(socket);
  });
  swarmB.on("connection", (socket) => {
    replica.lease.store.replicate(socket);
  });
}

async function connectReaderPeers(input: {
  source: OpenedConcern;
  replica: OpenedConcern;
  swarmA: ReplicationSwarmLike;
  swarmB: ReplicationSwarmLike;
  topic: Buffer;
  timeoutMs: number;
}): Promise<void> {
  const doneA = typeof input.source.lease.store.findingPeers === "function"
    ? input.source.lease.store.findingPeers()
    : undefined;
  const doneB = typeof input.replica.lease.store.findingPeers === "function"
    ? input.replica.lease.store.findingPeers()
    : undefined;

  try {
    const discoveryA = input.swarmA.join(input.topic, DEFAULT_JOIN_OPTIONS);
    const discoveryB = input.swarmB.join(input.topic, DEFAULT_JOIN_OPTIONS);
    await Promise.all([
      waitForSwarmFlush(input.swarmA, input.timeoutMs, "edge-layer-seam-history-reader-swarm-a"),
      waitForSwarmFlush(input.swarmB, input.timeoutMs, "edge-layer-seam-history-reader-swarm-b"),
    ]);
    await waitForDiscoveryRendezvous({
      discoveryA,
      discoveryB,
      swarmA: input.swarmA,
      swarmB: input.swarmB,
      timeoutMs: input.timeoutMs,
    });
  } finally {
    doneA?.();
    doneB?.();
  }
}

function createReaderTopic(namespaceParts: string[]): Buffer {
  return createHash("sha256")
    .update([
      "causal-substrate",
      EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_CONCERN,
      ...namespaceParts,
    ].join("/"))
    .digest();
}

async function refreshReplica(concern: OpenedConcern | undefined): Promise<void> {
  if (!concern) return;
  for (const core of Object.values(concern.cores)) {
    await core.update?.({ wait: false }).catch(() => {});
  }
}

async function waitForSwarmFlush(
  swarm: ReplicationSwarmLike,
  timeoutMs: number,
  label: string,
): Promise<void> {
  await withTimeout(Promise.resolve(swarm.flush(timeoutMs)), timeoutMs, label);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return promise;
  return await new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`timed out waiting for ${label} after ${timeoutMs}ms`));
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function waitFor(
  predicate: () => boolean | Promise<boolean>,
  timeoutMs: number,
  intervalMs = 25,
): Promise<void> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`timed out waiting after ${timeoutMs}ms`);
}

async function closeSwarmQuietly(swarm: ReplicationSwarmLike | undefined): Promise<void> {
  await swarm?.close().catch(() => {});
}

async function closeConcernQuietly(concern: OpenedConcern | undefined): Promise<void> {
  await concern?.close().catch(() => {});
}

function collectSourceRefs(value: unknown): string[] {
  if (!isRecord(value)) return [];
  const refs = [
    value.historyId,
    value.historyHash,
    ...stringArray(value.sourceRepos),
  ];
  for (const pair of arrayRecords(value.pairs)) {
    refs.push(...sourceRefsFromPair(pair));
  }
  for (const pair of arrayRecords(value.linkedPairs)) {
    refs.push(...sourceRefsFromPair(pair));
  }
  return uniqueStrings(refs);
}

function sourceRefsFromPair(pair: Record<string, unknown>): unknown[] {
  const request = isRecord(pair.request) ? pair.request : pair;
  const receipt = isRecord(pair.receipt) ? pair.receipt : pair;
  return [
    request.requestId,
    request.id,
    request.requestHash,
    request.hash,
    request.durableRef,
    request.writerRef,
    receipt.receiptId,
    receipt.id,
    receipt.receiptHash,
    receipt.hash,
    receipt.sourceRequestId,
    receipt.sourceRequestHash,
    receipt.durableRef,
    receipt.writerRef,
  ];
}

function uniqueStrings(values: unknown[]): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.trim() !== ""))];
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function arrayRecords(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (isRecord(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
