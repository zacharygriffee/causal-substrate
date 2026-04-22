export interface ReplicationDiscoveryLike {
  destroy?: () => Promise<void>;
  flushed?: () => Promise<void>;
  refresh?: (opts?: Record<string, unknown>) => Promise<void>;
}

export interface ReplicationSwarmLike {
  id?: string;
  connectionCount?: () => number;
  join: (topic: Buffer, opts?: Record<string, unknown>) => ReplicationDiscoveryLike | void;
  flush: (timeoutMs?: number) => Promise<void>;
  close: () => Promise<void>;
  on: (event: "connection", listener: (socket: unknown, peerInfo: unknown) => void) => void;
}

export interface DiscoveryRendezvousOptions {
  discoveryA: ReplicationDiscoveryLike | void;
  discoveryB: ReplicationDiscoveryLike | void;
  pulseIntervalMs?: number | undefined;
  swarmA: ReplicationSwarmLike;
  swarmB: ReplicationSwarmLike;
  timeoutMs: number;
  maxPulses?: number | undefined;
}

export interface DiscoveryMeshRendezvousOptions {
  discoveries: Array<ReplicationDiscoveryLike | void>;
  pulseIntervalMs?: number | undefined;
  swarms: ReplicationSwarmLike[];
  timeoutMs: number;
  maxPulses?: number | undefined;
  minConnectionsPerSwarm?: number | undefined;
}

const DEFAULT_DISCOVERY_PULSE_INTERVAL_MS = 5_000;
const DEFAULT_DISCOVERY_PULSE_LIMIT = 6;

export async function waitForDiscoveryRendezvous(
  options: DiscoveryRendezvousOptions,
): Promise<{
  connected: boolean;
  pulseCount: number;
}> {
  if (
    typeof options.discoveryA?.refresh !== "function" ||
    typeof options.discoveryB?.refresh !== "function" ||
    typeof options.swarmA.connectionCount !== "function" ||
    typeof options.swarmB.connectionCount !== "function"
  ) {
    return {
      connected: false,
      pulseCount: 0,
    };
  }

  const startedAt = Date.now();
  const maxPulses = options.maxPulses ?? DEFAULT_DISCOVERY_PULSE_LIMIT;
  const pulseIntervalMs = options.pulseIntervalMs ?? DEFAULT_DISCOVERY_PULSE_INTERVAL_MS;
  let pulseCount = 0;

  while (Date.now() - startedAt < options.timeoutMs) {
    if (hasMutualConnections(options.swarmA, options.swarmB)) {
      return {
        connected: true,
        pulseCount,
      };
    }

    if (pulseCount >= maxPulses) {
      return {
        connected: hasMutualConnections(options.swarmA, options.swarmB),
        pulseCount,
      };
    }

    pulseCount += 1;

    await Promise.allSettled([
      pulseDiscovery(options.discoveryA, options.swarmA),
      pulseDiscovery(options.discoveryB, options.swarmB),
    ]);

    if (hasMutualConnections(options.swarmA, options.swarmB)) {
      return {
        connected: true,
        pulseCount,
      };
    }

    await sleep(pulseIntervalMs);
  }

  return {
    connected: hasMutualConnections(options.swarmA, options.swarmB),
    pulseCount,
  };
}

export async function waitForDiscoveryMeshRendezvous(
  options: DiscoveryMeshRendezvousOptions,
): Promise<{
  connected: boolean;
  pulseCount: number;
}> {
  if (
    options.discoveries.some((discovery) => typeof discovery?.refresh !== "function") ||
    options.swarms.some((swarm) => typeof swarm.connectionCount !== "function")
  ) {
    return {
      connected: false,
      pulseCount: 0,
    };
  }

  const startedAt = Date.now();
  const maxPulses = options.maxPulses ?? DEFAULT_DISCOVERY_PULSE_LIMIT;
  const pulseIntervalMs = options.pulseIntervalMs ?? DEFAULT_DISCOVERY_PULSE_INTERVAL_MS;
  const minConnectionsPerSwarm = options.minConnectionsPerSwarm ?? 1;
  let pulseCount = 0;

  while (Date.now() - startedAt < options.timeoutMs) {
    if (hasMeshConnections(options.swarms, minConnectionsPerSwarm)) {
      return {
        connected: true,
        pulseCount,
      };
    }

    if (pulseCount >= maxPulses) {
      return {
        connected: hasMeshConnections(options.swarms, minConnectionsPerSwarm),
        pulseCount,
      };
    }

    pulseCount += 1;

    await Promise.allSettled(
      options.discoveries.map((discovery, index) => pulseDiscovery(discovery, options.swarms[index]!)),
    );

    if (hasMeshConnections(options.swarms, minConnectionsPerSwarm)) {
      return {
        connected: true,
        pulseCount,
      };
    }

    await sleep(pulseIntervalMs);
  }

  return {
    connected: hasMeshConnections(options.swarms, minConnectionsPerSwarm),
    pulseCount,
  };
}

export async function pulseDiscovery(
  discovery: ReplicationDiscoveryLike | void,
  swarm: ReplicationSwarmLike,
) {
  await Promise.allSettled([
    discovery?.refresh?.({
      client: true,
      server: true,
    }),
    discovery?.flushed?.(),
    swarm.flush(),
  ]);
}

function hasMutualConnections(
  swarmA: ReplicationSwarmLike,
  swarmB: ReplicationSwarmLike,
): boolean {
  return (swarmA.connectionCount?.() ?? 0) > 0 && (swarmB.connectionCount?.() ?? 0) > 0;
}

function hasMeshConnections(
  swarms: ReplicationSwarmLike[],
  minConnectionsPerSwarm: number,
): boolean {
  return swarms.every((swarm) => (swarm.connectionCount?.() ?? 0) >= minConnectionsPerSwarm);
}

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}
