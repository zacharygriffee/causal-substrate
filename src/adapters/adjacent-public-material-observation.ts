import { createHash } from "node:crypto";

export const CAUSAL_ADJACENT_PUBLIC_MATERIAL_OBSERVATION_SCHEMA =
  "causal-substrate/adjacent-public-material-observation/v1" as const;

export const CAUSAL_ADJACENT_PUBLIC_MATERIAL_OBSERVATION_ARTIFACT_KIND =
  "causal-adjacent-public-material-observation" as const;

export type AdjacentPublicMaterialClassification = "compatible" | "damaged" | "unresolved";

export interface AdjacentPublicMaterialObservation {
  artifactKind: typeof CAUSAL_ADJACENT_PUBLIC_MATERIAL_OBSERVATION_ARTIFACT_KIND;
  schema: typeof CAUSAL_ADJACENT_PUBLIC_MATERIAL_OBSERVATION_SCHEMA;
  schemaVersion: 1;
  observationId: string;
  observationHash: string;
  emittedAt: string;
  sourcePaths: {
    layerPublicMaterial?: string | undefined;
    edgeHandoffReadback?: string | undefined;
  };
  observedSources: {
    layerMaterialObserved: boolean;
    edgeHandoffReadbackObserved: boolean;
  };
  classification: AdjacentPublicMaterialClassification;
  sourceClassifications: {
    layer?: AdjacentPublicMaterialClassification | undefined;
    edge?: AdjacentPublicMaterialClassification | undefined;
  };
  preservedRefs: {
    requestIds: string[];
    requestHashes: string[];
    receiptIds: string[];
    receiptHashes: string[];
    evidenceIds: string[];
    evidenceHashes: string[];
    durableRefs: string[];
    writerRefs: string[];
    sourceRepos: string[];
    proofRungs: string[];
    linkageStatuses: string[];
  };
  proof: {
    operationProofRung: "saved_readback_seam";
    strongestSourceProofRungObserved?: string | undefined;
    layerPublicProofObserved: boolean;
    edgeReadbackProofRungNotUpgraded: boolean;
    liveCausalSwarmProofClaimed: false;
    proofRungUpgradeClaimed: false;
  };
  validation: {
    status: "adjacent-public-material-observation-ready" | "adjacent-public-material-observation-incomplete";
    layerRefsPreserved: boolean;
    layerRequestReceiptEvidenceLinked: boolean;
    layerPublicBoundaryPreserved: boolean;
    layerCausalReadinessAccepted: boolean;
    edgeRefsPreserved: boolean;
    edgeReadbackOnly: boolean;
    edgeProofRungNotUpgraded: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noQuorumClaim: true;
    noAuthorityClaim: true;
    noMeshPublicationClaim: true;
    noProductionContinuityWriteClaim: true;
    issues: string[];
  };
  boundary: {
    readsSavedAdjacentMaterialOnly: true;
    opensSwarm: false;
    opensCorestore: false;
    callsEdge: false;
    callsLayer: false;
    writesEdgeState: false;
    writesLayerState: false;
    acceptsCanonicalHistory: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    claimsQuorum: false;
    grantsAuthority: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  nextPressure: string;
  warnings: string[];
  rejections: string[];
}

interface SourceAssessment {
  classification: AdjacentPublicMaterialClassification;
  requestIds: string[];
  requestHashes: string[];
  receiptIds: string[];
  receiptHashes: string[];
  evidenceIds: string[];
  evidenceHashes: string[];
  durableRefs: string[];
  writerRefs: string[];
  sourceRepos: string[];
  proofRungs: string[];
  linkageStatuses: string[];
  issues: string[];
  layerPublicBoundaryPreserved?: boolean | undefined;
  layerCausalReadinessAccepted?: boolean | undefined;
  layerRequestReceiptEvidenceLinked?: boolean | undefined;
  edgeReadbackOnly?: boolean | undefined;
  edgeProofRungNotUpgraded?: boolean | undefined;
}

export function buildAdjacentPublicMaterialObservation(input: {
  layerPublicMaterial?: unknown;
  edgeHandoffReadback?: unknown;
  emittedAt: string;
  sourcePaths?: AdjacentPublicMaterialObservation["sourcePaths"] | undefined;
  observationId?: string | undefined;
}): AdjacentPublicMaterialObservation {
  const layer = assessLayerPublicMaterial(input.layerPublicMaterial);
  const edge = assessEdgeHandoffReadback(input.edgeHandoffReadback);
  const issues = [...layer.issues, ...edge.issues];
  const layerObserved = input.layerPublicMaterial !== undefined;
  const edgeObserved = input.edgeHandoffReadback !== undefined;

  if (!layerObserved && !edgeObserved) issues.push("no-adjacent-material-observed");

  const classification = issues.some((issue) => issue.includes("overclaim") || issue.includes("mismatch"))
    ? "damaged"
    : issues.length > 0
      ? "unresolved"
      : "compatible";
  const preservedRefs = {
    requestIds: unique([...layer.requestIds, ...edge.requestIds]),
    requestHashes: unique([...layer.requestHashes, ...edge.requestHashes]),
    receiptIds: unique([...layer.receiptIds, ...edge.receiptIds]),
    receiptHashes: unique([...layer.receiptHashes, ...edge.receiptHashes]),
    evidenceIds: unique([...layer.evidenceIds, ...edge.evidenceIds]),
    evidenceHashes: unique([...layer.evidenceHashes, ...edge.evidenceHashes]),
    durableRefs: unique([...layer.durableRefs, ...edge.durableRefs]),
    writerRefs: unique([...layer.writerRefs, ...edge.writerRefs]),
    sourceRepos: unique([...layer.sourceRepos, ...edge.sourceRepos]),
    proofRungs: unique([...layer.proofRungs, ...edge.proofRungs]),
    linkageStatuses: unique([...layer.linkageStatuses, ...edge.linkageStatuses]),
  };
  const observationId = input.observationId ??
    `causal-adjacent-public-material-observation:${hash(stableJson({
      emittedAt: input.emittedAt,
      sourcePaths: input.sourcePaths ?? {},
      preservedRefs,
    })).slice(0, 16)}`;
  const observationHash = `sha256:${hash(stableJson({
    observedSources: { layerObserved, edgeObserved },
    classification,
    preservedRefs,
    issues,
  }))}`;
  const status = issues.length === 0
    ? "adjacent-public-material-observation-ready"
    : "adjacent-public-material-observation-incomplete";

  return {
    artifactKind: CAUSAL_ADJACENT_PUBLIC_MATERIAL_OBSERVATION_ARTIFACT_KIND,
    schema: CAUSAL_ADJACENT_PUBLIC_MATERIAL_OBSERVATION_SCHEMA,
    schemaVersion: 1,
    observationId,
    observationHash,
    emittedAt: input.emittedAt,
    sourcePaths: { ...(input.sourcePaths ?? {}) },
    observedSources: {
      layerMaterialObserved: layerObserved,
      edgeHandoffReadbackObserved: edgeObserved,
    },
    classification,
    sourceClassifications: {
      ...(layerObserved ? { layer: layer.classification } : {}),
      ...(edgeObserved ? { edge: edge.classification } : {}),
    },
    preservedRefs,
    proof: {
      operationProofRung: "saved_readback_seam",
      ...(preservedRefs.proofRungs[0] ? { strongestSourceProofRungObserved: preservedRefs.proofRungs[0] } : {}),
      layerPublicProofObserved: layer.layerPublicBoundaryPreserved === true,
      edgeReadbackProofRungNotUpgraded: edge.edgeProofRungNotUpgraded === true,
      liveCausalSwarmProofClaimed: false,
      proofRungUpgradeClaimed: false,
    },
    validation: {
      status,
      layerRefsPreserved: !layerObserved || hasLayerRefs(layer),
      layerRequestReceiptEvidenceLinked: !layerObserved || layer.layerRequestReceiptEvidenceLinked === true,
      layerPublicBoundaryPreserved: !layerObserved || layer.layerPublicBoundaryPreserved === true,
      layerCausalReadinessAccepted: !layerObserved || layer.layerCausalReadinessAccepted === true,
      edgeRefsPreserved: !edgeObserved || hasEdgeRefs(edge),
      edgeReadbackOnly: !edgeObserved || edge.edgeReadbackOnly === true,
      edgeProofRungNotUpgraded: !edgeObserved || edge.edgeProofRungNotUpgraded === true,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noQuorumClaim: true,
      noAuthorityClaim: true,
      noMeshPublicationClaim: true,
      noProductionContinuityWriteClaim: true,
      issues,
    },
    boundary: {
      readsSavedAdjacentMaterialOnly: true,
      opensSwarm: false,
      opensCorestore: false,
      callsEdge: false,
      callsLayer: false,
      writesEdgeState: false,
      writesLayerState: false,
      acceptsCanonicalHistory: false,
      admitsLayerEvidence: false,
      interpretsRbc: false,
      claimsQuorum: false,
      grantsAuthority: false,
      publishesToMesh: false,
      writesProductionContinuity: false,
    },
    nextPressure: classification === "compatible"
      ? "handoff-adjacent-observation-to-spine-or-consumer-without-proof-upgrade"
      : "inspect-adjacent-material-before-consuming",
    warnings: [
      "adjacent-public-material-observation-reads-saved-exported-material-only",
      "adjacent-public-material-observation-does-not-claim-live-causal-swarm-proof",
      "adjacent-public-material-observation-does-not-admit-layer-evidence-or-interpret-rbc",
    ],
    rejections: status === "adjacent-public-material-observation-ready" ? [] : issues,
  };
}

export function assertAdjacentPublicMaterialObservation(
  value: unknown,
): asserts value is AdjacentPublicMaterialObservation {
  const candidate = assertObject(value, "adjacent public material observation");
  assertEqual(candidate.artifactKind, CAUSAL_ADJACENT_PUBLIC_MATERIAL_OBSERVATION_ARTIFACT_KIND, "artifactKind");
  assertEqual(candidate.schema, CAUSAL_ADJACENT_PUBLIC_MATERIAL_OBSERVATION_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.observationId, "observationId");
  assertString(candidate.observationHash, "observationHash");
  assertClassification(candidate.classification, "classification");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(proof.operationProofRung, "saved_readback_seam", "proof.operationProofRung");
  assertEqual(proof.liveCausalSwarmProofClaimed, false, "proof.liveCausalSwarmProofClaimed");
  assertEqual(proof.proofRungUpgradeClaimed, false, "proof.proofRungUpgradeClaimed");
  const validation = assertObject(candidate.validation, "validation");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noEvidenceAdmissionClaim, true, "validation.noEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noQuorumClaim, true, "validation.noQuorumClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertEqual(validation.noMeshPublicationClaim, true, "validation.noMeshPublicationClaim");
  assertEqual(validation.noProductionContinuityWriteClaim, true, "validation.noProductionContinuityWriteClaim");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.readsSavedAdjacentMaterialOnly, true, "boundary.readsSavedAdjacentMaterialOnly");
  for (const key of [
    "opensSwarm",
    "opensCorestore",
    "callsEdge",
    "callsLayer",
    "writesEdgeState",
    "writesLayerState",
    "acceptsCanonicalHistory",
    "admitsLayerEvidence",
    "interpretsRbc",
    "claimsQuorum",
    "grantsAuthority",
    "publishesToMesh",
    "writesProductionContinuity",
  ]) {
    assertEqual(boundary[key], false, `boundary.${key}`);
  }
}

