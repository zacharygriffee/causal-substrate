# TODO

## Current Posture

- preserve ontology and working defaults first
- keep the in-memory kernel small and doctrine-oriented
- treat Corestore/Hypercore as the first real substrate for meaningful labs
- add Hyperbee only when lookup, registry, or indexing pressure is real
- do not treat the in-memory layer as proof of the full substrate
- do not require multi-writer support for normal continuity work
- treat writerhood and injection as optional, policy-bearing capabilities

## Completed Foundation

- [x] ontology docs and doctrine floor
- [x] hole analysis and doctrine notes through view boundary
- [x] working defaults for current labs
- [x] initial 10-lab local program
- [x] post-lab synthesis and next-phase docs
- [x] local prototype and filesystem backend exploration
- [x] Corestore/Hypercore implementation posture document
- [x] verify latest `corestore` version and pin it
- [x] add managed Corestore backend with deterministic namespaces
- [x] avoid duplicate in-process Corestore root opens per storage path
- [x] ensure namespaced sessions and managed roots close cleanly
- [x] add first serious working core split
  - [x] `branch-happenings`
  - [x] `segments`
  - [x] `referent-state`
  - [x] `exchange-artifacts`
- [x] add proof tests for managed Corestore behavior
  - [x] deterministic namespace reuse
  - [x] append/read across planned cores
  - [x] clean close and reopen without residual lock behavior in test path
- [x] define the first serious Corestore lab record schema
- [x] build a first serious Corestore lab adapter on top of the managed backend
- [x] implement the first real Corestore lab
- [x] prove append-only ordering, continuity/artifact separation, and clean reopen
- [x] consolidate the Corestore-only path
- [x] stabilize the current `v1` record classes enough for replay and replication
- [x] implement multi-segment continuity, referent history, exchange artifact, and reconstruction labs
- [x] prove two-Corestore replication over Hypercore using `fakeswarm`

## Finish-Line Phases

### Phase 1: Emergence Doctrine

- [x] write focused doctrine for:
  - [x] `Seed`
  - [x] `Seat`
  - [x] `Adoption`
  - [x] `Cultivation`
  - [x] `Materialization`
  - [x] `Custody`
- [x] make explicit that normal emergence should not require injection
- [x] make explicit that observer emergence and non-observer emergence are related but not identical

Done when:
- [x] the repo can explain how a non-observer like a ball emerges without magical appearance
- [x] the repo can explain how an observer takes a seat or grows from a prepared continuity
- [x] the repo can explain why multi-writer is not required for normal emergence

### Phase 2: Observer / Referent Pressure Labs

- [x] implement a mutual observer / mediated self-access lab
  - [x] two cameras facing each other
  - [x] each is both observer and referent
  - [x] externally sourced self-view remains artifact, not source continuity
- [x] implement a shared ball / co-observed non-observer lab
  - [x] two cameras both observe a ball
  - [x] the ball materializes through tracked history rather than magical appearance
  - [x] no observer owns the ball
- [x] implement an orthogonal cameras / divergent ball interpretation lab
  - [x] cameras do not observe each other
  - [x] both observe the same ball differently
  - [x] co-reference remains basis-limited and does not force consensus

Done when:
- [x] observer/referent overlap works cleanly
- [x] non-observer materialization works without hand-waving
- [x] divergence around a shared candidate referent is representable without collapse

### Phase 3: Inertia / Volatility Doctrine

- [x] move `inertia` beyond a named hook and minimal interpretive concept
- [x] define stronger doctrine for continuity under absence
- [x] define stronger doctrine for absence vs contradiction
- [x] define how inertia and volatility pressure `continuing / ambiguous / broken`
- [x] pressure inertia with the camera/ball loss-of-sight cases

Done when:
- [x] continuity under absence is explainable without naive persistence
- [x] contradiction pressure is distinct from mere non-observation
- [x] inertia is operational enough for future labs

### Phase 4: Schema Discipline

- [x] harden the Corestore record model fully
  - [x] stabilize branch happening records
  - [x] stabilize sleep capsule records
  - [x] stabilize referent state estimate records
  - [x] stabilize exchange artifact records
