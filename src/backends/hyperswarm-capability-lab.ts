import { createHash } from "node:crypto";

import { connect, listen } from "@neonloom/plex";
import { makeCodec } from "@neonloom/plex/codec";

import { Substrate } from "../kernel/substrate.js";
import {
  ArtifactEnvelope,
  CapabilityExchangeDecision,
  CapabilitySurface,
  View,
} from "../kernel/types.js";
import { negotiateCapabilityExchange } from "../kernel/capability-surface.js";
import { ReplicationSwarmLike } from "./corestore-replication-lab.js";

const DEFAULT_SWARM_FLUSH_TIMEOUT_MS = 30_000;
const jsonCodec = makeCodec("json");
const channelId = new TextEncoder().encode("causal-substrate-capability-handshake-v1");

export interface HyperswarmCapabilityHandshakeLabOptions {
  createSwarm: (
    seedOrOpts?: Buffer,
    topics?: Map<string, unknown>,
  ) => ReplicationSwarmLike | Promise<ReplicationSwarmLike>;
  topics?: Map<string, unknown> | undefined;
  namespaceParts?: string[] | undefined;
  now?: (() => string) | undefined;
  flushTimeoutMs?: number | undefined;
}

export interface HyperswarmCapabilityHandshakeLabReport {
  namespaceParts: string[];
  initiatorPeerId: string;
  receiverPeerId: string;
  initiatorRemoteRole: CapabilitySurface["peerRole"];
  receiverRemoteRole: CapabilitySurface["peerRole"];
  receiverDecision: CapabilityExchangeDecision;
  initiatorDecision: CapabilityExchangeDecision;
  exchangedArtifactKind: ArtifactEnvelope["kind"];
  exchangedViewKind: View["kind"];
  exchangedArtifactId: string;
  exchangedViewId: string;
  transportPicture: CapabilityTransportPicture;
}

export interface HyperswarmMultiPeerCapabilityLabReport {
  namespaceParts: string[];
  peerIds: string[];
  degradedPeerId: string;
  fullPeerId: string;
  relayPeerId: string;
  degradedFromFullDecision: CapabilityExchangeDecision;
  degradedFromRelayDecision: CapabilityExchangeDecision;
  fullFromRelayDecision: CapabilityExchangeDecision;
  receivedArtifactKinds: ArtifactEnvelope["kind"][];
  receivedPayloadKinds: Array<"view" | "receipt">;
  transportPicture: CapabilityTransportPicture;
}

interface CapabilityChannelHandle {
  once(event: string, listener: (value: unknown) => void): void;
  destroy?: () => void;
  write: (data: unknown) => boolean;
  resume(): void;
}

export interface CapabilityTransportExchangeTrace {
  localPeerId: string;
  remotePeerId: string;
  remotePeerRole: CapabilitySurface["peerRole"];
  decision: CapabilityExchangeDecision;
  sentPayloadKinds: Array<"view" | "receipt">;
  receivedPayloadKinds: Array<"view" | "receipt">;
}

export interface CapabilityTransportPicture {
  peerIds: string[];
  traces: CapabilityTransportExchangeTrace[];
}