function assessLayerPublicMaterial(value: unknown): SourceAssessment {
  if (value === undefined) return emptyAssessment("unresolved");
  const material = maybeRecord(value);
  if (!material) return withIssue(emptyAssessment("unresolved"), "layer-material-not-object");

  const readiness = maybeRecord(material.objectiveProof)?.causalReadiness &&
      maybeRecord(maybeRecord(material.objectiveProof)?.causalReadiness)
    ? maybeRecord(maybeRecord(material.objectiveProof)?.causalReadiness)
    : material.artifactKind === "layer_owned_edge_seam_causal_handoff_readiness_export"
      ? material
      : undefined;
  const readinessConsumer = maybeRecord(maybeRecord(material.objectiveProof)?.causalReadinessConsumer);
  const requestRef = maybeRecord(readiness?.requestRef) ?? firstRecord(material.requestRefs);
  const receiptRef = maybeRecord(readiness?.receiptRef) ?? firstRecord(material.receiptRefs);
  const evidenceRef = maybeRecord(readiness?.evidenceRef) ?? firstRecord(material.evidenceRefs);
  const proofBoundary = maybeRecord(readiness?.proofBoundary) ?? maybeRecord(material.proofBoundary);
  const operationProof = maybeRecord(readiness?.operationProof) ?? maybeRecord(material.operationProof);
  const writerRefs = maybeRecord(readiness?.writerRefs) ?? maybeRecord(material.writerRefs);
  const durableHistoryRefs = maybeRecord(readiness?.durableHistoryRefs) ?? maybeRecord(material.durableHistoryRefs);
  const issues: string[] = [];

  const requestId = stringValue(requestRef?.eventId);
  const requestHash = stringValue(requestRef?.eventHash);
  const receiptId = stringValue(receiptRef?.eventId);
  const receiptHash = stringValue(receiptRef?.eventHash);
  const evidenceId = stringValue(evidenceRef?.evidenceId ?? evidenceRef?.eventId);
  const evidenceHash = stringValue(evidenceRef?.evidenceHash ?? evidenceRef?.eventHash);
  const sourceRequestId = stringValue(receiptRef?.sourceRequestId);
  const sourceRequestHash = stringValue(receiptRef?.sourceRequestHash);
  const evidenceObservedRequestHash = stringValue(evidenceRef?.observedRequestHash);
  const evidenceEmittedReceiptHash = stringValue(evidenceRef?.emittedReceiptHash);
  const causalReadinessAccepted =
    readiness?.readinessStatus === "ready_for_causal_substrate_read_only_observation" ||
    readinessConsumer?.consumerStatus === "accepted_for_causal_read_only_consumer_projection" ||
    maybeRecord(material.operationProof)?.causalReadinessConsumerAccepted === true;
  const linked =
    requestId !== undefined &&
    requestHash !== undefined &&
    receiptId !== undefined &&
    receiptHash !== undefined &&
    evidenceId !== undefined &&
    evidenceHash !== undefined &&
    sourceRequestId === requestId &&
    sourceRequestHash === requestHash &&
    (evidenceObservedRequestHash === undefined || evidenceObservedRequestHash === requestHash) &&
    (evidenceEmittedReceiptHash === undefined || evidenceEmittedReceiptHash === receiptHash);
  const publicBoundary =
    proofBoundary?.defaultPublicHyperDht === true &&
    proofBoundary?.publicSwarmProof === true &&
    proofBoundary?.explicitBootstrapNodes === false &&
    proofBoundary?.localBootstrapper === false;

  if (!requestId || !requestHash) issues.push("layer-request-ref-missing");
  if (!receiptId || !receiptHash) issues.push("layer-receipt-ref-missing");
  if (!evidenceId || !evidenceHash) issues.push("layer-evidence-ref-missing");
  if (!linked) issues.push("layer-request-receipt-evidence-linkage-mismatch");
  if (!publicBoundary) issues.push("layer-public-proof-boundary-not-preserved");
  if (!causalReadinessAccepted) issues.push("layer-causal-readiness-not-accepted");
  if (hasAuthorityOverclaim(readiness) || hasAuthorityOverclaim(material)) issues.push("layer-adjacent-material-overclaim");
  if (operationProof?.rbcEnforced === true || material.rbcEnforced === true) issues.push("layer-rbc-overclaim");

  return {
    classification: issues.some((issue) => issue.includes("mismatch") || issue.includes("overclaim"))
      ? "damaged"
      : issues.length > 0
        ? "unresolved"
        : "compatible",
    requestIds: arrayOf(requestId),
    requestHashes: arrayOf(requestHash),
    receiptIds: arrayOf(receiptId),
    receiptHashes: arrayOf(receiptHash),
    evidenceIds: arrayOf(evidenceId),
    evidenceHashes: arrayOf(evidenceHash),
    durableRefs: collectStrings([
      durableHistoryRefs?.storageRoot,
      durableHistoryRefs?.autobaseKey,
      durableHistoryRefs?.seamViewName,
      durableHistoryRefs?.layerEvidenceCoreName,
      material.namespace,
      material.autobaseKey,
    ]),
    writerRefs: collectStrings([
      writerRefs?.requestWriterRef,
      writerRefs?.layerWriterRef,
      writerRefs?.receiptWriterRef,
      requestRef?.writerRef,
      receiptRef?.writerRef,
    ]),
    sourceRepos: collectStrings([requestRef?.sourceRepo, material.repo, "mesh-ecology-layer"]),
    proofRungs: collectStrings([readiness?.strongestProofRung, material.strongestProofRung, proofBoundary?.strongestProofRung]),
    linkageStatuses: linked ? ["request_receipt_evidence_linked"] : [],
    issues,
    layerPublicBoundaryPreserved: publicBoundary,
    layerCausalReadinessAccepted: causalReadinessAccepted,
    layerRequestReceiptEvidenceLinked: linked,
  };
}

