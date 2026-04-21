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

async function openCapabilityChannel(input: {
  swarm: ReplicationSwarmLike;
  localSurface: CapabilitySurface;
  channels: Array<{ destroy?: () => void }>;
}) {
  return new Promise<{
    channel: {
      once(event: string, listener: (value: unknown) => void): void;
      destroy?: () => void;
      write: (data: unknown) => boolean;
    };
    localSurface: CapabilitySurface;
    remoteSurface: CapabilitySurface;
  }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`timed out waiting for swarm connection for ${input.localSurface.id}`));
    }, DEFAULT_SWARM_FLUSH_TIMEOUT_MS);

    input.swarm.on("connection", (socket, peerInfo) => {
      const channel = (peerInfo as { client?: boolean }).client
        ? connect({
            stream: socket,
            id: channelId,
            encoding: jsonCodec,
            handshakeEncoding: jsonCodec,
            handshakeMessage: input.localSurface,
          })
        : listen({
            stream: socket,
            id: channelId,
            encoding: jsonCodec,
            handshakeEncoding: jsonCodec,
            handshakeMessage: input.localSurface,
          });

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
