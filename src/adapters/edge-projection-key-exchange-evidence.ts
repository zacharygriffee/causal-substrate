import { createHash } from "node:crypto";

export const CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA =
  "causal-substrate/edge-projection-key-exchange-evidence/v1" as const;

export const CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-projection-key-exchange-evidence" as const;

export type EdgeProjectionKeyExchangeEvidenceStatus =
  | "edge-projection-key-exchange-evidence-emitted"
  | "edge-projection-key-exchange-valid-contact-evidence"
  | "edge-projection-key-exchange-incomplete-evidence"
  | "edge-projection-key-exchange-malformed-evidence"
  | "edge-projection-key-exchange-guardrail-blocked";

export interface EdgeProjectionKeyExchangeEvidenceBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  opensHyperDht: false;
  opensProtomuxRpc: false;
  opensCorestore: false;
  opensAutobase: false;
  callsEdge: false;
  callsTestbed: false;
  replaysProjectionLog: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsDistributedReadiness: false;
  claimsReplicatedState: false;
  claimsMeshPublication: false;
  claimsCausalTruth: false;
  startsBackend: false;
}

export interface EdgeProjectionKeyContactRefs {
  proofId?: string;
  payloadHash?: string;
  sourceCoreKey?: string;
  hostPublicKey?: string;
  requestRef?: string;
  responseRef?: string;
  capabilityAdvertisementRef?: string;
  selectedTransportRef?: string;
  appendEntryRef?: string;
  semanticSourceRefs: string[];
  replicaEntryRefs: string[];
  replicaSourceRefs: string[];
}

export interface EdgeProjectionKeyContactPosture {
  transportKind?: string;
  contactSeam?: string;
  transportRole?: string;
  transportScope?: string;
  participantContact: boolean;
  scaffoldTransport: boolean;
  compatibilityAlias: boolean;
  contactAttempted: boolean;
  contactSucceeded: boolean;
  proofLane: "hyperdht-protomux-rpc-direct-peer";
  participantIdentityDependsOnHttp: false;
}

export interface EdgeProjectionKeyContinuityPosture {
  sourceCoreKeyPresent: boolean;
  sourceCoreKeyMatchesReplica: boolean | "not-reviewed";
  semanticRefsPresent: boolean;
  replicaRefsPreserved: boolean | "not-reviewed";
  happeningRole: "projection-source-core-key-contact-proof";
  causalContinuityRole: "contact-evidence-for-projection-log-replica-continuity";
  acceptedAsCanonicalHistory: false;
  refinedByReplicaInspection: boolean;
}

export interface EdgeProjectionKeyExchangeValidation {
  status: EdgeProjectionKeyExchangeEvidenceStatus;
  parseableObject: boolean;
  expectedSourceSchemaPresent: boolean;
  sourceCoreKeyPresent: boolean;
  semanticRefsPresent: boolean;
  contactEvidencePresent: boolean;
  selectedTransportPosturePresent: boolean;
  replicaInspectionMatched: boolean | "not-reviewed";
  unsafeSeamRefsBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  issues: string[];
}

export interface EdgeProjectionKeyExchangeEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceArtifactKind?: string;
    sourceSchema?: string;
    sourcePath?: string;
  };
  contactRefs: EdgeProjectionKeyContactRefs;
  contactPosture: EdgeProjectionKeyContactPosture;
  continuityPosture: EdgeProjectionKeyContinuityPosture;
  boundary: EdgeProjectionKeyExchangeEvidenceBoundary;
  validation: EdgeProjectionKeyExchangeValidation;
  reviewStatus: EdgeProjectionKeyExchangeEvidenceStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeProjectionKeyExchangeEvidenceInput {
  proof: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
  replicaInspection?: unknown;
}

type JsonRecord = Record<string, unknown>;

const EDGE_PROJECTION_KEY_EXCHANGE_ARTIFACT_KIND = "edge_projection_key_exchange_proof";
const EDGE_PROJECTION_KEY_EXCHANGE_SCHEMA =
  "mesh-ecology-edge/projection-key-exchange/hyperdht-protomux-rpc/v0";
