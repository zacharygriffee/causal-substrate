import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA =
  "causal-substrate/edge-layer-seam-history-observation/v1" as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_ARTIFACT_KIND =
  "causal-edge-layer-seam-history-observation" as const;

export type EdgeLayerSeamHistoryObservationStatus =
  | "edge-layer-seam-history-observation-emitted"
  | "edge-layer-seam-history-observation-valid"
  | "edge-layer-seam-history-observation-incomplete"
  | "edge-layer-seam-history-observation-malformed";

export type EdgeLayerSeamHappeningClassification =
  | "compatible_seam_happening"
  | "unresolved_or_damaged_seam_happening";

export type EdgeLayerSeamLinkageStatus = "linked" | "unlinked" | "damaged";

export type EdgeLayerSeamHistoryProofRung =
  "local_causal_observation_over_supplied_seam_history_material";

export interface EdgeLayerSeamHistorySourceRef {
  sourceRepo?: string;
  id?: string;
  hash?: string;
  durableRef?: string;
  writerRef?: string;
}

export interface EdgeLayerSeamHappeningObservation {
  observationId: string;
  classification: EdgeLayerSeamHappeningClassification;
  linkageStatus: EdgeLayerSeamLinkageStatus;
  request: EdgeLayerSeamHistorySourceRef;
  receipt: EdgeLayerSeamHistorySourceRef;
  receiptSourceRequestId?: string;
  receiptSourceRequestHash?: string;
  sourceRefs: string[];
  interpretedFields: {
    requestIdPresent: boolean;
    requestHashPresent: boolean;
    receiptIdPresent: boolean;
    receiptHashPresent: boolean;
    receiptReferencesRequestId: boolean;
    receiptReferencesRequestHash: boolean;
    explicitLinkageAsserted: boolean;
  };
  boundary: {
    compatibleMeansLinkageOnly: true;
    canonicalHistoryClaimed: false;
    layerEvidenceAdmitted: false;
    rbcInterpreted: false;
    authorityGranted: false;
  };
}

export interface EdgeLayerSeamHistoryObservationBoundary {
  reviewOnly: true;
  observationOnly: true;
  readsSuppliedSeamHistoryMaterial: true;
  opensEdgeRuntime: false;
  opensLayerRuntime: false;
  callsEdge: false;
  callsLayer: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsCausalTruth: false;
  admitsLayerEvidence: false;
  interpretsRbc: false;
  grantsAuthority: false;
  publishesToMesh: false;
}

export interface EdgeLayerSeamHistoryObservationValidation {
  status: EdgeLayerSeamHistoryObservationStatus;
  parseableObject: boolean;
  seamHistoryInputConsumed: boolean;
  pairCount: number;
  compatiblePairCount: number;
  unresolvedOrDamagedPairCount: number;
  linkedPairDetected: boolean;
  damagedOrUnlinkedPairDetected: boolean;
  sourceIdsAndHashesPreserved: boolean;
  noCanonicalHistoryClaim: true;
  noLayerAdmissionClaim: true;
  noRbcInterpretationClaim: true;
  noAuthorityClaim: true;
  decentralizedSeamProofClaimed: false;
  strongestProofRung: EdgeLayerSeamHistoryProofRung;
  issues: string[];
}

export interface EdgeLayerSeamHistoryObservationProof {
  strongestProofRung: EdgeLayerSeamHistoryProofRung;
  inputMaterialKind: "supplied_seam_history_material";
  inputReadByCausalSubstrate: boolean;
  dhtOrHyperswarmInputObservedByCausalSubstrate: false;
  decentralizedSeamProofClaimed: false;
  localSuppliedMaterialOnly: true;
  proofLabelHonest: true;
}

