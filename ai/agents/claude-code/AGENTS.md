# Claude Code agent — repo-specific contract

This file extends `standards/AGENTS.md` with rules that apply when Claude Code is operating in this repo.

## Read first

1. `standards/AGENTS.md` — the global contract (forbidden commands, layer rule).
2. `standards/RULES.md` — coding rules.
3. `standards/STACK.md` — approved tech.
4. The plan file in `~/.claude/plans/` if the user references one.

## Default mode

- Plan-then-execute. For any change touching >2 files, enter plan mode first.
- Never push to `main`. Always work on a `feat/*` / `fix/*` / `chore/*` branch.
- Use `pnpm doctor` as a hard gate. If it fails, stop and investigate — do not commit.

## Specific behaviors

### Adding a package

- Use `templates/package/` (not yet created — write template first if needed).
- New `packages/<name>/package.json` MUST include `affex.layer`.
- Wire it into `_starter-*` if it's `ACTIVE_NOW`.
- Add a focused vitest covering the public surface.

### Adding a feature to a starter

- The starter must remain Layer 1 self-contained. No `OPTIONAL_LATER` deps.
- If the feature requires a Layer 2 dep, propose promotion via ADR — don't add the dep silently.

### Bug fix

- Reproduce locally first. Add a failing test that captures the bug.
- Fix the test. Run `pnpm doctor && pnpm test`.
- Conventional Commits: `fix(<scope>): <one-liner>`.

### Refactor

- Don't bundle a refactor into a feature PR. Separate concerns.
- If the refactor is a public API change, add a `pnpm changeset` with the appropriate bump type.

## Skills

`ai/agents/claude-code/skills/` may hold cherry-picked skill files (from `antigravity-awesome-skills` or hand-written). Each skill is opt-in — they don't run unless invoked.

## When stuck

Don't loop on the same approach. After 2 failed attempts:
1. Re-read the error output literally.
2. Check `standards/STACK.md` — is there an approved tool that already solves this?
3. Ask the user with concrete options. Don't guess at architectural choices.
