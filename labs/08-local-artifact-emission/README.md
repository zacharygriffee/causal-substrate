# Local Artifact Emission Lab

## Metadata

- id: `lab-08`
- priority: `next`
- phase: `3`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test emitting explicit shareable artifacts from local continuity
- test provenance and basis carriage on views, bindings, lineage claims, and receipts

## Primary Doctrine Under Test

- local/shared artifact boundary
- provenance
- replaceable views and explicit claims

## Working Defaults Used

- local source continuity by default
- shared artifacts require basis and provenance when relevant

## Scenario

Local continuity remains private while a constrained set of derived artifacts is emitted for possible later exchange. The lab should test what can be emitted without implying that raw history became shared truth.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) by keeping raw continuity local while explicitly emitting a binding, lineage claim, view, and state estimate with provenance metadata.

## Expected Outcomes

- local continuity stays local by default
- emitted artifacts carry enough provenance for later exchange work
- shared artifacts remain explicit projections rather than silent truth claims

## Observations

- raw continuity can remain local while explicit artifacts are emitted separately
- the current kernel is already sufficient to model several artifact classes without adding decentralized machinery
- provenance can be carried today through explicit metadata on emitted surfaces

## Doctrine Pressure Exposed

- the repo still lacks a more formal emitted-artifact envelope or receipt structure
- provenance is currently descriptive metadata rather than a stronger typed contract

## Decision / Defer / Open Question

- decision: keep artifact emission explicit and local-first
- defer: final shared artifact taxonomy and receipt format
- open question: when should provenance stay metadata and when should it become a first-class field or artifact wrapper

## Follow-Up

- use later decentralized and exchange work to decide whether explicit artifact wrappers are necessary
