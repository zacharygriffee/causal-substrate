# Capability Surfaces

## Purpose

This note defines the missing layer between discovery topics and continuity-bearing branch or artifact exchange.

The goal is to let peers explain what they can witness, emit, request, or translate after rendezvous without forcing topics to carry too much meaning and without treating handshake metadata as continuity itself.

## Current doctrinal rule

Capability surfaces should mediate exchange after rendezvous and before continuity-bearing material moves.

The current line is:

- topics are rendezvous projections
- capability surfaces are compact negotiation surfaces
- branches and artifacts remain the continuity-bearing material

This means:

- a topic gets peers into contact
- a capability surface determines whether exchange is relevant
- a branch does not need to be transmitted merely because a topic matched

## What a capability surface is for

A capability surface should answer bounded questions such as:

- which branch roles can this peer witness?
- which basis dimensions can it currently preserve or compare?
- which contexts is it situated within?
- which contexts are only portal-visible?
- which artifact kinds can it emit?
- which artifact kinds does it want in return?
- does it offer raw witness continuity, bounded views, receipts, or state estimates only?

This keeps post-rendezvous exchange selective and inspectable.

## What a capability surface is not

A capability surface should not be treated as:

- the branch itself
- proof of continuity
- proof of compatibility
- proof of co-reference
- authority over another peer's branch history

It remains a bounded declaration of exchange posture.

## Capability versus continuity

The repository should keep the following split:

- topics carry discovery posture
- capability surfaces carry exchange posture
- branches carry continuity
- artifacts carry explicit claims over continuity

This split keeps discovery and negotiation useful without letting either substitute for actual preserved history.

## Boundedness rule

Capability surfaces should stay compact.

The current lean is:

- declare basis or capability constraints
- declare offered and requested exchange modes
- declare relevant branch roles or concern classes
- do not dump full branch state into the handshake

This prevents the middle layer from becoming an opaque shadow copy of the branch.

## Mediation rule

Capability mismatch should not immediately imply irrelevance.

The current line is:

- direct witness exchange may be impossible under a capability mismatch
- mediated views, receipts, or bounded summaries may still be relevant
- capability filtering should narrow exchange, not force premature disconnection

This is important for cases like:

- an observer that lacks one basis dimension
- a peer that can offer only derived views
- a peer that can receive raw witness continuity but emit only receipts

## Transport posture

Capability surfaces are transport-adjacent, not transport-owning.

They may later be carried over:

- `protomux`
- a higher-order wrapper such as `neonplex`
- another channel negotiation surface

But the doctrine should remain abstract enough that no single transport helper becomes part of the ontology.

## What remains open

The repository does not yet claim:

- a final capability surface schema
- a final channel negotiation protocol
- a final division between session-scoped and durable capability material
- a final privacy posture for capability disclosure
- a final mapping between capability declaration and exchange authorization

## Working rule

Treat capability surfaces as compact, versioned negotiation surfaces between rendezvous and exchange.

Topics say where contact happens.
Capability surfaces say what exchange is plausible.
Branches and artifacts remain the material that actually carries continuity.
