import { createHash } from "node:crypto";

export const GENERIC_CAUSAL_SEAM_ENDPOINT_DESCRIPTOR_SCHEMA =
  "causal-substrate/generic-causal-seam-endpoint-descriptor/v1" as const;

export const GENERIC_CAUSAL_SEAM_OBSERVATION_SCHEMA =
  "causal-substrate/generic-causal-seam-observation/v1" as const;

export type GenericCausalSeamProofRung =
  | "local_artifact_seam"
  | "saved_readback_seam"
  | "consumer_handoff_seam"
  | "local_runtime_seam"
  | "swarm_discovered_seam"
  | "public_swarm_seam"
  | "durable_replicated_public_swarm_seam";

export type GenericCausalSeamClassification =
  | "compatible"
  | "compatible_with_warnings"
  | "unresolved"
  | "damaged"
  | "incompatible"
  | "overclaimed";

export type GenericCausalHappeningClassification =
  | "linked_request_receipt"
  | "missing_receipt"
  | "receipt_without_request"
  | "hash_mismatch"
  | "source_ref_missing"
  | "writer_ref_missing"
  | "durable_ref_missing"
  | "duplicate_id"
  | "stale_observation"
  | "proof_label_overclaim"
  | "schema_incompatible";

export interface GenericCausalEndpointDescriptor {
  schema: typeof GENERIC_CAUSAL_SEAM_ENDPOINT_DESCRIPTOR_SCHEMA;
  schemaVersion: 1;
  endpointId: string;
  repoName: "causal-substrate";
  lane: string;
  acceptedInputKinds: string[];
  emittedOutputKinds: string[];
  schemaRefs: string[];
  proofRung: GenericCausalSeamProofRung;
  transportPosture: {
    declaredPublicSwarmCapable: boolean;
    publicSwarmTransportProvenByDescriptor: false;
    descriptorOnly: true;
  };
  durableFeedRefs: string[];
  writerRefs: string[];
  readbackCommand: string;
  nonClaims: GenericCausalNonClaims;
}

export interface GenericCausalSeamRefRecord {
  id: string;
  hash: string;
  sourceRepo: string;
  durableRef?: string;
  writerRef?: string;
  schemaRef?: string;
  causalParentRefs?: string[];
  linkageStatus?: string;
  observedProofRung?: GenericCausalSeamProofRung;
}

export interface GenericCausalSeamReceiptRecord extends GenericCausalSeamRefRecord {
  sourceRequestId?: string;
  sourceRequestHash?: string;
}

export interface GenericCausalSeamHistoryEnvelope {
  historyId: string;
  historyHash: string;
  sourceRepos: string[];
  sourceSchemaRefs: string[];
  transportProof: Partial<GenericCausalTransportBooleans> & {
    evidenceSource?: string;
  };
  durableRefs: string[];
  writerRefs: string[];
  requests: GenericCausalSeamRefRecord[];
  receipts: GenericCausalSeamReceiptRecord[];
  evidenceRefs: GenericCausalSeamRefRecord[];
  linkage: Array<{
    requestId?: string;
    requestHash?: string;
    receiptId?: string;
    receiptHash?: string;
  }>;
  proofLabels: string[];
  warnings: string[];
}

export interface GenericCausalTransportBooleans {
  publicSwarmTransportHappened: boolean;
  testnetSwarmTransportHappened: boolean;
  controlPlaneOnly: boolean;
  durableFeedBackedHistoryObserved: boolean;
  receivingRepoObservedReplicatedPath: boolean;
  durableObservationResultEmitted: boolean;
  receiptOrResultCausallyReferencesSources: boolean;
  reopenedReadbackDerivedFromDurableHistory: boolean;
}

export interface GenericCausalNonClaims {
  canonicalHistoryClaimed: false;
  layerEvidenceAdmitted: false;
  layerAdmissionDecided: false;
  rbcInterpreted: false;
  quorumSatisfied: false;
  authorityGranted: false;
  meshPublished: false;
  productionContinuityWritten: false;
}

export interface GenericCausalClassifiedHappening {
  happeningId: string;
  classification: GenericCausalHappeningClassification;
  requestId?: string;
  requestHash?: string;
  receiptId?: string;
  receiptHash?: string;
  sourceRefs: string[];
  detail: string;
}

