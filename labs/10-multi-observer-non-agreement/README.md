# Multi-Observer Non-Agreement Lab

## Metadata

- id: `lab-10`
- priority: `later`
- phase: `4`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test observers tracking overlapping referents without forced agreement
- test coexistence of partial comparability without convergence

## Primary Doctrine Under Test

- observer-relative truth posture
- comparability vs convergence
- agreement as optional behavior

## Working Defaults Used

- local source continuity by default
- shared artifacts do not imply global truth

## Scenario

Multiple observers track overlapping or nearby continuities while preserving their own bases and judgments. The lab should test whether non-agreement can remain representable without collapsing into incompatibility by default.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) by modeling two observers with different bases, distinct bindings to the same referent continuity, divergent continuity estimates, and a partial comparability view without convergence.

## Expected Outcomes

- overlapping tracking can coexist without mandatory convergence
- non-agreement remains representable without default incompatibility

## Observations

- overlapping tracking can coexist without mandatory convergence or forced incompatibility
- different basis quality can drive different observer judgments over the same tracked continuity
- a partial comparability surface is enough to represent relation without turning it into agreement

## Doctrine Pressure Exposed

- the kernel can hold non-agreement cleanly, but it still lacks stronger first-class comparability or compatibility artifacts
- observer-relative disagreement is currently expressed through parallel state estimates and derived views rather than a dedicated comparison object

## Decision / Defer / Open Question

- decision: preserve non-agreement as a normal representable condition
- defer: whether comparability or compatibility should become first-class artifact types
- open question: what minimum structure should a future comparison artifact carry without collapsing into convergence or agreement

## Follow-Up

- carry this forward into future shared-artifact and comparison work if exchange surfaces begin needing explicit comparability records
