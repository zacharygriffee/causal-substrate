# Public Hyperswarm Device-To-Device Seam-History Run

This directory preserves the public Hyperswarm seam-history run across two
standby devices on 2026-06-01.

## Devices

- Source device: `platform-lab`
- Replica device: `mesh-lab`

The source device wrote durable seam-history material and emitted a source
manifest. The replica device consumed that manifest through public Hyperswarm,
read the replicated durable material, and emitted a bounded Causal Substrate
observation report.

## Scope

This is public Hyperswarm/Corestore device-to-device seam-history proof. The
source manifest alone is not observation proof; the proof rung is carried by the
replica report and downstream readback/handoff artifacts.

The run used:

- `CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset

## Source Command

Run on `platform-lab`:

```bash
env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP \
  CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
  CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
  npx tsx scripts/run-edge-layer-seam-history-public-source-device.ts \
  --input proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/seam-history-input.json \
  --manifest-output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-source-manifest.json \
  --storage-dir .tmp/public-hyperswarm-device-source-2026-06-01 \
  --namespace public,device,seam-history,2026-06-01 \
  --keep-alive-ms 600000
```

## Replica Command

Run on `mesh-lab` after transferring `public-source-manifest.json`:

```bash
env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP \
  CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
  CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
  npx tsx scripts/run-edge-layer-seam-history-public-replica-device.ts \
  --manifest proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-source-manifest.json \
  --report-output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-replica-reader-report.json \
  --storage-dir .tmp/public-hyperswarm-device-replica-2026-06-01 \
  --namespace public,device,seam-history,2026-06-01
```

## Downstream Commands

```bash
npx tsx scripts/derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report.ts \
  --input-report proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-replica-reader-report.json \
  --report-readback-output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-replica-reader-report-readback.json \
  --handoff-bundle-output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/edge-projection-handoff-bundle.json
```

```bash
npx tsx scripts/readback-edge-layer-seam-history-handoff-bundle.ts \
  --input-bundle proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/edge-projection-handoff-bundle.json \
  --readback-output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/edge-projection-handoff-bundle-readback.json
```

```bash
npx tsx scripts/summarize-edge-layer-seam-history-proof.ts \
  --input proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-source-manifest.json \
  --input proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-replica-reader-report.json \
  --input proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-replica-reader-report-readback.json \
  --input proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/edge-projection-handoff-bundle.json \
  --input proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/edge-projection-handoff-bundle-readback.json \
  --output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/edge-layer-seam-history-proof-summary.json
```

```bash
npx tsx scripts/check-edge-layer-seam-history-public-artifacts.ts \
  --run-dir proof-artifacts/public-hyperswarm-device-to-device-2026-06-01 \
  --output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-artifact-reproducibility-check.json
```

```bash
npx tsx scripts/derive-edge-layer-seam-history-observation-to-edge-projection-contract.ts \
  --run-dir proof-artifacts/public-hyperswarm-device-to-device-2026-06-01 \
  --edge-receipt ../mesh-ecology-edge/proof-artifacts/causal-substrate-public-device-handoff-2026-06-01/edge-causal-seam-handoff-projection-input-receipt.json \
  --output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/observation-to-edge-projection-contract.json
```

```bash
npx tsx scripts/readback-edge-layer-seam-history-proof-summary-for-consumers.ts \
  --proof-summary proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/edge-layer-seam-history-proof-summary.json \
  --observation-to-edge-contract proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/observation-to-edge-projection-contract.json \
  --output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/proof-summary-consumer-readback.json
```

```bash
npx tsx scripts/decide-edge-layer-seam-history-public-swarm-refresh.ts \
  --run-dir proof-artifacts/public-hyperswarm-device-to-device-2026-06-01 \
  --output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-swarm-refresh-decision.json
```

```bash
npx tsx scripts/index-edge-layer-seam-history-public-proof.ts \
  --run-dir proof-artifacts/public-hyperswarm-device-to-device-2026-06-01 \
  --output proof-artifacts/public-hyperswarm-device-to-device-2026-06-01/public-seam-proof-index.json
```

## Result

The replica report preserves:

- `readerProof.sourceManifestConsumed: true`
- `readerProof.inputReadByCausalSubstrate: true`
- `readerProof.durableCorestoreHistoryRead: true`
- `readerProof.dhtOrHyperswarmInputObservedByCausalSubstrate: true`
- `readerProof.replicatedViaHyperswarmTransport: true`
- `readerProof.publicHyperswarmInputObservedByCausalSubstrate: true`
- `observationResult.validation.linkedPairDetected: true`
- `observationResult.validation.damagedOrUnlinkedPairDetected: true`
- `observationResult.proof.strongestProofRung: public_hyperswarm_replicated_durable_seam_history_observation`

The proof summary preserves that strongest source rung but labels the summary
operation itself as
`local_causal_summary_over_supplied_edge_layer_seam_history_artifacts`.

The reproducibility check proves the saved artifact chain remains mutually
consistent and labels its own operation as
`local_reproducibility_check_over_saved_public_hyperswarm_artifacts`. It does
not open Hyperswarm or Corestore and does not claim a new live public run.

The observation-to-Edge projection contract proves the saved Causal handoff
bundle matches Edge's saved observation-only import receipt, preserving request
ids/hashes, receipt ids/hashes, source repos, durable refs, writer refs, and the
public source proof label. The contract operation itself is
`local_contract_check_over_saved_causal_handoff_and_edge_receipt`; it does not
call Edge, write Edge projection state, or claim a new live swarm run.

The proof-summary consumer readback gives Spine and Edge a clearer saved
artifact view: Spine may treat the preserved public source proof rung as a
family-pressure signal, and Edge may treat the contract-backed refs as
observation-only projection context. The readback operation itself is
`local_consumer_readback_over_saved_edge_layer_seam_history_proof_summary` and
does not upgrade saved imports into new public swarm proof.

The public swarm refresh decision reads the saved reproducibility check,
observation-to-Edge contract, and consumer readback, then recommends
`not_required_artifacts_stable`. Its operation rung is
`local_refresh_decision_over_saved_public_hyperswarm_artifacts`; it does not run
public swarm or prepare a refresh command unless an operator explicitly selects
that later.

The public seam proof index points Edge, Layer, and Spine at the saved public
run, reproducibility check, Edge contract, consumer readback, and refresh
decision without duplicating artifact bodies. Its operation rung is
`local_index_over_saved_public_hyperswarm_seam_proof_artifacts`; it does not
open swarm, open Corestore, or upgrade saved artifacts into a new live proof.

## Boundary

These artifacts do not claim canonical history, Layer admission, RBC
interpretation, quorum satisfaction, Mesh publication, authority, referent
promotion, Edge projection writes, or production continuity.
