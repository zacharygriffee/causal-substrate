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

## Durable versus derived boundary

The current line is:

- durable records should carry continuity-bearing observations, continuity judgments, or explicit exchange artifacts
- durable records should carry enough ids, timestamps, and provenance to replay or explain those claims later
- helper summaries, compact continuity situation surfaces, transition decisions, and inspectability pictures are derived unless a later exchange need proves they must become durable

In practice this means:

- `branch-happening`, `sleep-capsule`, and `referent-state-estimate` remain durable continuity families
- `exchange-artifact` remains the durable shared-surface family
- replay summaries and inspectability surfaces remain replaceable reconstructions over those records

The repository should not durably store a helper view merely because it is convenient to inspect locally.

## Tightening posture inside `v1`

The repository is willing to tighten `v1` when the tightening only makes already-assumed invariants more explicit.

Examples of acceptable tightening:

- stricter cross-field checks
- stricter payload-kind and artifact-kind alignment
- sharper required-versus-optional field rules
- narrower timestamp, id, or provenance requirements where the current code already assumes them

Examples that should move to `v2` instead:

- changing record family meaning
- changing payload semantics
- removing fields consumers may already rely on
- changing whether a helper-derived surface is durable by default

## Threshold for stricter encodings

JSON remains acceptable for the current `v1` lab posture because:

- it keeps doctrine and schema inspection simple
- replay and replication pressure are already being exercised
- the schema remains explicitly versioned

The repository should only introduce stricter encodings once at least one of these pressures becomes concrete:

- cross-language interchange needs deterministic binary encoding
- payload size or throughput pressure makes plain JSON meaningfully wasteful
- partial decode or schema-aware streaming validation becomes necessary
- shared tooling across repos requires a stronger machine-checked contract than the current manual validation posture

If that pressure appears, the next move should still preserve versionability:

- define the semantic contract first
- choose the encoding second
- bump schema identity when the wire meaning changes

That keeps the encoding choice from silently becoming ontology law.
