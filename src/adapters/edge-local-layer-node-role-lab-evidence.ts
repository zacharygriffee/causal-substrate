import { createHash } from "node:crypto";

export const CAUSAL_EDGE_LOCAL_LAYER_NODE_ROLE_LAB_EVIDENCE_SCHEMA =
  "causal-substrate/edge-local-layer-node-role-lab-evidence/v1" as const;

export const CAUSAL_EDGE_LOCAL_LAYER_NODE_ROLE_LAB_EVIDENCE_SCHEMA_VERSION = 1 as const;

export const CAUSAL_EDGE_LOCAL_LAYER_NODE_ROLE_LAB_EVIDENCE_ARTIFACT_KIND =
  "causal-edge-local-layer-node-role-lab-evidence" as const;

export type EdgeLocalLayerNodeRoleLabEvidenceStatus =
  | "edge-local-layer-node-role-lab-evidence-emitted"
  | "edge-local-layer-node-role-lab-valid-evidence"
  | "edge-local-layer-node-role-lab-incomplete-evidence"
  | "edge-local-layer-node-role-lab-malformed-evidence"
  | "edge-local-layer-node-role-lab-guardrail-blocked";

type JsonRecord = Record<string, unknown>;

const EXPECTED_ARTIFACT_KIND = "edge_sandboxed_local_layer_node_role_lab_result";
const EXPECTED_SCHEMA = "edge_sandboxed_local_layer_node_role_lab_result.v0";
const EXPECTED_VIEW_KIND = "edge_local_layer_node_role_projection_view";
const EXPECTED_VIEW_SCHEMA = "edge_local_layer_node_role_projection_view.v0";

export interface BuildEdgeLocalLayerNodeRoleLabEvidenceInput {
  nodeRoleLabResult: unknown;
  emittedAt: string;
  artifactId?: string;
  sourcePath?: string;
}

