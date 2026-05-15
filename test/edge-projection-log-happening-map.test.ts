import assert from "node:assert/strict";
import test from "node:test";

import {
  assertEdgeProjectionLogHappeningMapArtifact,
  buildEdgeProjectionLogHappeningMapArtifact,
  CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_ARTIFACT_KIND,
  CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA,
  CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA_VERSION,
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
      `sha256:${"b".repeat(64)}`,
    ],
    transportRefs: ["protomux-rpc:hyperdht_direct_peer"],
    payloadHash: `sha256:${"a".repeat(64)}`,
    payloadHashAlgorithm: "sha256-canonical-json",
    payloadEmbedded: false,
    derivedOnly: true,
    createdAt: "2026-05-15T13:00:00.000Z",
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
      localFileTruth: false,
      durableState: false,
    },
  };
}

function validLogEntry(): any {
  const event = validProjectionEvent();
  return {
    artifactKind: "edge_projection_event_log_entry",
    schemaVersion: "edge_projection_event_log_entry.v0",
    entryId: `projection-log-entry:${event.eventId}:0`,
    sequence: 0,
    appendedAt: "2026-05-15T13:00:01.000Z",
    projectionEventId: event.eventId,
    projectionEventSchema: event.schemaVersion,
    projectionRef: event.projectionRef,
    payloadHash: event.payloadHash,
    payloadHashAlgorithm: event.payloadHashAlgorithm,
    sourceRefs: [...event.sourceRefs],
    transportRefs: [...event.transportRefs],
    namespaceParts: [
      "mesh-ecology",
      "local-layer",
      "projection-event",
      "v0",
      "producer-mesh-ecology-edge",
      "projection-operator-situation-view",
    ],
    projectionEvent: event,
    logPosture: {
      singleWriterLocalCorestoreProof: true,
      replicatedLocalLayerState: false,
      autobaseBackend: false,
      hyperbeeIndex: false,
      httpSeam: false,
      sshSeam: false,
      localStoreRootIsIntegrationSeam: false,
      writesProjectionLog: true,
      proofOnly: true,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      replicatedStateClaimed: false,
      rendererOwnsAuthority: false,
    },
  };
}

