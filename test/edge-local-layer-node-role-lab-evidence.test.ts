import assert from "node:assert/strict";
import test from "node:test";

import { buildEdgeLocalLayerNodeRoleLabEvidenceArtifact } from "../src/index.js";

function validLabResult(): any {
  const admittedWriterRef = "autobase-writer:admitted-device";
  const candidateWriterRef = "autobase-writer:candidate-device";
  const observerWriterRef = "autobase-writer:observer-device";
  return {
    artifactKind: "edge_sandboxed_local_layer_node_role_lab_result",
    schemaVersion: "edge_sandboxed_local_layer_node_role_lab_result.v0",
    labStatus: "local_layer_node_roles_materialized",
    sourceStorageLaneCandidateRef: "edge-local-layer-storage-lane-candidate:aaaaaaaaaaaaaaaaaaaaaaaa",
    acceptedApplyRecordCount: 1,
    rejectedReviewRecordCount: 1,
    observerObservedAcceptedCount: 1,
    nodeRefs: {
      authorityNodeRef: "autobase-writer:authority-device",
      admittedWriterRef,
      candidateWriterRef,
      observerWriterRef,
    },
    nodeRoles: {
      observerOnlyNode: {
        writerRef: observerWriterRef,
        canObserveAcceptedView: true,
        writableBeforeAdmission: false,
        writableAfterAdmission: false,
        appendAttempted: false,
        acceptedContinuityInput: false,
        authorityGranted: false,
      },
      candidateWriterNode: {
        writerRef: candidateWriterRef,
        canObserveAcceptedView: true,
        writableBeforeAdmission: true,
        writableAfterAdmission: true,
        appendAttempted: true,
        acceptedContinuityInput: false,
        rejectedAsReviewEvidence: true,
        authorityGranted: false,
      },
      admittedWriterNode: {
        writerRef: admittedWriterRef,
        canObserveAcceptedView: true,
        writableBeforeAdmission: true,
        writableAfterAdmission: true,
        appendAttempted: true,
        acceptedContinuityInput: true,
        authorityGranted: false,
      },
    },
    rolePosture: {
      observabilityIsAuthority: false,
      observabilityIsWritability: false,
      writabilityIsAuthority: false,
      appendSuccessIsAcceptance: false,
      deterministicApplyOwnsAcceptance: true,
      operatorWriterAdmissionRequired: true,
      candidateWriterAppendVisibleAsReviewEvidence: true,
      derivedViewIncludesAcceptedOnly: true,
    },
    labPosture: {
      sandboxedAutobaseLab: true,
      localLayerNodeRoleLab: true,
      disposableStorage: true,
      rejectedCandidateReviewSource: "proposal_side_apply_validation_not_accepted_view",
      productionLocalLayerState: false,
      writesDurableLocalLayerState: false,
      migratesEdgeState: false,
      opensHttp: false,
      opensSsh: false,
      localStoreRootIsIntegrationSeam: false,
      inProcessReplicationOnly: true,
      hyperdhtFutureTransportCandidate: true,
      hyperswarmFutureTransportCandidate: true,
      appendSuccessIsAcceptance: false,
      authoritySource: "deterministic_apply_and_operator_writer_admission_policy",
    },
    projectionView: {
      artifactKind: "edge_local_layer_node_role_projection_view",
      schemaVersion: "edge_local_layer_node_role_projection_view.v0",
      viewId: "edge-local-layer-node-role-view:aaaaaaaaaaaaaaaaaaaaaaaa",
      viewState: "local_layer_node_role_projection_view_materialized",
      sourceStorageLaneCandidateRef: "edge-local-layer-storage-lane-candidate:aaaaaaaaaaaaaaaaaaaaaaaa",
      acceptedProjectionRecordCount: 1,
      rejectedReviewRecordCount: 1,
      observerObservedAcceptedCount: 1,
      acceptedProjectionRecords: [{
        recordKind: "edge_local_layer_node_role_projection_record",
        sourceProjectionEventRef: "projection:mesh-ecology-edge:node-role-lab:accepted",
        sourceLogEntryRef: "projection-log-entry:node-role-lab:accepted:0",
        laneEntryRef: "edge-local-layer-projection-lane-entry:accepted",
        applyResultRef: "edge-local-layer-projection-lane-apply:accepted",
        writerRef: admittedWriterRef,
        nodeRole: "admitted_writer_node",
        acceptedByDerivedView: true,
        linearizedEntryRef: "node-role-linearized-entry:0:accepted",
        appendSuccessIsAcceptance: false,
      }],
      rejectedReviewRefs: ["node-role-rejected-review:0:candidate"],
      rejectedReviewRecords: [{
        writerRef: candidateWriterRef,
        nodeRole: "candidate_writer_node",
        sourceProjectionEventRef: "projection:mesh-ecology-edge:node-role-lab:candidate",
        applyResultRef: "edge-local-layer-projection-lane-apply:candidate",
        applyState: "rejected_projection_lane_input",
        validationIssues: ["writer-not-admitted"],
        acceptedByDerivedView: false,
        reviewOnly: true,
      }],
      nodeRoles: {},
      rolePosture: {
        appendSuccessIsAcceptance: false,
      },
      viewPosture: {
        sandboxedAutobaseLab: true,
        derivedFromAcceptedApplyRecords: true,
        productionLocalLayerState: false,
        durableStateClaimed: false,
        replicatedStateClaimed: false,
        canonicalHistoryClaimed: false,
        localPathSeam: false,
        httpSeam: false,
        sshSeam: false,
        wallClockDefinesCausalOrder: false,
      },
      nonClaims: {
        truthClaimed: false,
        completionClaimed: false,
        authorityGranted: false,
        writerAuthorityGranted: false,
        durableStateClaimed: false,
        replicatedStateClaimed: false,
        canonicalHistoryClaimed: false,
      },
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      writerAuthorityGranted: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      canonicalHistoryClaimed: false,
      runtimeAuthorityClaimed: false,
      meshSettlementClaimed: false,
    },
  };
}

