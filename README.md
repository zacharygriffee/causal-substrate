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
- [`docs/doctrine-holes.md`](./docs/doctrine-holes.md): current logical pressure points and recommended doctrine-first responses
- [`docs/doctrine-notes/`](./docs/doctrine-notes/README.md): ordered focused doctrine notes that tighten each hole enough for lab and implementation work
- [`docs/working-defaults.md`](./docs/working-defaults.md): current lab defaults to use unless an experiment explicitly models an exception
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
