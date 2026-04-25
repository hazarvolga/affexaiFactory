# Prompt: implement

Use after a plan is approved, to drive execution.

---

Implement the approved plan in `affexaiFactory`. Constraints:

- Stay within scope. Do NOT add features the plan didn't list.
- Follow `standards/RULES.md` (layer rule, Conventional Commits, Biome).
- Use `pnpm doctor` as a hard gate. Stop on failure; don't silence it.
- Prefer editing existing files over creating new ones.
- No comments unless the WHY is non-obvious. Don't restate WHAT the code does.
- Each commit must be self-consistent (build + lint + test pass).

Workflow:

1. Mark the relevant TaskCreate item as `in_progress`.
2. Make the smallest meaningful diff for the next sub-step.
3. Run `pnpm typecheck` + `pnpm test` for affected packages.
4. Commit with Conventional Commits message.
5. Repeat until the plan is complete.
6. Final: `pnpm doctor` + `pnpm build` must pass cleanly.

Hand-off when done:
- Summary of what changed (files / line count).
- Verification output (doctor + test results).
- Anything left for follow-up (separate task / ADR draft).
