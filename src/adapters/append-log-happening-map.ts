import { createHash } from "node:crypto";

export const CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA =
  "causal-substrate/append-log-happening-map/v1" as const;

export const CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA_VERSION = 1 as const;

export const CAUSAL_APPEND_LOG_HAPPENING_MAP_ARTIFACT_KIND =
  "causal-append-log-happening-map" as const;

export type AppendLogHappeningMapStatus =
  | "append-log-happening-map-emitted"
  | "append-log-view-valid"
  | "append-log-view-incomplete"
  | "append-log-view-malformed"
  | "append-log-guardrail-blocked";

export interface AppendLogHappeningRef {
  happeningId: string;
  happeningLabel: string;
  sourceEntryRef: string;
  sourceEntryId?: string;
  sourceEntryHash?: string;
  sourceEntryHashRef?: string;
  payloadSha256?: string;
  payloadRef?: string;
  sourceRefs: Record<string, unknown>;
  sourceReceiptRef?: string;
  sourceArtifactRef?: string;
  parentEntryRefs: string[];
  parentEntryHashRefs: string[];
  causalRole: "append-log-entry-as-happening-reference";
  acceptedAsCanonicalHistory: false;
}

export interface AppendLogHappeningMapBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  sourceRuntimeFetched: false;
  sourceRepoCalled: false;
  sourceRepoMutated: false;
  replaysAppendLog: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsCausalTruth: false;
  startsBackend: false;
  requiresAutobase: false;
  publishesToMesh: false;
}

export interface AppendLogHappeningMapValidation {
  status: AppendLogHappeningMapStatus;
  parseableObject: boolean;
  entriesPresent: boolean;
  entriesPreservedAsReferences: boolean;
  sourceFilesRemainScaffold: boolean;
  noBackendWriteClaim: boolean;
  noAuthorityOrTruthClaim: boolean;
  platformRefSemanticsPresent: boolean;
  issues: string[];
}

