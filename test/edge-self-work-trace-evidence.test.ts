import assert from "node:assert/strict";
import test from "node:test";

import {
  assertEdgeSelfWorkTraceEvidenceArtifact,
  buildEdgeSelfWorkTraceEvidenceArtifact,
  CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA,
  CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

const EMITTED_AT = "2026-05-16T12:00:00.000Z";

function completeTrace(): any {
  return {
    operatorIntentRefs: ["edge-operator-intent:self-work-goal-point"],
    workPacketRefs: ["edge-cross-project-work-packet:self-work-goal-point"],
    operatorDecisionRefs: ["edge-operator-decision:self-work-goal-point"],
    proposalRefs: ["edge-self-work-patch-proposal:self-work-goal-point"],
    approvalRefs: ["edge-self-work-patch-approval:self-work-goal-point"],
    executorReceiptRefs: ["edge-self-work-patch-executor-receipt:self-work-goal-point"],
    verificationRefs: ["npm-test:mesh-ecology-edge:self-work-goal-point"],
    causalHappeningRefs: ["happening:edge-self-work-cycle:self-work-goal-point"],
    causalFrontierRefs: ["causal-frontier:edge-self-work:self-work-goal-point"],
    operatorReturnSurfaceRefs: ["edge-operator-return-surface:self-work-goal-point"],
    sourceRepoRefs: ["repo:mesh-ecology-edge"],
    progress: {
      observationPresent: true,
      workPacketPresent: true,
      operatorMediationPresent: true,
      executionReceiptPresent: true,
      verificationPresent: true,
      causalInterpretationPresent: true,
      testbedPressureExpected: true,
      operatorReturnPresent: true,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      runtimeAuthorityClaimed: false,
      consensusClaimed: false,
      backendOwnershipClaimed: false,
      edgeOwnsPlatform: false,
      edgeOwnsMeshRuntime: false,
    },
  };
}

function build(trace = completeTrace()) {
  return buildEdgeSelfWorkTraceEvidenceArtifact({
    trace,
    emittedAt: EMITTED_AT,
    sourceRepo: "causal-substrate",
    sourcePath: "test/edge-self-work-trace-evidence.test.ts",
  });
}

test("complete Edge self-work trace emits evidence without executing Edge", () => {
  const artifact = build();

  assertEdgeSelfWorkTraceEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_SELF_WORK_TRACE_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-self-work-trace-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-self-work-trace-complete");
  assert.equal(artifact.validation.requiredLoopRefsPresent, true);
  assert.equal(artifact.validation.causalRefsPresent, true);
  assert.equal(artifact.validation.verificationRefsPresent, true);
  assert.equal(artifact.progress.testbedPressureExpected, true);
  assert.equal(artifact.boundary.callsEdge, false);
  assert.equal(artifact.boundary.executesWork, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.deepEqual(artifact.rejections, []);
});

test("self-work trace is incomplete when causal refs or proof refs are missing", () => {
  const trace = completeTrace();
  trace.causalHappeningRefs = [];
  trace.causalFrontierRefs = [];
  trace.verificationRefs = [];

  const artifact = build(trace);

  assert.equal(artifact.reviewStatus, "edge-self-work-trace-incomplete");
  assert.ok(artifact.rejections.includes("causal-refs-missing"));
  assert.ok(artifact.rejections.includes("verification-refs-missing"));
  assert.equal(artifact.validation.causalRefsPresent, false);
  assert.equal(artifact.validation.verificationRefsPresent, false);
});

test("self-work trace blocks HTTP SSH local path refs and authority claims", () => {
  const trace = completeTrace();
  trace.executorReceiptRefs = ["http://127.0.0.1:8787/receipt.json"];
  trace.nonClaims.truthClaimed = true;
  trace.nonClaims.edgeOwnsPlatform = true;

  const artifact = build(trace);

  assert.equal(artifact.reviewStatus, "edge-self-work-trace-guardrail-blocked");
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.ok(artifact.rejections.includes("truth-completion-authority-runtime-or-consensus-claim"));
  assert.equal(artifact.validation.unsafeSeamRefsBlocked, false);
  assert.equal(artifact.validation.unsafeClaimsBlocked, false);
});

test("malformed self-work trace remains non-accepted evidence", () => {
  const artifact = build(null);

  assert.equal(artifact.reviewStatus, "edge-self-work-trace-malformed");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.rejections, ["trace-not-object"]);
});
