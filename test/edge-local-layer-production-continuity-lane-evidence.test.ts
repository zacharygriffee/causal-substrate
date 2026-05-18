import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeLocalLayerProductionContinuityLaneEvidenceArtifact,
} from "../src/index.js";

const EMITTED_AT = "2026-05-18T12:00:00.000Z";

function productionLaneResult(overrides: Record<string, unknown> = {}) {
  const laneEntry = {
    artifactKind: "mesh_ecology_local_layer_lane_entry",
    schemaVersion: "mesh_ecology_local_layer_lane_entry.v0",
    entryId: "local-layer-continuity-lane-entry:aaaaaaaaaaaaaaaaaaaaaaaa",
    entryHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    laneRef: "local-layer-continuity-lane:operator-owned-devices",
    namespaceRef: "local-layer/continuity",
    writerRef: "autobase-writer:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    writerAdmissionRef: "writer-admission:cccccccccccccccccccccccc",
    semanticEventKind: "mesh_ecology_local_layer_continuity_event",
    semanticEventSchema: "mesh_ecology_local_layer_continuity_event.draft.v0",
    semanticEventRef: "local-layer-continuity-event:repo-work-packet:dddddddddddddddddddddddd",
    semanticPayloadHash: "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    sourceRefs: [
      "local-layer-continuity-event:repo-work-packet:dddddddddddddddddddddddd",
      "edge-operation:event:eeeeeeeeeeeeeeeeeeeeeeee",
      "edge-operation:ffffffffffffffffffffffff",
      "origin:operator-seat:edge-primary",
      "source:edge-self-work-review:production-continuity-lane",
      "membrane-crossing:repo-work-packet-continuity:edge-self-work",
      "writer-admission:cccccccccccccccccccccccc",
      "operator-approval:minimal-production-local-layer-lane-implementation-v0:2026-05-18",
      "edge-self-work-review:production-continuity-lane",
    ],
    parentEventRefs: ["continuity:previous-approved-work-packet"],
    semanticEvent: {
      artifactKind: "mesh_ecology_local_layer_continuity_event",
      schemaVersion: "mesh_ecology_local_layer_continuity_event.draft.v0",
      eventKind: "repo_work_packet_continuity_event",
    },
    entryPosture: {
      productionLaneEntry: true,
      storageEnvelope: true,
      semanticContinuityUnit: false,
      preservesSemanticContinuityEvent: true,
      acceptedContinuityInputBeforeApply: false,
      edgeStateMigration: false,
      appendSuccessIsAcceptance: false,
      linearizationIsTruth: false,
      replicaVisibilityIsContinuity: false,
      viewOutputIsSourceContinuity: false,
      localPathIsCanonicalSeam: false,
      httpOrSshIsCanonicalSeam: false,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      globalAuthorityGranted: false,
      meshTruthClaimed: false,
      platformAuthorityClaimed: false,
      causalTruthClaimed: false,
      testbedReadinessClaimed: false,
      edgeStatusApprovalClaimed: false,
    },
  };

  const result = {
    artifactKind: "edge_local_layer_production_continuity_lane_result",
    schemaVersion: "edge_local_layer_production_continuity_lane_result.v0",
    resultRef: "edge-local-layer-production-continuity-lane:eeeeeeeeeeeeeeeeeeeeeeee",
    resultHash: "sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    createdAt: EMITTED_AT,
    laneRef: "local-layer-continuity-lane:operator-owned-devices",
    namespaceRef: "local-layer/continuity",
    backend: {
      backendKind: "autobase",
      corestoreOpened: true,
      autobaseOpened: true,
      productionBackendStarted: true,
      storageRootIsCanonicalSeam: false,
      edgeStateMigration: false,
    },
    laneEntry,
    acceptedEventsView: {
      artifactKind: "edge_local_layer_production_accepted_events_view",
      schemaVersion: "edge_local_layer_production_accepted_events_view.v0",
      viewRef: "local-layer-continuity-accepted-events-view",
      acceptedEventCount: 1,
      acceptedEvents: [{
        entryRef: laneEntry.entryId,
        writerRef: laneEntry.writerRef,
        eventKind: "repo_work_packet_continuity_event",
      }],
      viewPosture: {
        derivedOnly: true,
        reconstructableFromSourceLane: true,
        viewIsSourceContinuity: false,
        viewDeletionLosesSourceContinuity: false,
        rejectedEntriesAreAcceptedContinuity: false,
      },
      nonClaims: {
        truthClaimed: false,
        authorityGranted: false,
        sourceContinuityClaimed: false,
      },
    },
    readerObservation: {
      artifactKind: "edge_local_layer_production_reader_observation",
      schemaVersion: "edge_local_layer_production_reader_observation.v0",
      observationRef: "edge-local-layer-production-reader-observation:9999999999999999",
      observerPath: "read-only-observer-view-replica-proof",
      realReplicaProof: true,
      readerRef: "local-layer-reader:operator-laptop",
      readerDeviceRef: "edge-device:operator-laptop",
      sourceViewKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      observerViewKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      observedResultCount: 1,
      observedAcceptedEventCount: 1,
      observedAcceptedEventRefs: [laneEntry.entryId],
      observedRejectedDiagnosticCount: 0,
      readOnlyObserverCanReadAllowedView: true,
      observerAppendBlocked: true,
      readOnlyObserverCannotWriteAcceptedContinuity: true,
      replicaVisibilityIsContinuity: false,
      viewOutputIsSourceContinuity: false,
      authorityGranted: false,
      transportPosture: {
        transportKind: "corestore-protocol-stream",
        proofScope: "in_process_second_device_shape",
        readOnlyReplica: true,
        liveDiscoveryRequired: false,
        hyperswarmRequired: false,
        httpSeam: false,
        sshSeam: false,
        localPathIsCanonicalSeam: false,
      },
      nonClaims: {
        truthClaimed: false,
        authorityGranted: false,
        writerGranted: false,
        continuityAcceptanceClaimed: false,
        sourceContinuityClaimed: false,
        readinessClaimed: false,
      },
    },
    writerRefs: [laneEntry.writerRef],
    headRefs: ["autobase-head:ffffffffffffffffffffffff"],
    linearizedEntryRefs: ["autobase-linearized-entry:local-layer-continuity-lane:0:111111111111111111111111"],
    productionPosture: {
      productionLanePromoted: true,
      productionLocalLayerContinuity: true,
      acceptedContinuityInputs: 1,
      edgeStateMigration: false,
      defaultBackendSwitch: false,
      jsonCompatibilityRemoved: false,
      httpOrSshCanonicalSeam: false,
      causalSubstrateBackendOwner: false,
      testbedReadinessClaimed: false,
      edgeStatusIsPromotionApproval: false,
    },
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      meshTruthClaimed: false,
      causalTruthClaimed: false,
      testbedReadinessClaimed: false,
      rendererAuthorityClaimed: false,
    },
  };

  return {
    ...result,
    ...overrides,
  };
}

