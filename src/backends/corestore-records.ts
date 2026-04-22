import {
  ArtifactEnvelope,
  Binding,
  ComparisonSurface,
  Context,
  Happening,
  LineageEdge,
  Nucleus,
  Portal,
  Referent,
  Segment,
  StateEstimate,
  Timestamp,
  View,
} from "../kernel/types.js";

export const CORESTORE_RECORD_SCHEMA = "causal-substrate/corestore-record/v1";

export interface CorestoreRecordBase {
  schema: typeof CORESTORE_RECORD_SCHEMA;
  schemaVersion: 1;
  recordId: string;
  recordType:
    | "branch-happening"
    | "sleep-capsule"
    | "referent-state-estimate"
    | "exchange-artifact";
  recordedAt: Timestamp;
}

export interface BranchHappeningRecord extends CorestoreRecordBase {
  recordType: "branch-happening";
  branchId: string;
  segmentId: string;
  happening: Happening;
}

export interface SleepCapsuleRecord extends CorestoreRecordBase {
  recordType: "sleep-capsule";
  branchId: string;
  segmentId: string;
  nucleusId: string;
  segment: Segment;
  nucleus: Nucleus;
}

export interface ReferentStateRecord extends CorestoreRecordBase {
  recordType: "referent-state-estimate";
  branchId: string;
  referentId: string;
  anchor: string;
  continuity: StateEstimate["continuity"];
  referent: Referent;
  estimate: StateEstimate;
}

export interface ReceiptPayload {
  id: string;
  label: string;
  summary: string;
  sourceIds: string[];
  metadata?: Record<string, unknown>;
}

export type ExchangeArtifactPayload =
  | { payloadType: "view"; view: View }
  | { payloadType: "binding"; binding: Binding }
  | { payloadType: "comparison"; comparison: ComparisonSurface }
  | { payloadType: "context"; context: Context }
  | { payloadType: "portal"; portal: Portal }
  | { payloadType: "lineage-claim"; lineage: LineageEdge }
  | { payloadType: "receipt"; receipt: ReceiptPayload };

export interface ExchangeArtifactRecord extends CorestoreRecordBase {
  recordType: "exchange-artifact";
  artifact: ArtifactEnvelope;
  payload: ExchangeArtifactPayload;
}

export type FirstSeriousCorestoreRecord =
  | BranchHappeningRecord
  | SleepCapsuleRecord
  | ReferentStateRecord
  | ExchangeArtifactRecord;

export function assertBranchHappeningRecord(record: unknown): BranchHappeningRecord {
  const candidate = assertRecordType(record, "branch-happening") as BranchHappeningRecord;
  assertString(candidate.branchId, "branch-happening.branchId");
  assertString(candidate.segmentId, "branch-happening.segmentId");
  const happening = assertHappening(candidate.happening, "branch-happening.happening");
  if (happening.branchId !== candidate.branchId) {
    throw new Error("invalid branch-happening record: branchId must match happening.branchId");
  }
  if (happening.segmentId !== candidate.segmentId) {
    throw new Error("invalid branch-happening record: segmentId must match happening.segmentId");
  }
  return candidate;
}

export function assertSleepCapsuleRecord(record: unknown): SleepCapsuleRecord {
  const candidate = assertRecordType(record, "sleep-capsule") as SleepCapsuleRecord;
  assertString(candidate.branchId, "sleep-capsule.branchId");
  assertString(candidate.segmentId, "sleep-capsule.segmentId");
  assertString(candidate.nucleusId, "sleep-capsule.nucleusId");
  const segment = assertSegment(candidate.segment, "sleep-capsule.segment");
  const nucleus = assertNucleus(candidate.nucleus, "sleep-capsule.nucleus");
  if (segment.id !== candidate.segmentId) {
    throw new Error("invalid sleep-capsule record: segmentId must match segment.id");
  }
  if (segment.branchId !== candidate.branchId) {
    throw new Error("invalid sleep-capsule record: branchId must match segment.branchId");
  }
  if (nucleus.id !== candidate.nucleusId) {
    throw new Error("invalid sleep-capsule record: nucleusId must match nucleus.id");
  }
  if (nucleus.branchId !== candidate.branchId) {
    throw new Error("invalid sleep-capsule record: branchId must match nucleus.branchId");
  }
  if (nucleus.sourceSegmentId !== candidate.segmentId) {
    throw new Error("invalid sleep-capsule record: nucleus source segment must match segmentId");
  }
  return candidate;
}

