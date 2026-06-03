# Adjacent Public Material Observation - 2026-06-03

Proof rung of this Causal operation: `saved_readback_seam`.

This directory preserves Causal's read-only observation over actual Layer
public/default HyperDHT proof output. The Layer source command was run directly
from `mesh-ecology-layer`:

```sh
node scripts/run-layer-edge-seam-public-hyperdht-proof.mjs
```

Saved artifacts:

- `layer-public-proof-result.json`: actual Layer public HyperDHT proof result
  emitted by the Layer script.
- `causal-adjacent-layer-observation.json`: Causal observation emitted by
  `npm run observe:adjacent-public-material`.

Classification result:

- Layer adjacent material: `compatible`.
- Causal operation proof rung: `saved_readback_seam`.
- Strongest source proof label preserved:
  `default_public_hyperdht_hyperswarm_feed_backed`.

Preserved material includes request ids/hashes, receipt ids/hashes, evidence
ids/hashes, durable refs, writer refs, source repo refs, proof rung labels,
linkage status, and non-claims.

Non-claims:

- Causal did not claim live Causal swarm proof from this saved Layer output.
- Causal did not admit Layer evidence.
- Causal did not interpret RBC or quorum.
- Causal did not grant authority, publish Mesh, or write production
  continuity.

Edge compatible handoff readback was not preserved here because the current
Edge CLI failed before producing readback material: `edgeLayerReportOnlySeamSmoke.js`
declares `uniqueStrings` twice at current Edge head. Causal preserved no
partial Edge handoff artifact from that failed run.
