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
- summarize saved seam-history observation/readback artifacts through a CLI
  while preserving the strongest source proof label without upgrading supplied
  material;
- document the exact live public Hyperswarm report to Edge handoff bundle
  artifact chain, including single-machine and device-to-device public paths,
  while keeping import/readback-only steps labeled as lower proof.
- preserve a single-machine public Hyperswarm/Corestore seam-history run under
  `proof-artifacts/public-hyperswarm-single-machine-2026-06-01/`, including
  reader report, checked report readbacks, Edge handoff bundle, handoff
  readback, and proof summary.
- preserve a two-device public Hyperswarm/Corestore seam-history run from
  `platform-lab` to `mesh-lab` under
  `proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/`, including
  source manifest, replica report, checked replica report readback, Edge
  handoff bundle, handoff readback, and proof summary.
- hand the device-to-device public Edge handoff bundle to Edge as
  observation-only projection input; Edge preserved the proof rung and source
  refs in
  `mesh-ecology-edge/proof-artifacts/causal-substrate-public-device-handoff-2026-06-01/`
  without writing Edge projection state.
- check preserved public run artifact chains for reproducibility through code,
  including linked/damaged detection, source id/hash preservation, public proof
  label preservation, and non-claim boundaries, while labeling the check as
  `local_reproducibility_check_over_saved_public_hyperswarm_artifacts`.
- derive a saved observation-to-handoff-to-Edge projection contract from the
  public device run and Edge's saved import receipt, proving source refs match
  across Causal and Edge without writing Edge projection state.
- emit a Spine/Edge consumer readback over the saved proof summary and Edge
  contract so consumers can see the preserved public source proof rung while
  the readback itself remains
  `local_consumer_readback_over_saved_edge_layer_seam_history_proof_summary`.
- emit a public swarm refresh decision over the saved reproducibility check,
  Edge contract, and consumer readback; the current recommendation is
  `not_required_artifacts_stable`, and the decision does not run public swarm.
- expose a compact public seam proof index for Edge, Layer, and Spine that
  points at the preserved public run, reproducibility check, Edge contract,
  consumer readback, and refresh decision without duplicating artifact bodies
  or upgrading saved artifacts into a new public swarm proof.
- reject weakened public seam proof indexes when saved refs are missing, proof
  labels are weakened, or indexed artifacts overclaim projection, authority,
  Layer admission, RBC interpretation, Mesh publication, or production
  continuity.
- prepare an operator-selected public refresh command artifact that reads the
  saved public seam proof index and refresh decision, preserves source refs,
  names exact public Hyperswarm source/replica commands plus local downstream
  readback/handoff/reproducibility outputs, and remains instructions-only.
- gate the prepared public refresh command artifact so an operator can see
  whether the prepared commands are public-swarm-only, bootstrap-unset,
  source-ref-preserving, and instructions-only before any live public refresh
  is run.
- prepare a refresh-run input package under
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh/`,
  preserving the current seam-history input and labeling it as
  `local_refresh_input_package_over_saved_public_hyperswarm_material` until a
  public Hyperswarm reader consumes refreshed durable material.
- run the prepared source and replica commands on the standby devices
  `platform-lab` and `mesh-lab` with public Hyperswarm enabled and
  `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset, producing a refreshed source
  manifest and replica report under
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh/`.

Strongest routinely proven rung in normal tests:
`local_causal_observation_over_supplied_seam_history_material`.

The real Hyperswarm reader remains a higher proof lane only when the
environment-gated command actually runs against durable replicated material.

Strongest preserved artifact rung from the 2026-06-01 single-machine public
run:
`public_hyperswarm_replicated_durable_seam_history_observation`.

Strongest preserved artifact rung from the 2026-06-01 device-to-device public
run:
`public_hyperswarm_replicated_durable_seam_history_observation`.

## Next Outward Moves

The current saved-artifact readiness list is complete. Build the next list
around an explicit operator-run public swarm refresh, if the operator chooses
to run one:

- after a real public refresh run, derive the replica report readback, Edge
  handoff bundle, handoff readback, proof summary, and reproducibility check
  from the refreshed durable public material without claiming canonical
  history, Layer admission, RBC interpretation, Mesh publication, authority,
  Edge projection writes, or production continuity;
- after Edge imports any refreshed handoff bundle, derive a refreshed
  observation-to-Edge projection contract and consumer readback from saved
  artifacts only, preserving the public source proof rung without upgrading
  the contract/readback operations;
- index the refreshed public run and add a negative refreshed-index case that
  rejects missing refs, weakened proof labels, configured bootstrap evidence,
  or projection/authority overclaims;
- defer ontology, referent promotion, canonical continuity, RBC, Mesh,
  authority, Layer admission, and production continuity.

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
- Spine needs a next family-pressure signal after Edge, Layer, and Causal
  Substrate all have accepted public-swarm lanes.
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
