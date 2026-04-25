# affexaiFactory

**Solo Founder Engineering OS** — a meta repository / yazılım fabrikası for shipping products fast.

This is not a SaaS. It is the toolchain a one-person company uses to start, grow, and operate multiple SaaS / client products. It contains reusable packages, NestJS / Next.js starter kits, AI agent configs, coding standards, scaffolders, and CI/CD glue.

## Layered delivery

Every artifact is tagged with one of:

| Status | Meaning |
|---|---|
| `ACTIVE_NOW` | Layer 1 — production core. Required for the repo to run. |
| `OPTIONAL_LATER` | Layer 2 — activated when there's a real trigger. |
| `SCALE_STAGE` | Layer 3 — future scale (team, agent fleet, multi-prod). |
| `EXPERIMENTAL` | Sandbox. Nothing depends on it. |

The Layer 1 subset is self-contained: `pnpm install && pnpm build && pnpm dev` works with everything else absent.

See `standards/ARCHITECTURE.md` and `docs/layer-promotion.md` for the full rules.

## Quick start

```bash
nvm use                      # node 22
corepack enable
pnpm install
pnpm build
pnpm dev                     # runs both _starter-nest and _starter-next
```

## Generate a new app

```bash
pnpm create @affex/app
```

## Repo health

```bash
pnpm doctor                  # layer-check + dep audit + drift detect
```

## Layout

```
apps/         runnable products (and reference _starter-* apps)
packages/     reusable libs (@affex/*)
templates/    generator inputs (token'd)
tools/        CLIs (create-app, doctor, migrate-repo)
ai/           AI agent configs, prompts, workflows
standards/    DESIGN, AGENTS, RULES, STACK, ARCHITECTURE, ADRs
infra/        compose, dockerfiles, coolify
docs/         engineering OS docs
experimental/ no-depend sandbox
```

## Reference

- Plan: `~/.claude/plans/steady-bouncing-zebra.md`
- Standards: `standards/`
- Layer promotion playbook: `docs/layer-promotion.md`
