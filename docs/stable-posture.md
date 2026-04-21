# Stable Posture

This document is the current teachable summary of `causal-substrate`.

Use it as the first stop when you need the repository’s stable posture without rereading every doctrine note and lab artifact.

## What is settled enough to teach

The repository is settled enough to teach the following points:

- continuity is observer-relative and local-first
- there is no assumed global truth store
- branches, not observers alone, carry continuity
- referents are distinct from branches but may have branches of their own
- one primary situated context is the default
- portals are directional by default
- wake/sleep segmentation and carried nuclei are core
- views are derived and replaceable
- source continuity stays local by default
- shared material must be emitted explicitly as artifacts
- referent persistence defaults to `continuing`, `ambiguous`, or `broken`
- emergence should prefer seeds, seats, adoption, cultivation, and materialization over magical appearance
- multi-writer is not required by default
- if multi-writer ever appears first, it should appear in shared artifact or coordination surfaces, not continuity-bearing histories
- durable continuity boundaries should remain inspectable even when inner heuristics stay richer or more opaque

## Current stable schema posture

The current stable record posture is:

- Corestore `v1` records are explicitly versioned
- append-time validation is explicit
- read-time validation is explicit
- the current record families are strict enough to trust in labs
- the format is still versionable and not treated as final ontology law

The current `v1` record families are:

- `branch-happening`
- `sleep-capsule`
- `referent-state-estimate`
- `exchange-artifact`

## Current stable implementation posture

The current stable implementation posture is:

- keep the in-memory kernel small and doctrinal
- use Corestore/Hypercore for serious append-only continuity labs
- keep known-core replay as the default reconstruction posture
- avoid Hyperbee until lookup/index pressure is demonstrated
- treat replication as artifact and continuity exchange, not shared authorship

## What remains open on purpose

These questions remain open and should not be silently resolved by implementation convenience:

- exact branch identity shape
- exact nucleus versus lineage semantics
- final compatibility, equivalence, and convergence semantics
- final effective-basis computation for composites
- final re-identification scoring
- final referent split/merge rules
- final salience representation
- final inference defaults
- how volatility should be learned and shared
- final portal contract
- final local/shared artifact taxonomy

## What is intentionally deferred

The following work is intentionally deferred rather than half-assumed:

- Hyperbee as an index layer
- transport-heavy replication experiments
- NoiseSecretStream majority experiments
- deeper `fakeswarm` swarm proofs
- Autobase or other multi-writer coordination surfaces
- any multi-writer use on continuity-bearing histories

## How adjacent repos should read this

Adjacent repos should read the boundary as:

- `causal-substrate` owns continuity doctrine and continuity-bearing artifact structure
- geometry, mesh runtime, control plane, deployment, and projection remain owned by adjacent repos or adapters

That means this repo is stable enough to adopt, but not “finished” in the sense of having closed every ontology question.

## Canonical next docs

After this document, the most useful follow-ups are:

- [Doctrine](./doctrine.md)
- [Corestore Record Schema v1](./corestore-record-schema-v1.md)
- [Doctrine Notes](./doctrine-notes/README.md)
- [Adjacent Boundaries](./adjacent-boundaries.md)
- [Consumer Adoption Guide](./consumer-adoption.md)
- [Open Questions](./open-questions.md)
