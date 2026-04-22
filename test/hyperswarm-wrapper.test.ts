import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";

import {
  createHyperswarmReplicationSwarm,
  closeHyperswarmReplicationSwarm,
  type HyperswarmTransportState,
} from "../src/backends/hyperswarm.js";
import { waitForDiscoveryRendezvous } from "../src/backends/hyperswarm-rendezvous.js";

function createTransportState(): HyperswarmTransportState {
  return {
    closeReport: null,
    connectionCloses: 0,
    connectionEvents: [],
    connectionOpens: 0,
    discoveryStates: [],
    errorCount: 0,
    errorSamples: [],
    lastSwarmFlushAtMs: null,
    swarmFlushCount: 0,
    updateCount: 0,
  };
}

test("closeHyperswarmReplicationSwarm prefers graceful destroy before forcing", async () => {
  const calls: boolean[] = [];
  const transportState = createTransportState();

  await closeHyperswarmReplicationSwarm(
    {
      async destroy(options) {
        calls.push(Boolean(options?.force));
      },
    },
    undefined,
    {
      gracefulCloseTimeoutMs: 50,
      transportState,
    },
  );

  assert.deepEqual(calls, [false]);
  assert.equal(transportState.closeReport?.strategy, "graceful");
  assert.equal(transportState.closeReport?.completed, true);
});

test("closeHyperswarmReplicationSwarm forces destroy after graceful timeout", async () => {
  const calls: boolean[] = [];
  const transportState = createTransportState();

  await closeHyperswarmReplicationSwarm(
    {
      destroy(options) {
        calls.push(Boolean(options?.force));
        if (options?.force) {
          return Promise.resolve();
        }

        return new Promise<void>(() => {});
      },
    },
    undefined,
    {
      gracefulCloseTimeoutMs: 20,
      transportState,
    },
  );

  assert.deepEqual(calls, [false, true]);
  assert.equal(transportState.closeReport?.strategy, "forced-after-timeout");
  assert.equal(transportState.closeReport?.completed, true);
});

test("closeHyperswarmReplicationSwarm does not double-destroy the owned DHT when swarm destroy exists", async () => {
  let dhtDestroyCount = 0;
  const transportState = createTransportState();

  await closeHyperswarmReplicationSwarm(
    {
      async destroy() {},
    },
    {
      async destroy() {
        dhtDestroyCount += 1;
      },
    },
    {
      gracefulCloseTimeoutMs: 50,
      transportState,
    },
  );

  assert.equal(dhtDestroyCount, 0);
  assert.equal(transportState.closeReport?.completed, true);
});

test("closeHyperswarmReplicationSwarm drains owned discovery sessions before destroying swarm", async () => {
  const calls: string[] = [];
  const transportState = createTransportState();

  await closeHyperswarmReplicationSwarm(
    {
      async destroy() {
        calls.push("swarm-destroy");
      },
    },
    undefined,
    {
      discoverySessions: [
        {
          async destroy() {
            calls.push("discovery-a");
          },
        },
        {
          async destroy() {
            calls.push("discovery-b");
          },
        },
      ],
      gracefulCloseTimeoutMs: 50,
      transportState,
    },
  );

  assert.deepEqual(calls, ["discovery-a", "discovery-b", "swarm-destroy"]);
  assert.equal(transportState.closeReport?.strategy, "graceful");
  assert.equal(transportState.closeReport?.completed, true);
});

test("closeHyperswarmReplicationSwarm still forces termination if discovery drain hangs", async () => {
  const calls: boolean[] = [];
  const transportState = createTransportState();
  let discoveryDestroyCount = 0;

  await closeHyperswarmReplicationSwarm(
    {
      destroy(options) {
        calls.push(Boolean(options?.force));
        return Promise.resolve();
      },
    },
    undefined,
    {
      discoverySessions: [
        {
          destroy() {
            discoveryDestroyCount += 1;
            return new Promise<void>(() => {});
          },
        },
      ],
      gracefulCloseTimeoutMs: 20,
      transportState,
    },
  );

  assert.equal(discoveryDestroyCount, 1);
  assert.deepEqual(calls, [true]);
  assert.equal(transportState.closeReport?.strategy, "forced-after-timeout");
  assert.equal(transportState.closeReport?.completed, true);
});