export function buildEdgeLocalLayerNodeRoleLabEvidenceArtifact(
  input: BuildEdgeLocalLayerNodeRoleLabEvidenceInput,
) {
  const lab = isRecord(input.nodeRoleLabResult) ? input.nodeRoleLabResult : undefined;
  const refs = collectRefs(lab);
  const issues = validateLab(lab, input.nodeRoleLabResult, refs);
  const status = determineStatus(lab, issues);
  const artifactId = input.artifactId ?? `causal-edge-local-layer-node-role-lab-evidence:${hash(JSON.stringify({
    emittedAt: input.emittedAt,
    sourcePath: input.sourcePath,
    sourceStorageLaneCandidateRef: refs.sourceStorageLaneCandidateRef,
    projectionViewRef: refs.projectionViewRef,
  })).slice(0, 16)}`;

  return {
    artifactKind: CAUSAL_EDGE_LOCAL_LAYER_NODE_ROLE_LAB_EVIDENCE_ARTIFACT_KIND,
    schema: CAUSAL_EDGE_LOCAL_LAYER_NODE_ROLE_LAB_EVIDENCE_SCHEMA,
    schemaVersion: CAUSAL_EDGE_LOCAL_LAYER_NODE_ROLE_LAB_EVIDENCE_SCHEMA_VERSION,
    artifactId,
    emittedAt: input.emittedAt,
    source: {
      sourceRepo: "mesh-ecology-edge",
      ...(lab?.artifactKind === EXPECTED_ARTIFACT_KIND ? { sourceArtifactKind: EXPECTED_ARTIFACT_KIND } : {}),
      ...(lab?.schemaVersion === EXPECTED_SCHEMA ? { sourceSchema: EXPECTED_SCHEMA } : {}),
      ...(input.sourcePath ? { sourcePath: input.sourcePath } : {}),
    },
    refs,
    roleSeparation: collectRoleSeparation(lab),
    causalInterpretation: {
      interpretationKind: "observer_relative_local_layer_node_role_evidence",
      acceptedContinuityInputKind: "mesh_ecology_local_layer_projection_event",
      storageEnvelopeKind: "edge_local_layer_projection_lane_entry",
      observerRelative: true,
      branchRelative: true,
      sourceShareBoundaryPreserved: true,
      deviceBranchesRemainDeviceOwned: true,
      localLayerStoresProjectionRefs: true,
      causalSubstrateOwnsBackend: false,
      causalSubstrateAcceptsTruth: false,
      acceptanceSource: "deterministic_apply_and_operator_writer_admission_policy",
    },
    boundary: {
      reviewOnly: true,
      evidenceOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      callsEdge: false,
      writesContinuityRecords: false,
      acceptsCanonicalHistory: false,
      claimsCausalTruth: false,
      claimsAuthority: false,
      claimsDurableState: false,
      claimsReplicatedState: false,
      startsBackend: false,
      migratesEdgeState: false,
    },
    validation: {
      status,
      parseableObject: lab !== undefined,
      expectedSourceSchemaPresent: issues.includes("source-schema-mismatch") === false,
      projectionViewPresent: issues.includes("projection-view-missing-or-mismatch") === false,
      sourceRefsPresent: issues.includes("source-refs-missing") === false,
      nodeRoleRefsPresent: issues.includes("node-role-refs-missing") === false,
      roleSeparationPresent: issues.includes("role-separation-missing-or-unsafe") === false,
      acceptedOnlyViewPresent: issues.includes("accepted-only-view-missing-or-unsafe") === false,
      rejectedReviewEvidencePresent: issues.includes("rejected-review-evidence-missing") === false,
      labPostureSafe: issues.includes("lab-posture-overclaim") === false,
      unsafeSeamRefsBlocked: issues.includes("unsafe-seam-ref") === false,
      unsafeClaimsBlocked: issues.includes("truth-authority-state-or-backend-claim") === false,
      issues,
    },
    reviewStatus: status === "edge-local-layer-node-role-lab-valid-evidence"
      ? "edge-local-layer-node-role-lab-evidence-emitted"
      : status,
    warnings: status === "edge-local-layer-node-role-lab-valid-evidence"
      ? [
          "node-role-lab-preserved-as-causal-role-separation-evidence",
          "observability-writability-and-authority-remain-distinct",
          "autobase-append-success-is-not-semantic-acceptance",
          "causal-substrate-does-not-own-local-layer-backend",
        ]
      : ["node-role-lab-not-accepted-as-causal-evidence"],
    rejections: status === "edge-local-layer-node-role-lab-valid-evidence" ? [] : issues,
  };
}

function validateLab(
  lab: JsonRecord | undefined,
  original: unknown,
  refs: ReturnType<typeof collectRefs>,
): string[] {
  const issues: string[] = [];
  if (!isRecord(original)) return ["node-role-lab-not-object"];
  if (!lab) return ["node-role-lab-not-object"];

  const projectionView = isRecord(lab.projectionView) ? lab.projectionView : {};
  const labPosture = isRecord(lab.labPosture) ? lab.labPosture : {};
  const nonClaims = isRecord(lab.nonClaims) ? lab.nonClaims : {};
  const projectionViewNonClaims = isRecord(projectionView.nonClaims) ? projectionView.nonClaims : {};
  const projectionViewPosture = isRecord(projectionView.viewPosture) ? projectionView.viewPosture : {};
  const allRefs = [
    refs.sourceStorageLaneCandidateRef,
    refs.projectionViewRef,
    ...Object.values(refs.nodeRefs).filter((ref): ref is string => Boolean(ref)),
    ...refs.acceptedProjectionRecordRefs,
    ...refs.acceptedLogEntryRefs,
    ...refs.acceptedLaneEntryRefs,
    ...refs.acceptedApplyResultRefs,
    ...refs.acceptedWriterRefs,
    ...refs.rejectedReviewRefs,
    ...refs.rejectedWriterRefs,
  ].filter((ref): ref is string => typeof ref === "string" && ref.trim() !== "");

  if (lab.artifactKind !== EXPECTED_ARTIFACT_KIND) issues.push("artifact-kind-mismatch");
  if (lab.schemaVersion !== EXPECTED_SCHEMA) issues.push("source-schema-mismatch");
  if (lab.labStatus !== "local_layer_node_roles_materialized") issues.push("lab-status-mismatch");
  if (projectionView.artifactKind !== EXPECTED_VIEW_KIND || projectionView.schemaVersion !== EXPECTED_VIEW_SCHEMA) {
    issues.push("projection-view-missing-or-mismatch");
  }
  if (!refs.sourceStorageLaneCandidateRef || !refs.projectionViewRef || refs.acceptedProjectionRecordRefs.length === 0) {
    issues.push("source-refs-missing");
  }
  if (Object.values(refs.nodeRefs).filter(Boolean).length < 4) issues.push("node-role-refs-missing");
  if (allRefs.some(unsafeSeamRef)) issues.push("unsafe-seam-ref");
  if (!validRoleSeparation(lab, projectionView)) issues.push("role-separation-missing-or-unsafe");
  if (!validAcceptedOnlyView(lab, projectionView)) issues.push("accepted-only-view-missing-or-unsafe");
  if (!validRejectedReviewEvidence(lab, projectionView)) issues.push("rejected-review-evidence-missing");
  if (!validLabPosture(labPosture, projectionViewPosture)) issues.push("lab-posture-overclaim");
  if (claimsAuthorityTruthOrState(nonClaims) || claimsAuthorityTruthOrState(projectionViewNonClaims)) {
    issues.push("truth-authority-state-or-backend-claim");
  }
  return [...new Set(issues)];
}

