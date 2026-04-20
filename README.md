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
- [`docs/working-defaults.md`](./docs/working-defaults.md): current lab defaults to use unless an experiment explicitly models an exception
- [`docs/post-lab-synthesis.md`](./docs/post-lab-synthesis.md): what the completed lab program established and what it still leaves open
- [`docs/corestore-hypercore-plan.md`](./docs/corestore-hypercore-plan.md): current implementation posture for serious substrate labs
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

## Quick start

```bash
npm install
npm test
npm run example
```

## Development posture

Prefer additions that:

- preserve observer-relative structure
- keep basis explicit and revisable
- treat convergence/agreement as optional higher-order behavior
- avoid forcing global identity or truth
- leave decentralized persistence as a backend concern rather than a core primitive
