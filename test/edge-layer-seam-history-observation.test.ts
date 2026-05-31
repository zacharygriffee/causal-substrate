import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryObservationResult,
  assertEdgeLayerSeamHistoryEdgeProjectionFixture,
  assertEdgeLayerSeamHistoryObservationReadbackContract,
  buildEdgeLayerSeamHistoryObservationResult,
  buildEdgeLayerSeamHistoryEdgeProjectionFixture,
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
  assert.equal(result.validation.sourceIdsAndHashesPreserved, true);
  assert.deepEqual(result.source.sourceRepos, ["mesh-ecology-edge", "mesh-ecology-layer"]);

  const linked = result.observations[0]!;
  assert.equal(linked.classification, "compatible_seam_happening");
  assert.equal(linked.linkageStatus, "linked");
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
    layerEvidenceAdmitted: false,
    layerPolicyInterpreted: false,
    rbcEnforced: false,
    admissionDecided: false,
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
    linkedPairDetected: true,
    damagedOrUnlinkedPairDetected: true,
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
  assert.equal(result.validation.sourceReposPreserved, true);
  assert.equal(result.validation.durableRefsPreserved, false);
  assert.equal(result.validation.writerRefsPreserved, false);
  assert.equal(result.validation.linkageStatusPreserved, true);
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

  const compatibleRef = fixture.edgeProjectionMaterial.compatibleRefs[0]!;
  assert.equal(compatibleRef.sourceObservationArtifactId, observationResult.artifactId);
  assert.equal(compatibleRef.observationId, observationResult.observations[0]!.observationId);
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
  assert.equal(unresolvedRef.request.hash, `sha256:${"c".repeat(64)}`);
  assert.equal(unresolvedRef.receipt.hash, `sha256:${"d".repeat(64)}`);
  assert.equal(fixture.boundary.edgeProjectionWritten, false);
  assert.equal(fixture.boundary.opensEdgeRuntime, false);
  assert.equal(fixture.boundary.promotesReferents, false);
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
