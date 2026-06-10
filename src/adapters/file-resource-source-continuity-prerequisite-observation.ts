import { createHash } from "node:crypto";

export const CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_PREREQUISITE_OBSERVATION_SCHEMA =
  "causal-substrate/file-resource-source-continuity-prerequisite-observation/v1" as const;

export const CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_PREREQUISITE_OBSERVATION_ARTIFACT_KIND =
  "causal_file_resource_source_continuity_prerequisite_observation" as const;

export type FileResourceSourceContinuityPrerequisiteObservationStatus =
  | "file-resource-source-continuity-prerequisite-observed"
  | "file-resource-source-continuity-prerequisite-blocked";

export interface FileResourceSourceContinuityPrerequisiteObservation {
  artifactKind: typeof CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_PREREQUISITE_OBSERVATION_ARTIFACT_KIND;
  schema: typeof CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_PREREQUISITE_OBSERVATION_SCHEMA;
  schemaVersion: 1;
  observationId: string;
  observationHash: string;
  emittedAt: string;
  proofRung: "local_supplied_material";
  sourcePaths: {
    layerPrerequisitePacket?: string | undefined;
    layerPrerequisiteReadback?: string | undefined;
    edgePrerequisiteVisibility?: string | undefined;
  };
  sourceRefs: {
    layerPrerequisitePacketRef: string | null;
    layerPrerequisitePacketHash: string | null;
    layerPrerequisiteReadbackRef: string | null;
    layerPrerequisiteReadbackHash: string | null;
    edgePrerequisiteVisibilityRef: string | null;
    edgePrerequisiteVisibilityHash: string | null;
    layerFollowupPacketRef: string | null;
    layerFollowupPacketHash: string | null;
    causalCompatibilityObservationRef: string | null;
    causalCompatibilityObservationHash: string | null;
    layerAdmissionCandidateRef: string | null;
    rbcReceiptRef: string | null;
    rbcReceiptHash: string | null;
    edgeOperatorDecisionRef: string | null;
    studioLiftSourceCandidateRef: string | null;
    bytesVisibilityEvidenceRef: string | null;
  };
  status: FileResourceSourceContinuityPrerequisiteObservationStatus;
  classification: "source_continuity_prerequisite_question_ready" | "source_continuity_prerequisite_blocked";
  interpretation: {
    concreteSourceContinuityPrerequisiteObserved: boolean;
    sourceContinuityQuestionPreserved: true;
    viewsDoNotReplaceSourceContinuity: true;
    remainingBlockersPreserved: boolean;
    admissionAppendStillRequiresFutureBoundary: true;
    acceptedSourceContinuityNotCreated: true;
    convergenceNotAttempted: true;
  };
  validation: {
    layerPrerequisitePacketObserved: boolean;
    layerPrerequisiteReadbackObserved: boolean;
    edgePrerequisiteVisibilityObserved: boolean;
    layerPrerequisiteReadbackVerified: boolean;
    edgeVisibilityVerified: boolean;
    noLayerAdmissionClaim: true;
    noAcceptedSourceContinuityClaim: true;
    noCausalContinuityAppendClaim: true;
    noCanonicalHistoryClaim: true;
    noViewAsSourceContinuityClaim: true;
    noAuthorityClaim: true;
    issues: string[];
  };
  boundary: {
    observesLayerPrerequisiteOnly: true;
    opensLayerRuntime: false;
    writesLayerState: false;
    appendsCausalContinuity: false;
    admitsLayerEvidence: false;
    acceptsSourceContinuity: false;
    acceptsCanonicalHistory: false;
    attemptsConvergence: false;
    grantsAuthority: false;
  };
  nonClaims: {
    layerAdmission: false;
    admissionDecisionApplied: false;
    admissionAppendApproved: false;
    acceptedContinuity: false;
    acceptedSourceContinuity: false;
    durableAppend: false;
    causalContinuityAppend: false;
    canonicalAdmission: false;
    canonicalHistory: false;
    convergence: false;
    causalTruth: false;
    viewAsSourceContinuity: false;
    authority: false;
    productionDurability: false;
  };
  nextPressure: string;
}

