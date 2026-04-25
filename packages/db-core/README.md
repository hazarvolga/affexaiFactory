# @affex/db-core

Layer: **ACTIVE_NOW**

Prisma client factory + migration helpers, with the Prisma client itself as an **optional peer dep**. Apps that don't use Prisma never install it.

## Use

In your app:

```bash
pnpm add prisma @prisma/client
npx prisma init
# write your schema, then:
npx prisma generate
```

Then in code:

```ts
import { createPrisma, runMigrations } from '@affex/db-core';

const prisma = createPrisma({
  databaseUrl: process.env.DATABASE_URL!,
  service: 'starter-nest',
  logQueries: process.env.NODE_ENV !== 'production',
});

await prisma.$connect();
```

To apply migrations in CI / startup:

```ts
await runMigrations({ databaseUrl: process.env.DATABASE_URL! });
```

## Why a peer dep

Prisma's generated client is large and tied to your specific schema. Bundling it into a shared lib would either bloat or be incomplete. Apps generate their own client from their own schema; this package only encapsulates the wiring.

## Future additions (when needed)

- Soft-delete middleware (when first product needs it).
- Audit log middleware (write-side).
- Read-replica routing (SCALE_STAGE).
