# @affex/ai-core

Layer: **ACTIVE_NOW**

Multi-provider LLM client with built-in retry, in-memory LRU cache, and an extensible call shape. Provider SDKs (`@anthropic-ai/sdk`, `openai`) are **optional peer deps** — install only what your app uses.

## Use

```ts
import { createLLMClient } from '@affex/ai-core';

const llm = createLLMClient({
  config: { provider: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY! },
  cacheSize: 512,
});

const res = await llm.chat({
  model: 'claude-opus-4-7',
  messages: [
    { role: 'system', content: 'You are concise.' },
    { role: 'user', content: 'What is 2+2?' },
  ],
  maxTokens: 64,
});

console.log(res.content, res.cached);
```

## Providers

| Provider | Peer dep | Default model recommendation |
|---|---|---|
| `anthropic` | `@anthropic-ai/sdk` | `claude-opus-4-7` |
| `openai` | `openai` | `gpt-4o-mini` |

The peer deps are loaded with `require()` only when first used, so a NestJS app that uses Anthropic only never bundles OpenAI's client.

## Cache

Identity is computed from `model + messages + maxTokens + temperature` (or an explicit `cacheKey` if you want stable hits across messages). Cache is in-process LRU; for cross-process caching, write your own wrapper.

## Retry

Default: 3 attempts, exponential backoff with jitter, retries on 429 / timeout / network / 5xx. Override with `retry: { attempts, baseMs, factor, maxMs, shouldRetry }`.

## Observability

This package logs nothing on its own. Wrap calls in your app with `@affex/observability-core`'s logger and (optionally) Langfuse traces.
