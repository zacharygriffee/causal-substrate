# causal-substrate

`causal-substrate` is an ontology-first kernel for observer-scoped causal continuity.

It is not:

- chat memory
- generic event sourcing
- a centralized truth engine
- mandatory consensus machinery

It is meant to model how causality becomes realized, tracked, persisted, inherited, and related across:

- observers
- branches
- referents
- contexts
- portals
- views
- wake/sleep segments

The current repository posture is intentionally conservative. The kernel encodes the minimum structural primitives and invariants needed to represent continuity without prematurely fixing the semantics of identity, convergence, compatibility, equivalence, or agreement.

## Repository shape

- [`docs/ontology.md`](./docs/ontology.md): conceptual posture, non-goals, and load-bearing distinctions
- [`docs/doctrine.md`](./docs/doctrine.md): doctrinal commitments and repository rules
- [`docs/doctrine-consolidation.md`](./docs/doctrine-consolidation.md): tightened doctrine after completing the initial lab program
- [`docs/doctrine-holes.md`](./docs/doctrine-holes.md): current logical pressure points and recommended doctrine-first responses
- [`docs/doctrine-notes/`](./docs/doctrine-notes/README.md): ordered focused doctrine notes that tighten each hole enough for lab and implementation work
- [`docs/stable-posture.md`](./docs/stable-posture.md): current settled, open, and deferred posture in one teachable entrypoint
- [`docs/inspectability-contract.md`](./docs/inspectability-contract.md): current bounded explanation contract and the remaining inspectability gaps
- [`docs/doctrine-notes/15-peer-observer-operator-boundary.md`](./docs/doctrine-notes/15-peer-observer-operator-boundary.md): transport/runtime versus continuity versus coordination boundary
- [`docs/doctrine-notes/16-preservation-vs-branch-promotion.md`](./docs/doctrine-notes/16-preservation-vs-branch-promotion.md): preserve broadly, branch narrowly
- [`docs/doctrine-notes/17-discovery-bearing-branches.md`](./docs/doctrine-notes/17-discovery-bearing-branches.md): derive bounded discovery join sets from branch structure before registries
- [`docs/doctrine-notes/18-capability-surfaces.md`](./docs/doctrine-notes/18-capability-surfaces.md): compact negotiation between rendezvous and continuity exchange
- [`docs/doctrine-notes/19-pulsed-rendezvous.md`](./docs/doctrine-notes/19-pulsed-rendezvous.md): topic join is admission, while rendezvous completion requires pulsed discovery and connection evidence
- [`docs/working-defaults.md`](./docs/working-defaults.md): current lab defaults to use unless an experiment explicitly models an exception
- [`docs/post-lab-synthesis.md`](./docs/post-lab-synthesis.md): what the completed lab program established and what it still leaves open
- [`docs/corestore-hypercore-plan.md`](./docs/corestore-hypercore-plan.md): current implementation posture for serious substrate labs
- [`docs/corestore-record-schema-v1.md`](./docs/corestore-record-schema-v1.md): current versioned record model and schema evolution posture
- [`docs/adjacent-boundaries.md`](./docs/adjacent-boundaries.md): ownership lines with Virtualia, mesh layers, and adjacent control-plane repos
- [`docs/consumer-adoption.md`](./docs/consumer-adoption.md): teachable adoption seams, patterns, and anti-patterns for consumers
- [`docs/multiwriter-boundary.md`](./docs/multiwriter-boundary.md): exact line between continuity-bearing histories and any future shared-writer surfaces
- [`docs/shared-artifacts.md`](./docs/shared-artifacts.md): current artifact formalization for local-first and pre-backend work
- [`docs/next-phases.md`](./docs/next-phases.md): recommended phases after the initial lab program
- [`labs/`](./labs/README.md): lab scaffold, registry, template, and starter specs for the local lab program
- [`prototypes/`](./prototypes/README.md): local-first prototype entrypoints built on top of the kernel
- [`docs/doctrine-roadmap.md`](./docs/doctrine-roadmap.md): phased doctrine work sequence
- [`docs/kernel.md`](./docs/kernel.md): minimal kernel design and invariants
- [`docs/open-questions.md`](./docs/open-questions.md): unresolved questions preserved on purpose
- [`src/kernel/types.ts`](./src/kernel/types.ts): ontology types
- [`src/kernel/substrate.ts`](./src/kernel/substrate.ts): small in-memory proof-of-concept substrate
- [`examples/minimal-continuity.ts`](./examples/minimal-continuity.ts): executable example

## Minimal kernel

The current proof of concept includes:

- `Branch`
- `Segment`
- `Happening`
- `Nucleus`
- `Referent`
- `Binding`
- `Context`
- `Portal`
- `View`
- lineage metadata
- optional inertia/volatility/state-estimate hooks

The implementation remains local-first and backend-agnostic. It uses an in-memory store today so later persistence backends can be added without changing the ontology.

Current implementation bias:

- the in-memory kernel remains the ontology scaffold
- the first serious substrate labs should bias toward Corestore and Hypercore
- Hyperbee should remain secondary unless indexing needs force it

The current consumer posture also includes a mesh-agnostic adapter seam: persisted continuity records can be reconstructed into explicit continuity, inspectability, transition, and derived discovery surfaces without importing swarm, peer, or authority ownership into the core substrate.

## Quick start

```bash
npm install
npm test
npm run test:hyperswarm
npm run smoke:hyperswarm-discovery
npm run example
```

`npm run test:hyperswarm` is an opt-in real transport lane. It uses actual `hyperswarm` and Noise streams rather than `fakeswarm`, keeps generous timeouts, and defaults to a local `hyperdht` testnet. The current proof surface includes direct-peer transport, pulsed topic rendezvous, Corestore replication, transport-adjacent capability negotiation with bounded artifact exchange, actual-topic transport proofs for the phase-2 emergence cases, actual-topic proofs for same-branch capability evolution and split lineage with carry-forward inheritance, receiver-side reconstruction of inspectability plus transition-decision surfaces after transport catchup, and discovery-derived multi-topic rendezvous that still narrows exchange through capability surfaces rather than treating discovery as authority. It can still take `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` as a comma- or space-separated bootstrap list when you want explicit DHT bootstrap hosts.

`npm run smoke:hyperswarm-discovery` is an independent discovery-only smoke. It exercises topic rendezvous without Corestore replication, pulses `discovery.refresh()` explicitly, and prints per-swarm transport state. Set `CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1` to run it against the public network, and `CAUSAL_SUBSTRATE_DISCOVERY_PEERS=3` or higher to practice a small discovery mesh instead of a pair.

## Development posture

Prefer additions that:

- preserve observer-relative structure
- keep basis explicit and revisable
- treat convergence/agreement as optional higher-order behavior
- avoid forcing global identity or truth
- leave decentralized persistence as a backend concern rather than a core primitive

Transport note:

- topic join alone is not treated as sufficient rendezvous proof
- actual rendezvous is an active pulsed phase over discovery sessions
- the working posture is `join -> refresh/flushed/flush pulses -> connection evidence`
