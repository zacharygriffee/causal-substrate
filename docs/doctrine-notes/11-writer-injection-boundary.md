# Writer And Injection Boundary

This note sets the current doctrine for `writer`, `injection`, and multi-writer support.

The short-term posture is conservative:

- normal continuity should not require multi-writer support
- source continuity should remain local or custody-bound by default
- injection should be treated as exceptional
- multi-writer support remains optional and policy-bearing rather than foundational

## Current recommendation

The repository should not treat `writer` as a universal substrate primitive in the same sense as:

- `Observer`
- `Branch`
- `Segment`
- `Referent`
- `Nucleus`

Instead, writerhood is best understood as a role relevant only when a surface permits authored contribution from more than one continuity holder or authority path.

That means the substrate should prefer:

- single-author or custody-bound continuity-bearing branches
- explicit shared artifacts
- explicit shared coordination surfaces only when needed

## Default posture

The current default should be:

- a continuity-bearing branch is not assumed injectible
- a continuity-bearing branch is not assumed multi-writer
- replay and replication do not by themselves imply shared authorship
- external contribution must be explicit, not ambient

This is consistent with the repository’s local-first and observer-first stance.

## Why writer is not foundational

Most of the current ontology does not require writer semantics to make sense:

- observers preserve distinctions
- branches carry continuity
- segments are opened, sealed, and inherited
- referents are tracked
- views and receipts are emitted explicitly
- continuity is replayed and replicated

None of those require that multiple parties be able to author the same continuity-bearing branch.

So the doctrine should not force writer logic into the base model just because some later deployment layers may need it.

## Where writerhood may matter

Writerhood matters only when a structure permits authored contribution from more than one source.

That pressure is more natural in:

- shared artifact surfaces
- shared coordination surfaces
- co-observation receipts
- optional convergence evidence lanes
- explicitly injectible branches or contexts

It is less natural in:

- primary observer continuity
- wake/sleep branch segments
- nucleus carry-forward
- default local referent tracking

## Injection

`Injection` should be treated as a special capability, not a normal branch behavior.

Injection means that externally authored material is allowed to enter an already-lived continuity surface.

This is dangerous because it introduces:

- authorship ambiguity
- custody ambiguity
- authority pressure
- provenance requirements
- risk of continuity distortion

So the current doctrine should be:

- a branch is not injectible by default
- if a branch is injectible, that must be explicit
- injection must carry provenance
- injection should be policy-bearing and auditable
- injection should not be silently equated with normal continuation

## Custody and admission

When external contribution is allowed, the relevant concepts are better described as:

- custody
- admission
- authority
- ratification

rather than pretending that every branch is simply a neutral writable container.

This means that even where multi-writer support eventually appears, it should likely live in:

- shared artifact layers
- coordination surfaces
- special injectible branches

and not in the default continuity substrate.

## Multi-writer support

Multi-writer support remains an allowed future capability.

But the current doctrinal lean is:

- do not require it for core continuity work
- do not design the whole substrate around it
- add it only when a concrete surface truly needs shared authorship

This keeps the ontology simpler and avoids prematurely importing authority-heavy assumptions into the substrate.

## Practical implication

Short term:

- single-writer or custody-bound continuity is enough
- replication can proceed without shared authorship
- artifact exchange can remain explicit and separate from source continuity

Later:

- multi-writer may be added for special surfaces
- optimistic or admitted writing may become relevant in shared coordination lanes
- direct branch injection should remain exceptional

## Current doctrine line

The current repository line should be:

- continuity does not need multi-writer support by default
- writerhood is optional and surface-specific
- injection is exceptional and policy-bearing
- short-term implementation should assume multi-writer is not required
