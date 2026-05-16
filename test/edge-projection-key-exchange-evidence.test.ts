import assert from "node:assert/strict";
import test from "node:test";

import {
  assertEdgeProjectionKeyExchangeEvidenceArtifact,
  buildEdgeProjectionKeyExchangeEvidenceArtifact,
  CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA,
  CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

const SOURCE_CORE_KEY = "a".repeat(64);
const HOST_PUBLIC_KEY = "c".repeat(64);
const TRACE_REF = "edge-self-work-trace:projection-loop";
const TESTBED_REF = "testbed-review:projection-key-exchange";

function validProof(): any {
  const capability = {
    capability: "projection-source-core-key.exchange",
    methodName: "projection.sourceCoreKey.get",
    dispatchCommand: "@edge-projection/source-core-key.get",
    protocolFamily: "edge-local-layer-projection-key-exchange",
    protocolSchema: "mesh-ecology-edge/projection-key-exchange/hyperdht-protomux-rpc/v0",
    ownerRepo: "mesh-ecology-edge",
    proofScope: "bounded_local_layer_projection_key_exchange",
    transportKind: "protomux-rpc",
    contactSeam: "hyperdht_direct_peer",
    localLayerDefault: true,
    meshLayerDefault: false,
    discoveryRequired: false,
    participantContact: true,
  };

  return {
    proofId: "edge-projection-key-exchange:aaaaaaaaaaaaaaaa",
    payloadHashAlgorithm: "sha256-canonical-json",
    payloadHash: `sha256:${"b".repeat(64)}`,
    appendLogRefs: {
      entryId: "edge-projection-key-exchange-entry:aaaaaaaaaaaaaaaa",
      sourceRepo: "mesh-ecology-edge",
      sourceArtifactKind: "edge_projection_key_exchange_proof",
      sourceSchema: "mesh-ecology-edge/projection-key-exchange/hyperdht-protomux-rpc/v0",
      proofKind: "edge_projection_key_exchange_direct_peer_lab",
      requestRef: "edge-projection-key-request:a",
      responseRef: "edge-projection-key-response:a",
      capabilityAdvertisementRef: "edge-projection-capabilities-response:a",
      selectedTransportRef: "protomux-rpc:hyperdht_direct_peer",
      sourceCoreKeyRef: SOURCE_CORE_KEY,
      parentRefs: [TRACE_REF, TESTBED_REF],
      truthClaimed: false,
      completionClaimed: false,
    },
    artifactKind: "edge_projection_key_exchange_proof",
    schema: "mesh-ecology-edge/projection-key-exchange/hyperdht-protomux-rpc/v0",
    protocolFamily: "edge-local-layer-projection-key-exchange",
    protocolSchema: "mesh-ecology-edge/projection-key-exchange/hyperdht-protomux-rpc/v0",
    dispatchCommand: "@edge-projection/source-core-key.get",
    capabilitiesDispatchCommand: "@edge-projection/capabilities.get",
    proofKind: "edge_projection_key_exchange_direct_peer_lab",
    transportKind: "protomux-rpc",
    contactSeam: "hyperdht_direct_peer",
    participantA: "edge-projection-key-host",
    participantB: "edge-projection-key-client",
    operation: "projection.sourceCoreKey.get",
    methodName: "projection.sourceCoreKey.get",
    requestId: "edge-projection-key-request:a",
    responseId: "edge-projection-key-response:a",
    hostPublicKey: HOST_PUBLIC_KEY,
    sourceCoreKey: SOURCE_CORE_KEY,
    sourceRefs: [TRACE_REF, TESTBED_REF],
    selectedTransport: {
      transportKind: "protomux-rpc",
      contactSeam: "hyperdht_direct_peer",
      transportRole: "proof_lane",
      scope: "isolated_local_hyperdht",
      scaffoldTransport: false,
      compatibilityAlias: false,
      productionPreferred: false,
      operatorSupplied: false,
      portExposureRequired: false,
      participantContact: true,
    },
    readinessEvidence: {
      readinessScope: "direct_peer_projection_key_exchange",
      distributedReadinessClaimed: false,
      replicatedStateClaimed: false,
    },
    capabilityDescriptor: capability,
    capabilityAdvertisement: {
      responseId: "edge-projection-capabilities-response:a",
      requestId: "edge-projection-capabilities-request:a",
      participant: "edge-projection-key-host",
      protocolFamily: "edge-local-layer-projection-key-exchange",
      protocolSchema: "mesh-ecology-edge/projection-key-exchange/hyperdht-protomux-rpc/v0",
      capabilities: [capability],
    },
    bootstrapNodes: ["127.0.0.1:12345"],
    contactAttempted: true,
    contactSucceeded: true,
    distributedReadinessClaimed: false,
    elapsedMs: 1,
    response: {
      responseId: "edge-projection-key-response:a",
      requestId: "edge-projection-key-request:a",
      participant: "edge-projection-key-host",
      sourceCoreKey: SOURCE_CORE_KEY,
      sourceRefs: [TRACE_REF, TESTBED_REF],
      ok: true,
    },
    failureClass: null,
    failureMessage: null,
    nonClaims: {
      truthClaimed: false,
      completionClaimed: false,
      authorityGranted: false,
      replicatedStateClaimed: false,
      autobaseBackend: false,
      meshPublicationClaimed: false,
    },
  };
}

function replicaInspection(): any {
  return {
    inspectionState: "projection_event_log_replica_visible",
    replicaStore: "/tmp/testbed-does-not-use-this-path",
    sourceCoreKey: SOURCE_CORE_KEY,
    entryCount: 1,
    wroteFiles: false,
    networkCalls: false,
    latestEntry: {
      entryId: "projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa:0",
      sourceRefs: [TRACE_REF, TESTBED_REF, "edge-operator-situation:op-status"],
      logPosture: {
        httpSeam: false,
        sshSeam: false,
        localStoreRootIsIntegrationSeam: false,
      },
    },
  };
}

test("valid Edge projection key proof imports as causal contact evidence only", () => {
  const artifact = buildEdgeProjectionKeyExchangeEvidenceArtifact({
    proof: validProof(),
    emittedAt: "2026-05-16T14:00:00.000Z",
    sourcePath: "edge-projection-key-exchange-proof.json",
  });

  assertEdgeProjectionKeyExchangeEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_PROJECTION_KEY_EXCHANGE_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-projection-key-exchange-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-projection-key-exchange-valid-contact-evidence");
  assert.equal(artifact.source.sourceRepo, "mesh-ecology-edge");
  assert.equal(artifact.source.sourceArtifactKind, "edge_projection_key_exchange_proof");
  assert.equal(artifact.contactRefs.sourceCoreKey, SOURCE_CORE_KEY);
  assert.deepEqual(artifact.contactRefs.semanticSourceRefs, [TRACE_REF, TESTBED_REF]);
  assert.equal(artifact.contactPosture.transportKind, "protomux-rpc");
  assert.equal(artifact.contactPosture.contactSeam, "hyperdht_direct_peer");
  assert.equal(artifact.contactPosture.scaffoldTransport, false);
  assert.equal(artifact.contactPosture.compatibilityAlias, false);
  assert.equal(artifact.continuityPosture.acceptedAsCanonicalHistory, false);
  assert.equal(artifact.continuityPosture.sourceCoreKeyMatchesReplica, "not-reviewed");
  assert.equal(artifact.boundary.opensHyperDht, false);
  assert.equal(artifact.boundary.opensProtomuxRpc, false);
  assert.equal(artifact.boundary.opensCorestore, false);
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.claimsDistributedReadiness, false);
  assert.deepEqual(artifact.rejections, []);
});