export interface EdgeLayerSeamHistoryObservationResult {
  artifactKind: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepos: string[];
    historyId?: string;
    historyHash?: string;
    sourcePath?: string;
  };
  observationScope:
    "local_causal_observation_over_supplied_seam_history_material";
  observations: EdgeLayerSeamHappeningObservation[];
  boundary: EdgeLayerSeamHistoryObservationBoundary;
  proof: EdgeLayerSeamHistoryObservationProof;
  validation: EdgeLayerSeamHistoryObservationValidation;
  reviewStatus: EdgeLayerSeamHistoryObservationStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeLayerSeamHistoryObservationInput {
  seamHistory: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
  inputReadByCausalSubstrate?: boolean;
}

type JsonRecord = Record<string, unknown>;

export function buildEdgeLayerSeamHistoryObservationResult(
  input: BuildEdgeLayerSeamHistoryObservationInput,
): EdgeLayerSeamHistoryObservationResult {
  const seamHistory = isRecord(input.seamHistory) ? input.seamHistory : undefined;
  const pairs = collectPairs(seamHistory);
  const observations = pairs.map((pair, index) => observePair(pair, index));
  const issues = validateInput(seamHistory, pairs);
  const sourceIdsAndHashesPreserved = observations.every((observation) =>
    Boolean(observation.request.id) &&
      Boolean(observation.request.hash) &&
      Boolean(observation.receipt.id) &&
      Boolean(observation.receipt.hash)
  );
  if (!sourceIdsAndHashesPreserved && observations.length > 0) {
    issues.push("source-ids-or-hashes-missing");
  }
  const compatiblePairCount = observations.filter((observation) =>
    observation.classification === "compatible_seam_happening"
  ).length;
  const unresolvedOrDamagedPairCount = observations.filter((observation) =>
    observation.classification === "unresolved_or_damaged_seam_happening"
  ).length;
  const status = determineStatus(seamHistory, observations, issues);
  const historyId = stringValue(seamHistory?.historyId) ??
    stringValue(seamHistory?.statusId) ??
    stringValue(seamHistory?.seamHistoryId);
  const historyHash = stringValue(seamHistory?.historyHash) ??
    stringValue(seamHistory?.statusHash);
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(historyId ? { historyId } : {}),
    ...(historyHash ? { historyHash } : {}),
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepos: collectSourceRepos(seamHistory, observations),
      ...(historyId ? { historyId } : {}),
      ...(historyHash ? { historyHash } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    observationScope: "local_causal_observation_over_supplied_seam_history_material",
    observations,
    boundary: buildBoundary(),
    proof: buildProof(input.inputReadByCausalSubstrate === true),
    validation: {
      status,
      parseableObject: seamHistory !== undefined,
      seamHistoryInputConsumed: seamHistory !== undefined && pairs.length > 0,
      pairCount: observations.length,
      compatiblePairCount,
      unresolvedOrDamagedPairCount,
      linkedPairDetected: compatiblePairCount > 0,
      damagedOrUnlinkedPairDetected: unresolvedOrDamagedPairCount > 0,
      sourceIdsAndHashesPreserved,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      decentralizedSeamProofClaimed: false,
      strongestProofRung: "local_causal_observation_over_supplied_seam_history_material",
      issues,
    },
    reviewStatus: status === "edge-layer-seam-history-observation-valid"
      ? "edge-layer-seam-history-observation-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: status === "edge-layer-seam-history-observation-valid" ? [] : issues,
  };
}

export function buildEdgeLayerSeamHistoryObservationResultFromJson(
  input: Omit<BuildEdgeLayerSeamHistoryObservationInput, "seamHistory"> & { seamHistoryJson: string },
): EdgeLayerSeamHistoryObservationResult {
  try {
    return buildEdgeLayerSeamHistoryObservationResult({
      ...input,
      seamHistory: JSON.parse(input.seamHistoryJson) as unknown,
    });
  } catch {
    return buildEdgeLayerSeamHistoryObservationResult({
      ...input,
      seamHistory: undefined,
    });
  }
}

