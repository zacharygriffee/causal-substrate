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
  assertEdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryNormalizedProofLabel,
  type EdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryProofRung,
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

export const EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_REPORT_READBACK_SCHEMA =
  "causal-substrate/edge-layer-seam-history-hyperswarm-reader-report-readback/v1" as const;

export const EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_REPORT_READBACK_ARTIFACT_KIND =
  "edge-layer-seam-history-hyperswarm-reader-report-readback" as const;

export type EdgeLayerSeamHistoryHyperswarmInputLaneReadinessStatus =
  | "edge-layer-seam-history-hyperswarm-input-lane-ready-to-run"
  | "edge-layer-seam-history-hyperswarm-input-lane-incomplete";

export type EdgeLayerSeamHistoryHyperswarmReaderReportReadbackStatus =
  | "edge-layer-seam-history-hyperswarm-reader-report-readback-valid"
  | "edge-layer-seam-history-hyperswarm-reader-report-readback-invalid";

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
  sourceRefCompleteness: EdgeLayerSeamHistoryDurableRecordSourceRefCompleteness;
  durableHistoryMaterial: true;
}

export interface EdgeLayerSeamHistoryDurableRecordSourceRefCompleteness {
  reportKind: "edge_layer_seam_history_durable_record_source_ref_completeness";
  complete: boolean;
  sourceRefsPresent: boolean;
  requiredRefs: {
    historyId: boolean;
    historyHash: boolean;
    sourceRepos: boolean;
    requestIds: boolean;
    requestHashes: boolean;
    requestDurableRefs: boolean;
    requestWriterRefs: boolean;
    receiptIds: boolean;
    receiptHashes: boolean;
    receiptDurableRefs: boolean;
    receiptWriterRefs: boolean;
  };
  missingRefKinds: string[];
  boundary: {
    reportOnly: true;
    durableRecordMetadataOnly: true;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
  };
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

export interface EdgeLayerSeamHistoryHyperswarmReaderReportReadback {
  artifactKind: typeof EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_REPORT_READBACK_ARTIFACT_KIND;
  schema: typeof EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_REPORT_READBACK_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRecordId?: string;
    replicatedRecordId?: string;
    sourceObservationArtifactId?: string;
    sourceObservationProofRung?: EdgeLayerSeamHistoryProofRung;
    sourceObservationNormalizedProofLabel?: EdgeLayerSeamHistoryNormalizedProofLabel;
    namespaceParts: string[];
  };
  readback: {
    reportReadable: boolean;
    sourceRecordReadable: boolean;
    replicatedRecordReadable: boolean;
    observationResultReadable: boolean;
    readerProofReadable: boolean;
    seamHistoryHashPreserved: boolean;
    durableRecordIdsPreserved: boolean;
    durableSourceRefsPreserved: boolean;
    readerProofPreserved: boolean;
    observationProofLabelsPreserved: boolean;
  };
  durableRecordRefs: {
    sourceRecordId?: string;
    replicatedRecordId?: string;
    seamHistoryHash?: string;
    replicatedSeamHistoryHash?: string;
    sourceRefs: string[];
    replicatedSourceRefs: string[];
  };
  readerProof: Partial<EdgeLayerSeamHistoryHyperswarmReaderProof>;
  boundary: {
    reportReadbackOnly: true;
    verifiesLiveSwarmRun: false;
    opensSwarm: false;
    opensCorestore: false;
    writesRecords: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
    publishesToMesh: false;
  };
  validation: {
    status: EdgeLayerSeamHistoryHyperswarmReaderReportReadbackStatus;
    reportConsumed: boolean;
    sourceRecordRead: boolean;
    replicatedRecordRead: boolean;
    observationResultRead: boolean;
    readerProofRead: boolean;
    seamHistoryHashPreserved: boolean;
    durableSourceRefsPreserved: boolean;
    readerProofPreserved: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    issues: string[];
  };
  reviewStatus: EdgeLayerSeamHistoryHyperswarmReaderReportReadbackStatus;
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
    checkedCliOutputProofRun: string;
    savedReportImportReadback: string;
    savedHandoffBundleReadback: string;
  };
  proofGate: {
    instructionsOnly: true;
    dhtHyperswarmProofClaimedNow: false;
    proofOnlyIfCommandRunsAndPasses: true;
    importReadbackDoesNotVerifyLiveSwarmRun: true;
    handoffBundleReadbackDoesNotVerifyLiveSwarmRun: true;
    lowerProofRungsRemainLowerUntilLiveRun: true;
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
    reportOutputArtifact: "report-output";
    readbackOutputArtifact: "readback-output";
    savedReportImportReadbackOutputArtifact: "saved-report-import-readback-output";
    handoffBundleReadbackOutputArtifact: "handoff-bundle-readback-output";
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

export interface BuildEdgeLayerSeamHistoryHyperswarmReaderReportReadbackInput {
  report: unknown;
  emittedAt: string;
  artifactId?: string | undefined;
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
      checkedCliOutputProofRun:
        "CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 npx tsx scripts/run-edge-layer-seam-history-hyperswarm-reader.ts --input seam-history.json --report-output hyperswarm-reader-report.json --readback-output hyperswarm-reader-report-readback.json --storage-dir-a .tmp/hyperswarm-source --storage-dir-b .tmp/hyperswarm-replica --namespace hyperswarm-seam-history-reader,checked-cli-output",
      savedReportImportReadback:
        "npx tsx scripts/readback-edge-layer-seam-history-hyperswarm-report.ts --input-report hyperswarm-reader-report.json --readback-output hyperswarm-reader-report-import-readback.json",
      savedHandoffBundleReadback:
        "npx tsx scripts/readback-edge-layer-seam-history-handoff-bundle.ts --input-bundle edge-projection-handoff-bundle.json --readback-output edge-projection-handoff-bundle-readback.json",
    },
    proofGate: {
      instructionsOnly: true,
      dhtHyperswarmProofClaimedNow: false,
      proofOnlyIfCommandRunsAndPasses: true,
      importReadbackDoesNotVerifyLiveSwarmRun: true,
      handoffBundleReadbackDoesNotVerifyLiveSwarmRun: true,
      lowerProofRungsRemainLowerUntilLiveRun: true,
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
      reportOutputArtifact: "report-output",
      readbackOutputArtifact: "readback-output",
      savedReportImportReadbackOutputArtifact: "saved-report-import-readback-output",
      handoffBundleReadbackOutputArtifact: "handoff-bundle-readback-output",
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

export function buildEdgeLayerSeamHistoryHyperswarmReaderReportReadback(
  input: BuildEdgeLayerSeamHistoryHyperswarmReaderReportReadbackInput,
): EdgeLayerSeamHistoryHyperswarmReaderReportReadback {
  const report = parseHyperswarmReaderReport(input.report);
  const issues = validateHyperswarmReaderReport(report);
  const status: EdgeLayerSeamHistoryHyperswarmReaderReportReadbackStatus = issues.length === 0
    ? "edge-layer-seam-history-hyperswarm-reader-report-readback-valid"
    : "edge-layer-seam-history-hyperswarm-reader-report-readback-invalid";
  const artifactId = input.artifactId ?? createReportReadbackArtifactId({
    emittedAt: input.emittedAt,
    sourceRecordId: report?.record.recordId,
    replicatedRecordId: report?.replicatedRecord.recordId,
  });

  return {
    artifactKind: EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_REPORT_READBACK_ARTIFACT_KIND,
    schema: EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_REPORT_READBACK_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(report ? { sourceRecordId: report.record.recordId } : {}),
      ...(report ? { replicatedRecordId: report.replicatedRecord.recordId } : {}),
      ...(report ? { sourceObservationArtifactId: report.observationResult.artifactId } : {}),
      ...(report ? { sourceObservationProofRung: report.observationResult.proof.strongestProofRung } : {}),
      ...(report
        ? { sourceObservationNormalizedProofLabel: report.observationResult.proof.normalizedProofLabel }
        : {}),
      namespaceParts: report?.namespaceParts ?? [],
    },
    readback: {
      reportReadable: report !== undefined,
      sourceRecordReadable: report?.record !== undefined,
      replicatedRecordReadable: report?.replicatedRecord !== undefined,
      observationResultReadable: report?.observationResult !== undefined,
      readerProofReadable: report?.readerProof !== undefined,
      seamHistoryHashPreserved: issues.includes("seam-history-hash-not-preserved") === false && report !== undefined,
      durableRecordIdsPreserved: issues.includes("durable-record-ids-missing") === false && report !== undefined,
      durableSourceRefsPreserved: issues.includes("durable-source-refs-not-preserved") === false && report !== undefined,
      readerProofPreserved: issues.includes("reader-proof-not-preserved") === false && report !== undefined,
      observationProofLabelsPreserved:
        issues.includes("observation-proof-labels-not-preserved") === false && report !== undefined,
    },
    durableRecordRefs: {
      ...(report ? { sourceRecordId: report.record.recordId } : {}),
      ...(report ? { replicatedRecordId: report.replicatedRecord.recordId } : {}),
      ...(report ? { seamHistoryHash: report.record.seamHistoryHash } : {}),
      ...(report ? { replicatedSeamHistoryHash: report.replicatedRecord.seamHistoryHash } : {}),
      sourceRefs: report?.record.sourceRefs ?? [],
      replicatedSourceRefs: report?.replicatedRecord.sourceRefs ?? [],
    },
    readerProof: report?.readerProof ?? {},
    boundary: buildReportReadbackBoundary(),
    validation: {
      status,
      reportConsumed: report !== undefined,
      sourceRecordRead: report?.record !== undefined,
      replicatedRecordRead: report?.replicatedRecord !== undefined,
      observationResultRead: report?.observationResult !== undefined,
      readerProofRead: report?.readerProof !== undefined,
      seamHistoryHashPreserved: issues.includes("seam-history-hash-not-preserved") === false && report !== undefined,
      durableSourceRefsPreserved: issues.includes("durable-source-refs-not-preserved") === false && report !== undefined,
      readerProofPreserved: issues.includes("reader-proof-not-preserved") === false && report !== undefined,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      issues,
    },
    reviewStatus: status,
  };
}

export function buildEdgeLayerSeamHistoryDurableRecordSourceRefCompleteness(
  seamHistory: unknown,
  sourceRefs = collectSourceRefs(seamHistory),
): EdgeLayerSeamHistoryDurableRecordSourceRefCompleteness {
  const requiredRefs = collectRequiredSourceRefPresence(seamHistory);
  const missingRefKinds = Object.entries(requiredRefs)
    .filter(([, present]) => present === false)
    .map(([kind]) => kind);

  return {
    reportKind: "edge_layer_seam_history_durable_record_source_ref_completeness",
    complete: missingRefKinds.length === 0 && sourceRefs.length > 0,
    sourceRefsPresent: sourceRefs.length > 0,
    requiredRefs,
    missingRefKinds,
    boundary: {
      reportOnly: true,
      durableRecordMetadataOnly: true,
      acceptsCanonicalHistory: false,
      admitsLayerEvidence: false,
      interpretsRbc: false,
      grantsAuthority: false,
    },
  };
}

export function assertEdgeLayerSeamHistoryHyperswarmReaderReportReadback(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryHyperswarmReaderReportReadback {
  const candidate = assertObject(value, "edge layer seam history hyperswarm reader report readback");
  assertEqual(
    candidate.artifactKind,
    EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_REPORT_READBACK_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, EDGE_LAYER_SEAM_HISTORY_HYPERSWARM_READER_REPORT_READBACK_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reportReadbackOnly, true, "boundary.reportReadbackOnly");
  assertEqual(boundary.verifiesLiveSwarmRun, false, "boundary.verifiesLiveSwarmRun");
  assertEqual(boundary.opensSwarm, false, "boundary.opensSwarm");
  assertEqual(boundary.opensCorestore, false, "boundary.opensCorestore");
  assertEqual(boundary.writesRecords, false, "boundary.writesRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  const validation = assertObject(candidate.validation, "validation");
  assertReportReadbackStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertReportReadbackStatus(candidate.reviewStatus, "reviewStatus");
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
  const sourceRefs = collectSourceRefs(input.seamHistory);
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
    sourceRefs,
    sourceRefCompleteness: buildEdgeLayerSeamHistoryDurableRecordSourceRefCompleteness(input.seamHistory, sourceRefs),
    durableHistoryMaterial: true,
  };
}

function parseHyperswarmReaderReport(
  value: unknown,
): EdgeLayerSeamHistoryHyperswarmReaderReport | undefined {
  if (!isRecord(value)) return undefined;
  const record = isDurableRecord(value.record) ? value.record : undefined;
  const replicatedRecord = isDurableRecord(value.replicatedRecord) ? value.replicatedRecord : undefined;
  const observationResult = parseObservationResult(value.observationResult);
  const readerProof = isReaderProof(value.readerProof) ? value.readerProof : undefined;
  if (!record || !replicatedRecord || !observationResult || !readerProof) return undefined;

  return {
    namespaceParts: stringArray(value.namespaceParts),
    record,
    replicatedRecord,
    observationResult,
    readerProof,
  };
}

function parseObservationResult(value: unknown): EdgeLayerSeamHistoryObservationResult | undefined {
  try {
    assertEdgeLayerSeamHistoryObservationResult(value);
    return value;
  } catch {
    return undefined;
  }
}

function validateHyperswarmReaderReport(
  report: EdgeLayerSeamHistoryHyperswarmReaderReport | undefined,
): string[] {
  if (!report) return ["hyperswarm-reader-report-invalid"];
  const issues: string[] = [];
  if (report.record.recordId.trim() === "" || report.replicatedRecord.recordId.trim() === "") {
    issues.push("durable-record-ids-missing");
  }
  if (report.record.seamHistoryHash !== report.replicatedRecord.seamHistoryHash) {
    issues.push("seam-history-hash-not-preserved");
  }
  if (
    report.record.sourceRefs.length === 0 ||
    stableJson(report.record.sourceRefs) !== stableJson(report.replicatedRecord.sourceRefs)
  ) {
    issues.push("durable-source-refs-not-preserved");
  }
  if (
    report.readerProof.inputReadByCausalSubstrate !== true ||
    report.readerProof.durableCorestoreHistoryRead !== true ||
    report.readerProof.dhtOrHyperswarmInputObservedByCausalSubstrate !== true ||
    report.readerProof.replicatedViaHyperswarmTransport !== true ||
    report.readerProof.sourceCoreKeyHex.trim() === "" ||
    report.readerProof.replicaCoreKeyHex.trim() === "" ||
    report.readerProof.topicHex.trim() === "" ||
    report.readerProof.sourceRecordCount < 1 ||
    report.readerProof.replicaRecordCount < 1
  ) {
    issues.push("reader-proof-not-preserved");
  }
  if (
    report.observationResult.validation.strongestProofRung !== report.observationResult.proof.strongestProofRung ||
    report.observationResult.validation.normalizedProofLabel !== report.observationResult.proof.normalizedProofLabel
  ) {
    issues.push("observation-proof-labels-not-preserved");
  }
  return issues;
}

function buildReportReadbackBoundary(): EdgeLayerSeamHistoryHyperswarmReaderReportReadback["boundary"] {
  return {
    reportReadbackOnly: true,
    verifiesLiveSwarmRun: false,
    opensSwarm: false,
    opensCorestore: false,
    writesRecords: false,
    acceptsCanonicalHistory: false,
    admitsLayerEvidence: false,
    interpretsRbc: false,
    grantsAuthority: false,
    publishesToMesh: false,
  };
}

function createReportReadbackArtifactId(input: {
  emittedAt: string;
  sourceRecordId?: string | undefined;
  replicatedRecordId?: string | undefined;
}): string {
  return `edge-layer-seam-history-hyperswarm-reader-report-readback:${hash(stableJson(input)).slice(0, 16)}`;
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
    Array.isArray(value.sourceRefs) &&
    value.sourceRefs.every((entry) => typeof entry === "string") &&
    value.durableHistoryMaterial === true;
}

function isReaderProof(value: unknown): value is EdgeLayerSeamHistoryHyperswarmReaderProof {
  return isRecord(value) &&
    value.inputReadByCausalSubstrate === true &&
    value.durableCorestoreHistoryRead === true &&
    value.dhtOrHyperswarmInputObservedByCausalSubstrate === true &&
    value.replicatedViaHyperswarmTransport === true &&
    typeof value.sourceCoreKeyHex === "string" &&
    typeof value.replicaCoreKeyHex === "string" &&
    typeof value.topicHex === "string" &&
    typeof value.sourceRecordCount === "number" &&
    typeof value.replicaRecordCount === "number";
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

function collectRequiredSourceRefPresence(
  value: unknown,
): EdgeLayerSeamHistoryDurableRecordSourceRefCompleteness["requiredRefs"] {
  const pairs = collectSourceRefPairs(value);
  return {
    historyId: isRecord(value) && typeof value.historyId === "string" && value.historyId.trim() !== "",
    historyHash: isRecord(value) && typeof value.historyHash === "string" && value.historyHash.trim() !== "",
    sourceRepos: isRecord(value) && stringArray(value.sourceRepos).length > 0,
    requestIds: pairs.length > 0 && pairs.every((pair) => pair.requestIds.length > 0),
    requestHashes: pairs.length > 0 && pairs.every((pair) => pair.requestHashes.length > 0),
    requestDurableRefs: pairs.length > 0 && pairs.every((pair) => pair.requestDurableRefs.length > 0),
    requestWriterRefs: pairs.length > 0 && pairs.every((pair) => pair.requestWriterRefs.length > 0),
    receiptIds: pairs.length > 0 && pairs.every((pair) => pair.receiptIds.length > 0),
    receiptHashes: pairs.length > 0 && pairs.every((pair) => pair.receiptHashes.length > 0),
    receiptDurableRefs: pairs.length > 0 && pairs.every((pair) => pair.receiptDurableRefs.length > 0),
    receiptWriterRefs: pairs.length > 0 && pairs.every((pair) => pair.receiptWriterRefs.length > 0),
  };
}

function collectSourceRefPairs(value: unknown): Array<{
  requestIds: string[];
  requestHashes: string[];
  requestDurableRefs: string[];
  requestWriterRefs: string[];
  receiptIds: string[];
  receiptHashes: string[];
  receiptDurableRefs: string[];
  receiptWriterRefs: string[];
}> {
  if (!isRecord(value)) return [];
  return [...arrayRecords(value.pairs), ...arrayRecords(value.linkedPairs)].map((pair) => {
    const request = isRecord(pair.request) ? pair.request : pair;
    const receipt = isRecord(pair.receipt) ? pair.receipt : pair;
    return {
      requestIds: uniqueStrings([request.requestId, request.id]),
      requestHashes: uniqueStrings([request.requestHash, request.hash]),
      requestDurableRefs: uniqueStrings([request.durableRef]),
      requestWriterRefs: uniqueStrings([request.writerRef]),
      receiptIds: uniqueStrings([receipt.receiptId, receipt.id]),
      receiptHashes: uniqueStrings([receipt.receiptHash, receipt.hash]),
      receiptDurableRefs: uniqueStrings([receipt.durableRef]),
      receiptWriterRefs: uniqueStrings([receipt.writerRef]),
    };
  });
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

function assertObject(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label} must be ${String(expected)}`);
  }
}

function assertString(value: unknown, label: string): void {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertReportReadbackStatus(
  value: unknown,
  label: string,
): asserts value is EdgeLayerSeamHistoryHyperswarmReaderReportReadbackStatus {
  if (
    value !== "edge-layer-seam-history-hyperswarm-reader-report-readback-valid" &&
    value !== "edge-layer-seam-history-hyperswarm-reader-report-readback-invalid"
  ) {
    throw new Error(`${label} must be a hyperswarm reader report readback status`);
  }
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
