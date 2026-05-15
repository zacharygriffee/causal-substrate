import { createHash } from "node:crypto";

export const CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA =
  "causal-substrate/mesh-contact-proof-evidence/v1" as const;

export const CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND =
  "causal-mesh-contact-proof-evidence" as const;

export const MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND =
  "mesh_contact_proof_evidence" as const;

export const MESH_CONTACT_PROOF_EVIDENCE_SCHEMA =
  "mesh-v0-2/contact-proof/direct-peer/v1" as const;

export const PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND =
  "platform_local_service_contact_proof_evidence" as const;

export const PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_SCHEMA =
  "mesh-ecology-platform/local-service-contact-proof/direct-peer/v1" as const;

export type MeshContactProofEvidenceStatus =
  | "mesh-contact-proof-evidence-emitted"
  | "mesh-contact-proof-valid-evidence"
  | "mesh-contact-proof-failed-evidence"
  | "mesh-contact-proof-incomplete-evidence"
  | "mesh-contact-proof-malformed-evidence"
  | "mesh-contact-proof-guardrail-blocked";

export interface MeshContactProofEvidenceBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  meshRuntimeFetched: false;
  meshCalled: false;
  meshMutated: false;
  performsContact: false;
  claimsCausalTruth: false;
  acceptsCanonicalBranch: false;
  writesContinuityRecords: false;
  claimsDistributedReadiness: false;
  claimsMeshCompletion: false;
  publishesToMesh: false;
}

export interface MeshContactProofRefs {
  proofKind?: string;
  participantA?: string;
  participantB?: string;
  operation?: string;
  requestId?: string;
  responseId?: string;
  hostPublicKey?: string;
  sourcePath?: string;
}

export interface MeshContactProofTransportEvidence {
  selectedTransportKind?: string;
  selectedContactSeam?: string;
  selectedTransportRole?: string;
  selectedTransportScope?: string;
  scaffoldTransport: boolean;
  compatibilityAliasUsed: boolean;
  productionPreferred: boolean;
  contactAttemptedBySource: boolean;
  contactSucceededBySource: boolean;
  readinessScope?: string;
  distributedReadinessClaimed: boolean;
  failureClass?: string;
  failureMessage?: string;
}

export interface MeshContactProofProtocolEvidence {
  protocolFamily?: string;
  protocolSchema?: string;
  protocolSchemaVersion?: number;
  dispatchVersion?: number;
  requestEncoding?: string;
  responseEncoding?: string;
  dispatchCommand?: string;
}

export interface MeshContactProofCapabilityEvidence {
  descriptorSource?: "inline_descriptor" | "capability_advertisement";
  capability?: string;
  methodName?: string;
  ownerRepo?: string;
  proofScope?: string;
  transportKind?: string;
  contactSeam?: string;
  localLayerDefault: boolean;
  meshLayerDefault: boolean;
  discoveryRequired: boolean;
  participantContact: boolean;
}

export interface MeshContactProofCapabilityAdvertisementEvidence {
  present: boolean;
  participant?: string;
  protocolFamily?: string;
  protocolSchema?: string;
  capabilityCount: number;
  capabilities: MeshContactProofCapabilityEvidence[];
}

export interface MeshContactProofContinuityEvidence {
  observationKind: "protocol-contact-proof-observation";
  sourceEventKind: "adjacent-contact-attempt";
  causalRole: "history-evidence";
  branchPosture: "evidence-branch-only";
  protocolFamily?: string;
  protocolSchema?: string;
  capability?: string;
  capabilityProofScope?: string;
  selectedContactSeam?: string;
  contactAttemptedBySource: boolean;
  contactSucceededBySource: boolean;
  distributedReadinessClaimed: boolean;
  writesContinuityRecords: false;
  acceptsCanonicalBranch: false;
  claimsCausalTruth: false;
}

export interface MeshContactProofEvidenceValidation {
  status: MeshContactProofEvidenceStatus;
  parseableJsonObject: boolean;
  requiredEnvelopePresent: boolean;
  expectedSourceSchemaPresent: boolean;
  transportPosturePresent: boolean;
  directContactSeamPresent: boolean;
  distributedReadinessBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  checks: string[];
}

