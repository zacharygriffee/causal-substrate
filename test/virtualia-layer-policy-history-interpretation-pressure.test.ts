import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const fixturePath = path.join(
  process.cwd(),
  "test/fixtures/virtualia/layer-policy-history-interpretation-pressure-fixture.json",
);

async function readFixture(): Promise<Record<string, any>> {
  return JSON.parse(await readFile(fixturePath, "utf8")) as Record<string, any>;
}

test("Virtualia/Layer policy-history pressure fixture preserves adjacent refs only", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.artifactKind, "causal_policy_history_interpretation_pressure_fixture");
  assert.equal(fixture.schema, "causal-substrate/policy-history-interpretation-pressure-fixture/v1");
  assert.equal(fixture.schemaVersion, 1);
  assert.deepEqual(fixture.sourceChain.sourceRepos, [
    "Virtualia",
    "mesh-ecology-layer",
    "mesh-ecology-edge",
  ]);
  assert.equal(fixture.sourceChain.policyHistoryRef, "policy-history:moon-garden:rbc-v1");
  assert.equal(
    fixture.sourceChain.effectiveRulebookViewRef,
    "effective-rulebook-view:moon-garden:baseline",
  );
  assert.equal(
    fixture.sourceChain.compatibilityBoundaryRef,
    "compatibility-boundary:moon-garden:seed-admission",
  );
  assert.equal(
    fixture.sourceChain.targetContextReviewRef,
    "assessment:target-context-review:missing-quorum",
  );
  assert.equal(fixture.sourceChain.eventRef, "event:moon-garden:new-quorum-evidence");
  assert.equal(fixture.interpretationPressure.historyRefsPreservedOnly, true);
  assert.equal(fixture.interpretationPressure.effectiveRulebookTreatedAsView, true);
  assert.equal(fixture.interpretationPressure.compatibilityBoundaryTreatedAsContext, true);
  assert.equal(fixture.interpretationPressure.targetContextReviewTreatedAsAssessmentRef, true);
  assert.equal(fixture.interpretationPressure.eventTreatedAsEvidenceRef, true);
});

test("Virtualia/Layer policy-history pressure fixture keeps repo seams explicit", async () => {
  const fixture = await readFixture();

  assert.deepEqual(fixture.observedChainStatuses, {
    layerAdmissionStatus: "not_admitted",
    layerLiftStatus: "not_performed",
    virtualiaAdmissionStatus: "not_admitted",
    quorumStatus: "not_satisfied",
    rbcInterpretationStatus: "not_interpreted",
    edgeReviewPosture: "operator_review_only",
  });
  assert.deepEqual(fixture.causalBoundary, {
    fixtureOnly: true,
    interpretationOnly: true,
    evidenceOnly: true,
    executesPolicy: false,
    grantsAuthority: false,
    decidesTruth: false,
    selectsStorage: false,
    schedulesWork: false,
    admitsContent: false,
    liftsContent: false,
    interpretsRulebook: false,
    claimsQuorumSatisfied: false,
    claimsCanonicalHistory: false,
    writesContinuityRecords: false,
    publishesToMesh: false,
  });
  assert.equal(fixture.reviewFinding.status, "interpretation_pressure_recorded");
});
