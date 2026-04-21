export type EntityId = string;
export type Timestamp = string;
export type Locality = "local" | "shared-candidate";

export type BranchRole =
  | "observer"
  | "referent"
  | "context"
  | "portal"
  | "composite"
  | "derived";

export type SegmentStatus = "wake" | "sleep";

export type LineageRelation =
  | "continuation"
  | "split"
  | "merge"
  | "seed-origin"
  | "projection"
  | "inheritance";

export type BindingKind =
  | "tracking"
  | "situational"
  | "projective"
  | "comparative"
  | "causal";

export type ViewKind =
  | "branch-timeline"
  | "segment-summary"
  | "context-surface"
  | "referent-index"
  | "binding-map";

export type ArtifactKind =
  | "binding"
  | "context-surface"
  | "lineage-claim"
  | "portal-surface"
  | "view"
  | "state-estimate"
  | "comparability-surface"
  | "receipt";

export type ComparabilityLevel = "none" | "partial" | "strong";
export type CompatibilityLevel = "unknown" | "compatible" | "incompatible" | "unresolved";
export type ConvergenceLevel = "not-forced" | "clustered" | "divergent" | "unresolved";
export type DiscoveryTopicKind =
  | "context-self"
  | "context-parent"
  | "context-portal"
  | "context-adjacent"
  | "concern-coarse"
  | "peer-direct";

export type DiscoveryScopeKind =
  | "context"
  | "portal"
  | "observer"
  | "referent"
  | "concern"
  | "peer";

export interface BasisDescriptor {
  id: EntityId;
  label: string;
  dimensions: string[];
  partial?: boolean;
  compositional?: boolean;
  degradedFrom?: EntityId[];
  projectedFrom?: EntityId[];
  revisedFrom?: EntityId[];
  notes?: string;
}

export interface Observer {
  id: EntityId;
  label: string;
  basisId: EntityId;
  saliencePolicy?: string;
  metadata?: Record<string, unknown>;
}

export interface Branch {
  id: EntityId;
  role: BranchRole;
  label: string;
  basisId: EntityId;
  observerId?: EntityId;
  referentId?: EntityId;
  contextId?: EntityId;
  parentBranchIds: EntityId[];
  activeSegmentId?: EntityId;
  metadata?: Record<string, unknown>;
}

export interface Trigger {
  id: EntityId;
  label: string;
  threshold: string;
  observedAt: Timestamp;
  basisId?: EntityId;
  inferred?: boolean;
  metadata?: Record<string, unknown>;
}

