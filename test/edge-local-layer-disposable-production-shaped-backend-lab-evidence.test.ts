import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeLocalLayerDisposableProductionShapedBackendLabEvidenceArtifact,
  CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-17T23:10:00.000Z";

function labResult() {
  return {
    artifactKind: "edge_local_layer_disposable_production_shaped_backend_lab_result",
    schemaVersion: "edge_local_layer_disposable_production_shaped_backend_lab_result.v0",
    artifactId: "edge-local-layer-disposable-production-shaped-backend-lab:aaaaaaaaaaaaaaaaaaaaaaaa",
    artifactHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    labStatus: "disposable_production_shaped_backend_lab_materialized_lane_entry",
    sourceProductionBackendWedgeRef: "edge-local-layer-production-backend-wedge:bbbbbbbbbbbbbbbbbbbbbbbb",
    sourceProductionBackendWedgeHash: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    sourceOperatorPromotionDecisionRef: "edge-local-layer-operator-recorded-promotion-decision:cccccccccccccccccccccccc",
    sourceWriterAdmissionPacketRef: "edge-local-layer-writer-admission-v0:dddddddddddddddddddddddd",
    sourceRefs: [
      "edge-local-layer-disposable-production-shaped-backend-lab:aaaaaaaaaaaaaaaaaaaaaaaa",
      "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "edge-local-layer-production-backend-wedge:bbbbbbbbbbbbbbbbbbbbbbbb",
      "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "edge-local-layer-operator-recorded-promotion-decision:cccccccccccccccccccccccc",
      "edge-local-layer-writer-admission-v0:dddddddddddddddddddddddd",
      "local-layer-continuity-lane-entry:eeeeeeeeeeeeeeeeeeeeeeee",
      "sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "mesh-ecology-local-layer-continuity-event:ffffffffffffffffffffffff",
      "autobase-writer:111111111111111111111111",
      "autobase-head:autobase-writer-111111111111111111111111:length-1:111111111111111111111111",
      "autobase-linearized-entry:local-layer-continuity-lane:0:222222222222222222222222",
    ],
    backendShape: {
      backendKind: "autobase",
      corestoreRole: "local-layer-node",
      corestorePolicy: "one-corestore-per-role-process",
      namespacePolicy: "stable-namespaces-within-role-corestore",
      namespaceRef: "corestore-namespace:local-layer-continuity-production-shaped-lab",
      laneRef: "local-layer-continuity-lane:operator-owned-devices-production-shaped-lab",
      storageLaneKind: "bounded_autobase_local_layer_continuity_lane",
      semanticInputKind: "mesh_ecology_local_layer_continuity_event",
      semanticInputSchema: "mesh_ecology_local_layer_continuity_event.v0",
      storageEnvelopeKind: "mesh_ecology_local_layer_lane_entry",
      storageEnvelopeSchema: "mesh_ecology_local_layer_lane_entry.v0",
    },
    laneEntry: {
      artifactKind: "mesh_ecology_local_layer_lane_entry",
      schemaVersion: "mesh_ecology_local_layer_lane_entry.v0",
      entryId: "local-layer-continuity-lane-entry:eeeeeeeeeeeeeeeeeeeeeeee",
      entryHash: "sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      laneRef: "local-layer-continuity-lane:operator-owned-devices-production-shaped-lab",
      namespaceRef: "corestore-namespace:local-layer-continuity-production-shaped-lab",
      writerRef: "autobase-writer:111111111111111111111111",
      semanticEventKind: "mesh_ecology_local_layer_continuity_event",
      semanticEventRef: "mesh-ecology-local-layer-continuity-event:ffffffffffffffffffffffff",
      semanticPayloadHash: "sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      sourceRefs: [
        "mesh-ecology-local-layer-continuity-event:ffffffffffffffffffffffff",
        "edge-cross-project-work-packet:repo-work:continuity-lane-lab",
        "edge-self-work-review:continuity-lane-lab",
        "operator-seat:test",
        "edge-device:test",
        "continuity:previous-self-work",
      ],
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
      },
      nonClaims: {
        truthClaimed: false,
        authorityGranted: false,
        durableStateClaimed: false,
        replicatedStateClaimed: false,
      },
    },
    writerRefs: ["autobase-writer:111111111111111111111111"],
    headRefs: ["autobase-head:autobase-writer-111111111111111111111111:length-1:111111111111111111111111"],
    linearizedEntryRefs: ["autobase-linearized-entry:local-layer-continuity-lane:0:222222222222222222222222"],
    acceptancePosture: {
      appendSuccessIsAcceptance: false,
      applySuccessIsTruth: false,
      linearizationIsTruth: false,
      replicaVisibilityIsContinuity: false,
      labSuccessIsProductionReadiness: false,
      wedgePacketIsProductionPromotion: false,
      acceptedProductionContinuity: false,
      requiresSeparateProductionPromotionGate: true,
    },
    storageRootPosture: {
      disposableStorageRootRequired: true,
      localPathIsLabInputOnly: true,
      localPathIsContinuitySeam: false,
      localPathIsCanonicalIdentity: false,
      edgeStateMigration: false,
    },
    productionGateDecision: {
      gateState: "disposable_production_shaped_backend_lab_allowed_production_promotion_blocked",
      decision: "continue_lab_backed_wedge_only",
      nextGate: "production_local_layer_lane_promotion_decision",
      productionIsExpectedFutureWork: true,
      productionBackendStarted: false,
      productionLanePromoted: false,
      edgeStateMigrationAllowed: false,
      requiredBeforeNextGate: [
        "production_lane_promotion_decision",
        "writer_admission_v0_pressure",
        "reader_key_policy_v0_pressure",
      ],
    },
    labPosture: {
      disposableProductionShapedBackendLab: true,
      sandboxedAutobaseLab: true,
      productionShapedNamespace: true,
      autobaseBackendOpened: true,
      corestoreOpened: true,
      writesAutobase: true,
      derivedViewMaterialized: true,
      implementationWedge: true,
      productionBackendStarted: false,
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
      writerAuthorityGranted: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      canonicalHistoryClaimed: false,
      runtimeAuthorityClaimed: false,
      productionProofClaimed: false,
    },
  };
}

