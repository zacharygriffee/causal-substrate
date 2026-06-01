import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback,
  buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
  buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback,
  buildEdgeLayerSeamHistoryObservationResult,
  type EdgeLayerSeamHistoryEdgeProjectionHandoffBundle,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

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

test("Edge consumer contract rejects incomplete handoff bundle before projection consumption", () => {
  const incompleteMaterial = seamHistoryMaterial();
  delete (incompleteMaterial.pairs[0]!.receipt as Record<string, unknown>).receiptHash;
  delete (incompleteMaterial.pairs[1]!.request as Record<string, unknown>).requestHash;
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: incompleteMaterial,
    emittedAt: "2026-05-31T14:21:00.000Z",
    sourcePath: "layer-owned-edge-seam-status:edge-consumer-contract-incomplete",
    inputReadByCausalSubstrate: true,
  });
  const bundle = buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle({
    observationResult,
    emittedAt: "2026-05-31T14:21:01.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundle(bundle);
  assert.equal(bundle.reviewStatus, "edge-layer-seam-history-edge-projection-handoff-bundle-incomplete");
  assert.equal(bundle.validation.observationResultConsumed, true);
  assert.equal(bundle.validation.handoffFixtureIncluded, true);
  assert.equal(bundle.validation.consumerFixtureIncluded, true);
  assert.equal(bundle.validation.completionGateIncluded, true);
  assert.equal(bundle.validation.completionGateComplete, false);
  assert.ok(bundle.validation.issues.includes("handoff-fixture-not-ready"));
  assert.ok(bundle.validation.issues.includes("consumer-fixture-not-ready"));
  assert.ok(bundle.validation.issues.includes("completion-gate-not-complete"));
  assert.throws(
    () => consumeEdgeHandoffBundle(bundle),
    /edge_consumer_contract_requires_ready_handoff_bundle/,
  );
  assert.equal(bundle.sourceReferences.requestIds.includes(
    "edge-layer-report-only-seam-request:edge-consumer-contract:linked",
  ), true);
  assert.equal(bundle.sourceReferences.receiptIds.includes(
    "layer-report-only-edge-seam-receipt:edge-consumer-contract:linked",
  ), true);
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
});

