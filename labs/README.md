# Labs

This directory is the working home for local doctrine-pressure labs.

The purpose of a lab is not only to build a small scenario. It is to pressure a specific part of the doctrine under concrete use and produce reusable feedback for the repository.

## Phase 1 scaffold

Phase 1 is successful when the repository has:

- a repeatable lab structure
- a standard template for new labs
- a registry covering the planned lab set
- one starter spec per planned lab
- automated validation proving the scaffold is coherent

This directory now provides that scaffold.

## Structure

- [`registry.json`](./registry.json): machine-readable registry of planned labs
- [`_template.md`](./_template.md): standard starter template for new labs
- `01-*/README.md` through `10-*/README.md`: initial lab spec files

## Program rules

- use current working defaults unless a lab explicitly models an exception
- keep doctrine pressure explicit
- treat unresolved outcomes as useful when they expose real ontology pressure
- record doctrine changes explicitly rather than silently absorbing them into implementation

## Completion states

Each lab should move through:

- `planned`
- `active`
- `completed`
- `blocked`
- `deferred`

## Validation

Run:

```bash
npm run labs:validate
```

The validator checks that:

- every lab in the registry has a corresponding file
- every lab file has the required sections
- IDs, priorities, phases, statuses, and boundaries are valid

## Current phase layout

- Phase 1: scaffold
- Phase 2: core labs
- Phase 3: follow-on labs
- Phase 4: advanced pressure labs