test("Edge projection log entry maps to a happening reference without writing continuity", () => {
  const artifact = buildEdgeProjectionLogHappeningMapArtifact({
    projectionLogEntry: validLogEntry(),
    sourcePath: "projection-events/events",
    emittedAt: "2026-05-15T13:05:00.000Z",
  });

  assertEdgeProjectionLogHappeningMapArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_PROJECTION_LOG_HAPPENING_MAP_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-projection-log-happening-map-emitted");
  assert.equal(artifact.validation.status, "edge-projection-log-entry-valid");
  assert.equal(artifact.validation.entryPreservedAsReference, true);
  assert.equal(artifact.validation.temporalRefPresent, true);
  assert.equal(artifact.source.sourceRepo, "mesh-ecology-edge");
  assert.equal(artifact.source.sourceSchema, "edge_projection_event_log_entry.v0");
  assert.equal(artifact.happeningRefs.length, 1);
  const ref = artifact.happeningRefs[0]!;
  assert.match(ref.happeningId, /^causal-edge-projection-log-happening:[a-f0-9]{16}$/);
  assert.equal(ref.happeningLabel, "edge-projection-event-log-entry");
  assert.equal(ref.sourceEntryRef, "projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa:0");
  assert.equal(ref.sourceProjectionEventRef, "projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa");
  assert.equal(ref.payloadHash, `sha256:${"a".repeat(64)}`);
  assert.equal(ref.temporalRef, "2026-05-15T13:00:01.000Z");
  assert.equal(ref.temporalRefSource, "log-entry");
  assert.equal(ref.causalRole, "edge-projection-log-entry-as-happening-reference");
  assert.equal(ref.acceptedAsCanonicalHistory, false);
  assert.equal(artifact.boundary.sourceCorestoreOpened, false);
  assert.equal(artifact.boundary.replaysProjectionLog, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.deepEqual(artifact.rejections, []);
});

test("Edge projection log mapping can preserve projection-event clock when log entry lacks one", () => {
  const entry = validLogEntry();
  delete entry.appendedAt;

  const artifact = buildEdgeProjectionLogHappeningMapArtifact({
    projectionLogEntry: entry,
    emittedAt: "2026-05-15T13:05:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-log-happening-map-emitted");
  assert.equal(artifact.validation.temporalRefPresent, true);
  assert.equal(artifact.happeningRefs[0]?.temporalRef, "2026-05-15T13:00:00.000Z");
  assert.equal(artifact.happeningRefs[0]?.temporalRefSource, "projection-event");
});

test("Edge projection log mapping marks missing clock refs as incomplete", () => {
  const entry = validLogEntry();
  delete entry.appendedAt;
  delete entry.projectionEvent.createdAt;

  const artifact = buildEdgeProjectionLogHappeningMapArtifact({
    projectionLogEntry: entry,
    emittedAt: "2026-05-15T13:05:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-log-entry-incomplete");
  assert.equal(artifact.validation.temporalRefPresent, false);
  assert.ok(artifact.rejections.includes("temporal-ref-missing"));
  assert.deepEqual(artifact.happeningRefs, []);
});

test("Edge projection log mapping blocks storage seam and authority overclaims", () => {
  const entry = validLogEntry();
  entry.logPosture.replicatedLocalLayerState = true;
  entry.logPosture.autobaseBackend = true;
  entry.logPosture.hyperbeeIndex = true;
  entry.logPosture.httpSeam = true;
  entry.logPosture.sshSeam = true;
  entry.logPosture.localStoreRootIsIntegrationSeam = true;
  entry.nonClaims.authorityGranted = true;

  const artifact = buildEdgeProjectionLogHappeningMapArtifact({
    projectionLogEntry: entry,
    emittedAt: "2026-05-15T13:05:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-log-guardrail-blocked");
  assert.ok(artifact.rejections.includes("storage-transport-or-store-seam-overclaim"));
  assert.ok(artifact.rejections.includes("authority-or-truth-claim"));
  assert.deepEqual(artifact.happeningRefs, []);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
});

test("Edge projection log mapping blocks namespace and transport scaffold drift", () => {
  const entry = validLogEntry();
  entry.namespaceParts = [
    "mesh-ecology",
    "local-layer",
    "projection-event",
    "v0",
    "producer-http://127.0.0.1:8787",
    "../projection-operator-situation-view",
  ];
  entry.transportRefs = ["ssh://edge-device", "http://127.0.0.1:8787"];

  const artifact = buildEdgeProjectionLogHappeningMapArtifact({
    projectionLogEntry: entry,
    emittedAt: "2026-05-15T13:05:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-log-guardrail-blocked");
  assert.ok(artifact.rejections.includes("namespace-prefix-mismatch"));
  assert.ok(artifact.rejections.includes("namespace-parts-unsafe"));
  assert.ok(artifact.rejections.includes("transport-ref-compatibility-scaffold"));
});

test("Edge projection log mapping blocks event ref mismatches and embedded payloads", () => {
  const entry = validLogEntry();
  entry.projectionEventId = "projection:mesh-ecology-edge:operator_situation_view:bbbbbbbbbbbbbbbb";
  entry.payloadHash = `sha256:${"c".repeat(64)}`;
  entry.projectionEvent.payloadEmbedded = true;

  const artifact = buildEdgeProjectionLogHappeningMapArtifact({
    projectionLogEntry: entry,
    emittedAt: "2026-05-15T13:05:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-log-guardrail-blocked");
  assert.ok(artifact.rejections.includes("event-id-ref-mismatch"));
  assert.ok(artifact.rejections.includes("payload-hash-ref-mismatch"));
  assert.ok(artifact.rejections.includes("event-payload-embedded"));
});

test("Edge projection log mapping treats malformed input as non-accepted evidence", () => {
  const artifact = buildEdgeProjectionLogHappeningMapArtifact({
    projectionLogEntry: null,
    emittedAt: "2026-05-15T13:05:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-log-entry-malformed");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.happeningRefs, []);
  assert.deepEqual(artifact.rejections, ["projection-log-entry-not-object"]);
});