export interface MeshContactProofEvidenceImportClassification {
  seamId: "mesh_contact_proof_evidence";
  evidenceKind: "mesh_contact_proof_evidence";
  meshExpectedArtifactKind: typeof MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND;
  meshExpectedSchema: typeof MESH_CONTACT_PROOF_EVIDENCE_SCHEMA;
  platformExpectedArtifactKind: typeof PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND;
  platformExpectedSchema: typeof PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_SCHEMA;
  classificationOnly: true;
  meshOwnsSourceSchema: true;
  platformOwnsSourceSchema: true;
  causalOwnsEvidenceArtifact: true;
}

export interface MeshContactProofEvidenceArtifact {
  artifactKind: typeof CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-v0-2" | "mesh-ecology-platform" | "unknown";
    sourceArtifactKind:
      | typeof MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND
      | typeof PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND
      | "unknown";
    sourceSchema:
      | typeof MESH_CONTACT_PROOF_EVIDENCE_SCHEMA
      | typeof PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_SCHEMA
      | "unknown";
    sourceProfile: "mesh_direct_peer_contact" | "platform_local_service_contact" | "unknown";
    sourcePath?: string;
  };
  contactRefs: MeshContactProofRefs;
  protocolEvidence: MeshContactProofProtocolEvidence;
  capabilityEvidence: MeshContactProofCapabilityEvidence;
  capabilityAdvertisementEvidence: MeshContactProofCapabilityAdvertisementEvidence;
  continuityEvidence: MeshContactProofContinuityEvidence;
  transportEvidence: MeshContactProofTransportEvidence;
  boundary: MeshContactProofEvidenceBoundary;
  validation: MeshContactProofEvidenceValidation;
  reviewStatus: MeshContactProofEvidenceStatus;
  importClassification: MeshContactProofEvidenceImportClassification;
  warnings: string[];
  rejections: string[];
}

