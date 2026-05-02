import { createHash } from "node:crypto";

export const CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA =
  "causal-substrate/adjacent-review-evidence/v1" as const;

export const CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_ADJACENT_REVIEW_EVIDENCE_ARTIFACT_KIND =
  "causal-adjacent-review-evidence" as const;

export const EDGE_PHASE_116A_CAUSAL_REVIEW_PACKET_FIXTURE_KIND =
  "edge-phase-116a-causal-continuity-adjacent-review-packet" as const;

export const EDGE_PHASE_116A_STOP_GO_DECISION =
  "go_for_causal_substrate_repo_review" as const;

export const EDGE_PHASE_116A_STATIC_FIXTURE_PATH =
  "test/fixtures/edge/phase-116a-causal-continuity-adjacent-review-packet-fixture.json" as const;

export type CausalAdjacentReviewStatus =
  | "review-evidence-emitted"
  | "review-only-valid-fixture"
  | "review-only-incomplete-fixture"
  | "review-only-malformed-fixture"
  | "review-only-guardrail-blocked";

export type CausalAdjacentReviewCheckStatus =
  | "present"
  | "missing"
  | "malformed"
  | "preserved-as-reference"
  | "out-of-scope"
  | "blocked-by-guardrail"
  | "not-evaluated";

export interface CausalAdjacentReviewBoundary {
  staticInputOnly: true;
  reviewOnly: true;
  evidenceOnly: true;
  edgeRuntimeFetched: false;
  edgeCalled: false;
  edgeMutated: false;
  edgePacketAcceptedAsSchema: false;
  claimsCausalTruth: false;
  acceptsCanonicalBranch: false;
  settlesLineage: false;
  settlesReality: false;
  replaysEvents: false;
  resolvesCausalConflicts: false;
  claimsProductionProof: false;
  claimsMeshTruth: false;
  grantsAdjacentAcceptance: false;
  publishesToMesh: false;
}

export interface CausalAdjacentReviewSourceFixture {
  path: string;
  fixtureKind: typeof EDGE_PHASE_116A_CAUSAL_REVIEW_PACKET_FIXTURE_KIND;
  sourceRepo?: "mesh-ecology-edge";
  copiedFrom?: string;
  staticCopyOnly: true;
}

export interface CausalAdjacentReviewEdgePacketRefs {
  fixtureId?: string;
  fixtureScope?: string;
  targetRepo?: string;
  targetSurface?: string;
  seamId?: string;
  ecosystemSeamId?: string;
  packetRef?: string;
  packetSetRef?: string;
  packetId?: string;
  packetSetId?: string;
  sourceContractRef?: string;
  sourceContractSetRef?: string;
  sourceLedgerRef?: string;
  sourceReadinessRollupRef?: string;
  stopGoDecision?: string;
}

export type CausalAdjacentReviewCorrelationRefs = Record<string, string | string[]>;

export interface CausalAdjacentReviewCheck {
  checkId: string;
  status: CausalAdjacentReviewCheckStatus;
  summary: string;
  refs: string[];
}

export interface CausalAdjacentReviewValidation {
  status: CausalAdjacentReviewStatus;
  parseableJsonObject: boolean;
  requiredStaticEnvelopePresent: boolean;
  stopGoDecisionAcceptedForReview: boolean;
  correlationRefsPreservedAsStringsOrArrays: boolean;
  unknownFieldsTreatedAsInertPacketData: true;
  packetContentTreatedAsNonExecutableReviewText: true;
  checks: CausalAdjacentReviewCheck[];
}

export interface CausalAdjacentReviewFinding {
  findingId: string;
  status: CausalAdjacentReviewCheckStatus;
  summary: string;
  refs: string[];
}

export interface CausalAdjacentReviewEdgeImportClassification {
  seamId: "causal_continuity";
  evidenceKind: "causal_continuity_edge_packet_review_evidence";
  edgeExpectedArtifactKind: "causal_continuity_edge_packet_review_evidence";
  classificationOnly: true;
  edgeOwnsSchema: false;
}

