import { connect, listen } from "@neonloom/plex";
import { makeCodec } from "@neonloom/plex/codec";

import { negotiateCapabilityExchange } from "../kernel/capability-surface.js";
import { computeDiscoveryJoinSet } from "../kernel/discovery-projection.js";
import { Substrate } from "../kernel/substrate.js";
import {
  ArtifactEnvelope,
  CapabilityExchangeDecision,
  CapabilitySurface,
  DiscoveryJoinSet,
  View,
} from "../kernel/types.js";
import type { ReplicationDiscoveryLike, ReplicationSwarmLike } from "./hyperswarm-rendezvous.js";
import { pulseDiscovery } from "./hyperswarm-rendezvous.js";

const DEFAULT_SWARM_FLUSH_TIMEOUT_MS = 30_000;
const DEFAULT_DISCOVERY_PULSE_INTERVAL_MS = 5_000;
const DEFAULT_DISCOVERY_PULSE_LIMIT = 6;
const jsonCodec = makeCodec("json");
const channelId = new TextEncoder().encode("causal-substrate-discovery-capability-v1");

export interface HyperswarmDiscoveryLabOptions {
  createSwarm: (
    seedOrOpts?: Buffer,
    topics?: Map<string, unknown>,
  ) => ReplicationSwarmLike | Promise<ReplicationSwarmLike>;
  topics?: Map<string, unknown> | undefined;
  namespaceParts?: string[] | undefined;
  now?: (() => string) | undefined;
  flushTimeoutMs?: number | undefined;
}

interface CapabilityChannelHandle {
  once(event: string, listener: (value: unknown) => void): void;
  destroy?: () => void;
  write: (data: unknown) => boolean;
  resume(): void;
}

interface DiscoveryJoinPeer {
  id: string;
  swarm: ReplicationSwarmLike;
  joinSet: DiscoveryJoinSet;
  discoveries: Array<ReplicationDiscoveryLike | void>;
}

export interface DiscoveryJoinSetTransportTrace {
  peerId: string;
  connectionCount: number;
  joinedTopicKinds: string[];
  joinedTopicKeys: string[];
}

export interface DiscoveryJoinSetTransportPicture {
  peerIds: string[];
  pulseCount: number;
  sharedTopicKeys: string[];
  sharedTopicKinds: string[];
  traces: DiscoveryJoinSetTransportTrace[];
}

export interface HyperswarmDiscoveryJoinSetLabReport {
  namespaceParts: string[];
  peerIds: string[];
  joinSetSizes: number[];
  sharedTopicKinds: string[];
  transportPicture: DiscoveryJoinSetTransportPicture;
}

export interface CapabilityDiscoveryTransportTrace {
  localPeerId: string;
  remotePeerId: string;
  decision: CapabilityExchangeDecision;
  sentPayloadKinds: Array<"view" | "receipt">;
  receivedPayloadKinds: Array<"view" | "receipt">;
}

export interface CapabilityDiscoveryTransportPicture {
  peerIds: string[];
  pulseCount: number;
  sharedTopicKinds: string[];
  traces: CapabilityDiscoveryTransportTrace[];
}

export interface HyperswarmDiscoveryCapabilityMeshLabReport {
  namespaceParts: string[];
  peerIds: string[];
  joinSetSizes: number[];
  sharedTopicKinds: string[];
  degradedFromFullDecision: CapabilityExchangeDecision;
  degradedFromRelayDecision: CapabilityExchangeDecision;
  fullFromRelayDecision: CapabilityExchangeDecision;
  receivedArtifactKinds: ArtifactEnvelope["kind"][];
  receivedPayloadKinds: Array<"view" | "receipt">;
  transportPicture: CapabilityDiscoveryTransportPicture;
}

