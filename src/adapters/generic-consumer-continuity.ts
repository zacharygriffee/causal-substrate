import type { StateEstimate } from "../kernel/types.js";
import type { FirstSeriousCorestoreLabHandle } from "../backends/corestore-first-serious-lab.js";
import {
  reconstructContinuitySituation,
  reconstructTransitionDecision,
  type ContinuitySituationSurface,
  type ContinuityTransitionDecisionSurface,
} from "../backends/corestore-follow-on-labs.js";

export interface GenericConsumerReferentStatus {
  referentId: string;
  branchId: string;
  continuity: StateEstimate["continuity"];
  reasoning: string;
  estimatedAt: string;
  basedOnBindingIds: string[];
  inertiaModelId?: string;
  volatilityModelId?: string;
}

export interface GenericConsumerTransitionSummary {
  fromAsOf: string;
  toAsOf: string;
  transitionKind: ContinuityTransitionDecisionSurface["transitionKind"];
  reasonCodes: string[];
  evidenceSourceIds: string[];
}

export interface GenericConsumerContinuityPicture {
  version: "v1";
  situation: ContinuitySituationSurface;
  referents: GenericConsumerReferentStatus[];
  transition?: GenericConsumerTransitionSummary;
}

export interface BuildGenericConsumerContinuityPictureInput {
  lab: Pick<
    FirstSeriousCorestoreLabHandle,
    | "handle"
    | "readBranchHappenings"
    | "readSleepCapsules"
    | "readReferentState"
    | "readExchangeArtifacts"
  >;
  asOf?: string;
  transitionWindow?:
    | {
        fromAsOf: string;
        toAsOf: string;
      }
    | undefined;
}

export async function buildGenericConsumerContinuityPicture(
  input: BuildGenericConsumerContinuityPictureInput,
): Promise<GenericConsumerContinuityPicture> {
  const situation = await reconstructContinuitySituation(input.lab, {
    ...(input.asOf ? { asOf: input.asOf } : {}),
  });
  const referentState = await input.lab.readReferentState();
  const latestByReferentId = new Map<string, (typeof referentState)[number]>();

  for (const record of referentState) {
    if (input.asOf && record.recordedAt.localeCompare(input.asOf) > 0) {
      continue;
    }
    latestByReferentId.set(record.referentId, record);
  }

  const picture: GenericConsumerContinuityPicture = {
    version: "v1",
    situation,
    referents: [...latestByReferentId.values()].map((record) => ({
      referentId: record.referentId,
      branchId: record.branchId,
      continuity: record.continuity,
      reasoning: record.estimate.reasoning,
      estimatedAt: record.estimate.estimatedAt,
      basedOnBindingIds: [...record.estimate.basedOnBindingIds],
      ...(record.estimate.inertiaModelId
        ? { inertiaModelId: record.estimate.inertiaModelId }
        : {}),
      ...(record.estimate.volatilityModelId
        ? { volatilityModelId: record.estimate.volatilityModelId }
        : {}),
    })),
  };

  if (input.transitionWindow) {
    const transition = await reconstructTransitionDecision(input.lab, input.transitionWindow);
    picture.transition = {
      fromAsOf: transition.fromAsOf,
      toAsOf: transition.toAsOf,
      transitionKind: transition.transitionKind,
      reasonCodes: [...transition.reasonCodes],
      evidenceSourceIds: [...transition.evidenceSourceIds],
    };
  }

  return picture;
}
