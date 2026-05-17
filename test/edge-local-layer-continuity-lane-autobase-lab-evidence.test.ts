import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeLocalLayerContinuityLaneAutobaseLabEvidenceArtifact,
  CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-17T19:00:00.000Z";

function labResult() {
  return {
    artifactKind: "edge_local_layer_continuity_lane_autobase_lab_result",
    schemaVersion: "edge_local_layer_continuity_lane_autobase_lab_result.v0",
    labStatus: "continuity_lane_entry_materialized_in_sandboxed_autobase",
    laneEntry: {
      artifactKind: "mesh_ecology_local_layer_lane_entry",
      schemaVersion: "mesh_ecology_local_layer_lane_entry.v0",
      entryId: "local-layer-continuity-lane-entry:aaaaaaaaaaaaaaaaaaaaaaaa",
      entryHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      laneRef: "local-layer-continuity-lane:operator-owned-devices-lab",
      namespaceRef: "corestore-namespace:local-layer-continuity-lab",
      writerRef: "autobase-writer:aaaaaaaa",
      sequence: 0,
      semanticEventKind: "mesh_ecology_local_layer_continuity_event",
      semanticEventSchema: "edge-local-layer-continuity-event-draft.v0",
      semanticEventRef: "continuity:edge-repo-work-packet:continuity-lane-lab",
      semanticPayloadHash: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      sourceRefs: [
        "continuity:edge-repo-work-packet:continuity-lane-lab",
        "edge-repo-work-packet:continuity-lane-lab",
        "edge-self-work-review:continuity-lane-lab",
      ],
      causalRefs: {
        branchRefs: [],
        segmentRefs: [],
        happeningRefs: [],
        presentPointRef: null,
        observerRef: "edge-operator",
        deferred: true,
        deferredReason: "repo_work_packet_continuity_event_without_promoted_lane",
      },
      membraneCrossing: {
        crossingKind: "repo_work_packet_proposal",
        crossingRef: "membrane-crossing:repo_work_packet_proposal:continuity-lane-lab",
        sourceDomain: "edge_operator_loop",
        targetDomain: "repo_owned_work_review",
      },
      entryPosture: {
        labStorageEnvelope: true,
        semanticContinuityUnit: false,
        preservesSemanticContinuityEvent: true,
        productionLaneEntry: false,
        productionLocalLayerState: false,
        durableLocalLayerContinuity: false,
        edgeStateMigration: false,
        appendSuccessIsAcceptance: false,
        linearizationIsTruth: false,
        replicaVisibilityIsContinuity: false,
        wallClockDefinesIdentity: false,
      },
    },
    materializedRecordCount: 1,
    writerRefs: ["autobase-writer:aaaaaaaa"],
    headRefs: ["autobase-head:autobase-writer-aaaaaaaa:length-1:bbbbbbbb"],
    linearizedEntryRefs: ["autobase-linearized-entry:local-layer-continuity-lane:0:aaaaaaaa"],
    productionGateDecision: {
      gateState: "implementation_wedge_allowed_production_promotion_blocked",
      decision: "continue_lab_backed_wedge_only",
      productionIsExpectedFutureWork: true,
      productionLanePromoted: false,
      edgeStateMigrationAllowed: false,
      nextGate: "production_local_layer_lane_promotion_decision",
      requiredBeforeNextGate: [
        "writer_admission_v0",
        "operator_recorded_promotion_decision",
      ],
    },
    labPosture: {
      sandboxedAutobaseLab: true,
      autobaseBackendOpened: true,
      writesAutobase: true,
      derivedViewMaterialized: true,
      implementationWedge: true,
      productionLocalLayerState: false,
      productionLanePromoted: false,
      writesDurableLocalLayerState: false,
      edgeStateMigration: false,
      localStoreRootIsIntegrationSeam: false,
      httpSeam: false,
      sshSeam: false,
      appendSuccessIsAcceptance: false,
      applySuccessIsTruth: false,
      labResultIsReadiness: false,
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

test("imports Edge continuity-lane Autobase lab as implementation wedge evidence", () => {
  const evidence = buildEdgeLocalLayerContinuityLaneAutobaseLabEvidenceArtifact({
    labResult: labResult(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_ARTIFACT_KIND);
  assert.equal(evidence.schema, CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_LANE_AUTOBASE_LAB_EVIDENCE_SCHEMA);
  assert.equal(evidence.reviewStatus, "edge-local-layer-continuity-lane-autobase-lab-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-local-layer-continuity-lane-autobase-lab-valid-evidence");
  assert.equal(evidence.refs.laneEntryId, "local-layer-continuity-lane-entry:aaaaaaaaaaaaaaaaaaaaaaaa");
  assert.equal(evidence.refs.semanticEventRef, "continuity:edge-repo-work-packet:continuity-lane-lab");
  assert.equal(evidence.laneEntryPosture.labStorageEnvelope, true);
  assert.equal(evidence.laneEntryPosture.productionLaneEntry, false);
  assert.equal(evidence.labPosture.sandboxedAutobaseLab, true);
  assert.equal(evidence.labPosture.productionLanePromoted, false);
  assert.equal(evidence.productionGateDecision.nextGate, "production_local_layer_lane_promotion_decision");
  assert.equal(evidence.productionGateDecision.productionIsExpectedFutureWork, true);
  assert.equal(evidence.boundary.opensAutobase, false);
  assert.equal(evidence.boundary.writesContinuityRecords, false);
  assert.equal(evidence.boundary.claimsCausalTruth, false);
});

test("blocks production lane and state overclaims", () => {
  const result = labResult();
  result.laneEntry.entryPosture.productionLaneEntry = true;
  result.labPosture.productionLanePromoted = true;
  result.productionGateDecision.productionLanePromoted = true;
  result.nonClaims.durableStateClaimed = true;
  const evidence = buildEdgeLocalLayerContinuityLaneAutobaseLabEvidenceArtifact({
    labResult: result,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-continuity-lane-autobase-lab-guardrail-blocked");
  assert.equal(evidence.validation.noProductionOverclaim, false);
  assert.equal(evidence.rejections.includes("production-continuity-or-authority-overclaim"), true);
});

test("blocks unsafe refs and missing production gate", () => {
  const result = labResult();
  result.laneEntry.sourceRefs.push("http://127.0.0.1:8787/status");
  result.productionGateDecision.productionIsExpectedFutureWork = false;
  const evidence = buildEdgeLocalLayerContinuityLaneAutobaseLabEvidenceArtifact({
    labResult: result,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-continuity-lane-autobase-lab-guardrail-blocked");
  assert.equal(evidence.validation.refsSafe, false);
  assert.equal(evidence.validation.productionGatePresent, false);
});