export async function runHyperswarmDiscoveryJoinSetLab(
  options: HyperswarmDiscoveryLabOptions,
): Promise<HyperswarmDiscoveryJoinSetLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const swarmA = await options.createSwarm(Buffer.alloc(32, 91), topics);
  const swarmB = await options.createSwarm(Buffer.alloc(32, 92), topics);
  const timeoutMs = options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS;
  const substrate = new Substrate(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "discovery-transport-basis",
      dimensions: ["containment", "adjacency", "concern"],
    });
    const campusBranch = substrate.createBranch({
      role: "context",
      label: "campus-branch",
      basisId: basis.id,
    });
    const campus = substrate.createContext({
      label: "campus",
      branchId: campusBranch.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "room-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      label: "room",
      branchId: roomBranch.id,
      parentContextId: campus.id,
    });
    const courtyardBranch = substrate.createBranch({
      role: "context",
      label: "courtyard-branch",
      basisId: basis.id,
    });
    const courtyard = substrate.createContext({
      label: "courtyard",
      branchId: courtyardBranch.id,
      parentContextId: campus.id,
    });
    const observerA = substrate.createObserver({
      label: "room-observer",
      basisId: basis.id,
    });
    const observerB = substrate.createObserver({
      label: "courtyard-observer",
      basisId: basis.id,
    });
    const observerBranchA = substrate.createBranch({
      role: "observer",
      label: "room-observer-branch",
      basisId: basis.id,
      observerId: observerA.id,
      contextId: room.id,
    });
    const observerBranchB = substrate.createBranch({
      role: "observer",
      label: "courtyard-observer-branch",
      basisId: basis.id,
      observerId: observerB.id,
      contextId: courtyard.id,
    });

    const joinSetA = computeDiscoveryJoinSet({
      observerBranch: observerBranchA,
      contexts: substrate.state.contexts,
      portals: substrate.state.portals,
      adjacentContextIds: [courtyard.id],
      concernOverlays: [
        {
          concern: "camera",
          quantization: "coarse-v1",
          scopeAnchorId: campus.id,
        },
      ],
    });
    const joinSetB = computeDiscoveryJoinSet({
      observerBranch: observerBranchB,
      contexts: substrate.state.contexts,
      portals: substrate.state.portals,
      adjacentContextIds: [room.id],
      concernOverlays: [
        {
          concern: "camera",
          quantization: "coarse-v1",
          scopeAnchorId: campus.id,
        },
      ],
    });

    const peerA = joinDiscoverySet({
      id: "room-discovery-peer",
      joinSet: joinSetA,
      swarm: swarmA,
    });
    const peerB = joinDiscoverySet({
      id: "courtyard-discovery-peer",
      joinSet: joinSetB,
      swarm: swarmB,
    });

    await Promise.all([swarmA.flush(timeoutMs), swarmB.flush(timeoutMs)]);
    const pulseCount = await waitForPeerDiscovery({
      peers: [peerA, peerB],
      timeoutMs,
    });

    return {
      namespaceParts: options.namespaceParts ?? [],
      peerIds: [peerA.id, peerB.id],
      joinSetSizes: [joinSetA.projections.length, joinSetB.projections.length],
      sharedTopicKinds: getSharedTopicKinds(joinSetA, joinSetB),
      transportPicture: {
        peerIds: [peerA.id, peerB.id],
        pulseCount,
        sharedTopicKeys: getSharedTopicKeys(joinSetA, joinSetB),
        sharedTopicKinds: getSharedTopicKinds(joinSetA, joinSetB),
        traces: [peerA, peerB].map((peer) => ({
          peerId: peer.id,
          connectionCount: peer.swarm.connectionCount?.() ?? 0,
          joinedTopicKinds: peer.joinSet.projections.map((projection) => projection.topicKind),
          joinedTopicKeys: peer.joinSet.topicKeys,
        })),
      },
    };
  } finally {
    await Promise.allSettled([swarmA.close(), swarmB.close()]);
  }
}