export async function runHyperswarmCapabilityHandshakeLab(
  options: HyperswarmCapabilityHandshakeLabOptions,
): Promise<HyperswarmCapabilityHandshakeLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const swarmA = await options.createSwarm(Buffer.alloc(32, 21), topics);
  const swarmB = await options.createSwarm(Buffer.alloc(32, 22), topics);
  const channels: Array<{ destroy?: () => void }> = [];

  const degradedSurface: CapabilitySurface = {
    id: "observer-a-capability-surface",
    peerRole: "observer-witness",
    basisId: "visual-rgb",
    sourceBranchId: "observer-a-branch",
    primaryContextId: "room-context",
    visibleContextIds: ["hallway-context"],
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
    basisId: "visual-rgb-full",
    sourceBranchId: "observer-b-branch",
    primaryContextId: "room-context",
    visibleContextIds: [],
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

  const substrate = new Substrate(options.now ? { now: options.now } : {});
  const basis = substrate.createBasis({
    label: "capability-hyperswarm-basis",
    dimensions: ["shape", "red", "green", "blue"],
  });
  const observer = substrate.createObserver({
    label: "mediating-observer",
    basisId: basis.id,
  });
  const observerBranch = substrate.createBranch({
    role: "observer",
    label: "mediating-observer-branch",
    basisId: basis.id,
    observerId: observer.id,
  });
  const referentBranch = substrate.createBranch({
    role: "referent",
    label: "shared-ball-branch",
    basisId: basis.id,
  });
  const view = substrate.createView({
    kind: "context-surface",
    label: "room-ball-mediated-view",
    sourceIds: [observerBranch.id, referentBranch.id],
    projection: "bounded mediated ball view for a degraded peer",
  });
  const artifact = substrate.createArtifactEnvelope({
    kind: "view",
    label: "room-ball-mediated-artifact",
    sourceIds: [observerBranch.id, referentBranch.id],
    payloadIds: [view.id],
    locality: "shared-candidate",
    provenance: {
      basisId: basis.id,
      emitterId: observer.id,
      source: "hyperswarm-capability-handshake-lab",
    },
  });

  try {
    const degradedReady = openCapabilityChannel({
      swarm: swarmA,
      localSurface: degradedSurface,
      channels,
    });
    const fullReady = openCapabilityChannel({
      swarm: swarmB,
      localSurface: fullSurface,
      channels,
    });

    const topic = createCapabilityTopic(options.namespaceParts ?? []);
    const degradedDiscovery = swarmA.join(topic, {
      client: true,
      server: true,
    });
    const fullDiscovery = swarmB.join(topic, {
      client: true,
      server: true,
    });

    await Promise.all([
      degradedDiscovery?.flushed?.(),
      fullDiscovery?.flushed?.(),
      swarmA.flush(options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS),
      swarmB.flush(options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS),
    ]);

    const [degradedPeer, fullPeer] = await Promise.all([degradedReady, fullReady]);

    const receiverDecision = negotiateCapabilityExchange(
      degradedSurface,
      degradedPeer.remoteSurface,
    );
    const initiatorDecision = negotiateCapabilityExchange(
      fullSurface,
      fullPeer.remoteSurface,
    );

    if (!receiverDecision.accepted || !receiverDecision.requiresMediation) {
      throw new Error("degraded receiver did not require mediated bounded exchange");
    }
    if (!initiatorDecision.accepted || !initiatorDecision.requiresMediation) {
      throw new Error("full peer did not accept mediated bounded exchange");
    }

    const receivedArtifactPromise = waitForEvent<{
      artifact: ArtifactEnvelope;
      view: View;
    }>(degradedPeer.channel, "data");

    fullPeer.channel.write({
      artifact,
      view,
    });

    const received = await receivedArtifactPromise;

    return {
      namespaceParts: options.namespaceParts ?? [],
      initiatorPeerId: fullPeer.localSurface.id,
      receiverPeerId: degradedPeer.localSurface.id,
      initiatorRemoteRole: fullPeer.remoteSurface.peerRole,
      receiverRemoteRole: degradedPeer.remoteSurface.peerRole,
      receiverDecision,
      initiatorDecision,
      exchangedArtifactKind: received.artifact.kind,
      exchangedViewKind: received.view.kind,
      exchangedArtifactId: received.artifact.id,
      exchangedViewId: received.view.id,
      transportPicture: {
        peerIds: [degradedSurface.id, fullSurface.id],
        traces: [
          createTransportTrace({
            localPeerId: degradedSurface.id,
            remotePeerId: fullSurface.id,
            remotePeerRole: fullSurface.peerRole,
            decision: receiverDecision,
            receivedPayloadKinds: ["view"],
          }),
          createTransportTrace({
            localPeerId: fullSurface.id,
            remotePeerId: degradedSurface.id,
            remotePeerRole: degradedSurface.peerRole,
            decision: initiatorDecision,
            sentPayloadKinds: ["view"],
          }),
        ],
      },
    };
  } finally {
    for (const channel of channels) {
      try {
        channel.destroy?.();
      } catch {}
    }

    await Promise.all([
      closeSwarmQuietly(swarmA),
      closeSwarmQuietly(swarmB),
    ]);
  }
}

