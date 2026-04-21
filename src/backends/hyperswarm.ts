import Hyperswarm from "hyperswarm";

import type { ReplicationSwarmLike } from "./corestore-replication-lab.js";

type ManagedDht = {
  ready?: () => Promise<void>;
  destroy?: (options?: { force?: boolean }) => Promise<void> | void;
};

export interface CreateHyperswarmReplicationSwarmOptions {
  seed?: Buffer | undefined;
  bootstrap?: string[] | undefined;
}

export interface HyperswarmReplicationSwarm extends ReplicationSwarmLike {
  publicKey: Buffer;
  connectionCount: () => number;
  joinPeer: (publicKey: Buffer) => void;
  listen: () => Promise<void>;
}

export async function createHyperswarmReplicationSwarm(
  options: CreateHyperswarmReplicationSwarmOptions = {},
): Promise<HyperswarmReplicationSwarm> {
  const swarmOptions: {
    seed?: Buffer;
    dht?: ManagedDht;
  } = {};

  let ownedDht: ManagedDht | undefined;

  if (options.seed) {
    swarmOptions.seed = options.seed;
  }

  if (options.bootstrap && options.bootstrap.length > 0) {
    const { default: DHT } = await import("hyperdht");
    const createdDht = new DHT({ bootstrap: options.bootstrap }) as ManagedDht;
    await createdDht.ready?.();
    ownedDht = createdDht;
    swarmOptions.dht = createdDht;
  }

  const swarm = new Hyperswarm(swarmOptions);

  return {
    id: options.seed ? `hyperswarm:${Buffer.from(options.seed).toString("hex").slice(0, 16)}` : "hyperswarm",
    publicKey: swarm.keyPair.publicKey,
    connectionCount() {
      return swarm.connections.size;
    },
    join(topic, joinOptions) {
      return swarm.join(topic, {
        client: true,
        server: true,
        ...joinOptions,
      });
    },
    async listen() {
      await swarm.listen();
    },
    joinPeer(publicKey) {
      swarm.joinPeer(publicKey);
    },
    async flush() {
      await swarm.flush();
    },
    on(event, listener) {
      swarm.on(event, listener);
    },
    async close() {
      await closeHyperswarmReplicationSwarm(swarm, ownedDht);
    },
  };
}

export async function closeHyperswarmReplicationSwarm(
  swarm: {
    close?: () => Promise<void>;
    destroy?: (options?: { force?: boolean }) => Promise<void> | void;
  } | undefined,
  dht: ManagedDht | undefined,
) {
  const destroyResult = swarm?.destroy?.({ force: true });
  if (destroyResult && typeof destroyResult.then === "function") {
    await destroyResult.catch(() => {});
  } else {
    await swarm?.close?.().catch(() => {});
  }

  const destroyDhtResult = dht?.destroy?.({ force: true });
  if (destroyDhtResult && typeof destroyDhtResult.then === "function") {
    await destroyDhtResult.catch(() => {});
  }
}

export function parseHyperswarmBootstrap(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\s]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}
