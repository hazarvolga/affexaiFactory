# @affex/ui-kit

Layer: **ACTIVE_NOW** (promoted via ADR 0005, paired with `@affex/design-tokens`)

React component primitives following the shadcn/ui pattern (vendored sources, not npm), built on Radix UI for accessibility. Consumes `@affex/design-tokens` for visual language.

## Use

```bash
pnpm add @affex/ui-kit @affex/design-tokens tailwindcss
```

Wire Tailwind to consume both your app source AND the kit's source:

```ts
// tailwind.config.ts
import preset from '@affex/design-tokens/tailwind-preset';

export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui-kit/src/**/*.{ts,tsx}',
  ],
};
```

```tsx
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from '@affex/ui-kit';

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <Button type="submit">Continue</Button>
      </CardContent>
    </Card>
  );
}
```

## What's in v0.1

| Component | Variants / notes |
|---|---|
| `Button` | `default | secondary | ghost | destructive | link` × `sm | md | lg | icon`; `asChild` for slot pattern |
| `Input` | unstyled-by-spec, focus ring on `accent` |
| `Label` | Radix-backed, peer-aware disabled style |
| `Card` + sub-parts | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `cn()` | `clsx` + `tailwind-merge` |

Server-component-safe; `Button`, `Input`, `Label` opt into `'use client'` per file because they manage refs / interactivity.

## Adding a component

- One file per public component under `src/components/<name>.tsx`.
- Export from `src/index.ts`.
- Co-locate test as `__tests__/<name>.test.tsx` (vitest + happy-dom + Testing Library).
- Style via Tailwind classes only — no inline `style={{}}`, no styled-components.
- For variants use `class-variance-authority`. For polymorphic root use `@radix-ui/react-slot`.
- If a component needs heavier Radix primitives (Dialog, Popover), add them as `dependencies` in `package.json`.

## Don't

- Don't add Storybook here — defer until ≥10 components warrant it (see ADR 0005).
- Don't ship app-specific composites (e.g. `LoginForm`). Composites live in the consumer; the kit ships primitives only.
- Don't accept hex colors as props — every color goes through the token preset.
