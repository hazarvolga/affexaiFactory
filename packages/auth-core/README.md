# @affex/auth-core

Layer: **ACTIVE_NOW** (promoted via ADR 0004)

Auth primitives for the @affex monorepo. Three independent surfaces, no shared global state:

- **Password hashing** (`@affex/auth-core/password`) — argon2id wrappers
- **JWT** (`@affex/auth-core/jwt`) — sign + verify via `jose`
- **Session helper** (`@affex/auth-core`) — extract `SessionUser` from any HTTP request (NestJS, Next.js Route Handlers, raw Node)

`next-auth` v5 integration is a peer dependency — install only if your app uses Auth.js.

## Use — backend (NestJS / Fastify / Hono)

```ts
import { signJwt, getUserFromRequest } from '@affex/auth-core';

const token = await signJwt(
  { sub: 'user-123', email: 'a@b.com', scope: ['read'] },
  { secret: process.env.AUTH_SECRET!, issuer: 'affex', expiresIn: '1h' },
);

// In your guard / middleware:
const user = await getUserFromRequest(req, { secret: process.env.AUTH_SECRET!, issuer: 'affex' });
if (!user) throw new AppError('UNAUTHENTICATED', 'login required');
```

## Use — passwords

```ts
import { hashPassword, verifyPassword } from '@affex/auth-core/password';

const hash = await hashPassword(plainText);
// ...store hash...
const ok = await verifyPassword(plainText, hash);
```

`hashPassword` enforces a 8-character minimum at the function boundary. Stronger policy belongs in your validation layer.

## Use — Next.js (Auth.js v5)

```bash
pnpm add next-auth@5.0.0-beta.25
```

```ts
// src/auth.ts
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verifyPassword } from '@affex/auth-core/password';

const config: NextAuthConfig = {
  trustHost: true,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        // lookup user, then:
        const ok = await verifyPassword(creds!.password as string, user.passwordHash);
        return ok ? { id: user.id, email: user.email } : null;
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
```

```ts
// src/app/api/auth/[...nextauth]/route.ts
export { GET, POST } from '@/auth';
```

## What is NOT here (yet)

- Email magic link (needs `notification-core` first)
- Database session adapter (storage decision deferred)
- 2FA / passkeys (next promotion when first product asks)

## Don't

- Don't read `process.env` inside this package. Pass secrets as arguments. App owns config.
- Don't store the JWT secret in a constant. Always inject from env.
- Don't change argon2 parameters per call without a benchmark — defaults are tuned for ~100ms on a modern server.
