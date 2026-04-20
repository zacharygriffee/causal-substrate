# Doctrine Holes

This document records the main logical pressure points in the current doctrine and the recommended way to approach each one without narrowing the ontology too early.

The goal is not to fully resolve every hole now. The goal is to make each hole explicit, bound the risk it introduces, and state the next doctrinal move clearly enough that implementation does not drift.

## 1. Observer vs Branch Anchoring

### Current risk

The repository says the observer is primary, but also that observer alone is insufficient to define a branch. Without a clearer rule, `Observer` and `Branch` can collapse into two names for the same thing or drift into unrelated structures.

### Recommended approach

Treat `Observer` as the enduring locus of distinction-preserving capacity.

Treat `Branch` as a continuity instance anchored by:

- an observer or observer-like anchor
- a basis
- a situated continuity condition

Minimal doctrine:

- observer is necessary for observer-scoped continuity
- observer alone is not sufficient for branch identity
- a branch expresses a specific continuity of preserved distinctions, not the observer in general

### Deferred questions

- Can non-observer-anchored branches exist in a first-class way?
- What exact conditions produce a new branch versus continuation of an existing one?
- How should composite or shared branches be anchored?

## 2. Nucleus vs Lineage

### Current risk

Both concepts carry continuity across change. Without a sharper boundary, inheritance and ancestry will blur and later code will use whichever term feels convenient.

### Recommended approach

Treat `Nucleus` as operational inheritance.

Treat `Lineage` as descriptive ancestry relation.

Minimal doctrine:

- nucleus is the carry-forward core made available to successor continuity
- lineage records how continuities or segments stand in ancestry relation
- a successor may inherit a nucleus without lineage exhausting what that inheritance means

### Deferred questions

- Can multiple nuclei combine into one successor continuity?
- Can lineage exist without shared nucleus?
- How much of nucleus is structural versus interpretive?

## 3. Referent Persistence Criteria

### Current risk

The repository wants to avoid forced identity, but still needs a doctrine for when tracking continues, weakens, or becomes ambiguous. Without that, referent continuity will become arbitrary.

### Recommended approach

Do not solve identity globally. Introduce a minimal persistence doctrine based on plausibility under current basis and evidence.

Minimal doctrine:

- referent tracking may continue when continuity remains plausible under available basis
- persistence judgments should consider inertia, volatility, and observed evidence
- ambiguity should be representable directly rather than forcing continue/break decisions

Recommended next step:

Add a doctrinal state such as:

- continuing
- ambiguous
- broken

### Deferred questions

- What evidence thresholds move a referent between those states?
- How should re-identification confidence be expressed?
- When should ambiguity fork into multiple candidate continuities?

## 4. Effective Basis Composition and Degradation

### Current risk

Basis is first-class, but the repository does not yet say how a branch, view, or projection gets its effective basis when source bases differ or degrade. Without that, comparison and projection will be under-specified.

### Recommended approach

Introduce `effective basis` as the working basis actually available to a continuity, projection, or comparison.

Minimal doctrine:

- effective basis may be declared or computed
- effective basis may be narrower than source basis
- effective basis must never silently become wider than the distinctions actually preserved or projected
- degradation, projection, and composition should remain explicit

### Deferred questions

- When should effective basis be computed versus authored?
- How should incompatible bases interact?
- What is the minimal algebra needed for basis composition?

## 5. Trigger, Salience, and Happening Transition

### Current risk

The concepts are named separately, but the operational transition is still vague. Without clearer doctrine, triggers will collapse into happenings or salience will become a generic importance label.

### Recommended approach

Treat them as stages, not synonyms.

Minimal doctrine:

- trigger is threshold crossing
- salience is observer-relative weighting of significance
- happening is a clustered or keyed historical registration

Recommended flow:

1. something crosses a threshold and becomes a trigger
2. an observer or policy weights that trigger by salience
3. one or more triggers may be consolidated into a happening when doctrine or policy warrants preservation at that level

### Deferred questions

