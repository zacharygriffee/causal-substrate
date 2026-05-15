# Consumer Adoption Guide

This guide explains how an adjacent repo should adopt `causal-substrate` without guessing the boundary and without importing app-specific assumptions into the core doctrine.

## Use this repo when

Adopt `causal-substrate` when your system needs to represent:

- observer-relative continuity
- tracked referents that may remain continuing, become ambiguous, or break
- context containment and directional exposure
- wake/sleep segmentation of local history
- explicit shared artifacts rather than implicit truth publication

## Do not use this repo as

Do not adopt `causal-substrate` as:

- a centralized truth store
- a generic event log with renamed fields
- a consensus layer
- a mesh runtime
- a renderer or geometry engine
- a replacement for operator workflow or publication policy

## Minimal adoption seam

The default integration seam is:

1. keep source continuity local
2. model observer, referent, branch, segment, and context structure locally
3. produce explicit artifacts only when something should cross a boundary
4. let another layer handle transport, publication, rendering, or operator policy

For the first finished version, the generic bounded consumer surface should be small and explicit. A consumer should be able to ask:

- what is active
- what changed
- why

without needing raw branch replay as its default interface.

## Adoption pattern: universe or geometry consumer

This is the `Virtualia`-like pattern.

Use `causal-substrate` to represent:

- observer continuity
- referent continuity
- emergence pressure
- continuity judgments under absence
- explicit lineage and artifact traces

Keep the adjacent universe or geometry repo responsible for:

- spatial layout
- region and domain semantics
- renderer or projection rules
- world-specific entity canon

Practical rule:

- let `causal-substrate` say whether a thing continues
- let the geometry layer say where that thing is situated and how it is displayed

## Adoption pattern: operator boundary or control-plane consumer

This is the `mesh-ecology-edge`-like pattern.

Use `causal-substrate` to represent:

- local continuity
- local observer and referent tracking
- explicit shareable artifacts
- receipts and lineage claims as evidence surfaces

Keep the adjacent boundary/control-plane repo responsible for:

- operator grammar
- publication decisions
- approval, rejection, or policy transforms
- execution or mesh-boundary orchestration

Practical rule:

- let `causal-substrate` produce artifacts
- let the boundary/control-plane layer decide what crosses out of the local domain

## Adoption pattern: mesh adapter consumer

This is the mesh-facing posture.

Prefer an adapter repo or integration layer when continuity artifacts need to be exchanged over mesh infrastructure.

Use `causal-substrate` to define:

- the continuity-bearing records
- the exchange artifact shapes
- the local-first source/share boundary

Keep the mesh-facing layer responsible for:

- transport
- participation rules
- runtime authority
- discovery and deployment language

Practical rule:

- continuity artifacts may ride the mesh
- mesh rules should not redefine continuity doctrine

## Current generic consumer picture

The current generic consumer-facing continuity picture is intentionally narrower than the full ontology.

It should expose:

- current continuity situation
- current active referents with bounded reasoning
- optional recent transition summary
- optional bounded comparison picture when explicit comparison pressure matters

It may include:

- inertia and volatility identifiers when they materially inform continuity interpretation
- replay-backed evidence identifiers for later inspection

It should not include:

- raw append logs as the default consumer API
- operator policy
- transport ownership
- app-specific vocabulary from Edge, Virtualia, or any other adjacent repo
- consumer-specific comparison scoring policy

## Append-log adjacency

Adjacent repos may expose append-log-shaped projections as adoption evidence,
but `causal-substrate` should treat those projections as source references
before treating them as causal history.

Use `causal-substrate/append-log-happening-map/v1` when a repo needs to map
append-log entries into happening-shaped references. The map preserves
`entryId`, payload hashes, parent refs, and source refs without replaying the
source log, writing continuity records, accepting canonical history, starting
Autobase, or treating local files as substrate truth.

Edge operation history has a narrower first adoption seam:
`causal-substrate/edge-operation-history-evidence/v1` should consume Edge's
preferred `edge_operation_append_log_view` projection before any real backend
prototype. It preserves operation, entry, parent, receipt, evidence, and
payload-hash refs while keeping the source trail local, replaceable, and
non-authoritative. The compatibility `edge_operation_trail` source remains
accepted, but the append-log view is the preferred read path because it carries
explicit scaffold and backend posture.

Edge's single-writer projection-log proof has a separate adoption seam:
`causal-substrate/edge-projection-log-happening-map/v1` maps
`edge_projection_event_log_entry.v0` into happening-shaped references. This
preserves observation-time metadata for operator review, not a wall-clock causal
clock. The map preserves entry id, projection event id, projection ref, payload
hash, namespace parts, source refs, transport refs, sequence, and any available
temporal ref. If neither the log entry nor embedded projection event carries an
observation-time ref, the map stays incomplete instead of inventing one.

For the current single-writer proof, causal order comes from the log sequence
and event refs. For collaborative local-layer history, prefer Autobase or an
equivalent linearized multi-writer causal frontier instead of comparing
wall-clock timestamps.

That projection-log map does not open Edge's Corestore, replay the projection
log, write continuity records, accept canonical history, claim causal truth, or
promote the local store root into a repo-to-repo seam.

## Adjacent tool interop

Adjacent tools that need a formal request/response boundary should use the `causal-substrate/adjacent-tool-interop/v1` seam.

The request declares:

- the consumer id
- requested bounded surfaces
- optional `asOf` time
- optional transition window
- optional reason for the request

The response may supply:

- continuity situation
- generic continuity picture
- continuity explanation artifact
- inspectability picture
- comparison picture

The response also supplies descriptor refs and a receipt. The receipt is intentionally part of the contract because it states what was supplied and what was not granted.

Consumers must treat this response as evidence-only. It does not include raw graph traversal, hidden topology, source append logs, writer admission, merge/fork authority, mesh participation, global truth, or consumer policy.

## Anti-patterns

Avoid these integration mistakes:

- treating a derived view as source truth
- letting publication imply correctness
- forcing agreement where comparability is only partial
- importing mesh runtime semantics into the substrate kernel
- importing geometry-specific canon into general continuity doctrine
- using multi-writer injection when a seed, seat, adoption, or custody model would explain emergence more honestly

## Current teaching line

If an adjacent repo is unsure whether something belongs here, ask:

- is this about continuity itself
- or is it about geometry, transport, deployment, control, or projection around that continuity

If it is the second case, it probably belongs in the adjacent repo or in an adapter layer rather than in `causal-substrate`.
