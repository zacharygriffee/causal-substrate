# View Boundary

## Purpose

This note keeps derived representation from silently becoming source truth.

## Current doctrinal rule

A `View` is a projection over source continuity.

It may summarize, cluster, transform, or materialize a surface for use, but it never replaces the underlying preserved continuity.

## Minimum requirements for a view

Every persisted or shared view should identify:

- source identifiers
- projection description
- basis or effective basis
- provenance when relevant

## What this commits the repo to

- views are replaceable
- views may be regenerated
- views must refer back to source continuity
- source continuity is never overwritten by view materialization

## Evidence status

A view may itself become evidence of what was projected or shared, but not of exhaustive source truth.

This means:

- a view can be evidence that a particular projection existed
- a view cannot by itself settle every underlying continuity question

## What remains open

The repository does not yet claim:

- a final stable view schema
- when a view becomes durable enough to exchange routinely
- how view versioning should work

## Working implementation implication

For labs and code:

- track view provenance
- keep source IDs attached
- avoid writing code that mutates source continuity through a view abstraction
