# Local and Shared Artifacts

## Purpose

This note defines the current boundary between local continuity and exchangeable artifacts so backend work does not force ontology decisions too early.

## Current doctrinal rule

Source continuity is local by default.

Shared artifacts are explicit projections, receipts, or claims derived from local continuity.

## Local by default

The following should be treated as local-first unless explicitly projected for exchange:

- raw segment history
- raw trigger history
- private salience policy
- unprojected context internals
- full local continuity structure

## Candidate shared artifacts

The following are plausible exchange artifacts:

- anchors
- bindings
- lineage claims
- convergence or co-bind receipts
- receipts
- views
- state estimates

Shared artifacts should carry:

- basis or effective basis
- provenance
- authorship or origin when available

## What this commits the repo to

- exchange does not imply global truth
- projection is explicit
- peers may exchange partial surfaces without sharing full local history

## What remains open

The repository does not yet claim:

- the final artifact taxonomy
- the final receipt format
- which shared artifacts require signatures

## Working implementation implication

For labs and code:

- separate local continuity records from exchange surfaces
- never treat imported artifacts as universal truth
- require provenance on anything meant to circulate
