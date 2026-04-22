import { createHash } from "node:crypto";

import { connect, listen } from "@neonloom/plex";
import { makeCodec } from "@neonloom/plex/codec";

import { Substrate } from "../kernel/substrate.js";
import type {
  ArtifactEnvelope,
  Binding,
  Branch,
  ComparisonSurface,
  LineageEdge,
  Nucleus,
  Segment,
  StateEstimate,
  View,
} from "../kernel/types.js";
import type { ReplicationSwarmLike } from "./hyperswarm-rendezvous.js";
import { waitForDiscoveryRendezvous } from "./hyperswarm-rendezvous.js";

const DEFAULT_SWARM_FLUSH_TIMEOUT_MS = 30_000;
const jsonCodec = makeCodec("json");
const channelId = new TextEncoder().encode("causal-substrate-emergence-lab-v1");

export interface HyperswarmEmergenceTransportLabOptions {
  createSwarm: (
    seedOrOpts?: Buffer,
    topics?: Map<string, unknown>,
  ) => ReplicationSwarmLike | Promise<ReplicationSwarmLike>;
  topics?: Map<string, unknown> | undefined;
  namespaceParts?: string[] | undefined;
  now?: (() => string) | undefined;
  flushTimeoutMs?: number | undefined;
}

export interface EmergencePeerSurface {
  id: string;
  role: "observer";
  branchId: string;
  observerId: string;
  basisId: string;
  referentIds?: string[];
}

interface EmergenceChannelHandle {
  once(event: string, listener: (value: unknown) => void): void;
  destroy?: () => void;
  write: (data: unknown) => boolean;
  resume(): void;
}

export interface EmergenceTransportTrace {
  localPeerId: string;
  remotePeerId: string;
  sentMessageKinds: string[];
  receivedMessageKinds: string[];
}

export interface EmergenceTransportPicture {
  peerIds: string[];
  traces: EmergenceTransportTrace[];
}

export interface HyperswarmMutualObserverTransportLabReport {
  namespaceParts: string[];
  observerPeerIds: string[];
  bindingReferentIds: string[];
  exchangedArtifactKinds: ArtifactEnvelope["kind"][];
  exchangedViewKinds: View["kind"][];
  adoptedViewSourceIds: string[][];
  transportPicture: EmergenceTransportPicture;
}

export interface HyperswarmCoObservedBallTransportLabReport {
  namespaceParts: string[];
  observerPeerIds: string[];
  lineageRelation: LineageEdge["relation"];
  ballBranchParentIds: string[];
  bindingReferentIds: string[];
  exchangedArtifactKinds: ArtifactEnvelope["kind"][];
  happeningBranchIds: string[];
  referentCount: number;
  transportPicture: EmergenceTransportPicture;
}

export interface HyperswarmOrthogonalBallTransportLabReport {
  namespaceParts: string[];
  observerPeerIds: string[];
  sideContinuity: StateEstimate["continuity"];
  topContinuity: StateEstimate["continuity"];
  comparisonComparability: ComparisonSurface["comparability"];
  comparisonCompatibility: ComparisonSurface["compatibility"];
  comparisonConvergence: ComparisonSurface["convergence"];
  exchangedArtifactKinds: ArtifactEnvelope["kind"][];
  transportPicture: EmergenceTransportPicture;
}

export interface HyperswarmBranchCapabilityEvolutionTransportLabReport {
  namespaceParts: string[];
  observerPeerIds: string[];
  branchId: string;
  parentBranchIds: string[];
  revisedBasisId: string;
  initialContinuity: StateEstimate["continuity"];
  degradedContinuity: StateEstimate["continuity"];
  revisedFromBasisIds: string[];
  degradationSourceIds: string[];
  basisRevision: Branch["metadata"];
  exchangedArtifactKinds: ArtifactEnvelope["kind"][];
  exchangedViewKind: View["kind"];
  transportPicture: EmergenceTransportPicture;
}

export interface HyperswarmBranchForkTransportLabReport {
  namespaceParts: string[];
  observerPeerIds: string[];
  sourceBranchId: string;
  childBranchId: string;
  lineageRelation: LineageEdge["relation"];
  childParentBranchIds: string[];
  inheritedNucleusIds: string[];
  childNucleusAnchor: string;
  exchangedArtifactKinds: ArtifactEnvelope["kind"][];
  transportPicture: EmergenceTransportPicture;
}

