# ai/

AI engineering surface for `affexaiFactory`.

```
ai/
├── agents/
│   ├── claude-code/        # Claude Code config + skills
│   ├── aider/              # OPTIONAL_LATER
│   └── openhands/          # SCALE_STAGE
├── prompts/
│   ├── coding/             # plan, implement, review (Layer 1)
│   ├── product/            # OPTIONAL_LATER
│   └── ops/                # OPTIONAL_LATER
├── workflows/              # OPTIONAL_LATER (LangGraph)
├── tests/                  # OPTIONAL_LATER (Promptfoo)
├── memory/                 # OPTIONAL_LATER
└── observability/          # OPTIONAL_LATER (Langfuse self-host)
```

Layer 1 ships nothing fancy: a few prompt files and a `claude-code/AGENTS.md`. External services (Aider, OpenHands, Langfuse, Promptfoo, LangGraph, Graphify) are documented in `standards/STACK.md` as `OPTIONAL_LATER` / `SCALE_STAGE` and activated when there's a real consumer.

## Versioning prompts

Each prompt file is plain Markdown. When a prompt changes meaningfully:
- Bump the file via filename (e.g. `plan.md` → `plan-v2.md`) only if the change is breaking for downstream tooling.
- Otherwise edit in place. The git history is the version log.

When `Promptfoo` (Layer 2) is activated, regression configs go in `ai/tests/promptfooconfig.yaml` and they pin specific prompt versions.

## Adding a new prompt

1. Choose the right group (`coding/`, `product/`, `ops/`).
2. Use a single-purpose file, named after the verb or scenario.
3. Keep it short. If the prompt requires reading 5 docs, those reads belong in the agent's session start, not the prompt body.
