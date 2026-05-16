import test from "node:test";
import assert from "node:assert/strict";

import {
  assertEdgeAutobaseProjectionViewEvidenceArtifact,
  buildEdgeAutobaseProjectionViewEvidenceArtifact,
  CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA,
} from "../src/adapters/edge-autobase-projection-view-evidence.js";

const EMITTED_AT = "2026-05-16T18:00:00.000Z";

function validProjectionView() {
  return {
    artifactKind: "edge_autobase_projection_view",
    schemaVersion: "edge_autobase_projection_view.v0",
    viewState: "autobase_projection_view_materialized",
    viewId: "edge-autobase-projection-view:aaaaaaaaaaaaaaaaaaaaaaaa",
    sourceFrontierCandidateId: "local-layer-frontier:bbbbbbbbbbbbbbbbbbbbbbbb",
    projectionLaneRef: "local-layer-projection-log:edge-operator-situation",
    layerRef: "local-layer:operator-owned-devices",
    observerRef: "operator-participant:edge-operator",
    orderingSource: "autobase_linearization",
    materializedRecordCount: 2,
    writerRefs: [
      "autobase-writer:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "autobase-writer:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ],
    headRefs: [
      "autobase-head:device-a:length-2:aaaaaaaaaaaaaaaa",
      "autobase-head:device-b:length-2:bbbbbbbbbbbbbbbb",
    ],
    linearizedEntryRefs: [
      "autobase-linearized-entry:0:aaaaaaaaaaaaaaaa",
      "autobase-linearized-entry:1:bbbbbbbbbbbbbbbb",
    ],
    causalFrontierRefs: ["causal-frontier:autobase-linearization:aaaaaaaaaaaaaaaaaaaaaaaa"],
    sourceProjectionEventRefs: [
      "projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa",
      "projection:mesh-ecology-edge:operator_situation_view:bbbbbbbbbbbbbbbb",
    ],
    sourceEntryRefs: [
      "projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa:0",
      "projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:bbbbbbbbbbbbbbbb:1",
    ],
    sourceHappeningRefs: [
      "causal-edge-projection-happening:device-a",
      "causal-edge-projection-happening:device-b",
    ],
    viewPosture: {
      sandboxedAutobaseLab: true,
      derivedFromAutobaseView: true,
      collaborativeProjectionViewCandidate: true,
      autobaseBackend: true,
      writesAutobase: true,
      writesDurableLocalLayerState: false,
      productionLocalLayerState: false,
      localStoreRootIsIntegrationSeam: false,
      httpSeam: false,
      sshSeam: false,
      wallClockDefinesCausalOrder: false,
      appendSuccessIsAcceptance: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      canonicalHistoryClaimed: false,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      universalConsensusClaimed: false,
      meshSettlementClaimed: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      canonicalHistoryClaimed: false,
      runtimeAuthorityClaimed: false,
    },
  };
}

test("valid Edge Autobase projection view imports as collaborative evidence only", () => {
  const evidence = buildEdgeAutobaseProjectionViewEvidenceArtifact({
    projectionView: validProjectionView(),
    emittedAt: EMITTED_AT,
  });

  assertEdgeAutobaseProjectionViewEvidenceArtifact(evidence);
  assert.equal(evidence.artifactKind, CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_ARTIFACT_KIND);
  assert.equal(evidence.schema, CAUSAL_EDGE_AUTOBASE_PROJECTION_VIEW_EVIDENCE_SCHEMA);
  assert.equal(evidence.reviewStatus, "edge-autobase-projection-view-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-autobase-projection-view-valid-evidence");
  assert.equal(evidence.source.sourceArtifactKind, "edge_autobase_projection_view");
  assert.equal(evidence.source.sourceSchema, "edge_autobase_projection_view.v0");
  assert.equal(evidence.projectionViewRefs.writerRefs.length, 2);
  assert.equal(evidence.projectionViewRefs.headRefs.length, 2);
  assert.equal(evidence.projectionViewRefs.linearizedEntryRefs.length, 2);
  assert.equal(evidence.projectionViewRefs.causalFrontierRefs.length, 1);
  assert.equal(evidence.orderingEvidence.orderingSource, "autobase_linearization");
  assert.equal(evidence.orderingEvidence.derivedFromAutobaseView, true);
  assert.equal(evidence.orderingEvidence.collaborativeProjectionViewCandidate, true);
  assert.equal(evidence.orderingEvidence.wallClockDefinesCausalOrder, false);
  assert.equal(evidence.orderingEvidence.appendSuccessIsAcceptance, false);
  assert.equal(evidence.boundary.opensAutobase, false);
  assert.equal(evidence.boundary.opensCorestore, false);
  assert.equal(evidence.boundary.claimsDurableState, false);
  assert.equal(evidence.boundary.claimsReplicatedState, false);
  assert.equal(evidence.boundary.claimsCausalTruth, false);
});

test("Autobase projection view evidence blocks state backend and authority overclaims", () => {
  const projectionView = validProjectionView();
  projectionView.viewPosture.productionLocalLayerState = true;
  projectionView.viewPosture.durableStateClaimed = true;
  projectionView.nonClaims.runtimeAuthorityClaimed = true;

  const evidence = buildEdgeAutobaseProjectionViewEvidenceArtifact({
    projectionView,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-autobase-projection-view-guardrail-blocked");
  assert.ok(evidence.validation.issues.includes("sandboxed-autobase-view-posture-missing-or-unsafe"));
  assert.ok(evidence.validation.issues.includes("truth-authority-state-or-backend-claim"));
});

test("Autobase projection view evidence blocks HTTP SSH path refs and append-success ordering", () => {
  const projectionView = validProjectionView();
  projectionView.sourceEntryRefs = ["../projection-log-entry.json"];
  projectionView.sourceProjectionEventRefs = ["http://127.0.0.1:8787/projection"];
  projectionView.viewPosture.appendSuccessIsAcceptance = true;

  const evidence = buildEdgeAutobaseProjectionViewEvidenceArtifact({
    projectionView,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-autobase-projection-view-guardrail-blocked");
  assert.ok(evidence.validation.issues.includes("unsafe-seam-ref"));
  assert.ok(evidence.validation.issues.includes("sandboxed-autobase-view-posture-missing-or-unsafe"));
  assert.ok(evidence.validation.issues.includes("wall-clock-or-append-success-ordering-overclaim"));
});

test("Autobase projection view evidence remains incomplete when collaborative refs are missing", () => {
  const projectionView = validProjectionView();
  projectionView.writerRefs = [];
  projectionView.headRefs = [];
  projectionView.causalFrontierRefs = [];

  const evidence = buildEdgeAutobaseProjectionViewEvidenceArtifact({
    projectionView,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-autobase-projection-view-incomplete-evidence");
  assert.ok(evidence.validation.issues.includes("writer-refs-missing"));
  assert.ok(evidence.validation.issues.includes("head-refs-missing"));
  assert.ok(evidence.validation.issues.includes("causal-frontier-refs-missing"));
});
