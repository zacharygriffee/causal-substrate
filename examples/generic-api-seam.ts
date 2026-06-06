import {
  assertGenericCausalEndpointDescriptor,
  assertGenericCausalSeamApiConsumerHandoff,
  assertGenericCausalSeamApiObservationReadback,
  assertGenericCausalSeamObservation,
  buildGenericCausalEndpointDescriptor,
  buildGenericCausalSeamApiConsumerHandoff,
  buildGenericCausalSeamApiObservationReadback,
  buildGenericCausalSeamHistoryEnvelope,
  buildGenericCausalSeamObservation,
} from "../src/index.js";

const seamHistory = buildGenericCausalSeamHistoryEnvelope({
  historyId: "generic-api-example-history:neutral-compatible",
  historyHash: `sha256:${"1".repeat(64)}`,
  sourceRepos: ["neutral-producer", "neutral-recorder"],
  sourceSchemaRefs: ["neutral/request/v1", "neutral/receipt/v1", "neutral/evidence/v1"],
  transportProof: {
    evidenceSource: "direct_api_submission",
    publicSwarmTransportHappened: false,
    testnetSwarmTransportHappened: false,
    controlPlaneOnly: true,
    durableFeedBackedHistoryObserved: false,
    receivingRepoObservedReplicatedPath: false,
    receiptOrResultCausallyReferencesSources: true,
  },
  durableRefs: [
    "neutral-feed:request:0",
    "neutral-feed:receipt:1",
    "neutral-feed:evidence:2",
  ],
  writerRefs: ["neutral-writer:request", "neutral-writer:receipt", "neutral-writer:evidence"],
  requests: [
    {
      id: "neutral-request:example",
      hash: `sha256:${"a".repeat(64)}`,
      sourceRepo: "neutral-producer",
      durableRef: "neutral-feed:request:0",
      writerRef: "neutral-writer:request",
      schemaRef: "neutral/request/v1",
      causalParentRefs: ["neutral-history-root:0"],
      linkageStatus: "linked",
      observedProofRung: "local_artifact_seam",
    },
  ],
  receipts: [
    {
      id: "neutral-receipt:example",
      hash: `sha256:${"b".repeat(64)}`,
      sourceRepo: "neutral-recorder",
      durableRef: "neutral-feed:receipt:1",
      writerRef: "neutral-writer:receipt",
      schemaRef: "neutral/receipt/v1",
      sourceRequestId: "neutral-request:example",
      sourceRequestHash: `sha256:${"a".repeat(64)}`,
      linkageStatus: "linked",
      observedProofRung: "local_artifact_seam",
    },
  ],
  evidenceRefs: [
    {
      id: "neutral-evidence:example",
      hash: `sha256:${"c".repeat(64)}`,
      sourceRepo: "neutral-recorder",
      durableRef: "neutral-feed:evidence:2",
      writerRef: "neutral-writer:evidence",
      schemaRef: "neutral/evidence/v1",
      observedProofRung: "local_artifact_seam",
    },
  ],
  linkage: [
    {
      requestId: "neutral-request:example",
      requestHash: `sha256:${"a".repeat(64)}`,
      receiptId: "neutral-receipt:example",
      receiptHash: `sha256:${"b".repeat(64)}`,
    },
  ],
  proofLabels: ["direct_api_neutral_generic_seam_history_material"],
  warnings: [],
});

const descriptor = buildGenericCausalEndpointDescriptor({
  endpointId: "generic-api-seam:neutral-example",
  declaredPublicSwarmCapable: true,
  durableFeedRefs: [],
  writerRefs: [],
  readbackCommand: "npm run example:generic-api-seam",
});

const observation = buildGenericCausalSeamObservation({
  seamHistory,
  proofCommand: "npm run example:generic-api-seam",
  generatedAt: "2026-06-03T12:07:00.000Z",
});

const handoff = buildGenericCausalSeamApiConsumerHandoff({
  observation,
  emittedAt: "2026-06-03T12:08:00.000Z",
  sourcePath: "examples/generic-api-seam.ts",
});

const readback = buildGenericCausalSeamApiObservationReadback({
  observation,
  emittedAt: "2026-06-03T12:09:00.000Z",
  sourcePath: "examples/generic-api-seam.ts",
});

assertGenericCausalEndpointDescriptor(descriptor);
assertGenericCausalSeamObservation(observation);
assertGenericCausalSeamApiConsumerHandoff(handoff);
assertGenericCausalSeamApiObservationReadback(readback);

process.stdout.write(`${JSON.stringify({ descriptor, observation, readback, handoff }, null, 2)}\n`);