function determineStatus(
  lab: JsonRecord | undefined,
  issues: string[],
): EdgeLocalLayerNodeRoleLabEvidenceStatus {
  if (!lab) return "edge-local-layer-node-role-lab-malformed-evidence";
  if (
    issues.includes("unsafe-seam-ref") ||
    issues.includes("role-separation-missing-or-unsafe") ||
    issues.includes("lab-posture-overclaim") ||
    issues.includes("truth-authority-state-or-backend-claim")
  ) {
    return "edge-local-layer-node-role-lab-guardrail-blocked";
  }
  if (issues.length > 0) return "edge-local-layer-node-role-lab-incomplete-evidence";
  return "edge-local-layer-node-role-lab-valid-evidence";
}

function collectRefs(lab: JsonRecord | undefined) {
  const projectionView = isRecord(lab?.projectionView) ? lab.projectionView : {};
  const acceptedRecords = Array.isArray(projectionView.acceptedProjectionRecords)
    ? projectionView.acceptedProjectionRecords.filter(isRecord)
    : [];
  const rejectedRecords = Array.isArray(projectionView.rejectedReviewRecords)
    ? projectionView.rejectedReviewRecords.filter(isRecord)
    : [];
  const nodeRefs = isRecord(lab?.nodeRefs) ? lab.nodeRefs : {};
  return {
    sourceStorageLaneCandidateRef: stringValue(lab?.sourceStorageLaneCandidateRef),
    projectionViewRef: stringValue(projectionView.viewId),
    nodeRefs: {
      authorityNodeRef: stringValue(nodeRefs.authorityNodeRef),
      admittedWriterRef: stringValue(nodeRefs.admittedWriterRef),
      candidateWriterRef: stringValue(nodeRefs.candidateWriterRef),
      observerWriterRef: stringValue(nodeRefs.observerWriterRef),
    },
    acceptedProjectionRecordRefs: stringArrayFromRecords(acceptedRecords, "sourceProjectionEventRef"),
    acceptedLogEntryRefs: stringArrayFromRecords(acceptedRecords, "sourceLogEntryRef"),
    acceptedLaneEntryRefs: stringArrayFromRecords(acceptedRecords, "laneEntryRef"),
    acceptedApplyResultRefs: stringArrayFromRecords(acceptedRecords, "applyResultRef"),
    acceptedWriterRefs: stringArrayFromRecords(acceptedRecords, "writerRef"),
    acceptedLinearizedEntryRefs: stringArrayFromRecords(acceptedRecords, "linearizedEntryRef"),
    rejectedReviewRefs: stringArray(projectionView.rejectedReviewRefs),
    rejectedWriterRefs: stringArrayFromRecords(rejectedRecords, "writerRef"),
  };
}

