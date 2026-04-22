import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildMeshAgnosticAdapterSnapshot,
  openFirstSeriousCorestoreLab,
  Substrate,
} from "../src/index.js";
import type { ArtifactEnvelope } from "../src/index.js";

test("mesh-agnostic adapter reconstructs explicit continuity, inspectability, and derived discovery without importing transport semantics", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-mesh-agnostic-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["mesh-agnostic-adapter"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-21T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "mesh-agnostic-basis",
      dimensions: ["shape", "motion", "containment"],
    });
    const observer = substrate.createObserver({
      label: "adapter-observer",
      basisId: basis.id,
    });

    const campusBranch = substrate.createBranch({
      role: "context",
      label: "campus-context-branch",
      basisId: basis.id,
    });
    const campus = substrate.createContext({
      branchId: campusBranch.id,
      label: "campus",
      containmentPolicy: "candidate",
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "room-context-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
      parentContextId: campus.id,
      containmentPolicy: "primary-situated",
    });
    const hallwayBranch = substrate.createBranch({
      role: "context",
      label: "hallway-context-branch",
      basisId: basis.id,
    });
    const hallway = substrate.createContext({
      branchId: hallwayBranch.id,
      label: "hallway",
      parentContextId: campus.id,
      containmentPolicy: "candidate",
    });
    const quadBranch = substrate.createBranch({
      role: "context",
      label: "quad-context-branch",
      basisId: basis.id,
    });
    const quad = substrate.createContext({
      branchId: quadBranch.id,
      label: "quad",
      parentContextId: campus.id,
      containmentPolicy: "candidate",
    });

    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "adapter-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
      contextId: room.id,
    });
    const observerSegment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "adapter continuity segment",
    });
    const firstHappening = {
      id: "adapter-happening-1",
      branchId: observerBranch.id,
      segmentId: observerSegment.id,
      label: "initial local observation",
      triggerIds: [],
      observedAt: "2026-04-21T00:01:00.000Z",
    };
    const secondHappening = {
      id: "adapter-happening-2",
      branchId: observerBranch.id,
      segmentId: observerSegment.id,
      label: "continued local observation",
      triggerIds: [],
      observedAt: "2026-04-21T00:02:00.000Z",
    };
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: observerSegment.id,
      happening: firstHappening,
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: observerSegment.id,
      happening: secondHappening,
    });

    const portalBranch = substrate.createBranch({
      role: "portal",
      label: "doorway-portal-branch",
      basisId: basis.id,
      contextId: room.id,
    });
    const doorway = substrate.createPortal({
      branchId: portalBranch.id,
      label: "doorway",
      sourceContextId: hallway.id,
      targetContextId: room.id,
      exposureRule: "motion silhouettes only",
      transform: "reduce external detail to silhouettes",
    });

    const continuingReferentBranch = substrate.createBranch({
      role: "referent",
      label: "ball-referent-branch",
      basisId: basis.id,
      contextId: room.id,
    });
    const continuingReferent = substrate.createReferent({
      label: "ball",
      anchor: "ball-anchor",
      branchId: continuingReferentBranch.id,
    });
    const ambiguousReferentBranch = substrate.createBranch({
      role: "referent",
      label: "shadow-referent-branch",
      basisId: basis.id,
      contextId: hallway.id,
    });
    const ambiguousReferent = substrate.createReferent({
      label: "shadow",
      anchor: "shadow-anchor",
      branchId: ambiguousReferentBranch.id,
    });

    await lab.appendReferentState({
      referent: continuingReferent,
      estimate: {
        id: "adapter-estimate-ball",
        referentId: continuingReferent.id,
        branchId: continuingReferentBranch.id,
        estimatedAt: "2026-04-21T00:01:30.000Z",
        continuity: "continuing",
        reasoning: "ball remains plausibly present in the room",
        basedOnBindingIds: [],
      },
    });
    await lab.appendReferentState({
      referent: ambiguousReferent,
      estimate: {
        id: "adapter-estimate-shadow",
        referentId: ambiguousReferent.id,
        branchId: ambiguousReferentBranch.id,
        estimatedAt: "2026-04-21T00:01:45.000Z",
        continuity: "ambiguous",
        reasoning: "shadow remains unresolved under partial hallway exposure",
        basedOnBindingIds: [],
      },
    });

    const campusArtifact = substrate.createArtifactEnvelope({
      kind: "context-surface",
      label: "campus surface",
      sourceIds: [campusBranch.id],
      payloadIds: [campus.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        emittedAt: "2026-04-21T00:01:10.000Z",
        source: "mesh-agnostic-adapter-test",
      },
    });
    await lab.appendContextArtifact({
      artifact: campusArtifact,
      context: campus,
    });

    const roomArtifact = substrate.createArtifactEnvelope({
      kind: "context-surface",
      label: "room surface",
      sourceIds: [roomBranch.id],
      payloadIds: [room.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        emittedAt: "2026-04-21T00:01:20.000Z",
        source: "mesh-agnostic-adapter-test",
      },
    });
    await lab.appendContextArtifact({
      artifact: roomArtifact,
      context: room,
    });

    const portalArtifact = substrate.createArtifactEnvelope({
      kind: "portal-surface",
      label: "doorway surface",
      sourceIds: [doorway.id, hallway.id, room.id],
      payloadIds: [doorway.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        emittedAt: "2026-04-21T00:01:25.000Z",
        source: "mesh-agnostic-adapter-test",
      },
    });
    await lab.appendPortalArtifact({
      artifact: portalArtifact,
      portal: doorway,
    });

    const receiptArtifact: ArtifactEnvelope = {
      id: "artifact-receipt-adapter",
      kind: "receipt",
      label: "adapter receipt",
      sourceIds: [observerBranch.id, continuingReferent.id, ambiguousReferent.id],
      payloadIds: ["receipt-adapter-1"],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        emittedAt: "2026-04-21T00:02:10.000Z",
        source: "mesh-agnostic-adapter-test",
      },
    };
    await lab.appendReceiptArtifact({
      artifact: receiptArtifact,
      receipt: {
        id: "receipt-adapter-1",
        label: "adapter receipt",
        summary: "explicit continuity surface emitted without importing swarm semantics",
        sourceIds: [observerBranch.id, continuingReferent.id, ambiguousReferent.id],
      },
    });

    const contexts = new Map([
      [campus.id, campus],
      [room.id, room],
      [hallway.id, hallway],
      [quad.id, quad],
    ]);
    const portals = new Map([[doorway.id, doorway]]);

    const snapshot = await buildMeshAgnosticAdapterSnapshot({
      lab,
      observerBranch,
      contexts,
      portals,
      adjacentContextIds: [quad.id],
      concernOverlays: [
        {
          concern: "visual-tracking",
          scopeAnchorId: campus.id,
          quantization: "coarse",
          sourceIds: [observerBranch.id, campus.id],
        },
      ],
      continuityAsOf: "2026-04-21T00:02:10.000Z",
      transitionWindow: {
        fromAsOf: "2026-04-21T00:01:20.000Z",
        toAsOf: "2026-04-21T00:01:30.000Z",
      },
      discoverySalt: "identity",
      topicVersion: "v1",
    });

    assert.equal(snapshot.version, "v1");
    assert.deepEqual(snapshot.boundary, {
      adapterKind: "mesh-agnostic",
      sourceContinuityLocal: true,
      sharedArtifactsExplicit: true,
      transportOwnershipImported: false,
    });

    assert.equal(snapshot.continuity.primaryBranchId, observerBranch.id);
    assert.equal(snapshot.continuity.primaryContextId, room.id);
    assert.deepEqual(snapshot.continuity.portalVisibleContextIds, [hallway.id]);
    assert.deepEqual(snapshot.continuity.activeReferentIds, [
      continuingReferent.id,
      ambiguousReferent.id,
    ]);
    assert.equal(snapshot.continuity.continuityState, "mixed");
    assert.equal(snapshot.continuity.ambiguityState, "continuity");

    assert.deepEqual(
      snapshot.inspectability.contextClaims.map((claim) => claim.contextId).sort(),
      [campus.id, room.id].sort(),
    );
    assert.deepEqual(
      snapshot.inspectability.portalClaims.map((claim) => claim.portalId),
      [doorway.id],
    );
    assert.ok(
      snapshot.inspectability.artifactClaims.some(
        (claim) => claim.payloadType === "receipt" && claim.artifactId === receiptArtifact.id,
      ),
    );

    assert.deepEqual(
      snapshot.discovery.projections.map((projection) => projection.topicKind),
      [
        "context-self",
        "context-parent",
        "context-portal",
        "context-adjacent",
        "concern-coarse",
      ],
    );
    assert.equal(snapshot.discovery.primaryTopicKey, snapshot.discovery.topicKeys[0]);

    assert.ok(snapshot.transition);
    assert.equal(snapshot.transition?.transitionKind, "stay");
    assert.deepEqual(snapshot.transition?.reasonCodes, ["same-primary-branch-and-context"]);

    assert.equal("peerId" in snapshot.boundary, false);
    assert.equal("swarm" in snapshot.discovery, false);
  } finally {
    await lab.close();
  }
});
