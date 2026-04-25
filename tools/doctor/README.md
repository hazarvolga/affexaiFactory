# @affex/doctor

Layer: **ACTIVE_NOW**

Repo health checker. Enforces layer boundaries and checks STACK.md ↔ package.json sync. Run before every commit and in CI.

## Use

```bash
pnpm doctor                  # all checks
pnpm doctor layer-check      # boundary check only
pnpm doctor stack-sync       # STACK.md sync check only
```

Exit codes:
- `0` — all checks passed
- `1` — one or more checks failed
- `2` — doctor itself crashed (bug)

## What it checks

### `layer-check`

For every workspace package (`apps/*`, `packages/*`, `tools/*`, `templates/*`):

- Each must declare `affex.layer` in `package.json` (warning if missing).
- An `ACTIVE_NOW` package may not declare a runtime `dependencies` entry on a package whose layer is `OPTIONAL_LATER`, `SCALE_STAGE`, or `EXPERIMENTAL`. Use `peerDependencies` + a runtime gate instead.
- Nothing may depend on anything inside `experimental/`.
- `packages/*` may not depend on `apps/*` (direction violation).

### `stack-sync`

- Every `packages/*` package's name should appear somewhere in `standards/STACK.md`. Mismatches are warnings (not errors yet).

## Why no auto-fix

Doctor reports problems, it doesn't decide how to fix them. Layer violations usually need an ADR, not a one-liner change.
