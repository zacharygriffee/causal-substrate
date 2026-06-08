import { createHash } from "node:crypto";

export const CAUSAL_REPO_FAMILY_MECHANICS_CHAIN_OBSERVATION_SCHEMA =
  "causal-substrate/repo-family-mechanics-chain-observation/v1" as const;
export const CAUSAL_REPO_FAMILY_MECHANICS_CHAIN_OBSERVATION_KIND =
  "causal-repo-family-mechanics-chain-observation" as const;
export const CAUSAL_REPO_FAMILY_MECHANICS_CHAIN_READBACK_KIND =
  "causal-repo-family-mechanics-chain-observation-readback" as const;

export type RepoFamilyMechanicsClassification = "compatible" | "unresolved" | "damaged";

interface BuildInput {
  packsProof?: unknown;
  bytesProof?: unknown;
  conduitProof?: unknown;
  platformActivationProof?: unknown;
  platformPublicStatusProof?: unknown;
  layerStatusReview?: unknown;
  edgeVisibilityReview?: unknown;
  emittedAt: string;
  sourcePaths?: Record<string, string>;
}

export interface RepoFamilyMechanicsChainObservation {
  artifactKind: typeof CAUSAL_REPO_FAMILY_MECHANICS_CHAIN_OBSERVATION_KIND;
  schema: typeof CAUSAL_REPO_FAMILY_MECHANICS_CHAIN_OBSERVATION_SCHEMA;
  schemaVersion: 1;
  observationId: string;
  observationHash: string;
  emittedAt: string;
  classification: RepoFamilyMechanicsClassification;
  proof: {
    operationProofRung: "local_supplied_material";
    strongestSourceProofRungObserved?: string;
    publicSwarmSourceObserved: boolean;
    liveCausalSwarmProofClaimed: false;
    proofRungUpgradeClaimed: false;
  };
  sourcePaths: Record<string, string>;
  observedSources: Record<string, boolean>;
  preservedRefs: {
    packsRefs: string[];
    bytesRefs: string[];
    conduitRefs: string[];
    platformRefs: string[];
    layerRefs: string[];
    edgeRefs: string[];
    sourceHashes: string[];
    proofRungs: string[];
    linkageStatuses: string[];
  };
  chainFit: {
    packsLayerTarget: boolean;
    bytesPreservesLayerTarget: boolean;
    conduitPreservesLayerTarget: boolean;
    platformActivatedLayerTarget: boolean;
    platformPublicStatusSurfaced: boolean;
    layerVerifiedStatusRefs: boolean;
    edgeProjectedVisibility: boolean;
  };
  validation: {
    status: "repo-family-mechanics-chain-observation-ready" | "repo-family-mechanics-chain-observation-incomplete";
    noCanonicalHistoryClaim: true;
    noLayerEvidenceAdmission: true;
    noRbcInterpretation: true;
    noAuthorityGrant: true;
    noMeshPublication: true;
    noProductionContinuityWrite: true;
    issues: string[];
  };
  boundary: {
    readsSuppliedArtifactsOnly: true;
    opensSwarm: false;
    opensCorestore: false;
    callsEdge: false;
    callsLayer: false;
    callsPlatform: false;
    callsConduit: false;
    admitsLayerEvidence: false;
    acceptsCanonicalHistory: false;
    interpretsRbc: false;
    grantsAuthority: false;
    publishesToMesh: false;
    writesProductionContinuity: false;
  };
  nonClaims: {
    canonicalHistory: false;
    layerEvidenceAdmission: false;
    layerAdmission: false;
    rbcInterpretation: false;
    quorumSatisfaction: false;
    authority: false;
    meshPublication: false;
    productionContinuityWrite: false;
    liveCausalPublicSwarmObservation: false;
  };
  nextPressure: string;
}