function collectRoleSeparation(lab: JsonRecord | undefined) {
  const rolePosture = isRecord(lab?.rolePosture) ? lab.rolePosture : {};
  const nodeRoles = isRecord(lab?.nodeRoles) ? lab.nodeRoles : {};
  return {
    observabilityIsAuthority: rolePosture.observabilityIsAuthority === true,
    observabilityIsWritability: rolePosture.observabilityIsWritability === true,
    writabilityIsAuthority: rolePosture.writabilityIsAuthority === true,
    appendSuccessIsAcceptance: rolePosture.appendSuccessIsAcceptance === true,
    deterministicApplyOwnsAcceptance: rolePosture.deterministicApplyOwnsAcceptance === true,
    operatorWriterAdmissionRequired: rolePosture.operatorWriterAdmissionRequired === true,
    candidateWriterAppendVisibleAsReviewEvidence: rolePosture.candidateWriterAppendVisibleAsReviewEvidence === true,
    derivedViewIncludesAcceptedOnly: rolePosture.derivedViewIncludesAcceptedOnly === true,
    observerCanObserveAcceptedView: isRecord(nodeRoles.observerOnlyNode) && nodeRoles.observerOnlyNode.canObserveAcceptedView === true,
    observerAcceptedContinuityInput: isRecord(nodeRoles.observerOnlyNode) && nodeRoles.observerOnlyNode.acceptedContinuityInput === true,
    candidateAppendAttempted: isRecord(nodeRoles.candidateWriterNode) && nodeRoles.candidateWriterNode.appendAttempted === true,
    candidateAcceptedContinuityInput: isRecord(nodeRoles.candidateWriterNode) && nodeRoles.candidateWriterNode.acceptedContinuityInput === true,
    admittedAcceptedContinuityInput: isRecord(nodeRoles.admittedWriterNode) && nodeRoles.admittedWriterNode.acceptedContinuityInput === true,
  };
}

function validRoleSeparation(lab: JsonRecord, projectionView: JsonRecord): boolean {
  const rolePosture = isRecord(lab.rolePosture) ? lab.rolePosture : {};
  const viewRolePosture = isRecord(projectionView.rolePosture) ? projectionView.rolePosture : {};
  const nodeRoles = isRecord(lab.nodeRoles) ? lab.nodeRoles : {};
  const observer = isRecord(nodeRoles.observerOnlyNode) ? nodeRoles.observerOnlyNode : {};
  const candidate = isRecord(nodeRoles.candidateWriterNode) ? nodeRoles.candidateWriterNode : {};
  const admitted = isRecord(nodeRoles.admittedWriterNode) ? nodeRoles.admittedWriterNode : {};

  return rolePosture.observabilityIsAuthority === false &&
    rolePosture.observabilityIsWritability === false &&
    rolePosture.writabilityIsAuthority === false &&
    rolePosture.appendSuccessIsAcceptance === false &&
    rolePosture.deterministicApplyOwnsAcceptance === true &&
    rolePosture.operatorWriterAdmissionRequired === true &&
    rolePosture.candidateWriterAppendVisibleAsReviewEvidence === true &&
    rolePosture.derivedViewIncludesAcceptedOnly === true &&
    viewRolePosture.appendSuccessIsAcceptance === false &&
    observer.canObserveAcceptedView === true &&
    observer.appendAttempted === false &&
    observer.acceptedContinuityInput === false &&
    observer.authorityGranted === false &&
    candidate.appendAttempted === true &&
    candidate.acceptedContinuityInput === false &&
    candidate.rejectedAsReviewEvidence === true &&
    candidate.authorityGranted === false &&
    admitted.appendAttempted === true &&
    admitted.acceptedContinuityInput === true &&
    admitted.authorityGranted === false;
}

