import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assertGenericCausalEndpointDescriptor,
  assertGenericCausalSeamObservation,
  buildGenericCausalEndpointDescriptor,
  buildGenericCausalSeamObservation,
  type GenericCausalSeamHistoryEnvelope,
} from "../src/index.js";

function compatibleGenericEnvelope(): GenericCausalSeamHistoryEnvelope {
  return {
    historyId: "generic-seam-history:neutral-compatible",
    historyHash: `sha256:${"1".repeat(64)}`,
    sourceRepos: ["neutral-source-repo", "neutral-receipt-repo"],
    sourceSchemaRefs: ["neutral/request/v1", "neutral/receipt/v1"],
    transportProof: {
      evidenceSource: "local_artifact_fixture",
      publicSwarmTransportHappened: false,
      testnetSwarmTransportHappened: false,
      controlPlaneOnly: true,
      durableFeedBackedHistoryObserved: false,
      receivingRepoObservedReplicatedPath: false,
      receiptOrResultCausallyReferencesSources: true,
    },
    durableRefs: [
      "neutral-durable-feed:request:0",
      "neutral-durable-feed:receipt:1",
      "neutral-durable-feed:evidence:2",
    ],
    writerRefs: ["neutral-writer:request", "neutral-writer:receipt"],
    requests: [
      {
        id: "neutral-request:compatible",
        hash: `sha256:${"a".repeat(64)}`,
        sourceRepo: "neutral-source-repo",
        durableRef: "neutral-durable-feed:request:0",
        writerRef: "neutral-writer:request",
        schemaRef: "neutral/request/v1",
        causalParentRefs: ["neutral-parent:0"],
        linkageStatus: "linked",
        observedProofRung: "local_artifact_seam",
      },
    ],
    receipts: [
      {
        id: "neutral-receipt:compatible",
        hash: `sha256:${"b".repeat(64)}`,
        sourceRepo: "neutral-receipt-repo",
        durableRef: "neutral-durable-feed:receipt:1",
        writerRef: "neutral-writer:receipt",
        schemaRef: "neutral/receipt/v1",
        sourceRequestId: "neutral-request:compatible",
        sourceRequestHash: `sha256:${"a".repeat(64)}`,
        linkageStatus: "linked",
        observedProofRung: "local_artifact_seam",
      },
    ],
    evidenceRefs: [
      {
        id: "neutral-evidence:compatible",
        hash: `sha256:${"c".repeat(64)}`,
        sourceRepo: "neutral-evidence-repo",
        durableRef: "neutral-durable-feed:evidence:2",
        writerRef: "neutral-writer:evidence",
        schemaRef: "neutral/evidence/v1",
        observedProofRung: "local_artifact_seam",
      },
    ],
    linkage: [
      {
        requestId: "neutral-request:compatible",
        requestHash: `sha256:${"a".repeat(64)}`,
        receiptId: "neutral-receipt:compatible",
        receiptHash: `sha256:${"b".repeat(64)}`,
      },
    ],
    proofLabels: ["local_neutral_generic_seam_history_material"],
    warnings: [],
  };
}

test("generic Causal seam descriptor is declaration-only and consumer-readable", () => {
  const descriptor = buildGenericCausalEndpointDescriptor({
    endpointId: "causal-generic-seam:endpoint:test",
    declaredPublicSwarmCapable: true,
    durableFeedRefs: ["corestore:generic-causal-seam:descriptor"],
    writerRefs: ["writer:causal-generic-seam"],
  });

  assertGenericCausalEndpointDescriptor(descriptor);
  assert.equal(descriptor.repoName, "causal-substrate");
  assert.equal(descriptor.transportPosture.declaredPublicSwarmCapable, true);
  assert.equal(descriptor.transportPosture.publicSwarmTransportProvenByDescriptor, false);
  assert.ok(descriptor.acceptedInputKinds.includes("generic-seam-history-envelope"));
  assert.ok(descriptor.emittedOutputKinds.includes("generic-causal-seam-observation"));
  assert.equal(descriptor.nonClaims.authorityGranted, false);
});

