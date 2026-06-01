# Public Hyperswarm Device-To-Device Operator Refresh Next

This directory contains the input package for the next prepared public
Hyperswarm device-to-device objective.

Current contents:

- `seam-history-input.json`
- `public-refresh-input-package.json`

The package operation rung is
`local_refresh_input_package_over_saved_public_hyperswarm_material`.

This is not a new public swarm proof. It is local supplied seam-history input
until a source device writes it to durable Corestore material and a replica
device consumes it through public Hyperswarm.

The prepared command and readiness gate live in the preceding refreshed run
directory:

- `../public-hyperswarm-device-to-device-operator-refresh/operator-selected-public-refresh-command.json`
- `../public-hyperswarm-device-to-device-operator-refresh/public-refresh-readiness-gate.json`

Those command artifacts require public Hyperswarm with
`CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset. They are instructions/readiness
artifacts only and do not run swarm, open Corestore, call Edge, call Layer,
write projection state, admit Layer evidence, interpret RBC, grant authority,
publish to Mesh, or write production continuity.
