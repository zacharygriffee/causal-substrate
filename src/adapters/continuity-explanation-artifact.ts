import { createHash } from "node:crypto";

import type { FirstSeriousCorestoreLabHandle } from "../backends/corestore-first-serious-lab.js";
import {
  reconstructInspectabilityPicture,
  type ArtifactInspectabilitySurface,
  type ContinuitySituationSurface,
  type ContinuityTransitionDecisionSurface,
  type ContextInspectabilitySurface,
  type PortalInspectabilitySurface,
} from "../backends/corestore-follow-on-labs.js";
import type { StateEstimate } from "../kernel/types.js";
import {
  buildGenericConsumerContinuityPicture,
  type BuildGenericConsumerContinuityPictureInput,
  type GenericConsumerContinuityPicture,
  type GenericConsumerTransitionSummary,
} from "./generic-consumer-continuity.js";

export const CONTINUITY_EXPLANATION_ARTIFACT_SCHEMA =
  "causal-substrate/continuity-explanation/v1" as const;

export type ContinuityExplanationWarningCode =
  | "derived-view-only"
  | "source-continuity-not-transferred"
  | "ambiguity-present"
  | "context-placement-ambiguous"
  | "partial-basis";

export interface ContinuityExplanationBoundary {
  evidenceOnly: true;
  rawAppendLogsIncluded: false;
  grantsWriterAdmission: false;
  grantsMeshParticipation: false;
  assertsGlobalTruth: false;
}

export interface ContinuityExplanationSourceContinuity {
  custody: "local-or-custody-bound";
  namespaceParts: string[];
  asOf?: string;
  fromAsOf?: string;
  toAsOf?: string;
}

export interface ContinuityExplanationBranchRef {
  branchId: string;
  role: "primary" | "recently-changed";
  latestSegmentId?: string;
  latestHappeningId?: string;
  latestHappeningLabel?: string;
  latestHappeningObservedAt?: string;
}

export interface ContinuityExplanationSleepBoundaryRef {
  branchId: string;
  segmentId?: string;
  nucleusId: string;
  anchor: string;
}

export interface ContinuityExplanationReferentState {
  referentId: string;
  branchId: string;
  continuity: StateEstimate["continuity"];
  reasoning: string;
  estimatedAt: string;
  basedOnBindingIds: string[];
  inertiaModelId?: string;
  volatilityModelId?: string;
}

export interface ContinuityExplanationContextRef {
  contextId: string;
  branchId?: string;
  role: "primary" | "portal-visible" | "supporting";
  label?: string;
  artifactId?: string;
  containmentPolicy?: string;
}

export interface ContinuityExplanationPortalRef {
  portalId: string;
  branchId: string;
  label: string;
  sourceContextId: string;
  targetContextId: string;
  exposureRule: string;
  artifactId: string;
  transform?: string;
}

export interface ContinuityExplanationArtifactRef {
  artifactId: string;
  kind: string;
  payloadType: string;
  payloadId: string;
  sourceIds: string[];
  payloadSourceIds: string[];
  emittedAt: string;
  basisId?: string;
  emitterId?: string;
  provenanceSource?: string;
}

export interface ContinuityExplanationProvenance {
  source: string;
  emittedAt: string;
  basisIds: string[];
  sourceArtifactIds: string[];
}

export interface ContinuityExplanationArtifact {
  schema: typeof CONTINUITY_EXPLANATION_ARTIFACT_SCHEMA;
  schemaVersion: 1;
  artifactKind: "continuity-explanation";
  artifactId: string;
  emittedAt: string;
  boundary: ContinuityExplanationBoundary;
  sourceContinuity: ContinuityExplanationSourceContinuity;
  situation: ContinuitySituationSurface;
  branchRefs: ContinuityExplanationBranchRef[];
  sleepBoundaryRefs: ContinuityExplanationSleepBoundaryRef[];
  referentContinuity: ContinuityExplanationReferentState[];
  contextRefs: ContinuityExplanationContextRef[];
  portalRefs: ContinuityExplanationPortalRef[];
  transition?: GenericConsumerTransitionSummary;
  evidenceSourceIds: string[];
  supportingArtifacts: ContinuityExplanationArtifactRef[];
  provenance: ContinuityExplanationProvenance;
  warnings: ContinuityExplanationWarningCode[];
}

export interface BuildContinuityExplanationArtifactInput
  extends BuildGenericConsumerContinuityPictureInput {
  artifactId?: string;
  emittedAt: string;
  provenanceSource?: string;
  partialBasis?: boolean;
}

type ExplanationLab = Pick<
  FirstSeriousCorestoreLabHandle,
  | "handle"
  | "readBranchHappenings"
  | "readSleepCapsules"
  | "readReferentState"
  | "readExchangeArtifacts"
>;

