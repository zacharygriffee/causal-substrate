# TODO

## Lab Objectives

The initial local lab program is complete.

The next phase is no longer basic lab setup. It is post-lab consolidation and prototype-directed follow-through.

Each lab should:

- test a specific doctrinal pressure point
- use the current working defaults unless explicitly modeling an exception
- record what it pressures in the ontology
- avoid silently expanding the core model

## Lab Program Rules

- follow current working defaults unless the lab explicitly models an exception
- keep doctrine pressure visible rather than hiding it in implementation detail
- treat unresolved outcomes as useful results when they expose real ontology pressure
- record doctrine changes explicitly rather than silently absorbing them into code

## Priority Bands

### Now

- all initial labs are complete

### Next

- post-lab doctrine consolidation
- kernel refinement for local prototypes
- next phase list and prototype planning

### Later

- shared artifact formalization
- backend and exchange exploration

## Lab Output Template

Each lab should produce:

- scenario description
- doctrinal assumptions used
- implementation posture used
- expected outcomes before running
- observations after running
- doctrine pressure exposed
- decision, defer, or open question
- required doc or code follow-up

## Success Criteria

### Per lab

A lab is successful if it does at least one of the following:

- confirms a working doctrine rule under concrete use
- exposes a real ambiguity that should remain open
- exposes a real ambiguity that now needs a narrower rule
- shows a current default is too weak, too strong, or misplaced

### For the lab program

The initial lab program is successful if:

- the first five labs can be run locally without decentralized mechanisms
- each lab produces reusable doctrine feedback
- the repo gains enough stability to start building more serious local prototypes
- the remaining doctrine questions become more concrete and less speculative

## Decision Capture

For each completed lab, capture:

- defaults confirmed
- defaults pressured
- new questions exposed
- doctrine changes required
- kernel or API changes required

## Implementation Boundary

Each lab should declare one of:

- doc-only
- code-only
- doc-plus-code

Default expectation:

- most early labs should be doc-plus-code
- purely speculative labs should stay doc-only
- code-only labs are discouraged if they do not feed doctrine

## Immediate Lab Set

Status:

- completed

### 1. Wake/Sleep Continuity Lab

Priority:

- now

Implementation boundary:

- doc-plus-code

Objective:

- test observer branch continuity across wake and sleep segmentation
- test nucleus carry-forward into resumed activity
- test when resumed activity looks like continuation versus new branch pressure

Primary doctrine under test:

- observer vs branch anchoring
- nucleus vs lineage
- segmented history

Success criteria:

- can represent continuation across sealed and resumed segments cleanly
- can state where continuation pressure becomes branch-split pressure
- can describe what inheritance was carried without collapsing nucleus into lineage

### 2. Referent Persistence Across Absence Lab

Priority:

- now

Implementation boundary:

- doc-plus-code

Objective:

- test `continuing`, `ambiguous`, and `broken` persistence outcomes
- test how inertia, volatility, and contradictory evidence affect continuity judgment
- test how absence differs from actual contradiction

Primary doctrine under test:

- referent persistence
- negative evidence
- lineage over forced identity

Success criteria:

- can represent all three persistence states honestly
- can distinguish weak absence pressure from strong contradiction
- can show at least one scenario where ambiguity is the correct result

### 3. Primary Context and Directional Portal Lab

Priority:

- now

Implementation boundary:

- doc-plus-code

Objective:

- test one-primary-context situatedness
- test outside relevance through directional portal exposure
- test how portal-mediated awareness differs from direct colocated access

Primary doctrine under test:

- context containment
- portal contract
- local situatedness

Success criteria:

- one primary context remains workable without flattening outside relevance
- directional portal exposure can be modeled without symmetry assumptions
- direct colocated access and portal-mediated exposure stay distinct

### 4. Degraded Basis Re-identification Lab

Priority:

- now

Implementation boundary:

- doc-plus-code

Objective:

- test how effective basis narrowing changes tracking quality
- test when degraded basis preserves continuity well enough
- test when degraded basis produces ambiguity instead of forced identity

Primary doctrine under test:

- effective basis
- referent persistence
- ambiguous continuity

Success criteria:

- effective basis narrowing changes what can honestly be claimed
- degraded basis can still support continuation in some cases
- degraded basis can also force ambiguity without artificial breakage

### 5. Trigger to Happening Clustering Lab

Priority:

- now

Implementation boundary:

- doc-plus-code

Objective:

- test triggers that do not become happenings
- test observer-relative salience differences over similar triggers
- test clustering of multiple low-level triggers into one preserved happening

Primary doctrine under test:

- trigger/salience/happening distinction
- observer-relative importance
- preserved historical registration

Success criteria:

- low-level detection can exist without preserved happening creation
- different salience policies can yield different preserved outcomes
- clustered happenings remain distinct from raw trigger history

## Follow-on Lab Set

Status:

- completed

### 6. Boundary Ambiguity Lab

Priority:

- next

Implementation boundary:

- doc-plus-code

Objective:

- test ambiguous placement near context edges
- test whether ambiguity is better represented as unresolved placement, portal-mediated relevance, or branch pressure

Success criteria:

- boundary ambiguity can be represented without forcing premature context resolution
- the model exposes whether ambiguity belongs in placement, exposure, or continuity

Primary doctrine under test:

- context containment
- portal mediation
- ambiguity representation

### 7. Two-Portal Mutual Exposure Lab

Priority:

- next

Implementation boundary:

- doc-plus-code

Objective:

- test bidirectional visibility as two directional portals rather than one symmetric primitive
- test whether asymmetry matters in practice

Success criteria:

- two directional portals are sufficient for mutual exposure cases
- asymmetry can be represented when the directions do not behave identically

Primary doctrine under test:

- portal contract
- directional exposure
- context boundary asymmetry

### 8. Local Artifact Emission Lab

Priority:

- next

Implementation boundary:

- doc-plus-code

Objective:

- test emitting explicit shareable artifacts from local continuity
- test provenance and basis carriage on views, bindings, lineage claims, and receipts

Success criteria:

- local continuity stays local by default
- emitted artifacts carry enough provenance for later exchange work
- shared artifacts remain projections rather than silent truth claims

Primary doctrine under test:

- local/shared artifact boundary
- provenance
- replaceable views and explicit claims

### 9. Split/Merge Pressure Lab

Priority:

- later

Implementation boundary:

- doc-plus-code

Objective:

- test lineage-first handling of split and merge pressure
- test when nucleus transfer is clean versus composite or unresolved

Success criteria:

- lineage-first handling stays workable under split and merge pressure
- the model exposes where nucleus composition needs stronger doctrine

Primary doctrine under test:

- nucleus vs lineage
- referent continuity pressure
- branch ancestry structure

### 10. Multi-Observer Non-Agreement Lab

Priority:

- later

Implementation boundary:

- doc-plus-code

Objective:

- test observers tracking overlapping referents without forced agreement
- test coexistence of partial comparability without convergence

Success criteria:

- overlapping tracking can coexist without mandatory convergence
- the model can preserve non-agreement without collapsing into incompatibility by default

Primary doctrine under test:

- observer-relative truth posture
- comparability vs convergence
- agreement as optional behavior

## Not Yet

Do not prioritize yet:

- decentralized persistence mechanisms
- finalized shared artifact protocol
- mandatory convergence logic
- finalized identity algebra
- full basis composition algebra

## Next Documents

Use these for the next stage:

- [`docs/post-lab-synthesis.md`](./docs/post-lab-synthesis.md)
- [`docs/next-phases.md`](./docs/next-phases.md)