export async function runHyperswarmMutualObserverTransportLab(
  options: HyperswarmEmergenceTransportLabOptions,
): Promise<HyperswarmMutualObserverTransportLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const swarmA = await options.createSwarm(Buffer.alloc(32, 41), topics);
  const swarmB = await options.createSwarm(Buffer.alloc(32, 42), topics);
  const channels: Array<{ destroy?: () => void }> = [];
  const timeoutMs = options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS;
  const substrate = new Substrate(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "mutual-camera-basis",
      dimensions: ["shape", "pose", "aperture-facing"],
    });
    const observerOne = substrate.createObserver({
      label: "camera-1",
      basisId: basis.id,
    });
    const observerTwo = substrate.createObserver({
      label: "camera-2",
      basisId: basis.id,
    });
    const branchOne = substrate.createBranch({
      role: "observer",
      label: "camera-1-branch",
      basisId: basis.id,
      observerId: observerOne.id,
    });
    const branchTwo = substrate.createBranch({
      role: "observer",
      label: "camera-2-branch",
      basisId: basis.id,
      observerId: observerTwo.id,
    });
    const referentOneBranch = substrate.createBranch({
      role: "referent",
      label: "camera-1-as-seen-by-2",
      basisId: basis.id,
    });
    const referentTwoBranch = substrate.createBranch({
      role: "referent",
      label: "camera-2-as-seen-by-1",
      basisId: basis.id,
    });
    const referentOne = substrate.createReferent({
      label: "camera-1-visible-surface",
      anchor: "camera-1-external-anchor",
      branchId: referentOneBranch.id,
    });
    const referentTwo = substrate.createReferent({
      label: "camera-2-visible-surface",
      anchor: "camera-2-external-anchor",
      branchId: referentTwoBranch.id,
    });

    const bindingOneToTwo = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branchOne.id,
      referentBranchId: referentTwoBranch.id,
      referentId: referentTwo.id,
      strength: 0.84,
    });
    const bindingTwoToOne = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branchTwo.id,
      referentBranchId: referentOneBranch.id,
      referentId: referentOne.id,
      strength: 0.86,
    });
    const externalSelfViewForOne = substrate.createView({
      kind: "binding-map",
      label: "camera-1-from-camera-2",
      sourceIds: [branchTwo.id, referentOne.id, bindingTwoToOne.id],
      projection: "camera-2 exposes a replaceable view about camera-1",
    });
    const externalSelfViewForTwo = substrate.createView({
      kind: "binding-map",
      label: "camera-2-from-camera-1",
      sourceIds: [branchOne.id, referentTwo.id, bindingOneToTwo.id],
      projection: "camera-1 exposes a replaceable view about camera-2",
    });
    const artifactForOne = substrate.createArtifactEnvelope({
      kind: "view",
      label: "camera-1-mediated-self-artifact",
      sourceIds: [branchTwo.id, referentOne.id],
      payloadIds: [externalSelfViewForOne.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: observerTwo.id,
        basisId: basis.id,
        source: "hyperswarm-mutual-observer-transport-lab",
      },
    });
    const artifactForTwo = substrate.createArtifactEnvelope({
      kind: "view",
      label: "camera-2-mediated-self-artifact",
      sourceIds: [branchOne.id, referentTwo.id],
      payloadIds: [externalSelfViewForTwo.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: observerOne.id,
        basisId: basis.id,
        source: "hyperswarm-mutual-observer-transport-lab",
      },
    });
    const adoptedViewForOne = substrate.createView({
      kind: "branch-timeline",
      label: "camera-1-mediated-self-surface",
      sourceIds: [branchOne.id, artifactForOne.id],
      projection: "camera-1 integrates a view about itself without overwriting direct continuity",
    });
    const adoptedViewForTwo = substrate.createView({
      kind: "branch-timeline",
      label: "camera-2-mediated-self-surface",
      sourceIds: [branchTwo.id, artifactForTwo.id],
      projection: "camera-2 integrates a view about itself without overwriting direct continuity",
    });

    const peerOneSurface: EmergencePeerSurface = {
      id: "camera-1-peer",
      role: "observer",
      branchId: branchOne.id,
      observerId: observerOne.id,
      basisId: basis.id,
      referentIds: [referentTwo.id],
    };
    const peerTwoSurface: EmergencePeerSurface = {
      id: "camera-2-peer",
      role: "observer",
      branchId: branchTwo.id,
      observerId: observerTwo.id,
      basisId: basis.id,
      referentIds: [referentOne.id],
    };

    const peerOneReady = openEmergencePeer({
      swarm: swarmA,
      localSurface: peerOneSurface,
      channels,
      timeoutMs,
    });
    const peerTwoReady = openEmergencePeer({
      swarm: swarmB,
      localSurface: peerTwoSurface,
      channels,
      timeoutMs,
    });

    await connectPair({
      swarmA,
      swarmB,
      namespaceParts: [...(options.namespaceParts ?? []), "mutual-observer"],
      timeoutMs,
    });

    const [peerOne, peerTwo] = await Promise.all([peerOneReady, peerTwoReady]);
    const peerOneData = waitForEvent<{
      artifact: ArtifactEnvelope;
      view: View;
      binding: Binding;
      messageKind: "mediated-self-view";
    }>(peerOne.channel, "data", timeoutMs);
    const peerTwoData = waitForEvent<{
      artifact: ArtifactEnvelope;
      view: View;
      binding: Binding;
      messageKind: "mediated-self-view";
    }>(peerTwo.channel, "data", timeoutMs);

    peerOne.channel.write({
      artifact: artifactForTwo,
      view: externalSelfViewForTwo,
      binding: bindingOneToTwo,
      messageKind: "mediated-self-view",
    });
    peerTwo.channel.write({
      artifact: artifactForOne,
      view: externalSelfViewForOne,
      binding: bindingTwoToOne,
      messageKind: "mediated-self-view",
    });

    const [receivedByOne, receivedByTwo] = await Promise.all([peerOneData, peerTwoData]);

    return {
      namespaceParts: options.namespaceParts ?? [],
      observerPeerIds: [peerOneSurface.id, peerTwoSurface.id],
      bindingReferentIds: [bindingOneToTwo.referentId, bindingTwoToOne.referentId],
      exchangedArtifactKinds: [receivedByOne.artifact.kind, receivedByTwo.artifact.kind],
      exchangedViewKinds: [receivedByOne.view.kind, receivedByTwo.view.kind],
      adoptedViewSourceIds: [adoptedViewForOne.sourceIds, adoptedViewForTwo.sourceIds],
      transportPicture: {
        peerIds: [peerOneSurface.id, peerTwoSurface.id],
        traces: [
          createEmergenceTrace({
            localPeerId: peerOneSurface.id,
            remotePeerId: peerTwoSurface.id,
            sentMessageKinds: ["mediated-self-view"],
            receivedMessageKinds: [receivedByOne.messageKind],
          }),
          createEmergenceTrace({
            localPeerId: peerTwoSurface.id,
            remotePeerId: peerOneSurface.id,
            sentMessageKinds: ["mediated-self-view"],
            receivedMessageKinds: [receivedByTwo.messageKind],
          }),
        ],
      },
    };
  } finally {
    await cleanupChannelsAndSwarms(channels, [swarmA, swarmB]);
  }
}

