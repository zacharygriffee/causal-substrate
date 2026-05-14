import { createHash } from "node:crypto";

export const CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA =
  "causal-substrate/edge-contact-evidence/v1" as const;

export const CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-contact-evidence" as const;

export const EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND = "edge_contact_evidence" as const;

export type EdgeContactEvidenceStatus =
  | "edge-contact-evidence-emitted"
  | "edge-contact-valid-evidence"
  | "edge-contact-incomplete-evidence"
  | "edge-contact-malformed-evidence"
  | "edge-contact-guardrail-blocked";

export interface EdgeContactEvidenceBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  edgeRuntimeFetched: false;
  edgeCalled: false;
  edgeMutated: false;
  performsContact: false;
  claimsCausalTruth: false;
  acceptsCanonicalBranch: false;
  writesContinuityRecords: false;
  claimsDistributedReadiness: false;
  publishesToMesh: false;
}

export interface EdgeContactRefs {
  operationId?: string;
  targetId?: string;
  participant?: string;
  sourcePath?: string;
}

export interface EdgeContactTransportEvidence {
  selectedTransportKind?: string;
  selectedContactSeam?: string;
  selectedTransportRole?: string;
  selectedTransportScope?: string;
  scaffoldTransport: boolean;
  compatibilityAliasUsed: boolean;
  fallbackTransportKinds: string[];
  contactAttemptedBySource: boolean;
  contactSucceededBySource: boolean;
  readinessScope?: string;
  distributedReadinessClaimed: boolean;
}

export interface EdgeContactEvidenceValidation {
  status: EdgeContactEvidenceStatus;
  parseableJsonObject: boolean;
  requiredEnvelopePresent: boolean;
  transportPosturePresent: boolean;
  distributedReadinessBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  checks: string[];
}

export interface EdgeContactEvidenceImportClassification {
  seamId: "edge_contact_evidence";
  evidenceKind: "edge_contact_evidence";
  edgeExpectedArtifactKind: typeof EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND;
  classificationOnly: true;
  edgeOwnsSchema: true;
  causalOwnsEvidenceArtifact: true;
}

