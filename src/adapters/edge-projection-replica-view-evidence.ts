import { createHash } from "node:crypto";

export const CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_SCHEMA =
  "causal-substrate/edge-projection-replica-view-evidence/v1" as const;

export const CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-projection-replica-view-evidence" as const;

export type EdgeProjectionReplicaViewEvidenceStatus =
  | "edge-projection-replica-view-evidence-emitted"
  | "edge-projection-replica-view-valid-evidence"
  | "edge-projection-replica-view-incomplete-evidence"
  | "edge-projection-replica-view-malformed-evidence"
  | "edge-projection-replica-view-guardrail-blocked";

export interface EdgeProjectionReplicaViewRefs {
  viewId?: string;
  viewHash?: string;
  sourceCoreKey?: string;
  latestEntryId?: string;
  namespaceParts: string[];
  entryRefs: string[];
  projectionEventRefs: string[];
  projectionRefs: string[];
  payloadHashes: string[];
  sourceRefs: string[];
  transportRefs: string[];
  branchRefs: string[];
  segmentRefs: string[];
  happeningRefs: string[];
  presentPointRefs: string[];
  observerRefs: string[];
}

export interface EdgeProjectionReplicaViewPosture {
  derivedFromReadOnlyReplica: boolean;
  replicatedProjectionViewCandidate: boolean;
  sourceCoreKeyRequired: boolean;
  sourceLocalStoreRootUsedAsSeam: boolean;
  localPathSeam: boolean;
  httpSeam: boolean;
  sshSeam: boolean;
  writesSourceStore: boolean;
  writesReplicaStore: boolean;
  writesDurableLocalLayerState: boolean;
  productionLocalLayerState: boolean;
  autobaseBackend: boolean;
  hyperbeeIndex: boolean;
  wallClockDefinesCausalOrder: boolean;
  localCausalOrderSource?: string;
  collaborativeCausalOrderCandidate?: string;
}

export interface EdgeProjectionReplicaViewContinuityPosture {
  observerRelativeReplicaView: true;
  sourceCoreKeyPresent: boolean;
  projectionRecordsVisible: boolean;
  semanticRefsPresent: boolean;
  causalRefsPresent: boolean;
  entryRefsPreserved: boolean;
  readOnlyReplicaView: boolean;
  acceptedAsCanonicalHistory: false;
  acceptedAsDurableState: false;
  acceptedAsRuntimeAuthority: false;
  causalContinuityRole: "projection-replica-view-continuity-evidence";
}

export interface EdgeProjectionReplicaViewEvidenceBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  edgeRuntimeFetched: false;
  edgeCalled: false;
  edgeMutated: false;
  opensCorestore: false;
  opensAutobase: false;
  opensHyperDht: false;
  opensProtomuxRpc: false;
  replaysProjectionLog: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsReplicatedState: false;
  claimsDurableState: false;
  claimsCausalTruth: false;
  startsBackend: false;
  publishesToMesh: false;
}

export interface EdgeProjectionReplicaViewValidation {
  status: EdgeProjectionReplicaViewEvidenceStatus;
  parseableObject: boolean;
  expectedSourceSchemaPresent: boolean;
  sourceCoreKeyPresent: boolean;
  projectionRecordsPresent: boolean;
  sourceRefsPresent: boolean;
  causalRefsPresent: boolean;
  readOnlyReplicaPosturePresent: boolean;
  unsafeSeamRefsBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  entryRefsPreserved: boolean;
  issues: string[];
}

export interface EdgeProjectionReplicaViewEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceArtifactKind?: string;
    sourceSchema?: string;
    sourcePath?: string;
  };
  replicaViewRefs: EdgeProjectionReplicaViewRefs;
  replicaViewPosture: EdgeProjectionReplicaViewPosture;
  continuityPosture: EdgeProjectionReplicaViewContinuityPosture;
  boundary: EdgeProjectionReplicaViewEvidenceBoundary;
  validation: EdgeProjectionReplicaViewValidation;
  reviewStatus: EdgeProjectionReplicaViewEvidenceStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeProjectionReplicaViewEvidenceInput {
  replicaView: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
  requiredSourceRefs?: string[];
}

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "edge_projection_event_log_replica_view";
const EXPECTED_SCHEMA = "edge_projection_event_log_replica_view.v0";
const HEX_32_BYTES = /^[a-f0-9]{64}$/u;
const SHA256_REF = /^sha256:[a-f0-9]{64}$/u;

