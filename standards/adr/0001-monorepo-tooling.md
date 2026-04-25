# ADR 0001: Monorepo tooling — pnpm + Turborepo + Biome + Changesets

- Status: Accepted
- Date: 2026-04-25
- Deciders: founder (solo)

## Context

We need a monorepo toolchain that:

- Installs fast and predictably (one founder, many spare-time iterations).
- Caches builds across packages and across CI runs.
- Replaces the historically slow ESLint + Prettier combo.
- Versions packages explicitly (no commit-message parsing).
- Stays free at solo scale and remains usable at small-team scale.

## Decision

| Concern | Choice |
|---|---|
| Workspace + install | **pnpm 9** |
| Build orchestrator | **Turborepo 2** (local cache; remote cache deferred to SCALE_STAGE) |
| Lint + format | **Biome 1.9** |
| Versioning + changelog | **Changesets** |

## Alternatives considered

- **Yarn Berry / npm workspaces**: slower, less predictable hoisting; pnpm wins on disk + speed.
- **Nx**: heavier, more opinionated; more value once we have many app types but overkill at one.
- **ESLint + Prettier**: ~10x slower; multiple configs to maintain; Biome covers our rules.
- **Lerna**: stagnant; Changesets is the modern equivalent for what we need.
- **Conventional commits → semantic-release**: implicit, easy to break; explicit changeset entries are less magical.

## Consequences

- pnpm-only — no `npm install` / `yarn add`. Doctor enforces.
- Single Biome config at root via `@affex/shared-config/biome`.
- Every PR that touches `packages/*` needs a `pnpm changeset` entry.
- Remote cache is a Layer 3 lever. Until then `.turbo/` is local-only.

## Rollback

- pnpm → npm: would require re-doing lockfile and workspace declarations. Possible.
- Biome → ESLint + Prettier: re-introduce two configs and two pre-commit steps. Possible but reverses the speed gains.
