# Human Getting Started

This is the short human walkthrough for `causal-substrate`.

If you do not want to read the whole doctrine set first, start here.

## What this repo is for

`causal-substrate` is for systems that need to preserve and explain continuity over time.

That means questions like:

- what is still in play
- what changed
- what context is primary right now
- what is only visible through a boundary
- whether a tracked thing is still continuing, ambiguous, or broken

It is not mainly about:

- rendering
- transport
- operator policy
- orchestration
- central truth

It is the continuity layer underneath those kinds of systems.

## The short mental model

Use these ideas first:

- `Branch`: a continuity line
- `Segment`: an active wake chunk of that branch
- `Happening`: a meaningful registered change
- `Referent`: something being tracked across change
- `Context`: where continuity is situated
- `Portal`: directional exposure from one context into another
- `Nucleus`: carried-forward continuity anchor across sleep or succession
- `Artifact`: an explicit thing you emit when something should cross a boundary

If you remember only one rule, remember this:

- source continuity stays local, explicit artifacts cross boundaries

## What another repo should consume first

If you are building an adjacent repo, do not start by consuming raw branch history.

Start with the bounded consumer surfaces:

- continuity situation
- transition summary
- active referents with bounded reasoning
- inspectability surfaces when you need to explain why

In practical terms, another repo should first ask:

1. what is active
2. what changed
3. why

That is the current intended seam.

## What this repo should own

`causal-substrate` should own:

- continuity structure
- continuity persistence
- continuity replay
- continuity ambiguity
- explicit exchange artifacts
- bounded inspectability

## What this repo should not own

An adjacent repo should continue to own its own concerns.

Examples:

- `Virtualia` should own geometry and world-specific layout
- `mesh-ecology-edge` should own operator grammar, policy, and publication decisions
- mesh-facing integration layers should own transport/runtime participation assumptions

If a concept is about control, rendering, deployment, or authority around continuity, it probably belongs outside this repo.

## A simple adoption walkthrough

Imagine you are building a repo that tracks some long-lived thing.

Start like this:

1. model the observer branch locally
2. model the relevant context locally
3. model the referent branch locally
4. append happenings and sleep capsules as continuity changes
5. emit referent state estimates when continuity is judged
6. emit explicit artifacts only when something should be shared or inspected elsewhere
7. expose a bounded consumer picture instead of raw internals by default

That gives you:

- local-first continuity
- inspectable judgments
- explicit exchange boundaries

without requiring centralized truth or consensus machinery.

## Which doc to read next

Choose the next doc based on what you are trying to do.

If you want the repo role:

- read [first-finished-version.md](./first-finished-version.md)

If you want adoption boundaries:

- read [consumer-adoption.md](./consumer-adoption.md)

If you want artifact posture:

- read [shared-artifacts.md](./shared-artifacts.md)

If you want inspectability guarantees:

- read [inspectability-contract.md](./inspectability-contract.md)

If you want adjacent repo boundaries:

- read [adjacent-boundaries.md](./adjacent-boundaries.md)

## Current teaching line

The simplest accurate sentence for this repo right now is:

- `causal-substrate` is the local-first continuity layer that preserves what continues, what changed, and what can be shared explicitly without pretending to be a global truth engine.
