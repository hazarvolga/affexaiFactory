# Creating a new app

```bash
pnpm create @affex/app
```

The generator walks you through:

1. **Name** — slug (`kebab-case`). Used for folder name, package name (`@affex/<name>`), DB name.
2. **Template** — pick one of the available Layer 1 templates:
   - `nest-saas` — NestJS API + worker + Prisma
   - `next-app` — Next.js 14 (App Router)
3. **Features** — multiselect, defaults to none. Each one wires a Layer 1 core:
   - `observability` (logger + OTel)
   - `ai` (LLM client)
   - `db` (Prisma client)
   
   Layer 2 features (auth, billing, ui-kit, queue, notifications) are shown but flagged: selecting one triggers a promotion prompt that creates an ADR draft and updates `STACK.md`. You can decline and re-run later.
4. **Deploy target** — `coolify` (Layer 2; will create a stub `infra/coolify/<name>.json`) or `none` for now.
5. **AI agent config** — `claude-code` always wired; `aider` / `openhands` only if those are activated.

After confirmation:

- `apps/<name>/` is created from `apps/_starter-<template>/` with token replacement.
- `package.json` deps reflect the chosen feature set.
- `pnpm install` runs.
- `turbo run build --filter=<name>` runs as a smoke test.
- A scaffold commit is created: `feat: scaffold <name> from <template>`.

## What gets generated

```
apps/<name>/
├── package.json           # @affex/<name>, layer ACTIVE_NOW (it's a real app)
├── tsconfig.json          # extends @affex/shared-config/tsconfig
├── README.md              # filled with name + bootstrap commands
├── AGENTS.md              # app-local agent rules (extends standards/AGENTS.md)
├── src/                   # template content with tokens replaced
└── (template-specific extras: prisma/schema.prisma, next.config.mjs, etc.)
```

## Adding a feature later

You can add a Layer 1 core after the fact:

```bash
cd apps/<name>
pnpm add @affex/db-core
```

Then wire it manually following the relevant package's README.

For Layer 2 features, see `docs/layer-promotion.md` first.

## Renaming or removing

- Rename: edit `package.json#name`, update workspace references, run `pnpm install`.
- Remove: `pnpm remove --workspace -r @affex/<name>` then `rm -rf apps/<name>`.

## Don't

- Don't copy-paste from `apps/_starter-*` manually. The generator is the only blessed path; manual scaffolds drift and break Doctor.
- Don't introduce a new template directly. Add `templates/<new>/` plus an ADR and update the generator.