export interface CausalAdjacentReviewEvidenceArtifact {
  artifactKind: typeof CAUSAL_ADJACENT_REVIEW_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  sourceFixture: CausalAdjacentReviewSourceFixture;
  edgePacketRefs: CausalAdjacentReviewEdgePacketRefs;
  boundary: CausalAdjacentReviewBoundary;
  validation: CausalAdjacentReviewValidation;
  reviewStatus: CausalAdjacentReviewStatus;
  preservedCorrelationRefs: CausalAdjacentReviewCorrelationRefs;
  edgeImportClassification: CausalAdjacentReviewEdgeImportClassification;
  causalFindings: CausalAdjacentReviewFinding[];
  warnings: string[];
  rejections: string[];
}

export interface BuildCausalAdjacentReviewEvidenceInput {
  fixture: unknown;
  emittedAt: string;
  artifactId?: string;
  sourceFixturePath?: string;
  copiedFrom?: string;
}

type JsonRecord = Record<string, unknown>;

const REQUIRED_ENVELOPE_KEYS = [
  "fixtureId",
  "packetRef",
  "packetSetRef",
  "targetRepo",
  "targetSurface",
  "reviewChecklist",
  "expectedCausalEvidenceResponseShape",
  "causalWordingGuardrails",
  "stopGoDecision",
] as const;

const ACTIVE_ACTION_FLAG_KEYS = [
  "callsAdjacentRepo",
  "callsTool",
  "executesAction",
  "schedulesWork",
  "activatesPlatform",
  "publishesToMesh",
  "admitsWriter",
  "grantsAuthority",
  "infersAdjacentTruth",
  "infersMeshParticipation",
  "replayAuthorized",
  "eventSourcingAuthorityClaimed",
  "canonicalBranchAccepted",
  "causalTruthClaimed",
  "lineageSettled",
  "realitySettled",
  "productionProofClaimed",
  "meshTruthClaimed",
] as const;

const NEGATED_GUARDRAIL_KEYS = [
  "fixtureIsNotAcceptedSchema",
  "fixtureIsNotAdjacentTodo",
  "fixtureIsNotExecutionInstruction",
  "fixtureIsNotReplayInstruction",
  "noExecutionAuthorized",
  "noProductionProofClaimed",
  "noSchedulerRunnerLiveDiscoveryOrMeshPublication",
] as const;

export function buildCausalAdjacentReviewEvidenceArtifact(
  input: BuildCausalAdjacentReviewEvidenceInput,
): CausalAdjacentReviewEvidenceArtifact {
  return buildArtifactFromParsedFixture({
    ...input,
    parsedFixture: input.fixture,
    parseableJsonObject: isRecord(input.fixture),
  });
}

export function buildCausalAdjacentReviewEvidenceArtifactFromJson(
  input: Omit<BuildCausalAdjacentReviewEvidenceInput, "fixture"> & { fixtureJson: string },
): CausalAdjacentReviewEvidenceArtifact {
  try {
    const fixture = JSON.parse(input.fixtureJson) as unknown;
    return buildArtifactFromParsedFixture({
      ...input,
      parsedFixture: fixture,
      parseableJsonObject: isRecord(fixture),
    });
  } catch {
    return buildArtifactFromParsedFixture({
      ...input,
      parsedFixture: undefined,
      parseableJsonObject: false,
    });
  }
}

