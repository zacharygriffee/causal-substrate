# Observer vs Branch

## Purpose

This note fixes the minimal relation between `Observer` and `Branch` so they do not collapse into two names for the same thing.

## Current doctrinal rule

An `Observer` is the enduring locus of distinction-preserving capacity.

A `Branch` is a specific continuity instance of preserved distinctions.

An observer may anchor zero, one, or many branches across time and situation.

## What this commits the repo to

- observer is primary for observer-scoped continuity
- observer alone does not determine branch identity
- branch identity depends on more than the observer label
- multiple branches may be associated with the same observer
- a branch may continue, fork, degrade, or resume without changing which observer it is anchored to

## Minimum branch anchor

For now, an observer-scoped branch should be understood as anchored by:

- an observer
- a basis
- a situated continuity condition
- carried inheritance, when relevant

This is not a final identity formula. It is the minimum structure needed to avoid collapse.

## What remains open

The repository does not yet claim:

- the exact rule that creates a new branch
- the exact rule that proves continuation of an existing branch
- whether every branch must be observer-anchored in the same way

## Working implementation implication

For labs and code:

- model observers and branches as distinct records
- allow one observer to own multiple branches
- never infer that changing branch implies changing observer
- never infer that same observer implies same branch