- [x] decide whether JSON remains sufficient or stricter schema validation is needed
- [x] formalize artifact envelopes for Corestore-backed emission
- [x] make append-time validation explicit and complete
- [x] make read-time validation explicit and complete
- [x] document schema evolution posture for `v1` to future `v2`

Done when:
- [x] persisted records are strictly validated
- [x] `v1` is clearly documented
- [x] schema can evolve without pretending the current format is final

### Phase 5: Corestore Model Refinement

- [x] keep serious substrate work on Corestore/Hypercore only
- [x] avoid Hyperbee unless concrete lookup or registry pressure appears
- [x] treat known-core access and stream replay as the default posture
- [x] improve replay and reconstruction ergonomics if needed
- [x] continue proving known-core replay before introducing index layers

Done when:
- [x] replay remains tractable at current scale
- [x] reconstruction is good enough for consumers without hidden indexing assumptions

### Phase 6: Adjacent Boundary Documentation

- [x] document the boundary with `Virtualia`
- [x] document the boundary with `mesh-ecology-edge`
- [x] document the boundary with mesh integration generally
- [x] state clearly what pressure adjacent repos contribute
- [x] state clearly what assumptions are not imported into this repo

Done when:
- [x] it is clear what `causal-substrate` owns
- [x] it is clear what adjacent repos must continue to own themselves

### Phase 7: Consumer Adoption Surface

- [x] write a consumer guide
- [x] add example adoption patterns for at least two adjacent repo types
- [x] document anti-patterns for misuse
- [x] make the integration seam teachable without forcing app-specific assumptions into core doctrine

Done when:
- [x] an adjacent repo can adopt the substrate without guessing the boundary

### Phase 8: Multi-Writer Boundary Clarification

- [x] establish doctrine that multi-writer is not required by default
- [x] establish doctrine that writerhood is optional and surface-specific
- [x] establish doctrine that injection is exceptional and policy-bearing
- [x] document exactly where multi-writer may still be justified
  - [x] shared artifact surfaces
  - [x] shared coordination surfaces
  - [x] explicitly injectible branches or contexts
- [x] document exactly what should remain single-writer or custody-bound

Done when:
- [x] the line between continuity-bearing branches and shared coordination surfaces is explicit

### Phase 9: Optional Multi-Writer / Autobase Exploration

- [x] only proceed if later pressure still justifies it
- [x] keep any first use to shared artifact or shared coordination surfaces
- [x] do not use it first for core continuity-bearing histories
- [x] revisit optimistic writing only in provisional/shared-claim lanes

Done when:
- [ ] either a narrow multi-writer pattern is proven
- [x] or it is clearly deferred as not needed

### Phase 10: Finish-Line Consolidation

- [x] compress doctrine into a teachable stable posture
- [x] stabilize schema docs
- [x] stabilize implementation docs
- [x] mark what is settled, what is open, and what is intentionally deferred

Done when:
- [x] the repo is stable enough to teach
- [x] adjacent repos can adopt it
- [x] unresolved questions are explicit rather than accidental

## Deferred / Pressure-Gated Work

- [ ] make the Hyperbee decision only after Corestore-only pressure is demonstrated
  - [ ] branch id -> core references
  - [ ] referent id -> anchor references
  - [ ] context id -> member references
  - [ ] named artifact lookup
  - [ ] concern indexing
- [x] extend replication beyond the current single-writer proof
- [ ] NoiseSecretStream majority experiments
- [x] deeper `fakeswarm`-based swarm testing
- [ ] transport concerns
- [ ] Autobase or higher-order shared surfaces
- [x] add an explicit branch capability evolution lab
  - [x] model basis degradation or gain within one continuing branch
  - [x] prove continuity can survive capability change without forced fork
  - [x] prove downstream referent judgments can weaken under revised basis
  - [x] identify where capability change becomes lineage pressure instead
- [x] add an explicit persisted branch birth / fork lab
  - [x] prove a successor branch can inherit prior history up to a fork point
  - [x] prove divergence after fork without collapsing shared ancestry
  - [x] prove carry-forward nucleus or inherited package at branch birth
  - [x] distinguish fork, birth from prepared continuity, and sibling emergence where useful

## Next Phases

### Phase 11: Compact Inspectability Surface

