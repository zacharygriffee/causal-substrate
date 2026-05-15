import assert from "node:assert/strict";
import test from "node:test";

import * as meshContactProofModule from "../src/adapters/mesh-contact-proof-evidence.js";
import {
  assertMeshContactProofEvidenceArtifact,
  buildMeshContactProofEvidenceArtifact,
  buildMeshContactProofEvidenceArtifactFromJson,
  CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA,
  CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

function validEvidence() {
  return {
    artifactKind: "mesh_contact_proof_evidence",
    schema: "mesh-v0-2/contact-proof/direct-peer/v1",
    protocolFamily: "mesh-contact-proof",
    protocolSchema: "mesh-v0-2/contact-proof/direct-peer/v1",
    protocolSchemaVersion: 1,
    dispatchVersion: 1,
    requestEncoding: "@mesh-contact/contact-proof-request",
    responseEncoding: "@mesh-contact/contact-proof-response",
    dispatchCommand: "@mesh-contact/capability-echo",
    proofKind: "mesh_contact_direct_peer_lab",
    transportKind: "protomux-rpc",
    contactSeam: "hyperdht_direct_peer",
    participantA: "mesh-contact-host",
    participantB: "mesh-contact-client",
    operation: "capability.echo",
    methodName: "capability.echo",
    requestId: "mesh-contact-request:a",
    responseId: "mesh-contact-response:a",
    hostPublicKey: "a".repeat(64),
    selectedTransport: {
      transportKind: "protomux-rpc",
      contactSeam: "hyperdht_direct_peer",
      transportRole: "proof_lane",
      scope: "isolated_local_hyperdht",
      scaffoldTransport: false,
      compatibilityAlias: false,
      productionPreferred: false,
    },
    readinessEvidence: {
      readinessScope: "direct_peer_contact",
      distributedReadinessClaimed: false,
    },
    contactAttempted: true,
    contactSucceeded: true,
    distributedReadinessClaimed: false,
    failureClass: null,
    failureMessage: null,
    claimsCausalTruth: false,
    meshTruthClaimed: false,
    completionClaimed: false,
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

test("valid mesh-v0-2 contact proof yields causal-owned evidence only", () => {
  const artifact = buildMeshContactProofEvidenceArtifact({
    evidence: validEvidence(),
    emittedAt: "2026-05-14T12:00:00.000Z",
    sourcePath: "test/labs/lab-contact-proof.direct-peer.test.js",
  });

  assertMeshContactProofEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_MESH_CONTACT_PROOF_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "mesh-contact-proof-evidence-emitted");
  assert.equal(artifact.validation.status, "mesh-contact-proof-valid-evidence");
  assert.equal(artifact.source.sourceRepo, "mesh-v0-2");
  assert.equal(artifact.contactRefs.proofKind, "mesh_contact_direct_peer_lab");
  assert.equal(artifact.contactRefs.participantA, "mesh-contact-host");
  assert.equal(artifact.contactRefs.participantB, "mesh-contact-client");
  assert.equal(artifact.contactRefs.operation, "capability.echo");
  assert.equal(artifact.protocolEvidence.protocolFamily, "mesh-contact-proof");
  assert.equal(artifact.protocolEvidence.protocolSchema, "mesh-v0-2/contact-proof/direct-peer/v1");
  assert.equal(artifact.protocolEvidence.requestEncoding, "@mesh-contact/contact-proof-request");
  assert.equal(artifact.protocolEvidence.responseEncoding, "@mesh-contact/contact-proof-response");
  assert.equal(artifact.protocolEvidence.dispatchCommand, "@mesh-contact/capability-echo");
  assert.equal(artifact.continuityEvidence.observationKind, "protocol-contact-proof-observation");
  assert.equal(artifact.continuityEvidence.sourceEventKind, "adjacent-contact-attempt");
  assert.equal(artifact.continuityEvidence.causalRole, "history-evidence");
  assert.equal(artifact.continuityEvidence.branchPosture, "evidence-branch-only");
  assert.equal(artifact.continuityEvidence.protocolFamily, "mesh-contact-proof");
  assert.equal(artifact.continuityEvidence.selectedContactSeam, "hyperdht_direct_peer");
  assert.equal(artifact.continuityEvidence.contactSucceededBySource, true);
  assert.equal(artifact.continuityEvidence.claimsCausalTruth, false);
  assert.equal(artifact.transportEvidence.selectedTransportKind, "protomux-rpc");
  assert.equal(artifact.transportEvidence.selectedContactSeam, "hyperdht_direct_peer");
  assert.equal(artifact.transportEvidence.selectedTransportRole, "proof_lane");
  assert.equal(artifact.transportEvidence.selectedTransportScope, "isolated_local_hyperdht");
  assert.equal(artifact.transportEvidence.contactAttemptedBySource, true);
  assert.equal(artifact.transportEvidence.contactSucceededBySource, true);
  assert.equal(artifact.transportEvidence.distributedReadinessClaimed, false);
  assert.deepEqual(artifact.rejections, []);
});

test("JSON input preserves contact proof refs and transport evidence", () => {
  const parsed = buildMeshContactProofEvidenceArtifact({
    evidence: validEvidence(),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });
  const fromJson = buildMeshContactProofEvidenceArtifactFromJson({
    evidenceJson: JSON.stringify(validEvidence()),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(fromJson.reviewStatus, parsed.reviewStatus);
  assert.deepEqual(fromJson.contactRefs, parsed.contactRefs);
  assert.deepEqual(fromJson.protocolEvidence, parsed.protocolEvidence);
  assert.deepEqual(fromJson.continuityEvidence, parsed.continuityEvidence);
  assert.deepEqual(fromJson.transportEvidence, parsed.transportEvidence);
});

test("malformed JSON yields malformed evidence without throwing", () => {
  const artifact = buildMeshContactProofEvidenceArtifactFromJson({
    evidenceJson: "{not-json",
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "mesh-contact-proof-malformed-evidence");
  assert.equal(artifact.validation.parseableJsonObject, false);
  assert.ok(artifact.rejections.includes("parseable-json-object:malformed"));
  assert.equal(artifact.boundary.performsContact, false);
});

test("missing required envelope fields are incomplete", () => {
  for (const key of [
    "artifactKind",
    "schema",
    "proofKind",
    "participantA",
    "participantB",
    "operation",
    "requestId",
    "responseId",
    "selectedTransport",
    "readinessEvidence",
  ] as const) {
    const evidence: Record<string, unknown> = clone(validEvidence());
    delete evidence[key];
    const artifact = buildMeshContactProofEvidenceArtifact({
      evidence,
      emittedAt: "2026-05-14T12:00:00.000Z",
    });

    assert.equal(artifact.reviewStatus, "mesh-contact-proof-incomplete-evidence", key);
    assert.ok(artifact.rejections.some((rejection) => rejection.includes(`required-envelope:${key}`)));
  }
});

test("wrong source schema or seam is incomplete", () => {
  const evidence = clone(validEvidence());
  evidence.schema = "mesh-v0-2/contact-proof/unknown/v1";
  evidence.selectedTransport.contactSeam = "http_scaffold";

  const artifact = buildMeshContactProofEvidenceArtifact({
    evidence,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "mesh-contact-proof-incomplete-evidence");
  assert.ok(artifact.rejections.includes("source-schema:mismatch"));
  assert.ok(artifact.rejections.includes("direct-contact-seam:missing"));
});

test("source contact failure is preserved without becoming causal truth", () => {
  const evidence: Record<string, unknown> = clone(validEvidence());
  evidence.contactSucceeded = false;
  evidence.failureClass = "contact_timeout";
  evidence.failureMessage = "rpc-request timed out";

  const artifact = buildMeshContactProofEvidenceArtifact({
    evidence,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "mesh-contact-proof-failed-evidence");
  assert.equal(artifact.transportEvidence.contactSucceededBySource, false);
  assert.equal(artifact.transportEvidence.failureClass, "contact_timeout");
  assert.ok(artifact.warnings.includes("source-contact-attempt-did-not-succeed"));
  assert.equal(artifact.boundary.claimsCausalTruth, false);
});

test("distributed readiness and unsafe truth claims are blocked", () => {
  const evidence = clone(validEvidence());
  evidence.readinessEvidence.distributedReadinessClaimed = true;
  evidence.meshTruthClaimed = true;

  const artifact = buildMeshContactProofEvidenceArtifact({
    evidence,
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "mesh-contact-proof-guardrail-blocked");
  assert.ok(artifact.rejections.includes("distributed-readiness-claim:blocked"));
  assert.ok(artifact.rejections.includes("unsafe-claim:blocked"));
  assert.equal(artifact.boundary.claimsDistributedReadiness, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.continuityEvidence.distributedReadinessClaimed, true);
  assert.equal(artifact.continuityEvidence.claimsCausalTruth, false);
});

test("boundary flags are explicit and non-authoritative", () => {
  const artifact = buildMeshContactProofEvidenceArtifact({
    evidence: validEvidence(),
    emittedAt: "2026-05-14T12:00:00.000Z",
  });

  assert.deepEqual(artifact.boundary, {
    reviewOnly: true,
    evidenceOnly: true,
    meshRuntimeFetched: false,
    meshCalled: false,
    meshMutated: false,
    performsContact: false,
    claimsCausalTruth: false,
    acceptsCanonicalBranch: false,
    writesContinuityRecords: false,
    claimsDistributedReadiness: false,
    claimsMeshCompletion: false,
    publishesToMesh: false,
  });
  assert.ok(artifact.warnings.includes("mesh-contact-proof-is-adjacent-source-evidence"));
  assert.ok(artifact.warnings.includes("direct-contact-proof-is-not-distributed-readiness"));
});

test("adapter exposes no mesh runtime fetch, call, mutation, runner, scheduler, discovery, or publish API", () => {
  const prohibited = Object.keys(meshContactProofModule).filter((key) =>
    /(fetch|call|mutat|runner|schedule|discover|publish|meshClient|apiClient|writeContinuity)/i.test(key),
  );

  assert.deepEqual(prohibited, []);
});
