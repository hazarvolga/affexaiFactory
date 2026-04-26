import { getUserFromRequest } from '@affex/auth-core';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const secret = process.env.AUTH_SECRET ?? 'dev-secret-do-not-use-in-prod-32chars';
  const user = await getUserFromRequest(req, { secret, issuer: 'affex-starter-next' });
  if (!user) {
    return NextResponse.json({ ok: false, message: 'unauthenticated' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user });
}
