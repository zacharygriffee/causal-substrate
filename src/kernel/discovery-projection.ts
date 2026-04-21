import { createHash } from "node:crypto";

import {
  Branch,
  Context,
  DiscoveryJoinSet,
  DiscoveryProjection,
  DiscoveryTopicKind,
  Portal,
} from "./types.js";

export interface ComputeDiscoveryJoinSetInput {
  observerBranch: Branch;
  contexts: Map<string, Context>;
  portals: Map<string, Portal>;
  discoverySalt?: string;
  topicVersion?: string;
}

export function computeDiscoveryJoinSet(input: ComputeDiscoveryJoinSetInput): DiscoveryJoinSet {
  const discoverySalt = input.discoverySalt ?? "default";
  const topicVersion = input.topicVersion ?? "v1";
  const projections: DiscoveryProjection[] = [];
  const seenTopicKeys = new Set<string>();

  if (!input.observerBranch.contextId) {
    return {
      primaryTopicKey: deriveTopicKey({
        discoverySalt,
        topicVersion,
        topicKind: "peer-direct",
        anchor: input.observerBranch.id,
      }),
      topicKeys: [],
      projections: [],
    };
  }

  const primaryContext = requireContext(input.contexts, input.observerBranch.contextId);
  const parentContexts = collectParentContexts(primaryContext, input.contexts);
  const portalVisibleContexts = collectPortalVisibleContexts(primaryContext.id, input.portals, input.contexts);

  pushProjection({
    projections,
    seenTopicKeys,
    projection: buildProjection({
      id: `${input.observerBranch.id}:context-self`,
      discoverySalt,
      topicVersion,
      topicKind: "context-self",
      sourceBranchId: input.observerBranch.id,
      scopeAnchorId: primaryContext.id,
      contextId: primaryContext.id,
      sourceIds: [input.observerBranch.id, primaryContext.id],
    }),
  });

  for (const context of parentContexts) {
    pushProjection({
      projections,
      seenTopicKeys,
      projection: buildProjection({
        id: `${input.observerBranch.id}:context-parent:${context.id}`,
        discoverySalt,
        topicVersion,
        topicKind: "context-parent",
        sourceBranchId: input.observerBranch.id,
        scopeAnchorId: context.id,
        contextId: context.id,
        sourceIds: [input.observerBranch.id, context.id],
      }),
    });
  }

  for (const visible of portalVisibleContexts) {
    pushProjection({
      projections,
      seenTopicKeys,
      projection: buildProjection({
        id: `${input.observerBranch.id}:context-portal:${visible.context.id}`,
        discoverySalt,
        topicVersion,
        topicKind: "context-portal",
        sourceBranchId: input.observerBranch.id,
        scopeAnchorId: visible.context.id,
        contextId: visible.context.id,
        sourceIds: [input.observerBranch.id, visible.context.id, visible.portal.id],
        metadata: {
          viaPortalId: visible.portal.id,
        },
      }),
    });
  }

  return {
    primaryTopicKey: projections[0]?.topicKey ?? "",
    topicKeys: projections.map((projection) => projection.topicKey),
    projections,
  };
}

function collectParentContexts(primary: Context, contexts: Map<string, Context>) {
  const parents: Context[] = [];
  let nextId = primary.parentContextId;

  while (nextId) {
    const parent = requireContext(contexts, nextId);
    parents.push(parent);
    nextId = parent.parentContextId;
  }

  return parents;
}

function collectPortalVisibleContexts(
  targetContextId: string,
  portals: Map<string, Portal>,
  contexts: Map<string, Context>,
) {
  return [...portals.values()]
    .filter((portal) => portal.targetContextId === targetContextId)
    .map((portal) => ({
      portal,
      context: requireContext(contexts, portal.sourceContextId),
    }));
}

function buildProjection(input: {
  id: string;
  discoverySalt: string;
  topicVersion: string;
  topicKind: DiscoveryTopicKind;
  sourceBranchId: string;
  scopeAnchorId: string;
  contextId?: string;
  sourceIds: string[];
  metadata?: Record<string, unknown>;
}): DiscoveryProjection {
  return compact<DiscoveryProjection>({
    id: input.id,
    topicKind: input.topicKind,
    scopeKind: "context",
    sourceBranchId: input.sourceBranchId,
    scopeAnchorId: input.scopeAnchorId,
    topicKey: deriveTopicKey({
      discoverySalt: input.discoverySalt,
      topicVersion: input.topicVersion,
      topicKind: input.topicKind,
      anchor: input.scopeAnchorId,
    }),
    discoverySalt: input.discoverySalt,
    contextId: input.contextId,
    sourceIds: input.sourceIds,
    metadata: input.metadata,
  });
}

function deriveTopicKey(input: {
  discoverySalt: string;
  topicVersion: string;
  topicKind: DiscoveryTopicKind;
  anchor: string;
}) {
  return createHash("sha256")
    .update(
      [
        "causal-substrate",
        "discovery",
        input.topicVersion,
        input.discoverySalt,
        input.topicKind,
        input.anchor,
      ].join(":"),
    )
    .digest("hex");
}

function pushProjection(input: {
  projections: DiscoveryProjection[];
  seenTopicKeys: Set<string>;
  projection: DiscoveryProjection;
}) {
  if (input.seenTopicKeys.has(input.projection.topicKey)) {
    return;
  }

  input.seenTopicKeys.add(input.projection.topicKey);
  input.projections.push(input.projection);
}

function requireContext(contexts: Map<string, Context>, contextId: string) {
  const context = contexts.get(contextId);
  if (!context) {
    throw new Error(`unknown context: ${contextId}`);
  }
  return context;
}

function compact<T extends object>(value: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}
