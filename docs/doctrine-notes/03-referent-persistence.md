# Referent Persistence

## Purpose

This note establishes the minimum doctrine for when referent tracking continues, weakens, or breaks without pretending identity is fully solved.

## Current doctrinal rule

Referent persistence is judged by continuity plausibility under available basis and evidence.

It is not judged by name reuse alone and not judged by absence alone.

## Minimum persistence states

For current doctrine, a tracked referent may be treated as:

- `continuing`: continuity remains plausible
- `ambiguous`: continuity is underdetermined
- `broken`: continuity is no longer plausible enough to carry forward as the same tracked continuity

These are also the current implementation defaults for labs.

## What should inform the judgment

- available basis
- binding history
- inertia expectations
- volatility expectations
- contradictory evidence
- re-identification pressure

## What this commits the repo to

- ambiguity is a first-class outcome
- continuation is allowed without certainty
- breakage requires more than mere non-observation
- referent tracking should remain revisable

## What remains open

The repository does not yet claim:

- a universal scoring formula
- a fixed evidence threshold
- a single split/merge rule for referents

## Working implementation implication

For labs and code:

- prefer explicit persistence state over implicit boolean identity
- allow state revision over time
- allow multiple candidate continuities when ambiguity becomes the central fact
