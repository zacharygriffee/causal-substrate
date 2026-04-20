# Split/Merge Pressure Lab

## Metadata

- id: `lab-09`
- priority: `later`
- phase: `4`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test lineage-first handling of split and merge pressure
- test when nucleus transfer is clean versus composite or unresolved

## Primary Doctrine Under Test

- nucleus vs lineage
- referent continuity pressure
- branch ancestry structure

## Working Defaults Used

- local source continuity by default
- `continuing` / `ambiguous` / `broken` persistence states

## Scenario

A tracked continuity splits, merges, or appears to do so under limited basis. The lab should test whether lineage-first handling remains workable and where nucleus composition needs stronger doctrine.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) by modeling a seed referent continuity, explicit split lineage into two successors, sealed nuclei on those successors, and a merge-pressure branch inheriting multiple nuclei.

## Expected Outcomes

- lineage-first handling remains usable under split and merge pressure
- the model exposes where nucleus composition needs stronger rules

## Observations

- lineage-first handling remains workable under explicit split and merge pressure
- multiple inherited nuclei can already be represented on a successor continuity without changing the kernel
- split and merge ancestry remain clearer when expressed through lineage edges rather than forced identity claims

## Doctrine Pressure Exposed

- nucleus composition is representable but not yet interpreted by doctrine beyond explicit carry-forward
- the kernel can store multi-nucleus inheritance, but it does not explain what a merged nucleus should mean semantically

## Decision / Defer / Open Question

- decision: keep lineage-first handling as the default posture under split and merge pressure
- defer: any stronger semantic rule for composite nucleus meaning
- open question: when should a multi-nucleus successor remain one continuity versus become an unresolved merge surface instead

## Follow-Up

- revisit if future labs require computed merge semantics rather than explicit authored ancestry and inheritance