export interface BuildMeshContactProofEvidenceInput {
  evidence: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

interface ContactProofSourceProfile {
  sourceRepo: "mesh-v0-2" | "mesh-ecology-platform" | "unknown";
  sourceArtifactKind:
    | typeof MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND
    | typeof PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND
    | "unknown";
  sourceSchema:
    | typeof MESH_CONTACT_PROOF_EVIDENCE_SCHEMA
    | typeof PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_SCHEMA
    | "unknown";
  sourceProfile: "mesh_direct_peer_contact" | "platform_local_service_contact" | "unknown";
  expectedCapability?: string;
  expectedOwnerRepo?: string;
  expectedProofScope?: string;
}

const REQUIRED_KEYS = [
  "artifactKind",
  "schema",
  "proofKind",
  "participantA",
  "participantB",
  "operation",
  "requestId",
  "responseId",
  "selectedTransport",
  "readinessEvidence",
] as const;

const UNSAFE_KEYS = [
  "claimsCausalTruth",
  "causalTruthClaimed",
  "canonicalBranchAccepted",
  "writesContinuityRecords",
  "meshTruthClaimed",
  "completionClaimed",
  "claimsMeshCompletion",
  "publishesToMesh",
  "distributedReady",
] as const;

export function buildMeshContactProofEvidenceArtifact(
  input: BuildMeshContactProofEvidenceInput,
): MeshContactProofEvidenceArtifact {
  return buildArtifactFromParsedEvidence({
    ...input,
    parsedEvidence: input.evidence,
    parseableJsonObject: isRecord(input.evidence),
  });
}

export function buildMeshContactProofEvidenceArtifactFromJson(
  input: Omit<BuildMeshContactProofEvidenceInput, "evidence"> & { evidenceJson: string },
): MeshContactProofEvidenceArtifact {
  try {
    const evidence = JSON.parse(input.evidenceJson) as unknown;
    return buildArtifactFromParsedEvidence({
      ...input,
      parsedEvidence: evidence,
      parseableJsonObject: isRecord(evidence),
    });
  } catch {
    return buildArtifactFromParsedEvidence({
      ...input,
      parsedEvidence: undefined,
      parseableJsonObject: false,
    });
  }
}

export function assertMeshContactProofEvidenceArtifact(
  value: unknown,
): asserts value is MeshContactProofEvidenceArtifact {
  const candidate = assertObject(value, "mesh contact proof evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.meshRuntimeFetched, false, "boundary.meshRuntimeFetched");
  assertEqual(boundary.meshCalled, false, "boundary.meshCalled");
  assertEqual(boundary.meshMutated, false, "boundary.meshMutated");
  assertEqual(boundary.performsContact, false, "boundary.performsContact");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
  assertEqual(boundary.acceptsCanonicalBranch, false, "boundary.acceptsCanonicalBranch");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.claimsDistributedReadiness, false, "boundary.claimsDistributedReadiness");
  assertEqual(boundary.claimsMeshCompletion, false, "boundary.claimsMeshCompletion");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  const classification = assertObject(candidate.importClassification, "importClassification");
  assertEqual(classification.seamId, "mesh_contact_proof_evidence", "importClassification.seamId");
  assertEqual(classification.classificationOnly, true, "importClassification.classificationOnly");
  assertEqual(classification.causalOwnsEvidenceArtifact, true, "importClassification.causalOwnsEvidenceArtifact");
}

function buildArtifactFromParsedEvidence(input: {
  parsedEvidence: unknown;
  parseableJsonObject: boolean;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}): MeshContactProofEvidenceArtifact {
  const evidence = isRecord(input.parsedEvidence) ? input.parsedEvidence : undefined;
  const sourceProfile = classifySourceProfile(evidence);
  const checks = validateEvidence(evidence, input.parseableJsonObject);
  const status = determineStatus(checks, input.parseableJsonObject, evidence);
  const contactRefs = collectContactRefs(evidence, input.sourcePath);
  const protocolEvidence = collectProtocolEvidence(evidence);
  const capabilityEvidence = collectCapabilityEvidence(evidence);
  const capabilityAdvertisementEvidence = collectCapabilityAdvertisementEvidence(evidence);
  const transportEvidence = collectTransportEvidence(evidence);
  const continuityEvidence = buildContinuityEvidence(protocolEvidence, capabilityEvidence, transportEvidence);
  const reviewStatus = status === "mesh-contact-proof-valid-evidence"
    ? "mesh-contact-proof-evidence-emitted"
    : status;
  const artifactIdInput: {
    emittedAt: string;
    requestId?: string;
    responseId?: string;
    sourcePath?: string;
  } = {
    emittedAt: input.emittedAt,
  };
  if (contactRefs.requestId) artifactIdInput.requestId = contactRefs.requestId;
  if (contactRefs.responseId) artifactIdInput.responseId = contactRefs.responseId;
  if (input.sourcePath) artifactIdInput.sourcePath = input.sourcePath;
  const artifactId = input.artifactId ?? createMeshContactProofEvidenceArtifactId(artifactIdInput);

  return {
    artifactKind: CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: sourceProfile.sourceRepo,
      sourceArtifactKind: sourceProfile.sourceArtifactKind,
      sourceSchema: sourceProfile.sourceSchema,
      sourceProfile: sourceProfile.sourceProfile,
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    contactRefs,
    protocolEvidence,
    capabilityEvidence,
    capabilityAdvertisementEvidence,
    continuityEvidence,
    transportEvidence,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableJsonObject: input.parseableJsonObject && evidence !== undefined,
      requiredEnvelopePresent: checks.every((check) => !check.startsWith("required-envelope:")),
      expectedSourceSchemaPresent: !checks.includes("source-schema:mismatch"),
      transportPosturePresent: !checks.includes("transport-posture:missing"),
      directContactSeamPresent: !checks.includes("direct-contact-seam:missing"),
      distributedReadinessBlocked: !checks.includes("distributed-readiness-claim:blocked"),
      unsafeClaimsBlocked: !checks.includes("unsafe-claim:blocked"),
      checks,
    },
    reviewStatus,
    importClassification: {
      seamId: "mesh_contact_proof_evidence",
      evidenceKind: "mesh_contact_proof_evidence",
      meshExpectedArtifactKind: MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND,
      meshExpectedSchema: MESH_CONTACT_PROOF_EVIDENCE_SCHEMA,
      platformExpectedArtifactKind: PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND,
      platformExpectedSchema: PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_SCHEMA,
      classificationOnly: true,
      meshOwnsSourceSchema: true,
      platformOwnsSourceSchema: true,
      causalOwnsEvidenceArtifact: true,
    },
    warnings: buildWarnings(status),
    rejections: buildRejections(checks),
  };
}

