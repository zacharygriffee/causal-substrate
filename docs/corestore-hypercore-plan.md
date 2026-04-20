# Corestore / Hypercore Plan

This document sets the current implementation posture for `causal-substrate`.

The repo remains ontology-first, but the first serious substrate labs should now bias toward Corestore and Hypercore rather than stopping at in-memory object structures.

## Posture

Use a hybrid path:

1. keep a very small in-memory model for ontology clarity and API sketching
2. treat Corestore and Hypercore as the first real substrate for meaningful labs
3. introduce Hyperbee only when indexing or catalog needs become real

The in-memory layer is still useful, but it is not the target substrate.

## Why Hypercore / Corestore First

Plain in-memory objects are enough to clarify:

- branch nouns and relationships
- trigger to salience to happening flow
- context and portal shape
- referent persistence states
- minimal view boundary rules

They are not enough to pressure the full substrate because they do not naturally exercise:

- append-only continuity
- local/shared artifact boundaries
- provenance
- replication
- decentralized exchange
- branch chunking and sleep capsules
- receipt and view distribution

Hypercore and Corestore exercise those concerns more honestly while preserving the repo’s local-first and decentralized-friendly posture.

## Current Bias

Favor:

- `Corestore` as the local container of causal artifact feeds
- `Hypercore` as the append-only history surface for continuity-bearing material
- `Hyperbee` only as an index and registry layer when needed

Working split:

- `Hypercore` = truth-bearing continuity and artifact streams
- `Hyperbee` = lookup, discovery, and catalog overlays

## First Serious Artifact Classes

The first serious Corestore / Hypercore lab should focus on these artifact classes:

- branch happenings
- sleep capsules or segments
- referent anchors and persistence state
- views, receipts, bindings, and lineage claims

Working stream layout:

- one core for branch happenings
- one core for segments and sleep capsules
- one core for referent anchors and persistence state
- one core for views, receipts, and exchange artifacts

This layout is a working direction, not a settled schema.

## Hyperbee Role

Add Hyperbee only when we need:

- branch id to core references
- referent id to anchor core references
- context id to member references
- named artifact lookup
- concern indexing

Hyperbee should not become the primary truth substrate unless strong implementation pressure justifies it.

## Doctrine Constraints

The following positions remain binding while implementing:

- observer-first and local-first posture
- one primary situated context per active branch or segment by default
- portals directional by default
- referent persistence states are `continuing`, `ambiguous`, and `broken`
- source continuity is local by default
- shared artifacts are explicit by default
- views are derived and replaceable
- preserved history is not overwritten by views
- convergence is evidence, not authority
- no assumed central truth store
- decentralized exchange is preferred over server-centric truth

## Minimal Implementation Sequence

### 1. Keep the in-memory kernel small

Use the current in-memory kernel only to:

- clarify ontology and API shape
- support fast scenario iteration
- support unit tests for doctrine pressure

Do not treat it as proof of the full substrate.

### 2. Add a Corestore / Hypercore lab adapter

The next real substrate step should be a small adapter layer that can:

- open a Corestore
- create named Hypercores for the working artifact classes
- append encoded records to those Hypercores
- read them back into usable local surfaces

### 3. Keep indexing secondary

Only after the first append-only lab is meaningful should the repo add:

- Hyperbee-based lookup
- artifact registries
- concern indexing

### 4. Delay broader backend complexity

Do not rush into:

- Autobase
- elaborate replication orchestration
- generalized distributed indexing
- server-centric sync layers

before the first Corestore / Hypercore lab proves the artifact split is workable.

## Immediate Outcome

The next implementation work should not replace the current in-memory kernel. It should subordinate it.

The in-memory kernel remains the ontology scaffold.

The next meaningful substrate lab should target Corestore and Hypercore directly.
