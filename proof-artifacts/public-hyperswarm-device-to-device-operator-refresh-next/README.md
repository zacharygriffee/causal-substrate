# Public Hyperswarm Device-To-Device Operator Refresh Next

This directory contains the input package for the next prepared public
Hyperswarm device-to-device objective.

Current contents:

- `seam-history-input.json`
- `public-refresh-input-package.json`
- `public-source-manifest.json`
- `public-replica-reader-report.json`
- `public-replica-reader-report-readback.json`
- `edge-projection-handoff-bundle.json`
- `edge-projection-handoff-bundle-readback.json`
- `edge-layer-seam-history-proof-summary.json`
- `public-artifact-reproducibility-check.json`
- `observation-to-edge-projection-contract.json`
- `proof-summary-consumer-readback.json`

The package operation rung is
`local_refresh_input_package_over_saved_public_hyperswarm_material`.

This is not a new public swarm proof. It is local supplied seam-history input
until a source device writes it to durable Corestore material and a replica
device consumes it through public Hyperswarm.

The prepared public device objective was run on the standby devices:

- source device: `platform-lab` (`ztouch`)
- replica device: `mesh-lab` (`surface`)
- namespace: `public,device,seam-history,operator-refresh,next`

The source and replica commands were run with
`CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset and
`CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1`. The replica report is the first
artifact in this directory carrying the live proof rung
`public_hyperswarm_replicated_durable_seam_history_observation`.

The replica report was then derived into local saved-artifact readbacks and
handoff material. These derived artifacts preserve the public source proof rung
but their own operations are local checks/readbacks. They do not open swarm,
open Corestore, call Edge, admit Layer evidence, interpret RBC, grant
authority, publish to Mesh, or upgrade proof.

Edge imported the handoff bundle under
`mesh-ecology-edge/proof-artifacts/causal-substrate-public-device-operator-refresh-next-handoff-2026-06-01/`
as observation-only projection input. Causal Substrate then derived the saved
observation-to-Edge contract and proof-summary consumer readback from saved
artifacts only. These artifacts preserve the public source proof rung but do
not call Edge, write projection state, or upgrade proof.

The prepared command and readiness gate live in the preceding refreshed run
directory:

- `../public-hyperswarm-device-to-device-operator-refresh/operator-selected-public-refresh-command.json`
- `../public-hyperswarm-device-to-device-operator-refresh/public-refresh-readiness-gate.json`

Those command artifacts require public Hyperswarm with
`CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset. They are instructions/readiness
artifacts only and do not run swarm, open Corestore, call Edge, call Layer,
write projection state, admit Layer evidence, interpret RBC, grant authority,
publish to Mesh, or write production continuity.
