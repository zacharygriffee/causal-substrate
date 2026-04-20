import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  activeManagedCorestoreCount,
  openFirstSeriousCorestoreLab,
  runFirstSeriousCorestoreLab,
  Substrate,
} from "../src/index.js";

test("first serious Corestore lab writes structured continuity and exchange records with a clean split", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-serious-lab-"));
  const report = await runFirstSeriousCorestoreLab({
    storageDir: directory,
    now: () => "2026-04-20T00:00:00.000Z",
  });

  assert.deepEqual(report.namespaceParts, [
    "causal-substrate",
    "v1",
    "first-serious-causal-lab",
  ]);
  assert.equal(report.branchHappenings.length, 1);
  assert.equal(report.sleepCapsules.length, 1);
  assert.equal(report.referentState.length, 1);
  assert.equal(report.exchangeArtifacts.length, 1);

  const branchRecord = report.branchHappenings[0];
  const segmentRecord = report.sleepCapsules[0];
  const referentRecord = report.referentState[0];
  const exchangeRecord = report.exchangeArtifacts[0];
  assert.ok(branchRecord);
  assert.ok(segmentRecord);
  assert.ok(referentRecord);
  assert.ok(exchangeRecord);

  assert.equal(branchRecord.recordType, "branch-happening");
  assert.equal(segmentRecord.recordType, "sleep-capsule");
  assert.equal(referentRecord.recordType, "referent-state-estimate");
  assert.equal(exchangeRecord.recordType, "exchange-artifact");
  assert.equal(branchRecord.segmentId, segmentRecord.segment.id);
  assert.equal(referentRecord.continuity, "continuing");
  assert.equal(exchangeRecord.artifact.locality, "shared-candidate");
  assert.equal(exchangeRecord.payload.payloadType, "view");
  assert.equal("artifact" in branchRecord, false);
  assert.equal("happening" in exchangeRecord, false);
});

test("first serious Corestore lab preserves append-only order within a stream", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-serious-lab-"));
  const lab = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["ordering"],
  });
  const substrate = new Substrate({
    now: () => "2026-04-20T00:00:00.000Z",
  });

  try {
    const basis = substrate.createBasis({
      label: "ordering-basis",
      dimensions: ["position"],
    });
    const observer = substrate.createObserver({
      label: "ordering-observer",
      basisId: basis.id,
    });
    const branch = substrate.createBranch({
      role: "observer",
      label: "ordering-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const segment = substrate.openSegment({
      branchId: branch.id,
    });
    const first = substrate.createHappening({
      branchId: branch.id,
      segmentId: segment.id,
      label: "first-preserved-happening",
    });
    const second = substrate.createHappening({
      branchId: branch.id,
      segmentId: segment.id,
      label: "second-preserved-happening",
    });

    await lab.appendBranchHappening({
      branchId: branch.id,
      segmentId: segment.id,
      happening: first,
    });
    await lab.appendBranchHappening({
      branchId: branch.id,
      segmentId: segment.id,
      happening: second,
    });

    const records = await lab.readBranchHappenings();
    assert.equal(records.length, 2);
    assert.ok(records[0]);
    assert.ok(records[1]);
    assert.equal(records[0].happening.id, first.id);
    assert.equal(records[1].happening.id, second.id);
    assert.equal(records[0].happening.label, "first-preserved-happening");
    assert.equal(records[1].happening.label, "second-preserved-happening");
  } finally {
    await lab.close();
  }
});

test("first serious Corestore lab adapter reopens cleanly after close", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-serious-lab-"));

  const first = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["reopen"],
  });
  try {
    await first.appendReceiptArtifact({
      artifact: {
        id: "artifact_1",
        kind: "receipt",
        label: "continuity-receipt",
        sourceIds: ["branch_1"],
        payloadIds: ["receipt_1"],
        locality: "shared-candidate",
        provenance: {
          emittedAt: "2026-04-20T00:00:00.000Z",
          source: "test",
        },
      },
      receipt: {
        id: "receipt_1",
        label: "continuity-receipt",
        summary: "Explicit artifact survives close and reopen.",
        sourceIds: ["branch_1"],
      },
    });
  } finally {
    await first.close();
  }

  const reopened = await openFirstSeriousCorestoreLab({
    storageDir: directory,
    namespaceParts: ["reopen"],
  });
  try {
    const exchange = await reopened.readExchangeArtifacts();
    assert.equal(exchange.length, 1);
    assert.ok(exchange[0]);
    assert.equal(exchange[0].payload.payloadType, "receipt");
  } finally {
    await reopened.close();
  }

  assert.equal(activeManagedCorestoreCount(), 0);
});
