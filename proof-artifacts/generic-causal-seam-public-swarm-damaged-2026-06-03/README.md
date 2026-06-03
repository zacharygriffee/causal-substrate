# Generic Causal Seam Public Swarm Damaged Run

Date: 2026-06-03

This directory preserves a Causal-owned generic public-swarm seam run using
neutral seam-history material that is intentionally damaged: the receipt points
to the request id but carries a mismatched source request hash.

Artifacts:

- `generic-seam-history-input.json`
- `generic-public-source-manifest.json`
- `generic-public-replica-report.json`
- `generic-public-observation-result.json`
- `generic-public-observation-readback.json`

The source and replica commands ran with:

- `CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset

The replica report reached `damaged` and the embedded observation result
preserved:

- final classification: `damaged`
- classified happening: `hash_mismatch`
- strongest proof rung: `durable_replicated_public_swarm_seam`
- damage finding: `receipt source request hash does not match the referenced request hash`

This is not Edge/Layer seam proof, Layer admission, RBC interpretation, Mesh
publication, authority, canonical truth, or production continuity. The saved
observation result and readback preserve the live source proof rung, but the
readback itself is a lower-rung saved artifact and does not open swarm again.
