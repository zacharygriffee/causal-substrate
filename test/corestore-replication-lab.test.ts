import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

import {
  activeManagedCorestoreCount,
  runMultipleObserverReplicationLab,
} from "../src/index.js";

test("multiple observer replication lab syncs append-only records between two separate Corestores via fakeswarm", async () => {
  const firstDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-repl-a-"));
  const secondDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-repl-b-"));
  const { createFakeSwarm } = await import(
    pathToFileURL("/home/zevilz/WebstormProjects/fakeswarm/src/index.js").href
  );

  const report = await runMultipleObserverReplicationLab({
    storageDirA: firstDirectory,
    storageDirB: secondDirectory,
    createSwarm: createFakeSwarm,
    namespaceParts: ["fakeswarm-proof"],
    now: () => "2026-04-20T00:00:00.000Z",
  });

  assert.deepEqual(report.namespaceParts, [
    "causal-substrate",
    "v1",
    "first-serious-causal-lab",
    "fakeswarm-proof",
  ]);
  assert.equal(report.primaryKeyHex.length, 64);
  assert.equal(report.branchHappeningCount, 2);
  assert.equal(report.sleepCapsuleCount, 2);
  assert.equal(report.referentStateCount, 1);
  assert.equal(report.exchangeArtifactCount, 1);
  assert.equal(report.replicatedObserverBranchIds.length, 2);
  assert.deepEqual(report.replicatedContinuity, ["continuing"]);
  assert.deepEqual(report.replicatedPayloadKinds, ["view"]);
  assert.equal(activeManagedCorestoreCount(), 0);
});
