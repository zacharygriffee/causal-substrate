# Generic Causal Seam Public Swarm Run

Date: 2026-06-03

This directory preserves a Causal-owned generic public-swarm seam run using
neutral compatible seam-history material. It does not claim Edge/Layer seam
proof, Layer admission, RBC interpretation, Mesh publication, authority,
canonical truth, or production continuity.

Artifacts:

- `generic-seam-history-input.json`
- `generic-public-source-manifest.json`
- `generic-public-replica-report.json`
- `generic-public-observation-result.json`
- `generic-public-observation-readback.json`
- `generic-public-seam-proof-index.json`
- `generic-public-proof-index-consumer-handoff.json`
- `generic-public-proof-index-consumer-handoff-readback.json`

The source command ran with:

- `CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset

The replica report reached `compatible` and the observation result reached:

`durable_replicated_public_swarm_seam`

The source manifest remains manifest-only lower proof. The replica report is
the artifact that proves Causal read replicated durable generic seam material
through the declared public Hyperswarm path. The extracted observation result
and readback are saved-artifact readback material that preserve the source
public proof rung without opening swarm again.

The proof index, consumer handoff, and consumer handoff readback are lower-rung
preservation artifacts. They let generic consumers inspect preserved ids,
hashes, refs, proof labels, and non-claims from this run without treating the
saved index or handoff as a new live public-swarm proof operation.
