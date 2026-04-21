import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  activeManagedCorestoreCount,
  openFirstSeriousCorestoreLab,
  reconstructBranchPicture,
  reconstructContinuitySituation,
  reconstructContextPortalTemporalReplay,
  reconstructInspectabilityPicture,
  reconstructLocalPicture,
  reconstructReferentPicture,
  reconstructTransitionDecision,
  Substrate,
  runExchangeArtifactLab,
  runMultiSegmentContinuityLab,
  runReferentTrackingLab,
} from "../src/index.js";

test("multi-segment continuity lab preserves several wake/sleep cycles without an index layer", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const report = await runMultiSegmentContinuityLab({
    storageDir: directory,
    namespaceParts: ["multi-segment"],
    now: () => "2026-04-20T00:00:00.000Z",
  });

  assert.equal(report.replay.branchHappeningCount, 3);
  assert.equal(report.replay.sleepCapsuleCount, 3);
  assert.equal(report.carriedNucleusIds.length, 3);
  assert.equal(report.replay.segmentIds.length, 3);
  assert.equal(report.replay.branchSurfaces.length, 1);
  assert.deepEqual(report.replay.branchSurfaces[0]?.branchHappeningIds.length, 3);
  assert.deepEqual(report.replay.branchSurfaces[0]?.sleepCapsuleIds.length, 3);
  assert.equal(report.replay.branchSurfaces[0]?.latestHappeningLabel, "continuity event 3");
  assert.equal(report.replay.branchSurfaces[0]?.latestSleepAnchor, "continuity-anchor-3");
  assert.deepEqual(report.replay.contextSurfaces, []);
  assert.deepEqual(report.replay.portalSurfaces, []);
});

test("referent tracking lab preserves continuity history as append-only state records", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const report = await runReferentTrackingLab({
    storageDir: directory,
    namespaceParts: ["referent-history"],
    now: () => "2026-04-20T00:00:00.000Z",
  });

  assert.deepEqual(report.continuityHistory, ["continuing", "ambiguous", "broken"]);
  assert.equal(report.replay.referentStateCount, 3);
  assert.equal(report.replay.referentIds.length, 1);
  const latest = Object.values(report.replay.latestContinuityByReferentId);
  assert.deepEqual(latest, ["broken"]);
  assert.equal(report.replay.referentSurfaces.length, 1);
  assert.deepEqual(report.replay.referentSurfaces[0]?.continuityHistory, [
    "continuing",
    "ambiguous",
    "broken",
  ]);
  assert.equal(
    report.replay.referentSurfaces[0]?.latestReasoning,
    "broken continuity judgment preserved as append-only history",
  );
});

test("exchange artifact lab emits explicit view, binding, lineage claim, and receipt records", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const report = await runExchangeArtifactLab({
    storageDir: directory,
    namespaceParts: ["exchange-artifacts"],
    now: () => "2026-04-20T00:00:00.000Z",
  });

  assert.deepEqual(report.payloadKinds, ["view", "binding", "lineage-claim", "receipt"]);
  assert.equal(report.replay.exchangeArtifactCount, 4);
  assert.deepEqual(report.replay.exchangePayloadKinds, [
    "view",
    "binding",
    "lineage-claim",
    "receipt",
  ]);
  assert.equal(report.replay.artifactSurfaces.length, 4);
  const receiptSurface = report.replay.artifactSurfaces.find(
    (artifact) => artifact.payloadType === "receipt",
  );
  assert.ok(receiptSurface);
  assert.equal(receiptSurface.payloadSourceIds.length, 3);
  assert.deepEqual(receiptSurface.payloadSourceIds, receiptSurface.sourceIds);
  assert.equal(
    receiptSurface.summary,
    "Explicit artifact emission occurred without sharing raw continuity.",
  );
  assert.deepEqual(report.replay.contextSurfaces, []);
  assert.deepEqual(report.replay.portalSurfaces, []);
});

