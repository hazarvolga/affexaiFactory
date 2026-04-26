import { type JwtClaims, verifyJwt } from './jwt.js';

export interface SessionUser {
  id: string;
  email?: string;
  scope: string[];
}

export interface RequestLike {
  headers: { get(name: string): string | null } | Record<string, string | undefined>;
}

function readAuthHeader(req: RequestLike): string | null {
  const h = req.headers;
  if (typeof (h as { get?: unknown }).get === 'function') {
    return (h as { get(n: string): string | null }).get('authorization');
  }
  const rec = h as Record<string, string | undefined>;
  return rec.authorization ?? rec.Authorization ?? null;
}

export async function getUserFromRequest(
  req: RequestLike,
  opts: { secret: string; issuer?: string; audience?: string },
): Promise<SessionUser | null> {
  const header = readAuthHeader(req);
  if (!header || !header.toLowerCase().startsWith('bearer ')) return null;
  const token = header.slice(7).trim();
  if (!token) return null;
  try {
    const claims: JwtClaims = await verifyJwt(token, opts);
    return {
      id: claims.sub,
      email: typeof claims.email === 'string' ? claims.email : undefined,
      scope: Array.isArray(claims.scope) ? claims.scope : [],
    };
  } catch {
    return null;
  }
}
