import assert from "node:assert/strict";
import test from "node:test";

import * as edgeContactModule from "../src/adapters/edge-contact-evidence.js";
import {
  assertEdgeContactEvidenceArtifact,
  buildEdgeContactEvidenceArtifact,
  buildEdgeContactEvidenceArtifactFromJson,
  CAUSAL_EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA,
  CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

function validEvidence() {
  return {
    artifactKind: "edge_contact_evidence",
    operationId: "operation-contact-a",
    targetId: "platform-lab",
    participant: "platform",
    selectedTransport: {
      transportKind: "protomux-rpc",
      contactSeam: "hyperdht_direct_peer",
      transportRole: "preferred",
      scaffoldTransport: false,
      compatibilityAlias: false,
    },
    fallbackTransportKinds: ["http"],
    contactAttempted: true,
    contactSucceeded: true,
    readinessEvidence: {
      readinessScope: "transport_contact",
      distributedReadinessClaimed: false,
    },
    distributedReadinessClaimed: false,
    claimsCausalTruth: false,
    meshTruthClaimed: false,
    completionClaimed: false,
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

test("valid Edge contact evidence yields causal-owned evidence only", () => {
  const artifact = buildEdgeContactEvidenceArtifact({
    evidence: validEvidence(),
    emittedAt: "2026-05-14T12:00:00.000Z",
    sourcePath: "events/contact-evidence.json",
  });

  assertEdgeContactEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_EDGE_CONTACT_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_EDGE_CONTACT_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "edge-contact-evidence-emitted");
  assert.equal(artifact.validation.status, "edge-contact-valid-evidence");
  assert.equal(artifact.contactRefs.operationId, "operation-contact-a");
  assert.equal(artifact.contactRefs.targetId, "platform-lab");
  assert.equal(artifact.transportEvidence.selectedTransportKind, "protomux-rpc");
  assert.equal(artifact.transportEvidence.selectedContactSeam, "hyperdht_direct_peer");
  assert.deepEqual(artifact.transportEvidence.fallbackTransportKinds, ["http"]);
  assert.equal(artifact.transportEvidence.contactAttemptedBySource, true);
  assert.equal(artifact.transportEvidence.contactSucceededBySource, true);
  assert.equal(artifact.transportEvidence.distributedReadinessClaimed, false);
  assert.deepEqual(artifact.rejections, []);
});

test("JSON input preserves contact refs and transport evidence", () => {
  const parsed = buildEdgeContactEvidenceArtifact({
    evidence: validEvidence(),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });
  const fromJson = buildEdgeContactEvidenceArtifactFromJson({
    evidenceJson: JSON.stringify(validEvidence()),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(fromJson.reviewStatus, parsed.reviewStatus);
  assert.deepEqual(fromJson.contactRefs, parsed.contactRefs);
  assert.deepEqual(fromJson.transportEvidence, parsed.transportEvidence);
});

test("malformed JSON yields malformed evidence without throwing", () => {
  const artifact = buildEdgeContactEvidenceArtifactFromJson({
    evidenceJson: "{not-json",
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-contact-malformed-evidence");
  assert.equal(artifact.validation.parseableJsonObject, false);
  assert.ok(artifact.rejections.includes("parseable-json-object:malformed"));
  assert.equal(artifact.boundary.performsContact, false);
});

test("missing required envelope fields are incomplete", () => {
  for (const key of ["artifactKind", "operationId", "targetId", "participant", "selectedTransport"] as const) {
    const evidence: Record<string, unknown> = clone(validEvidence());
    delete evidence[key];
    const artifact = buildEdgeContactEvidenceArtifact({
      evidence,
      emittedAt: "2026-05-14T12:00:00.000Z",
    });

    assert.equal(artifact.reviewStatus, "edge-contact-incomplete-evidence", key);
    assert.ok(artifact.rejections.some((rejection) => rejection.includes(`required-envelope:${key}`)));
  }
});

test("missing transport posture is incomplete", () => {
  const evidence = clone(validEvidence());
  delete (evidence.selectedTransport as { contactSeam?: string }).contactSeam;

  const artifact = buildEdgeContactEvidenceArtifact({
    evidence,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-contact-incomplete-evidence");
  assert.ok(artifact.rejections.includes("transport-posture:missing"));
});

test("distributed readiness and unsafe truth claims are blocked", () => {
  const evidence = clone(validEvidence());
  evidence.readinessEvidence.distributedReadinessClaimed = true;
  evidence.meshTruthClaimed = true;

  const artifact = buildEdgeContactEvidenceArtifact({
    evidence,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "edge-contact-guardrail-blocked");
  assert.ok(artifact.rejections.includes("distributed-readiness-claim:blocked"));
  assert.ok(artifact.rejections.includes("unsafe-claim:blocked"));
  assert.equal(artifact.boundary.claimsDistributedReadiness, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
});

test("boundary flags are explicit and non-authoritative", () => {
  const artifact = buildEdgeContactEvidenceArtifact({
    evidence: validEvidence(),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.deepEqual(artifact.boundary, {
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    performsContact: false,
    claimsCausalTruth: false,
    acceptsCanonicalBranch: false,
    writesContinuityRecords: false,
    claimsDistributedReadiness: false,
    publishesToMesh: false,
  });
  assert.ok(artifact.warnings.includes("edge-contact-evidence-is-adjacent-source-evidence"));
  assert.ok(artifact.warnings.includes("transport-readiness-is-not-distributed-readiness"));
});

test("adapter exposes no Edge runtime fetch, call, mutation, runner, scheduler, discovery, or publish API", () => {
  const prohibited = Object.keys(edgeContactModule).filter((key) =>
    /(fetch|call|mutat|runner|schedule|discover|publish|edgeClient|apiClient|writeContinuity)/i.test(key),
  );

  assert.deepEqual(prohibited, []);
});
