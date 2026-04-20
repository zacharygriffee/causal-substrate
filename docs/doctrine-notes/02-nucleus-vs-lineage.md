# Nucleus vs Lineage

## Purpose

This note separates inherited continuity from ancestry description.

## Current doctrinal rule

`Nucleus` is operational inheritance.

`Lineage` is ancestry relation.

They may be related, but neither reduces to the other.

## Nucleus

A nucleus is the carry-forward core made available to successor continuity.

It answers:

- what is inherited forward
- what anchor is being carried
- what prior continuity remains active in the successor

## Lineage

Lineage records how continuities or segments stand in relation to one another.

It answers:

- what came from what
- whether a split, merge, continuation, or seed-origin relation is being claimed
- what ancestry structure is being asserted

## What this commits the repo to

- lineage may exist without fully specifying inherited core
- inherited core may matter even when ancestry is obvious
- successor continuity should be able to carry one or more nuclei
- lineage edges and nuclei should be stored as distinct structures

## What remains open

The repository does not yet claim:

- whether every lineage relation implies nucleus transfer
- whether every nucleus must correspond to a single lineage edge
- how nucleus composition works in merge-like situations

## Working implementation implication

For labs and code:

- store lineage as explicit relation metadata
- store nucleus as carry-forward inheritance data
- avoid using lineage edges as a substitute for inheritance payload