function assessEdgeHandoffReadback(value: unknown): SourceAssessment {
  if (value === undefined) return emptyAssessment("unresolved");
  const readback = maybeRecord(value);
  if (!readback) return withIssue(emptyAssessment("unresolved"), "edge-handoff-readback-not-object");
  const entries = Array.isArray(readback.handoffEntries) ? readback.handoffEntries.filter(isRecord) : [];
  const issues: string[] = [];
  const readbackOnly = readback.proofBoundary === "handoff_export_file_readback_only";
  const proofRungNotUpgraded = readback.proofRungNotUpgraded === true;
  const compatible = readback.compatibleContractReady === true ||
    readback.compatibleContractStatus === "compatible_handoff_contract_ready_for_adjacent_observation";

  if (entries.length === 0) issues.push("edge-handoff-readback-entries-missing");
  if (!readbackOnly) issues.push("edge-handoff-readback-boundary-not-readback-only");
  if (!proofRungNotUpgraded) issues.push("edge-handoff-proof-rung-upgrade-overclaim");
  if (!compatible) issues.push("edge-handoff-contract-not-compatible");
  if (hasAuthorityOverclaim(readback)) issues.push("edge-handoff-readback-overclaim");

  return {
    classification: issues.some((issue) => issue.includes("overclaim"))
      ? "damaged"
      : issues.length > 0
        ? "unresolved"
        : "compatible",
    requestIds: collectStrings(entries.map((entry) => entry.requestId)),
    requestHashes: collectStrings(entries.map((entry) => entry.requestHash)),
    receiptIds: collectStrings(entries.map((entry) => entry.receiptId)),
    receiptHashes: collectStrings(entries.map((entry) => entry.receiptHash)),
    evidenceIds: [],
    evidenceHashes: [],
    durableRefs: collectStrings(entries.flatMap((entry) => Object.values(maybeRecord(entry.durableRefs) ?? {}))),
    writerRefs: collectStrings(entries.flatMap((entry) => Object.values(maybeRecord(entry.writerRefs) ?? {}))),
    sourceRepos: collectStrings(entries.flatMap((entry) => [entry.sourceRepo, entry.targetRepo])),
    proofRungs: collectStrings([readback.strongestProofRung, ...entries.map((entry) => entry.strongestProofRung)]),
    linkageStatuses: collectStrings(entries.map((entry) => stringValue(maybeRecord(entry.linkageStatus)?.linkedPairCount) !== undefined
      ? `linkedPairCount:${String(maybeRecord(entry.linkageStatus)?.linkedPairCount)}`
      : undefined)),
    issues,
    edgeReadbackOnly: readbackOnly,
    edgeProofRungNotUpgraded: proofRungNotUpgraded,
  };
}

