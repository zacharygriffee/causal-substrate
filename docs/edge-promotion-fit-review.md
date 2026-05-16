# Edge Promotion Fit Review

Status: reversible review; no storage or runtime ownership.
Owner: `causal-substrate`.
Purpose: identify which Edge-local promotion candidates causal-substrate can
already interpret before the repo family decides what becomes replicated
local-layer continuity.

## Boundary

`causal-substrate` can interpret causal posture. It does not promote Edge state,
own Edge storage, run Edge, open Autobase for Edge, decide truth, grant
authority, settle mesh reality, or replace repo-owned state backends.

No material should be eligible for Edge local-layer promotion unless
causal-substrate can describe its continuity posture without becoming runtime,
backend, truth engine, or authority.

## Fit Matrix

| Edge candidate | Causal interpretation fit | Current support | Gap before promotion |
| --- | --- | --- | --- |
| Local-layer projection event | source happening / projection happening with source/share boundary | supported by projection-log and projection-happening adapters when refs are present | exact promoted event contract must require causal refs or explicit causal-ref deferral |
| Projection event log entry | happening mapped from append-only projection entry | supported by `edge_projection_event_log_entry.v0` adapter | promotion must keep sequence/ref order distinct from causal truth and wall-clock order |
| Operator situation view model | derived view over observer-local evidence | conceptually supported as replaceable view | should remain derived; avoid treating view as branch/source state |
| Readiness/review statuses | observer-local review happenings or status projections | supported through multiple evidence adapters | must stay review-only and never become acceptance, truth, or authority |
| Self-work trace evidence | causal trace over work packet, operator decision, verification, happening/frontier refs | supported by `edge-self-work-trace-evidence` adapter | no major gap; remains source evidence input, not projection substrate |
| Platform append-log join/status | Platform consequence evidence interpreted by append-log happening refs | supported by append-log happening map and Edge Platform review status chain | must preserve Platform ownership; no Edge Platform-state promotion |
| Frontier candidate | collaborative causal frontier pressure | supported by local-layer frontier candidate adapter | needs explicit writer/reader policy before promotion; no backend ownership |
| Autobase projection view candidate | collaborative derived view over linearized entries | supported as evidence-only projection-view adapter | promotion must decide if view is source or derived; current answer should be derived |
| Optimistic intake evidence/status | append/intake/acceptance pressure | supported as evidence-only optimistic intake adapter | acceptance semantics must not equal append success |
| Imported JSON/files and `$EDGE_STATE` paths | source/import scaffolds only | not continuity material | never promote; paths may appear only as compatibility/import provenance |

## Required Interpretation Questions

For any candidate, causal-substrate should be able to answer:

- What happened?
- Which observer or basis saw it?
- Which branch, segment, happening, frontier, present point, or referent is
  implicated?
- Which source refs are preserved?
- Which share boundary is crossed?
- Is the material a coarse happening, refined happening, composite happening,
  derived view, or review/status observation?
- Does it preserve observer-relative posture?
- Does it preserve resolution-relative refinement?
- Does it distinguish coarse happening from refined happening?
- Does it represent divergence, ambiguity, breakage, reconciliation, or
  stabilization when needed?
- Does it block truth, authority, settlement, runtime, backend, and canonical
  history overclaims?

## Current Gaps

The current adapter set is sufficient for promotion prep, but not for a
promotion decision by itself.

Remaining gaps before promotion:

- Spine/Edge must name the exact promoted artifact kind and schema.
- Edge must decide whether the promoted material is source event, log entry,
  or derived view.
- Writer and reader policies must be explicit.
- Acceptance and reconciliation semantics must be separated from append success,
  replica visibility, and review availability.
- If a candidate lacks causal refs, it must say whether causal refs are
  deferred, derived, or required before promotion.
- Testbed must pressure the final promoted shape, not just adjacent proof
  artifacts.

## Candidate-Specific Posture

Recommended causal posture if projection events are selected:

```text
repo-owned evidence
-> source refs
-> causal refs
-> projection event as source/share-boundary happening
-> projection log entry as preservation record
-> derived operator view as replaceable view
```

This keeps the projection event as the semantic continuity input, the log entry
as the preservation/storage record, and operator status as derived presentation.

## Non-Goals

- no causal-substrate-owned Edge backend;
- no production Autobase backend;
- no opening Edge Corestore or Autobase during review;
- no Edge state migration;
- no causal truth claim;
- no canonical history acceptance;
- no Platform authority transfer;
- no mesh settlement;
- no renderer authority;
- no treating Testbed review as readiness.

## Review Result

The best current fit is:

```text
projection event = likely semantic candidate
projection log entry = likely storage record
operator situation/review statuses = derived views
Autobase/frontier materials = pressure for future multiwriter promotion
JSON/files/state roots = never-promote scaffolds
```

This is a fit review only. It is not a promotion decision.