export interface GenericCausalSeamObservation {
  schema: typeof GENERIC_CAUSAL_SEAM_OBSERVATION_SCHEMA;
  schemaVersion: 1;
  repo: "causal-substrate";
  lane: "generic-causal-seam-surface";
  proofCommand: string;
  generatedAt: string;
  observationId: string;
  observationHash: string;
  observedHistoryId: string;
  observedHistoryHash: string;
  sourceRefsPreserved: {
    requestIds: string[];
    requestHashes: string[];
    receiptIds: string[];
    receiptHashes: string[];
    sourceRepos: string[];
    durableRefs: string[];
    writerRefs: string[];
    evidenceIds: string[];
  };
  strongestProofRung: GenericCausalSeamProofRung;
  operationProofRung: GenericCausalSeamProofRung;
  sourceProofRung: GenericCausalSeamProofRung;
  finalClassification: GenericCausalSeamClassification;
  classification: GenericCausalSeamClassification;
  classifiedHappenings: GenericCausalClassifiedHappening[];
  damageFindings: string[];
  unresolvedFindings: string[];
  overclaimFindings: string[];
  proof: {
    strongestProofRung: GenericCausalSeamProofRung;
    operationProofRung: GenericCausalSeamProofRung;
    sourceProofRung: GenericCausalSeamProofRung;
    proofLabels: string[];
    proofRungUpgradeClaimed: false;
  };
  transportBooleans: GenericCausalTransportBooleans;
  publicSwarmTransportHappened: boolean;
  testnetSwarmTransportHappened: boolean;
  controlPlaneOnly: boolean;
  consumerProjection: {
    genericConsumersMayRead: boolean;
    edgeMayConsumeAsObservationOnlyInput: boolean;
    layerMayConsumeAsObservationOnlyFeedback: boolean;
    spineMayConsumeAsPostureEvidence: boolean;
    writesConsumerState: false;
  };
  nonClaims: GenericCausalNonClaims;
  deferredAttachmentPoints: {
    referentPromotion: null;
    branchCompatibilityGraph: null;
    canonicalContinuityState: null;
    rbcInterpretation: null;
    layerAdmission: null;
    meshPublication: null;
    authorityDecisions: null;
    productionCausalHistory: null;
  };
  nextPressure: string;
  warnings: string[];
}

export function buildGenericCausalEndpointDescriptor(input: {
  endpointId: string;
  lane?: string;
  proofRung?: GenericCausalSeamProofRung;
  declaredPublicSwarmCapable?: boolean;
  durableFeedRefs?: string[];
  writerRefs?: string[];
  readbackCommand?: string;
}): GenericCausalEndpointDescriptor {
  return {
    schema: GENERIC_CAUSAL_SEAM_ENDPOINT_DESCRIPTOR_SCHEMA,
    schemaVersion: 1,
    endpointId: input.endpointId,
    repoName: "causal-substrate",
    lane: input.lane ?? "generic-causal-seam-surface",
    acceptedInputKinds: [
      "generic-seam-history-envelope",
      "request-ref",
      "receipt-ref",
      "evidence-ref",
      "durable-ref",
      "writer-ref",
      "linkage-ref",
    ],
    emittedOutputKinds: ["generic-causal-seam-observation"],
    schemaRefs: [
      GENERIC_CAUSAL_SEAM_ENDPOINT_DESCRIPTOR_SCHEMA,
      GENERIC_CAUSAL_SEAM_OBSERVATION_SCHEMA,
    ],
    proofRung: input.proofRung ?? "local_artifact_seam",
    transportPosture: {
      declaredPublicSwarmCapable: input.declaredPublicSwarmCapable ?? false,
      publicSwarmTransportProvenByDescriptor: false,
      descriptorOnly: true,
    },
    durableFeedRefs: [...(input.durableFeedRefs ?? [])],
    writerRefs: [...(input.writerRefs ?? [])],
    readbackCommand: input.readbackCommand ?? "npm test -- --test-name-pattern generic-causal-seam-surface",
    nonClaims: nonClaims(),
  };
}