export function assertCausalAdjacentReviewEvidenceArtifact(
  value: unknown,
): asserts value is CausalAdjacentReviewEvidenceArtifact {
  const candidate = assertObject(value, "causal adjacent review evidence artifact");
  assertEqual(candidate.artifactKind, CAUSAL_ADJACENT_REVIEW_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA, "schema");
  assertEqual(
    candidate.schemaVersion,
    CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA_VERSION,
    "schemaVersion",
  );
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.staticInputOnly, true, "boundary.staticInputOnly");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.edgeRuntimeFetched, false, "boundary.edgeRuntimeFetched");
  assertEqual(boundary.edgeCalled, false, "boundary.edgeCalled");
  assertEqual(boundary.edgeMutated, false, "boundary.edgeMutated");
  assertEqual(boundary.edgePacketAcceptedAsSchema, false, "boundary.edgePacketAcceptedAsSchema");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
  assertEqual(boundary.acceptsCanonicalBranch, false, "boundary.acceptsCanonicalBranch");
  assertEqual(boundary.settlesLineage, false, "boundary.settlesLineage");
  assertEqual(boundary.settlesReality, false, "boundary.settlesReality");
  assertEqual(boundary.replaysEvents, false, "boundary.replaysEvents");
  assertEqual(boundary.resolvesCausalConflicts, false, "boundary.resolvesCausalConflicts");
  assertEqual(boundary.claimsProductionProof, false, "boundary.claimsProductionProof");
  assertEqual(boundary.claimsMeshTruth, false, "boundary.claimsMeshTruth");
  assertEqual(boundary.grantsAdjacentAcceptance, false, "boundary.grantsAdjacentAcceptance");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  const edgeImportClassification = assertObject(
    candidate.edgeImportClassification,
    "edgeImportClassification",
  );
  assertEqual(edgeImportClassification.seamId, "causal_continuity", "edgeImportClassification.seamId");
  assertEqual(
    edgeImportClassification.evidenceKind,
    "causal_continuity_edge_packet_review_evidence",
    "edgeImportClassification.evidenceKind",
  );
  assertEqual(
    edgeImportClassification.edgeExpectedArtifactKind,
    "causal_continuity_edge_packet_review_evidence",
    "edgeImportClassification.edgeExpectedArtifactKind",
  );
  assertEqual(
    edgeImportClassification.classificationOnly,
    true,
    "edgeImportClassification.classificationOnly",
  );
  assertEqual(edgeImportClassification.edgeOwnsSchema, false, "edgeImportClassification.edgeOwnsSchema");
}

function buildArtifactFromParsedFixture(input: {
  parsedFixture: unknown;
  parseableJsonObject: boolean;
  emittedAt: string;
  artifactId?: string;
  sourceFixturePath?: string;
  copiedFrom?: string;
}): CausalAdjacentReviewEvidenceArtifact {
  const fixture = isRecord(input.parsedFixture) ? input.parsedFixture : undefined;
  const checks = validateFixture(fixture, input.parseableJsonObject, input.sourceFixturePath);
  const validationStatus = determineValidationStatus(checks, input.parseableJsonObject);
  const edgePacketRefs = collectEdgePacketRefs(fixture);
  const preservedCorrelationRefs = collectCorrelationRefs(fixture);
  const reviewStatus =
    validationStatus === "review-only-valid-fixture"
      ? "review-evidence-emitted"
      : validationStatus;
  const warnings = buildWarnings(checks, validationStatus);
  const rejections = buildRejections(validationStatus, checks);
  const sourceFixture: CausalAdjacentReviewSourceFixture = {
    path: input.sourceFixturePath ?? EDGE_PHASE_116A_STATIC_FIXTURE_PATH,
    fixtureKind: EDGE_PHASE_116A_CAUSAL_REVIEW_PACKET_FIXTURE_KIND,
    staticCopyOnly: true,
    ...(input.copiedFrom ? { copiedFrom: input.copiedFrom } : {}),
    sourceRepo: "mesh-ecology-edge",
  };
  const artifactId =
    input.artifactId ??
    createReviewEvidenceArtifactId({
      emittedAt: input.emittedAt,
      sourceFixturePath: sourceFixture.path,
      ...(edgePacketRefs.packetRef ? { packetRef: edgePacketRefs.packetRef } : {}),
      ...(edgePacketRefs.fixtureId ? { fixtureId: edgePacketRefs.fixtureId } : {}),
    });

  return {
    artifactKind: CAUSAL_ADJACENT_REVIEW_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    sourceFixture,
    edgePacketRefs,
    boundary: buildBoundary(),
    validation: {
      status: validationStatus,
      parseableJsonObject: input.parseableJsonObject && fixture !== undefined,
      requiredStaticEnvelopePresent: checks
        .filter((check) => check.checkId.startsWith("required-static-envelope:"))
        .every((check) => check.status === "present"),
      stopGoDecisionAcceptedForReview:
        findCheck(checks, "stop-go-decision")?.status === "present",
      correlationRefsPreservedAsStringsOrArrays:
        findCheck(checks, "correlation-refs")?.status === "preserved-as-reference",
      unknownFieldsTreatedAsInertPacketData: true,
      packetContentTreatedAsNonExecutableReviewText: true,
      checks,
    },
    reviewStatus,
    preservedCorrelationRefs,
    edgeImportClassification: {
      seamId: "causal_continuity",
      evidenceKind: "causal_continuity_edge_packet_review_evidence",
      edgeExpectedArtifactKind: "causal_continuity_edge_packet_review_evidence",
      classificationOnly: true,
      edgeOwnsSchema: false,
    },
    causalFindings: buildCausalFindings(checks, validationStatus),
    warnings,
    rejections,
  };
}

