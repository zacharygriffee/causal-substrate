import type { FirstSeriousCorestoreLabHandle } from "../backends/corestore-first-serious-lab.js";
import {
  reconstructContinuitySituation,
  reconstructInspectabilityPicture,
  type ContinuitySituationSurface,
  type InspectabilityPicture,
} from "../backends/corestore-follow-on-labs.js";
import {
  buildContinuityExplanationArtifact,
  type ContinuityExplanationArtifact,
} from "./continuity-explanation-artifact.js";
import {
  buildGenericConsumerComparisonPicture,
  type GenericConsumerComparisonPicture,
} from "./generic-consumer-comparison.js";
import {
  buildGenericConsumerContinuityPicture,
  type GenericConsumerContinuityPicture,
} from "./generic-consumer-continuity.js";

export const ADJACENT_TOOL_INTEROP_SCHEMA =
  "causal-substrate/adjacent-tool-interop/v1" as const;

export type AdjacentToolSurfaceKind =
  | "continuity-situation"
  | "continuity-picture"
  | "continuity-explanation"
  | "inspectability-picture"
  | "comparison-picture";

export interface AdjacentToolInteropBoundary {
  operatorFacing: true;
  evidenceOnly: true;
  sourceContinuityLocal: true;
  rawAppendLogsIncluded: false;
  rawGraphTraversalIncluded: false;
  hiddenContextCarryoverIncluded: false;
  grantsWriterAdmission: false;
  grantsMergeOrForkAuthority: false;
  grantsMeshParticipation: false;
  assertsGlobalTruth: false;
  importsConsumerPolicy: false;
}

export interface AdjacentToolInteropRequest {
  schema: typeof ADJACENT_TOOL_INTEROP_SCHEMA;
  schemaVersion: 1;
  requestId: string;
  consumerId: string;
  requestedSurfaces: AdjacentToolSurfaceKind[];
  asOf?: string;
  transitionWindow?: {
    fromAsOf: string;
    toAsOf: string;
  };
  reason?: string;
}

export interface AdjacentToolInteropDescriptors {
  branchRefs: string[];
  referentRefs: string[];
  contextRefs: string[];
  portalRefs: string[];
  artifactRefs: string[];
  comparisonRefs: string[];
  ambiguityEvidenceIds: string[];
  reasonCodes: string[];
  evidenceIds: string[];
}

export interface AdjacentToolInteropSurfaces {
  continuitySituation?: ContinuitySituationSurface;
  continuityPicture?: GenericConsumerContinuityPicture;
  continuityExplanation?: ContinuityExplanationArtifact;
  inspectabilityPicture?: InspectabilityPicture;
  comparisonPicture?: GenericConsumerComparisonPicture;
}

export interface AdjacentToolInteropReceipt {
  receiptId: string;
  requestId: string;
  consumerId: string;
  suppliedSurfaceKinds: AdjacentToolSurfaceKind[];
  emittedAt: string;
  source: string;
  evidenceIds: string[];
  warnings: string[];
  boundary: AdjacentToolInteropBoundary;
}

export interface AdjacentToolInteropResponse {
  schema: typeof ADJACENT_TOOL_INTEROP_SCHEMA;
  schemaVersion: 1;
  request: AdjacentToolInteropRequest;
  boundary: AdjacentToolInteropBoundary;
  descriptors: AdjacentToolInteropDescriptors;
  surfaces: AdjacentToolInteropSurfaces;
  receipt: AdjacentToolInteropReceipt;
}

export interface BuildAdjacentToolInteropResponseInput {
  lab: Pick<
    FirstSeriousCorestoreLabHandle,
    | "handle"
    | "readBranchHappenings"
    | "readSleepCapsules"
    | "readReferentState"
    | "readExchangeArtifacts"
  >;
  request: AdjacentToolInteropRequest;
  emittedAt: string;
  source?: string;
  partialBasis?: boolean;
}

export function createAdjacentToolInteropRequest(input: {
  requestId: string;
  consumerId: string;
  requestedSurfaces: AdjacentToolSurfaceKind[];
  asOf?: string;
  transitionWindow?: {
    fromAsOf: string;
    toAsOf: string;
  };
  reason?: string;
}): AdjacentToolInteropRequest {
  return {
    schema: ADJACENT_TOOL_INTEROP_SCHEMA,
    schemaVersion: 1,
    requestId: input.requestId,
    consumerId: input.consumerId,
    requestedSurfaces: [...new Set(input.requestedSurfaces)],
    ...(input.asOf ? { asOf: input.asOf } : {}),
    ...(input.transitionWindow ? { transitionWindow: input.transitionWindow } : {}),
    ...(input.reason ? { reason: input.reason } : {}),
  };
}

