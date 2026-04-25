# experimental/

Sandbox for spikes and prototypes.

## Rules

- **No-depend rule:** Nothing in `apps/`, `packages/`, `tools/`, or `templates/` may import from `experimental/`.
- `tools/doctor` enforces this. Any cross-boundary import will fail CI.
- This directory is `.gitignore`d (except this README). Commit experiments only when explicitly promoting.

## Promotion

When an experiment proves itself:

1. Write an ADR in `standards/adr/` describing the promotion.
2. Move the code into `packages/<name>/` or `apps/<name>/` with a proper package.json.
3. Tag it with the appropriate layer status (ACTIVE_NOW / OPTIONAL_LATER / SCALE_STAGE) in `standards/STACK.md`.
4. Run `pnpm doctor` to confirm boundary checks pass.
