# Phase 117 Edge Causal Fixture Consumption

Phase 117 lets `causal-substrate` consume the Edge Phase 116A causal continuity adjacent review packet fixture as a static review input only.

The static fixture path in this repository is:

- `test/fixtures/edge/phase-116a-causal-continuity-adjacent-review-packet-fixture.json`

The fixture is copied into this repository for tests and review evidence. It is not fetched from Edge at runtime, and `causal-substrate` does not call or mutate Edge.

## Causal-owned evidence artifact

The causal-owned review evidence artifact is:

- schema: `causal-substrate/adjacent-review-evidence/v1`
- schema version: `1`
- artifact kind: `causal-adjacent-review-evidence`

This schema is owned by `causal-substrate`. The Edge packet is review input, not an accepted causal schema.

The artifact includes:

- `artifactId`
- `emittedAt`
- `sourceFixture`
- `edgePacketRefs`
- `boundary`
- `validation`
- `reviewStatus`
- `preservedCorrelationRefs`
- `edgeImportClassification`
- `causalFindings`
- `warnings`
- `rejections`

## Edge import classification

The artifact also carries compatibility metadata for a later Edge import:

- `edgeImportClassification.seamId: "causal_continuity"`
- `edgeImportClassification.evidenceKind: "causal_continuity_edge_packet_review_evidence"`
- `edgeImportClassification.edgeExpectedArtifactKind: "causal_continuity_edge_packet_review_evidence"`

This metadata is classification only. It does not make Edge the schema owner and does not grant adjacent acceptance.

## Validation posture

Phase 117 validates only the static review envelope:

- the input is a parseable JSON object
- the static fixture identifies Edge Phase 116A review context
- static packet identity refs are present
- causal-specific review checklist is present
- expected causal-owned response shape is present
- causal wording guardrails are present
- stop/go result is exactly `go_for_causal_substrate_repo_review`
- correlation refs are preserved only as strings or arrays of strings
- unknown packet fields remain inert packet data
- command, TODO, or replay-like fields are blocked or marked out of scope as non-executable review text

The packet is never interpreted as TODOs, replay instructions, branch facts, canonical branch facts, lineage settlement, reality settlement, causal truth, production proof, or mesh truth.

## Review statuses

Implemented statuses:

- `review-evidence-emitted`
- `review-only-valid-fixture`
- `review-only-incomplete-fixture`
- `review-only-malformed-fixture`
- `review-only-guardrail-blocked`

Malformed JSON or non-object input yields `review-only-malformed-fixture`.

Missing checklist, expected response shape, wording guardrails, or stop/go data yields `review-only-incomplete-fixture`.

Wrong stop/go data, active command/TODO/replay fields, or active authority flags yield `review-only-guardrail-blocked`.

## Boundary

The artifact boundary explicitly states:

- static input only
- review only
- evidence only
- no Edge runtime fetch
- no Edge call
- no Edge mutation
- no accepted Edge schema
- no causal truth
- no canonical branch acceptance
- no lineage settlement
- no reality settlement
- no event replay
- no causal conflict resolution
- no production proof
- no mesh truth
- no adjacent acceptance from packet presence
- no mesh publication

## Not implemented

Phase 117 does not implement:

- runner
- scheduler
- live discovery
- Edge fetcher
- Edge API or client call
- Edge mutation
- mesh publication
- replay engine
- causal conflict resolver
- canonical branch selection
- lineage settlement
- reality settlement
- production proof claim
- accepted Edge schema contract