const HEX_32_BYTES = /^[a-f0-9]{64}$/u;
const SHA256_REF = /^sha256:[a-f0-9]{64}$/u;

export function buildEdgeProjectionKeyExchangeEvidenceArtifact(
  input: BuildEdgeProjectionKeyExchangeEvidenceInput,
): EdgeProjectionKeyExchangeEvidenceArtifact {
  const proof = isRecord(input.proof) ? input.proof : undefined;
  const replicaInspection = isRecord(input.replicaInspection) ? input.replicaInspection : undefined;
  const contactRefs = collectContactRefs(proof, replicaInspection);
  const contactPosture = collectContactPosture(proof);
  const continuityPosture = collectContinuityPosture(contactRefs, replicaInspection);
  const issues = validateProof(proof, input.proof, contactRefs, contactPosture, replicaInspection);
  const status = determineStatus(proof, issues);
  const source: EdgeProjectionKeyExchangeEvidenceArtifact["source"] = {
    sourceRepo: "mesh-ecology-edge",
  };
  const sourceArtifactKind = stringValue(proof?.artifactKind);
  if (sourceArtifactKind) source.sourceArtifactKind = sourceArtifactKind;
  const sourceSchema = stringValue(proof?.schema);
  if (sourceSchema) source.sourceSchema = sourceSchema;
  if (input.sourcePath) source.sourcePath = input.sourcePath;
  const artifactId = input.artifactId ?? createArtifactId({
    emittedAt: input.emittedAt,
    ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    ...(contactRefs.proofId ? { proofId: contactRefs.proofId } : {}),
    ...(contactRefs.sourceCoreKey ? { sourceCoreKey: contactRefs.sourceCoreKey } : {}),
  });

  return {
    artifactKind: CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source,
    contactRefs,
    contactPosture,
    continuityPosture,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: proof !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      sourceCoreKeyPresent: issues.includes("source-core-key-missing-or-invalid") === false,
      semanticRefsPresent: issues.includes("source-refs-missing") === false,
      contactEvidencePresent: issues.includes("contact-proof-missing-or-failed") === false,
      selectedTransportPosturePresent: issues.includes("selected-transport-posture-missing-or-unsafe") === false,
      replicaInspectionMatched: replicaInspection
        ? issues.includes("replica-source-core-key-mismatch") === false &&
          issues.includes("replica-source-refs-missing") === false
        : "not-reviewed",
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("truth-readiness-runtime-backend-or-publication-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-projection-key-exchange-valid-contact-evidence"
      ? "edge-projection-key-exchange-evidence-emitted"
      : status,
    warnings: buildWarnings(status, replicaInspection !== undefined),
    rejections: buildRejections(status, issues),
  };
}

export function assertEdgeProjectionKeyExchangeEvidenceArtifact(
  value: unknown,
): asserts value is EdgeProjectionKeyExchangeEvidenceArtifact {
  const candidate = assertObject(value, "edge projection key exchange evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.opensHyperDht, false, "boundary.opensHyperDht");
  assertEqual(boundary.opensProtomuxRpc, false, "boundary.opensProtomuxRpc");
  assertEqual(boundary.opensCorestore, false, "boundary.opensCorestore");
  assertEqual(boundary.opensAutobase, false, "boundary.opensAutobase");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
}

function collectContactRefs(
  proof: JsonRecord | undefined,
  replicaInspection: JsonRecord | undefined,
): EdgeProjectionKeyContactRefs {
  const appendLogRefs = isRecord(proof?.appendLogRefs) ? proof.appendLogRefs : {};
  const capabilityAdvertisement = isRecord(proof?.capabilityAdvertisement) ? proof.capabilityAdvertisement : {};
  const latestEntry = isRecord(replicaInspection?.latestEntry) ? replicaInspection.latestEntry : {};
  const refs: EdgeProjectionKeyContactRefs = {
    semanticSourceRefs: stringArray(proof?.sourceRefs),
    replicaEntryRefs: [],
    replicaSourceRefs: stringArray(latestEntry.sourceRefs),
  };
  const proofId = stringValue(proof?.proofId);
  if (proofId) refs.proofId = proofId;
  const payloadHash = stringValue(proof?.payloadHash);
  if (payloadHash) refs.payloadHash = payloadHash;
  const sourceCoreKey = stringValue(proof?.sourceCoreKey);
  if (sourceCoreKey) refs.sourceCoreKey = sourceCoreKey;
  const hostPublicKey = stringValue(proof?.hostPublicKey);
  if (hostPublicKey) refs.hostPublicKey = hostPublicKey;
  const requestRef = stringValue(proof?.requestId) ?? stringValue(appendLogRefs.requestRef);
  if (requestRef) refs.requestRef = requestRef;
  const responseRef = stringValue(proof?.responseId) ?? stringValue(appendLogRefs.responseRef);
  if (responseRef) refs.responseRef = responseRef;
  const capabilityAdvertisementRef =
    stringValue(capabilityAdvertisement.responseId) ?? stringValue(appendLogRefs.capabilityAdvertisementRef);
  if (capabilityAdvertisementRef) refs.capabilityAdvertisementRef = capabilityAdvertisementRef;
  const selectedTransportRef = stringValue(appendLogRefs.selectedTransportRef);
  if (selectedTransportRef) refs.selectedTransportRef = selectedTransportRef;
  const appendEntryRef = stringValue(appendLogRefs.entryId);
  if (appendEntryRef) refs.appendEntryRef = appendEntryRef;
  const replicaEntryRef = stringValue(latestEntry.entryId);
  if (replicaEntryRef) refs.replicaEntryRefs = [replicaEntryRef];
  return refs;
}

function collectContactPosture(proof: JsonRecord | undefined): EdgeProjectionKeyContactPosture {
  const selectedTransport = isRecord(proof?.selectedTransport) ? proof.selectedTransport : {};
  const posture: EdgeProjectionKeyContactPosture = {
    participantContact: proof?.participantA !== undefined && proof?.participantB !== undefined,
    scaffoldTransport: selectedTransport.scaffoldTransport === true,
    compatibilityAlias: selectedTransport.compatibilityAlias === true,
    contactAttempted: proof?.contactAttempted === true,
    contactSucceeded: proof?.contactSucceeded === true,
    proofLane: "hyperdht-protomux-rpc-direct-peer",
    participantIdentityDependsOnHttp: false,
  };
  const transportKind = stringValue(proof?.transportKind);
  if (transportKind) posture.transportKind = transportKind;
  const contactSeam = stringValue(proof?.contactSeam);
  if (contactSeam) posture.contactSeam = contactSeam;
  const transportRole = stringValue(selectedTransport.transportRole);
  if (transportRole) posture.transportRole = transportRole;
  const transportScope = stringValue(selectedTransport.scope);
  if (transportScope) posture.transportScope = transportScope;
  return posture;
}

function collectContinuityPosture(
  refs: EdgeProjectionKeyContactRefs,
  replicaInspection: JsonRecord | undefined,
): EdgeProjectionKeyContinuityPosture {
  const latestEntry = isRecord(replicaInspection?.latestEntry) ? replicaInspection.latestEntry : {};
  const replicaCoreKey = stringValue(replicaInspection?.sourceCoreKey);
  const sourceCoreKeyMatchesReplica = replicaInspection
    ? refs.sourceCoreKey !== undefined && refs.sourceCoreKey === replicaCoreKey
    : "not-reviewed";
  const replicaRefsPreserved = replicaInspection
    ? refs.semanticSourceRefs.every((ref) => stringArray(latestEntry.sourceRefs).includes(ref))
    : "not-reviewed";
  return {
    sourceCoreKeyPresent: refs.sourceCoreKey !== undefined,
    sourceCoreKeyMatchesReplica,
    semanticRefsPresent: refs.semanticSourceRefs.length > 0,
    replicaRefsPreserved,
    happeningRole: "projection-source-core-key-contact-proof",
    causalContinuityRole: "contact-evidence-for-projection-log-replica-continuity",
    acceptedAsCanonicalHistory: false,
    refinedByReplicaInspection: replicaInspection !== undefined,
  };
}

function validateProof(
  proof: JsonRecord | undefined,
  original: unknown,
  refs: EdgeProjectionKeyContactRefs,
  contactPosture: EdgeProjectionKeyContactPosture,
  replicaInspection: JsonRecord | undefined,
): string[] {
  if (!isRecord(original) || !proof) return ["projection-key-proof-not-object"];
  const issues: string[] = [];
  const selectedTransport = isRecord(proof.selectedTransport) ? proof.selectedTransport : {};
  const readinessEvidence = isRecord(proof.readinessEvidence) ? proof.readinessEvidence : {};
  const capabilityDescriptor = isRecord(proof.capabilityDescriptor) ? proof.capabilityDescriptor : {};
  const nonClaims = isRecord(proof.nonClaims) ? proof.nonClaims : {};
  const response = isRecord(proof.response) ? proof.response : {};
  const appendLogRefs = isRecord(proof.appendLogRefs) ? proof.appendLogRefs : {};
  const latestEntry = isRecord(replicaInspection?.latestEntry) ? replicaInspection.latestEntry : {};
  const allRefs = [
    refs.proofId,
    refs.sourceCoreKey,
    refs.hostPublicKey,
    refs.requestRef,
    refs.responseRef,
    refs.capabilityAdvertisementRef,
    refs.selectedTransportRef,
    refs.appendEntryRef,
    ...refs.semanticSourceRefs,
    ...refs.replicaEntryRefs,
    ...refs.replicaSourceRefs,
  ].filter((ref): ref is string => Boolean(ref));

  if (proof.artifactKind !== EDGE_PROJECTION_KEY_EXCHANGE_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (proof.schema !== EDGE_PROJECTION_KEY_EXCHANGE_SCHEMA) issues.push("source-schema-mismatch");
  if (!stringValue(refs.proofId)) issues.push("proof-id-missing");
  if (!stringValue(proof.payloadHash) || !SHA256_REF.test(String(proof.payloadHash))) issues.push("payload-hash-invalid");
  if (proof.payloadHashAlgorithm !== "sha256-canonical-json") issues.push("payload-hash-algorithm-mismatch");
  if (!refs.sourceCoreKey || !HEX_32_BYTES.test(refs.sourceCoreKey)) issues.push("source-core-key-missing-or-invalid");
  if (refs.semanticSourceRefs.length === 0) issues.push("source-refs-missing");
  if (contactPosture.transportKind !== "protomux-rpc" || contactPosture.contactSeam !== "hyperdht_direct_peer") {
    issues.push("contact-lane-mismatch");
  }
  if (
    selectedTransport.transportRole !== "proof_lane" ||
    selectedTransport.scope !== "isolated_local_hyperdht" ||
    selectedTransport.scaffoldTransport !== false ||
    selectedTransport.compatibilityAlias !== false ||
    selectedTransport.portExposureRequired !== false ||
    selectedTransport.participantContact !== true
  ) {
    issues.push("selected-transport-posture-missing-or-unsafe");
  }
  if (proof.contactAttempted !== true || proof.contactSucceeded !== true || response.ok !== true) {
    issues.push("contact-proof-missing-or-failed");
  }
  if (readinessEvidence.distributedReadinessClaimed !== false || proof.distributedReadinessClaimed !== false) {
    issues.push("truth-readiness-runtime-backend-or-publication-claim");
  }
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.autobaseBackend === true ||
    nonClaims.meshPublicationClaimed === true ||
    readinessEvidence.replicatedStateClaimed === true
  ) {
    issues.push("truth-readiness-runtime-backend-or-publication-claim");
  }
  if (
    capabilityDescriptor.transportKind !== "protomux-rpc" ||
    capabilityDescriptor.contactSeam !== "hyperdht_direct_peer" ||
    capabilityDescriptor.localLayerDefault !== true ||
    capabilityDescriptor.meshLayerDefault !== false ||
    capabilityDescriptor.discoveryRequired !== false ||
    capabilityDescriptor.participantContact !== true
  ) {
    issues.push("capability-posture-missing-or-unsafe");
  }
  if (!stringValue(appendLogRefs.entryId) || !stringValue(appendLogRefs.selectedTransportRef)) {
    issues.push("append-log-refs-missing");
  }
  if (stringValue(response.sourceCoreKey) !== refs.sourceCoreKey) issues.push("response-source-core-key-mismatch");
  if (stringArray(response.sourceRefs).length === 0) issues.push("response-source-refs-missing");
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");

  if (replicaInspection) {
    if (replicaInspection.inspectionState !== "projection_event_log_replica_visible") {
      issues.push("replica-inspection-not-visible");
    }
    if (stringValue(replicaInspection.sourceCoreKey) !== refs.sourceCoreKey) {
      issues.push("replica-source-core-key-mismatch");
    }
    if (stringArray(latestEntry.sourceRefs).length === 0) {
      issues.push("replica-source-refs-missing");
    }
    if (!refs.semanticSourceRefs.every((ref) => stringArray(latestEntry.sourceRefs).includes(ref))) {
      issues.push("replica-source-refs-mismatch");
    }
    const logPosture = isRecord(latestEntry.logPosture) ? latestEntry.logPosture : {};
    if (
      logPosture.httpSeam === true ||
      logPosture.sshSeam === true ||
      logPosture.localStoreRootIsIntegrationSeam === true
    ) {
      issues.push("replica-storage-or-transport-overclaim");
    }
  }

  return [...new Set(issues)];
}

function determineStatus(
  proof: JsonRecord | undefined,
  issues: string[],
): EdgeProjectionKeyExchangeEvidenceStatus {
  if (!proof) return "edge-projection-key-exchange-malformed-evidence";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("truth-readiness-runtime-backend-or-publication-claim") ||
    issues.includes("selected-transport-posture-missing-or-unsafe") ||
    issues.includes("contact-lane-mismatch") ||
    issues.includes("replica-source-core-key-mismatch") ||
    issues.includes("replica-storage-or-transport-overclaim")
  ) {
    return "edge-projection-key-exchange-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-projection-key-exchange-incomplete-evidence";
  return "edge-projection-key-exchange-valid-contact-evidence";
}

function buildBoundary(): EdgeProjectionKeyExchangeEvidenceBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    opensHyperDht: false,
    opensProtomuxRpc: false,
    opensCorestore: false,
    opensAutobase: false,
    callsEdge: false,
    callsTestbed: false,
    replaysProjectionLog: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsDistributedReadiness: false,
    claimsReplicatedState: false,
    claimsMeshPublication: false,
    claimsCausalTruth: false,
    startsBackend: false,
  };
}

