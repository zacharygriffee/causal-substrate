# Public Hyperswarm Device-To-Device Operator Refresh

This directory is prepared for an operator-selected public Hyperswarm refresh.

Initial package contents were local refresh input material:

- `seam-history-input.json`
- `public-refresh-input-package.json`

The package operation rung is
`local_refresh_input_package_over_saved_public_hyperswarm_material`.

This is not a public swarm proof. It remains local supplied seam-history input
until the source device writes it to durable Corestore material and the replica
device consumes it through public Hyperswarm.

The operator-selected public refresh was then run device-to-device:

- source device: `platform-lab` (`ztouch`)
- replica device: `mesh-lab` (`surface`)
- source manifest: `public-source-manifest.json`
- replica report: `public-replica-reader-report.json`

The replica report is the first refreshed artifact in this directory that
carries the live public proof rung
`public_hyperswarm_replicated_durable_seam_history_observation`.

The refreshed public report was then derived into local saved-artifact
readbacks and handoff material:

- `public-replica-reader-report-readback.json`
- `edge-projection-handoff-bundle.json`
- `edge-projection-handoff-bundle-readback.json`
- `edge-layer-seam-history-proof-summary.json`
- `public-artifact-reproducibility-check.json`

Those derived artifacts preserve the public source proof rung while their own
operations are local saved-artifact checks/readbacks. They do not open swarm or
Corestore and do not upgrade proof.

Edge imported the refreshed handoff bundle under
`mesh-ecology-edge/proof-artifacts/causal-substrate-public-device-operator-refresh-handoff-2026-06-01/`
as observation-only projection input. Causal Substrate then derived:

- `observation-to-edge-projection-contract.json`
- `proof-summary-consumer-readback.json`

These artifacts read saved Causal and Edge artifacts only. They preserve the
public source proof rung for consumers but do not call Edge, write Edge
projection state, or upgrade proof.

The refreshed saved-artifact chain was then indexed for consumers:

- `public-swarm-refresh-decision.json`
- `public-seam-proof-index.json`

The refresh decision and index are local saved-artifact operations. They point
at refreshed public-run material, preserve request/receipt refs and public
source proof labels, reject configured-bootstrap evidence, and do not claim a
new live swarm run.

The refreshed proof index is also exposed as an observation-only consumer
handoff:

- `public-proof-index-consumer-handoff.json`
- `public-proof-index-consumer-handoff-readback.json`

This handoff is a local saved-index operation. It preserves the public source
proof rung for Edge, Layer, and Spine consumers, but it does not call those
systems, write projection state, admit Layer evidence, interpret RBC, grant
authority, publish to Mesh, or upgrade proof. Its readback is also local and
only verifies the saved handoff remains readable and bounded.

The refreshed proof index was then used to prepare the next public-swarm-only
device objective:

- `operator-selected-public-refresh-command.json`
- `public-refresh-readiness-gate.json`

Those artifacts are instructions/readiness only. They name
`proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/` as
the next run output directory, require public Hyperswarm, and require
`CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` to be unset.

## Prepared Public Commands

Run the source command on `platform-lab`:

```bash
env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP \
  CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
  CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
  npx tsx scripts/run-edge-layer-seam-history-public-source-device.ts \
  --input proof-artifacts/public-hyperswarm-device-to-device-operator-refresh/seam-history-input.json \
  --manifest-output proof-artifacts/public-hyperswarm-device-to-device-operator-refresh/public-source-manifest.json \
  --storage-dir .tmp/public-hyperswarm-device-to-device-operator-refresh-source \
  --namespace public,device,seam-history,operator-refresh \
  --keep-alive-ms 600000
```

Run the replica command on `mesh-lab` after transferring
`public-source-manifest.json`:

```bash
env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP \
  CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
  CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
  npx tsx scripts/run-edge-layer-seam-history-public-replica-device.ts \
  --manifest proof-artifacts/public-hyperswarm-device-to-device-operator-refresh/public-source-manifest.json \
  --report-output proof-artifacts/public-hyperswarm-device-to-device-operator-refresh/public-replica-reader-report.json \
  --storage-dir .tmp/public-hyperswarm-device-to-device-operator-refresh-replica \
  --namespace public,device,seam-history,operator-refresh
```

## Boundary

These artifacts do not claim canonical history, Layer admission, RBC
interpretation, quorum satisfaction, Mesh publication, authority, referent
promotion, Edge projection writes, or production continuity.
