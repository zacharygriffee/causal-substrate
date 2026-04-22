import Hyperswarm from "hyperswarm";

import type { ReplicationSwarmLike } from "./hyperswarm-rendezvous.js";

type ManagedDht = {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  ready?: () => Promise<void>;
  destroy?: (options?: { force?: boolean }) => Promise<void> | void;
};

const DEFAULT_GRACEFUL_CLOSE_TIMEOUT_MS = 5_000;
const MAX_CONNECTION_EVENT_SAMPLES = 16;
const MAX_DISCOVERY_STATES = 16;
const MAX_TRANSPORT_ERROR_SAMPLES = 8;

export interface CreateHyperswarmReplicationSwarmOptions {
  seed?: Buffer | undefined;
  bootstrap?: string[] | undefined;
  gracefulCloseTimeoutMs?: number | undefined;
}

export interface HyperswarmTransportErrorSample {
  atMs: number;
  code: string | null;
  message: string;
  peerPublicKeyHex: string | null;
  scope: "connection" | "dht" | "swarm";
}

export interface HyperswarmConnectionEventSample {
  atMs: number;
  kind: "open" | "close";
  peerPublicKeyHex: string | null;
}

export interface HyperswarmDiscoveryState {
  client: boolean;
  destroyCount: number;
  flushedCount: number;
  lastDestroyAtMs: number | null;
  lastErrorMessage: string | null;
  lastFlushAtMs: number | null;
  lastJoinAtMs: number | null;
  lastRefreshAtMs: number | null;
  limit: number | null;
  refreshCount: number;
  server: boolean;
  topicHex: string;
}

export interface HyperswarmCloseReport {
  completed: boolean;
  errorMessage: string | null;
  gracefulTimeoutMs: number;
  startedAtMs: number;
  strategy: "graceful" | "forced-after-error" | "forced-after-timeout" | "unavailable";
}

export interface HyperswarmTransportState {
  closeReport: HyperswarmCloseReport | null;
  connectionCloses: number;
  connectionEvents: HyperswarmConnectionEventSample[];
  connectionOpens: number;
  discoveryStates: HyperswarmDiscoveryState[];
  errorCount: number;
  errorSamples: HyperswarmTransportErrorSample[];
  lastSwarmFlushAtMs: number | null;
  swarmFlushCount: number;
  updateCount: number;
}

type InternalHyperswarmTransportState = HyperswarmTransportState & {
  discoveryStateMap: Map<string, HyperswarmDiscoveryState>;
  ownedDiscoverySessions: Set<DiscoverySessionLike>;
};

type DiscoverySessionLike = {
  destroy?: () => Promise<void>;
  flushed?: () => Promise<void>;
  refresh?: (opts?: Record<string, unknown>) => Promise<void>;
};

export interface HyperswarmReplicationSwarm extends ReplicationSwarmLike {
  publicKey: Buffer;
  connectionCount: () => number;
  getTransportState: () => HyperswarmTransportState;
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
  const transportState = createTransportState();

  attachTransportErrorSampling({
    target: swarm as {
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
    },
    scope: "swarm",
    transportState,
  });
  attachTransportErrorSampling({
    target: ownedDht,
    scope: "dht",
    transportState,
  });
  swarm.on("update", () => {
    transportState.updateCount += 1;
  });
  swarm.on("connection", (socket: unknown, peerInfo: unknown) => {
    transportState.connectionOpens += 1;
    recordConnectionEvent({
      kind: "open",
      peerInfo,
      transportState,
    });
    attachTransportErrorSampling({
      target: socket as {
        on?: (event: string, listener: (...args: unknown[]) => void) => void;
      },
      scope: "connection",
      transportState,
      peerInfo,
    });
    const socketTarget = socket as {
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
    };
    socketTarget.on?.("close", () => {
      transportState.connectionCloses += 1;
      recordConnectionEvent({
        kind: "close",
        peerInfo,
        transportState,
      });
    });
  });

  return {
    id: options.seed ? `hyperswarm:${Buffer.from(options.seed).toString("hex").slice(0, 16)}` : "hyperswarm",
    publicKey: swarm.keyPair.publicKey,
    connectionCount() {
      return swarm.connections.size;
    },
    getTransportState() {
      return snapshotTransportState(transportState);
    },
    join(topic, joinOptions) {
      const topicHex = Buffer.from(topic).toString("hex");
      const session = swarm.join(topic, {
        client: true,
        server: true,
        ...joinOptions,
      });
      const discoveryState = touchDiscoveryState(transportState, topicHex, {
        client: truthyJoinOption(joinOptions?.client, true),
        limit: numberJoinOption(joinOptions?.limit),
        server: truthyJoinOption(joinOptions?.server, true),
      });

      return instrumentDiscoverySession(session, discoveryState, transportState);
    },
    async listen() {
      await swarm.listen();
    },
    joinPeer(publicKey) {
      swarm.joinPeer(publicKey);
    },
    async flush() {
      transportState.swarmFlushCount += 1;
      await swarm.flush();
      transportState.lastSwarmFlushAtMs = Date.now();
    },
    on(event, listener) {
      swarm.on(event, listener);
    },
    async close() {
      await closeHyperswarmReplicationSwarm(swarm, ownedDht, {
        discoverySessions: transportState.ownedDiscoverySessions,
        gracefulCloseTimeoutMs: options.gracefulCloseTimeoutMs,
        transportState,
      });
    },
  };
}

