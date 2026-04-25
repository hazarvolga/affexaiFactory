# @affex/shared-types

Layer: **ACTIVE_NOW**

Cross-package Zod schemas and inferred TypeScript types. Anything that travels between two packages or services should be defined here once, then imported.

## Use

```ts
import { EmailSchema, AppError, parseEnv, BaseEnvSchema } from '@affex/shared-types';

const email = EmailSchema.parse('Foo@Bar.com'); // → 'foo@bar.com'

const env = parseEnv(
  BaseEnvSchema.extend({ DATABASE_URL: z.string().url() }),
);

throw new AppError('NOT_FOUND', 'user does not exist', { id });
```

## What's exported

| Group | Exports |
|---|---|
| common | `IdSchema`, `SlugSchema`, `EmailSchema`, `TimestampSchema`, `NonEmptyStringSchema`, `UrlSchema` |
| env | `NodeEnvSchema`, `LogLevelSchema`, `BaseEnvSchema`, `parseEnv()` |
| pagination | `PaginationQuerySchema`, `PaginatedResultSchema()`, `PaginatedResult<T>` |
| error | `ErrorCodeSchema`, `ApiErrorSchema`, `AppError` |

## Adding a new schema

- Live in a domain-grouped file (`src/<domain>.ts`).
- Re-export from `src/index.ts`.
- Add a focused vitest covering both happy and failure cases.
- If the schema represents a public DTO that's used outside the repo, bump with a `pnpm changeset` (minor for additions, major for breaking).