export async function buildContinuityExplanationArtifact(
  input: BuildContinuityExplanationArtifactInput,
): Promise<ContinuityExplanationArtifact> {
  const picture = await buildGenericConsumerContinuityPicture(input);
  const inspectability = await reconstructInspectabilityPicture(input.lab as ExplanationLab);
  const evidenceSourceIds = collectEvidenceSourceIds(picture);
  const supportingArtifacts = inspectability.artifactClaims.map(toExplanationArtifactRef);
  const basisIds = collectUnique(
    supportingArtifacts.flatMap((artifact) => (artifact.basisId ? [artifact.basisId] : [])),
  );

  const artifact: ContinuityExplanationArtifact = {
    schema: CONTINUITY_EXPLANATION_ARTIFACT_SCHEMA,
    schemaVersion: 1,
    artifactKind: "continuity-explanation",
    artifactId:
      input.artifactId ??
      createExplanationArtifactId({
        namespaceParts: picture.situation.namespaceParts,
        emittedAt: input.emittedAt,
        evidenceSourceIds,
      }),
    emittedAt: input.emittedAt,
    boundary: {
      evidenceOnly: true,
      rawAppendLogsIncluded: false,
      grantsWriterAdmission: false,
      grantsMeshParticipation: false,
      assertsGlobalTruth: false,
    },
    sourceContinuity: {
      custody: "local-or-custody-bound",
      namespaceParts: [...picture.situation.namespaceParts],
      ...(input.asOf ? { asOf: input.asOf } : {}),
      ...(input.transitionWindow?.fromAsOf
        ? { fromAsOf: input.transitionWindow.fromAsOf }
        : {}),
      ...(input.transitionWindow?.toAsOf ? { toAsOf: input.transitionWindow.toAsOf } : {}),
    },
    situation: picture.situation,
    branchRefs: buildBranchRefs(picture, inspectability.branchClaims),
    sleepBoundaryRefs: inspectability.branchClaims.flatMap((claim) =>
      claim.latestSleepCapsuleId
        ? [
            {
              branchId: claim.branchId,
              ...(claim.latestSegmentId ? { segmentId: claim.latestSegmentId } : {}),
              nucleusId: claim.latestSleepCapsuleId,
              anchor: claim.latestSleepAnchor ?? "",
            },
          ]
        : [],
    ),
    referentContinuity: picture.referents.map((referent) => ({ ...referent })),
    contextRefs: buildContextRefs(picture.situation, inspectability.contextClaims),
    portalRefs: buildPortalRefs(picture.situation, inspectability.portalClaims),
    ...(picture.transition ? { transition: picture.transition } : {}),
    evidenceSourceIds,
    supportingArtifacts,
    provenance: {
      source: input.provenanceSource ?? "causal-substrate",
      emittedAt: input.emittedAt,
      basisIds,
      sourceArtifactIds: supportingArtifacts.map((artifact) => artifact.artifactId),
    },
    warnings: buildWarnings(picture, input.partialBasis ?? basisIds.length === 0),
  };

  assertContinuityExplanationArtifact(artifact);
  return artifact;
}

export function assertContinuityExplanationArtifact(
  value: unknown,
): asserts value is ContinuityExplanationArtifact {
  const candidate = assertObject(value, "continuity explanation artifact");
  assertEqual(candidate.schema, CONTINUITY_EXPLANATION_ARTIFACT_SCHEMA, "schema");
  assertEqual(candidate.schemaVersion, 1, "schemaVersion");
  assertEqual(candidate.artifactKind, "continuity-explanation", "artifactKind");
  assertString(candidate.artifactId, "artifactId");
  assertString(candidate.emittedAt, "emittedAt");
  const boundary = assertObject(candidate.boundary, "boundary");
  assertEqual(boundary.evidenceOnly, true, "boundary.evidenceOnly");
  assertEqual(boundary.rawAppendLogsIncluded, false, "boundary.rawAppendLogsIncluded");
  assertEqual(boundary.grantsWriterAdmission, false, "boundary.grantsWriterAdmission");
  assertEqual(boundary.grantsMeshParticipation, false, "boundary.grantsMeshParticipation");
  assertEqual(boundary.assertsGlobalTruth, false, "boundary.assertsGlobalTruth");
  assertArray(candidate.branchRefs, "branchRefs");
  assertArray(candidate.sleepBoundaryRefs, "sleepBoundaryRefs");
  assertArray(candidate.referentContinuity, "referentContinuity");
  assertArray(candidate.contextRefs, "contextRefs");
  assertArray(candidate.portalRefs, "portalRefs");
  assertArray(candidate.evidenceSourceIds, "evidenceSourceIds");
  assertArray(candidate.supportingArtifacts, "supportingArtifacts");
  assertArray(candidate.warnings, "warnings");
}

