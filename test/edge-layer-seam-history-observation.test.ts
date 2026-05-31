import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryObservationContractSnapshot,
  assertEdgeLayerSeamHistoryObservationResult,
  assertEdgeLayerSeamHistoryEdgeProjectionConsumerFixture,
  assertEdgeLayerSeamHistoryEdgeProjectionFixture,
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffReadback,
  assertEdgeLayerSeamHistoryObservationReadbackContract,
  buildEdgeLayerSeamHistoryObservationContractSnapshot,
  buildEdgeLayerSeamHistoryObservationResult,
  buildEdgeLayerSeamHistoryEdgeProjectionConsumerFixture,
  buildEdgeLayerSeamHistoryEdgeProjectionFixture,
  buildEdgeLayerSeamHistoryEdgeProjectionHandoffReadback,
  buildEdgeLayerSeamHistoryObservationReadbackContract,
  buildEdgeLayerSeamHistoryObservationResultFromJson,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_ARTIFACT_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA_VERSION,
  EDGE_LAYER_SEAM_HISTORY_DEFERRED_ATTACHMENT_KEYS,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

function operationShapedSeamHistory(): any {
  return {
    artifactKind: "edge_layer_seam_history_material",
    schemaVersion: "edge-layer-seam-history-material.v0",
    historyId: "layer-owned-edge-seam-status:causal-observation-test",
    historyHash: `sha256:${"9".repeat(64)}`,
    sourceRepos: ["mesh-ecology-edge", "mesh-ecology-layer"],
    pairs: [
      {
        request: {
          sourceRepo: "mesh-ecology-edge",
          requestId: "edge-layer-report-only-seam-request:causal-observation:linked",
          requestHash: `sha256:${"a".repeat(64)}`,
          durableRef: "autobase-view-record:edge-layer-report-only-seam-view:0",
          writerRef: "autobase-writer:edge",
        },
        receipt: {
          sourceRepo: "mesh-ecology-layer",
          receiptId: "layer-report-only-edge-seam-receipt:causal-observation:linked",
          receiptHash: `sha256:${"b".repeat(64)}`,
          sourceRequestId: "edge-layer-report-only-seam-request:causal-observation:linked",
          sourceRequestHash: `sha256:${"a".repeat(64)}`,
          durableRef: "autobase-view-record:edge-layer-report-only-seam-view:1",
          writerRef: "autobase-writer:layer",
        },
        linkage: {
          linked: true,
          source: "receipt_source_request_refs",
        },
      },
      {
        request: {
          sourceRepo: "mesh-ecology-edge",
          requestId: "edge-layer-report-only-seam-request:causal-observation:damaged",
          requestHash: `sha256:${"c".repeat(64)}`,
          durableRef: "autobase-view-record:edge-layer-report-only-seam-view:2",
          writerRef: "autobase-writer:edge",
        },
        receipt: {
          sourceRepo: "mesh-ecology-layer",
          receiptId: "layer-report-only-edge-seam-receipt:causal-observation:damaged",
          receiptHash: `sha256:${"d".repeat(64)}`,
          sourceRequestId: "edge-layer-report-only-seam-request:causal-observation:damaged",
          sourceRequestHash: `sha256:${"e".repeat(64)}`,
          durableRef: "autobase-view-record:edge-layer-report-only-seam-view:3",
          writerRef: "autobase-writer:layer",
        },
        linkage: {
          linked: true,
          source: "receipt_source_request_refs",
        },
      },
    ],
    operationProof: {
      seamFeedBackedRequestObserved: true,
      layerOwnedReceiptEmitted: true,
      receiptCausallyReferencesRequest: false,
      evidenceAdmissionOccurred: false,
      authorityGrantOccurred: false,
      rbcEnforced: false,
    },
  };
}