export async function runHyperswarmCoObservedBallTransportLab(
  options: HyperswarmEmergenceTransportLabOptions,
): Promise<HyperswarmCoObservedBallTransportLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const swarmA = await options.createSwarm(Buffer.alloc(32, 51), topics);
  const swarmB = await options.createSwarm(Buffer.alloc(32, 52), topics);
  const channels: Array<{ destroy?: () => void }> = [];
  const timeoutMs = options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS;
  const substrate = new Substrate(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "ball-basis",
      dimensions: ["shape", "motion", "position"],
    });
    const observerOne = substrate.createObserver({
      label: "camera-1",
      basisId: basis.id,
    });
    const observerTwo = substrate.createObserver({
      label: "camera-2",
      basisId: basis.id,
    });
    const branchOne = substrate.createBranch({
      role: "observer",
      label: "camera-1-branch",
      basisId: basis.id,
      observerId: observerOne.id,
    });
    const branchTwo = substrate.createBranch({
      role: "observer",
      label: "camera-2-branch",
      basisId: basis.id,
      observerId: observerTwo.id,
    });
    const seedBranch = substrate.createBranch({
      role: "referent",
      label: "ball-seed-branch",
      basisId: basis.id,
    });
    const ballBranch = substrate.createBranch({
      role: "referent",
      label: "ball-materialized-branch",
      basisId: basis.id,
      parentBranchIds: [seedBranch.id],
    });
    const seedLineage = substrate.createLineageEdge({
      relation: "seed-origin",
      fromId: seedBranch.id,
      toId: ballBranch.id,
      basisId: basis.id,
      evidence: "ball realization emerged from precursor seed pressure",
    });
    const ball = substrate.createReferent({
      label: "ball",
      anchor: "ball-anchor",
      branchId: ballBranch.id,
    });
    const segmentOne = substrate.openSegment({
      branchId: branchOne.id,
      summary: "camera-1 sees candidate ball",
    });
    const segmentTwo = substrate.openSegment({
      branchId: branchTwo.id,
      summary: "camera-2 sees candidate ball",
    });
    const happeningOne = substrate.createHappening({
      branchId: branchOne.id,
      segmentId: segmentOne.id,
      label: "camera-1 registered ball motion",
    });
    const happeningTwo = substrate.createHappening({
      branchId: branchTwo.id,
      segmentId: segmentTwo.id,
      label: "camera-2 registered ball motion",
    });
    const bindingOne = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branchOne.id,
      referentBranchId: ballBranch.id,
      referentId: ball.id,
      strength: 0.82,
    });
    const bindingTwo = substrate.createBinding({
      kind: "tracking",
      observerBranchId: branchTwo.id,
      referentBranchId: ballBranch.id,
      referentId: ball.id,
      strength: 0.8,
    });
    const bindingArtifactOne = substrate.createArtifactEnvelope({
      kind: "binding",
      label: "camera-1-ball-binding-artifact",
      sourceIds: [branchOne.id, ballBranch.id],
      payloadIds: [bindingOne.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: observerOne.id,
        basisId: basis.id,
        source: "hyperswarm-co-observed-ball-transport-lab",
      },
    });
    const bindingArtifactTwo = substrate.createArtifactEnvelope({
      kind: "binding",
      label: "camera-2-ball-binding-artifact",
      sourceIds: [branchTwo.id, ballBranch.id],
      payloadIds: [bindingTwo.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: observerTwo.id,
        basisId: basis.id,
        source: "hyperswarm-co-observed-ball-transport-lab",
      },
    });
    const lineageArtifact = substrate.createArtifactEnvelope({
      kind: "lineage-claim",
      label: "ball-seed-origin-claim",
      sourceIds: [seedBranch.id, ballBranch.id],
      payloadIds: [seedLineage.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        source: "hyperswarm-co-observed-ball-transport-lab",
      },
    });

    const peerOneSurface: EmergencePeerSurface = {
      id: "camera-1-ball-peer",
      role: "observer",
      branchId: branchOne.id,
      observerId: observerOne.id,
      basisId: basis.id,
      referentIds: [ball.id],
    };
    const peerTwoSurface: EmergencePeerSurface = {
      id: "camera-2-ball-peer",
      role: "observer",
      branchId: branchTwo.id,
      observerId: observerTwo.id,
      basisId: basis.id,
      referentIds: [ball.id],
    };

    const peerOneReady = openEmergencePeer({
      swarm: swarmA,
      localSurface: peerOneSurface,
      channels,
      timeoutMs,
    });
    const peerTwoReady = openEmergencePeer({
      swarm: swarmB,
      localSurface: peerTwoSurface,
      channels,
      timeoutMs,
    });

    await connectPair({
      swarmA,
      swarmB,
      namespaceParts: [...(options.namespaceParts ?? []), "co-observed-ball"],
      timeoutMs,
    });

    const [peerOne, peerTwo] = await Promise.all([peerOneReady, peerTwoReady]);
    const peerOneData = waitForEvent<{
      artifact: ArtifactEnvelope;
      binding: Binding;
      happeningId: string;
      messageKind: "ball-binding";
    }>(peerOne.channel, "data", timeoutMs);
    const peerTwoData = waitForEvent<{
      artifact: ArtifactEnvelope;
      binding: Binding;
      lineageArtifact?: ArtifactEnvelope;
      lineage?: LineageEdge;
      happeningId: string;
      messageKind: "ball-binding-with-lineage";
    }>(peerTwo.channel, "data", timeoutMs);

    peerOne.channel.write({
      artifact: bindingArtifactOne,
      binding: bindingOne,
      lineageArtifact,
      lineage: seedLineage,
      happeningId: happeningOne.id,
      messageKind: "ball-binding-with-lineage",
    });
    peerTwo.channel.write({
      artifact: bindingArtifactTwo,
      binding: bindingTwo,
      happeningId: happeningTwo.id,
      messageKind: "ball-binding",
    });

    const [receivedByOne, receivedByTwo] = await Promise.all([peerOneData, peerTwoData]);

    return {
      namespaceParts: options.namespaceParts ?? [],
      observerPeerIds: [peerOneSurface.id, peerTwoSurface.id],
      lineageRelation: receivedByTwo.lineage?.relation ?? seedLineage.relation,
      ballBranchParentIds: ballBranch.parentBranchIds,
      bindingReferentIds: [receivedByOne.binding.referentId, receivedByTwo.binding.referentId],
      exchangedArtifactKinds: [
        receivedByOne.artifact.kind,
        receivedByTwo.artifact.kind,
        receivedByTwo.lineageArtifact?.kind ?? lineageArtifact.kind,
      ],
      happeningBranchIds: [happeningOne.branchId, happeningTwo.branchId],
      referentCount: substrate.state.referents.size,
      transportPicture: {
        peerIds: [peerOneSurface.id, peerTwoSurface.id],
        traces: [
          createEmergenceTrace({
            localPeerId: peerOneSurface.id,
            remotePeerId: peerTwoSurface.id,
            sentMessageKinds: ["ball-binding-with-lineage"],
            receivedMessageKinds: [receivedByOne.messageKind],
          }),
          createEmergenceTrace({
            localPeerId: peerTwoSurface.id,
            remotePeerId: peerOneSurface.id,
            sentMessageKinds: ["ball-binding"],
            receivedMessageKinds: [receivedByTwo.messageKind],
          }),
        ],
      },
    };
  } finally {
    await cleanupChannelsAndSwarms(channels, [swarmA, swarmB]);
  }
}

