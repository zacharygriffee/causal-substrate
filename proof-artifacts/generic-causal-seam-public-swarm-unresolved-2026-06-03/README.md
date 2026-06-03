# Generic Causal Seam Public Swarm Unresolved Run

Date: 2026-06-03

This directory preserves a Causal-owned generic public-swarm seam run using
neutral seam-history material that is intentionally unresolved: the request has
no matching receipt.

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

The replica report reached `unresolved` and the embedded observation result
preserved:

- final classification: `unresolved`
- strongest proof rung: `durable_replicated_public_swarm_seam`
- unresolved finding: `request has no matching receipt in the envelope`

This is not Edge/Layer seam proof, Layer admission, RBC interpretation, Mesh
publication, authority, canonical truth, or production continuity. The saved
observation result and readback preserve the live source proof rung, but the
readback itself is a lower-rung saved artifact and does not open swarm again.
