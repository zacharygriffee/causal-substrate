# Doctrine

## Purpose

This document states what `causal-substrate` is willing to claim now.

It is not a full theory of identity, truth, convergence, or consensus. It is a doctrinal floor for the repository: enough clarity to guide implementation, examples, and future hole-closing work without prematurely narrowing the ontology.

## Core stance

### 1. Observer-first

The substrate begins from observers and preserved distinctions, not from a guaranteed universal state.

An observer is a locus that can preserve distinctions across change and can be affected by them. An observer does not imply omniscience, completeness, or agreement with other observers.

### 2. No guaranteed global truth

The repository does not assume a single authoritative world-state.

What can be represented instead:

- what an observer experienced
- what an observer tracked
- what basis that tracking depended on
- what continuity was carried forward
- what context the observer was situated in
- what outside context was exposed through portals

Agreement, convergence, and consensus are optional higher-order behaviors built on top of this, not substrate primitives.

### 3. Basis-relative continuity

Continuity is always basis-relative.

The substrate treats `Basis` as first-class because preserved distinctions depend on what an observer or branch can actually retain, compare, or project. Basis may be:

- partial
- degraded
- compositional
- projected
- revised

The repository should avoid claims that silently ignore basis.

### 4. Local-first

The substrate must remain conceptually usable in a fully local setting.

Persistence, exchange, synchronization, and decentralization matter, but they are backend and protocol concerns layered over the ontology rather than prerequisites for the ontology to make sense.

## Core commitments

### 1. Branches preserve continuity

A `Branch` is the primary continuity structure. It represents preserved distinctions over time.

A branch is not the same thing as:

- a referent
- a context
- a portal
- a convergence cluster
- a view

Those may use branch machinery, but should not be collapsed into a single undifferentiated concept.

### 2. Referents are tracked continuities, not mere records

A `Referent` is a persistent cause or tracked continuity. Referents are not simply arbitrary labels attached to events.

The substrate does not require a referent to be metaphysically settled in order to be tracked. It only requires that tracking be representable, revisable, and basis-relative.

### 3. Contexts are structural, not decorative

A `Context` is not just metadata about location. It is a containment-bearing continuity with situating force.

Observers and referents are not merely described as being "in" a context. They are situated within it in a way that can affect continuity, access, and exposure.

### 4. Portals are membranes

A `Portal` is a constrained exposure from one context into another.

It is not:

- a generic child object
- full duplication of an external context
- proof of equivalence between contexts

A portal expresses filtered access, not exhaustive transfer.

### 5. History is segmented

History is not treated as an undifferentiated stream. It is segmented into wake intervals and sealed sleep intervals.

This matters because continuity should survive periods of inactivity, absence, or colder storage without pretending observation was continuous.

### 6. Inheritance matters

`Nucleus` and `Lineage` both matter because continuity is not exhausted by a single last pointer.

The repository currently commits only to this minimal distinction:

- `Nucleus` is the carried-forward core or inherited anchor made available to a successor continuity
- `Lineage` records ancestry relations among continuities or segments

The precise border remains open, but they are not the same thing.

### 7. Derived representations are replaceable

`View` is useful and encouraged, but never canonical.

The source continuity remains the branch and segment history, not a summary, rendering, or materialized view.

## Operational doctrine

### Trigger, salience, happening

These form a sequence, but not a collapse:

- a `Trigger` is threshold crossing
- `Salience` is observer-relative importance weighting
- a `Happening` is an important clustered change or keyframe

The substrate should permit low-level triggers that never become happenings, and should permit different observers to weight the same trigger differently.

### Wake and sleep

`Wake` is active continuity within a segment.

`Sleep` seals a segment without claiming that continuity ended. Sleep exists so history can be chunked, inherited, and resumed without pretending uninterrupted active observation.

### Binding

A `Binding` relates an observer branch to a referent branch.

Binding is explicit because tracking should not be inferred solely from temporal proximity or naming. A binding may strengthen, weaken, or become ambiguous without forcing immediate identity collapse.

### Inertia and volatility

`Inertia` and `Volatility` are interpretive tools for continuity under absence.

The current doctrine is minimal:

- absence is not automatically breakage
- negative evidence is not naive absence counting
- expectations about persistence depend on both what is being tracked and the conditions around it
- contradiction pressure is distinct from mere non-observation
- current labs may use explicit heuristics here without treating them as universal law

### Lineage over forced identity

When splits, merges, or ambiguous re-identification occur, lineage is often the safer representation than forced identity claims.

The substrate should prefer preserving ancestry relations and ambiguity over flattening multiple continuities into one name too early.

### Emergence and materialization

The repository should prefer explicit emergence paths over magical appearance.

The current doctrinal lean is:

- `Seed` is precursor structure or latent continuity potential
- `Seat` is a special seed or prepared locus for observer continuity
- `Materialization` is an emergence process rather than a sudden unexplained insertion
- observer emergence and non-observer emergence are related but not identical
- normal emergence should not require injection

This keeps continuity local-first while still allowing entities to become tracked, inherited, cultivated, or adopted over time.

### Writer and injection posture

The repository should not treat `writer` as a universal substrate primitive.

The short-term implementation lean is:

- continuity-bearing branches should not need multi-writer support
- source continuity should remain local or custody-bound by default
- replication does not imply shared authorship
- injection should be exceptional, explicit, and policy-bearing

Multi-writer support remains an allowed future capability, but it should be introduced only where a concrete surface truly requires shared authorship. The default continuity substrate should not be designed around it.

### Inspectability and opacity

The repository should not require full introspection of every inner heuristic process.

It should require inspectable durable continuity boundaries.

The current doctrinal line is:

- source continuity should remain replayable
- durable emitted claims should remain inspectable enough to explain
- provenance should remain explicit on durable outputs
- derived views should not overwrite source continuity
- opaque inner search is acceptable, but opaque durable continuity claims are not

This keeps the substrate useful for rich local interpretation without turning continuity itself into a black box.

## Epistemic doctrine

### Comparability

`Comparability` means a useful shared projection or transform exists.

### Compatibility

`Compatibility` means claims or continuities can coexist without contradiction under a relevant projection.

### Equivalence

`Equivalence` means two continuities are the same enough under some basis or projection.

### Convergence

`Convergence` means multiple observations, bindings, or claims cluster around a referent or proposition.

### Agreement

`Agreement` is an observer-side act or judgment. It is optional and should not be treated as a substrate primitive required for continuity.

## Repository rules

Current lab defaults are captured separately in [`./working-defaults.md`](./working-defaults.md). When doctrine is broader than the current implementation posture, labs should follow those defaults unless they are explicitly modeling an exception.

Post-lab consolidation currently lives in [`./doctrine-consolidation.md`](./doctrine-consolidation.md).

### What code may assume

Code may assume:

- observers have limited basis
- branches preserve continuity
- history can be segmented
- referents can be tracked without absolute certainty
- contexts contain and situate
- portals expose selectively
- views are derived

### What code must not assume

Code must not assume:

- a single global truth store
- universal comparability
- mandatory convergence
- mandatory agreement
- fixed identity semantics
- naive persistence under absence
- that contexts and portals are ordinary objects with renamed fields

## What doctrine work should do next

The next phase is not to add more primitives. It is to close the most dangerous logical gaps while preserving optionality:

- observer vs branch anchoring
- nucleus vs lineage
- minimal referent persistence criteria
- effective basis composition/degradation
- trigger/salience/happening transition
- context containment semantics
- minimal portal contract
- negative evidence doctrine
- local/shared artifact boundary

Focused follow-up notes now live in [`./doctrine-notes/`](./doctrine-notes/README.md).
