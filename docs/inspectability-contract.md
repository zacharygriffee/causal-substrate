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
- generic consumer continuity pictures built from persisted continuity, referent, and transition records
- replay-backed comparison claims and generic consumer comparison pictures
- time-ordered context and portal replay with primary-context resolution over time
- `causal-substrate/continuity-explanation/v1` artifacts for consumers that need a portable evidence-only explanation import

These are reconstruction helpers, not authoritative truth engines.

## Continuity explanation artifact v1

The `causal-substrate/continuity-explanation/v1` artifact is the first dedicated explanation contract for adjacent tools such as Edge.

It is derived from the generic consumer continuity picture plus the bounded inspectability picture. It carries:

- schema and version
- an explanation artifact id and emitted time
- source continuity custody posture
- active or recently changed branch refs
- relevant segment and sleep-boundary refs
- referent continuity states with bounded reasoning
- context and portal refs when they affect the explanation
- optional transition summary
- evidence ids and supporting artifact refs with provenance
- warnings for ambiguity, derived-view-only posture, source-continuity non-transfer, and partial basis when applicable

It explicitly carries a consumer boundary:

- evidence-only
- no raw append logs
- no writer admission
- no mesh participation grant
- no global truth assertion

This lets Edge import the artifact as orchestration context without owning continuity doctrine, hidden graph traversal, branch mechanics, or substrate internals.

## Current strengths

The current implementation is already strong enough to preserve:

- source continuity versus derived artifact separation
- provenance on durable artifacts
- reasoning strings on referent continuity records
- persisted context and portal declarations as explicit inspectable artifacts
- compact replay-backed explanation of the current continuity situation
- compact replay-backed explanation of `stay`, `branch`, `cross-context`, and `ambiguous` transition outcomes
- compact consumer-facing answers to what is active, what changed, and why
- portable evidence-only explanation artifacts for adjacent import
- bounded explanation of comparison pressure through basis/projection references, reason codes, and evidence ids
- time-ordered replay of context and portal claims across wake/sleep boundaries
- replay from known cores without Hyperbee
- replica catch-up and later reconstruction without hidden indexing assumptions

## Current gaps worth improving

The current inspectability posture is still incomplete in several ways:

- there is no durable inspectability view taxonomy yet
- artifact summaries are still helper-derived rather than standardized payload contracts
- comparison strategy itself remains outside the substrate even though comparison claims are now inspectable

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
