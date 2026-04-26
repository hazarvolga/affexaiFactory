# @affex/design-tokens

Layer: **ACTIVE_NOW** (promoted via ADR 0005)

Design tokens (Tailwind preset + CSS variables) that encode `standards/DESIGN.md`. Pair package with `@affex/ui-kit` — promoted together so the system is provably in use on day one.

## Use

In a Next.js / React app:

```bash
pnpm add @affex/design-tokens tailwindcss postcss autoprefixer
```

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import preset from '@affex/design-tokens/tailwind-preset';

export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui-kit/src/**/*.{ts,tsx}'],
} satisfies Config;
```

```ts
// app/globals.css
@import '@affex/design-tokens/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Tokens are then available as Tailwind classes:

```tsx
<div className="bg-canvas text-primary border border-border rounded-md p-4">
  <h2 className="text-2xl font-semibold">Title</h2>
  <p className="text-secondary">Body</p>
  <button className="bg-accent text-accent-fg rounded-base px-3 py-2">Action</button>
</div>
```

## Theme switching

Set `data-theme="dark"` on `<html>` to override. Without an explicit theme, the system honours `prefers-color-scheme`.

## What's exported

| Export | Purpose |
|---|---|
| `tailwindPreset` (default of `/tailwind-preset`) | Tailwind preset extending color, font, spacing, radius, motion |
| `colors`, `typography`, `spacing`, `radius`, `motion` | Raw token JS objects (use in CSS-in-JS or component logic) |
| `/tokens.css` | CSS variable definitions for `:root` + `[data-theme="dark"]` |

## Don't

- Don't override token values per product. Brand color goes via `--accent-default` only.
- Don't add a Tailwind plugin here unless every product needs it; plugins belong in the product's own config.
- Don't ship runtime JS from this package beyond the preset itself — tokens are configuration, not behavior.
