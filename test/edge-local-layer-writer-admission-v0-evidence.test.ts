import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeLocalLayerWriterAdmissionV0EvidenceArtifact,
  CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_SCHEMA,
} from "../src/index.js";

const EMITTED_AT = "2026-05-17T20:10:00.000Z";

function writerAdmissionPacket() {
  return {
    artifactKind: "edge_local_layer_writer_admission_v0_packet",
    schemaVersion: "edge_local_layer_writer_admission_v0_packet.v0",
    packetId: "edge-local-layer-writer-admission-v0:aaaaaaaaaaaaaaaaaaaaaaaa",
    packetHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    createdAt: "2026-05-17T20:00:00.000Z",
    layerRef: "local-layer:operator-owned-devices",
    laneRef: "local-layer-continuity-lane:operator-owned-devices-lab",
    operatorRef: "operator:edge-operator",
    sourceFixtureRef: "edge-continuity-lane-autobase-lab-review-chain:fixture",
    sourceLaneEntryRef: "local-layer-continuity-lane-entry:aaaaaaaaaaaaaaaaaaaaaaaa",
    sourceSemanticEventRef: "continuity:edge-repo-work-packet:continuity-lane-lab",
    sourceRefs: [
      "edge-continuity-lane-autobase-lab-review-chain:fixture",
      "local-layer-continuity-lane-entry:aaaaaaaaaaaaaaaaaaaaaaaa",
      "continuity:edge-repo-work-packet:continuity-lane-lab",
      "causal-edge-local-layer-continuity-lane-autobase-lab-evidence:fixture",
      "testbed-edge-local-layer-continuity-lane-autobase-lab:fixture",
    ],
    roleRefs: {
      observerRefs: ["local-layer-observer:operator-phone"],
      readerRefs: ["local-layer-reader:operator-laptop"],
      proposerRefs: ["local-layer-proposer:edge-self-work"],
      candidateAppenderRefs: ["local-layer-candidate-appender:operator-tablet"],
      admittedWriterRefs: ["local-layer-writer:operator-laptop"],
      operatorApproverRefs: ["operator-approver:primary-operator"],
      rejectedWriterRefs: ["local-layer-writer:unknown-device"],
      supersedesAdmissionRefs: [],
    },
    roleSeparation: {
      observabilityIsAuthority: false,
      observabilityIsWritability: false,
      readabilityIsWritability: false,
      proposerIsWriter: false,
      candidateAppendIsWriterAdmission: false,
      candidateAppendIsAcceptedContinuity: false,
      writabilityIsAuthority: false,
      admittedWriterIsAuthority: false,
      operatorApprovalIsContinuityAcceptance: false,
      appendSuccessIsAcceptance: false,
      applyValidationOwnsAcceptance: true,
      operatorMediationRequired: true,
    },
    writerAdmissionPolicy: {
      policyKind: "operator_owned_device_writer_admission_v0",
      writerPolicyVersion: 0,
      admittedWriterRefs: ["local-layer-writer:operator-laptop"],
      candidateAppenderRefs: ["local-layer-candidate-appender:operator-tablet"],
      rejectedWriterRefs: ["local-layer-writer:unknown-device"],
      operatorApproverRefs: ["operator-approver:primary-operator"],
      explicitOperatorApprovalRequiredForAdmission: true,
      writerAdmissionRequiredBeforeAcceptance: true,
      deterministicApplyRequired: true,
      candidateAppenderCanAppendProvisional: true,
      candidateAppendRequiresAcceptanceGate: true,
      candidateAppendMaterializesContinuity: false,
      generalWriterAuthorityGranted: false,
      writerAuthorityGranted: false,
      authorityGranted: false,
    },
    readerPolicy: {
      readerPolicyKind: "operator_owned_local_layer_readers_by_explicit_refs",
      observerRefs: ["local-layer-observer:operator-phone"],
      readerRefs: ["local-layer-reader:operator-laptop"],
      explicitKeyOrProofRequired: true,
      readAccessImpliesWriteAccess: false,
      readAccessImpliesAuthority: false,
      publicRead: false,
      localPathReadSeam: false,
      httpReadSeam: false,
      sshReadSeam: false,
    },
    proposerPolicy: {
      proposerRefs: ["local-layer-proposer:edge-self-work"],
      proposerCanCreateCandidateAdmissionPacket: true,
      proposerCanGrantAdmission: false,
      proposerCanAcceptContinuity: false,
      proposerCanPromoteProductionLane: false,
    },
    acceptanceRule: {
      ruleKind: "deterministic_apply_validates_admitted_writer_input",
      appendSuccessIsAcceptance: false,
      candidateAppendIsAcceptance: false,
      replicaVisibilityIsContinuity: false,
      linearizationIsTruth: false,
      operatorApprovalIsTruth: false,
      testbedReviewIsReadiness: false,
      causalReviewIsTruth: false,
      requiresValidSchema: true,
      requiresSourceRefs: true,
      requiresCausalSubstrateInterpretation: true,
      requiresFailClosedTestbedPressure: true,
      requiresOperatorApprovalForAdmission: true,
      requiresAdmittedWriterForAcceptedContinuity: true,
      requiresDeterministicApplyValidation: true,
    },
    implementationRoute: {
      currentStage: "writer_admission_v0",
      previousStage: "review_chain_fixture_reproducible",
      nextImplementationGate: "operator_recorded_promotion_decision",
      finalPromotionGate: "production_local_layer_lane_promotion_decision",
      productionCheckpointRequired: true,
      productionBackendAllowed: false,
      productionLanePromotionAllowed: false,
      edgeStateMigrationAllowed: false,
    },
    boundary: {
      packetOnly: true,
      opensAutobase: false,
      opensCorestore: false,
      writesAutobase: false,
      writesContinuityRecords: false,
      startsBackend: false,
      productionLocalLayerState: false,
      migratesEdgeState: false,
      grantsWriterAuthority: false,
      grantsRuntimeAuthority: false,
      publishesToMesh: false,
      callsTestbed: false,
      callsCausalSubstrate: false,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      writerAuthorityGranted: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      canonicalHistoryClaimed: false,
      causalTruthClaimed: false,
      meshTruthClaimed: false,
      runtimeAuthorityClaimed: false,
      rendererAuthorityClaimed: false,
      productionProofClaimed: false,
    },
  };
}

