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

## Current Convergence Posture

Causal now recognizes Layer's `layer_public_device_boundary_handoff_packet`
shape as adjacent supplied material. The previous repo-family convergence run
at `mesh-ecology-layer/proof-artifacts/layer-convergence-20260604T031354Z/`
remains useful timeout evidence, but the current Layer convergence material is
`mesh-ecology-layer/proof-artifacts/layer-convergence-20260604T040145Z/`.
That run classified `device_boundary_public_swarm_complete` and preserved one
compatible request id/hash, one Layer receipt id/hash, the receipt writer ref,
one Layer evidence ref, distinct device refs/fingerprints, observed public
swarm connections, and non-claims.

This is still not live Causal public-swarm observation unless Causal itself
reads durable replicated public-swarm-derived seam history. The immediate
Causal task is to consume the new Layer handoff as selected adjacent public
device-boundary material, preserve the request/receipt/evidence refs and proof
labels, classify it as compatible public device-boundary input only at the
source-proof level, and keep Causal's own operation rung honest as supplied or
saved readback material. If Causal needs a live reader later, add it as a
separate Causal-owned public swarm lane.

Current result: Causal consumed the completed Layer handoff at
`mesh-ecology-layer/proof-artifacts/layer-convergence-20260604T040145Z/layer-public-device-boundary-handoff-packet.json`
and preserved the bounded observation at
`proof-artifacts/layer-convergence-20260604T040145Z/layer-device-boundary-observation.json`.
The observation classified the source material as `compatible`, preserved the
Layer request id/hash, receipt id/hash, receipt writer ref, evidence ref,
Autobase key, topic, proof rung, linkage status, and non-claims, and kept
Causal's own operation proof rung as `saved_readback_seam`.

Next pressure now moves to Edge consuming either the original Layer handoff or
this Causal observation through Edge's read-only operator projection path. Do
not add another Causal-only saved-artifact expansion unless Edge or Spine
reports a concrete consumer gap.

Latest adjacent-material pointer: Edge has now consumed Layer's held public
seam handoff shape into an Edge-compatible public process attempt pack at
`mesh-ecology-edge/proof-artifacts/edge-layer-held-public-process-attempt-2026-06-04/`.
That pack preserves Layer held participant topic/autobase/writer/latest
request/receipt refs and records an Edge same-device public HyperDHT process
attempt while explicitly keeping `deviceBoundaryObserved: false`,
`publicDeviceBoundaryClaimedByEdge: false`, and
`retainedLayerParticipantLivenessClaimedByEdge: false`.

If Causal resumes work before a stronger live Edge/Layer run lands, the narrow
next Causal move is to consume that Edge adjacent handoff index or attempt
packet as saved material only, preserve Layer-held refs plus Edge process refs,
classify the same-device public attempt as below device-boundary proof, and
emit no canonical truth, Layer admission, RBC, Mesh, authority, or production
continuity claim. Do not call it live Causal public-swarm observation unless
Causal itself reads durable replicated history over swarm.

Layer now has a supervised current-live public participant lifecycle, and Edge
can preserve its current-live participant refs separately from retained Layer
held proof refs. The repo-family posture has since corrected the default target:
Edge should not default to direct remote Layer access. Each device should run
local component instances with their own storage; when Edge needs Layer
material, a local Layer replica should replicate selected remote Layer history
through public swarm, then Edge should talk to that local Layer replica over a
swarm seam. Direct remote Layer access is an explicit configured exception.

The next family proof target is:

```text
remote Layer history
-> local Layer replica with Layer-owned storage reads/replicates it through public swarm
-> Edge probes local Layer replica over an Edge <-> Layer swarm seam
-> Edge emits linked public result evidence or unresolved flake packet
-> Layer local replica down/readback preserves durable local replica history
-> Causal observes the resulting Edge/Layer material
```

Causal should wait for that concrete Edge/local-Layer-replica output unless
asked to inspect the existing saved attempt pack. When it lands, consume the
Edge attempt packet, Layer replica descriptor/readback refs,
request/receipt/evidence ids and hashes, writer refs, transport labels, and
unresolved/compatible classification as bounded adjacent material. Preserve
proof labels exactly. Do not upgrade Causal's own operation rung unless Causal
itself reads durable replicated history over public swarm.

Mechanics-first rule: do not expand cockpit/TUI-facing observation surfaces
before the live Edge/Layer public-swarm mechanics chain is repeatable. Causal's
next useful contribution is bounded observation over concrete Edge/Layer output
from that chain, or a separately scoped Causal-owned public swarm reader if the
family proof requires Causal itself to cross swarm.

Process cleanup boundary: Causal should not start Layer or Edge live
participants unless its objective explicitly requires it. If it does start any
component process, it must stop it before finishing or hand off pid/control-dir
state explicitly. Live helper processes left behind by tests are not proof.

## Prototype Alignment

Use `/home/zevilz/work/prototypes/mesh-ecology-prototype` as a conceptual and
snag-prevention reference, not as Causal proof. Before adding another
observation, readback, handoff, or proof-index lane, check the prototype's
`MODEL.md`, `docs/agent-snag-index.md`, and `docs/artifact-contract.md` for
vocabulary and artifact fields that prevent common overclaims.

