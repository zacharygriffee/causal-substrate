# Current Causal Posture Consumer Handoff - 2026-06-03

Proof rung of this handoff operation: `consumer_handoff_seam`.

This directory preserves a compact consumer/Spine-ready posture report over the
current Causal state:

- saved Layer adjacent observation;
- saved Edge adjacent observation;
- Causal public Hyperswarm read over Edge/Layer-derived seam-history material.

Artifact:

- `current-causal-posture-consumer-handoff.json`

Boundary:

- The handoff does not open swarm or Corestore.
- The handoff does not call Edge or Layer.
- The handoff does not write consumer state.
- The handoff does not upgrade proof.

Strongest preserved source proof rung:

- `durable_replicated_public_swarm_seam`

Important caveat:

The public read proof is over Edge/Layer-derived material that Causal published
and read through its declared public Hyperswarm path. It is not a claim that
Edge or Layer directly published live public-swarm seam history to Causal.

Non-claims:

- no canonical history claim;
- no Layer evidence admission;
- no RBC interpretation or quorum;
- no authority grant;
- no Mesh publication;
- no production continuity write.
