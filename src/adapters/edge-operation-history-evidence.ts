import { createHash } from "node:crypto";

export const CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA =
  "causal-substrate/edge-operation-history-evidence/v1" as const;

export const CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-operation-history-evidence" as const;

export const EDGE_OPERATION_TRAIL_ARTIFACT_KIND = "edge_operation_trail" as const;
export const EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND = "edge_operation_append_log_view" as const;
export const EDGE_OPERATION_APPEND_LOG_VIEW_SCHEMA =
  "mesh-ecology-edge/operation-append-log-view/v1" as const;

export type EdgeOperationHistorySourceArtifactKind =
  | typeof EDGE_OPERATION_TRAIL_ARTIFACT_KIND
  | typeof EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND;

export type EdgeOperationHistoryEvidenceStatus =
  | "operation-history-evidence-emitted"
  | "operation-history-valid-trail"
  | "operation-history-incomplete-trail"
  | "operation-history-malformed-trail"
  | "operation-history-guardrail-blocked";

export type EdgeOperationHistoryCheckStatus =
  | "present"
  | "missing"
  | "malformed"
  | "preserved-as-reference"
  | "blocked-by-guardrail"
  | "not-evaluated";

export interface EdgeOperationHistoryBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  edgeRuntimeFetched: false;
  edgeCalled: false;
  edgeMutated: false;
  replaysEvents: false;
  claimsCausalTruth: false;
  acceptsCanonicalBranch: false;
  writesContinuityRecords: false;
  publishesToMesh: false;
}

export interface EdgeOperationHistoryTrailRefs {
  operationId?: string;
  operationKind?: string;
  operationStatus?: string;
  contextRef?: string;
  sourcePath?: string;
  sourceProfile?: EdgeOperationHistorySourceArtifactKind;
  sourceSchema?: string;
  sourceScaffold?: string;
  sourceIsSubstrate?: boolean;
  appendLogBackend?: string;
  entryCount?: number;
}

export interface EdgeOperationHistoryEventRef {
  eventId: string;
  operationId?: string;
  eventKind?: string;
  parentEventRefs: string[];
  receiptRefs: string[];
  evidenceRefs: string[];
  contactProofRefs: string[];
}

export interface EdgeOperationHistoryCheck {
  checkId: string;
  status: EdgeOperationHistoryCheckStatus;
  summary: string;
  refs: string[];
}

export interface EdgeOperationHistoryValidation {
  status: EdgeOperationHistoryEvidenceStatus;
  parseableJsonObject: boolean;
  requiredTrailEnvelopePresent: boolean;
  eventsPreservedAsReferences: boolean;
  receiptsPreservedAsReferences: boolean;
  postureBlocksTruthOrReplayClaims: boolean;
  checks: EdgeOperationHistoryCheck[];
}

export interface EdgeOperationHistoryImportClassification {
  seamId: "edge_operation_history";
  evidenceKind: "edge_operation_history_evidence";
  edgeExpectedArtifactKind: typeof EDGE_OPERATION_TRAIL_ARTIFACT_KIND;
  acceptedSourceArtifactKinds: readonly [
    typeof EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND,
    typeof EDGE_OPERATION_TRAIL_ARTIFACT_KIND,
  ];
  preferredSourceArtifactKind: typeof EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND;
  classificationOnly: true;
  edgeOwnsSchema: true;
  causalOwnsEvidenceArtifact: true;
}