export async function runHyperswarmOrthogonalBallTransportLab(
  options: HyperswarmEmergenceTransportLabOptions,
): Promise<HyperswarmOrthogonalBallTransportLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const swarmA = await options.createSwarm(Buffer.alloc(32, 61), topics);
  const swarmB = await options.createSwarm(Buffer.alloc(32, 62), topics);
  const channels: Array<{ destroy?: () => void }> = [];
  const timeoutMs = options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS;
  const substrate = new Substrate(options.now ? { now: options.now } : {});

  try {
    const sideBasis = substrate.createBasis({
      label: "side-camera-basis",
      dimensions: ["shape", "position", "occlusion"],
    });
    const topBasis = substrate.createBasis({
      label: "top-camera-basis",
      dimensions: ["size", "speed", "position"],
      partial: true,
    });
    const sideObserver = substrate.createObserver({
      label: "side-camera",
      basisId: sideBasis.id,
    });
    const topObserver = substrate.createObserver({
      label: "top-camera",
      basisId: topBasis.id,
    });
    const sideBranch = substrate.createBranch({
      role: "observer",
      label: "side-camera-branch",
      basisId: sideBasis.id,
      observerId: sideObserver.id,
    });
    const topBranch = substrate.createBranch({
      role: "observer",
      label: "top-camera-branch",
      basisId: topBasis.id,
      observerId: topObserver.id,
    });
    const ballBranch = substrate.createBranch({
      role: "referent",
      label: "orthogonal-ball-branch",
      basisId: sideBasis.id,
    });
    const ball = substrate.createReferent({
      label: "orthogonal-ball",
      anchor: "orthogonal-ball-anchor",
      branchId: ballBranch.id,
    });
    const sideBinding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: sideBranch.id,
      referentBranchId: ballBranch.id,
      referentId: ball.id,
      strength: 0.86,
    });
    const topBinding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: topBranch.id,
      referentBranchId: ballBranch.id,
      referentId: ball.id,
      strength: 0.55,
    });
    const sideEstimate = substrate.createStateEstimate({
      referentId: ball.id,
      branchId: ballBranch.id,
      continuity: "continuing",
      reasoning: "side camera retains enough shape and position continuity",
      basedOnBindingIds: [sideBinding.id],
    });
    const topEstimate = substrate.createStateEstimate({
      referentId: ball.id,
      branchId: ballBranch.id,
      continuity: "ambiguous",
      reasoning: "top camera loses enough detail that co-reference stays underdetermined",
      basedOnBindingIds: [topBinding.id],
    });
    const comparison = substrate.createComparisonSurface({
      label: "orthogonal-ball-comparison",
      sourceIds: [sideBinding.id, topBinding.id, ball.id],
      comparability: "partial",
      compatibility: "unresolved",
      convergence: "not-forced",
      summary: "Both cameras may be tracking the same ball, but basis mismatch prevents forced agreement.",
    });
    const sideArtifact = substrate.createArtifactEnvelope({
      kind: "state-estimate",
      label: "side-ball-estimate-artifact",
      sourceIds: [sideBranch.id, ballBranch.id],
      payloadIds: [sideEstimate.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: sideObserver.id,
        basisId: sideBasis.id,
        source: "hyperswarm-orthogonal-ball-transport-lab",
      },
    });
    const topArtifact = substrate.createArtifactEnvelope({
      kind: "state-estimate",
      label: "top-ball-estimate-artifact",
      sourceIds: [topBranch.id, ballBranch.id],
      payloadIds: [topEstimate.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: topObserver.id,
        basisId: topBasis.id,
        source: "hyperswarm-orthogonal-ball-transport-lab",
      },
    });
    const comparisonArtifact = substrate.createArtifactEnvelope({
      kind: "comparability-surface",
      label: "orthogonal-ball-comparison-artifact",
      sourceIds: [sideBranch.id, topBranch.id, ballBranch.id],
      payloadIds: [comparison.id],
      locality: "shared-candidate",
      provenance: {
        basisId: sideBasis.id,
        source: "hyperswarm-orthogonal-ball-transport-lab",
      },
    });

    const sideSurface: EmergencePeerSurface = {
      id: "side-camera-peer",
      role: "observer",
      branchId: sideBranch.id,
      observerId: sideObserver.id,
      basisId: sideBasis.id,
      referentIds: [ball.id],
    };
    const topSurface: EmergencePeerSurface = {
      id: "top-camera-peer",
      role: "observer",
      branchId: topBranch.id,
      observerId: topObserver.id,
      basisId: topBasis.id,
      referentIds: [ball.id],
    };

    const sideReady = openEmergencePeer({
      swarm: swarmA,
      localSurface: sideSurface,
      channels,
      timeoutMs,
    });
    const topReady = openEmergencePeer({
      swarm: swarmB,
      localSurface: topSurface,
      channels,
      timeoutMs,
    });

    await connectPair({
      swarmA,
      swarmB,
      namespaceParts: [...(options.namespaceParts ?? []), "orthogonal-ball"],
      timeoutMs,
    });

    const [sidePeer, topPeer] = await Promise.all([sideReady, topReady]);
    const sideData = waitForEvent<{
      artifact: ArtifactEnvelope;
      estimate: StateEstimate;
      comparisonArtifact?: ArtifactEnvelope;
      comparison?: ComparisonSurface;
      messageKind: "top-estimate-with-comparison";
    }>(sidePeer.channel, "data", timeoutMs);
    const topData = waitForEvent<{
      artifact: ArtifactEnvelope;
      estimate: StateEstimate;
      messageKind: "side-estimate";
    }>(topPeer.channel, "data", timeoutMs);

    sidePeer.channel.write({
      artifact: sideArtifact,
      estimate: sideEstimate,
      messageKind: "side-estimate",
    });
    topPeer.channel.write({
      artifact: topArtifact,
      estimate: topEstimate,
      comparisonArtifact,
      comparison,
      messageKind: "top-estimate-with-comparison",
    });

    const [receivedBySide, receivedByTop] = await Promise.all([sideData, topData]);

    return {
      namespaceParts: options.namespaceParts ?? [],
      observerPeerIds: [sideSurface.id, topSurface.id],
      sideContinuity: receivedByTop.estimate.continuity,
      topContinuity: receivedBySide.estimate.continuity,
      comparisonComparability: receivedBySide.comparison?.comparability ?? comparison.comparability,
      comparisonCompatibility: receivedBySide.comparison?.compatibility ?? comparison.compatibility,
      comparisonConvergence: receivedBySide.comparison?.convergence ?? comparison.convergence,
      exchangedArtifactKinds: [
        receivedByTop.artifact.kind,
        receivedBySide.artifact.kind,
        receivedBySide.comparisonArtifact?.kind ?? comparisonArtifact.kind,
      ],
      transportPicture: {
        peerIds: [sideSurface.id, topSurface.id],
        traces: [
          createEmergenceTrace({
            localPeerId: sideSurface.id,
            remotePeerId: topSurface.id,
            sentMessageKinds: ["side-estimate"],
            receivedMessageKinds: [receivedBySide.messageKind],
          }),
          createEmergenceTrace({
            localPeerId: topSurface.id,
            remotePeerId: sideSurface.id,
            sentMessageKinds: ["top-estimate-with-comparison"],
            receivedMessageKinds: [receivedByTop.messageKind],
          }),
        ],
      },
    };
  } finally {
    await cleanupChannelsAndSwarms(channels, [swarmA, swarmB]);
  }
}