test("generic Causal seam observation classifies neutral linked material for test consumers", () => {
  const observation = buildGenericCausalSeamObservation({
    seamHistory: compatibleGenericEnvelope(),
    proofCommand: "tsx --test test/generic-causal-seam-surface.test.ts",
    generatedAt: "2026-06-03T12:00:00.000Z",
  });

  assertGenericCausalSeamObservation(observation);
  assert.equal(observation.repo, "causal-substrate");
  assert.equal(observation.lane, "generic-causal-seam-surface");
  assert.equal(observation.finalClassification, "compatible");
  assert.equal(observation.strongestProofRung, "local_artifact_seam");
  assert.equal(observation.sourceProofRung, "local_artifact_seam");
  assert.equal(observation.operationProofRung, "local_artifact_seam");
  assert.equal(observation.publicSwarmTransportHappened, false);
  assert.equal(observation.testnetSwarmTransportHappened, false);
  assert.equal(observation.controlPlaneOnly, true);
  assert.equal(observation.transportBooleans.receiptOrResultCausallyReferencesSources, true);
  assert.equal(observation.classifiedHappenings[0]?.classification, "linked_request_receipt");
  assert.deepEqual(observation.damageFindings, []);
  assert.deepEqual(observation.unresolvedFindings, []);
  assert.deepEqual(observation.overclaimFindings, []);
  assert.deepEqual(observation.sourceRefsPreserved.requestIds, ["neutral-request:compatible"]);
  assert.deepEqual(observation.sourceRefsPreserved.receiptIds, ["neutral-receipt:compatible"]);
  assert.ok(observation.sourceRefsPreserved.durableRefs.includes("neutral-durable-feed:request:0"));
  assert.ok(observation.sourceRefsPreserved.writerRefs.includes("neutral-writer:receipt"));
  assert.equal(observation.consumerProjection.genericConsumersMayRead, true);
  assert.equal(observation.consumerProjection.writesConsumerState, false);
  assert.equal(observation.nonClaims.canonicalHistoryClaimed, false);
  assert.equal(observation.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(observation.nonClaims.rbcInterpreted, false);
  assert.equal(observation.nonClaims.meshPublished, false);
  assert.equal(observation.nonClaims.productionContinuityWritten, false);
  assert.equal(observation.deferredAttachmentPoints.rbcInterpretation, null);
  assert.equal(observation.nextPressure, "run-neutral-generic-seam-history-over-public-swarm");
});

test("generic Causal seam observation rejects declared public proof without reader evidence", () => {
  const envelope = compatibleGenericEnvelope();
  envelope.transportProof = {
    evidenceSource: "descriptor_declared_only",
    publicSwarmTransportHappened: true,
    testnetSwarmTransportHappened: false,
    controlPlaneOnly: false,
    durableFeedBackedHistoryObserved: true,
    receivingRepoObservedReplicatedPath: true,
    receiptOrResultCausallyReferencesSources: true,
  };
  envelope.proofLabels = ["public_swarm_seam_declared_by_descriptor"];

  const observation = buildGenericCausalSeamObservation({
    seamHistory: envelope,
    proofCommand: "tsx --test test/generic-causal-seam-surface.test.ts",
    generatedAt: "2026-06-03T12:01:00.000Z",
  });

  assertGenericCausalSeamObservation(observation);
  assert.equal(observation.publicSwarmTransportHappened, false);
  assert.equal(observation.sourceProofRung, "local_artifact_seam");
  assert.equal(observation.finalClassification, "overclaimed");
  assert.equal(observation.overclaimFindings.length, 1);
  assert.match(observation.overclaimFindings[0]!, /not backed by public swarm transport evidence/);
});

test("generic Causal seam observation durable write and reopened readback preserve the contract", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "generic-causal-seam-"));
  try {
    const envelope = compatibleGenericEnvelope();
    envelope.transportProof = {
      evidenceSource: "reader_observed_replicated_public_swarm_path",
      publicSwarmTransportHappened: true,
      testnetSwarmTransportHappened: false,
      controlPlaneOnly: false,
      durableFeedBackedHistoryObserved: true,
      receivingRepoObservedReplicatedPath: true,
      receiptOrResultCausallyReferencesSources: true,
      reopenedReadbackDerivedFromDurableHistory: true,
    };
    envelope.proofLabels = ["neutral_public_swarm_generic_seam_history_material"];

    const observation = buildGenericCausalSeamObservation({
      seamHistory: envelope,
      proofCommand: "tsx --test test/generic-causal-seam-surface.test.ts",
      generatedAt: "2026-06-03T12:02:00.000Z",
      durableObservationResultEmitted: true,
      reopenedReadbackDerivedFromDurableHistory: true,
    });
    const outputPath = path.join(dir, "generic-causal-seam-observation.json");
    await writeFile(outputPath, `${JSON.stringify(observation, null, 2)}\n`);

    const readback: unknown = JSON.parse(await readFile(outputPath, "utf8"));
    assertGenericCausalSeamObservation(readback);
    assert.equal(readback.observationHash, observation.observationHash);
    assert.equal(readback.publicSwarmTransportHappened, true);
    assert.equal(readback.strongestProofRung, "durable_replicated_public_swarm_seam");
    assert.equal(readback.transportBooleans.durableObservationResultEmitted, true);
    assert.equal(readback.transportBooleans.reopenedReadbackDerivedFromDurableHistory, true);
    assert.equal(readback.nextPressure, "hand-generic-observation-to-test-consumer");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
