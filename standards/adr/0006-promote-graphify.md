# ADR 0006: Promote Graphify to ACTIVE_NOW (codebase X-ray for devs + agents)

- Status: Accepted
- Date: 2026-04-26

## Context

The repo will keep growing. Even at 16 packages today the founder + future contributors + AI coding agents need a way to "X-ray" the codebase quickly — answer architectural questions, find ownership of a concept, surface non-obvious connections — without reading every file.

Graphify (`safishamsi/graphify`) is a Python-based Claude Code skill that:
- Parses the repo with tree-sitter, extracts entities + relationships into a NetworkX graph.
- Clusters with Leiden, surfaces "god nodes" and surprising connections.
- Exposes the graph via CLI, MCP stdio server, and an agent-navigable wiki.
- Claims ~71× token compression for large-corpus queries vs. raw file reads.
- Runs entirely locally — no external LLMs, no servers, no databases.

It was `OPTIONAL_LATER` per ADR 0003. The trigger is now: founder wants devs and agents to introspect the project from day one so the cost of growth stays bounded.

## Decision

Promote Graphify from `OPTIONAL_LATER` to `ACTIVE_NOW`.

| Concern | Choice |
|---|---|
| Distribution | per-user install (`pip install graphifyy && graphify install` → `~/.claude/skills/graphify/`) |
| Project-wide MCP | `.mcp.json` at repo root, committed; `graphify --mcp` stdio server |
| Output location | `ai/agents/claude-code/graph/` — gitignored (graphs are ephemeral, regenerated on demand) |
| Cadence | manual `/graphify .` after major architectural changes; `--watch` mode optional during deep work |
| Quotas / cost | none — Graphify is local-only |

## What ships in this promotion

- `standards/adr/0006-promote-graphify.md` (this file)
- `standards/STACK.md` — flip Graphify → ACTIVE_NOW
- `ai/agents/claude-code/graphify.md` — runbook (install + first-time + daily use + when not to use)
- `.mcp.json` at repo root — shared MCP config so any MCP-aware tool in this workspace can query the graph
- `.gitignore` — exclude `ai/agents/claude-code/graph/`

## What is NOT in this promotion

- No `tools/graphify-runner` workspace package. Graphify is a per-developer dev-time tool, not a runtime / build-time dependency. Wrapping it in a workspace package would be premature ceremony.
- No CI integration. Graph generation is interactive and per-developer, not CI material.
- No automatic regeneration on git hooks. Graphs go stale gracefully — better than blocking commits.
- Not added to the `pnpm create @affex/app` generator. New apps don't need their own graph; the workspace graph covers everything.

## Layer impact

| Item | Before | After |
|---|---|---|
| Graphify | OPTIONAL_LATER | ACTIVE_NOW |
| `.mcp.json` (repo-root MCP config) | not present | committed, contains graphify entry |

## Why now

A repo with two reference apps + 9 packages + first product can already use the X-ray. Setting it up early means:
- The graph grows incrementally with the codebase (cache is SHA256-keyed, incremental).
- Onboarding a contributor / spinning up a new agent session can lean on it from session 1.
- Documentation drift becomes detectable (god nodes that nobody owns).

Doing it later means re-discovering the same insight in a worse repo state.

## Why per-user install (not vendored)

- Graphify is Python; vendoring would add a Python toolchain to a TypeScript-first repo.
- Skill files live in `~/.claude/skills/graphify/` — a user-global concept Claude Code already manages.
- Each developer runs `pip install graphifyy && graphify install` once on setup. Documented in the runbook.

## Trade-offs

- **Python prerequisite** — every contributor needs Python 3 + pip available. Acceptable today (solo); minor friction for future contributors.
- **MCP config in `.mcp.json`** — Claude Code reads this on session start. Other MCP-aware tools (Cursor, Cline) also use it. If a contributor doesn't want graphify, they can ignore `/graphify` commands; the MCP server only spawns when invoked.

## Rollback

- Revert STACK.md flip.
- Delete `.mcp.json` graphify entry (or whole file if no other MCP servers).
- Keep ADR for history; mark as "Superseded by ADR-NNNN" if reverted.
- `pip uninstall graphifyy && rm -rf ~/.claude/skills/graphify` per-user.

No code in `apps/`, `packages/`, or `tools/` depends on Graphify, so rollback is contained.

## Consequences

- New first-time setup step for contributors: `pip install graphifyy && graphify install`. Listed in `docs/getting-started.md` (follow-up update).
- Generated graph files at `ai/agents/claude-code/graph/` — never commit; `.gitignore` enforces this.
- AI agents in this repo gain a structured knowledge surface beyond raw file reads.
