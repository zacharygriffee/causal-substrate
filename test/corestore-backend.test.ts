import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  activeManagedCorestoreCount,
  appendConcernRecord,
  getManagedCorestoreRefCount,
  openConcernCores,
  readConcernRecords,
} from "../src/index.js";

test("corestore backend reuses one managed root per storage path and deterministic namespace", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-corestore-"));
  const concern = "first-serious-lab";

  const first = await openConcernCores({
    storageDir: directory,
    concern,
  });
  const second = await openConcernCores({
    storageDir: directory,
    concern,
  });

  assert.equal(activeManagedCorestoreCount(), 1);
  assert.equal(getManagedCorestoreRefCount(directory), 2);
  assert.deepEqual(first.namespaceParts, ["causal-substrate", "v1", concern]);

  const firstKeyHex = Buffer.from(first.cores["branch-happenings"].key).toString("hex");
  const secondKeyHex = Buffer.from(second.cores["branch-happenings"].key).toString("hex");
  assert.equal(firstKeyHex, secondKeyHex);

  await second.close();
  assert.equal(getManagedCorestoreRefCount(directory), 1);
  await first.close();
  assert.equal(activeManagedCorestoreCount(), 0);
});

test("corestore backend writes and reads the first serious artifact classes", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-corestore-"));
  const handle = await openConcernCores({
    storageDir: directory,
    concern: "causal-lab-artifacts",
  });

  try {
    await appendConcernRecord(handle, "branch-happenings", {
      type: "happening",
      branchId: "branch-1",
      label: "observer noticed threshold crossing",
    });
    await appendConcernRecord(handle, "segments", {
      type: "sleep-capsule",
      branchId: "branch-1",
      nucleusAnchor: "nucleus-1",
    });
    await appendConcernRecord(handle, "referent-state", {
      type: "state-estimate",
      referentId: "referent-1",
      continuity: "ambiguous",
    });
    await appendConcernRecord(handle, "exchange-artifacts", {
      type: "view",
      label: "derived-room-surface",
    });

    const happenings = await readConcernRecords(handle, "branch-happenings");
    const segments = await readConcernRecords(handle, "segments");
    const referentState = await readConcernRecords(handle, "referent-state");
    const artifacts = await readConcernRecords(handle, "exchange-artifacts");

    assert.equal(happenings.length, 1);
    assert.equal(segments.length, 1);
    assert.equal(referentState.length, 1);
    assert.equal(artifacts.length, 1);
    assert.equal(referentState[0].continuity, "ambiguous");
  } finally {
    await handle.close();
  }
});

test("corestore backend can reopen cleanly after close without residual lock issues", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "causal-substrate-corestore-"));
  const concern = "reopen-cleanly";

  const first = await openConcernCores({
    storageDir: directory,
    concern,
  });
  try {
    await appendConcernRecord(first, "branch-happenings", {
      type: "happening",
      label: "first-open-append",
    });
  } finally {
    await first.close();
  }

  const reopened = await openConcernCores({
    storageDir: directory,
    concern,
  });
  try {
    const records = await readConcernRecords(reopened, "branch-happenings");
    assert.equal(records.length, 1);
    assert.equal(records[0].label, "first-open-append");
  } finally {
    await reopened.close();
  }

  assert.equal(activeManagedCorestoreCount(), 0);
});