export function buildFileResourceSourceContinuityPrerequisiteObservation(input: {
  layerPrerequisitePacket?: unknown;
  layerPrerequisiteReadback?: unknown;
  edgePrerequisiteVisibility?: unknown;
  emittedAt: string;
  sourcePaths?: FileResourceSourceContinuityPrerequisiteObservation["sourcePaths"] | undefined;
  observationId?: string | undefined;
}): FileResourceSourceContinuityPrerequisiteObservation {
  const packet = objectOrNull(input.layerPrerequisitePacket);
  const readback = objectOrNull(input.layerPrerequisiteReadback);
  const visibility = objectOrNull(input.edgePrerequisiteVisibility);
  const issues = prerequisiteIssues(packet, readback, visibility);
  const ready = issues.length === 0;
  const status: FileResourceSourceContinuityPrerequisiteObservationStatus = ready
    ? "file-resource-source-continuity-prerequisite-observed"
    : "file-resource-source-continuity-prerequisite-blocked";
  const classification = ready
    ? "source_continuity_prerequisite_question_ready"
    : "source_continuity_prerequisite_blocked";
  const sourceRefs = {
    layerPrerequisitePacketRef: stringValue(packet?.packetRef),
    layerPrerequisitePacketHash: stringValue(packet?.packetHash),
    layerPrerequisiteReadbackRef: stringValue(readback?.readbackRef),
    layerPrerequisiteReadbackHash: stringValue(readback?.readbackHash),
    edgePrerequisiteVisibilityRef: stringValue(visibility?.visibilityRef),
    edgePrerequisiteVisibilityHash: stringValue(visibility?.visibilityHash),
    layerFollowupPacketRef: stringValue(objectOrNull(packet?.sourceRefs)?.layerFollowupPacketRef),
    layerFollowupPacketHash: stringValue(objectOrNull(packet?.sourceRefs)?.layerFollowupPacketHash),
    causalCompatibilityObservationRef: stringValue(objectOrNull(packet?.sourceRefs)?.causalCompatibilityObservationRef),
    causalCompatibilityObservationHash: stringValue(objectOrNull(packet?.sourceRefs)?.causalCompatibilityObservationHash),
    layerAdmissionCandidateRef: stringValue(objectOrNull(packet?.sourceRefs)?.layerAdmissionCandidateRef),
    rbcReceiptRef: stringValue(objectOrNull(packet?.sourceRefs)?.rbcReceiptRef),
    rbcReceiptHash: stringValue(objectOrNull(packet?.sourceRefs)?.rbcReceiptHash),
    edgeOperatorDecisionRef: stringValue(objectOrNull(packet?.sourceRefs)?.edgeOperatorDecisionRef),
    studioLiftSourceCandidateRef: stringValue(objectOrNull(packet?.sourceRefs)?.studioLiftSourceCandidateRef),
    bytesVisibilityEvidenceRef: stringValue(objectOrNull(packet?.sourceRefs)?.bytesVisibilityEvidenceRef),
  };
  const observationId = input.observationId ??
    `causal-file-resource-source-continuity-prerequisite:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourceRefs,
      status,
    })).slice(0, 16)}`;
  const observationHash = `sha256:${hash(stableJson({
    sourceRefs,
    status,
    classification,
    issues,
  }))}`;

  return {
    artifactKind: CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_PREREQUISITE_OBSERVATION_ARTIFACT_KIND,
    schema: CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_PREREQUISITE_OBSERVATION_SCHEMA,
    schemaVersion: 1,
    observationId,
    observationHash,
    emittedAt: input.emittedAt,
    proofRung: "local_supplied_material",
    sourcePaths: sanitizeSourcePaths(input.sourcePaths ?? {}),
    sourceRefs,
    status,
    classification,
    interpretation: {
      concreteSourceContinuityPrerequisiteObserved: ready,
      sourceContinuityQuestionPreserved: true,
      viewsDoNotReplaceSourceContinuity: true,
      remainingBlockersPreserved: ready,
      admissionAppendStillRequiresFutureBoundary: true,
      acceptedSourceContinuityNotCreated: true,
      convergenceNotAttempted: true,
    },
    validation: {
      layerPrerequisitePacketObserved: packet !== null,
      layerPrerequisiteReadbackObserved: readback !== null,
      edgePrerequisiteVisibilityObserved: visibility !== null,
      layerPrerequisiteReadbackVerified: layerPrerequisiteReadbackVerified(packet, readback),
      edgeVisibilityVerified: edgePrerequisiteVisibilityVerified(packet, visibility),
      noLayerAdmissionClaim: true,
      noAcceptedSourceContinuityClaim: true,
      noCausalContinuityAppendClaim: true,
      noCanonicalHistoryClaim: true,
      noViewAsSourceContinuityClaim: true,
      noAuthorityClaim: true,
      issues,
    },
    boundary: {
      observesLayerPrerequisiteOnly: true,
      opensLayerRuntime: false,
      writesLayerState: false,
      appendsCausalContinuity: false,
      admitsLayerEvidence: false,
      acceptsSourceContinuity: false,
      acceptsCanonicalHistory: false,
      attemptsConvergence: false,
      grantsAuthority: false,
    },
    nonClaims: {
      layerAdmission: false,
      admissionDecisionApplied: false,
      admissionAppendApproved: false,
      acceptedContinuity: false,
      acceptedSourceContinuity: false,
      durableAppend: false,
      causalContinuityAppend: false,
      canonicalAdmission: false,
      canonicalHistory: false,
      convergence: false,
      causalTruth: false,
      viewAsSourceContinuity: false,
      authority: false,
      productionDurability: false,
    },
    nextPressure: ready
      ? "spine_repo_family_reassessment_after_file_resource_source_continuity_prerequisite_observation"
      : "repair_layer_or_edge_source_continuity_prerequisite_material",
  };
}

