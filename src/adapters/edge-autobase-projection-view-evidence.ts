import { createHash } from "node:crypto";

export const CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA =
  "causal-substrate/edge-autobase-projection-view-evidence/v1" as const;

export const CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-autobase-projection-view-evidence" as const;

export type EdgeAutobaseProjectionViewEvidenceStatus =
  | "edge-autobase-projection-view-evidence-emitted"
  | "edge-autobase-projection-view-valid-evidence"
  | "edge-autobase-projection-view-incomplete-evidence"
  | "edge-autobase-projection-view-malformed-evidence"
  | "edge-autobase-projection-view-guardrail-blocked";

export interface EdgeAutobaseProjectionViewRefs {
  viewId?: string;
  sourceFrontierCandidateId?: string;
  projectionLaneRef?: string;
  layerRef?: string;
  observerRef?: string;
  writerRefs: string[];
  headRefs: string[];
  linearizedEntryRefs: string[];
  causalFrontierRefs: string[];
  sourceProjectionEventRefs: string[];
  sourceEntryRefs: string[];
  sourceHappeningRefs: string[];
}

export interface EdgeAutobaseProjectionViewBoundary {
  reviewOnly: true;
  evidenceOnly: true;
  opensAutobase: false;
  opensCorestore: false;
  callsEdge: false;
  writesContinuityRecords: false;
  acceptsCanonicalHistory: false;
  claimsCausalTruth: false;
  claimsDurableState: false;
  claimsReplicatedState: false;
  claimsRuntimeAuthority: false;
  startsBackend: false;
  publishesToMesh: false;
}

export interface EdgeAutobaseProjectionViewValidation {
  status: EdgeAutobaseProjectionViewEvidenceStatus;
  parseableObject: boolean;
  expectedSourceSchemaPresent: boolean;
  writerRefsPresent: boolean;
  headRefsPresent: boolean;
  linearizedEntryRefsPresent: boolean;
  causalFrontierRefsPresent: boolean;
  sourceRefsPresent: boolean;
  sandboxedAutobaseViewPosturePresent: boolean;
  storageLanePosturePresent: boolean;
  unsafeSeamRefsBlocked: boolean;
  unsafeClaimsBlocked: boolean;
  issues: string[];
}

export interface EdgeAutobaseStorageLanePosture {
  intendedStorageLane?: string;
  inputSemanticUnit?: string;
  requiresPromotedProjectionEventInput: boolean;
  sandboxedOnly: boolean;
  productionBackendPromoted: boolean;
  storageRecordPromoted: boolean;
  edgeStateMigration: boolean;
  appendSuccessIsAcceptance: boolean;
  linearizationIsTruth: boolean;
  replicaVisibilityIsContinuity: boolean;
  wallClockDefinesCausalOrder: boolean;
  discoveryAbsenceIsFailure: boolean;
}

export interface EdgeAutobaseProjectionViewEvidenceArtifact {
  artifactKind: typeof CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_ARTIFACT_KIND;
  schema: typeof CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA;
  schemaVersion: typeof CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA_VERSION;
  artifactId: string;
  emittedAt: string;
  source: {
    sourceRepo: "mesh-ecology-edge";
    sourceArtifactKind?: string;
    sourceSchema?: string;
    sourcePath?: string;
  };
  projectionViewRefs: EdgeAutobaseProjectionViewRefs;
  orderingEvidence: {
    orderingSource?: string;
    wallClockDefinesCausalOrder: boolean;
    appendSuccessIsAcceptance: boolean;
    derivedFromAutobaseView: boolean;
    collaborativeProjectionViewCandidate: boolean;
  };
  storageLanePosture: EdgeAutobaseStorageLanePosture;
  boundary: EdgeAutobaseProjectionViewBoundary;
  validation: EdgeAutobaseProjectionViewValidation;
  reviewStatus: EdgeAutobaseProjectionViewEvidenceStatus;
  warnings: string[];
  rejections: string[];
}

