import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import * as edgeReviewModule from "../src/adapters/edge-causal-review-evidence.js";
import {
  assertCausalAdjacentReviewEvidenceArtifact,
  buildCausalAdjacentReviewEvidenceArtifact,
  buildCausalAdjacentReviewEvidenceArtifactFromJson,
  CAUSAL_ADJACENT_REVIEW_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA,
  CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA_VERSION,
  EDGE_PHASE_116A_STATIC_FIXTURE_PATH,
  EDGE_PHASE_116A_STOP_GO_DECISION,
} from "../src/index.js";

const fixturePath = path.join(process.cwd(), EDGE_PHASE_116A_STATIC_FIXTURE_PATH);

async function readFixtureJson(): Promise<string> {
  return readFile(fixturePath, "utf8");
}

function cloneRecord<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

test("phase-117: valid static Edge fixture yields causal-owned review evidence only", async () => {
  const fixtureJson = await readFixtureJson();
  const artifact = buildCausalAdjacentReviewEvidenceArtifactFromJson({
    fixtureJson,
    emittedAt: "2026-05-02T12:00:00.000Z",
    sourceFixturePath: EDGE_PHASE_116A_STATIC_FIXTURE_PATH,
    copiedFrom:
      "mesh-ecology-edge/docs/reviews/phase-116-causal-continuity-adjacent-review-packet-fixture.json",
  });

  assertCausalAdjacentReviewEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, "causal-adjacent-review-evidence");
  assert.equal(artifact.schema, "causal-substrate/adjacent-review-evidence/v1");
  assert.equal(artifact.schemaVersion, 1);
  assert.equal(artifact.reviewStatus, "review-evidence-emitted");
  assert.equal(artifact.validation.status, "review-only-valid-fixture");
  assert.equal(artifact.sourceFixture.path, EDGE_PHASE_116A_STATIC_FIXTURE_PATH);
  assert.equal(artifact.sourceFixture.staticCopyOnly, true);
  assert.equal(artifact.edgePacketRefs.stopGoDecision, EDGE_PHASE_116A_STOP_GO_DECISION);
  assert.equal(artifact.edgePacketRefs.targetRepo, "causal-substrate");
  assert.equal(artifact.edgePacketRefs.targetSurface, "causal_continuity");
  assert.equal(artifact.validation.unknownFieldsTreatedAsInertPacketData, true);
  assert.equal(artifact.validation.packetContentTreatedAsNonExecutableReviewText, true);
  assert.deepEqual(artifact.rejections, []);
});

test("phase-117: boundary flags are explicit and non-authoritative", async () => {
  const artifact = buildCausalAdjacentReviewEvidenceArtifactFromJson({
    fixtureJson: await readFixtureJson(),
    emittedAt: "2026-05-02T12:00:00.000Z",
  });

  assert.deepEqual(artifact.boundary, {
    staticInputOnly: true,
    reviewOnly: true,
    evidenceOnly: true,
    edgeRuntimeFetched: false,
    edgeCalled: false,
    edgeMutated: false,
    edgePacketAcceptedAsSchema: false,
    claimsCausalTruth: false,
    acceptsCanonicalBranch: false,
    settlesLineage: false,
    settlesReality: false,
    replaysEvents: false,
    resolvesCausalConflicts: false,
    claimsProductionProof: false,
    claimsMeshTruth: false,
    grantsAdjacentAcceptance: false,
    publishesToMesh: false,
  });
  assert.ok(artifact.warnings.includes("no-adjacent-acceptance-from-packet-presence"));
});