test("cross-core reconstruction can summarize known-core replay without Hyperbee", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["reconstruction"],
  });

  try {
    await lab.appendBranchHappening({
      branchId: "branch-room",
      segmentId: "segment-room-1",
      happening: {
        id: "happening-room-1",
        branchId: "branch-room",
        segmentId: "segment-room-1",
        label: "room event",
        triggerIds: [],
        observedAt: "2026-04-20T00:00:00.000Z",
      },
    });
    await lab.appendSleepCapsule({
      branchId: "branch-room",
      segment: {
        id: "segment-room-1",
        branchId: "branch-room",
        index: 0,
        status: "sleep",
        openedAt: "2026-04-20T00:00:00.000Z",
        closedAt: "2026-04-20T00:05:00.000Z",
        inheritedNucleusIds: [],
        happeningIds: ["happening-room-1"],
      },
      nucleus: {
        id: "nucleus-room-1",
        branchId: "branch-room",
        sourceSegmentId: "segment-room-1",
        inheritedNucleusIds: [],
        anchor: "room-anchor-1",
      },
    });
    await lab.appendReferentState({
      referent: {
        id: "referent-room-1",
        label: "room referent",
        anchor: "room-anchor",
        branchId: "referent-branch-room-1",
      },
      estimate: {
        id: "estimate-room-1",
        referentId: "referent-room-1",
        branchId: "referent-branch-room-1",
        estimatedAt: "2026-04-20T00:06:00.000Z",
        continuity: "continuing",
        reasoning: "Still plausible",
        basedOnBindingIds: [],
      },
    });
    await lab.appendReceiptArtifact({
      artifact: {
        id: "artifact-room-1",
        kind: "receipt",
        label: "room receipt",
        sourceIds: ["branch-room", "referent-room-1"],
        payloadIds: ["receipt-room-1"],
        locality: "shared-candidate",
        provenance: {
          emittedAt: "2026-04-20T00:07:00.000Z",
          source: "test",
        },
      },
      receipt: {
        id: "receipt-room-1",
        label: "room receipt",
        summary: "Known-core replay is enough here.",
        sourceIds: ["branch-room", "referent-room-1"],
      },
    });

    const replay = await reconstructLocalPicture(lab);
    const branchPicture = await reconstructBranchPicture(lab, "branch-room");
    const referentPicture = await reconstructReferentPicture(lab, "referent-room-1");
    const inspectability = await reconstructInspectabilityPicture(lab);
    assert.equal(replay.branchHappeningCount, 1);
    assert.equal(replay.sleepCapsuleCount, 1);
    assert.equal(replay.referentStateCount, 1);
    assert.equal(replay.exchangeArtifactCount, 1);
    assert.deepEqual(replay.branchIds, ["branch-room", "referent-branch-room-1"]);
    assert.deepEqual(replay.referentIds, ["referent-room-1"]);
    assert.deepEqual(replay.exchangePayloadKinds, ["receipt"]);
    assert.deepEqual(replay.latestContinuityByReferentId, {
      "referent-room-1": "continuing",
    });
    assert.deepEqual(replay.branchSurfaces, [
      {
        branchId: "branch-room",
        segmentIds: ["segment-room-1"],
        branchHappeningIds: ["happening-room-1"],
        sleepCapsuleIds: ["nucleus-room-1"],
        branchHappeningCount: 1,
        sleepCapsuleCount: 1,
        latestSegmentId: "segment-room-1",
        latestHappeningLabel: "room event",
        latestHappeningObservedAt: "2026-04-20T00:00:00.000Z",
        latestSleepAnchor: "room-anchor-1",
      },
    ]);
    assert.deepEqual(replay.referentSurfaces, [
      {
        referentId: "referent-room-1",
        branchId: "referent-branch-room-1",
        anchor: "room-anchor",
        estimateIds: ["estimate-room-1"],
        continuityHistory: ["continuing"],
        latestContinuity: "continuing",
        reasoningHistory: ["Still plausible"],
        latestReasoning: "Still plausible",
        latestEstimatedAt: "2026-04-20T00:06:00.000Z",
        latestBasedOnBindingIds: [],
      },
    ]);
    assert.deepEqual(replay.artifactSurfaces, [
      {
        artifactId: "artifact-room-1",
        kind: "receipt",
        payloadType: "receipt",
        payloadId: "receipt-room-1",
        sourceIds: ["branch-room", "referent-room-1"],
        payloadSourceIds: ["branch-room", "referent-room-1"],
        locality: "shared-candidate",
        emittedAt: "2026-04-20T00:07:00.000Z",
        provenanceSource: "test",
        summary: "Known-core replay is enough here.",
      },
    ]);
    assert.deepEqual(branchPicture, {
      branchId: "branch-room",
      happenings: [
        {
          schema: "causal-substrate/corestore-record/v1",
          schemaVersion: 1,
          recordId: "happening-room-1",
          recordType: "branch-happening",
          recordedAt: "2026-04-20T00:00:00.000Z",
          branchId: "branch-room",
          segmentId: "segment-room-1",
          happening: {
            id: "happening-room-1",
            branchId: "branch-room",
            segmentId: "segment-room-1",
            label: "room event",
            triggerIds: [],
            observedAt: "2026-04-20T00:00:00.000Z",
          },
        },
      ],
      sleepCapsules: [
        {
          schema: "causal-substrate/corestore-record/v1",
          schemaVersion: 1,
          recordId: "nucleus-room-1",
          recordType: "sleep-capsule",
          recordedAt: "2026-04-20T00:05:00.000Z",
          branchId: "branch-room",
          segmentId: "segment-room-1",
          nucleusId: "nucleus-room-1",
          segment: {
            id: "segment-room-1",
            branchId: "branch-room",
            index: 0,
            status: "sleep",
            openedAt: "2026-04-20T00:00:00.000Z",
            closedAt: "2026-04-20T00:05:00.000Z",
            inheritedNucleusIds: [],
            happeningIds: ["happening-room-1"],
          },
          nucleus: {
            id: "nucleus-room-1",
            branchId: "branch-room",
            sourceSegmentId: "segment-room-1",
            inheritedNucleusIds: [],
            anchor: "room-anchor-1",
          },
        },
      ],
      latestSegmentId: "segment-room-1",
    });
    assert.deepEqual(referentPicture, {
      referentId: "referent-room-1",
      branchId: "referent-branch-room-1",
      anchor: "room-anchor",
      estimates: [
        {
          schema: "causal-substrate/corestore-record/v1",
          schemaVersion: 1,
          recordId: "estimate-room-1",
          recordType: "referent-state-estimate",
          recordedAt: "2026-04-20T00:06:00.000Z",
          branchId: "referent-branch-room-1",
          referentId: "referent-room-1",
          anchor: "room-anchor",
          continuity: "continuing",
          referent: {
            id: "referent-room-1",
            label: "room referent",
            anchor: "room-anchor",
            branchId: "referent-branch-room-1",
          },
          estimate: {
            id: "estimate-room-1",
            referentId: "referent-room-1",
            branchId: "referent-branch-room-1",
            estimatedAt: "2026-04-20T00:06:00.000Z",
            continuity: "continuing",
            reasoning: "Still plausible",
            basedOnBindingIds: [],
          },
        },
      ],
      continuityHistory: ["continuing"],
      latestContinuity: "continuing",
    });
    assert.deepEqual(inspectability, {
      namespaceParts: [
        "causal-substrate",
        "v1",
        "first-serious-causal-lab",
        "reconstruction",
      ],
      branchClaims: [
        {
          branchId: "branch-room",
          latestSegmentId: "segment-room-1",
          latestHappeningId: "happening-room-1",
          latestHappeningLabel: "room event",
          latestHappeningObservedAt: "2026-04-20T00:00:00.000Z",
          latestSleepCapsuleId: "nucleus-room-1",
          latestSleepAnchor: "room-anchor-1",
        },
      ],
      referentClaims: [
        {
          referentId: "referent-room-1",
          branchId: "referent-branch-room-1",
          anchor: "room-anchor",
          continuity: "continuing",
          reasoning: "Still plausible",
          estimatedAt: "2026-04-20T00:06:00.000Z",
          basedOnBindingIds: [],
          sourceRecordId: "estimate-room-1",
        },
      ],
      contextClaims: [],
      portalClaims: [],
      artifactClaims: [
        {
          artifactId: "artifact-room-1",
          kind: "receipt",
          payloadType: "receipt",
          payloadId: "receipt-room-1",
          emittedAt: "2026-04-20T00:07:00.000Z",
          sourceIds: ["branch-room", "referent-room-1"],
          payloadSourceIds: ["branch-room", "referent-room-1"],
          provenanceSource: "test",
          summary: "Known-core replay is enough here.",
        },
      ],
    });
  } finally {
    await lab.close();
  }

  assert.equal(activeManagedCorestoreCount(), 0);
});

