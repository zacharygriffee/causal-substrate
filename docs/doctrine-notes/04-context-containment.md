# Context Containment

## Purpose

This note makes `Context` structurally meaningful rather than descriptive metadata.

## Current doctrinal rule

A context is a containment-bearing continuity that situates observers, referents, and other branches.

Containment changes what can be encountered, inherited, exposed, or interpreted.

## Minimum containment effects

Containment should minimally affect:

- situated placement
- access and exposure
- cross-boundary interpretation
- portal mediation

## Practical rule for local labs

For now, a branch or active segment should have exactly one primary situated context at a time.

Additional relation to outside contexts should be represented through:

- portals
- bindings
- views
- explicit lineage or comparison artifacts

Ambiguous placement may still be represented explicitly, but multi-primary-context support is not a core default.

This keeps local labs tractable without claiming that multi-sited continuity is impossible in principle.

## What this commits the repo to

- context membership is not just labeling
- moving across contexts is structurally relevant
- nested contexts may exist
- portal behavior depends on context boundaries rather than ordinary parent/child structure

## What remains open

The repository does not yet claim:

- the full semantics of simultaneous multi-context situatedness
- the exact rule for entering or leaving context
- whether context change always creates branch pressure

## Working implementation implication

For labs and code:

- give contexts explicit identifiers and boundaries
- record primary context on situated branches or segments
- treat cross-context awareness as mediated rather than automatic
