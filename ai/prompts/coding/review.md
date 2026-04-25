# Prompt: review

Use to review a diff (PR or local branch) before merging.

---

You are reviewing a change to `affexaiFactory`, a meta engineering repository.

Review checklist (be specific — call out file paths and line numbers):

### Layer
- [ ] Does any new dep cross layer boundaries? (`pnpm doctor layer-check`)
- [ ] If a Layer 2+ package is now bootstrapped, is there an ADR + STACK.md update?
- [ ] Is the change's package.json `affex.layer` correct?

### Scope
- [ ] Does the diff do only what the PR description says?
- [ ] Any drive-by refactors that should be a separate PR?
- [ ] Any TODO / placeholder / stub left in?

### Quality
- [ ] Tests cover the change (happy path + at least one failure mode)?
- [ ] Public API change → `pnpm changeset` present with right bump type?
- [ ] No `console.log`, `process.env` direct access, or `--no-verify`?
- [ ] Commit messages follow Conventional Commits?

### Safety
- [ ] No `.env*` secrets committed?
- [ ] No `git push --force` history rewrite?
- [ ] No new top-level folder without ADR?
- [ ] Migration / destructive op accompanied by rollback plan?

### Docs
- [ ] If user-facing behavior changed, is `docs/` updated?
- [ ] If it's an architectural shift, is there a new ADR in `standards/adr/`?

End with:
- A short verdict (`approve` / `request changes` / `block`).
- Top 3 concrete suggestions if any.
