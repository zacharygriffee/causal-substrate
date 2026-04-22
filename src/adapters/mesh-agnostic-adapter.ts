import { computeDiscoveryJoinSet } from "../kernel/discovery-projection.js";
import type { Branch, Context, DiscoveryJoinSet, Portal } from "../kernel/types.js";
import type {
  ContinuitySituationSurface,
  ContinuityTransitionDecisionSurface,
  InspectabilityPicture,
} from "../backends/corestore-follow-on-labs.js";
import {
  reconstructContinuitySituation,
  reconstructInspectabilityPicture,
  reconstructTransitionDecision,
} from "../backends/corestore-follow-on-labs.js";

export interface MeshAgnosticAdapterBoundary {
  adapterKind: "mesh-agnostic";
  sourceContinuityLocal: true;
  sharedArtifactsExplicit: true;
  transportOwnershipImported: false;
}

export interface MeshAgnosticAdapterSnapshot {
  version: "v1";
  boundary: MeshAgnosticAdapterBoundary;
  continuity: ContinuitySituationSurface;
  inspectability: InspectabilityPicture;
  discovery: DiscoveryJoinSet;
  transition?: ContinuityTransitionDecisionSurface;
}

export interface BuildMeshAgnosticAdapterSnapshotInput {
  lab: Parameters<typeof reconstructContinuitySituation>[0];
  observerBranch: Branch;
  contexts: Map<string, Context>;
  portals: Map<string, Portal>;
  adjacentContextIds?: string[];
  concernOverlays?: Array<{
    concern: string;
    scopeAnchorId?: string;
    quantization?: string;
    sourceIds?: string[];
    metadata?: Record<string, unknown>;
  }>;
  continuityAsOf?: string;
  transitionWindow?:
    | {
        fromAsOf: string;
        toAsOf: string;
      }
    | undefined;
  discoverySalt?: string;
  topicVersion?: string;
}

export async function buildMeshAgnosticAdapterSnapshot(
  input: BuildMeshAgnosticAdapterSnapshotInput,
): Promise<MeshAgnosticAdapterSnapshot> {
  const continuity = await reconstructContinuitySituation(input.lab, {
    ...(input.continuityAsOf ? { asOf: input.continuityAsOf } : {}),
  });
  const inspectability = await reconstructInspectabilityPicture(input.lab);
  const discovery = computeDiscoveryJoinSet({
    observerBranch: input.observerBranch,
    contexts: input.contexts,
    portals: input.portals,
    ...(input.adjacentContextIds ? { adjacentContextIds: input.adjacentContextIds } : {}),
    ...(input.concernOverlays ? { concernOverlays: input.concernOverlays } : {}),
    ...(input.discoverySalt ? { discoverySalt: input.discoverySalt } : {}),
    ...(input.topicVersion ? { topicVersion: input.topicVersion } : {}),
  });

  const snapshot: MeshAgnosticAdapterSnapshot = {
    version: "v1",
    boundary: {
      adapterKind: "mesh-agnostic",
      sourceContinuityLocal: true,
      sharedArtifactsExplicit: true,
      transportOwnershipImported: false,
    },
    continuity,
    inspectability,
    discovery,
  };

  if (input.transitionWindow) {
    snapshot.transition = await reconstructTransitionDecision(input.lab, input.transitionWindow);
  }

  return snapshot;
}