Current local audit:
`docs/prototype-alignment-audit.md`. It records that Causal is semantically
aligned with the prototype proof-boundary doctrine, but does not yet expose all
prototype common artifact fields at top level. Do not retrofit saved artifacts
unless a real consumer needs the normalized surface or the next public-swarm
run needs it to prevent proof-rung ambiguity.

Causal Substrate should specifically absorb these prototype lessons:

- supplied JSON, saved artifacts, and readbacks are lower-rung material unless
  Causal itself reads durable replicated seam history over public swarm;
- public/default swarm timeout is `unresolved` evidence, not success and not a
  doctrine failure;
- local/testnet transport does not become public durable replicated seam
  observation;
- Autobase writer/indexer/readonly/optimistic posture is useful causal input
  vocabulary but not authority, RBC, Layer admission, or canonical truth;
- prototype proto-RBC/future-RBC shapes are only model pressure, not real RBC
  interpretation.

When Causal emits observations or consumer handoffs, keep them compatible with
the prototype artifact contract where useful: preserve proof rung,
classification, transport booleans, request/receipt refs, hashes, source refs,
writer refs, warnings, non-claims, and next pressure. Do not cite prototype
artifacts as live Causal observations; use them to avoid category errors while
hardening the generic Causal seam surface or running a real public reader.

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
- preserve a two-device public Hyperswarm/Corestore seam-history run from an
  operator-selected source device to an operator-selected replica device under
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
- run the prepared source and replica commands on operator-selected standby
  devices with public Hyperswarm enabled and
  `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset, producing a refreshed source
  manifest and replica report under
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh/`.
- derive the refreshed replica report readback, Edge handoff bundle, handoff
  readback, proof summary, and reproducibility check from the refreshed public
  material while preserving non-claim boundaries and labeling derived
  saved-artifact operations as lower proof rungs.
- after Edge imported the refreshed handoff bundle as observation-only
  projection input, derive a refreshed observation-to-Edge projection contract
  and consumer readback from saved artifacts only, preserving the public source
  proof rung without upgrading the contract/readback operations.
- index the refreshed public run through a local saved-artifact refresh
  decision and proof index, preserving source refs and public source proof
  labels while rejecting configured-bootstrap evidence and projection or
  authority overclaims.
- use the refreshed proof index to prepare the next public-swarm-only device
  objective, including an instructions-only operator command, readiness gate,
  and local input package under
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/`;
  this preparation keeps `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset and
  remains below live swarm proof until the device commands actually run.
- expose the refreshed public seam proof index as
  `public-proof-index-consumer-handoff.json`, an observation-only consumer
  handoff for Edge, Layer, and Spine that preserves refs and public source
  proof labels without calling consumers, writing projection state, admitting
  Layer evidence, interpreting RBC, or upgrading proof.
- read back the consumer handoff as
  `public-proof-index-consumer-handoff-readback.json`, proving through code that
  the saved handoff remains readable, preserves source refs, and keeps
  consumer suitability/non-claim boundaries without upgrading proof.
- run the prepared next public-swarm-only device objective on
  operator-selected standby devices with `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP`
  unset, producing
  `public-source-manifest.json` and `public-replica-reader-report.json` under
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/`.
- derive the next public replica report into local saved-artifact readback,
  Edge handoff bundle, handoff readback, proof summary, and reproducibility
  check under
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/`,
  preserving the public source proof rung while labeling derived operations as
  lower proof rungs.
- after Edge imported the next handoff bundle as observation-only projection
  input, derive the next observation-to-Edge projection contract and
  proof-summary consumer readback from saved artifacts only, preserving the
  public source proof rung without writing Edge projection state or upgrading
  proof.
- derive the next public refresh decision, proof index, consumer handoff, and
  consumer handoff readback from the completed next-run saved-artifact chain,
  preserving refs and public source proof labels while keeping all operations
  lower than the live public swarm source proof.
- expose a generic Causal seam endpoint descriptor, generic seam-history input
  envelope, and generic observation result envelope through code exports;
  classify neutral linked, damaged, unresolved, and overclaim-prone seam
  material while preserving refs, proof rungs, transport booleans, non-claims,
  deferred attachment points, warnings, and `nextPressure`.
- prove Causal-owned generic test consumers/smokes can consume the generic
  descriptor and observation result without Edge or Layer participation,
  including durable local observation result write and reopened readback.
- reject descriptor-declared or label-declared public swarm proof unless the
  input carries explicit reader-observed replicated public-swarm-path evidence.
- add a standalone generic public-swarm source/replica lane with source and
  replica CLIs; the CLIs emit instructions only until explicitly enabled,
  reject configured bootstrap for public proof, keep source manifests as
  manifest-only lower proof, classify replica timeout as unresolved evidence,
  and prove local direct-peer replication remains below public/default swarm
  proof unless public reader evidence is present.
