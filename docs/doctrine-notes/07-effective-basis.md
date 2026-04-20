# Effective Basis

## Purpose

This note introduces the working notion of `effective basis` for branches, views, portals, and comparisons.

## Current doctrinal rule

`Basis` is what distinctions a continuity could preserve or compare in principle.

`Effective basis` is what distinctions are actually available for the current operation, projection, or judgment.

## Minimum rule

Effective basis may be:

- declared
- computed
- inherited
- projected
- degraded

But it must never silently become wider than what the source continuity actually preserves or exposes.

## What this commits the repo to

- effective basis may be narrower than declared basis
- degradation and projection should be explicit
- cross-basis comparison requires a declared or derivable projection

## Practical rule for local labs

For now:

- branches keep a declared basis
- views, portal exposures, and comparisons may declare an effective basis
- if no effective basis is declared, consumers must not assume more than the declared basis safely supports

## What remains open

The repository does not yet claim:

- a full algebra for basis composition
- a canonical basis merge operation
- a final rule for incompatible bases

## Working implementation implication

For labs and code:

- record basis provenance where projection or degradation occurs
- never compare as though an implicit shared basis existed
