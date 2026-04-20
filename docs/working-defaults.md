# Working Defaults

These are current working defaults for `causal-substrate`.

They are implementation defaults for current labs, not immutable doctrine.

## 1. Primary situated context

Assume a branch or active segment has exactly one primary situated context at a time.

Rationale:

- keeps containment, admission, and continuity interpretation tractable
- avoids multi-parent ambiguity in the core model
- most apparent multi-context cases reduce to one of:
  - primary context plus portal or exposure into another context
  - composite context
  - ambiguous or unresolved placement

Allowed posture:

- secondary or external contexts may be visible or relevant through portals or views
- context ambiguity may be represented explicitly
- multi-primary-context support is not a core default

## 2. Portals are directional by default

Treat portals as directional exposure mechanisms.

A portal is not assumed to be symmetric traversal or full identity transfer. A portal exposes a constrained projection from a source context into a target or local context.

Implications:

- bidirectional visibility should usually be modeled as two directional portals
- or as one shared structure yielding two directional exposures
- observers experience portals relative to their situated context
- portals expose constrained projections, never full context substitution

Terminology note:

- `portal` is the current working term
- related terms such as membrane, aperture, exposure, window, or interface may be explored later
- do not rename yet unless implementation pressure justifies it

## 3. Referent persistence states

Use the following minimal persistence state set:

- `continuing`
  - continuity remains plausible under current basis, inertia, volatility, and evidence
- `ambiguous`
  - continuity cannot currently be resolved as continuing or broken
- `broken`
  - continuity is no longer plausible under current basis, inertia, volatility, and evidence

Notes:

- do not force binary identity decisions when ambiguity is the honest state
- `ambiguous` is a first-class operational state, not a temporary error condition
- more refined states may be added later, but these three are the current minimum

## 4. Local continuity and shared artifacts

Source continuity remains local by default.

Shared material must be emitted explicitly as artifacts. Nothing becomes shared merely by existing.

Examples of shareable artifacts:

- anchors
- bindings
- views
- lineage claims
- convergence or co-bind receipts
- other explicit projections with provenance

Rules:

- shared artifacts must carry basis and provenance when relevant
- shared artifacts do not imply global truth
- raw continuity or history should not be assumed shareable by default
- local-first remains the governing posture

## 5. Current design stance

For labs, prefer:

- one primary context
- directional portals
- `continuing` / `ambiguous` / `broken` referent persistence
- local source continuity with explicit shared artifacts

Treat deviations as explicit modeled exceptions, not silent expansion of the core.
