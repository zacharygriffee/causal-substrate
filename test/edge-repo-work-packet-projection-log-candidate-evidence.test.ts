import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeRepoWorkPacketProjectionLogCandidateEvidenceArtifact,
  CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_SCHEMA,
} from "../src/index.js";

function candidate(overrides: Record<string, unknown> = {}) {
  return {
    artifactKind: "edge_repo_work_packet_projection_log_candidate",
    schemaVersion: "edge_repo_work_packet_projection_log_candidate.v0",
    candidateId: "edge-repo-work-packet-projection-log-candidate:aaaaaaaaaaaaaaaaaaaaaaaa",
    workPacketRef: "edge-cross-project-work-packet:repo-work:continuity-event",
    continuityEventId: "continuity:edge-repo-work-packet:example",
    continuityEventRole: "edge_repo_work_packet_scaffold",
    continuityEventCategory: "repo_work_packet",
    projectionLaneRef: "local-layer-projection-lane:repo-work-packets",
    observerRef: "observer:edge-operator",
    sourceRefs: [
      "edge-repo-work-packet-continuity-review-chain:fixture",
      "edge-repo-work-packet:example",
    ],
    storageEnvelope: {
      envelopeKind: "edge_repo_work_packet_projection_log_entry_candidate",
      envelopeSchema: "edge_repo_work_packet_projection_log_entry_candidate.v0",
      storageEnvelopeOnly: true,
      semanticContinuityUnit: false,
      preservesSemanticInput: "mesh_ecology_local_layer_continuity_event",
      productionStorageRecord: false,
    },
    writerAdmission: {
      policyKind: "operator_owned_local_layer_explicit_writer_admission",
      admittedWriterRefs: ["local-layer-writer:operator-device-a"],
      candidateWriterRefs: ["local-layer-writer:operator-device-a"],
      rejectedWriterRefs: [],
      generalWriterAuthorityGranted: false,
      writerAdmissionRequiredBeforeAcceptance: true,
      operatorMediationRequired: true,
    },
    acceptanceRule: {
      ruleKind: "reviewed_repo_work_packet_projection_log_candidate",
      appendSuccessIsAcceptance: false,
      storageVisibilityIsContinuity: false,
      replicaVisibilityIsContinuity: false,
      reviewVisibilityIsReadiness: false,
      deterministicApplyRequiredBeforeAcceptance: true,
      requiresSourceRefs: true,
      requiresCausalSubstrateInterpretation: true,
      requiresFailClosedTestbedPressure: true,
    },
    storageLanePosture: {
      intendedStorageLane: "bounded_autobase_equivalent_projection_lane",
      productionBackendPromoted: false,
      productionAutobaseStarted: false,
      storageRecordPromoted: false,
      edgeStateMigration: false,
      localFileStorageIsSubstrate: false,
      localPathSeam: false,
      httpSeam: false,
      sshSeam: false,
    },
    boundary: {
      candidateOnly: true,
      fixtureBacked: true,
      reviewOnly: true,
      evidenceOnly: true,
      writesFiles: false,
      networkCalls: false,
      opensCorestore: false,
      opensAutobase: false,
      writesContinuityRecords: false,
      migratesEdgeState: false,
      startsBackend: false,
      productionLocalLayerState: false,
    },
    nonClaims: {
      truthClaimed: false,
      authorityGranted: false,
      writerAuthorityGranted: false,
      appendAcceptanceClaimed: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      causalTruthClaimed: false,
    },
    ...overrides,
  };
}

test("Edge repo work packet projection-log candidate imports as causal pressure only", () => {
  const artifact = buildEdgeRepoWorkPacketProjectionLogCandidateEvidenceArtifact({
    candidate: candidate(),
    emittedAt: "2026-05-17T16:30:00.000Z",
  });

  assert.equal(artifact.artifactKind, CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_CANDIDATE_EVIDENCE_SCHEMA);
  assert.equal(artifact.reviewStatus, "edge-repo-work-packet-projection-log-candidate-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-repo-work-packet-projection-log-candidate-valid-evidence");
  assert.equal(artifact.refs.candidateId, "edge-repo-work-packet-projection-log-candidate:aaaaaaaaaaaaaaaaaaaaaaaa");
  assert.equal(artifact.refs.continuityEventId, "continuity:edge-repo-work-packet:example");
  assert.equal(artifact.storageEnvelope.storageEnvelopeOnly, true);
  assert.equal(artifact.storageEnvelope.semanticContinuityUnit, false);
  assert.equal(artifact.acceptanceRule.appendSuccessIsAcceptance, false);
  assert.equal(artifact.acceptanceRule.storageVisibilityIsContinuity, false);
  assert.equal(artifact.acceptanceRule.reviewVisibilityIsReadiness, false);
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
});

test("Edge repo work packet projection-log candidate blocks backend and acceptance overclaims", () => {
  const artifact = buildEdgeRepoWorkPacketProjectionLogCandidateEvidenceArtifact({
    candidate: candidate({
      acceptanceRule: {
        appendSuccessIsAcceptance: true,
        storageVisibilityIsContinuity: true,
        replicaVisibilityIsContinuity: false,
        reviewVisibilityIsReadiness: false,
        requiresCausalSubstrateInterpretation: true,
        requiresFailClosedTestbedPressure: true,
      },
      storageLanePosture: {
        intendedStorageLane: "bounded_autobase_equivalent_projection_lane",
        productionBackendPromoted: false,
        productionAutobaseStarted: true,
        storageRecordPromoted: false,
        edgeStateMigration: false,
        localFileStorageIsSubstrate: false,
        localPathSeam: false,
        httpSeam: false,
        sshSeam: false,
      },
    }),
    emittedAt: "2026-05-17T16:30:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-repo-work-packet-projection-log-candidate-guardrail-blocked");
  assert.equal(artifact.rejections.includes("acceptance-rule-missing-or-unsafe"), true);
  assert.equal(artifact.rejections.includes("storage-lane-posture-missing-or-unsafe"), true);
});

test("Edge repo work packet projection-log candidate blocks unsafe seams and authority claims", () => {
  const artifact = buildEdgeRepoWorkPacketProjectionLogCandidateEvidenceArtifact({
    candidate: candidate({
      sourceRefs: ["http://127.0.0.1:8787/status"],
      nonClaims: {
        truthClaimed: false,
        authorityGranted: false,
        writerAuthorityGranted: true,
        appendAcceptanceClaimed: false,
        durableStateClaimed: false,
        replicatedStateClaimed: false,
        causalTruthClaimed: false,
      },
    }),
    emittedAt: "2026-05-17T16:30:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-repo-work-packet-projection-log-candidate-guardrail-blocked");
  assert.equal(artifact.rejections.includes("unsafe-seam-ref"), true);
  assert.equal(artifact.rejections.includes("truth-authority-or-state-claim"), true);
});