function hasLayerRefs(assessment: SourceAssessment): boolean {
  return assessment.requestIds.length > 0 &&
    assessment.requestHashes.length > 0 &&
    assessment.receiptIds.length > 0 &&
    assessment.receiptHashes.length > 0 &&
    assessment.evidenceIds.length > 0 &&
    assessment.evidenceHashes.length > 0 &&
    assessment.writerRefs.length > 0;
}

function hasEdgeRefs(assessment: SourceAssessment): boolean {
  return assessment.requestIds.length > 0 &&
    assessment.requestHashes.length > 0 &&
    assessment.receiptIds.length > 0 &&
    assessment.receiptHashes.length > 0 &&
    assessment.writerRefs.length > 0;
}

function emptyAssessment(classification: AdjacentPublicMaterialClassification): SourceAssessment {
  return {
    classification,
    requestIds: [],
    requestHashes: [],
    receiptIds: [],
    receiptHashes: [],
    evidenceIds: [],
    evidenceHashes: [],
    durableRefs: [],
    writerRefs: [],
    sourceRepos: [],
    proofRungs: [],
    linkageStatuses: [],
    issues: [],
  };
}

function withIssue(assessment: SourceAssessment, issue: string): SourceAssessment {
  return {
    ...assessment,
    issues: [...assessment.issues, issue],
  };
}