export async function runHyperswarmMultiPeerCapabilityLab(
  options: HyperswarmCapabilityHandshakeLabOptions,
): Promise<HyperswarmMultiPeerCapabilityLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const degradedSwarm = await options.createSwarm(Buffer.alloc(32, 31), topics);
  const fullSwarm = await options.createSwarm(Buffer.alloc(32, 32), topics);
  const relaySwarm = await options.createSwarm(Buffer.alloc(32, 33), topics);
  const channels: Array<{ destroy?: () => void }> = [];

  const degradedSurface: CapabilitySurface = {
    id: "observer-a-capability-surface",
    peerRole: "observer-witness",
    basisId: "visual-rgb",
    sourceBranchId: "observer-a-branch",
    primaryContextId: "room-context",
    visibleContextIds: ["hallway-context"],
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
    basisId: "visual-rgb-full",
    sourceBranchId: "observer-b-branch",
    primaryContextId: "room-context",
    visibleContextIds: [],
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
    primaryContextId: "room-context",
    visibleContextIds: [],
    supportedDimensions: ["shape"],
    offer: {
      artifactKinds: ["receipt"],
      exchangeModes: ["receipt-only"],
      branchRoles: ["derived", "referent"],
      concernTags: ["relay", "translation"],
    },
    request: {
      artifactKinds: ["receipt"],
      preferredExchangeModes: ["receipt-only"],
      branchRoles: ["derived", "referent"],
      concernTags: ["relay", "translation"],
    },
  };

  const substrate = new Substrate(options.now ? { now: options.now } : {});
  const basis = substrate.createBasis({
    label: "capability-mesh-basis",
    dimensions: ["shape", "red", "green", "blue"],
  });
  const relayBasis = substrate.createBasis({
    label: "receipt-basis",
    dimensions: ["shape"],
    partial: true,
  });
  const fullObserver = substrate.createObserver({
    label: "full-observer",
    basisId: basis.id,
  });
  const relayObserver = substrate.createObserver({
    label: "relay-observer",
    basisId: relayBasis.id,
  });
  const fullBranch = substrate.createBranch({
    role: "observer",
    label: "full-observer-branch",
    basisId: basis.id,
    observerId: fullObserver.id,
  });
  const relayBranch = substrate.createBranch({
    role: "derived",
    label: "relay-branch",
    basisId: relayBasis.id,
    observerId: relayObserver.id,
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
      source: "hyperswarm-multi-peer-capability-lab",
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
      basisId: relayBasis.id,
      emitterId: relayObserver.id,
      source: "hyperswarm-multi-peer-capability-lab",
    },
  });

  try {
    const degradedReady = openCapabilityMeshPeer({
      swarm: degradedSwarm,
      localSurface: degradedSurface,
      expectedConnections: 2,
      channels,
    });
    const fullReady = openCapabilityMeshPeer({
      swarm: fullSwarm,
      localSurface: fullSurface,
      expectedConnections: 2,
      channels,
    });
    const relayReady = openCapabilityMeshPeer({
      swarm: relaySwarm,
      localSurface: relaySurface,
      expectedConnections: 2,
      channels,
    });

    const topic = createCapabilityTopic([...(options.namespaceParts ?? []), "mesh"]);
    const degradedDiscovery = degradedSwarm.join(topic, {
      client: true,
      server: true,
    });
    const fullDiscovery = fullSwarm.join(topic, {
      client: true,
      server: true,
    });
    const relayDiscovery = relaySwarm.join(topic, {
      client: true,
      server: true,
    });

    await Promise.all([
      degradedDiscovery?.flushed?.(),
      fullDiscovery?.flushed?.(),
      relayDiscovery?.flushed?.(),
      degradedSwarm.flush(options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS),
      fullSwarm.flush(options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS),
      relaySwarm.flush(options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS),
    ]);

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
      throw new Error("missing expected capability mesh connections");
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
    }>(degradedFromFull.channel, "data");
    const receivedReceiptPromise = waitForEvent<{
      artifact: ArtifactEnvelope;
      receipt: typeof receipt;
      payloadKind: "receipt";
    }>(degradedFromRelay.channel, "data");

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
      peerIds: [degradedSurface.id, fullSurface.id, relaySurface.id],
      degradedPeerId: degradedSurface.id,
      fullPeerId: fullSurface.id,
      relayPeerId: relaySurface.id,
      degradedFromFullDecision,
      degradedFromRelayDecision,
      fullFromRelayDecision,
      receivedArtifactKinds: [receivedView.artifact.kind, receivedReceipt.artifact.kind],
      receivedPayloadKinds: [receivedView.payloadKind, receivedReceipt.payloadKind],
      transportPicture: {
        peerIds: [degradedSurface.id, fullSurface.id, relaySurface.id],
        traces: [
          createTransportTrace({
            localPeerId: degradedSurface.id,
            remotePeerId: fullSurface.id,
            remotePeerRole: fullSurface.peerRole,
            decision: degradedFromFullDecision,
            receivedPayloadKinds: ["view"],
          }),
          createTransportTrace({
            localPeerId: degradedSurface.id,
            remotePeerId: relaySurface.id,
            remotePeerRole: relaySurface.peerRole,
            decision: degradedFromRelayDecision,
            receivedPayloadKinds: ["receipt"],
          }),
          createTransportTrace({
            localPeerId: fullSurface.id,
            remotePeerId: relaySurface.id,
            remotePeerRole: relaySurface.peerRole,
            decision: fullFromRelayDecision,
          }),
          createTransportTrace({
            localPeerId: fullSurface.id,
            remotePeerId: degradedSurface.id,
            remotePeerRole: degradedSurface.peerRole,
            decision: negotiateCapabilityExchange(fullSurface, degradedSurface),
            sentPayloadKinds: ["view"],
          }),
          createTransportTrace({
            localPeerId: relaySurface.id,
            remotePeerId: degradedSurface.id,
            remotePeerRole: degradedSurface.peerRole,
            decision: negotiateCapabilityExchange(relaySurface, degradedSurface),
            sentPayloadKinds: ["receipt"],
          }),
        ],
      },
    };
  } finally {
    for (const channel of channels) {
      try {
        channel.destroy?.();
      } catch {}
    }

    await Promise.all([
      closeSwarmQuietly(degradedSwarm),
      closeSwarmQuietly(fullSwarm),
      closeSwarmQuietly(relaySwarm),
    ]);
  }
}

