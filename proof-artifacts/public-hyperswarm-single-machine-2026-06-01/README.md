# Public Hyperswarm Single-Machine Seam-History Run

This directory preserves the single-machine public Hyperswarm artifact chain
run on 2026-06-01.

## Scope

This is public Hyperswarm/Corestore seam-history proof for a single host running
both source and replica stores. It is not device-to-device proof.

The run used:

- `CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1`
- `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset

## Commands

```bash
env -u CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP \
  CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
  CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
  npx tsx scripts/run-edge-layer-seam-history-hyperswarm-reader.ts \
  --input proof-artifacts/public-hyperswarm-single-machine-2026-06-01/seam-history-input.json \
  --report-output proof-artifacts/public-hyperswarm-single-machine-2026-06-01/hyperswarm-reader-report.json \
  --readback-output proof-artifacts/public-hyperswarm-single-machine-2026-06-01/hyperswarm-reader-report-readback.json \
  --storage-dir-a .tmp/public-hyperswarm-single-machine-2026-06-01-reader-a \
  --storage-dir-b .tmp/public-hyperswarm-single-machine-2026-06-01-reader-b \
  --namespace public,seam-history,single-machine,2026-06-01
```

```bash
npx tsx scripts/derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report.ts \
  --input-report proof-artifacts/public-hyperswarm-single-machine-2026-06-01/hyperswarm-reader-report.json \
  --report-readback-output proof-artifacts/public-hyperswarm-single-machine-2026-06-01/hyperswarm-reader-report-import-readback.json \
  --handoff-bundle-output proof-artifacts/public-hyperswarm-single-machine-2026-06-01/edge-projection-handoff-bundle.json
```

```bash
npx tsx scripts/readback-edge-layer-seam-history-handoff-bundle.ts \
  --input-bundle proof-artifacts/public-hyperswarm-single-machine-2026-06-01/edge-projection-handoff-bundle.json \
  --readback-output proof-artifacts/public-hyperswarm-single-machine-2026-06-01/edge-projection-handoff-bundle-readback.json
```

```bash
npx tsx scripts/summarize-edge-layer-seam-history-proof.ts \
  --input proof-artifacts/public-hyperswarm-single-machine-2026-06-01/hyperswarm-reader-report.json \
  --input proof-artifacts/public-hyperswarm-single-machine-2026-06-01/hyperswarm-reader-report-readback.json \
  --input proof-artifacts/public-hyperswarm-single-machine-2026-06-01/hyperswarm-reader-report-import-readback.json \
  --input proof-artifacts/public-hyperswarm-single-machine-2026-06-01/edge-projection-handoff-bundle.json \
  --input proof-artifacts/public-hyperswarm-single-machine-2026-06-01/edge-projection-handoff-bundle-readback.json \
  --output proof-artifacts/public-hyperswarm-single-machine-2026-06-01/edge-layer-seam-history-proof-summary.json
```

## Result

The live reader report preserves:

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

## Boundary

These artifacts do not claim canonical history, Layer admission, RBC
interpretation, quorum satisfaction, Mesh publication, authority, referent
promotion, Edge projection writes, or production continuity.

