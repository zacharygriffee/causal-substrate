# Portal Contract

## Purpose

This note defines the smallest useful standard contract for portals.

## Current doctrinal rule

A portal is a directional, constrained exposure from a source context into a target context.

Its job is to mediate access, not to duplicate or unify contexts.

## Minimum portal contract

Every portal should specify:

- source context
- target context
- exposure rule
- optional transform

## Directionality

Portals should be treated as directional by default.

If symmetric exchange is needed, model that as:

- two portals
- or a higher-order construct built from directional portal semantics

This avoids smuggling full equivalence into a single portal object.

`Portal` remains the working term. Related terms may be explored later, but the repo should not rename the concept yet without implementation pressure.

## What a portal does not imply

A portal does not imply:

- full visibility into the source context
- context identity transfer
- global agreement about what the source context contains
- uninterrupted continuity across the boundary

## What this commits the repo to

- portals are membranes, not children
- filtered exposure is first-class
- transform remains explicit when present

## What remains open

The repository does not yet claim:

- a universal portal type system
- how portal composition should work
- whether portals can carry receipts or guarantees

## Working implementation implication

For labs and code:

- make portal direction explicit
- require exposure rule
- keep transform optional but named
- do not treat portal traversal as identity or truth transfer