export function buildGenericCausalSeamObservation(input: {
  seamHistory: GenericCausalSeamHistoryEnvelope;
  proofCommand: string;
  generatedAt: string;
  operationProofRung?: GenericCausalSeamProofRung;
  durableObservationResultEmitted?: boolean;
  reopenedReadbackDerivedFromDurableHistory?: boolean;
}): GenericCausalSeamObservation {
  const happenings: GenericCausalClassifiedHappening[] = [];
  const damageFindings: string[] = [];
  const unresolvedFindings: string[] = [];
  const overclaimFindings: string[] = [];
  const requestById = new Map<string, GenericCausalSeamRefRecord>();
  const receiptIds = new Set<string>();

  collectDuplicateIds("request", input.seamHistory.requests, happenings, damageFindings);
  collectDuplicateIds("receipt", input.seamHistory.receipts, happenings, damageFindings);

  for (const request of input.seamHistory.requests) {
    if (!requestById.has(request.id)) requestById.set(request.id, request);
    collectMissingRefFindings("request", request, happenings, unresolvedFindings);
  }

  for (const receipt of input.seamHistory.receipts) {
    receiptIds.add(receipt.id);
    collectMissingRefFindings("receipt", receipt, happenings, unresolvedFindings);
    const request = receipt.sourceRequestId ? requestById.get(receipt.sourceRequestId) : undefined;
    if (!request) {
      const happening = classifiedHappening("receipt_without_request", {
        receipt,
        detail: "receipt does not reference a request present in the envelope",
      });
      happenings.push(happening);
      unresolvedFindings.push(happening.detail);
      continue;
    }
    if (receipt.sourceRequestHash && receipt.sourceRequestHash !== request.hash) {
      const happening = classifiedHappening("hash_mismatch", {
        request,
        receipt,
        detail: "receipt source request hash does not match the referenced request hash",
      });
      happenings.push(happening);
      damageFindings.push(happening.detail);
      continue;
    }
    const happening = classifiedHappening("linked_request_receipt", {
      request,
      receipt,
      detail: "receipt references a request with matching id and hash",
    });
    happenings.push(happening);
  }

  for (const request of input.seamHistory.requests) {
    const hasReceipt = input.seamHistory.receipts.some((receipt) => receipt.sourceRequestId === request.id);
    if (!hasReceipt) {
      const happening = classifiedHappening("missing_receipt", {
        request,
        detail: "request has no matching receipt in the envelope",
      });
      happenings.push(happening);
      unresolvedFindings.push(happening.detail);
    }
  }

  for (const linkage of input.seamHistory.linkage) {
    if (linkage.receiptId && !receiptIds.has(linkage.receiptId)) {
      const detail = `linkage references missing receipt ${linkage.receiptId}`;
      const happening = classifiedHappening("missing_receipt", { detail });
      happenings.push(happening);
      unresolvedFindings.push(detail);
    }
  }

  for (const label of input.seamHistory.proofLabels) {
    if (label.includes("public") && !evidenceDerivedPublicSwarm(input.seamHistory.transportProof)) {
      const detail = `proof label ${label} is not backed by public swarm transport evidence`;
      const happening = classifiedHappening("proof_label_overclaim", { detail });
      happenings.push(happening);
      overclaimFindings.push(detail);
    }
  }

  const transportBooleans = deriveTransportBooleans({
    transportProof: input.seamHistory.transportProof,
    durableObservationResultEmitted: input.durableObservationResultEmitted ?? false,
    reopenedReadbackDerivedFromDurableHistory: input.reopenedReadbackDerivedFromDurableHistory ?? false,
  });
  const sourceProofRung = deriveSourceProofRung(transportBooleans, input.seamHistory.transportProof);
  const operationProofRung = input.operationProofRung ?? "local_artifact_seam";
  const strongestProofRung = strongestRung([sourceProofRung, operationProofRung]);
  const finalClassification = classify({
    happenings,
    damageFindings,
    unresolvedFindings,
    overclaimFindings,
    warnings: input.seamHistory.warnings,
  });
  const refs = preservedRefs(input.seamHistory);
  const observationId = `generic-causal-seam-observation:${hash(stableJson({
    historyId: input.seamHistory.historyId,
    historyHash: input.seamHistory.historyHash,
    generatedAt: input.generatedAt,
  })).slice(0, 16)}`;
  const observationHash = `sha256:${hash(stableJson({
    observedHistoryId: input.seamHistory.historyId,
    observedHistoryHash: input.seamHistory.historyHash,
    refs,
    happenings,
    finalClassification,
  }))}`;

  return {
    schema: GENERIC_CAUSAL_SEAM_OBSERVATION_SCHEMA,
    schemaVersion: 1,
    repo: "causal-substrate",
    lane: "generic-causal-seam-surface",
    proofCommand: input.proofCommand,
    generatedAt: input.generatedAt,
    observationId,
    observationHash,
    observedHistoryId: input.seamHistory.historyId,
    observedHistoryHash: input.seamHistory.historyHash,
    sourceRefsPreserved: refs,
    strongestProofRung,
    operationProofRung,
    sourceProofRung,
    finalClassification,
    classification: finalClassification,
    classifiedHappenings: happenings,
    damageFindings,
    unresolvedFindings,
    overclaimFindings,
    proof: {
      strongestProofRung,
      operationProofRung,
      sourceProofRung,
      proofLabels: [...input.seamHistory.proofLabels],
      proofRungUpgradeClaimed: false,
    },
    transportBooleans,
    publicSwarmTransportHappened: transportBooleans.publicSwarmTransportHappened,
    testnetSwarmTransportHappened: transportBooleans.testnetSwarmTransportHappened,
    controlPlaneOnly: transportBooleans.controlPlaneOnly,
    consumerProjection: {
      genericConsumersMayRead: true,
      edgeMayConsumeAsObservationOnlyInput: true,
      layerMayConsumeAsObservationOnlyFeedback: true,
      spineMayConsumeAsPostureEvidence: true,
      writesConsumerState: false,
    },
    nonClaims: nonClaims(),
    deferredAttachmentPoints: {
      referentPromotion: null,
      branchCompatibilityGraph: null,
      canonicalContinuityState: null,
      rbcInterpretation: null,
      layerAdmission: null,
      meshPublication: null,
      authorityDecisions: null,
      productionCausalHistory: null,
    },
    nextPressure: nextPressure(transportBooleans),
    warnings: [
      ...input.seamHistory.warnings,
      "generic-causal-seam-observation-does-not-grant-authority",
      "generic-causal-seam-observation-preserves-consumer-refs-as-input-only",
    ],
  };
}

