# TODO

## Current Posture

- preserve ontology and working defaults first
- keep the in-memory kernel small and doctrine-oriented
- treat Corestore/Hypercore as the first real substrate for meaningful labs
- add Hyperbee only when lookup, registry, or indexing pressure is real
- do not treat the in-memory layer as proof of the full substrate

## Completed

- [x] ontology docs and doctrine floor
- [x] hole analysis and doctrine notes
- [x] working defaults for current labs
- [x] initial 10-lab local program
- [x] post-lab synthesis and next-phase docs
- [x] local prototype and filesystem backend exploration
- [x] Corestore/Hypercore implementation posture document
- [x] verify latest `corestore` version and pin it
- [x] add managed Corestore backend with deterministic namespaces
- [x] avoid duplicate in-process Corestore root opens per storage path
- [x] ensure namespaced sessions and managed roots close cleanly
- [x] add first serious working core split
  - [x] `branch-happenings`
  - [x] `segments`
  - [x] `referent-state`
  - [x] `exchange-artifacts`
- [x] add proof tests for managed Corestore behavior
  - [x] deterministic namespace reuse
  - [x] append/read across planned cores
  - [x] clean close and reopen without residual lock behavior in test path

## Corestore-First Plan

### Now

- [ ] define the first serious Corestore lab record schema
  - [ ] branch happenings
  - [ ] sleep capsules / segments
  - [ ] referent anchors / persistence state estimates
  - [ ] views / bindings / lineage claims / receipts
- [ ] build a first serious Corestore lab adapter on top of the managed backend
  - [ ] use one deterministic concern namespace for the lab
  - [ ] provide typed append helpers per stream
  - [ ] provide readback helpers per stream
- [ ] implement the first real Corestore lab
  - [ ] wake activity on a branch stream
  - [ ] sleep capsule emission on a segment stream
  - [ ] referent persistence estimate emission on a referent stream
  - [ ] derived artifact emission on an exchange stream
  - [ ] readback proving the continuity/artifact split is workable
- [ ] add proof tests for the first real Corestore lab
  - [ ] append-only ordering
  - [ ] local continuity vs shared artifact separation
  - [ ] structured record readback consistency across streams
  - [ ] clean reopen after close using the lab adapter

### Next

- [ ] decide whether Hyperbee is actually needed
  - [ ] branch id -> core references
  - [ ] referent id -> anchor references
  - [ ] context id -> member references
  - [ ] named artifact lookup
  - [ ] concern indexing
- [ ] formalize artifact envelopes for Corestore-backed emission
- [ ] decide whether the first serious lab should stay JSON-encoded or move to a stricter schema format

### Later

- [ ] replication labs
- [ ] NoiseSecretStream majority experiments
- [ ] fakeswarm-based swarm testing
- [ ] transport concerns
- [ ] Autobase or higher-order shared surfaces

## Rules

- never reopen the same Corestore root independently in-process
- always close namespaced sessions and managed roots correctly
- use deterministic namespaces for concern-grouped Hypercores
- keep source continuity local by default
- make shared artifacts explicit
- keep views derived and replaceable
- do not let indexing layers replace continuity-bearing Hypercores as the primary substrate