export interface EdgeOperationHistoryEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceArtifactKind: EdgeOperationHistorySourceArtifactKind;
    sourcePath?: string;
  };
  trailRefs: EdgeOperationHistoryTrailRefs;
  eventRefs: EdgeOperationHistoryEventRef[];
  boundary: EdgeOperationHistoryBoundary;
  validation: EdgeOperationHistoryValidation;
  reviewStatus: EdgeOperationHistoryEvidenceStatus;
  importClassification: EdgeOperationHistoryImportClassification;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeOperationHistoryEvidenceInput {
  trail: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

const REQUIRED_TRAIL_KEYS = ["artifactKind", "operationId", "context", "events"] as const;
const REQUIRED_APPEND_LOG_VIEW_KEYS = [
  "artifactKind",
  "operationId",
  "entries",
  "boundary",
] as const;

const UNSAFE_POSTURE_KEYS = [
  "truthClaimed",
  "completionClaimed",
  "schedulerUsed",
  "runnerUsed",
  "discoveryPerformed",
  "futureAuthorizationGranted",
  "meshTruthClaimed",
  "canonicalBranchAccepted",
  "causalTruthClaimed",
  "replayAuthorized",
  "claimsCausalTruth",
  "claimsMeshTruth",
  "claimsCompletion",
  "writesAppendLog",
  "writesContinuityRecords",
  "acceptsCanonicalBranch",
  "replaysEvents",
  "sourceIsSubstrate",
  "replacesOperationTrail",
  "autobaseBackend",
  "writesLog",
  "publishesToMesh",
  "schedulesWork",
  "watchesFiles",
  "discoversTargets",
  "edgeAuthorityGranted",
] as const;

export function buildEdgeOperationHistoryEvidenceArtifact(
  input: BuildEdgeOperationHistoryEvidenceInput,
): EdgeOperationHistoryEvidenceArtifact {
  return buildArtifactFromParsedTrail({
    ...input,
    parsedTrail: input.trail,
    parseableJsonObject: isRecord(input.trail),
  });
}

export function buildEdgeOperationHistoryEvidenceArtifactFromJson(
  input: Omit<BuildEdgeOperationHistoryEvidenceInput, "trail"> & { trailJson: string },
): EdgeOperationHistoryEvidenceArtifact {
  try {
    const trail = JSON.parse(input.trailJson) as unknown;
    return buildArtifactFromParsedTrail({
      ...input,
      parsedTrail: trail,
      parseableJsonObject: isRecord(trail),
    });
  } catch {
    return buildArtifactFromParsedTrail({
      ...input,
      parsedTrail: undefined,
      parseableJsonObject: false,
    });
  }
}

export function assertEdgeOperationHistoryEvidenceArtifact(
  value: unknown,
): asserts value is EdgeOperationHistoryEvidenceArtifact {
  const candidate = assertObject(value, "edge operation history evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA, "schema");
  assertEqual(
    candidate.schemaVersion,
    CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA_VERSION,
    "schemaVersion",
  );
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.edgeRuntimeFetched, false, "boundary.edgeRuntimeFetched");
  assertEqual(boundary.edgeCalled, false, "boundary.edgeCalled");
  assertEqual(boundary.edgeMutated, false, "boundary.edgeMutated");
  assertEqual(boundary.replaysEvents, false, "boundary.replaysEvents");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
  assertEqual(boundary.acceptsCanonicalBranch, false, "boundary.acceptsCanonicalBranch");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  const classification = assertObject(candidate.importClassification, "importClassification");
  assertEqual(classification.seamId, "edge_operation_history", "importClassification.seamId");
  assertEqual(classification.classificationOnly, true, "importClassification.classificationOnly");
  assertEqual(classification.causalOwnsEvidenceArtifact, true, "importClassification.causalOwnsEvidenceArtifact");
}

function buildArtifactFromParsedTrail(input: {
  parsedTrail: unknown;
  parseableJsonObject: boolean;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}): EdgeOperationHistoryEvidenceArtifact {
  const trail = isRecord(input.parsedTrail) ? input.parsedTrail : undefined;
  const checks = validateTrail(trail, input.parseableJsonObject);
  const validationStatus = determineValidationStatus(checks, input.parseableJsonObject);
  const trailRefs = collectTrailRefs(trail, input.sourcePath);
  const eventRefs = collectEventRefs(trail);
  const sourceArtifactKind = operationHistorySourceArtifactKind(trail);
  const reviewStatus =
    validationStatus === "operation-history-valid-trail"
      ? "operation-history-evidence-emitted"
      : validationStatus;
  const artifactIdInput: {
    emittedAt: string;
    operationId?: string;
    sourcePath?: string;
  } = {
    emittedAt: input.emittedAt,
  };
  if (trailRefs.operationId) {
    artifactIdInput.operationId = trailRefs.operationId;
  }
  if (input.sourcePath) {
    artifactIdInput.sourcePath = input.sourcePath;
  }
  const artifactId =
    input.artifactId ??
    createOperationHistoryEvidenceArtifactId(artifactIdInput);

  return {
    artifactKind: CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      sourceArtifactKind,
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    trailRefs,
    eventRefs,
    boundary: buildBoundary(),
    validation: {
      status: validationStatus,
      parseableJsonObject: input.parseableJsonObject && trail !== undefined,
      requiredTrailEnvelopePresent: checks
        .filter((check) => check.checkId.startsWith("required-trail-envelope:"))
        .every((check) => check.status === "present"),
      eventsPreservedAsReferences:
        findCheck(checks, "events-reference-preservation")?.status === "preserved-as-reference",
      receiptsPreservedAsReferences:
        findCheck(checks, "receipt-reference-preservation")?.status === "preserved-as-reference",
      postureBlocksTruthOrReplayClaims:
        findCheck(checks, "unsafe-posture-claims")?.status !== "blocked-by-guardrail",
      checks,
    },
    reviewStatus,
    importClassification: {
      seamId: "edge_operation_history",
      evidenceKind: "edge_operation_history_evidence",
      edgeExpectedArtifactKind: EDGE_OPERATION_TRAIL_ARTIFACT_KIND,
      acceptedSourceArtifactKinds: [
        EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND,
        EDGE_OPERATION_TRAIL_ARTIFACT_KIND,
      ],
      preferredSourceArtifactKind: EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND,
      classificationOnly: true,
      edgeOwnsSchema: true,
      causalOwnsEvidenceArtifact: true,
    },
    warnings: buildWarnings(validationStatus),
    rejections: buildRejections(validationStatus, checks),
  };
}

function validateTrail(
  trail: JsonRecord | undefined,
  parseableJsonObject: boolean,
): EdgeOperationHistoryCheck[] {
  if (!parseableJsonObject || trail === undefined) {
    return [
      {
        checkId: "parseable-json-object",
        status: "malformed",
        summary: "Input is not a parseable JSON object.",
        refs: [],
      },
    ];
  }

  const checks: EdgeOperationHistoryCheck[] = [
    {
      checkId: "parseable-json-object",
      status: "present",
      summary: "Trail is a parseable JSON object.",
      refs: [],
    },
  ];

  if (trail.artifactKind === EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND) {
    return [...checks, ...validateAppendLogView(trail)];
  }

  for (const key of REQUIRED_TRAIL_KEYS) {
    checks.push({
      checkId: `required-trail-envelope:${key}`,
      status: requiredTrailFieldPresent(trail, key) ? "present" : "missing",
      summary: `Edge operation trail field '${key}' is ${
        requiredTrailFieldPresent(trail, key) ? "present" : "missing"
      }.`,
      refs: [key],
    });
  }

  const events = Array.isArray(trail.events) ? trail.events : [];
  checks.push({
    checkId: "event-shape",
    status: events.length > 0 && events.every((event) => validEventShape(event)) ? "present" : "malformed",
    summary: "Events carry eventId, operationId, and eventKind.",
    refs: ["events[].eventId", "events[].operationId", "events[].eventKind"],
  });
  checks.push({
    checkId: "events-reference-preservation",
    status: events.length > 0 ? "preserved-as-reference" : "missing",
    summary: "Event ids and parent refs are preserved as references only.",
    refs: events.flatMap((event) => eventRefStrings(event, ["eventId", "parentEventRefs"])),
  });
  checks.push({
    checkId: "receipt-reference-preservation",
    status: events.some((event) => eventRefStrings(event, ["receiptRefs"]).length > 0)
      ? "preserved-as-reference"
      : "not-evaluated",
    summary: "Receipt refs are preserved as references only when present.",
    refs: events.flatMap((event) => eventRefStrings(event, ["receiptRefs"])),
  });
  checks.push({
    checkId: "unsafe-posture-claims",
    status: containsUnsafePostureClaim(trail) ? "blocked-by-guardrail" : "present",
    summary: "Trail and events do not claim truth, completion, replay, branch acceptance, or hidden execution.",
    refs: ["posture", "events[].posture"],
  });
  return checks;
}

function validateAppendLogView(trail: JsonRecord): EdgeOperationHistoryCheck[] {
  const checks: EdgeOperationHistoryCheck[] = [];
  for (const key of REQUIRED_APPEND_LOG_VIEW_KEYS) {
    checks.push({
      checkId: `required-append-log-view-envelope:${key}`,
      status: requiredAppendLogViewFieldPresent(trail, key) ? "present" : "missing",
      summary: `Edge operation append-log view field '${key}' is ${
        requiredAppendLogViewFieldPresent(trail, key) ? "present" : "missing"
      }.`,
      refs: [key],
    });
  }

  const entries = Array.isArray(trail.entries) ? trail.entries : [];
  checks.push({
    checkId: "event-shape",
    status: entries.length > 0 && entries.every((entry) => validAppendLogEntryShape(entry)) ? "present" : "malformed",
    summary: "Append-log entries carry eventId, operationId, and eventKind.",
    refs: ["entries[].eventId", "entries[].operationId", "entries[].eventKind"],
  });
  checks.push({
    checkId: "events-reference-preservation",
    status: entries.length > 0 ? "preserved-as-reference" : "missing",
    summary: "Append-log entry event ids and parent refs are preserved as references only.",
    refs: entries.flatMap((entry) => eventRefStrings(entry, ["eventId", "parentEventRefs"])),
  });
  checks.push({
    checkId: "receipt-reference-preservation",
    status: entries.some((entry) => eventRefStrings(entry, ["receiptRefs"]).length > 0)
      ? "preserved-as-reference"
      : "not-evaluated",
    summary: "Append-log entry receipt refs are preserved as references only when present.",
    refs: entries.flatMap((entry) => eventRefStrings(entry, ["receiptRefs"])),
  });
  checks.push({
    checkId: "append-log-reference-preservation",
    status: entries.some((entry) => eventRefStrings(entry, ["payloadSha256", "schema"]).length > 0)
      ? "preserved-as-reference"
      : "not-evaluated",
    summary: "Append-log entry schemas and payload hashes are preserved as references only.",
    refs: entries.flatMap((entry) => eventRefStrings(entry, ["payloadSha256", "schema"])),
  });
  checks.push({
    checkId: "local-file-substrate-claim",
    status: trail.sourceIsSubstrate === false ? "present" : "blocked-by-guardrail",
    summary: "Append-log view explicitly keeps local JSON operation trails from becoming substrate truth.",
    refs: ["sourceIsSubstrate"],
  });
  checks.push({
    checkId: "append-log-backend-not-started",
    status:
      trail.appendLogBackend === "none" &&
      trail.autobaseBackend === false &&
      trail.writesLog === false &&
      trail.replacesOperationTrail === false
        ? "present"
        : "blocked-by-guardrail",
    summary: "Append-log view does not start Autobase, write logs, or replace Edge's operation trail.",
    refs: ["appendLogBackend", "autobaseBackend", "writesLog", "replacesOperationTrail"],
  });
  checks.push({
    checkId: "unsafe-posture-claims",
    status: containsUnsafePostureClaim(trail) ? "blocked-by-guardrail" : "present",
    summary: "Append-log view and entries do not claim truth, completion, replay, branch acceptance, or hidden execution.",
    refs: ["boundary", "entries[].posture"],
  });
  return checks;
}

function determineValidationStatus(
  checks: EdgeOperationHistoryCheck[],
  parseableJsonObject: boolean,
): EdgeOperationHistoryEvidenceStatus {
  if (!parseableJsonObject || checks.some((check) => check.checkId === "parseable-json-object" && check.status === "malformed")) {
    return "operation-history-malformed-trail";
  }
  if (checks.some((check) => check.status === "blocked-by-guardrail")) {
    return "operation-history-guardrail-blocked";
  }
  if (
    checks.some(
      (check) =>
        check.status === "missing" ||
        (check.status === "malformed" && check.checkId === "event-shape"),
    )
  ) {
    return "operation-history-incomplete-trail";
  }
  return "operation-history-valid-trail";
}

function collectTrailRefs(
  trail: JsonRecord | undefined,
  sourcePath: string | undefined,
): EdgeOperationHistoryTrailRefs {
  if (!trail) {
    return sourcePath ? { sourcePath } : {};
  }
  if (trail.artifactKind === EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND) {
    const operationId = stringValue(trail.operationId);
    const operationKind = stringValue(trail.operationKind);
    const sourceTrailPath = stringValue(trail.sourceTrailPath);
    const sourceSchema = stringValue(trail.schema);
    const sourceScaffold = stringValue(trail.sourceScaffold);
    const appendLogBackend = stringValue(trail.appendLogBackend);
    const entryCount = typeof trail.entryCount === "number" ? trail.entryCount : undefined;
    const resolvedSourcePath = sourcePath ?? sourceTrailPath;
    return {
      ...(operationId ? { operationId } : {}),
      ...(operationKind ? { operationKind } : {}),
      sourceProfile: EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND,
      ...(sourceSchema ? { sourceSchema } : {}),
      ...(sourceScaffold ? { sourceScaffold } : {}),
      ...(typeof trail.sourceIsSubstrate === "boolean" ? { sourceIsSubstrate: trail.sourceIsSubstrate } : {}),
      ...(appendLogBackend ? { appendLogBackend } : {}),
      ...(entryCount !== undefined ? { entryCount } : {}),
      ...(resolvedSourcePath ? { sourcePath: resolvedSourcePath } : {}),
    };
  }
  const context = isRecord(trail.context) ? trail.context : undefined;
  const operationId = stringValue(trail.operationId);
  const operationKind = stringValue(context?.operationKind);
  const operationStatus = stringValue(trail.status);
  const contextRef = stringValue(context?.operationId);
  return {
    ...(operationId ? { operationId } : {}),
    ...(operationKind ? { operationKind } : {}),
    ...(operationStatus ? { operationStatus } : {}),
    ...(contextRef ? { contextRef } : {}),
    sourceProfile: EDGE_OPERATION_TRAIL_ARTIFACT_KIND,
    ...(sourcePath ? { sourcePath } : {}),
  };
}

function collectEventRefs(trail: JsonRecord | undefined): EdgeOperationHistoryEventRef[] {
  if (Array.isArray(trail?.entries)) {
    return trail.entries.filter(isRecord).map((entry) => {
      const operationId = stringValue(entry.operationId);
      const eventKind = stringValue(entry.eventKind);
      return {
        eventId: stringValue(entry.eventId) ?? "malformed-event-ref",
        ...(operationId ? { operationId } : {}),
        ...(eventKind ? { eventKind } : {}),
        parentEventRefs: stringArray(entry.parentEventRefs),
        receiptRefs: stringArray(entry.receiptRefs),
        evidenceRefs: collectEvidenceRefs(entry),
        contactProofRefs: collectContactProofRefs(entry),
      };
    });
  }
  if (!Array.isArray(trail?.events)) {
    return [];
  }
  return trail.events.filter(isRecord).map((event) => {
    const operationId = stringValue(event.operationId);
    const eventKind = stringValue(event.eventKind);
    return {
      eventId: stringValue(event.eventId) ?? "malformed-event-ref",
      ...(operationId ? { operationId } : {}),
      ...(eventKind ? { eventKind } : {}),
      parentEventRefs: stringArray(event.parentEventRefs),
      receiptRefs: stringArray(event.receiptRefs),
      evidenceRefs: collectEvidenceRefs(event),
      contactProofRefs: collectContactProofRefs(event),
    };
  });
}

function collectEvidenceRefs(event: JsonRecord): string[] {
  const refs = new Set<string>();
  for (const key of ["evidenceRefs", "attachmentRefs", "sourceRefs"]) {
    for (const ref of stringArray(event[key])) {
      refs.add(ref);
    }
  }
  const payloadSha256 = stringValue(event.payloadSha256);
  if (payloadSha256) {
    refs.add(payloadSha256);
  }
  const entrySchema = stringValue(event.schema);
  if (entrySchema) {
    refs.add(entrySchema);
  }
  const payload = isRecord(event.payload) ? event.payload : undefined;
  for (const key of ["evidenceRef", "attachmentRef", "sourceRef", "hash", "path", "artifactPath", "evidenceSha256", "evidencePath"]) {
    const value = stringValue(payload?.[key]);
    if (value) {
      refs.add(value);
    }
  }
  return [...refs];
}

function collectContactProofRefs(event: JsonRecord): string[] {
  const payload = isRecord(event.payload) ? event.payload : undefined;
  const posture = isRecord(payload?.contactProofPosture) ? payload.contactProofPosture : undefined;
  const refs = new Set<string>();
  if (posture) {
    for (const key of ["sourceRepo", "sourceSchema", "proofKind", "requestId", "responseId", "hostPublicKey", "transportKind", "contactSeam", "readinessScope"]) {
      const value = stringValue(posture[key]);
      if (value) refs.add(`${key}:${value}`);
    }
  }
  for (const [key, refKey] of [
    ["contactProofState", "state"],
    ["contactProofPath", "path"],
    ["sourceKind", "sourceKind"],
    ["protocolFamily", "protocolFamily"],
    ["protocolSchema", "protocolSchema"],
    ["dispatchCommand", "dispatchCommand"],
    ["transportKind", "transportKind"],
    ["contactSeam", "contactSeam"],
    ["readinessScope", "readinessScope"],
  ] as const) {
    const value = stringValue(payload?.[key]);
    if (value) refs.add(`${refKey}:${value}`);
  }
  return [...refs];
}

function containsUnsafePostureClaim(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((entry) => containsUnsafePostureClaim(entry));
  }
  if (!isRecord(value)) {
    return false;
  }
  for (const key of UNSAFE_POSTURE_KEYS) {
    if (value[key] === true) {
      return true;
    }
  }
  if (isRecord(value.posture) && containsUnsafePostureClaim(value.posture)) {
    return true;
  }
  if (isRecord(value.boundary) && containsUnsafePostureClaim(value.boundary)) {
    return true;
  }
  if (Array.isArray(value.events) && value.events.some((event) => containsUnsafePostureClaim(event))) {
    return true;
  }
  if (Array.isArray(value.entries) && value.entries.some((entry) => containsUnsafePostureClaim(entry))) {
    return true;
  }
  return false;
}

function buildBoundary(): EdgeOperationHistoryBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    replaysEvents: false,
    claimsCausalTruth: false,
    acceptsCanonicalBranch: false,
    writesContinuityRecords: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeOperationHistoryEvidenceStatus): string[] {
  const warnings = [
    "edge-operation-trail-is-local-json-scaffold",
    "operation-history-evidence-only",
    "events-not-replayed-as-causal-history",
    "no-continuity-records-written",
  ];
  if (status !== "operation-history-valid-trail") {
    warnings.push(status);
  }
  return warnings;
}

function buildRejections(
  status: EdgeOperationHistoryEvidenceStatus,
  checks: EdgeOperationHistoryCheck[],
): string[] {
  if (status === "operation-history-valid-trail") {
    return [];
  }
  return checks
    .filter((check) => check.status === "missing" || check.status === "malformed" || check.status === "blocked-by-guardrail")
    .map((check) => `${check.checkId}:${check.status}`);
}

function requiredTrailFieldPresent(trail: JsonRecord, key: (typeof REQUIRED_TRAIL_KEYS)[number]): boolean {
  if (key === "artifactKind") {
    return trail.artifactKind === EDGE_OPERATION_TRAIL_ARTIFACT_KIND;
  }
  if (key === "operationId") {
    return typeof trail.operationId === "string" && trail.operationId.length > 0;
  }
  if (key === "context") {
    return isRecord(trail.context);
  }
  return Array.isArray(trail.events) && trail.events.length > 0;
}