test("Edge Layer seam-history observation classifies linked and damaged request receipt material", () => {
  const result = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:00:00.000Z",
    sourcePath: "layer-owned-edge-seam-status:causal-observation-test",
  });

  assertEdgeLayerSeamHistoryObservationResult(result);
  assert.equal(result.artifactKind, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_ARTIFACT_KIND);
  assert.equal(result.schema, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA);
  assert.equal(result.schemaVersion, CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA_VERSION);
  assert.equal(result.reviewStatus, "edge-layer-seam-history-observation-emitted");
  assert.equal(result.validation.seamHistoryInputConsumed, true);
  assert.equal(result.validation.linkedPairDetected, true);
  assert.equal(result.validation.damagedOrUnlinkedPairDetected, true);
  assert.equal(result.validation.compatiblePairCount, 1);
  assert.equal(result.validation.unresolvedOrDamagedPairCount, 1);
  assert.equal(result.validation.damagedPairCount, 1);
  assert.equal(result.validation.unresolvedPairCount, 0);
  assert.equal(result.validation.damagedPairDetected, true);
  assert.equal(result.validation.unresolvedPairDetected, false);
  assert.equal(result.validation.sourceIdsAndHashesPreserved, true);
  assert.deepEqual(result.source.sourceRepos, ["mesh-ecology-edge", "mesh-ecology-layer"]);

  const linked = result.observations[0]!;
  assert.equal(linked.classification, "compatible_seam_happening");
  assert.equal(linked.linkageStatus, "linked");
  assert.equal(linked.damageOrUnresolvedDetail, "none_compatible_linked_request_receipt");
  assert.equal(linked.request.id, "edge-layer-report-only-seam-request:causal-observation:linked");
  assert.equal(linked.request.hash, `sha256:${"a".repeat(64)}`);
  assert.equal(linked.receipt.id, "layer-report-only-edge-seam-receipt:causal-observation:linked");
  assert.equal(linked.receipt.hash, `sha256:${"b".repeat(64)}`);
  assert.equal(linked.receiptSourceRequestId, linked.request.id);
  assert.equal(linked.receiptSourceRequestHash, linked.request.hash);
  assert.equal(linked.interpretedFields.receiptReferencesRequestId, true);
  assert.equal(linked.interpretedFields.receiptReferencesRequestHash, true);
  assert.ok(linked.sourceRefs.includes(linked.request.id));
  assert.ok(linked.sourceRefs.includes(linked.request.hash));
  assert.ok(linked.sourceRefs.includes(linked.request.durableRef!));
  assert.ok(linked.sourceRefs.includes(linked.request.writerRef!));
  assert.ok(linked.sourceRefs.includes(linked.receipt.id));
  assert.ok(linked.sourceRefs.includes(linked.receipt.hash));
  assert.ok(linked.sourceRefs.includes(linked.receipt.durableRef!));
  assert.ok(linked.sourceRefs.includes(linked.receipt.writerRef!));

  const damaged = result.observations[1]!;
  assert.equal(damaged.classification, "unresolved_or_damaged_seam_happening");
  assert.equal(damaged.linkageStatus, "damaged");
  assert.equal(damaged.damageOrUnresolvedDetail, "damaged_partial_or_mismatched_request_receipt_refs");
  assert.equal(damaged.request.id, "edge-layer-report-only-seam-request:causal-observation:damaged");
  assert.equal(damaged.request.hash, `sha256:${"c".repeat(64)}`);
  assert.equal(damaged.receipt.id, "layer-report-only-edge-seam-receipt:causal-observation:damaged");
  assert.equal(damaged.receipt.hash, `sha256:${"d".repeat(64)}`);
  assert.equal(damaged.receiptSourceRequestHash, `sha256:${"e".repeat(64)}`);
  assert.equal(damaged.interpretedFields.receiptReferencesRequestId, true);
  assert.equal(damaged.interpretedFields.receiptReferencesRequestHash, false);
  assert.ok(damaged.sourceRefs.includes(damaged.request.id));
  assert.ok(damaged.sourceRefs.includes(damaged.request.hash));
  assert.ok(damaged.sourceRefs.includes(damaged.request.durableRef!));
  assert.ok(damaged.sourceRefs.includes(damaged.request.writerRef!));
  assert.ok(damaged.sourceRefs.includes(damaged.receipt.id));
  assert.ok(damaged.sourceRefs.includes(damaged.receipt.hash));
  assert.ok(damaged.sourceRefs.includes(damaged.receipt.durableRef!));
  assert.ok(damaged.sourceRefs.includes(damaged.receipt.writerRef!));

  assert.equal(result.boundary.acceptsCanonicalHistory, false);
  assert.equal(result.boundary.admitsLayerEvidence, false);
  assert.equal(result.boundary.layerReceiptRefsAsCausalInputOnly, true);
  assert.equal(result.boundary.interpretsRbc, false);
  assert.equal(result.boundary.claimsQuorumSatisfaction, false);
  assert.equal(result.boundary.grantsAuthority, false);
  assert.equal(result.boundary.publishesToMesh, false);
  assert.equal(result.boundary.writesContinuityRecords, false);
  assert.equal(result.boundary.writesProductionContinuity, false);
  assert.deepEqual(result.nonClaims, {
    canonicalHistoryClaimed: false,
    layerEvidenceAdmitted: false,
    layerAdmissionDecided: false,
    rbcInterpreted: false,
    quorumSatisfied: false,
    authorityGranted: false,
    meshPublished: false,
    productionContinuityWritten: false,
  });
  assert.deepEqual(result.layerReceiptFit, {
    receiptRefsAcceptedAsCausalInputRefsOnly: true,
    receiptIdsAndHashesPreserved: true,
    receiptDurableRefsPreserved: true,
    receiptWriterRefsPreserved: true,
    receiptSourceRequestRefsObserved: true,
    receiptSourceRequestRefsInterpretedAsLinkageOnly: true,
    layerRuntimeOpened: false,
    layerEvidenceAdmitted: false,
    layerPolicyInterpreted: false,
    rbcEnforced: false,
    admissionDecided: false,
    receiptDoesNotPromoteReferents: true,
    receiptDoesNotGrantAuthority: true,
  });
  assert.deepEqual(result.layerReceiptIncompleteCaseMatrix, {
    matrixKind: "edge_layer_seam_history_layer_receipt_incomplete_case_matrix",
    complete: true,
    incompleteCaseCount: 0,
    cases: [],
    boundary: {
      matrixOnly: true,
      receiptRefsAreCausalInputOnly: true,
      doesNotAdmitLayerEvidence: true,
      doesNotDecideLayerAdmission: true,
      doesNotInterpretRbc: true,
      doesNotGrantAuthority: true,
    },
  });
  assert.deepEqual(result.sourceReferenceCompletenessReport, {
    reportKind: "edge_layer_seam_history_source_reference_completeness_failure_report",
    complete: true,
    failureCount: 0,
    missingFieldNames: [],
    failures: [],
    boundary: {
      reportOnly: true,
      rejectsPromotionWhenIncomplete: true,
      acceptsCanonicalHistory: false,
      admitsLayerEvidence: false,
      interpretsRbc: false,
      grantsAuthority: false,
    },
  });
  assert.deepEqual(result.deferredAttachmentPoints, {
    referentPromotion: { status: "deferred", active: false, interpreted: false, writes: false },
    branchCompatibilityGraph: { status: "deferred", active: false, interpreted: false, writes: false },
    canonicalContinuityState: { status: "deferred", active: false, interpreted: false, writes: false },
    rbcInterpretation: { status: "deferred", active: false, interpreted: false, writes: false },
    layerAdmission: { status: "deferred", active: false, interpreted: false, writes: false },
    meshPublication: { status: "deferred", active: false, interpreted: false, writes: false },
    authorityDecisions: { status: "deferred", active: false, interpreted: false, writes: false },
    productionCausalHistory: { status: "deferred", active: false, interpreted: false, writes: false },
  });
  assert.equal(result.validation.noCanonicalHistoryClaim, true);
  assert.equal(result.validation.noLayerAdmissionClaim, true);
  assert.equal(result.validation.noRbcInterpretationClaim, true);
  assert.equal(result.validation.noQuorumSatisfactionClaim, true);
  assert.equal(result.validation.noAuthorityClaim, true);
  assert.equal(result.validation.noMeshPublicationClaim, true);
  assert.equal(result.validation.noProductionContinuityWriteClaim, true);
  assert.equal(result.validation.sourceReposPreserved, true);
  assert.equal(result.validation.durableRefsPreserved, true);
  assert.equal(result.validation.writerRefsPreserved, true);
  assert.equal(result.validation.linkageStatusPreserved, true);
  assert.equal(result.validation.decentralizedSeamProofClaimed, false);
  assert.equal(result.validation.normalizedProofLabel, "local_supplied_material");
  assert.equal(result.proof.normalizedProofLabel, "local_supplied_material");
  assert.equal(result.proof.inputMaterialKind, "supplied_seam_history_material");
  assert.equal(result.proof.inputReadByCausalSubstrate, false);
  assert.equal(result.proof.durableCorestoreHistoryRead, false);
  assert.equal(result.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
  assert.equal(result.proof.replicatedViaHyperswarmTransport, false);
  assert.equal(result.proof.decentralizedSeamProofClaimed, false);
  assert.equal(result.proof.localSuppliedMaterialOnly, true);
  assert.equal(result.proof.proofLabelHonest, true);
  assert.deepEqual(result.suppliedMaterialGuardrailMatrix, {
    guardrailKind: "supplied_seam_history_material_guardrail_matrix",
    proofLabel: "local_supplied_material",
    inputMaterialKind: "supplied_seam_history_material",
    localSuppliedMaterialGuardrailActive: true,
    localSuppliedMaterialIsLowerProofRung: true,
    dhtHyperswarmProofClaimBlockedForSuppliedMaterial: true,
    dhtHyperswarmProofRequiresDurableTransport: true,
    canonicalHistoryBlocked: true,
    layerAdmissionBlocked: true,
    layerEvidenceAdmissionBlocked: true,
    rbcInterpretationBlocked: true,
    quorumSatisfactionBlocked: true,
    authorityGrantBlocked: true,
    meshPublicationBlocked: true,
    productionContinuityWriteBlocked: true,
    sourceReferencePreservationRequired: true,
    edgeProjectionOnlyAfterObservation: true,
  });
  assert.deepEqual(result.outwardLaneTriggerNote, {
    noteKind: "edge_layer_seam_history_outward_lane_trigger",
    currentProofLabel: "local_supplied_material",
    shouldLookOutwardForDurableSeamHistory: true,
    triggerReasons: [
      "local-supplied-material-is-lower-proof-rung",
      "dht-hyperswarm-proof-requires-durable-edge-layer-seam-history",
    ],
    suggestedNextInputs: ["edge_durable_request_history", "layer_durable_receipt_history"],
    boundary: {
      noteOnly: true,
      doesNotOpenEdgeRuntime: true,
      doesNotOpenLayerRuntime: true,
      doesNotClaimSwarmProof: true,
      doesNotAdmitLayerEvidence: true,
      doesNotInterpretRbc: true,
      doesNotGrantAuthority: true,
      doesNotPublishToMesh: true,
    },
  });
  assert.equal(
    result.validation.strongestProofRung,
    "local_causal_observation_over_supplied_seam_history_material",
  );
  assert.equal(
    result.compatibilityEnvelope.envelopeKind,
    "causal-edge-layer-seam-history-compatibility-envelope",
  );
  assert.equal(result.compatibilityEnvelope.envelopeVersion, 1);
  assert.equal(result.compatibilityEnvelope.projectionSuitability, "edge_projection_candidate");
  assert.equal(result.compatibilityEnvelope.compatibilityBasis, "request_receipt_linkage_only");
  assert.deepEqual(result.compatibilityEnvelope.classificationSummary, {
    compatibleObservationIds: [linked.observationId],
    unresolvedOrDamagedObservationIds: [damaged.observationId],
    damagedObservationIds: [damaged.observationId],
    unresolvedObservationIds: [],
    linkedPairDetected: true,
    damagedOrUnlinkedPairDetected: true,
    damagedPairDetected: true,
    unresolvedPairDetected: false,
  });
  assert.deepEqual(result.compatibilityEnvelope.sourceReferenceContract, {
    requestIdsPreserved: true,
    requestHashesPreserved: true,
    receiptIdsPreserved: true,
    receiptHashesPreserved: true,
    sourceRefsPreserved: true,
    sourceReposPreserved: true,
    durableRefsPreserved: true,
    writerRefsPreserved: true,
    linkageStatusPreserved: true,
  });
  assert.deepEqual(result.compatibilityEnvelope.consumerBoundary, {
    edgeMayProjectLater: true,
    consumeAsObservationOnly: true,
    compatibleDoesNotMeanCanonical: true,
    compatibleDoesNotAdmitLayerEvidence: true,
    compatibleDoesNotInterpretRbc: true,
    compatibleDoesNotSatisfyQuorum: true,
    compatibleDoesNotGrantAuthority: true,
    projectionDoesNotPromoteReferents: true,
    projectionDoesNotPublishToMesh: true,
    projectionDoesNotWriteProductionContinuity: true,
    projectionDoesNotDecideLayerAdmission: true,
    writesProjectionArtifact: false,
  });
});