export function assertFileResourceSourceContinuityPrerequisiteObservation(
  value: unknown,
): asserts value is FileResourceSourceContinuityPrerequisiteObservation {
  const candidate = objectOrNull(value);
  if (!candidate) {
    throw new Error("file-resource-source-continuity-prerequisite-observation must be an object");
  }
  if (candidate.artifactKind !== CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_PREREQUISITE_OBSERVATION_ARTIFACT_KIND) {
    throw new Error("file-resource-source-continuity-prerequisite-observation artifactKind mismatch");
  }
  if (candidate.schema !== CAUSAL_FILE_RESOURCE_SOURCE_CONTINUITY_PREREQUISITE_OBSERVATION_SCHEMA) {
    throw new Error("file-resource-source-continuity-prerequisite-observation schema mismatch");
  }
  const boundary = objectOrNull(candidate.boundary);
  for (const field of [
    "opensLayerRuntime",
    "writesLayerState",
    "appendsCausalContinuity",
    "admitsLayerEvidence",
    "acceptsSourceContinuity",
    "acceptsCanonicalHistory",
    "attemptsConvergence",
    "grantsAuthority",
  ]) {
    if (boundary?.[field] !== false) {
      throw new Error(`file-resource-source-continuity-prerequisite-observation boundary.${field} must be false`);
    }
  }
  const nonClaims = objectOrNull(candidate.nonClaims);
  for (const field of [
    "layerAdmission",
    "admissionDecisionApplied",
    "admissionAppendApproved",
    "acceptedContinuity",
    "acceptedSourceContinuity",
    "durableAppend",
    "causalContinuityAppend",
    "canonicalAdmission",
    "canonicalHistory",
    "convergence",
    "causalTruth",
    "viewAsSourceContinuity",
    "authority",
    "productionDurability",
  ]) {
    if (nonClaims?.[field] !== false) {
      throw new Error(`file-resource-source-continuity-prerequisite-observation nonClaims.${field} must be false`);
    }
  }
}