test("phase-117: malformed fixture yields review-only malformed rejection", () => {
  const artifact = buildCausalAdjacentReviewEvidenceArtifactFromJson({
    fixtureJson: "{not-json",
    emittedAt: "2026-05-02T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "review-only-malformed-fixture");
  assert.equal(artifact.validation.status, "review-only-malformed-fixture");
  assert.equal(artifact.validation.parseableJsonObject, false);
  assert.ok(artifact.rejections.includes("parseable-json-object:malformed"));
  assert.equal(artifact.boundary.edgeCalled, false);
});

test("phase-117: missing checklist, response shape, guardrails, or stop-go is incomplete", async () => {
  const base = JSON.parse(await readFixtureJson()) as Record<string, unknown>;

  for (const key of [
    "reviewChecklist",
    "expectedCausalEvidenceResponseShape",
    "causalWordingGuardrails",
    "stopGoDecision",
  ]) {
    const fixture = cloneRecord(base);
    delete fixture[key];
    const artifact = buildCausalAdjacentReviewEvidenceArtifact({
      fixture,
      emittedAt: "2026-05-02T12:00:00.000Z",
    });

    assert.equal(artifact.reviewStatus, "review-only-incomplete-fixture", key);
    assert.ok(
      artifact.rejections.some(
        (rejection) =>
          rejection === `required-static-envelope:${key}:missing` ||
          rejection.includes(":missing") ||
          rejection.includes(":malformed"),
      ),
      key,
    );
  }
});

test("phase-117: wrong stop-go decision blocks review evidence", async () => {
  const fixture = JSON.parse(await readFixtureJson()) as Record<string, unknown>;
  fixture.stopGoDecision = {
    decision: "stop_before_causal_substrate_repo_review",
  };

  const artifact = buildCausalAdjacentReviewEvidenceArtifact({
    fixture,
    emittedAt: "2026-05-02T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "review-only-guardrail-blocked");
  assert.equal(artifact.validation.stopGoDecisionAcceptedForReview, false);
  assert.ok(artifact.rejections.includes("stop-go-decision:blocked-by-guardrail"));
});

test("phase-117: command, TODO, and replay-like fields are blocked as inert review text", async () => {
  const fixture = JSON.parse(await readFixtureJson()) as Record<string, unknown>;
  fixture.executesAction = true;
  fixture.todo = "replay events and publish to mesh";

  const artifact = buildCausalAdjacentReviewEvidenceArtifact({
    fixture,
    emittedAt: "2026-05-02T12:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "review-only-guardrail-blocked");
  assert.ok(artifact.rejections.includes("command-todo-replay-content:blocked-by-guardrail"));
  assert.equal(artifact.boundary.replaysEvents, false);
  assert.equal(artifact.boundary.publishesToMesh, false);
});

test("phase-117: correlation refs are preserved without interpretation", async () => {
  const artifact = buildCausalAdjacentReviewEvidenceArtifactFromJson({
    fixtureJson: await readFixtureJson(),
    emittedAt: "2026-05-02T12:00:00.000Z",
  });

  assert.equal(
    artifact.preservedCorrelationRefs.packetRef,
    "edge-ecosystem-adjacent-packet:001:causal_substrate:2026-05-02T10:00:00.000Z",
  );
  assert.deepEqual(artifact.preservedCorrelationRefs.expectedNamespaceParts, [
    "causal-substrate",
    "edge",
    "phase-116",
  ]);
  assert.equal(artifact.preservedCorrelationRefs.expectedPrimaryBranchRef, "branch:phase-116-expected-primary");
  assert.equal(artifact.validation.correlationRefsPreservedAsStringsOrArrays, true);
  assert.equal(artifact.boundary.acceptsCanonicalBranch, false);
  assert.equal(artifact.boundary.settlesLineage, false);
});

test("phase-117: schema constants and Edge import classification are causal-owned", async () => {
  const artifact = buildCausalAdjacentReviewEvidenceArtifactFromJson({
    fixtureJson: await readFixtureJson(),
    emittedAt: "2026-05-02T12:00:00.000Z",
  });

  assert.equal(CAUSAL_ADJACENT_REVIEW_EVIDENCE_ARTIFACT_KIND, "causal-adjacent-review-evidence");
  assert.equal(CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA, "causal-substrate/adjacent-review-evidence/v1");
  assert.equal(CAUSAL_ADJACENT_REVIEW_EVIDENCE_SCHEMA_VERSION, 1);
  assert.deepEqual(artifact.edgeImportClassification, {
    seamId: "causal_continuity",
    evidenceKind: "causal_continuity_edge_packet_review_evidence",
    edgeExpectedArtifactKind: "causal_continuity_edge_packet_review_evidence",
    classificationOnly: true,
    edgeOwnsSchema: false,
  });
});

test("phase-117: adapter exposes no Edge runtime fetch, call, mutation, runner, scheduler, discovery, or publish API", () => {
  const prohibited = Object.keys(edgeReviewModule).filter((key) =>
    /(fetch|call|mutat|runner|schedule|discover|publish|edgeClient|apiClient)/i.test(key),
  );

  assert.deepEqual(prohibited, []);
});