function buildWarnings(status: EdgeProjectionKeyExchangeEvidenceStatus, replicaReviewed: boolean): string[] {
  if (status === "edge-projection-key-exchange-valid-contact-evidence") {
    return [
      "projection-key-exchange-preserved-as-contact-evidence-only",
      "source-core-key-is-continuity-reference-not-canonical-history",
      "adapter-does-not-open-hyperdht-protomux-corestore-or-autobase",
      replicaReviewed
        ? "replica-inspection-refines-contact-evidence-without-replaying-source-log"
        : "replica-inspection-not-reviewed",
    ];
  }
  return ["projection-key-exchange-not-accepted-as-causal-history"];
}

function buildRejections(status: EdgeProjectionKeyExchangeEvidenceStatus, issues: string[]): string[] {
  if (status === "edge-projection-key-exchange-valid-contact-evidence") return [];
  return issues.length > 0 ? issues : [status];
}

function unsafeSeamRef(ref: string): boolean {
  return /https?:\/\/|ssh:\/\/|(^|[.-])localhost($|[.-])|127\.0\.0\.1|\/|\\|(^|[.-])\.\.($|[.-])/iu.test(ref);
}

function createArtifactId(input: {
  emittedAt: string;
  sourcePath?: string;
  proofId?: string;
  sourceCoreKey?: string;
}): string {
  return `causal-edge-projection-key-exchange-evidence:${hash(JSON.stringify(input)).slice(0, 16)}`;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "").map((entry) => entry.trim())
    : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertString(value: unknown, label: string): asserts value is string {
  if (!stringValue(value)) throw new Error(`${label} must be a non-empty string`);
}

function assertEqual<T>(actual: unknown, expected: T, label: string): asserts actual is T {
  if (actual !== expected) throw new Error(`${label} mismatch`);
}
