# Generic Causal Seam Surface

Status: priority surface for the next Causal Substrate lane.

This document defines what Causal Substrate must generically expose at its own
seam before it depends on Edge, Layer, or any other framework repo. The goal is
independent causal-observer competence across compatible seam-history
libraries, without turning Causal into an authority, Layer admission engine,
RBC evaluator, Mesh publisher, or production continuity writer.

This generic seam is also the long-term API adoption surface for non-Mesh
consumers. For the Mesh Ecology repo family, durable replicated public-swarm
history remains the canonical seam proof path. API submissions, fixtures,
saved readbacks, and direct handoffs are valid lower-rung material, but they do
not replace the family swarm seam.

## Standing Boundary

Causal Substrate may stand on its own by proving that it can:

- discover or receive compatible seam-history endpoints;
- consume durable request, receipt, history, and evidence refs;
- preserve source ids, hashes, repos, durable refs, writer refs, linkage, and
  proof labels;
- classify linked, damaged, unresolved, incompatible, stale, missing,
  duplicate, and overclaimed happenings;
- emit durable bounded observation results;
- reopen and read back those results;
- hand observations to consumers without granting authority.

Causal Substrate must not claim Edge/Layer seam proof until it actually
observes Edge/Layer-derived durable public-swarm seam history. It may still
prove its own generic public-swarm seam using toy or library-neutral compatible
seam-history material.

## Required Endpoint Descriptor

A Causal seam endpoint should expose a durable descriptor with:

- `endpointId`
- `repoName: causal-substrate`
- `lane`
- `schemaVersion`
- `acceptedInputKinds`
- `emittedOutputKinds`
- `schemaRefs`
- `proofRung`
- `transportPosture`
- `durableFeedRefs`
- `writerRefs`
- `readbackCommand`
- `nonClaims`

The descriptor is a declaration only. It does not prove public swarm transport
unless another participant discovers it through the declared swarm path and the
history/result chain is durably observed and read back.

## Generic Input Envelope

Causal should accept a library-neutral seam-history envelope:

- `historyId`
- `historyHash`
- `sourceRepos`
- `sourceSchemaRefs`
- `transportProof`
- `durableRefs`
- `writerRefs`
- `requests`
- `receipts`
- `evidenceRefs`
- `linkage`
- `proofLabels`
- `warnings`

Standalone API consumers should prefer
`buildGenericCausalSeamHistoryEnvelope` and
`assertGenericCausalSeamHistoryEnvelope` instead of hand-authoring this shape.
Those helpers default direct API submissions to lower-rung control-plane
material and validate request, receipt, evidence, transport, linkage, proof
label, and warning fields before observation classification.

Each request and receipt record should carry:

- stable id
- content hash
- source repo
- source durable ref
- writer ref
- schema ref
- causal parent refs when available
- linkage status
- observed proof rung

Layer-side receipts, Edge-side operator requests, Causal observation receipts,
future RBC receipts, Mesh receipts, or Platform receipts are all causal input
refs only until the owning repo proves and labels them.

## Generic Output Envelope

Causal should emit an observation result with:

- `observationId`
- `observationHash`
- `observedHistoryId`
- `observedHistoryHash`
- `sourceRefsPreserved`
- `classification`
- `classifiedHappenings`
- `damageFindings`
- `unresolvedFindings`
- `overclaimFindings`
- `proof`
- `transportBooleans`
- `consumerProjection`
- `nonClaims`
- `deferredAttachmentPoints`
- `nextPressure`

For direct API consumers, Causal may also emit two lower-rung API artifacts
built from a valid observation:

- `generic-causal-seam-api-observation-readback`, which reopens a saved
  observation JSON and proves that the source refs, proof rungs, non-claims,
  and boundary survived saved readback;
- `generic-causal-seam-api-consumer-handoff`, which preserves observation
  ids/hashes, source refs, classifications, proof rungs, non-claims, and next
  pressure for bounded consumer use.

These artifacts do not open Hyperswarm, open Corestore, write consumer state,
or upgrade proof into the Mesh Ecology canonical swarm seam. A direct API
readback uses `saved_readback_seam` as its operation proof rung while
preserving the original observation's source proof rung exactly.

Allowed top-level classifications:

- `compatible`
- `compatible_with_warnings`
- `unresolved`
- `damaged`
- `incompatible`
- `overclaimed`

Per-happening classifications may be more specific, including:

- `linked_request_receipt`
- `missing_receipt`
- `receipt_without_request`
- `hash_mismatch`
- `source_ref_missing`
- `writer_ref_missing`
- `durable_ref_missing`
- `duplicate_id`
- `stale_observation`
- `proof_label_overclaim`
- `schema_incompatible`

## Proof And Transport Fields

Every observation result should expose:

- `strongestProofRung`
- `operationProofRung`
- `sourceProofRung`
- `publicSwarmTransportHappened`
- `testnetSwarmTransportHappened`
- `controlPlaneOnly`
- `durableFeedBackedHistoryObserved`
- `receivingRepoObservedReplicatedPath`
- `durableObservationResultEmitted`
- `receiptOrResultCausallyReferencesSources`
- `reopenedReadbackDerivedFromDurableHistory`

`publicSwarmTransportHappened` must be evidence-derived. It cannot be inferred
from a descriptor, an environment variable, a bootstrap setting, a command
name, a saved manifest, or a declared proof rung alone.

## Required Non-Claims

Every Causal seam output must explicitly preserve these non-claims:

- no canonical history claim
- no Layer evidence admission
- no RBC interpretation
- no quorum satisfaction
- no authority grant
- no Mesh publication
- no production continuity write

If the input includes future RBC-shaped, governance-shaped, Layer-shaped,
Mesh-shaped, Platform-shaped, or authority-shaped refs, Causal may preserve and
classify them as causal refs only.

## Public-Swarm Standalone Lane

Causal's independent public-swarm lane should prove:

1. A source writer publishes compatible generic seam-history material to durable
   feed-backed storage over default public HyperDHT/Hyperswarm.
2. A Causal reader discovers and consumes that durable history through public
   swarm, not through IPC, stdin/stdout, direct imports, local fixtures, or
   parent-passed semantic refs.
3. Causal emits a durable observation result that causally references the
   source request/receipt/history ids and hashes.
4. Causal closes and reopens storage and derives the same result/readback from
   durable history.
5. The result classifies public swarm flake honestly as compatible,
   unresolved, damaged, or overclaimed.

This lane may use neutral toy records. It should not wait for Edge or Layer
when the objective is proving Causal's own generic observer seam.

## Consumer Fit

Consumers should be able to use Causal output as:

- Edge projection input;
- Layer feedback about supplied receipt refs;
- Spine posture evidence;
- future RBC evaluation input refs;
- Mesh or Platform causal context refs.

Consumer fit does not let Causal mutate consumer state. It emits bounded
observation material only.

For non-Mesh consumers, this surface is sufficient as an API contract when the
consumer only needs bounded causal observation. For Mesh Ecology consumers, the
same surface can describe the material, but canonical proof requires Causal's
public-swarm reader to observe durable replicated history and produce a durable
readback.

## Deferred Attachment Points

Keep inert fields for:

- referent promotion
- branch compatibility graph
- canonical continuity state
- RBC interpretation
- Layer admission
- Mesh publication
- authority decisions
- production causal history

These attachment points are not claims. They are reserved slots for future repo
receipts and owner-specific proof.