function buildContinuityEvidence(
  protocolEvidence: MeshContactProofProtocolEvidence,
  capabilityEvidence: MeshContactProofCapabilityEvidence,
  transportEvidence: MeshContactProofTransportEvidence,
): MeshContactProofContinuityEvidence {
  return {
    observationKind: "protocol-contact-proof-observation",
    sourceEventKind: "adjacent-contact-attempt",
    causalRole: "history-evidence",
    branchPosture: "evidence-branch-only",
    ...(protocolEvidence.protocolFamily ? { protocolFamily: protocolEvidence.protocolFamily } : {}),
    ...(protocolEvidence.protocolSchema ? { protocolSchema: protocolEvidence.protocolSchema } : {}),
    ...(capabilityEvidence.capability ? { capability: capabilityEvidence.capability } : {}),
    ...(capabilityEvidence.proofScope ? { capabilityProofScope: capabilityEvidence.proofScope } : {}),
    ...(transportEvidence.selectedContactSeam ? { selectedContactSeam: transportEvidence.selectedContactSeam } : {}),
    contactAttemptedBySource: transportEvidence.contactAttemptedBySource,
    contactSucceededBySource: transportEvidence.contactSucceededBySource,
    distributedReadinessClaimed: transportEvidence.distributedReadinessClaimed,
    writesContinuityRecords: false,
    acceptsCanonicalBranch: false,
    claimsCausalTruth: false,
  };
}

function collectCapabilityEvidence(evidence: JsonRecord | undefined): MeshContactProofCapabilityEvidence {
  const advertised = advertisedCapabilities(evidence);
  const descriptor = advertised.find((capability) =>
    capability.capability === "contact-proof" &&
    capability.proofScope === "bounded_direct_participant_contact"
  ) ?? advertised[0] ?? (isRecord(evidence?.capabilityDescriptor) ? evidence.capabilityDescriptor : undefined);
  return capabilityEvidenceFromDescriptor(
    descriptor,
    descriptor && advertised.includes(descriptor) ? "capability_advertisement" : "inline_descriptor",
  );
}

function capabilityEvidenceFromDescriptor(
  descriptor: JsonRecord | undefined,
  descriptorSource: "inline_descriptor" | "capability_advertisement",
): MeshContactProofCapabilityEvidence {
  const result: MeshContactProofCapabilityEvidence = {
    ...(descriptor ? { descriptorSource } : {}),
    localLayerDefault: descriptor?.localLayerDefault === true,
    meshLayerDefault: descriptor?.meshLayerDefault === true,
    discoveryRequired: descriptor?.discoveryRequired === true,
    participantContact: descriptor?.participantContact === true,
  };
  const capability = stringValue(descriptor?.capability);
  const methodName = stringValue(descriptor?.methodName);
  const ownerRepo = stringValue(descriptor?.ownerRepo);
  const proofScope = stringValue(descriptor?.proofScope);
  const transportKind = stringValue(descriptor?.transportKind);
  const contactSeam = stringValue(descriptor?.contactSeam);
  if (capability) result.capability = capability;
  if (methodName) result.methodName = methodName;
  if (ownerRepo) result.ownerRepo = ownerRepo;
  if (proofScope) result.proofScope = proofScope;
  if (transportKind) result.transportKind = transportKind;
  if (contactSeam) result.contactSeam = contactSeam;
  return result;
}

function collectCapabilityAdvertisementEvidence(
  evidence: JsonRecord | undefined,
): MeshContactProofCapabilityAdvertisementEvidence {
  const advertisement = isRecord(evidence?.capabilityAdvertisement) ? evidence.capabilityAdvertisement : undefined;
  const capabilities = advertisedCapabilities(evidence)
    .map((capability) => capabilityEvidenceFromDescriptor(capability, "capability_advertisement"));
  const result: MeshContactProofCapabilityAdvertisementEvidence = {
    present: advertisement !== undefined,
    capabilityCount: capabilities.length,
    capabilities,
  };
  const participant = stringValue(advertisement?.participant);
  const protocolFamily = stringValue(advertisement?.protocolFamily);
  const protocolSchema = stringValue(advertisement?.protocolSchema);
  if (participant) result.participant = participant;
  if (protocolFamily) result.protocolFamily = protocolFamily;
  if (protocolSchema) result.protocolSchema = protocolSchema;
  return result;
}