test("persisted context and portal declarations are replayable and inspectable without Hyperbee", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["context-portal-inspectability"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "context-portal-basis",
      dimensions: ["containment", "exposure"],
    });
    const observer = substrate.createObserver({
      label: "context-observer",
      basisId: basis.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "room-context-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
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
      containmentPolicy: "adjacent-visible",
    });
    const portalBranch = substrate.createBranch({
      role: "portal",
      label: "hallway-to-room-portal-branch",
      basisId: basis.id,
    });
    const portal = substrate.createPortal({
      branchId: portalBranch.id,
      label: "hallway-to-room",
      sourceContextId: hallway.id,
      targetContextId: room.id,
      exposureRule: "selective visibility",
      transform: "room-facing projection",
    });

    const roomArtifact = substrate.createArtifactEnvelope({
      kind: "context-surface",
      label: "room-context-artifact",
      sourceIds: [roomBranch.id],
      payloadIds: [room.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "context-portal-test",
      },
    });
    await lab.appendContextArtifact({
      artifact: roomArtifact,
      context: room,
    });

    const portalArtifact = substrate.createArtifactEnvelope({
      kind: "portal-surface",
      label: "hallway-to-room-portal-artifact",
      sourceIds: [portalBranch.id, hallway.id, room.id],
      payloadIds: [portal.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "context-portal-test",
      },
    });
    await lab.appendPortalArtifact({
      artifact: portalArtifact,
      portal,
    });

    const replay = await reconstructLocalPicture(lab);
    const inspectability = await reconstructInspectabilityPicture(lab);

    assert.deepEqual(replay.exchangePayloadKinds, ["context", "portal"]);
    assert.deepEqual(replay.contextSurfaces, [
      {
        contextId: room.id,
        branchId: roomBranch.id,
        label: "room",
        containmentPolicy: "primary-situated",
        artifactId: roomArtifact.id,
      },
    ]);
    assert.deepEqual(replay.portalSurfaces, [
      {
        portalId: portal.id,
        branchId: portalBranch.id,
        label: "hallway-to-room",
        sourceContextId: hallway.id,
        targetContextId: room.id,
        exposureRule: "selective visibility",
        transform: "room-facing projection",
        artifactId: portalArtifact.id,
      },
    ]);
    assert.deepEqual(inspectability.contextClaims, [
      {
        contextId: room.id,
        branchId: roomBranch.id,
        label: "room",
        artifactId: roomArtifact.id,
        containmentPolicy: "primary-situated",
      },
    ]);
    assert.deepEqual(inspectability.portalClaims, [
      {
        portalId: portal.id,
        branchId: portalBranch.id,
        label: "hallway-to-room",
        sourceContextId: hallway.id,
        targetContextId: room.id,
        exposureRule: "selective visibility",
        artifactId: portalArtifact.id,
        transform: "room-facing projection",
      },
    ]);
    assert.equal(
      replay.artifactSurfaces.find((surface) => surface.payloadType === "portal")?.summary,
      "portal declaration: hallway-to-room",
    );
  } finally {
    await lab.close();
  }
});

