# RULES.md — Code & Process Standards

Source of truth for how code is written and changes are shipped in this repo.

## Priority

- 🔴 **CRITICAL** — never compromise (security, layer boundaries, data safety)
- 🟡 **IMPORTANT** — strong preference (quality, consistency)
- 🟢 **RECOMMENDED** — apply when practical

---

## 🔴 Layer boundaries (HARD)

- Every package, app, tool, template has exactly one layer status: `ACTIVE_NOW` | `OPTIONAL_LATER` | `SCALE_STAGE` | `EXPERIMENTAL`. Set in its `package.json` `affex.layer` field.
- An `ACTIVE_NOW` package may **not** declare a runtime `dependencies` entry on an `OPTIONAL_LATER` / `SCALE_STAGE` / `EXPERIMENTAL` package. `peerDependencies` and `devDependencies` are allowed.
- Nothing may depend on anything inside `experimental/`.
- `apps/*` may depend on `packages/*`. `packages/*` may not depend on `apps/*`.
- `pnpm doctor layer-check` enforces all of the above. CI runs it on every PR.

## 🔴 Workflow

- Plan-then-execute for any change touching >2 files. Use Claude Code plan mode.
- One PR = one change. No drive-by refactors.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `build:`, `ci:`.
- Branch names: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`. Never work on `main`.
- Every package change that ships externally needs a `pnpm changeset` entry.
- Schema change = changeset + migration + note in the upgrade log.

## 🔴 Failure investigation

- Always investigate the root cause. Never disable a test or skip a hook to make CI pass.
- If a tool fails (lint, typecheck, doctor), fix the underlying issue. Don't silence it.
- `--no-verify`, `git push --force`, `git reset --hard` on shared branches are forbidden.

## 🟡 Code style

- Biome enforces formatting and lint. `pnpm lint` is the source of truth — don't argue with it.
- TypeScript: `strict: true`, `noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true`.
- Imports: `import type { ... }` for type-only. Node modules use the `node:` protocol.
- Naming: `camelCase` for variables/functions, `PascalCase` for types/classes/components, `kebab-case` for filenames, `SCREAMING_SNAKE_CASE` for env vars.
- File layout: one public concept per file. Co-locate tests next to source as `*.test.ts`.

## 🟡 Implementation completeness

- No `// TODO` placeholders for core functionality. If it's needed, write it.
- No mock objects or stub implementations shipped to packages.
- No partial features. If you start it, finish it to a working state.

## 🟡 Scope discipline

- Build ONLY what the task asks for. No speculative abstractions, fallbacks, or feature flags for hypothetical futures.
- Don't add error handling for cases that can't happen. Trust framework guarantees.
- Three similar lines is better than a premature abstraction.

## 🟡 Documentation in code

- Default to no comments. Only document non-obvious **why** — hidden constraints, workarounds, surprising behavior.
- Don't restate what well-named code already says.
- Don't reference current task / fix / issue numbers in comments — that belongs in the PR description.

## 🟡 Workspace hygiene

- Clean up scratch files, debug scripts, temp dirs before finishing a task.
- No `.env` in commits. Use 1Password CLI locally; GH Actions OIDC in CI.
- Don't commit secrets even momentarily — the git history persists.

## 🟢 Tool selection

- `MultiEdit` over multiple `Edit` calls when changing the same file.
- Parallel tool calls when independent. Sequential only when dependent.
- Use generators (`pnpm create @affex/app`, `templates/package/`) instead of copy-paste scaffolding.

---

## Forbidden patterns (caught by `pnpm doctor`)

- ACTIVE_NOW → OPTIONAL_LATER runtime dep
- Anything → `experimental/*`
- `packages/*` → `apps/*`
- Direct `process.env` access in packages (use `@affex/shared-config` env helpers)
- `console.log` in package source (use `@affex/observability-core` logger)
- Unpinned versions in `dependencies` (use exact or `^x.y.z`)
- `npm install` / `yarn add` (always pnpm)
