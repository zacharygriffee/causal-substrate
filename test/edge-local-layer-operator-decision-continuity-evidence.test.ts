import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEdgeLocalLayerOperatorDecisionContinuityEvidenceArtifact,
} from "../src/index.js";

const EMITTED_AT = "2026-05-18T12:00:00.000Z";

function productionLaneResult(overrides: Record<string, unknown> = {}) {
  const semanticEvent = {
    artifactKind: "mesh_ecology_local_layer_continuity_event",
    schemaVersion: "mesh_ecology_local_layer_continuity_event.draft.v0",
    eventKind: "operator_recorded_local_layer_decision",
    decisionKind: "approve_repo_work_packet",
    operatorDecisionRef: "operator-decision:approve-repo-work-packet:production-pressure",
    operatorSeatRef: "operator-seat:edge-primary",
    targetRef: "edge-work-packet:production-pressure",
    affectedArtifactRefs: ["edge-work-packet:production-pressure"],
    sourceWorkPacketRef: "edge-work-packet:production-pressure",
    sourceReviewRefs: ["edge-review:operator-decision-pressure"],
    approvedScope: {
      scopeRef: "operator-decision-scope:approve-repo-work-packet",
      summary: "Approve the bounded repo work packet.",
    },
    forbiddenScope: {
      scopeRef: "operator-decision-forbidden-scope:no-root-adjacent-expansion",
      summary: "No writer admission, promotion, migration, schema promotion, or compatibility removal.",
    },
    decisionValue: "approved",
    decisionReasonDigest: "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    issuedAt: EMITTED_AT,
    provenanceRefs: [
      "operator-decision:approve-repo-work-packet:production-pressure",
      "operator-seat:edge-primary",
      "edge-work-packet:production-pressure",
      "edge-review:operator-decision-pressure",
      "operator-decision-scope:approve-repo-work-packet",
      "operator-decision-forbidden-scope:no-root-adjacent-expansion",
    ],
    readerVisibilityPosture: {
      defaultReadOnlyObserverVisibility: "filtered_decision_posture",
      fullDecisionReasonVisibleToReadOnlyObservers: false,
      fullDecisionReasonRequiresExplicitReaderPolicy: true,
      viewAccessIsAuthority: false,
      viewAccessIsApproval: false,
    },
    operatorDecisionPosture: {
      rootAdjacentDecisionKind: false,
      decisionIsExecution: false,
      decisionIsGlobalAuthority: false,
      decisionIsReadiness: false,
      decisionIsMaterialization: false,
      decisionIsWriterAdmission: false,
      decisionIsProductionPromotion: false,
      agentDraftIsOperatorApproval: false,
      edgeStatusIsApproval: false,
      causalReviewIsTruth: false,
      testbedReviewIsReadiness: false,
    },
    nonClaims: {
      truthClaimed: false,
      authorityGranted: false,
      globalAuthorityGranted: false,
      meshTruthClaimed: false,
      materializationClaimed: false,
      readinessClaimed: false,
      executionClaimed: false,
      writerAdmissionClaimed: false,
      productionPromotionClaimed: false,
      causalTruthClaimed: false,
      testbedReadinessClaimed: false,
      edgeStatusApprovalClaimed: false,
    },
  };
  const laneEntry = {
    artifactKind: "mesh_ecology_local_layer_lane_entry",
    schemaVersion: "mesh_ecology_local_layer_lane_entry.v0",
    entryId: "local-layer-continuity-lane-entry:operator-decision",
    entryHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    laneRef: "local-layer-continuity-lane:operator-owned-devices",
    namespaceRef: "local-layer/continuity",
    writerRef: "autobase-writer:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    writerAdmissionRef: "writer-admission:cccccccccccccccccccccccc",
    semanticEventKind: "mesh_ecology_local_layer_continuity_event",
    semanticEventSchema: "mesh_ecology_local_layer_continuity_event.draft.v0",
    semanticEventRef: "local-layer-continuity-event:operator-decision:dddddddddddddddddddddddd",
    semanticPayloadHash: "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    sourceRefs: [
      "local-layer-continuity-event:operator-decision:dddddddddddddddddddddddd",
      "operator-decision:approve-repo-work-packet:production-pressure",
      "operator-seat:edge-primary",
      "edge-work-packet:production-pressure",
      "edge-review:operator-decision-pressure",
      "operator-decision-scope:approve-repo-work-packet",
      "operator-decision-forbidden-scope:no-root-adjacent-expansion",
      "writer-admission:cccccccccccccccccccccccc",
      "membrane-crossing:operator_local_layer_decision:production-pressure",
    ],
    semanticEvent,
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
      authorityGranted: false,
      meshTruthClaimed: false,
      causalTruthClaimed: false,
      testbedReadinessClaimed: false,
    },
  };

  const result = {
    artifactKind: "edge_local_layer_production_continuity_lane_result",
    schemaVersion: "edge_local_layer_production_continuity_lane_result.v0",
    resultRef: "edge-local-layer-production-continuity-lane:operator-decision",
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
      acceptedOperatorDecisionCount: 1,
      acceptedDecisionKinds: ["approve_repo_work_packet"],
      acceptedEvents: [{
        entryRef: laneEntry.entryId,
        writerRef: laneEntry.writerRef,
        eventKind: "operator_recorded_local_layer_decision",
        decisionKind: "approve_repo_work_packet",
        operatorDecisionRef: semanticEvent.operatorDecisionRef,
        readerVisibility: {
          defaultReadOnlyObserverVisibility: "filtered_decision_posture",
          fullDecisionReasonVisible: false,
          explicitReaderPolicyRequiredForFullReason: true,
          viewAccessIsAuthority: false,
        },
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
      observationRef: "edge-local-layer-production-reader-observation:operator-decision",
      observerPath: "read-only-observer-view-replica-proof",
      realReplicaProof: true,
      readerRef: "local-layer-reader:operator-laptop",
      readerDeviceRef: "edge-device:operator-laptop",
      observedAcceptedEventRefs: [laneEntry.entryId],
      readOnlyObserverCanReadAllowedView: true,
      observerAppendBlocked: true,
      readOnlyObserverCannotWriteAcceptedContinuity: true,
      replicaVisibilityIsContinuity: false,
      viewOutputIsSourceContinuity: false,
      authorityGranted: false,
      transportPosture: {
        transportKind: "corestore-protocol-stream",
        readOnlyReplica: true,
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
      rendererAuthorityClaimed: false,
    },
  };

  return {
    ...result,
    ...overrides,
  };
}

test("valid operator decision continuity input emits causal review evidence", () => {
  const evidence = buildEdgeLocalLayerOperatorDecisionContinuityEvidenceArtifact({
    productionLaneResult: productionLaneResult(),
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.artifactKind, "causal-edge-local-layer-operator-decision-continuity-evidence");
  assert.equal(evidence.schema, "causal-substrate/edge-local-layer-operator-decision-continuity-evidence/v1");
  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-decision-continuity-evidence-emitted");
  assert.equal(evidence.validation.status, "edge-local-layer-operator-decision-continuity-valid-evidence");
  assert.equal(evidence.laneEntry.semanticEventEventKind, "operator_recorded_local_layer_decision");
  assert.equal(evidence.operatorDecision.decisionKind, "approve_repo_work_packet");
  assert.equal(evidence.operatorDecision.fullDecisionReasonVisibleToReadOnlyObservers, false);
  assert.equal(evidence.acceptedEventsView.filteredReaderVisibility, true);
  assert.equal(evidence.causalInterpretation.operatorDecisionIsTruth, false);
  assert.equal(evidence.causalInterpretation.operatorDecisionIsExecution, false);
  assert.equal(evidence.boundary.writesContinuityRecords, false);
});

test("operator decision continuity evidence fails closed on deferred root-adjacent decision kinds", () => {
  const base = productionLaneResult();
  const laneEntry = base.laneEntry as Record<string, unknown>;
  const semanticEvent = laneEntry.semanticEvent as Record<string, unknown>;
  const evidence = buildEdgeLocalLayerOperatorDecisionContinuityEvidenceArtifact({
    productionLaneResult: {
      ...base,
      laneEntry: {
        ...laneEntry,
        semanticEvent: {
          ...semanticEvent,
          decisionKind: "approve_writer_admission",
          operatorDecisionPosture: {
            ...(semanticEvent.operatorDecisionPosture as Record<string, unknown>),
            decisionIsWriterAdmission: true,
          },
        },
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-decision-continuity-guardrail-blocked");
  assert.equal(evidence.rejections.includes("operator-decision-missing-or-unsafe"), true);
  assert.equal(evidence.rejections.includes("operator-decision-authority-truth-or-execution-overclaim"), true);
});

test("operator decision continuity evidence blocks full reason visibility to read-only observers", () => {
  const base = productionLaneResult();
  const laneEntry = base.laneEntry as Record<string, unknown>;
  const semanticEvent = laneEntry.semanticEvent as Record<string, unknown>;
  const evidence = buildEdgeLocalLayerOperatorDecisionContinuityEvidenceArtifact({
    productionLaneResult: {
      ...base,
      laneEntry: {
        ...laneEntry,
        semanticEvent: {
          ...semanticEvent,
          readerVisibilityPosture: {
            ...(semanticEvent.readerVisibilityPosture as Record<string, unknown>),
            fullDecisionReasonVisibleToReadOnlyObservers: true,
          },
        },
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-decision-continuity-guardrail-blocked");
  assert.equal(evidence.rejections.includes("operator-decision-missing-or-unsafe"), true);
  assert.equal(evidence.rejections.includes("operator-decision-authority-truth-or-execution-overclaim"), true);
});

test("operator decision continuity evidence blocks status approval and causal truth overclaims", () => {
  const base = productionLaneResult();
  const laneEntry = base.laneEntry as Record<string, unknown>;
  const semanticEvent = laneEntry.semanticEvent as Record<string, unknown>;
  const evidence = buildEdgeLocalLayerOperatorDecisionContinuityEvidenceArtifact({
    productionLaneResult: {
      ...base,
      laneEntry: {
        ...laneEntry,
        semanticEvent: {
          ...semanticEvent,
          operatorDecisionPosture: {
            ...(semanticEvent.operatorDecisionPosture as Record<string, unknown>),
            edgeStatusIsApproval: true,
            causalReviewIsTruth: true,
          },
        },
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-decision-continuity-guardrail-blocked");
  assert.equal(evidence.rejections.includes("operator-decision-authority-truth-or-execution-overclaim"), true);
});

test("operator decision continuity evidence blocks local path or HTTP seams", () => {
  const base = productionLaneResult();
  const laneEntry = base.laneEntry as Record<string, unknown>;
  const evidence = buildEdgeLocalLayerOperatorDecisionContinuityEvidenceArtifact({
    productionLaneResult: {
      ...base,
      laneEntry: {
        ...laneEntry,
        sourceRefs: [
          ...(laneEntry.sourceRefs as string[]),
          "http://127.0.0.1:8787/status",
        ],
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-decision-continuity-guardrail-blocked");
  assert.equal(evidence.rejections.includes("unsafe-ref"), true);
});

test("operator decision continuity evidence rejects missing operator seat and scopes", () => {
  const base = productionLaneResult();
  const laneEntry = base.laneEntry as Record<string, unknown>;
  const semanticEvent = laneEntry.semanticEvent as Record<string, unknown>;
  const evidence = buildEdgeLocalLayerOperatorDecisionContinuityEvidenceArtifact({
    productionLaneResult: {
      ...base,
      laneEntry: {
        ...laneEntry,
        semanticEvent: {
          ...semanticEvent,
          operatorSeatRef: null,
          approvedScope: null,
        },
      },
    },
    emittedAt: EMITTED_AT,
  });

  assert.equal(evidence.reviewStatus, "edge-local-layer-operator-decision-continuity-guardrail-blocked");
  assert.equal(evidence.rejections.includes("operator-decision-missing-or-unsafe"), true);
});
