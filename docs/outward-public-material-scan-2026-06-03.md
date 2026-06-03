# Outward Public Material Scan

Date: 2026-06-03

Proof rung: `local_artifact_seam`.

This scan inspected adjacent Edge and Layer worktrees for fresh public
endpoint, proof bundle, readback, or consumer handoff material that Causal
Substrate could observe next. It does not open swarm, does not run Edge or
Layer, does not call adjacent repos, and does not upgrade any local file or
dirty worktree state into public seam proof.

## Higher-Rung Pressure Served

This lower-rung scan protects the next `public_swarm_seam` or
`durable_replicated_public_swarm_seam` Causal objective by checking whether
there is committed adjacent material ready for a narrow Causal observation.

It prevents these overclaims:

- treating uncommitted Edge or Layer changes as durable public seam material;
- treating schema files, scripts, local fixtures, package changes, or dirty
  worktree state as swarm-carried endpoint proof;
- adding another Causal-only saved-artifact expansion when no consumer or
  adjacent public proof material exists;
- treating Layer public HyperDHT posture as Causal-observed proof before
  Causal reads a committed endpoint/proof/readback artifact or a live public
  seam source.

This is not horizontal expansion below swarm because it creates no new adapter,
fixture family, proof index, consumer handoff, or readback lane. It records a
go/no-go decision for the next outward move.

## Scan Summary

Adjacent worktrees checked:

- `/home/zevilz/work/mesh-ecology/mesh-ecology-edge`
- `/home/zevilz/work/mesh-ecology/mesh-ecology-layer`

Result:

- Edge has existing Causal handoff receipts already consumed in prior Causal
  runs. No new committed Edge public endpoint/history artifact was identified
  during this scan.
- Layer has active local changes around public HyperDHT/public endpoint
  proof, including contract and runtime paths, but those changes are dirty
  worktree material from Layer's repo. Causal must not consume or cite them as
  committed Layer public proof.
- No fresh committed Layer public endpoint projection, history index, proof
  bundle, readback manifest, or Causal handoff packet artifact was identified
  as ready for Causal observation.

## Causal Posture

Causal should not add another generic public matrix run just to create more
artifacts. The compatible, unresolved, `hash_mismatch`, and `duplicate_id`
generic public-swarm paths are already preserved.

The next useful outward move should be one of:

- consume committed Layer public endpoint/proof/readback material when Layer
  provides it as durable public-swarm proof material;
- consume committed fresh Edge public endpoint/history material when Edge
  provides it;
- hand the existing generic proof-index consumer handoff to a real consumer if
  requested;
- run a new Causal-owned public-swarm objective only when a named consumer need
  or public-swarm pressure identifies a remaining classifier branch.

Until then, the correct posture is to wait rather than expand lower-rung local
scaffolding.
