import {
  ArtifactKind,
  CapabilityExchangeDecision,
  CapabilitySurface,
  ExchangeMode,
} from "./types.js";

export function negotiateCapabilityExchange(
  local: CapabilitySurface,
  remote: CapabilitySurface,
): CapabilityExchangeDecision {
  const requestedArtifactKinds = new Set<ArtifactKind>(
    local.request?.artifactKinds ?? remote.offer.artifactKinds,
  );
  const matchedArtifactKinds = remote.offer.artifactKinds.filter((kind) =>
    requestedArtifactKinds.has(kind),
  );

  const preferredModes = local.request?.preferredExchangeModes ?? remote.offer.exchangeModes;
  const matchedExchangeModes = remote.offer.exchangeModes.filter((mode) =>
    preferredModes.includes(mode),
  );

  const dimensionOverlap = countDimensionOverlap(
    local.supportedDimensions ?? [],
    remote.supportedDimensions ?? [],
  );
  const missingDimensions = local.missingDimensions ?? [];
  const mediationPossible = matchedArtifactKinds.some((kind) => kind === "view" || kind === "receipt");
  const rawWitnessPossible = matchedExchangeModes.includes("raw-witness");
  const hasAnyMatch = matchedArtifactKinds.length > 0 && matchedExchangeModes.length > 0;
  const requiresMediation = hasAnyMatch && !rawWitnessPossible && mediationPossible;

  if (!hasAnyMatch) {
    return {
      accepted: false,
      reason: "no shared artifact and exchange mode overlap",
      matchedArtifactKinds,
      matchedExchangeModes,
      requiresMediation: false,
    };
  }

  if (dimensionOverlap === 0 && !requiresMediation) {
    return {
      accepted: false,
      reason: "basis overlap is too weak for direct exchange and no mediated artifact is available",
      matchedArtifactKinds,
      matchedExchangeModes,
      requiresMediation: false,
    };
  }

  if (missingDimensions.length > 0 && requiresMediation) {
    return {
      accepted: true,
      reason: "capability mismatch narrows exchange to mediated artifacts",
      matchedArtifactKinds,
      matchedExchangeModes,
      requiresMediation: true,
    };
  }

  return {
    accepted: true,
    reason: "capability overlap supports bounded exchange",
    matchedArtifactKinds,
    matchedExchangeModes,
    requiresMediation,
  };
}

function countDimensionOverlap(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.filter((dimension) => rightSet.has(dimension)).length;
}
