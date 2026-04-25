# DESIGN.md — Visual & UX language

This is the design contract every Layer 2 frontend must follow. When `@affex/ui-kit` and `@affex/design-tokens` are activated, they encode the rules below as code.

## Principles

1. **Restrained** — neutral palette, generous whitespace, content over chrome.
2. **Predictable** — same primitives across every product. A user from one app can navigate another blindfolded.
3. **Accessible by default** — WCAG 2.2 AA is the floor, not the ceiling.
4. **Performance is a feature** — every component must render under 16ms on a mid-tier laptop.

## Color (token names, values come with `@affex/design-tokens`)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `bg.canvas` | `#ffffff` | `#0a0a0a` | App background |
| `bg.surface` | `#fafafa` | `#141414` | Cards, sheets |
| `bg.subtle` | `#f4f4f5` | `#1c1c1f` | Hover, selected |
| `border.default` | `#e4e4e7` | `#27272a` | Dividers |
| `text.primary` | `#09090b` | `#fafafa` | Headlines |
| `text.secondary` | `#52525b` | `#a1a1aa` | Body |
| `text.muted` | `#71717a` | `#71717a` | Captions, hints |
| `accent.default` | `#0070f3` | `#3b82f6` | Primary actions, focus |
| `accent.fg` | `#ffffff` | `#ffffff` | Text on accent |
| `success` | `#16a34a` | `#22c55e` | Confirmations |
| `warning` | `#d97706` | `#f59e0b` | Warnings |
| `danger` | `#dc2626` | `#ef4444` | Destructive |

Brand color is **per-product** and overrides `accent.*` only.

## Typography

| Token | Value |
|---|---|
| Font sans | Geist Sans, system-ui, sans-serif |
| Font mono | Geist Mono, ui-monospace, monospace |
| Font display | Geist Sans (heavier weight) |
| Scale | 12 / 14 / 16 / 18 / 20 / 24 / 32 / 48 / 64 px |
| Weights | 400 (body), 500 (UI), 600 (heading), 700 (display) |
| Line-height | 1.5 body, 1.2 heading |

## Spacing

4px base unit. Use multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.

## Radius

| Use | Value |
|---|---|
| Buttons, inputs, tags | 6px |
| Cards, sheets | 8px |
| Modals | 12px |
| Avatars | 50% |

## Motion

- Duration: micro (100ms), normal (200ms), large (320ms).
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo) for entries; `cubic-bezier(0.4, 0, 1, 1)` (in-quad) for exits.
- Respect `prefers-reduced-motion`.

## Iconography

- Lucide icons. 16 / 20 / 24 px sizes. Stroke 1.5.
- Never embed brand logos in core components.

## Accessibility minimums

- Color contrast: 4.5:1 for body text, 3:1 for large text.
- Every interactive element has a visible focus ring (`outline: 2px solid accent.default; outline-offset: 2px`).
- Form inputs always have an associated `<label>`.
- `aria-live="polite"` for inline async feedback.
- Keyboard-navigable: every action reachable without a mouse.

## Component primitives (provided by `@affex/ui-kit` when activated)

`Button`, `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Radio`, `Switch`, `Toggle`, `Dialog`, `Sheet`, `Popover`, `Tooltip`, `Tabs`, `Accordion`, `Card`, `Badge`, `Avatar`, `Toast`, `DataTable`, `Form`, `Skeleton`, `Spinner`.

Out of scope for the kit: marketing components, charts, rich text editor (use product-level libs).

## Layout

- Max content width: 1280px.
- Grid: 12 columns at ≥768px, 4 columns below.
- Sidebar: 240px fixed; collapses to 0 below 768px.

## When to break the rules

You don't. If a product needs something the system can't express, propose an addition to `@affex/ui-kit` via ADR. Don't fork tokens locally.
