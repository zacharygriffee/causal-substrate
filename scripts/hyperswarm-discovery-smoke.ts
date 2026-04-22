import { createHash, randomBytes } from "node:crypto";

import {
  createHyperswarmReplicationSwarm,
  parseHyperswarmBootstrap,
  type HyperswarmTransportState,
} from "../src/index.js";
import {
  type ReplicationDiscoveryLike,
  waitForDiscoveryMeshRendezvous,
  waitForDiscoveryRendezvous,
} from "../src/backends/hyperswarm-rendezvous.js";

interface SmokeHarness {
  bootstrap?: string[];
  close: () => Promise<void>;
  mode: "public" | "testnet";
}

interface SmokeSummary {
  elapsedMs: number;
  mode: SmokeHarness["mode"];
  pulseCount: number;
  success: boolean;
  topicHex: string;
  swarms: Array<{
    connections: number;
    id: string | undefined;
    publicKeyHex: string;
    transport: HyperswarmTransportState;
  }>;
}

const SHOULD_USE_PUBLIC = process.env.CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC === "1";
const CONFIGURED_BOOTSTRAP = parseHyperswarmBootstrap(
  process.env.CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP,
);
const WAIT_MS = parsePositiveInt(process.env.CAUSAL_SUBSTRATE_DISCOVERY_WAIT_MS, 120_000);
const PULSE_INTERVAL_MS = parsePositiveInt(
  process.env.CAUSAL_SUBSTRATE_DISCOVERY_PULSE_INTERVAL_MS,
  5_000,
);
const MAX_PULSES = parsePositiveInt(process.env.CAUSAL_SUBSTRATE_DISCOVERY_PULSES, 6);
const PEER_COUNT = parsePositiveInt(process.env.CAUSAL_SUBSTRATE_DISCOVERY_PEERS, 2);
const USE_RANDOM_TOPIC = process.env.CAUSAL_SUBSTRATE_DISCOVERY_RANDOM_TOPIC !== "0";
const TOPIC_LABEL =
  process.env.CAUSAL_SUBSTRATE_DISCOVERY_TOPIC ?? "causal-substrate/hyperswarm-discovery-smoke";

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const harness = await openSmokeHarness();
  const swarms = await Promise.all(
    Array.from({ length: PEER_COUNT }, (_, index) =>
      createHyperswarmReplicationSwarm({
        bootstrap: harness.bootstrap,
        gracefulCloseTimeoutMs: 5_000,
        seed: Buffer.alloc(32, 0x11 + index),
      }),
    ),
  );
  const topic = createTopic();
  const startedAt = Date.now();

  await Promise.all(swarms.map((swarm) => swarm.listen()));

  const discoveries = swarms.map(
    (swarm) =>
      swarm.join(topic, {
        client: true,
        server: true,
      }) as ReplicationDiscoveryLike,
  );

  let success = false;
  let pulseCount = 0;

  try {
    await Promise.allSettled(swarms.map((swarm) => swarm.flush()));
    const rendezvous =
      swarms.length === 2
        ? await waitForDiscoveryRendezvous({
            discoveryA: discoveries[0],
            discoveryB: discoveries[1],
            maxPulses: MAX_PULSES,
            pulseIntervalMs: PULSE_INTERVAL_MS,
            swarmA: swarms[0]!,
            swarmB: swarms[1]!,
            timeoutMs: WAIT_MS,
          })
        : await waitForDiscoveryMeshRendezvous({
            discoveries,
            maxPulses: MAX_PULSES,
            pulseIntervalMs: PULSE_INTERVAL_MS,
            swarms,
            timeoutMs: WAIT_MS,
          });
    success = rendezvous.connected;
    pulseCount = rendezvous.pulseCount;
  } finally {
    const summary: SmokeSummary = {
      elapsedMs: Date.now() - startedAt,
      mode: harness.mode,
      pulseCount,
      success,
      topicHex: topic.toString("hex"),
      swarms: swarms.map((swarm) => ({
        connections: swarm.connectionCount(),
        id: swarm.id,
        publicKeyHex: swarm.publicKey.toString("hex"),
        transport: swarm.getTransportState(),
      })),
    };

    console.log(JSON.stringify(summary, null, 2));

    await Promise.allSettled([
      ...discoveries.map((discovery) => discovery.destroy?.()),
      ...swarms.map((swarm) => swarm.close()),
      harness.close(),
    ]);

    if (!success) {
      throw new Error(
        `hyperswarm discovery smoke did not establish mutual connections within ${WAIT_MS}ms`,
      );
    }
  }
}

async function openSmokeHarness(): Promise<SmokeHarness> {
  if (CONFIGURED_BOOTSTRAP.length > 0) {
    return {
      bootstrap: CONFIGURED_BOOTSTRAP,
      close: async () => {},
      mode: "public",
    };
  }

  if (SHOULD_USE_PUBLIC) {
    return {
      close: async () => {},
      mode: "public",
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
    mode: "testnet",
  };
}

function createTopic() {
  if (USE_RANDOM_TOPIC) {
    return randomBytes(32);
  }

  return createHash("sha256").update(TOPIC_LABEL).digest();
}

function parsePositiveInt(raw: string | undefined, fallback: number) {
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}