function validateFixture(
  fixture: JsonRecord | undefined,
  parseableJsonObject: boolean,
  sourceFixturePath: string | undefined,
): CausalAdjacentReviewCheck[] {
  if (!parseableJsonObject || fixture === undefined) {
    return [
      {
        checkId: "parseable-json-object",
        status: "malformed",
        summary: "Input is not a parseable JSON object.",
        refs: [],
      },
    ];
  }

  const checks: CausalAdjacentReviewCheck[] = [
    {
      checkId: "parseable-json-object",
      status: "present",
      summary: "Fixture is a parseable JSON object.",
      refs: [],
    },
  ];

  for (const key of REQUIRED_ENVELOPE_KEYS) {
    checks.push({
      checkId: `required-static-envelope:${key}`,
      status: isRequiredEnvelopeFieldPresent(fixture, key) ? "present" : "missing",
      summary: `Static review envelope field '${key}' is ${
        isRequiredEnvelopeFieldPresent(fixture, key) ? "present" : "missing"
      }.`,
      refs: [key],
    });
  }

  checks.push({
    checkId: "edge-phase-116a-identity",
    status: identifiesEdgePhase116A(fixture, sourceFixturePath) ? "present" : "missing",
    summary: "Fixture is identified as the static Edge Phase 116A causal review packet.",
    refs: ["fixtureId", "packetRef", sourceFixturePath ?? EDGE_PHASE_116A_STATIC_FIXTURE_PATH],
  });

  checks.push({
    checkId: "static-packet-identity-path-refs",
    status: hasStaticIdentityRefs(fixture) ? "present" : "missing",
    summary: "Fixture carries static packet identity and path/correlation refs.",
    refs: ["fixtureId", "packetRef", "packetSetRef", "targetRepo", "targetSurface"],
  });

  checks.push({
    checkId: "review-checklist",
    status: Array.isArray(fixture.reviewChecklist) && fixture.reviewChecklist.length > 0
      ? "present"
      : "missing",
    summary: "Causal-specific review checklist is present.",
    refs: ["reviewChecklist"],
  });

  checks.push({
    checkId: "expected-causal-owned-response-shape",
    status: isRecord(fixture.expectedCausalEvidenceResponseShape) ? "present" : "missing",
    summary: "Expected causal-owned response shape is present as review input.",
    refs: ["expectedCausalEvidenceResponseShape"],
  });

  checks.push({
    checkId: "causal-wording-guardrails",
    status: isRecord(fixture.causalWordingGuardrails) ? "present" : "missing",
    summary: "Causal wording guardrails are present.",
    refs: ["causalWordingGuardrails"],
  });

  const stopGoDecision = readPath(fixture, ["stopGoDecision", "decision"]);
  checks.push({
    checkId: "stop-go-decision",
    status:
      stopGoDecision === EDGE_PHASE_116A_STOP_GO_DECISION
        ? "present"
        : stopGoDecision === undefined
          ? "missing"
          : "blocked-by-guardrail",
    summary: "Stop/go decision is go_for_causal_substrate_repo_review.",
    refs: ["stopGoDecision.decision"],
  });

  checks.push({
    checkId: "correlation-refs",
    status: correlationRefsAreStringsOrStringArrays(fixture)
      ? "preserved-as-reference"
      : "malformed",
    summary: "Correlation refs are preserved only as strings or arrays of strings.",
    refs: Object.keys(collectCorrelationRefs(fixture)),
  });

  const commandLikeContentStatus = commandLikeContentCheckStatus(fixture);
  checks.push({
    checkId: "command-todo-replay-content",
    status: commandLikeContentStatus,
    summary:
      commandLikeContentStatus === "blocked-by-guardrail"
        ? "Command, TODO, or replay-like content is blocked as non-executable review text."
        : "Command, TODO, or replay-like content is out of scope and inert.",
    refs: ["unsupportedActions", "causalWordingGuardrails.avoidWording"],
  });

  checks.push({
    checkId: "unknown-fields-inert",
    status: "out-of-scope",
    summary: "Unknown packet fields are retained only as inert review packet data.",
    refs: [],
  });

  return checks;
}

