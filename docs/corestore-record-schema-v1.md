# Corestore Record Schema v1

This document describes the current stable teaching posture for the working record family used by the first serious Corestore lab.

It is a versioned implementation surface, not a final ontology lock.

## Envelope

All `v1` records currently share:

- `schema: "causal-substrate/corestore-record/v1"`
- `schemaVersion: 1`
- `recordId`
- `recordType`
- `recordedAt`

The current `recordType` set is:

- `branch-happening`
- `sleep-capsule`
- `referent-state-estimate`
- `exchange-artifact`

## Record families

`branch-happening`
- append-only continuity observation records
- carries `branchId`, `segmentId`, and the preserved `Happening`

`sleep-capsule`
- append-only wake/sleep chunk records
- carries `branchId`, `segmentId`, `nucleusId`, `Segment`, and `Nucleus`

`referent-state-estimate`
- append-only referent continuity judgments
- carries `branchId`, `referentId`, `anchor`, `continuity`, `Referent`, and `StateEstimate`

`exchange-artifact`
- append-only shared-surface records
- carries `ArtifactEnvelope` plus one payload:
  - `view`
  - `binding`
  - `context`
  - `portal`
  - `lineage-claim`
  - `receipt`

## Validation posture

Current `v1` validation is explicit at two boundaries:

- append-time inside the first serious Corestore lab adapter
- read-time when records are decoded back into typed lab records

Validation checks both:

- envelope shape
- cross-field invariants

Examples of invariants:

- a `branch-happening` record must agree with its embedded `Happening`
- a `sleep-capsule` record must align `branchId`, `segmentId`, and `nucleusId`
- a `referent-state-estimate` record must align top-level ids with embedded `Referent` and `StateEstimate`
- an `exchange-artifact` record must align artifact kind and payload id with the embedded payload

## Evolution posture

`v1` is intentionally versionable.

The repository does not treat this shape as final. The current rule is:

- additive tightening within `v1` is acceptable when it clarifies already-assumed invariants
- semantic or structural breaks should move to a new schema string and version
- readers must reject unsupported schema versions explicitly rather than guessing

This keeps current labs strict enough to trust while preserving room for `v2` once stronger pressure appears.
