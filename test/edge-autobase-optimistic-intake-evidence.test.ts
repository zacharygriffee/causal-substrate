import assert from "node:assert/strict";
import test from "node:test";

import {
  assertEdgeAutobaseOptimisticIntakeEvidenceArtifact,
  buildEdgeAutobaseOptimisticIntakeEvidenceArtifact,
  CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA,
  CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

function validOptimisticIntakeLabResult(): any {
  return {
    artifactKind: "edge_sandboxed_autobase_optimistic_intake_lab_result",
    schemaVersion: "edge_sandboxed_autobase_optimistic_intake_lab_result.v0",
    labStatus: "optimistic_intake_candidate_materialized",
    acceptedCandidateCount: 1,
    rejectedCandidateInputCount: 1,
    rejectedMaterializedCount: 0,
    acceptedCandidateWasWritableBeforeAppend: false,
    rejectedCandidateWasWritableBeforeAppend: false,
    acceptedCandidateWriterRef: "autobase-writer:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    rejectedCandidateWriterRef: "autobase-writer:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    acceptedSourceProjectionEventRefs: [
      "projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa",
    ],
    rejectedSourceProjectionEventRefs: [
      "projection:mesh-ecology-edge:operator_situation_view:bbbbbbbbbbbbbbbb",
    ],
    labPosture: {
      sandboxedAutobaseLab: true,
      optimisticIntakeLab: true,
      nonWriterIntakeAllowed: true,
      acceptedViaAckWriter: true,
      rejectedWithoutAckWriter: true,
      appendSuccessIsAcceptance: false,
      acceptanceSource: "deterministic_apply_ackWriter_and_derived_view_materialization",
      productionLocalLayerState: false,
      writesDurableLocalLayerState: false,
      localStoreRootIsIntegrationSeam: false,
      httpSeam: false,
      sshSeam: false,
      wallClockDefinesCausalOrder: false,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      universalConsensusClaimed: false,
      meshSettlementClaimed: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
    },
  };
}

test("valid Edge Autobase optimistic intake lab imports as causal evidence only", () => {
  const artifact = buildEdgeAutobaseOptimisticIntakeEvidenceArtifact({
    labResult: validOptimisticIntakeLabResult(),
    emittedAt: "2026-05-16T18:00:00.000Z",
  });

  assertEdgeAutobaseOptimisticIntakeEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_AUTOBASE_OPTIMISTIC_INTAKE_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-autobase-optimistic-intake-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-autobase-optimistic-intake-valid-evidence");
  assert.equal(artifact.source.sourceRepo, "mesh-ecology-edge");
  assert.equal(artifact.source.sourceArtifactKind, "edge_sandboxed_autobase_optimistic_intake_lab_result");
  assert.equal(artifact.source.sourceSchema, "edge_sandboxed_autobase_optimistic_intake_lab_result.v0");
  assert.equal(artifact.candidateRefs.acceptedCandidateWriterRef?.startsWith("autobase-writer:"), true);
  assert.equal(artifact.candidateRefs.rejectedCandidateWriterRef?.startsWith("autobase-writer:"), true);
  assert.equal(artifact.candidateRefs.acceptedSourceProjectionEventRefs.length, 1);
  assert.equal(artifact.candidateRefs.rejectedSourceProjectionEventRefs.length, 1);
  assert.equal(artifact.intakePosture.sandboxedAutobaseLab, true);
  assert.equal(artifact.intakePosture.optimisticIntakeLab, true);
  assert.equal(artifact.intakePosture.nonWriterIntakeAllowed, true);
  assert.equal(artifact.intakePosture.acceptedViaAckWriter, true);
  assert.equal(artifact.intakePosture.rejectedWithoutAckWriter, true);
  assert.equal(artifact.intakePosture.appendSuccessIsAcceptance, false);
  assert.equal(artifact.validation.rejectedCandidateNotMaterialized, true);
  assert.equal(artifact.validation.nonWriterBeforeAppend, true);
  assert.equal(artifact.validation.ackWriterAcceptancePresent, true);
  assert.equal(artifact.validation.appendSuccessAcceptanceBlocked, true);
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.opensCorestore, false);
  assert.equal(artifact.boundary.acceptsAppendAsAcceptance, false);
  assert.equal(artifact.boundary.grantsWriterAuthority, false);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.deepEqual(artifact.rejections, []);
  assert.ok(artifact.warnings.includes("append-success-is-not-acceptance"));
  assert.ok(artifact.warnings.includes("ack-writer-and-derived-view-materialization-are-acceptance-evidence"));
});

