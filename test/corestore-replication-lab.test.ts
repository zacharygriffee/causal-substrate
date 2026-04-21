import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

import {
  activeManagedCorestoreCount,
  runIncrementalReplicationCatchupLab,
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
  assert.equal(report.replicaSituation.continuityState, "continuing");
  assert.equal(report.replicaSituation.ambiguityState, "none");
  assert.equal(report.replicaSituation.activeReferentIds.length, 1);
  assert.equal(report.replicaInspectability.referentClaims.length, 1);
  assert.equal(report.replicaInspectability.artifactClaims.length, 1);
  assert.equal(
    report.replicaInspectability.artifactClaims[0]?.provenanceSource,
    "multiple-observer-replication-lab",
  );
  assert.equal(activeManagedCorestoreCount(), 0);
});

test("incremental replication lab catches up after replica reopen and reconstructs replay without Hyperbee", async () => {
  const firstDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-repl-a-"));
  const secondDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-repl-b-"));
  const { createFakeSwarm } = await import(
    pathToFileURL("/home/zevilz/WebstormProjects/fakeswarm/src/index.js").href
  );

  const report = await runIncrementalReplicationCatchupLab({
    storageDirA: firstDirectory,
    storageDirB: secondDirectory,
    createSwarm: createFakeSwarm,
    namespaceParts: ["fakeswarm-catchup"],
    now: () => "2026-04-21T00:00:00.000Z",
  });

  assert.deepEqual(report.namespaceParts, [
    "causal-substrate",
    "v1",
    "first-serious-causal-lab",
    "fakeswarm-catchup",
  ]);
  assert.equal(report.primaryKeyHex.length, 64);

  assert.equal(report.initialReplay.branchHappeningCount, 1);
  assert.equal(report.initialReplay.sleepCapsuleCount, 1);
  assert.equal(report.initialReplay.referentStateCount, 1);
  assert.equal(report.initialReplay.exchangeArtifactCount, 1);
  assert.deepEqual(report.initialReplay.exchangePayloadKinds, ["view"]);
  assert.equal(report.initialReplay.branchSurfaces.length, 1);
  assert.equal(report.initialReplay.referentSurfaces.length, 1);
  assert.equal(report.initialSituation.continuityState, "continuing");
  assert.equal(report.initialSituation.activeReferentIds.length, 1);
  assert.equal(report.initialInspectability.referentClaims.length, 1);
  assert.equal(report.initialInspectability.artifactClaims.length, 1);

  assert.equal(report.finalReplay.branchHappeningCount, 2);
  assert.equal(report.finalReplay.sleepCapsuleCount, 2);
  assert.equal(report.finalReplay.referentStateCount, 2);
  assert.equal(report.finalReplay.exchangeArtifactCount, 2);
  assert.deepEqual(report.finalReplay.exchangePayloadKinds, ["view", "receipt"]);
  assert.deepEqual(report.finalReplay.referentSurfaces[0]?.continuityHistory, [
    "continuing",
    "ambiguous",
  ]);
  assert.equal(report.finalReplay.branchSurfaces[0]?.branchHappeningCount, 2);
  assert.equal(report.finalReplay.branchSurfaces[0]?.sleepCapsuleCount, 2);
  assert.equal(
    report.finalReplay.artifactSurfaces.find((surface) => surface.payloadType === "receipt")
      ?.payloadSourceIds.length,
    3,
  );
  assert.equal(report.finalSituation.continuityState, "ambiguous");
  assert.equal(report.finalSituation.ambiguityState, "continuity");
  assert.equal(report.finalSituation.activeReferentIds.length, 1);
  assert.equal(report.finalInspectability.referentClaims.length, 2);
  assert.equal(report.finalInspectability.artifactClaims.length, 2);
  assert.equal(
    report.finalInspectability.artifactClaims.find((claim) => claim.payloadType === "receipt")
      ?.provenanceSource,
    "incremental-replication-catchup-lab",
  );
  assert.equal(activeManagedCorestoreCount(), 0);
});