test("compact continuity situation reconstructs primary branch, primary context, portal visibility, and active referents from persisted records", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["continuity-situation"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "continuity-situation-basis",
      dimensions: ["containment", "visibility", "tracking"],
    });
    const observer = substrate.createObserver({
      label: "situation-observer",
      basisId: basis.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "room-context-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
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
      containmentPolicy: "adjacent-visible",
    });
    const portalBranch = substrate.createBranch({
      role: "portal",
      label: "hallway-to-room-portal-branch",
      basisId: basis.id,
    });
    const portal = substrate.createPortal({
      branchId: portalBranch.id,
      label: "hallway-to-room",
      sourceContextId: hallway.id,
      targetContextId: room.id,
      exposureRule: "selective visibility",
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "situation-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });

    const segment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "active wake",
    });
    const happening = substrate.createHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      label: "room activity",
      triggerIds: [],
      salience: 0.72,
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening,
    });

    const roomArtifact = substrate.createArtifactEnvelope({
      kind: "context-surface",
      label: "room-context-artifact",
      sourceIds: [roomBranch.id],
      payloadIds: [room.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "continuity-situation-test",
      },
    });
    await lab.appendContextArtifact({
      artifact: roomArtifact,
      context: room,
    });

    const portalArtifact = substrate.createArtifactEnvelope({
      kind: "portal-surface",
      label: "hallway-to-room-portal-artifact",
      sourceIds: [portalBranch.id, hallway.id, room.id],
      payloadIds: [portal.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "continuity-situation-test",
      },
    });
    await lab.appendPortalArtifact({
      artifact: portalArtifact,
      portal,
    });

    const continuingReferentBranch = substrate.createBranch({
      role: "referent",
      label: "continuing-ball-branch",
      basisId: basis.id,
    });
    const continuingReferent = substrate.createReferent({
      label: "continuing-ball",
      anchor: "ball-anchor",
      branchId: continuingReferentBranch.id,
    });
    const ambiguousReferentBranch = substrate.createBranch({
      role: "referent",
      label: "ambiguous-shadow-branch",
      basisId: basis.id,
    });
    const ambiguousReferent = substrate.createReferent({
      label: "ambiguous-shadow",
      anchor: "shadow-anchor",
      branchId: ambiguousReferentBranch.id,
    });
    const brokenReferentBranch = substrate.createBranch({
      role: "referent",
      label: "broken-noise-branch",
      basisId: basis.id,
    });
    const brokenReferent = substrate.createReferent({
      label: "broken-noise",
      anchor: "noise-anchor",
      branchId: brokenReferentBranch.id,
    });

    await lab.appendReferentState({
      referent: continuingReferent,
      estimate: {
        id: "estimate-continuing-ball",
        referentId: continuingReferent.id,
        branchId: continuingReferentBranch.id,
        estimatedAt: "2026-04-20T00:03:00.000Z",
        continuity: "continuing",
        reasoning: "ball remains plausibly present",
        basedOnBindingIds: [],
      },
    });
    await lab.appendReferentState({
      referent: ambiguousReferent,
      estimate: {
        id: "estimate-ambiguous-shadow",
        referentId: ambiguousReferent.id,
        branchId: ambiguousReferentBranch.id,
        estimatedAt: "2026-04-20T00:04:00.000Z",
        continuity: "ambiguous",
        reasoning: "shadow remains unresolved under degraded basis",
        basedOnBindingIds: [],
      },
    });
    await lab.appendReferentState({
      referent: brokenReferent,
      estimate: {
        id: "estimate-broken-noise",
        referentId: brokenReferent.id,
        branchId: brokenReferentBranch.id,
        estimatedAt: "2026-04-20T00:05:00.000Z",
        continuity: "broken",
        reasoning: "noise continuity no longer plausible",
        basedOnBindingIds: [],
      },
    });

    const situation = await reconstructContinuitySituation(lab);
    assert.deepEqual(situation, {
      namespaceParts: [
        "causal-substrate",
        "v1",
        "first-serious-causal-lab",
        "continuity-situation",
      ],
      primaryBranchId: observerBranch.id,
      primaryContextId: room.id,
      portalVisibleContextIds: [hallway.id],
      activeReferentIds: [continuingReferent.id, ambiguousReferent.id],
      continuityState: "mixed",
      ambiguityState: "continuity",
      reasonCodes: [
        "latest-branch-activity",
        "primary-context-declared",
        "portal-visible-contexts",
        "latest-referent-continuity",
        "broken-referents-excluded-from-active",
        "continuity-ambiguity-present",
      ],
      evidenceSourceIds: [
        happening.id,
        roomArtifact.id,
        portalArtifact.id,
        "estimate-continuing-ball",
        "estimate-ambiguous-shadow",
        "estimate-broken-noise",
      ],
    });
  } finally {
    await lab.close();
  }
});

test("compact continuity situation preserves context-placement ambiguity when no primary context can be resolved", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["continuity-situation-context-ambiguity"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "context-ambiguity-basis",
      dimensions: ["containment", "tracking"],
    });
    const observer = substrate.createObserver({
      label: "ambiguity-observer",
      basisId: basis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "ambiguity-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "room-context-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
      containmentPolicy: "candidate",
    });
    const yardBranch = substrate.createBranch({
      role: "context",
      label: "yard-context-branch",
      basisId: basis.id,
    });
    const yard = substrate.createContext({
      branchId: yardBranch.id,
      label: "yard",
      containmentPolicy: "candidate",
    });

    const segment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "ambiguous placement wake",
    });
    const happening = substrate.createHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      label: "ambiguous placement",
      triggerIds: [],
      salience: 0.61,
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening,
    });

    const roomArtifact = substrate.createArtifactEnvelope({
      kind: "context-surface",
      label: "room-context-artifact",
      sourceIds: [roomBranch.id],
      payloadIds: [room.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "continuity-situation-context-ambiguity-test",
      },
    });
    await lab.appendContextArtifact({
      artifact: roomArtifact,
      context: room,
    });

    const yardArtifact = substrate.createArtifactEnvelope({
      kind: "context-surface",
      label: "yard-context-artifact",
      sourceIds: [yardBranch.id],
      payloadIds: [yard.id],
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "continuity-situation-context-ambiguity-test",
      },
    });
    await lab.appendContextArtifact({
      artifact: yardArtifact,
      context: yard,
    });

    const situation = await reconstructContinuitySituation(lab);
    assert.deepEqual(situation, {
      namespaceParts: [
        "causal-substrate",
        "v1",
        "first-serious-causal-lab",
        "continuity-situation-context-ambiguity",
      ],
      primaryBranchId: observerBranch.id,
      portalVisibleContextIds: [],
      activeReferentIds: [],
      continuityState: "none",
      ambiguityState: "context-placement",
      reasonCodes: ["latest-branch-activity", "primary-context-ambiguity"],
      evidenceSourceIds: [happening.id, roomArtifact.id, yardArtifact.id],
    });
  } finally {
    await lab.close();
  }
});

