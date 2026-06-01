# Next Objectives

Status: lane guide, not a fixed task list. Causal Substrate agents should
choose the next small operational improvement inside the causal observer role.

## Current Lane

Causal Substrate observes and interprets selected seam-history material. It
preserves ids, hashes, refs, provenance, and linkage status while classifying
compatible, damaged, and unresolved happenings.

Causal Substrate does not claim canonical truth, Layer admission, RBC
interpretation, quorum satisfaction, Mesh publication, authority, or production
continuity.

## Completed Local Seam-History Observation Surface

The local supplied-material lane can now:

- consume supplied Edge/Layer seam-history material and emit bounded causal
  observations;
- classify linked request/receipt material as
  `compatible_seam_happening`;
- classify damaged or unlinked request/receipt material as
  `unresolved_or_damaged_seam_happening`;
- emit readback contracts, contract snapshots, completion gates, Edge
  projection fixtures, Edge consumer fixtures, and Edge handoff bundles;
- preserve request ids/hashes, receipt ids/hashes, source repos, durable refs,
  writer refs, linkage status, proof labels, and non-claim boundaries;
- expose Hyperswarm-readiness, real-run instructions, report readback, and
  durable-record source-ref completeness surfaces without treating instructions
  or supplied reports as live swarm proof;
- write a single Edge handoff bundle from the observation CLI;
- keep incomplete Edge handoff bundles inspectable as incomplete rather than
  throwing them away;
- reject weakened Hyperswarm report readbacks that lose durable hashes,
  source refs, reader proof, or proof-label consistency;
- run an environment-gated real Hyperswarm CLI path that writes both reader
  report and checked readback output when
  `CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1` actually runs;
- accept Layer-owned receipt runtime/evidence reports as adjacent local causal
  input while preserving receipt ids/hashes, request refs, durable refs,
  writer refs, runtime refs, source repos, and proof labels;
- reject Layer receipt runtime evidence when refs are incomplete, ownership is
  not Layer-labeled, or the material overclaims Layer admission, RBC
  interpretation, canonical history, or authority;
- emit Layer receipt runtime evidence readback contracts, a Layer receipt
  observation CLI, source-ref completeness reports, and negative CLI guardrail
  cases;
- correlate seam-history observations with Layer receipt runtime observations
  as an adjacent local fixture without deciding Layer admission, RBC,
  canonical history, or authority;
- emit adjacent-fixture readback contracts that prove JSON round-trip
  preservation of matched request/receipt refs, source repos/refs, proof
  labels, and non-claims;
- prove the Edge consumer-facing handoff bundle shape can be consumed as
  observation-only projection input, and prove incomplete handoff bundles are
  rejected before projection consumption;
- import a saved Edge projection handoff bundle from disk and emit only a
  readback/verifier artifact without writing Edge projection state;
- emit a combined Edge/Layer consumer contract snapshot that carries seam
  classifications plus Layer receipt runtime refs as observation-only material;
- import a previously written Hyperswarm reader report from disk and emit only
  a readback/verifier artifact without opening swarm or Corestore;
- wrap supplied Layer-origin receipt runtime material as a local operational
  fixture hook through code and CLI without calling Layer or upgrading proof;
- reject malformed Layer receipt runtime CLI input and unsafe Layer-origin hook
  CLI material while preserving bounded non-claims;
- keep the real Hyperswarm proof-run instructions artifact current with saved
  report import/readback and handoff bundle readback commands while labeling
  them as lower proof unless the gated reader actually runs.

Strongest routinely proven rung in normal tests:
`local_causal_observation_over_supplied_seam_history_material`.

The real Hyperswarm reader remains a higher proof lane only when the
environment-gated command actually runs against durable replicated material.

## Good Next Moves

Choose work that improves bounded causal observation:

- Add a disk/CLI readback path for the combined Edge/Layer consumer contract
  snapshot, preserving seam classifications, Layer runtime refs, proof labels,
  and non-claims.
- Add malformed/non-object negative CLI cases for saved handoff bundle and
  combined snapshot readbacks.
- Add a compact source-ref completeness report for the combined Edge/Layer
  consumer contract snapshot.
- Add an operation-shaped command that derives a handoff bundle from a saved
  real Hyperswarm reader report after the report readback validates.
- Add a proof-summary command that reads observation/readback artifacts and
  reports the strongest honestly proven rung without upgrading supplied
  material.
- Add real-run documentation for the exact artifact chain from live
  Hyperswarm reader report to Edge handoff bundle, while keeping local/import
  runs labeled as lower proof.

## Handoff Expectations

When handing material back to Edge, Layer, or Spine, include:

- observation artifact id and schema;
- observed source request ids/hashes;
- observed receipt ids/hashes;
- source repos;
- durable refs and writer refs;
- classification and linkage status;
- strongest proof rung;
- non-claims and deferred attachment points.

Edge may consume the handoff bundle or the consumer fixture as observation-only
projection input. Causal Substrate still does not write Edge projection state.

Layer may consume the Layer receipt runtime evidence observation as
observation-only feedback about supplied Layer-owned receipt material. Causal
Substrate still does not admit Layer evidence, interpret RBC, decide Layer
admission, or grant authority.

## Look Outward When

- Causal work is refining local fixtures while Edge/Layer have durable seam
  history ready to consume.
- A higher proof rung is tempting but input came from supplied JSON, files,
  stdin/stdout, direct imports, or fixtures.
- Layer receipt/evidence refs would need Layer admission interpretation.
- Edge needs a projection-safe result shape before more Causal internals.

## Guardrail

No swarm-carried communication, no seam proof. A Causal observation over
supplied material is useful, but it is not DHT/Hyperswarm-derived seam proof.

Instructions artifacts, readiness reports, static fixtures, JSON files, and
operation-shaped report readbacks are lower proof rungs unless the reader
actually consumed durable DHT/Hyperswarm-derived seam history.