function prerequisiteIssues(
  packet: Record<string, unknown> | null,
  readback: Record<string, unknown> | null,
  visibility: Record<string, unknown> | null,
): string[] {
  const issues: string[] = [];
  if (!packet) issues.push("layer-prerequisite-packet-missing");
  if (packet?.artifactKind !== "layer_file_resource_source_continuity_prerequisite_packet") {
    issues.push("layer-prerequisite-packet-kind-invalid");
  }
  if (packet?.schemaVersion !== "layer_file_resource_source_continuity_prerequisite_packet.v0") {
    issues.push("layer-prerequisite-packet-schema-invalid");
  }
  if (packet?.packetStatus !== "layer_file_resource_source_continuity_prerequisite_packet_recorded_not_admitted") {
    issues.push("layer-prerequisite-packet-status-invalid");
  }
  if (packet?.requiredNextBoundary !== "edge_file_resource_source_continuity_prerequisite_visibility_before_any_admission_append") {
    issues.push("layer-prerequisite-packet-next-boundary-invalid");
  }
  if (!layerPrerequisiteReadbackVerified(packet, readback)) {
    issues.push("layer-prerequisite-readback-not-verified");
  }
  if (!edgePrerequisiteVisibilityVerified(packet, visibility)) {
    issues.push("edge-prerequisite-visibility-not-verified");
  }
  const prerequisite = objectOrNull(packet?.sourceContinuityPrerequisite);
  if (prerequisite?.sourceContinuityQuestionPreserved !== true) {
    issues.push("source-continuity-question-not-preserved");
  }
  if (prerequisite?.viewsDoNotReplaceSourceContinuity !== true) {
    issues.push("views-replace-source-continuity-overclaim");
  }
  if (prerequisite?.acceptedSourceContinuityCreated !== false) {
    issues.push("accepted-source-continuity-created-overclaim");
  }
  if (prerequisite?.admissionAppendApproved !== false) {
    issues.push("admission-append-approved-overclaim");
  }
  if (prerequisite?.canonicalAdmissionEstablished !== false) {
    issues.push("canonical-admission-established-overclaim");
  }
  if (prerequisite?.productionDurabilityProven !== false) {
    issues.push("production-durability-proven-overclaim");
  }
  if (Array.isArray(objectOrNull(packet?.verification)?.issues) && (objectOrNull(packet?.verification)?.issues as unknown[]).length !== 0) {
    issues.push("layer-prerequisite-verification-issues-present");
  }
  for (const field of [
    "layerAdmission",
    "admissionDecisionApplied",
    "admissionAppendApproved",
    "acceptedContinuity",
    "acceptedSourceContinuity",
    "durableAppend",
    "causalContinuityAppend",
    "canonicalAdmission",
    "storageRefAsAdmission",
    "externalReferenceAsCanon",
    "localPathAsCanon",
    "viewAsSourceContinuity",
    "operatorReviewAsCanon",
    "rbcDecisionAsAdmission",
    "rbcAuthority",
    "edgeAuthority",
    "causalTruth",
    "canonicalTruth",
    "authority",
    "productionDurability",
  ]) {
    if (objectOrNull(packet?.nonClaims)?.[field] !== false) {
      issues.push(`layer-prerequisite-non-claim-${field}-overclaim`);
    }
  }
  for (const field of [
    "actionControls",
    "queueAction",
    "dispatch",
    "execution",
    "layerMutation",
    "layerAdmission",
    "acceptedSourceContinuity",
    "causalContinuityAppend",
    "canonicalTruth",
    "authority",
    "productionDurability",
  ]) {
    if (objectOrNull(visibility?.nonClaims)?.[field] !== false) {
      issues.push(`edge-visibility-non-claim-${field}-overclaim`);
    }
  }
  return issues;
}