test("transition decision stays within the same branch and context when continuity pressure remains local", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["transition-stay"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "transition-stay-basis",
      dimensions: ["tracking", "containment"],
    });
    const observer = substrate.createObserver({
      label: "stay-observer",
      basisId: basis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "stay-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "stay-room-context-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
      containmentPolicy: "primary-situated",
    });
    const roomArtifact = substrate.createArtifactEnvelope({
      kind: "context-surface",
      label: "stay-room-context-artifact",
      sourceIds: [roomBranch.id],
      payloadIds: [room.id],
      provenance: {
        emittedAt: "2026-04-20T00:00:00.000Z",
        basisId: basis.id,
        emitterId: observer.id,
        source: "transition-stay-test",
      },
    });
    await lab.appendContextArtifact({
      artifact: roomArtifact,
      context: room,
    });

    const segment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "stay wake",
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening: {
        id: "transition-stay-happening-1",
        branchId: observerBranch.id,
        segmentId: segment.id,
        label: "initial observation",
        triggerIds: [],
        observedAt: "2026-04-20T00:01:00.000Z",
      },
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening: {
        id: "transition-stay-happening-2",
        branchId: observerBranch.id,
        segmentId: segment.id,
        label: "continued local observation",
        triggerIds: [],
        observedAt: "2026-04-20T00:02:00.000Z",
      },
    });

    const decision = await reconstructTransitionDecision(lab, {
      fromAsOf: "2026-04-20T00:01:00.000Z",
      toAsOf: "2026-04-20T00:02:00.000Z",
    });
    assert.equal(decision.transitionKind, "stay");
    assert.deepEqual(decision.reasonCodes, ["same-primary-branch-and-context"]);
    assert.equal(decision.fromSituation.primaryBranchId, observerBranch.id);
    assert.equal(decision.toSituation.primaryBranchId, observerBranch.id);
    assert.equal(decision.fromSituation.primaryContextId, room.id);
    assert.equal(decision.toSituation.primaryContextId, room.id);
  } finally {
    await lab.close();
  }
});

test("transition decision becomes branch when primary activity shifts to a different branch without a portal-backed context crossing", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["transition-branch"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "transition-branch-basis",
      dimensions: ["tracking"],
    });
    const observer = substrate.createObserver({
      label: "branch-observer",
      basisId: basis.id,
    });
    const firstBranch = substrate.createBranch({
      role: "observer",
      label: "branch-one",
      basisId: basis.id,
      observerId: observer.id,
    });
    const secondBranch = substrate.createBranch({
      role: "observer",
      label: "branch-two",
      basisId: basis.id,
      observerId: observer.id,
    });

    const firstSegment = substrate.openSegment({
      branchId: firstBranch.id,
      inheritedNucleusIds: [],
      summary: "branch one wake",
    });
    await lab.appendBranchHappening({
      branchId: firstBranch.id,
      segmentId: firstSegment.id,
      happening: {
        id: "transition-branch-happening-1",
        branchId: firstBranch.id,
        segmentId: firstSegment.id,
        label: "branch one active",
        triggerIds: [],
        observedAt: "2026-04-20T00:01:00.000Z",
      },
    });

    const secondSegment = substrate.openSegment({
      branchId: secondBranch.id,
      inheritedNucleusIds: [],
      summary: "branch two wake",
    });
    await lab.appendBranchHappening({
      branchId: secondBranch.id,
      segmentId: secondSegment.id,
      happening: {
        id: "transition-branch-happening-2",
        branchId: secondBranch.id,
        segmentId: secondSegment.id,
        label: "branch two active",
        triggerIds: [],
        observedAt: "2026-04-20T00:02:00.000Z",
      },
    });

    const decision = await reconstructTransitionDecision(lab, {
      fromAsOf: "2026-04-20T00:01:00.000Z",
      toAsOf: "2026-04-20T00:02:00.000Z",
    });
    assert.equal(decision.transitionKind, "branch");
    assert.deepEqual(decision.reasonCodes, ["primary-branch-shift"]);
    assert.equal(decision.fromSituation.primaryBranchId, firstBranch.id);
    assert.equal(decision.toSituation.primaryBranchId, secondBranch.id);
  } finally {
    await lab.close();
  }
});

