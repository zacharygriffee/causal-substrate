# Two-Portal Mutual Exposure Lab

## Metadata

- id: `lab-07`
- priority: `next`
- phase: `3`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test bidirectional visibility as two directional portals rather than one symmetric primitive
- test whether asymmetry matters in practice

## Primary Doctrine Under Test

- portal contract
- directional exposure
- context boundary asymmetry

## Working Defaults Used

- directional portals
- one primary context

## Scenario

Two adjacent contexts allow mutual but not necessarily identical exposure. The lab should model this as two directional portals and test whether asymmetry needs to be preserved explicitly.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) by modeling mutual exposure between two contexts as paired directional portals with non-identical exposure rules.

## Expected Outcomes

- two directional portals are sufficient for mutual exposure cases
- asymmetry can be preserved when the two directions do not behave identically

## Observations

- two directional portals are sufficient to represent mutual exposure without inventing a symmetric primitive
- asymmetry matters immediately once the exposure rules differ in the two directions
- paired portals preserve the current portal doctrine cleanly

## Doctrine Pressure Exposed

- the kernel can represent paired portals, but it has no higher-order helper for treating them as one conceptual interface when needed
- the doctrine still needs to decide whether paired portals should ever be grouped under a shared construct

## Decision / Defer / Open Question

- decision: retain directional portal semantics as the default
- defer: whether a higher-order interface construct is needed above paired portals
- open question: what minimal shared structure, if any, should connect two directional exposures without implying symmetry

## Follow-Up

- use later exchange-facing work to decide whether paired portals need shared receipts or interface metadata