- Can happenings exist without explicit trigger records?
- Can salience be revised after a happening is created?
- What minimum rule decides when clustering occurs?

## 6. Context Containment Semantics

### Current risk

The repository says contexts contain and situate, but does not yet define what containment changes structurally. Without that, context becomes descriptive metadata.

### Recommended approach

Define containment in terms of practical effects on situated continuities.

Minimal doctrine:

- context influences situatedness
- context affects access and exposure
- context may affect continuity interpretation
- context membership is not just a label; it changes what can be encountered, inherited, or exposed

Recommended next step:

Specify the minimum effects containment has on:

- observer placement
- referent placement
- portal exposure
- continuity interpretation across boundaries

### Deferred questions

- Can a continuity be simultaneously situated in multiple contexts?
- What counts as leaving or entering a context?
- How do nested contexts affect effective basis or salience?

## 7. Minimal Portal Contract

### Current risk

Portals are load-bearing, but the contract is still open enough that they could collapse into generic projection, duplication, or child object semantics.

### Recommended approach

Define the smallest standard portal contract and refuse to imply more than that.

Minimal doctrine:

- a portal names a source context
- a portal names a target context
- a portal specifies an exposure rule
- a portal may specify a transform

Additional rule:

- a portal exposes constrained projection, not full context identity transfer

### Deferred questions

- Should portals be directional by default?
- Can portals be composed?
- What guarantees, if any, does a portal make about temporal continuity across contexts?

## 8. Inertia, Volatility, and Negative Evidence

### Current risk

The repo correctly resists naive absence logic, but does not yet provide a minimal doctrine for interpreting non-observation, silence, or resumed observation. Without that, continuity judgments will drift.

### Recommended approach

Make negative evidence explicitly interpretive.

Minimal doctrine:

- non-observation is not automatically breakage
- absence matters only relative to expected persistence and expected environmental change
- resumed observation should not be treated as proof of uninterrupted continuity without interpretive support

Recommended next step:

Express continuity judgment under absence through:

- inertia expectations
- volatility expectations
- observed contradictory evidence
- basis limitations

### Deferred questions

- How should prolonged silence accumulate?
- What kinds of absence count as weak versus strong negative evidence?
- How should observer-specific expectations differ from referent-specific expectations?

## 9. View Boundary

### Current risk

The repository says views are replaceable, but once summaries, clusters, and keyframes appear, it becomes easy for a view to become the de facto source truth.

### Recommended approach

Define a hard boundary between preserved continuity and derived representation.

Minimal doctrine:

- views are projections over source continuity
- views may summarize or transform
- views must retain reference to source branches, segments, or referents
- views must never overwrite or replace preserved source continuity

### Deferred questions

- Which derived artifacts are stable enough to exchange?
- Can a view itself become evidence?
- What provenance must every persisted view carry?

## 10. Local and Shared Artifact Boundary

### Current risk

The repository wants to be local-first and decentralized-friendly, but has not yet defined what should remain local versus what can be exchanged. Without that, backend work will start forcing ontology decisions.

### Recommended approach

Define artifact classes before defining exchange protocols.

Minimal doctrine:

- source continuity remains local by default
- exchangeable artifacts are explicit projections or receipts
- exchanged artifacts must carry basis and provenance
- exchanged artifacts do not imply global truth

Candidate exchange artifacts:

- anchors
- bindings
- lineage claims
- receipts
- views
- state estimates

### Deferred questions

- Which artifacts are safe to exchange without leaking too much local structure?
- Which artifacts require signatures or receipts?
- What minimal provenance is necessary for peer interpretation?

## Recommended order of attack

The next doctrine passes should be written in this order:

1. observer vs branch anchoring
2. nucleus vs lineage
3. referent persistence criteria
4. context containment semantics
5. portal contract
6. inertia/volatility and negative evidence
7. effective basis
8. trigger/salience/happening transition
9. local/shared artifact boundary
10. view boundary

Focused doctrine notes for these holes now live in [`./doctrine-notes/`](./doctrine-notes/README.md).
