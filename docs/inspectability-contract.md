# Inspectability Contract

This document defines the current minimal inspectability contract for `causal-substrate`.

It is intentionally narrower than full observability tooling. Its job is to state what a consumer should be able to reconstruct or explain from durable records today.

## Current contract

For durable continuity records, a consumer should be able to reconstruct:

- what branch is being claimed as active or recently changed
- what segment or sleep boundary is relevant
- what referent continuity state is being claimed
- why that continuity state was emitted at a bounded summary level
- what artifact was emitted
- what sources that artifact points back to
- what provenance the artifact carries

## Current implementation surfaces

The current Corestore-backed inspectability surfaces are:

- replay summaries over known cores
- branch replay pictures
- referent replay pictures
- inspectability pictures that compress branch, referent, and artifact claims into bounded explanation surfaces
- compact continuity situation surfaces
- compact transition decision surfaces
- time-ordered context and portal replay with primary-context resolution over time

These are reconstruction helpers, not authoritative truth engines.

## Current strengths

The current implementation is already strong enough to preserve:

- source continuity versus derived artifact separation
- provenance on durable artifacts
- reasoning strings on referent continuity records
- persisted context and portal declarations as explicit inspectable artifacts
- compact replay-backed explanation of the current continuity situation
- compact replay-backed explanation of `stay`, `branch`, `cross-context`, and `ambiguous` transition outcomes
- time-ordered replay of context and portal claims across wake/sleep boundaries
- replay from known cores without Hyperbee
- replica catch-up and later reconstruction without hidden indexing assumptions

## Current gaps worth improving

The current inspectability posture is still incomplete in several ways:

- there is no dedicated explanation artifact contract beyond current replay helpers
- there is no durable inspectability view taxonomy yet
- artifact summaries are still helper-derived rather than standardized payload contracts
- no inspectability surface yet explains comparison surfaces, compatibility, or convergence evidence

## Current rule for future work

Improve inspectability by:

- tightening durable record boundaries
- improving replay helpers
- adding explicit inspectability views when justified

Do not improve inspectability by:

- serializing every private heuristic step
- forcing full inner-process introspection
- collapsing source continuity into explanation-only views

## Immediate implication

If new durable record types are added, they should be judged partly by this question:

- can a consumer reconstruct a bounded explanation from them later without hidden internal state

If the answer is no, the record family is not ready yet.
