# affexaiFactory — Plan & Progress Log

This file is the canonical record of the project's plan and execution checkpoints. It mirrors the Claude Code plan at `~/.claude/plans/steady-bouncing-zebra.md` plus the original ask that produced it.

---

## Original brief (what was asked)

> Tek kişilik bir yazılım şirketi işletiyorum. Hedefim minimum insan gücü ile maksimum üretim yapmak. GitHub üzerindeki en güçlü open-source araçları birleştirerek production-ready, ölçeklenebilir, AI-first bir "Ultimate Solo Founder Stack Repository" oluştur.

**Hedef:** Tek kişi olarak aynı anda birden fazla SaaS geliştirebilmek, mevcut projeleri hızlı büyütebilmek, AI coding agent'larla çalışabilmek, müşteri projeleri yönetebilmek, yeni MVP'leri çok hızlı çıkarabilmek, tek panelden operasyon yönetebilmek, reusable package sistemi kurmak, prompt / agent / automation altyapısı oluşturmak.

**Kullanılacak araçlar:** Aider, OpenHands, LangGraph, Langfuse, Promptfoo, Google design.md, Graphify, Antigravity Skills, Turborepo, pnpm, Biome, Plausible, Cal.com, Uptime Kuma, NocoDB, Coolify.

**Tech tercihleri:** NestJS, Next.js, PostgreSQL, Redis, BullMQ, Docker, TypeScript, Tailwind, self-hosted, AI-first.

**İstenen 12 çıktı:**
1. Full master repository architecture
2. Monorepo stratejisi (Turborepo + pnpm)
3. Reusable packages
4. Apps klasörü
5. AI klasörü
6. Standards klasörü (DESIGN, AGENTS, RULES, STACK)
7. Mevcut proje migration stratejisi
8. Tek komutla yeni proje üretme sistemi
9. CI/CD önerisi (GitHub Actions + Coolify)
10. Solo founder operating model
11. Security + Backup + Monitoring
12. 1-yıl sonra şirket büyürse scale stratejisi

---

## Critical pivot (mid-conversation)

After initial planning, user clarified that **`affexaiFactory` is NOT a SaaS product**, it is a **meta engineering repository / yazılım fabrikası / Engineering OS** that the founder uses across future projects. The plan was rewritten to scope on developer ergonomics, not product features (no multi-tenancy, no billing schema, no auth flows for end users).

---

## Layered delivery model (final approach)

Every artifact (folder, package, tool, workflow) is tagged with one of:

| Status | Meaning | Bootstrapped? | Activation trigger |
|---|---|---|---|
| **ACTIVE_NOW** | Layer 1 — production core | yes | always |
| **OPTIONAL_LATER** | Layer 2 — activate when a real consumer needs it | no — documented only | specific app / workflow needs it |
| **SCALE_STAGE** | Layer 3 — team / agent fleet / multi-prod era | no | 3+ team or 3+ prod apps or 5+ parallel agents |
| **EXPERIMENTAL** | Sandbox; no-depend rule | only `experimental/` | promote via ADR if proven |

Layer 1 alone must run cleanly: `pnpm install && pnpm build && pnpm dev` works without any Layer 2/3 artifact present. `pnpm doctor layer-check` enforces the boundary in CI.

---

## Final architecture (Layer 1 — the bootstrapped subset)

```
affexaiFactory/
├── .github/
│   ├── workflows/{ci,release}.yml
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── (deploy-coolify.yml, ai-review.yml — Layer 2)
├── apps/
│   ├── _starter-nest/                    # NestJS reference (Fastify + /health)
│   └── _starter-next/                    # Next.js 14 reference (App Router + /api/health)
├── packages/
│   ├── shared-config/                    # tsconfig + biome + vitest + tsup presets
│   ├── shared-types/                     # Zod schemas (common, env, pagination, error)
│   ├── observability-core/               # pino + AppError + optional Langfuse adapter
│   ├── ai-core/                          # LLM client (Anthropic + OpenAI peers) + cache + retry
│   └── db-core/                          # Prisma client factory + migrations (Prisma peer)
├── templates/
│   └── package/                          # iskele for new reusable packages
├── tools/
│   ├── create-app/                       # `pnpm create @affex/app` — layer-aware
│   └── doctor/                           # layer-check + stack-sync
├── ai/
│   ├── agents/claude-code/AGENTS.md
│   └── prompts/coding/{plan,implement,review}.md
├── standards/
│   ├── {RULES,AGENTS,STACK,DESIGN,ARCHITECTURE}.md
│   └── adr/{0001-monorepo-tooling,0002-biome-over-eslint,0003-layer-system}.md
├── infra/
│   ├── compose/docker-compose.dev.yml    # postgres + redis
│   ├── docker/Dockerfile.node
│   └── (coolify/, scripts/ — Layer 2)
├── docs/
│   ├── getting-started.md
│   ├── creating-a-new-app.md
│   ├── package-development.md
│   └── layer-promotion.md
├── experimental/README.md                # no-depend zone
├── .changeset/config.json
├── biome.json | turbo.json | pnpm-workspace.yaml | tsconfig.base.json | package.json
├── README.md | CLAUDE.md | plan.md (this file)
└── .npmrc | .gitignore | .nvmrc
```

