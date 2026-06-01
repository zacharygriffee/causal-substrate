import { createHash } from "node:crypto";

export const CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_SCHEMA =
  "causal-substrate/layer-receipt-runtime-evidence-observation/v1" as const;

export const CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_ARTIFACT_KIND =
  "causal-layer-receipt-runtime-evidence-observation" as const;

export type LayerReceiptRuntimeEvidenceObservationStatus =
  | "layer-receipt-runtime-evidence-observation-emitted"
  | "layer-receipt-runtime-evidence-observation-incomplete"
  | "layer-receipt-runtime-evidence-observation-guardrail-blocked"
  | "layer-receipt-runtime-evidence-observation-malformed";

type JsonRecord = Record<string, unknown>;

export interface LayerReceiptRuntimeEvidenceObservation {
  artifactKind: typeof CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_ARTIFACT_KIND;
  schema: typeof CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_SCHEMA;
  schemaVersion: 1;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo?: string | undefined;
    sourceSchema?: string | undefined;
    sourceReportId?: string | undefined;
    sourceReportHash?: string | undefined;
  };
  receiptRefs: {
    receiptId?: string | undefined;
    receiptHash?: string | undefined;
    sourceRequestId?: string | undefined;
    sourceRequestHash?: string | undefined;
    durableRef?: string | undefined;
    writerRef?: string | undefined;
    sourceRepos: string[];
    sourceRefs: string[];
  };
  runtimeRefs: {
    runtimeEvidenceId?: string | undefined;
    runtimeEvidenceHash?: string | undefined;
    runtimeTraceRef?: string | undefined;
    durableReceiptRef?: string | undefined;
  };
  proof: {
    strongestProofRung: "local_causal_observation_over_supplied_layer_receipt_runtime_evidence";
    normalizedProofLabel: "local_supplied_layer_receipt_runtime_evidence";
    suppliedMaterialOnly: true;
    layerOwnedInputObserved: boolean;
    dhtOrHyperswarmInputObservedByCausalSubstrate: false;
    admitsLayerEvidence: false;
    interpretsRbc: false;
    grantsAuthority: false;
  };
  nonClaims: {
    canonicalHistoryAccepted: false;
    layerEvidenceAdmitted: false;
    layerAdmissionDecided: false;
    rbcInterpreted: false;
    authorityGranted: false;
    referentPromoted: false;
    meshPublished: false;
  };
  boundary: {
    adjacentInputOnly: true;
    evidenceReviewOnly: true;
    callsLayer: false;
    opensLayerRuntime: false;
    writesLayerEvidence: false;
    admitsLayerEvidence: false;
    decidesLayerAdmission: false;
    interpretsRbc: false;
    acceptsCanonicalHistory: false;
    grantsAuthority: false;
    promotesReferents: false;
    publishesToMesh: false;
    writesContinuityRecords: false;
  };
  validation: {
    status: LayerReceiptRuntimeEvidenceObservationStatus;
    reportConsumed: boolean;
    layerSourceRepoPreserved: boolean;
    reportRefsPreserved: boolean;
    receiptRefsPreserved: boolean;
    runtimeRefsPreserved: boolean;
    durableAndWriterRefsPreserved: boolean;
    sourceRefsPreserved: boolean;
    refsSafe: boolean;
    noCanonicalHistoryClaim: true;
    noLayerAdmissionClaim: true;
    noLayerEvidenceAdmissionClaim: true;
    noRbcInterpretationClaim: true;
    noAuthorityClaim: true;
    issues: string[];
  };
  deferredAttachmentPoints: {
    layerAdmission: DeferredAttachmentPoint;
    rbcInterpretation: DeferredAttachmentPoint;
    authorityDecision: DeferredAttachmentPoint;
    referentPromotion: DeferredAttachmentPoint;
    meshPublication: DeferredAttachmentPoint;
  };
  reviewStatus: LayerReceiptRuntimeEvidenceObservationStatus;
}