- run the generic source and replica CLIs over the declared public Hyperswarm
  path with `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset, preserving a
  Causal-owned generic public-swarm run under
  `proof-artifacts/generic-causal-seam-public-swarm-2026-06-03/`; the replica
  report classified the run as `compatible`, preserved neutral request/receipt
  refs and hashes, and emitted a generic observation result with strongest rung
  `durable_replicated_public_swarm_seam`.
- expose a compact generic public seam proof index over
  `proof-artifacts/generic-causal-seam-public-swarm-2026-06-03/` as
  `generic-public-seam-proof-index.json`, preserving history, observation,
  request, receipt, source repo, durable, writer, proof-label, and non-claim
  material while labeling the index operation as `saved_readback_seam`.
- expose `generic-public-proof-index-consumer-handoff.json` and
  `generic-public-proof-index-consumer-handoff-readback.json` so generic
  consumers, Edge, Layer, and Spine can inspect the preserved public source
  rung as observation-only material without Causal calling consumers, writing
  consumer state, admitting Layer evidence, interpreting RBC, publishing to
  Mesh, granting authority, or upgrading proof.
- run the generic source and replica CLIs over the declared public Hyperswarm
  path with fresh intentionally unresolved generic seam-history material under
  `proof-artifacts/generic-causal-seam-public-swarm-unresolved-2026-06-03/`;
  the replica report classified the run as `unresolved`, preserved the missing
  receipt finding, and still proved Causal read durable replicated material
  through the declared public swarm path with strongest source rung
  `durable_replicated_public_swarm_seam`.
- run the generic source and replica CLIs over the declared public Hyperswarm
  path with fresh intentionally damaged generic seam-history material under
  `proof-artifacts/generic-causal-seam-public-swarm-damaged-2026-06-03/`;
  the replica report classified the run as `damaged`, preserved the
  `hash_mismatch` happening, and still proved Causal read durable replicated
  material through the declared public swarm path with strongest source rung
  `durable_replicated_public_swarm_seam`.
- run the generic source and replica CLIs over the declared public Hyperswarm
  path with fresh duplicate-id generic seam-history material under
  `proof-artifacts/generic-causal-seam-public-swarm-duplicate-id-2026-06-03/`;
  the replica report classified the run as `damaged`, preserved the
  `duplicate_id` happening, and still proved Causal read durable replicated
  material through the declared public swarm path with strongest source rung
  `durable_replicated_public_swarm_seam`.
- scan adjacent Edge and Layer worktrees for fresh public endpoint/history
  material and record the result in
  `docs/outward-public-material-scan-2026-06-03.md`; this is
  `local_artifact_seam` operator inspection only, found no committed fresh
  adjacent public proof material ready for Causal observation, and prevents
  treating dirty adjacent worktree state as Causal-consumable public proof.
- add a narrow adjacent-material observation surface over fresh Layer public
  proof/readiness material and Edge compatible handoff readback shapes through
  `scripts/observe-adjacent-public-material.ts`; this is
  `saved_readback_seam` over supplied/exported material, preserves
  request/receipt/evidence ids and hashes, durable refs, writer refs, source
  repo refs, proof rungs, linkage status, and non-claims, classifies
  compatible/damaged/unresolved honestly, and does not claim live Causal swarm
  proof, Layer evidence admission, RBC interpretation, Mesh publication,
  authority, or production continuity.
- consume actual Layer public/default HyperDHT proof output from
  `mesh-ecology-layer` and preserve Causal's read-only adjacent observation
  under `proof-artifacts/adjacent-public-material-2026-06-03/`; the Causal
  operation is `saved_readback_seam`, the Layer material classified
  `compatible`, and Causal preserved request/receipt/evidence ids and hashes,
  durable refs, writer refs, source repo refs, proof labels, linkage status,
  and non-claims without claiming live Causal swarm proof.
- prepare Causal's adjacent-material adapter to consume Edge's current
  `causalHandoffExport.edgeHandoffReadback` export-pack wrapper without
  changing proof rung; this is adapter validation for the next concrete Edge
  handoff artifact, not a substitute for the handed artifact and not live
  Causal swarm proof.
- inspect Edge for a concrete compatible Causal handoff export artifact and
  record the result in
  `docs/edge-compatible-handoff-artifact-scan-2026-06-03.md`; this is
  `local_artifact_seam` operator inspection only, found no current Edge
  handoff export JSON in `proof-artifacts/`, and prevents treating Edge CLI
  capability, tests, dirty worktree state, or Causal-generated smoke material
  as handed Edge artifact proof.
- consume actual Edge compatible handoff readback material from
  `mesh-ecology-edge` commit `48b0529` and preserve Causal's read-only
  adjacent observation under
  `proof-artifacts/adjacent-edge-compatible-handoff-2026-06-03/`; the Causal
  operation is `saved_readback_seam`, the Edge material classified
  `compatible`, and Causal preserved request/receipt ids and hashes, durable
  refs, writer refs, source repo refs, proof labels, linkage status, and
  non-claims without claiming live Causal swarm proof.
- run Causal's public Hyperswarm source/replica lane over seam-history
  material derived from the saved Layer and Edge adjacent observations under
  `proof-artifacts/edge-layer-derived-adjacent-public-swarm-2026-06-03/`;
  the replica report reached `compatible`, the observation result reached
  `compatible_with_warnings`, and Causal proved it read the derived durable
  material through the declared public Hyperswarm path with strongest rung
  `durable_replicated_public_swarm_seam` while preserving the warning that the
  source material began as saved adjacent observations.
- emit a compact current-posture consumer handoff under
  `proof-artifacts/current-causal-posture-handoff-2026-06-03/`; this is
  `consumer_handoff_seam`, preserves exact artifact refs and proof rungs for
  the saved Layer observation, saved Edge observation, and derived public
  Hyperswarm read, and does not upgrade proof or claim direct Edge/Layer live
  publication to Causal.

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

Strongest latest saved-artifact consumer handoff rung:
`local_consumer_handoff_over_saved_public_seam_proof_index`.

Strongest latest saved-artifact consumer readback rung:
`local_readback_over_saved_public_proof_index_consumer_handoff`.

Strongest latest generic public source proof rung:
`durable_replicated_public_swarm_seam`.

Strongest latest generic public index/readback operation rung:
`saved_readback_seam`.

Strongest latest generic consumer handoff operation rung:
`consumer_handoff_seam`.

Strongest latest adjacent-material observation operation rung:
`saved_readback_seam`.

## Operational Proof-Rung Discipline

A seam is any repo-to-repo interpolation. Local artifacts, saved readbacks,
repo handoffs, receipts, runtime contact, swarm contact, and public durable
replicated contact can all be seams, but every seam must carry its proof rung.
The objective decides which rung is sufficient.

Preferred rung vocabulary for new Causal-facing work:

- `local_artifact_seam`
- `saved_readback_seam`
- `consumer_handoff_seam`
- `local_runtime_seam`
- `swarm_discovered_seam`
- `public_swarm_seam`
- `durable_replicated_public_swarm_seam`

No new lower-rung seam expansion should be added unless it names the
swarm-rung, public-swarm-rung, or durable-replicated-rung pressure it serves.
If proposed Causal work is below the swarm rung, state:

- what proof rung it occupies;
- what higher rung it prepares, preserves, or protects;
- what overclaim it prevents;
- why it is not horizontal expansion below swarm;
- what live swarm-carried objective remains next.

Lower-rung Causal work is valid for shape compatibility, consumer validation,
adapter validation, readback preservation, negative overclaim testing, operator
inspection, preservation or indexing of material derived from a stronger live
seam, or preparation for the next swarm/public-swarm attempt. It must not be
described as swarm proof, public seam proof, durable replicated proof,
production continuity, Layer admission, RBC evaluation, Mesh dispatch, or
authority.

## Collective Operational Enough Tripwires

These tripwires mark model-level repo-family readiness, not completion,
canonical history, Layer admission, RBC, Mesh, authority, production durability,
or an obligation to keep adding solo artifacts. When one fires, report it to
Spine with the command, result refs, proof rung, warnings, and next pressure.

Causal's standalone tripwire fires when Causal can observe generic
public-swarm-derived seam-history material across compatible, unresolved, and
damaged branches, preserve request/receipt ids and hashes, durable refs, writer
refs, source repos, proof labels, transport booleans, and non-claims, then emit
durable observation results and readbacks without Edge or Layer participation.

Causal's adjacent-material tripwire fires when Causal consumes committed
Edge/Layer public-swarm-derived endpoint/history/proof material, classifies it
as compatible, unresolved, or damaged, and emits a bounded observation handoff
that Edge, Layer, or Spine can read as observation-only input without Causal
writing their state or claiming Layer admission, canonical truth, RBC, Mesh,
authority, or production continuity.

Causal's repo-family demonstration tripwire fires when a fresh Edge-originated
report-only public-swarm request produces Layer-owned durable receipt/evidence,
Edge reopens/projects the result, Causal observes that resulting public-swarm
history or proof envelope, and Spine can summarize the chain with preserved
source refs and honest proof rungs.

Causal's stop-solo-expansion tripwire fires when new work would add another
generic public matrix case, saved-artifact readback, or consumer handoff without
a concrete consumer ambiguity, a fresh Edge/Layer public material input, or a
named live public-swarm objective. At that point, prefer outward observation or
wait for adjacent repos.

Causal's blocker tripwire fires when adjacent repos provide only dirty
worktree state, supplied JSON/files/stdin material, direct imports, local
fixtures, or control-channel output while asking Causal to claim
DHT/Hyperswarm-derived observation.

## Immediate Direction: Public-Swarm Observer For The Chain

Move briskly from posture handoffs and saved-artifact indexes into a Causal
observer lane that can participate in the repo-family public swarm chain.

Causal should expose lifecycle or CLI surfaces equivalent to:

```text
causal public-observer up
causal public-observer observe
causal public-observer status
causal public-observer down
```

Current implementation:
`npm run public-observer -- up|status|observe|down` through
`scripts/causal-public-observer.ts`.

The lifecycle commands occupy `local_artifact_seam`: they write/read observer
posture, preserve Edge/Layer/source descriptor refs and hashes, and name the
`durable_replicated_public_swarm_seam` pressure they serve. They do not claim
swarm proof.

The `observe` command emits instructions only until
`CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1` and
`CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1` are set with
`CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset. When enabled, it consumes a
source manifest through Causal's public Hyperswarm replica reader, writes the
bounded replica report/readback, and labels durable replicated public swarm
proof only if the reader actually consumes durable material through that path.
If an enabled observe attempt receives only Edge/Layer descriptors, or a
retained Layer/Edge manifest that is not a Causal-readable source manifest, it
writes a `local_artifact_seam` descriptor preflight report instead of opening
swarm or upgrading proof.