test("handoff bundle readback command preserves source refs from disk without projection writes", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-handoff-bundle-readback-"));
  const inputPath = path.join(tempRoot, "handoff-bundle.json");
  const outputPath = path.join(tempRoot, "handoff-bundle-readback.json");
  try {
    const observationResult = buildEdgeLayerSeamHistoryObservationResult({
      seamHistory: seamHistoryMaterial(),
      emittedAt: "2026-05-31T14:22:00.000Z",
      sourcePath: "layer-owned-edge-seam-status:edge-consumer-contract-readback",
      inputReadByCausalSubstrate: true,
    });
    const bundle = buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle({
      observationResult,
      emittedAt: "2026-05-31T14:22:01.000Z",
    });
    await writeFile(inputPath, JSON.stringify(bundle, null, 2), "utf8");

    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/readback-edge-layer-seam-history-handoff-bundle.ts",
      "--input-bundle",
      inputPath,
      "--readback-output",
      outputPath,
      "--emitted-at",
      "2026-05-31T14:22:02.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const readback = JSON.parse(await readFile(outputPath, "utf8"));

    assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback(readback);
    assert.equal(readback.reviewStatus, "edge-layer-seam-history-edge-projection-handoff-bundle-readback-valid");
    assert.equal(readback.source.sourceBundleArtifactId, bundle.artifactId);
    assert.equal(readback.source.sourceBundleStatus, "edge-layer-seam-history-edge-projection-handoff-bundle-ready");
    assert.equal(readback.source.sourceObservationArtifactId, observationResult.artifactId);
    assert.equal(
      readback.source.sourceObservationProofRung,
      "local_causal_observation_over_supplied_seam_history_material",
    );
    assert.equal(readback.source.sourceObservationNormalizedProofLabel, "local_supplied_material");
    assert.equal(readback.readback.bundleReadable, true);
    assert.equal(readback.readback.bundledArtifactsReadable, true);
    assert.equal(readback.readback.sourceRefsPreserved, true);
    assert.equal(readback.readback.proofLabelsPreserved, true);
    assert.equal(readback.readback.nonClaimsPreserved, true);
    assert.deepEqual(readback.preservedSourceRefs.requestIds, [
      "edge-layer-report-only-seam-request:edge-consumer-contract:linked",
      "edge-layer-report-only-seam-request:edge-consumer-contract:unlinked",
    ]);
    assert.deepEqual(readback.preservedSourceRefs.requestHashes, [
      `sha256:${"a".repeat(64)}`,
      `sha256:${"c".repeat(64)}`,
    ]);
    assert.deepEqual(readback.preservedSourceRefs.receiptIds, [
      "layer-report-only-edge-seam-receipt:edge-consumer-contract:linked",
      "layer-report-only-edge-seam-receipt:edge-consumer-contract:unlinked",
    ]);
    assert.deepEqual(readback.preservedSourceRefs.receiptHashes, [
      `sha256:${"b".repeat(64)}`,
      `sha256:${"d".repeat(64)}`,
    ]);
    assert.equal(readback.preservedArtifactRefs.observationResultArtifactId, observationResult.artifactId);
    assert.equal(readback.preservedArtifactRefs.handoffFixtureArtifactId, bundle.artifacts.handoffFixture.artifactId);
    assert.equal(readback.preservedArtifactRefs.consumerFixtureArtifactId, bundle.artifacts.consumerFixture.artifactId);
    assert.equal(readback.preservedArtifactRefs.completionGateComplete, true);
    assert.equal(readback.validation.handoffBundleConsumed, true);
    assert.equal(readback.validation.bundledArtifactsIncluded, true);
    assert.equal(readback.validation.noCanonicalHistoryClaim, true);
    assert.equal(readback.validation.noLayerAdmissionClaim, true);
    assert.equal(readback.validation.noRbcInterpretationClaim, true);
    assert.equal(readback.validation.noAuthorityClaim, true);
    assert.equal(readback.validation.noReferentPromotion, true);
    assert.equal(readback.boundary.readbackOnly, true);
    assert.equal(readback.boundary.writesEdgeProjection, false);
    assert.equal(readback.boundary.acceptsCanonicalHistory, false);
    assert.equal(readback.boundary.admitsLayerEvidence, false);
    assert.equal(readback.boundary.interpretsRbc, false);
    assert.equal(readback.boundary.grantsAuthority, false);
    assert.equal(readback.boundary.promotesReferents, false);
    assert.equal(readback.boundary.publishesToMesh, false);
    assert.equal(readback.boundary.writesProductionContinuity, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("handoff bundle readback command writes invalid readbacks for malformed and non-object input", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-handoff-bundle-readback-invalid-cli-"));
  try {
    const cases = [
      { name: "malformed", contents: "{not-json" },
      { name: "non-object", contents: "[]" },
    ];

    for (const inputCase of cases) {
      const inputPath = path.join(tempRoot, `${inputCase.name}.json`);
      const outputPath = path.join(tempRoot, `${inputCase.name}-readback.json`);
      await writeFile(inputPath, inputCase.contents, "utf8");

      const { stdout, stderr } = await execFileAsync("npx", [
        "tsx",
        "scripts/readback-edge-layer-seam-history-handoff-bundle.ts",
        "--input-bundle",
        inputPath,
        "--readback-output",
        outputPath,
        "--emitted-at",
        "2026-06-01T10:00:00.000Z",
      ], {
        cwd: path.resolve("."),
      });

      assert.equal(stdout, "");
      assert.equal(stderr, "");
      const readback = JSON.parse(await readFile(outputPath, "utf8"));
      assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback(readback);
      assert.equal(
        readback.reviewStatus,
        "edge-layer-seam-history-edge-projection-handoff-bundle-readback-invalid",
      );
      assert.equal(readback.validation.handoffBundleConsumed, false);
      assert.equal(readback.readback.bundleReadable, false);
      assert.equal(readback.readback.bundleValid, false);
      assert.deepEqual(readback.validation.issues, ["handoff-bundle-invalid"]);
      assert.deepEqual(readback.rejections, ["handoff-bundle-invalid"]);
      assert.equal(readback.boundary.readbackOnly, true);
      assert.equal(readback.boundary.writesEdgeProjection, false);
      assert.equal(readback.boundary.acceptsCanonicalHistory, false);
      assert.equal(readback.boundary.admitsLayerEvidence, false);
      assert.equal(readback.boundary.interpretsRbc, false);
      assert.equal(readback.boundary.grantsAuthority, false);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("handoff bundle readback rejects weakened source refs and proof labels", () => {
  const observationResult = buildEdgeLayerSeamHistoryObservationResult({
    seamHistory: seamHistoryMaterial(),
    emittedAt: "2026-05-31T14:23:00.000Z",
    sourcePath: "layer-owned-edge-seam-status:edge-consumer-contract-readback-invalid",
    inputReadByCausalSubstrate: true,
  });
  const bundle = buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundle({
    observationResult,
    emittedAt: "2026-05-31T14:23:01.000Z",
  });
  const weakened = structuredClone(bundle);
  weakened.sourceReferences.requestHashes = [];
  (weakened.source as Record<string, unknown>).sourceObservationNormalizedProofLabel = "local_json_fixture_only";

  const readback = buildEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback({
    bundle: weakened,
    emittedAt: "2026-05-31T14:23:02.000Z",
  });

  assertEdgeLayerSeamHistoryEdgeProjectionHandoffBundleReadback(readback);
  assert.equal(readback.reviewStatus, "edge-layer-seam-history-edge-projection-handoff-bundle-readback-invalid");
  assert.equal(readback.validation.handoffBundleConsumed, true);
  assert.equal(readback.validation.sourceRefsPreserved, false);
  assert.equal(readback.validation.proofLabelsPreserved, false);
  assert.ok(readback.validation.issues.includes("handoff-bundle-source-refs-not-preserved"));
  assert.ok(readback.validation.issues.includes("handoff-bundle-proof-labels-not-preserved"));
  assert.equal(readback.validation.noCanonicalHistoryClaim, true);
  assert.equal(readback.validation.noLayerAdmissionClaim, true);
  assert.equal(readback.validation.noRbcInterpretationClaim, true);
  assert.equal(readback.validation.noAuthorityClaim, true);
  assert.equal(readback.validation.noReferentPromotion, true);
  assert.equal(readback.boundary.writesEdgeProjection, false);
  assert.equal(readback.boundary.acceptsCanonicalHistory, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
});
