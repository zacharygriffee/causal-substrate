# Standalone Seam Posture

This document states the long-term posture for making `causal-substrate` useful
outside the Mesh Ecology repo family while preserving the repo family's
canonical swarm seam.

## Target Posture

`causal-substrate` should stand on its own as an observer-scoped causal
continuity substrate.

Adjacent repos remain the strongest source of pressure because they produce
real requests, receipts, evidence refs, durable refs, writer refs, and proof
rung ambiguity. That pressure should harden Causal's generic seams rather than
locking the core contract to Edge, Layer, Platform, Conduit, Spine, Virtualia,
or any other family vocabulary.

The target is a two-seam posture:

- a canonical swarm seam for Mesh Ecology family proof;
- a generic API seam for non-Mesh consumers, local tools, examples, and tests.

The two seams may carry the same causal material, but they do not imply the
same proof rung.

## Canonical Mesh Ecology Seam

For the Mesh Ecology repo family, the canonical Causal seam is durable
replicated public-swarm seam history.

That means the highest family proof path requires Causal itself to:

- discover or receive the public-swarm-carried durable history through the
  declared swarm path;
- read the replicated durable material, not only a supplied descriptor,
  manifest, saved JSON file, fixture, command name, or environment declaration;
- emit a durable bounded observation result that causally references the source
  ids, hashes, durable refs, writer refs, linkage, and proof labels;
- close, reopen, and read back the durable observation result;
- classify compatible, unresolved, damaged, incompatible, or overclaimed input
  without claiming canonical truth, Layer admission, RBC interpretation, Mesh
  publication, authority, quorum satisfaction, or production continuity.

Direct API submissions, local files, saved readbacks, fixtures, supplied JSON,
and handoff documents remain useful family material, but they are lower proof
rungs unless paired with the swarm-backed durable read path.

## Generic API Seam

The API seam is the adoption surface for systems that are not using the Mesh
Ecology swarm path yet, or are not Mesh Ecology repos at all.

The API seam should expose a library-neutral contract around:

- endpoint descriptors;
- generic seam-history input envelopes;
- request, receipt, evidence, durable, writer, and linkage refs;
- proof labels and evidence-derived transport booleans;
- bounded observation results;
- consumer handoff and readback surfaces.

An API consumer should be able to ask Causal:

- what source refs were preserved;
- how the observed happenings were classified;
- which proof rung is actually supported;
- which overclaims, damage findings, or unresolved findings exist;
- what Causal explicitly does not claim;
- what pressure remains next.

The API seam should be useful by itself, but it must not silently upgrade input
into public-swarm proof. When a consumer needs the Mesh Ecology canonical seam,
the same or equivalent material must move through the durable replicated
public-swarm path.

## Long-Term Work Tracks

### 1. Contract consolidation

Make this two-seam posture the stable planning line in the README, current
objectives, consumer adoption guide, and generic seam surface docs.

Success condition:

- a new reader can tell that Causal is standalone-capable, while Mesh Ecology
  family proof remains swarm-canonical.

### 2. Generic API hardening

Promote the current generic seam surface into a stable public API contract.

The stable surface should cover:

- descriptor builders and validators;
- generic seam-history envelope builders and validators;
- observation classification;
- proof-rung and transport-boundary checks;
- durable observation emission and readback;
- compact consumer handoff generation.

Success condition:

- a neutral non-Mesh example can feed request/receipt/evidence material into
  Causal and consume the bounded observation result without importing adjacent
  repo vocabulary.

### 3. Canonical swarm hardening

Keep the public-swarm lane as the strongest family proof surface.

The lane should continue to produce:

- source instructions;
- source manifest;
- replica report;
- durable observation result;
- reopened readback;
- proof index;
- consumer handoff.

Success condition:

- compatible, unresolved, damaged, duplicate-id, and overclaim branches can be
  demonstrated over the swarm-backed path or explicitly deferred until named
  pressure requires them.

### 4. Proof-rung enforcement

Make proof-rung boundaries machine-checkable wherever practical.

Guard against these upgrades:

- descriptor to public proof;
- manifest to observation proof;
- supplied JSON to swarm proof;
- saved readback to durable replicated proof;
- direct API submission to Mesh Ecology canonical proof;
- adjacent repo label to Causal operation proof.

Success condition:

- overclaim findings are first-class and tests prove lower-rung material cannot
  claim `durable_replicated_public_swarm_seam`.

### 5. Standalone consumer adoption

Add consumer-facing examples and docs that do not mention Mesh Ecology family
repos except as optional adapters.

The examples should show:

- a neutral producer of request/receipt/evidence refs;
- a direct API observation;
- the lower proof rung of that API observation;
- the upgrade path into swarm-backed proof when the consumer needs stronger
  evidence.

Success condition:

- an outside project can adopt Causal for observer-relative continuity without
  reading Edge or Layer docs first.

### 6. Adapter discipline

Keep adjacent-family integrations as adapters over the generic seam.

Edge, Layer, Platform, Conduit, Spine, Virtualia, and future family repos may
provide concrete pressure and source material. They should not define the core
generic contract.

Success condition:

- adapter tests prove family-shaped inputs remain bounded causal refs and do
  not grant authority, admission, publication, quorum, or production continuity.

### 7. Release stability

Stabilize the public export surface as pressure accumulates.

Prefer:

- stable generic API exports;
- experimental adapter exports;
- internal lab helpers that can move without promising compatibility.

Keep schema identities explicit and reject unsupported versions instead of
guessing.

Success condition:

- Causal can publish a small, teachable stable seam without freezing every lab
  helper or adjacent adapter.

## Current Defaults

Until implementation pressure says otherwise:

- Corestore and Hypercore remain the serious substrate lane.
- Hyperbee remains deferred until lookup, catalog, or indexing pressure is
  concrete.
- Multiwriter coordination remains outside continuity-bearing histories by
  default.
- API seam material is real adoption material, but not canonical Mesh Ecology
  swarm proof.
- Swarm seam material is canonical for Mesh Ecology only when Causal performs
  the durable replicated public-swarm read and readback path itself.