The exact command names may follow existing CLI conventions, but the behavior
should be concrete: accept Edge/Layer endpoint or durable-history descriptors,
read durable replicated material through the declared public swarm path when
that proof is claimed, emit bounded compatible/damaged/unresolved observations,
write durable observation readback, and shut down cleanly.

The repo-family chain target is:

```text
Edge persistent public seam/client intent
-> Layer persistent public participant
-> Layer durable receipt/evidence
-> Edge readback/projection
-> Causal public-swarm-derived observation
-> Spine posture evidence
```

Causal may also provide a one-shot observer CLI for test harnesses, but that
client is a proof probe, not a canonical operator surface and not a side-channel
authority. It must not write Edge or Layer state, admit Layer evidence, decide
canonical history, interpret RBC, publish Mesh, or grant authority.

## Device-Boundary Observation Guardrail

Causal may consume public device-boundary artifacts only as sanitized causal
input material unless Causal itself performs the durable public-swarm reader
operation. The useful next device-boundary input is a concrete Edge/Layer
artifact set that preserves request/receipt ids and hashes, writer refs,
durable feed/readback refs, source proof rung, transport observations,
linkage/unresolved status, warnings, and non-claims.

Do not add or publish SSH orchestration details in Causal artifacts or docs.
No concrete SSH host aliases, LAN IPs, usernames, identity-file paths,
known-host fingerprints, or device-local private paths should be committed in
Causal. If a handed artifact includes those details, either reject it as
unsuitable for tracked Causal proof material or preserve only sanitized logical
device refs such as `<edge-device>` and `<layer-device>`.

