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

- [x] define the first serious Corestore lab record schema
  - [x] branch happenings
  - [x] sleep capsules / segments
  - [x] referent anchors / persistence state estimates
  - [x] views / bindings / lineage claims / receipts
- [x] build a first serious Corestore lab adapter on top of the managed backend
  - [x] use one deterministic concern namespace for the lab
  - [x] provide typed append helpers per stream
  - [x] provide readback helpers per stream
- [x] implement the first real Corestore lab
  - [x] wake activity on a branch stream
  - [x] sleep capsule emission on a segment stream
  - [x] referent persistence estimate emission on a referent stream
  - [x] derived artifact emission on an exchange stream
  - [x] readback proving the continuity/artifact split is workable
- [x] add proof tests for the first real Corestore lab
  - [x] append-only ordering
  - [x] local continuity vs shared artifact separation
  - [x] structured record readback consistency across streams
  - [x] clean reopen after close using the lab adapter

### Next

- [x] consolidate the Corestore-only path
  - [x] keep serious substrate work on Corestore/Hypercore only
  - [x] avoid Hyperbee unless concrete lookup or registry pressure appears
  - [x] treat known-core access and stream replay as the default posture
- [ ] harden the Corestore record model
  - [x] stabilize branch happening records
  - [x] stabilize sleep capsule records
  - [x] stabilize referent state estimate records
  - [x] stabilize exchange artifact records
  - [ ] decide whether JSON remains sufficient or stricter schema validation is needed
- [x] implement a multi-segment continuity lab on Hypercores
  - [x] append multiple wake/sleep cycles for one observer branch
  - [x] prove carried nuclei across several sealed segments
  - [x] verify continuation history remains readable without an index layer
- [x] implement a referent tracking lab on Hypercores
  - [x] append successive referent state estimates over time
  - [x] represent `continuing`, `ambiguous`, and `broken` as stream history
  - [x] prove absence and contradiction pressure can be read from append-only records
- [x] implement an exchange artifact lab on Hypercores
  - [x] emit views as explicit exchange records
  - [x] emit bindings as explicit exchange records
  - [x] emit lineage claims as explicit exchange records
  - [x] emit receipts as explicit exchange records
  - [x] prove exchange surfaces remain derived and replaceable
- [x] implement a cross-core reconstruction pass
  - [x] reconstruct a local picture by reading the four working cores together
  - [x] measure where known-core replay stays tractable
  - [x] note any lookup pain precisely instead of assuming an index is needed
- [ ] formalize artifact envelopes for Corestore-backed emission

### Later

- [ ] make the Hyperbee decision only after Corestore-only pressure is demonstrated
  - [ ] branch id -> core references
  - [ ] referent id -> anchor references
  - [ ] context id -> member references
  - [ ] named artifact lookup
  - [ ] concern indexing
- [ ] replication labs
  - [x] prove two-Corestore replication over Hypercore using `fakeswarm`
  - [ ] extend replication beyond the current single-writer proof
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
