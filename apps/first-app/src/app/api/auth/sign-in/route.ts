import { hashPassword, signJwt, verifyPassword } from '@affex/auth-core';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@affex.dev',
};

let cachedHash: string | null = null;

async function demoHash(): Promise<string> {
  if (!cachedHash) cachedHash = await hashPassword('demo-password-123');
  return cachedHash;
}

export async function POST(req: Request) {
  const body = SignInSchema.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ ok: false, message: 'invalid input' }, { status: 400 });
  }

  const ok =
    body.data.email === DEMO_USER.email &&
    (await verifyPassword(body.data.password, await demoHash()));
  if (!ok) {
    return NextResponse.json({ ok: false, message: 'invalid credentials' }, { status: 401 });
  }

  const secret = process.env.AUTH_SECRET ?? 'dev-secret-do-not-use-in-prod-32chars';
  const token = await signJwt(
    { sub: DEMO_USER.id, email: DEMO_USER.email, scope: ['user'] },
    { secret, issuer: 'affex-starter-next', expiresIn: '1h' },
  );

  return NextResponse.json({ ok: true, token });
}