export function buildEdgeProjectionReplicaViewEvidenceArtifact(
  input: BuildEdgeProjectionReplicaViewEvidenceInput,
): EdgeProjectionReplicaViewEvidenceArtifact {
  const replicaView = isRecord(input.replicaView) ? input.replicaView : undefined;
  const refs = collectReplicaViewRefs(replicaView);
  const posture = collectReplicaViewPosture(replicaView);
  const issues = validateReplicaView(replicaView, input.replicaView, refs, posture, input.requiredSourceRefs);
  const status = determineStatus(replicaView, issues);
  const sourceArtifactKind = stringValue(replicaView?.artifactKind);
  const sourceSchema = stringValue(replicaView?.schemaVersion);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    ...(refs.viewId ? { viewId: refs.viewId } : {}),
    ...(refs.sourceCoreKey ? { sourceCoreKey: refs.sourceCoreKey } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(sourceArtifactKind ? { sourceArtifactKind } : {}),
      ...(sourceSchema ? { sourceSchema } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    replicaViewRefs: refs,
    replicaViewPosture: posture,
    continuityPosture: collectContinuityPosture(refs, posture),
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: replicaView !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      sourceCoreKeyPresent: issues.includes("source-core-key-missing-or-invalid") === false,
      projectionRecordsPresent: issues.includes("projection-records-missing") === false,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      causalRefsPresent: issues.includes("causal-refs-missing") === false,
      readOnlyReplicaPosturePresent: issues.includes("read-only-replica-posture-missing-or-unsafe") === false,
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("truth-authority-state-or-backend-claim") === false,
      entryRefsPreserved: issues.includes("entry-ref-preservation-mismatch") === false,
      issues,
    },
    reviewStatus: status === "edge-projection-replica-view-valid-evidence"
      ? "edge-projection-replica-view-evidence-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: buildRejections(status, issues),
  };
}

export function assertEdgeProjectionReplicaViewEvidenceArtifact(
  value: unknown,
): asserts value is EdgeProjectionReplicaViewEvidenceArtifact {
  const candidate = assertObject(value, "edge projection replica view evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_EDGE_PROJECTION_REPLICA_VIEW_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.edgeRuntimeFetched, false, "boundary.edgeRuntimeFetched");
  assertEqual(boundary.opensCorestore, false, "boundary.opensCorestore");
  assertEqual(boundary.opensAutobase, false, "boundary.opensAutobase");
  assertEqual(boundary.replaysProjectionLog, false, "boundary.replaysProjectionLog");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.claimsReplicatedState, false, "boundary.claimsReplicatedState");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
}

function collectReplicaViewRefs(replicaView: JsonRecord | undefined): EdgeProjectionReplicaViewRefs {
  const records = objectArray(replicaView?.projectionRecords);
  const refs: EdgeProjectionReplicaViewRefs = {
    namespaceParts: stringArray(replicaView?.namespaceParts),
    entryRefs: unique(records.map((record) => stringValue(record.entryId))),
    projectionEventRefs: unique(records.map((record) => stringValue(record.projectionEventId))),
    projectionRefs: unique(records.map((record) => stringValue(record.projectionRef))),
    payloadHashes: unique(records.map((record) => stringValue(record.payloadHash))),
    sourceRefs: unique(records.flatMap((record) => stringArray(record.sourceRefs))),
    transportRefs: unique(records.flatMap((record) => stringArray(record.transportRefs))),
    branchRefs: unique(records.flatMap((record) => stringArray(record.branchRefs))),
    segmentRefs: unique(records.flatMap((record) => stringArray(record.segmentRefs))),
    happeningRefs: unique(records.flatMap((record) => stringArray(record.happeningRefs))),
    presentPointRefs: unique(records.map((record) => stringValue(record.presentPointRef))),
    observerRefs: unique(records.map((record) => stringValue(record.observerRef))),
  };
  const viewId = stringValue(replicaView?.viewId);
  if (viewId) refs.viewId = viewId;
  const viewHash = stringValue(replicaView?.viewHash);
  if (viewHash) refs.viewHash = viewHash;
  const sourceCoreKey = stringValue(replicaView?.sourceCoreKey);
  if (sourceCoreKey) refs.sourceCoreKey = sourceCoreKey;
  const latestEntryId = stringValue(replicaView?.latestEntryId);
  if (latestEntryId) refs.latestEntryId = latestEntryId;
  return refs;
}