export function assertReferentStateRecord(record: unknown): ReferentStateRecord {
  const candidate = assertRecordType(record, "referent-state-estimate") as ReferentStateRecord;
  assertString(candidate.branchId, "referent-state-estimate.branchId");
  assertString(candidate.referentId, "referent-state-estimate.referentId");
  assertString(candidate.anchor, "referent-state-estimate.anchor");
  assertContinuity(candidate.continuity, "referent-state-estimate.continuity");
  const referent = assertReferent(candidate.referent, "referent-state-estimate.referent");
  const estimate = assertStateEstimate(candidate.estimate, "referent-state-estimate.estimate");
  if (referent.id !== candidate.referentId) {
    throw new Error("invalid referent-state-estimate record: referentId must match referent.id");
  }
  if (referent.branchId !== candidate.branchId) {
    throw new Error("invalid referent-state-estimate record: branchId must match referent.branchId");
  }
  if (referent.anchor !== candidate.anchor) {
    throw new Error("invalid referent-state-estimate record: anchor must match referent.anchor");
  }
  if (estimate.referentId !== candidate.referentId) {
    throw new Error("invalid referent-state-estimate record: referentId must match estimate.referentId");
  }
  if (estimate.branchId !== candidate.branchId) {
    throw new Error("invalid referent-state-estimate record: branchId must match estimate.branchId");
  }
  if (estimate.continuity !== candidate.continuity) {
    throw new Error("invalid referent-state-estimate record: continuity must match estimate.continuity");
  }
  return candidate;
}

export function assertExchangeArtifactRecord(record: unknown): ExchangeArtifactRecord {
  const candidate = assertRecordType(record, "exchange-artifact") as ExchangeArtifactRecord;
  const artifact = assertArtifactEnvelope(candidate.artifact, "exchange-artifact.artifact");
  assertExchangePayload(candidate.payload, artifact);
  return candidate;
}

function assertRecordType(
  record: unknown,
  expectedType: FirstSeriousCorestoreRecord["recordType"],
): FirstSeriousCorestoreRecord {
  if (!record || typeof record !== "object") {
    throw new Error(`invalid corestore record: expected object for ${expectedType}`);
  }

  const candidate = record as Partial<FirstSeriousCorestoreRecord>;
  if (candidate.schema !== CORESTORE_RECORD_SCHEMA) {
    throw new Error(`invalid corestore record schema for ${expectedType}`);
  }
  if (candidate.schemaVersion !== 1) {
    throw new Error(`invalid corestore record schema version for ${expectedType}`);
  }
  if (candidate.recordType !== expectedType) {
    throw new Error(`invalid corestore record type: expected ${expectedType}`);
  }
  if (typeof candidate.recordId !== "string" || typeof candidate.recordedAt !== "string") {
    throw new Error(`invalid corestore record envelope for ${expectedType}`);
  }

  return candidate as FirstSeriousCorestoreRecord;
}

function assertObject(value: unknown, label: string) {
  if (!value || typeof value !== "object") {
    throw new Error(`invalid ${label}: expected object`);
  }
  return value as Record<string, unknown>;
}

function assertString(value: unknown, label: string) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`invalid ${label}: expected non-empty string`);
  }
}

function assertOptionalString(value: unknown, label: string) {
  if (value === undefined) return;
  assertString(value, label);
}

function assertStringArray(value: unknown, label: string) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`invalid ${label}: expected string array`);
  }
}

function assertOptionalNumber(value: unknown, label: string) {
  if (value === undefined) return;
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`invalid ${label}: expected number`);
  }
}

function assertRecordMetadata(value: unknown, label: string) {
  if (value === undefined) return;
  assertObject(value, label);
}

function assertHappening(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<Happening>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.branchId, `${label}.branchId`);
  assertString(candidate.segmentId, `${label}.segmentId`);
  assertString(candidate.label, `${label}.label`);
  assertStringArray(candidate.triggerIds, `${label}.triggerIds`);
  assertOptionalNumber(candidate.salience, `${label}.salience`);
  assertString(candidate.observedAt, `${label}.observedAt`);
  assertOptionalString(candidate.summary, `${label}.summary`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as Happening;
}

