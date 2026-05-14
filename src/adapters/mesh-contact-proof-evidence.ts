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
  classificationOnly: true;
  meshOwnsSourceSchema: true;
  causalOwnsEvidenceArtifact: true;
}

export interface MeshContactProofEvidenceArtifact {
  artifactKind: typeof CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-v0-2";
    sourceArtifactKind: typeof MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND;
    sourceSchema: typeof MESH_CONTACT_PROOF_EVIDENCE_SCHEMA;
    sourcePath?: string;
  };
  contactRefs: MeshContactProofRefs;
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
  const checks = validateEvidence(evidence, input.parseableJsonObject);
  const status = determineStatus(checks, input.parseableJsonObject, evidence);
  const contactRefs = collectContactRefs(evidence, input.sourcePath);
  const transportEvidence = collectTransportEvidence(evidence);
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
      sourceRepo: "mesh-v0-2",
      sourceArtifactKind: MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND,
      sourceSchema: MESH_CONTACT_PROOF_EVIDENCE_SCHEMA,
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    contactRefs,
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
      classificationOnly: true,
      meshOwnsSourceSchema: true,
      causalOwnsEvidenceArtifact: true,
    },
    warnings: buildWarnings(status),
    rejections: buildRejections(checks),
  };
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

function validateEvidence(evidence: JsonRecord | undefined, parseableJsonObject: boolean): string[] {
  if (!parseableJsonObject || !evidence) return ["parseable-json-object:malformed"];
  const checks: string[] = [];
  for (const key of REQUIRED_KEYS) {
    if (key === "selectedTransport" || key === "readinessEvidence") {
      if (!isRecord(evidence[key])) checks.push(`required-envelope:${key}`);
      continue;
    }
    if (!stringValue(evidence[key])) checks.push(`required-envelope:${key}`);
  }
  if (evidence.artifactKind !== MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND) {
    checks.push("source-artifact-kind:mismatch");
  }
  if (evidence.schema !== MESH_CONTACT_PROOF_EVIDENCE_SCHEMA) {
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