test("transition decision becomes cross-context when primary context shifts across a portal-visible boundary", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["transition-cross-context"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "transition-cross-context-basis",
      dimensions: ["containment", "visibility"],
    });
    const observer = substrate.createObserver({
      label: "cross-context-observer",
      basisId: basis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "cross-context-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "cross-context-room-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
      containmentPolicy: "primary-situated",
    });
    const hallwayBranch = substrate.createBranch({
      role: "context",
      label: "cross-context-hallway-branch",
      basisId: basis.id,
    });
    const hallway = substrate.createContext({
      branchId: hallwayBranch.id,
      label: "hallway",
      containmentPolicy: "adjacent-visible",
    });
    const portalBranch = substrate.createBranch({
      role: "portal",
      label: "cross-context-portal-branch",
      basisId: basis.id,
    });
    const portal = substrate.createPortal({
      branchId: portalBranch.id,
      label: "hallway-to-room",
      sourceContextId: hallway.id,
      targetContextId: room.id,
      exposureRule: "selective visibility",
    });

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "cross-context-room-artifact",
        sourceIds: [roomBranch.id],
        payloadIds: [room.id],
        provenance: {
          emittedAt: "2026-04-20T00:00:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "transition-cross-context-test",
        },
      }),
      context: room,
    });
    await lab.appendPortalArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "portal-surface",
        label: "cross-context-portal-artifact",
        sourceIds: [portalBranch.id, hallway.id, room.id],
        payloadIds: [portal.id],
        provenance: {
          emittedAt: "2026-04-20T00:01:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "transition-cross-context-test",
        },
      }),
      portal,
    });

    const segment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "cross-context wake",
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening: {
        id: "transition-cross-context-happening",
        branchId: observerBranch.id,
        segmentId: segment.id,
        label: "doorway attention",
        triggerIds: [],
        observedAt: "2026-04-20T00:01:30.000Z",
      },
    });

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "cross-context-hallway-artifact",
        sourceIds: [hallwayBranch.id],
        payloadIds: [hallway.id],
        provenance: {
          emittedAt: "2026-04-20T00:02:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "transition-cross-context-test",
        },
      }),
      context: {
        ...hallway,
        containmentPolicy: "primary-situated",
      },
    });

    const decision = await reconstructTransitionDecision(lab, {
      fromAsOf: "2026-04-20T00:01:30.000Z",
      toAsOf: "2026-04-20T00:02:00.000Z",
    });
    assert.equal(decision.transitionKind, "cross-context");
    assert.deepEqual(decision.reasonCodes, ["portal-linked-context-shift"]);
    assert.equal(decision.fromSituation.primaryContextId, room.id);
    assert.equal(decision.toSituation.primaryContextId, hallway.id);
    assert.ok(decision.fromSituation.portalVisibleContextIds.includes(hallway.id));
  } finally {
    await lab.close();
  }
});

test("transition decision becomes ambiguous when target continuity situation cannot resolve primary placement", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["transition-ambiguous"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "transition-ambiguous-basis",
      dimensions: ["containment"],
    });
    const observer = substrate.createObserver({
      label: "ambiguous-transition-observer",
      basisId: basis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "ambiguous-transition-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "ambiguous-transition-room-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
      containmentPolicy: "candidate",
    });
    const yardBranch = substrate.createBranch({
      role: "context",
      label: "ambiguous-transition-yard-branch",
      basisId: basis.id,
    });
    const yard = substrate.createContext({
      branchId: yardBranch.id,
      label: "yard",
      containmentPolicy: "candidate",
    });

    const segment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "ambiguous transition wake",
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening: {
        id: "transition-ambiguous-happening",
        branchId: observerBranch.id,
        segmentId: segment.id,
        label: "threshold placement",
        triggerIds: [],
        observedAt: "2026-04-20T00:01:00.000Z",
      },
    });

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "ambiguous-transition-room-artifact",
        sourceIds: [roomBranch.id],
        payloadIds: [room.id],
        provenance: {
          emittedAt: "2026-04-20T00:00:30.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "transition-ambiguous-test",
        },
      }),
      context: room,
    });

    const decisionBefore = await reconstructTransitionDecision(lab, {
      fromAsOf: "2026-04-20T00:00:30.000Z",
      toAsOf: "2026-04-20T00:01:00.000Z",
    });
    assert.equal(decisionBefore.transitionKind, "stay");

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "ambiguous-transition-yard-artifact",
        sourceIds: [yardBranch.id],
        payloadIds: [yard.id],
        provenance: {
          emittedAt: "2026-04-20T00:02:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "transition-ambiguous-test",
        },
      }),
      context: yard,
    });

    const decision = await reconstructTransitionDecision(lab, {
      fromAsOf: "2026-04-20T00:01:00.000Z",
      toAsOf: "2026-04-20T00:02:00.000Z",
    });
    assert.equal(decision.transitionKind, "ambiguous");
    assert.deepEqual(decision.reasonCodes, ["target-situation-ambiguous"]);
    assert.equal(decision.toSituation.ambiguityState, "context-placement");
  } finally {
    await lab.close();
  }
});

