import assert from "node:assert/strict";
import test from "node:test";

import {
  assertResolutionRefinementEvidenceArtifact,
  buildResolutionRefinementEvidenceArtifact,
  CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_ARTIFACT_KIND,
  CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA,
  CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA_VERSION,
} from "../src/index.js";

const EMITTED_AT = "2026-05-16T10:00:00.000Z";

function compatibleRefinement(): any {
  return {
    coarseHappeningRef: "happening:platform-artifact-activation:aaaaaaaaaaaaaaaa",
    coarseBranchRef: "branch:platform-artifact-lifecycle:aaaaaaaaaaaaaaaa",
    observerRef: "observer:platform-host-a",
    referentRef: "referent:artifact:demo-package",
    refinedHappeningRefs: [
      "happening:platform-cpu-temperature-threshold:bbbbbbbbbbbbbbbb",
      "happening:platform-disk-write-sequence:cccccccccccccccc",
      "happening:platform-service-health-transition:dddddddddddddddd",
    ],
    refinedBranchRefs: [
      "branch:platform-artifact-activation-resolution:bbbbbbbbbbbbbbbb",
    ],
    sourceEvidenceRefs: [
      "receipt:mesh-ecology-platform:activation:aaaaaaaaaaaaaaaa",
    ],
    relation: {
      relationKind: "decomposition",
      aggregatesToCoarse: true,
      contradictsCoarse: false,
      coarseRemainsValidSourceRef: true,
      currentResolutionLeaf: true,
      observerResolution: "platform-activation-coarse",
      basisResolution: "platform-lifecycle-v1",
      schemaResolution: "causal-substrate-resolution-refinement-v1",
      instrumentationResolution: "host-local-activation-observation",
    },
    nonClaims: {
      truthClaimed: false,
      authorityGranted: false,
      runtimeAuthorityClaimed: false,
      consensusClaimed: false,
      universalObserverPerspectiveClaimed: false,
      backendOwnershipClaimed: false,
    },
  };
}

function build(refinement = compatibleRefinement()) {
  return buildResolutionRefinementEvidenceArtifact({
    refinement,
    emittedAt: EMITTED_AT,
    sourceRepo: "causal-substrate",
    sourcePath: "test/resolution-refinement-evidence.test.ts",
  });
}

test("compatible refinement preserves the coarse happening as a valid source ref", () => {
  const artifact = build();

  assertResolutionRefinementEvidenceArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_RESOLUTION_REFINEMENT_EVIDENCE_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "resolution-refinement-evidence-emitted");
  assert.equal(artifact.validation.status, "resolution-refinement-compatible");
  assert.equal(artifact.refs.coarseHappeningRef, "happening:platform-artifact-activation:aaaaaaaaaaaaaaaa");
  assert.equal(artifact.refs.refinedHappeningRefs.length, 3);
  assert.equal(artifact.relation.aggregatesToCoarse, true);
  assert.equal(artifact.relation.contradictsCoarse, false);
  assert.equal(artifact.relation.coarseRemainsValidSourceRef, true);
  assert.equal(artifact.validation.aggregationCompatibilityDeclared, true);
  assert.equal(artifact.validation.coarsePreserved, true);
  assert.equal(artifact.boundary.opensAutobase, false);
  assert.equal(artifact.boundary.opensCorestore, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.deepEqual(artifact.rejections, []);
  assert.ok(artifact.warnings.includes("higher-resolution-refinement-does-not-erase-coarse-observation"));
});

test("contradictory refinement requires explicit divergence posture", () => {
  const refinement = compatibleRefinement();
  refinement.relation.aggregatesToCoarse = false;
  refinement.relation.contradictsCoarse = true;

  const artifact = build(refinement);

  assert.equal(artifact.reviewStatus, "resolution-refinement-divergence-posture-required");
  assert.equal(artifact.validation.status, "resolution-refinement-divergence-posture-required");
  assert.equal(artifact.validation.divergencePosturePresentWhenNeeded, false);
  assert.ok(artifact.rejections.includes("divergence-posture-required"));
});

test("contradictory refinement with declared posture stays evidence without claiming settlement", () => {
  const refinement = compatibleRefinement();
  refinement.relation.aggregatesToCoarse = false;
  refinement.relation.contradictsCoarse = true;
  refinement.relation.divergencePosture = "reconciliation-required";

  const artifact = build(refinement);

  assert.equal(artifact.reviewStatus, "resolution-refinement-evidence-emitted");
  assert.equal(artifact.validation.status, "resolution-refinement-divergence-declared");
  assert.equal(artifact.relation.divergencePosture, "reconciliation-required");
  assert.equal(artifact.validation.divergencePosturePresentWhenNeeded, true);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
  assert.equal(artifact.boundary.claimsUniversalObserverPerspective, false);
  assert.deepEqual(artifact.rejections, []);
  assert.ok(artifact.warnings.includes("contradictory-refinement-requires-explicit-review-before-re-stabilization"));
});

test("refinement blocks unsafe seams truth claims and every-variable branchification", () => {
  const refinement = compatibleRefinement();
  refinement.sourceEvidenceRefs = ["http://127.0.0.1:8787/receipt.json"];
  refinement.nonClaims.truthClaimed = true;
  refinement.everyProgramVariableBecomesHappening = true;

  const artifact = build(refinement);

  assert.equal(artifact.reviewStatus, "resolution-refinement-guardrail-blocked");
  assert.ok(artifact.rejections.includes("unsafe-seam-ref"));
  assert.ok(artifact.rejections.includes("truth-authority-runtime-or-consensus-claim"));
  assert.ok(artifact.rejections.includes("every-program-variable-branchification-claim"));
  assert.equal(artifact.validation.unsafeSeamRefsBlocked, false);
  assert.equal(artifact.validation.unsafeClaimsBlocked, false);
});

test("malformed refinement remains non-accepted review evidence", () => {
  const artifact = build(null);

  assert.equal(artifact.reviewStatus, "resolution-refinement-malformed");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.refs.refinedHappeningRefs, []);
  assert.deepEqual(artifact.rejections, ["refinement-not-object"]);
});