test("seam-history observation readback guardrails reject claim overclaims", () => {
  const result = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:03:00.000Z",
  });

  const overclaimPaths = [
    ["proof", "decentralizedSeamProofClaimed"],
    ["boundary", "acceptsCanonicalHistory"],
    ["boundary", "admitsLayerEvidence"],
    ["boundary", "interpretsRbc"],
    ["boundary", "claimsQuorumSatisfaction"],
    ["boundary", "grantsAuthority"],
    ["boundary", "publishesToMesh"],
    ["boundary", "writesProductionContinuity"],
    ["nonClaims", "canonicalHistoryClaimed"],
    ["nonClaims", "layerEvidenceAdmitted"],
    ["nonClaims", "layerAdmissionDecided"],
    ["nonClaims", "rbcInterpreted"],
    ["nonClaims", "quorumSatisfied"],
    ["nonClaims", "authorityGranted"],
    ["nonClaims", "meshPublished"],
    ["nonClaims", "productionContinuityWritten"],
    ["layerReceiptFit", "layerEvidenceAdmitted"],
    ["layerReceiptFit", "rbcEnforced"],
    ["layerReceiptFit", "admissionDecided"],
    ["layerReceiptFit", "layerRuntimeOpened"],
    ["deferredAttachmentPoints", "meshPublication", "active"],
    ["deferredAttachmentPoints", "productionCausalHistory", "writes"],
  ] as const;

  for (const pathSegments of overclaimPaths) {
    const mutated = JSON.parse(JSON.stringify(result));
    let target: Record<string, unknown> = mutated;
    for (const segment of pathSegments.slice(0, -1)) {
      target = target[segment] as Record<string, unknown>;
    }
    const finalSegment = pathSegments.at(-1);
    assert.ok(finalSegment);
    target[finalSegment] = true;

    assert.throws(
      () => assertEdgeLayerSeamHistoryObservationResult(mutated),
      new RegExp(pathSegments.join("\\.")),
    );
  }

  const weakenedGuardrailPaths = [
    ["suppliedMaterialGuardrailMatrix", "dhtHyperswarmProofRequiresDurableTransport"],
    ["suppliedMaterialGuardrailMatrix", "canonicalHistoryBlocked"],
    ["suppliedMaterialGuardrailMatrix", "layerAdmissionBlocked"],
    ["suppliedMaterialGuardrailMatrix", "layerEvidenceAdmissionBlocked"],
    ["suppliedMaterialGuardrailMatrix", "rbcInterpretationBlocked"],
    ["suppliedMaterialGuardrailMatrix", "quorumSatisfactionBlocked"],
    ["suppliedMaterialGuardrailMatrix", "authorityGrantBlocked"],
    ["suppliedMaterialGuardrailMatrix", "meshPublicationBlocked"],
    ["suppliedMaterialGuardrailMatrix", "productionContinuityWriteBlocked"],
    ["suppliedMaterialGuardrailMatrix", "sourceReferencePreservationRequired"],
    ["suppliedMaterialGuardrailMatrix", "edgeProjectionOnlyAfterObservation"],
    ["layerReceiptFit", "receiptRefsAcceptedAsCausalInputRefsOnly"],
    ["layerReceiptFit", "receiptSourceRequestRefsInterpretedAsLinkageOnly"],
    ["layerReceiptFit", "receiptDoesNotPromoteReferents"],
    ["layerReceiptFit", "receiptDoesNotGrantAuthority"],
    ["outwardLaneTriggerNote", "boundary", "noteOnly"],
    ["outwardLaneTriggerNote", "boundary", "doesNotOpenEdgeRuntime"],
    ["outwardLaneTriggerNote", "boundary", "doesNotOpenLayerRuntime"],
    ["outwardLaneTriggerNote", "boundary", "doesNotClaimSwarmProof"],
    ["outwardLaneTriggerNote", "boundary", "doesNotAdmitLayerEvidence"],
    ["outwardLaneTriggerNote", "boundary", "doesNotInterpretRbc"],
    ["outwardLaneTriggerNote", "boundary", "doesNotGrantAuthority"],
    ["outwardLaneTriggerNote", "boundary", "doesNotPublishToMesh"],
  ] as const;

  for (const pathSegments of weakenedGuardrailPaths) {
    const mutated = JSON.parse(JSON.stringify(result));
    let target: Record<string, unknown> = mutated;
    for (const segment of pathSegments.slice(0, -1)) {
      target = target[segment] as Record<string, unknown>;
    }
    const finalSegment = pathSegments.at(-1);
    assert.ok(finalSegment);
    target[finalSegment] = false;

    assert.throws(
      () => assertEdgeLayerSeamHistoryObservationResult(mutated),
      new RegExp(pathSegments.join("\\.")),
    );
  }
});

test("observation contract snapshot preserves stable consumer fields", () => {
  const result = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:03:30.000Z",
    sourcePath: "layer-owned-edge-seam-status:contract-snapshot",
  });

  const snapshot = buildEdgeLayerSeamHistoryObservationContractSnapshot(result);

  assertEdgeLayerSeamHistoryObservationContractSnapshot(snapshot);
  assert.equal(snapshot.sourceObservation.artifactId, result.artifactId);
  assert.equal(snapshot.sourceObservation.schema, result.schema);
  assert.deepEqual(snapshot.source.sourceRepos, ["mesh-ecology-edge", "mesh-ecology-layer"]);
  assert.equal(snapshot.proof.normalizedProofLabel, "local_supplied_material");
  assert.equal(snapshot.proof.strongestProofRung, "local_causal_observation_over_supplied_seam_history_material");
  assert.equal(snapshot.proof.decentralizedSeamProofClaimed, false);
  assert.deepEqual(snapshot.sourceRefs.requestIds, [
    "edge-layer-report-only-seam-request:causal-observation:linked",
    "edge-layer-report-only-seam-request:causal-observation:damaged",
  ]);
  assert.deepEqual(snapshot.sourceRefs.requestHashes, [
    `sha256:${"a".repeat(64)}`,
    `sha256:${"c".repeat(64)}`,
  ]);
  assert.deepEqual(snapshot.sourceRefs.receiptIds, [
    "layer-report-only-edge-seam-receipt:causal-observation:linked",
    "layer-report-only-edge-seam-receipt:causal-observation:damaged",
  ]);
  assert.deepEqual(snapshot.sourceRefs.receiptHashes, [
    `sha256:${"b".repeat(64)}`,
    `sha256:${"d".repeat(64)}`,
  ]);
  assert.deepEqual(snapshot.observationRefs.map((ref) => ref.classification), [
    "compatible_seam_happening",
    "unresolved_or_damaged_seam_happening",
  ]);
  assert.deepEqual(snapshot.observationRefs.map((ref) => ref.linkageStatus), ["linked", "damaged"]);
  assert.equal(snapshot.classificationSummary.linkedPairDetected, true);
  assert.equal(snapshot.classificationSummary.damagedPairDetected, true);
  assert.equal(snapshot.sourceReferenceContract.sourceRefsPreserved, true);
  assert.equal(snapshot.sourceReferenceContract.sourceReposPreserved, true);
  assert.equal(snapshot.nonClaims.canonicalHistoryClaimed, false);
  assert.equal(snapshot.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(snapshot.nonClaims.rbcInterpreted, false);
  assert.equal(snapshot.nonClaims.authorityGranted, false);
  assert.equal(snapshot.deferredAttachmentPoints.layerAdmission.active, false);
  assert.equal(snapshot.boundary.acceptsCanonicalHistory, false);
  assert.equal(snapshot.boundary.admitsLayerEvidence, false);
  assert.equal(snapshot.boundary.interpretsRbc, false);
  assert.equal(snapshot.boundary.grantsAuthority, false);
});

test("supplied material guardrail matrix keeps local input from self-claiming higher lanes", () => {
  const seamHistory = operationShapedSeamHistory();
  seamHistory.claimedProof = {
    dhtOrHyperswarmInputObservedByCausalSubstrate: true,
    decentralizedSeamProofClaimed: true,
    canonicalHistoryClaimed: true,
    layerEvidenceAdmitted: true,
    layerAdmissionDecided: true,
    rbcInterpreted: true,
    quorumSatisfied: true,
    authorityGranted: true,
    meshPublished: true,
    productionContinuityWritten: true,
  };

  const result = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory,
    emittedAt: "2026-05-31T12:04:30.000Z",
    sourcePath: "supplied-json:self-claimed-higher-lanes",
    inputReadByCausalSubstrate: true,
  });

  assertEdgeLayerSeamHistoryObservationResult(result);
  assert.equal(result.proof.normalizedProofLabel, "local_supplied_material");
  assert.equal(result.proof.decentralizedSeamProofClaimed, false);
  assert.equal(result.proof.durableCorestoreHistoryRead, false);
  assert.equal(result.proof.replicatedViaHyperswarmTransport, false);
  assert.equal(result.suppliedMaterialGuardrailMatrix.localSuppliedMaterialGuardrailActive, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.dhtHyperswarmProofClaimBlockedForSuppliedMaterial, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.canonicalHistoryBlocked, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.layerAdmissionBlocked, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.layerEvidenceAdmissionBlocked, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.rbcInterpretationBlocked, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.quorumSatisfactionBlocked, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.authorityGrantBlocked, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.meshPublicationBlocked, true);
  assert.equal(result.suppliedMaterialGuardrailMatrix.productionContinuityWriteBlocked, true);
  assert.equal(result.boundary.acceptsCanonicalHistory, false);
  assert.equal(result.boundary.admitsLayerEvidence, false);
  assert.equal(result.boundary.interpretsRbc, false);
  assert.equal(result.boundary.grantsAuthority, false);
  assert.equal(result.nonClaims.canonicalHistoryClaimed, false);
  assert.equal(result.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(result.nonClaims.rbcInterpreted, false);
  assert.equal(result.nonClaims.authorityGranted, false);
});

