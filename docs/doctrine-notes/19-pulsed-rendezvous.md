# Pulsed Rendezvous

Topic join is not treated as sufficient rendezvous proof.

`causal-substrate` now treats rendezvous as an active transport phase rather than a passive side effect of joining a topic once.

## Why this note exists

Real `hyperswarm` testing showed a practical failure mode:

- two peers can join the same topic
- both can perform the initial discovery refresh triggered by `join()`
- neither peer may ever surface a usable candidate from that first window
- no connection opens
- replication never starts

The failure is not a replication failure. It occurs earlier, at the transport rendezvous boundary.

## Current rule

Use this posture for topic-based discovery:

1. join the topic once
2. retain the returned discovery session
3. treat rendezvous as incomplete until connection evidence exists
4. pulse discovery explicitly when needed

The current working pulse is:

- `discovery.refresh({ client: true, server: true })`
- `discovery.flushed()`
- `swarm.flush()`

These pulses are budgeted rather than continuous.

## What counts as rendezvous success

Rendezvous success is demonstrated by connection evidence, not by topic join alone.

Useful success indicators include:

- one or more `connection` opens
- nonzero connection counts
- discovery state showing repeated refreshes rather than only the initial join-triggered refresh

`join()` is admission into a discovery surface.

Rendezvous completion is a stronger claim:

- the surface was joined
- discovery was refreshed enough to surface candidates
- transport actually opened

## What this does not mean

This note does not imply:

- constant polling forever
- repeated `join()` calls
- guaranteed full mesh in every situation
- that transport success implies continuity agreement

Transport rendezvous remains a lower layer than continuity interpretation.

## Why this is doctrine and not just implementation detail

The repository now relies on topic-based discovery for meaningful decentralized-friendly proofs.
If rendezvous is modeled as passive when it is operationally active, the doctrine becomes misleading.

The doctrine-safe formulation is:

- branch structure can derive coarse discovery join sets
- capability surfaces can narrow what happens after rendezvous
- actual rendezvous is an active pulsed phase
- continuity and artifact exchange begin only after transport has actually opened

## Current implementation implication

When a lab or prototype needs topic-based rendezvous, prefer the reusable rendezvous helper rather than hand-rolling:

- join both or all peers
- pulse discovery on a bounded schedule
- stop once connection evidence is sufficient
- record transport state for inspection on failure
