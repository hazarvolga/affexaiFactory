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
| `pnpm dev --filter=@affex/_starter-next` → curl `/api/health` | ✅ `{"service":"starter-next","status":"ok",...}` |
| `pnpm create @affex/app --name smoke-test --template next-app` end-to-end | ✅ scaffolded, deps installed, dev came up, HTTP 200 |
| GitHub Actions CI on push | ⚠️ workflow valid but runner not allocated (repo-side setup pending) |

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

## Layer 1 closure

Following the previous checkpoint, three remaining acceptance items were closed:

- ✅ **Next.js starter dev smoke** — `curl http://localhost:3001/api/health` → `{"service":"starter-next","status":"ok",...}`; `/` → HTTP 200.
- ✅ **Generator dogfood** — `pnpm create @affex/app --name smoke-test --template next-app` produced `apps/smoke-test/`, deps installed, `pnpm dev` came up and answered HTTP 200. Generator gained `--name` / `--template` / `--yes` flags so it can run non-interactively (CI / scripts). Smoke output cleaned up after verification.
- ⚠️ **CI on GitHub Actions** — workflow YAML is valid and triggered on push, but the runner was never allocated (`runner_name` empty, job failed in 1s). This is repo-side Actions setup (verification / billing / enabled-status), not a code problem. Resolve at https://github.com/hazarvolga/affexaiFactory/settings/actions.

Both `tools/create-app` and `tools/doctor` had a `REPO_ROOT = process.cwd()` bug when launched via `pnpm --filter`; both now walk up to find the repo root by `pnpm-workspace.yaml`.

## Layer 2 — first promotion bundle (auth-core + ui-kit + design-tokens)

Triggered by: first authenticated app demand. Promoted via ADR 0004 + ADR 0005.

| Item | Status | Notes |
|---|---|---|
| `@affex/design-tokens` | ACTIVE_NOW | Tailwind preset + CSS vars encoding `standards/DESIGN.md` |
| `@affex/ui-kit` | ACTIVE_NOW | Button, Input, Label, Card primitives (shadcn pattern + Radix) |
| `@affex/auth-core` | ACTIVE_NOW | argon2 password helpers + `jose` JWT + `getUserFromRequest` session helper |
| Tailwind 3.4, shadcn/ui + radix, jose, argon2, lucide-react | ACTIVE_NOW | wired by the above |

**Wired into starters:**
- `_starter-next`: `/login` page (ui-kit + design-tokens), `/api/auth/sign-in` (argon2 + JWT), `/api/me` (session helper). Tailwind + tokens in `globals.css`.
- `_starter-nest`: `JwtAuthGuard` + `/me` route using `getUserFromRequest`.

**Verification (acceptance):**
- `pnpm doctor` PASS (layer-check + stack-sync)
- `pnpm lint` PASS (118 files; biome `unsafeParameterDecoratorsEnabled` override for NestJS)
- `pnpm typecheck` PASS (21 packages)
- `pnpm test` PASS (21 packages incl. happy-dom render tests for Button)
- `pnpm build` PASS (13 targets; argon2 native binary externalized in `next.config.mjs`)
- Smoke `_starter-next` + auth: `/login` renders, sign-in returns JWT, `/api/me` echoes user.
- Smoke `_starter-nest` + auth: `/me` returns 401 unauth, returns user with valid JWT.

## First product (`apps/first-app`) — full loop validated

Generated 2026-04-26 via `pnpm create @affex/app --name first-app --template next-app`.

- ✅ Scaffold + install in 9.7s
- ✅ Build PASS (5 routes: 2 static, 3 dynamic API)
- ✅ Smoke (6/6 endpoints):
  - `/api/health` → 200
  - `/login` → HTTP 200 (HTML)
  - `POST /api/auth/sign-in` correct creds → JWT (228 chars)
  - `POST /api/auth/sign-in` wrong creds → 401
  - `/api/me` no token → 401
  - `/api/me` valid token → `{"ok":true,"user":{"id":"demo-user","email":"demo@affex.dev","scope":["user"]}}`

This proves the full pipeline: generator → Layer 1 base + Layer 2 (auth-core + ui-kit + design-tokens) → working authenticated app.

**Known cosmetic issue:** `/api/health` of generated apps reports `service: "starter-next"` because `_starter-next` source has no `__APP_NAME__` token markers. Token-bearing template variants (`templates/{nest-saas,next-app}/`) will fix this — still a follow-up.

## Open follow-ups (Layer 2 next steps)

- Add `templates/nest-saas/` and `templates/next-app/` token-bearing variants so generated apps report their own `service` name.
- Resolve GH Actions runner allocation (browser-side setup) so CI can go green.
- When `first-app` becomes deployable → activate Coolify + Verdaccio per `docs/layer-promotion.md`.
- Next L2 candidates (when consumer demands): `queue-core` (BullMQ), `notification-core` (Resend), `testing-utils` (test-containers), `billing-core` (Stripe).
- Next L2 candidates: `queue-core` (BullMQ wrapper), `notification-core` (Resend), `testing-utils` (test-containers).

---

## Reference

- Full plan (Claude Code):  `~/.claude/plans/steady-bouncing-zebra.md`
- Memory entries: `~/.claude/projects/-Users-hazarekiz-Projects-affexaiFactory/memory/`
  - `project_affexai_factory.md` — meta repo, NOT a SaaS
  - `feedback_layered_delivery.md` — every artifact must carry a layer tag
- GitHub repo: https://github.com/hazarvolga/affexaiFactory
