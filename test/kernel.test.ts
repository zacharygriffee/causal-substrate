import test from "node:test";
import assert from "node:assert/strict";

import { Substrate } from "../src/index.js";

function createSubstrate() {
  let tick = 0;
  return new Substrate({
    now: () => `2026-04-19T00:00:${String(tick++).padStart(2, "0")}Z`,
  });
}

test("supports observer-relative wake/sleep continuity with carried nucleus", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "observer-basis",
    dimensions: ["motion", "shape"],
  });
  const observer = substrate.createObserver({
    label: "observer",
    basisId: basis.id,
  });
  const branch = substrate.createBranch({
    role: "observer",
    label: "observer-branch",
    basisId: basis.id,
    observerId: observer.id,
  });

  const first = substrate.openSegment({ branchId: branch.id });
  substrate.createHappening({
    branchId: branch.id,
    segmentId: first.id,
    label: "notable change",
  });

  const carry = substrate.sealSegment(first.id, {
    anchor: "observer-anchor",
  });
  const second = substrate.openSegment({
    branchId: branch.id,
    inheritedNucleusIds: [carry.nucleus.id],
  });

  assert.equal(substrate.listSegmentsForBranch(branch.id).length, 2);
  assert.equal(substrate.state.segments.get(first.id)?.status, "sleep");
  assert.deepEqual(second.inheritedNucleusIds, [carry.nucleus.id]);
});

test("keeps referents distinct from branches and allows explicit binding", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "tracking-basis",
    dimensions: ["position"],
  });
  const observer = substrate.createObserver({
    label: "observer",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "observer-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "cup-branch",
    basisId: basis.id,
  });
  const referent = substrate.createReferent({
    label: "cup",
    anchor: "cup-anchor",
    branchId: referentBranch.id,
  });

  const binding = substrate.createBinding({
    kind: "tracking",
    observerBranchId: observerBranch.id,
    referentBranchId: referentBranch.id,
    referentId: referent.id,
  });

  assert.notEqual(referent.id, referentBranch.id);
  assert.equal(binding.observerBranchId, observerBranch.id);
  assert.equal(binding.referentBranchId, referentBranch.id);
  assert.equal(binding.referentId, referent.id);
});

test("models contexts and portals as specialized structures rather than generic children", () => {
  const substrate = createSubstrate();
  const basis = substrate.createBasis({
    label: "spatial-basis",
    dimensions: ["inside", "outside"],
  });
  const outerBranch = substrate.createBranch({
    role: "context",
    label: "outer-context-branch",
    basisId: basis.id,
  });
  const outer = substrate.createContext({
    label: "outer",
    branchId: outerBranch.id,
  });
  const innerBranch = substrate.createBranch({
    role: "context",
    label: "inner-context-branch",
    basisId: basis.id,
  });
  const inner = substrate.createContext({
    label: "inner",
    branchId: innerBranch.id,
    parentContextId: outer.id,
  });
  const portalBranch = substrate.createBranch({
    role: "portal",
    label: "portal-branch",
    basisId: basis.id,
    contextId: inner.id,
  });
  const portal = substrate.createPortal({
    label: "window",
    branchId: portalBranch.id,
    sourceContextId: outer.id,
    targetContextId: inner.id,
    exposureRule: "light only",
    transform: "reduce external detail to illumination changes",
  });

  assert.equal(inner.parentContextId, outer.id);
  assert.equal(portal.sourceContextId, outer.id);
  assert.equal(portal.targetContextId, inner.id);
  assert.equal(portal.exposureRule, "light only");
});