function requiredAppendLogViewFieldPresent(
  trail: JsonRecord,
  key: (typeof REQUIRED_APPEND_LOG_VIEW_KEYS)[number],
): boolean {
  if (key === "artifactKind") {
    return trail.artifactKind === EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND;
  }
  if (key === "operationId") {
    return typeof trail.operationId === "string" && trail.operationId.length > 0;
  }
  if (key === "boundary") {
    return isRecord(trail.boundary);
  }
  return Array.isArray(trail.entries) && trail.entries.length > 0;
}

function validEventShape(event: unknown): boolean {
  if (!isRecord(event)) {
    return false;
  }
  return (
    typeof event.eventId === "string" &&
    event.eventId.length > 0 &&
    typeof event.operationId === "string" &&
    event.operationId.length > 0 &&
    typeof event.eventKind === "string" &&
    event.eventKind.length > 0
  );
}

function validAppendLogEntryShape(entry: unknown): boolean {
  return validEventShape(entry);
}

function operationHistorySourceArtifactKind(
  trail: JsonRecord | undefined,
): EdgeOperationHistorySourceArtifactKind {
  return trail?.artifactKind === EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND
    ? EDGE_OPERATION_APPEND_LOG_VIEW_ARTIFACT_KIND
    : EDGE_OPERATION_TRAIL_ARTIFACT_KIND;
}

