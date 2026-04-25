# Claude Code instructions for affexaiFactory

This repo is a **meta engineering platform** ("Engineering OS"), NOT a SaaS product. Scope is developer/founder ergonomics, not end-user features.

## Read first

- `standards/RULES.md` — coding rules (Biome enforced)
- `standards/AGENTS.md` — explicit yasak/izin list for AI agents
- `standards/STACK.md` — approved technology matrix with layer status
- `standards/ARCHITECTURE.md` — monorepo and layer system explained

## Layer rules (HARD)

- Every package / app / tool has a layer status: `ACTIVE_NOW`, `OPTIONAL_LATER`, `SCALE_STAGE`, or `EXPERIMENTAL`.
- An `ACTIVE_NOW` package may NOT declare a runtime dependency on an `OPTIONAL_LATER` / `SCALE_STAGE` / `EXPERIMENTAL` package. `peerDependencies` are OK.
- Nothing may depend on anything inside `experimental/`.
- `pnpm doctor` (`tools/doctor`) enforces these. Run it before commit.

## Workflow

- Use Plan mode for non-trivial work. Don't edit until plan is approved.
- Prefer `pnpm create @affex/app` and `templates/package/` over manual scaffolding.
- DB schema change = changeset entry + migration + note in `db-core` upgrade log.
- Don't create new top-level folders without an ADR.
- Never use `--no-verify`, `git push --force`, or skip pre-commit hooks.

## Commands you'll run a lot

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm dev --filter=<app>
pnpm doctor
pnpm create @affex/app
pnpm changeset
```

## When in doubt

- Don't add a feature flag, fallback, or backwards-compat shim unless there's a real consumer asking for it.
- Don't write comments that restate what the code does. Only document non-obvious WHY.
- If you can't decide between two approaches, write a short ADR draft and ask.
