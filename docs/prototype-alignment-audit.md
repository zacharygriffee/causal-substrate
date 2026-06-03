# Prototype Alignment Audit

Date: 2026-06-03

Proof rung: `local_artifact_seam`.

This audit reads `/home/zevilz/work/prototypes/mesh-ecology-prototype` as a
conceptual and snag-prevention reference only. It does not cite prototype
artifacts as Causal Substrate proof, does not open swarm, does not open
Corestore, and does not upgrade any saved Causal artifact.

## Higher-Rung Pressure Served

This lower-rung audit protects the next `public_swarm_seam` or
`durable_replicated_public_swarm_seam` attempt by checking whether Causal
artifacts preserve enough proof-rung, transport, classification, ref/hash,
warning, non-claim, and next-pressure posture for consumers to avoid category
errors.

It prevents these overclaims:

- saved readbacks or indexes described as live swarm proof;
- local/testnet/prototype material described as public durable replicated
  Causal proof;
- public swarm timeout treated as success or doctrine failure;
- Autobase writer/indexer/readonly/optimistic posture treated as authority,
  RBC, Layer admission, or canonical truth;
- proto-RBC or future-RBC vocabulary treated as real RBC interpretation.

This is not horizontal expansion below swarm because it creates no new
readback lane, handoff bundle, proof index, fixture family, or artifact schema.
It records whether a future consumer-facing normalization pass is justified.
The live swarm-carried objective remains: prove Causal's own generic observer
seam with neutral compatible seam-history material over public swarm, then
deliberately consume Edge/Layer public material only when that material exists
and needs Causal observation.

## Prototype References Read

- `MODEL.md`
- `docs/agent-snag-index.md`
- `docs/artifact-contract.md`

Relevant prototype contract fields:

- `schema`
- `repo`
- `lane`
- `proofCommand`
- `strongestProofRung`
- `finalClassification`
- `publicSwarmTransportHappened`
- `testnetSwarmTransportHappened`
- `controlPlaneOnly`
- `warnings`
- `nextPressure`
- `generatedAt`

## Causal Artifacts Checked

Latest saved public chain:

- `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/public-replica-reader-report.json`
- `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/public-seam-proof-index.json`
- `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/public-proof-index-consumer-handoff.json`
- `proof-artifacts/public-hyperswarm-device-to-device-operator-refresh-next/public-proof-index-consumer-handoff-readback.json`

## Alignment Findings

Causal is aligned with the prototype's proof-boundary doctrine in these ways:

- The latest replica report carries live public Hyperswarm/Corestore reader
  proof under `readerProof` and observation proof/validation fields.
- Saved indexes, handoffs, and readbacks preserve the strongest public source
  proof rung while marking their own operation as local saved-artifact work.
- Saved operations explicitly state that they do not open swarm, open
  Corestore, call Edge, call Layer, write Edge projection state, admit Layer
  evidence, interpret RBC, grant authority, publish to Mesh, or write
  production continuity.
- Request ids/hashes, receipt ids/hashes, source repos, durable refs, and
  writer refs are preserved in the public proof index and consumer handoff
  chain.
- Warnings already distinguish saved-index/readback operations from proof
  upgrades.

## Snags Found

Causal artifacts are semantically aligned, but not normalized to the prototype
artifact contract at the top level.

The checked artifacts do not consistently expose these top-level fields:

- `repo`
- `lane`
- `proofCommand`
- `strongestProofRung`
- `finalClassification`
- `publicSwarmTransportHappened`
- `testnetSwarmTransportHappened`
- `controlPlaneOnly`
- `nextPressure`
- `generatedAt`

The same meanings usually exist in Causal-specific locations:

- `emittedAt` instead of `generatedAt`;
- `reviewStatus` or `validation.status` instead of `finalClassification`;
- `proof.strongestSourceProofRungObserved`,
  `proof.*OperationProofRung`, `readerProof`, or
  `observationResult.proof` instead of top-level `strongestProofRung`;
- `boundary.*` and `validation.no*Claim` instead of one normalized non-claim
  field;
- `readerProof.publicHyperswarmInputObservedByCausalSubstrate`,
  `readerProof.replicatedViaHyperswarmTransport`, and related reader proof
  fields instead of top-level transport booleans.

This is not a correctness failure for existing Causal schemas. It is a
consumer-snare risk if Edge, Layer, Spine, or operators expect prototype-style
normalized fields without knowing Causal's nested locations.

## Recommendation

Do not retrofit every saved artifact now. That would be lower-rung schema
polish without a live consumer or public-swarm pressure.

If a generic test consumer or external consumer needs prototype-compatible
Causal material, add one bounded normalization surface:

- a read-only summary/manifest over an existing public run directory;
- proof rung: `consumer_handoff_seam` or `saved_readback_seam`;
- higher rung protected: `public_swarm_seam` /
  `durable_replicated_public_swarm_seam`;
- output fields: the prototype common fields plus Causal source refs,
  proof-label preservation, warnings, non-claims, and explicit `nextPressure`;
- no new swarm claim unless the command itself opens swarm/Corestore and reads
  durable replicated material through the declared public path.

The next useful Causal move is not to wait on Edge or Layer. Build the generic
Causal seam descriptor/input/output surface, prove it with Causal-owned test
consumers/smokes, then move that neutral lane toward public-swarm-carried
evidence.
