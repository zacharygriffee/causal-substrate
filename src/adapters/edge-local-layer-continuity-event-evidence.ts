import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-continuity-event-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-continuity-event-evidence" as const;

export type EdgeLocalLayerContinuityEventEvidenceStatus =
  | "edge-local-layer-continuity-event-evidence-emitted"
  | "edge-local-layer-continuity-event-valid-evidence"
  | "edge-local-layer-continuity-event-incomplete-evidence"
  | "edge-local-layer-continuity-event-malformed-evidence"
  | "edge-local-layer-continuity-event-guardrail-blocked";

export interface EdgeLocalLayerContinuityHappeningRef {
  happeningId: string;
  happeningLabel: "edge-local-layer-continuity-event";
  sourceContinuityEventRef: string;
  sourceOperationRef?: string;
  sourceEventRef?: string;
  eventKind?: string;
  originRef?: string;
  operatorSeatRef?: string;
  deviceRef?: string;
  provenanceRefs: string[];
  parentEventRefs: string[];
  evidenceRefs: string[];
  receiptRefs: string[];
  participantRefs: string[];
  membraneCrossingKind?: string;
  membraneCrossingRef?: string;
  sourceDomain?: string;
  targetDomain?: string;
  causalRole: "continuity-event-as-draft-semantic-input-reference";
  observerRelative: true;
  sourceShareBoundaryPreserved: true;
  scaffoldStorageOnly: true;
  acceptedAsContinuity: false;
  acceptedAsCanonicalHistory: false;
}

export interface EdgeLocalLayerContinuityEventEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceSchema?: string;
    sourceArtifactKind?: string;
    sourcePath?: string;
  };
  happeningRefs: EdgeLocalLayerContinuityHappeningRef[];
  boundary: {
    reviewOnly: true;
    evidenceOnly: true;
    edgeRuntimeFetched: false;
    edgeCalled: false;
    edgeMutated: false;
    sourceStorageOpened: false;
    writesContinuityRecords: false;
    acceptsContinuity: false;
    acceptsCanonicalHistory: false;
    claimsCausalTruth: false;
    startsBackend: false;
    requiresAutobase: false;
    publishesToMesh: false;
  };
  validation: {
    status: EdgeLocalLayerContinuityEventEvidenceStatus;
    parseableObject: boolean;
    eventPreservedAsReference: boolean;
    draftContinuityEvent: boolean;
    promotedContinuity: boolean;
    originPresent: boolean;
    provenanceRefsPresent: boolean;
    membraneCrossingPresent: boolean;
    storageScaffoldOnly: boolean;
    acceptanceNotClaimed: boolean;
    noAuthorityOrTruthClaim: boolean;
    issues: string[];
  };
  reviewStatus: EdgeLocalLayerContinuityEventEvidenceStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeLocalLayerContinuityEventEvidenceInput {
  continuityEvent: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "mesh_ecology_local_layer_continuity_event";
const EXPECTED_SCHEMA = "mesh-ecology-edge/local-layer-continuity-event-draft/v0";

export function buildEdgeLocalLayerContinuityEventEvidenceArtifact(
  input: BuildEdgeLocalLayerContinuityEventEvidenceInput,
): EdgeLocalLayerContinuityEventEvidenceArtifact {
  const event = isRecord(input.continuityEvent) ? input.continuityEvent : undefined;
  const issues = validateContinuityEvent(event, input.continuityEvent);
  const status = determineStatus(event, issues);
  const happeningRefs = status === "edge-local-layer-continuity-event-valid-evidence"
    ? [collectHappeningRef(event)]
    : [];
  const eventId = stringValue(event?.eventId);
  const artifactId = input.artifactId ?? `causal-edge-local-layer-continuity-event-evidence:${hash(JSON.stringify({
    emittedAt: input.emittedAt,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    ...(eventId ? { eventId } : {}),
  })).slice(0, 16)}`;
  const sourceSchema = stringValue(event?.schemaVersion);
  const sourceArtifactKind = stringValue(event?.artifactKind);

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA_VERSION,
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
      parseableObject: event !== undefined,
      eventPreservedAsReference: status === "edge-local-layer-continuity-event-valid-evidence",
      draftContinuityEvent: event?.draft === true,
      promotedContinuity: event?.promotedContinuity === true,
      originPresent: isRecord(event?.origin) && stringValue(event.origin.originRef) !== undefined,
      provenanceRefsPresent: stringArray(event?.provenanceRefs).length > 0,
      membraneCrossingPresent: isRecord(event?.membraneCrossing) &&
        stringValue(event.membraneCrossing.crossingKind) !== undefined &&
        stringValue(event.membraneCrossing.crossingRef) !== undefined,
      storageScaffoldOnly: issues.includes("storage-overclaim") === false,
      acceptanceNotClaimed: issues.includes("acceptance-overclaim") === false,
      noAuthorityOrTruthClaim: issues.includes("authority-truth-state-or-substrate-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-local-layer-continuity-event-valid-evidence"
      ? "edge-local-layer-continuity-event-evidence-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: status === "edge-local-layer-continuity-event-valid-evidence" ? [] : issues,
  };
}

function validateContinuityEvent(event: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["continuity-event-not-object"];
  if (!event) return ["continuity-event-not-object"];

  const eventOrigin = isRecord(event.origin) ? event.origin : {};
  const crossing = isRecord(event.membraneCrossing) ? event.membraneCrossing : {};
  const storage = isRecord(event.storagePosture) ? event.storagePosture : {};
  const acceptance = isRecord(event.acceptancePosture) ? event.acceptancePosture : {};
  const claims = isRecord(event.nonClaims) ? event.nonClaims : {};
  const provenanceRefs = stringArray(event.provenanceRefs);
  const refsToScan = [
    event.eventId,
    event.sourceEventRef,
    event.operationRef,
    eventOrigin.originRef,
    eventOrigin.sourceRef,
    eventOrigin.operatorSeatRef,
    eventOrigin.deviceRef,
    eventOrigin.repoRef,
    crossing.crossingRef,
    ...stringArray(eventOrigin.parentEventRefs),
    ...provenanceRefs,
    ...stringArray(event.evidenceRefs),
    ...stringArray(event.receiptRefs),
    ...stringArray(event.participantRefs),
  ].filter((ref): ref is string => typeof ref === "string" && ref.trim() !== "");

  if (event.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (event.schemaVersion !== EXPECTED_SCHEMA) issues.push("schema-mismatch");
  if (event.draft !== true) issues.push("draft-posture-missing");
  if (event.promotedContinuity !== false) issues.push("promotion-overclaim");
  if (event.continuityRole !== "edge_operation_event_scaffold") issues.push("continuity-role-mismatch");
  if (event.continuityCategory !== "operation_event") issues.push("continuity-category-mismatch");
  if (!stringValue(event.eventId)) issues.push("event-id-missing");
  if (!stringValue(event.sourceEventRef)) issues.push("source-event-ref-missing");
  if (!stringValue(event.operationRef)) issues.push("operation-ref-missing");
  if (!stringValue(event.eventKind)) issues.push("event-kind-missing");
  if (event.producerRepo !== "mesh-ecology-edge") issues.push("producer-repo-mismatch");

  if (!stringValue(eventOrigin.originRef)) issues.push("origin-ref-missing");
  if (!stringValue(eventOrigin.sourceRef)) issues.push("origin-source-ref-missing");
  if (!stringValue(eventOrigin.operatorSeatRef)) issues.push("operator-seat-ref-missing");
  if (eventOrigin.repoRef !== "repo:mesh-ecology-edge") issues.push("origin-repo-ref-mismatch");
  if (!Array.isArray(eventOrigin.parentEventRefs)) issues.push("parent-event-refs-missing");
  if (provenanceRefs.length === 0) issues.push("provenance-refs-missing");
  if (!provenanceRefs.includes(String(event.sourceEventRef))) issues.push("source-event-ref-not-in-provenance");
  if (!provenanceRefs.includes(String(event.operationRef))) issues.push("operation-ref-not-in-provenance");

  if (!stringValue(crossing.crossingKind)) issues.push("crossing-kind-missing");
  if (!stringValue(crossing.crossingRef)) issues.push("crossing-ref-missing");
  if (crossing.sourceDomain !== "edge_operator_loop") issues.push("crossing-source-domain-mismatch");
  if (crossing.targetDomain !== "local_layer_continuity_draft") issues.push("crossing-target-domain-mismatch");
  if (crossing.validationRequired !== true) issues.push("crossing-validation-missing");

  if (storage.storageKind !== "local_json_operation_trail") issues.push("storage-kind-mismatch");
  if (storage.storageRole !== "compatibility_scaffold") issues.push("storage-role-mismatch");
  if (storage.scaffoldStorage !== true || storage.localFileStorage !== true) {
    issues.push("storage-scaffold-posture-missing");
  }
  if (
    storage.sourceIsSubstrate !== false ||
    storage.localLayerSubstrate !== false ||
    storage.durableLocalLayerState !== false ||
    storage.decentralizedState !== false ||
    storage.canonicalMaterializedHistory !== false ||
    storage.autobaseBackend !== false ||
    storage.hypercoreCorestoreBackend !== false ||
    storage.hyperbeeIndex !== false
  ) {
    issues.push("storage-overclaim");
  }

  if (
    acceptance.acceptedContinuity !== false ||
    acceptance.appendSuccessIsAcceptance !== false ||
    acceptance.writeSuccessIsAcceptance !== false ||
    acceptance.storageVisibilityIsContinuity !== false
  ) {
    issues.push("acceptance-overclaim");
  }
  if (acceptance.deterministicApplyRequired !== true) {
    issues.push("deterministic-apply-posture-missing");
  }

  if (claimsContainAuthorityTruthStateOrSubstrate(claims)) {
    issues.push("authority-truth-state-or-substrate-claim");
  }
  if (refsToScan.some(refContainsUnsafeSeam)) {
    issues.push("ref-contains-transport-or-local-path-seam");
  }

  return [...new Set(issues)];
}

function determineStatus(
  event: JsonRecord | undefined,
  issues: string[],
): EdgeLocalLayerContinuityEventEvidenceStatus {
  if (!event) return "edge-local-layer-continuity-event-malformed-evidence";
  if (
    issues.includes("promotion-overclaim") ||
    issues.includes("storage-overclaim") ||
    issues.includes("acceptance-overclaim") ||
    issues.includes("authority-truth-state-or-substrate-claim") ||
    issues.includes("ref-contains-transport-or-local-path-seam")
  ) {
    return "edge-local-layer-continuity-event-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-continuity-event-incomplete-evidence";
  return "edge-local-layer-continuity-event-valid-evidence";
}

function collectHappeningRef(event: JsonRecord | undefined): EdgeLocalLayerContinuityHappeningRef {
  const safeEvent = event ?? {};
  const eventOrigin = isRecord(safeEvent.origin) ? safeEvent.origin : {};
  const crossing = isRecord(safeEvent.membraneCrossing) ? safeEvent.membraneCrossing : {};
  const eventId = stringValue(safeEvent.eventId) ?? "unknown-continuity-event";
  const ref: EdgeLocalLayerContinuityHappeningRef = {
    happeningId: `causal-edge-local-layer-continuity-happening:${hash(eventId).slice(0, 16)}`,
    happeningLabel: "edge-local-layer-continuity-event",
    sourceContinuityEventRef: eventId,
    provenanceRefs: stringArray(safeEvent.provenanceRefs),
    parentEventRefs: stringArray(eventOrigin.parentEventRefs),
    evidenceRefs: stringArray(safeEvent.evidenceRefs),
    receiptRefs: stringArray(safeEvent.receiptRefs),
    participantRefs: stringArray(safeEvent.participantRefs),
    causalRole: "continuity-event-as-draft-semantic-input-reference",
    observerRelative: true,
    sourceShareBoundaryPreserved: true,
    scaffoldStorageOnly: true,
    acceptedAsContinuity: false,
    acceptedAsCanonicalHistory: false,
  };
  const sourceOperationRef = stringValue(safeEvent.operationRef);
  if (sourceOperationRef) ref.sourceOperationRef = sourceOperationRef;
  const sourceEventRef = stringValue(safeEvent.sourceEventRef);
  if (sourceEventRef) ref.sourceEventRef = sourceEventRef;
  const eventKind = stringValue(safeEvent.eventKind);
  if (eventKind) ref.eventKind = eventKind;
  const originRef = stringValue(eventOrigin.originRef);
  if (originRef) ref.originRef = originRef;
  const operatorSeatRef = stringValue(eventOrigin.operatorSeatRef);
  if (operatorSeatRef) ref.operatorSeatRef = operatorSeatRef;
  const deviceRef = stringValue(eventOrigin.deviceRef);
  if (deviceRef) ref.deviceRef = deviceRef;
  const crossingKind = stringValue(crossing.crossingKind);
  if (crossingKind) ref.membraneCrossingKind = crossingKind;
  const crossingRef = stringValue(crossing.crossingRef);
  if (crossingRef) ref.membraneCrossingRef = crossingRef;
  const sourceDomain = stringValue(crossing.sourceDomain);
  if (sourceDomain) ref.sourceDomain = sourceDomain;
  const targetDomain = stringValue(crossing.targetDomain);
  if (targetDomain) ref.targetDomain = targetDomain;
  return ref;
}

function buildBoundary(): EdgeLocalLayerContinuityEventEvidenceArtifact["boundary"] {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    sourceStorageOpened: false,
    writesContinuityRecords: false,
    acceptsContinuity: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    startsBackend: false,
    requiresAutobase: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeLocalLayerContinuityEventEvidenceStatus): string[] {
  if (status === "edge-local-layer-continuity-event-valid-evidence") {
    return [
      "continuity-event-preserved-as-draft-semantic-input-reference",
      "causal-substrate-does-not-write-edge-continuity-records",
      "local-json-operation-trail-remains-scaffold-storage",
      "append-success-write-success-storage-visibility-and-review-status-are-not-acceptance",
    ];
  }
  return ["continuity-event-not-accepted-as-causal-history"];
}

function claimsContainAuthorityTruthStateOrSubstrate(claims: JsonRecord): boolean {
  return claims.truthClaimed === true ||
    claims.completionClaimed === true ||
    claims.authorityGranted === true ||
    claims.storageIsSubstrate === true ||
    claims.appendSuccessIsAcceptance === true ||
    claims.writeSuccessIsAcceptance === true ||
    claims.materializedStateClaimed === true ||
    claims.durableStateClaimed === true ||
    claims.replicatedStateClaimed === true ||
    claims.canonicalHistoryClaimed === true ||
    claims.causalTruthClaimed === true ||
    claims.meshTruthClaimed === true ||
    claims.runtimeAuthorityClaimed === true ||
    claims.rendererAuthorityClaimed === true;
}

function refContainsUnsafeSeam(ref: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|(^|:)(ssh|http)(:|$)/iu.test(ref);
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
