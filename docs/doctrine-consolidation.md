# Doctrine Consolidation

This document captures the first post-lab doctrine consolidation pass.

It does not attempt to close every open question. It tightens the doctrine only where repeated lab pressure made a narrower statement defensible.

## Consolidated Rules

### 1. Branch continuation vs split pressure

Current consolidated rule:

- continuation remains the default only when continuity is being explicitly carried on the same branch
- split pressure should be represented explicitly through authored successor branches and lineage edges
- the substrate does not auto-promote pressure into a split

This keeps the ontology honest while avoiding hidden identity heuristics.

### 2. Multi-nucleus successors

Current consolidated rule:

- successor continuity may carry multiple inherited nuclei
- multi-nucleus inheritance is representable as merge-pressure or composite inheritance
- the semantic meaning of that composition remains intentionally open

This narrows the representation rule without pretending merge semantics are solved.

### 3. Boundary ambiguity posture

Current consolidated rule:

- ambiguous placement should remain representable without forcing multi-primary-context support
- the default representation is one primary context plus ambiguity carried in metadata, views, or authored surfaces
- boundary ambiguity does not automatically create branch split pressure

### 4. Portal grouping posture

Current consolidated rule:

- directional portals remain the default primitive
- paired directional portals are sufficient for mutual exposure
- no higher-order portal grouping primitive is part of the core yet

This avoids adding symmetry pressure before there is implementation need.

### 5. Provenance posture

Current consolidated rule:

- provenance must be explicit on emitted artifacts
- metadata remains acceptable for local-stage provenance
- typed provenance should be used for explicit artifact envelopes

### 6. Comparability posture

Current consolidated rule:

- partial comparability may be represented without convergence
- compatibility and comparability may be recorded through explicit surfaces or artifacts
- neither compatibility nor convergence becomes a core primitive by default

## Still Open On Purpose

This consolidation does not settle:

- exact branch continuation thresholds
- semantic interpretation of multi-nucleus composition
- final boundary ambiguity artifact form
- whether paired portals ever need a shared interface wrapper
- final provenance schema for exchanged artifacts
- final compatibility or comparison artifact taxonomy

## Implementation Implication

The kernel may now safely add:

- helper APIs for explicit split pressure
- helper APIs for multi-nucleus successor representation
- typed artifact envelopes with provenance
- optional comparison surfaces

without claiming more doctrine than the labs actually supported.