export function assertGenericCausalEndpointDescriptor(value: unknown): asserts value is GenericCausalEndpointDescriptor {
  const candidate = assertRecord(value, "generic causal endpoint descriptor");
  assertEqual(candidate.schema, GENERIC_CAUSAL_SEAM_ENDPOINT_DESCRIPTOR_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertEqual(candidate.repoName, "causal-substrate", "repoName");
  assertString(candidate.endpointId, "endpointId");
  const transportPosture = assertRecord(candidate.transportPosture, "transportPosture");
  assertEqual(
    transportPosture.publicSwarmTransportProvenByDescriptor,
    false,
    "transportPosture.publicSwarmTransportProvenByDescriptor",
  );
}

export function assertGenericCausalSeamObservation(value: unknown): asserts value is GenericCausalSeamObservation {
  const candidate = assertRecord(value, "generic causal seam observation");
  assertEqual(candidate.schema, GENERIC_CAUSAL_SEAM_OBSERVATION_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertEqual(candidate.repo, "causal-substrate", "repo");
  assertEqual(candidate.lane, "generic-causal-seam-surface", "lane");
  assertString(candidate.proofCommand, "proofCommand");
  assertString(candidate.strongestProofRung, "strongestProofRung");
  assertString(candidate.finalClassification, "finalClassification");
  const proof = assertRecord(candidate.proof, "proof");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const transportBooleans = assertRecord(candidate.transportBooleans, "transportBooleans");
  for (const key of [
    "publicSwarmTransportHappened",
    "testnetSwarmTransportHappened",
    "controlPlaneOnly",
    "durableFeedBackedHistoryObserved",
    "receivingRepoObservedReplicatedPath",
    "durableObservationResultEmitted",
    "receiptOrResultCausallyReferencesSources",
    "reopenedReadbackDerivedFromDurableHistory",
  ]) {
    assertBoolean(transportBooleans[key], `transportBooleans.${key}`);
  }
  const nonClaimsValue = assertRecord(candidate.nonClaims, "nonClaims");
  for (const key of [
    "canonicalHistoryClaimed",
    "layerEvidenceAdmitted",
    "layerAdmissionDecided",
    "rbcInterpreted",
    "quorumSatisfied",
    "authorityGranted",
    "meshPublished",
    "productionContinuityWritten",
  ]) {
    assertEqual(nonClaimsValue[key], false, `nonClaims.${key}`);
  }
}

function collectDuplicateIds(
  kind: "request" | "receipt",
  records: GenericCausalSeamRefRecord[],
  happenings: GenericCausalClassifiedHappening[],
  damageFindings: string[],
): void {
  const seen = new Set<string>();
  for (const record of records) {
    if (seen.has(record.id)) {
      const detail = `duplicate ${kind} id ${record.id}`;
      const happening = classifiedHappening("duplicate_id", {
        ...(kind === "request" ? { request: record } : { receipt: record }),
        detail,
      });
      happenings.push(happening);
      damageFindings.push(detail);
    }
    seen.add(record.id);
  }
}

function collectMissingRefFindings(
  kind: "request" | "receipt",
  record: GenericCausalSeamRefRecord,
  happenings: GenericCausalClassifiedHappening[],
  unresolvedFindings: string[],
): void {
  const base = kind === "request" ? { request: record } : { receipt: record };
  if (!record.sourceRepo) {
    const happening = classifiedHappening("source_ref_missing", {
      ...base,
      detail: `${kind} ${record.id} is missing source repo`,
    });
    happenings.push(happening);
    unresolvedFindings.push(happening.detail);
  }
  if (!record.durableRef) {
    const happening = classifiedHappening("durable_ref_missing", {
      ...base,
      detail: `${kind} ${record.id} is missing durable ref`,
    });
    happenings.push(happening);
    unresolvedFindings.push(happening.detail);
  }
  if (!record.writerRef) {
    const happening = classifiedHappening("writer_ref_missing", {
      ...base,
      detail: `${kind} ${record.id} is missing writer ref`,
    });
    happenings.push(happening);
    unresolvedFindings.push(happening.detail);
  }
}

function classifiedHappening(
  classification: GenericCausalHappeningClassification,
  input: {
    request?: GenericCausalSeamRefRecord;
    receipt?: GenericCausalSeamRefRecord;
    detail: string;
  },
): GenericCausalClassifiedHappening {
  const sourceRefs = unique([
    input.request?.id,
    input.request?.hash,
    input.request?.durableRef,
    input.request?.writerRef,
    input.receipt?.id,
    input.receipt?.hash,
    input.receipt?.durableRef,
    input.receipt?.writerRef,
  ]);
  return {
    happeningId: `generic-causal-happening:${hash(stableJson({
      classification,
      sourceRefs,
      detail: input.detail,
    })).slice(0, 16)}`,
    classification,
    ...(input.request?.id ? { requestId: input.request.id } : {}),
    ...(input.request?.hash ? { requestHash: input.request.hash } : {}),
    ...(input.receipt?.id ? { receiptId: input.receipt.id } : {}),
    ...(input.receipt?.hash ? { receiptHash: input.receipt.hash } : {}),
    sourceRefs,
    detail: input.detail,
  };
}

function preservedRefs(input: GenericCausalSeamHistoryEnvelope): GenericCausalSeamObservation["sourceRefsPreserved"] {
  return {
    requestIds: input.requests.map((request) => request.id),
    requestHashes: input.requests.map((request) => request.hash),
    receiptIds: input.receipts.map((receipt) => receipt.id),
    receiptHashes: input.receipts.map((receipt) => receipt.hash),
    sourceRepos: unique([
      ...input.sourceRepos,
      ...input.requests.map((request) => request.sourceRepo),
      ...input.receipts.map((receipt) => receipt.sourceRepo),
      ...input.evidenceRefs.map((evidence) => evidence.sourceRepo),
    ]),
    durableRefs: unique([
      ...input.durableRefs,
      ...input.requests.map((request) => request.durableRef),
      ...input.receipts.map((receipt) => receipt.durableRef),
      ...input.evidenceRefs.map((evidence) => evidence.durableRef),
    ]),
    writerRefs: unique([
      ...input.writerRefs,
      ...input.requests.map((request) => request.writerRef),
      ...input.receipts.map((receipt) => receipt.writerRef),
      ...input.evidenceRefs.map((evidence) => evidence.writerRef),
    ]),
    evidenceIds: input.evidenceRefs.map((evidence) => evidence.id),
  };
}

function deriveTransportBooleans(input: {
  transportProof: GenericCausalSeamHistoryEnvelope["transportProof"];
  durableObservationResultEmitted: boolean;
  reopenedReadbackDerivedFromDurableHistory: boolean;
}): GenericCausalTransportBooleans {
  const publicSwarmTransportHappened = evidenceDerivedPublicSwarm(input.transportProof);
  const testnetSwarmTransportHappened = !publicSwarmTransportHappened &&
    input.transportProof.testnetSwarmTransportHappened === true &&
    input.transportProof.controlPlaneOnly !== true;
  return {
    publicSwarmTransportHappened,
    testnetSwarmTransportHappened,
    controlPlaneOnly: input.transportProof.controlPlaneOnly === true,
    durableFeedBackedHistoryObserved: input.transportProof.durableFeedBackedHistoryObserved === true,
    receivingRepoObservedReplicatedPath: input.transportProof.receivingRepoObservedReplicatedPath === true,
    durableObservationResultEmitted: input.durableObservationResultEmitted,
    receiptOrResultCausallyReferencesSources:
      input.transportProof.receiptOrResultCausallyReferencesSources === true,
    reopenedReadbackDerivedFromDurableHistory: input.reopenedReadbackDerivedFromDurableHistory,
  };
}

function evidenceDerivedPublicSwarm(transportProof: GenericCausalSeamHistoryEnvelope["transportProof"]): boolean {
  return transportProof.publicSwarmTransportHappened === true &&
    transportProof.durableFeedBackedHistoryObserved === true &&
    transportProof.receivingRepoObservedReplicatedPath === true &&
    transportProof.controlPlaneOnly !== true &&
    transportProof.evidenceSource === "reader_observed_replicated_public_swarm_path";
}

function deriveSourceProofRung(
  transport: GenericCausalTransportBooleans,
  proof: GenericCausalSeamHistoryEnvelope["transportProof"],
): GenericCausalSeamProofRung {
  if (
    transport.publicSwarmTransportHappened &&
    transport.durableFeedBackedHistoryObserved &&
    transport.receivingRepoObservedReplicatedPath &&
    proof.reopenedReadbackDerivedFromDurableHistory === true
  ) {
    return "durable_replicated_public_swarm_seam";
  }
  if (transport.publicSwarmTransportHappened) return "public_swarm_seam";
  if (transport.testnetSwarmTransportHappened) return "swarm_discovered_seam";
  return "local_artifact_seam";
}

function strongestRung(rungs: GenericCausalSeamProofRung[]): GenericCausalSeamProofRung {
  const rank: Record<GenericCausalSeamProofRung, number> = {
    local_artifact_seam: 1,
    saved_readback_seam: 2,
    consumer_handoff_seam: 3,
    local_runtime_seam: 4,
    swarm_discovered_seam: 5,
    public_swarm_seam: 6,
    durable_replicated_public_swarm_seam: 7,
  };
  return rungs.reduce((strongest, rung) => rank[rung] > rank[strongest] ? rung : strongest, "local_artifact_seam");
}

function classify(input: {
  happenings: GenericCausalClassifiedHappening[];
  damageFindings: string[];
  unresolvedFindings: string[];
  overclaimFindings: string[];
  warnings: string[];
}): GenericCausalSeamClassification {
  if (input.overclaimFindings.length > 0) return "overclaimed";
  if (input.damageFindings.length > 0) return "damaged";
  if (input.unresolvedFindings.length > 0) return "unresolved";
  if (input.happenings.some((happening) => happening.classification === "schema_incompatible")) {
    return "incompatible";
  }
  if (input.warnings.length > 0) return "compatible_with_warnings";
  return "compatible";
}

function nextPressure(transport: GenericCausalTransportBooleans): string {
  if (!transport.publicSwarmTransportHappened) {
    return "run-neutral-generic-seam-history-over-public-swarm";
  }
  if (!transport.durableObservationResultEmitted || !transport.reopenedReadbackDerivedFromDurableHistory) {
    return "emit-durable-observation-result-and-reopen-readback";
  }
  return "hand-generic-observation-to-test-consumer";
}

function nonClaims(): GenericCausalNonClaims {
  return {
    canonicalHistoryClaimed: false,
    layerEvidenceAdmitted: false,
    layerAdmissionDecided: false,
    rbcInterpreted: false,
    quorumSatisfied: false,
    authorityGranted: false,
    meshPublished: false,
    productionContinuityWritten: false,
  };
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => typeof value === "string" && value.length > 0))];
}

function stableJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, sortValue(entry)]),
    );
  }
  return value;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function assertRecord(value: unknown, name: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${name}_must_be_object`);
  }
  return value as Record<string, unknown>;
}

function assertString(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name}_must_be_non_empty_string`);
  }
}

function assertBoolean(value: unknown, name: string): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${name}_must_be_boolean`);
  }
}

function assertEqual<T>(actual: unknown, expected: T, name: string): asserts actual is T {
  if (actual !== expected) {
    throw new Error(`${name}_must_equal_${String(expected)}`);
  }
}
