# Adjacent Edge Compatible Handoff Observation - 2026-06-03

Proof rung of this Causal operation: `saved_readback_seam`.

This directory preserves Causal's read-only observation over actual Edge
compatible handoff readback material from:

```text
mesh-ecology-edge/proof-artifacts/edge-compatible-handoff-export-bundle-2026-06-03/edge-compatible-handoff-readback-input.json
```

Edge source commit observed:

```text
48b0529 Retain Edge compatible handoff export bundle
```

Saved artifacts:

- `edge-compatible-handoff-readback-input.json`: copied snapshot of the Edge
  handoff readback input Causal consumed.
- `causal-adjacent-edge-observation.json`: Causal observation emitted by
  `npm run observe:adjacent-public-material`.

Classification result:

- Edge adjacent material: `compatible`.
- Causal operation proof rung: `saved_readback_seam`.
- Edge proof boundary preserved: `handoff_export_file_readback_only`.
- Edge proof rung upgrade flag preserved: `proofRungNotUpgraded: true`.

Preserved material includes request id/hash, receipt id/hash, durable refs,
writer refs, source repo refs, proof rung labels, linkage status
`linkedPairCount:1`, and non-claims.

Non-claims:

- Causal did not claim live Causal swarm proof from this saved Edge output.
- Causal did not admit Layer evidence.
- Causal did not interpret RBC or quorum.
- Causal did not grant authority, publish Mesh, or write production
  continuity.
