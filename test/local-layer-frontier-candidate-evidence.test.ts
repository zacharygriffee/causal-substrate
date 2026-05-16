import assert from "node:assert/strict";
import test from "node:test";

import {
  assertLocalLayerFrontierCandidateEvidenceArtifact,
  buildLocalLayerFrontierCandidateEvidenceArtifact,
  CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA,
  CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

function validFrontierCandidate(): any {
  return {
    artifactKind: "local_layer_collaborative_projection_frontier_candidate",
    schemaVersion: "mesh-ecology-spine/local-layer-collaborative-frontier/v0",
    frontierId: "local-layer-frontier:operator-situation:aaaaaaaaaaaaaaaa",
    projectionLaneRef: "local-layer-projection-log:operator-situation",
    layerRef: "local-layer:operator-owned-devices",
    observerRef: "operator-participant:edge-operator",
    writerRefs: [
      "local-layer-writer:device-a",
      "local-layer-writer:device-b",
    ],
    headRefs: [
      "autobase-head:device-a:1:aaaaaaaaaaaaaaaa",
      "autobase-head:device-b:1:bbbbbbbbbbbbbbbb",
    ],
    linearizedEntryRefs: [
      "local-layer-linearized-entry:0:aaaaaaaaaaaaaaaa",
      "local-layer-linearized-entry:1:bbbbbbbbbbbbbbbb",
    ],
    causalFrontierRefs: [
      "causal-frontier:aaaaaaaaaaaaaaaa",
    ],
    sourceProjectionEventRefs: [
      "projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa",
    ],
    sourceHappeningRefs: [
      "causal-edge-projection-log-happening:bbbbbbbbbbbbbbbb",
    ],
    basis: {
      orderingSource: "autobase_linearization",
      wallClockDefinesCausalOrder: false,
      headsRequired: true,
      writerRefsRequired: true,
      sourceRefsRequired: true,
      lineageRefsRequired: true,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      universalConsensusClaimed: false,
      meshSettlementClaimed: false,
    },
  };
}

test("valid local-layer frontier candidate imports as causal evidence only", () => {
  const artifact = buildLocalLayerFrontierCandidateEvidenceArtifact({
    frontierCandidate: validFrontierCandidate(),
    emittedAt: "2026-05-15T14:00:00.000Z",
    sourcePath: "docs/local-layer-collaborative-causality-candidate.md",
  });

  assertLocalLayerFrontierCandidateEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_LOCAL_LAYER_FRONTIER_CANDIDATE_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "local-layer-frontier-candidate-evidence-emitted");
  assert.equal(artifact.validation.status, "local-layer-frontier-candidate-valid-evidence");
  assert.equal(artifact.source.sourceRepo, "mesh-ecology-spine");
  assert.equal(artifact.source.sourceSchema, "mesh-ecology-spine/local-layer-collaborative-frontier/v0");
  assert.equal(artifact.frontierRefs.writerRefs.length, 2);
  assert.equal(artifact.frontierRefs.headRefs.length, 2);
  assert.equal(artifact.frontierRefs.linearizedEntryRefs.length, 2);
  assert.equal(artifact.frontierRefs.causalFrontierRefs.length, 1);
  assert.equal(artifact.frontierRefs.sourceProjectionEventRefs.length, 1);
  assert.equal(artifact.frontierRefs.sourceHappeningRefs.length, 1);
  assert.equal(artifact.orderingEvidence.orderingSource, "autobase_linearization");
  assert.equal(artifact.orderingEvidence.wallClockDefinesCausalOrder, false);
  assert.equal(artifact.orderingEvidence.collaborativeCausalOrderCandidate, "autobase-or-equivalent-linearization");
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.opensCorestore, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.deepEqual(artifact.rejections, []);
  assert.ok(artifact.warnings.includes("autobase-linearization-named-without-opening-autobase"));
});

test("pre-Autobase Edge frontier fixture imports as candidate evidence only", () => {
  const candidate = validFrontierCandidate();
  candidate.frontierId = "local-layer-frontier:6fbd2eeefed242208326ce7f";
  candidate.projectionLaneRef = "local-layer-projection-log:edge-operator-situation";
  candidate.sourceProjectionEventRefs = [
    "projection:mesh-ecology-edge:operator_situation_view:6fbd2eeefed24220",
  ];
  candidate.sourceHappeningRefs = [
    "causal-edge-projection-happening:device-a",
    "causal-edge-projection-happening:device-b",
  ];
  candidate.sourceEntryRefs = [
    "projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:6fbd2eeefed24220:0",
    "projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:6fbd2eeefed24220:1",
  ];
  candidate.basis = {
    orderingSource: "frontier_candidate_fixture",
    wallClockDefinesCausalOrder: false,
    headsRequired: true,
    writerRefsRequired: true,
    sourceRefsRequired: true,
    lineageRefsRequired: true,
    autobaseBackendOpened: false,
    fixtureOnly: true,
  };
  candidate.nonClaims = {
    truthClaimed: false,
    completionClaimed: false,
    authorityGranted: false,
    universalConsensusClaimed: false,
    meshSettlementClaimed: false,
    replicatedStateClaimed: false,
    autobaseBackendClaimed: false,
    durableStateClaimed: false,
  };
  candidate.labPosture = {
    ownerRepo: "mesh-ecology-edge",
    proofScope: "sandboxed_two_writer_frontier_candidate",
    fixtureOnly: true,
    autobaseBackend: false,
    writesAutobase: false,
    writesDurableLocalLayerState: false,
    localStoreRootIsIntegrationSeam: false,
    httpSeam: false,
    sshSeam: false,
    wallClockDefinesCausalOrder: false,
    selectedNextBackendProof: "edge_sandboxed_two_writer_autobase_frontier_lab",
  };

  const artifact = buildLocalLayerFrontierCandidateEvidenceArtifact({
    frontierCandidate: candidate,
    emittedAt: "2026-05-16T14:30:00.000Z",
  });

  assertLocalLayerFrontierCandidateEvidenceArtifact(artifact);
  assert.equal(artifact.reviewStatus, "local-layer-frontier-candidate-evidence-emitted");
  assert.equal(artifact.validation.status, "local-layer-frontier-candidate-valid-evidence");
  assert.equal(artifact.orderingEvidence.orderingSource, "frontier_candidate_fixture");
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
  assert.deepEqual(artifact.rejections, []);
  assert.ok(artifact.warnings.includes("frontier-candidate-fixture-precedes-autobase-backend"));
});