export function buildRepoFamilyMechanicsChainObservation(input: BuildInput): RepoFamilyMechanicsChainObservation {
  const packs = object(input.packsProof);
  const bytes = object(input.bytesProof);
  const conduit = object(input.conduitProof);
  const platformActivation = object(input.platformActivationProof);
  const platformStatus = object(input.platformPublicStatusProof);
  const layerReview = object(input.layerStatusReview);
  const edgeReview = object(input.edgeVisibilityReview);

  const chainFit = {
    packsLayerTarget: valueAt(packs, ["componentTarget", "repoName"]) === "mesh-ecology-layer",
    bytesPreservesLayerTarget: valueAt(bytes, ["componentTarget", "repoName"]) === "mesh-ecology-layer",
    conduitPreservesLayerTarget: valueAt(conduit, ["componentTarget", "repoName"]) === "mesh-ecology-layer",
    platformActivatedLayerTarget:
      valueAt(platformActivation, ["componentTarget", "repoName"]) === "mesh-ecology-layer" &&
      valueAt(platformActivation, ["operationProof", "platformActivatedArtifact"]) === true &&
      valueAt(platformActivation, ["operationProof", "layerRuntimeStatusObserved"]) === true,
    platformPublicStatusSurfaced:
      valueAt(platformStatus, ["status"]) === "installable_bundle_activation_public_status_contact_complete" &&
      valueAt(platformStatus, ["statusContact", "publicSwarmTransportObserved"]) === true,
    layerVerifiedStatusRefs:
      valueAt(layerReview, ["reviewStatus"]) === "layer_hosted_status_refs_verified_read_only" &&
      valueAt(layerReview, ["proofBoundary", "platformHostingIsLayerAdmission"]) === false,
    edgeProjectedVisibility:
      valueAt(edgeReview, ["reviewStatus"]) === "visible_for_operator_review" &&
      valueAt(edgeReview, ["operatorProjection", "statusOnly"]) === true &&
      valueAt(edgeReview, ["edgeBoundary", "readOnlyOperatorVisibilityOnly"]) === true,
  };
  const issues = [
    ...missingInputIssues(input),
    ...Object.entries(chainFit).flatMap(([key, value]) => value ? [] : [`chain_fit_${key}_missing_or_false`]),
    ...overclaimIssues(platformActivation, "platform_activation"),
    ...overclaimIssues(platformStatus, "platform_public_status"),
    ...overclaimIssues(layerReview, "layer_review"),
    ...overclaimIssues(edgeReview, "edge_review"),
  ];
  const classification: RepoFamilyMechanicsClassification = issues.some((issue) => issue.includes("overclaim"))
    ? "damaged"
    : issues.length > 0
      ? "unresolved"
      : "compatible";
  const preservedRefs = {
    packsRefs: collectRefs(packs, ["proofRef", "archiveRef"]),
    bytesRefs: collectRefs(bytes, ["proofRef", "readbackRef"]),
    conduitRefs: collectRefs(conduit, ["proofRef", "readbackRef"]),
    platformRefs: collectRefs(platformActivation, ["proofRef", "readbackRef", "statusRef"])
      .concat(collectRefs(platformStatus, ["proofRef"])),
    layerRefs: collectRefs(layerReview, ["reviewRef"]),
    edgeRefs: collectRefs(edgeReview, ["reviewRef"]),
    sourceHashes: unique([
      ...collectHashes(packs),
      ...collectHashes(bytes),
      ...collectHashes(conduit),
      ...collectHashes(platformActivation),
      ...collectHashes(platformStatus),
      ...collectHashes(layerReview),
      ...collectHashes(edgeReview),
    ]),
    proofRungs: unique([
      stringAt(packs, ["proofRung"]),
      stringAt(bytes, ["proofRung"]),
      stringAt(conduit, ["proofRung"]),
      stringAt(platformActivation, ["proofRung"]),
      stringAt(platformStatus, ["proofRung"]),
      stringAt(layerReview, ["proofRung"]),
      stringAt(edgeReview, ["platformContact", "proofRung"]),
    ].filter((value): value is string => Boolean(value))),
    linkageStatuses: unique([
      stringAt(packs, ["status"]),
      stringAt(bytes, ["status"]),
      stringAt(conduit, ["status"]),
      stringAt(platformActivation, ["status"]),
      stringAt(platformStatus, ["status"]),
      stringAt(layerReview, ["reviewStatus"]),
      stringAt(edgeReview, ["reviewStatus"]),
    ].filter((value): value is string => Boolean(value))),
  };
  const observedSources = {
    packsProof: input.packsProof !== undefined,
    bytesProof: input.bytesProof !== undefined,
    conduitProof: input.conduitProof !== undefined,
    platformActivationProof: input.platformActivationProof !== undefined,
    platformPublicStatusProof: input.platformPublicStatusProof !== undefined,
    layerStatusReview: input.layerStatusReview !== undefined,
    edgeVisibilityReview: input.edgeVisibilityReview !== undefined,
  };
  const hashBasis = { emittedAt: input.emittedAt, classification, preservedRefs, chainFit, issues };
  const observation: Omit<RepoFamilyMechanicsChainObservation, "observationId" | "observationHash"> = {
    artifactKind: CAUSAL_REPO_FAMILY_MECHANICS_CHAIN_OBSERVATION_KIND,
    schema: CAUSAL_REPO_FAMILY_MECHANICS_CHAIN_OBSERVATION_SCHEMA,
    schemaVersion: 1,
    emittedAt: input.emittedAt,
    classification,
    proof: {
      operationProofRung: "local_supplied_material",
      ...(preservedRefs.proofRungs[0] ? { strongestSourceProofRungObserved: preservedRefs.proofRungs[0] } : {}),
      publicSwarmSourceObserved: preservedRefs.proofRungs.some((rung) => rung.includes("public")),
      liveCausalSwarmProofClaimed: false,
      proofRungUpgradeClaimed: false,
    },
    sourcePaths: sanitizePaths(input.sourcePaths ?? {}),
    observedSources,
    preservedRefs,
    chainFit,
    validation: {
      status: issues.length === 0
        ? "repo-family-mechanics-chain-observation-ready"
        : "repo-family-mechanics-chain-observation-incomplete",
      noCanonicalHistoryClaim: true,
      noLayerEvidenceAdmission: true,
      noRbcInterpretation: true,
      noAuthorityGrant: true,
      noMeshPublication: true,
      noProductionContinuityWrite: true,
      issues,
    },
    boundary: {
      readsSuppliedArtifactsOnly: true,
      opensSwarm: false,
      opensCorestore: false,
      callsEdge: false,
      callsLayer: false,
      callsPlatform: false,
      callsConduit: false,
      admitsLayerEvidence: false,
      acceptsCanonicalHistory: false,
      interpretsRbc: false,
      grantsAuthority: false,
      publishesToMesh: false,
      writesProductionContinuity: false,
    },
    nonClaims: {
      canonicalHistory: false,
      layerEvidenceAdmission: false,
      layerAdmission: false,
      rbcInterpretation: false,
      quorumSatisfaction: false,
      authority: false,
      meshPublication: false,
      productionContinuityWrite: false,
      liveCausalPublicSwarmObservation: false,
    },
    nextPressure: classification === "compatible"
      ? "spine_reassessment_for_mechanics_work_but_too_complicated_tripwire"
      : "inspect_repo_family_mechanics_chain_material_before_spine_tripwire",
  };
  return {
    ...observation,
    observationId: `causal-repo-family-mechanics-chain-observation:${hash(stableJson(hashBasis)).slice(0, 16)}`,
    observationHash: `sha256:${hash(stableJson(hashBasis))}`,
  };
}