- [x] build one compact replay-backed continuity situation surface
- [x] keep it consumer-agnostic and substrate-native
- [x] derive it from persisted records rather than ephemeral process state
- [x] include the minimal bounded fields needed for inspection
  - [x] `primaryBranchId`
  - [x] `primaryContextId`
  - [x] `portalVisibleContextIds`
  - [x] `activeReferentIds`
  - [x] `continuityState`
  - [x] `ambiguityState`
  - [x] `reasonCodes`
  - [x] `evidenceSourceIds`

Done when:
- [x] the surface is derivable from persisted records
- [x] it remains consumer-agnostic
- [x] it does not replace underlying history

### Phase 12: Transition Decision Surfaces

- [x] add a compact transition decision surface over continuity changes
- [x] classify transitions without importing app-specific policy
  - [x] `stay`
  - [x] `branch`
  - [x] `cross-context`
  - [x] `ambiguous`
- [x] emit bounded reasons and evidence ids for each decision
- [x] preserve the doctrine that bounded explanation is required but full internal heuristic exposure is not

Done when:
- [x] a consumer can inspect why a transition was emitted
- [x] explanations are compact and replayable
- [x] no requirement exists to expose every internal heuristic

### Phase 13: Inspectability Labs

- [x] add a same-branch same-context continuation lab
- [x] add a new-branch opening lab
- [x] add a portal-visible cross-context interpretation lab
- [x] add an unresolved ambiguous placement lab
- [x] add a shared referent active-across-context-shift lab

Done when:
- [x] each lab emits a compact inspectability surface
- [x] each lab proves the surface matches persisted history
- [x] tests show no hidden dependency on in-memory-only state

### Phase 14: Context / Portal Temporal Replay

- [x] strengthen replay for context transition history over time
- [x] strengthen replay for portal exposure history over time
- [x] define current primary context resolution across segment boundaries
- [x] preserve ambiguity without forcing multi-primary context

Done when:
- [x] context and portal claims replay as a time-ordered story
- [x] current context is explainable from records alone
- [x] ambiguity remains first-class

### Phase 15: Inertia-Aware Referent Continuity

- [x] add a referent absent but plausibly continuing lab
- [x] add a referent absent under high volatility lab
- [x] add a reappearance under degraded basis lab
- [x] add a conflicting multi-observer persistence judgment lab
- [x] add a co-observed non-observer with diverging persistence judgment lab

Done when:
- [x] `continuing / ambiguous / broken` is pressure-tested under multi-observer conditions
- [x] reasoning remains inspectable without pretending global identity is solved

### Phase 16: Schema Evolution Posture

- [x] keep versioned schema envelopes explicit
- [x] tighten record encodings where that improves interoperability
- [x] define more sharply what belongs in durable records vs derived views
- [x] document the threshold for introducing stricter encodings beyond the current `v1` posture

Done when:
- [x] schemas are stricter where they help interoperability
- [x] versioning remains open-ended
- [x] doctrine is not prematurely locked

### Phase 17: Multi-Observer Replication Interpretation

- [x] reproduce compact inspectability surfaces on replicated stores
- [x] prove a receiving observer can reconstruct branch, referent, and continuity situation surfaces
- [x] verify provenance survives exchange for inspectability purposes
- [x] note any concrete lookup pressure that suggests indexing, without introducing Hyperbee yet

Done when:
- [x] replicated stores reproduce bounded interpretation surfaces
- [x] provenance remains explicit
- [x] any Hyperbee pressure is concrete rather than speculative

### Phase 18: Hyperbee Decision Gate

- [x] decide on Hyperbee only after the above pressures are tested
- [x] evaluate branch lookup pressure
- [x] evaluate referent lookup pressure
- [x] evaluate context membership lookup pressure
- [x] evaluate artifact discovery pressure
- [x] evaluate concern indexing pressure

Done when:
- [x] the exact lookup pressure Hyperbee would solve is named
- [x] or Hyperbee is explicitly deferred again

## Rules

- never reopen the same Corestore root independently in-process
- always close namespaced sessions and managed roots correctly
- use deterministic namespaces for concern-grouped Hypercores
- keep source continuity local by default
- make shared artifacts explicit
- keep views derived and replaceable
- do not let indexing layers replace continuity-bearing Hypercores as the primary substrate
- do not require multi-writer support in short-term implementation work
