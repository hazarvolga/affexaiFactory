# @affex/observability-core

Layer: **ACTIVE_NOW**

Logger (pino), error helpers, and an optional Langfuse adapter. The Langfuse integration is a **peer dependency** — apps that don't need it never install it.

## Use

```ts
import { createLogger, wrapError, serializeError } from '@affex/observability-core';

const log = createLogger({ service: 'starter-nest', level: 'info', pretty: process.env.NODE_ENV !== 'production' });

try {
  await doWork();
} catch (e) {
  log.error(serializeError(wrapError(e)), 'doWork failed');
}
```

## Optional: Langfuse trace

Install in your app: `pnpm add langfuse`. Then:

```ts
import { enableLangfuse } from '@affex/observability-core';

const lf = enableLangfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
});

const t = lf.trace({ name: 'process-ticket' });
t.update({ output: result });
t.end();
await lf.shutdownAsync();
```

If `langfuse` isn't installed, `enableLangfuse()` throws a clear message at the call site. The base package stays Layer 1 self-contained.

## Why this shape

- `createLogger` is a thin factory that pre-configures redaction, ISO timestamps, and the `service` binding.
- `wrapError` ensures every error in the system funnels through `AppError` for predictable serialization.
- `enableLangfuse` is a runtime gate so the optional peer dep can stay truly optional.