export interface AppendLogHappeningMapArtifact {
  artifactKind: typeof CAUSAL_APPEND_LOG_HAPPENING_MAP_ARTIFACT_KIND;
  schema: typeof CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA;
  schemaVersion: typeof CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: string;
    sourceSchema?: string;
    sourceArtifactKind?: string;
    sourcePath?: string;
  };
  sourceViewRef?: string;
  sourceViewHashRef?: string;
  appendLogRefs: {
    entryRefs: string[];
    entryHashRefs: string[];
    sourceReceiptRefs: string[];
    payloadRefs: string[];
    artifactRefs: string[];
  };
  happeningRefs: AppendLogHappeningRef[];
  boundary: AppendLogHappeningMapBoundary;
  validation: AppendLogHappeningMapValidation;
  reviewStatus: AppendLogHappeningMapStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildAppendLogHappeningMapInput {
  appendLogView: unknown;
  sourceRepo: string;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

const UNSAFE_POSTURE_KEYS = [
  "sourceIsSubstrate",
  "sourceFilesAreSubstrate",
  "decentralizedTruthClaimed",
  "claimsCausalTruth",
  "edgeAuthorityGranted",
  "deploymentExpanded",
  "replacesSource",
] as const;

export function buildAppendLogHappeningMapArtifact(
  input: BuildAppendLogHappeningMapInput,
): AppendLogHappeningMapArtifact {
  const view = isRecord(input.appendLogView) ? input.appendLogView : undefined;
  const issues = validateAppendLogView(view, input.appendLogView);
  const status = determineStatus(view, issues);
  const happeningRefs = status === "append-log-view-valid"
    ? collectHappeningRefs(view)
    : [];
  const sourceSchema = stringValue(view?.schema);
  const sourceArtifactKind = stringValue(view?.artifactKind);
  const artifactIdInput: {
    sourceRepo: string;
    emittedAt: string;
    sourcePath?: string;
    viewHash?: string;
  } = {
    sourceRepo: input.sourceRepo,
    emittedAt: input.emittedAt,
  };
  if (input.sourcePath) artifactIdInput.sourcePath = input.sourcePath;
  const viewHash = stringValue(view?.viewHash);
  if (viewHash) artifactIdInput.viewHash = viewHash;
  const artifactId =
    input.artifactId ??
    createAppendLogHappeningMapArtifactId(artifactIdInput);

  const artifact: AppendLogHappeningMapArtifact = {
    artifactKind: CAUSAL_APPEND_LOG_HAPPENING_MAP_ARTIFACT_KIND,
    schema: CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA,
    schemaVersion: CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: input.sourceRepo,
      ...(sourceSchema ? { sourceSchema } : {}),
      ...(sourceArtifactKind ? { sourceArtifactKind } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    appendLogRefs: collectAppendLogRefs(view),
    happeningRefs,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: view !== undefined,
      entriesPresent: Array.isArray(view?.entries),
      entriesPreservedAsReferences: status === "append-log-view-valid",
      sourceFilesRemainScaffold: !issues.includes("source-files-treated-as-substrate"),
      noBackendWriteClaim: !issues.includes("backend-write-claim"),
      noAuthorityOrTruthClaim: !issues.includes("authority-or-truth-claim"),
      platformRefSemanticsPresent: !issues.includes("platform-ref-semantics-missing"),
      issues,
    },
    reviewStatus: status === "append-log-view-valid" ? "append-log-happening-map-emitted" : status,
    warnings: buildWarnings(status),
    rejections: buildRejections(status, issues),
  };
  if (viewHash) artifact.sourceViewRef = viewHash;
  const viewHashRef = stringValue(view?.viewHashRef);
  if (viewHashRef) artifact.sourceViewHashRef = viewHashRef;
  return artifact;
}

export function assertAppendLogHappeningMapArtifact(
  value: unknown,
): asserts value is AppendLogHappeningMapArtifact {
  const candidate = assertObject(value, "append-log happening map artifact");
  assertEqual(candidate.artifactKind, CAUSAL_APPEND_LOG_HAPPENING_MAP_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.replaysAppendLog, false, "boundary.replaysAppendLog");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
}

function validateAppendLogView(view: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) {
    return ["append-log-view-not-object"];
  }
  if (!Array.isArray(view?.entries)) {
    issues.push("entries-missing");
    return issues;
  }
  const viewPosture = isRecord(view?.posture) ? view.posture : {};
  if (viewPosture.sourceFilesAreSubstrate === true) issues.push("source-files-treated-as-substrate");
  if (viewPosture.writesAppendLog === true || viewPosture.autobaseBackend === true) issues.push("backend-write-claim");
  if (viewPosture.decentralizedTruthClaimed === true) issues.push("authority-or-truth-claim");
  const platformView = view?.artifactKind === "platform_append_log_view" ||
    view?.schema === "mesh-ecology-platform/dock-append-log-view/v1";
  const appendLogRefs = isRecord(view?.appendLogRefs) ? view.appendLogRefs : {};
  if (
    platformView &&
    (
      !stringValue(view?.viewHashRef) ||
      stringArray(appendLogRefs.entryRefs).length === 0 ||
      stringArray(appendLogRefs.entryHashRefs).length === 0 ||
      stringArray(appendLogRefs.sourceReceiptRefs).length === 0 ||
      stringArray(appendLogRefs.payloadRefs).length === 0
    )
  ) {
    issues.push("platform-ref-semantics-missing");
  }

  for (const [index, entry] of view.entries.entries()) {
    if (!isRecord(entry)) {
      issues.push(`entry:${index}:not-object`);
      continue;
    }
    if (!stringValue(entry.entryId)) issues.push(`entry:${index}:entryId-missing`);
    if (platformView && !stringValue(entry.entryRef)) issues.push("platform-ref-semantics-missing");
    if (!stringValue(entry.payloadSha256)) issues.push(`entry:${index}:payloadSha256-missing`);
    if (platformView && !stringValue(entry.payloadRef)) issues.push("platform-ref-semantics-missing");
    if (!stringValue(entry.entryHash)) issues.push(`entry:${index}:entryHash-missing`);
    if (platformView && !stringValue(entry.entryHashRef)) issues.push("platform-ref-semantics-missing");
    const sourceRefs = isRecord(entry.sourceRefs) ? entry.sourceRefs : {};
    if (
      platformView &&
      (
        !stringValue(sourceRefs.receiptRef) ||
        !stringValue(sourceRefs.artifactRef) ||
        sourceRefs.sourcePathIsSubstrate !== false
      )
    ) {
      issues.push("platform-ref-semantics-missing");
    }
    const posture = isRecord(entry.posture) ? entry.posture : {};
    if (posture.writesAppendLog === true || posture.autobaseBackend === true) issues.push("backend-write-claim");
    if (UNSAFE_POSTURE_KEYS.some((key) => posture[key] === true)) {
      if (posture.sourceIsSubstrate === true || posture.sourceFilesAreSubstrate === true) {
        issues.push("source-files-treated-as-substrate");
      } else {
        issues.push("authority-or-truth-claim");
      }
    }
  }
  return [...new Set(issues)];
}

function determineStatus(view: JsonRecord | undefined, issues: string[]): AppendLogHappeningMapStatus {
  if (!view) return "append-log-view-malformed";
  if (issues.includes("backend-write-claim") || issues.includes("authority-or-truth-claim") || issues.includes("source-files-treated-as-substrate")) {
    return "append-log-guardrail-blocked";
  }
  if (issues.length > 0) return "append-log-view-incomplete";
  return "append-log-view-valid";
}

