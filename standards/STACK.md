# STACK.md — Approved technologies

The single source of truth for what tech is allowed in this repo. Any addition / removal requires an ADR.

Each row carries a layer status:
- `ACTIVE_NOW` — bootstrapped, in use today
- `OPTIONAL_LATER` — approved but not yet wired in; activation triggers listed
- `SCALE_STAGE` — for the team / fleet / multi-prod era

## Language & Runtime

| Tech | Status | Notes |
|---|---|---|
| TypeScript 5.7 | ACTIVE_NOW | strict, NodeNext, verbatimModuleSyntax |
| Node.js 22 LTS | ACTIVE_NOW | `.nvmrc` enforced |
| pnpm 9 | ACTIVE_NOW | workspace + lockfile |

## Monorepo & Build

| Tech | Status | Notes |
|---|---|---|
| Turborepo 2 | ACTIVE_NOW | local cache; remote cache → SCALE_STAGE |
| Biome 1.9 | ACTIVE_NOW | replaces ESLint + Prettier |
| Changesets 2 | ACTIVE_NOW | versioning + changelog |
| Vitest 2 | ACTIVE_NOW | unit + integration testing |
| tsx | ACTIVE_NOW | TS execution for tools |
| Verdaccio | OPTIONAL_LATER | trigger: first external consumer / migrated repo |

## Backend

| Tech | Status | Notes |
|---|---|---|
| NestJS 10 | ACTIVE_NOW | starter app + service template |
| Fastify (under Nest) | ACTIVE_NOW | http adapter |
| Prisma 5 | ACTIVE_NOW | ORM via `@affex/db-core` |
| PostgreSQL 16 | ACTIVE_NOW | primary store |
| Zod 3 | ACTIVE_NOW | runtime validation + DTO source |
| Redis 7 | OPTIONAL_LATER | trigger: first cache or queue need |
| BullMQ 5 | OPTIONAL_LATER | trigger: first background job |
| Auth.js / NextAuth 5 | ACTIVE_NOW | wrapped by `@affex/auth-core` (ADR 0004) |
| jose (JWT) | ACTIVE_NOW | dep of `@affex/auth-core` |
| argon2 (password hash) | ACTIVE_NOW | dep of `@affex/auth-core` |
| Stripe + Lemon Squeezy | OPTIONAL_LATER | trigger: first paid product |

## Frontend

| Tech | Status | Notes |
|---|---|---|
| Next.js 14 | ACTIVE_NOW | App Router |
| React 18 | ACTIVE_NOW | comes with Next |
| Tailwind CSS 3 | ACTIVE_NOW | preset via `@affex/design-tokens` (ADR 0005) |
| shadcn/ui + radix | ACTIVE_NOW | vendored into `@affex/ui-kit` (ADR 0005) |
| class-variance-authority + tailwind-merge + clsx | ACTIVE_NOW | deps of `@affex/ui-kit` |
| lucide-react (icons) | ACTIVE_NOW | dep of `@affex/ui-kit` |
| TanStack Query 5 | OPTIONAL_LATER | trigger: first complex client data layer |

## Observability

| Tech | Status | Notes |
|---|---|---|
| pino 9 | ACTIVE_NOW | logger via `@affex/observability-core` |
| OpenTelemetry SDK | ACTIVE_NOW | minimal init wired in core; exporter optional |
| Langfuse (self-host) | OPTIONAL_LATER | trigger: LLM cost / latency review need |
| GlitchTip (self-host) | OPTIONAL_LATER | trigger: errors in deployed app |
| Plausible (self-host) | OPTIONAL_LATER | trigger: first public app |
| Uptime Kuma | OPTIONAL_LATER | trigger: first deployed app |
| Grafana / Prometheus | SCALE_STAGE | replaces lite OTel exporter |

## AI

| Tech | Status | Notes |
|---|---|---|
| Anthropic SDK | ACTIVE_NOW | via `@affex/ai-core` |
| OpenAI SDK | ACTIVE_NOW | via `@affex/ai-core` |
| Claude Code | ACTIVE_NOW | default agent; `ai/agents/claude-code/` |
| Aider | OPTIONAL_LATER | trigger: pair-programming workflow need |
| Promptfoo | OPTIONAL_LATER | trigger: first prompt regression baseline |
| LangGraph | OPTIONAL_LATER | trigger: multi-step workflow need |
| Graphify | OPTIONAL_LATER | trigger: codebase Q&A or migration audit |
| OpenHands | SCALE_STAGE | trigger: 3+ parallel autonomous agents |
| mem0 / Serena memory | SCALE_STAGE | trigger: cross-session agent memory |

## Infra & Deploy

| Tech | Status | Notes |
|---|---|---|
| Docker | ACTIVE_NOW | local dev stack |
| docker-compose | ACTIVE_NOW | `infra/compose/docker-compose.dev.yml` |
| GitHub Actions | ACTIVE_NOW | `ci.yml` + `release.yml` |
| Coolify | OPTIONAL_LATER | trigger: first deployed app |
| Backblaze B2 | OPTIONAL_LATER | trigger: first DB needing backup |
| 1Password CLI | ACTIVE_NOW | local secrets |
| GH Actions OIDC | OPTIONAL_LATER | trigger: first CI secret beyond NPM_TOKEN |
| Tailscale | OPTIONAL_LATER | trigger: internal admin panel |
| k3s / Coolify cluster | SCALE_STAGE | trigger: capacity bottleneck |

## Forbidden / not approved

- yarn, npm install (always pnpm)
- ESLint, Prettier (Biome only)
- Lerna, Nx (Turborepo only)
- Webpack as a primary bundler (use Next/Vite/swc)
- Mongo / Redis-as-primary-store (Postgres is the truth)
- Adding a new package manager / build tool / linter without an ADR
