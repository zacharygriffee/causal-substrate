# Inertia And Volatility Pressure

## Purpose

This note tightens the current doctrine for continuity under absence without pretending the repository has a final universal scoring model.

## Current doctrinal rule

`Inertia` and `Volatility` are interpretive pressures, not truth engines.

They help explain how continuity estimates move between:

- `continuing`
- `ambiguous`
- `broken`

They do not eliminate basis limits, ambiguity, or observer-relative interpretation.

## Minimum doctrinal distinction

The repository should now distinguish at least three pressure cases:

- `neutral absence`
  - no encounter was strongly expected, so silence alone should not count as breakage
- `weak negative evidence`
  - an expected encounter was missed, so continuity weakens, but absence alone still should not force breakage
- `strong negative evidence`
  - contradictory evidence or a decisive conflict appears, so continuity may become broken

## Inertia

`Inertia` expresses how strongly a referent is expected to continue under absence.

High inertia means continuity remains plausible through short gaps.

Low inertia means silence should weaken confidence more quickly.

## Volatility

`Volatility` expresses how much surrounding conditions are expected to change.

High volatility makes continuity under absence less secure.

Low volatility allows absence to remain more neutral.

## What this commits the repo to

- continuity under absence should be explained, not guessed
- contradiction pressure is distinct from mere non-observation
- absence alone should usually weaken continuity before it breaks it
- inertia and volatility can support provisional lab heuristics without becoming fixed universal law

## What remains open

The repository does not yet claim:

- a final numeric scoring system
- a universal accumulation function for missed encounters
- a final shared format for exporting pressure judgments across observers

## Working implementation implication

For current labs and code:

- a provisional helper may classify absence as neutral, weak-negative, or strong-negative
- that helper should remain explicit and replaceable
- resulting continuity estimates should still be recorded as ordinary `StateEstimate` artifacts