test("imports Edge writer admission v0 packet as passive causal evidence", () => {
  const evidence = buildEdgeLocalLayerWriterAdmissionV0EvidenceArtifact({
    writerAdmissionPacket: writerAdmissionPacket(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_ARTIFACT_KIND);
  assert.equal(evidence.schema, CAUSAL_EDGE_LOCAL_LAYER_WRITER_ADMISSION_V0_EVIDENCE_SCHEMA);
  assert.equal(evidence.reviewStatus, "edge-local-layer-writer-admission-v0-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-local-layer-writer-admission-v0-valid-evidence");
  assert.equal(evidence.refs.packetId, "edge-local-layer-writer-admission-v0:aaaaaaaaaaaaaaaaaaaaaaaa");
  assert.equal(evidence.refs.nextGate, "operator_recorded_promotion_decision");
  assert.equal(evidence.roleSeparation.observabilityIsWritability, false);
  assert.equal(evidence.roleSeparation.readabilityIsWritability, false);
  assert.equal(evidence.writerAdmissionPolicy.writerAuthorityGranted, false);
  assert.equal(evidence.acceptanceRule.appendSuccessIsAcceptance, false);
  assert.equal(evidence.implementationRoute.productionLanePromotionAllowed, false);
  assert.equal(evidence.causalInterpretation.writerAdmissionGrantsAuthority, false);
  assert.equal(evidence.boundary.opensAutobase, false);
  assert.equal(evidence.boundary.writesContinuityRecords, false);
  assert.equal(evidence.boundary.claimsCausalTruth, false);
});

test("blocks writer admission v0 unsafe refs", () => {
  const packet = writerAdmissionPacket();
  packet.roleRefs.admittedWriterRefs = ["http://127.0.0.1:8787/writer"];
  packet.writerAdmissionPolicy.admittedWriterRefs = ["http://127.0.0.1:8787/writer"];
  const evidence = buildEdgeLocalLayerWriterAdmissionV0EvidenceArtifact({
    writerAdmissionPacket: packet,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-writer-admission-v0-guardrail-blocked");
  assert.equal(evidence.validation.refsSafe, false);
  assert.equal(evidence.rejections.includes("unsafe-ref"), true);
});

test("blocks writer admission v0 production and authority overclaims", () => {
  const packet = writerAdmissionPacket();
  packet.implementationRoute.productionLanePromotionAllowed = true;
  packet.boundary.grantsWriterAuthority = true;
  packet.writerAdmissionPolicy.writerAuthorityGranted = true;
  packet.nonClaims.causalTruthClaimed = true;
  const evidence = buildEdgeLocalLayerWriterAdmissionV0EvidenceArtifact({
    writerAdmissionPacket: packet,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-writer-admission-v0-guardrail-blocked");
  assert.equal(evidence.validation.noProductionOverclaim, false);
  assert.equal(evidence.rejections.includes("production-continuity-authority-or-truth-overclaim"), true);
});

test("blocks writer admission v0 rejected writer overlap", () => {
  const packet = writerAdmissionPacket();
  packet.roleRefs.rejectedWriterRefs = ["local-layer-writer:operator-laptop"];
  packet.writerAdmissionPolicy.rejectedWriterRefs = ["local-layer-writer:operator-laptop"];
  const evidence = buildEdgeLocalLayerWriterAdmissionV0EvidenceArtifact({
    writerAdmissionPacket: packet,
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-writer-admission-v0-guardrail-blocked");
  assert.equal(evidence.rejections.includes("role-overlap-unsafe"), true);
});