export function assertEdgeLayerSeamHistoryObservationResult(
  value: unknown,
): asserts value is EdgeLayerSeamHistoryObservationResult {
  const candidate = assertObject(value, "edge layer seam history observation result");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  assertEqual(candidate.observationScope, "local_causal_observation_over_supplied_seam_history_material", "observationScope");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.observationOnly, true, "boundary.observationOnly");
  assertEqual(boundary.readsSuppliedSeamHistoryMaterial, true, "boundary.readsSuppliedSeamHistoryMaterial");
  assertEqual(boundary.opensEdgeRuntime, false, "boundary.opensEdgeRuntime");
  assertEqual(boundary.opensLayerRuntime, false, "boundary.opensLayerRuntime");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.strongestProofRung,
    "local_causal_observation_over_supplied_seam_history_material",
    "proof.strongestProofRung",
  );
  assertEqual(proof.inputMaterialKind, "supplied_seam_history_material", "proof.inputMaterialKind");
  assertEqual(
    proof.dhtOrHyperswarmInputObservedByCausalSubstrate,
    false,
    "proof.dhtOrHyperswarmInputObservedByCausalSubstrate",
  );
  assertEqual(proof.decentralizedSeamProofClaimed, false, "proof.decentralizedSeamProofClaimed");
}

function validateInput(
  seamHistory: JsonRecord | undefined,
  pairs: JsonRecord[],
): string[] {
  const issues: string[] = [];
  if (!seamHistory) return ["seam-history-input-not-object"];
  if (pairs.length === 0) issues.push("seam-history-pairs-missing");
  return issues;
}

function determineStatus(
  seamHistory: JsonRecord | undefined,
  observations: EdgeLayerSeamHappeningObservation[],
  issues: string[],
): EdgeLayerSeamHistoryObservationStatus {
  if (!seamHistory) return "edge-layer-seam-history-observation-malformed";
  if (observations.length === 0) return "edge-layer-seam-history-observation-incomplete";
  const compatible = observations.some((observation) =>
    observation.classification === "compatible_seam_happening"
  );
  const unresolved = observations.some((observation) =>
    observation.classification === "unresolved_or_damaged_seam_happening"
  );
  if (!compatible || !unresolved || issues.includes("source-ids-or-hashes-missing")) {
    return "edge-layer-seam-history-observation-incomplete";
  }
  return "edge-layer-seam-history-observation-valid";
}

function observePair(pair: JsonRecord, index: number): EdgeLayerSeamHappeningObservation {
  const request = collectRequestRef(pair);
  const receipt = collectReceiptRef(pair);
  const receiptSourceRequestId = stringValue(pair.receiptSourceRequestId) ??
    stringValue(recordValue(pair.receipt, "sourceRequestId"));
  const receiptSourceRequestHash = stringValue(pair.receiptSourceRequestHash) ??
    stringValue(recordValue(pair.receipt, "sourceRequestHash"));
  const explicitLinkageAsserted = explicitLinked(pair);
  const receiptReferencesRequestId = Boolean(request.id && receiptSourceRequestId === request.id);
  const receiptReferencesRequestHash = Boolean(request.hash && receiptSourceRequestHash === request.hash);
  const compatible = Boolean(
    request.id &&
      request.hash &&
      receipt.id &&
      receipt.hash &&
      explicitLinkageAsserted &&
      receiptReferencesRequestId &&
      receiptReferencesRequestHash,
  );
  const linkageStatus = compatible
    ? "linked"
    : explicitLinkageAsserted && (receiptReferencesRequestId || receiptReferencesRequestHash)
      ? "damaged"
      : "unlinked";
  const sourceRefs = uniqueStrings([
    request.id,
    request.hash,
    request.durableRef,
    request.writerRef,
    receipt.id,
    receipt.hash,
    receipt.durableRef,
    receipt.writerRef,
    receiptSourceRequestId,
    receiptSourceRequestHash,
  ]);

  return {
    observationId: createObservationId(index, request.id, request.hash, receipt.id, receipt.hash),
    classification: compatible
      ? "compatible_seam_happening"
      : "unresolved_or_damaged_seam_happening",
    linkageStatus,
    request,
    receipt,
    ...(receiptSourceRequestId ? { receiptSourceRequestId } : {}),
    ...(receiptSourceRequestHash ? { receiptSourceRequestHash } : {}),
    sourceRefs,
    interpretedFields: {
      requestIdPresent: Boolean(request.id),
      requestHashPresent: Boolean(request.hash),
      receiptIdPresent: Boolean(receipt.id),
      receiptHashPresent: Boolean(receipt.hash),
      receiptReferencesRequestId,
      receiptReferencesRequestHash,
      explicitLinkageAsserted,
    },
    boundary: {
      compatibleMeansLinkageOnly: true,
      canonicalHistoryClaimed: false,
      layerEvidenceAdmitted: false,
      rbcInterpreted: false,
      authorityGranted: false,
    },
  };
}