function collectProtocolEvidence(evidence: JsonRecord | undefined): MeshContactProofProtocolEvidence {
  const result: MeshContactProofProtocolEvidence = {};
  const protocolFamily = stringValue(evidence?.protocolFamily);
  const protocolSchema = stringValue(evidence?.protocolSchema);
  const requestEncoding = stringValue(evidence?.requestEncoding);
  const responseEncoding = stringValue(evidence?.responseEncoding);
  const dispatchCommand = stringValue(evidence?.dispatchCommand);
  if (protocolFamily) result.protocolFamily = protocolFamily;
  if (protocolSchema) result.protocolSchema = protocolSchema;
  if (typeof evidence?.protocolSchemaVersion === "number") result.protocolSchemaVersion = evidence.protocolSchemaVersion;
  if (typeof evidence?.dispatchVersion === "number") result.dispatchVersion = evidence.dispatchVersion;
  if (requestEncoding) result.requestEncoding = requestEncoding;
  if (responseEncoding) result.responseEncoding = responseEncoding;
  if (dispatchCommand) result.dispatchCommand = dispatchCommand;
  return result;
}

function collectContactRefs(evidence: JsonRecord | undefined, sourcePath: string | undefined): MeshContactProofRefs {
  const refs: MeshContactProofRefs = {};
  const proofKind = stringValue(evidence?.proofKind);
  const participantA = stringValue(evidence?.participantA);
  const participantB = stringValue(evidence?.participantB);
  const operation = stringValue(evidence?.operation);
  const requestId = stringValue(evidence?.requestId);
  const responseId = stringValue(evidence?.responseId);
  const hostPublicKey = stringValue(evidence?.hostPublicKey);
  if (proofKind) refs.proofKind = proofKind;
  if (participantA) refs.participantA = participantA;
  if (participantB) refs.participantB = participantB;
  if (operation) refs.operation = operation;
  if (requestId) refs.requestId = requestId;
  if (responseId) refs.responseId = responseId;
  if (hostPublicKey) refs.hostPublicKey = hostPublicKey;
  if (sourcePath) refs.sourcePath = sourcePath;
  return refs;
}

function collectTransportEvidence(evidence: JsonRecord | undefined): MeshContactProofTransportEvidence {
  const selectedTransport = isRecord(evidence?.selectedTransport) ? evidence.selectedTransport : undefined;
  const readinessEvidence = isRecord(evidence?.readinessEvidence) ? evidence.readinessEvidence : undefined;
  const result: MeshContactProofTransportEvidence = {
    scaffoldTransport: selectedTransport?.scaffoldTransport === true,
    compatibilityAliasUsed: selectedTransport?.compatibilityAlias === true,
    productionPreferred: selectedTransport?.productionPreferred === true,
    contactAttemptedBySource: evidence?.contactAttempted === true,
    contactSucceededBySource: evidence?.contactSucceeded === true,
    distributedReadinessClaimed:
      evidence?.distributedReadinessClaimed === true ||
      readinessEvidence?.distributedReadinessClaimed === true,
  };
  const selectedTransportKind = stringValue(selectedTransport?.transportKind);
  const selectedContactSeam = stringValue(selectedTransport?.contactSeam);
  const selectedTransportRole = stringValue(selectedTransport?.transportRole);
  const selectedTransportScope = stringValue(selectedTransport?.scope);
  const readinessScope = stringValue(readinessEvidence?.readinessScope);
  const failureClass = stringValue(evidence?.failureClass);
  const failureMessage = stringValue(evidence?.failureMessage);
  if (selectedTransportKind) result.selectedTransportKind = selectedTransportKind;
  if (selectedContactSeam) result.selectedContactSeam = selectedContactSeam;
  if (selectedTransportRole) result.selectedTransportRole = selectedTransportRole;
  if (selectedTransportScope) result.selectedTransportScope = selectedTransportScope;
  if (readinessScope) result.readinessScope = readinessScope;
  if (failureClass) result.failureClass = failureClass;
  if (failureMessage) result.failureMessage = failureMessage;
  return result;
}

