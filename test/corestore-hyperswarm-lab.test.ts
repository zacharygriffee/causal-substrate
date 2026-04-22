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
  runHyperswarmCoObservedBallTransportLab,
  runHyperswarmMutualObserverTransportLab,
  runHyperswarmMultiPeerCapabilityLab,
  runHyperswarmOrthogonalBallTransportLab,
  runIncrementalReplicationCatchupLab,
  runMultipleObserverReplicationLab,
  waitForDiscoveryMeshRendezvous,
} from "../src/index.js";

const SHOULD_RUN_REAL_HYPERSWARM = process.env.CAUSAL_SUBSTRATE_REAL_HYPERSWARM === "1";
const SHOULD_USE_PUBLIC_HYPERSWARM = process.env.CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC === "1";
const CONFIGURED_HYPERSWARM_BOOTSTRAP = parseHyperswarmBootstrap(
  process.env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP,
);

interface HyperswarmHarness {
  bootstrap?: string[];
  close: () => Promise<void>;
}

interface RealHyperswarmFactoryHarness {
  createSwarm: ReturnType<typeof createRealHyperswarmFactory>;
  swarms: HyperswarmReplicationSwarm[];
}

async function openHyperswarmHarness(): Promise<HyperswarmHarness> {
  if (CONFIGURED_HYPERSWARM_BOOTSTRAP.length > 0) {
    return {
      bootstrap: CONFIGURED_HYPERSWARM_BOOTSTRAP,
      close: async () => {},
    };
  }

  if (SHOULD_USE_PUBLIC_HYPERSWARM) {
    return {
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

function createRealHyperswarmFactory(bootstrap?: string[]) {
  const swarms: HyperswarmReplicationSwarm[] = [];

  return async (seed?: Buffer, topics?: Map<string, unknown>) => {
    const swarm = await createHyperswarmReplicationSwarm({
      seed,
      bootstrap,
    });
    swarms.push(swarm);
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

function openRealHyperswarmFactoryHarness(bootstrap?: string[]): RealHyperswarmFactoryHarness {
  const swarms: HyperswarmReplicationSwarm[] = [];
  const createSwarm = async (seed?: Buffer, topics?: Map<string, unknown>) => {
    const factory = createRealHyperswarmFactory(bootstrap);
    const swarm = await factory(seed, topics);
    swarms.push(swarm as HyperswarmReplicationSwarm);
    return swarm;
  };

  return {
    createSwarm,
    swarms,
  };
}

function openActualTopicHyperswarmFactoryHarness(bootstrap?: string[]) {
  const swarms: HyperswarmReplicationSwarm[] = [];

  return {
    createSwarm: async (seed?: Buffer) => {
      const swarm = await createHyperswarmReplicationSwarm({
        bootstrap,
        seed,
      });
      swarms.push(swarm);
      await swarm.listen();
      return swarm;
    },
    swarms,
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
    const factoryHarness = openRealHyperswarmFactoryHarness(harness.bootstrap);

    try {
      const report = await runHyperswarmCapabilityHandshakeLab({
        createSwarm: factoryHarness.createSwarm,
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
      assert.deepEqual(report.transportPicture.peerIds, [
        "observer-a-capability-surface",
        "observer-b-capability-surface",
      ]);
      assert.equal(report.transportPicture.traces.length, 2);
      assert.deepEqual(
        report.transportPicture.traces.map((trace) => ({
          localPeerId: trace.localPeerId,
          remotePeerId: trace.remotePeerId,
          sentPayloadKinds: trace.sentPayloadKinds,
          receivedPayloadKinds: trace.receivedPayloadKinds,
        })),
        [
          {
            localPeerId: "observer-a-capability-surface",
            remotePeerId: "observer-b-capability-surface",
            sentPayloadKinds: [],
            receivedPayloadKinds: ["view"],
          },
          {
            localPeerId: "observer-b-capability-surface",
            remotePeerId: "observer-a-capability-surface",
            sentPayloadKinds: ["view"],
            receivedPayloadKinds: [],
          },
        ],
      );
      assert.ok(factoryHarness.swarms.length >= 2);
      for (const swarm of factoryHarness.swarms) {
        assert.equal(swarm.getTransportState().closeReport?.completed, true);
      }
    } finally {
      await harness.close();
    }
  },
);

test(
  "actual hyperswarm topic capability handshake carries capability surfaces and a bounded view artifact",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 180_000,
  },
  async () => {
    const harness = await openHyperswarmHarness();
    const factoryHarness = openActualTopicHyperswarmFactoryHarness(harness.bootstrap);

    try {
      const report = await runHyperswarmCapabilityHandshakeLab({
        createSwarm: factoryHarness.createSwarm,
        namespaceParts: ["hyperswarm-topic-capability", randomUUID()],
        now: () => "2026-04-22T01:00:00.000Z",
        flushTimeoutMs: 60_000,
      });

      assert.equal(report.receiverDecision.accepted, true);
      assert.equal(report.receiverDecision.requiresMediation, true);
      assert.equal(report.initiatorDecision.accepted, true);
      assert.equal(report.initiatorDecision.requiresMediation, true);
      assert.equal(report.exchangedArtifactKind, "view");
      assert.equal(report.exchangedViewKind, "context-surface");
      assert.ok(factoryHarness.swarms.length >= 2);
      for (const swarm of factoryHarness.swarms) {
        const transport = swarm.getTransportState();
        assert.equal(transport.connectionOpens >= 1, true);
        assert.equal((transport.discoveryStates[0]?.refreshCount ?? 0) >= 2, true);
        assert.equal(transport.closeReport?.completed, true);
      }
    } finally {
      await harness.close();
    }
  },
);

test(
  "multi-peer capability lab keeps coarse rendezvous broad while exchange stays selective over direct-peer hyperswarm",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 180_000,
  },
  async () => {
    const harness = await openHyperswarmHarness();

    try {
      const report = await runHyperswarmMultiPeerCapabilityLab({
        createSwarm: createRealHyperswarmFactory(harness.bootstrap),
        namespaceParts: ["hyperswarm-capability-mesh", randomUUID()],
        now: () => "2026-04-21T15:00:00.000Z",
        flushTimeoutMs: 60_000,
      });

      assert.deepEqual(report.peerIds, [
        "observer-a-capability-surface",
        "observer-b-capability-surface",
        "relay-c-capability-surface",
      ]);
      assert.equal(report.degradedPeerId, "observer-a-capability-surface");
      assert.equal(report.fullPeerId, "observer-b-capability-surface");
      assert.equal(report.relayPeerId, "relay-c-capability-surface");

      assert.equal(report.degradedFromFullDecision.accepted, true);
      assert.equal(report.degradedFromFullDecision.requiresMediation, true);
      assert.equal(
        report.degradedFromFullDecision.reason,
        "capability mismatch narrows exchange to mediated artifacts",
      );
      assert.deepEqual(report.degradedFromFullDecision.matchedArtifactKinds, [
        "view",
        "receipt",
      ]);

      assert.equal(report.degradedFromRelayDecision.accepted, true);
      assert.equal(report.degradedFromRelayDecision.requiresMediation, true);
      assert.equal(
        report.degradedFromRelayDecision.reason,
        "capability mismatch narrows exchange to mediated artifacts",
      );
      assert.deepEqual(report.degradedFromRelayDecision.matchedArtifactKinds, ["receipt"]);
      assert.deepEqual(report.degradedFromRelayDecision.matchedExchangeModes, ["receipt-only"]);

      assert.equal(report.fullFromRelayDecision.accepted, true);
      assert.equal(report.fullFromRelayDecision.requiresMediation, true);
      assert.equal(
        report.fullFromRelayDecision.reason,
        "capability overlap supports bounded exchange",
      );
      assert.deepEqual(report.fullFromRelayDecision.matchedArtifactKinds, ["receipt"]);
      assert.deepEqual(report.fullFromRelayDecision.matchedExchangeModes, ["receipt-only"]);

      assert.deepEqual(report.receivedArtifactKinds, ["view", "receipt"]);
      assert.deepEqual(report.receivedPayloadKinds, ["view", "receipt"]);
      assert.deepEqual(report.transportPicture.peerIds, [
        "observer-a-capability-surface",
        "observer-b-capability-surface",
        "relay-c-capability-surface",
      ]);
      assert.equal(report.transportPicture.traces.length, 5);
      assert.deepEqual(
        report.transportPicture.traces
          .filter((trace) => trace.localPeerId === "observer-a-capability-surface")
          .map((trace) => ({
            remotePeerId: trace.remotePeerId,
            receivedPayloadKinds: trace.receivedPayloadKinds,
          })),
        [
          {
            remotePeerId: "observer-b-capability-surface",
            receivedPayloadKinds: ["view"],
          },
          {
            remotePeerId: "relay-c-capability-surface",
            receivedPayloadKinds: ["receipt"],
          },
        ],
      );
    } finally {
      await harness.close();
    }
  },
);

test(
  "actual hyperswarm topic multi-peer capability exchange keeps coarse rendezvous broad while exchange stays selective",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 240_000,
  },
  async () => {
    const harness = await openHyperswarmHarness();
    const factoryHarness = openActualTopicHyperswarmFactoryHarness(harness.bootstrap);

    try {
      const report = await runHyperswarmMultiPeerCapabilityLab({
        createSwarm: factoryHarness.createSwarm,
        namespaceParts: ["hyperswarm-topic-capability-mesh", randomUUID()],
        now: () => "2026-04-22T01:05:00.000Z",
        flushTimeoutMs: 60_000,
      });

      assert.deepEqual(report.receivedArtifactKinds, ["view", "receipt"]);
      assert.deepEqual(report.receivedPayloadKinds, ["view", "receipt"]);
      assert.ok(factoryHarness.swarms.length >= 3);
      for (const swarm of factoryHarness.swarms) {
        const transport = swarm.getTransportState();
        assert.equal(transport.connectionOpens >= 1, true);
        assert.equal((transport.discoveryStates[0]?.refreshCount ?? 0) >= 2, true);
        assert.equal(transport.closeReport?.completed, true);
      }
    } finally {
      await harness.close();
    }
  },
);

test(
  "actual hyperswarm topic mutual observers exchange mediated self-access artifacts without overwriting source continuity",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 180_000,
  },
  async () => {
    const harness = await openHyperswarmHarness();
    const factoryHarness = openActualTopicHyperswarmFactoryHarness(harness.bootstrap);

    try {
      const report = await runHyperswarmMutualObserverTransportLab({
        createSwarm: factoryHarness.createSwarm,
        namespaceParts: ["hyperswarm-topic-mutual-observer", randomUUID()],
        now: () => "2026-04-22T02:00:00.000Z",
        flushTimeoutMs: 60_000,
      });

      assert.deepEqual(report.observerPeerIds, ["camera-1-peer", "camera-2-peer"]);
      assert.equal(report.bindingReferentIds.length, 2);
      assert.deepEqual(report.exchangedArtifactKinds, ["view", "view"]);
      assert.deepEqual(report.exchangedViewKinds, ["binding-map", "binding-map"]);
      assert.equal(report.adoptedViewSourceIds.length, 2);
      assert.equal(report.adoptedViewSourceIds.every((sourceIds) => sourceIds.length === 2), true);
      assert.deepEqual(report.transportPicture.peerIds, ["camera-1-peer", "camera-2-peer"]);
      assert.deepEqual(
        report.transportPicture.traces.map((trace) => ({
          localPeerId: trace.localPeerId,
          sentMessageKinds: trace.sentMessageKinds,
          receivedMessageKinds: trace.receivedMessageKinds,
        })),
        [
          {
            localPeerId: "camera-1-peer",
            sentMessageKinds: ["mediated-self-view"],
            receivedMessageKinds: ["mediated-self-view"],
          },
          {
            localPeerId: "camera-2-peer",
            sentMessageKinds: ["mediated-self-view"],
            receivedMessageKinds: ["mediated-self-view"],
          },
        ],
      );
      assert.ok(factoryHarness.swarms.length >= 2);
      for (const swarm of factoryHarness.swarms) {
        const transport = swarm.getTransportState();
        assert.equal(transport.connectionOpens >= 1, true);
        assert.equal((transport.discoveryStates[0]?.refreshCount ?? 0) >= 2, true);
        assert.equal(transport.closeReport?.completed, true);
      }
    } finally {
      await harness.close();
    }
  },
);

test(
  "actual hyperswarm topic co-observed ball materializes from seed pressure without observer ownership",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 180_000,
  },
  async () => {
    const harness = await openHyperswarmHarness();
    const factoryHarness = openActualTopicHyperswarmFactoryHarness(harness.bootstrap);

    try {
      const report = await runHyperswarmCoObservedBallTransportLab({
        createSwarm: factoryHarness.createSwarm,
        namespaceParts: ["hyperswarm-topic-co-observed-ball", randomUUID()],
        now: () => "2026-04-22T02:05:00.000Z",
        flushTimeoutMs: 60_000,
      });

      assert.deepEqual(report.observerPeerIds, ["camera-1-ball-peer", "camera-2-ball-peer"]);
      assert.equal(report.lineageRelation, "seed-origin");
      assert.equal(report.ballBranchParentIds.length, 1);
      assert.equal(report.bindingReferentIds.length, 2);
      assert.equal(report.bindingReferentIds[0], report.bindingReferentIds[1]);
      assert.deepEqual(report.exchangedArtifactKinds, ["binding", "binding", "lineage-claim"]);
      assert.equal(report.happeningBranchIds.length, 2);
      assert.equal(report.referentCount, 1);
      assert.deepEqual(report.transportPicture.peerIds, [
        "camera-1-ball-peer",
        "camera-2-ball-peer",
      ]);
      assert.deepEqual(
        report.transportPicture.traces.map((trace) => ({
          localPeerId: trace.localPeerId,
          sentMessageKinds: trace.sentMessageKinds,
          receivedMessageKinds: trace.receivedMessageKinds,
        })),
        [
          {
            localPeerId: "camera-1-ball-peer",
            sentMessageKinds: ["ball-binding-with-lineage"],
            receivedMessageKinds: ["ball-binding"],
          },
          {
            localPeerId: "camera-2-ball-peer",
            sentMessageKinds: ["ball-binding"],
            receivedMessageKinds: ["ball-binding-with-lineage"],
          },
        ],
      );
      for (const swarm of factoryHarness.swarms) {
        const transport = swarm.getTransportState();
        assert.equal(transport.connectionOpens >= 1, true);
        assert.equal((transport.discoveryStates[0]?.refreshCount ?? 0) >= 2, true);
        assert.equal(transport.closeReport?.completed, true);
      }
    } finally {
      await harness.close();
    }
  },
);

test(
  "actual hyperswarm topic orthogonal observers exchange divergent persistence judgments without forced consensus",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 180_000,
  },
  async () => {
    const harness = await openHyperswarmHarness();
    const factoryHarness = openActualTopicHyperswarmFactoryHarness(harness.bootstrap);

    try {
      const report = await runHyperswarmOrthogonalBallTransportLab({
        createSwarm: factoryHarness.createSwarm,
        namespaceParts: ["hyperswarm-topic-orthogonal-ball", randomUUID()],
        now: () => "2026-04-22T02:10:00.000Z",
        flushTimeoutMs: 60_000,
      });

      assert.deepEqual(report.observerPeerIds, ["side-camera-peer", "top-camera-peer"]);
      assert.equal(report.sideContinuity, "continuing");
      assert.equal(report.topContinuity, "ambiguous");
      assert.equal(report.comparisonComparability, "partial");
      assert.equal(report.comparisonCompatibility, "unresolved");
      assert.equal(report.comparisonConvergence, "not-forced");
      assert.deepEqual(report.exchangedArtifactKinds, [
        "state-estimate",
        "state-estimate",
        "comparability-surface",
      ]);
      assert.deepEqual(report.transportPicture.peerIds, ["side-camera-peer", "top-camera-peer"]);
      assert.deepEqual(
        report.transportPicture.traces.map((trace) => ({
          localPeerId: trace.localPeerId,
          sentMessageKinds: trace.sentMessageKinds,
          receivedMessageKinds: trace.receivedMessageKinds,
        })),
        [
          {
            localPeerId: "side-camera-peer",
            sentMessageKinds: ["side-estimate"],
            receivedMessageKinds: ["top-estimate-with-comparison"],
          },
          {
            localPeerId: "top-camera-peer",
            sentMessageKinds: ["top-estimate-with-comparison"],
            receivedMessageKinds: ["side-estimate"],
          },
        ],
      );
      for (const swarm of factoryHarness.swarms) {
        const transport = swarm.getTransportState();
        assert.equal(transport.connectionOpens >= 1, true);
        assert.equal((transport.discoveryStates[0]?.refreshCount ?? 0) >= 2, true);
        assert.equal(transport.closeReport?.completed, true);
      }
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
    const factoryHarness = openRealHyperswarmFactoryHarness(harness.bootstrap);

    try {
      const report = await runMultipleObserverReplicationLab({
        storageDirA: firstDirectory,
        storageDirB: secondDirectory,
        createSwarm: factoryHarness.createSwarm,
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
      assert.ok(factoryHarness.swarms.length >= 2);
      for (const swarm of factoryHarness.swarms) {
        assert.equal(swarm.getTransportState().closeReport?.completed, true);
      }
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

test(
  "actual hyperswarm topic rendezvous establishes replication with pulsed discovery refresh",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 240_000,
  },
  async () => {
    const firstDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-hs-topic-a-"));
    const secondDirectory = await mkdtemp(path.join(tmpdir(), "causal-substrate-hs-topic-b-"));
    const harness = await openHyperswarmHarness();
    const factoryHarness = openActualTopicHyperswarmFactoryHarness(harness.bootstrap);

    try {
      const report = await runMultipleObserverReplicationLab({
        storageDirA: firstDirectory,
        storageDirB: secondDirectory,
        createSwarm: factoryHarness.createSwarm,
        namespaceParts: ["hyperswarm-topic-proof", randomUUID()],
        now: () => "2026-04-21T18:30:00.000Z",
        flushTimeoutMs: 60_000,
        replicationTimeoutMs: 120_000,
      });

      assert.equal(report.branchHappeningCount, 2);
      assert.equal(report.sleepCapsuleCount, 2);
      assert.equal(report.referentStateCount, 1);
      assert.equal(report.exchangeArtifactCount, 1);
      assert.deepEqual(report.replicatedPayloadKinds, ["view"]);
      assert.equal(report.replicaSituation.continuityState, "continuing");
      assert.equal(report.replicaSituation.ambiguityState, "none");
      assert.equal(activeManagedCorestoreCount(), 0);
      assert.ok(factoryHarness.swarms.length >= 2);
      for (const swarm of factoryHarness.swarms) {
        const transport = swarm.getTransportState();
        assert.equal(transport.connectionOpens >= 1, true);
        assert.equal(transport.discoveryStates.length >= 1, true);
        assert.equal((transport.discoveryStates[0]?.refreshCount ?? 0) >= 2, true);
        assert.equal(transport.closeReport?.completed, true);
      }
    } catch (error) {
      const transportStates = factoryHarness.swarms.map((swarm) => ({
        connections: swarm.connectionCount(),
        id: swarm.id,
        transport: swarm.getTransportState(),
      }));

      throw new Error(
        [
          error instanceof Error ? error.message : String(error),
          JSON.stringify(transportStates, null, 2),
        ].join("\n\n"),
      );
    } finally {
      await harness.close();
    }
  },
);

test(
  "actual hyperswarm multi-peer topic rendezvous establishes a small mesh with pulsed discovery refresh",
  {
    skip: !SHOULD_RUN_REAL_HYPERSWARM,
    timeout: 240_000,
  },
  async () => {
    const harness = await openHyperswarmHarness();
    const factoryHarness = openActualTopicHyperswarmFactoryHarness(harness.bootstrap);
    const topic = Buffer.from(randomUUID().replaceAll("-", "").padEnd(64, "0").slice(0, 64), "hex");

    try {
      const swarmA = await factoryHarness.createSwarm(Buffer.alloc(32, 0x31));
      const swarmB = await factoryHarness.createSwarm(Buffer.alloc(32, 0x32));
      const swarmC = await factoryHarness.createSwarm(Buffer.alloc(32, 0x33));

      const discoveryA = swarmA.join(topic, { client: true, server: true });
      const discoveryB = swarmB.join(topic, { client: true, server: true });
      const discoveryC = swarmC.join(topic, { client: true, server: true });

      await Promise.allSettled([swarmA.flush(), swarmB.flush(), swarmC.flush()]);

      const rendezvous = await waitForDiscoveryMeshRendezvous({
        discoveries: [discoveryA, discoveryB, discoveryC],
        swarms: [swarmA, swarmB, swarmC],
        timeoutMs: 60_000,
      });

      assert.equal(rendezvous.connected, true);
      assert.equal(rendezvous.pulseCount >= 1, true);

      const transports = [swarmA, swarmB, swarmC].map((swarm) => swarm.getTransportState());
      for (const transport of transports) {
        assert.equal(transport.connectionOpens >= 1, true);
        assert.equal(transport.discoveryStates.length >= 1, true);
        assert.equal((transport.discoveryStates[0]?.refreshCount ?? 0) >= 2, true);
      }

      assert.equal(
        transports.reduce((sum, transport) => sum + transport.connectionOpens, 0) >= 3,
        true,
      );
    } finally {
      await harness.close();
    }
  },
);
