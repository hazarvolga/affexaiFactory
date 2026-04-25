# ADR 0002: Biome replaces ESLint + Prettier

- Status: Accepted
- Date: 2026-04-25

## Context

ESLint + Prettier is the industry default but carries weight: two binaries, two configs, slow on large repos, frequent plugin churn. As a solo founder, every second of the inner loop matters.

## Decision

Use **Biome 1.9** as the single linter + formatter. One binary, one config (`biome.json`), one CI step.

## Why this works for us

- Native (Rust) — orders of magnitude faster than ESLint.
- Built-in formatter — no Prettier integration drift.
- Recommended ruleset already covers our needs (correctness, suspicious, style, organize-imports).
- Active and well-maintained.

## What we lose

- A handful of ESLint plugins have no Biome equivalent (e.g. niche framework rules).
- Smaller ecosystem of community configs.

We accept these trade-offs. If we hit a missing rule that matters, we'll either:
- Add a custom Biome rule, or
- Run a targeted ESLint pass for that one concern only (escape hatch).

## Consequences

- One config at root: `biome.json`.
- Pre-commit: `biome check --write`.
- CI: `biome check .` must pass.
- Editor integrations: Biome VS Code extension.
- IDE rules: never disable Biome locally to commit code.