function assertSegment(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<Segment>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.branchId, `${label}.branchId`);
  if (typeof candidate.index !== "number" || Number.isNaN(candidate.index)) {
    throw new Error(`invalid ${label}.index: expected number`);
  }
  if (candidate.status !== "wake" && candidate.status !== "sleep") {
    throw new Error(`invalid ${label}.status: expected wake or sleep`);
  }
  assertString(candidate.openedAt, `${label}.openedAt`);
  assertOptionalString(candidate.closedAt, `${label}.closedAt`);
  assertStringArray(candidate.inheritedNucleusIds, `${label}.inheritedNucleusIds`);
  assertStringArray(candidate.happeningIds, `${label}.happeningIds`);
  assertOptionalString(candidate.summary, `${label}.summary`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as Segment;
}

function assertNucleus(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<Nucleus>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.branchId, `${label}.branchId`);
  assertString(candidate.sourceSegmentId, `${label}.sourceSegmentId`);
  assertStringArray(candidate.inheritedNucleusIds, `${label}.inheritedNucleusIds`);
  assertString(candidate.anchor, `${label}.anchor`);
  assertOptionalString(candidate.notes, `${label}.notes`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as Nucleus;
}

function assertReferent(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<Referent>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.label, `${label}.label`);
  assertString(candidate.anchor, `${label}.anchor`);
  assertString(candidate.branchId, `${label}.branchId`);
  assertOptionalString(candidate.nucleusId, `${label}.nucleusId`);
  assertOptionalString(candidate.inertiaModelId, `${label}.inertiaModelId`);
  assertOptionalString(candidate.volatilityModelId, `${label}.volatilityModelId`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as Referent;
}

function assertContinuity(value: unknown, label: string) {
  if (value !== "continuing" && value !== "ambiguous" && value !== "broken") {
    throw new Error(`invalid ${label}: expected continuing, ambiguous, or broken`);
  }
}

function assertStateEstimate(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<StateEstimate>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.referentId, `${label}.referentId`);
  assertString(candidate.branchId, `${label}.branchId`);
  assertString(candidate.estimatedAt, `${label}.estimatedAt`);
  assertContinuity(candidate.continuity, `${label}.continuity`);
  assertString(candidate.reasoning, `${label}.reasoning`);
  assertStringArray(candidate.basedOnBindingIds, `${label}.basedOnBindingIds`);
  assertOptionalString(candidate.inertiaModelId, `${label}.inertiaModelId`);
  assertOptionalString(candidate.volatilityModelId, `${label}.volatilityModelId`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as StateEstimate;
}

function assertArtifactKind(value: unknown, label: string) {
  if (
    value !== "binding" &&
    value !== "context-surface" &&
    value !== "lineage-claim" &&
    value !== "portal-surface" &&
    value !== "view" &&
    value !== "state-estimate" &&
    value !== "comparability-surface" &&
    value !== "receipt"
  ) {
    throw new Error(`invalid ${label}: unknown artifact kind`);
  }
}

function assertLocality(value: unknown, label: string) {
  if (value !== "local" && value !== "shared-candidate") {
    throw new Error(`invalid ${label}: unknown locality`);
  }
}

function assertProvenance(value: unknown, label: string) {
  const candidate = assertObject(value, label);
  assertString(candidate.emittedAt, `${label}.emittedAt`);
  assertOptionalString(candidate.basisId, `${label}.basisId`);
  assertOptionalString(candidate.emitterId, `${label}.emitterId`);
  assertOptionalString(candidate.source, `${label}.source`);
  assertOptionalString(candidate.note, `${label}.note`);
}