export async function closeHyperswarmReplicationSwarm(
  swarm: {
    close?: () => Promise<void>;
    destroy?: (options?: { force?: boolean }) => Promise<void> | void;
  } | undefined,
  dht: ManagedDht | undefined,
  options: {
    discoverySessions?: Iterable<DiscoverySessionLike> | undefined;
    gracefulCloseTimeoutMs?: number | undefined;
    transportState?: HyperswarmTransportState | undefined;
  } = {},
) {
  const gracefulTimeoutMs = options.gracefulCloseTimeoutMs ?? DEFAULT_GRACEFUL_CLOSE_TIMEOUT_MS;
  const closeReport: HyperswarmCloseReport = {
    completed: false,
    errorMessage: null,
    gracefulTimeoutMs,
    startedAtMs: Date.now(),
    strategy: "unavailable",
  };

  if (swarm?.destroy) {
    closeReport.strategy = "graceful";

    try {
      await destroyDiscoverySessions(options.discoverySessions, gracefulTimeoutMs);
      await withTimeout(Promise.resolve(swarm.destroy({ force: false })), gracefulTimeoutMs);
      closeReport.completed = true;
      if (options.transportState) {
        options.transportState.closeReport = closeReport;
      }
      return;
    } catch (error) {
      closeReport.strategy =
        error instanceof TimeoutError ? "forced-after-timeout" : "forced-after-error";
      closeReport.errorMessage = formatErrorMessage(error);

      try {
        await Promise.resolve(swarm.destroy({ force: true }));
        closeReport.completed = true;
      } catch (forcedError) {
        closeReport.errorMessage = formatErrorMessage(forcedError);
      }

      if (options.transportState) {
        options.transportState.closeReport = closeReport;
      }
      return;
    }
  }

  if (swarm?.close) {
    closeReport.strategy = "graceful";
    try {
      await destroyDiscoverySessions(options.discoverySessions, gracefulTimeoutMs);
      await withTimeout(Promise.resolve(swarm.close()), gracefulTimeoutMs);
      closeReport.completed = true;
    } catch (error) {
      closeReport.strategy =
        error instanceof TimeoutError ? "forced-after-timeout" : "forced-after-error";
      closeReport.errorMessage = formatErrorMessage(error);

      try {
        await Promise.resolve(dht?.destroy?.({ force: true }));
        closeReport.completed = true;
      } catch (forcedError) {
        closeReport.errorMessage = formatErrorMessage(forcedError);
      }
    }
  } else if (dht?.destroy) {
    closeReport.strategy = "graceful";
    try {
      await destroyDiscoverySessions(options.discoverySessions, gracefulTimeoutMs);
      await withTimeout(Promise.resolve(dht.destroy({ force: false })), gracefulTimeoutMs);
      closeReport.completed = true;
    } catch (error) {
      closeReport.strategy =
        error instanceof TimeoutError ? "forced-after-timeout" : "forced-after-error";
      closeReport.errorMessage = formatErrorMessage(error);

      try {
        await Promise.resolve(dht.destroy({ force: true }));
        closeReport.completed = true;
      } catch (forcedError) {
        closeReport.errorMessage = formatErrorMessage(forcedError);
      }
    }
  }

  if (options.transportState) {
    options.transportState.closeReport = closeReport;
  }
}

export function parseHyperswarmBootstrap(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\s]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function createTransportState(): InternalHyperswarmTransportState {
  return {
    closeReport: null,
    connectionCloses: 0,
    connectionEvents: [],
    connectionOpens: 0,
    discoveryStateMap: new Map<string, HyperswarmDiscoveryState>(),
    ownedDiscoverySessions: new Set<DiscoverySessionLike>(),
    discoveryStates: [],
    errorCount: 0,
    errorSamples: [],
    lastSwarmFlushAtMs: null,
    swarmFlushCount: 0,
    updateCount: 0,
  };
}

function snapshotTransportState(state: InternalHyperswarmTransportState): HyperswarmTransportState {
  return {
    closeReport: state.closeReport ? { ...state.closeReport } : null,
    connectionCloses: state.connectionCloses,
    connectionEvents: state.connectionEvents.map((sample) => ({ ...sample })),
    connectionOpens: state.connectionOpens,
    discoveryStates: state.discoveryStates.map((sample) => ({ ...sample })),
    errorCount: state.errorCount,
    errorSamples: state.errorSamples.map((sample) => ({ ...sample })),
    lastSwarmFlushAtMs: state.lastSwarmFlushAtMs,
    swarmFlushCount: state.swarmFlushCount,
    updateCount: state.updateCount,
  };
}