test("Layer-owned seam status linkedPairs shape can be observed without claiming swarm proof", () => {
  const statusReadback = {
    artifactKind: "layer_owned_edge_seam_status",
    schemaVersion: "layer-owned-edge-seam-status.v0",
    statusId: "layer-owned-edge-seam-status:linked-pairs-shape",
    sourceRepos: ["mesh-ecology-edge", "mesh-ecology-layer"],
    linkedPairs: [
      {
        requestId: "edge-layer-report-only-seam-request:status-shape:linked",
        requestHash: `sha256:${"1".repeat(64)}`,
        requestSourceRepo: "mesh-ecology-edge",
        receiptId: "layer-report-only-edge-seam-receipt:status-shape:linked",
        receiptHash: `sha256:${"2".repeat(64)}`,
        receiptSourceRepo: "mesh-ecology-layer",
        linked: true,
      },
      {
        requestId: "edge-layer-report-only-seam-request:status-shape:unlinked",
        requestHash: `sha256:${"3".repeat(64)}`,
        requestSourceRepo: "mesh-ecology-edge",
        receiptId: null,
        receiptHash: null,
        receiptSourceRepo: "mesh-ecology-layer",
        linked: false,
      },
    ],
    operationProof: {
      seamFeedBackedRequestObserved: true,
      layerOwnedReceiptEmitted: true,
      receiptCausallyReferencesRequest: false,
      evidenceAdmissionOccurred: false,
      authorityGrantOccurred: false,
      rbcEnforced: false,
    },
  };

  const result = buildEdgeLayerSeamHistoryObservationResultFromJson({
    seamHistoryJson: JSON.stringify(statusReadback),
    emittedAt: "2026-05-31T12:05:00.000Z",
  });

  assert.equal(result.validation.seamHistoryInputConsumed, true);
  assert.equal(result.observations[0]?.classification, "compatible_seam_happening");
  assert.equal(result.observations[1]?.classification, "unresolved_or_damaged_seam_happening");
  assert.equal(result.observations[1]?.linkageStatus, "unlinked");
  assert.equal(
    result.observations[1]?.damageOrUnresolvedDetail,
    "unresolved_unlinked_or_missing_request_receipt_refs",
  );
  assert.equal(result.validation.damagedPairCount, 0);
  assert.equal(result.validation.unresolvedPairCount, 1);
  assert.equal(result.validation.damagedPairDetected, false);
  assert.equal(result.validation.unresolvedPairDetected, true);
  assert.equal(result.validation.sourceReposPreserved, true);
  assert.equal(result.validation.durableRefsPreserved, false);
  assert.equal(result.validation.writerRefsPreserved, false);
  assert.equal(result.validation.linkageStatusPreserved, true);
  assert.equal(result.layerReceiptIncompleteCaseMatrix.complete, false);
  assert.equal(result.layerReceiptIncompleteCaseMatrix.incompleteCaseCount, 2);
  assert.deepEqual(result.layerReceiptIncompleteCaseMatrix.cases, [
    {
      observationId: result.observations[0]!.observationId,
      classification: "compatible_seam_happening",
      linkageStatus: "linked",
      receiptId: "layer-report-only-edge-seam-receipt:status-shape:linked",
      receiptHash: `sha256:${"2".repeat(64)}`,
      reasons: [
        "receipt-durable-ref-missing",
        "receipt-writer-ref-missing",
      ],
    },
    {
      observationId: result.observations[1]!.observationId,
      classification: "unresolved_or_damaged_seam_happening",
      linkageStatus: "unlinked",
      reasons: [
        "receipt-id-missing",
        "receipt-hash-missing",
        "receipt-durable-ref-missing",
        "receipt-writer-ref-missing",
      ],
    },
  ]);
  assert.equal(result.layerReceiptIncompleteCaseMatrix.boundary.matrixOnly, true);
  assert.equal(result.layerReceiptIncompleteCaseMatrix.boundary.receiptRefsAreCausalInputOnly, true);
  assert.equal(result.layerReceiptIncompleteCaseMatrix.boundary.doesNotAdmitLayerEvidence, true);
  assert.equal(result.layerReceiptIncompleteCaseMatrix.boundary.doesNotDecideLayerAdmission, true);
  assert.equal(result.layerReceiptIncompleteCaseMatrix.boundary.doesNotInterpretRbc, true);
  assert.equal(result.layerReceiptIncompleteCaseMatrix.boundary.doesNotGrantAuthority, true);
  assert.equal(result.sourceReferenceCompletenessReport.complete, false);
  assert.equal(result.sourceReferenceCompletenessReport.failureCount, 2);
  assert.deepEqual(result.sourceReferenceCompletenessReport.missingFieldNames, [
    "request.durableRef",
    "request.writerRef",
    "receipt.durableRef",
    "receipt.writerRef",
    "receipt.id",
    "receipt.hash",
  ]);
  assert.deepEqual(result.sourceReferenceCompletenessReport.failures, [
    {
      observationId: result.observations[0]!.observationId,
      classification: "compatible_seam_happening",
      linkageStatus: "linked",
      missingFields: [
        "request.durableRef",
        "request.writerRef",
        "receipt.durableRef",
        "receipt.writerRef",
      ],
    },
    {
      observationId: result.observations[1]!.observationId,
      classification: "unresolved_or_damaged_seam_happening",
      linkageStatus: "unlinked",
      missingFields: [
        "request.durableRef",
        "request.writerRef",
        "receipt.id",
        "receipt.hash",
        "receipt.durableRef",
        "receipt.writerRef",
      ],
    },
  ]);
  assert.equal(result.sourceReferenceCompletenessReport.boundary.reportOnly, true);
  assert.equal(result.sourceReferenceCompletenessReport.boundary.rejectsPromotionWhenIncomplete, true);
  assert.equal(result.sourceReferenceCompletenessReport.boundary.acceptsCanonicalHistory, false);
  assert.equal(result.sourceReferenceCompletenessReport.boundary.admitsLayerEvidence, false);
  assert.equal(result.sourceReferenceCompletenessReport.boundary.interpretsRbc, false);
  assert.equal(result.sourceReferenceCompletenessReport.boundary.grantsAuthority, false);
  assert.ok(result.validation.issues.includes("source-ids-or-hashes-missing"));
  assert.ok(result.validation.issues.includes("source-durable-refs-missing"));
  assert.ok(result.validation.issues.includes("source-writer-refs-missing"));
  assert.equal(result.boundary.opensLayerRuntime, false);
  assert.equal(result.boundary.acceptsCanonicalHistory, false);
  assert.equal(result.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
  assert.equal(result.proof.decentralizedSeamProofClaimed, false);
  assert.equal(result.proof.normalizedProofLabel, "local_supplied_material");
  assert.ok(result.warnings.includes("local-supplied-seam-history-material-is-lower-proof-rung"));
  assert.ok(result.warnings.includes("observation-does-not-claim-dht-or-hyperswarm-seam-proof"));
  assert.equal(
    result.validation.strongestProofRung,
    "local_causal_observation_over_supplied_seam_history_material",
  );
});

test("local observer cannot claim higher proof without all DHT Hyperswarm gates", () => {
  const result = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:07:00.000Z",
    inputReadByCausalSubstrate: true,
    dhtOrHyperswarmInputObservedByCausalSubstrate: true,
  });

  assert.equal(
    result.proof.strongestProofRung,
    "local_causal_observation_over_supplied_seam_history_material",
  );
  assert.equal(result.proof.durableCorestoreHistoryRead, false);
  assert.equal(result.proof.replicatedViaHyperswarmTransport, false);
  assert.equal(result.proof.decentralizedSeamProofClaimed, false);
  assert.equal(result.proof.normalizedProofLabel, "local_supplied_material");
  assert.equal(result.validation.decentralizedSeamProofClaimed, false);
});

