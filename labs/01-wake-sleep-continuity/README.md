# Wake/Sleep Continuity Lab

## Metadata

- id: `lab-01`
- priority: `now`
- phase: `2`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test observer branch continuity across wake and sleep segmentation
- test nucleus carry-forward into resumed activity
- test when resumed activity looks like continuation versus new branch pressure

## Primary Doctrine Under Test

- observer vs branch anchoring
- nucleus vs lineage
- segmented history

## Working Defaults Used

- one primary context
- local source continuity by default

## Scenario

An observer branch enters wake, records one or more happenings, seals into sleep, then resumes with inherited nucleus. The lab should pressure the boundary between straightforward continuation and the point where resumed activity should start looking like branch-split pressure.

## Implementation Posture

Doc-plus-code. Implemented as a concrete scenario in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) covering sealed segment inheritance, resumed continuity, and explicit split pressure on a sibling branch.

## Expected Outcomes

- continuation across sealed and resumed segments can be represented clearly
- inherited nucleus remains distinct from lineage description
- the lab exposes where branch continuation doctrine is still thin

## Observations

- a resumed wake can inherit a carried nucleus cleanly on the same branch
- the same observer can also own a second branch when continuity pressure is modeled explicitly as a split
- lineage metadata and inherited nucleus remain representable as separate structures in the same scenario

## Doctrine Pressure Exposed

- branch continuation still depends on doctrine outside the current kernel; the model can represent both continuation and split, but not decide between them automatically
- nucleus transfer is operationally distinct from lineage description in practice, which supports keeping them separate

## Decision / Defer / Open Question

- decision: keep resumed continuity and split pressure as explicit modeled alternatives rather than hidden inference
- defer: exact branch continuation criteria remain open
- open question: what minimum condition should justify promoting resumption pressure into a new branch by default

## Follow-Up

- add a future split-threshold doctrine note once later labs create enough pressure to narrow continuation rules