async function openCapabilityChannel(input: {
  swarm: ReplicationSwarmLike;
  localSurface: CapabilitySurface;
  channels: Array<{ destroy?: () => void }>;
}) {
  return new Promise<{
    channel: CapabilityChannelHandle;
    localSurface: CapabilitySurface;
    remoteSurface: CapabilitySurface;
  }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`timed out waiting for swarm connection for ${input.localSurface.id}`));
    }, DEFAULT_SWARM_FLUSH_TIMEOUT_MS);

    input.swarm.on("connection", (socket, peerInfo) => {
      const channel = openPlexCapabilityChannel(socket, peerInfo, input.localSurface);

      input.channels.push(channel);

      waitForEvent<CapabilitySurface>(channel, "connection")
        .then((remoteSurface) => {
          clearTimeout(timeout);
          resolve({
            channel,
            localSurface: input.localSurface,
            remoteSurface,
          });
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });

      channel.resume();
    });
  });
}

async function openCapabilityMeshPeer(input: {
  swarm: ReplicationSwarmLike;
  localSurface: CapabilitySurface;
  expectedConnections: number;
  channels: Array<{ destroy?: () => void }>;
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
      reject(
        new Error(`timed out waiting for capability mesh for ${input.localSurface.id}`),
      );
    }, DEFAULT_SWARM_FLUSH_TIMEOUT_MS);

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

    input.swarm.on("connection", (socket, peerInfo) => {
      const channel = openPlexCapabilityChannel(socket, peerInfo, input.localSurface);
      input.channels.push(channel);

      waitForEvent<CapabilitySurface>(channel, "connection")
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

function createTransportTrace(input: {
  localPeerId: string;
  remotePeerId: string;
  remotePeerRole: CapabilitySurface["peerRole"];
  decision: CapabilityExchangeDecision;
  sentPayloadKinds?: Array<"view" | "receipt">;
  receivedPayloadKinds?: Array<"view" | "receipt">;
}): CapabilityTransportExchangeTrace {
  return {
    localPeerId: input.localPeerId,
    remotePeerId: input.remotePeerId,
    remotePeerRole: input.remotePeerRole,
    decision: input.decision,
    sentPayloadKinds: input.sentPayloadKinds ?? [],
    receivedPayloadKinds: input.receivedPayloadKinds ?? [],
  };
}

async function closeSwarmQuietly(swarm: ReplicationSwarmLike | undefined) {
  await swarm?.close().catch(() => {});
}

function createCapabilityTopic(namespaceParts: string[]) {
  return createHash("sha256")
    .update(["causal-substrate", "capability-handshake", ...namespaceParts].join(":"))
    .digest();
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