SSH is setup/control evidence only. It is not the seam and must not upgrade any
Causal observation. Causal proof can upgrade only when Causal reads durable
replicated seam history through the declared public swarm path, or when it
honestly reports a lower-rung saved-material observation over artifacts produced
by Edge/Layer.

Use the prototype's unresolved public-swarm posture and `mesh-v0-2`
waiter/retry examples as references for flakiness: bounded phases, retry
evidence, timeout/unresolved classification, and no success claim when public
swarm or durable readback does not converge.

Next Causal progress should produce one of:

- completed locally: a public observer `up/status/down` lane plus one-shot
  `observe` command tied to
  Edge/Layer public descriptors;
- a fresh observation over live Edge/Layer public-swarm-derived material;
- an unresolved public observation when the chain flakes or the receipt/evidence
  path is incomplete;
- a compact Spine/Edge/Layer handoff from that live observation preserving
  source refs without upgrading proof.

Next: run the public observer against a fresh Edge/Layer public descriptor or
durable-history source manifest when the chain produces one. If the public
swarm attempt flakes, preserve the resulting unresolved observation honestly.
Do not spend another cycle only expanding posture handoffs, generic matrices,
saved-artifact indexes, or lifecycle-status files unless that work directly
supports the public observer chain above.

Current pressure after the latest work: Causal has the public observer
`up/status/down/observe` CLI surface, plus fail-closed descriptor preflight for
enabled observe attempts that lack a Causal-readable source manifest. The next
Causal objective should be a live observer use, not another lifecycle wrapper
or descriptor-readiness artifact:

```text
CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
npm run public-observer -- observe ...
```

using a fresh Edge/Layer public descriptor or durable-history source manifest
when available. If Edge/Layer are not ready, Causal should stay poised with the
observer CLI and avoid adding more generic matrices, descriptor preflights, or
saved handoff summaries unless they remove a concrete blocker for the live
observe run.

Completed handoff hygiene: the current Causal posture consumer handoff now
sanitizes downstream durable refs so exported material does not leak local temp
paths, workspace paths, SSH/device-local details, or private network addresses.
This remains `consumer_handoff_seam`; it preserves current posture for
Spine/Edge/Layer/generic consumers without upgrading proof. Next still remains
the public observer `observe` run against a fresh Causal-readable Edge/Layer
source manifest when one exists.

Completed preflight: Causal ran the enabled public observer against the current
retained Edge descriptor and Layer public endpoint under
`proof-artifacts/public-observer-descriptor-preflight-2026-06-03/`. The result
is `blocked_waiting_for_causal_observable_source_manifest`; it is
`local_artifact_seam`, did not open swarm or Corestore, and prevents upgrading
retained descriptor material into live Causal public-swarm observation. Next
still requires a fresh Edge/Layer lifecycle source manifest or equivalent
Causal-observable public descriptor.

Completed saved observation: after Layer produced
`proof-artifacts/layer-public-seam-lifecycle-smoke-latest.json`, Causal
consumed it under
`proof-artifacts/adjacent-layer-public-lifecycle-smoke-2026-06-03/`. This is
`saved_readback_seam`; it preserves the Layer lifecycle smoke's latest
request/receipt hashes, latest evidence ref, durable storage/topic/autobase
refs, writer ref, source proof rung, and linkage counts without inventing
missing request/receipt ids. It does not claim live Causal public-swarm proof.
Next still requires direct public-observer use over a Causal-observable source
manifest or equivalent live Edge/Layer lifecycle descriptor.

Spine now records Causal's current lane as:

```text
causal-adjacent-layer-public-material-observed-waiting-for-edge-public-process-material
```

That means Causal should not add another solo matrix, saved adjacent wrapper, or
descriptor-only public observer variant right now. The next useful Causal input
is concrete material from Edge's public process lifecycle or Layer's held public
participant: request/receipt ids and hashes, source proof rung, transport
evidence, durable feed/readback refs, writer refs, linkage status, warnings,
and non-claims. If Causal receives only descriptors, CLI instructions, dirty
worktree state, source imports, tests, or saved local fixtures, classify the
result as lower-rung/preflight material and do not claim live Causal swarm
observation.

## RBC Creation Tripwire

