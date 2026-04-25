# ADR 0003: Layer system (ACTIVE_NOW / OPTIONAL_LATER / SCALE_STAGE / EXPERIMENTAL)

- Status: Accepted
- Date: 2026-04-25

## Context

A meta repo for a solo founder has a specific failure mode: **premature scaffolding**. Setting up auth, billing, queues, observability, feature flags, etc. before any product needs them creates maintenance debt and slows the inner loop. Conversely, a pure greenfield approach forces re-deciding the same architecture every time a new product starts.

We need a way to enumerate the full target state (so the matrix is visible) while shipping only the minimum that's actually used today.

## Decision

Tag every artifact (folder, package, tool, template, workflow) with one of:

| Status | Bootstrapped? | Activation |
|---|---|---|
| `ACTIVE_NOW` | yes | always |
| `OPTIONAL_LATER` | no — documented only | a real product / workflow needs it |
| `SCALE_STAGE` | no | team / agent fleet / multi-prod era |
| `EXPERIMENTAL` | only `experimental/` | promote via ADR |

The status lives in two places:

1. The artifact's own `package.json` under `affex.layer`.
2. `standards/STACK.md` as the human-readable matrix.

`pnpm doctor layer-check` enforces:

- ACTIVE_NOW packages may not have OPTIONAL_LATER+ runtime dependencies.
- Nothing may depend on `experimental/*`.
- `packages/*` may not depend on `apps/*`.

A Layer 1 install must work standalone — the assertion is `pnpm install && pnpm build && pnpm dev` succeeds with all OPTIONAL_LATER / SCALE_STAGE / EXPERIMENTAL items absent.

## Promotion path

Layer 2 → Layer 1:
1. ADR (this template).
2. Update `standards/STACK.md`.
3. Create the package; reference template if available.
4. `pnpm doctor` passes.
5. Add a feature flag to the generator if user-facing.
6. Wire into the relevant `_starter-*` reference.

SCALE_STAGE → Layer 1: same plus a migration script and a back-compat plan.

## Why two sources of truth (package.json + STACK.md)

The package.json is what doctor reads (machine-checkable). STACK.md is what humans read. Keeping them in sync is part of the promotion checklist; doctor verifies they don't drift.

## Alternatives considered

- **Single tier, install everything**: rejected — premature complexity, slow installs.
- **Status as Git branches**: rejected — unworkable for cross-cutting changes.
- **Status as feature flags only at runtime**: rejected — doesn't catch bad deps at build time.

## Consequences

- Every new package must declare a layer.
- The generator UI changes: it shows OPTIONAL_LATER features behind a "promotes this to Layer 1" warning.
- `STACK.md` becomes a living doc, not a one-time write.
- Doctor is a hard gate, not a suggestion.
