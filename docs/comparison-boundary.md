# Comparison Boundary

This document states where comparison belongs inside `causal-substrate` and where it should remain in adjacent layers.

## What `causal-substrate` should own

`causal-substrate` should own:

- the vocabulary for:
  - comparability
  - compatibility
  - equivalence
  - convergence
- durable comparison surfaces
- replay and inspectability for comparison claims
- generic bounded consumer comparison pictures
- the rule that comparison remains explicit and non-authoritative

## What `causal-substrate` should not own

`causal-substrate` should not become:

- a full comparison engine
- a scoring policy engine
- a threshold-tuning layer for app decisions
- a hidden identity resolver
- an agreement or consensus authority

## What adjacent layers should own

Adjacent repos or adapters should own:

- domain-specific comparison strategy
- flexible scoring logic
- thresholds for action
- clustering policy consequences
- consumer-specific consequences of comparison outcomes

Examples:

- Edge-like consumers may decide what operator attention means
- geometry/world consumers may decide what comparison changes imply spatially
- mesh-facing adapters may decide what comparison surfaces are worth publishing

## Current implementation posture

The repository currently supports:

- explicit comparison artifacts
- replay-backed comparison claims
- inspectable basis/projection references
- bounded reason codes and evidence ids
- generic consumer comparison pictures

The repository currently gives strongest operational weight to:

- comparability
- compatibility

It keeps:

- equivalence
- convergence

as optional and provisional.

## Core rule

Comparison pressure may be recorded here.

Comparison strategy may be applied elsewhere.

That split is what keeps `causal-substrate` useful to multiple adjacent repos without turning it into a hidden reasoning authority.