Do not create or depend on `mesh-ecology-rbc` to make the first Edge/Layer/Causal
public-swarm chain work. Causal must first demonstrate observation over
public-swarm-derived material while preserving non-authority boundaries without
RBC.

RBC creation becomes eligible when that unguided chain exists and Causal plus at
least one other active repo repeatedly need the same external evaluation receipt
shape for a boundary question such as: may this observation, promotion,
attachment, citation, branch comparison, dispatch request, or execution request
be used under a scoped rulebook/capability view?

Causal should signal the RBC creation tripwire only when it can provide concrete
source refs for evaluation: observation refs, request/receipt refs, durable refs,
writer refs, source repos, requested capability refs, rulebook refs, scope,
expiry/null, and the reason Causal must cite an external evaluation without
interpreting RBC itself. The desired first RBC lane is report-only:
`allowed | denied | deferred`, `rulebookRef`, `capabilityRef`, `scope`,
`expiry/null`, `reason`, evaluated source refs, evaluator/receipt refs, and
non-authority posture.

Do not signal RBC creation for canonical truth, Layer admission, proof-rung
upgrades, quorum satisfaction, local saved-artifact checks, or any path that
would let RBC replace public-swarm proof, Causal classification, Edge
projection, Layer receipt semantics, Mesh dispatch, Platform consequence, or
repo-local responsibility.

## Priority: Generic Causal Seam Surface

Before depending on fresh Edge or Layer material, Causal Substrate should
harden its own generic seam posture. Use `docs/generic-causal-seam-surface.md`
as the current contract.

Immediate objective list:

1. Completed locally: expose a library-neutral Causal endpoint descriptor
   shape.
2. Completed locally: expose a generic seam-history input envelope that can accept compatible
   request, receipt, evidence, durable, writer, and linkage refs from any repo
   or library.
3. Completed locally: expose a generic observation result envelope with
   classifications, damage findings, unresolved findings, overclaim findings,
   proof fields, transport booleans, non-claims, deferred attachment points,
   and `nextPressure`.
4. Completed locally: add Causal-owned test consumers/smokes that consume the
   generic descriptor, input envelope, and observation result without Edge or
   Layer participation.
5. Completed locally: make public swarm transport booleans evidence-derived,
   never descriptor-, env-, bootstrap-, manifest-, command-name-, or
   declared-rung-derived.
6. Completed locally: add a standalone public-swarm lane using neutral
   compatible seam-history material so Causal can prove its own generic
   observer seam without waiting for Edge/Layer. The local tests cover
   instructions, manifest-only posture, timeout-as-unresolved, and direct-peer
   replication below public/default proof.
7. Completed locally: prove durable observation result write and reopened
   readback.
8. Preserve Edge/Layer/RBC/Mesh/Platform refs as causal input refs only.
9. Completed public run: run the generic source and replica CLIs over the
   declared public Hyperswarm path with `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP`
   unset, then preserve the resulting manifest, replica report, durable
   observation result, and reopened readback as Causal-owned generic
   public-swarm proof.
10. Completed locally: expose a compact generic public seam proof index and
   generic consumer handoff over
   `proof-artifacts/generic-causal-seam-public-swarm-2026-06-03/`, preserving
   the public source proof rung while keeping the index/readback below the live
   public-swarm proof operation.
11. Next: use the generic proof-index consumer handoff only if a real generic
   consumer ambiguity needs it, or prepare/execute the next Causal-owned live
   public-swarm objective that consumes fresh generic seam-history material.
   Avoid adding another saved-artifact layer over the same run unless it
   protects against a concrete overclaim or prepares a named public-swarm
   attempt.
12. Completed public run: prove the generic public-swarm lane preserves
   unresolved classifier behavior over fresh seam-history material by running
   `proof-artifacts/generic-causal-seam-public-swarm-unresolved-2026-06-03/`.
   This preserves a durable public source proof rung but does not turn the
   saved observation readback into a new live swarm proof.
13. Next: only broaden the generic public run matrix if it covers a materially
   different classifier branch, such as hash mismatch damage or proof-label
   overclaim, and either execute it over public swarm or name the exact
   public-swarm pressure it prepares. Otherwise, wait for a real generic
   consumer need or fresh Edge/Layer public material.
14. Completed public run: prove the generic public-swarm lane preserves
   damaged classifier behavior over fresh seam-history material by running
   `proof-artifacts/generic-causal-seam-public-swarm-damaged-2026-06-03/`.
   The replica report reached `damaged`, preserved the `hash_mismatch`
   classified happening, and kept the saved observation readback below the live
   public-swarm proof operation.
15. Next: only add another generic public matrix run for a distinct remaining
   branch, such as proof-label overclaim, receipt without request, or duplicate
   id, if it serves a real generic consumer need or explicitly prepares a
   named public-swarm attempt. Otherwise, wait for fresh Edge/Layer public
   material or consumer demand.
16. Completed public run: prove the generic public-swarm lane preserves
   duplicate-id damaged classifier behavior over fresh seam-history material
   by running
   `proof-artifacts/generic-causal-seam-public-swarm-duplicate-id-2026-06-03/`.
   The replica report reached `damaged`, preserved the `duplicate_id`
   classified happening, and kept the saved observation readback below the live
   public-swarm proof operation.
17. Next: stop expanding the generic public matrix unless a real consumer need
   or fresh public-swarm objective names the remaining branch. Receipt without
   request and proof-label overclaim remain available branches, but should not
   be run just to add more artifacts.
