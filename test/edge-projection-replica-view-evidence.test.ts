import test from "node:test";
import assert from "node:assert/strict";

import {
  assertEdgeProjectionReplicaViewEvidenceArtifact,
  buildEdgeProjectionReplicaViewEvidenceArtifact,
} from "../src/adapters/edge-projection-replica-view-evidence.js";

const SOURCE_CORE_KEY = "a".repeat(64);

function validReplicaView(overrides: Record<string, unknown> = {}) {
  return {
    artifactKind: "edge_projection_event_log_replica_view",
    schemaVersion: "edge_projection_event_log_replica_view.v0",
    viewId: "projection-replica-view:aaaaaaaaaaaaaaaa",
    viewHash: `sha256:${"b".repeat(64)}`,
    viewState: "projection_event_log_replica_view_available",
    sourceCoreKey: SOURCE_CORE_KEY,
    namespaceParts: [
      "mesh-ecology",
      "local-layer",
      "projection-event",
      "v0",
      "producer-mesh-ecology-edge",
      "projection-operator-situation-view",
    ],
    entryCount: 1,
    latestEntryId: "projection-log-entry:operator-situation:0",
    projectionRecords: [
      {
        recordKind: "edge_projection_event_log_replica_view_record",
        sequence: 0,
        entryId: "projection-log-entry:operator-situation:0",
        projectionEventId: "projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa",
        projectionRef: "edge-operator-situation-view:status",
        payloadHash: `sha256:${"c".repeat(64)}`,
        sourceRefs: [
          "causal-edge-self-work-trace-evidence:self-work-trace-fixture",
          "testbed-edge-self-work-trace:self-work-trace-fixture",
        ],
        transportRefs: ["hyperdht-protomux-rpc-direct-peer"],
        branchRefs: ["causal-branch:operator-situation"],
        segmentRefs: ["causal-segment:operator-status"],
        happeningRefs: ["causal-happening:status-projected"],
        presentPointRef: "causal-present:operator-status",
        observerRef: "observer:edge-operator",
        wallClockDefinesCausalOrder: false,
      },
    ],
    viewPosture: {
      derivedFromReadOnlyReplica: true,
      replicatedProjectionViewCandidate: true,
      replicatedLocalLayerStateClaimed: false,
      sourceCoreKeyRequired: true,
      sourceLocalStoreRootUsedAsSeam: false,
      localPathSeam: false,
      httpSeam: false,
      sshSeam: false,
      writesSourceStore: false,
      writesReplicaStore: false,
      writesDurableLocalLayerState: false,
      productionLocalLayerState: false,
      autobaseBackend: false,
      hyperbeeIndex: false,
      wallClockDefinesCausalOrder: false,
      localCausalOrderSource: "replicated_single_writer_sequence_and_event_refs",
      collaborativeCausalOrderCandidate: "autobase_or_equivalent_linearization",
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      universalConsensusClaimed: false,
      meshSettlementClaimed: false,
      durableStateClaimed: false,
      replicatedStateClaimed: false,
      rendererOwnsAuthority: false,
    },
    ...overrides,
  };
}

test("valid Edge projection replica view imports as causal continuity evidence only", () => {
  const artifact = buildEdgeProjectionReplicaViewEvidenceArtifact({
    replicaView: validReplicaView(),
    emittedAt: "2026-05-16T12:30:00.000Z",
    sourcePath: "edge-projection-replica-view.json",
  });

  assertEdgeProjectionReplicaViewEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, "causal-edge-projection-replica-view-evidence");
  assert.equal(artifact.schema, "causal-substrate/edge-projection-replica-view-evidence/v1");
  assert.equal(artifact.reviewStatus, "edge-projection-replica-view-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-projection-replica-view-valid-evidence");
  assert.equal(artifact.source.sourceRepo, "mesh-ecology-edge");
  assert.equal(artifact.source.sourceArtifactKind, "edge_projection_event_log_replica_view");
  assert.equal(artifact.source.sourceSchema, "edge_projection_event_log_replica_view.v0");
  assert.equal(artifact.replicaViewRefs.sourceCoreKey, SOURCE_CORE_KEY);
  assert.deepEqual(artifact.replicaViewRefs.entryRefs, ["projection-log-entry:operator-situation:0"]);
  assert.deepEqual(artifact.replicaViewRefs.happeningRefs, ["causal-happening:status-projected"]);
  assert.equal(artifact.replicaViewPosture.derivedFromReadOnlyReplica, true);
  assert.equal(artifact.replicaViewPosture.replicatedProjectionViewCandidate, true);
  assert.equal(artifact.replicaViewPosture.writesReplicaStore, false);
  assert.equal(artifact.replicaViewPosture.productionLocalLayerState, false);
  assert.equal(artifact.continuityPosture.observerRelativeReplicaView, true);
  assert.equal(artifact.continuityPosture.readOnlyReplicaView, true);
  assert.equal(artifact.continuityPosture.acceptedAsCanonicalHistory, false);
  assert.equal(artifact.boundary.opensCorestore, false);
  assert.equal(artifact.boundary.replaysProjectionLog, false);
  assert.equal(artifact.boundary.claimsReplicatedState, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.ok(artifact.warnings.includes("projection-replica-view-preserved-as-continuity-evidence-only"));
});

