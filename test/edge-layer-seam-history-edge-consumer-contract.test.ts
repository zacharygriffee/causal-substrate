import assert from "node:assert/strict";
import test from "node:test";

import {
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
  buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
  buildEdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
} from "../src/index.js";

function seamHistoryMaterial() {
  return {
    artifactKind: "edge_layer_seam_history_material",
    schemaVersion: "edge-layer-seam-history-material.v0",
    historyId: "layer-owned-edge-seam-status:edge-consumer-contract",
    historyHash: `sha256:${"9".repeat(64)}`,
    sourceRepos: ["mesh-ecology-edge", "mesh-ecology-layer"],
    pairs: [
      {
        request: {
          sourceRepo: "mesh-ecology-edge",
          requestId: "edge-layer-report-only-seam-request:edge-consumer-contract:linked",
          requestHash: `sha256:${"a".repeat(64)}`,
          durableRef: "corestore:edge-layer-seam-history:request:edge-consumer-contract:0",
          writerRef: "autobase-writer:edge-consumer-contract",
        },
        receipt: {
          sourceRepo: "mesh-ecology-layer",
          receiptId: "layer-report-only-edge-seam-receipt:edge-consumer-contract:linked",
          receiptHash: `sha256:${"b".repeat(64)}`,
          sourceRequestId: "edge-layer-report-only-seam-request:edge-consumer-contract:linked",
          sourceRequestHash: `sha256:${"a".repeat(64)}`,
          durableRef: "corestore:edge-layer-seam-history:receipt:edge-consumer-contract:1",
          writerRef: "autobase-writer:layer-consumer-contract",
        },
        linkage: {
          linked: true,
          source: "receipt_source_request_refs",
        },
      },
      {
        request: {
          sourceRepo: "mesh-ecology-edge",
          requestId: "edge-layer-report-only-seam-request:edge-consumer-contract:unlinked",
          requestHash: `sha256:${"c".repeat(64)}`,
          durableRef: "corestore:edge-layer-seam-history:request:edge-consumer-contract:2",
          writerRef: "autobase-writer:edge-consumer-contract",
        },
        receipt: {
          sourceRepo: "mesh-ecology-layer",
          receiptId: "layer-report-only-edge-seam-receipt:edge-consumer-contract:unlinked",
          receiptHash: `sha256:${"d".repeat(64)}`,
          sourceRequestId: "edge-layer-report-only-seam-request:edge-consumer-contract:different",
          sourceRequestHash: `sha256:${"e".repeat(64)}`,
          durableRef: "corestore:edge-layer-seam-history:receipt:edge-consumer-contract:3",
          writerRef: "autobase-writer:layer-consumer-contract",
        },
        linkage: {
          linked: false,
          source: "receipt_source_request_refs",
        },
      },
    ],
  };
}

function consumeEdgeHandoffBundle(bundle: EdgeLayerSeamHistoryEdgeProjectionHandoffBundle) {
  if (bundle.reviewStatus !== "edge-layer-seam-history-edge-projection-handoff-bundle-ready") {
    throw new Error("edge_consumer_contract_requires_ready_handoff_bundle");
  }
  if (!bundle.boundary.edgeMayConsume || bundle.boundary.writesEdgeProjection) {
    throw new Error("edge_consumer_contract_boundary_rejected");
  }
  return bundle.artifacts.consumerFixture.consumerMaterial;
}

test("Edge consumer contract reads handoff bundle as observation-only projection input", () => {
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: "2026-05-31T14:20:00.000Z",
    sourcePath: "layer-owned-edge-seam-status:edge-consumer-contract",
    inputReadByCausalSubstrate: true,
  });
  const bundle = buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle({
    observationResult,
    emittedAt: "2026-05-31T14:20:01.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle(bundle);
  const consumerMaterial = consumeEdgeHandoffBundle(bundle);

  assert.equal(bundle.reviewStatus, "edge-layer-seam-history-edge-projection-handoff-bundle-ready");
  assert.equal(bundle.validation.sourceRefsPreserved, true);
  assert.equal(bundle.validation.noCanonicalHistoryClaim, true);
  assert.equal(bundle.validation.noLayerAdmissionClaim, true);
  assert.equal(bundle.validation.noRbcInterpretationClaim, true);
  assert.equal(bundle.validation.noAuthorityClaim, true);
  assert.equal(bundle.validation.noReferentPromotion, true);
  assert.equal(bundle.boundary.bundleOnly, true);
  assert.equal(bundle.boundary.edgeMayConsume, true);
  assert.equal(bundle.boundary.writesEdgeProjection, false);
  assert.equal(bundle.boundary.acceptsCanonicalHistory, false);
  assert.equal(bundle.boundary.admitsLayerEvidence, false);
  assert.equal(bundle.boundary.interpretsRbc, false);
  assert.equal(bundle.boundary.grantsAuthority, false);
  assert.equal(bundle.boundary.promotesReferents, false);
  assert.equal(bundle.boundary.publishesToMesh, false);
  assert.equal(consumerMaterial.materialKind, "edge_projection_observation_consumer_material");
  assert.equal(consumerMaterial.consumeAs, "causal_observation_projection_input_only");
  assert.equal(consumerMaterial.compatibleRefs.length, 1);
  assert.equal(consumerMaterial.unresolvedOrDamagedRefs.length, 1);
  assert.equal(consumerMaterial.compatibleRefs[0]?.classification, "compatible_seam_happening");
  assert.equal(
    consumerMaterial.unresolvedOrDamagedRefs[0]?.classification,
    "unresolved_or_damaged_seam_happening",
  );
  assert.deepEqual(consumerMaterial.sourceReferences.requestIds, [
    "edge-layer-report-only-seam-request:edge-consumer-contract:linked",
    "edge-layer-report-only-seam-request:edge-consumer-contract:unlinked",
  ]);
  assert.deepEqual(consumerMaterial.sourceReferences.requestHashes, [
    `sha256:${"a".repeat(64)}`,
    `sha256:${"c".repeat(64)}`,
  ]);
  assert.deepEqual(consumerMaterial.sourceReferences.receiptIds, [
    "layer-report-only-edge-seam-receipt:edge-consumer-contract:linked",
    "layer-report-only-edge-seam-receipt:edge-consumer-contract:unlinked",
  ]);
  assert.deepEqual(consumerMaterial.sourceReferences.receiptHashes, [
    `sha256:${"b".repeat(64)}`,
    `sha256:${"d".repeat(64)}`,
  ]);
  assert.deepEqual(consumerMaterial.classificationSummary.linkageStatuses, ["linked", "unlinked"]);
});