export interface BuildEdgeAutobaseProjectionViewEvidenceInput {
  projectionView: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "edge_autobase_projection_view";
const EXPECTED_SCHEMA = "edge_autobase_projection_view.v0";

export function buildEdgeAutobaseProjectionViewEvidenceArtifact(
  input: BuildEdgeAutobaseProjectionViewEvidenceInput,
): EdgeAutobaseProjectionViewEvidenceArtifact {
  const projectionView = isRecord(input.projectionView) ? input.projectionView : undefined;
  const refs = collectProjectionViewRefs(projectionView);
  const orderingEvidence = collectOrderingEvidence(projectionView);
  const storageLanePosture = collectStorageLanePosture(projectionView);
  const issues = validateProjectionView(projectionView, input.projectionView, refs, orderingEvidence);
  const status = determineStatus(projectionView, issues);
  const sourceArtifactKind = stringValue(projectionView?.artifactKind);
  const sourceSchema = stringValue(projectionView?.schemaVersion);
  const artifactId = input.artifactId ?? `causal-edge-autobase-projection-view-evidence:${hash(JSON.stringify({
    emittedAt: input.emittedAt,
    sourcePath: input.sourcePath,
    viewId: refs.viewId,
    sourceFrontierCandidateId: refs.sourceFrontierCandidateId,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(sourceArtifactKind ? { sourceArtifactKind } : {}),
      ...(sourceSchema ? { sourceSchema } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    projectionViewRefs: refs,
    orderingEvidence,
    storageLanePosture,
    boundary: buildBoundary(),
    validation: {
      status,
      parseableObject: projectionView !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      writerRefsPresent: issues.includes("writer-refs-missing") === false,
      headRefsPresent: issues.includes("head-refs-missing") === false,
      linearizedEntryRefsPresent: issues.includes("linearized-entry-refs-missing") === false,
      causalFrontierRefsPresent: issues.includes("causal-frontier-refs-missing") === false,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      sandboxedAutobaseViewPosturePresent: issues.includes("sandboxed-autobase-view-posture-missing-or-unsafe") === false,
      storageLanePosturePresent: issues.includes("storage-lane-posture-missing-or-unsafe") === false,
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("truth-authority-state-or-backend-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-autobase-projection-view-valid-evidence"
      ? "edge-autobase-projection-view-evidence-emitted"
      : status,
    warnings: buildWarnings(status),
    rejections: status === "edge-autobase-projection-view-valid-evidence" ? [] : issues,
  };
}

export function assertEdgeAutobaseProjectionViewEvidenceArtifact(
  value: unknown,
): asserts value is EdgeAutobaseProjectionViewEvidenceArtifact {
  const artifact = assertObject(value, "edge autobase projection view evidence artifact");
  assertEqual(artifact.artifactKind, CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_ARTIFACT_KIND, "artifactKind");
  assertEqual(artifact.schema, CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA, "schema");
  assertEqual(artifact.schemaVersion, CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  assertString(artifact.artifactId, "artifactId");
  assertString(artifact.emittedAt, "emittedAt");
  const boundary = assertObject(artifact.boundary, "boundary");
  assertEqual(boundary.reviewOnly, true, "boundary.reviewOnly");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.opensAutobase, false, "boundary.opensAutobase");
  assertEqual(boundary.opensCorestore, false, "boundary.opensCorestore");
  assertEqual(boundary.acceptsCanonicalHistory, false, "boundary.acceptsCanonicalHistory");
  assertEqual(boundary.claimsCausalTruth, false, "boundary.claimsCausalTruth");
  assertEqual(boundary.claimsDurableState, false, "boundary.claimsDurableState");
  assertEqual(boundary.claimsReplicatedState, false, "boundary.claimsReplicatedState");
}

function collectProjectionViewRefs(projectionView: JsonRecord | undefined): EdgeAutobaseProjectionViewRefs {
  const refs: EdgeAutobaseProjectionViewRefs = {
    writerRefs: stringArray(projectionView?.writerRefs),
    headRefs: stringArray(projectionView?.headRefs),
    linearizedEntryRefs: stringArray(projectionView?.linearizedEntryRefs),
    causalFrontierRefs: stringArray(projectionView?.causalFrontierRefs),
    sourceProjectionEventRefs: stringArray(projectionView?.sourceProjectionEventRefs),
    sourceEntryRefs: stringArray(projectionView?.sourceEntryRefs),
    sourceHappeningRefs: stringArray(projectionView?.sourceHappeningRefs),
  };
  const viewId = stringValue(projectionView?.viewId);
  const sourceFrontierCandidateId = stringValue(projectionView?.sourceFrontierCandidateId);
  const projectionLaneRef = stringValue(projectionView?.projectionLaneRef);
  const layerRef = stringValue(projectionView?.layerRef);
  const observerRef = stringValue(projectionView?.observerRef);
  if (viewId) refs.viewId = viewId;
  if (sourceFrontierCandidateId) refs.sourceFrontierCandidateId = sourceFrontierCandidateId;
  if (projectionLaneRef) refs.projectionLaneRef = projectionLaneRef;
  if (layerRef) refs.layerRef = layerRef;
  if (observerRef) refs.observerRef = observerRef;
  return refs;
}

function collectOrderingEvidence(projectionView: JsonRecord | undefined): EdgeAutobaseProjectionViewEvidenceArtifact["orderingEvidence"] {
  const posture = isRecord(projectionView?.viewPosture) ? projectionView.viewPosture : {};
  const orderingEvidence: EdgeAutobaseProjectionViewEvidenceArtifact["orderingEvidence"] = {
    wallClockDefinesCausalOrder: posture.wallClockDefinesCausalOrder === true,
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    derivedFromAutobaseView: posture.derivedFromAutobaseView === true,
    collaborativeProjectionViewCandidate: posture.collaborativeProjectionViewCandidate === true,
  };
  const orderingSource = stringValue(projectionView?.orderingSource);
  if (orderingSource) orderingEvidence.orderingSource = orderingSource;
  return orderingEvidence;
}

function validateProjectionView(
  projectionView: JsonRecord | undefined,
  original: unknown,
  refs: EdgeAutobaseProjectionViewRefs,
  orderingEvidence: EdgeAutobaseProjectionViewEvidenceArtifact["orderingEvidence"],
): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["projection-view-not-object"];
  if (!projectionView) return ["projection-view-not-object"];

  const posture = isRecord(projectionView.viewPosture) ? projectionView.viewPosture : {};
  const storageLanePosture = isRecord(projectionView.storageLanePosture) ? projectionView.storageLanePosture : {};
  const nonClaims = isRecord(projectionView.nonClaims) ? projectionView.nonClaims : {};
  const allRefs = [
    refs.viewId,
    refs.sourceFrontierCandidateId,
    refs.projectionLaneRef,
    refs.layerRef,
    refs.observerRef,
    ...refs.writerRefs,
    ...refs.headRefs,
    ...refs.linearizedEntryRefs,
    ...refs.causalFrontierRefs,
    ...refs.sourceProjectionEventRefs,
    ...refs.sourceEntryRefs,
    ...refs.sourceHappeningRefs,
  ].filter((ref): ref is string => Boolean(ref));

  if (projectionView.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (projectionView.schemaVersion !== EXPECTED_SCHEMA) issues.push("source-schema-mismatch");
  if (!refs.viewId) issues.push("view-id-missing");
  if (!refs.sourceFrontierCandidateId) issues.push("source-frontier-candidate-id-missing");
  if (refs.writerRefs.length < 2) issues.push("writer-refs-missing");
  if (refs.headRefs.length < 2) issues.push("head-refs-missing");
  if (refs.linearizedEntryRefs.length === 0) issues.push("linearized-entry-refs-missing");
  if (refs.causalFrontierRefs.length === 0) issues.push("causal-frontier-refs-missing");
  if (refs.sourceProjectionEventRefs.length === 0 || refs.sourceEntryRefs.length === 0 || refs.sourceHappeningRefs.length === 0) {
    issues.push("source-refs-missing");
  }
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");

  if (
    projectionView.viewState !== "autobase_projection_view_materialized" ||
    projectionView.orderingSource !== "autobase_linearization" ||
    posture.sandboxedAutobaseLab !== true ||
    posture.derivedFromAutobaseView !== true ||
    posture.collaborativeProjectionViewCandidate !== true ||
    posture.autobaseBackend !== true ||
    posture.writesAutobase !== true ||
    posture.writesDurableLocalLayerState !== false ||
    posture.productionLocalLayerState !== false ||
    posture.localStoreRootIsIntegrationSeam !== false ||
    posture.httpSeam !== false ||
    posture.sshSeam !== false ||
    posture.wallClockDefinesCausalOrder !== false ||
    posture.appendSuccessIsAcceptance !== false
  ) {
    issues.push("sandboxed-autobase-view-posture-missing-or-unsafe");
  }
  if (!validStorageLanePosture(storageLanePosture)) {
    issues.push("storage-lane-posture-missing-or-unsafe");
  }
  if (orderingEvidence.wallClockDefinesCausalOrder || orderingEvidence.appendSuccessIsAcceptance) {
    issues.push("wall-clock-or-append-success-ordering-overclaim");
  }
  if (
    nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.universalConsensusClaimed === true ||
    nonClaims.meshSettlementClaimed === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.canonicalHistoryClaimed === true ||
    nonClaims.runtimeAuthorityClaimed === true ||
    posture.durableStateClaimed === true ||
    posture.replicatedStateClaimed === true ||
    posture.canonicalHistoryClaimed === true
  ) {
    issues.push("truth-authority-state-or-backend-claim");
  }
  return [...new Set(issues)];
}

function determineStatus(
  projectionView: JsonRecord | undefined,
  issues: string[],
): EdgeAutobaseProjectionViewEvidenceStatus {
  if (!projectionView) return "edge-autobase-projection-view-malformed-evidence";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("truth-authority-state-or-backend-claim") ||
    issues.includes("sandboxed-autobase-view-posture-missing-or-unsafe") ||
    issues.includes("storage-lane-posture-missing-or-unsafe") ||
    issues.includes("wall-clock-or-append-success-ordering-overclaim")
  ) {
    return "edge-autobase-projection-view-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-autobase-projection-view-incomplete-evidence";
  return "edge-autobase-projection-view-valid-evidence";
}

function collectStorageLanePosture(projectionView: JsonRecord | undefined): EdgeAutobaseStorageLanePosture {
  const posture = isRecord(projectionView?.storageLanePosture) ? projectionView.storageLanePosture : {};
  const intendedStorageLane = stringValue(posture.intendedStorageLane);
  const inputSemanticUnit = stringValue(posture.inputSemanticUnit);
  const result: EdgeAutobaseStorageLanePosture = {
    requiresPromotedProjectionEventInput: posture.requiresPromotedProjectionEventInput === true,
    sandboxedOnly: posture.sandboxedOnly === true,
    productionBackendPromoted: posture.productionBackendPromoted === true,
    storageRecordPromoted: posture.storageRecordPromoted === true,
    edgeStateMigration: posture.edgeStateMigration === true,
    appendSuccessIsAcceptance: posture.appendSuccessIsAcceptance === true,
    linearizationIsTruth: posture.linearizationIsTruth === true,
    replicaVisibilityIsContinuity: posture.replicaVisibilityIsContinuity === true,
    wallClockDefinesCausalOrder: posture.wallClockDefinesCausalOrder === true,
    discoveryAbsenceIsFailure: posture.discoveryAbsenceIsFailure === true,
  };
  if (intendedStorageLane) result.intendedStorageLane = intendedStorageLane;
  if (inputSemanticUnit) result.inputSemanticUnit = inputSemanticUnit;
  return result;
}

function validStorageLanePosture(posture: JsonRecord): boolean {
  return posture.intendedStorageLane === "bounded_autobase_equivalent_linearization" &&
    posture.inputSemanticUnit === "mesh_ecology_local_layer_projection_event" &&
    posture.requiresPromotedProjectionEventInput === true &&
    posture.sandboxedOnly === true &&
    posture.productionBackendPromoted === false &&
    posture.storageRecordPromoted === false &&
    posture.edgeStateMigration === false &&
    posture.appendSuccessIsAcceptance === false &&
    posture.linearizationIsTruth === false &&
    posture.replicaVisibilityIsContinuity === false &&
    posture.wallClockDefinesCausalOrder === false &&
    posture.discoveryAbsenceIsFailure === false;
}

function buildBoundary(): EdgeAutobaseProjectionViewBoundary {
  return {
    reviewOnly: true,
    evidenceOnly: true,
    opensAutobase: false,
    opensCorestore: false,
    callsEdge: false,
    writesContinuityRecords: false,
    acceptsCanonicalHistory: false,
    claimsCausalTruth: false,
    claimsDurableState: false,
    claimsReplicatedState: false,
    claimsRuntimeAuthority: false,
    startsBackend: false,
    publishesToMesh: false,
  };
}

function buildWarnings(status: EdgeAutobaseProjectionViewEvidenceStatus): string[] {
  if (status === "edge-autobase-projection-view-valid-evidence") {
    return [
      "autobase-projection-view-preserved-as-collaborative-continuity-evidence-only",
      "causal-substrate-does-not-open-autobase-corestore-or-edge-runtime",
      "sandboxed-autobase-view-is-not-durable-local-layer-state",
    ];
  }
  return ["autobase-projection-view-not-accepted-as-causal-history"];
}

function unsafeSeamRef(ref: string): boolean {
  return /https?:\/\/|ssh:\/\/|\/|\\|localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+/iu.test(ref);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim() !== "") : [];
}

function assertObject(value: unknown, label: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) throw new Error(`${label} must be ${String(expected)}`);
}

function assertString(value: unknown, label: string): void {
  if (!stringValue(value)) throw new Error(`${label} must be a non-empty string`);
}
