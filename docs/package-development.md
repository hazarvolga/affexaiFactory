# Package development

Reusable code lives in `packages/<name>/` and is published as `@affex/<name>`.

## Anatomy

```
packages/<name>/
├── package.json           # name: @affex/<name>, layer set, exports declared
├── tsconfig.json          # extends @affex/shared-config/tsconfig.lib.json
├── tsup.config.ts         # bundle config (or whatever the template uses)
├── src/
│   ├── index.ts           # public surface only — this is the contract
│   └── ...                # implementation
├── README.md              # what / why / examples / status
└── __tests__/             # vitest, side by side with src
```

## Create a new package

```bash
# Manual (until pnpm create @affex/package exists):
cp -r templates/package packages/<name>
# Then edit package.json#name, README.md, tsconfig paths
pnpm install
```

## package.json contract

Every package must declare:

```jsonc
{
  "name": "@affex/<name>",
  "version": "0.1.0",
  "license": "UNLICENSED",
  "private": true,                          // remove only when publishing externally
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist .turbo *.tsbuildinfo"
  },
  "affex": {
    "layer": "ACTIVE_NOW"                   // or OPTIONAL_LATER, etc.
  }
}
```

## Layer rule (read this twice)

If the package is `ACTIVE_NOW`:

- Its `dependencies` may not include any `OPTIONAL_LATER` / `SCALE_STAGE` / `EXPERIMENTAL` package.
- Optional integrations should use `peerDependencies` + a runtime gate:

```ts
// packages/observability-core/src/langfuse.ts
export function enableLangfuse(opts: LangfuseOpts) {
  // only require()'d when called, so peerDep is truly optional
  const { Langfuse } = require('langfuse');
  return new Langfuse(opts);
}
```

## Public surface

`src/index.ts` is the contract. Only export what consumers should use.

- Internal types live in `src/internal/*` and are not re-exported.
- Breaking changes to anything exported = major version bump = changeset entry with `major`.

## Tests

- Vitest. Tests sit in `__tests__/` or alongside source as `*.test.ts`.
- Mocking external services is fine; mocking your own internal logic is a code smell — refactor instead.
- For DB-backed packages, use `@affex/testing-utils` (Layer 2) test-containers when activated.

## Releasing (when published externally)

1. Open a PR with the change.
2. Run `pnpm changeset` and pick the bump type. Commit the markdown file it creates.
3. Merge. CI runs `release.yml` which version-bumps and (when registry is wired) publishes.

## Drift checks

`pnpm doctor drift` compares the public surface of each package to what `_starter-*` apps consume. If a starter wires a removed export, doctor fails the next CI run.