test("optimistic intake evidence blocks append-as-acceptance and rejected materialization", () => {
  const labResult = validOptimisticIntakeLabResult();
  labResult.rejectedMaterializedCount = 1;
  labResult.labPosture.appendSuccessIsAcceptance = true;

  const artifact = buildEdgeAutobaseOptimisticIntakeEvidenceArtifact({
    labResult,
    emittedAt: "2026-05-16T18:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-autobase-optimistic-intake-guardrail-blocked");
  assert.ok(artifact.rejections.includes("rejected-candidate-materialized"));
  assert.ok(artifact.rejections.includes("append-success-treated-as-acceptance"));
  assert.equal(artifact.validation.rejectedCandidateNotMaterialized, false);
  assert.equal(artifact.validation.appendSuccessAcceptanceBlocked, false);
  assert.equal(artifact.boundary.acceptsAppendAsAcceptance, false);
});

test("optimistic intake evidence blocks pre-admitted candidates, unsafe seams, and state claims", () => {
  const labResult = validOptimisticIntakeLabResult();
  labResult.acceptedCandidateWasWritableBeforeAppend = true;
  labResult.acceptedSourceProjectionEventRefs = ["http://127.0.0.1:8787/projection"];
  labResult.labPosture.productionLocalLayerState = true;
  labResult.nonClaims.replicatedStateClaimed = true;

  const artifact = buildEdgeAutobaseOptimisticIntakeEvidenceArtifact({
    labResult,
    emittedAt: "2026-05-16T18:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-autobase-optimistic-intake-guardrail-blocked");
  assert.ok(artifact.rejections.includes("candidate-writable-before-append"));
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.ok(artifact.rejections.includes("backend-or-seam-overclaim"));
  assert.ok(artifact.rejections.includes("truth-authority-settlement-or-state-claim"));
  assert.equal(artifact.validation.nonWriterBeforeAppend, false);
  assert.equal(artifact.validation.unsafeSeamRefsBlocked, false);
  assert.equal(artifact.validation.unsafeClaimsBlocked, false);
});

test("optimistic intake evidence reports missing acceptance gates as incomplete", () => {
  const labResult = validOptimisticIntakeLabResult();
  labResult.labPosture.acceptedViaAckWriter = false;
  labResult.labPosture.acceptanceSource = "append_return_value";

  const artifact = buildEdgeAutobaseOptimisticIntakeEvidenceArtifact({
    labResult,
    emittedAt: "2026-05-16T18:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-autobase-optimistic-intake-incomplete-evidence");
  assert.ok(artifact.rejections.includes("ack-writer-acceptance-missing"));
  assert.ok(artifact.rejections.includes("acceptance-source-mismatch"));
  assert.equal(artifact.validation.ackWriterAcceptancePresent, false);
});

test("optimistic intake evidence treats malformed input as non-accepted evidence", () => {
  const artifact = buildEdgeAutobaseOptimisticIntakeEvidenceArtifact({
    labResult: null,
    emittedAt: "2026-05-16T18:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-autobase-optimistic-intake-malformed-evidence");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.candidateRefs.acceptedSourceProjectionEventRefs, []);
  assert.deepEqual(artifact.rejections, ["lab-result-not-object"]);
});