function assertArtifactEnvelope(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<ArtifactEnvelope>;
  assertString(candidate.id, `${label}.id`);
  assertArtifactKind(candidate.kind, `${label}.kind`);
  assertString(candidate.label, `${label}.label`);
  assertStringArray(candidate.sourceIds, `${label}.sourceIds`);
  assertStringArray(candidate.payloadIds, `${label}.payloadIds`);
  assertLocality(candidate.locality, `${label}.locality`);
  assertProvenance(candidate.provenance, `${label}.provenance`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as ArtifactEnvelope;
}

function assertViewKind(value: unknown, label: string) {
  if (
    value !== "branch-timeline" &&
    value !== "segment-summary" &&
    value !== "context-surface" &&
    value !== "referent-index" &&
    value !== "binding-map"
  ) {
    throw new Error(`invalid ${label}: unknown view kind`);
  }
}

function assertView(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<View>;
  assertString(candidate.id, `${label}.id`);
  assertViewKind(candidate.kind, `${label}.kind`);
  assertString(candidate.label, `${label}.label`);
  assertStringArray(candidate.sourceIds, `${label}.sourceIds`);
  assertString(candidate.projection, `${label}.projection`);
  if (candidate.replaceable !== true) {
    throw new Error(`invalid ${label}.replaceable: expected true`);
  }
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as View;
}

function assertBindingKind(value: unknown, label: string) {
  if (
    value !== "tracking" &&
    value !== "situational" &&
    value !== "projective" &&
    value !== "comparative" &&
    value !== "causal"
  ) {
    throw new Error(`invalid ${label}: unknown binding kind`);
  }
}

function assertBinding(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<Binding>;
  assertString(candidate.id, `${label}.id`);
  assertBindingKind(candidate.kind, `${label}.kind`);
  assertString(candidate.observerBranchId, `${label}.observerBranchId`);
  assertString(candidate.referentBranchId, `${label}.referentBranchId`);
  assertString(candidate.referentId, `${label}.referentId`);
  assertOptionalString(candidate.contextId, `${label}.contextId`);
  assertOptionalNumber(candidate.strength, `${label}.strength`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as Binding;
}

function assertComparability(value: unknown, label: string) {
  if (value !== "none" && value !== "partial" && value !== "strong") {
    throw new Error(`invalid ${label}: unknown comparability level`);
  }
}

function assertCompatibility(value: unknown, label: string) {
  if (
    value !== "unknown" &&
    value !== "compatible" &&
    value !== "incompatible" &&
    value !== "unresolved"
  ) {
    throw new Error(`invalid ${label}: unknown compatibility level`);
  }
}

function assertEquivalence(value: unknown, label: string) {
  if (
    value !== undefined &&
    value !== "none" &&
    value !== "partial" &&
    value !== "strong" &&
    value !== "unresolved"
  ) {
    throw new Error(`invalid ${label}: unknown equivalence level`);
  }
}

function assertConvergence(value: unknown, label: string) {
  if (
    value !== "not-forced" &&
    value !== "clustered" &&
    value !== "divergent" &&
    value !== "unresolved"
  ) {
    throw new Error(`invalid ${label}: unknown convergence level`);
  }
}

function assertComparisonSurface(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<ComparisonSurface>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.label, `${label}.label`);
  assertStringArray(candidate.sourceIds, `${label}.sourceIds`);
  assertOptionalString(candidate.basisId, `${label}.basisId`);
  assertOptionalString(candidate.projection, `${label}.projection`);
  assertComparability(candidate.comparability, `${label}.comparability`);
  assertCompatibility(candidate.compatibility, `${label}.compatibility`);
  assertEquivalence(candidate.equivalence, `${label}.equivalence`);
  assertConvergence(candidate.convergence, `${label}.convergence`);
  assertStringArray(candidate.reasonCodes, `${label}.reasonCodes`);
  assertStringArray(candidate.evidenceSourceIds, `${label}.evidenceSourceIds`);
  assertOptionalString(candidate.summary, `${label}.summary`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as ComparisonSurface;
}

function assertContext(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<Context>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.branchId, `${label}.branchId`);
  assertString(candidate.label, `${label}.label`);
  assertOptionalString(candidate.parentContextId, `${label}.parentContextId`);
  assertOptionalString(candidate.containmentPolicy, `${label}.containmentPolicy`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as Context;
}

function assertPortal(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<Portal>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.branchId, `${label}.branchId`);
  assertString(candidate.label, `${label}.label`);
  assertString(candidate.sourceContextId, `${label}.sourceContextId`);
  assertString(candidate.targetContextId, `${label}.targetContextId`);
  assertString(candidate.exposureRule, `${label}.exposureRule`);
  assertOptionalString(candidate.transform, `${label}.transform`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as Portal;
}

function assertLineageRelation(value: unknown, label: string) {
  if (
    value !== "continuation" &&
    value !== "split" &&
    value !== "merge" &&
    value !== "seed-origin" &&
    value !== "projection" &&
    value !== "inheritance"
  ) {
    throw new Error(`invalid ${label}: unknown lineage relation`);
  }
}

function assertLineageEdge(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<LineageEdge>;
  assertString(candidate.id, `${label}.id`);
  assertLineageRelation(candidate.relation, `${label}.relation`);
  assertString(candidate.fromId, `${label}.fromId`);
  assertString(candidate.toId, `${label}.toId`);
  assertOptionalString(candidate.basisId, `${label}.basisId`);
  assertOptionalString(candidate.evidence, `${label}.evidence`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as LineageEdge;
}

function assertReceipt(value: unknown, label: string) {
  const candidate = assertObject(value, label) as Partial<ReceiptPayload>;
  assertString(candidate.id, `${label}.id`);
  assertString(candidate.label, `${label}.label`);
  assertString(candidate.summary, `${label}.summary`);
  assertStringArray(candidate.sourceIds, `${label}.sourceIds`);
  assertRecordMetadata(candidate.metadata, `${label}.metadata`);
  return candidate as ReceiptPayload;
}

function assertArtifactPayloadLink(
  artifact: ArtifactEnvelope,
  payloadId: string,
  expectedKind: ArtifactEnvelope["kind"],
  payloadType: ExchangeArtifactPayload["payloadType"],
) {
  if (artifact.kind !== expectedKind) {
    throw new Error(
      `invalid exchange-artifact record: artifact kind ${artifact.kind} does not match payload type ${payloadType}`,
    );
  }
  if (!artifact.payloadIds.includes(payloadId)) {
    throw new Error(
      `invalid exchange-artifact record: artifact payloadIds must include payload id for ${payloadType}`,
    );
  }
}

function assertReceiptPayloadLink(artifact: ArtifactEnvelope, receipt: ReceiptPayload) {
  if (artifact.kind !== "receipt") {
    throw new Error(
      `invalid exchange-artifact record: artifact kind ${artifact.kind} does not match payload type receipt`,
    );
  }
  for (const sourceId of receipt.sourceIds) {
    if (!artifact.sourceIds.includes(sourceId)) {
      throw new Error(
        "invalid exchange-artifact record: receipt sourceIds must remain traceable through artifact sourceIds",
      );
    }
  }
  if (artifact.payloadIds.length > 0 && !artifact.payloadIds.includes(receipt.id)) {
    throw new Error(
      "invalid exchange-artifact record: receipt payload id must match artifact payloadIds when payloadIds are present",
    );
  }
}

function assertExchangePayload(value: unknown, artifact: ArtifactEnvelope) {
  const candidate = assertObject(value, "exchange-artifact.payload") as Partial<ExchangeArtifactPayload>;
  switch (candidate.payloadType) {
    case "view": {
      const view = assertView(candidate.view, "exchange-artifact.payload.view");
      assertArtifactPayloadLink(artifact, view.id, "view", "view");
      return;
    }
    case "binding": {
      const binding = assertBinding(candidate.binding, "exchange-artifact.payload.binding");
      assertArtifactPayloadLink(artifact, binding.id, "binding", "binding");
      return;
    }
    case "comparison": {
      const comparison = assertComparisonSurface(
        candidate.comparison,
        "exchange-artifact.payload.comparison",
      );
      assertArtifactPayloadLink(
        artifact,
        comparison.id,
        "comparability-surface",
        "comparison",
      );
      return;
    }
    case "context": {
      const context = assertContext(candidate.context, "exchange-artifact.payload.context");
      assertArtifactPayloadLink(artifact, context.id, "context-surface", "context");
      return;
    }
    case "portal": {
      const portal = assertPortal(candidate.portal, "exchange-artifact.payload.portal");
      assertArtifactPayloadLink(artifact, portal.id, "portal-surface", "portal");
      return;
    }
    case "lineage-claim": {
      const lineage = assertLineageEdge(candidate.lineage, "exchange-artifact.payload.lineage");
      assertArtifactPayloadLink(artifact, lineage.id, "lineage-claim", "lineage-claim");
      return;
    }
    case "receipt": {
      const receipt = assertReceipt(candidate.receipt, "exchange-artifact.payload.receipt");
      assertReceiptPayloadLink(artifact, receipt);
      return;
    }
    default:
      throw new Error("invalid exchange-artifact payload: unknown payloadType");
  }
}