test("seam-history observation command reads supplied material, writes result, and readbacks lower proof rung", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-history-observation-"));
  const inputPath = path.join(tempRoot, "seam-history.json");
  const outputPath = path.join(tempRoot, "observation-result.json");
  const contractPath = path.join(tempRoot, "observation-readback-contract.json");
  const handoffPath = path.join(tempRoot, "edge-projection-handoff.json");
  const handoffReadbackPath = path.join(tempRoot, "edge-projection-handoff-readback.json");
  const hyperswarmReadinessPath = path.join(tempRoot, "hyperswarm-input-lane-readiness.json");
  try {
    await writeFile(inputPath, JSON.stringify(operationShapedSeamHistory(), null, 2), "utf8");

    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/observe-edge-layer-seam-history.ts",
      "--input",
      inputPath,
      "--output",
      outputPath,
      "--contract-output",
      contractPath,
      "--handoff-output",
      handoffPath,
      "--handoff-readback-output",
      handoffReadbackPath,
      "--hyperswarm-readiness-output",
      hyperswarmReadinessPath,
      "--hyperswarm-namespace",
      "hyperswarm-seam-history-reader,cli-readiness",
      "--emitted-at",
      "2026-05-31T12:10:00.000Z",
      "--readback",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const result = JSON.parse(await readFile(outputPath, "utf8"));
    assertEdgeLayerSeamHistoryObservationResult(result);
    assert.equal(result.validation.seamHistoryInputConsumed, true);
    assert.equal(result.validation.linkedPairDetected, true);
    assert.equal(result.validation.damagedOrUnlinkedPairDetected, true);
    assert.equal(result.validation.sourceIdsAndHashesPreserved, true);
    assert.equal(result.validation.sourceReposPreserved, true);
    assert.equal(result.validation.durableRefsPreserved, true);
    assert.equal(result.validation.writerRefsPreserved, true);
    assert.equal(result.validation.linkageStatusPreserved, true);
    assert.equal(result.proof.inputReadByCausalSubstrate, true);
    assert.equal(result.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
    assert.equal(result.proof.decentralizedSeamProofClaimed, false);
    assert.equal(result.proof.normalizedProofLabel, "local_supplied_material");
    assert.equal(result.validation.decentralizedSeamProofClaimed, false);
    assert.equal(
      result.proof.strongestProofRung,
      "local_causal_observation_over_supplied_seam_history_material",
    );
    assert.equal(
      result.observations[0]!.classification,
      "compatible_seam_happening",
    );
    assert.equal(
      result.observations[1]!.classification,
      "unresolved_or_damaged_seam_happening",
    );
    const contract = JSON.parse(await readFile(contractPath, "utf8"));
    assertEdgeLayerSeamHistoryObservationReadbackContract(contract);
    assert.equal(contract.validation.observationArtifactConsumed, true);
    assert.equal(contract.validation.sourceRefsPreserved, true);
    assert.equal(contract.validation.sourceReposPreserved, true);
    assert.equal(contract.validation.durableRefsPreserved, true);
    assert.equal(contract.validation.writerRefsPreserved, true);
    assert.equal(contract.validation.linkageStatusPreserved, true);
    assert.equal(contract.validation.boundaryAndNonClaimsPreserved, true);
    assert.equal(contract.validation.proofLabelsPreserved, true);
    assert.equal(contract.readback.proofRungPreserved, result.proof.strongestProofRung);
    assert.equal(contract.readback.normalizedProofLabelPreserved, result.proof.normalizedProofLabel);
    assert.equal(contract.boundary.writesObservationArtifact, false);
    assert.equal(contract.boundary.acceptsCanonicalHistory, false);
    const handoff = JSON.parse(await readFile(handoffPath, "utf8"));
    assertEdgeLayerSeamHistoryEdgeProjectionFixture(handoff);
    assert.equal(handoff.validation.observationResultConsumed, true);
    assert.equal(handoff.validation.sourceRefsPreserved, true);
    assert.equal(handoff.source.sourceObservationArtifactId, result.artifactId);
    assert.equal(
      handoff.source.sourceObservationProofRung,
      "local_causal_observation_over_supplied_seam_history_material",
    );
    assert.equal(handoff.handoffEnvelope.sourceObservation.normalizedProofLabel, "local_supplied_material");
    assert.deepEqual(handoff.handoffEnvelope.sourceReferences.requestIds, [
      "edge-layer-report-only-seam-request:causal-observation:linked",
      "edge-layer-report-only-seam-request:causal-observation:damaged",
    ]);
    assert.deepEqual(handoff.handoffEnvelope.sourceReferences.receiptHashes, [
      `sha256:${"b".repeat(64)}`,
      `sha256:${"d".repeat(64)}`,
    ]);
    assert.equal(handoff.handoffEnvelope.consumerBoundary.edgeMayConsume, true);
    assert.equal(handoff.handoffEnvelope.consumerBoundary.writesEdgeProjection, false);
    assert.equal(handoff.handoffEnvelope.consumerBoundary.acceptsCanonicalHistory, false);
    assert.equal(handoff.handoffEnvelope.consumerBoundary.admitsLayerEvidence, false);
    assert.equal(handoff.handoffEnvelope.consumerBoundary.interpretsRbc, false);
    assert.equal(handoff.handoffEnvelope.consumerBoundary.grantsAuthority, false);

    const handoffReadback = JSON.parse(await readFile(handoffReadbackPath, "utf8"));
    assertEdgeLayerSeamHistoryEdgeProjectionHandoffReadback(handoffReadback);
    assert.equal(handoffReadback.validation.handoffFixtureConsumed, true);
    assert.equal(handoffReadback.validation.sourceRefsPreserved, true);
    assert.equal(handoffReadback.readback.nonClaimsPreserved, true);
    assert.equal(handoffReadback.source.sourceFixtureArtifactId, handoff.artifactId);
    assert.equal(handoffReadback.source.sourceObservationArtifactId, result.artifactId);
    assert.equal(handoffReadback.source.sourceObservationNormalizedProofLabel, "local_supplied_material");
    assert.deepEqual(handoffReadback.preservedSourceRefs.requestHashes, [
      `sha256:${"a".repeat(64)}`,
      `sha256:${"c".repeat(64)}`,
    ]);
    assert.equal(handoffReadback.boundary.writesEdgeProjection, false);
    assert.equal(handoffReadback.boundary.acceptsCanonicalHistory, false);
    assert.equal(handoffReadback.boundary.admitsLayerEvidence, false);
    assert.equal(handoffReadback.boundary.interpretsRbc, false);
    assert.equal(handoffReadback.boundary.grantsAuthority, false);

    const hyperswarmReadiness = JSON.parse(await readFile(hyperswarmReadinessPath, "utf8"));
    assert.equal(
      hyperswarmReadiness.schema,
      "causal-substrate/edge-layer-seam-history-hyperswarm-input-lane-readiness/v1",
    );
    assert.equal(
      hyperswarmReadiness.status,
      "edge-layer-seam-history-hyperswarm-input-lane-ready-to-run",
    );
    assert.equal(hyperswarmReadiness.gates.durableCorestoreReaderAvailable, true);
    assert.equal(hyperswarmReadiness.gates.hyperswarmFactoryAvailable, true);
    assert.equal(hyperswarmReadiness.gates.namespaceConfigured, true);
    assert.equal(hyperswarmReadiness.gates.seamHistoryInputAvailable, true);
    assert.equal(hyperswarmReadiness.proofPosture.readinessOnly, true);
    assert.equal(hyperswarmReadiness.proofPosture.dhtHyperswarmProofClaimedNow, false);
    assert.equal(hyperswarmReadiness.proofPosture.canReachHigherProofRungOnlyAfterRun, true);
    assert.equal(hyperswarmReadiness.boundary.opensSwarm, false);
    assert.equal(hyperswarmReadiness.boundary.opensCorestore, false);
    assert.equal(hyperswarmReadiness.boundary.readsDurableHistory, false);
    assert.equal(hyperswarmReadiness.boundary.writesRecords, false);
    assert.equal(hyperswarmReadiness.boundary.publishesToMesh, false);
    assert.equal(hyperswarmReadiness.boundary.grantsAuthority, false);
    assert.deepEqual(hyperswarmReadiness.issues, []);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("Edge projection fixture is derived from observation result without writing Edge projection state", () => {
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:15:00.000Z",
    sourcePath: "layer-owned-edge-seam-status:edge-projection-fixture",
  });

  const fixture = buildEdgeLayerSeamHistoryEdgeProjectionFixture({
    observationResult,
    emittedAt: "2026-05-31T12:16:00.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeProjectionFixture(fixture);
  assert.equal(fixture.reviewStatus, "edge-layer-seam-history-edge-projection-fixture-ready");
  assert.equal(fixture.validation.observationResultConsumed, true);
  assert.equal(fixture.validation.compatibilityEnvelopeConsumed, true);
  assert.equal(fixture.validation.sourceRefsPreserved, true);
  assert.equal(fixture.validation.compatibleRefsPresent, true);
  assert.equal(fixture.validation.unresolvedOrDamagedRefsPresent, true);
  assert.equal(fixture.validation.noCanonicalHistoryClaim, true);
  assert.equal(fixture.validation.noLayerAdmissionClaim, true);
  assert.equal(fixture.validation.noRbcInterpretationClaim, true);
  assert.equal(fixture.validation.noAuthorityClaim, true);
  assert.equal(fixture.validation.noReferentPromotion, true);
  assert.deepEqual(fixture.rejections, []);
  assert.equal(fixture.source.sourceObservationArtifactId, observationResult.artifactId);
  assert.equal(
    fixture.source.sourceObservationProofRung,
    "local_causal_observation_over_supplied_seam_history_material",
  );
  assert.equal(
    fixture.edgeProjectionMaterial.projectionSuitability,
    "edge_projection_candidate",
  );
  assert.equal(fixture.edgeProjectionMaterial.compatibleRefs.length, 1);
  assert.equal(fixture.edgeProjectionMaterial.unresolvedOrDamagedRefs.length, 1);
  assert.equal(fixture.handoffEnvelope.envelopeKind, "edge_projection_handoff_envelope");
  assert.equal(fixture.handoffEnvelope.sourceObservation.artifactId, observationResult.artifactId);
  assert.equal(fixture.handoffEnvelope.sourceObservation.normalizedProofLabel, "local_supplied_material");
  assert.deepEqual(fixture.handoffEnvelope.sourceReferences.sourceRepos, [
    "mesh-ecology-edge",
    "mesh-ecology-layer",
  ]);
  assert.deepEqual(fixture.handoffEnvelope.sourceReferences.requestIds, [
    "edge-layer-report-only-seam-request:causal-observation:linked",
    "edge-layer-report-only-seam-request:causal-observation:damaged",
  ]);
  assert.deepEqual(fixture.handoffEnvelope.sourceReferences.requestHashes, [
    `sha256:${"a".repeat(64)}`,
    `sha256:${"c".repeat(64)}`,
  ]);
  assert.deepEqual(fixture.handoffEnvelope.sourceReferences.receiptIds, [
    "layer-report-only-edge-seam-receipt:causal-observation:linked",
    "layer-report-only-edge-seam-receipt:causal-observation:damaged",
  ]);
  assert.deepEqual(fixture.handoffEnvelope.sourceReferences.receiptHashes, [
    `sha256:${"b".repeat(64)}`,
    `sha256:${"d".repeat(64)}`,
  ]);
  assert.deepEqual(fixture.handoffEnvelope.classificationSummary.compatibleObservationIds, [
    observationResult.observations[0]!.observationId,
  ]);
  assert.deepEqual(fixture.handoffEnvelope.classificationSummary.unresolvedOrDamagedObservationIds, [
    observationResult.observations[1]!.observationId,
  ]);
  assert.deepEqual(fixture.handoffEnvelope.classificationSummary.linkageStatuses, ["linked", "damaged"]);
  assert.deepEqual(fixture.handoffEnvelope.classificationSummary.damageOrUnresolvedDetails, [
    "none_compatible_linked_request_receipt",
    "damaged_partial_or_mismatched_request_receipt_refs",
  ]);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.edgeMayConsume, true);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.writesEdgeProjection, false);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.acceptsCanonicalHistory, false);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.admitsLayerEvidence, false);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.interpretsRbc, false);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.grantsAuthority, false);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.promotesReferents, false);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.publishesToMesh, false);
  assert.equal(fixture.handoffEnvelope.consumerBoundary.writesProductionContinuity, false);
  assert.equal(fixture.handoffEnvelope.nonClaims.canonicalHistoryClaimed, false);
  assert.equal(fixture.handoffEnvelope.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(fixture.handoffEnvelope.nonClaims.rbcInterpreted, false);
  assert.equal(fixture.handoffEnvelope.nonClaims.authorityGranted, false);

  const compatibleRef = fixture.edgeProjectionMaterial.compatibleRefs[0]!;
  assert.equal(compatibleRef.sourceObservationArtifactId, observationResult.artifactId);
  assert.equal(compatibleRef.observationId, observationResult.observations[0]!.observationId);
  assert.equal(compatibleRef.damageOrUnresolvedDetail, "none_compatible_linked_request_receipt");
  assert.equal(compatibleRef.request.id, "edge-layer-report-only-seam-request:causal-observation:linked");
  assert.equal(compatibleRef.request.hash, `sha256:${"a".repeat(64)}`);
  assert.equal(compatibleRef.receipt.id, "layer-report-only-edge-seam-receipt:causal-observation:linked");
  assert.equal(compatibleRef.receipt.hash, `sha256:${"b".repeat(64)}`);
  assert.equal(compatibleRef.acceptedAsCanonicalHistory, false);
  assert.equal(compatibleRef.layerEvidenceAdmitted, false);
  assert.equal(compatibleRef.rbcInterpreted, false);
  assert.equal(compatibleRef.authorityGranted, false);
  assert.equal(compatibleRef.referentPromoted, false);

  const unresolvedRef = fixture.edgeProjectionMaterial.unresolvedOrDamagedRefs[0]!;
  assert.equal(unresolvedRef.observationId, observationResult.observations[1]!.observationId);
  assert.equal(unresolvedRef.classification, "unresolved_or_damaged_seam_happening");
  assert.equal(unresolvedRef.damageOrUnresolvedDetail, "damaged_partial_or_mismatched_request_receipt_refs");
  assert.equal(unresolvedRef.request.hash, `sha256:${"c".repeat(64)}`);
  assert.equal(unresolvedRef.receipt.hash, `sha256:${"d".repeat(64)}`);
  assert.equal(fixture.boundary.edgeProjectionWritten, false);
  assert.equal(fixture.boundary.opensEdgeRuntime, false);
  assert.equal(fixture.boundary.promotesReferents, false);
  assert.equal(fixture.boundary.writesProductionContinuity, false);
});