export async function runHyperswarmBranchCapabilityEvolutionTransportLab(
  options: HyperswarmEmergenceTransportLabOptions,
): Promise<HyperswarmBranchCapabilityEvolutionTransportLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const swarmA = await options.createSwarm(Buffer.alloc(32, 71), topics);
  const swarmB = await options.createSwarm(Buffer.alloc(32, 72), topics);
  const channels: Array<{ destroy?: () => void }> = [];
  const timeoutMs = options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS;
  const substrate = new Substrate(options.now ? { now: options.now } : {});

  try {
    const fullBasis = substrate.createBasis({
      label: "rgb-camera-basis",
      dimensions: ["red", "green", "blue", "position"],
    });
    const degradedBasis = substrate.createBasis({
      label: "rb-camera-basis",
      dimensions: ["red", "blue", "position"],
      partial: true,
      degradedFrom: [fullBasis.id],
      revisedFrom: [fullBasis.id],
    });
    const observer = substrate.createObserver({
      label: "camera",
      basisId: fullBasis.id,
    });
    const receiver = substrate.createObserver({
      label: "continuity-custodian",
      basisId: fullBasis.id,
    });
    const observerBranch = substrate.createBranch({
      role: "observer",
      label: "camera-branch",
      basisId: fullBasis.id,
      observerId: observer.id,
    });
    const receiverBranch = substrate.createBranch({
      role: "observer",
      label: "continuity-custodian-branch",
      basisId: fullBasis.id,
      observerId: receiver.id,
    });
    const referentBranch = substrate.createBranch({
      role: "referent",
      label: "colored-cube-branch",
      basisId: fullBasis.id,
    });
    const referent = substrate.createReferent({
      label: "colored-cube",
      anchor: "cube-anchor",
      branchId: referentBranch.id,
    });
    const binding = substrate.createBinding({
      kind: "tracking",
      observerBranchId: observerBranch.id,
      referentBranchId: referentBranch.id,
      referentId: referent.id,
      strength: 0.91,
    });
    const initialEstimate = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "continuing",
      reasoning: "full color basis preserves enough distinction for continuing judgment",
      basedOnBindingIds: [binding.id],
      metadata: { effectiveBasisId: fullBasis.id },
    });
    const revisedBranch = substrate.reviseBranchBasis({
      branchId: observerBranch.id,
      basisId: degradedBasis.id,
      reason: "camera lost the ability to preserve green distinctions",
    });
    const degradedEstimate = substrate.createStateEstimate({
      referentId: referent.id,
      branchId: referentBranch.id,
      continuity: "ambiguous",
      reasoning: "green loss weakens re-identification enough to keep continuity unresolved",
      basedOnBindingIds: [binding.id],
      metadata: { effectiveBasisId: degradedBasis.id },
    });
    const revisionView = substrate.createView({
      kind: "branch-timeline",
      label: "camera-basis-revision-view",
      sourceIds: [observerBranch.id, binding.id, initialEstimate.id, degradedEstimate.id],
      projection: "same branch continues while effective basis degrades and downstream judgment weakens",
    });
    const initialArtifact = substrate.createArtifactEnvelope({
      kind: "state-estimate",
      label: "camera-initial-estimate-artifact",
      sourceIds: [observerBranch.id, referentBranch.id],
      payloadIds: [initialEstimate.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: observer.id,
        basisId: fullBasis.id,
        source: "hyperswarm-branch-capability-evolution-transport-lab",
      },
    });
    const degradedArtifact = substrate.createArtifactEnvelope({
      kind: "state-estimate",
      label: "camera-degraded-estimate-artifact",
      sourceIds: [observerBranch.id, referentBranch.id],
      payloadIds: [degradedEstimate.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: observer.id,
        basisId: degradedBasis.id,
        source: "hyperswarm-branch-capability-evolution-transport-lab",
      },
    });
    const revisionArtifact = substrate.createArtifactEnvelope({
      kind: "view",
      label: "camera-basis-revision-artifact",
      sourceIds: [observerBranch.id, referentBranch.id],
      payloadIds: [revisionView.id],
      locality: "shared-candidate",
      provenance: {
        emitterId: observer.id,
        basisId: degradedBasis.id,
        source: "hyperswarm-branch-capability-evolution-transport-lab",
      },
    });

    const senderSurface: EmergencePeerSurface = {
      id: "capability-evolution-peer",
      role: "observer",
      branchId: observerBranch.id,
      observerId: observer.id,
      basisId: degradedBasis.id,
      referentIds: [referent.id],
    };
    const receiverSurface: EmergencePeerSurface = {
      id: "capability-custodian-peer",
      role: "observer",
      branchId: receiverBranch.id,
      observerId: receiver.id,
      basisId: fullBasis.id,
      referentIds: [referent.id],
    };

    const senderReady = openEmergencePeer({
      swarm: swarmA,
      localSurface: senderSurface,
      channels,
      timeoutMs,
    });
    const receiverReady = openEmergencePeer({
      swarm: swarmB,
      localSurface: receiverSurface,
      channels,
      timeoutMs,
    });

    await connectPair({
      swarmA,
      swarmB,
      namespaceParts: [...(options.namespaceParts ?? []), "branch-capability-evolution"],
      timeoutMs,
    });

    const [senderPeer, receiverPeer] = await Promise.all([senderReady, receiverReady]);
    const received = waitForEvent<{
      initialArtifact: ArtifactEnvelope;
      initialEstimate: StateEstimate;
      degradedArtifact: ArtifactEnvelope;
      degradedEstimate: StateEstimate;
      revisionArtifact: ArtifactEnvelope;
      revisionView: View;
      revisedBranch: Branch;
      messageKind: "branch-capability-evolution";
    }>(receiverPeer.channel, "data", timeoutMs);

    senderPeer.channel.write({
      initialArtifact,
      initialEstimate,
      degradedArtifact,
      degradedEstimate,
      revisionArtifact,
      revisionView,
      revisedBranch,
      messageKind: "branch-capability-evolution",
    });

    const receivedBundle = await received;

    return {
      namespaceParts: options.namespaceParts ?? [],
      observerPeerIds: [senderSurface.id, receiverSurface.id],
      branchId: receivedBundle.revisedBranch.id,
      parentBranchIds: receivedBundle.revisedBranch.parentBranchIds,
      revisedBasisId: receivedBundle.revisedBranch.basisId,
      initialContinuity: receivedBundle.initialEstimate.continuity,
      degradedContinuity: receivedBundle.degradedEstimate.continuity,
      revisedFromBasisIds: [...(degradedBasis.revisedFrom ?? [])],
      degradationSourceIds: [...(degradedBasis.degradedFrom ?? [])],
      basisRevision: receivedBundle.revisedBranch.metadata,
      exchangedArtifactKinds: [
        receivedBundle.initialArtifact.kind,
        receivedBundle.degradedArtifact.kind,
        receivedBundle.revisionArtifact.kind,
      ],
      exchangedViewKind: receivedBundle.revisionView.kind,
      transportPicture: {
        peerIds: [senderSurface.id, receiverSurface.id],
        traces: [
          createEmergenceTrace({
            localPeerId: senderSurface.id,
            remotePeerId: receiverSurface.id,
            sentMessageKinds: ["branch-capability-evolution"],
            receivedMessageKinds: [],
          }),
          createEmergenceTrace({
            localPeerId: receiverSurface.id,
            remotePeerId: senderSurface.id,
            sentMessageKinds: [],
            receivedMessageKinds: [receivedBundle.messageKind],
          }),
        ],
      },
    };
  } finally {
    await cleanupChannelsAndSwarms(channels, [swarmA, swarmB]);
  }
}