function determineValidationStatus(
  checks: CausalAdjacentReviewCheck[],
  parseableJsonObject: boolean,
): CausalAdjacentReviewStatus {
  if (!parseableJsonObject || checks.some((check) => check.status === "malformed")) {
    return checks.some((check) => check.checkId === "correlation-refs" && check.status === "malformed")
      ? "review-only-incomplete-fixture"
      : "review-only-malformed-fixture";
  }
  if (
    checks.some(
      (check) =>
        check.status === "blocked-by-guardrail" &&
        (check.checkId === "stop-go-decision" || check.checkId === "command-todo-replay-content"),
    )
  ) {
    return "review-only-guardrail-blocked";
  }
  if (
    checks.some(
      (check) =>
        check.status === "missing" &&
        (check.checkId.startsWith("required-static-envelope:") ||
          check.checkId === "review-checklist" ||
          check.checkId === "expected-causal-owned-response-shape" ||
          check.checkId === "causal-wording-guardrails" ||
          check.checkId === "edge-phase-116a-identity" ||
          check.checkId === "static-packet-identity-path-refs"),
    )
  ) {
    return "review-only-incomplete-fixture";
  }
  return "review-only-valid-fixture";
}

function buildBoundary(): CausalAdjacentReviewBoundary {
  return {
    staticInputOnly: true,
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    edgePacketAcceptedAsSchema: false,
    claimsCausalTruth: false,
    acceptsCanonicalBranch: false,
    settlesLineage: false,
    settlesReality: false,
    replaysEvents: false,
    resolvesCausalConflicts: false,
    claimsProductionProof: false,
    claimsMeshTruth: false,
    grantsAdjacentAcceptance: false,
    publishesToMesh: false,
  };
}

function collectEdgePacketRefs(fixture: JsonRecord | undefined): CausalAdjacentReviewEdgePacketRefs {
  if (!fixture) {
    return {};
  }
  const packet = firstRecord(readPath(fixture, ["packetSet", "packets"]));
  const contractSnapshot = isRecord(packet?.contractSnapshot) ? packet.contractSnapshot : undefined;
  const refs: CausalAdjacentReviewEdgePacketRefs = {};
  copyEdgePacketStringRef(refs, "fixtureId", fixture.fixtureId);
  copyEdgePacketStringRef(refs, "fixtureScope", fixture.fixtureScope);
  copyEdgePacketStringRef(refs, "targetRepo", fixture.targetRepo);
  copyEdgePacketStringRef(refs, "targetSurface", fixture.targetSurface);
  copyEdgePacketStringRef(refs, "seamId", fixture.seamId);
  copyEdgePacketStringRef(refs, "ecosystemSeamId", fixture.ecosystemSeamId);
  copyEdgePacketStringRef(refs, "packetRef", fixture.packetRef);
  copyEdgePacketStringRef(refs, "packetSetRef", fixture.packetSetRef);
  copyEdgePacketStringRef(refs, "packetId", packet?.packetId);
  copyEdgePacketStringRef(refs, "packetSetId", readPath(fixture, ["packetSet", "packetSetId"]));
  copyEdgePacketStringRef(refs, "sourceContractRef", packet?.sourceContractRef ?? contractSnapshot?.contractId);
  copyEdgePacketStringRef(refs, "sourceContractSetRef", packet?.sourceContractSetRef);
  copyEdgePacketStringRef(refs, "sourceLedgerRef", packet?.sourceLedgerRef);
  copyEdgePacketStringRef(refs, "sourceReadinessRollupRef", packet?.sourceReadinessRollupRef);
  copyEdgePacketStringRef(refs, "stopGoDecision", readPath(fixture, ["stopGoDecision", "decision"]));
  return refs;
}

