# Kernel Design

## Goal

Define the smallest useful kernel that can represent observer-scoped causal continuity without freezing unresolved semantics too early.

## Included primitives

- `Observer`
- `Basis`
- `Branch`
- `Segment`
- `Happening`
- `Nucleus`
- `Referent`
- `Binding`
- `Context`
- `Portal`
- `View`
- `LineageEdge`
- `StateEstimate`

## Intentional limits

The kernel currently does not hardcode:

- branch identity semantics beyond stable identifiers
- objective truth or global reconciliation
- mandatory convergence or agreement logic
- automatic equivalence or compatibility scoring
- fixed referent split/merge rules
- learned volatility models
- standardized exchange artifacts

## Structural invariants

1. Every branch belongs to a scope and carries a basis descriptor.
2. Branch history is segmented into wake intervals represented by `Segment`.
3. Sleeping a segment yields a `Nucleus` that can be carried forward into a successor segment.
4. Referents are distinct from branches, but may own branches for tracked continuity.
5. Bindings explicitly relate observer branches to referent branches.
6. Contexts are specialized branches with containment metadata.
7. Portals connect contexts through constrained exposure metadata rather than full duplication.
8. Views are derived artifacts and never become the canonical source.
9. Convergence-like claims, if recorded, attach as evidence to referent continuity rather than becoming a new branch kind.

## Implementation posture

The proof of concept uses an in-memory substrate with creation helpers and lightweight guards. It is designed so a future backend adapter can persist the same primitives into:

- memory
- filesystem snapshots
- Hypercore/Corestore
- Autobase-backed shared surfaces

## Why this is enough for now

This kernel is sufficient to validate:

- observer-relative continuity
- referent persistence and binding
- context containment
- portal exposure
- wake/sleep segmentation
- lineage and nucleus inheritance
- replaceable views

without pretending the ontology is already settled.
