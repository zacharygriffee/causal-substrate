import assert from "node:assert/strict";
import test from "node:test";

import { buildEdgeStorageLaneCandidateEvidenceArtifact } from "../src/index.js";

function validCandidate(): any {
  return {
    artifactKind: "edge_local_layer_storage_lane_candidate",
    schemaVersion: "edge_local_layer_storage_lane_candidate.v0",
    candidateId: "edge-local-layer-storage-lane-candidate:aaaaaaaaaaaaaaaaaaaaaaaa",
    layerRef: "local-layer:operator-owned-devices",
    projectionLaneRef: "local-layer-projection-lane:edge-operator-situation",
    observerRef: "observer:edge-operator",
    sourceProjectionEventRefs: ["projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa"],
    sourceEntryRefs: ["projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa:0"],
    sourceIdentityHashes: [`sha256:${"a".repeat(64)}`],
    sourceRefs: [
      "projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa",
      "projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa:0",
      `sha256:${"a".repeat(64)}`,
    ],
    writerAdmission: {
      policyKind: "operator_owned_local_layer_explicit_writer_admission",
      admittedWriterRefs: ["local-layer-writer:operator-device-a"],
      candidateWriterRefs: ["local-layer-writer:operator-device-a"],
      rejectedWriterRefs: ["local-layer-writer:unknown-device"],
      generalWriterAuthorityGranted: false,
      nonWriterOptimisticAppendAllowed: true,
      optimisticAppendRequiresAcceptanceGate: true,
      writerAdmissionRequiredBeforeAcceptance: true,
      operatorMediationRequired: true,
    },
    readerPolicy: {
      readerKind: "operator_owned_local_layer_readers_by_explicit_refs",
      explicitKeyOrProofRequired: true,
      publicRead: false,
      localPathReadSeam: false,
      httpReadSeam: false,
      sshReadSeam: false,
    },
    acceptanceRule: {
      ruleKind: "apply_validation_accepts_projection_lane_entry",
      appendSuccessIsAcceptance: false,
      replicaVisibilityIsContinuity: false,
      linearizationIsTruth: false,
      requiresValidSchema: true,
      requiresPromotedProjectionEvent: true,
      requiresSourceRefs: true,
      requiresIdentityHash: true,
      requiresCausalRefsOrDeferral: true,
      requiresWriterAdmission: true,
      requiresReaderPolicy: true,
      requiresCausalSubstrateInterpretation: true,
      requiresFailClosedTestbedPressure: true,
    },
    storageLanePosture: {
      intendedStorageLane: "bounded_autobase_equivalent_projection_lane",
      storageDirection: "bounded_autobase_equivalent_linearization",
      promotedSemanticUnit: "mesh_ecology_local_layer_projection_event",
      storageEnvelopeKind: "edge_local_layer_projection_lane_entry",
      storageEnvelopeSchema: "edge_local_layer_projection_lane_entry.v0",
      productionBackendPromoted: false,
      productionAutobaseStarted: false,
      storageRecordPromoted: false,
      edgeStateMigration: false,
      appendSuccessIsAcceptance: false,
      linearizationIsTruth: false,
      replicaVisibilityIsContinuity: false,
      wallClockDefinesCausalOrder: false,
      localPathSeam: false,
      httpSeam: false,
      sshSeam: false,
    },
    boundary: {
      candidateOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      writesAutobase: false,
      writesContinuityRecords: false,
      migratesEdgeState: false,
      startsBackend: false,
      productionLocalLayerState: false,
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
    },
  };
}

test("Edge storage lane candidate imports as causal decision pressure only", () => {
  const artifact = buildEdgeStorageLaneCandidateEvidenceArtifact({
    storageLaneCandidate: validCandidate(),
    emittedAt: "2026-05-17T12:00:00.000Z",
  });

  assert.equal(artifact.artifactKind, "causal-edge-storage-lane-candidate-evidence");
  assert.equal(artifact.schema, "causal-substrate/edge-storage-lane-candidate-evidence/v1");
  assert.equal(artifact.reviewStatus, "edge-storage-lane-candidate-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-storage-lane-candidate-valid-evidence");
  assert.equal(artifact.validation.writerAdmissionPresent, true);
  assert.equal(artifact.validation.acceptanceRulePresent, true);
  assert.equal(artifact.validation.storageLanePosturePresent, true);
  assert.equal(artifact.refs.sourceEntryRefs.length, 1);
  assert.equal(artifact.writerAdmission.policyKind, "operator_owned_local_layer_explicit_writer_admission");
  assert.equal(artifact.acceptanceRule.appendSuccessIsAcceptance, false);
  assert.equal(artifact.acceptanceRule.requiresFailClosedTestbedPressure, true);
  assert.equal(artifact.storageLanePosture.productionAutobaseStarted, false);
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
});

test("Edge storage lane candidate blocks append acceptance and backend overclaims", () => {
  const candidate = validCandidate();
  candidate.acceptanceRule.appendSuccessIsAcceptance = true;
  candidate.storageLanePosture.productionAutobaseStarted = true;
  candidate.boundary.opensAutobase = true;

  const artifact = buildEdgeStorageLaneCandidateEvidenceArtifact({
    storageLaneCandidate: candidate,
    emittedAt: "2026-05-17T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-storage-lane-candidate-guardrail-blocked");
  assert.ok(artifact.rejections.includes("acceptance-rule-missing-or-unsafe"));
  assert.ok(artifact.rejections.includes("storage-lane-posture-missing-or-unsafe"));
  assert.ok(artifact.rejections.includes("boundary-overclaim"));
});

test("Edge storage lane candidate blocks unsafe seams and writer authority", () => {
  const candidate = validCandidate();
  candidate.writerAdmission.admittedWriterRefs = ["http://127.0.0.1:8787/writer"];
  candidate.nonClaims.writerAuthorityGranted = true;

  const artifact = buildEdgeStorageLaneCandidateEvidenceArtifact({
    storageLaneCandidate: candidate,
    emittedAt: "2026-05-17T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-storage-lane-candidate-guardrail-blocked");
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.ok(artifact.rejections.includes("truth-authority-or-state-claim"));
});

test("Edge storage lane candidate reports missing source refs as incomplete", () => {
  const candidate = validCandidate();
  candidate.sourceProjectionEventRefs = [];
  candidate.sourceEntryRefs = [];

  const artifact = buildEdgeStorageLaneCandidateEvidenceArtifact({
    storageLaneCandidate: candidate,
    emittedAt: "2026-05-17T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-storage-lane-candidate-incomplete-evidence");
  assert.ok(artifact.rejections.includes("source-refs-missing"));
});
