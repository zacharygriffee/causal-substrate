import type { FirstSeriousCorestoreLabHandle } from "../backends/corestore-first-serious-lab.js";

export interface GenericConsumerComparisonEntry {
  comparisonId: string;
  label: string;
  sourceIds: string[];
  basisId?: string;
  projection?: string;
  comparability: string;
  compatibility: string;
  equivalence?: string;
  convergence: string;
  reasonCodes: string[];
  evidenceSourceIds: string[];
  summary?: string;
}

export interface GenericConsumerComparisonPicture {
  version: "v1";
  comparisons: GenericConsumerComparisonEntry[];
}

export async function buildGenericConsumerComparisonPicture(
  lab: Pick<FirstSeriousCorestoreLabHandle, "readExchangeArtifacts">,
): Promise<GenericConsumerComparisonPicture> {
  const exchangeArtifacts = await lab.readExchangeArtifacts();

  return {
    version: "v1",
    comparisons: exchangeArtifacts.flatMap((record) =>
      record.payload.payloadType === "comparison"
        ? [
            {
              comparisonId: record.payload.comparison.id,
              label: record.payload.comparison.label,
              sourceIds: [...record.payload.comparison.sourceIds],
              comparability: record.payload.comparison.comparability,
              compatibility: record.payload.comparison.compatibility,
              convergence: record.payload.comparison.convergence,
              reasonCodes: [...record.payload.comparison.reasonCodes],
              evidenceSourceIds: [...record.payload.comparison.evidenceSourceIds],
              ...(record.payload.comparison.basisId
                ? { basisId: record.payload.comparison.basisId }
                : {}),
              ...(record.payload.comparison.projection
                ? { projection: record.payload.comparison.projection }
                : {}),
              ...(record.payload.comparison.equivalence
                ? { equivalence: record.payload.comparison.equivalence }
                : {}),
              ...(record.payload.comparison.summary
                ? { summary: record.payload.comparison.summary }
                : {}),
            },
          ]
        : [],
    ),
  };
}