function eventRefStrings(event: unknown, keys: string[]): string[] {
  if (!isRecord(event)) {
    return [];
  }
  const refs: string[] = [];
  for (const key of keys) {
    const value = event[key];
    if (typeof value === "string") {
      refs.push(value);
    } else if (Array.isArray(value)) {
      refs.push(...value.filter((entry): entry is string => typeof entry === "string"));
    }
  }
  return refs;
}

function createOperationHistoryEvidenceArtifactId(input: {
  emittedAt: string;
  operationId?: string;
  sourcePath?: string;
}): string {
  const hash = createHash("sha256")
    .update(input.emittedAt)
    .update("|")
    .update(input.operationId ?? "")
    .update("|")
    .update(input.sourcePath ?? "")
    .digest("hex")
    .slice(0, 16);
  return `causal-edge-operation-history-evidence-${hash}`;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function findCheck(
  checks: EdgeOperationHistoryCheck[],
  checkId: string,
): EdgeOperationHistoryCheck | undefined {
  return checks.find((check) => check.checkId === checkId);
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`${label} must be a string`);
  }
}

function assertEqual<T>(actual: unknown, expected: T, label: string): asserts actual is T {
  if (actual !== expected) {
    throw new TypeError(`${label} must be ${String(expected)}`);
  }
}
