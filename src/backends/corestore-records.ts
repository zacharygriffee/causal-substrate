import {
  ArtifactEnvelope,
  Binding,
  Happening,
  LineageEdge,
  Nucleus,
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
  return assertRecordType(record, "branch-happening") as BranchHappeningRecord;
}

export function assertSleepCapsuleRecord(record: unknown): SleepCapsuleRecord {
  return assertRecordType(record, "sleep-capsule") as SleepCapsuleRecord;
}

export function assertReferentStateRecord(record: unknown): ReferentStateRecord {
  return assertRecordType(record, "referent-state-estimate") as ReferentStateRecord;
}

export function assertExchangeArtifactRecord(record: unknown): ExchangeArtifactRecord {
  return assertRecordType(record, "exchange-artifact") as ExchangeArtifactRecord;
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
