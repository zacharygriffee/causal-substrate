# Peer, Observer, Operator Boundary

## Purpose

This note separates transport/runtime participation from continuity and from higher-order custody or coordination.

The goal is to preserve decentralized implementation freedom without collapsing:

- `peer`
- `observer`
- `branch`
- `operator`

into one concept.

## Current doctrinal rule

`Peer`, `Observer`, `Branch`, and `Operator` are adjacent but not identical.

The current line is:

- a `peer` is a runtime or transport participant
- an `observer` is a locus that preserves distinctions
- a `branch` is a continuity-bearing history
- an `operator` is a custody or coordination role over one or more observers, branches, peers, or other operators

No one of these should silently substitute for the others.

## Peer

A peer is the network/runtime unit that joins transport surfaces such as swarm participation and replication.

A peer may:

- host local continuity
- replicate continuity
- custody one or many branch histories
- remain read-only for some histories

A peer does not automatically define the continuity unit.

So the repository should not assume:

- one peer = one branch
- one peer = one observer
- one peer = one operator

## Observer

An observer is the locus that preserves distinctions across change.

An observer may be:

- embodied by one peer
- supported by many lower-level processes
- supervised by an operator
- replicated onto other peers for transport or custody reasons

But observerhood is still about preserved distinctions, not about transport placement.

## Branch

A branch remains the continuity-bearing unit.

Branches may be:

- hosted by one peer
- replicated across many peers
- supervised by one operator
- supervised by nested higher-order operators

But branch continuity should not be rewritten merely because custody or hosting changes.

## Operator

An operator is a higher-order custody or coordination role.

An operator may:

- manage one or many peers
- manage one or many observers
- manage one or many branches
- manage lower-order operators

This means operators may be nestable.

But operator nesting is not itself proof of branch continuity.

An operator may also have its own observer branch if it preserves distinctions in its own right. That remains optional and earned, not automatic.

## Nesting posture

The repository should allow nested coordination and custody without collapsing continuity.

That means:

- operators may contain or supervise operators
- peers may be grouped under operators
- branches may be grouped or custodied under operators

But:

- grouping does not automatically create branch identity
- custody change does not automatically create branch identity
- transport placement does not automatically create branch identity

## Current implementation implication

For current and near-future labs:

- treat peers as runtime/replication participants
- treat branches as continuity units
- treat operator concerns as higher-order coordination surfaces unless a later lab proves they need their own continuity representation

This keeps swarm integration from silently redefining the ontology.

## What remains open

The repository does not yet claim:

- a final operator schema
- a final recursively nestable scope primitive
- a final custody artifact taxonomy
- a final mapping from peer bundles to operator bundles

## Working rule

Use transport/runtime terms for runtime concerns.

Use continuity terms for continuity concerns.

Do not let swarm topology silently become continuity topology.
