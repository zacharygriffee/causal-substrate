# Primary Context and Directional Portal Lab

## Metadata

- id: `lab-03`
- priority: `now`
- phase: `2`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test one-primary-context situatedness
- test outside relevance through directional portal exposure
- test how portal-mediated awareness differs from direct colocated access

## Primary Doctrine Under Test

- context containment
- portal contract
- local situatedness

## Working Defaults Used

- one primary context
- directional portals

## Scenario

An observer is situated in a room context while a hallway context is exposed through a doorway portal. The lab should test what can be encountered directly in the room versus what can only be encountered as constrained directional exposure from the hallway.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) with one primary situated observer branch in a room context, an external hallway referent, a directional portal, and a portal-derived view.

## Expected Outcomes

- one primary context remains workable without flattening external relevance
- portal-mediated awareness stays distinct from direct colocated access
- directional exposure semantics remain sufficient without symmetry assumptions

## Observations

- one primary context remains workable for local labs without losing outside relevance
- direct colocated structure and external portal-mediated structure stay distinct in the model
- a directional portal plus a derived view is enough to represent outside awareness without symmetric assumptions

## Doctrine Pressure Exposed

- the kernel can represent directional portal structure, but portal semantics remain descriptive rather than behavioral
- context placement is explicit, but boundary transition behavior still needs later pressure

## Decision / Defer / Open Question

- decision: keep one primary context and directional portals as current lab defaults
- defer: exact rules for context transition and boundary ambiguity
- open question: what minimum behavioral semantics should a portal eventually guarantee, if any

## Follow-Up

- carry this forward into the boundary ambiguity and two-portal labs