test("frontier candidate blocks wall-clock causal order and authority claims", () => {
  const candidate = validFrontierCandidate();
  candidate.basis.wallClockDefinesCausalOrder = true;
  candidate.nonClaims.universalConsensusClaimed = true;

  const artifact = buildLocalLayerFrontierCandidateEvidenceArtifact({
    frontierCandidate: candidate,
    emittedAt: "2026-05-15T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "local-layer-frontier-candidate-guardrail-blocked");
  assert.ok(artifact.rejections.includes("wall-clock-causal-order-claim"));
  assert.ok(artifact.rejections.includes("truth-authority-settlement-or-consensus-claim"));
  assert.equal(artifact.validation.wallClockCausalOrderBlocked, false);
  assert.equal(artifact.validation.unsafeClaimsBlocked, false);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
});

test("frontier candidate blocks backend and seam overclaims from fixture posture", () => {
  const candidate = validFrontierCandidate();
  candidate.basis.orderingSource = "frontier_candidate_fixture";
  candidate.basis.autobaseBackendOpened = true;
  candidate.basis.fixtureOnly = false;
  candidate.labPosture = {
    autobaseBackend: true,
    writesAutobase: true,
    writesDurableLocalLayerState: true,
    localStoreRootIsIntegrationSeam: true,
    httpSeam: true,
    sshSeam: true,
    wallClockDefinesCausalOrder: true,
  };
  candidate.nonClaims.replicatedStateClaimed = true;
  candidate.nonClaims.autobaseBackendClaimed = true;
  candidate.nonClaims.durableStateClaimed = true;

  const artifact = buildLocalLayerFrontierCandidateEvidenceArtifact({
    frontierCandidate: candidate,
    emittedAt: "2026-05-16T14:30:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "local-layer-frontier-candidate-guardrail-blocked");
  assert.ok(artifact.rejections.includes("ordering-source-missing-or-unsupported"));
  assert.ok(artifact.rejections.includes("backend-overclaim"));
  assert.ok(artifact.rejections.includes("backend-or-seam-overclaim"));
  assert.ok(artifact.rejections.includes("truth-authority-settlement-or-consensus-claim"));
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
});

test("frontier candidate blocks HTTP SSH local path and local endpoint refs", () => {
  const candidate = validFrontierCandidate();
  candidate.writerRefs = ["local-layer-writer:http://127.0.0.1:8787"];
  candidate.headRefs = ["ssh://device-a"];
  candidate.sourceProjectionEventRefs = ["../projection-event.json"];

  const artifact = buildLocalLayerFrontierCandidateEvidenceArtifact({
    frontierCandidate: candidate,
    emittedAt: "2026-05-15T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "local-layer-frontier-candidate-guardrail-blocked");
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.equal(artifact.validation.unsafeSeamRefsBlocked, false);
});

test("frontier candidate reports missing heads writer refs and source refs as incomplete", () => {
  const candidate = validFrontierCandidate();
  candidate.writerRefs = [];
  candidate.headRefs = [];
  candidate.linearizedEntryRefs = [];
  candidate.causalFrontierRefs = [];
  candidate.sourceProjectionEventRefs = [];

  const artifact = buildLocalLayerFrontierCandidateEvidenceArtifact({
    frontierCandidate: candidate,
    emittedAt: "2026-05-15T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "local-layer-frontier-candidate-incomplete-evidence");
  assert.ok(artifact.rejections.includes("writer-refs-missing"));
  assert.ok(artifact.rejections.includes("head-refs-missing"));
  assert.ok(artifact.rejections.includes("linearized-entry-refs-missing"));
  assert.ok(artifact.rejections.includes("causal-frontier-refs-missing"));
  assert.ok(artifact.rejections.includes("source-refs-missing"));
  assert.equal(artifact.validation.writerRefsPresent, false);
  assert.equal(artifact.validation.headRefsPresent, false);
  assert.equal(artifact.validation.linearizedEntryRefsPresent, false);
  assert.equal(artifact.validation.causalFrontierRefsPresent, false);
  assert.equal(artifact.validation.sourceRefsPresent, false);
});

test("frontier candidate treats malformed input as non-accepted evidence", () => {
  const artifact = buildLocalLayerFrontierCandidateEvidenceArtifact({
    frontierCandidate: null,
    emittedAt: "2026-05-15T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "local-layer-frontier-candidate-malformed-evidence");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.frontierRefs.writerRefs, []);
  assert.deepEqual(artifact.rejections, ["frontier-candidate-not-object"]);
});
