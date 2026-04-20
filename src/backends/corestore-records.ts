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