test("inspectability preserves an active referent across a portal-backed context shift", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["inspectability-active-referent-cross-context"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "inspectability-active-referent-basis",
      dimensions: ["containment", "visibility", "tracking"],
    });
    const observer = substrate.createObserver({
      label: "active-referent-observer",
      basisId: basis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "active-referent-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "active-referent-room-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
      containmentPolicy: "primary-situated",
    });
    const hallwayBranch = substrate.createBranch({
      role: "context",
      label: "active-referent-hallway-branch",
      basisId: basis.id,
    });
    const hallway = substrate.createContext({
      branchId: hallwayBranch.id,
      label: "hallway",
      containmentPolicy: "adjacent-visible",
    });
    const portalBranch = substrate.createBranch({
      role: "portal",
      label: "active-referent-portal-branch",
      basisId: basis.id,
    });
    const portal = substrate.createPortal({
      branchId: portalBranch.id,
      label: "hallway-to-room",
      sourceContextId: hallway.id,
      targetContextId: room.id,
      exposureRule: "selective visibility",
    });
    const ballBranch = substrate.createBranch({
      role: "referent",
      label: "active-referent-ball-branch",
      basisId: basis.id,
    });
    const ball = substrate.createReferent({
      label: "ball",
      anchor: "ball-anchor",
      branchId: ballBranch.id,
    });

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "active-referent-room-artifact",
        sourceIds: [roomBranch.id],
        payloadIds: [room.id],
        provenance: {
          emittedAt: "2026-04-20T00:00:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "inspectability-active-referent-test",
        },
      }),
      context: room,
    });
    await lab.appendPortalArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "portal-surface",
        label: "active-referent-portal-artifact",
        sourceIds: [portalBranch.id, hallway.id, room.id],
        payloadIds: [portal.id],
        provenance: {
          emittedAt: "2026-04-20T00:00:30.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "inspectability-active-referent-test",
        },
      }),
      portal,
    });

    const segment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "active referent cross-context wake",
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening: {
        id: "active-referent-cross-context-happening",
        branchId: observerBranch.id,
        segmentId: segment.id,
        label: "ball tracked through doorway",
        triggerIds: [],
        observedAt: "2026-04-20T00:01:00.000Z",
      },
    });

    await lab.appendReferentState({
      referent: ball,
      estimate: {
        id: "active-referent-room-estimate",
        referentId: ball.id,
        branchId: ballBranch.id,
        estimatedAt: "2026-04-20T00:01:00.000Z",
        continuity: "continuing",
        reasoning: "ball remains active in room context",
        basedOnBindingIds: [],
      },
    });

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "active-referent-hallway-artifact",
        sourceIds: [hallwayBranch.id],
        payloadIds: [hallway.id],
        provenance: {
          emittedAt: "2026-04-20T00:02:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "inspectability-active-referent-test",
        },
      }),
      context: {
        ...hallway,
        containmentPolicy: "primary-situated",
      },
    });

    await lab.appendReferentState({
      referent: ball,
      estimate: {
        id: "active-referent-hallway-estimate",
        referentId: ball.id,
        branchId: ballBranch.id,
        estimatedAt: "2026-04-20T00:02:00.000Z",
        continuity: "continuing",
        reasoning: "ball remains active through hallway transition",
        basedOnBindingIds: [],
      },
    });

    const decision = await reconstructTransitionDecision(lab, {
      fromAsOf: "2026-04-20T00:01:00.000Z",
      toAsOf: "2026-04-20T00:02:00.000Z",
    });
    assert.equal(decision.transitionKind, "cross-context");
    assert.deepEqual(decision.reasonCodes, ["portal-linked-context-shift"]);
    assert.deepEqual(decision.fromSituation.activeReferentIds, [ball.id]);
    assert.deepEqual(decision.toSituation.activeReferentIds, [ball.id]);
    assert.equal(decision.fromSituation.primaryContextId, room.id);
    assert.equal(decision.toSituation.primaryContextId, hallway.id);
  } finally {
    await lab.close();
  }
});