function classifySourceProfile(evidence: JsonRecord | undefined): ContactProofSourceProfile {
  if (
    evidence?.artifactKind === MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND &&
    evidence.schema === MESH_CONTACT_PROOF_EVIDENCE_SCHEMA
  ) {
    return {
      sourceRepo: "mesh-v0-2",
      sourceArtifactKind: MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND,
      sourceSchema: MESH_CONTACT_PROOF_EVIDENCE_SCHEMA,
      sourceProfile: "mesh_direct_peer_contact",
      expectedCapability: "contact-proof",
      expectedOwnerRepo: "mesh-v0-2",
      expectedProofScope: "bounded_direct_participant_contact",
    };
  }
  if (
    evidence?.artifactKind === PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND &&
    evidence.schema === PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_SCHEMA
  ) {
    return {
      sourceRepo: "mesh-ecology-platform",
      sourceArtifactKind: PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND,
      sourceSchema: PLATFORM_LOCAL_SERVICE_CONTACT_PROOF_EVIDENCE_SCHEMA,
      sourceProfile: "platform_local_service_contact",
      expectedCapability: "platform-local-service-contact-proof",
      expectedOwnerRepo: "mesh-ecology-platform",
      expectedProofScope: "bounded_platform_local_service_contact",
    };
  }
  return {
    sourceRepo: "unknown",
    sourceArtifactKind: "unknown",
    sourceSchema: "unknown",
    sourceProfile: "unknown",
  };
}

function validateEvidence(evidence: JsonRecord | undefined, parseableJsonObject: boolean): string[] {
  if (!parseableJsonObject || !evidence) return ["parseable-json-object:malformed"];
  const checks: string[] = [];
  const sourceProfile = classifySourceProfile(evidence);
  for (const key of REQUIRED_KEYS) {
    if (key === "selectedTransport" || key === "readinessEvidence") {
      if (!isRecord(evidence[key])) checks.push(`required-envelope:${key}`);
      continue;
    }
    if (!stringValue(evidence[key])) checks.push(`required-envelope:${key}`);
  }
  if (sourceProfile.sourceArtifactKind === "unknown") {
    checks.push("source-artifact-kind:mismatch");
  }
  if (sourceProfile.sourceSchema === "unknown") {
    checks.push("source-schema:mismatch");
  }
  const selectedTransport = isRecord(evidence.selectedTransport) ? evidence.selectedTransport : undefined;
  if (!stringValue(selectedTransport?.transportKind) || !stringValue(selectedTransport?.contactSeam)) {
    checks.push("transport-posture:missing");
  }
  if (selectedTransport?.transportKind !== "protomux-rpc" || selectedTransport?.contactSeam !== "hyperdht_direct_peer") {
    checks.push("direct-contact-seam:missing");
  }
  const transportEvidence = collectTransportEvidence(evidence);
  if (transportEvidence.distributedReadinessClaimed) {
    checks.push("distributed-readiness-claim:blocked");
  }
  const capabilityDescriptor = isRecord(evidence.capabilityDescriptor) ? evidence.capabilityDescriptor : undefined;
  const capabilityAdvertisement = isRecord(evidence.capabilityAdvertisement) ? evidence.capabilityAdvertisement : undefined;
  const capabilityEvidence = collectCapabilityEvidence(evidence);
  if (capabilityAdvertisement) {
    if (evidence.capabilitiesRequestEncoding !== "@mesh-contact/participant-capabilities-request") {
      checks.push("capability-advertisement:request-encoding-mismatch");
    }
    if (evidence.capabilitiesResponseEncoding !== "@mesh-contact/participant-capabilities-response") {
      checks.push("capability-advertisement:response-encoding-mismatch");
    }
    if (evidence.capabilitiesDispatchCommand !== "@mesh-contact/participant-capabilities-get") {
      checks.push("capability-advertisement:dispatch-command-mismatch");
    }
    if (capabilityAdvertisement.protocolFamily !== "mesh-contact-proof") {
      checks.push("capability-advertisement:protocol-family-mismatch");
    }
    if (capabilityAdvertisement.protocolSchema !== MESH_CONTACT_PROOF_EVIDENCE_SCHEMA) {
      checks.push("capability-advertisement:protocol-schema-mismatch");
    }
    if (advertisedCapabilities(evidence).length < 1) {
      checks.push("capability-advertisement:missing-capabilities");
    }
  }
  if (capabilityDescriptor || capabilityAdvertisement) {
    if (capabilityEvidence.capability !== sourceProfile.expectedCapability) {
      checks.push("capability-descriptor:capability-mismatch");
    }
    if (capabilityEvidence.methodName !== evidence.operation) checks.push("capability-descriptor:method-mismatch");
    if (capabilityEvidence.ownerRepo !== sourceProfile.expectedOwnerRepo) {
      checks.push("capability-descriptor:owner-mismatch");
    }
    if (capabilityEvidence.proofScope !== sourceProfile.expectedProofScope) {
      checks.push("capability-descriptor:scope-mismatch");
    }
    if (capabilityEvidence.transportKind !== "protomux-rpc") checks.push("capability-descriptor:transport-mismatch");
    if (capabilityEvidence.contactSeam !== "hyperdht_direct_peer") checks.push("capability-descriptor:seam-mismatch");
    if (!capabilityEvidence.localLayerDefault) checks.push("capability-descriptor:local-layer-default-missing");
    if (capabilityEvidence.meshLayerDefault) checks.push("capability-descriptor:mesh-layer-overclaim");
    if (capabilityEvidence.discoveryRequired) checks.push("capability-descriptor:discovery-overclaim");
    if (!capabilityEvidence.participantContact) checks.push("capability-descriptor:participant-contact-missing");
  }
  if (UNSAFE_KEYS.some((key) => evidence[key] === true)) {
    checks.push("unsafe-claim:blocked");
  }
  return checks;
}

