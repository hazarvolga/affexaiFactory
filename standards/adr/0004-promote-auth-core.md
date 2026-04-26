# ADR 0004: Promote @affex/auth-core to ACTIVE_NOW

- Status: Accepted
- Date: 2026-04-26
- Deciders: founder (solo)

## Context

The first authenticated app is being scaffolded. Per the layer rule, `@affex/auth-core` was `OPTIONAL_LATER` until a real consumer asked for it. That consumer now exists.

A solo founder cannot afford to re-implement auth per product. Even one consumer justifies the abstraction because every subsequent product (admin panel, internal tools, customer portal) will need the same primitives.

## Decision

Promote `@affex/auth-core` from `OPTIONAL_LATER` to `ACTIVE_NOW`.

| Concern | Choice |
|---|---|
| Web auth library | **Auth.js v5** (NextAuth 5) — App Router native, edge-compatible |
| Backend JWT | **jose** for verification (no node-jsonwebtoken dep) |
| Strategies (Layer 1 of this package) | Email/password (credentials) + GitHub OAuth |
| Session storage (Layer 1) | JWT (stateless); database sessions deferred until needed |
| Password hashing | `argon2` — modern, memory-hard |
| Per-product NestJS module | exported as `AffexAuthModule.forRoot({ ... })` |

## What ships in v0.1

- `createAuthHandlers({ providers, secret })` — Auth.js handler factory for Next.js App Router
- `verifyJwt(token, options)` — pure verification helper for any backend
- `hashPassword(plain) / verifyPassword(plain, hash)` — argon2 wrappers
- `AffexAuthModule` (NestJS) — DI module exporting `JwtAuthGuard` and `CurrentUser` decorator
- React hooks re-exported: `useSession`, `signIn`, `signOut`

## What is NOT in this promotion (deferred)

- Magic link email (needs `notification-core` first → Layer 2 still)
- Database session adapter (needs explicit storage decision)
- Multi-tenancy / org switching (out of scope; this repo is meta, not a SaaS)
- 2FA / passkeys (next promotion when first product asks)

## Layer impact

| Item | Before | After |
|---|---|---|
| `@affex/auth-core` | OPTIONAL_LATER | ACTIVE_NOW |
| Auth.js (`next-auth`) | not in STACK | ACTIVE_NOW (peer of auth-core) |
| `jose`, `argon2` | not in STACK | ACTIVE_NOW (deps of auth-core) |

## Why now / not later

The deciding consumer is the first app that needs login. Without the package, that app's auth code becomes a per-product copy-paste. Promoting now means consumer #2 is free.

## Rollback

If auth-core proves wrong-shape after the first real product:
- Revert STACK.md flips
- Demote package back to OPTIONAL_LATER
- Move usage out of `_starter-next` reference back to inline code
- Document failure in a follow-up ADR

## Consequences

- `_starter-next` gains a `/login` reference page using ui-kit + auth-core (proves wiring works).
- `_starter-nest` gains a guarded `/me` route as a JWT example.
- Doctor's layer-check will now allow ACTIVE_NOW consumers to depend on `@affex/auth-core`.
- `pnpm create @affex/app` generator still hides auth as opt-in feature, but no longer marks it as "Layer 2 — needs promotion".