function validAcceptedOnlyView(lab: JsonRecord, projectionView: JsonRecord): boolean {
  const acceptedCount = numberValue(lab.acceptedApplyRecordCount);
  const rejectedCount = numberValue(lab.rejectedReviewRecordCount);
  const observerCount = numberValue(lab.observerObservedAcceptedCount);
  const viewAcceptedCount = numberValue(projectionView.acceptedProjectionRecordCount);
  const acceptedRecords = Array.isArray(projectionView.acceptedProjectionRecords)
    ? projectionView.acceptedProjectionRecords.filter(isRecord)
    : [];

  return acceptedCount > 0 &&
    rejectedCount > 0 &&
    observerCount >= acceptedCount &&
    viewAcceptedCount === acceptedCount &&
    acceptedRecords.length === acceptedCount &&
    acceptedRecords.every((record) =>
      record.acceptedByDerivedView === true &&
      record.appendSuccessIsAcceptance === false &&
      typeof record.sourceProjectionEventRef === "string" &&
      typeof record.sourceLogEntryRef === "string" &&
      typeof record.applyResultRef === "string" &&
      typeof record.writerRef === "string"
    );
}

function validRejectedReviewEvidence(lab: JsonRecord, projectionView: JsonRecord): boolean {
  const rejectedCount = numberValue(lab.rejectedReviewRecordCount);
  const rejectedRefs = stringArray(projectionView.rejectedReviewRefs);
  const rejectedRecords = Array.isArray(projectionView.rejectedReviewRecords)
    ? projectionView.rejectedReviewRecords.filter(isRecord)
    : [];

  return rejectedCount > 0 &&
    rejectedRefs.length === rejectedCount &&
    rejectedRecords.length === rejectedCount &&
    rejectedRecords.every((record) =>
      record.acceptedByDerivedView === false &&
      record.reviewOnly === true &&
      typeof record.writerRef === "string" &&
      typeof record.sourceProjectionEventRef === "string" &&
      typeof record.applyResultRef === "string"
    );
}

function validLabPosture(labPosture: JsonRecord, viewPosture: JsonRecord): boolean {
  return labPosture.sandboxedAutobaseLab === true &&
    labPosture.localLayerNodeRoleLab === true &&
    labPosture.disposableStorage === true &&
    labPosture.productionLocalLayerState === false &&
    labPosture.writesDurableLocalLayerState === false &&
    labPosture.migratesEdgeState === false &&
    labPosture.opensHttp === false &&
    labPosture.opensSsh === false &&
    labPosture.localStoreRootIsIntegrationSeam === false &&
    labPosture.appendSuccessIsAcceptance === false &&
    labPosture.authoritySource === "deterministic_apply_and_operator_writer_admission_policy" &&
    viewPosture.sandboxedAutobaseLab === true &&
    viewPosture.derivedFromAcceptedApplyRecords === true &&
    viewPosture.productionLocalLayerState === false &&
    viewPosture.durableStateClaimed === false &&
    viewPosture.replicatedStateClaimed === false &&
    viewPosture.canonicalHistoryClaimed === false &&
    viewPosture.localPathSeam === false &&
    viewPosture.httpSeam === false &&
    viewPosture.sshSeam === false &&
    viewPosture.wallClockDefinesCausalOrder === false;
}

function claimsAuthorityTruthOrState(nonClaims: JsonRecord): boolean {
  return nonClaims.truthClaimed === true ||
    nonClaims.completionClaimed === true ||
    nonClaims.authorityGranted === true ||
    nonClaims.writerAuthorityGranted === true ||
    nonClaims.durableStateClaimed === true ||
    nonClaims.replicatedStateClaimed === true ||
    nonClaims.canonicalHistoryClaimed === true ||
    nonClaims.runtimeAuthorityClaimed === true ||
    nonClaims.meshSettlementClaimed === true;
}

function unsafeSeamRef(ref: string): boolean {
  return /:\/\/|\/|\\|localhost|127\.0\.0\.1|ssh|http/iu.test(ref);
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

function stringArrayFromRecords(records: JsonRecord[], key: string): string[] {
  return records.map((record) => stringValue(record[key])).filter((entry): entry is string => Boolean(entry));
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) ? value : 0;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