test("valid Edge production continuity lane result emits causal review evidence", () => {
  const evidence = buildEdgeLocalLayerProductionContinuityLaneEvidenceArtifact({
    productionLaneResult: productionLaneResult(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, "causal-edge-local-layer-production-continuity-lane-evidence");
  assert.equal(evidence.schema, "causal-substrate/edge-local-layer-production-continuity-lane-evidence/v1");
  assert.equal(evidence.reviewStatus, "edge-local-layer-production-continuity-lane-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-local-layer-production-continuity-lane-valid-evidence");
  assert.equal(evidence.refs.sourceResultRef, "edge-local-layer-production-continuity-lane:eeeeeeeeeeeeeeeeeeeeeeee");
  assert.equal(evidence.refs.laneEntryRef, "local-layer-continuity-lane-entry:aaaaaaaaaaaaaaaaaaaaaaaa");
  assert.equal(evidence.laneEntry.semanticEventEventKind, "repo_work_packet_continuity_event");
  assert.equal(evidence.readerObservation.realReplicaProof, true);
  assert.equal(evidence.readerObservation.readOnlyObserverCannotWriteAcceptedContinuity, true);
  assert.equal(evidence.validation.readerObservationSafe, true);
  assert.equal(evidence.causalInterpretation.observerRelativeContinuity, true);
  assert.equal(evidence.causalInterpretation.causalTruthClaimed, false);
  assert.equal(evidence.boundary.evidenceOnly, true);
  assert.equal(evidence.boundary.writesContinuityRecords, false);
});

test("production continuity lane evidence fails closed on unapproved event kind", () => {
  const base = productionLaneResult();
  const evidence = buildEdgeLocalLayerProductionContinuityLaneEvidenceArtifact({
    productionLaneResult: {
      ...base,
      laneEntry: {
        ...(base.laneEntry as Record<string, unknown>),
        semanticEvent: {
          artifactKind: "mesh_ecology_local_layer_continuity_event",
          schemaVersion: "mesh_ecology_local_layer_continuity_event.draft.v0",
          eventKind: "repo_work_packet_proposed",
        },
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-production-continuity-lane-guardrail-blocked");
  assert.equal(evidence.rejections.includes("lane-entry-missing-or-unsafe"), true);
});

test("production continuity lane evidence blocks truth, path, and migration overclaims", () => {
  const base = productionLaneResult();
  const evidence = buildEdgeLocalLayerProductionContinuityLaneEvidenceArtifact({
    productionLaneResult: {
      ...base,
      laneEntry: {
        ...(base.laneEntry as Record<string, unknown>),
        sourceRefs: [
          ...((base.laneEntry as Record<string, unknown>).sourceRefs as string[]),
          "http://127.0.0.1:8787/status",
        ],
      },
      productionPosture: {
        ...(base.productionPosture as Record<string, unknown>),
        edgeStateMigration: true,
      },
      nonClaims: {
        ...(base.nonClaims as Record<string, unknown>),
        truthClaimed: true,
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-production-continuity-lane-guardrail-blocked");
  assert.equal(evidence.rejections.includes("unsafe-ref"), true);
  assert.equal(evidence.rejections.includes("production-posture-missing-or-unsafe"), true);
  assert.equal(evidence.rejections.includes("production-continuity-authority-or-truth-overclaim"), true);
});

test("production continuity lane evidence blocks view-as-source continuity", () => {
  const base = productionLaneResult();
  const view = base.acceptedEventsView as Record<string, unknown>;
  const evidence = buildEdgeLocalLayerProductionContinuityLaneEvidenceArtifact({
    productionLaneResult: {
      ...base,
      acceptedEventsView: {
        ...view,
        viewPosture: {
          ...(view.viewPosture as Record<string, unknown>),
          viewIsSourceContinuity: true,
        },
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-production-continuity-lane-guardrail-blocked");
  assert.equal(evidence.rejections.includes("accepted-events-view-missing-or-unsafe"), true);
  assert.equal(evidence.rejections.includes("production-continuity-authority-or-truth-overclaim"), true);
});

test("production continuity lane evidence requires safe read-only observer replica proof", () => {
  const base = productionLaneResult();
  const evidence = buildEdgeLocalLayerProductionContinuityLaneEvidenceArtifact({
    productionLaneResult: {
      ...base,
      readerObservation: {
        ...(base.readerObservation as Record<string, unknown>),
        observerAppendBlocked: false,
        readOnlyObserverCannotWriteAcceptedContinuity: false,
        authorityGranted: true,
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-production-continuity-lane-guardrail-blocked");
  assert.equal(evidence.rejections.includes("reader-observation-missing-or-unsafe"), true);
  assert.equal(evidence.rejections.includes("production-continuity-authority-or-truth-overclaim"), true);
});