18. Completed local inspection: scan Edge and Layer for fresh public
   endpoint/history material ready for Causal observation. The scan found only
   already-consumed Edge receipts and dirty Layer public HyperDHT worktree
   changes, not committed adjacent proof artifacts. See
   `docs/outward-public-material-scan-2026-06-03.md`.
19. Cleared wait condition: Edge and Layer now have fresh committed adjacent
   material for Causal to inspect.
   - Layer commit `717ee49c1092929af72eb9c1e39dfb6e87f59a78` preserves a
     retained public proof export bundle under
     `proof-artifacts/layer-public-proof-export-bundle-latest/`, including
     public endpoint, history index, proof bundle, causal readiness, evidence
     detail, provenance, handoff, replay, negative matrix, and non-claim
     material.
   - Edge commit `d9043723fc0aeda2c6de5e510ef5df9826034275` adds compatible
     Causal handoff export and handoff contract smoke paths. Current Edge
     verification passes those paths; the older duplicate `uniqueStrings`
     failure is historical, not a current blocker.
20. Completed locally: add a narrow adjacent-material observation path over
   fresh Layer public proof/readiness material and Edge compatible handoff
   readback shapes. The command path preserves request ids/hashes, receipt
   ids/hashes, evidence refs/hashes where present, durable refs, writer refs,
   source repo refs, proof rung labels, linkage status, and non-claims while
   classifying compatible, damaged, or unresolved. This remains
   `saved_readback_seam` over supplied/exported material and does not claim
   live Causal swarm proof.
21. Completed saved readback: run the adjacent-material observation CLI
   against actual Layer public proof/readiness output and preserve the result
   under `proof-artifacts/adjacent-public-material-2026-06-03/`. The source
   material classified `compatible`; Causal preserved request/receipt/evidence
   refs, durable refs, writer refs, source repo refs, proof labels, linkage
   status, and non-claims. This remains `saved_readback_seam` and does not
   claim live Causal swarm proof.
22. Completed adapter preparation: Causal now accepts Edge's current
   `causalHandoffExport.edgeHandoffReadback` wrapper shape as the same
   lower-rung Edge handoff readback input. This prevents wrapper mismatch when
   the concrete Edge export pack is handed over, but it does not synthesize
   Edge material or claim that Causal has consumed a current Edge artifact.
23. Completed saved readback: consume actual Edge compatible handoff readback
   material from Edge commit `48b0529` and preserve the result under
   `proof-artifacts/adjacent-edge-compatible-handoff-2026-06-03/`. The source
   material classified `compatible`; Causal preserved request/receipt refs,
   durable refs, writer refs, source repo refs, proof labels, linkage status,
   and non-claims. This remains `saved_readback_seam` and does not claim live
   Causal swarm proof.
24. Completed local inspection: Edge current head exposes compatible Causal
   handoff export capability, but no concrete current Edge compatible handoff
   export JSON was present in Edge `proof-artifacts/` during Causal inspection.
   See `docs/edge-compatible-handoff-artifact-scan-2026-06-03.md`. Causal
   should not use Edge source code, tests, dirty worktree changes, or a local
   Causal-generated smoke as a substitute for the handed artifact.
25. Scan status update: the Edge scan above observed Edge before commit
   `cbbabf4eb3a2481966c8d9ec3cb827c00f80c4b1`. Edge has since committed
   Causal adjacent observation import/feed/read/card capability, and that is
   useful round-trip machinery. It still does not by itself give Causal a
   retained current Edge handoff artifact under Edge `proof-artifacts/`, so the
   scan's no-substitute conclusion remains active.
26. Rechecked Edge after `106ff13937ef3abcd9756046720f93f16ec41266`; Edge's
   objective text now says the same thing explicitly. Edge can round-trip
   compatible handoff export material through Causal's adjacent-material CLI,
   but there is still no current retained compatible Causal handoff export
   artifact in Edge `proof-artifacts/`. See the recheck section in
   `docs/edge-compatible-handoff-artifact-scan-2026-06-03.md`.
27. Coordination pressure: Layer and Edge concrete saved-adjacent artifact
   pressures are satisfied for now. Do not broaden the adjacent-material
   adapter with more synthetic cases. The next stronger move is either a
   concrete consumer request for the saved observations, or Causal itself
   reading Edge/Layer-derived durable replicated seam history through the
   declared public Hyperswarm path.
28. Completed public run: publish a seam-history envelope derived from the
   saved Layer and Edge adjacent observations and read it back through Causal's
   declared public Hyperswarm source/replica lane under
   `proof-artifacts/edge-layer-derived-adjacent-public-swarm-2026-06-03/`.
   The replica report reached `compatible`, the observation result reached
   `compatible_with_warnings`, and the strongest proof rung for Causal's read
   operation is `durable_replicated_public_swarm_seam`. The warning remains
   important: the run proves Causal read Edge/Layer-derived durable material
   over public swarm; it does not prove Edge or Layer themselves published live
   seam history directly to Causal.
29. Next: do not add another saved-adjacent or derived public-swarm artifact
   unless a concrete consumer asks for this material, a distinct overclaim risk
   needs guarding, or Edge/Layer produce a live public-swarm handoff intended
   for direct Causal reading. Otherwise report the current posture to Spine or
   the requesting consumer with exact artifact refs and proof rungs.
