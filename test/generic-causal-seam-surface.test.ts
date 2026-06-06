import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertGenericCausalEndpointDescriptor,
  assertGenericCausalSeamApiConsumerHandoff,
  assertGenericCausalSeamHistoryEnvelope,
  assertGenericCausalSeamObservation,
  buildGenericCausalSeamApiConsumerHandoff,
  buildGenericCausalEndpointDescriptor,
  buildGenericCausalSeamHistoryEnvelope,
  buildGenericCausalSeamObservation,
  type GenericCausalSeamHistoryEnvelope,
} from "../src/index.js";

const execFileAsync = promisify(execFile);

function compatibleGenericEnvelope(): GenericCausalSeamHistoryEnvelope {
  return buildGenericCausalSeamHistoryEnvelope({
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
  });
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

test("generic seam-history builder defaults direct API material to lower-rung control-plane posture", () => {
  const envelope = buildGenericCausalSeamHistoryEnvelope({
    historyId: "generic-seam-history:builder-default",
    historyHash: `sha256:${"2".repeat(64)}`,
  });

  assertGenericCausalSeamHistoryEnvelope(envelope);
  assert.equal(envelope.transportProof.evidenceSource, "direct_api_submission");
  assert.equal(envelope.transportProof.publicSwarmTransportHappened, false);
  assert.equal(envelope.transportProof.testnetSwarmTransportHappened, false);
  assert.equal(envelope.transportProof.controlPlaneOnly, true);
  assert.equal(envelope.transportProof.durableFeedBackedHistoryObserved, false);
  assert.equal(envelope.transportProof.receivingRepoObservedReplicatedPath, false);
  assert.equal(envelope.transportProof.receiptOrResultCausallyReferencesSources, true);
  assert.equal(envelope.transportProof.reopenedReadbackDerivedFromDurableHistory, false);
  assert.deepEqual(envelope.sourceRepos, []);
  assert.deepEqual(envelope.requests, []);
  assert.deepEqual(envelope.receipts, []);
  assert.deepEqual(envelope.evidenceRefs, []);
  assert.deepEqual(envelope.linkage, []);
});

test("generic seam-history builder creates a compatible neutral envelope for observation", () => {
  const envelope = compatibleGenericEnvelope();
  const observation = buildGenericCausalSeamObservation({
    seamHistory: envelope,
    proofCommand: "tsx --test test/generic-causal-seam-surface.test.ts",
    generatedAt: "2026-06-03T11:59:00.000Z",
  });

  assertGenericCausalSeamHistoryEnvelope(envelope);
  assertGenericCausalSeamObservation(observation);
  assert.equal(observation.finalClassification, "compatible");
  assert.equal(observation.classifiedHappenings[0]?.classification, "linked_request_receipt");
  assert.equal(observation.strongestProofRung, "local_artifact_seam");
});

test("generic seam-history validator rejects missing history identity", () => {
  assert.throws(
    () => assertGenericCausalSeamHistoryEnvelope({
      historyId: "",
      historyHash: `sha256:${"3".repeat(64)}`,
      sourceRepos: [],
      sourceSchemaRefs: [],
      transportProof: {},
      durableRefs: [],
      writerRefs: [],
      requests: [],
      receipts: [],
      evidenceRefs: [],
      linkage: [],
      proofLabels: [],
      warnings: [],
    }),
    /historyId_must_be_non_empty_string/,
  );
  assert.throws(
    () => assertGenericCausalSeamHistoryEnvelope({
      historyId: "generic-seam-history:missing-hash",
      historyHash: "",
      sourceRepos: [],
      sourceSchemaRefs: [],
      transportProof: {},
      durableRefs: [],
      writerRefs: [],
      requests: [],
      receipts: [],
      evidenceRefs: [],
      linkage: [],
      proofLabels: [],
      warnings: [],
    }),
    /historyHash_must_be_non_empty_string/,
  );
});

test("generic seam-history validator rejects malformed request receipt and evidence records", () => {
  assert.throws(
    () => buildGenericCausalSeamHistoryEnvelope({
      historyId: "generic-seam-history:bad-request",
      historyHash: `sha256:${"4".repeat(64)}`,
      requests: [
        {
          id: "",
          hash: `sha256:${"a".repeat(64)}`,
          sourceRepo: "neutral-source-repo",
        },
      ],
    }),
    /requests\.0\.id_must_be_non_empty_string/,
  );
  assert.throws(
    () => buildGenericCausalSeamHistoryEnvelope({
      historyId: "generic-seam-history:bad-receipt",
      historyHash: `sha256:${"5".repeat(64)}`,
      receipts: [
        {
          id: "neutral-receipt:bad",
          hash: "",
          sourceRepo: "neutral-receipt-repo",
        },
      ],
    }),
    /receipts\.0\.hash_must_be_non_empty_string/,
  );
  assert.throws(
    () => buildGenericCausalSeamHistoryEnvelope({
      historyId: "generic-seam-history:bad-evidence",
      historyHash: `sha256:${"6".repeat(64)}`,
      evidenceRefs: [
        {
          id: "neutral-evidence:bad",
          hash: `sha256:${"c".repeat(64)}`,
          sourceRepo: "",
        },
      ],
    }),
    /evidenceRefs\.0\.sourceRepo_must_be_non_empty_string/,
  );
});

test("generic seam-history builder does not let direct API public labels upgrade proof", () => {
  const envelope = buildGenericCausalSeamHistoryEnvelope({
    historyId: "generic-seam-history:api-public-label",
    historyHash: `sha256:${"7".repeat(64)}`,
    requests: [
      {
        id: "neutral-request:api-public-label",
        hash: `sha256:${"a".repeat(64)}`,
        sourceRepo: "neutral-source-repo",
        durableRef: "neutral-feed:request:0",
        writerRef: "neutral-writer:request",
      },
    ],
    proofLabels: ["public_swarm_seam_declared_by_direct_api"],
  });
  const observation = buildGenericCausalSeamObservation({
    seamHistory: envelope,
    proofCommand: "tsx --test test/generic-causal-seam-surface.test.ts",
    generatedAt: "2026-06-03T11:59:30.000Z",
  });

  assertGenericCausalSeamHistoryEnvelope(envelope);
  assertGenericCausalSeamObservation(observation);
  assert.equal(observation.sourceProofRung, "local_artifact_seam");
  assert.equal(observation.publicSwarmTransportHappened, false);
  assert.equal(observation.finalClassification, "overclaimed");
  assert.match(observation.overclaimFindings[0]!, /not backed by public swarm transport evidence/);
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

test("generic API consumer handoff preserves neutral observation without upgrading proof", () => {
  const observation = buildGenericCausalSeamObservation({
    seamHistory: compatibleGenericEnvelope(),
    proofCommand: "tsx --test test/generic-causal-seam-surface.test.ts",
    generatedAt: "2026-06-03T12:03:00.000Z",
  });
  const handoff = buildGenericCausalSeamApiConsumerHandoff({
    observation,
    emittedAt: "2026-06-03T12:04:00.000Z",
    sourcePath: "examples/generic-api-seam.ts",
  });

  assertGenericCausalSeamApiConsumerHandoff(handoff);
  assert.equal(handoff.observationSummary.observationId, observation.observationId);
  assert.equal(handoff.observationSummary.observationHash, observation.observationHash);
  assert.equal(handoff.observationSummary.observedHistoryId, observation.observedHistoryId);
  assert.equal(handoff.observationSummary.observedHistoryHash, observation.observedHistoryHash);
  assert.equal(handoff.observationSummary.finalClassification, "compatible");
  assert.equal(handoff.observationSummary.sourceProofRung, "local_artifact_seam");
  assert.equal(handoff.observationSummary.operationProofRung, "local_artifact_seam");
  assert.equal(handoff.observationSummary.strongestProofRung, "local_artifact_seam");
  assert.equal(handoff.proof.consumerHandoffOperationProofRung, "consumer_handoff_seam");
  assert.equal(handoff.proof.canonicalSwarmProofClaimed, false);
  assert.equal(handoff.proof.proofRungUpgradeClaimed, false);
  assert.deepEqual(handoff.preservedRefs.requestIds, observation.sourceRefsPreserved.requestIds);
  assert.deepEqual(handoff.preservedRefs.requestHashes, observation.sourceRefsPreserved.requestHashes);
  assert.deepEqual(handoff.preservedRefs.receiptIds, observation.sourceRefsPreserved.receiptIds);
  assert.deepEqual(handoff.preservedRefs.receiptHashes, observation.sourceRefsPreserved.receiptHashes);
  assert.deepEqual(handoff.preservedRefs.sourceRepos, observation.sourceRefsPreserved.sourceRepos);
  assert.deepEqual(handoff.preservedRefs.durableRefs, observation.sourceRefsPreserved.durableRefs);
  assert.deepEqual(handoff.preservedRefs.writerRefs, observation.sourceRefsPreserved.writerRefs);
  assert.deepEqual(handoff.preservedRefs.evidenceIds, observation.sourceRefsPreserved.evidenceIds);
  assert.equal(handoff.nonClaims.canonicalHistoryClaimed, false);
  assert.equal(handoff.nonClaims.rbcInterpreted, false);
  assert.equal(handoff.nonClaims.meshPublished, false);
  assert.equal(handoff.boundary.directApiHandoffOnly, true);
  assert.equal(handoff.boundary.opensHyperswarm, false);
  assert.equal(handoff.boundary.opensCorestore, false);
  assert.equal(handoff.boundary.writesConsumerState, false);
  assert.equal(handoff.boundary.satisfiesQuorum, false);
  assert.equal(handoff.boundary.proofRungUpgradeClaimed, false);
  assert.equal(handoff.consumerFit.lowerRungApiMaterial, true);
  assert.equal(handoff.consumerFit.meshEcologyCanonicalProofRequiresSwarmRead, true);
  assert.equal(handoff.validation.sourceRefsPreserved, true);
  assert.equal(handoff.validation.proofRungsPreserved, true);
  assert.equal(handoff.validation.noCanonicalSwarmProofClaim, true);
});

test("generic API consumer handoff stays lower-rung even when descriptor declares public swarm capability", () => {
  const descriptor = buildGenericCausalEndpointDescriptor({
    endpointId: "causal-generic-seam:endpoint:declared-public",
    declaredPublicSwarmCapable: true,
    proofRung: "public_swarm_seam",
  });
  const observation = buildGenericCausalSeamObservation({
    seamHistory: compatibleGenericEnvelope(),
    proofCommand: "tsx --test test/generic-causal-seam-surface.test.ts",
    generatedAt: "2026-06-03T12:05:00.000Z",
  });
  const handoff = buildGenericCausalSeamApiConsumerHandoff({
    observation,
    emittedAt: "2026-06-03T12:06:00.000Z",
  });

  assertGenericCausalEndpointDescriptor(descriptor);
  assertGenericCausalSeamApiConsumerHandoff(handoff);
  assert.equal(descriptor.transportPosture.declaredPublicSwarmCapable, true);
  assert.equal(descriptor.transportPosture.publicSwarmTransportProvenByDescriptor, false);
  assert.equal(handoff.observationSummary.strongestProofRung, "local_artifact_seam");
  assert.equal(handoff.proof.strongestProofRung, "local_artifact_seam");
  assert.equal(handoff.proof.consumerHandoffOperationProofRung, "consumer_handoff_seam");
  assert.equal(handoff.proof.canonicalSwarmProofClaimed, false);
  assert.equal(handoff.boundary.opensHyperswarm, false);
  assert.equal(handoff.consumerFit.lowerRungApiMaterial, true);
  assert.equal(handoff.consumerFit.meshEcologyCanonicalProofRequiresSwarmRead, true);
});

test("generic API seam example emits descriptor observation and handoff JSON", async () => {
  const { stdout } = await execFileAsync("npx", ["tsx", "examples/generic-api-seam.ts"]);
  const output: unknown = JSON.parse(stdout);
  const record = output as {
    descriptor?: unknown;
    observation?: unknown;
    handoff?: unknown;
  };

  assertGenericCausalEndpointDescriptor(record.descriptor);
  assertGenericCausalSeamObservation(record.observation);
  assertGenericCausalSeamApiConsumerHandoff(record.handoff);
  assert.equal(record.observation.finalClassification, "compatible");
  assert.equal(record.observation.strongestProofRung, "local_artifact_seam");
  assert.equal(record.handoff.proof.consumerHandoffOperationProofRung, "consumer_handoff_seam");
  assert.equal(record.handoff.proof.canonicalSwarmProofClaimed, false);
  assert.equal(record.handoff.boundary.opensHyperswarm, false);
  assert.equal(record.handoff.consumerFit.lowerRungApiMaterial, true);
});
