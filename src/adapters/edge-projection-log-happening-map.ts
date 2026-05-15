import { createHash } from "node:crypto";

export const CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA =
  "causal-substrate/edge-projection-log-happening-map/v1" as const;

export const CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_ARTIFACT_KIND =
  "causal-edge-projection-log-happening-map" as const;

export type EdgeProjectionLogHappeningMapStatus =
  | "edge-projection-log-happening-map-emitted"
  | "edge-projection-log-entry-valid"
  | "edge-projection-log-entry-incomplete"
  | "edge-projection-log-entry-malformed"
  | "edge-projection-log-guardrail-blocked";

export interface EdgeProjectionLogHappeningRef {
  happeningId: string;
  happeningLabel: "edge-projection-event-log-entry";
  sourceEntryRef: string;
  sourceProjectionEventRef?: string;
  projectionRef?: string;
  payloadHash?: string;
  payloadHashAlgorithm?: string;
  sequence?: number;
  namespaceParts: string[];
  sourceRefs: string[];
  transportRefs: string[];
  temporalRef?: string;
  temporalRefSource: "projection-event" | "log-entry" | "missing";
  causalRole: "edge-projection-log-entry-as-happening-reference";
  acceptedAsCanonicalHistory: false;
}

export interface EdgeProjectionLogHappeningMapBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  edgeRuntimeFetched: false;
  edgeCalled: false;
  edgeMutated: false;
  sourceCorestoreOpened: false;
  replaysProjectionLog: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsCausalTruth: false;
  startsBackend: false;
  requiresAutobase: false;
  publishesToMesh: false;
}

export interface EdgeProjectionLogHappeningMapValidation {
  status: EdgeProjectionLogHappeningMapStatus;
  parseableObject: boolean;
  entryPreservedAsReference: boolean;
  sourceRefsPresent: boolean;
  temporalRefPresent: boolean;
  namespacePartsSemantic: boolean;
  noStorageOrTransportOverclaim: boolean;
  noAuthorityOrTruthClaim: boolean;
  issues: string[];
}

export interface EdgeProjectionLogHappeningMapArtifact {
  artifactKind: typeof CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceSchema?: string;
    sourceArtifactKind?: string;
    sourcePath?: string;
  };
  happeningRefs: EdgeProjectionLogHappeningRef[];
  boundary: EdgeProjectionLogHappeningMapBoundary;
  validation: EdgeProjectionLogHappeningMapValidation;
  reviewStatus: EdgeProjectionLogHappeningMapStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeProjectionLogHappeningMapInput {
  projectionLogEntry: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "edge_projection_event_log_entry";
const EXPECTED_SCHEMA = "edge_projection_event_log_entry.v0";
const EXPECTED_PROJECTION_EVENT_SCHEMA = "mesh-ecology-spine/local-layer-projection-event/v0";
const SHA256_REF = /^sha256:[a-f0-9]{64}$/u;
const EXPECTED_NAMESPACE_PREFIX = [
  "mesh-ecology",
  "local-layer",
  "projection-event",
  "v0",
  "producer-mesh-ecology-edge",
  "projection-operator-situation-view",
] as const;

export function buildEdgeProjectionLogHappeningMapArtifact(
  input: BuildEdgeProjectionLogHappeningMapInput,
): EdgeProjectionLogHappeningMapArtifact {
  const entry = isRecord(input.projectionLogEntry) ? input.projectionLogEntry : undefined;
  const issues = validateProjectionLogEntry(entry, input.projectionLogEntry);
  const status = determineStatus(entry, issues);
  const happeningRefs = status === "edge-projection-log-entry-valid"
    ? [collectHappeningRef(entry)]
    : [];
  const sourceEntryId = stringValue(entry?.entryId);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    ...(sourceEntryId ? { entryId: sourceEntryId } : {}),
  });
  const temporalRefPresent = issues.includes("temporal-ref-missing") === false;
  const sourceSchema = stringValue(entry?.schemaVersion);
  const sourceArtifactKind = stringValue(entry?.artifactKind);

  return {
    artifactKind: CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA,
    schemaVersion: CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(sourceSchema ? { sourceSchema } : {}),
      ...(sourceArtifactKind ? { sourceArtifactKind } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    happeningRefs,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: entry !== undefined,
      entryPreservedAsReference: status === "edge-projection-log-entry-valid",
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      temporalRefPresent,
      namespacePartsSemantic: issues.includes("namespace-parts-unsafe") === false,
      noStorageOrTransportOverclaim: issues.includes("storage-transport-or-store-seam-overclaim") === false,
      noAuthorityOrTruthClaim: issues.includes("authority-or-truth-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-projection-log-entry-valid"
      ? "edge-projection-log-happening-map-emitted"
      : status,
    warnings: buildWarnings(status, temporalRefPresent),
    rejections: buildRejections(status, issues),
  };
}

export function assertEdgeProjectionLogHappeningMapArtifact(
  value: unknown,
): asserts value is EdgeProjectionLogHappeningMapArtifact {
  const candidate = assertObject(value, "edge projection log happening map artifact");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.edgeRuntimeFetched, false, "boundary.edgeRuntimeFetched");
  assertEqual(boundary.edgeCalled, false, "boundary.edgeCalled");
  assertEqual(boundary.edgeMutated, false, "boundary.edgeMutated");
  assertEqual(boundary.sourceCorestoreOpened, false, "boundary.sourceCorestoreOpened");
  assertEqual(boundary.replaysProjectionLog, false, "boundary.replaysProjectionLog");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
}