30. Completed consumer handoff: emit
   `proof-artifacts/current-causal-posture-handoff-2026-06-03/current-causal-posture-consumer-handoff.json`
   as `consumer_handoff_seam` for Spine, Edge, Layer, or generic consumers.
   It preserves exact artifact refs, hashes, request/receipt refs, proof rungs,
   non-claims, and the caveat that the public read is over derived material,
   not direct Edge/Layer live publication to Causal.
31. Next: pause local expansion. The useful next move now requires one of:
   a concrete consumer response to the current-posture handoff, a distinct
   overclaim risk to guard, or fresh Edge/Layer live public-swarm material
   intended for direct Causal reading.
32. Current adjacent pressure: Edge commit
   `671c3c0c1df1f39649bc33628eaf682c992e8c41` preserves
   `compatible-public-process-up/probe/status/down`, default-public same-device
   results, and unresolved device-boundary-missing packets. Causal should wait
   for a concrete sanitized process export or returned device-boundary artifact
   before claiming a new Edge public process observation.
33. Current Layer support pressure: Layer commit
   `55cd561b03d25e470e68624542e18bd9c83bcd5e` adds a held participant
   consumer handoff surface. Causal may consume its committed output as saved
   adjacent material if a consumer needs that observation, but must not label
   that saved artifact as Causal's own live public-swarm read or publish SSH
   setup details.

This is not permission to claim Edge/Layer public seam proof. Causal may claim
that only after it actually consumes Edge/Layer-derived durable public-swarm
seam history. The standalone lane proves Causal's own ability to observe
compatible seam-history material over public swarm.

## Next Outward Moves

The current refreshed saved-artifact readiness, consumer handoff, next public
run, next Edge handoff contract, and next proof index list is complete. Causal
has consumed the current Layer public device-boundary handoff:

```text
mesh-ecology-layer/proof-artifacts/layer-convergence-20260604T040145Z/layer-public-device-boundary-handoff-packet.json
```

The output should preserve Layer request id/hash, Layer receipt id/hash,
receipt writer ref, evidence ref, Autobase key, topic, device refs,
classification, proof labels, and non-claims. It should classify the Layer
source proof as compatible public device-boundary material while labeling
Causal's own operation as selected adjacent material or saved readback unless
Causal itself reads durable replicated public-swarm history.

Build outward moves around handing the Causal observation to Edge/Spine,
preparing a direct Causal public reader over Edge/Layer-derived history only if
needed, or responding to a concrete consumer ambiguity:

- prepare another public-swarm-only device objective from
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/public-seam-proof-index.json`
  only if the operator chooses another live run;
- if a consumer asks for the latest saved index, hand
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/public-proof-index-consumer-handoff.json`,
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/public-proof-index-consumer-handoff-readback.json`,
  and
  `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/public-seam-proof-index.json`
  as observation-only material;
- fresh Edge/Layer material should now mean current lifecycle material, not
  older retained handoff loops. Prefer running the adjacent-material path over
  actual handed outputs from:
  - Edge's current `edge-public-process-device-boundary-attempt` material only
    after Edge sanitizes committed runtime paths in the packet, manifest, and
    process artifact copies. Treat the current attempt as same-device/default
    public or saved-readback lifecycle evidence unless a returned second-host
    artifact proves an actual device boundary.
  - Layer's current two-device public device-boundary lab output at
    `proof-artifacts/layer-convergence-20260604T040145Z/`. Causal may observe
    `device_boundary_public_swarm_complete` as bounded causal input, but must
    preserve Layer receipt/evidence refs without admitting evidence, deciding
    Layer policy, or upgrading Causal's operation proof beyond what Causal
    actually read.
  Reading Edge/Layer-derived durable replicated seam history through public
  Hyperswarm remains stronger than another saved-artifact expansion, but only
  if Causal itself performs that durable public reader operation.
- Causal has now read an Edge/Layer-derived adjacent seam-history envelope
  through public Hyperswarm under
  `proof-artifacts/edge-layer-derived-adjacent-public-swarm-2026-06-03/`.
  Treat this as Causal public read proof over derived material, not direct
  Edge/Layer live publication to Causal.
- keep any new saved-artifact consumer checks explicitly lower than the source
  public swarm proof unless Causal itself reopens and reads durable replicated
  seam history over public Hyperswarm;
- do not add another saved-artifact expansion unless it removes a real
  consumer ambiguity or guards a real overclaim risk, and names the stronger
  swarm/public-swarm pressure it serves;
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
- Layer or Edge has new public-swarm endpoint/history material that needs
  bounded causal observation rather than more Causal-only artifact indexing.
- A higher proof rung is tempting but input came from supplied JSON, files,
  stdin/stdout, direct imports, or fixtures.
- Layer receipt/evidence refs would need Layer admission interpretation.
- Edge needs a projection-safe result shape before more Causal internals.

## Guardrail

Lower-rung seam proof is valid when it proves artifact compatibility, saved
readback, consumer handoff, or local observation. It is not swarm-derived seam
proof. Public swarm seam proof requires swarm-carried contact; durable
replicated public swarm seam proof requires durable write, replication, reopen,
and readback through the declared public swarm path.

Instructions artifacts, readiness reports, static fixtures, JSON files, and
operation-shaped report readbacks are lower proof rungs unless the reader
actually consumed durable DHT/Hyperswarm-derived seam history.
