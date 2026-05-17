import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeRepoWorkPacketProjectionLogApplyResultEvidenceArtifact,
  CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-17T17:00:00.000Z";

function validApplyResult() {
  return {
    artifactKind: "edge_repo_work_packet_projection_log_apply_result",
    schemaVersion: "edge_repo_work_packet_projection_log_apply_result.v0",
    applyResultId: "edge-repo-work-packet-projection-log-apply-result:aaaaaaaaaaaaaaaaaaaaaaaa",
    candidateRef: {
      kind: "edge_repo_work_packet_projection_log_candidate",
      schemaVersion: "edge_repo_work_packet_projection_log_candidate.v0",
      id: "edge-repo-work-packet-projection-log-candidate:aaaaaaaaaaaaaaaaaaaaaaaa",
      hash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    appendRef: {
      kind: "edge_repo_work_packet_projection_log_lab_append_record",
      schemaVersion: "edge_repo_work_packet_projection_log_lab_append_record.v0",
      id: "edge-repo-work-packet-projection-log-lab-append:aaaaaaaaaaaaaaaaaaaaaaaa",
      hash: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    },
    applyState: "accepted_lab",
    acceptedContinuity: false,
    acceptedProductionContinuity: false,
    checks: {
      schemaValid: true,
      sourceRefsPresent: true,
      causalRefsOrDeferralValid: true,
      storageEnvelopeOnly: true,
      writerPolicyLabOnly: true,
      unsafeCanonicalSeamsAbsent: true,
      nonClaimsPreserved: true,
    },
    blockedReasons: [],
    boundedShape: {
      refsOnly: true,
      candidatePayloadEmbedded: false,
      appendPayloadEmbedded: false,
      arbitraryMetadataAllowed: false,
      arbitraryNotesAllowed: false,
      maxBlockedReasons: 12,
      blobPayloadsUseExternalRefs: true,
    },
    posture: {
      appendSuccessIsAcceptance: false,
      applySuccessIsTruth: false,
      labResultIsReadiness: false,
      productionAutobaseStarted: false,
      durableContinuityPromoted: false,
      edgeStateMigrated: false,
    },
  };
}

test("imports repo-work-packet projection-log apply result as bounded lab pressure only", () => {
  const evidence = buildEdgeRepoWorkPacketProjectionLogApplyResultEvidenceArtifact({
    applyResult: validApplyResult(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_ARTIFACT_KIND);
  assert.equal(evidence.schema, CAUSAL_EDGE_REPO_WORK_PACKET_PROJECTION_LOG_APPLY_RESULT_EVIDENCE_SCHEMA);
  assert.equal(evidence.reviewStatus, "edge-repo-work-packet-projection-log-apply-result-evidence-emitted");
  assert.equal(evidence.applyState, "accepted_lab");
  assert.equal(evidence.acceptedContinuity, false);
  assert.equal(evidence.acceptedProductionContinuity, false);
  assert.equal(evidence.validation.acceptedLabOnly, true);
  assert.equal(evidence.validation.checksSafe, true);
  assert.equal(evidence.validation.boundedShapeSafe, true);
  assert.equal(evidence.validation.postureSafe, true);
  assert.equal(evidence.boundary.opensAutobase, false);
  assert.equal(evidence.boundary.opensCorestore, false);
  assert.equal(evidence.boundary.writesContinuityRecords, false);
  assert.equal(evidence.boundary.acceptsProductionContinuity, false);
  assert.equal(evidence.boundary.claimsCausalTruth, false);
});

test("blocks apply result truth, readiness, backend, and continuity overclaims", () => {
  const result = validApplyResult();
  result.acceptedContinuity = true;
  result.posture.applySuccessIsTruth = true;
  result.posture.labResultIsReadiness = true;
  result.posture.productionAutobaseStarted = true;
  result.posture.durableContinuityPromoted = true;
  const evidence = buildEdgeRepoWorkPacketProjectionLogApplyResultEvidenceArtifact({
    applyResult: result,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-repo-work-packet-projection-log-apply-result-guardrail-blocked");
  assert.equal(evidence.validation.postureSafe, false);
  assert.equal(evidence.validation.noAuthorityOrTruthClaim, false);
  assert.equal(evidence.rejections.includes("posture-overclaim"), true);
  assert.equal(evidence.rejections.includes("truth-authority-readiness-or-state-claim"), true);
});

test("blocks unbounded payload embedding and unsafe refs", () => {
  const result = validApplyResult();
  result.candidateRef.id = "http://127.0.0.1:8787/candidate";
  result.boundedShape.candidatePayloadEmbedded = true;
  result.boundedShape.arbitraryMetadataAllowed = true;
  const evidence = buildEdgeRepoWorkPacketProjectionLogApplyResultEvidenceArtifact({
    applyResult: result,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-repo-work-packet-projection-log-apply-result-guardrail-blocked");
  assert.equal(evidence.validation.refsSafe, false);
  assert.equal(evidence.validation.boundedShapeSafe, false);
  assert.equal(evidence.rejections.includes("unsafe-ref"), true);
  assert.equal(evidence.rejections.includes("bounded-shape-missing-or-unsafe"), true);
});