function validateProjectionLogEntry(entry: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["projection-log-entry-not-object"];
  if (!entry) return ["projection-log-entry-not-object"];

  const event = isRecord(entry.projectionEvent) ? entry.projectionEvent : {};
  const logPosture = isRecord(entry.logPosture) ? entry.logPosture : {};
  const claims = isRecord(entry.nonClaims) ? entry.nonClaims : {};
  const eventClaims = isRecord(event.nonClaims) ? event.nonClaims : {};
  const eventStorage = isRecord(event.storagePosture) ? event.storagePosture : {};
  const eventValidation = isRecord(event.validation) ? event.validation : {};
  const namespaceParts = stringArray(entry.namespaceParts);
  const sourceRefs = stringArray(entry.sourceRefs);
  const transportRefs = stringArray(entry.transportRefs);

  if (entry.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (entry.schemaVersion !== EXPECTED_SCHEMA) issues.push("schema-mismatch");
  if (!stringValue(entry.entryId)) issues.push("entry-id-missing");
  if (!Number.isInteger(entry.sequence) || Number(entry.sequence) < 0) issues.push("sequence-invalid");
  if (!stringValue(entry.projectionEventId)) issues.push("projection-event-id-missing");
  if (entry.projectionEventSchema !== EXPECTED_PROJECTION_EVENT_SCHEMA) issues.push("projection-event-schema-mismatch");
  if (!stringValue(entry.projectionRef)) issues.push("projection-ref-missing");
  if (!stringValue(entry.payloadHash) || !SHA256_REF.test(String(entry.payloadHash))) issues.push("payload-hash-invalid");
  if (entry.payloadHashAlgorithm !== "sha256-canonical-json") issues.push("payload-hash-algorithm-mismatch");
  if (sourceRefs.length === 0) issues.push("source-refs-missing");
  if (namespaceParts.length === 0) issues.push("namespace-parts-missing");
  if (!expectedNamespacePrefix(namespaceParts)) issues.push("namespace-prefix-mismatch");
  if (namespaceParts.some(unsafeNamespacePart)) issues.push("namespace-parts-unsafe");
  if (transportRefs.some(transportRefIsCompatibilityScaffold)) issues.push("transport-ref-compatibility-scaffold");
  if (!temporalRef(entry, event)) issues.push("temporal-ref-missing");

  if (event.schemaVersion !== EXPECTED_PROJECTION_EVENT_SCHEMA) issues.push("event-schema-mismatch");
  if (event.producerRepo !== "mesh-ecology-edge") issues.push("event-producer-mismatch");
  if (!stringValue(event.eventId)) issues.push("event-id-missing");
  if (!Array.isArray(event.sourceRefs) || event.sourceRefs.length === 0) issues.push("event-source-refs-missing");
  if (!stringValue(event.payloadHash) || !SHA256_REF.test(String(event.payloadHash))) issues.push("event-payload-hash-invalid");
  if (event.payloadHashAlgorithm !== "sha256-canonical-json") issues.push("event-payload-hash-algorithm-mismatch");
  if (event.derivedOnly !== true) issues.push("event-derived-only-missing");
  if (event.payloadEmbedded === true) issues.push("event-payload-embedded");
  if (entry.projectionEventId !== event.eventId) issues.push("event-id-ref-mismatch");
  if (entry.payloadHash !== event.payloadHash) issues.push("payload-hash-ref-mismatch");
  if (entry.projectionRef !== event.projectionRef) issues.push("projection-ref-mismatch");
  if (eventStorage.currentDurability !== "not_durable_state") issues.push("event-current-durability-overclaim");
  if (eventStorage.currentExportOnly !== true) issues.push("event-export-only-missing");
  if (eventValidation.sourceRefsPresent !== true || eventValidation.payloadHashPresent !== true) {
    issues.push("event-validation-flags-missing");
  }
  if (eventValidation.localFileTruth === true || eventValidation.durableState === true) {
    issues.push("event-validation-claims-local-file-or-durable-state");
  }

  if (logPosture.singleWriterLocalCorestoreProof !== true) issues.push("single-writer-corestore-proof-missing");
  if (logPosture.writesProjectionLog !== true) issues.push("writes-projection-log-missing");
  if (
    logPosture.replicatedLocalLayerState === true ||
    logPosture.autobaseBackend === true ||
    logPosture.hyperbeeIndex === true ||
    logPosture.httpSeam === true ||
    logPosture.sshSeam === true ||
    logPosture.localStoreRootIsIntegrationSeam === true
  ) {
    issues.push("storage-transport-or-store-seam-overclaim");
  }

  if (claimsContainAuthorityOrTruth(claims) || claimsContainAuthorityOrTruth(eventClaims)) {
    issues.push("authority-or-truth-claim");
  }

  return [...new Set(issues)];
}

function determineStatus(
  entry: JsonRecord | undefined,
  issues: string[],
): EdgeProjectionLogHappeningMapStatus {
  if (!entry) return "edge-projection-log-entry-malformed";
  if (
    issues.includes("storage-transport-or-store-seam-overclaim") ||
    issues.includes("authority-or-truth-claim") ||
    issues.includes("namespace-parts-unsafe") ||
    issues.includes("transport-ref-compatibility-scaffold") ||
    issues.includes("event-payload-embedded")
  ) {
    return "edge-projection-log-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-projection-log-entry-incomplete";
  return "edge-projection-log-entry-valid";
}

function collectHappeningRef(entry: JsonRecord | undefined): EdgeProjectionLogHappeningRef {
  const safeEntry = entry ?? {};
  const event = isRecord(safeEntry.projectionEvent) ? safeEntry.projectionEvent : {};
  const temporal = temporalRef(safeEntry, event);
  const entryId = stringValue(safeEntry.entryId) ?? "unknown-entry";
  const payloadHash = stringValue(safeEntry.payloadHash);
  const ref: EdgeProjectionLogHappeningRef = {
    happeningId: createHappeningId(entryId, payloadHash),
    happeningLabel: "edge-projection-event-log-entry",
    sourceEntryRef: entryId,
    namespaceParts: stringArray(safeEntry.namespaceParts),
    sourceRefs: stringArray(safeEntry.sourceRefs),
    transportRefs: stringArray(safeEntry.transportRefs),
    temporalRefSource: temporal?.source ?? "missing",
    causalRole: "edge-projection-log-entry-as-happening-reference",
    acceptedAsCanonicalHistory: false,
  };
  const sourceProjectionEventRef = stringValue(safeEntry.projectionEventId);
  if (sourceProjectionEventRef) ref.sourceProjectionEventRef = sourceProjectionEventRef;
  const projectionRef = stringValue(safeEntry.projectionRef);
  if (projectionRef) ref.projectionRef = projectionRef;
  if (payloadHash) ref.payloadHash = payloadHash;
  const payloadHashAlgorithm = stringValue(safeEntry.payloadHashAlgorithm);
  if (payloadHashAlgorithm) ref.payloadHashAlgorithm = payloadHashAlgorithm;
  if (Number.isInteger(safeEntry.sequence)) ref.sequence = Number(safeEntry.sequence);
  if (temporal?.value) ref.temporalRef = temporal.value;
  return ref;
}

function temporalRef(entry: JsonRecord, event: JsonRecord): { value: string; source: "log-entry" | "projection-event" } | undefined {
  const entryTemporal =
    stringValue(entry.appendedAt) ??
    stringValue(entry.createdAt) ??
    stringValue(entry.observedAt);
  if (entryTemporal) return { value: entryTemporal, source: "log-entry" };

  const eventTemporal =
    stringValue(event.createdAt) ??
    stringValue(event.observedAt) ??
    stringValue(event.emittedAt);
  if (eventTemporal) return { value: eventTemporal, source: "projection-event" };
  return undefined;
}

function buildBoundary(): EdgeProjectionLogHappeningMapBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    sourceCorestoreOpened: false,
    replaysProjectionLog: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    startsBackend: false,
    requiresAutobase: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeProjectionLogHappeningMapStatus, temporalRefPresent: boolean): string[] {
  if (status === "edge-projection-log-entry-valid") {
    return [
      "edge-projection-log-entry-preserved-as-happening-reference-only",
      "mapping-does-not-write-continuity-records",
    ];
  }
  return temporalRefPresent
    ? ["edge-projection-log-entry-not-accepted-as-causal-history"]
    : [
        "edge-projection-log-entry-not-accepted-as-causal-history",
        "projection-log-entry-has-no-clock-ref",
      ];
}

function buildRejections(status: EdgeProjectionLogHappeningMapStatus, issues: string[]): string[] {
  if (status === "edge-projection-log-entry-valid") return [];
  return issues.length > 0 ? issues : [status];
}

function createHappeningId(entryId: string, payloadHash?: string): string {
  return `causal-edge-projection-log-happening:${hash([entryId, payloadHash ?? ""].join("|")).slice(0, 16)}`;
}

function createArtifactId(input: { emittedAt: string; sourcePath?: string; entryId?: string }): string {
  return `causal-edge-projection-log-happening-map:${hash(JSON.stringify(input)).slice(0, 16)}`;
}

function claimsContainAuthorityOrTruth(claims: JsonRecord): boolean {
  return claims.truthClaimed === true ||
    claims.completionClaimed === true ||
    claims.authorityGranted === true ||
    claims.replicatedStateClaimed === true ||
    claims.durableStateClaimed === true ||
    claims.rendererOwnsAuthority === true;
}

function expectedNamespacePrefix(namespaceParts: string[]): boolean {
  return EXPECTED_NAMESPACE_PREFIX.every((part, index) => namespaceParts[index] === part);
}

function unsafeNamespacePart(part: string): boolean {
  return /:\/\/|\/|\\|(^|[.-])\.\.($|[.-])|localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+/iu.test(part);
}

function transportRefIsCompatibilityScaffold(ref: string): boolean {
  return /http|ssh|localhost|127\.0\.0\.1/iu.test(ref);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function assertObject(value: unknown, label: string): JsonRecord {
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
  if (!stringValue(value)) {
    throw new Error(`${label} must be a non-empty string`);
  }
}
