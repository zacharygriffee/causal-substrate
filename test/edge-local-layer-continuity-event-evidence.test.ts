import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEdgeLocalLayerContinuityEventEvidenceArtifact,
  CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA,
  CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

function validContinuityEvent(): any {
  return {
    artifactKind: "mesh_ecology_local_layer_continuity_event",
    schemaVersion: "mesh-ecology-edge/local-layer-continuity-event-draft/v0",
    draft: true,
    promotedContinuity: false,
    continuityRole: "edge_operation_event_scaffold",
    continuityCategory: "operation_event",
    eventId: "continuity:edge-operation-event:op-1:operator_decision_attached",
    sourceEventRef: "edge-operation-event:op-1:operator_decision_attached",
    operationRef: "edge-operation:op-1",
    eventKind: "operator_decision_attached",
    occurredAt: "2026-05-17T15:29:00.000Z",
    producerRepo: "mesh-ecology-edge",
    origin: {
      originRef: "edge-operation:op-1",
      sourceRef: "edge-operation-event:op-1:operator_decision_attached",
      operatorSeatRef: "operator-seat:local",
      deviceRef: "local-layer-device:operator-laptop",
      repoRef: "repo:mesh-ecology-edge",
      parentEventRefs: ["edge-operation-event:op-1:opened"],
    },
    provenanceRefs: [
      "edge-operation:op-1",
      "edge-operation-event:op-1:operator_decision_attached",
      "edge-operation-event:op-1:opened",
      "work-packet:edge-continuity-event-scaffold",
    ],
    participantRefs: ["local-layer-participant:edge-operator"],
    evidenceRefs: ["work-packet:edge-continuity-event-scaffold"],
    receiptRefs: ["receipt:operator-review:accepted"],
    membraneCrossing: {
      crossingKind: "operator_decision",
      crossingRef: "membrane-crossing:operator_decision:edge-operation-event:op-1:operator_decision_attached",
      sourceDomain: "edge_operator_loop",
      targetDomain: "local_layer_continuity_draft",
      validationRequired: true,
    },
    storagePosture: {
      storageKind: "local_json_operation_trail",
      storageRole: "compatibility_scaffold",
      scaffoldStorage: true,
      localFileStorage: true,
      sourceIsSubstrate: false,
      localLayerSubstrate: false,
      durableLocalLayerState: false,
      decentralizedState: false,
      canonicalMaterializedHistory: false,
      replaceableLayout: true,
      autobaseBackend: false,
      hypercoreCorestoreBackend: false,
      hyperbeeIndex: false,
    },
    acceptancePosture: {
      acceptedContinuity: false,
      deterministicApplyRequired: true,
      appendSuccessIsAcceptance: false,
      writeSuccessIsAcceptance: false,
      storageVisibilityIsContinuity: false,
      operatorApprovalMayBeRequired: true,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      storageIsSubstrate: false,
      appendSuccessIsAcceptance: false,
      writeSuccessIsAcceptance: false,
      materializedStateClaimed: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      canonicalHistoryClaimed: false,
      causalTruthClaimed: false,
      meshTruthClaimed: false,
      runtimeAuthorityClaimed: false,
      rendererAuthorityClaimed: false,
    },
  };
}