function collectHappeningRefs(view: JsonRecord | undefined): AppendLogHappeningRef[] {
  const entries = Array.isArray(view?.entries) ? view.entries : [];
  return entries.filter(isRecord).map((entry) => {
    const entryId = stringValue(entry.entryId) ?? "unknown-entry";
    const entryRef = stringValue(entry.entryRef) ?? entryId;
    const payloadSha256 = stringValue(entry.payloadSha256);
    const eventKind = stringValue(entry.eventKind) ?? "append-log-entry";
    const sourceRefs = isRecord(entry.sourceRefs) ? entry.sourceRefs : {};
    const ref: AppendLogHappeningRef = {
      happeningId: createHappeningId(entryId, payloadSha256),
      happeningLabel: eventKind,
      sourceEntryRef: entryRef,
      sourceRefs,
      parentEntryRefs: stringArray(entry.parentEntryRefs),
      parentEntryHashRefs: stringArray(entry.parentEntryHashRefs),
      causalRole: "append-log-entry-as-happening-reference",
      acceptedAsCanonicalHistory: false,
    };
    if (entryRef !== entryId) ref.sourceEntryId = entryId;
    const sourceEntryHash = stringValue(entry.entryHash);
    const sourceEntryHashRef = stringValue(entry.entryHashRef);
    const payloadRef = stringValue(entry.payloadRef);
    const sourceReceiptRef = stringValue(sourceRefs.receiptRef);
    const sourceArtifactRef = stringValue(sourceRefs.artifactRef);
    if (sourceEntryHash) ref.sourceEntryHash = sourceEntryHash;
    if (sourceEntryHashRef) ref.sourceEntryHashRef = sourceEntryHashRef;
    if (payloadSha256) ref.payloadSha256 = payloadSha256;
    if (payloadRef) ref.payloadRef = payloadRef;
    if (sourceReceiptRef) ref.sourceReceiptRef = sourceReceiptRef;
    if (sourceArtifactRef) ref.sourceArtifactRef = sourceArtifactRef;
    return ref;
  });
}

function collectAppendLogRefs(view: JsonRecord | undefined): AppendLogHappeningMapArtifact["appendLogRefs"] {
  const appendLogRefs = isRecord(view?.appendLogRefs) ? view.appendLogRefs : {};
  const entries = Array.isArray(view?.entries) ? view.entries.filter(isRecord) : [];

  return {
    entryRefs: stringArray(appendLogRefs.entryRefs).length > 0
      ? stringArray(appendLogRefs.entryRefs)
      : entries.map((entry) => stringValue(entry.entryRef) ?? stringValue(entry.entryId)).filter((entry): entry is string => Boolean(entry)),
    entryHashRefs: stringArray(appendLogRefs.entryHashRefs).length > 0
      ? stringArray(appendLogRefs.entryHashRefs)
      : entries.map((entry) => stringValue(entry.entryHashRef)).filter((entry): entry is string => Boolean(entry)),
    sourceReceiptRefs: stringArray(appendLogRefs.sourceReceiptRefs).length > 0
      ? stringArray(appendLogRefs.sourceReceiptRefs)
      : entries.map((entry) => {
        const sourceRefs = isRecord(entry.sourceRefs) ? entry.sourceRefs : {};
        return stringValue(sourceRefs.receiptRef);
      }).filter((entry): entry is string => Boolean(entry)),
    payloadRefs: stringArray(appendLogRefs.payloadRefs).length > 0
      ? stringArray(appendLogRefs.payloadRefs)
      : entries.map((entry) => stringValue(entry.payloadRef)).filter((entry): entry is string => Boolean(entry)),
    artifactRefs: stringArray(appendLogRefs.artifactRefs).length > 0
      ? stringArray(appendLogRefs.artifactRefs)
      : entries.map((entry) => {
        const sourceRefs = isRecord(entry.sourceRefs) ? entry.sourceRefs : {};
        return stringValue(sourceRefs.artifactRef);
      }).filter((entry): entry is string => Boolean(entry)),
  };
}

function buildBoundary(): AppendLogHappeningMapBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    sourceRuntimeFetched: false,
    sourceRepoCalled: false,
    sourceRepoMutated: false,
    replaysAppendLog: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    startsBackend: false,
    requiresAutobase: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: AppendLogHappeningMapStatus): string[] {
  if (status === "append-log-view-valid") {
    return [
      "append-log-entries-preserved-as-happening-references-only",
      "mapping-does-not-write-continuity-records",
    ];
  }
  return ["append-log-view-not-accepted-as-causal-history"];
}

function buildRejections(status: AppendLogHappeningMapStatus, issues: string[]): string[] {
  if (status === "append-log-view-valid") return [];
  return issues.length > 0 ? issues : [status];
}

function createHappeningId(entryId: string, payloadSha256?: string): string {
  return `causal-append-log-happening:${hash([entryId, payloadSha256 ?? ""].join("|")).slice(0, 16)}`;
}

function createAppendLogHappeningMapArtifactId(input: {
  sourceRepo: string;
  emittedAt: string;
  sourcePath?: string;
  viewHash?: string;
}): string {
  return `causal-append-log-happening-map:${hash(JSON.stringify(input)).slice(0, 16)}`;
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
