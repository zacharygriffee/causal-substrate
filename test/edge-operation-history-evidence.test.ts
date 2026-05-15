import assert from "node:assert/strict";
import test from "node:test";

import * as operationHistoryModule from "../src/adapters/edge-operation-history-evidence.js";
import {
  assertEdgeOperationHistoryEvidenceArtifact,
  buildEdgeOperationHistoryEvidenceArtifact,
  buildEdgeOperationHistoryEvidenceArtifactFromJson,
  CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA,
  CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

function validTrail() {
  return {
    artifactKind: "edge_operation_trail",
    operationId: "operation-a",
    status: "attention_required",
    context: {
      operationId: "operation-a",
      operationKind: "guided_platform_http_target_setup",
      openedAt: "2026-05-13T00:00:00.000Z",
      posture: {
        truthClaimed: false,
        completionClaimed: false,
        schedulerUsed: false,
        discoveryPerformed: false,
        futureAuthorizationGranted: false,
      },
    },
    posture: {
      truthClaimed: false,
      completionClaimed: false,
      schedulerUsed: false,
      discoveryPerformed: false,
      futureAuthorizationGranted: false,
    },
    events: [
      {
        operationId: "operation-a",
        eventId: "operation-a:event:1",
        eventKind: "operation_opened",
        occurredAt: "2026-05-13T00:00:00.000Z",
        parentEventRefs: [],
        receiptRefs: [],
        posture: {
          truthClaimed: false,
          completionClaimed: false,
          schedulerUsed: false,
        },
      },
      {
        operationId: "operation-a",
        eventId: "operation-a:event:2",
        eventKind: "evidence_attached",
        occurredAt: "2026-05-13T00:01:00.000Z",
        parentEventRefs: ["operation-a:event:1"],
        receiptRefs: ["receipt:test"],
        evidenceRefs: ["evidence:mesh-pub:1"],
        payload: {
          hash: "sha256:abc",
          path: "evidence/pub.json",
        },
        posture: {
          truthClaimed: false,
          completionClaimed: false,
          schedulerUsed: false,
        },
      },
    ],
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

test("valid Edge operation trail yields causal-owned operation history evidence only", () => {
  const artifact = buildEdgeOperationHistoryEvidenceArtifact({
    trail: validTrail(),
    emittedAt: "2026-05-14T12:00:00.000Z",
    sourcePath: "events/operation-a.json",
  });

  assertEdgeOperationHistoryEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_OPERATION_HISTORY_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "operation-history-evidence-emitted");
  assert.equal(artifact.validation.status, "operation-history-valid-trail");
  assert.equal(artifact.trailRefs.operationId, "operation-a");
  assert.equal(artifact.trailRefs.operationKind, "guided_platform_http_target_setup");
  assert.equal(artifact.eventRefs.length, 2);
  assert.deepEqual(artifact.eventRefs[1]?.parentEventRefs, ["operation-a:event:1"]);
  assert.deepEqual(artifact.eventRefs[1]?.receiptRefs, ["receipt:test"]);
  assert.deepEqual(artifact.eventRefs[1]?.evidenceRefs, [
    "evidence:mesh-pub:1",
    "sha256:abc",
    "evidence/pub.json",
  ]);
  assert.deepEqual(artifact.rejections, []);
});

test("JSON input preserves the same operation refs as parsed input", () => {
  const parsed = buildEdgeOperationHistoryEvidenceArtifact({
    trail: validTrail(),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });
  const fromJson = buildEdgeOperationHistoryEvidenceArtifactFromJson({
    trailJson: JSON.stringify(validTrail()),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(fromJson.reviewStatus, parsed.reviewStatus);
  assert.deepEqual(fromJson.trailRefs, parsed.trailRefs);
  assert.deepEqual(fromJson.eventRefs, parsed.eventRefs);
});

test("Edge operation history preserves attached mesh contact proof links", () => {
  const trail = clone(validTrail());
  trail.events[1].payload = {
    evidencePath: "artifacts/contact-proof.json",
    evidenceSha256: "sha256:contact-proof",
    evidenceKind: "mesh_contact_proof",
    localClassification: "mesh_contact_proof_observed",
    contactProofPosture: {
      sourceRepo: "mesh-v0-2",
      sourceSchema: "mesh-v0-2/contact-proof/direct-peer/v1",
      proofKind: "mesh_contact_direct_peer_lab",
      requestId: "mesh-contact-request:a",
      responseId: "mesh-contact-response:a",
      hostPublicKey: "a".repeat(64),
      transportKind: "protomux-rpc",
      contactSeam: "hyperdht_direct_peer",
      readinessScope: "direct_peer_contact",
      distributedReadinessClaimed: false,
    },
  };

  const artifact = buildEdgeOperationHistoryEvidenceArtifact({
    trail,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });
  const evidenceEvent = artifact.eventRefs[1];

  assert.equal(artifact.reviewStatus, "operation-history-evidence-emitted");
  assert.ok(evidenceEvent?.evidenceRefs.includes("artifacts/contact-proof.json"));
  assert.ok(evidenceEvent?.evidenceRefs.includes("sha256:contact-proof"));
  assert.deepEqual(evidenceEvent?.contactProofRefs, [
    "sourceRepo:mesh-v0-2",
    "sourceSchema:mesh-v0-2/contact-proof/direct-peer/v1",
    "proofKind:mesh_contact_direct_peer_lab",
    "requestId:mesh-contact-request:a",
    "responseId:mesh-contact-response:a",
    `hostPublicKey:${"a".repeat(64)}`,
    "transportKind:protomux-rpc",
    "contactSeam:hyperdht_direct_peer",
    "readinessScope:direct_peer_contact",
  ]);
  assert.equal(artifact.boundary.replaysEvents, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
});

test("Edge operation history preserves proof-first readiness contact refs", () => {
  const trail = clone(validTrail());
  trail.events.push({
    operationId: "operation-a",
    eventId: "operation-a:event:3",
    eventKind: "contact_proof_readiness_observed",
    occurredAt: "2026-05-13T00:02:00.000Z",
    parentEventRefs: ["operation-a:event:2"],
    receiptRefs: [],
    payload: {
      preferredReadinessEvidence: "contact_proof",
      contactProofState: "preferred_contact_proof_observed",
      contactProofPath: "artifacts/contact-proof.json",
      sourceKind: "mesh_v0_2_contact_proof",
      protocolFamily: "mesh-contact-proof",
      protocolSchema: "mesh-v0-2/contact-proof/direct-peer/v1",
      dispatchCommand: "@mesh-contact/capability-echo",
      transportKind: "protomux-rpc",
      contactSeam: "hyperdht_direct_peer",
      readinessScope: "direct_peer_contact",
      distributedReadinessClaimed: false,
    },
    posture: {
      truthClaimed: false,
      completionClaimed: false,
      schedulerUsed: false,
    },
  });

  const artifact = buildEdgeOperationHistoryEvidenceArtifact({
    trail,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });
  const readinessEvent = artifact.eventRefs[2];

  assert.equal(artifact.reviewStatus, "operation-history-evidence-emitted");
  assert.deepEqual(readinessEvent?.contactProofRefs, [
    "state:preferred_contact_proof_observed",
    "path:artifacts/contact-proof.json",
    "sourceKind:mesh_v0_2_contact_proof",
    "protocolFamily:mesh-contact-proof",
    "protocolSchema:mesh-v0-2/contact-proof/direct-peer/v1",
    "dispatchCommand:@mesh-contact/capability-echo",
    "transportKind:protomux-rpc",
    "contactSeam:hyperdht_direct_peer",
    "readinessScope:direct_peer_contact",
  ]);
  assert.equal(artifact.boundary.replaysEvents, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
});

test("malformed JSON yields malformed evidence without throwing", () => {
  const artifact = buildEdgeOperationHistoryEvidenceArtifactFromJson({
    trailJson: "{not-json",
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "operation-history-malformed-trail");
  assert.equal(artifact.validation.parseableJsonObject, false);
  assert.ok(artifact.rejections.includes("parseable-json-object:malformed"));
  assert.equal(artifact.boundary.edgeCalled, false);
});

test("missing trail envelope fields are incomplete", () => {
  for (const key of ["artifactKind", "operationId", "context", "events"] as const) {
    const trail: Record<string, unknown> = clone(validTrail());
    delete trail[key];
    const artifact = buildEdgeOperationHistoryEvidenceArtifact({
      trail,
      emittedAt: "2026-05-14T12:00:00.000Z",
    });

    assert.equal(artifact.reviewStatus, "operation-history-incomplete-trail", key);
    assert.ok(artifact.rejections.some((rejection) => rejection.includes(`required-trail-envelope:${key}`)));
  }
});

test("malformed event entries are incomplete", () => {
  const trail = clone(validTrail());
  const event = trail.events[1] as Partial<(typeof trail.events)[number]>;
  delete event.eventKind;

  const artifact = buildEdgeOperationHistoryEvidenceArtifact({
    trail,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "operation-history-incomplete-trail");
  assert.ok(artifact.rejections.includes("event-shape:malformed"));
});

test("unsafe posture claims block causal truth and replay authority", () => {
  const trail = clone(validTrail());
  const event = trail.events[1];
  assert.ok(event);
  event.posture.truthClaimed = true;

  const artifact = buildEdgeOperationHistoryEvidenceArtifact({
    trail,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "operation-history-guardrail-blocked");
  assert.ok(artifact.rejections.includes("unsafe-posture-claims:blocked-by-guardrail"));
  assert.equal(artifact.boundary.replaysEvents, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.equal(artifact.boundary.acceptsCanonicalBranch, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
});

test("boundary flags are explicit and non-authoritative", () => {
  const artifact = buildEdgeOperationHistoryEvidenceArtifact({
    trail: validTrail(),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.deepEqual(artifact.boundary, {
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    replaysEvents: false,
    claimsCausalTruth: false,
    acceptsCanonicalBranch: false,
    writesContinuityRecords: false,
    publishesToMesh: false,
  });
  assert.ok(artifact.warnings.includes("edge-operation-trail-is-local-json-scaffold"));
  assert.ok(artifact.warnings.includes("events-not-replayed-as-causal-history"));
});

test("adapter exposes no Edge runtime fetch, call, mutation, runner, scheduler, discovery, or publish API", () => {
  const prohibited = Object.keys(operationHistoryModule).filter((key) =>
    /(fetch|call|mutat|runner|schedule|discover|publish|edgeClient|apiClient|writeContinuity)/i.test(key),
  );

  assert.deepEqual(prohibited, []);
});
