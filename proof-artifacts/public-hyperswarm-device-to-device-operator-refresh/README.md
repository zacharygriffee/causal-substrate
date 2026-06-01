# Public Hyperswarm Device-To-Device Operator Refresh

This directory is prepared for an operator-selected public Hyperswarm refresh.

Current contents are a local refresh input package only:

- `seam-history-input.json`
- `public-refresh-input-package.json`

The package operation rung is
`local_refresh_input_package_over_saved_public_hyperswarm_material`.

This is not a public swarm proof. It remains local supplied seam-history input
until the source device writes it to durable Corestore material and the replica
device consumes it through public Hyperswarm.

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

This prepared package does not claim canonical history, Layer admission, RBC
interpretation, quorum satisfaction, Mesh publication, authority, referent
promotion, Edge projection writes, production continuity, or live public swarm
proof.