function layerPrerequisiteReadbackVerified(
  packet: Record<string, unknown> | null,
  readback: Record<string, unknown> | null,
): boolean {
  return (
    readback?.artifactKind === "layer_file_resource_source_continuity_prerequisite_packet_readback" &&
    readback?.schemaVersion === "layer_file_resource_source_continuity_prerequisite_packet_readback.v0" &&
    readback?.sourcePacketRef === packet?.packetRef &&
    readback?.sourcePacketHash === packet?.packetHash &&
    readback?.recomputedPacketHash === packet?.packetHash &&
    readback?.packetHashMatches === true &&
    readback?.proofRung === "local_supplied_material" &&
    objectOrNull(readback?.nonClaims)?.readbackIsAdmission === false &&
    objectOrNull(readback?.nonClaims)?.readbackCreatesAcceptedSourceContinuity === false &&
    objectOrNull(readback?.nonClaims)?.readbackAppendsCausalContinuity === false &&
    objectOrNull(readback?.nonClaims)?.readbackIsCanonicalTruth === false &&
    objectOrNull(readback?.nonClaims)?.readbackIsAuthority === false &&
    objectOrNull(readback?.nonClaims)?.readbackClaimsProductionDurability === false
  );
}

function edgePrerequisiteVisibilityVerified(
  packet: Record<string, unknown> | null,
  visibility: Record<string, unknown> | null,
): boolean {
  return (
    visibility?.artifactKind === "edge_file_resource_source_continuity_prerequisite_visibility" &&
    visibility?.schemaVersion === "edge_file_resource_source_continuity_prerequisite_visibility.v0" &&
    visibility?.status === "file_resource_source_continuity_prerequisite_visible_for_operator_review" &&
    visibility?.proofRung === "local_supplied_material" &&
    objectOrNull(visibility?.sourceRefs)?.layerPrerequisitePacketRef === packet?.packetRef &&
    objectOrNull(visibility?.sourceRefs)?.layerPrerequisitePacketHash === packet?.packetHash &&
    objectOrNull(visibility?.operatorVisibility)?.requiredNextBoundary ===
      "causal_file_resource_source_continuity_prerequisite_observation_before_layer_admission_append" &&
    objectOrNull(visibility?.operatorVisibility)?.readOnly === true &&
    objectOrNull(visibility?.operatorVisibility)?.statusOnly === true &&
    objectOrNull(visibility?.operatorVisibility)?.noActionControls === true &&
    Array.isArray(objectOrNull(visibility?.operatorVisibility)?.actionControls) &&
    (objectOrNull(visibility?.operatorVisibility)?.actionControls as unknown[]).length === 0 &&
    objectOrNull(visibility?.edgeBoundary)?.mutatesLayer === false &&
    objectOrNull(visibility?.edgeBoundary)?.admitsResource === false &&
    objectOrNull(visibility?.edgeBoundary)?.createsAcceptedSourceContinuity === false &&
    objectOrNull(visibility?.edgeBoundary)?.appendsCausalContinuity === false &&
    objectOrNull(visibility?.edgeBoundary)?.claimsCausalTruth === false &&
    objectOrNull(visibility?.edgeBoundary)?.claimsAuthority === false
  );
}

function objectOrNull(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function sanitizeSourcePaths(
  value: FileResourceSourceContinuityPrerequisiteObservation["sourcePaths"],
): FileResourceSourceContinuityPrerequisiteObservation["sourcePaths"] {
  const sanitized: FileResourceSourceContinuityPrerequisiteObservation["sourcePaths"] = {};
  if (typeof value.layerPrerequisitePacket === "string") {
    sanitized.layerPrerequisitePacket = value.layerPrerequisitePacket;
  }
  if (typeof value.layerPrerequisiteReadback === "string") {
    sanitized.layerPrerequisiteReadback = value.layerPrerequisiteReadback;
  }
  if (typeof value.edgePrerequisiteVisibility === "string") {
    sanitized.edgePrerequisiteVisibility = value.edgePrerequisiteVisibility;
  }
  return sanitized;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