test("Edge projection consumer fixture variant exposes observation-only material", () => {
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:16:20.000Z",
    sourcePath: "layer-owned-edge-seam-status:edge-projection-consumer-fixture",
  });
  const fixture = buildEdgeLayerSeamHistoryEdgeProjectionFixture({
    observationResult,
    emittedAt: "2026-05-31T12:16:21.000Z",
  });

  const consumerFixture = buildEdgeLayerSeamHistoryEdgeProjectionConsumerFixture({
    fixture,
    emittedAt: "2026-05-31T12:16:22.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeProjectionConsumerFixture(consumerFixture);
  assert.equal(
    consumerFixture.reviewStatus,
    "edge-layer-seam-history-edge-projection-consumer-fixture-ready",
  );
  assert.equal(consumerFixture.validation.sourceFixtureConsumed, true);
  assert.equal(consumerFixture.validation.compatibleRefsPresent, true);
  assert.equal(consumerFixture.validation.unresolvedOrDamagedRefsPresent, true);
  assert.equal(consumerFixture.validation.sourceRefsPreserved, true);
  assert.equal(consumerFixture.validation.classificationSummaryPreserved, true);
  assert.equal(consumerFixture.source.sourceFixtureArtifactId, fixture.artifactId);
  assert.equal(consumerFixture.source.sourceObservationArtifactId, observationResult.artifactId);
  assert.equal(
    consumerFixture.source.sourceObservationProofRung,
    "local_causal_observation_over_supplied_seam_history_material",
  );
  assert.equal(consumerFixture.source.sourceObservationNormalizedProofLabel, "local_supplied_material");
  assert.equal(consumerFixture.consumerMaterial.materialKind, "edge_projection_observation_consumer_material");
  assert.equal(consumerFixture.consumerMaterial.consumeAs, "causal_observation_projection_input_only");
  assert.equal(consumerFixture.consumerMaterial.compatibleRefs.length, 1);
  assert.equal(consumerFixture.consumerMaterial.unresolvedOrDamagedRefs.length, 1);
  assert.equal(
    consumerFixture.consumerMaterial.compatibleRefs[0]!.observationId,
    observationResult.observations[0]!.observationId,
  );
  assert.equal(
    consumerFixture.consumerMaterial.unresolvedOrDamagedRefs[0]!.observationId,
    observationResult.observations[1]!.observationId,
  );
  assert.deepEqual(consumerFixture.consumerMaterial.sourceReferences.requestIds, [
    "edge-layer-report-only-seam-request:causal-observation:linked",
    "edge-layer-report-only-seam-request:causal-observation:damaged",
  ]);
  assert.deepEqual(consumerFixture.consumerMaterial.sourceReferences.receiptHashes, [
    `sha256:${"b".repeat(64)}`,
    `sha256:${"d".repeat(64)}`,
  ]);
  assert.deepEqual(consumerFixture.consumerMaterial.classificationSummary.linkageStatuses, [
    "linked",
    "damaged",
  ]);
  assert.equal(consumerFixture.boundary.edgeMayConsume, true);
  assert.equal(consumerFixture.boundary.consumeAsObservationOnly, true);
  assert.equal(consumerFixture.boundary.writesEdgeProjection, false);
  assert.equal(consumerFixture.boundary.acceptsCanonicalHistory, false);
  assert.equal(consumerFixture.boundary.admitsLayerEvidence, false);
  assert.equal(consumerFixture.boundary.interpretsRbc, false);
  assert.equal(consumerFixture.boundary.grantsAuthority, false);
  assert.equal(consumerFixture.boundary.promotesReferents, false);
  assert.equal(consumerFixture.boundary.publishesToMesh, false);
  assert.equal(consumerFixture.boundary.writesProductionContinuity, false);
});

