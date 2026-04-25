# AGENTS.md — AI agent contract

This file is read by Claude Code, Aider, OpenHands, and any other coding agent that operates in this repo. It is the **explicit contract** of what is allowed and what is forbidden.

## Mission

You are working in a **meta engineering repository** that the founder uses to ship multiple products fast. Your job is to keep the platform sharp: clean packages, working scaffolds, accurate standards. You are NOT building product features here.

## Read on every session start

1. `standards/RULES.md` — coding rules, layer boundaries
2. `standards/STACK.md` — approved tech (don't introduce alternatives without an ADR)
3. `standards/ARCHITECTURE.md` — monorepo decisions
4. The plan file mentioned in the user's request, if any

## Layer rule (SACRED)

Read `standards/RULES.md § Layer boundaries`. Violations break the build.

If you need a Layer 2 capability inside a Layer 1 package, the answer is **not** to add the dep. Either:
- Use an optional `peerDependency` + a `enableX()` runtime gate (preferred), or
- Promote the dep to Layer 1 via ADR.

## Allowed

- Read everything in the repo.
- Create / edit files inside `apps/`, `packages/`, `tools/`, `templates/`, `ai/`, `standards/`, `docs/`, `infra/`, `scripts/`, `experimental/`.
- Run `pnpm install`, `pnpm build`, `pnpm dev`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm doctor`.
- Run `pnpm create @affex/app`, `pnpm changeset`.
- `git add` / `git commit` / `git status` / `git diff`. Conventional Commits required.
- `docker compose -f infra/compose/docker-compose.dev.yml up/down/logs`.

## Forbidden

- `git push --force` to any branch.
- `git push` to `main` (always via PR).
- `--no-verify` on commits.
- `git reset --hard` on a branch you didn't create in this session.
- `rm -rf` outside the repo root.
- Direct edits to `pnpm-lock.yaml`. Run `pnpm install` instead.
- Adding a new top-level folder without an ADR (`standards/adr/`).
- Adding a runtime dep that crosses layer boundaries (see Layer rule).
- Running migrations against any non-local database.
- Touching `.env*` files. Use 1Password CLI references.
- Bypassing `pnpm doctor` failures.
- Calling external paid APIs without confirming with the user.

## Decision protocol

When unsure between approaches:

1. Check `standards/STACK.md` — is one of them already approved?
2. Check `standards/adr/` — is there a relevant ADR?
3. If still ambiguous: write a short ADR draft (`standards/adr/NNNN-<slug>.md`), present both options, ask the user.

Don't decide unilaterally on architectural questions. Do decide on local style/implementation choices.

## When you finish a task

- Run `pnpm doctor` and `pnpm test` (where applicable).
- Update `standards/STACK.md` if you introduced or removed a tech.
- Add a `pnpm changeset` if a published package changed.
- Don't create a PR or push unless explicitly asked.

## Communication

- Keep status updates to one sentence. Reserve detail for the actual diff.
- Don't restate the user's request back at them.
- If a tool fails, report what failed and what you'll try next — don't hide it.
- If the user's request would violate a rule above, say so and propose a compliant alternative. Don't silently bend the rule.