interface DeferredAttachmentPoint {
  status: "deferred";
  active: false;
  interpreted: false;
  writes: false;
}

export function buildLayerReceiptRuntimeEvidenceObservation(input: {
  layerReceiptRuntimeEvidence: unknown;
  emittedAt: string;
  artifactId?: string | undefined;
}): LayerReceiptRuntimeEvidenceObservation {
  const report = isRecord(input.layerReceiptRuntimeEvidence) ? input.layerReceiptRuntimeEvidence : undefined;
  const refs = collectRefs(report);
  const issues = validateReport(report, input.layerReceiptRuntimeEvidence, refs);
  const status = statusFor(report, issues);
  const artifactId = input.artifactId ??
    `causal-layer-receipt-runtime-evidence-observation:${hash(stableJson({
      emittedAt: input.emittedAt,
      reportId: refs.reportId,
      receiptId: refs.receiptId,
      runtimeEvidenceId: refs.runtimeEvidenceId,
    })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_ARTIFACT_KIND,
    schema: CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_SCHEMA,
    schemaVersion: 1,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      ...(refs.sourceRepo ? { sourceRepo: refs.sourceRepo } : {}),
      ...(refs.sourceSchema ? { sourceSchema: refs.sourceSchema } : {}),
      ...(refs.reportId ? { sourceReportId: refs.reportId } : {}),
      ...(refs.reportHash ? { sourceReportHash: refs.reportHash } : {}),
    },
    receiptRefs: {
      ...(refs.receiptId ? { receiptId: refs.receiptId } : {}),
      ...(refs.receiptHash ? { receiptHash: refs.receiptHash } : {}),
      ...(refs.sourceRequestId ? { sourceRequestId: refs.sourceRequestId } : {}),
      ...(refs.sourceRequestHash ? { sourceRequestHash: refs.sourceRequestHash } : {}),
      ...(refs.durableRef ? { durableRef: refs.durableRef } : {}),
      ...(refs.writerRef ? { writerRef: refs.writerRef } : {}),
      sourceRepos: refs.sourceRepos,
      sourceRefs: refs.sourceRefs,
    },
    runtimeRefs: {
      ...(refs.runtimeEvidenceId ? { runtimeEvidenceId: refs.runtimeEvidenceId } : {}),
      ...(refs.runtimeEvidenceHash ? { runtimeEvidenceHash: refs.runtimeEvidenceHash } : {}),
      ...(refs.runtimeTraceRef ? { runtimeTraceRef: refs.runtimeTraceRef } : {}),
      ...(refs.durableReceiptRef ? { durableReceiptRef: refs.durableReceiptRef } : {}),
    },
    proof: {
      strongestProofRung: "local_causal_observation_over_supplied_layer_receipt_runtime_evidence",
      normalizedProofLabel: "local_supplied_layer_receipt_runtime_evidence",
      suppliedMaterialOnly: true,
      layerOwnedInputObserved: refs.sourceRepo === "mesh-ecology-layer",
      dhtOrHyperswarmInputObservedByCausalSubstrate: false,
      admitsLayerEvidence: false,
      interpretsRbc: false,
      grantsAuthority: false,
    },
    nonClaims: {
      canonicalHistoryAccepted: false,
      layerEvidenceAdmitted: false,
      layerAdmissionDecided: false,
      rbcInterpreted: false,
      authorityGranted: false,
      referentPromoted: false,
      meshPublished: false,
    },
    boundary: {
      adjacentInputOnly: true,
      evidenceReviewOnly: true,
      callsLayer: false,
      opensLayerRuntime: false,
      writesLayerEvidence: false,
      admitsLayerEvidence: false,
      decidesLayerAdmission: false,
      interpretsRbc: false,
      acceptsCanonicalHistory: false,
      grantsAuthority: false,
      promotesReferents: false,
      publishesToMesh: false,
      writesContinuityRecords: false,
    },
    validation: {
      status,
      reportConsumed: report !== undefined,
      layerSourceRepoPreserved: issues.includes("layer-source-repo-missing-or-unowned") === false && report !== undefined,
      reportRefsPreserved: issues.includes("report-refs-missing") === false && report !== undefined,
      receiptRefsPreserved: issues.includes("receipt-refs-missing") === false && report !== undefined,
      runtimeRefsPreserved: issues.includes("runtime-evidence-refs-missing") === false && report !== undefined,
      durableAndWriterRefsPreserved:
        issues.includes("receipt-durable-or-writer-ref-missing") === false && report !== undefined,
      sourceRefsPreserved: issues.includes("source-refs-missing") === false && report !== undefined,
      refsSafe: issues.includes("unsafe-ref") === false && report !== undefined,
      noCanonicalHistoryClaim: true,
      noLayerAdmissionClaim: true,
      noLayerEvidenceAdmissionClaim: true,
      noRbcInterpretationClaim: true,
      noAuthorityClaim: true,
      issues,
    },
    deferredAttachmentPoints: {
      layerAdmission: deferredAttachmentPoint(),
      rbcInterpretation: deferredAttachmentPoint(),
      authorityDecision: deferredAttachmentPoint(),
      referentPromotion: deferredAttachmentPoint(),
      meshPublication: deferredAttachmentPoint(),
    },
    reviewStatus: status,
  };
}

export function assertLayerReceiptRuntimeEvidenceObservation(
  value: unknown,
): asserts value is LayerReceiptRuntimeEvidenceObservation {
  const candidate = assertObject(value, "layer receipt runtime evidence observation");
  assertEqual(
    candidate.artifactKind,
    CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_ARTIFACT_KIND,
    "artifactKind",
  );
  assertEqual(candidate.schema, CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const proof = assertObject(candidate.proof, "proof");
  assertEqual(
    proof.strongestProofRung,
    "local_causal_observation_over_supplied_layer_receipt_runtime_evidence",
    "proof.strongestProofRung",
  );
  assertEqual(
    proof.normalizedProofLabel,
    "local_supplied_layer_receipt_runtime_evidence",
    "proof.normalizedProofLabel",
  );
  assertEqual(proof.suppliedMaterialOnly, true, "proof.suppliedMaterialOnly");
  assertEqual(proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false, "proof.dhtOrHyperswarmInputObservedByCausalSubstrate");
  assertEqual(proof.admitsLayerEvidence, false, "proof.admitsLayerEvidence");
  assertEqual(proof.interpretsRbc, false, "proof.interpretsRbc");
  assertEqual(proof.grantsAuthority, false, "proof.grantsAuthority");
  const nonClaims = assertObject(candidate.nonClaims, "nonClaims");
  assertEqual(nonClaims.canonicalHistoryAccepted, false, "nonClaims.canonicalHistoryAccepted");
  assertEqual(nonClaims.layerEvidenceAdmitted, false, "nonClaims.layerEvidenceAdmitted");
  assertEqual(nonClaims.layerAdmissionDecided, false, "nonClaims.layerAdmissionDecided");
  assertEqual(nonClaims.rbcInterpreted, false, "nonClaims.rbcInterpreted");
  assertEqual(nonClaims.authorityGranted, false, "nonClaims.authorityGranted");
  assertEqual(nonClaims.referentPromoted, false, "nonClaims.referentPromoted");
  assertEqual(nonClaims.meshPublished, false, "nonClaims.meshPublished");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.adjacentInputOnly, true, "boundary.adjacentInputOnly");
  assertEqual(boundary.evidenceReviewOnly, true, "boundary.evidenceReviewOnly");
  assertEqual(boundary.callsLayer, false, "boundary.callsLayer");
  assertEqual(boundary.opensLayerRuntime, false, "boundary.opensLayerRuntime");
  assertEqual(boundary.writesLayerEvidence, false, "boundary.writesLayerEvidence");
  assertEqual(boundary.admitsLayerEvidence, false, "boundary.admitsLayerEvidence");
  assertEqual(boundary.decidesLayerAdmission, false, "boundary.decidesLayerAdmission");
  assertEqual(boundary.interpretsRbc, false, "boundary.interpretsRbc");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.grantsAuthority, false, "boundary.grantsAuthority");
  assertEqual(boundary.promotesReferents, false, "boundary.promotesReferents");
  assertEqual(boundary.publishesToMesh, false, "boundary.publishesToMesh");
  assertEqual(boundary.writesContinuityRecords, false, "boundary.writesContinuityRecords");
  const validation = assertObject(candidate.validation, "validation");
  assertObservationStatus(validation.status, "validation.status");
  assertEqual(validation.noCanonicalHistoryClaim, true, "validation.noCanonicalHistoryClaim");
  assertEqual(validation.noLayerAdmissionClaim, true, "validation.noLayerAdmissionClaim");
  assertEqual(validation.noLayerEvidenceAdmissionClaim, true, "validation.noLayerEvidenceAdmissionClaim");
  assertEqual(validation.noRbcInterpretationClaim, true, "validation.noRbcInterpretationClaim");
  assertEqual(validation.noAuthorityClaim, true, "validation.noAuthorityClaim");
  assertObservationStatus(candidate.reviewStatus, "reviewStatus");
}

function collectRefs(report: JsonRecord | undefined) {
  const receipt = isRecord(report?.receipt) ? report.receipt : {};
  const runtime = isRecord(report?.runtimeEvidence) ? report.runtimeEvidence : {};
  const sourceRepo = stringValue(report?.sourceRepo);
  const sourceRepos = stringArray(report?.sourceRepos);
  const sourceRefs = [
    ...stringArray(report?.sourceRefs),
    stringValue(report?.reportId),
    stringValue(report?.reportHash),
    stringValue(receipt.receiptId),
    stringValue(receipt.receiptHash),
    stringValue(receipt.sourceRequestId),
    stringValue(receipt.sourceRequestHash),
    stringValue(receipt.durableRef),
    stringValue(receipt.writerRef),
    stringValue(runtime.runtimeEvidenceId),
    stringValue(runtime.runtimeEvidenceHash),
    stringValue(runtime.runtimeTraceRef),
    stringValue(runtime.durableReceiptRef),
  ].filter((ref): ref is string => ref.length > 0);

  return {
    sourceRepo,
    sourceSchema: stringValue(report?.schemaVersion) || stringValue(report?.schema),
    reportId: stringValue(report?.reportId),
    reportHash: stringValue(report?.reportHash),
    receiptId: stringValue(receipt.receiptId),
    receiptHash: stringValue(receipt.receiptHash),
    sourceRequestId: stringValue(receipt.sourceRequestId),
    sourceRequestHash: stringValue(receipt.sourceRequestHash),
    durableRef: stringValue(receipt.durableRef),
    writerRef: stringValue(receipt.writerRef),
    runtimeEvidenceId: stringValue(runtime.runtimeEvidenceId),
    runtimeEvidenceHash: stringValue(runtime.runtimeEvidenceHash),
    runtimeTraceRef: stringValue(runtime.runtimeTraceRef),
    durableReceiptRef: stringValue(runtime.durableReceiptRef),
    sourceRepos: sourceRepos.length > 0 ? sourceRepos : [sourceRepo].filter(Boolean),
    sourceRefs: [...new Set(sourceRefs)],
  };
}

function validateReport(
  report: JsonRecord | undefined,
  original: unknown,
  refs: ReturnType<typeof collectRefs>,
): string[] {
  if (!isRecord(original) || !report) return ["layer-receipt-runtime-report-not-object"];
  const issues: string[] = [];
  if (refs.sourceRepo !== "mesh-ecology-layer") issues.push("layer-source-repo-missing-or-unowned");
  if (!refs.reportId || !refs.reportHash) issues.push("report-refs-missing");
  if (!refs.receiptId || !refs.receiptHash || !refs.sourceRequestId || !refs.sourceRequestHash) {
    issues.push("receipt-refs-missing");
  }
  if (!refs.durableRef || !refs.writerRef) issues.push("receipt-durable-or-writer-ref-missing");
  if (!refs.runtimeEvidenceId || !refs.runtimeEvidenceHash || !refs.runtimeTraceRef) {
    issues.push("runtime-evidence-refs-missing");
  }
  if (refs.sourceRefs.length < 8) issues.push("source-refs-missing");
  if (allRefs(refs).some(unsafeRef)) issues.push("unsafe-ref");
  if (overclaims(report)) issues.push("layer-receipt-runtime-overclaim");
  return [...new Set(issues)];
}

function statusFor(report: JsonRecord | undefined, issues: string[]): LayerReceiptRuntimeEvidenceObservationStatus {
  if (!report) return "layer-receipt-runtime-evidence-observation-malformed";
  if (
    issues.includes("unsafe-ref") ||
    issues.includes("layer-source-repo-missing-or-unowned") ||
    issues.includes("layer-receipt-runtime-overclaim")
  ) {
    return "layer-receipt-runtime-evidence-observation-guardrail-blocked";
  }
  if (issues.length > 0) return "layer-receipt-runtime-evidence-observation-incomplete";
  return "layer-receipt-runtime-evidence-observation-emitted";
}

function overclaims(report: JsonRecord): boolean {
  const posture = isRecord(report.posture) ? report.posture : {};
  const boundary = isRecord(report.boundary) ? report.boundary : {};
  const nonClaims = isRecord(report.nonClaims) ? report.nonClaims : {};
  return [
    posture.layerEvidenceAdmitted,
    posture.layerAdmissionDecided,
    posture.rbcInterpreted,
    posture.authorityGranted,
    posture.canonicalHistoryClaimed,
    boundary.admitsLayerEvidence,
    boundary.decidesLayerAdmission,
    boundary.interpretsRbc,
    boundary.grantsAuthority,
    boundary.claimsCanonicalHistory,
    nonClaims.layerEvidenceAdmitted,
    nonClaims.layerAdmissionDecided,
    nonClaims.rbcInterpreted,
    nonClaims.authorityGranted,
    nonClaims.canonicalHistoryClaimed,
  ].some((value) => value === true);
}

function allRefs(refs: ReturnType<typeof collectRefs>): string[] {
  return [
    refs.sourceRepo,
    refs.reportId,
    refs.reportHash,
    refs.receiptId,
    refs.receiptHash,
    refs.sourceRequestId,
    refs.sourceRequestHash,
    refs.durableRef,
    refs.writerRef,
    refs.runtimeEvidenceId,
    refs.runtimeEvidenceHash,
    refs.runtimeTraceRef,
    refs.durableReceiptRef,
    ...refs.sourceRepos,
    ...refs.sourceRefs,
  ].filter((ref): ref is string => ref.length > 0);
}

function unsafeRef(value: string): boolean {
  return value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("ssh://");
}

function deferredAttachmentPoint(): DeferredAttachmentPoint {
  return {
    status: "deferred",
    active: false,
    interpreted: false,
    writes: false,
  };
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label} must be a non-empty string`);
}

function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) throw new Error(`${label} mismatch`);
}

function assertObservationStatus(value: unknown, label: string): asserts value is LayerReceiptRuntimeEvidenceObservationStatus {
  if (
    value !== "layer-receipt-runtime-evidence-observation-emitted" &&
    value !== "layer-receipt-runtime-evidence-observation-incomplete" &&
    value !== "layer-receipt-runtime-evidence-observation-guardrail-blocked" &&
    value !== "layer-receipt-runtime-evidence-observation-malformed"
  ) {
    throw new Error(`${label} must be a layer receipt runtime evidence observation status`);
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
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
