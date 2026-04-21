# Inspectability Boundary

## Purpose

This note sets the current doctrine for inspectability without forcing the substrate to serialize every inner heuristic or temporary inference.

The goal is to preserve usefulness while preventing the continuity layer from collapsing into a black box.

## Current doctrinal rule

The substrate does not need full introspection of every inner process.

It does need inspectable durable continuity boundaries.

That means:

- opaque inner search is acceptable
- opaque durable continuity claims are not

## Paper trail is not enough

Append-only decentralized history creates a paper trail, but a paper trail alone does not guarantee inspectability.

History may still become:

- too low-level to reason about
- too fragmented across streams
- too hard to distinguish as source continuity versus derived interpretation
- too hard to replay into a usable explanation surface

So the repository should distinguish:

- `paper trail`
- `inspectability strategy`

A paper trail means records exist.

An inspectability strategy means the records can be replayed into a bounded explanation of what continuity is being claimed.

## What must remain inspectable

The following should remain inspectable, replayable, or explicitly derivable:

- source continuity records
- branch and segment structure
- referent persistence records
- lineage claims
- context and portal declarations
- emitted artifacts
- provenance on durable outputs
- the link from derived views back to source continuity

## What may remain opaque

The following do not need full durable introspection by default:

- internal candidate search
- temporary inference scaffolding
- ranking among plausible referents before a durable claim is emitted
- compression from many low-level triggers into one preserved happening
- private agent heuristics that never become durable continuity claims

## Current repository line

The line should be:

- source continuity must stay inspectable enough to replay
- emitted durable claims must stay inspectable enough to explain
- inner heuristic machinery may stay more opaque

This avoids the false choice between:

- full introspection everywhere
- black-box continuity claims

## Durable explanation posture

Durable continuity claims do not need full chain-of-thought.

They do need:

- explicit state
- provenance
- bounded reason or reasoning summary when relevant
- source linkage or replay path

This is enough to explain why a durable state exists without forcing serialization of every intermediate candidate.

## Views and inspectability

Views are part of the inspectability strategy.

The repository should allow:

- raw append-only history
- explicit provenance
- replay from known cores
- derived inspectability views over that history

This means inspectability can improve over time without mutating or replacing the underlying continuity records.

## What this commits the repo to

- inspectability must be designed into durable records now
- convenience tooling for inspectability may mature later
- durable continuity should remain distinguishable from derived interpretation
- decentralized operation does not excuse opaque continuity claims

## What remains open

The repository does not yet claim:

- a final inspectability view taxonomy
- a final explanation artifact contract
- a final UI or dashboard strategy
- a universal explanation budget for all consumers

## Working implementation implication

For current doctrine and code:

- keep provenance explicit on durable outputs
- keep replayability explicit
- keep source continuity separate from derived views
- allow internal interpretation to be richer than what gets durably emitted
