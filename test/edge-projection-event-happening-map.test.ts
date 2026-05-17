import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEdgeProjectionEventHappeningMapArtifact,
  CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_ARTIFACT_KIND,
  CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA,
  CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA_VERSION,
} from "../src/index.js";

function validProjectionEvent(): any {
  return {
    artifactKind: "mesh_ecology_local_layer_projection_event",
    schemaVersion: "mesh-ecology-spine/local-layer-projection-event/v0",
    eventId: "projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa",
    producerRepo: "mesh-ecology-edge",
    producerParticipantRef: "local-layer-participant:edge-operator",
    projectionKind: "operator_situation_view",
    projectionSchema: "edge_operator_situation_view_model.v1",
    projectionRef: "edge-operator-situation:op-status",
    sourceRefs: [
      "edge-operator-situation:op-status",
      "operation:op-status",
      `operator-events-dir-hash:sha256:${"b".repeat(64)}`,
      `target-config-hash:sha256:${"c".repeat(64)}`,
    ],
    causalRefs: {
      branchRefs: ["branch:edge-local-layer:operator-projection"],
      segmentRefs: ["segment:edge-local-layer:operator-projection:latest"],
      happeningRefs: ["happening:edge-status:op-status"],
      presentPointRef: "present-point:edge-operator:projection",
      observerRef: "observer:edge-operator",
    },
    transportRefs: ["protomux-rpc:hyperdht_direct_peer"],
    payloadHash: `sha256:${"a".repeat(64)}`,
    payloadHashAlgorithm: "sha256-canonical-json",
    identityHash: `sha256:${"d".repeat(64)}`,
    identityHashAlgorithm: "sha256-canonical-json",
    payloadEmbedded: false,
    derivedOnly: true,
    promotionPosture: {
      promotedMaterial: true,
      promotionRole: "semantic_continuity_input",
      decisionRef: "mesh-ecology-spine/docs/edge-state-promotion-decision-packet.md",
      storageRecordPromoted: false,
      backendPromoted: false,
      derivedViewPromoted: false,
      reviewStatusPromoted: false,
      replicatedLocalLayerContinuityClaimed: false,
    },
    writerPolicy: {
      writerKind: "edge_producer_operator_owned_local_layer_participant",
      writerRepo: "mesh-ecology-edge",
      producerParticipantRef: "local-layer-participant:edge-operator",
      boundedMultiwriterDeferred: true,
      autobaseWriterPolicyPromoted: false,
    },
    readerPolicy: {
      readerKind: "operator_owned_local_layer_readers_by_explicit_refs",
      explicitKeyOrProofRequired: true,
      publicRead: false,
      localPathReadSeam: false,
      httpReadSeam: false,
      sshReadSeam: false,
    },
    singleWriterProof: {
      proofOnly: true,
      writerRepo: "mesh-ecology-edge",
      writesProjectionLog: false,
      backend: "none",
      hypercoreCorestoreCandidate: true,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      rendererOwnsAuthority: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
    },
    storagePosture: {
      currentDurability: "not_durable_state",
      currentExportOnly: true,
      intendedDurableLane: "autobase_compatible_local_layer_projection_log",
      producerLogCandidate: "hypercore_corestore",
      indexCandidate: "hyperbee_materialized_view",
    },
    validation: {
      sourceRefsPresent: true,
      payloadHashPresent: true,
      projectionIsDerivedOnly: true,
      cliJsonRenderingOnly: true,
      promotedSemanticInput: true,
      sourceRefsSemantic: true,
      localFileTruth: false,
      durableState: false,
    },
  };
}

