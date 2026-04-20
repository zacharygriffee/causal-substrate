# Next Phases

This document lists the recommended phases after the initial lab program.

The lab program is complete. The next work should tighten the pressured doctrine where needed and begin building more serious local prototypes without rushing into decentralized backends.

Status note:

- the phases listed below have now been implemented in an initial pass
- the document is retained as the record of what those phases were meant to accomplish
- further phase planning now depends on choosing the next product or research direction explicitly

## Phase 5: Post-Lab Doctrine Consolidation

Status:

- initial pass completed

Goal:

- turn repeated lab findings into tighter doctrine where the pressure is now concrete

Focus:

- branch continuation vs branch split thresholds
- nucleus composition and merge-pressure doctrine
- boundary ambiguity posture
- portal interface grouping question
- provenance strength and artifact envelope posture
- comparability and compatibility artifact boundaries

Outputs:

- updated doctrine docs
- narrowed defaults where justified
- explicit list of still-open questions that remain intentionally unresolved

Success condition:

- the repo can clearly state which doctrine tightened because of the labs and which questions remain intentionally open

## Phase 6: Kernel Refinement For Local Prototypes

Status:

- initial pass completed

Goal:

- add the smallest useful helpers and structures needed to support richer local prototypes

Focus:

- helper APIs for branch split pressure
- helper APIs for multi-nucleus successor representation
- stronger provenance structure for emitted artifacts
- optional artifact envelope types
- optional comparison surface or comparability records

Outputs:

- refined TypeScript kernel
- tests covering the new helper surfaces
- no commitment yet to decentralized transport or persistence

Success condition:

- the kernel is easier to use for local prototypes without collapsing unresolved ontology questions into fixed semantics

## Phase 7: Local Prototype Track

Status:

- initial pass completed

Goal:

- build one or more serious local prototypes that exercise the substrate beyond isolated lab scenarios

Recommended prototype directions:

- continuity workstation for wake/sleep, nuclei, and lineage
- context and portal surface explorer
- referent tracking and ambiguity viewer
- local artifact emission and inspection tool

Outputs:

- working local applications or prototype modules
- prototype-driven doctrine notes
- clearer evidence for which abstractions deserve promotion into the kernel

Success condition:

- at least one local prototype uses multiple substrate concepts together under realistic pressure

## Phase 8: Shared Artifact Formalization

Status:

- initial pass completed

Goal:

- formalize what can leave local continuity and in what form

Focus:

- artifact classes
- provenance requirements
- receipt structure
- basis carriage on emitted surfaces
- comparison and co-bind surfaces

Outputs:

- artifact taxonomy
- explicit artifact schemas or type definitions
- tests proving local-first posture is preserved

Success condition:

- the repo has a coherent shared-artifact layer without implying global truth or mandatory convergence

## Phase 9: Backend and Exchange Exploration

Status:

- initial pass completed

Goal:

- begin experimenting with decentralized-friendly persistence and exchange only after the local artifact layer is ready

Possible directions:

- filesystem persistence
- Hypercore/Corestore
- Autobase-backed shared surfaces

Outputs:

- backend abstraction work
- persistence experiments
- exchange experiments using explicit artifacts rather than raw local continuity

Success condition:

- persistence and exchange experiments preserve the ontology rather than forcing the ontology to conform to the backend

## Recommended Immediate Order

Work the next phases in this order:

1. Phase 5: post-lab doctrine consolidation
2. Phase 6: kernel refinement for local prototypes
3. Phase 7: local prototype track
4. Phase 8: shared artifact formalization
5. Phase 9: backend and exchange exploration

## What Happens Next

The current phase list is exhausted in initial form.

The next round needs an explicit choice about which direction to optimize for:

- deeper doctrine closure
- stronger local prototype productization
- artifact and exchange standardization
- decentralized backend experimentation

## Current Bias

Current implementation bias:

- keep the in-memory kernel small and subordinate
- bias the first serious substrate lab toward Corestore and Hypercore
- add Hyperbee only when indexing and catalog pressure becomes real

See [`./corestore-hypercore-plan.md`](./corestore-hypercore-plan.md).
