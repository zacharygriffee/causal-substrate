# Shared Artifacts

This document formalizes the current shared-artifact layer for local-first and pre-backend work.

## Posture

Source continuity remains local by default.

Artifacts are explicit emitted surfaces derived from local continuity. They do not imply global truth and they do not expose raw local history automatically.

## Current Artifact Types

The current repository supports explicit artifact envelopes over:

- bindings
- lineage claims
- views
- state estimates
- comparison surfaces
- receipts

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

## Locality

Artifacts currently distinguish:

- `local`
- `shared-candidate`

This makes explicit whether an emitted surface is purely local or intended as a candidate for later exchange work.

## Comparison Surfaces

The current repository also supports comparison surfaces with:

- comparability
- compatibility
- convergence
- summary

This keeps comparability representable without forcing it into agreement or convergence logic.

## What Remains Open

The current formalization does not yet settle:

- final receipt structure
- cryptographic or signature requirements
- final artifact taxonomy for decentralized exchange
- whether every artifact kind needs its own dedicated wrapper
