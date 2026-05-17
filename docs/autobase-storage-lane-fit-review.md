# Autobase Storage Lane Fit Review

Status: interpretive fit accepted; backend ownership rejected.

`causal-substrate` can interpret Edge's bounded Autobase storage-lane pressure
artifacts when they preserve the promoted projection event as the semantic input
and expose explicit writer refs, heads, linearized entry refs, causal frontier
refs, source projection refs, and source happening refs.

This does not make causal-substrate the storage backend, Autobase owner, writer
admission owner, truth engine, settlement engine, or runtime authority.

## Required Posture

Adapters for frontier candidates, sandboxed Autobase projection views, and
optimistic-intake evidence require:

- `intendedStorageLane=bounded_autobase_equivalent_linearization`;
- `inputSemanticUnit=mesh_ecology_local_layer_projection_event`;
- promoted projection-event input required;
- sandbox-only proof posture;
- no production backend promotion;
- no storage-record promotion;
- no Edge state migration;
- append success is not acceptance;
- linearization is not truth;
- replica visibility is not continuity;
- wall-clock order is not causal order;
- discovery absence is not failure.

## Interpretation

Causal-substrate treats these artifacts as observer-relative evidence about a
collaborative causal frontier. Autobase linearization may provide useful
ordering evidence, but it remains evidence inside a branch-relative history, not
global truth or final settlement.

Optimistic intake is interpreted as candidate pressure until the owning apply
path records acceptance. `ackWriter` and derived-view materialization can be
acceptance evidence, but causal-substrate does not grant writer authority.

## Stop Line

Any future artifact that claims production backend promotion, durable local-layer
state, replicated continuity by visibility alone, acceptance by append return
value, or truth by linearization must be rejected before it becomes a causal
interpretation input.