function collectCorrelationRefs(fixture: JsonRecord | undefined): CausalAdjacentReviewCorrelationRefs {
  if (!fixture) {
    return {};
  }
  const refs: CausalAdjacentReviewCorrelationRefs = {};
  const expectedShape = isRecord(fixture.expectedCausalEvidenceResponseShape)
    ? fixture.expectedCausalEvidenceResponseShape
    : undefined;
  const correlationRefs = isRecord(expectedShape?.correlationRefs)
    ? expectedShape.correlationRefs
    : undefined;

  for (const [key, value] of Object.entries(correlationRefs ?? {})) {
    if (typeof value === "string") {
      refs[key] = value;
    } else if (isStringArray(value)) {
      refs[key] = [...value];
    }
  }

  const directRefs = collectEdgePacketRefs(fixture);
  for (const [key, value] of Object.entries(directRefs)) {
    if (value !== undefined && refs[key] === undefined) {
      refs[key] = value;
    }
  }

  copyStringArrayRef(refs, "sourceEvidenceRefs", expectedShape?.sourceEvidenceRefs);
  copyStringArrayRef(refs, "sourceWorkPacketRefs", expectedShape?.sourceWorkPacketRefs);
  copyStringArrayRef(refs, "sourceNextActionRefs", expectedShape?.sourceNextActionRefs);
  copyStringArrayRef(refs, "sourceLedgerEventRefs", expectedShape?.sourceLedgerEventRefs);
  copyStringArrayRef(refs, "sourceLedgerDeltaRefs", expectedShape?.sourceLedgerDeltaRefs);
  return refs;
}

function buildWarnings(
  checks: CausalAdjacentReviewCheck[],
  status: CausalAdjacentReviewStatus,
): string[] {
  const warnings = [
    "static-fixture-only",
    "review-evidence-only",
    "edge-packet-not-accepted-as-causal-schema",
    "no-adjacent-acceptance-from-packet-presence",
    "edge-import-classification-only",
  ];
  if (checks.some((check) => check.checkId === "command-todo-replay-content")) {
    warnings.push("command-todo-replay-like-content-treated-as-inert-review-text");
  }
  if (status !== "review-only-valid-fixture") {
    warnings.push(status);
  }
  return warnings;
}

function buildRejections(
  status: CausalAdjacentReviewStatus,
  checks: CausalAdjacentReviewCheck[],
): string[] {
  if (status === "review-only-valid-fixture") {
    return [];
  }
  return checks
    .filter((check) => check.status === "missing" || check.status === "malformed" || check.status === "blocked-by-guardrail")
    .map((check) => `${check.checkId}:${check.status}`);
}

function buildCausalFindings(
  checks: CausalAdjacentReviewCheck[],
  validationStatus: CausalAdjacentReviewStatus,
): CausalAdjacentReviewFinding[] {
  const findings: CausalAdjacentReviewFinding[] = [
    {
      findingId: "static-review-only",
      status: validationStatus === "review-only-valid-fixture" ? "present" : "not-evaluated",
      summary: "Causal-substrate consumed the packet only as static review input.",
      refs: [EDGE_PHASE_116A_STATIC_FIXTURE_PATH],
    },
    {
      findingId: "no-causal-authority-granted",
      status: "present",
      summary:
        "The review evidence does not claim causal truth, canonical branch acceptance, lineage settlement, reality settlement, replay authority, production proof, or mesh truth.",
      refs: [],
    },
  ];

  for (const check of checks) {
    if (
      check.checkId === "command-todo-replay-content" ||
      check.checkId === "correlation-refs" ||
      check.checkId === "stop-go-decision"
    ) {
      findings.push({
        findingId: check.checkId,
        status: check.status,
        summary: check.summary,
        refs: [...check.refs],
      });
    }
  }
  return findings;
}

function commandLikeContentCheckStatus(fixture: JsonRecord): CausalAdjacentReviewCheckStatus {
  for (const key of ACTIVE_ACTION_FLAG_KEYS) {
    if (readBoolean(fixture, key) === true) {
      return "blocked-by-guardrail";
    }
  }
  for (const key of NEGATED_GUARDRAIL_KEYS) {
    if (readBoolean(fixture, key) === false) {
      return "blocked-by-guardrail";
    }
  }
  if (containsActiveInstructionField(fixture)) {
    return "blocked-by-guardrail";
  }
  return "out-of-scope";
}

