import { AppError } from '@affex/shared-types';
import { describe, expect, it } from 'vitest';
import { getUserFromRequest, signJwt, verifyJwt } from '../src/index.js';

const SECRET = 'test-secret-at-least-32-characters-long';

describe('signJwt + verifyJwt', () => {
  it('round-trips claims', async () => {
    const token = await signJwt(
      { sub: 'user-123', email: 'a@b.com', scope: ['read'] },
      { secret: SECRET, issuer: 'affex', expiresIn: '1h' },
    );
    const claims = await verifyJwt(token, { secret: SECRET, issuer: 'affex' });
    expect(claims.sub).toBe('user-123');
    expect(claims.email).toBe('a@b.com');
    expect(claims.scope).toEqual(['read']);
  });

  it('throws on tampered signature', async () => {
    const token = await signJwt({ sub: 'u' }, { secret: SECRET, expiresIn: '1h' });
    const tampered = `${token.slice(0, -2)}aa`;
    await expect(verifyJwt(tampered, { secret: SECRET })).rejects.toThrow(AppError);
  });

  it('throws on wrong issuer', async () => {
    const token = await signJwt({ sub: 'u' }, { secret: SECRET, issuer: 'a', expiresIn: '1h' });
    await expect(verifyJwt(token, { secret: SECRET, issuer: 'b' })).rejects.toThrow();
  });
});

describe('getUserFromRequest', () => {
  it('extracts user from a valid bearer token via plain object headers', async () => {
    const token = await signJwt(
      { sub: 'u-7', email: 'x@y.com', scope: ['admin'] },
      { secret: SECRET, expiresIn: '1h' },
    );
    const user = await getUserFromRequest(
      { headers: { authorization: `Bearer ${token}` } },
      {
        secret: SECRET,
      },
    );
    expect(user?.id).toBe('u-7');
    expect(user?.scope).toEqual(['admin']);
  });

  it('returns null when header is missing', async () => {
    const user = await getUserFromRequest({ headers: {} }, { secret: SECRET });
    expect(user).toBeNull();
  });

  it('returns null when token is invalid', async () => {
    const user = await getUserFromRequest(
      { headers: { authorization: 'Bearer not-a-real-jwt' } },
      { secret: SECRET },
    );
    expect(user).toBeNull();
  });

  it('reads from a Headers-like object too', async () => {
    const token = await signJwt({ sub: 'u-9' }, { secret: SECRET, expiresIn: '1h' });
    const headers = new Map([['authorization', `Bearer ${token}`]]);
    const user = await getUserFromRequest(
      { headers: { get: (n: string) => headers.get(n.toLowerCase()) ?? null } },
      { secret: SECRET },
    );
    expect(user?.id).toBe('u-9');
  });
});
