# @affex/create-app

Layer: **ACTIVE_NOW**

Interactive scaffolder for new `@affex/<name>` apps. Copies a Layer 1 starter, applies token replacement, installs deps, and runs a smoke build.

## Use

From the repo root:

```bash
pnpm create @affex/app
# or directly:
pnpm --filter @affex/create-app dev
```

You'll be asked for:
- App name (kebab-case)
- Template (`nest-saas` | `next-app`)
- Features (Layer 1 only by default; Layer 2 features show but are disabled — promote them via ADR first)

The output is `apps/<name>/` with `package.json` rewritten, `README.md` regenerated, and `pnpm install` run.

## Token replacement

Files in the chosen starter can reference these tokens (which are replaced verbatim):

| Token | Example value |
|---|---|
| `__APP_NAME__` | `ticket-saas` |
| `__APP_NAME_PASCAL__` | `TicketSaas` |
| `__DB_NAME__` | `ticket_saas` |
| `__APP_PORT__` | `3000` (nest) / `3001` (next) |

If you don't use a token in a starter file, nothing happens to that file. Tokens only matter when you want app-specific values.

## Don't

- Don't bypass the generator and copy `apps/_starter-*` by hand. Doctor will detect the drift on the next CI run.
- Don't add a Layer 2 feature to the picker without first promoting the underlying package via ADR (see `docs/layer-promotion.md`).
