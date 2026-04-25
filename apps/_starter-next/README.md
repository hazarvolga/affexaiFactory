# @affex/_starter-next

Layer: **ACTIVE_NOW** — reference Next.js 14 app (App Router). The generator (`pnpm create @affex/app`) copies this when scaffolding a `next-app` product.

## Run

```bash
cp .env.example .env
pnpm install
pnpm dev          # http://localhost:3001
```

## Wired Layer 1 cores

| Package | Use here |
|---|---|
| `@affex/observability-core` | Available; wired in API routes when needed |
| `@affex/shared-types` | Available; use for env / DTO validation |
| `@affex/ai-core` | Available; use in API routes / RSC |

## Endpoints

- `/` → static landing page
- `/api/health` → JSON `{ service, status, uptime }`

## Don't

- Don't pull in `@affex/ui-kit` (Layer 2). The starter must remain Layer 1 self-contained.
- Don't add Tailwind here — `@affex/design-tokens` is the Layer 2 source of truth for styling. Inline minimal styles only.
