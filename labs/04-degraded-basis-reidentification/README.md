# Degraded Basis Re-identification Lab

## Metadata

- id: `lab-04`
- priority: `now`
- phase: `2`
- status: `completed`
- implementation-boundary: `doc-plus-code`

## Objective

- test how effective basis narrowing changes tracking quality
- test when degraded basis preserves continuity well enough
- test when degraded basis produces ambiguity instead of forced identity

## Primary Doctrine Under Test

- effective basis
- referent persistence
- ambiguous continuity

## Working Defaults Used

- `continuing` / `ambiguous` / `broken` persistence states
- local source continuity by default

## Scenario

Two tracking passes occur over what may be the same referent, but the second pass uses a narrower or degraded effective basis. The lab should test when degraded basis still supports continuity and when it only supports ambiguity.

## Implementation Posture

Doc-plus-code. Implemented in [`test/core-labs.test.ts`](../../test/core-labs.test.ts) by pairing a full-basis observer and a degraded-basis observer against the same referent and comparing their resulting persistence outcomes.

## Expected Outcomes

- effective basis narrowing materially changes what can be claimed
- degraded basis can still support continuation in some cases
- degraded basis can force ambiguity without forcing artificial breakage

## Observations

- explicit basis degradation can be represented with provenance using `degradedFrom`
- full basis and degraded basis can support different continuity judgments over the same tracked referent
- ambiguity is a better outcome than forced breakage when degraded basis loses decisive distinctions

## Doctrine Pressure Exposed

- the current kernel can record degraded basis provenance, but it does not yet compute effective basis automatically
- continuity judgments still rely on explicit authored estimates rather than a substrate-level comparison mechanism

## Decision / Defer / Open Question

- decision: keep effective basis narrow and explicit rather than inferred broadly
- defer: basis algebra and automatic effective-basis computation
- open question: what minimal comparison machinery is needed before basis interactions become executable rather than authored

## Follow-Up

- use later labs to determine whether effective basis should stay descriptive or gain computed helpers