export async function runHyperswarmDiscoveryCapabilityMeshLab(
  options: HyperswarmDiscoveryLabOptions,
): Promise<HyperswarmDiscoveryCapabilityMeshLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const degradedSwarm = await options.createSwarm(Buffer.alloc(32, 0xa1), topics);
  const fullSwarm = await options.createSwarm(Buffer.alloc(32, 0xa2), topics);
  const relaySwarm = await options.createSwarm(Buffer.alloc(32, 0xa3), topics);
  const channels: Array<{ destroy?: () => void }> = [];
  const timeoutMs = options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS;
  const substrate = new Substrate(options.now ? { now: options.now } : {});

  const degradedSurface: CapabilitySurface = {
    id: "observer-a-capability-surface",
    peerRole: "observer-witness",
    basisId: "visual-rb",
    sourceBranchId: "observer-a-branch",
    primaryContextId: "room-context",
    visibleContextIds: ["campus-context", "courtyard-context"],
    supportedDimensions: ["shape", "red", "blue"],
    missingDimensions: ["green"],
    offer: {
      artifactKinds: ["view", "receipt"],
      exchangeModes: ["view-only", "receipt-only"],
      branchRoles: ["observer", "referent"],
      concernTags: ["camera"],
    },
    request: {
      artifactKinds: ["view", "receipt"],
      preferredExchangeModes: ["view-only", "receipt-only"],
      branchRoles: ["observer", "referent"],
      concernTags: ["camera"],
    },
  };

  const fullSurface: CapabilitySurface = {
    id: "observer-b-capability-surface",
    peerRole: "observer-witness",
    basisId: "visual-rgb",
    sourceBranchId: "observer-b-branch",
    primaryContextId: "courtyard-context",
    visibleContextIds: ["campus-context", "room-context"],
    supportedDimensions: ["shape", "red", "green", "blue"],
    offer: {
      artifactKinds: ["view", "receipt", "state-estimate"],
      exchangeModes: ["view-only", "receipt-only"],
      branchRoles: ["observer", "referent"],
      concernTags: ["camera"],
    },
    request: {
      artifactKinds: ["view", "receipt"],
      preferredExchangeModes: ["view-only", "receipt-only"],
      branchRoles: ["observer", "referent"],
      concernTags: ["camera"],
    },
  };

  const relaySurface: CapabilitySurface = {
    id: "relay-c-capability-surface",
    peerRole: "relay",
    basisId: "translation-receipt",
    sourceBranchId: "relay-c-branch",
    primaryContextId: "campus-context",
    visibleContextIds: ["room-context", "courtyard-context"],
    supportedDimensions: ["shape"],
    offer: {
      artifactKinds: ["receipt"],
      exchangeModes: ["receipt-only"],
      branchRoles: ["derived", "referent"],
      concernTags: ["camera", "translation"],
    },
    request: {
      artifactKinds: ["receipt"],
      preferredExchangeModes: ["receipt-only"],
      branchRoles: ["derived", "referent"],
      concernTags: ["camera", "translation"],
    },
  };

  try {
    const basis = substrate.createBasis({
      label: "discovery-capability-basis",
      dimensions: ["containment", "adjacency", "concern", "shape", "color"],
    });
    const campusBranch = substrate.createBranch({
      role: "context",
      label: "campus-branch",
      basisId: basis.id,
    });
    const campus = substrate.createContext({
      label: "campus",
      branchId: campusBranch.id,
    });
    const roomBranch = substrate.createBranch({
      role: "context",
      label: "room-branch",
      basisId: basis.id,
    });
    const room = substrate.createContext({
      label: "room",
      branchId: roomBranch.id,
      parentContextId: campus.id,
    });
    const courtyardBranch = substrate.createBranch({
      role: "context",
      label: "courtyard-branch",
      basisId: basis.id,
    });
    const courtyard = substrate.createContext({
      label: "courtyard",
      branchId: courtyardBranch.id,
      parentContextId: campus.id,
    });
    const degradedObserver = substrate.createObserver({
      label: "degraded-observer",
      basisId: basis.id,
    });
    const fullObserver = substrate.createObserver({
      label: "full-observer",
      basisId: basis.id,
    });
    const relayObserver = substrate.createObserver({
      label: "relay-observer",
      basisId: basis.id,
    });
    const degradedBranch = substrate.createBranch({
      role: "observer",
      label: "degraded-observer-branch",
      basisId: basis.id,
      observerId: degradedObserver.id,
      contextId: room.id,
    });
    const fullBranch = substrate.createBranch({
      role: "observer",
      label: "full-observer-branch",
      basisId: basis.id,
      observerId: fullObserver.id,
      contextId: courtyard.id,
    });
    const relayBranch = substrate.createBranch({
      role: "derived",
      label: "relay-branch",
      basisId: basis.id,
      observerId: relayObserver.id,
      contextId: campus.id,
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "mesh-ball-branch",
      basisId: basis.id,
    });
    const view = substrate.createView({
      kind: "context-surface",
      label: "mesh-ball-view",
      sourceIds: [fullBranch.id, referentBranch.id],
      projection: "bounded mediated ball view from the full observer",
    });
    const viewArtifact = substrate.createArtifactEnvelope({
      kind: "view",
      label: "mesh-ball-view-artifact",
      sourceIds: [fullBranch.id, referentBranch.id],
      payloadIds: [view.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: fullObserver.id,
        source: "hyperswarm-discovery-capability-mesh-lab",
      },
    });
    const receipt = {
      id: "relay_receipt_1",
      label: "relay-receipt",
      summary: "relay only exposes bounded confirmation rather than a view",
      sourceIds: [relayBranch.id, referentBranch.id],
    };
    const receiptArtifact = substrate.createArtifactEnvelope({
      kind: "receipt",
      label: "relay-receipt-artifact",
      sourceIds: [relayBranch.id, referentBranch.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: relayObserver.id,
        source: "hyperswarm-discovery-capability-mesh-lab",
      },
    });

    const degradedJoinSet = computeDiscoveryJoinSet({
      observerBranch: degradedBranch,
      contexts: substrate.state.contexts,
      portals: substrate.state.portals,
      adjacentContextIds: [courtyard.id],
      concernOverlays: [
        {
          concern: "camera",
          quantization: "coarse-v1",
          scopeAnchorId: campus.id,
        },
      ],
    });
    const fullJoinSet = computeDiscoveryJoinSet({
      observerBranch: fullBranch,
      contexts: substrate.state.contexts,
      portals: substrate.state.portals,
      adjacentContextIds: [room.id],
      concernOverlays: [
        {
          concern: "camera",
          quantization: "coarse-v1",
          scopeAnchorId: campus.id,
        },
      ],
    });
    const relayJoinSet = computeDiscoveryJoinSet({
      observerBranch: relayBranch,
      contexts: substrate.state.contexts,
      portals: substrate.state.portals,
      concernOverlays: [
        {
          concern: "camera",
          quantization: "coarse-v1",
          scopeAnchorId: campus.id,
        },
      ],
    });

    const degradedReady = openCapabilityMeshPeer({
      swarm: degradedSwarm,
      localSurface: degradedSurface,
      expectedConnections: 2,
      channels,
      timeoutMs,
    });
    const fullReady = openCapabilityMeshPeer({
      swarm: fullSwarm,
      localSurface: fullSurface,
      expectedConnections: 2,
      channels,
      timeoutMs,
    });
    const relayReady = openCapabilityMeshPeer({
      swarm: relaySwarm,
      localSurface: relaySurface,
      expectedConnections: 2,
      channels,
      timeoutMs,
    });

    const peers = [
      joinDiscoverySet({
        id: degradedSurface.id,
        joinSet: degradedJoinSet,
        swarm: degradedSwarm,
      }),
      joinDiscoverySet({
        id: fullSurface.id,
        joinSet: fullJoinSet,
        swarm: fullSwarm,
      }),
      joinDiscoverySet({
        id: relaySurface.id,
        joinSet: relayJoinSet,
        swarm: relaySwarm,
      }),
    ];

    await Promise.all([degradedSwarm.flush(timeoutMs), fullSwarm.flush(timeoutMs), relaySwarm.flush(timeoutMs)]);
    const pulseCount = await waitForPeerDiscovery({
      peers,
      timeoutMs,
      minConnectionsPerPeer: 2,
    });

    const [degradedPeer, fullPeer, relayPeer] = await Promise.all([
      degradedReady,
      fullReady,
      relayReady,
    ]);

    const degradedFromFull = degradedPeer.connections.get(fullSurface.id);
    const degradedFromRelay = degradedPeer.connections.get(relaySurface.id);
    const fullFromRelay = fullPeer.connections.get(relaySurface.id);
    const fullToDegraded = fullPeer.connections.get(degradedSurface.id);
    const relayToDegraded = relayPeer.connections.get(degradedSurface.id);

    if (
      !degradedFromFull ||
      !degradedFromRelay ||
      !fullFromRelay ||
      !fullToDegraded ||
      !relayToDegraded
    ) {
      throw new Error("missing expected discovery-capability mesh connections");
    }

    const degradedFromFullDecision = negotiateCapabilityExchange(
      degradedSurface,
      degradedFromFull.remoteSurface,
    );
    const degradedFromRelayDecision = negotiateCapabilityExchange(
      degradedSurface,
      degradedFromRelay.remoteSurface,
    );
    const fullFromRelayDecision = negotiateCapabilityExchange(
      fullSurface,
      fullFromRelay.remoteSurface,
    );

    const receivedViewPromise = waitForEvent<{
      artifact: ArtifactEnvelope;
      view: View;
      payloadKind: "view";
    }>(degradedFromFull.channel, "data", timeoutMs);
    const receivedReceiptPromise = waitForEvent<{
      artifact: ArtifactEnvelope;
      receipt: typeof receipt;
      payloadKind: "receipt";
    }>(degradedFromRelay.channel, "data", timeoutMs);

    fullToDegraded.channel.write({
      artifact: viewArtifact,
      view,
      payloadKind: "view",
    });
    relayToDegraded.channel.write({
      artifact: receiptArtifact,
      receipt,
      payloadKind: "receipt",
    });

    const [receivedView, receivedReceipt] = await Promise.all([
      receivedViewPromise,
      receivedReceiptPromise,
    ]);

    return {
      namespaceParts: options.namespaceParts ?? [],
      peerIds: peers.map((peer) => peer.id),
      joinSetSizes: peers.map((peer) => peer.joinSet.projections.length),
      sharedTopicKinds: intersectTopicKinds([degradedJoinSet, fullJoinSet, relayJoinSet]),
      degradedFromFullDecision,
      degradedFromRelayDecision,
      fullFromRelayDecision,
      receivedArtifactKinds: [receivedView.artifact.kind, receivedReceipt.artifact.kind],
      receivedPayloadKinds: [receivedView.payloadKind, receivedReceipt.payloadKind],
      transportPicture: {
        peerIds: peers.map((peer) => peer.id),
        pulseCount,
        sharedTopicKinds: intersectTopicKinds([degradedJoinSet, fullJoinSet, relayJoinSet]),
        traces: [
          {
            localPeerId: degradedSurface.id,
            remotePeerId: fullSurface.id,
            decision: degradedFromFullDecision,
            sentPayloadKinds: [],
            receivedPayloadKinds: ["view"],
          },
          {
            localPeerId: degradedSurface.id,
            remotePeerId: relaySurface.id,
            decision: degradedFromRelayDecision,
            sentPayloadKinds: [],
            receivedPayloadKinds: ["receipt"],
          },
          {
            localPeerId: fullSurface.id,
            remotePeerId: relaySurface.id,
            decision: fullFromRelayDecision,
            sentPayloadKinds: [],
            receivedPayloadKinds: [],
          },
          {
            localPeerId: fullSurface.id,
            remotePeerId: degradedSurface.id,
            decision: negotiateCapabilityExchange(fullSurface, degradedSurface),
            sentPayloadKinds: ["view"],
            receivedPayloadKinds: [],
          },
          {
            localPeerId: relaySurface.id,
            remotePeerId: degradedSurface.id,
            decision: negotiateCapabilityExchange(relaySurface, degradedSurface),
            sentPayloadKinds: ["receipt"],
            receivedPayloadKinds: [],
          },
        ],
      },
    };
  } finally {
    for (const channel of channels) {
      try {
        channel.destroy?.();
      } catch {}
    }
    await Promise.allSettled([degradedSwarm.close(), fullSwarm.close(), relaySwarm.close()]);
  }
}

