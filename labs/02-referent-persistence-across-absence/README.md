# Referent Persistence Across Absence Lab

## Metadata

- id: `lab-02`
- priority: `now`
- phase: `2`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test `continuing`, `ambiguous`, and `broken` persistence outcomes
- test how inertia, volatility, and contradictory evidence affect continuity judgment
- test how absence differs from actual contradiction

## Primary Doctrine Under Test

- referent persistence
- negative evidence
- lineage over forced identity

## Working Defaults Used

- `continuing` / `ambiguous` / `broken` persistence states
- local source continuity by default

## Scenario

An observer tracks a referent, then loses direct observation for a period. The lab should compare neutral absence, weak negative evidence, and strong contradiction to see when the tracked continuity stays plausible, becomes ambiguous, or breaks.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) as three explicit persistence estimates over the same tracked referent under neutral absence, ambiguity, and contradiction.

## Expected Outcomes

- all three persistence states are usable under concrete conditions
- absence and contradiction remain separate interpretive categories
- ambiguity emerges as an honest operational state rather than a temporary error

## Observations

- the three-state persistence set is sufficient for early local labs
- ambiguity behaves as a stable operational state rather than a temporary error
- contradiction and absence can be represented as distinct reasons for different persistence outcomes

## Doctrine Pressure Exposed

- the kernel can represent persistence outcomes, but it still leaves threshold-setting and evidence accumulation to doctrine or higher-level policy
- stronger future labs will need a clearer structure for weak versus strong negative evidence

## Decision / Defer / Open Question

- decision: keep `continuing` / `ambiguous` / `broken` as the minimum state set
- defer: scoring or threshold formulas for moving between states
- open question: when should prolonged ambiguity fork into multiple candidate continuities instead of remaining one ambiguous track

## Follow-Up

- add a later pressure lab for prolonged absence and escalating negative evidence
