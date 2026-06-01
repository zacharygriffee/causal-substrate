# Edge/Layer Seam History Public Run

This is an operational runbook for the public Hyperswarm seam-history lane. It
documents the artifact chain from live public swarm input to an Edge handoff
bundle, without upgrading supplied JSON, saved reports, or readbacks into swarm
proof.

## Proof Boundary

The higher rung is available only when Causal Substrate actually reads durable
Edge/Layer seam-history material through public Hyperswarm/Corestore code.

For this lane:

- set `CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1`;
- set `CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1`;
- leave `CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP` unset.

Configured bootstrap remains a future attachment point. It is rejected for this
public proof lane so a configured or testnet bootstrap cannot be mislabeled as
public swarm proof.

Saved reports, saved readbacks, local files, stdin/stdout, generated
instructions, static fixtures, and imported handoff bundles remain lower proof
rungs unless the live reader report was produced by the public Hyperswarm run
above.

## Input Shape

Use an Edge/Layer seam-history input file that carries both:

- a linked Edge request and Layer receipt pair;
- a damaged or unlinked Edge request and Layer receipt pair.

The material must preserve request ids, request hashes, receipt ids, receipt
hashes, source repos, durable refs, writer refs, and linkage status. Causal
Substrate classifies this material as bounded causal observation only. It does
not claim canonical history, admit Layer evidence, decide Layer admission,
interpret RBC, satisfy quorum, grant authority, publish to Mesh, promote
referents, or write production continuity.

## Single-Machine Public Reader Chain

This command opens public Hyperswarm and Corestore only when both public run
environment variables are set. It writes a reader report and a checked report
readback.

```bash
mkdir -p artifacts .tmp/causal-seam-reader-a .tmp/causal-seam-reader-b

CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
npx tsx scripts/run-edge-layer-seam-history-hyperswarm-reader.ts \
  --input seam-history.json \
  --report-output artifacts/hyperswarm-reader-report.json \
  --readback-output artifacts/hyperswarm-reader-report-readback.json \
  --storage-dir-a .tmp/causal-seam-reader-a \
  --storage-dir-b .tmp/causal-seam-reader-b \
  --namespace public,seam-history
```

Expected live-run artifacts:

- `artifacts/hyperswarm-reader-report.json`
- `artifacts/hyperswarm-reader-report-readback.json`

The report is the source of the public-swarm proof label. The readback checks
preservation of durable source refs, seam-history hashes, reader proof fields,
and observation proof labels.

Derive an Edge handoff bundle from the saved report only after the report
readback validates:

```bash
npx tsx scripts/derive-edge-layer-seam-history-handoff-bundle-from-hyperswarm-report.ts \
  --input-report artifacts/hyperswarm-reader-report.json \
  --report-readback-output artifacts/hyperswarm-reader-report-import-readback.json \
  --handoff-bundle-output artifacts/edge-projection-handoff-bundle.json
```

Read back the handoff bundle before handing it to Edge:

```bash
npx tsx scripts/readback-edge-layer-seam-history-handoff-bundle.ts \
  --input-bundle artifacts/edge-projection-handoff-bundle.json \
  --readback-output artifacts/edge-projection-handoff-bundle-readback.json
```

Summarize the proof labels across the chain without upgrading them:

```bash
npx tsx scripts/summarize-edge-layer-seam-history-proof.ts \
  --input artifacts/hyperswarm-reader-report.json \
  --input artifacts/hyperswarm-reader-report-readback.json \
  --input artifacts/hyperswarm-reader-report-import-readback.json \
  --input artifacts/edge-projection-handoff-bundle.json \
  --input artifacts/edge-projection-handoff-bundle-readback.json \
  --output artifacts/edge-layer-seam-history-proof-summary.json
```

The summary command reads saved artifacts only. It reports the strongest source
proof label it sees, but the summary operation itself is still a local summary
over supplied artifacts.

## Device-To-Device Public Chain

Use this path when one standby device should publish durable source material and
another standby device should consume it through public Hyperswarm.

On the source device:

```bash
mkdir -p artifacts .tmp/causal-seam-source-device

CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
npx tsx scripts/run-edge-layer-seam-history-public-source-device.ts \
  --input seam-history.json \
  --manifest-output artifacts/public-source-manifest.json \
  --storage-dir .tmp/causal-seam-source-device \
  --namespace public,device,seam-history \
  --keep-alive-ms 600000
```

Move `artifacts/public-source-manifest.json` to the replica device. The manifest
alone is not observation proof.

On the replica device:

```bash
mkdir -p artifacts .tmp/causal-seam-replica-device

CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1 \
CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC=1 \
npx tsx scripts/run-edge-layer-seam-history-public-replica-device.ts \
  --manifest artifacts/public-source-manifest.json \
  --report-output artifacts/public-replica-reader-report.json \
  --storage-dir .tmp/causal-seam-replica-device \
  --namespace public,device,seam-history
```

Then run the same saved-report derivation, handoff readback, and proof-summary
commands against `artifacts/public-replica-reader-report.json`.

## Edge Handoff

Edge may consume the handoff bundle as observation-only projection input. The
handoff preserves source request ids/hashes, receipt ids/hashes, source repos,
durable refs, writer refs, linkage status, classifications, proof labels, and
non-claim boundaries.

Causal Substrate still does not write Edge projection state. Edge decides any
later projection behavior.