### Layer 2 (documented, not bootstrapped)

`auth-core`, `ui-kit`, `design-tokens`, `queue-core`, `notification-core`, `billing-core`, `testing-utils`,
Aider config, Promptfoo, Langfuse self-host, LangGraph workflows, Graphify, Coolify, Verdaccio, Backblaze backup.

### Layer 3 (scale era)

`feature-flags`, `rbac-core`, `rate-limit-core`, `webhook-core`, OpenHands fleet, Turbo Remote Cache backend, k3s migration, CODEOWNERS + branch protection, mem0/Serena memory store.

---

## Approved tech (Layer 1 — see standards/STACK.md for full matrix)

| Concern | Choice |
|---|---|
| Workspace | pnpm 9 |
| Build orchestrator | Turborepo 2 |
| Lint + format | Biome 1.9 |
| Versioning | Changesets |
| Tests | Vitest 2 |
| Lib bundler | tsup (dual ESM + CJS) |
| Backend | NestJS 10 + Fastify |
| Frontend | Next.js 14 (App Router) |
| ORM | Prisma 5 (peer dep in db-core) |
| Validation | Zod 3 |
| Logger | pino 9 (via observability-core) |
| LLM SDKs | @anthropic-ai/sdk + openai (peer deps in ai-core) |
| Local stack | Docker (postgres 16 + redis 7) |
| CI | GitHub Actions |
| Node | 22 LTS |

Forbidden by policy: yarn, npm install, ESLint, Prettier, Lerna, Nx.

---

## Bootstrap order (the executed checklist)

| Step | Status | What |
|---|---|---|
| 1. Root scaffold | ✅ | package.json, turbo, biome, tsconfig, .nvmrc, .gitignore, .npmrc, README, CLAUDE.md |
| 2. Standards | ✅ | RULES + AGENTS + STACK + DESIGN + ARCHITECTURE + 3 ADRs + docs/{getting-started, creating-a-new-app, package-development, layer-promotion} |
| 3. shared-config + shared-types | ✅ | tsconfig/biome/vitest/tsup presets + Zod schemas with tests |
| 4. observability-core + ai-core + db-core | ✅ | pino + LLM client + Prisma factory; optional peers gated at runtime |
| 5. _starter-nest + _starter-next | ✅ | Fastify health endpoint + Next App Router health route |
| 6. create-app generator | ✅ | Layer-aware feature picker (Layer 2 features disabled with promotion warning) |
| 7. doctor | ✅ | layer-check + stack-sync; auto-detects repo root by walking up |
| 8. CI workflows | ✅ | ci.yml (lint+typecheck+test+build+doctor) + release.yml (Changesets) |
| 9. Infra dev stack | ✅ | docker-compose (postgres + redis) + shared Dockerfile.node |
| 10. AI Layer 1 | ✅ | claude-code/AGENTS.md + plan/implement/review prompts |
| 11. Verification | ✅ | install + lint + typecheck + test + build all PASS; nest smoke test (curl /health 200 OK) |

---

## Verification checklist (Layer 1 acceptance)

| Check | Result |
|---|---|
| `pnpm install` | ✅ ~60s |
| `pnpm doctor` | ✅ layer-check + stack-sync PASS |
| `pnpm lint` (Biome) | ✅ 81 files clean |
| `pnpm typecheck` | ✅ 15/15 packages |
| `pnpm test` (Vitest) | ✅ all suites pass (shared-types, observability-core, ai-core, db-core, doctor) |
| `pnpm build` (Turbo) | ✅ 10/10 — ESM + CJS dual output for all libs; Next.js compile OK |
| `pnpm dev --filter=@affex/_starter-nest` → curl `/health` | ✅ `{"status":"ok",...}` |
| `pnpm create @affex/app` end-to-end | ⏳ smoke test pending (not yet dogfooded) |

---

## How to use this repo (TL;DR)

```bash
nvm use && corepack enable
pnpm install
pnpm doctor                              # health
pnpm dev --filter=@affex/_starter-nest   # http://localhost:3000
pnpm dev --filter=@affex/_starter-next   # http://localhost:3001
pnpm create @affex/app                   # scaffold a new product
```

For deeper guides see `docs/getting-started.md`, `docs/creating-a-new-app.md`, `docs/layer-promotion.md` and the ADRs under `standards/adr/`.

---

## Open follow-ups (left for next session)

- Generator dogfood: run `pnpm create @affex/app smoke-test` end-to-end and confirm output builds.
- Next.js starter dev smoke test in this session was skipped (Nest covered the package wiring).
- Add `templates/nest-saas/` and `templates/next-app/` token-bearing variants (right now generator copies `apps/_starter-*` directly; tokens are token-replaced but no template-only files exist yet).
- Push the latest checkpoint to `origin/main`.
- First real product spike using the generator (validates the whole loop).

---

## Reference

- Full plan (Claude Code):  `~/.claude/plans/steady-bouncing-zebra.md`
- Memory entries: `~/.claude/projects/-Users-hazarekiz-Projects-affexaiFactory/memory/`
  - `project_affexai_factory.md` — meta repo, NOT a SaaS
  - `feedback_layered_delivery.md` — every artifact must carry a layer tag
- GitHub repo: https://github.com/hazarvolga/affexaiFactory
