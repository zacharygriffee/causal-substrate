export type PlannedCoreName =
  | "branch-happenings"
  | "segments"
  | "referent-state"
  | "exchange-artifacts";

export interface PlannedCoreLayout {
  name: PlannedCoreName;
  purpose: string;
  artifactKinds: string[];
}

export const DEFAULT_CORESTORE_LAYOUT: PlannedCoreLayout[] = [
  {
    name: "branch-happenings",
    purpose: "Append-only branch happenings and keyframes.",
    artifactKinds: ["happening", "trigger-cluster", "branch-event"],
  },
  {
    name: "segments",
    purpose: "Wake/sleep segmentation and carried sleep capsules.",
    artifactKinds: ["segment", "sleep-capsule", "nucleus-carry"],
  },
  {
    name: "referent-state",
    purpose: "Referent anchors and persistence state surfaces.",
    artifactKinds: ["referent-anchor", "state-estimate", "binding-surface"],
  },
  {
    name: "exchange-artifacts",
    purpose: "Views, receipts, lineage claims, and exchange-oriented artifacts.",
    artifactKinds: ["view", "receipt", "lineage-claim", "artifact-envelope"],
  },
];