function collectPairs(seamHistory: JsonRecord | undefined): JsonRecord[] {
  if (!seamHistory) return [];
  const explicitPairs = arrayRecords(seamHistory.pairs);
  if (explicitPairs.length > 0) return explicitPairs;
  const linkedPairs = arrayRecords(seamHistory.linkedPairs);
  if (linkedPairs.length > 0) {
    return linkedPairs.map((pair) => ({
      request: {
        sourceRepo: stringValue(pair.requestSourceRepo) ?? "mesh-ecology-edge",
        requestId: stringValue(pair.requestId),
        requestHash: stringValue(pair.requestHash),
        durableRef: stringValue(pair.requestDurableRef),
        writerRef: stringValue(pair.requestWriterRef),
      },
      receipt: {
        sourceRepo: stringValue(pair.receiptSourceRepo) ?? "mesh-ecology-layer",
        receiptId: stringValue(pair.receiptId),
        receiptHash: stringValue(pair.receiptHash),
        sourceRequestId: stringValue(pair.receiptSourceRequestId) ?? stringValue(pair.requestId),
        sourceRequestHash: stringValue(pair.receiptSourceRequestHash) ?? stringValue(pair.requestHash),
        durableRef: stringValue(pair.receiptDurableRef),
        writerRef: stringValue(pair.receiptWriterRef),
      },
      linkage: {
        linked: pair.linked === true,
      },
    }));
  }
  return [];
}

function collectRequestRef(pair: JsonRecord): EdgeLayerSeamHistorySourceRef {
  const request = isRecord(pair.request) ? pair.request : pair;
  return cleanSourceRef({
    sourceRepo: stringValue(request.sourceRepo) ??
      stringValue(pair.requestSourceRepo) ??
      "mesh-ecology-edge",
    id: stringValue(request.requestId) ??
      stringValue(request.id) ??
      stringValue(pair.requestId),
    hash: stringValue(request.requestHash) ??
      stringValue(request.hash) ??
      stringValue(pair.requestHash),
    durableRef: stringValue(request.durableRef) ??
      stringValue(pair.requestDurableRef),
    writerRef: stringValue(request.writerRef) ??
      stringValue(pair.requestWriterRef),
  });
}

function collectReceiptRef(pair: JsonRecord): EdgeLayerSeamHistorySourceRef {
  const receipt = isRecord(pair.receipt) ? pair.receipt : pair;
  return cleanSourceRef({
    sourceRepo: stringValue(receipt.sourceRepo) ??
      stringValue(pair.receiptSourceRepo) ??
      "mesh-ecology-layer",
    id: stringValue(receipt.receiptId) ??
      stringValue(receipt.id) ??
      stringValue(pair.receiptId),
    hash: stringValue(receipt.receiptHash) ??
      stringValue(receipt.hash) ??
      stringValue(pair.receiptHash),
    durableRef: stringValue(receipt.durableRef) ??
      stringValue(pair.receiptDurableRef),
    writerRef: stringValue(receipt.writerRef) ??
      stringValue(pair.receiptWriterRef),
  });
}

