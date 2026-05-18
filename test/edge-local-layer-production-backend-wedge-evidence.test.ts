import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeLocalLayerProductionBackendWedgeEvidenceArtifact,
  CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-17T22:10:00.000Z";

function wedgePacket() {
  return {
    artifactKind: "edge_local_layer_production_backend_wedge_packet",
    schemaVersion: "edge_local_layer_production_backend_wedge_packet.v0",
    wedgeId: "edge-local-layer-production-backend-wedge:aaaaaaaaaaaaaaaaaaaaaaaa",
    wedgeHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    sourceOperatorPromotionDecisionRef: "edge-local-layer-operator-recorded-promotion-decision:bbbbbbbbbbbbbbbbbbbbbbbb",
    sourceOperatorPromotionDecisionHash: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    sourceWriterAdmissionPacketRef: "edge-local-layer-writer-admission-v0:cccccccccccccccccccccccc",
    sourceLayerRef: "local-layer:operator-owned-devices",
    sourceLaneRef: "local-layer-continuity-lane:operator-owned-devices-lab",
    sourceRefs: [
      "edge-local-layer-operator-recorded-promotion-decision:bbbbbbbbbbbbbbbbbbbbbbbb",
      "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "operator-decision:record-local-layer-promotion-fields",
      "operator-recorded-promotion-decision:record-local-layer-promotion-fields",
      "edge-local-layer-writer-admission-v0:cccccccccccccccccccccccc",
      "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      "edge-continuity-lane-autobase-lab-review-chain:fixture",
      "local-layer-continuity-lane-entry:aaaaaaaaaaaaaaaaaaaaaaaa",
    ],
    labAuthorization: {
      labAuthorizationRef: "lab-authorization:local-layer-production-shaped-backend-wedge",
      authorizesDisposableProductionShapedBackendLab: true,
      authorizesProductionBackend: false,
      authorizesProductionLanePromotion: false,
      authorizesEdgeStateMigration: false,
      requiresDisposableStorageRoot: true,
      requiresNoLocalPathAsContinuitySeam: true,
      requiresNoHttpOrSshSeam: true,
      requiresNoWriterAuthorityGrant: true,
    },
    backendWedge: {
      backendKind: "autobase",
      namespaceRef: "corestore-namespace:local-layer-continuity-production-shaped-lab",
      laneRef: "local-layer-continuity-lane:operator-owned-devices-production-shaped-lab",
      storageLaneKind: "bounded_autobase_local_layer_continuity_lane",
      semanticInputKind: "mesh_ecology_local_layer_continuity_event",
      storageEnvelopeKind: "mesh_ecology_local_layer_lane_entry",
      writerPolicyRef: "writer-admission-policy:operator-owned-device-writer-admission-v0",
      readerPolicyRef: "reader-policy:operator-owned-local-layer-readers-by-explicit-refs",
      acceptanceRuleRef: "acceptance-rule:deterministic-apply-validates-admitted-writer-input",
      productionBackendStarted: false,
      productionLanePromoted: false,
      edgeStateMigrationAllowed: false,
    },
    acceptanceRule: {
      ruleKind: "production_backend_wedge_authorizes_disposable_lab_only",
      appendSuccessIsAcceptance: false,
      applySuccessIsTruth: false,
      labSuccessIsProductionReadiness: false,
      wedgePacketIsProductionPromotion: false,
      requiresSeparateProductionPromotionGate: true,
    },
    implementationRoute: {
      currentStage: "production_backend_wedge",
      previousStage: "operator_recorded_promotion_decision",
      nextImplementationGate: "disposable_production_shaped_backend_lab",
      finalPromotionGate: "production_local_layer_lane_promotion_decision",
      disposableLabAuthorized: true,
      productionBackendAllowed: false,
      productionLanePromotionAllowed: false,
      edgeStateMigrationAllowed: false,
    },
    boundary: {
      opensAutobase: false,
      opensCorestore: false,
      writesAutobase: false,
      writesContinuityRecords: false,
      startsProductionBackend: false,
      productionLocalLayerState: false,
      migratesEdgeState: false,
      grantsWriterAuthority: false,
    },
    nonClaims: {
      writerAuthorityGranted: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      causalTruthClaimed: false,
      productionProofClaimed: false,
      productionLanePromoted: false,
      productionBackendStarted: false,
    },
  };
}

test("imports production backend wedge as disposable lab authorization evidence", () => {
  const evidence = buildEdgeLocalLayerProductionBackendWedgeEvidenceArtifact({
    backendWedgePacket: wedgePacket(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_ARTIFACT_KIND);
  assert.equal(evidence.schema, CAUSAL_EDGE_LOCAL_LAYER_PRODUCTION_BACKEND_WEDGE_EVIDENCE_SCHEMA);
  assert.equal(evidence.reviewStatus, "edge-local-layer-production-backend-wedge-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-local-layer-production-backend-wedge-valid-evidence");
  assert.equal(evidence.labAuthorization.authorizesDisposableProductionShapedBackendLab, true);
  assert.equal(evidence.labAuthorization.authorizesProductionBackend, false);
  assert.equal(evidence.backendWedge.backendKind, "autobase");
  assert.equal(evidence.implementationRoute.nextImplementationGate, "disposable_production_shaped_backend_lab");
  assert.equal(evidence.causalInterpretation.productionBackendStarted, false);
  assert.equal(evidence.boundary.opensAutobase, false);
});

test("blocks backend wedge unsafe refs", () => {
  const packet = wedgePacket();
  packet.backendWedge.laneRef = "http://127.0.0.1:8787/lane";
  const evidence = buildEdgeLocalLayerProductionBackendWedgeEvidenceArtifact({
    backendWedgePacket: packet,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-production-backend-wedge-guardrail-blocked");
  assert.equal(evidence.validation.refsSafe, false);
});

test("blocks backend wedge production and authority overclaims", () => {
  const packet = wedgePacket();
  packet.labAuthorization.authorizesProductionBackend = true;
  packet.boundary.opensAutobase = true;
  packet.nonClaims.durableStateClaimed = true;
  const evidence = buildEdgeLocalLayerProductionBackendWedgeEvidenceArtifact({
    backendWedgePacket: packet,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-production-backend-wedge-guardrail-blocked");
  assert.equal(evidence.validation.noProductionOverclaim, false);
  assert.equal(evidence.rejections.includes("production-backend-authority-or-state-overclaim"), true);
});