export interface Happening {
  id: EntityId;
  branchId: EntityId;
  segmentId: EntityId;
  label: string;
  triggerIds: EntityId[];
  salience?: number;
  observedAt: Timestamp;
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface Nucleus {
  id: EntityId;
  branchId: EntityId;
  sourceSegmentId: EntityId;
  inheritedNucleusIds: EntityId[];
  anchor: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface Segment {
  id: EntityId;
  branchId: EntityId;
  index: number;
  status: SegmentStatus;
  openedAt: Timestamp;
  closedAt?: Timestamp;
  inheritedNucleusIds: EntityId[];
  happeningIds: EntityId[];
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface InertiaModel {
  id: EntityId;
  label: string;
  strategy: string;
  metadata?: Record<string, unknown>;
}

export interface VolatilityModel {
  id: EntityId;
  label: string;
  expectedRate: "low" | "medium" | "high" | "unknown";
  metadata?: Record<string, unknown>;
}

export interface Referent {
  id: EntityId;
  label: string;
  anchor: string;
  branchId: EntityId;
  nucleusId?: EntityId;
  inertiaModelId?: EntityId;
  volatilityModelId?: EntityId;
  metadata?: Record<string, unknown>;
}

export interface Binding {
  id: EntityId;
  kind: BindingKind;
  observerBranchId: EntityId;
  referentBranchId: EntityId;
  referentId: EntityId;
  contextId?: EntityId;
  strength?: number;
  metadata?: Record<string, unknown>;
}

export interface Context {
  id: EntityId;
  branchId: EntityId;
  label: string;
  parentContextId?: EntityId;
  containmentPolicy?: string;
  metadata?: Record<string, unknown>;
}

export interface Portal {
  id: EntityId;
  branchId: EntityId;
  label: string;
  sourceContextId: EntityId;
  targetContextId: EntityId;
  exposureRule: string;
  transform?: string;
  metadata?: Record<string, unknown>;
}

export interface View {
  id: EntityId;
  kind: ViewKind;
  label: string;
  sourceIds: EntityId[];
  projection: string;
  replaceable: true;
  metadata?: Record<string, unknown>;
}

export interface Provenance {
  emittedAt: Timestamp;
  basisId?: EntityId;
  emitterId?: EntityId;
  source?: string;
  note?: string;
}

export interface ArtifactEnvelope {
  id: EntityId;
  kind: ArtifactKind;
  label: string;
  sourceIds: EntityId[];
  payloadIds: EntityId[];
  locality: Locality;
  provenance: Provenance;
  metadata?: Record<string, unknown>;
}

export interface DiscoveryProjection {
  id: EntityId;
  topicKind: DiscoveryTopicKind;
  scopeKind: DiscoveryScopeKind;
  sourceBranchId: EntityId;
  scopeAnchorId: EntityId;
  topicKey: string;
  basisId?: EntityId;
  contextId?: EntityId;
  concern?: string;
  quantization?: string;
  sourceIds: EntityId[];
  metadata?: Record<string, unknown>;
}

export interface ComparisonSurface {
  id: EntityId;
  label: string;
  sourceIds: EntityId[];
  basisId?: EntityId;
  comparability: ComparabilityLevel;
  compatibility: CompatibilityLevel;
  convergence: ConvergenceLevel;
  summary: string;
  metadata?: Record<string, unknown>;
}

export interface LineageEdge {
  id: EntityId;
  relation: LineageRelation;
  fromId: EntityId;
  toId: EntityId;
  basisId?: EntityId;
  evidence?: string;
  metadata?: Record<string, unknown>;
}

export interface StateEstimate {
  id: EntityId;
  referentId: EntityId;
  branchId: EntityId;
  estimatedAt: Timestamp;
  continuity: "continuing" | "ambiguous" | "broken";
  reasoning: string;
  basedOnBindingIds: EntityId[];
  inertiaModelId?: EntityId;
  volatilityModelId?: EntityId;
  metadata?: Record<string, unknown>;
}

export interface CarryForwardPackage {
  branchId: EntityId;
  segmentId: EntityId;
  nucleus: Nucleus;
}

export interface SubstrateState {
  basis: Map<EntityId, BasisDescriptor>;
  observers: Map<EntityId, Observer>;
  branches: Map<EntityId, Branch>;
  segments: Map<EntityId, Segment>;
  triggers: Map<EntityId, Trigger>;
  happenings: Map<EntityId, Happening>;
  nuclei: Map<EntityId, Nucleus>;
  inertiaModels: Map<EntityId, InertiaModel>;
  volatilityModels: Map<EntityId, VolatilityModel>;
  referents: Map<EntityId, Referent>;
  bindings: Map<EntityId, Binding>;
  contexts: Map<EntityId, Context>;
  portals: Map<EntityId, Portal>;
  views: Map<EntityId, View>;
  artifacts: Map<EntityId, ArtifactEnvelope>;
  comparisonSurfaces: Map<EntityId, ComparisonSurface>;
  lineage: Map<EntityId, LineageEdge>;
  stateEstimates: Map<EntityId, StateEstimate>;
}

export interface SubstrateSnapshot {
  basis: BasisDescriptor[];
  observers: Observer[];
  branches: Branch[];
  segments: Segment[];
  triggers: Trigger[];
  happenings: Happening[];
  nuclei: Nucleus[];
  inertiaModels: InertiaModel[];
  volatilityModels: VolatilityModel[];
  referents: Referent[];
  bindings: Binding[];
  contexts: Context[];
  portals: Portal[];
  views: View[];
  artifacts: ArtifactEnvelope[];
  comparisonSurfaces: ComparisonSurface[];
  lineage: LineageEdge[];
  stateEstimates: StateEstimate[];
}