function validRepoWorkPacketContinuityEvent(): any {
  return {
    ...validContinuityEvent(),
    continuityRole: "edge_repo_work_packet_scaffold",
    continuityCategory: "repo_work_packet",
    eventId: "continuity:edge-repo-work-packet:edge-cross-project-work-packet:repo-work:continuity-event",
    sourceEventRef: "edge-repo-work-packet:edge-cross-project-work-packet:repo-work:continuity-event",
    operationRef: "edge-repo-work-packet:edge-cross-project-work-packet:repo-work:continuity-event",
    eventKind: "repo_work_packet_proposed",
    origin: {
      originRef: "edge-repo-work-packet:edge-cross-project-work-packet:repo-work:continuity-event",
      sourceRef: "edge-cross-project-work-packet:repo-work:continuity-event",
      operatorSeatRef: "operator-seat:local",
      deviceRef: "local-layer-device:operator-laptop",
      repoRef: "repo:mesh-ecology-edge",
      targetRepoRef: "repo:mesh-ecology-edge",
      targetSurfaceRef: "edge-target-surface:mesh-ecology-edge:edge_self_work_review",
      parentEventRefs: [],
    },
    provenanceRefs: [
      "edge-cross-project-work-packet:repo-work:continuity-event",
      "edge-repo-work-packet:edge-cross-project-work-packet:repo-work:continuity-event",
      "repo:mesh-ecology-edge",
      "edge-target-surface:mesh-ecology-edge:edge_self_work_review",
      "edge-self-work-trace:evidence",
    ],
    evidenceRefs: ["edge-self-work-trace:evidence"],
    receiptRefs: [],
    membraneCrossing: {
      crossingKind: "repo_work_packet_proposal",
      crossingRef: "membrane-crossing:repo_work_packet_proposal:edge-cross-project-work-packet:repo-work:continuity-event",
      sourceDomain: "edge_operator_loop",
      targetDomain: "repo_owned_work_review",
      validationRequired: true,
    },
    sourceRefPosture: {
      canonicalRefs: ["edge-self-work-trace:evidence"],
      scaffoldRefs: {
        localPathRefs: ["docs/work-packets/edge-repo-work-packet-continuity-event-v0.md"],
        transportEndpointRefs: ["http://127.0.0.1:8787/status"],
      },
      localPathsAreCanonicalSeams: false,
      transportEndpointsAreCanonicalSeams: false,
    },
    repoWorkPacketPosture: {
      sourceWorkPacketRef: "edge-cross-project-work-packet:repo-work:continuity-event",
      packetMode: "edge_self_work",
      packetState: "ready_for_operator_export",
      targetProjectId: "mesh-ecology-edge",
      targetRepo: "mesh-ecology-edge",
      targetSurface: "edge_self_work_review",
      operatorApprovalRequired: true,
      repoOwnsImplementation: true,
      workPacketIsAuthority: false,
      workPacketIsCompletion: false,
      workPacketIsTruth: false,
    },
    causalRefs: {
      branchRefs: [],
      segmentRefs: [],
      happeningRefs: [],
      presentPointRef: null,
      observerRef: "edge-operator",
      deferred: true,
      deferredReason: "repo_work_packet_continuity_event_without_promoted_lane",
      deferralPosture: "explicit_causal_ref_deferral",
    },
    storagePosture: {
      ...validContinuityEvent().storagePosture,
      storageKind: "local_json_or_exported_work_packet",
    },
  };
}

