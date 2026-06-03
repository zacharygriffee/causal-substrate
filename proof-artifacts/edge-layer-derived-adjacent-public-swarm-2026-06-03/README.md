# Edge/Layer-Derived Adjacent Public Swarm Run - 2026-06-03

This directory preserves a Causal-owned public Hyperswarm read over seam-history
material derived from actual saved adjacent Layer and Edge observations.

Source material:

- `proof-artifacts/adjacent-public-material-2026-06-03/causal-adjacent-layer-observation.json`
- `proof-artifacts/adjacent-edge-compatible-handoff-2026-06-03/causal-adjacent-edge-observation.json`

Artifacts:

- `edge-layer-derived-seam-history-input.json`
- `generic-public-source-manifest.json`
- `generic-public-replica-report.json`
- `generic-public-observation-result.json`
- `generic-public-observation-readback.json`

Commands ran with:

- `CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset

Result:

- replica report status: `compatible`
- observation classification: `compatible_with_warnings`
- strongest Causal read proof rung:
  `durable_replicated_public_swarm_seam`
- reader evidence source: `reader_observed_replicated_public_swarm_path`

The warnings are intentional. The material Causal published for this run began
as saved adjacent observations, not as Edge or Layer directly publishing a live
seam to Causal. The stronger proof here is that Causal itself read the
Edge/Layer-derived seam-history envelope through the declared public Hyperswarm
path and preserved the source refs. It is not Layer admission, Edge projection
authority, canonical truth, RBC interpretation, Mesh publication, or production
continuity.

The source manifest alone is lower proof. The replica report is the live proof
artifact for this run. The extracted observation result and readback are saved
readback artifacts that preserve the public source proof without reopening
swarm again.
