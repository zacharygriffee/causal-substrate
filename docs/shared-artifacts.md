# Shared Artifacts

This document formalizes the current shared-artifact layer for local-first and pre-backend work.

## Posture

Source continuity remains local by default.

Artifacts are explicit emitted surfaces derived from local continuity. They do not imply global truth and they do not expose raw local history automatically.

## Current Artifact Types

The current repository supports explicit artifact envelopes over:

- bindings
- context surfaces
- portal surfaces
- lineage claims
- views
- receipts

State estimates remain durable continuity-bearing records in the current Corestore posture, but they are not yet part of the first-finished-version exchange artifact set.

Comparison surfaces remain representable in the kernel, but they are not yet part of the first-finished-version exchange artifact set either.

Comparison surfaces are now part of the repository's explicit post-finish comparison pressure layer:

- they are replayable
- they are inspectable
- they carry basis/projection references, reason codes, and evidence ids

They should still be treated as provisional comparison artifacts rather than as truth-bearing authority surfaces.

## First Finished Version Artifact Set

For the first finished version, the stable teachable exchange-facing artifact set is:

- `binding`
- `context-surface`
- `portal-surface`
- `lineage-claim`
- `view`
- `receipt`

This is the set adjacent consumers should expect to see emitted explicitly when something is intended to cross a local/shared boundary.

The practical split is:

- branch happenings, sleep capsules, and referent-state estimates preserve source continuity
- exchange artifacts project bounded surfaces derived from that continuity
- comparison artifacts project bounded comparison pressure derived from continuity evidence

This keeps local continuity and exchange-facing surfaces separate.

## Required Artifact Structure

Every artifact envelope should carry:

- kind
- label
- source identifiers
- payload identifiers
- locality
- provenance

## Provenance

Current provenance fields:

- `emittedAt`
- `basisId` when relevant
- `emitterId` when relevant
- `source`
- `note`

This is sufficient for local and prototype-stage work. It is not yet the final exchange schema.

For the first finished version, the rule is:

- every emitted exchange artifact should carry `emittedAt`
- `basisId` should be present when basis materially affects interpretation
- `emitterId` should be present when custody or authorship matters
- `source` should identify the emitting lab, adapter, or boundary
- `note` remains optional explanatory context

## Locality

Artifacts currently distinguish:

- `local`
- `shared-candidate`

This makes explicit whether an emitted surface is purely local or intended as a candidate for later exchange work.

For the first finished version, the teachable locality rule is:

- source continuity remains local by default
- emitted exchange artifacts are `shared-candidate` only when they are meant to cross a boundary
- nothing becomes shared merely because it was observed or persisted locally

## What This Means For Consumers

Adjacent consumers should rely on:

- explicit exchange artifacts for anything boundary-crossing
- continuity situation, transition, and inspectability surfaces for bounded explanation
- `causal-substrate/continuity-explanation/v1` artifacts when a portable evidence-only explanation import is needed
- comparison artifacts and generic comparison pictures when explicit comparison pressure is needed
- replay-backed continuity records for deeper inspection when needed

Adjacent consumers should not assume:

- raw local continuity is available for exchange by default
- emitted artifacts settle global truth
- every kernel entity type already has a stable exchange artifact form

## What Remains Open

The current formalization does not yet settle:

- final receipt structure
- cryptographic or signature requirements
- later exchange forms for state estimates
- whether every artifact kind needs its own dedicated wrapper

## Continuity Explanation Artifact

The continuity explanation artifact is a derived import/export surface, not a new source-continuity record family.

It exists so adjacent tools can receive a bounded explanation that includes branch, segment, sleep-boundary, referent, context, portal, transition, evidence, and provenance refs without receiving raw append logs or hidden graph authority.

Its current schema is `causal-substrate/continuity-explanation/v1`.

Consumers must treat it as:

- evidence-only orchestration context
- local or custody-bound continuity by default
- derived and replaceable
- non-authoritative for global truth, writer admission, merge/fork authority, and mesh participation