test("Edge projection fixture guardrail matrix rejects projection overclaims", () => {
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:17:00.000Z",
    sourcePath: "layer-owned-edge-seam-status:edge-projection-guardrails",
  });
  const fixture = buildEdgeLayerSeamHistoryEdgeProjectionFixture({
    observationResult,
    emittedAt: "2026-05-31T12:18:00.000Z",
  });

  const overclaimCases = [
    { path: ["boundary", "acceptsCanonicalHistory"], value: true },
    { path: ["boundary", "admitsLayerEvidence"], value: true },
    { path: ["boundary", "interpretsRbc"], value: true },
    { path: ["boundary", "grantsAuthority"], value: true },
    { path: ["boundary", "promotesReferents"], value: true },
    { path: ["boundary", "publishesToMesh"], value: true },
    { path: ["boundary", "writesProductionContinuity"], value: true },
    { path: ["handoffEnvelope", "consumerBoundary", "writesEdgeProjection"], value: true },
    { path: ["handoffEnvelope", "consumerBoundary", "acceptsCanonicalHistory"], value: true },
    { path: ["handoffEnvelope", "consumerBoundary", "admitsLayerEvidence"], value: true },
    { path: ["handoffEnvelope", "consumerBoundary", "interpretsRbc"], value: true },
    { path: ["handoffEnvelope", "consumerBoundary", "grantsAuthority"], value: true },
    { path: ["handoffEnvelope", "consumerBoundary", "promotesReferents"], value: true },
    { path: ["handoffEnvelope", "consumerBoundary", "publishesToMesh"], value: true },
    { path: ["handoffEnvelope", "consumerBoundary", "writesProductionContinuity"], value: true },
    { path: ["handoffEnvelope", "nonClaims", "canonicalHistoryClaimed"], value: true },
    { path: ["handoffEnvelope", "nonClaims", "layerEvidenceAdmitted"], value: true },
    { path: ["handoffEnvelope", "nonClaims", "layerAdmissionDecided"], value: true },
    { path: ["handoffEnvelope", "nonClaims", "rbcInterpreted"], value: true },
    { path: ["handoffEnvelope", "nonClaims", "authorityGranted"], value: true },
    { path: ["handoffEnvelope", "nonClaims", "referentPromoted"], value: true },
    { path: ["handoffEnvelope", "nonClaims", "meshPublished"], value: true },
    { path: ["handoffEnvelope", "nonClaims", "productionContinuityWritten"], value: true },
    { path: ["validation", "noCanonicalHistoryClaim"], value: false },
    { path: ["validation", "noLayerAdmissionClaim"], value: false },
    { path: ["validation", "noRbcInterpretationClaim"], value: false },
    { path: ["validation", "noAuthorityClaim"], value: false },
    { path: ["validation", "noReferentPromotion"], value: false },
    { path: ["edgeProjectionMaterial", "compatibleRefs", 0, "acceptedAsCanonicalHistory"], value: true },
    { path: ["edgeProjectionMaterial", "compatibleRefs", 0, "layerEvidenceAdmitted"], value: true },
    { path: ["edgeProjectionMaterial", "compatibleRefs", 0, "rbcInterpreted"], value: true },
    { path: ["edgeProjectionMaterial", "compatibleRefs", 0, "authorityGranted"], value: true },
    { path: ["edgeProjectionMaterial", "compatibleRefs", 0, "referentPromoted"], value: true },
    { path: ["edgeProjectionMaterial", "unresolvedOrDamagedRefs", 0, "acceptedAsCanonicalHistory"], value: true },
    { path: ["edgeProjectionMaterial", "unresolvedOrDamagedRefs", 0, "layerEvidenceAdmitted"], value: true },
    { path: ["edgeProjectionMaterial", "unresolvedOrDamagedRefs", 0, "rbcInterpreted"], value: true },
    { path: ["edgeProjectionMaterial", "unresolvedOrDamagedRefs", 0, "authorityGranted"], value: true },
    { path: ["edgeProjectionMaterial", "unresolvedOrDamagedRefs", 0, "referentPromoted"], value: true },
  ] as const;

  for (const overclaimCase of overclaimCases) {
    const pathSegments = overclaimCase.path;
    const mutated = JSON.parse(JSON.stringify(fixture));
    let target: Record<string, unknown> | unknown[] = mutated;
    for (const segment of pathSegments.slice(0, -1)) {
      target = (Array.isArray(target)
        ? target[Number(segment)]
        : (target as Record<string, unknown>)[segment]) as Record<string, unknown> | unknown[];
    }
    const finalSegment = pathSegments.at(-1);
    assert.ok(finalSegment !== undefined);
    if (Array.isArray(target)) {
      target[Number(finalSegment)] = overclaimCase.value;
    } else {
      (target as Record<string, unknown>)[finalSegment] = overclaimCase.value;
    }

    assert.throws(
      () => assertEdgeLayerSeamHistoryEdgeProjectionFixture(mutated),
      new RegExp(String(finalSegment)),
    );
  }
});

