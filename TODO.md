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

- [ ] write focused doctrine for:
  - [ ] `Seed`
  - [ ] `Seat`
  - [ ] `Adoption`
  - [ ] `Cultivation`
  - [ ] `Materialization`
  - [ ] `Custody`
- [ ] make explicit that normal emergence should not require injection
- [ ] make explicit that observer emergence and non-observer emergence are related but not identical

Done when:
- [ ] the repo can explain how a non-observer like a ball emerges without magical appearance
- [ ] the repo can explain how an observer takes a seat or grows from a prepared continuity
- [ ] the repo can explain why multi-writer is not required for normal emergence

### Phase 2: Observer / Referent Pressure Labs

- [ ] implement a mutual observer / mediated self-access lab
  - [ ] two cameras facing each other
  - [ ] each is both observer and referent
  - [ ] externally sourced self-view remains artifact, not source continuity
- [ ] implement a shared ball / co-observed non-observer lab
  - [ ] two cameras both observe a ball
  - [ ] the ball materializes through tracked history rather than magical appearance
  - [ ] no observer owns the ball
- [ ] implement an orthogonal cameras / divergent ball interpretation lab
  - [ ] cameras do not observe each other
  - [ ] both observe the same ball differently
  - [ ] co-reference remains basis-limited and does not force consensus

Done when:
- [ ] observer/referent overlap works cleanly
- [ ] non-observer materialization works without hand-waving
- [ ] divergence around a shared candidate referent is representable without collapse

### Phase 3: Inertia / Volatility Doctrine

- [ ] move `inertia` beyond a named hook and minimal interpretive concept
- [ ] define stronger doctrine for continuity under absence
- [ ] define stronger doctrine for absence vs contradiction
- [ ] define how inertia and volatility pressure `continuing / ambiguous / broken`
- [ ] pressure inertia with the camera/ball loss-of-sight cases

Done when:
- [ ] continuity under absence is explainable without naive persistence
- [ ] contradiction pressure is distinct from mere non-observation
- [ ] inertia is operational enough for future labs

### Phase 4: Schema Discipline

- [ ] harden the Corestore record model fully
  - [x] stabilize branch happening records
  - [x] stabilize sleep capsule records
  - [x] stabilize referent state estimate records
  - [x] stabilize exchange artifact records
- [ ] decide whether JSON remains sufficient or stricter schema validation is needed
- [ ] formalize artifact envelopes for Corestore-backed emission
- [ ] make append-time validation explicit and complete
- [ ] make read-time validation explicit and complete
- [ ] document schema evolution posture for `v1` to future `v2`

Done when:
- [ ] persisted records are strictly validated
- [ ] `v1` is clearly documented
- [ ] schema can evolve without pretending the current format is final

### Phase 5: Corestore Model Refinement

- [x] keep serious substrate work on Corestore/Hypercore only
- [x] avoid Hyperbee unless concrete lookup or registry pressure appears
- [x] treat known-core access and stream replay as the default posture
- [ ] improve replay and reconstruction ergonomics if needed
- [ ] continue proving known-core replay before introducing index layers

Done when:
- [ ] replay remains tractable at current scale
- [ ] reconstruction is good enough for consumers without hidden indexing assumptions

### Phase 6: Adjacent Boundary Documentation

- [ ] document the boundary with `Virtualia`
- [ ] document the boundary with `mesh-ecology-edge`
- [ ] document the boundary with mesh integration generally
- [ ] state clearly what pressure adjacent repos contribute
- [ ] state clearly what assumptions are not imported into this repo

Done when:
- [ ] it is clear what `causal-substrate` owns
- [ ] it is clear what adjacent repos must continue to own themselves

### Phase 7: Consumer Adoption Surface

- [ ] write a consumer guide
- [ ] add example adoption patterns for at least two adjacent repo types
- [ ] document anti-patterns for misuse
- [ ] make the integration seam teachable without forcing app-specific assumptions into core doctrine

Done when:
- [ ] an adjacent repo can adopt the substrate without guessing the boundary

### Phase 8: Multi-Writer Boundary Clarification

- [x] establish doctrine that multi-writer is not required by default
- [x] establish doctrine that writerhood is optional and surface-specific
- [x] establish doctrine that injection is exceptional and policy-bearing
- [ ] document exactly where multi-writer may still be justified
  - [ ] shared artifact surfaces
  - [ ] shared coordination surfaces
  - [ ] explicitly injectible branches or contexts
- [ ] document exactly what should remain single-writer or custody-bound

Done when:
- [ ] the line between continuity-bearing branches and shared coordination surfaces is explicit

### Phase 9: Optional Multi-Writer / Autobase Exploration

- [ ] only proceed if later pressure still justifies it
- [ ] keep any first use to shared artifact or shared coordination surfaces
- [ ] do not use it first for core continuity-bearing histories
- [ ] revisit optimistic writing only in provisional/shared-claim lanes

Done when:
- [ ] either a narrow multi-writer pattern is proven
- [ ] or it is clearly deferred as not needed

### Phase 10: Finish-Line Consolidation

- [ ] compress doctrine into a teachable stable posture
- [ ] stabilize schema docs
- [ ] stabilize implementation docs
- [ ] mark what is settled, what is open, and what is intentionally deferred

Done when:
- [ ] the repo is stable enough to teach
- [ ] adjacent repos can adopt it
- [ ] unresolved questions are explicit rather than accidental

## Deferred / Pressure-Gated Work

- [ ] make the Hyperbee decision only after Corestore-only pressure is demonstrated
  - [ ] branch id -> core references
  - [ ] referent id -> anchor references
  - [ ] context id -> member references
  - [ ] named artifact lookup
  - [ ] concern indexing
- [ ] extend replication beyond the current single-writer proof
- [ ] NoiseSecretStream majority experiments
- [ ] deeper `fakeswarm`-based swarm testing
- [ ] transport concerns
- [ ] Autobase or higher-order shared surfaces

## Rules

- never reopen the same Corestore root independently in-process
- always close namespaced sessions and managed roots correctly
- use deterministic namespaces for concern-grouped Hypercores
- keep source continuity local by default
- make shared artifacts explicit
- keep views derived and replaceable
- do not let indexing layers replace continuity-bearing Hypercores as the primary substrate
- do not require multi-writer support in short-term implementation work
