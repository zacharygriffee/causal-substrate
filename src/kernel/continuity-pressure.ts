import { StateEstimate, VolatilityModel } from "./types.js";

export type PressureLevel = "low" | "medium" | "high";
export type BasisReliability = "low" | "partial" | "high";
export type AbsenceKind = "neutral" | "expected-miss";
export type NegativeEvidenceClass =
  | "neutral-absence"
  | "weak-negative-evidence"
  | "strong-negative-evidence";

export interface AssessContinuityPressureInput {
  inertia: PressureLevel;
  volatility: VolatilityModel["expectedRate"];
  basisReliability: BasisReliability;
  absenceKind: AbsenceKind;
  missedExpectedEncounterCount?: number;
  contradictionObserved?: boolean;
}

export interface ContinuityPressureAssessment {
  negativeEvidence: NegativeEvidenceClass;
  suggestedContinuity: StateEstimate["continuity"];
  reasoning: string;
}

const pressureScore: Record<PressureLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const basisScore: Record<BasisReliability, number> = {
  low: 1,
  partial: 2,
  high: 3,
};

function volatilityScore(level: VolatilityModel["expectedRate"]): number {
  switch (level) {
    case "low":
      return 1;
    case "medium":
    case "unknown":
      return 2;
    case "high":
      return 3;
  }
}

export function assessContinuityPressure(
  input: AssessContinuityPressureInput,
): ContinuityPressureAssessment {
  const inertia = pressureScore[input.inertia];
  const volatility = volatilityScore(input.volatility);
  const basis = basisScore[input.basisReliability];
  const misses = Math.max(1, input.missedExpectedEncounterCount ?? 1);

  if (input.contradictionObserved) {
    if (basis <= 1) {
      return {
        negativeEvidence: "strong-negative-evidence",
        suggestedContinuity: "ambiguous",
        reasoning:
          "contradictory evidence appeared, but the current basis is too weak to justify breakage cleanly",
      };
    }

    return {
      negativeEvidence: "strong-negative-evidence",
      suggestedContinuity: "broken",
      reasoning:
        "contradictory evidence under an adequate basis makes continued tracking no longer plausible",
    };
  }

  if (input.absenceKind === "neutral") {
    if (inertia > volatility || (inertia === volatility && basis >= 2)) {
      return {
        negativeEvidence: "neutral-absence",
        suggestedContinuity: "continuing",
        reasoning:
          "no expected encounter was missed, so absence alone does not outweigh the current persistence expectation",
      };
    }

    return {
      negativeEvidence: "neutral-absence",
      suggestedContinuity: "ambiguous",
      reasoning:
        "absence was neutral, but persistence expectations are not strong enough to keep continuity confidently continuing",
    };
  }

  if (inertia === 3 && volatility <= 2 && basis >= 2 && misses === 1) {
    return {
      negativeEvidence: "weak-negative-evidence",
      suggestedContinuity: "continuing",
      reasoning:
        "one missed expected encounter weakens confidence, but strong inertia still keeps continuity plausible",
    };
  }

  return {
    negativeEvidence: "weak-negative-evidence",
    suggestedContinuity: "ambiguous",
    reasoning:
      "expected re-encounter was missed, so continuity weakens, but absence alone does not justify breakage",
  };
}