function cleanSourceRef(ref: {
  sourceRepo?: string;
  id?: string | undefined;
  hash?: string | undefined;
  durableRef?: string | undefined;
  writerRef?: string | undefined;
}): EdgeLayerSeamHistorySourceRef {
  return {
    ...(ref.sourceRepo ? { sourceRepo: ref.sourceRepo } : {}),
    ...(ref.id ? { id: ref.id } : {}),
    ...(ref.hash ? { hash: ref.hash } : {}),
    ...(ref.durableRef ? { durableRef: ref.durableRef } : {}),
    ...(ref.writerRef ? { writerRef: ref.writerRef } : {}),
  };
}

function explicitLinked(pair: JsonRecord): boolean {
  const linkage = isRecord(pair.linkage) ? pair.linkage : {};
  return pair.linked === true || linkage.linked === true || linkage.status === "linked";
}

function collectSourceRepos(
  seamHistory: JsonRecord | undefined,
  observations: EdgeLayerSeamHappeningObservation[],
): string[] {
  const sourceRepos = [
    ...stringArray(seamHistory?.sourceRepos),
    ...observations.flatMap((observation) => [
      observation.request.sourceRepo,
      observation.receipt.sourceRepo,
    ]),
  ];
  return uniqueStrings(sourceRepos);
}

function buildBoundary(): EdgeLayerSeamHistoryObservationBoundary {
  return {
    reviewOnly: true,
    observationOnly: true,
    readsSuppliedSeamHistoryMaterial: true,
    opensEdgeRuntime: false,
    opensLayerRuntime: false,
    callsEdge: false,
    callsLayer: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    admitsLayerEvidence: false,
    interpretsRbc: false,
    grantsAuthority: false,
    publishesToMesh: false,
  };
}

function buildProof(inputReadByCausalSubstrate: boolean): EdgeLayerSeamHistoryObservationProof {
  return {
    strongestProofRung: "local_causal_observation_over_supplied_seam_history_material",
    inputMaterialKind: "supplied_seam_history_material",
    inputReadByCausalSubstrate,
    dhtOrHyperswarmInputObservedByCausalSubstrate: false,
    decentralizedSeamProofClaimed: false,
    localSuppliedMaterialOnly: true,
    proofLabelHonest: true,
  };
}

function buildWarnings(status: EdgeLayerSeamHistoryObservationStatus): string[] {
  const warnings = [
    "classification-is-bounded-to-edge-layer-request-receipt-linkage",
    "local-supplied-seam-history-material-is-lower-proof-rung",
    "observation-does-not-claim-dht-or-hyperswarm-seam-proof",
    "observation-does-not-claim-canonical-history",
    "observation-does-not-admit-layer-evidence",
    "observation-does-not-interpret-rbc",
    "observation-does-not-grant-authority",
  ];
  if (status !== "edge-layer-seam-history-observation-valid") {
    warnings.push("seam-history-observation-not-complete-proof");
  }
  return warnings;
}

function createArtifactId(input: { emittedAt: string; historyId?: string; historyHash?: string; sourcePath?: string }): string {
  return `causal-edge-layer-seam-history-observation:${hash(stableJson(input)).slice(0, 16)}`;
}

function createObservationId(
  index: number,
  requestId?: string,
  requestHash?: string,
  receiptId?: string,
  receiptHash?: string,
): string {
  return `causal-edge-layer-seam-happening:${hash([
    index,
    requestId ?? "",
    requestHash ?? "",
    receiptId ?? "",
    receiptHash ?? "",
  ].join("|")).slice(0, 16)}`;
}

function recordValue(value: unknown, key: string): unknown {
  return isRecord(value) ? value[key] : undefined;
}

function arrayRecords(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function uniqueStrings(values: unknown[]): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.trim() !== ""))];
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