test("replica inspection refines contact evidence without becoming canonical history", () => {
  const artifact = buildEdgeProjectionKeyExchangeEvidenceArtifact({
    proof: validProof(),
    replicaInspection: replicaInspection(),
    emittedAt: "2026-05-16T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-key-exchange-evidence-emitted");
  assert.equal(artifact.continuityPosture.sourceCoreKeyMatchesReplica, true);
  assert.equal(artifact.continuityPosture.replicaRefsPreserved, true);
  assert.equal(artifact.continuityPosture.refinedByReplicaInspection, true);
  assert.equal(artifact.validation.replicaInspectionMatched, true);
  assert.deepEqual(artifact.contactRefs.replicaEntryRefs, [
    "projection-log-entry:projection:mesh-ecology-edge:operator_situation_view:aaaaaaaaaaaaaaaa:0",
  ]);
  assert.equal(artifact.boundary.replaysProjectionLog, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
});

test("projection key exchange blocks HTTP SSH local path and endpoint refs", () => {
  const proof = validProof();
  proof.sourceRefs = ["http://127.0.0.1:8787/projection"];

  const artifact = buildEdgeProjectionKeyExchangeEvidenceArtifact({
    proof,
    emittedAt: "2026-05-16T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-key-exchange-guardrail-blocked");
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.equal(artifact.validation.unsafeSeamRefsBlocked, false);
});

test("projection key exchange blocks readiness backend authority and publication overclaims", () => {
  const proof = validProof();
  proof.readinessEvidence.distributedReadinessClaimed = true;
  proof.nonClaims.autobaseBackend = true;
  proof.nonClaims.meshPublicationClaimed = true;

  const artifact = buildEdgeProjectionKeyExchangeEvidenceArtifact({
    proof,
    emittedAt: "2026-05-16T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-key-exchange-guardrail-blocked");
  assert.ok(artifact.rejections.includes("truth-readiness-runtime-backend-or-publication-claim"));
  assert.equal(artifact.validation.unsafeClaimsBlocked, false);
});

test("projection key exchange reports missing semantic refs and failed contact as incomplete", () => {
  const proof = validProof();
  proof.sourceRefs = [];
  proof.contactSucceeded = false;
  proof.response.ok = false;

  const artifact = buildEdgeProjectionKeyExchangeEvidenceArtifact({
    proof,
    emittedAt: "2026-05-16T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-key-exchange-incomplete-evidence");
  assert.ok(artifact.rejections.includes("source-refs-missing"));
  assert.ok(artifact.rejections.includes("contact-proof-missing-or-failed"));
  assert.equal(artifact.validation.semanticRefsPresent, false);
  assert.equal(artifact.validation.contactEvidencePresent, false);
});

test("projection key exchange blocks replica inspection key mismatch", () => {
  const inspection = replicaInspection();
  inspection.sourceCoreKey = "d".repeat(64);

  const artifact = buildEdgeProjectionKeyExchangeEvidenceArtifact({
    proof: validProof(),
    replicaInspection: inspection,
    emittedAt: "2026-05-16T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-key-exchange-guardrail-blocked");
  assert.ok(artifact.rejections.includes("replica-source-core-key-mismatch"));
  assert.equal(artifact.continuityPosture.sourceCoreKeyMatchesReplica, false);
  assert.equal(artifact.validation.replicaInspectionMatched, false);
});

test("projection key exchange treats malformed input as non-accepted evidence", () => {
  const artifact = buildEdgeProjectionKeyExchangeEvidenceArtifact({
    proof: null,
    emittedAt: "2026-05-16T14:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-projection-key-exchange-malformed-evidence");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.contactRefs.semanticSourceRefs, []);
  assert.deepEqual(artifact.rejections, ["projection-key-proof-not-object"]);
});