test("context and portal temporal replay stays ordered and preserves primary context across a sleep boundary", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["context-portal-temporal-replay"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "context-portal-temporal-basis",
      dimensions: ["containment", "visibility"],
    });
    const observer = substrate.createObserver({
      label: "temporal-context-observer",
      basisId: basis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "temporal-context-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "temporal-room-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
      containmentPolicy: "primary-situated",
    });
    const hallwayBranch = substrate.createBranch({
      role: "context",
      label: "temporal-hallway-branch",
      basisId: basis.id,
    });
    const hallway = substrate.createContext({
      branchId: hallwayBranch.id,
      label: "hallway",
      containmentPolicy: "adjacent-visible",
    });
    const portalBranch = substrate.createBranch({
      role: "portal",
      label: "temporal-portal-branch",
      basisId: basis.id,
    });
    const portal = substrate.createPortal({
      branchId: portalBranch.id,
      label: "hallway-to-room",
      sourceContextId: hallway.id,
      targetContextId: room.id,
      exposureRule: "selective visibility",
    });

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "temporal-room-artifact",
        sourceIds: [roomBranch.id],
        payloadIds: [room.id],
        provenance: {
          emittedAt: "2026-04-20T00:00:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "context-portal-temporal-test",
        },
      }),
      context: room,
    });
    await lab.appendPortalArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "portal-surface",
        label: "temporal-portal-artifact",
        sourceIds: [portalBranch.id, hallway.id, room.id],
        payloadIds: [portal.id],
        provenance: {
          emittedAt: "2026-04-20T00:00:30.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "context-portal-temporal-test",
        },
      }),
      portal,
    });

    const segment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "temporal replay wake",
    });
    const happening = substrate.createHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      label: "room observation",
      triggerIds: [],
      salience: 0.8,
    });
    happening.observedAt = "2026-04-20T00:01:00.000Z";
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening,
    });

    const carry = substrate.sealSegment(segment.id, {
      anchor: "temporal-room-anchor",
    });
    const sealedSegment = substrate.state.segments.get(carry.segmentId);
    assert.ok(sealedSegment);
    await lab.appendSleepCapsule({
      branchId: observerBranch.id,
      segment: {
        ...sealedSegment,
        closedAt: "2026-04-20T00:02:00.000Z",
      },
      nucleus: carry.nucleus,
    });

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "temporal-hallway-artifact",
        sourceIds: [hallwayBranch.id],
        payloadIds: [hallway.id],
        provenance: {
          emittedAt: "2026-04-20T00:03:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "context-portal-temporal-test",
        },
      }),
      context: {
        ...hallway,
        containmentPolicy: "primary-situated",
      },
    });

    const replay = await reconstructContextPortalTemporalReplay(lab);
    assert.deepEqual(
      replay.contextTimeline.map((entry) => ({
        emittedAt: entry.emittedAt,
        contextId: entry.contextId,
        containmentPolicy: entry.containmentPolicy,
      })),
      [
        {
          emittedAt: "2026-04-20T00:00:00.000Z",
          contextId: room.id,
          containmentPolicy: "primary-situated",
        },
        {
          emittedAt: "2026-04-20T00:03:00.000Z",
          contextId: hallway.id,
          containmentPolicy: "primary-situated",
        },
      ],
    );
    assert.deepEqual(
      replay.portalTimeline.map((entry) => ({
        emittedAt: entry.emittedAt,
        portalId: entry.portalId,
        sourceContextId: entry.sourceContextId,
        targetContextId: entry.targetContextId,
      })),
      [
        {
          emittedAt: "2026-04-20T00:00:30.000Z",
          portalId: portal.id,
          sourceContextId: hallway.id,
          targetContextId: room.id,
        },
      ],
    );
    assert.deepEqual(
      replay.primaryContextTimeline.map((entry) => ({
        asOf: entry.asOf,
        sourceEventType: entry.sourceEventType,
        primaryContextId: entry.primaryContextId,
        ambiguityState: entry.ambiguityState,
      })),
      [
        {
          asOf: "2026-04-20T00:00:00.000Z",
          sourceEventType: "context-artifact",
          primaryContextId: room.id,
          ambiguityState: "none",
        },
        {
          asOf: "2026-04-20T00:00:30.000Z",
          sourceEventType: "portal-artifact",
          primaryContextId: room.id,
          ambiguityState: "none",
        },
        {
          asOf: "2026-04-20T00:01:00.000Z",
          sourceEventType: "branch-happening",
          primaryContextId: room.id,
          ambiguityState: "none",
        },
        {
          asOf: "2026-04-20T00:02:00.000Z",
          sourceEventType: "sleep-capsule",
          primaryContextId: room.id,
          ambiguityState: "none",
        },
        {
          asOf: "2026-04-20T00:03:00.000Z",
          sourceEventType: "context-artifact",
          primaryContextId: hallway.id,
          ambiguityState: "none",
        },
      ],
    );
  } finally {
    await lab.close();
  }
});

test("context and portal temporal replay keeps primary-context ambiguity first-class over time", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-follow-on-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["context-portal-temporal-ambiguity"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "context-portal-temporal-ambiguity-basis",
      dimensions: ["containment"],
    });
    const observer = substrate.createObserver({
      label: "temporal-ambiguity-observer",
      basisId: basis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "temporal-ambiguity-observer-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "temporal-ambiguity-room-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      branchId: roomBranch.id,
      label: "room",
      containmentPolicy: "candidate",
    });
    const yardBranch = substrate.createBranch({
      role: "context",
      label: "temporal-ambiguity-yard-branch",
      basisId: basis.id,
    });
    const yard = substrate.createContext({
      branchId: yardBranch.id,
      label: "yard",
      containmentPolicy: "candidate",
    });

    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "temporal-ambiguity-room-artifact",
        sourceIds: [roomBranch.id],
        payloadIds: [room.id],
        provenance: {
          emittedAt: "2026-04-20T00:00:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "context-portal-temporal-ambiguity-test",
        },
      }),
      context: room,
    });
    await lab.appendContextArtifact({
      artifact: substrate.createArtifactEnvelope({
        kind: "context-surface",
        label: "temporal-ambiguity-yard-artifact",
        sourceIds: [yardBranch.id],
        payloadIds: [yard.id],
        provenance: {
          emittedAt: "2026-04-20T00:01:00.000Z",
          basisId: basis.id,
          emitterId: observer.id,
          source: "context-portal-temporal-ambiguity-test",
        },
      }),
      context: yard,
    });

    const segment = substrate.openSegment({
      branchId: observerBranch.id,
      inheritedNucleusIds: [],
      summary: "temporal ambiguity wake",
    });
    await lab.appendBranchHappening({
      branchId: observerBranch.id,
      segmentId: segment.id,
      happening: {
        id: "temporal-ambiguity-happening",
        branchId: observerBranch.id,
        segmentId: segment.id,
        label: "boundary uncertainty",
        triggerIds: [],
        observedAt: "2026-04-20T00:02:00.000Z",
      },
    });

    const replay = await reconstructContextPortalTemporalReplay(lab);
    assert.deepEqual(
      replay.primaryContextTimeline.map((entry) => ({
        asOf: entry.asOf,
        primaryContextId: entry.primaryContextId,
        ambiguityState: entry.ambiguityState,
      })),
      [
        {
          asOf: "2026-04-20T00:00:00.000Z",
          primaryContextId: room.id,
          ambiguityState: "none",
        },
        {
          asOf: "2026-04-20T00:01:00.000Z",
          primaryContextId: undefined,
          ambiguityState: "context-placement",
        },
        {
          asOf: "2026-04-20T00:02:00.000Z",
          primaryContextId: undefined,
          ambiguityState: "context-placement",
        },
      ],
    );
  } finally {
    await lab.close();
  }
});
