# Adjacent Boundaries

This document states the current boundary between `causal-substrate` and the adjacent repos that are most likely to pressure or consume it.

The goal is to keep this repository general while still making the adjacent seams explicit and teachable.

## What `causal-substrate` owns

`causal-substrate` owns continuity doctrine and continuity-bearing artifact structure.

That includes:

- observer-relative branches
- referent persistence and tracking
- context containment and directional portals
- wake and sleep segmentation
- nuclei and lineage metadata
- local/shared artifact boundaries
- continuity estimates such as `continuing`, `ambiguous`, and `broken`
- append-only continuity and exchange records

## What `causal-substrate` does not own

This repository does not own:

- geometry or world-layout canon
- mesh runtime semantics
- transport and participation protocols
- operator grammar or control-plane publication policy
- deployment-pack taxonomy
- renderer or application-specific projection canon

## Boundary with `Virtualia`

`Virtualia` is the adjacent universe substrate and geometry-bearing research layer.

`Virtualia` pressures this repo most strongly around:

- seeds and emergence
- entity materialization
- region or domain placement
- projection and surface semantics
- authority and custody pressure around what can appear where

`causal-substrate` should support those pressures by representing continuity over time.

`Virtualia` should continue to own:

- world geometry
- region and domain structure
- Virtualia-specific entity canon
- projection-surface semantics specific to that universe substrate

`causal-substrate` should not import Virtualia-specific nouns as mandatory substrate primitives just because Virtualia needs them.

The clean seam is:

- `causal-substrate` says what continuity is tracked and how it persists
- `Virtualia` says where and how that continuity is situated geometrically or world-mechanically

## Boundary with `mesh-ecology-edge`

`mesh-ecology-edge` is an operator-facing boundary and control-plane layer.

It pressures this repo around:

- explicit artifact classes
- publication boundaries
- bounded observation and receipts
- local-to-shared transforms

`causal-substrate` may emit artifacts that `mesh-ecology-edge` later classifies, transforms, or publishes.

`mesh-ecology-edge` should continue to own:

- operator grammar
- local execution proposals
- publication policy
- boundary transforms
- authority decisions over what may cross from local execution to shared mesh surfaces

`causal-substrate` should not absorb operator workflow or publication policy into continuity doctrine.

The clean seam is:

- `causal-substrate` produces local continuity and explicit shareable artifacts
- `mesh-ecology-edge` decides what publication or boundary action, if any, should happen next

Current interop posture:

- adjacent tools may submit a bounded descriptor/request/receipt request through `causal-substrate/adjacent-tool-interop/v1`
- requests may ask for continuity situation, generic continuity picture, continuity explanation, inspectability picture, or comparison picture surfaces
- responses include descriptor refs for branches, referents, contexts, portals, artifacts, comparisons, reason codes, and evidence ids
- receipts carry explicit non-authority flags: no raw append logs, no raw graph traversal, no hidden context carry-over, no writer admission, no merge/fork authority, no mesh participation, and no global truth assertion
- Edge may use the response as operator-facing orchestration context, but it does not become substrate and does not own continuity doctrine

Phase 117 static review posture:

- `causal-substrate` may consume the Edge Phase 116A causal continuity adjacent review packet fixture only from its checked-in static copy at `test/fixtures/edge/phase-116a-causal-continuity-adjacent-review-packet-fixture.json`
- the emitted review evidence uses the causal-owned `causal-substrate/adjacent-review-evidence/v1` schema and `causal-adjacent-review-evidence` artifact kind
- Edge compatibility metadata on that artifact is classification-only for later Edge import and does not make Edge the schema owner
- fixture presence does not imply adjacent acceptance, causal truth, canonical branch acceptance, lineage settlement, reality settlement, production proof, or mesh truth
- the fixture is not a command, TODO list, replay instruction, event-sourcing authority, or conflict-resolution input
- Phase 117 performs no Edge runtime fetch, Edge call, Edge mutation, runner, scheduler, live discovery, mesh publication, replay engine, canonical branch selection, lineage settlement, or reality settlement

## Boundary with mesh integration generally

This repository should remain mesh-agnostic at the core.

If it becomes mesh-facing, the preferred posture is an adapter or integration repo rather than making mesh ownership a core responsibility here.

Current proof posture:

- the repo can reconstruct a mesh-agnostic adapter snapshot from persisted continuity records
- that snapshot may carry continuity, inspectability, transition, and derived discovery surfaces
- the snapshot does not need to import peer identity, swarm ownership, or transport authority into the core model

### `(adjacent mesh-v0-2)`

`(adjacent mesh-v0-2)` owns:

- primitive runtime semantics
- participation and protocol rules
- authority behavior
- supported mesh-facing engine surfaces

`causal-substrate` may later project continuity artifacts onto mesh surfaces, but it should not define mesh participation rules itself.

### `mesh-ecology-packs`

`mesh-ecology-packs` owns:

- control-plane vocabulary
- pack and deployment posture
- writer management conventions
- adjacent adoption guidance for mesh-facing repos

`causal-substrate` may inform pack or writer-management doctrine when continuity-specific pressure appears, but it should not take ownership of packs deployment language or concern writer workflows.

## Pressure contributed by adjacent repos

`Virtualia` contributes:

- geometry and entity-emergence pressure
- continuity requirements for stable world display
- questions about seeds, seats, and materialization

`mesh-ecology-edge` contributes:

- explicit artifact-boundary pressure
- receipts and publish-observe workflow pressure
- pressure to keep local continuity separate from publishable outputs

`(adjacent mesh-v0-2)` contributes:

- runtime and transport pressure
- replication and participation pressure
- pressure to keep continuity surfaces distinct from protocol surfaces

`mesh-ecology-packs` contributes:

- control-plane and deployment pressure
- writer-management pressure
- pressure to express integration seams in a way adjacent repos can actually adopt

## Assumptions not imported from adjacent repos

The following assumptions should stay out of core doctrine unless direct substrate pressure justifies them independently:

- Virtualia-specific geometry or region ontology
- mesh runtime participation rules
- operator publication workflow
- pack taxonomy or deployment language
- any claim that publication, replication, or operator review creates truth

## Current repository rule

Adjacent repos may strongly pressure this repository, but they do not get to silently redefine what it owns.

When pressure appears:

- name the pressure explicitly
- land the change in the repo that owns the problem
- keep adapter seams explicit when responsibilities cross repo boundaries
