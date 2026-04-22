# Comparison Surfaces

This note locks the minimal doctrine for comparison pressure in `causal-substrate`.

The goal is not to turn the repository into a full comparison engine.

The goal is to make comparison pressure explicit, bounded, inspectable, and replayable.

## The four terms

### Comparability

`Comparability` means a useful shared projection or transform exists at all.

If comparability is absent, the repository should not pretend a meaningful comparison was performed.

### Compatibility

`Compatibility` means two branches, claims, or artifacts can coexist without contradiction under the stated basis or projection.

Compatibility is not identity, and it is not agreement.

### Equivalence

`Equivalence` is an optional stronger claim that two things are same enough under a specific basis or projection.

Equivalence is always basis-relative or projection-relative.

Equivalence must not be used to collapse identity automatically.

### Convergence

`Convergence` is an optional higher-order claim that several branches, claims, or artifacts cluster toward a common reading.

Convergence is evidence pressure, not authority.

Convergence must not be treated as truth or mandatory agreement.

## Repository rule

The repository should treat comparison as:

- explicit
- basis-aware
- projection-aware
- inspectable
- replayable

The repository should not treat comparison as:

- hidden carryover
- a truth primitive
- mandatory agreement
- forced identity resolution

## Minimum artifact posture

A comparison claim is not ready unless a consumer can answer:

- what was compared
- under which basis or projection
- what the result was
- why the result was emitted
- which evidence ids support it

Reasoning should prefer:

- reason codes
- evidence ids
- explicit basis or projection references

Reasoning should avoid:

- heuristic dumps
- opaque internal summaries that cannot be tied back to evidence

## Current implementation line

For the current comparison phase stack:

- `comparability` and `compatibility` should get the first strong operational support
- `equivalence` and `convergence` remain optional and provisional
- comparison artifacts must never overwrite continuity history

## Boundary with adjacent repos

`causal-substrate` should own:

- comparison vocabulary
- comparison artifacts
- replay and inspectability for comparison claims

Adjacent repos or layers should own:

- domain-specific comparison strategy
- thresholds for action
- scoring policy
- consumer-specific consequences of a comparison result