test("projection replica view blocks state backend and authority overclaims", () => {
  const replicaView = validReplicaView({
    viewPosture: {
      ...(validReplicaView().viewPosture as Record<string, unknown>),
      writesReplicaStore: true,
      productionLocalLayerState: true,
      autobaseBackend: true,
    },
    nonClaims: {
      ...(validReplicaView().nonClaims as Record<string, unknown>),
      truthClaimed: true,
      replicatedStateClaimed: true,
    },
  });

  const artifact = buildEdgeProjectionReplicaViewEvidenceArtifact({
    replicaView,
    emittedAt: "2026-05-16T12:31:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-replica-view-guardrail-blocked");
  assert.equal(artifact.validation.unsafeClaimsBlocked, false);
  assert.ok(artifact.rejections.includes("read-only-replica-posture-missing-or-unsafe"));
  assert.ok(artifact.rejections.includes("truth-authority-state-or-backend-claim"));
});

test("projection replica view blocks HTTP SSH local path refs and wall-clock causal ordering", () => {
  const replicaView = validReplicaView({
    sourceCoreKey: "http://127.0.0.1:8787",
    projectionRecords: [
      {
        ...(validReplicaView().projectionRecords as Record<string, unknown>[])[0],
        sourceRefs: ["../projection.json"],
        transportRefs: ["ssh://device-a"],
        wallClockDefinesCausalOrder: true,
      },
    ],
  });

  const artifact = buildEdgeProjectionReplicaViewEvidenceArtifact({
    replicaView,
    emittedAt: "2026-05-16T12:32:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-replica-view-guardrail-blocked");
  assert.equal(artifact.validation.unsafeSeamRefsBlocked, false);
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.ok(artifact.rejections.includes("wall-clock-causal-order-overclaim"));
});

test("projection replica view reports missing causal and source refs as incomplete", () => {
  const replicaView = validReplicaView({
    projectionRecords: [
      {
        ...(validReplicaView().projectionRecords as Record<string, unknown>[])[0],
        sourceRefs: [],
        branchRefs: [],
        segmentRefs: [],
        happeningRefs: [],
      },
    ],
  });

  const artifact = buildEdgeProjectionReplicaViewEvidenceArtifact({
    replicaView,
    emittedAt: "2026-05-16T12:33:00.000Z",
    requiredSourceRefs: ["causal-edge-self-work-trace-evidence:self-work-trace-fixture"],
  });

  assert.equal(artifact.reviewStatus, "edge-projection-replica-view-incomplete-evidence");
  assert.ok(artifact.rejections.includes("source-refs-missing"));
  assert.ok(artifact.rejections.includes("causal-refs-missing"));
  assert.ok(artifact.rejections.includes("required-source-refs-missing"));
});

test("projection replica view treats malformed input as non-accepted evidence", () => {
  const artifact = buildEdgeProjectionReplicaViewEvidenceArtifact({
    replicaView: null,
    emittedAt: "2026-05-16T12:34:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-replica-view-malformed-evidence");
  assert.deepEqual(artifact.replicaViewRefs.entryRefs, []);
  assert.deepEqual(artifact.rejections, ["replica-view-not-object"]);
});
