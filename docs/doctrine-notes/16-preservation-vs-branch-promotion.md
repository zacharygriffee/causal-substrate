# Preservation Versus Branch Promotion

## Purpose

This note prevents branch overgrowth while preserving room for historically important data that may later matter to orthogonal consumers.

The goal is to keep the repository from turning every threshold-bearing process into its own branch.

## Current doctrinal rule

Preservation is broader than branch promotion.

The current line is:

- some information is important enough to preserve
- some preserved information is important enough to shape continuity judgments
- only some of that deserves its own branch

So:

- preserve broadly when future meaning may matter
- branch narrowly when independent continuity matters

## What preservation means

Preservation means the data should remain available in local history, support records, happenings, artifacts, or other durable forms because later interpretation may depend on it.

Preserved data may be:

- partially interpreted
- not yet understood by the current observer
- mainly relevant to an orthogonal concern
- more useful to a downstream repo than to the current local concern

That still does not mean it deserves its own branch.

## What branch promotion means

Branch promotion means something becomes its own continuity-bearing unit.

Promotion is justified when at least some of the following become true:

- it needs independent replay
- it needs independent wake/sleep history
- it needs its own lineage or fork pressure
- it needs its own continuity judgment
- it needs to be exchanged or replicated as its own continuity surface

If those are not true, a new branch is usually premature.

## Anti-micro-fiber rule

Do not micro-fiber the branches.

That means:

- not every threshold-bearing process becomes a branch
- not every support process becomes a branch
- not every contributor to an observer becomes a branch

Many low-level processes may remain:

- triggers
- salience channels
- support records
- happening metadata
- local auxiliary durable records

without needing first-class branch promotion.

## Capability evolution rule

A branch may evolve or de-evolve without forcing branch replacement.

Capability change should first be interpreted as:

- basis revision
- effective basis reduction or expansion
- changed downstream ambiguity or continuity pressure

Only when that change materially destabilizes continuity should lineage pressure appear.

So:

- preserve capability change
- revise basis explicitly when needed
- branch-fork only when continuity can no longer honestly stay same-branch

## Current implementation implication

For current labs and code:

- support records may be durable without being branches
- branch-worthy continuity should remain comparatively sparse
- branch promotion should be deliberate, not automatic
- downstream repos such as geometry or operator layers may reinterpret preserved support records without requiring those records to have been branchified here

## What remains open

The repository does not yet claim:

- a final support-record taxonomy
- a final auxiliary stream taxonomy
- a final promotion threshold function
- a final rule for when support history becomes a first-class branch

## Working rule

Preserve more than you branchify.

A thing deserves its own branch when its own continuity matters, not merely because its data matters.
