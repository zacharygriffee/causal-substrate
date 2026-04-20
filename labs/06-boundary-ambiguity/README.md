# Boundary Ambiguity Lab

## Metadata

- id: `lab-06`
- priority: `next`
- phase: `3`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test ambiguous placement near context edges
- test whether ambiguity is better represented as unresolved placement, portal-mediated relevance, or branch pressure

## Primary Doctrine Under Test

- context containment
- portal mediation
- ambiguity representation

## Working Defaults Used

- one primary context
- directional portals

## Scenario

A referent or observer remains near a context boundary where direct placement is unclear. The lab should test whether the ambiguity belongs in context placement, directional exposure, or continuity pressure.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) by representing an observer with one primary context, a referent branch with unresolved placement, and a directional portal plus ambiguity view.

## Expected Outcomes

- boundary ambiguity can be represented without premature context resolution
- the model clarifies whether ambiguity belongs in placement, exposure, or continuity

## Observations

- unresolved placement can be represented explicitly without forcing the boundary referent into a primary context
- one primary context remains intact for the observer while portal-mediated relevance handles nearby external pressure
- ambiguity belongs usefully in placement metadata and derived views before it needs to become branch pressure

## Doctrine Pressure Exposed

- the kernel can represent ambiguous placement, but it does not yet distinguish whether ambiguity should stay local metadata, become a stronger artifact, or trigger continuity pressure automatically
- boundary transition behavior remains doctrinal rather than behavioral

## Decision / Defer / Open Question

- decision: keep ambiguous placement representable without forcing multi-primary-context support
- defer: exact thresholds for when placement ambiguity becomes context transition or branch pressure
- open question: should ambiguous placement eventually gain a first-class artifact beyond metadata and views

## Follow-Up

- revisit this in later context-transition labs if boundary ambiguity starts recurring as more than a descriptive pressure
