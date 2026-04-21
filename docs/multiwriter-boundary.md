# Multi-Writer Boundary

This document clarifies exactly where multi-writer support may still be justified and where it should remain out of bounds for the current substrate.

The current repository posture is still conservative:

- multi-writer is not required by default
- core continuity histories should remain single-writer or custody-bound
- if multi-writer ever appears first, it should appear in narrowly scoped shared surfaces

## Where multi-writer may still be justified

### Shared artifact surfaces

This is the strongest candidate for any first multi-writer experiment.

Examples:

- co-observation receipts
- shared claim bundles
- convergence evidence lanes
- comparison or compatibility surfaces
- explicit exchange artifacts that many observers may append to

Why this is acceptable:

- these surfaces are already explicit and artifact-like
- they do not need to redefine source continuity
- provenance can remain first-class
- disagreement can remain preserved rather than overwritten

### Shared coordination surfaces

This is the second acceptable candidate.

Examples:

- custody handoff proposals
- admission requests
- seat availability or occupancy coordination
- writer-management or coordination records
- explicit coordination around what should be observed, compared, or exposed next

Why this is acceptable:

- coordination is not the same as continuity-bearing history
- these surfaces are naturally policy-bearing
- they can tolerate provisional or admitted writing more honestly than observer continuity can

### Explicitly injectible branches or contexts

This is the highest-risk case and should remain exceptional.

Examples:

- a branch deliberately declared injectible
- a context that admits external seeded contributions
- a custodial seat or prepared continuity surface that allows admitted insertion

Required posture:

- injectibility must be explicit
- provenance must be preserved
- admission policy must be explicit
- custody must be clear
- injection must not be silently equated with ordinary continuation

## What should remain single-writer or custody-bound

The following should stay single-writer or custody-bound by default:

- primary observer branches
- wake/sleep segment histories
- nucleus carry-forward
- default local referent tracking
- default local contexts
- branch-local source continuity generally

The reason is simple:

- these are the surfaces most likely to distort if shared authorship is treated casually
- they are the surfaces where observer-relative continuity is the point
- replication does not require them to become jointly writable

## Explicit line between continuity and coordination

The boundary is:

- continuity-bearing branches preserve what an observer or referent carries forward
- shared coordination surfaces preserve proposals, admissions, claims, or receipts around that continuity

That means:

- continuity surfaces should not become shared-writer by convenience
- coordination surfaces may become shared-writer if a concrete use case requires it

## Autobase and optimistic writing posture

`Autobase` or other multi-writer tooling should remain deferred for now.

If it is revisited later, the first acceptable lane is:

- provisional shared-claim surfaces
- shared coordination surfaces
- explicit artifact aggregation lanes

It should not be used first for:

- primary observer continuity
- wake/sleep segment streams
- nuclei
- default referent branch histories

Optimistic writing is only compatible with this repo’s current doctrine when the target surface is already provisional, explicit, and non-authoritative.

## Current repository rule

Short term:

- no multi-writer requirement for serious substrate work
- no first use on core continuity-bearing histories
- no hidden injection into ordinary branches

Later:

- a narrow multi-writer lane may be explored if concrete pressure justifies it
- until then, the repository should treat multi-writer as clearly deferred rather than half-assumed