test("imports disposable production-shaped backend lab as causal evidence only", () => {
  const evidence = buildEdgeLocalLayerDisposableProductionShapedBackendLabEvidenceArtifact({
    labResult: labResult(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_ARTIFACT_KIND);
  assert.equal(evidence.schema, CAUSAL_EDGE_LOCAL_LAYER_DISPOSABLE_PRODUCTION_SHAPED_BACKEND_LAB_EVIDENCE_SCHEMA);
  assert.equal(evidence.reviewStatus, "edge-local-layer-disposable-production-shaped-backend-lab-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-local-layer-disposable-production-shaped-backend-lab-valid-evidence");
  assert.equal(evidence.backendShape.backendKind, "autobase");
  assert.equal(evidence.laneEntry.preservesSemanticContinuityEvent, true);
  assert.equal(evidence.acceptancePosture.appendSuccessIsAcceptance, false);
  assert.equal(evidence.storageRootPosture.localPathIsContinuitySeam, false);
  assert.equal(evidence.productionGateDecision.productionLanePromoted, false);
  assert.equal(evidence.labPosture.autobaseBackendOpened, true);
  assert.equal(evidence.boundary.opensAutobase, false);
  assert.equal(evidence.causalInterpretation.productionBackendStarted, false);
});

test("blocks disposable production-shaped backend lab unsafe refs", () => {
  const result = labResult();
  result.backendShape.laneRef = "http://127.0.0.1:8787/lane";
  const evidence = buildEdgeLocalLayerDisposableProductionShapedBackendLabEvidenceArtifact({
    labResult: result,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-disposable-production-shaped-backend-lab-guardrail-blocked");
  assert.equal(evidence.validation.refsSafe, false);
});

test("blocks disposable production-shaped backend lab promotion and readiness overclaims", () => {
  const result = labResult();
  result.acceptancePosture.labSuccessIsProductionReadiness = true;
  result.productionGateDecision.productionLanePromoted = true;
  result.nonClaims.durableStateClaimed = true;
  const evidence = buildEdgeLocalLayerDisposableProductionShapedBackendLabEvidenceArtifact({
    labResult: result,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-disposable-production-shaped-backend-lab-guardrail-blocked");
  assert.equal(evidence.validation.noProductionOverclaim, false);
  assert.equal(evidence.rejections.includes("production-backend-lab-authority-or-state-overclaim"), true);
});
