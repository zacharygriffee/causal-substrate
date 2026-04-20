# Trigger to Happening Clustering Lab

## Metadata

- id: `lab-05`
- priority: `now`
- phase: `2`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test triggers that do not become happenings
- test observer-relative salience differences over similar triggers
- test clustering of multiple low-level triggers into one preserved happening

## Primary Doctrine Under Test

- trigger/salience/happening distinction
- observer-relative importance
- preserved historical registration

## Working Defaults Used

- local source continuity by default
- one primary context

## Scenario

A sequence of low-level threshold crossings occurs. Some stay as raw triggers, some are weighted differently by observer salience, and some are clustered into a single preserved happening.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) by creating a trigger stream across two observer branches, clustering one branch into a preserved happening, and leaving the other branch with only raw triggers.

## Expected Outcomes

- trigger detection can exist without preserved happening creation
- different salience policies can produce different preserved outcomes
- a clustered happening stays distinct from its underlying trigger history

## Observations

- raw trigger detection can exist without preserved happening creation
- clustered happenings can reference multiple triggers cleanly
- different observer salience postures can yield different preserved outcomes from similar low-level detections

## Doctrine Pressure Exposed

- the current kernel records salience only on happenings, not as a richer standalone policy artifact
- clustering remains authored rather than determined by substrate logic

## Decision / Defer / Open Question

- decision: keep trigger detection, salience, and happening preservation distinct
- defer: formal clustering rules and richer salience representation
- open question: should salience revision append new interpretation or rewrite earlier preserved historical framing

## Follow-Up

- use later labs to decide whether salience needs a first-class artifact beyond happening metadata