export async function buildAdjacentToolInteropResponse(
  input: BuildAdjacentToolInteropResponseInput,
): Promise<AdjacentToolInteropResponse> {
  assertAdjacentToolInteropRequest(input.request);

  const boundary = buildBoundary();
  const surfaces: AdjacentToolInteropSurfaces = {};
  const requested = new Set(input.request.requestedSurfaces);

  if (requested.has("continuity-situation")) {
    surfaces.continuitySituation = await reconstructContinuitySituation(input.lab, {
      ...(input.request.asOf ? { asOf: input.request.asOf } : {}),
    });
  }

  if (requested.has("continuity-picture")) {
    surfaces.continuityPicture = await buildGenericConsumerContinuityPicture({
      lab: input.lab,
      ...(input.request.asOf ? { asOf: input.request.asOf } : {}),
      ...(input.request.transitionWindow
        ? { transitionWindow: input.request.transitionWindow }
        : {}),
    });
  }

  if (requested.has("continuity-explanation")) {
    surfaces.continuityExplanation = await buildContinuityExplanationArtifact({
      lab: input.lab,
      emittedAt: input.emittedAt,
      ...(input.request.asOf ? { asOf: input.request.asOf } : {}),
      ...(input.request.transitionWindow
        ? { transitionWindow: input.request.transitionWindow }
        : {}),
      provenanceSource: input.source ?? input.request.consumerId,
      ...(input.partialBasis !== undefined ? { partialBasis: input.partialBasis } : {}),
    });
  }

  if (requested.has("inspectability-picture")) {
    surfaces.inspectabilityPicture = await reconstructInspectabilityPicture(input.lab);
  }

  if (requested.has("comparison-picture")) {
    surfaces.comparisonPicture = await buildGenericConsumerComparisonPicture(input.lab);
  }

  const descriptors = buildDescriptors(surfaces);
  const warnings = buildWarnings(surfaces);

  return {
    schema: ADJACENT_TOOL_INTEROP_SCHEMA,
    schemaVersion: 1,
    request: input.request,
    boundary,
    descriptors,
    surfaces,
    receipt: {
      receiptId: `${input.request.requestId}-receipt`,
      requestId: input.request.requestId,
      consumerId: input.request.consumerId,
      suppliedSurfaceKinds: input.request.requestedSurfaces.filter((kind) =>
        hasSurface(surfaces, kind),
      ),
      emittedAt: input.emittedAt,
      source: input.source ?? "causal-substrate",
      evidenceIds: descriptors.evidenceIds,
      warnings,
      boundary,
    },
  };
}

export function assertAdjacentToolInteropRequest(
  value: unknown,
): asserts value is AdjacentToolInteropRequest {
  const candidate = assertObject(value, "adjacent interop request");
  assertEqual(candidate.schema, ADJACENT_TOOL_INTEROP_SCHEMA, "request.schema");
  assertEqual(candidate.schemaVersion, 1, "request.schemaVersion");
  assertString(candidate.requestId, "request.requestId");
  assertString(candidate.consumerId, "request.consumerId");
  assertArray(candidate.requestedSurfaces, "request.requestedSurfaces");
  for (const surface of candidate.requestedSurfaces as unknown[]) {
    assertSurfaceKind(surface);
  }
}

function buildBoundary(): AdjacentToolInteropBoundary {
  return {
    operatorFacing: true,
    evidenceOnly: true,
    sourceContinuityLocal: true,
    rawAppendLogsIncluded: false,
    rawGraphTraversalIncluded: false,
    hiddenContextCarryoverIncluded: false,
    grantsWriterAdmission: false,
    grantsMergeOrForkAuthority: false,
    grantsMeshParticipation: false,
    assertsGlobalTruth: false,
    importsConsumerPolicy: false,
  };
}