test(
  "createHyperswarmReplicationSwarm records joined-topic discovery state",
  { timeout: 60_000 },
  async () => {
    const { default: createTestnet } = await import("hyperdht/testnet.js");
    const testnet = await createTestnet(3, { host: "127.0.0.1" });
    const bootstrap = testnet.bootstrap.map((node: { host: string; port: number }) => {
      return `${node.host}:${node.port}`;
    });
    const swarm = await createHyperswarmReplicationSwarm({
      bootstrap,
      gracefulCloseTimeoutMs: 1_000,
    });
    const topic = randomBytes(32);
    const topicHex = topic.toString("hex");

    try {
      await swarm.listen();

      const discovery = swarm.join(topic, {
        client: true,
        limit: 2,
        server: true,
      }) as {
        destroy?: () => Promise<void>;
        flushed?: () => Promise<void>;
        refresh?: (opts?: Record<string, unknown>) => Promise<void>;
      };

      await discovery.refresh?.({
        client: true,
        limit: 1,
        server: false,
      });
      await Promise.race([
        discovery.flushed?.() ?? Promise.resolve(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("timed out waiting for discovery flush")), 10_000);
        }),
      ]);

      const state = swarm.getTransportState();
      const discoveryState = state.discoveryStates.find((entry) => entry.topicHex === topicHex);

      assert.ok(discoveryState);
      assert.equal(discoveryState?.flushedCount, 1);
      assert.equal(discoveryState?.refreshCount, 2);
      assert.equal(discoveryState?.client, true);
      assert.equal(discoveryState?.server, false);
      assert.equal(discoveryState?.limit, 1);
      assert.ok(discoveryState?.lastJoinAtMs);
      assert.ok(discoveryState?.lastRefreshAtMs);
      assert.ok(discoveryState?.lastFlushAtMs);

      await discovery.destroy?.();

      const destroyedState = swarm
        .getTransportState()
        .discoveryStates.find((entry) => entry.topicHex === topicHex);
      assert.equal(destroyedState?.destroyCount, 1);
      assert.ok(destroyedState?.lastDestroyAtMs);
    } finally {
      await swarm.close();
      await testnet.destroy();
    }
  },
);

test(
  "createHyperswarmReplicationSwarm rendezvous works with explicit bootstrap hosts",
  { timeout: 60_000 },
  async () => {
    const { default: createTestnet } = await import("hyperdht/testnet.js");
    const testnet = await createTestnet(3, { host: "127.0.0.1" });
    const bootstrap = testnet.bootstrap.map((node: { host: string; port: number }) => {
      return `${node.host}:${node.port}`;
    });
    const swarmA = await createHyperswarmReplicationSwarm({
      bootstrap,
      gracefulCloseTimeoutMs: 1_000,
      seed: Buffer.alloc(32, 0x61),
    });
    const swarmB = await createHyperswarmReplicationSwarm({
      bootstrap,
      gracefulCloseTimeoutMs: 1_000,
      seed: Buffer.alloc(32, 0x62),
    });
    const topic = randomBytes(32);

    try {
      await Promise.all([swarmA.listen(), swarmB.listen()]);

      const discoveryA = swarmA.join(topic, {
        client: true,
        server: true,
      });
      const discoveryB = swarmB.join(topic, {
        client: true,
        server: true,
      });

      await Promise.allSettled([swarmA.flush(), swarmB.flush()]);

      const rendezvous = await waitForDiscoveryRendezvous({
        discoveryA,
        discoveryB,
        swarmA,
        swarmB,
        timeoutMs: 30_000,
      });

      assert.equal(rendezvous.connected, true);
      assert.equal(rendezvous.pulseCount >= 1, true);
      assert.equal(swarmA.getTransportState().connectionOpens >= 1, true);
      assert.equal(swarmB.getTransportState().connectionOpens >= 1, true);
    } finally {
      await Promise.allSettled([swarmA.close(), swarmB.close(), testnet.destroy()]);
    }
  },
);
