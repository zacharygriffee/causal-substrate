import { createHash } from "node:crypto";

export const CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA =
  "causal-substrate/edge-projection-event-happening-map/v1" as const;

export const CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_ARTIFACT_KIND =
  "causal-edge-projection-event-happening-map" as const;

export type EdgeProjectionEventHappeningMapStatus =
  | "edge-projection-event-happening-map-emitted"
  | "edge-projection-event-valid"
  | "edge-projection-event-incomplete"
  | "edge-projection-event-malformed"
  | "edge-projection-event-guardrail-blocked";

export interface EdgeProjectionEventHappeningRef {
  happeningId: string;
  happeningLabel: "edge-local-layer-projection-event";
  sourceProjectionEventRef: string;
  projectionRef?: string;
  payloadHash?: string;
  payloadHashAlgorithm?: string;
  sourceRefs: string[];
  transportRefs: string[];
  branchRefs: string[];
  segmentRefs: string[];
  sourceHappeningRefs: string[];
  presentPointRef?: string;
  observerRef?: string;
  promotionRole: "semantic_continuity_input";
  causalRole: "projection-event-as-semantic-continuity-input";
  storageRecordPromoted: false;
  backendPromoted: false;
  acceptedAsCanonicalHistory: false;
}

export interface EdgeProjectionEventHappeningMapArtifact {
  artifactKind: typeof CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceSchema?: string;
    sourceArtifactKind?: string;
    sourcePath?: string;
  };
  happeningRefs: EdgeProjectionEventHappeningRef[];
  boundary: {
    reviewOnly: true;
    evidenceOnly: true;
    edgeRuntimeFetched: false;
    edgeCalled: false;
    edgeMutated: false;
    sourceCorestoreOpened: false;
    writesContinuityRecords: false;
    acceptsCanonicalHistory: false;
    claimsCausalTruth: false;
    startsBackend: false;
    requiresAutobase: false;
    publishesToMesh: false;
  };
  validation: {
    status: EdgeProjectionEventHappeningMapStatus;
    parseableObject: boolean;
    eventPreservedAsReference: boolean;
    promotedSemanticInput: boolean;
    sourceRefsPresent: boolean;
    sourceRefsSemantic: boolean;
    causalRefsPresent: boolean;
    writerPolicyPresent: boolean;
    readerPolicyPresent: boolean;
    noStorageOrBackendPromotion: boolean;
    noAuthorityOrTruthClaim: boolean;
    issues: string[];
  };
  reviewStatus: EdgeProjectionEventHappeningMapStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeProjectionEventHappeningMapInput {
  projectionEvent: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "mesh_ecology_local_layer_projection_event";
const EXPECTED_SCHEMA = "mesh-ecology-spine/local-layer-projection-event/v0";
const SHA256_REF = /^sha256:[a-f0-9]{64}$/u;

export function buildEdgeProjectionEventHappeningMapArtifact(
  input: BuildEdgeProjectionEventHappeningMapInput,
): EdgeProjectionEventHappeningMapArtifact {
  const event = isRecord(input.projectionEvent) ? input.projectionEvent : undefined;
  const issues = validateProjectionEvent(event, input.projectionEvent);
  const status = determineStatus(event, issues);
  const happeningRefs = status === "edge-projection-event-valid"
    ? [collectHappeningRef(event)]
    : [];
  const eventId = stringValue(event?.eventId);
  const artifactId = input.artifactId ?? `causal-edge-projection-event-happening-map:${hash(JSON.stringify({
    emittedAt: input.emittedAt,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    ...(eventId ? { eventId } : {}),
  })).slice(0, 16)}`;
  const sourceSchema = stringValue(event?.schemaVersion);
  const sourceArtifactKind = stringValue(event?.artifactKind);

  return {
    artifactKind: CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA,
    schemaVersion: CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA_VERSION,
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
      eventPreservedAsReference: status === "edge-projection-event-valid",
      promotedSemanticInput: issues.includes("promotion-posture-missing") === false,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      sourceRefsSemantic: issues.includes("source-ref-compat-or-path-seam") === false,
      causalRefsPresent: issues.includes("causal-refs-missing") === false,
      writerPolicyPresent: issues.includes("writer-policy-missing-or-unsafe") === false,
      readerPolicyPresent: issues.includes("reader-policy-missing-or-unsafe") === false,
      noStorageOrBackendPromotion: issues.includes("promotion-overclaim") === false,
      noAuthorityOrTruthClaim: issues.includes("authority-or-truth-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-projection-event-valid"
      ? "edge-projection-event-happening-map-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: status === "edge-projection-event-valid" ? [] : issues,
  };
}

function validateProjectionEvent(event: JsonRecord | undefined, original: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["projection-event-not-object"];
  if (!event) return ["projection-event-not-object"];

  const sourceRefs = stringArray(event.sourceRefs);
  const transportRefs = stringArray(event.transportRefs);
  const causalRefs = isRecord(event.causalRefs) ? event.causalRefs : undefined;
  const promotion = isRecord(event.promotionPosture) ? event.promotionPosture : {};
  const writerPolicy = isRecord(event.writerPolicy) ? event.writerPolicy : {};
  const readerPolicy = isRecord(event.readerPolicy) ? event.readerPolicy : {};
  const singleWriter = isRecord(event.singleWriterProof) ? event.singleWriterProof : {};
  const claims = isRecord(event.nonClaims) ? event.nonClaims : {};
  const storage = isRecord(event.storagePosture) ? event.storagePosture : {};
  const validation = isRecord(event.validation) ? event.validation : {};

  if (event.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (event.schemaVersion !== EXPECTED_SCHEMA) issues.push("schema-mismatch");
  if (event.producerRepo !== "mesh-ecology-edge") issues.push("producer-repo-mismatch");
  if (!stringValue(event.eventId)) issues.push("event-id-missing");
  if (!stringValue(event.producerParticipantRef)) issues.push("producer-participant-ref-missing");
  if (event.projectionKind !== "operator_situation_view") issues.push("projection-kind-mismatch");
  if (!stringValue(event.projectionRef)) issues.push("projection-ref-missing");
  if (!stringValue(event.payloadHash) || !SHA256_REF.test(String(event.payloadHash))) issues.push("payload-hash-invalid");
  if (event.payloadHashAlgorithm !== "sha256-canonical-json") issues.push("payload-hash-algorithm-mismatch");
  if (event.derivedOnly !== true) issues.push("derived-only-missing");
  if (event.payloadEmbedded === true) issues.push("payload-embedded");
  if (sourceRefs.length === 0) issues.push("source-refs-missing");
  if (sourceRefs.some(refContainsUnsafeSeam)) issues.push("source-ref-compat-or-path-seam");
  if (transportRefs.some(refContainsTransportScaffold)) issues.push("transport-ref-compatibility-scaffold");
  if (!causalRefs) {
    issues.push("causal-refs-missing");
  } else {
    if (!Array.isArray(causalRefs.branchRefs)) issues.push("branch-refs-missing");
    if (!Array.isArray(causalRefs.segmentRefs)) issues.push("segment-refs-missing");
    if (!Array.isArray(causalRefs.happeningRefs)) issues.push("happening-refs-missing");
  }

  if (promotion.promotedMaterial !== true || promotion.promotionRole !== "semantic_continuity_input") {
    issues.push("promotion-posture-missing");
  }
  if (
    promotion.storageRecordPromoted === true ||
    promotion.backendPromoted === true ||
    promotion.derivedViewPromoted === true ||
    promotion.reviewStatusPromoted === true ||
    promotion.replicatedLocalLayerContinuityClaimed === true
  ) {
    issues.push("promotion-overclaim");
  }

  if (
    writerPolicy.writerKind !== "edge_producer_operator_owned_local_layer_participant" ||
    writerPolicy.writerRepo !== "mesh-ecology-edge" ||
    writerPolicy.boundedMultiwriterDeferred !== true ||
    writerPolicy.autobaseWriterPolicyPromoted !== false
  ) {
    issues.push("writer-policy-missing-or-unsafe");
  }
  if (
    readerPolicy.readerKind !== "operator_owned_local_layer_readers_by_explicit_refs" ||
    readerPolicy.explicitKeyOrProofRequired !== true ||
    readerPolicy.publicRead !== false ||
    readerPolicy.localPathReadSeam !== false ||
    readerPolicy.httpReadSeam !== false ||
    readerPolicy.sshReadSeam !== false
  ) {
    issues.push("reader-policy-missing-or-unsafe");
  }
  if (singleWriter.proofOnly !== true || singleWriter.writesProjectionLog === true || singleWriter.backend !== "none") {
    issues.push("single-writer-posture-missing-or-overclaimed");
  }
  if (storage.currentDurability !== "not_durable_state" || storage.currentExportOnly !== true) {
    issues.push("storage-posture-overclaim");
  }
  if (validation.promotedSemanticInput !== true || validation.sourceRefsSemantic !== true) {
    issues.push("promotion-validation-missing");
  }
  if (validation.localFileTruth === true || validation.durableState === true) {
    issues.push("validation-claims-local-file-or-durable-state");
  }
  if (claimsContainAuthorityOrTruth(claims)) issues.push("authority-or-truth-claim");

  return [...new Set(issues)];
}

function determineStatus(
  event: JsonRecord | undefined,
  issues: string[],
): EdgeProjectionEventHappeningMapStatus {
  if (!event) return "edge-projection-event-malformed";
  if (
    issues.includes("source-ref-compat-or-path-seam") ||
    issues.includes("transport-ref-compatibility-scaffold") ||
    issues.includes("payload-embedded") ||
    issues.includes("promotion-overclaim") ||
    issues.includes("reader-policy-missing-or-unsafe") ||
    issues.includes("writer-policy-missing-or-unsafe") ||
    issues.includes("single-writer-posture-missing-or-overclaimed") ||
    issues.includes("storage-posture-overclaim") ||
    issues.includes("validation-claims-local-file-or-durable-state") ||
    issues.includes("authority-or-truth-claim")
  ) {
    return "edge-projection-event-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-projection-event-incomplete";
  return "edge-projection-event-valid";
}

function collectHappeningRef(event: JsonRecord | undefined): EdgeProjectionEventHappeningRef {
  const safeEvent = event ?? {};
  const causalRefs = isRecord(safeEvent.causalRefs) ? safeEvent.causalRefs : {};
  const eventId = stringValue(safeEvent.eventId) ?? "unknown-event";
  const payloadHash = stringValue(safeEvent.payloadHash);
  const ref: EdgeProjectionEventHappeningRef = {
    happeningId: `causal-edge-projection-event-happening:${hash([eventId, payloadHash ?? ""].join("|")).slice(0, 16)}`,
    happeningLabel: "edge-local-layer-projection-event",
    sourceProjectionEventRef: eventId,
    sourceRefs: stringArray(safeEvent.sourceRefs),
    transportRefs: stringArray(safeEvent.transportRefs),
    branchRefs: stringArray(causalRefs.branchRefs),
    segmentRefs: stringArray(causalRefs.segmentRefs),
    sourceHappeningRefs: stringArray(causalRefs.happeningRefs),
    promotionRole: "semantic_continuity_input",
    causalRole: "projection-event-as-semantic-continuity-input",
    storageRecordPromoted: false,
    backendPromoted: false,
    acceptedAsCanonicalHistory: false,
  };
  const projectionRef = stringValue(safeEvent.projectionRef);
  if (projectionRef) ref.projectionRef = projectionRef;
  if (payloadHash) ref.payloadHash = payloadHash;
  const payloadHashAlgorithm = stringValue(safeEvent.payloadHashAlgorithm);
  if (payloadHashAlgorithm) ref.payloadHashAlgorithm = payloadHashAlgorithm;
  const presentPointRef = stringValue(causalRefs.presentPointRef);
  if (presentPointRef) ref.presentPointRef = presentPointRef;
  const observerRef = stringValue(causalRefs.observerRef);
  if (observerRef) ref.observerRef = observerRef;
  return ref;
}

function buildBoundary(): EdgeProjectionEventHappeningMapArtifact["boundary"] {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    sourceCorestoreOpened: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    startsBackend: false,
    requiresAutobase: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeProjectionEventHappeningMapStatus): string[] {
  if (status === "edge-projection-event-valid") {
    return [
      "projection-event-preserved-as-semantic-continuity-input-reference",
      "mapping-does-not-write-continuity-records",
      "projection-log-storage-remains-separate-decision",
      "append-success-replica-visibility-and-review-status-are-not-acceptance",
    ];
  }
  return ["projection-event-not-accepted-as-causal-history"];
}

function claimsContainAuthorityOrTruth(claims: JsonRecord): boolean {
  return claims.truthClaimed === true ||
    claims.completionClaimed === true ||
    claims.authorityGranted === true ||
    claims.replicatedStateClaimed === true ||
    claims.durableStateClaimed === true ||
    claims.rendererOwnsAuthority === true;
}

function refContainsUnsafeSeam(ref: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|(^|:)(ssh|http)(:|$)/iu.test(ref);
}

function refContainsTransportScaffold(ref: string): boolean {
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
