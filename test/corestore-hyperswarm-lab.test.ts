import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  activeManagedCorestoreCount,
  createHyperswarmReplicationSwarm,
  type HyperswarmReplicationSwarm,
  parseHyperswarmBootstrap,
  runHyperswarmCapabilityHandshakeLab,
  runIncrementalReplicationCatchupLab,
  runMultipleObserverReplicationLab,
} from "../src/index.js";

const SHOULD_RUN_REAL_HYPERSWARM = process.env.CAUSAL_SUBSTRATE_REAL_HYPERSWARM === "1";
const CONFIGURED_HYPERSWARM_BOOTSTRAP = parseHyperswarmBootstrap(
  process.env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP,
);

interface HyperswarmHarness {
  bootstrap: string[];
  close: () => Promise<void>;
}

async function openHyperswarmHarness(): Promise<HyperswarmHarness> {
  if (CONFIGURED_HYPERSWARM_BOOTSTRAP.length > 0) {
    return {
      bootstrap: CONFIGURED_HYPERSWARM_BOOTSTRAP,
      close: async () => {},
    };
  }

  const { default: createTestnet } = await import("hyperdht/testnet.js");
  const testnet = await createTestnet(3, { host: "127.0.0.1" });

  return {
    bootstrap: testnet.bootstrap.map((node: { host: string; port: number }) => {
      return `${node.host}:${node.port}`;
    }),
    close: async () => {
      await testnet.destroy();
    },
  };
}

function createRealHyperswarmFactory(bootstrap: string[]) {
  return async (seed?: Buffer, topics?: Map<string, unknown>) => {
    const swarm = await createHyperswarmReplicationSwarm({
      seed,
      bootstrap,
    });
    await swarm.listen();

    return {
      ...swarm,
      async flush(timeoutMs?: number) {
        const deadlineMs = timeoutMs ?? 60_000;
        const startedAt = Date.now();

        while (Date.now() - startedAt < deadlineMs) {
          if (swarm.connectionCount() > 0) {
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        throw new Error(`timed out waiting for direct hyperswarm peer after ${deadlineMs}ms`);
      },
      join(topic: Buffer) {
        const key = Buffer.from(topic).toString("hex");
        const peers = getTopicPeers(topics, key);

        if (!peers.some((peer) => peer.publicKey.equals(swarm.publicKey))) {
          peers.push(swarm);
        }

        for (const peer of peers) {
          if (peer.publicKey.equals(swarm.publicKey)) continue;
          swarm.joinPeer(peer.publicKey);
        }

        return {
          flushed: async () => {},
        };
      },
    };
  };
}

function getTopicPeers(
  topics: Map<string, unknown> | undefined,
  key: string,
): HyperswarmReplicationSwarm[] {
  if (!topics) {
    return [];
  }

  const existing = topics.get(key);
  if (Array.isArray(existing)) {
    return existing as HyperswarmReplicationSwarm[];
  }

  const peers: HyperswarmReplicationSwarm[] = [];
  topics.set(key, peers);
  return peers;
}

test(
  "capability handshake lab carries capability surfaces and a bounded view artifact over direct-peer hyperswarm",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 120_000,
  },
  async () => {
    const harness = await openHyperswarmHarness();

    try {
      const report = await runHyperswarmCapabilityHandshakeLab({
        createSwarm: createRealHyperswarmFactory(harness.bootstrap),
        namespaceParts: ["hyperswarm-capability", randomUUID()],
        now: () => "2026-04-21T14:00:00.000Z",
        flushTimeoutMs: 60_000,
      });

      assert.equal(report.receiverPeerId, "observer-a-capability-surface");
      assert.equal(report.initiatorPeerId, "observer-b-capability-surface");
      assert.equal(report.receiverRemoteRole, "observer-witness");
      assert.equal(report.initiatorRemoteRole, "observer-witness");
      assert.equal(report.receiverDecision.accepted, true);
      assert.equal(report.receiverDecision.requiresMediation, true);
      assert.equal(
        report.receiverDecision.reason,
        "capability mismatch narrows exchange to mediated artifacts",
      );
      assert.deepEqual(report.receiverDecision.matchedArtifactKinds, ["view", "receipt"]);
      assert.deepEqual(report.receiverDecision.matchedExchangeModes, [
        "view-only",
        "receipt-only",
      ]);
      assert.equal(report.initiatorDecision.accepted, true);
      assert.equal(report.initiatorDecision.requiresMediation, true);
      assert.equal(
        report.initiatorDecision.reason,
        "capability overlap supports bounded exchange",
      );
      assert.equal(report.exchangedArtifactKind, "view");
      assert.equal(report.exchangedViewKind, "context-surface");
      assert.match(report.exchangedArtifactId, /^artifact[_-]/);
      assert.match(report.exchangedViewId, /^view[_-]/);
    } finally {
      await harness.close();
    }
  },
);

test(
  "multiple observer replication lab syncs append-only records between two separate Corestores via hyperswarm",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 180_000,
  },
  async () => {
    const firstDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-hs-a-"));
    const secondDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-hs-b-"));
    const harness = await openHyperswarmHarness();

    try {
      const report = await runMultipleObserverReplicationLab({
        storageDirA: firstDirectory,
        storageDirB: secondDirectory,
        createSwarm: createRealHyperswarmFactory(harness.bootstrap),
        namespaceParts: ["hyperswarm-proof", randomUUID()],
        now: () => "2026-04-21T12:00:00.000Z",
        flushTimeoutMs: 60_000,
        replicationTimeoutMs: 120_000,
      });

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
    } finally {
      await harness.close();
    }
  },
);

test(
  "incremental replication lab catches up after replica reopen and reconstructs replay via hyperswarm",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 240_000,
  },
  async () => {
    const firstDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-hs-a-"));
    const secondDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-hs-b-"));
    const harness = await openHyperswarmHarness();

    try {
      const report = await runIncrementalReplicationCatchupLab({
        storageDirA: firstDirectory,
        storageDirB: secondDirectory,
        createSwarm: createRealHyperswarmFactory(harness.bootstrap),
        namespaceParts: ["hyperswarm-catchup", randomUUID()],
        now: () => "2026-04-21T13:00:00.000Z",
        flushTimeoutMs: 60_000,
        replicationTimeoutMs: 120_000,
      });

      assert.equal(report.primaryKeyHex.length, 64);

      assert.equal(report.initialReplay.branchHappeningCount, 1);
      assert.equal(report.initialReplay.sleepCapsuleCount, 1);
      assert.equal(report.initialReplay.referentStateCount, 1);
      assert.equal(report.initialReplay.exchangeArtifactCount, 1);
      assert.deepEqual(report.initialReplay.exchangePayloadKinds, ["view"]);
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
    } finally {
      await harness.close();
    }
  },
);
