import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertAdjacentPublicMaterialObservation,
  buildAdjacentPublicMaterialObservation,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

const requestRef = {
  eventId: "edge-layer-report-only-seam-request:fresh-layer-33321fbe",
  eventHash: `sha256:${"1".repeat(64)}`,
  writerRef: "edge-writer:fresh-layer-request",
  sourceRepo: "mesh-ecology-edge",
  targetRepo: "mesh-ecology-layer",
};

const receiptRef = {
  eventId: "layer-owned-edge-seam-receipt:fresh-layer-33321fbe",
  eventHash: `sha256:${"2".repeat(64)}`,
  writerRef: "layer-writer:fresh-layer-receipt",
  sourceRequestId: requestRef.eventId,
  sourceRequestHash: requestRef.eventHash,
};

const evidenceRef = {
  evidenceId: "layer-public-hyperdht-evidence:fresh-layer-33321fbe",
  evidenceHash: `sha256:${"3".repeat(64)}`,
  observedRequestHash: requestRef.eventHash,
  emittedReceiptHash: receiptRef.eventHash,
};

test("observes fresh Layer public/readiness material as compatible without upgrading proof", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: buildLayerPublicMaterial(),
    emittedAt: "2026-06-03T18:00:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "compatible");
  assert.equal(observation.sourceClassifications.layer, "compatible");
  assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
  assert.equal(observation.proof.strongestSourceProofRungObserved, "default_public_hyperdht_hyperswarm_feed_backed");
  assert.equal(observation.proof.layerPublicProofObserved, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.equal(observation.proof.proofRungUpgradeClaimed, false);
  assert.deepEqual(observation.validation.issues, []);
  assert.deepEqual(observation.preservedRefs.requestIds, [requestRef.eventId]);
  assert.deepEqual(observation.preservedRefs.requestHashes, [requestRef.eventHash]);
  assert.deepEqual(observation.preservedRefs.receiptIds, [receiptRef.eventId]);
  assert.deepEqual(observation.preservedRefs.receiptHashes, [receiptRef.eventHash]);
  assert.deepEqual(observation.preservedRefs.evidenceIds, [evidenceRef.evidenceId]);
  assert.deepEqual(observation.preservedRefs.evidenceHashes, [evidenceRef.evidenceHash]);
  assert.ok(observation.preservedRefs.durableRefs.includes("autobase:layer-public-default-hyperdht"));
  assert.ok(observation.preservedRefs.writerRefs.includes("layer-writer:fresh-layer-receipt"));
  assert.ok(observation.preservedRefs.sourceRepos.includes("mesh-ecology-layer"));
  assert.ok(observation.preservedRefs.linkageStatuses.includes("request_receipt_evidence_linked"));
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.interpretsRbc, false);
  assert.equal(observation.boundary.grantsAuthority, false);
  assert.equal(observation.boundary.publishesToMesh, false);
  assert.equal(observation.boundary.writesProductionContinuity, false);
});

test("classifies damaged Layer linkage honestly while preserving refs and non-claims", () => {
  const material = buildLayerPublicMaterial();
  const readiness = (material.objectiveProof as any).causalReadiness;
  readiness.receiptRef.sourceRequestHash = `sha256:${"9".repeat(64)}`;

  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: material,
    emittedAt: "2026-06-03T18:01:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "damaged");
  assert.equal(observation.sourceClassifications.layer, "damaged");
  assert.ok(observation.validation.issues.includes("layer-request-receipt-evidence-linkage-mismatch"));
  assert.deepEqual(observation.preservedRefs.requestIds, [requestRef.eventId]);
  assert.deepEqual(observation.preservedRefs.receiptIds, [receiptRef.eventId]);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
});