test("Edge local-layer node role lab imports as causal role-separation evidence only", () => {
  const artifact = buildEdgeLocalLayerNodeRoleLabEvidenceArtifact({
    nodeRoleLabResult: validLabResult(),
    emittedAt: "2026-05-17T13:00:00.000Z",
  });

  assert.equal(artifact.artifactKind, "causal-edge-local-layer-node-role-lab-evidence");
  assert.equal(artifact.schema, "causal-substrate/edge-local-layer-node-role-lab-evidence/v1");
  assert.equal(artifact.reviewStatus, "edge-local-layer-node-role-lab-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-local-layer-node-role-lab-valid-evidence");
  assert.equal(artifact.roleSeparation.observabilityIsAuthority, false);
  assert.equal(artifact.roleSeparation.writabilityIsAuthority, false);
  assert.equal(artifact.roleSeparation.appendSuccessIsAcceptance, false);
  assert.equal(artifact.roleSeparation.observerAcceptedContinuityInput, false);
  assert.equal(artifact.roleSeparation.candidateAcceptedContinuityInput, false);
  assert.equal(artifact.roleSeparation.admittedAcceptedContinuityInput, true);
  assert.equal(artifact.causalInterpretation.deviceBranchesRemainDeviceOwned, true);
  assert.equal(artifact.causalInterpretation.localLayerStoresProjectionRefs, true);
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
});

test("Edge local-layer node role lab blocks role and acceptance overclaims", () => {
  const lab = validLabResult();
  lab.rolePosture.observabilityIsAuthority = true;
  lab.rolePosture.appendSuccessIsAcceptance = true;
  lab.nodeRoles.candidateWriterNode.acceptedContinuityInput = true;

  const artifact = buildEdgeLocalLayerNodeRoleLabEvidenceArtifact({
    nodeRoleLabResult: lab,
    emittedAt: "2026-05-17T13:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-node-role-lab-guardrail-blocked");
  assert.ok(artifact.rejections.includes("role-separation-missing-or-unsafe"));
});

test("Edge local-layer node role lab blocks unsafe seams and state claims", () => {
  const lab = validLabResult();
  lab.nodeRefs.observerWriterRef = "http://127.0.0.1:8787/observer";
  lab.labPosture.productionLocalLayerState = true;
  lab.nonClaims.durableStateClaimed = true;

  const artifact = buildEdgeLocalLayerNodeRoleLabEvidenceArtifact({
    nodeRoleLabResult: lab,
    emittedAt: "2026-05-17T13:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-node-role-lab-guardrail-blocked");
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.ok(artifact.rejections.includes("lab-posture-overclaim"));
  assert.ok(artifact.rejections.includes("truth-authority-state-or-backend-claim"));
});

test("Edge local-layer node role lab reports missing refs as incomplete", () => {
  const lab = validLabResult();
  lab.projectionView.acceptedProjectionRecords = [];
  lab.projectionView.acceptedProjectionRecordCount = 0;

  const artifact = buildEdgeLocalLayerNodeRoleLabEvidenceArtifact({
    nodeRoleLabResult: lab,
    emittedAt: "2026-05-17T13:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-node-role-lab-incomplete-evidence");
  assert.ok(artifact.rejections.includes("source-refs-missing"));
  assert.ok(artifact.rejections.includes("accepted-only-view-missing-or-unsafe"));
});
