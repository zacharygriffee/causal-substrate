import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  activeManagedCorestoreCount,
  openFirstSeriousCorestoreLab,
  reconstructBranchPicture,
  reconstructInspectabilityPicture,
  reconstructLocalPicture,
  reconstructReferentPicture,
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
