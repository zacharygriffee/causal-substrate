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

## Good Next Moves

Choose work that improves bounded causal observation:

- Keep local supplied JSON/file/stdin observation labeled
  `local_supplied_material`.
- Preserve request ids/hashes, receipt ids/hashes, source repos, durable refs,
  writer refs, and linkage status in every result.
- Improve readback contracts and guardrails for overclaim detection.
- Prepare or run a separate DHT/Hyperswarm-derived seam-history input lane only
  when it actually reads durable Edge/Layer seam history.
- Make observation output easy for Edge to project as compatible, damaged, or
  unresolved without granting Edge authority.

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