test("Edge projection event maps as promoted semantic continuity input only", () => {
  const artifact = buildEdgeProjectionEventHappeningMapArtifact({
    projectionEvent: validProjectionEvent(),
    sourcePath: "edge-projection-event.json",
    emittedAt: "2026-05-16T20:00:00.000Z",
  });

  assert.equal(artifact.artifactKind, CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_PROJECTION_EVENT_HAPPENING_MAP_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-projection-event-happening-map-emitted");
  assert.equal(artifact.validation.status, "edge-projection-event-valid");
  assert.equal(artifact.validation.promotedSemanticInput, true);
  assert.equal(artifact.validation.sourceRefsSemantic, true);
  assert.equal(artifact.validation.causalRefsPresent, true);
  assert.equal(artifact.validation.causalRefsDeferred, false);
  assert.equal(artifact.validation.causalRefDeferralValid, false);
  assert.equal(artifact.validation.identityHashPresent, true);
  assert.equal(artifact.validation.writerPolicyPresent, true);
  assert.equal(artifact.validation.readerPolicyPresent, true);
  assert.equal(artifact.happeningRefs.length, 1);
  const ref = artifact.happeningRefs[0]!;
  assert.equal(ref.happeningLabel, "edge-local-layer-projection-event");
  assert.equal(ref.sourceProjectionEventRef, "projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa");
  assert.equal(ref.promotionRole, "semantic_continuity_input");
  assert.equal(ref.causalRole, "projection-event-as-semantic-continuity-input");
  assert.equal(ref.storageRecordPromoted, false);
  assert.equal(ref.backendPromoted, false);
  assert.equal(ref.acceptedAsCanonicalHistory, false);
  assert.equal(ref.causalRefsDeferred, false);
  assert.deepEqual(ref.branchRefs, ["branch:edge-local-layer:operator-projection"]);
  assert.deepEqual(ref.sourceHappeningRefs, ["happening:edge-status:op-status"]);
  assert.equal(artifact.boundary.edgeCalled, false);
  assert.equal(artifact.boundary.sourceCorestoreOpened, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
});

test("Edge projection event mapping blocks path seams and promotion overclaims", () => {
  const event = validProjectionEvent();
  event.sourceRefs = ["/tmp/edge-status.json"];
  event.promotionPosture.storageRecordPromoted = true;
  event.readerPolicy.localPathReadSeam = true;

  const artifact = buildEdgeProjectionEventHappeningMapArtifact({
    projectionEvent: event,
    emittedAt: "2026-05-16T20:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-event-guardrail-blocked");
  assert.ok(artifact.rejections.includes("source-ref-compat-or-path-seam"));
  assert.ok(artifact.rejections.includes("promotion-overclaim"));
  assert.ok(artifact.rejections.includes("reader-policy-missing-or-unsafe"));
  assert.deepEqual(artifact.happeningRefs, []);
});

test("Edge projection event mapping blocks missing causal posture", () => {
  const event = validProjectionEvent();
  delete event.causalRefs;

  const artifact = buildEdgeProjectionEventHappeningMapArtifact({
    projectionEvent: event,
    emittedAt: "2026-05-16T20:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-event-guardrail-blocked");
  assert.ok(artifact.rejections.includes("causal-refs-missing"));
  assert.equal(artifact.validation.causalRefsPresent, false);
  assert.deepEqual(artifact.happeningRefs, []);
});

test("Edge projection event mapping accepts explicit causal-ref deferral", () => {
  const event = validProjectionEvent();
  event.causalRefs = {
    branchRefs: [],
    segmentRefs: [],
    happeningRefs: [],
    presentPointRef: null,
    observerRef: "observer:edge-operator",
    deferred: true,
    deferredReason: "status_projection_without_history_interpretation",
    deferralPosture: "explicit_causal_ref_deferral",
  };

  const artifact = buildEdgeProjectionEventHappeningMapArtifact({
    projectionEvent: event,
    emittedAt: "2026-05-16T20:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-event-happening-map-emitted");
  assert.equal(artifact.validation.status, "edge-projection-event-valid");
  assert.equal(artifact.validation.causalRefsPresent, false);
  assert.equal(artifact.validation.causalRefsDeferred, true);
  assert.equal(artifact.validation.causalRefDeferralValid, true);
  assert.equal(artifact.happeningRefs.length, 1);
  assert.equal(artifact.happeningRefs[0]!.causalRefsDeferred, true);
  assert.equal(artifact.happeningRefs[0]!.causalRefDeferralReason, "status_projection_without_history_interpretation");
  assert.equal(artifact.happeningRefs[0]!.causalRefDeferralPosture, "explicit_causal_ref_deferral");
});

test("Edge projection event mapping blocks malformed deferral and missing identity hash", () => {
  const event = validProjectionEvent();
  delete event.identityHash;
  event.causalRefs = {
    branchRefs: ["branch:edge-local-layer:operator-projection"],
    segmentRefs: [],
    happeningRefs: [],
    presentPointRef: null,
    observerRef: "observer:edge-operator",
    deferred: true,
    deferredReason: "status_projection_without_history_interpretation",
  };

  const artifact = buildEdgeProjectionEventHappeningMapArtifact({
    projectionEvent: event,
    emittedAt: "2026-05-16T20:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-event-guardrail-blocked");
  assert.ok(artifact.rejections.includes("causal-ref-deferral-malformed"));
  assert.ok(artifact.rejections.includes("identity-hash-missing"));
  assert.equal(artifact.validation.identityHashPresent, false);
  assert.deepEqual(artifact.happeningRefs, []);
});

test("Edge projection event mapping treats malformed input as non-accepted evidence", () => {
  const artifact = buildEdgeProjectionEventHappeningMapArtifact({
    projectionEvent: null,
    emittedAt: "2026-05-16T20:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-event-malformed");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.happeningRefs, []);
  assert.deepEqual(artifact.rejections, ["projection-event-not-object"]);
});
