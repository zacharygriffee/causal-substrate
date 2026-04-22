# Transport Finish-Line Note

This note states what transport proves for the first finished version of `causal-substrate`, what it does not prove, and why transport remains secondary to continuity.

## Current posture

For the first finished version:

- Corestore and Hypercore remain the primary serious substrate
- transport exists to exchange, replicate, and rendezvous around continuity-bearing material
- transport does not define continuity truth

The repository currently demonstrates:

- direct-peer replication over real `hyperswarm`
- topic-based discovery and pulsed rendezvous
- capability-limited exchange after rendezvous
- discovery-derived multi-topic rendezvous without default registry dependence
- replay-backed reconstruction after exchange

## What transport proves

Transport work in this repository proves that:

- continuity-bearing material can replicate across peers without a central truth store
- bounded discovery can be derived from continuity structure rather than asserted globally by default
- rendezvous can stay broader than the eventual exchange surface
- capability negotiation can narrow what crosses a transport boundary without being mistaken for continuity breakage
- a receiving peer can reconstruct bounded continuity, transition, and inspectability surfaces from durable records after catchup

## What transport does not prove

Transport work in this repository does not prove that:

- discovery creates truth
- a swarm topic is equivalent to a branch
- capability agreement implies continuity agreement
- publication implies correctness
- replication resolves ambiguity automatically
- network reachability settles identity, convergence, or authority

## Why Hyperbee remains supplementary

Hyperbee remains supplementary because the primary substrate pressure here is:

- append-only continuity
- replay of known continuity-bearing streams
- explicit exchange artifacts

Hyperbee becomes relevant only when there is concrete pressure for:

- lookup
- indexing
- discovery catalogs
- named registries

That means Hyperbee may still be useful later, but it is not required to demonstrate the first finished version.

## Why multiwriter remains optional

The first finished version does not require multiwriter support for normal continuity work.

Single-writer or custody-bound continuity histories remain the default posture.

Multiwriter remains an optional later embedding for cases like:

- shared coordination surfaces
- explicit injectible branches
- special policy-bearing shared controls

It is not required for the first finished version to demonstrate observer-scoped causal continuity.

## Finish-line rule

Transport should continue to be judged by this rule:

- does it help continuity-bearing material replicate, rendezvous, and remain inspectable without redefining continuity itself

If the answer is no, the transport feature is likely pushing beyond the first finished version boundary.

## Public-network hardening posture

For the first finished version, an additional public-network hardening pass is not required as a finish gate.

The current rationale is:

- the repository already has real `hyperswarm` transport proofs
- it already has an independent public-network discovery smoke
- public-network behavior remains probabilistic enough that repeated hardening passes are better treated as ongoing operational work rather than as a doctrine or finish-line dependency

That means later public-network hardening is still worthwhile, but it should be treated as post-finish robustness work rather than as a blocker on the first finished version.