function buildBranchRefs(
  picture: GenericConsumerContinuityPicture,
  branchClaims: Array<{
    branchId: string;
    latestSegmentId?: string;
    latestHappeningId?: string;
    latestHappeningLabel?: string;
    latestHappeningObservedAt?: string;
  }>,
): ContinuityExplanationBranchRef[] {
  return branchClaims.map((claim) => ({
    branchId: claim.branchId,
    role:
      claim.branchId === picture.situation.primaryBranchId
        ? "primary"
        : "recently-changed",
    ...(claim.latestSegmentId ? { latestSegmentId: claim.latestSegmentId } : {}),
    ...(claim.latestHappeningId ? { latestHappeningId: claim.latestHappeningId } : {}),
    ...(claim.latestHappeningLabel
      ? { latestHappeningLabel: claim.latestHappeningLabel }
      : {}),
    ...(claim.latestHappeningObservedAt
      ? { latestHappeningObservedAt: claim.latestHappeningObservedAt }
      : {}),
  }));
}

function buildContextRefs(
  situation: ContinuitySituationSurface,
  contextClaims: ContextInspectabilitySurface[],
): ContinuityExplanationContextRef[] {
  const refs = new Map<string, ContinuityExplanationContextRef>();
  for (const claim of contextClaims) {
    refs.set(claim.contextId, {
      contextId: claim.contextId,
      branchId: claim.branchId,
      role: "supporting",
      label: claim.label,
      artifactId: claim.artifactId,
      ...(claim.containmentPolicy ? { containmentPolicy: claim.containmentPolicy } : {}),
    });
  }

  if (situation.primaryContextId) {
    const existing = refs.get(situation.primaryContextId);
    refs.set(situation.primaryContextId, {
      contextId: situation.primaryContextId,
      ...existing,
      role: "primary",
    });
  }

  for (const contextId of situation.portalVisibleContextIds) {
    const existing = refs.get(contextId);
    refs.set(contextId, {
      contextId,
      ...existing,
      role: "portal-visible",
    });
  }

  return [...refs.values()];
}

function buildPortalRefs(
  situation: ContinuitySituationSurface,
  portalClaims: PortalInspectabilitySurface[],
): ContinuityExplanationPortalRef[] {
  const relevantContextIds = new Set([
    ...(situation.primaryContextId ? [situation.primaryContextId] : []),
    ...situation.portalVisibleContextIds,
  ]);

  return portalClaims
    .filter(
      (claim) =>
        relevantContextIds.has(claim.sourceContextId) ||
        relevantContextIds.has(claim.targetContextId),
    )
    .map((claim) => ({
      portalId: claim.portalId,
      branchId: claim.branchId,
      label: claim.label,
      sourceContextId: claim.sourceContextId,
      targetContextId: claim.targetContextId,
      exposureRule: claim.exposureRule,
      artifactId: claim.artifactId,
      ...(claim.transform ? { transform: claim.transform } : {}),
    }));
}

function toExplanationArtifactRef(
  claim: ArtifactInspectabilitySurface,
): ContinuityExplanationArtifactRef {
  return {
    artifactId: claim.artifactId,
    kind: claim.kind,
    payloadType: claim.payloadType,
    payloadId: claim.payloadId,
    sourceIds: [...claim.sourceIds],
    payloadSourceIds: [...claim.payloadSourceIds],
    emittedAt: claim.emittedAt,
    ...(claim.basisId ? { basisId: claim.basisId } : {}),
    ...(claim.emitterId ? { emitterId: claim.emitterId } : {}),
    ...(claim.provenanceSource ? { provenanceSource: claim.provenanceSource } : {}),
  };
}

function collectEvidenceSourceIds(picture: GenericConsumerContinuityPicture): string[] {
  return collectUnique([
    ...picture.situation.evidenceSourceIds,
    ...picture.referents.flatMap((referent) => referent.basedOnBindingIds),
    ...(picture.transition?.evidenceSourceIds ?? []),
  ]);
}

function buildWarnings(
  picture: GenericConsumerContinuityPicture,
  partialBasis: boolean,
): ContinuityExplanationWarningCode[] {
  const warnings: ContinuityExplanationWarningCode[] = [
    "derived-view-only",
    "source-continuity-not-transferred",
  ];

  if (picture.situation.ambiguityState !== "none") {
    warnings.push("ambiguity-present");
  }
  if (
    picture.situation.ambiguityState === "context-placement" ||
    picture.situation.ambiguityState === "mixed"
  ) {
    warnings.push("context-placement-ambiguous");
  }
  if (partialBasis) {
    warnings.push("partial-basis");
  }

  return collectUnique(warnings);
}

function createExplanationArtifactId(input: {
  namespaceParts: string[];
  emittedAt: string;
  evidenceSourceIds: string[];
}) {
  const hash = createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex")
    .slice(0, 16);
  return `continuity-explanation-${hash}`;
}

function collectUnique<T>(values: T[]): T[] {
  return [...new Set(values)];
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