test("classifies unresolved Layer readiness without treating timeout or missing acceptance as success", () => {
  const material = buildLayerPublicMaterial();
  const objectiveProof = material.objectiveProof as any;
  objectiveProof.causalReadiness.readinessStatus = "not_ready_for_causal_substrate_read_only_observation";
  objectiveProof.causalReadinessConsumer.consumerStatus = "rejected_for_causal_read_only_consumer_projection";
  material.operationProof.causalReadinessConsumerAccepted = false;

  const observation = buildAdjacentPublicMaterialObservation({
    layerPublicMaterial: material,
    emittedAt: "2026-06-03T18:02:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "unresolved");
  assert.equal(observation.sourceClassifications.layer, "unresolved");
  assert.ok(observation.validation.issues.includes("layer-causal-readiness-not-accepted"));
  assert.equal(observation.proof.layerPublicProofObserved, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
});

test("observes Edge compatible handoff readback as lower-rung exported material", () => {
  const observation = buildAdjacentPublicMaterialObservation({
    edgeHandoffReadback: { handoffReadback: buildEdgeHandoffReadback() },
    emittedAt: "2026-06-03T18:03:00.000Z",
  });

  assertAdjacentPublicMaterialObservation(observation);
  assert.equal(observation.classification, "compatible");
  assert.equal(observation.sourceClassifications.edge, "compatible");
  assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
  assert.equal(observation.proof.edgeReadbackProofRungNotUpgraded, true);
  assert.equal(observation.validation.edgeReadbackOnly, true);
  assert.equal(observation.validation.edgeProofRungNotUpgraded, true);
  assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  assert.deepEqual(observation.preservedRefs.requestIds, ["edge-compatible-request:fresh-edge-727bf1f9"]);
  assert.deepEqual(observation.preservedRefs.receiptIds, ["edge-compatible-receipt:fresh-edge-727bf1f9"]);
  assert.ok(observation.preservedRefs.durableRefs.includes("edge-handoff-feed:fresh-edge-727bf1f9"));
  assert.ok(observation.preservedRefs.writerRefs.includes("edge-compatible-writer:fresh-edge-727bf1f9"));
  assert.ok(observation.preservedRefs.sourceRepos.includes("mesh-ecology-edge"));
  assert.ok(observation.preservedRefs.sourceRepos.includes("mesh-ecology-layer"));
  assert.ok(observation.preservedRefs.proofRungs.includes("consumer_handoff_seam"));
});

test("adjacent public material CLI consumes Layer and Edge shapes", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "adjacent-public-material-"));
  const layerPath = path.join(tempRoot, "layer-public-material.json");
  const edgePath = path.join(tempRoot, "edge-handoff-readback.json");
  const outputPath = path.join(tempRoot, "adjacent-observation.json");
  try {
    await writeFile(layerPath, `${JSON.stringify(buildLayerPublicMaterial(), null, 2)}\n`, "utf8");
    await writeFile(edgePath, `${JSON.stringify(buildEdgeHandoffReadback(), null, 2)}\n`, "utf8");
    const run = await execFileAsync("npx", [
      "tsx",
      "scripts/observe-adjacent-public-material.ts",
      "--layer-public-material",
      layerPath,
      "--edge-handoff-readback",
      edgePath,
      "--output",
      outputPath,
      "--emitted-at",
      "2026-06-03T18:04:00.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(run.stdout, "");
    assert.equal(run.stderr, "");
    const observation = JSON.parse(await readFile(outputPath, "utf8")) as unknown;
    assertAdjacentPublicMaterialObservation(observation);
    assert.equal(observation.classification, "compatible");
    assert.equal(observation.proof.operationProofRung, "saved_readback_seam");
    assert.equal(observation.proof.liveCausalSwarmProofClaimed, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

function buildLayerPublicMaterial(): any {
  return {
    artifactKind: "layer_edge_seam_public_hyperdht_proof_result",
    strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
    namespace: "layer-public-default-hyperdht",
    autobaseKey: "autobase:layer-public-default-hyperdht",
    operationProof: {
      causalReadinessConsumerAccepted: true,
      consumerReplayAllTriplesLinked: true,
      rbcEnforced: false,
      authorityGrantOccurred: false,
      layerAdmissionOccurred: false,
      canonicalTruthClaimed: false,
    },
    proofBoundary: {
      defaultPublicHyperDht: true,
      publicSwarmProof: true,
      explicitBootstrapNodes: false,
      localBootstrapper: false,
      strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
    },
    objectiveProof: {
      causalReadinessConsumer: {
        consumerStatus: "accepted_for_causal_read_only_consumer_projection",
        operationProof: {
          requestReceiptEvidenceRefsLinked: true,
          publicHyperDhtProofObserved: true,
          sourceRefsPreserved: true,
          writerRefsPreserved: true,
          rbcEnforced: false,
          authorityGrantOccurred: false,
        },
      },
      causalReadiness: {
        artifactKind: "layer_owned_edge_seam_causal_handoff_readiness_export",
        readinessStatus: "ready_for_causal_substrate_read_only_observation",
        strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
        requestRef: { ...requestRef },
        receiptRef: { ...receiptRef },
        evidenceRef: { ...evidenceRef },
        writerRefs: {
          requestWriterRef: requestRef.writerRef,
          receiptWriterRef: receiptRef.writerRef,
          layerWriterRef: receiptRef.writerRef,
        },
        durableHistoryRefs: {
          storageRoot: "storage:layer-public-default-hyperdht",
          autobaseKey: "autobase:layer-public-default-hyperdht",
          seamViewName: "edge-layer-report-only-seam",
          layerEvidenceCoreName: "layer-public-evidence-core",
        },
        proofBoundary: {
          defaultPublicHyperDht: true,
          publicSwarmProof: true,
          explicitBootstrapNodes: false,
          localBootstrapper: false,
          strongestProofRung: "default_public_hyperdht_hyperswarm_feed_backed",
        },
        operationProof: {
          rbcEnforced: false,
          authorityGrantOccurred: false,
          layerAdmissionOccurred: false,
          canonicalTruthClaimed: false,
        },
        readOnly: true,
        reportOnly: true,
        mutatesLayer: false,
        grantsAuthority: false,
        admitsEvidence: false,
        rbcEnforced: false,
      },
    },
  };
}

function buildEdgeHandoffReadback(): any {
  return {
    artifactKind: "edge_compatible_swarm_seam_handoff_readback",
    readbackMode: "exported_compatible_handoff_material_readback",
    proofBoundary: "handoff_export_file_readback_only",
    compatibleContractReady: true,
    compatibleContractStatus: "compatible_handoff_contract_ready_for_adjacent_observation",
    strongestProofRung: "consumer_handoff_seam",
    proofRungNotUpgraded: true,
    handoffEntries: [
      {
        sourceRepo: "mesh-ecology-edge",
        targetRepo: "mesh-ecology-layer",
        requestId: "edge-compatible-request:fresh-edge-727bf1f9",
        requestHash: `sha256:${"4".repeat(64)}`,
        receiptId: "edge-compatible-receipt:fresh-edge-727bf1f9",
        receiptHash: `sha256:${"5".repeat(64)}`,
        durableRefs: {
          handoffFeed: "edge-handoff-feed:fresh-edge-727bf1f9",
          sourceReadback: "edge-exported-readback:fresh-edge-727bf1f9",
        },
        writerRefs: {
          edgeWriterRef: "edge-compatible-writer:fresh-edge-727bf1f9",
          layerWriterRef: "layer-compatible-writer:fresh-edge-727bf1f9",
        },
        strongestProofRung: "consumer_handoff_seam",
        linkageStatus: {
          linkedPairCount: 1,
          requestReceiptLinked: true,
        },
        nonClaims: {
          doesNotRunLayer: true,
          doesNotUpgradeProofRung: true,
          doesNotAdmitLayerEvidence: true,
          doesNotClaimCausalTruth: true,
          doesNotGrantAuthority: true,
        },
      },
    ],
    nonClaimFlags: {
      doesNotRunLayer: true,
      doesNotUpgradeProofRung: true,
      doesNotAdmitLayerEvidence: true,
      doesNotClaimCausalTruth: true,
      doesNotGrantAuthority: true,
    },
  };
}
