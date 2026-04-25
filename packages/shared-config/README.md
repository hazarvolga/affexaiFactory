# @affex/shared-config

Layer: **ACTIVE_NOW**

Shared TypeScript / Biome / Vitest / tsup presets for the `@affex` monorepo. Config-only — no runtime code.

## Use

In a package:

```jsonc
// packages/<name>/tsconfig.json
{
  "extends": "@affex/shared-config/tsconfig.lib.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

```ts
// packages/<name>/vitest.config.ts
export { default } from '@affex/shared-config/vitest.config';
```

```ts
// packages/<name>/tsup.config.ts
export { default } from '@affex/shared-config/tsup.config';
```

In an app:

```jsonc
// apps/<name>/tsconfig.json
{
  "extends": "@affex/shared-config/tsconfig.app.json",
  ...
}
```

## What's inside

| File | Purpose |
|---|---|
| `tsconfig.base.json` | strict, NodeNext, ES2023; for both libs and apps |
| `tsconfig.lib.json` | extends base, emits to `dist/`, used by packages |
| `tsconfig.app.json` | extends base, enables decorators (NestJS), used by apps |
| `biome.json` | re-exports root biome config |
| `vitest.config.ts` | node env, v8 coverage |
| `tsup.config.ts` | esm-only, dts, sourcemap, target node22 |