function buildDescriptors(surfaces: AdjacentToolInteropSurfaces): AdjacentToolInteropDescriptors {
  const continuity =
    surfaces.continuitySituation ??
    surfaces.continuityPicture?.situation ??
    surfaces.continuityExplanation?.situation;
  const inspectability = surfaces.inspectabilityPicture;
  const explanation = surfaces.continuityExplanation;
  const comparison = surfaces.comparisonPicture;

  return {
    branchRefs: collectUnique([
      ...(continuity?.primaryBranchId ? [continuity.primaryBranchId] : []),
      ...(inspectability?.branchClaims.map((claim) => claim.branchId) ?? []),
      ...(explanation?.branchRefs.map((ref) => ref.branchId) ?? []),
    ]),
    referentRefs: collectUnique([
      ...(continuity?.activeReferentIds ?? []),
      ...(surfaces.continuityPicture?.referents.map((ref) => ref.referentId) ?? []),
      ...(inspectability?.referentClaims.map((claim) => claim.referentId) ?? []),
      ...(explanation?.referentContinuity.map((ref) => ref.referentId) ?? []),
    ]),
    contextRefs: collectUnique([
      ...(continuity?.primaryContextId ? [continuity.primaryContextId] : []),
      ...(continuity?.portalVisibleContextIds ?? []),
      ...(inspectability?.contextClaims.map((claim) => claim.contextId) ?? []),
      ...(explanation?.contextRefs.map((ref) => ref.contextId) ?? []),
    ]),
    portalRefs: collectUnique([
      ...(inspectability?.portalClaims.map((claim) => claim.portalId) ?? []),
      ...(explanation?.portalRefs.map((ref) => ref.portalId) ?? []),
    ]),
    artifactRefs: collectUnique([
      ...(inspectability?.artifactClaims.map((claim) => claim.artifactId) ?? []),
      ...(explanation?.supportingArtifacts.map((ref) => ref.artifactId) ?? []),
    ]),
    comparisonRefs: collectUnique([
      ...(inspectability?.comparisonClaims.map((claim) => claim.comparisonId) ?? []),
      ...(comparison?.comparisons.map((entry) => entry.comparisonId) ?? []),
    ]),
    ambiguityEvidenceIds: collectUnique([
      ...(continuity && continuity.ambiguityState !== "none"
        ? continuity.evidenceSourceIds
        : []),
      ...(surfaces.continuityPicture?.situation.ambiguityState !== "none"
        ? surfaces.continuityPicture?.situation.evidenceSourceIds ?? []
        : []),
      ...(explanation?.warnings.includes("ambiguity-present")
        ? explanation.evidenceSourceIds
        : []),
    ]),
    reasonCodes: collectUnique([
      ...(continuity?.reasonCodes ?? []),
      ...(surfaces.continuityPicture?.situation.reasonCodes ?? []),
      ...(surfaces.continuityPicture?.transition?.reasonCodes ?? []),
      ...(explanation?.situation.reasonCodes ?? []),
      ...(explanation?.transition?.reasonCodes ?? []),
      ...(comparison?.comparisons.flatMap((entry) => entry.reasonCodes) ?? []),
    ]),
    evidenceIds: collectUnique([
      ...(continuity?.evidenceSourceIds ?? []),
      ...(surfaces.continuityPicture?.situation.evidenceSourceIds ?? []),
      ...(surfaces.continuityPicture?.transition?.evidenceSourceIds ?? []),
      ...(explanation?.evidenceSourceIds ?? []),
      ...(comparison?.comparisons.flatMap((entry) => entry.evidenceSourceIds) ?? []),
    ]),
  };
}

function buildWarnings(surfaces: AdjacentToolInteropSurfaces): string[] {
  return collectUnique([
    "bounded-surface-only",
    "raw-graph-unavailable",
    ...(surfaces.continuityExplanation?.warnings ?? []),
  ]);
}

function hasSurface(surfaces: AdjacentToolInteropSurfaces, kind: AdjacentToolSurfaceKind) {
  switch (kind) {
    case "continuity-situation":
      return !!surfaces.continuitySituation;
    case "continuity-picture":
      return !!surfaces.continuityPicture;
    case "continuity-explanation":
      return !!surfaces.continuityExplanation;
    case "inspectability-picture":
      return !!surfaces.inspectabilityPicture;
    case "comparison-picture":
      return !!surfaces.comparisonPicture;
  }
}

function collectUnique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function assertSurfaceKind(value: unknown) {
  if (
    value !== "continuity-situation" &&
    value !== "continuity-picture" &&
    value !== "continuity-explanation" &&
    value !== "inspectability-picture" &&
    value !== "comparison-picture"
  ) {
    throw new Error("invalid request.requestedSurfaces: unknown surface kind");
  }
}

function assertObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`invalid ${label}: expected object`);
  }
  return value as Record<string, unknown>;
}

function assertArray(value: unknown, label: string) {
  if (!Array.isArray(value)) {
    throw new Error(`invalid ${label}: expected array`);
  }
}

function assertString(value: unknown, label: string) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`invalid ${label}: expected non-empty string`);
  }
}

function assertEqual(value: unknown, expected: unknown, label: string) {
  if (value !== expected) {
    throw new Error(`invalid ${label}: expected ${String(expected)}`);
  }
}