function attachTransportErrorSampling(input: {
  target:
    | {
        on?: (event: string, listener: (...args: unknown[]) => void) => void;
      }
    | undefined;
  scope: HyperswarmTransportErrorSample["scope"];
  transportState: InternalHyperswarmTransportState;
  peerInfo?: unknown;
}) {
  if (!input.target?.on) return;

  input.target.on("error", (error: unknown) => {
    recordTransportError({
      error,
      peerInfo: input.peerInfo,
      scope: input.scope,
      transportState: input.transportState,
    });
  });
}

function recordTransportError(input: {
  error: unknown;
  peerInfo?: unknown;
  scope: HyperswarmTransportErrorSample["scope"];
  transportState: InternalHyperswarmTransportState;
}) {
  input.transportState.errorCount += 1;
  if (input.transportState.errorSamples.length >= MAX_TRANSPORT_ERROR_SAMPLES) {
    return;
  }

  input.transportState.errorSamples.push({
    atMs: Date.now(),
    code: errorCode(input.error),
    message: formatErrorMessage(input.error),
    peerPublicKeyHex: formatPeerPublicKey(input.peerInfo),
    scope: input.scope,
  });
}

function recordConnectionEvent(input: {
  kind: HyperswarmConnectionEventSample["kind"];
  peerInfo?: unknown;
  transportState: InternalHyperswarmTransportState;
}) {
  if (input.transportState.connectionEvents.length >= MAX_CONNECTION_EVENT_SAMPLES) {
    input.transportState.connectionEvents.shift();
  }

  input.transportState.connectionEvents.push({
    atMs: Date.now(),
    kind: input.kind,
    peerPublicKeyHex: formatPeerPublicKey(input.peerInfo),
  });
}

function instrumentDiscoverySession(
  session: DiscoverySessionLike | void,
  state: HyperswarmDiscoveryState,
  transportState: InternalHyperswarmTransportState,
): DiscoverySessionLike | void {
  if (!session) return session;

  const instrumented = {
    ...session,
    async destroy() {
      try {
        const result = await session.destroy?.();
        state.destroyCount += 1;
        state.lastDestroyAtMs = Date.now();
        transportState.ownedDiscoverySessions.delete(instrumented);
        return result;
      } catch (error) {
        state.lastErrorMessage = formatErrorMessage(error);
        throw error;
      }
    },
    async flushed() {
      try {
        const result = await session.flushed?.();
        state.flushedCount += 1;
        state.lastFlushAtMs = Date.now();
        return result;
      } catch (error) {
        state.lastErrorMessage = formatErrorMessage(error);
        throw error;
      }
    },
    async refresh(opts) {
      try {
        const result = await session.refresh?.(opts);
        state.refreshCount += 1;
        state.lastRefreshAtMs = Date.now();
        if (opts) {
          state.client = truthyJoinOption(opts.client, state.client);
          state.server = truthyJoinOption(opts.server, state.server);
          state.limit = numberJoinOption(opts.limit) ?? state.limit;
        }
        return result;
      } catch (error) {
        state.lastErrorMessage = formatErrorMessage(error);
        throw error;
      }
    },
  };

  transportState.ownedDiscoverySessions.add(instrumented);
  return instrumented;
}

function touchDiscoveryState(
  transportState: InternalHyperswarmTransportState,
  topicHex: string,
  input: {
    client: boolean;
    limit: number | null;
    server: boolean;
  },
): HyperswarmDiscoveryState {
  const existing = transportState.discoveryStateMap.get(topicHex);
  if (existing) {
    existing.client = input.client;
    existing.limit = input.limit;
    existing.server = input.server;
    existing.lastJoinAtMs = Date.now();
    return existing;
  }

  const state: HyperswarmDiscoveryState = {
    client: input.client,
    destroyCount: 0,
    flushedCount: 0,
    lastDestroyAtMs: null,
    lastErrorMessage: null,
    lastFlushAtMs: null,
    lastJoinAtMs: Date.now(),
    lastRefreshAtMs: Date.now(),
    limit: input.limit,
    refreshCount: 1,
    server: input.server,
    topicHex,
  };

  transportState.discoveryStateMap.set(topicHex, state);
  transportState.discoveryStates = Array.from(transportState.discoveryStateMap.values()).slice(
    -MAX_DISCOVERY_STATES,
  );
  return state;
}

function truthyJoinOption(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  return fallback;
}

function numberJoinOption(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return null;
}

function formatPeerPublicKey(peerInfo: unknown): string | null {
  const publicKey =
    peerInfo &&
    typeof peerInfo === "object" &&
    "publicKey" in peerInfo &&
    Buffer.isBuffer(peerInfo.publicKey)
      ? peerInfo.publicKey
      : null;

  return publicKey ? publicKey.toString("hex") : null;
}

function errorCode(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return null;
  }

  return typeof error.code === "string" ? error.code : null;
}

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

async function destroyDiscoverySessions(
  sessions: Iterable<DiscoverySessionLike> | undefined,
  timeoutMs: number,
) {
  if (!sessions) {
    return;
  }

  const pending = Array.from(sessions);
  if (pending.length === 0) {
    return;
  }

  await withTimeout(
    Promise.allSettled(
      pending.map(async (session) => {
        await session.destroy?.();
      }),
    ).then(() => undefined),
    timeoutMs,
  );
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return promise;
  }

  return await new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(`timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}
