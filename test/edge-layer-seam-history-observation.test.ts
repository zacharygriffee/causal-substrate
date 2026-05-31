import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryObservationResult,
  buildEdgeLayerSeamHistoryObservationResult,
  buildEdgeLayerSeamHistoryObservationResultFromJson,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_ARTIFACT_KIND,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA,
  CAUSAL_EDGE_LAYER_SEAM_HISTORY_OBSERVATION_SCHEMA_VERSION,
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
  assert.ok(linked.sourceRefs.includes(linked.receipt.id));
  assert.ok(linked.sourceRefs.includes(linked.receipt.hash));

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
  assert.ok(damaged.sourceRefs.includes(damaged.receipt.id));
  assert.ok(damaged.sourceRefs.includes(damaged.receipt.hash));

  assert.equal(result.boundary.acceptsCanonicalHistory, false);
  assert.equal(result.boundary.admitsLayerEvidence, false);
  assert.equal(result.boundary.interpretsRbc, false);
  assert.equal(result.boundary.grantsAuthority, false);
  assert.equal(result.boundary.writesContinuityRecords, false);
  assert.equal(result.validation.noCanonicalHistoryClaim, true);
  assert.equal(result.validation.noLayerAdmissionClaim, true);
  assert.equal(result.validation.noRbcInterpretationClaim, true);
  assert.equal(result.validation.noAuthorityClaim, true);
  assert.equal(result.validation.decentralizedSeamProofClaimed, false);
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
  });
  assert.deepEqual(result.compatibilityEnvelope.consumerBoundary, {
    edgeMayProjectLater: true,
    consumeAsObservationOnly: true,
    compatibleDoesNotMeanCanonical: true,
    compatibleDoesNotAdmitLayerEvidence: true,
    compatibleDoesNotInterpretRbc: true,
    compatibleDoesNotGrantAuthority: true,
    projectionDoesNotPromoteReferents: true,
    writesProjectionArtifact: false,
  });
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
  assert.equal(result.boundary.opensLayerRuntime, false);
  assert.equal(result.boundary.acceptsCanonicalHistory, false);
  assert.equal(result.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
  assert.equal(result.proof.decentralizedSeamProofClaimed, false);
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
  assert.equal(result.validation.decentralizedSeamProofClaimed, false);
});

test("seam-history observation command reads supplied material, writes result, and readbacks lower proof rung", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-seam-history-observation-"));
  const inputPath = path.join(tempRoot, "seam-history.json");
  const outputPath = path.join(tempRoot, "observation-result.json");
  try {
    await writeFile(inputPath, JSON.stringify(operationShapedSeamHistory(), null, 2), "utf8");

    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/observe-edge-layer-seam-history.ts",
      "--input",
      inputPath,
      "--output",
      outputPath,
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
    assert.equal(result.proof.inputReadByCausalSubstrate, true);
    assert.equal(result.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
    assert.equal(result.proof.decentralizedSeamProofClaimed, false);
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
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