test("Edge projection handoff fixture readback preserves handoff refs and non-claims", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-history-handoff-readback-"));
  const fixturePath = path.join(tempRoot, "edge-projection-fixture.json");
  try {
    const observationResult = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory: operationShapedSeamHistory(),
      emittedAt: "2026-05-31T12:18:30.000Z",
      sourcePath: "layer-owned-edge-seam-status:edge-projection-handoff-readback",
    });
    const fixture = buildEdgeLayerSeamHistoryEdgeProjectionFixture({
      observationResult,
      emittedAt: "2026-05-31T12:18:31.000Z",
    });
    await writeFile(fixturePath, JSON.stringify(fixture, null, 2), "utf8");
    const readbackFixture = JSON.parse(await readFile(fixturePath, "utf8"));

    const readback = buildEdgeLayerSeamHistoryEdgeProjectionHandoffReadback({
      fixture: readbackFixture,
      emittedAt: "2026-05-31T12:18:32.000Z",
    });

    assertEdgeLayerSeamHistoryEdgeProjectionHandoffReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-edge-projection-handoff-readback-valid");
    assert.equal(readback.validation.handoffFixtureConsumed, true);
    assert.equal(readback.validation.sourceRefsPreserved, true);
    assert.equal(readback.readback.fixtureReadable, true);
    assert.equal(readback.readback.handoffEnvelopeReadable, true);
    assert.equal(readback.readback.sourceRefsPreserved, true);
    assert.equal(readback.readback.classificationSummaryPreserved, true);
    assert.equal(readback.readback.proofLabelPreserved, true);
    assert.equal(readback.readback.nonClaimsPreserved, true);
    assert.equal(readback.source.sourceFixtureArtifactId, fixture.artifactId);
    assert.equal(readback.source.sourceObservationArtifactId, observationResult.artifactId);
    assert.equal(readback.source.sourceObservationNormalizedProofLabel, "local_supplied_material");
    assert.deepEqual(readback.preservedSourceRefs.requestIds, [
      "edge-layer-report-only-seam-request:causal-observation:linked",
      "edge-layer-report-only-seam-request:causal-observation:damaged",
    ]);
    assert.deepEqual(readback.preservedSourceRefs.receiptHashes, [
      `sha256:${"b".repeat(64)}`,
      `sha256:${"d".repeat(64)}`,
    ]);
    assert.equal(readback.boundary.writesEdgeProjection, false);
    assert.equal(readback.boundary.acceptsCanonicalHistory, false);
    assert.equal(readback.boundary.admitsLayerEvidence, false);
    assert.equal(readback.boundary.interpretsRbc, false);
    assert.equal(readback.boundary.grantsAuthority, false);
    assert.equal(readback.boundary.promotesReferents, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("Edge projection handoff fixture readback rejects invalid handoff material", () => {
  const invalidReadback = buildEdgeLayerSeamHistoryEdgeProjectionHandoffReadback({
    fixture: {
      artifactKind: "not-a-causal-edge-layer-seam-history-edge-projection-fixture",
      schema: "causal-substrate/edge-layer-seam-history-edge-projection-fixture/v1",
      schemaVersion: 1,
      artifactId: "invalid-handoff-fixture",
      emittedAt: "2026-05-31T12:18:40.000Z",
    },
    emittedAt: "2026-05-31T12:18:41.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeProjectionHandoffReadback(invalidReadback);
  assert.equal(
    invalidReadback.reviewStatus,
    "edge-layer-seam-history-edge-projection-handoff-readback-invalid",
  );
  assert.equal(
    invalidReadback.validation.status,
    "edge-layer-seam-history-edge-projection-handoff-readback-invalid",
  );
  assert.equal(invalidReadback.validation.handoffFixtureConsumed, false);
  assert.equal(invalidReadback.validation.sourceRefsPreserved, false);
  assert.deepEqual(invalidReadback.validation.issues, ["handoff-fixture-invalid"]);
  assert.deepEqual(invalidReadback.rejections, ["handoff-fixture-invalid"]);
  assert.equal(invalidReadback.readback.fixtureReadable, false);
  assert.equal(invalidReadback.readback.fixtureValid, false);
  assert.equal(invalidReadback.readback.handoffEnvelopeReadable, false);
  assert.equal(invalidReadback.readback.sourceRefsPreserved, false);
  assert.equal(invalidReadback.readback.classificationSummaryPreserved, false);
  assert.equal(invalidReadback.readback.proofLabelPreserved, false);
  assert.equal(invalidReadback.readback.nonClaimsPreserved, false);
  assert.deepEqual(invalidReadback.preservedSourceRefs.requestIds, []);
  assert.deepEqual(invalidReadback.preservedSourceRefs.receiptHashes, []);
  assert.equal(invalidReadback.boundary.writesEdgeProjection, false);
  assert.equal(invalidReadback.boundary.acceptsCanonicalHistory, false);
  assert.equal(invalidReadback.boundary.admitsLayerEvidence, false);
  assert.equal(invalidReadback.boundary.interpretsRbc, false);
  assert.equal(invalidReadback.boundary.grantsAuthority, false);
});

test("observation readback contract validates JSON round-trip and preserves source refs", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-history-readback-contract-"));
  const observationPath = path.join(tempRoot, "observation-result.json");
  try {
    const observationResult = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory: operationShapedSeamHistory(),
      emittedAt: "2026-05-31T12:19:00.000Z",
      sourcePath: "layer-owned-edge-seam-status:readback-contract",
    });
    await writeFile(observationPath, JSON.stringify(observationResult, null, 2), "utf8");
    const readback = JSON.parse(await readFile(observationPath, "utf8"));

    const contract = buildEdgeLayerSeamHistoryObservationReadbackContract({
      observationResult: readback,
      emittedAt: "2026-05-31T12:20:00.000Z",
    });

    assertEdgeLayerSeamHistoryObservationReadbackContract(contract);
    assert.equal(contract.reviewStatus, "edge-layer-seam-history-observation-readback-contract-valid");
    assert.equal(contract.validation.observationArtifactConsumed, true);
    assert.equal(contract.validation.sourceRefsPreserved, true);
    assert.equal(contract.validation.sourceReposPreserved, true);
    assert.equal(contract.validation.durableRefsPreserved, true);
    assert.equal(contract.validation.writerRefsPreserved, true);
    assert.equal(contract.validation.linkageStatusPreserved, true);
    assert.equal(contract.validation.boundaryAndNonClaimsPreserved, true);
    assert.equal(contract.validation.proofLabelsPreserved, true);
    assert.equal(contract.readback.artifactReadable, true);
    assert.equal(contract.readback.observationResultValid, true);
    assert.equal(contract.readback.sourceIdsAndHashesPreserved, true);
    assert.equal(contract.readback.sourceReposPreserved, true);
    assert.equal(contract.readback.durableRefsPreserved, true);
    assert.equal(contract.readback.writerRefsPreserved, true);
    assert.equal(contract.readback.linkageStatusPreserved, true);
    assert.equal(contract.readback.boundaryAndNonClaimsPreserved, true);
    assert.equal(contract.readback.pairCount, 2);
    assert.equal(contract.readback.compatiblePairCount, 1);
    assert.equal(contract.readback.unresolvedOrDamagedPairCount, 1);
    assert.equal(
      contract.readback.proofRungPreserved,
      "local_causal_observation_over_supplied_seam_history_material",
    );
    assert.equal(contract.readback.normalizedProofLabelPreserved, "local_supplied_material");
    assert.equal(contract.source.sourceObservationNormalizedProofLabel, "local_supplied_material");
    assert.deepEqual(contract.preservedSourceRefs.sourceRepos, [
      "mesh-ecology-edge",
      "mesh-ecology-layer",
    ]);
    assert.deepEqual(contract.preservedSourceRefs.requestIds, [
      "edge-layer-report-only-seam-request:causal-observation:linked",
      "edge-layer-report-only-seam-request:causal-observation:damaged",
    ]);
    assert.deepEqual(contract.preservedSourceRefs.requestHashes, [
      `sha256:${"a".repeat(64)}`,
      `sha256:${"c".repeat(64)}`,
    ]);
    assert.deepEqual(contract.preservedSourceRefs.requestDurableRefs, [
      "autobase-view-record:edge-layer-report-only-seam-view:0",
      "autobase-view-record:edge-layer-report-only-seam-view:2",
    ]);
    assert.deepEqual(contract.preservedSourceRefs.requestWriterRefs, [
      "autobase-writer:edge",
    ]);
    assert.deepEqual(contract.preservedSourceRefs.receiptIds, [
      "layer-report-only-edge-seam-receipt:causal-observation:linked",
      "layer-report-only-edge-seam-receipt:causal-observation:damaged",
    ]);
    assert.deepEqual(contract.preservedSourceRefs.receiptHashes, [
      `sha256:${"b".repeat(64)}`,
      `sha256:${"d".repeat(64)}`,
    ]);
    assert.deepEqual(contract.preservedSourceRefs.receiptDurableRefs, [
      "autobase-view-record:edge-layer-report-only-seam-view:1",
      "autobase-view-record:edge-layer-report-only-seam-view:3",
    ]);
    assert.deepEqual(contract.preservedSourceRefs.receiptWriterRefs, [
      "autobase-writer:layer",
    ]);
    assert.deepEqual(contract.preservedSourceRefs.linkageStatuses, ["linked", "damaged"]);
    assert.equal(contract.boundary.writesObservationArtifact, false);
    assert.equal(contract.boundary.acceptsCanonicalHistory, false);
    assert.equal(contract.boundary.admitsLayerEvidence, false);
    assert.equal(contract.boundary.interpretsRbc, false);
    assert.equal(contract.boundary.grantsAuthority, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("observation readback contract rejects readback artifacts with weakened source-ref preservation", () => {
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:20:30.000Z",
    sourcePath: "layer-owned-edge-seam-status:readback-source-ref-audit",
  });
  const weakened = JSON.parse(JSON.stringify(observationResult));
  weakened.validation.durableRefsPreserved = false;

  const contract = buildEdgeLayerSeamHistoryObservationReadbackContract({
    observationResult: weakened,
    emittedAt: "2026-05-31T12:20:31.000Z",
  });

  assertEdgeLayerSeamHistoryObservationReadbackContract(contract);
  assert.equal(contract.reviewStatus, "edge-layer-seam-history-observation-readback-contract-invalid");
  assert.equal(contract.readback.durableRefsPreserved, false);
  assert.equal(contract.validation.durableRefsPreserved, false);
  assert.ok(contract.validation.issues.includes("durable-refs-not-preserved"));
});

test("deferred attachment point map is inspectable but inactive", () => {
  const result = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: operationShapedSeamHistory(),
    emittedAt: "2026-05-31T12:21:00.000Z",
    sourcePath: "layer-owned-edge-seam-status:deferred-attachment-map",
  });

  assert.deepEqual(Object.keys(result.deferredAttachmentPoints), [
    ...EDGE_LAYER_SEAM_HISTORY_DEFERRED_ATTACHMENT_KEYS,
  ]);
  for (const key of EDGE_LAYER_SEAM_HISTORY_DEFERRED_ATTACHMENT_KEYS) {
    assert.deepEqual(result.deferredAttachmentPoints[key], {
      status: "deferred",
      active: false,
      interpreted: false,
      writes: false,
    });
  }
  assert.equal(result.deferredAttachmentPoints.referentPromotion.active, false);
  assert.equal(result.deferredAttachmentPoints.branchCompatibilityGraph.interpreted, false);
  assert.equal(result.deferredAttachmentPoints.canonicalContinuityState.writes, false);
  assert.equal(result.deferredAttachmentPoints.rbcInterpretation.interpreted, false);
  assert.equal(result.deferredAttachmentPoints.layerAdmission.active, false);
  assert.equal(result.deferredAttachmentPoints.meshPublication.writes, false);
  assert.equal(result.deferredAttachmentPoints.authorityDecisions.active, false);
  assert.equal(result.deferredAttachmentPoints.productionCausalHistory.writes, false);
});
