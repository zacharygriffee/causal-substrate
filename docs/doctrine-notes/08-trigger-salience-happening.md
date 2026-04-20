# Trigger, Salience, Happening

## Purpose

This note turns the three concepts into a usable pipeline without collapsing them.

## Current doctrinal rule

- `Trigger` is threshold crossing
- `Salience` is observer-relative weighting of significance
- `Happening` is preserved clustered registration

## Minimum flow

1. a change crosses a threshold and becomes a trigger
2. an observer or policy weights that trigger by salience
3. one or more triggers may be preserved as a happening when doctrine or policy warrants it

## What this commits the repo to

- not every trigger becomes a happening
- salience may differ across observers
- a happening may cluster multiple triggers
- historical preservation pressure is distinct from mere detection

## Special case

Coarse historical imports may contain happenings without fully preserved trigger detail.

When that occurs, provenance should indicate that the happening is:

- imported
- summarized
- or missing lower-level trigger history

## What remains open

The repository does not yet claim:

- a fixed clustering rule
- a final salience representation
- whether salience revision should rewrite or append historical interpretation

## Working implementation implication

For labs and code:

- keep triggers, salience policy, and happenings distinct
- allow happenings to reference multiple triggers
- allow history to preserve a happening even when trigger detail is partial