export interface EdgeContactEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceArtifactKind: typeof EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND;
    sourcePath?: string;
  };
  contactRefs: EdgeContactRefs;
  transportEvidence: EdgeContactTransportEvidence;
  boundary: EdgeContactEvidenceBoundary;
  validation: EdgeContactEvidenceValidation;
  reviewStatus: EdgeContactEvidenceStatus;
  importClassification: EdgeContactEvidenceImportClassification;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeContactEvidenceInput {
  evidence: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

const REQUIRED_KEYS = ["artifactKind", "operationId", "targetId", "participant", "selectedTransport"] as const;

const UNSAFE_KEYS = [
  "claimsCausalTruth",
  "causalTruthClaimed",
  "canonicalBranchAccepted",
  "writesContinuityRecords",
  "edgeAuthorityGranted",
  "meshTruthClaimed",
  "completionClaimed",
  "publishesToMesh",
] as const;

export function buildEdgeContactEvidenceArtifact(
  input: BuildEdgeContactEvidenceInput,
): EdgeContactEvidenceArtifact {
  return buildArtifactFromParsedEvidence({
    ...input,
    parsedEvidence: input.evidence,
    parseableJsonObject: isRecord(input.evidence),
  });
}

export function buildEdgeContactEvidenceArtifactFromJson(
  input: Omit<BuildEdgeContactEvidenceInput, "evidence"> & { evidenceJson: string },
): EdgeContactEvidenceArtifact {
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

export function assertEdgeContactEvidenceArtifact(
  value: unknown,
): asserts value is EdgeContactEvidenceArtifact {
  const candidate = assertObject(value, "edge contact evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.edgeRuntimeFetched, false, "boundary.edgeRuntimeFetched");
  assertEqual(boundary.edgeCalled, false, "boundary.edgeCalled");
  assertEqual(boundary.edgeMutated, false, "boundary.edgeMutated");
  assertEqual(boundary.performsContact, false, "boundary.performsContact");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
  assertEqual(boundary.acceptsCanonicalBranch, false, "boundary.acceptsCanonicalBranch");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  assertEqual(boundary.claimsDistributedReadiness, false, "boundary.claimsDistributedReadiness");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  const classification = assertObject(candidate.importClassification, "importClassification");
  assertEqual(classification.seamId, "edge_contact_evidence", "importClassification.seamId");
  assertEqual(classification.classificationOnly, true, "importClassification.classificationOnly");
  assertEqual(classification.causalOwnsEvidenceArtifact, true, "importClassification.causalOwnsEvidenceArtifact");
}

function buildArtifactFromParsedEvidence(input: {
  parsedEvidence: unknown;
  parseableJsonObject: boolean;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}): EdgeContactEvidenceArtifact {
  const evidence = isRecord(input.parsedEvidence) ? input.parsedEvidence : undefined;
  const checks = validateEvidence(evidence, input.parseableJsonObject);
  const status = determineStatus(checks, input.parseableJsonObject);
  const contactRefs = collectContactRefs(evidence, input.sourcePath);
  const transportEvidence = collectTransportEvidence(evidence);
  const reviewStatus = status === "edge-contact-valid-evidence"
    ? "edge-contact-evidence-emitted"
    : status;
  const artifactIdInput: {
    emittedAt: string;
    operationId?: string;
    targetId?: string;
    sourcePath?: string;
  } = {
    emittedAt: input.emittedAt,
  };
  if (contactRefs.operationId) artifactIdInput.operationId = contactRefs.operationId;
  if (contactRefs.targetId) artifactIdInput.targetId = contactRefs.targetId;
  if (input.sourcePath) artifactIdInput.sourcePath = input.sourcePath;
  const artifactId = input.artifactId ?? createEdgeContactEvidenceArtifactId(artifactIdInput);

  return {
    artifactKind: CAUSAL_EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      sourceArtifactKind: EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND,
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    contactRefs,
    transportEvidence,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableJsonObject: input.parseableJsonObject && evidence !== undefined,
      requiredEnvelopePresent: checks.every((check) => !check.startsWith("required-envelope:")),
      transportPosturePresent: !checks.includes("transport-posture:missing"),
      distributedReadinessBlocked: !checks.includes("distributed-readiness-claim:blocked"),
      unsafeClaimsBlocked: !checks.includes("unsafe-claim:blocked"),
      checks,
    },
    reviewStatus,
    importClassification: {
      seamId: "edge_contact_evidence",
      evidenceKind: "edge_contact_evidence",
      edgeExpectedArtifactKind: EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND,
      classificationOnly: true,
      edgeOwnsSchema: true,
      causalOwnsEvidenceArtifact: true,
    },
    warnings: buildWarnings(status),
    rejections: buildRejections(checks),
  };
}

function collectContactRefs(evidence: JsonRecord | undefined, sourcePath: string | undefined): EdgeContactRefs {
  const refs: EdgeContactRefs = {};
  const operationId = stringValue(evidence?.operationId);
  const targetId = stringValue(evidence?.targetId);
  const participant = stringValue(evidence?.participant);
  if (operationId) refs.operationId = operationId;
  if (targetId) refs.targetId = targetId;
  if (participant) refs.participant = participant;
  if (sourcePath) refs.sourcePath = sourcePath;
  return refs;
}

function collectTransportEvidence(evidence: JsonRecord | undefined): EdgeContactTransportEvidence {
  const selectedTransport = isRecord(evidence?.selectedTransport) ? evidence.selectedTransport : undefined;
  const readinessEvidence = isRecord(evidence?.readinessEvidence) ? evidence.readinessEvidence : undefined;
  const result: EdgeContactTransportEvidence = {
    scaffoldTransport: selectedTransport?.scaffoldTransport === true,
    compatibilityAliasUsed: selectedTransport?.compatibilityAlias === true,
    fallbackTransportKinds: stringArray(evidence?.fallbackTransportKinds),
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
  if (selectedTransportKind) result.selectedTransportKind = selectedTransportKind;
  if (selectedContactSeam) result.selectedContactSeam = selectedContactSeam;
  if (selectedTransportRole) result.selectedTransportRole = selectedTransportRole;
  if (selectedTransportScope) result.selectedTransportScope = selectedTransportScope;
  if (readinessScope) result.readinessScope = readinessScope;
  return result;
}

function validateEvidence(evidence: JsonRecord | undefined, parseableJsonObject: boolean): string[] {
  if (!parseableJsonObject || !evidence) return ["parseable-json-object:malformed"];
  const checks: string[] = [];
  for (const key of REQUIRED_KEYS) {
    if (key === "selectedTransport") {
      if (!isRecord(evidence.selectedTransport)) checks.push("required-envelope:selectedTransport");
      continue;
    }
    if (!stringValue(evidence[key])) checks.push(`required-envelope:${key}`);
  }
  const selectedTransport = isRecord(evidence.selectedTransport) ? evidence.selectedTransport : undefined;
  if (!stringValue(selectedTransport?.transportKind) || !stringValue(selectedTransport?.contactSeam)) {
    checks.push("transport-posture:missing");
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

function determineStatus(checks: string[], parseableJsonObject: boolean): EdgeContactEvidenceStatus {
  if (!parseableJsonObject) return "edge-contact-malformed-evidence";
  if (checks.some((check) => check.endsWith(":blocked"))) return "edge-contact-guardrail-blocked";
  if (checks.length > 0) return "edge-contact-incomplete-evidence";
  return "edge-contact-valid-evidence";
}

function buildBoundary(): EdgeContactEvidenceBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    performsContact: false,
    claimsCausalTruth: false,
    acceptsCanonicalBranch: false,
    writesContinuityRecords: false,
    claimsDistributedReadiness: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeContactEvidenceStatus): string[] {
  const warnings = [
    "edge-contact-evidence-is-adjacent-source-evidence",
    "contact-evidence-is-not-causal-truth",
    "transport-readiness-is-not-distributed-readiness",
  ];
  if (status !== "edge-contact-valid-evidence") {
    warnings.push("contact-evidence-needs-operator-review");
  }
  return warnings;
}

function buildRejections(checks: string[]): string[] {
  return checks.filter((check) =>
    check.includes(":malformed") ||
    check.includes(":missing") ||
    check.includes(":blocked") ||
    check.startsWith("required-envelope:"),
  );
}

function createEdgeContactEvidenceArtifactId(input: {
  emittedAt: string;
  operationId?: string;
  targetId?: string;
  sourcePath?: string;
}): string {
  const hash = createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex")
    .slice(0, 16);
  return `causal-edge-contact-evidence:${hash}`;
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim() !== "").map((item) => item.trim())
    : [];
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
