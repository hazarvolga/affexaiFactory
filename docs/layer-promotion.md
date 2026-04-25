# Layer promotion playbook

How to move an item from `OPTIONAL_LATER` (or `SCALE_STAGE`) into `ACTIVE_NOW`.

## When to promote

A Layer 2 item is ready when there's a **real consumer** asking for it. Don't promote on a hunch.

| Item | Concrete trigger |
|---|---|
| `@affex/auth-core` | First app that needs user accounts. |
| `@affex/ui-kit` + `@affex/design-tokens` | First Next.js frontend with non-trivial UI. |
| `@affex/queue-core` | First background job (email send, recurring task, webhook fan-out). |
| `@affex/notification-core` | First email or push send. |
| `@affex/billing-core` | First paid product launch. |
| `@affex/testing-utils` | First integration test that needs real Postgres. |
| Coolify (`infra/coolify/`, `deploy-coolify.yml`) | First app you intend to deploy. |
| Verdaccio | First external consumer (existing repo) that needs `@affex/*`. |
| Promptfoo (`ai/tests/`, `ai-review.yml`) | First prompt regression baseline. |
| Langfuse | LLM cost or latency review needed. |
| LangGraph (`ai/workflows/`) | Multi-step agent flow needed. |
| Aider (`ai/agents/aider/`) | Pair-programming workflow desired. |
| Graphify (`tools/migrate-repo` consumer) | Codebase Q&A or migration audit needed. |
| OpenHands | 3+ parallel autonomous agent tasks. |

## Promotion checklist

1. **ADR** — write `standards/adr/NNNN-promote-<item>.md`. Cover:
   - Why now (the trigger consumer).
   - What changes (folder/package added, deps wired).
   - Layer status flip.
   - Rollback plan if the consumer goes away.
2. **STACK.md** — flip the row to `ACTIVE_NOW`.
3. **Create the artifact**:
   - For a package, copy `templates/package/` and adapt.
   - For infra, add the relevant compose / dockerfile / coolify config.
   - For a workflow, add the `.yml` under `.github/workflows/`.
4. **Generator update** (if user-facing) — add the feature flag to `tools/create-app/`.
5. **Starter wiring** — add an example in `apps/_starter-*` so drift checks stay honest.
6. **Tests** — minimum: one happy-path test in the new package, one wiring test in the starter.
7. **Doctor** — `pnpm doctor` must pass (layer-check + drift).
8. **Changeset** — if a package's public surface changes, `pnpm changeset`.
9. **Docs** — link the new ADR from this file's table.

## Demotion (Layer 1 → Layer 2)

Only when the trigger consumer is gone and the cost of keeping it bootstrapped is real (security surface, maintenance burden). Same checklist in reverse:

1. ADR explaining why.
2. Move the artifact to its dormant state (delete folder if no consumers, keep stub if any consumer remains).
3. Update STACK.md.
4. Doctor passes.

## Anti-patterns

- Promoting a Layer 2 item "to be ready" without a consumer.
- Adding a Layer 2 dep to a Layer 1 package (use `peerDependencies` + runtime gate).
- Skipping the ADR because "it's small."
- Updating STACK.md without flipping the package.json `affex.layer` (or vice versa) — doctor catches this.