export function buildRepoFamilyMechanicsChainReadback(observation: RepoFamilyMechanicsChainObservation, readAt: string) {
  const recomputedHash = buildRepoFamilyMechanicsChainObservation({
    emittedAt: observation.emittedAt,
    sourcePaths: observation.sourcePaths,
  }).observationHash;
  const readback = {
    artifactKind: CAUSAL_REPO_FAMILY_MECHANICS_CHAIN_READBACK_KIND,
    schema: "causal-substrate/repo-family-mechanics-chain-observation-readback/v1",
    schemaVersion: 1,
    readAt,
    sourceObservationId: observation.observationId,
    sourceObservationHash: observation.observationHash,
    recomputedEnvelopeHash: recomputedHash,
    observationHashPreserved: observation.observationHash.startsWith("sha256:"),
    classification: observation.classification,
    proof: observation.proof,
    preservedRefs: observation.preservedRefs,
    boundary: observation.boundary,
    nonClaims: observation.nonClaims,
    readbackStatus: observation.validation.issues.length === 0
      ? "repo-family-mechanics-chain-observation-readback-verified"
      : "repo-family-mechanics-chain-observation-readback-incomplete",
  };
  return {
    ...readback,
    readbackHash: `sha256:${hash(stableJson(readback))}`,
  };
}

function missingInputIssues(input: BuildInput): string[] {
  return [
    input.packsProof ? "" : "packs_proof_missing",
    input.bytesProof ? "" : "bytes_proof_missing",
    input.conduitProof ? "" : "conduit_proof_missing",
    input.platformActivationProof ? "" : "platform_activation_proof_missing",
    input.platformPublicStatusProof ? "" : "platform_public_status_proof_missing",
    input.layerStatusReview ? "" : "layer_status_review_missing",
    input.edgeVisibilityReview ? "" : "edge_visibility_review_missing",
  ].filter(Boolean);
}

function overclaimIssues(source: Record<string, unknown>, prefix: string): string[] {
  const checks = [
    ["nonClaims", "authority"],
    ["nonClaims", "layerAdmission"],
    ["nonClaims", "rbcGovernance"],
    ["nonClaims", "governedSeam"],
    ["nonClaims", "meshPublication"],
    ["nonClaims", "productionDurability"],
    ["nonClaims", "canonicalTruth"],
    ["edgeBoundary", "claimedAuthority"],
    ["edgeBoundary", "claimedRbcGovernance"],
    ["edgeBoundary", "claimedGovernedSeam"],
    ["edgeBoundary", "claimedEdgeOwnedPublicSwarmProof"],
    ["proofBoundary", "authorityClaimed"],
    ["proofBoundary", "platformHostingIsLayerAdmission"],
  ];
  return checks.flatMap((path) => valueAt(source, path) === true ? [`${prefix}_${path.join("_")}_overclaim`] : []);
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function valueAt(root: Record<string, unknown>, path: string[]): unknown {
  let value: unknown = root;
  for (const key of path) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  return value;
}

function stringAt(root: Record<string, unknown>, path: string[]): string | undefined {
  const value = valueAt(root, path);
  return typeof value === "string" ? value : undefined;
}

function collectRefs(source: Record<string, unknown>, fields: string[]): string[] {
  return fields.flatMap((field) => typeof source[field] === "string" ? [source[field] as string] : []);
}

function collectHashes(source: Record<string, unknown>): string[] {
  return Object.entries(source).flatMap(([key, value]) => {
    if (typeof value === "string" && (key.endsWith("Hash") || key === "proofHash" || key === "reviewHash")) {
      return [value];
    }
    if (value && typeof value === "object" && !Array.isArray(value)) return collectHashes(value as Record<string, unknown>);
    return [];
  });
}

function sanitizePaths(paths: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, value.replace(process.cwd(), "<repo>")]));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson((value as Record<string, unknown>)[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
