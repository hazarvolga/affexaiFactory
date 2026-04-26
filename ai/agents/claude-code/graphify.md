# Graphify runbook

What it is: Python-based Claude Code skill that builds a NetworkX knowledge graph of this repo (code + docs + PDFs + images), then lets you query it via CLI, MCP, or generated wiki. Local-only — no external services.

Why it's here (Layer 2 → ACTIVE_NOW): see `standards/adr/0006-promote-graphify.md`.

## First-time setup (every developer, once)

Prerequisites: Python 3.10+, pip.

```bash
pip install graphifyy
graphify install                 # installs the skill into ~/.claude/skills/graphify/
```

Verify:

```bash
which graphify
graphify --version
```

That's it. The MCP entry in `.mcp.json` at the repo root is automatically picked up by Claude Code on next session start.

## Daily use

### Build the graph

```bash
# from repo root
mkdir -p ai/agents/claude-code/graph
cd ai/agents/claude-code/graph
graphify ../../../.. --update    # incremental; first run builds full graph (~minutes)
```

Or from inside Claude Code:

```
/graphify .
/graphify . --mode deep
/graphify . --update
```

Outputs land in the current dir:
- `graph.html` — interactive visualization (open in a browser)
- `graph.json` — persistent knowledge graph
- `GRAPH_REPORT.md` — god nodes, surprising connections
- Optional Obsidian / wiki dirs

`ai/agents/claude-code/graph/` is gitignored. Never commit graph artifacts.

### Query the graph

```bash
graphify query "how does auth-core verify JWTs?"
graphify query "what packages depend on shared-types?"
graphify path "@affex/auth-core" "@affex/shared-types"
```

Or in a Claude Code session:

```
/graphify query "what does the doctor enforce?"
/graphify path "create-app" "shared-types"
```

The MCP server (`graphify --mcp`, wired in `.mcp.json`) lets Claude Code consult the graph automatically when it needs cross-file context — without you running explicit query commands.

### Watch mode (deep work)

```bash
cd ai/agents/claude-code/graph
graphify ../../../.. --watch     # keeps graph in sync as files change
```

Useful during large refactors. Stop with Ctrl-C.

### Wiki output

```bash
graphify ../../../.. --wiki
# generates Wikipedia-style articles in ./wiki/
```

Useful for onboarding write-ups.

## When to use it

- Onboarding a contributor or a new agent session — point them at the wiki + `GRAPH_REPORT.md`.
- Before a non-trivial refactor — find blast radius via `graphify path A B` and god-node analysis.
- Investigating a bug that spans packages — query for cross-package usage.
- Answering "where is X used?" without grep gymnastics.

## When NOT to use it

- For a known-narrow change inside one file. Just edit it.
- As a CI gate. Graph generation is interactive, per-developer; failures don't matter for build correctness.
- As a substitute for tests, types, or `pnpm doctor`. Graphify augments understanding; it does not enforce contracts.

## Maintenance

- Cache (SHA256-keyed) is incremental. Re-run with `--update` is cheap.
- If the graph feels stale, delete `ai/agents/claude-code/graph/` and run a full build.
- Graphify upgrades: `pip install --upgrade graphifyy && graphify install`.

## Removing it

If Graphify ever stops earning its keep:

1. Open a demotion ADR (back to OPTIONAL_LATER).
2. Remove its entry from `.mcp.json` and `STACK.md`.
3. `pip uninstall graphifyy && rm -rf ~/.claude/skills/graphify`.
4. Delete `ai/agents/claude-code/graph/` and this runbook.
