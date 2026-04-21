import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  activeManagedCorestoreCount,
  openFirstSeriousCorestoreLab,
  reconstructLocalPicture,
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
        sourceIds: ["artifact-room-1"],
      },
    });

    const replay = await reconstructLocalPicture(lab);
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
  } finally {
    await lab.close();
  }

  assert.equal(activeManagedCorestoreCount(), 0);
});
