import {
  ArtifactEnvelope,
  BasisDescriptor,
  Binding,
  Branch,
  CarryForwardPackage,
  ComparisonSurface,
  Context,
  Happening,
  InertiaModel,
  LineageEdge,
  Nucleus,
  Observer,
  Portal,
  Referent,
  Segment,
  StateEstimate,
  SubstrateState,
  Trigger,
  View,
  VolatilityModel,
  SubstrateSnapshot,
} from "./types.js";

export interface SubstrateOptions {
  now?: () => string;
  idFactory?: (prefix: string) => string;
}

export interface CreateObserverInput {
  label: string;
  basisId: string;
  saliencePolicy?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateBranchInput {
  role: Branch["role"];
  label: string;
  basisId: string;
  observerId?: string;
  referentId?: string;
  contextId?: string;
  parentBranchIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface OpenSegmentInput {
  branchId: string;
  inheritedNucleusIds?: string[];
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface ReviseBranchBasisInput {
  branchId: string;
  basisId: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateTriggerInput {
  label: string;
  threshold: string;
  basisId?: string;
  inferred?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateHappeningInput {
  branchId: string;
  segmentId: string;
  label: string;
  triggerIds?: string[];
  salience?: number;
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateReferentInput {
  label: string;
  anchor: string;
  branchId: string;
  nucleusId?: string;
  inertiaModelId?: string;
  volatilityModelId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateBindingInput {
  kind: Binding["kind"];
  observerBranchId: string;
  referentBranchId: string;
  referentId: string;
  contextId?: string;
  strength?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateContextInput {
  label: string;
  branchId: string;
  parentContextId?: string;
  containmentPolicy?: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePortalInput {
  label: string;
  branchId: string;
  sourceContextId: string;
  targetContextId: string;
  exposureRule: string;
  transform?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateViewInput {
  kind: View["kind"];
  label: string;
  sourceIds: string[];
  projection: string;
  metadata?: Record<string, unknown>;
}

export interface CreateArtifactEnvelopeInput {
  kind: ArtifactEnvelope["kind"];
  label: string;
  sourceIds: string[];
  payloadIds?: string[];
  locality?: ArtifactEnvelope["locality"];
  provenance: Omit<ArtifactEnvelope["provenance"], "emittedAt"> & { emittedAt?: string };
  metadata?: Record<string, unknown>;
}

export interface CreateComparisonSurfaceInput {
  label: string;
  sourceIds: string[];
  basisId?: string;
  projection?: string;
  comparability: ComparisonSurface["comparability"];
  compatibility: ComparisonSurface["compatibility"];
  equivalence?: ComparisonSurface["equivalence"];
  convergence: ComparisonSurface["convergence"];
  reasonCodes: string[];
  evidenceSourceIds: string[];
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateLineageInput {
  relation: LineageEdge["relation"];
  fromId: string;
  toId: string;
  basisId?: string;
  evidence?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateStateEstimateInput {
  referentId: string;
  branchId: string;
  continuity: StateEstimate["continuity"];
  reasoning: string;
  basedOnBindingIds?: string[];
  inertiaModelId?: string;
  volatilityModelId?: string;
  metadata?: Record<string, unknown>;
}

export interface ForkBranchInput {
  sourceBranchId: string;
  label: string;
  relation?: LineageEdge["relation"];
  basisId?: string;
  role?: Branch["role"];
  observerId?: string;
  referentId?: string;
  contextId?: string;
  metadata?: Record<string, unknown>;
  lineageEvidence?: string;
}

export interface CreateMergeSuccessorInput {
  label: string;
  role: Branch["role"];
  basisId: string;
  sourceBranchIds: string[];
  inheritedNucleusIds?: string[];
  summary?: string;
  metadata?: Record<string, unknown>;
  segmentMetadata?: Record<string, unknown>;
  relation?: LineageEdge["relation"];
}

export class Substrate {
  readonly state: SubstrateState;
  private readonly now: () => string;
  private readonly idFactory: (prefix: string) => string;

  constructor(options: SubstrateOptions = {}) {
    let counter = 0;

    this.now = options.now ?? (() => new Date().toISOString());
    this.idFactory =
      options.idFactory ??
      ((prefix) => {
        counter += 1;
        return `${prefix}_${counter}`;
      });
    this.state = createEmptyState();
  }

  static fromSnapshot(snapshot: SubstrateSnapshot, options: SubstrateOptions = {}) {
    const substrate = new Substrate(options);
    substrate.state.basis = mapById(snapshot.basis);
    substrate.state.observers = mapById(snapshot.observers);
    substrate.state.branches = mapById(snapshot.branches);
    substrate.state.segments = mapById(snapshot.segments);
    substrate.state.triggers = mapById(snapshot.triggers);
    substrate.state.happenings = mapById(snapshot.happenings);
    substrate.state.nuclei = mapById(snapshot.nuclei);
    substrate.state.inertiaModels = mapById(snapshot.inertiaModels);
    substrate.state.volatilityModels = mapById(snapshot.volatilityModels);
    substrate.state.referents = mapById(snapshot.referents);
    substrate.state.bindings = mapById(snapshot.bindings);
    substrate.state.contexts = mapById(snapshot.contexts);
    substrate.state.portals = mapById(snapshot.portals);
    substrate.state.views = mapById(snapshot.views);
    substrate.state.artifacts = mapById(snapshot.artifacts);
    substrate.state.comparisonSurfaces = mapById(snapshot.comparisonSurfaces);
    substrate.state.lineage = mapById(snapshot.lineage);
    substrate.state.stateEstimates = mapById(snapshot.stateEstimates);
    return substrate;
  }

  createBasis(input: Omit<BasisDescriptor, "id"> & { id?: string }): BasisDescriptor {
    const basis = compact<BasisDescriptor>({
      id: input.id ?? this.idFactory("basis"),
      label: input.label,
      dimensions: [...input.dimensions],
      partial: input.partial,
      compositional: input.compositional,
      degradedFrom: input.degradedFrom ? [...input.degradedFrom] : undefined,
      projectedFrom: input.projectedFrom ? [...input.projectedFrom] : undefined,
      revisedFrom: input.revisedFrom ? [...input.revisedFrom] : undefined,
      notes: input.notes,
    });
    this.state.basis.set(basis.id, basis);
    return basis;
  }

  createObserver(input: CreateObserverInput): Observer {
    this.requireBasis(input.basisId);

    const observer = compact<Observer>({
      id: this.idFactory("observer"),
      label: input.label,
      basisId: input.basisId,
      saliencePolicy: input.saliencePolicy,
      metadata: input.metadata,
    });
    this.state.observers.set(observer.id, observer);
    return observer;
  }

  createBranch(input: CreateBranchInput): Branch {
    this.requireBasis(input.basisId);
    if (input.observerId) {
      this.requireEntity(this.state.observers, input.observerId, "observer");
    }
    if (input.referentId) {
      this.requireEntity(this.state.referents, input.referentId, "referent");
    }
    if (input.contextId) {
      this.requireEntity(this.state.contexts, input.contextId, "context");
    }
    for (const parentBranchId of input.parentBranchIds ?? []) {
      this.requireEntity(this.state.branches, parentBranchId, "branch");
    }

    const branch = compact<Branch>({
      id: this.idFactory("branch"),
      role: input.role,
      label: input.label,
      basisId: input.basisId,
      observerId: input.observerId,
      referentId: input.referentId,
      contextId: input.contextId,
      parentBranchIds: [...(input.parentBranchIds ?? [])],
      metadata: input.metadata,
    });
    this.state.branches.set(branch.id, branch);
    return branch;
  }

  reviseBranchBasis(input: ReviseBranchBasisInput): Branch {
    const branch = this.requireEntity(this.state.branches, input.branchId, "branch");
    this.requireBasis(input.basisId);

    const revisedBranch = compact<Branch>({
      ...branch,
      basisId: input.basisId,
      metadata: compact({
        ...(branch.metadata ?? {}),
        ...(input.metadata ?? {}),
        basisRevision: {
          fromBasisId: branch.basisId,
          toBasisId: input.basisId,
          revisedAt: this.now(),
          reason: input.reason,
        },
      }),
    });
    this.state.branches.set(branch.id, revisedBranch);
    return revisedBranch;
  }

  openSegment(input: OpenSegmentInput): Segment {
    const branch = this.requireEntity(this.state.branches, input.branchId, "branch");
    if (branch.activeSegmentId) {
      throw new Error(`branch ${branch.id} already has an active segment`);
    }
    const segments = this.listSegmentsForBranch(branch.id);
    for (const nucleusId of input.inheritedNucleusIds ?? []) {
      this.requireEntity(this.state.nuclei, nucleusId, "nucleus");
    }

    const segment = compact<Segment>({
      id: this.idFactory("segment"),
      branchId: branch.id,
      index: segments.length,
      status: "wake",
      openedAt: this.now(),
      inheritedNucleusIds: [...(input.inheritedNucleusIds ?? [])],
      happeningIds: [],
      summary: input.summary,
      metadata: input.metadata,
    });

    this.state.segments.set(segment.id, segment);
    this.state.branches.set(branch.id, { ...branch, activeSegmentId: segment.id });
    return segment;
  }

  createTrigger(input: CreateTriggerInput): Trigger {
    if (input.basisId) {
      this.requireBasis(input.basisId);
    }

    const trigger = compact<Trigger>({
      id: this.idFactory("trigger"),
      label: input.label,
      threshold: input.threshold,
      observedAt: this.now(),
      basisId: input.basisId,
      inferred: input.inferred,
      metadata: input.metadata,
    });
    this.state.triggers.set(trigger.id, trigger);
    return trigger;
  }

  createHappening(input: CreateHappeningInput): Happening {
    const branch = this.requireEntity(this.state.branches, input.branchId, "branch");
    const segment = this.requireEntity(this.state.segments, input.segmentId, "segment");
    if (segment.branchId !== branch.id) {
      throw new Error(`segment ${segment.id} does not belong to branch ${branch.id}`);
    }
    for (const triggerId of input.triggerIds ?? []) {
      this.requireEntity(this.state.triggers, triggerId, "trigger");
    }

    const happening = compact<Happening>({
      id: this.idFactory("happening"),
      branchId: branch.id,
      segmentId: segment.id,
      label: input.label,
      triggerIds: [...(input.triggerIds ?? [])],
      salience: input.salience,
      observedAt: this.now(),
      summary: input.summary,
      metadata: input.metadata,
    });

    this.state.happenings.set(happening.id, happening);
    this.state.segments.set(segment.id, {
      ...segment,
      happeningIds: [...segment.happeningIds, happening.id],
    });
    return happening;
  }

  sealSegment(
    segmentId: string,
    options: { anchor: string; notes?: string; metadata?: Record<string, unknown> },
  ): CarryForwardPackage {
    const segment = this.requireEntity(this.state.segments, segmentId, "segment");
    if (segment.status === "sleep") {
      throw new Error(`segment ${segment.id} is already sealed`);
    }
    const branch = this.requireEntity(this.state.branches, segment.branchId, "branch");

    const closedSegment = compact<Segment>({
      ...segment,
      status: "sleep",
      closedAt: this.now(),
    });
    const nucleus = compact<Nucleus>({
      id: this.idFactory("nucleus"),
      branchId: branch.id,
      sourceSegmentId: segment.id,
      inheritedNucleusIds: [...segment.inheritedNucleusIds],
      anchor: options.anchor,
      notes: options.notes,
      metadata: options.metadata,
    });

    this.state.segments.set(closedSegment.id, closedSegment);
    this.state.nuclei.set(nucleus.id, nucleus);
    this.state.branches.set(branch.id, compact<Branch>({ ...branch, activeSegmentId: undefined }));

    return {
      branchId: branch.id,
      segmentId: closedSegment.id,
      nucleus,
    };
  }

  createInertiaModel(input: Omit<InertiaModel, "id"> & { id?: string }): InertiaModel {
    const model = compact<InertiaModel>({
      id: input.id ?? this.idFactory("inertia"),
      label: input.label,
      strategy: input.strategy,
      metadata: input.metadata,
    });
    this.state.inertiaModels.set(model.id, model);
    return model;
  }

  createVolatilityModel(
    input: Omit<VolatilityModel, "id"> & { id?: string },
  ): VolatilityModel {
    const model = compact<VolatilityModel>({
      id: input.id ?? this.idFactory("volatility"),
      label: input.label,
      expectedRate: input.expectedRate,
      metadata: input.metadata,
    });
    this.state.volatilityModels.set(model.id, model);
    return model;
  }

  createReferent(input: CreateReferentInput): Referent {
    const branch = this.requireEntity(this.state.branches, input.branchId, "branch");
    if (branch.role !== "referent") {
      throw new Error(`branch ${branch.id} must have role "referent" to back a referent`);
    }
    if (input.nucleusId) {
      this.requireEntity(this.state.nuclei, input.nucleusId, "nucleus");
    }
    if (input.inertiaModelId) {
      this.requireEntity(this.state.inertiaModels, input.inertiaModelId, "inertia model");
    }
    if (input.volatilityModelId) {
      this.requireEntity(this.state.volatilityModels, input.volatilityModelId, "volatility model");
    }

    const referent = compact<Referent>({
      id: this.idFactory("referent"),
      label: input.label,
      anchor: input.anchor,
      branchId: branch.id,
      nucleusId: input.nucleusId,
      inertiaModelId: input.inertiaModelId,
      volatilityModelId: input.volatilityModelId,
      metadata: input.metadata,
    });

    this.state.referents.set(referent.id, referent);
    this.state.branches.set(branch.id, { ...branch, referentId: referent.id });
    return referent;
  }

  createBinding(input: CreateBindingInput): Binding {
    const observerBranch = this.requireEntity(
      this.state.branches,
      input.observerBranchId,
      "observer branch",
    );
    const referentBranch = this.requireEntity(
      this.state.branches,
      input.referentBranchId,
      "referent branch",
    );
    this.requireEntity(this.state.referents, input.referentId, "referent");
    if (observerBranch.role !== "observer") {
      throw new Error(`branch ${observerBranch.id} is not an observer branch`);
    }
    if (referentBranch.role !== "referent") {
      throw new Error(`branch ${referentBranch.id} is not a referent branch`);
    }
    if (input.contextId) {
      this.requireEntity(this.state.contexts, input.contextId, "context");
    }

    const binding = compact<Binding>({
      id: this.idFactory("binding"),
      kind: input.kind,
      observerBranchId: observerBranch.id,
      referentBranchId: referentBranch.id,
      referentId: input.referentId,
      contextId: input.contextId,
      strength: input.strength,
      metadata: input.metadata,
    });
    this.state.bindings.set(binding.id, binding);
    return binding;
  }

  createContext(input: CreateContextInput): Context {
    const branch = this.requireEntity(this.state.branches, input.branchId, "branch");
    if (branch.role !== "context") {
      throw new Error(`branch ${branch.id} must have role "context"`);
    }
    if (input.parentContextId) {
      this.requireEntity(this.state.contexts, input.parentContextId, "context");
    }

    const context = compact<Context>({
      id: this.idFactory("context"),
      branchId: branch.id,
      label: input.label,
      parentContextId: input.parentContextId,
      containmentPolicy: input.containmentPolicy,
      metadata: input.metadata,
    });
    this.state.contexts.set(context.id, context);
    this.state.branches.set(branch.id, { ...branch, contextId: context.id });
    return context;
  }

  createPortal(input: CreatePortalInput): Portal {
    const branch = this.requireEntity(this.state.branches, input.branchId, "branch");
    if (branch.role !== "portal") {
      throw new Error(`branch ${branch.id} must have role "portal"`);
    }
    this.requireEntity(this.state.contexts, input.sourceContextId, "context");
    this.requireEntity(this.state.contexts, input.targetContextId, "context");

    const portal = compact<Portal>({
      id: this.idFactory("portal"),
      branchId: branch.id,
      label: input.label,
      sourceContextId: input.sourceContextId,
      targetContextId: input.targetContextId,
      exposureRule: input.exposureRule,
      transform: input.transform,
      metadata: input.metadata,
    });
    this.state.portals.set(portal.id, portal);
    return portal;
  }

  createView(input: CreateViewInput): View {
    const view = compact<View>({
      id: this.idFactory("view"),
      kind: input.kind,
      label: input.label,
      sourceIds: [...input.sourceIds],
      projection: input.projection,
      replaceable: true,
      metadata: input.metadata,
    });
    this.state.views.set(view.id, view);
    return view;
  }

  createArtifactEnvelope(input: CreateArtifactEnvelopeInput): ArtifactEnvelope {
    this.requireKnownIds(input.sourceIds, "artifact source");
    this.requireKnownIds(input.payloadIds ?? [], "artifact payload");
    if (input.provenance.basisId) {
      this.requireBasis(input.provenance.basisId);
    }
    if (input.provenance.emitterId) {
      this.requireKnownId(input.provenance.emitterId, "artifact emitter");
    }

    const artifact = compact<ArtifactEnvelope>({
      id: this.idFactory("artifact"),
      kind: input.kind,
      label: input.label,
      sourceIds: [...input.sourceIds],
      payloadIds: [...(input.payloadIds ?? [])],
      locality: input.locality ?? "shared-candidate",
      provenance: compact({
        emittedAt: input.provenance.emittedAt ?? this.now(),
        basisId: input.provenance.basisId,
        emitterId: input.provenance.emitterId,
        source: input.provenance.source,
        note: input.provenance.note,
      }),
      metadata: input.metadata,
    });
    this.state.artifacts.set(artifact.id, artifact);
    return artifact;
  }

  createComparisonSurface(input: CreateComparisonSurfaceInput): ComparisonSurface {
    this.requireKnownIds(input.sourceIds, "comparison surface source");
    this.requireKnownIds(input.evidenceSourceIds, "comparison surface evidence");
    if (input.basisId) {
      this.requireBasis(input.basisId);
    }
    if (input.reasonCodes.length === 0) {
      throw new Error("comparison surface reasonCodes must not be empty");
    }

    const surface = compact<ComparisonSurface>({
      id: this.idFactory("comparison"),
      label: input.label,
      sourceIds: [...input.sourceIds],
      basisId: input.basisId,
      projection: input.projection,
      comparability: input.comparability,
      compatibility: input.compatibility,
      equivalence: input.equivalence,
      convergence: input.convergence,
      reasonCodes: [...input.reasonCodes],
      evidenceSourceIds: [...input.evidenceSourceIds],
      summary: input.summary,
      metadata: input.metadata,
    });
    this.state.comparisonSurfaces.set(surface.id, surface);
    return surface;
  }

  createLineageEdge(input: CreateLineageInput): LineageEdge {
    const edge = compact<LineageEdge>({
      id: this.idFactory("lineage"),
      relation: input.relation,
      fromId: input.fromId,
      toId: input.toId,
      basisId: input.basisId,
      evidence: input.evidence,
      metadata: input.metadata,
    });
    this.state.lineage.set(edge.id, edge);
    return edge;
  }

  createStateEstimate(input: CreateStateEstimateInput): StateEstimate {
    this.requireEntity(this.state.referents, input.referentId, "referent");
    this.requireEntity(this.state.branches, input.branchId, "branch");
    for (const bindingId of input.basedOnBindingIds ?? []) {
      this.requireEntity(this.state.bindings, bindingId, "binding");
    }
    if (input.inertiaModelId) {
      this.requireEntity(this.state.inertiaModels, input.inertiaModelId, "inertia model");
    }
    if (input.volatilityModelId) {
      this.requireEntity(this.state.volatilityModels, input.volatilityModelId, "volatility model");
    }

    const estimate = compact<StateEstimate>({
      id: this.idFactory("estimate"),
      referentId: input.referentId,
      branchId: input.branchId,
      estimatedAt: this.now(),
      continuity: input.continuity,
      reasoning: input.reasoning,
      basedOnBindingIds: [...(input.basedOnBindingIds ?? [])],
      inertiaModelId: input.inertiaModelId,
      volatilityModelId: input.volatilityModelId,
      metadata: input.metadata,
    });
    this.state.stateEstimates.set(estimate.id, estimate);
    return estimate;
  }

  forkBranch(input: ForkBranchInput) {
    const sourceBranch = this.requireEntity(this.state.branches, input.sourceBranchId, "branch");
    if (input.basisId) {
      this.requireBasis(input.basisId);
    }
    const branch = this.createBranch(compact<CreateBranchInput>({
      role: input.role ?? sourceBranch.role,
      label: input.label,
      basisId: input.basisId ?? sourceBranch.basisId,
      observerId: input.observerId ?? sourceBranch.observerId,
      referentId: input.referentId ?? sourceBranch.referentId,
      contextId: input.contextId ?? sourceBranch.contextId,
      parentBranchIds: [sourceBranch.id],
      metadata: input.metadata,
    }));
    const lineage = this.createLineageEdge(compact<CreateLineageInput>({
      relation: input.relation ?? "split",
      fromId: sourceBranch.id,
      toId: branch.id,
      basisId: branch.basisId,
      evidence: input.lineageEvidence,
    }));
    return { branch, lineage };
  }

  createMergeSuccessor(input: CreateMergeSuccessorInput) {
    this.requireBasis(input.basisId);
    for (const sourceBranchId of input.sourceBranchIds) {
      this.requireEntity(this.state.branches, sourceBranchId, "branch");
    }
    for (const nucleusId of input.inheritedNucleusIds ?? []) {
      this.requireEntity(this.state.nuclei, nucleusId, "nucleus");
    }

    const branch = this.createBranch(compact<CreateBranchInput>({
      role: input.role,
      label: input.label,
      basisId: input.basisId,
      parentBranchIds: [...input.sourceBranchIds],
      metadata: input.metadata,
    }));
    const segment = this.openSegment(compact<OpenSegmentInput>({
      branchId: branch.id,
      inheritedNucleusIds: input.inheritedNucleusIds,
      summary: input.summary,
      metadata: input.segmentMetadata,
    }));
    const lineage = input.sourceBranchIds.map((sourceBranchId) =>
      this.createLineageEdge({
        relation: input.relation ?? "merge",
        fromId: sourceBranchId,
        toId: branch.id,
        basisId: input.basisId,
      }),
    );
    return { branch, segment, lineage };
  }

  materializeBranchTimeline(branchId: string) {
    const branch = this.requireEntity(this.state.branches, branchId, "branch");
    const segments = this.listSegmentsForBranch(branch.id);
    return {
      branch,
      segments: segments.map((segment) => ({
        ...segment,
        happenings: segment.happeningIds
          .map((happeningId) => this.state.happenings.get(happeningId))
          .filter((value): value is Happening => Boolean(value)),
      })),
    };
  }

  listSegmentsForBranch(branchId: string): Segment[] {
    return [...this.state.segments.values()]
      .filter((segment) => segment.branchId === branchId)
      .sort((left, right) => left.index - right.index);
  }

  snapshot(): SubstrateSnapshot {
    return {
      basis: [...this.state.basis.values()],
      observers: [...this.state.observers.values()],
      branches: [...this.state.branches.values()],
      segments: [...this.state.segments.values()],
      triggers: [...this.state.triggers.values()],
      happenings: [...this.state.happenings.values()],
      nuclei: [...this.state.nuclei.values()],
      inertiaModels: [...this.state.inertiaModels.values()],
      volatilityModels: [...this.state.volatilityModels.values()],
      referents: [...this.state.referents.values()],
      bindings: [...this.state.bindings.values()],
      contexts: [...this.state.contexts.values()],
      portals: [...this.state.portals.values()],
      views: [...this.state.views.values()],
      artifacts: [...this.state.artifacts.values()],
      comparisonSurfaces: [...this.state.comparisonSurfaces.values()],
      lineage: [...this.state.lineage.values()],
      stateEstimates: [...this.state.stateEstimates.values()],
    };
  }

  private requireBasis(basisId: string): BasisDescriptor {
    return this.requireEntity(this.state.basis, basisId, "basis");
  }

  private requireKnownIds(ids: string[], kind: string) {
    for (const id of ids) {
      this.requireKnownId(id, kind);
    }
  }

  private requireKnownId(id: string, kind: string) {
    if (!this.hasKnownId(id)) {
      throw new Error(`unknown ${kind}: ${id}`);
    }
  }

  private hasKnownId(id: string) {
    return (
      this.state.basis.has(id) ||
      this.state.observers.has(id) ||
      this.state.branches.has(id) ||
      this.state.segments.has(id) ||
      this.state.triggers.has(id) ||
      this.state.happenings.has(id) ||
      this.state.nuclei.has(id) ||
      this.state.inertiaModels.has(id) ||
      this.state.volatilityModels.has(id) ||
      this.state.referents.has(id) ||
      this.state.bindings.has(id) ||
      this.state.contexts.has(id) ||
      this.state.portals.has(id) ||
      this.state.views.has(id) ||
      this.state.artifacts.has(id) ||
      this.state.comparisonSurfaces.has(id) ||
      this.state.lineage.has(id) ||
      this.state.stateEstimates.has(id)
    );
  }

  private requireEntity<T>(map: Map<string, T>, id: string, kind: string): T {
    const value = map.get(id);
    if (!value) {
      throw new Error(`unknown ${kind}: ${id}`);
    }
    return value;
  }
}

function createEmptyState(): SubstrateState {
  return {
    basis: new Map(),
    observers: new Map(),
    branches: new Map(),
    segments: new Map(),
    triggers: new Map(),
    happenings: new Map(),
    nuclei: new Map(),
    inertiaModels: new Map(),
    volatilityModels: new Map(),
    referents: new Map(),
    bindings: new Map(),
    contexts: new Map(),
    portals: new Map(),
    views: new Map(),
    artifacts: new Map(),
    comparisonSurfaces: new Map(),
    lineage: new Map(),
    stateEstimates: new Map(),
  };
}

function compact<T extends object>(value: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

function mapById<T extends { id: string }>(values: T[]) {
  return new Map(values.map((value) => [value.id, value]));
}
