import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  buildContinuityWorkstationReport,
  loadSubstrateFromSnapshot,
  Substrate,
  writeSubstrateSnapshot,
} from "../src/index.js";

function createSubstrate() {
  let tick = 0;
  return new Substrate({
    now: () => `2026-04-22T00:00:${String(tick++).padStart(2, "0")}Z`,
  });
}

test("phase-6: helper APIs support explicit split pressure and multi-nucleus merge successors", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "phase-6-basis",
    dimensions: ["shape", "continuity"],
  });
  const source = substrate.createBranch({
    role: "referent",
    label: "source-branch",
    basisId: basis.id,
  });
  const segment = substrate.openSegment({ branchId: source.id });
  const carry = substrate.sealSegment(segment.id, { anchor: "source-anchor" });

  const fork = substrate.forkBranch({
    sourceBranchId: source.id,
    label: "forked-branch",
    relation: "split",
  });
  const merge = substrate.createMergeSuccessor({
    label: "merge-branch",
    role: "referent",
    basisId: basis.id,
    sourceBranchIds: [source.id, fork.branch.id],
    inheritedNucleusIds: [carry.nucleus.id],
  });

  assert.equal(fork.lineage.relation, "split");
  assert.deepEqual(fork.branch.parentBranchIds, [source.id]);
  assert.equal(merge.lineage.length, 2);
  assert.deepEqual(merge.branch.parentBranchIds, [source.id, fork.branch.id]);
  assert.deepEqual(merge.segment.inheritedNucleusIds, [carry.nucleus.id]);
});

test("branch capability evolution can revise basis without forcing a branch fork", () => {
  const substrate = createSubstrate();
  const fullBasis = substrate.createBasis({
    label: "rgb-camera-basis",
    dimensions: ["red", "green", "blue", "position"],
  });
  const degradedBasis = substrate.createBasis({
    label: "rb-camera-basis",
    dimensions: ["red", "blue", "position"],
    partial: true,
    degradedFrom: [fullBasis.id],
    revisedFrom: [fullBasis.id],
  });
  const observer = substrate.createObserver({
    label: "camera",
    basisId: fullBasis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "camera-branch",
    basisId: fullBasis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "colored-cube-branch",
    basisId: fullBasis.id,
  });
  const referent = substrate.createReferent({
    label: "colored-cube",
    anchor: "cube-anchor",
    branchId: referentBranch.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
    strength: 0.91,
  });

  const initialEstimate = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "continuing",
    reasoning: "full color basis preserves enough distinction for continuing judgment",
    basedOnBindingIds: [binding.id],
    metadata: { effectiveBasisId: fullBasis.id },
  });

  const revisedBranch = substrate.reviseBranchBasis({
    branchId: observerBranch.id,
    basisId: degradedBasis.id,
    reason: "camera lost the ability to preserve green distinctions",
  });

  const degradedEstimate = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "ambiguous",
    reasoning: "green loss weakens re-identification enough to keep continuity unresolved",
    basedOnBindingIds: [binding.id],
    metadata: { effectiveBasisId: degradedBasis.id },
  });

  assert.equal(revisedBranch.id, observerBranch.id);
  assert.equal(revisedBranch.basisId, degradedBasis.id);
  assert.deepEqual(degradedBasis.degradedFrom, [fullBasis.id]);
  assert.deepEqual(revisedBranch.parentBranchIds, []);
  assert.equal(initialEstimate.continuity, "continuing");
  assert.equal(degradedEstimate.continuity, "ambiguous");
  assert.deepEqual(revisedBranch.metadata?.basisRevision, {
    fromBasisId: fullBasis.id,
    toBasisId: degradedBasis.id,
    revisedAt: "2026-04-22T00:00:01Z",
    reason: "camera lost the ability to preserve green distinctions",
  });
});

test("phase-6 and phase-8: artifact envelopes and comparison surfaces carry typed provenance", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "artifact-basis",
    dimensions: ["binding", "comparison"],
  });
  const observer = substrate.createObserver({
    label: "artifact-observer",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "artifact-observer-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "artifact-referent-branch",
    basisId: basis.id,
  });
  const referent = substrate.createReferent({
    label: "artifact-referent",
    anchor: "artifact-anchor",
    branchId: referentBranch.id,
  });
  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
  });
  const estimate = substrate.createStateEstimate({
    referentId: referent.id,
    branchId: referentBranch.id,
    continuity: "ambiguous",
    reasoning: "comparison needed",
    basedOnBindingIds: [binding.id],
  });
  const comparison = substrate.createComparisonSurface({
    label: "artifact-comparison",
    sourceIds: [binding.id, estimate.id],
    basisId: basis.id,
    comparability: "partial",
    compatibility: "unresolved",
    convergence: "not-forced",
    summary: "partial comparability without convergence",
  });
  const artifact = substrate.createArtifactEnvelope({
    kind: "comparability-surface",
    label: "artifact-envelope",
    sourceIds: [comparison.id],
    payloadIds: [binding.id, estimate.id],
    provenance: {
      basisId: basis.id,
      emitterId: observer.id,
      source: "next-phase-test",
      note: "typed provenance test",
    },
  });

  assert.equal(comparison.comparability, "partial");
  assert.equal(comparison.convergence, "not-forced");
  assert.equal(artifact.locality, "shared-candidate");
  assert.equal(artifact.provenance.basisId, basis.id);
  assert.equal(artifact.provenance.emitterId, observer.id);
  assert.equal(substrate.state.artifacts.size, 1);
  assert.equal(substrate.state.comparisonSurfaces.size, 1);
});

test("phase-9: filesystem snapshot backend round-trips substrate state", async () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "snapshot-basis",
    dimensions: ["shape"],
  });
  const observer = substrate.createObserver({
    label: "snapshot-observer",
    basisId: basis.id,
  });
  const branch = substrate.createBranch({
    role: "observer",
    label: "snapshot-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const segment = substrate.openSegment({ branchId: branch.id });
  substrate.createHappening({
    branchId: branch.id,
    segmentId: segment.id,
    label: "snapshot-happening",
  });

  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-"));
  const snapshotPath = path.join(directory, "snapshot.json");
  await writeSubstrateSnapshot(substrate, snapshotPath);
  const loaded = await loadSubstrateFromSnapshot(snapshotPath);

  assert.equal(loaded.state.observers.size, 1);
  assert.equal(loaded.state.branches.size, 1);
  assert.equal(loaded.state.segments.size, 1);
  assert.equal(loaded.state.happenings.size, 1);
});

test("phase-7: continuity workstation prototype exercises multiple substrate concepts together", () => {
  const report = buildContinuityWorkstationReport();

  assert.equal(report.summary.timelineSegmentCount, 2);
  assert.equal(report.summary.artifactCount, 1);
  assert.equal(report.summary.comparisonSurfaceCount, 1);
  assert.ok(report.summary.forkedBranchId.startsWith("branch_"));
  assert.ok(report.summary.mergeBranchId.startsWith("branch_"));
  assert.ok(report.summary.portalId.startsWith("portal_"));
});
