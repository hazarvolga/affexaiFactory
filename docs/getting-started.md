# Getting started

## Prerequisites

- Node.js 22 LTS (`nvm install 22 && nvm use`)
- pnpm 9 (`corepack enable && corepack prepare pnpm@9 --activate`)
- Docker (for the local dev stack)
- Python 3.10+ + pip (for Graphify, the codebase X-ray skill — see below)
- 1Password CLI (`brew install 1password-cli`) — for secrets, optional in local-only flows

## One-time per-developer setup

```bash
# Graphify — codebase knowledge graph for fast Q&A (ADR 0006)
pip install graphifyy
graphify install              # installs to ~/.claude/skills/graphify/
```

Verify with `graphify --version`. Usage in `ai/agents/claude-code/graphify.md`.

## First clone

```bash
git clone git@github.com:hazarvolga/affexaiFactory.git
cd affexaiFactory
nvm use
pnpm install
pnpm build
```

`pnpm install` should take <60s the first time. After that it's incremental.

## Run the references

```bash
docker compose -f infra/compose/docker-compose.dev.yml up -d
pnpm dev --filter=@affex/_starter-nest    # http://localhost:3000
pnpm dev --filter=@affex/_starter-next    # http://localhost:3001
```

If both servers come up, your install is good.

## Repo health check

```bash
pnpm doctor
```

Runs in seconds. Flags layer violations, drift between starters and packages, vulnerable deps, and lockfile inconsistencies.

## Generate a new app

```bash
pnpm create @affex/app
```

Walks you through name, template, features (only Layer 1 features by default), and deploy target. Outputs to `apps/<name>/` with all chosen Layer 1 cores wired.

See `docs/creating-a-new-app.md` for details.

## Day-to-day commands

```bash
pnpm build                              # build everything (uses turbo cache)
pnpm dev --filter=<name>                # dev server for one app
pnpm test --filter=<package>            # vitest in scope
pnpm lint                               # biome check .
pnpm typecheck                          # tsc -b across workspace
pnpm changeset                          # add a release note for changed packages
pnpm doctor                             # health check
```

## Where things live

| Want to... | Look at |
|---|---|
| Understand the layer system | `standards/ARCHITECTURE.md`, `standards/adr/0003-*.md` |
| Find what tech is approved | `standards/STACK.md` |
| Add a new package | `templates/package/`, `docs/package-development.md` |
| Promote a Layer 2 capability | `docs/layer-promotion.md` |
| Configure AI agents | `ai/agents/claude-code/AGENTS.md`, `standards/AGENTS.md` |
| Tweak CI | `.github/workflows/` |

## Troubleshooting

- `pnpm install` fails on peer warnings → run again; first install resolves transitive peers.
- Turbo cache stale → `pnpm clean && pnpm install`.
- Biome screaming → `pnpm lint:fix` to auto-fix what it can.