function containsActiveInstructionField(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((entry) => containsActiveInstructionField(entry));
  }
  if (!isRecord(value)) {
    return false;
  }
  for (const [key, child] of Object.entries(value)) {
    if (/^(todo|todos|command|commands|replayInstruction|executionInstruction)$/i.test(key)) {
      return true;
    }
    if (containsActiveInstructionField(child)) {
      return true;
    }
  }
  return false;
}

function identifiesEdgePhase116A(fixture: JsonRecord, sourceFixturePath: string | undefined): boolean {
  const path = sourceFixturePath ?? EDGE_PHASE_116A_STATIC_FIXTURE_PATH;
  return (
    /phase-116a/i.test(path) &&
    fixture.targetRepo === "causal-substrate" &&
    fixture.targetSurface === "causal_continuity" &&
    JSON.stringify(fixture).includes("phase-116")
  );
}

function hasStaticIdentityRefs(fixture: JsonRecord): boolean {
  return (
    typeof fixture.fixtureId === "string" &&
    typeof fixture.packetRef === "string" &&
    typeof fixture.packetSetRef === "string" &&
    fixture.targetRepo === "causal-substrate" &&
    fixture.targetSurface === "causal_continuity"
  );
}

function isRequiredEnvelopeFieldPresent(fixture: JsonRecord, key: string): boolean {
  const value = fixture[key];
  if (key === "reviewChecklist") {
    return Array.isArray(value) && value.length > 0;
  }
  if (
    key === "expectedCausalEvidenceResponseShape" ||
    key === "causalWordingGuardrails" ||
    key === "stopGoDecision"
  ) {
    return isRecord(value);
  }
  return typeof value === "string" && value.length > 0;
}

function correlationRefsAreStringsOrStringArrays(fixture: JsonRecord): boolean {
  const expectedShape = isRecord(fixture.expectedCausalEvidenceResponseShape)
    ? fixture.expectedCausalEvidenceResponseShape
    : undefined;
  const correlationRefs = isRecord(expectedShape?.correlationRefs)
    ? expectedShape.correlationRefs
    : undefined;
  if (!correlationRefs) {
    return false;
  }
  return Object.values(correlationRefs).every(
    (value) => value === null || typeof value === "string" || isStringArray(value),
  );
}

function createReviewEvidenceArtifactId(input: {
  emittedAt: string;
  sourceFixturePath: string;
  packetRef?: string;
  fixtureId?: string;
}): string {
  const hash = createHash("sha256")
    .update(input.emittedAt)
    .update("|")
    .update(input.sourceFixturePath)
    .update("|")
    .update(input.packetRef ?? "")
    .update("|")
    .update(input.fixtureId ?? "")
    .digest("hex")
    .slice(0, 16);
  return `causal-adjacent-review-evidence-${hash}`;
}

function firstRecord(value: unknown): JsonRecord | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const first = value[0];
  return isRecord(first) ? first : undefined;
}

function findCheck(
  checks: CausalAdjacentReviewCheck[],
  checkId: string,
): CausalAdjacentReviewCheck | undefined {
  return checks.find((check) => check.checkId === checkId);
}

function copyEdgePacketStringRef(
  target: CausalAdjacentReviewEdgePacketRefs,
  key: keyof CausalAdjacentReviewEdgePacketRefs,
  value: unknown,
): void {
  if (typeof value === "string") {
    target[key] = value;
  }
}

function copyStringArrayRef(
  target: CausalAdjacentReviewCorrelationRefs,
  key: string,
  value: unknown,
): void {
  if (isStringArray(value) && target[key] === undefined) {
    target[key] = [...value];
  }
}

function readBoolean(record: JsonRecord, key: string): boolean | undefined {
  const value = record[key];
  return typeof value === "boolean" ? value : undefined;
}

function readPath(record: JsonRecord, path: string[]): unknown {
  let current: unknown = record;
  for (const part of path) {
    if (!isRecord(current)) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`${label} must be a string`);
  }
}

function assertEqual<T>(actual: unknown, expected: T, label: string): asserts actual is T {
  if (actual !== expected) {
    throw new TypeError(`${label} must be ${String(expected)}`);
  }
}
