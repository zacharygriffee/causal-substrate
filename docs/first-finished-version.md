# First Finished Version

This document states what the first finished version of `causal-substrate` should be understood to establish.

It is not a claim that every doctrine question is closed forever.

It is a claim that the repository is complete enough to demonstrate its core position end-to-end without appealing to future infrastructure.

## What is finished

The first finished version establishes that:

- observer-scoped causal continuity can be modeled locally-first without assuming a central truth store
- branches, referents, contexts, portals, wake/sleep segments, nucleus carry-forward, and lineage can be persisted and replayed coherently
- continuity can remain observer-relative and ambiguity can remain first-class
- source continuity can remain local while explicit artifacts cross boundaries deliberately
- bounded inspectability can be reconstructed from durable records
- compact generic consumer surfaces can answer what is active, what changed, and why
- decentralized exchange can be demonstrated with Corestore, Hypercore, and transport-adjacent capability surfaces

## What this version demonstrates concretely

This version can already demonstrate:

- append-only branch happenings, sleep capsules, referent state estimates, and exchange artifacts
- replay-backed continuity situation and transition decision surfaces
- persistence judgments of `continuing`, `ambiguous`, and `broken`
- branch capability revision without forced fork
- branch fork with inherited nucleus carry-forward and explicit split lineage
- context and portal replay over time
- replicated reconstruction on receiving stores
- discovery-derived multi-topic rendezvous without default registry dependence
- capability-limited exchange after rendezvous
- a mesh-agnostic adapter snapshot
- a generic bounded consumer continuity picture

## Stable first-version teaching line

Teach the first finished version this way:

- local continuity is primary
- explicit artifacts are what cross boundaries
- views are derived and replaceable
- ambiguity is honest state, not failure
- convergence and agreement remain optional higher-order behaviors
- transport helps continuity move, but does not redefine continuity

## What remains intentionally open

The first finished version still leaves open:

- final compatibility, equivalence, and convergence semantics
- final portal contract details
- later artifact taxonomy extensions beyond the current stable exchange-facing set
- later index/catalog layers such as Hyperbee when concrete lookup pressure justifies them
- optional multiwriter patterns for specialized coordination surfaces

These are open by design, not unfinished by accident.

## What is deferred to later versions

Later versions may explore:

- Hyperbee-backed lookup and discovery catalogs
- Autobase or other higher-order shared surfaces
- optional multiwriter coordination or injection surfaces
- app-specific adapters for Edge, Virtualia, or mesh-facing runtimes
- stronger cryptographic receipt or signature requirements

Those are not required to understand or demonstrate the first finished version.

## Practical implication for adjacent repos

An adjacent repo should not need to adopt the whole internal ontology directly.

For the first finished version, it is enough that an adjacent repo can consume:

- bounded continuity situation
- bounded transition summary
- explicit artifacts
- replay-backed inspectability surfaces when deeper explanation is needed

That is the boundary where the first finished version becomes practically usable rather than only philosophically coherent.
