# ADR 0005: Promote @affex/ui-kit + @affex/design-tokens to ACTIVE_NOW

- Status: Accepted
- Date: 2026-04-26

## Context

Promoting `@affex/auth-core` (ADR 0004) introduces the first non-trivial UI surface — a login page. We could ship inline JSX in `_starter-next`, but every future product will need the same primitives (Button, Input, Form, Label). One copy-paste of a login form is the moment to extract.

Per design philosophy in `standards/DESIGN.md`, products share visual language. That language must live in code, not in a Figma file we never sync.

`@affex/design-tokens` and `@affex/ui-kit` were both `OPTIONAL_LATER`. They activate together: tokens have no consumer without ui-kit, and ui-kit's restraint makes no sense without tokens.

## Decision

Promote both `@affex/design-tokens` and `@affex/ui-kit` from `OPTIONAL_LATER` to `ACTIVE_NOW`. They ship as a pair.

| Concern | Choice |
|---|---|
| Styling engine | **Tailwind CSS 3.4** (already approved as L2 in STACK.md) |
| Token shape | CSS variables + Tailwind preset (light + dark) |
| Component library base | **shadcn/ui pattern** — copied source, not npm dep |
| Primitive layer | **Radix UI** (`@radix-ui/react-*`) for unstyled accessible primitives |
| Class merging | `clsx` + `tailwind-merge` |
| Variant system | `class-variance-authority` (cva) |
| Icons | `lucide-react` |
| Test renderer | `vitest` + `happy-dom` + `@testing-library/react` |

## What ships in v0.1

`@affex/design-tokens`:
- Tailwind preset exporting tokens from `DESIGN.md` (color, type, spacing, radius)
- CSS variable layer (`tokens.css`) — light + dark modes via `data-theme`
- Font config (Geist Sans, Geist Mono recommended) — actual fonts loaded by consumer

`@affex/ui-kit`:
- `Button` (variants: default, secondary, ghost, destructive; sizes: sm, md, lg)
- `Input`, `Label`, `Textarea`
- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Form` helpers (controlled-only, integrates with React Hook Form via consumer)
- `cn()` utility (`clsx + twMerge`)
- All primitives are server-component-safe; `'use client'` opt-in per file when needed

## What is NOT in this promotion

- `DataTable`, `Combobox`, `DatePicker`, `Toast` — added when first consumer needs them
- Storybook — defer until ≥10 components warrant a docs site
- Visual regression testing — Layer 3
- Theme switcher UI component — light/dark variable layer is enough until a product asks

## Layer impact

| Item | Before | After |
|---|---|---|
| `@affex/design-tokens` | OPTIONAL_LATER | ACTIVE_NOW |
| `@affex/ui-kit` | OPTIONAL_LATER | ACTIVE_NOW |
| Tailwind 3.4 | OPTIONAL_LATER | ACTIVE_NOW (peer of design-tokens + ui-kit) |
| shadcn/ui + radix | OPTIONAL_LATER | ACTIVE_NOW (vendored into ui-kit) |

## Why pair-promote

Splitting them creates a dead state — design-tokens with no consumer is just a JSON file nobody touches. Promoting together forces them to be co-designed and proves the wiring on day one.

## Rollback

If the kit's primitive set proves wrong-shape:
- Demote both back to OPTIONAL_LATER
- Inline Tailwind classes in `_starter-next` directly
- Document the failure mode

Token layer is cheap to keep even if ui-kit changes shape — tokens are JSON, ui-kit is JSX.

## Consequences

- `_starter-next` adopts the Tailwind preset + uses ui-kit primitives on the new `/login` page.
- `_starter-next/package.json` gains Tailwind devDeps + postcss.
- Generator picker no longer marks `ui-kit` as needs-promotion.
- `DESIGN.md` is now machine-encoded (preset) — drift between doc and code becomes a doctor-detectable concern (future doctor check).