export async function runHyperswarmBranchForkTransportLab(
  options: HyperswarmEmergenceTransportLabOptions,
): Promise<HyperswarmBranchForkTransportLabReport> {
  const topics = options.topics ?? new Map<string, unknown>();
  const swarmA = await options.createSwarm(Buffer.alloc(32, 81), topics);
  const swarmB = await options.createSwarm(Buffer.alloc(32, 82), topics);
  const channels: Array<{ destroy?: () => void }> = [];
  const timeoutMs = options.flushTimeoutMs ?? DEFAULT_SWARM_FLUSH_TIMEOUT_MS;
  const substrate = new Substrate(options.now ? { now: options.now } : {});

  try {
    const basis = substrate.createBasis({
      label: "fork-basis",
      dimensions: ["shape", "continuity", "position"],
    });
    const observer = substrate.createObserver({
      label: "fork-observer",
      basisId: basis.id,
    });
    const receiver = substrate.createObserver({
      label: "lineage-custodian",
      basisId: basis.id,
    });
    const sourceBranch = substrate.createBranch({
      role: "referent",
      label: "source-referent-branch",
      basisId: basis.id,
      observerId: observer.id,
    });
    const receiverBranch = substrate.createBranch({
      role: "observer",
      label: "lineage-custodian-branch",
      basisId: basis.id,
      observerId: receiver.id,
    });
    const sourceSegment = substrate.openSegment({
      branchId: sourceBranch.id,
      inheritedNucleusIds: [],
      summary: "source branch pre-fork wake",
    });
    const sourceHappening = substrate.createHappening({
      branchId: sourceBranch.id,
      segmentId: sourceSegment.id,
      label: "source continuity before fork",
      triggerIds: [],
      salience: 0.79,
    });
    const sourceCarry = substrate.sealSegment(sourceSegment.id, {
      anchor: "source-fork-anchor",
    });
    const fork = substrate.forkBranch({
      sourceBranchId: sourceBranch.id,
      label: "forked-successor-branch",
      relation: "split",
      lineageEvidence: "successor branch emerges from preserved source continuity",
    });
    const childSegment = substrate.openSegment({
      branchId: fork.branch.id,
      inheritedNucleusIds: [sourceCarry.nucleus.id],
      summary: "forked successor wake",
    });
    const childHappening = substrate.createHappening({
      branchId: fork.branch.id,
      segmentId: childSegment.id,
      label: "successor continuity after fork",
      triggerIds: [],
      salience: 0.83,
    });
    const childCarry = substrate.sealSegment(childSegment.id, {
      anchor: "child-fork-anchor",
    });
    const lineageArtifact = substrate.createArtifactEnvelope({
      kind: "lineage-claim",
      label: "fork-lineage-artifact",
      sourceIds: [sourceBranch.id, fork.branch.id],
      payloadIds: [fork.lineage.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "hyperswarm-branch-fork-transport-lab",
      },
    });
    const forkView = substrate.createView({
      kind: "segment-summary",
      label: "fork-carry-forward-view",
      sourceIds: [sourceBranch.id, fork.branch.id, sourceCarry.nucleus.id, childCarry.nucleus.id],
      projection: "successor branch inherits source nucleus package while diverging after split",
    });
    const forkViewArtifact = substrate.createArtifactEnvelope({
      kind: "view",
      label: "fork-carry-forward-artifact",
      sourceIds: [sourceBranch.id, fork.branch.id],
      payloadIds: [forkView.id],
      locality: "shared-candidate",
      provenance: {
        basisId: basis.id,
        emitterId: observer.id,
        source: "hyperswarm-branch-fork-transport-lab",
      },
    });

    const senderSurface: EmergencePeerSurface = {
      id: "branch-fork-peer",
      role: "observer",
      branchId: sourceBranch.id,
      observerId: observer.id,
      basisId: basis.id,
    };
    const receiverSurface: EmergencePeerSurface = {
      id: "lineage-custodian-peer",
      role: "observer",
      branchId: receiverBranch.id,
      observerId: receiver.id,
      basisId: basis.id,
    };

    const senderReady = openEmergencePeer({
      swarm: swarmA,
      localSurface: senderSurface,
      channels,
      timeoutMs,
    });
    const receiverReady = openEmergencePeer({
      swarm: swarmB,
      localSurface: receiverSurface,
      channels,
      timeoutMs,
    });

    await connectPair({
      swarmA,
      swarmB,
      namespaceParts: [...(options.namespaceParts ?? []), "branch-fork"],
      timeoutMs,
    });

    const [senderPeer, receiverPeer] = await Promise.all([senderReady, receiverReady]);
    const received = waitForEvent<{
      lineageArtifact: ArtifactEnvelope;
      lineage: LineageEdge;
      forkViewArtifact: ArtifactEnvelope;
      forkView: View;
      childBranch: Branch;
      childSegment: Segment;
      childNucleus: Nucleus;
      sourceHappeningId: string;
      childHappeningId: string;
      messageKind: "branch-fork";
    }>(receiverPeer.channel, "data", timeoutMs);

    senderPeer.channel.write({
      lineageArtifact,
      lineage: fork.lineage,
      forkViewArtifact,
      forkView,
      childBranch: fork.branch,
      childSegment: substrate.state.segments.get(childCarry.segmentId),
      childNucleus: childCarry.nucleus,
      sourceHappeningId: sourceHappening.id,
      childHappeningId: childHappening.id,
      messageKind: "branch-fork",
    });

    const receivedBundle = await received;

    if (!receivedBundle.childSegment) {
      throw new Error("fork transport bundle missing child segment");
    }

    return {
      namespaceParts: options.namespaceParts ?? [],
      observerPeerIds: [senderSurface.id, receiverSurface.id],
      sourceBranchId: sourceBranch.id,
      childBranchId: receivedBundle.childBranch.id,
      lineageRelation: receivedBundle.lineage.relation,
      childParentBranchIds: receivedBundle.childBranch.parentBranchIds,
      inheritedNucleusIds: receivedBundle.childSegment.inheritedNucleusIds,
      childNucleusAnchor: receivedBundle.childNucleus.anchor,
      exchangedArtifactKinds: [receivedBundle.lineageArtifact.kind, receivedBundle.forkViewArtifact.kind],
      transportPicture: {
        peerIds: [senderSurface.id, receiverSurface.id],
        traces: [
          createEmergenceTrace({
            localPeerId: senderSurface.id,
            remotePeerId: receiverSurface.id,
            sentMessageKinds: ["branch-fork"],
            receivedMessageKinds: [],
          }),
          createEmergenceTrace({
            localPeerId: receiverSurface.id,
            remotePeerId: senderSurface.id,
            sentMessageKinds: [],
            receivedMessageKinds: [receivedBundle.messageKind],
          }),
        ],
      },
    };
  } finally {
    await cleanupChannelsAndSwarms(channels, [swarmA, swarmB]);
  }
}