test("Edge continuity event maps as draft semantic input reference only", () => {
  const artifact = buildEdgeLocalLayerContinuityEventEvidenceArtifact({
    continuityEvent: validContinuityEvent(),
    sourcePath: "edge-continuity-event.json",
    emittedAt: "2026-05-17T16:00:00.000Z",
  });

  assert.equal(artifact.artifactKind, CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_LOCAL_LAYER_CONTINUITY_EVENT_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-local-layer-continuity-event-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-local-layer-continuity-event-valid-evidence");
  assert.equal(artifact.validation.draftContinuityEvent, true);
  assert.equal(artifact.validation.promotedContinuity, false);
  assert.equal(artifact.validation.originPresent, true);
  assert.equal(artifact.validation.provenanceRefsPresent, true);
  assert.equal(artifact.validation.membraneCrossingPresent, true);
  assert.equal(artifact.validation.storageScaffoldOnly, true);
  assert.equal(artifact.validation.acceptanceNotClaimed, true);
  assert.equal(artifact.validation.noAuthorityOrTruthClaim, true);
  assert.equal(artifact.happeningRefs.length, 1);
  const ref = artifact.happeningRefs[0]!;
  assert.equal(ref.happeningLabel, "edge-local-layer-continuity-event");
  assert.equal(ref.sourceContinuityEventRef, "continuity:edge-operation-event:op-1:operator_decision_attached");
  assert.equal(ref.sourceOperationRef, "edge-operation:op-1");
  assert.equal(ref.sourceEventRef, "edge-operation-event:op-1:operator_decision_attached");
  assert.equal(ref.originRef, "edge-operation:op-1");
  assert.equal(ref.operatorSeatRef, "operator-seat:local");
  assert.equal(ref.membraneCrossingKind, "operator_decision");
  assert.equal(ref.causalRole, "continuity-event-as-draft-semantic-input-reference");
  assert.equal(ref.observerRelative, true);
  assert.equal(ref.sourceShareBoundaryPreserved, true);
  assert.equal(ref.scaffoldStorageOnly, true);
  assert.equal(ref.acceptedAsContinuity, false);
  assert.equal(ref.acceptedAsCanonicalHistory, false);
  assert.equal(artifact.boundary.edgeCalled, false);
  assert.equal(artifact.boundary.sourceStorageOpened, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.acceptsContinuity, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
});

test("Edge repo-work-packet continuity event maps as draft semantic input reference only", () => {
  const artifact = buildEdgeLocalLayerContinuityEventEvidenceArtifact({
    continuityEvent: validRepoWorkPacketContinuityEvent(),
    sourcePath: "edge-repo-work-packet-continuity-event.json",
    emittedAt: "2026-05-17T16:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-continuity-event-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-local-layer-continuity-event-valid-evidence");
  assert.equal(artifact.happeningRefs.length, 1);
  const ref = artifact.happeningRefs[0]!;
  assert.equal(ref.happeningLabel, "edge-local-layer-continuity-event");
  assert.equal(ref.sourceContinuityEventRef, "continuity:edge-repo-work-packet:edge-cross-project-work-packet:repo-work:continuity-event");
  assert.equal(ref.sourceOperationRef, "edge-repo-work-packet:edge-cross-project-work-packet:repo-work:continuity-event");
  assert.equal(ref.sourceEventRef, "edge-repo-work-packet:edge-cross-project-work-packet:repo-work:continuity-event");
  assert.equal(ref.continuityRole, "edge_repo_work_packet_scaffold");
  assert.equal(ref.continuityCategory, "repo_work_packet");
  assert.equal(ref.membraneCrossingKind, "repo_work_packet_proposal");
  assert.equal(ref.targetDomain, "repo_owned_work_review");
  assert.equal(ref.causalRole, "continuity-event-as-draft-semantic-input-reference");
  assert.equal(ref.acceptedAsContinuity, false);
  assert.equal(ref.acceptedAsCanonicalHistory, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.acceptsContinuity, false);
  assert.equal(artifact.boundary.startsBackend, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
});

test("Edge continuity event mapping blocks storage acceptance and backend overclaims", () => {
  const event = validContinuityEvent();
  event.storagePosture.sourceIsSubstrate = true;
  event.storagePosture.autobaseBackend = true;
  event.acceptancePosture.acceptedContinuity = true;
  event.acceptancePosture.appendSuccessIsAcceptance = true;

  const artifact = buildEdgeLocalLayerContinuityEventEvidenceArtifact({
    continuityEvent: event,
    emittedAt: "2026-05-17T16:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-continuity-event-guardrail-blocked");
  assert.ok(artifact.rejections.includes("storage-overclaim"));
  assert.ok(artifact.rejections.includes("acceptance-overclaim"));
  assert.equal(artifact.validation.storageScaffoldOnly, false);
  assert.equal(artifact.validation.acceptanceNotClaimed, false);
  assert.deepEqual(artifact.happeningRefs, []);
});

test("Edge continuity event mapping blocks truth authority state and renderer overclaims", () => {
  const event = validContinuityEvent();
  event.nonClaims.truthClaimed = true;
  event.nonClaims.authorityGranted = true;
  event.nonClaims.replicatedStateClaimed = true;
  event.nonClaims.rendererAuthorityClaimed = true;

  const artifact = buildEdgeLocalLayerContinuityEventEvidenceArtifact({
    continuityEvent: event,
    emittedAt: "2026-05-17T16:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-continuity-event-guardrail-blocked");
  assert.ok(artifact.rejections.includes("authority-truth-state-or-substrate-claim"));
  assert.equal(artifact.validation.noAuthorityOrTruthClaim, false);
  assert.deepEqual(artifact.happeningRefs, []);
});

test("Edge continuity event mapping blocks transport and local path refs", () => {
  const event = validContinuityEvent();
  event.provenanceRefs = ["edge-operation:op-1", "http://127.0.0.1:8787/status"];
  event.evidenceRefs = ["/tmp/edge-state/operation.json"];
  event.receiptRefs = ["ssh://operator-node"];

  const artifact = buildEdgeLocalLayerContinuityEventEvidenceArtifact({
    continuityEvent: event,
    emittedAt: "2026-05-17T16:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-continuity-event-guardrail-blocked");
  assert.ok(artifact.rejections.includes("ref-contains-transport-or-local-path-seam"));
  assert.deepEqual(artifact.happeningRefs, []);
});

test("Edge continuity event mapping reports missing origin provenance and membrane posture as incomplete", () => {
  const event = validContinuityEvent();
  event.origin.originRef = "";
  event.provenanceRefs = [];
  event.membraneCrossing.validationRequired = false;

  const artifact = buildEdgeLocalLayerContinuityEventEvidenceArtifact({
    continuityEvent: event,
    emittedAt: "2026-05-17T16:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-continuity-event-incomplete-evidence");
  assert.ok(artifact.rejections.includes("origin-ref-missing"));
  assert.ok(artifact.rejections.includes("provenance-refs-missing"));
  assert.ok(artifact.rejections.includes("crossing-validation-missing"));
  assert.equal(artifact.validation.originPresent, false);
  assert.equal(artifact.validation.provenanceRefsPresent, false);
  assert.deepEqual(artifact.happeningRefs, []);
});

test("Edge continuity event mapping treats malformed input as non-accepted evidence", () => {
  const artifact = buildEdgeLocalLayerContinuityEventEvidenceArtifact({
    continuityEvent: null,
    emittedAt: "2026-05-17T16:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-local-layer-continuity-event-malformed-evidence");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.happeningRefs, []);
  assert.deepEqual(artifact.rejections, ["continuity-event-not-object"]);
});
