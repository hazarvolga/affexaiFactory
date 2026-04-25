# @affex/_starter-nest

Layer: **ACTIVE_NOW** — reference NestJS app. The generator (`pnpm create @affex/app`) copies this when scaffolding a `nest-saas` product.

## Run

```bash
cp .env.example .env
pnpm install
pnpm dev          # http://localhost:3000
```

## Wired Layer 1 cores

| Package | Use here |
|---|---|
| `@affex/observability-core` | `createLogger` in `main.ts` |
| `@affex/shared-types` | `parseEnv(BaseEnvSchema)` in `main.ts` |
| `@affex/ai-core` | available; not used in starter (add at app level) |
| `@affex/db-core` | available; not used in starter (Prisma is a peer dep) |

## Endpoints

- `GET /` → `{ service, ok }`
- `GET /health` → `{ status, uptime }`

## Don't

- Don't add Layer 2 deps here (e.g. `@affex/ui-kit`, BullMQ, Stripe). The starter must remain Layer 1 self-contained.
- Don't merge generator-only token files (`__APP_NAME__`) into this folder. Token templates live in `templates/nest-saas/`.
