# ARCHITECTURE.md — Monorepo & layer system

## Goals

1. Ship a new product MVP in a day, not a week.
2. Reuse what's already solved; don't reimplement.
3. Allow AI agents to operate the repo predictably.
4. Stay shippable as a one-person company while leaving room to scale.

## Top-level layout

```
apps/         runnable apps (incl. _starter-* references the generator copies from)
packages/     reusable libs published as @affex/*
templates/    token'd inputs the generator merges
tools/        repo CLIs (create-app, doctor, migrate-repo)
ai/           agent configs, prompts, workflows
standards/    docs that govern behavior (this file lives here)
infra/        docker compose, dockerfiles, coolify exports
docs/         engineering OS docs (rendered later by Nextra)
experimental/ no-depend sandbox (gitignored)
scripts/      repo-level scripts
```

## Layer system

Every artifact has exactly one layer status:

| Status | Bootstrapped? | Activation trigger |
|---|---|---|
| `ACTIVE_NOW` | yes | always available |
| `OPTIONAL_LATER` | no | a real product or workflow needs it |
| `SCALE_STAGE` | no | team / agent fleet / multi-prod era |
| `EXPERIMENTAL` | only `experimental/` | promote via ADR if proven |

Status lives in two places:

1. The artifact's own `package.json` under `affex.layer`.
2. `standards/STACK.md` as the human-readable matrix.

`pnpm doctor layer-check` cross-checks both and enforces:

- ACTIVE_NOW packages may not declare an OPTIONAL_LATER+ runtime dep (peer / dev OK).
- Nothing may depend on `experimental/*`.
- `packages/*` may not depend on `apps/*`.

## Dependency direction

```
apps/* ───┐
          ├──► packages/* ───► packages/* (declared deps only)
tools/* ──┘
templates/* (no runtime deps; their package.json templates the consumer's)
```

## Why these tools

- **pnpm**: fast, disk-efficient, predictable hoisting. Workspace + lockfile in one.
- **Turborepo**: incremental builds, topo order, content hashing, cache reuse for free.
- **Biome**: one binary replaces ESLint + Prettier; ~10x faster; native CI.
- **Changesets**: explicit version intent in PR; no commit-message parsing.
- **Vitest**: fast TS-native, jest-compatible.
- **Prisma**: typed schema-first ORM; migration generator we trust.

See `standards/STACK.md` for the full matrix and `standards/adr/` for the decisions.

## How a new product is born

```
pnpm create @affex/app
  → name, template (nest-saas | next-app), feature flags, deploy target
  → copies apps/_starter-<x>/ + merges templates/<choice>/ tokens
  → installs deps, runs build smoke test
  → commits scaffold
```

The generator only offers Layer 1 features by default. Selecting a Layer 2 feature triggers a promotion prompt that creates an ADR draft.

## How a Layer 2 capability is activated

1. Open `docs/layer-promotion.md` → find the item's trigger and checklist.
2. Write `standards/adr/NNNN-promote-<item>.md` (why, what changes, rollback path).
3. Update `standards/STACK.md` (status flips to ACTIVE_NOW).
4. Create the package / folder; reference the matching template.
5. `pnpm doctor` must pass.
6. Add a generator feature flag if appropriate.
7. Wire it into the relevant `_starter-*` reference.
8. Add a CI job if needed.

## Migration from existing projects

`tools/migrate-repo` (Layer 2) audits an old repo against current Layer 1 packages, generates a migration report, and supports a strangler-fig adoption (one package at a time). Big-bang migrations are forbidden by policy.

## Scale plan (1-year horizon)

When we cross any of (3+ team, 3+ production apps, 5+ parallel agents):

- Activate Turborepo Remote Cache.
- Add CODEOWNERS + branch protection rules.
- Auto-publish on merge with `@next` channel for canaries.
- `git worktree`-based agent isolation for OpenHands fleet.
- Coolify cluster or k3s migration.

The Layer 1 contract does not change in any of these.