function collectReplicaViewPosture(replicaView: JsonRecord | undefined): EdgeProjectionReplicaViewPosture {
  const posture = isRecord(replicaView?.viewPosture) ? replicaView.viewPosture : {};
  const normalized: EdgeProjectionReplicaViewPosture = {
    derivedFromReadOnlyReplica: posture.derivedFromReadOnlyReplica === true,
    replicatedProjectionViewCandidate: posture.replicatedProjectionViewCandidate === true,
    sourceCoreKeyRequired: posture.sourceCoreKeyRequired === true,
    sourceLocalStoreRootUsedAsSeam: posture.sourceLocalStoreRootUsedAsSeam === true,
    localPathSeam: posture.localPathSeam === true,
    httpSeam: posture.httpSeam === true,
    sshSeam: posture.sshSeam === true,
    writesSourceStore: posture.writesSourceStore === true,
    writesReplicaStore: posture.writesReplicaStore === true,
    writesDurableLocalLayerState: posture.writesDurableLocalLayerState === true,
    productionLocalLayerState: posture.productionLocalLayerState === true,
    autobaseBackend: posture.autobaseBackend === true,
    hyperbeeIndex: posture.hyperbeeIndex === true,
    wallClockDefinesCausalOrder: posture.wallClockDefinesCausalOrder === true,
  };
  const localCausalOrderSource = stringValue(posture.localCausalOrderSource);
  if (localCausalOrderSource) normalized.localCausalOrderSource = localCausalOrderSource;
  const collaborativeCausalOrderCandidate = stringValue(posture.collaborativeCausalOrderCandidate);
  if (collaborativeCausalOrderCandidate) {
    normalized.collaborativeCausalOrderCandidate = collaborativeCausalOrderCandidate;
  }
  return normalized;
}

function collectContinuityPosture(
  refs: EdgeProjectionReplicaViewRefs,
  posture: EdgeProjectionReplicaViewPosture,
): EdgeProjectionReplicaViewContinuityPosture {
  return {
    observerRelativeReplicaView: true,
    sourceCoreKeyPresent: refs.sourceCoreKey !== undefined,
    projectionRecordsVisible: refs.entryRefs.length > 0,
    semanticRefsPresent: refs.sourceRefs.length > 0,
    causalRefsPresent: refs.branchRefs.length > 0 || refs.segmentRefs.length > 0 || refs.happeningRefs.length > 0,
    entryRefsPreserved: refs.latestEntryId === undefined || refs.entryRefs.includes(refs.latestEntryId),
    readOnlyReplicaView: posture.derivedFromReadOnlyReplica === true && posture.replicatedProjectionViewCandidate === true,
    acceptedAsCanonicalHistory: false,
    acceptedAsDurableState: false,
    acceptedAsRuntimeAuthority: false,
    causalContinuityRole: "projection-replica-view-continuity-evidence",
  };
}