function firstRecord(value: unknown): Record<string, unknown> | undefined {
  return Array.isArray(value) ? value.find(isRecord) : undefined;
}

function hasAuthorityOverclaim(value: Record<string, unknown> | undefined): boolean {
  if (!value) return false;
  const operationProof = maybeRecord(value.operationProof);
  const nonClaims = maybeRecord(value.nonClaimFlags);
  return [
    value.canonicalTruthClaimed,
    value.admitsEvidence,
    value.grantsAuthority,
    value.mutatesLayer,
    value.meshPublished,
    value.productionContinuityWritten,
    operationProof?.canonicalTruthClaimed,
    operationProof?.layerAdmissionOccurred,
    operationProof?.authorityGrantOccurred,
    operationProof?.rbcEnforced,
    nonClaims?.doesNotGrantAuthority === false,
  ].some((entry) => entry === true);
}

function maybeRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function arrayOf(value: string | undefined): string[] {
  return value ? [value] : [];
}

function collectStrings(values: unknown[]): string[] {
  return unique(values.flatMap((value) => {
    if (typeof value === "string" && value.trim() !== "") return [value];
    if (Array.isArray(value)) return value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "");
    return [];
  }));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function assertObject(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) throw new Error(`${label} must be ${String(expected)}`);
}

function assertString(value: unknown, label: string): void {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label} must be a non-empty string`);
}

function assertClassification(value: unknown, label: string): asserts value is AdjacentPublicMaterialClassification {
  if (value !== "compatible" && value !== "damaged" && value !== "unresolved") {
    throw new Error(`${label} must be compatible, damaged, or unresolved`);
  }
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