function determineStatus(
  checks: string[],
  parseableJsonObject: boolean,
  evidence: JsonRecord | undefined,
): MeshContactProofEvidenceStatus {
  if (!parseableJsonObject) return "mesh-contact-proof-malformed-evidence";
  if (checks.some((check) => check.endsWith(":blocked"))) return "mesh-contact-proof-guardrail-blocked";
  if (checks.length > 0) return "mesh-contact-proof-incomplete-evidence";
  if (evidence?.contactSucceeded !== true) return "mesh-contact-proof-failed-evidence";
  return "mesh-contact-proof-valid-evidence";
}

function buildBoundary(): MeshContactProofEvidenceBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    meshRuntimeFetched: false,
    meshCalled: false,
    meshMutated: false,
    performsContact: false,
    claimsCausalTruth: false,
    acceptsCanonicalBranch: false,
    writesContinuityRecords: false,
    claimsDistributedReadiness: false,
    claimsMeshCompletion: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: MeshContactProofEvidenceStatus): string[] {
  const warnings = [
    "mesh-contact-proof-is-adjacent-source-evidence",
    "direct-contact-proof-is-not-causal-truth",
    "direct-contact-proof-is-not-distributed-readiness",
  ];
  if (status === "mesh-contact-proof-failed-evidence") {
    warnings.push("source-contact-attempt-did-not-succeed");
  }
  if (status !== "mesh-contact-proof-valid-evidence") {
    warnings.push("mesh-contact-proof-needs-operator-review");
  }
  return warnings;
}

function buildRejections(checks: string[]): string[] {
  return checks.filter((check) =>
    check.includes(":malformed") ||
    check.includes(":missing") ||
    check.includes(":blocked") ||
    check.includes(":mismatch") ||
    check.startsWith("capability-descriptor:") ||
    check.startsWith("required-envelope:"),
  );
}

function createMeshContactProofEvidenceArtifactId(input: {
  emittedAt: string;
  requestId?: string;
  responseId?: string;
  sourcePath?: string;
}): string {
  const hash = createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex")
    .slice(0, 16);
  return `causal-mesh-contact-proof-evidence:${hash}`;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function advertisedCapabilities(evidence: JsonRecord | undefined): JsonRecord[] {
  const advertisement = isRecord(evidence?.capabilityAdvertisement) ? evidence.capabilityAdvertisement : undefined;
  return Array.isArray(advertisement?.capabilities)
    ? advertisement.capabilities.filter(isRecord)
    : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertEqual<T>(actual: unknown, expected: T, label: string): asserts actual is T {
  if (actual !== expected) {
    throw new Error(`${label} must be ${String(expected)}`);
  }
}
