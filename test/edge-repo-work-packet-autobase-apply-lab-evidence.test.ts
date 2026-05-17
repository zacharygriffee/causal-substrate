import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeRepoWorkPacketAutobaseApplyLabEvidenceArtifact,
  CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-17T18:00:00.000Z";

function labResult() {
  return {
    artifactKind: "edge_sandboxed_autobase_repo_work_packet_projection_log_apply_lab_result",
    schemaVersion: "edge_sandboxed_autobase_repo_work_packet_projection_log_apply_lab_result.v0",
    labStatus: "autobase_apply_record_materialized",
    materializedRecordCount: 1,
    writerRefs: ["autobase-writer:aaaaaaaa"],
    headRefs: ["autobase-head:autobase-writer-aaaaaaaa:length-1:bbbbbbbb"],
    linearizedEntryRefs: ["autobase-linearized-entry:repo-work-packet-apply:0:aaaaaaaa"],
    sourceApplyResultRef: "edge-repo-work-packet-projection-log-apply-result:aaaaaaaaaaaaaaaaaaaaaaaa",
    sourceCandidateRef: {
      kind: "edge_repo_work_packet_projection_log_candidate",
      id: "edge-repo-work-packet-projection-log-candidate:aaaaaaaaaaaaaaaaaaaaaaaa",
      hash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    sourceAppendRef: {
      kind: "edge_repo_work_packet_projection_log_lab_append_record",
      id: "edge-repo-work-packet-projection-log-lab-append:aaaaaaaaaaaaaaaaaaaaaaaa",
      hash: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    },
    labPosture: {
      sandboxedAutobaseLab: true,
      autobaseBackend: true,
      writesAutobase: true,
      derivedViewMaterialized: true,
      productionCheckpointReached: true,
      productionLocalLayerState: false,
      writesDurableLocalLayerState: false,
      localStoreRootIsIntegrationSeam: false,
      httpSeam: false,
      sshSeam: false,
      wallClockDefinesCausalOrder: false,
      appendSuccessIsAcceptance: false,
      applySuccessIsTruth: false,
      labResultIsReadiness: false,
    },
    productionPromotionCheckpoint: {
      checkpointRef: "edge-local-layer-production-checkpoint:repo-work-packet-projection-log-apply:aaaaaaaa",
      checkpointState: "pre_production_autobase_apply_lab_passed",
      nextCheckpoint: "production_local_layer_lane_promotion_decision",
      productionIsExpectedFutureWork: true,
      promotionDecisionStillRequired: true,
      requiredBeforePromotion: [
        "explicit_writer_admission_policy",
        "operator_recorded_promotion_decision",
      ],
    },
    storageLanePosture: {
      intendedStorageLane: "bounded_autobase_equivalent_linearization",
      inputSemanticUnit: "mesh_ecology_local_layer_continuity_event",
      productionBackendPromoted: false,
      productionPromotionCheckpointReached: true,
      storageRecordPromoted: false,
      edgeStateMigration: false,
      appendSuccessIsAcceptance: false,
      linearizationIsTruth: false,
      replicaVisibilityIsContinuity: false,
      wallClockDefinesCausalOrder: false,
    },
    nonClaims: {
      truthClaimed: false,
      authorityGranted: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      canonicalHistoryClaimed: false,
    },
  };
}

test("imports sandboxed repo-work-packet Autobase apply lab as pre-production checkpoint evidence", () => {
  const evidence = buildEdgeRepoWorkPacketAutobaseApplyLabEvidenceArtifact({
    labResult: labResult(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_ARTIFACT_KIND);
  assert.equal(evidence.schema, CAUSAL_EDGE_REPO_WORK_PACKET_AUTOBASE_APPLY_LAB_EVIDENCE_SCHEMA);
  assert.equal(evidence.reviewStatus, "edge-repo-work-packet-autobase-apply-lab-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-repo-work-packet-autobase-apply-lab-valid-evidence");
  assert.equal(evidence.validation.sandboxAutobaseObserved, true);
  assert.equal(evidence.validation.checkpointPresent, true);
  assert.equal(evidence.productionPromotionCheckpoint.productionIsExpectedFutureWork, true);
  assert.equal(evidence.productionPromotionCheckpoint.promotionDecisionStillRequired, true);
  assert.equal(evidence.boundary.opensAutobase, false);
  assert.equal(evidence.boundary.startsProductionBackend, false);
  assert.equal(evidence.boundary.claimsCausalTruth, false);
});

test("blocks production continuity overclaims at the checkpoint", () => {
  const result = labResult();
  result.labPosture.productionLocalLayerState = true;
  result.storageLanePosture.productionBackendPromoted = true;
  result.nonClaims.durableStateClaimed = true;
  const evidence = buildEdgeRepoWorkPacketAutobaseApplyLabEvidenceArtifact({
    labResult: result,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-repo-work-packet-autobase-apply-lab-guardrail-blocked");
  assert.equal(evidence.validation.noProductionOverclaim, false);
  assert.equal(evidence.rejections.includes("production-continuity-or-authority-overclaim"), true);
});

test("blocks unsafe refs and missing production checkpoint", () => {
  const result = labResult();
  result.sourceApplyResultRef = "http://127.0.0.1:8787/apply";
  result.productionPromotionCheckpoint.productionIsExpectedFutureWork = false;
  const evidence = buildEdgeRepoWorkPacketAutobaseApplyLabEvidenceArtifact({
    labResult: result,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-repo-work-packet-autobase-apply-lab-guardrail-blocked");
  assert.equal(evidence.validation.refsSafe, false);
  assert.equal(evidence.validation.checkpointPresent, false);
});