function validateReplicaView(
  replicaView: JsonRecord | undefined,
  original: unknown,
  refs: EdgeProjectionReplicaViewRefs,
  posture: EdgeProjectionReplicaViewPosture,
  requiredSourceRefs: unknown,
): string[] {
  if (!isRecord(original) || !replicaView) return ["replica-view-not-object"];
  const issues: string[] = [];
  const records = objectArray(replicaView.projectionRecords);
  const nonClaims = isRecord(replicaView.nonClaims) ? replicaView.nonClaims : {};
  const allRefs = [
    refs.viewId,
    refs.viewHash,
    refs.sourceCoreKey,
    refs.latestEntryId,
    ...refs.namespaceParts,
    ...refs.entryRefs,
    ...refs.projectionEventRefs,
    ...refs.projectionRefs,
    ...refs.payloadHashes,
    ...refs.sourceRefs,
    ...refs.transportRefs,
    ...refs.branchRefs,
    ...refs.segmentRefs,
    ...refs.happeningRefs,
    ...refs.presentPointRefs,
    ...refs.observerRefs,
  ].filter((ref): ref is string => Boolean(ref));

  if (replicaView.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (replicaView.schemaVersion !== EXPECTED_SCHEMA) issues.push("source-schema-mismatch");
  if (!stringValue(refs.viewId)) issues.push("view-id-missing");
  if (!stringValue(refs.viewHash) || !SHA256_REF.test(String(refs.viewHash))) issues.push("view-hash-invalid");
  if (!refs.sourceCoreKey || !HEX_32_BYTES.test(refs.sourceCoreKey)) issues.push("source-core-key-missing-or-invalid");
  if (replicaView.viewState !== "projection_event_log_replica_view_available") issues.push("view-state-not-available");
  if (!Number.isInteger(replicaView.entryCount) || Number(replicaView.entryCount) !== records.length) {
    issues.push("entry-count-mismatch");
  }
  if (records.length === 0) issues.push("projection-records-missing");
  if (refs.latestEntryId && refs.entryRefs.includes(refs.latestEntryId) === false) {
    issues.push("entry-ref-preservation-mismatch");
  }
  if (refs.sourceRefs.length === 0) issues.push("source-refs-missing");
  if (refs.branchRefs.length === 0 && refs.segmentRefs.length === 0 && refs.happeningRefs.length === 0) {
    issues.push("causal-refs-missing");
  }
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");
  if (refs.transportRefs.some((ref) => /http|ssh|localhost|127\.0\.0\.1/iu.test(ref))) {
    issues.push("unsafe-seam-ref");
  }

  for (const [index, record] of records.entries()) {
    if (record.recordKind !== "edge_projection_event_log_replica_view_record") {
      issues.push(`record-${index}-kind-mismatch`);
    }
    if (!Number.isInteger(record.sequence) || Number(record.sequence) < 0) {
      issues.push(`record-${index}-sequence-invalid`);
    }
    if (!stringValue(record.entryId)) issues.push(`record-${index}-entry-id-missing`);
    if (!stringValue(record.projectionEventId)) issues.push(`record-${index}-projection-event-id-missing`);
    if (!stringValue(record.payloadHash) || !SHA256_REF.test(String(record.payloadHash))) {
      issues.push(`record-${index}-payload-hash-invalid`);
    }
    if (record.wallClockDefinesCausalOrder !== false) {
      issues.push("wall-clock-causal-order-overclaim");
    }
  }

  if (
    posture.derivedFromReadOnlyReplica !== true ||
    posture.replicatedProjectionViewCandidate !== true ||
    posture.sourceCoreKeyRequired !== true ||
    posture.sourceLocalStoreRootUsedAsSeam !== false ||
    posture.localPathSeam !== false ||
    posture.httpSeam !== false ||
    posture.sshSeam !== false ||
    posture.writesSourceStore !== false ||
    posture.writesReplicaStore !== false ||
    posture.writesDurableLocalLayerState !== false ||
    posture.productionLocalLayerState !== false ||
    posture.autobaseBackend !== false ||
    posture.wallClockDefinesCausalOrder !== false ||
    posture.collaborativeCausalOrderCandidate !== "autobase_or_equivalent_linearization"
  ) {
    issues.push("read-only-replica-posture-missing-or-unsafe");
  }

  if (
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.universalConsensusClaimed === true ||
    nonClaims.meshSettlementClaimed === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.rendererOwnsAuthority === true
  ) {
    issues.push("truth-authority-state-or-backend-claim");
  }

  const missingRequiredRefs = stringArray(requiredSourceRefs).filter((ref) => refs.sourceRefs.includes(ref) === false);
  if (missingRequiredRefs.length > 0) issues.push("required-source-refs-missing");

  return [...new Set(issues)];
}

function determineStatus(
  replicaView: JsonRecord | undefined,
  issues: string[],
): EdgeProjectionReplicaViewEvidenceStatus {
  if (!replicaView) return "edge-projection-replica-view-malformed-evidence";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("truth-authority-state-or-backend-claim") ||
    issues.includes("read-only-replica-posture-missing-or-unsafe") ||
    issues.includes("wall-clock-causal-order-overclaim") ||
    issues.includes("entry-ref-preservation-mismatch")
  ) {
    return "edge-projection-replica-view-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-projection-replica-view-incomplete-evidence";
  return "edge-projection-replica-view-valid-evidence";
}

function buildBoundary(): EdgeProjectionReplicaViewEvidenceBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    opensCorestore: false,
    opensAutobase: false,
    opensHyperDht: false,
    opensProtomuxRpc: false,
    replaysProjectionLog: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsReplicatedState: false,
    claimsDurableState: false,
    claimsCausalTruth: false,
    startsBackend: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeProjectionReplicaViewEvidenceStatus): string[] {
  if (status === "edge-projection-replica-view-valid-evidence") {
    return [
      "projection-replica-view-preserved-as-continuity-evidence-only",
      "source-core-key-is-replica-basis-not-canonical-history",
      "adapter-does-not-open-corestore-autobase-hyperdht-or-protomux",
      "collaborative-causal-order-still-requires-autobase-or-equivalent-linearization",
    ];
  }
  return ["projection-replica-view-not-accepted-as-causal-history"];
}

function buildRejections(status: EdgeProjectionReplicaViewEvidenceStatus, issues: string[]): string[] {
  if (status === "edge-projection-replica-view-valid-evidence") return [];
  return issues.length > 0 ? issues : [status];
}

function unsafeSeamRef(ref: string): boolean {
  return /https?:\/\/|ssh:\/\/|\/|\\|localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+/iu.test(ref);
}

function createArtifactId(input: { emittedAt: string; sourcePath?: string; viewId?: string; sourceCoreKey?: string }): string {
  return `causal-edge-projection-replica-view-evidence:${hash(JSON.stringify(input)).slice(0, 16)}`;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function objectArray(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) throw new Error(`${label} must be ${String(expected)}`);
}

function assertString(value: unknown, label: string): void {
  if (!stringValue(value)) throw new Error(`${label} must be a non-empty string`);
}