async function connectPair(input: {
  swarmA: ReplicationSwarmLike;
  swarmB: ReplicationSwarmLike;
  namespaceParts: string[];
  timeoutMs: number;
}) {
  const topic = createEmergenceTopic(input.namespaceParts);
  const discoveryA = input.swarmA.join(topic, {
    client: true,
    server: true,
  });
  const discoveryB = input.swarmB.join(topic, {
    client: true,
    server: true,
  });

  await Promise.all([
    input.swarmA.flush(input.timeoutMs),
    input.swarmB.flush(input.timeoutMs),
  ]);
  await waitForDiscoveryRendezvous({
    discoveryA,
    discoveryB,
    swarmA: input.swarmA,
    swarmB: input.swarmB,
    timeoutMs: input.timeoutMs,
  });
}

async function openEmergencePeer(input: {
  swarm: ReplicationSwarmLike;
  localSurface: EmergencePeerSurface;
  channels: Array<{ destroy?: () => void }>;
  timeoutMs: number;
}) {
  return new Promise<{
    channel: EmergenceChannelHandle;
    localSurface: EmergencePeerSurface;
    remoteSurface: EmergencePeerSurface;
  }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`timed out waiting for swarm connection for ${input.localSurface.id}`));
    }, input.timeoutMs);

    input.swarm.on("connection", (socket: unknown, peerInfo: unknown) => {
      const channel = openPlexEmergenceChannel(socket, peerInfo, input.localSurface);
      input.channels.push(channel);

      waitForEvent<EmergencePeerSurface>(channel, "connection", input.timeoutMs)
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

function openPlexEmergenceChannel(
  socket: unknown,
  peerInfo: unknown,
  localSurface: EmergencePeerSurface,
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
      })) as EmergenceChannelHandle;
}

function createEmergenceTrace(input: EmergenceTransportTrace): EmergenceTransportTrace {
  return {
    localPeerId: input.localPeerId,
    remotePeerId: input.remotePeerId,
    sentMessageKinds: input.sentMessageKinds,
    receivedMessageKinds: input.receivedMessageKinds,
  };
}

function createEmergenceTopic(namespaceParts: string[]) {
  return createHash("sha256")
    .update(["causal-substrate", "emergence-lab", ...namespaceParts].join(":"))
    .digest();
}

async function cleanupChannelsAndSwarms(
  channels: Array<{ destroy?: () => void }>,
  swarms: ReplicationSwarmLike[],
) {
  for (const channel of channels) {
    try {
      channel.destroy?.();
    } catch {}
  }

  await Promise.all(swarms.map((swarm) => swarm.close().catch(() => {})));
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