function joinDiscoverySet(input: {
  id: string;
  swarm: ReplicationSwarmLike;
  joinSet: DiscoveryJoinSet;
}): DiscoveryJoinPeer {
  return {
    id: input.id,
    swarm: input.swarm,
    joinSet: input.joinSet,
    discoveries: input.joinSet.topicKeys.map((topicKey) =>
      input.swarm.join(Buffer.from(topicKey, "hex"), {
        client: true,
        server: true,
      }),
    ),
  };
}

async function waitForPeerDiscovery(input: {
  peers: DiscoveryJoinPeer[];
  timeoutMs: number;
  pulseIntervalMs?: number | undefined;
  maxPulses?: number | undefined;
  minConnectionsPerPeer?: number | undefined;
}) {
  const startedAt = Date.now();
  const pulseIntervalMs = input.pulseIntervalMs ?? DEFAULT_DISCOVERY_PULSE_INTERVAL_MS;
  const maxPulses = input.maxPulses ?? DEFAULT_DISCOVERY_PULSE_LIMIT;
  const minConnectionsPerPeer = input.minConnectionsPerPeer ?? 1;
  let pulseCount = 0;

  while (Date.now() - startedAt < input.timeoutMs) {
    if (input.peers.every((peer) => (peer.swarm.connectionCount?.() ?? 0) >= minConnectionsPerPeer)) {
      return pulseCount;
    }

    if (pulseCount >= maxPulses) {
      break;
    }

    pulseCount += 1;
    await Promise.allSettled(
      input.peers.flatMap((peer) =>
        peer.discoveries.map((discovery) => pulseDiscovery(discovery, peer.swarm)),
      ),
    );
    await sleep(pulseIntervalMs);
  }

  if (!input.peers.every((peer) => (peer.swarm.connectionCount?.() ?? 0) >= minConnectionsPerPeer)) {
    throw new Error(`timed out waiting for discovery join-set rendezvous after ${input.timeoutMs}ms`);
  }

  return pulseCount;
}

function getSharedTopicKeys(left: DiscoveryJoinSet, right: DiscoveryJoinSet) {
  const rightKeys = new Set(right.topicKeys);
  return left.topicKeys.filter((topicKey) => rightKeys.has(topicKey));
}

function getSharedTopicKinds(left: DiscoveryJoinSet, right: DiscoveryJoinSet) {
  const rightByKey = new Map(right.projections.map((projection) => [projection.topicKey, projection.topicKind]));
  return left.projections
    .filter((projection) => rightByKey.has(projection.topicKey))
    .map((projection) => projection.topicKind);
}

function intersectTopicKinds(joinSets: DiscoveryJoinSet[]) {
  if (joinSets.length === 0) {
    return [];
  }

  let sharedKeys = new Set(joinSets[0]!.topicKeys);
  for (const joinSet of joinSets.slice(1)) {
    sharedKeys = new Set(joinSet.topicKeys.filter((topicKey) => sharedKeys.has(topicKey)));
  }

  return joinSets[0]!.projections
    .filter((projection) => sharedKeys.has(projection.topicKey))
    .map((projection) => projection.topicKind);
}

async function openCapabilityMeshPeer(input: {
  swarm: ReplicationSwarmLike;
  localSurface: CapabilitySurface;
  expectedConnections: number;
  channels: Array<{ destroy?: () => void }>;
  timeoutMs: number;
}) {
  return new Promise<{
    localSurface: CapabilitySurface;
    connections: Map<
      string,
      {
        channel: CapabilityChannelHandle;
        remoteSurface: CapabilitySurface;
      }
    >;
  }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`timed out waiting for discovery capability mesh for ${input.localSurface.id}`));
    }, input.timeoutMs);

    const connections = new Map<
      string,
      {
        channel: CapabilityChannelHandle;
        remoteSurface: CapabilitySurface;
      }
    >();

    const maybeResolve = () => {
      if (connections.size < input.expectedConnections) {
        return;
      }

      clearTimeout(timeout);
      resolve({
        localSurface: input.localSurface,
        connections,
      });
    };

    input.swarm.on("connection", (socket: unknown, peerInfo: unknown) => {
      const channel = openPlexCapabilityChannel(socket, peerInfo, input.localSurface);
      input.channels.push(channel);

      waitForEvent<CapabilitySurface>(channel, "connection", input.timeoutMs)
        .then((remoteSurface) => {
          connections.set(remoteSurface.id, {
            channel,
            remoteSurface,
          });
          maybeResolve();
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });

      channel.resume();
    });
  });
}

function openPlexCapabilityChannel(
  socket: unknown,
  peerInfo: unknown,
  localSurface: CapabilitySurface,
) {
  return ((peerInfo as { client?: boolean }).client
    ? connect({
        stream: socket,
        id: channelId,
        encoding: jsonCodec,
        handshakeEncoding: jsonCodec,
        handshakeMessage: localSurface,
      })
    : listen({
        stream: socket,
        id: channelId,
        encoding: jsonCodec,
        handshakeEncoding: jsonCodec,
        handshakeMessage: localSurface,
      })) as CapabilityChannelHandle;
}

function waitForEvent<T>(
  target: {
    once(event: string, listener: (value: any) => void): void;
  },
  event: string,
  timeoutMs = DEFAULT_SWARM_FLUSH_TIMEOUT_MS,
) {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`timed out waiting for ${event}`));
    }, timeoutMs);

    target.once(event, (value: T) => {
      clearTimeout(timeout);
      resolve(value);
    });
  });
}

function sleep(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}
