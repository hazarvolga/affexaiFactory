import { AppError } from '@affex/shared-types';
import { SignJWT, errors as joseErrors, jwtVerify } from 'jose';

export interface JwtClaims {
  sub: string;
  email?: string;
  scope?: string[];
  [key: string]: unknown;
}

export interface SignOptions {
  secret: string;
  expiresIn?: string | number;
  issuer?: string;
  audience?: string;
}

export interface VerifyOptions {
  secret: string;
  issuer?: string;
  audience?: string;
}

export async function signJwt(claims: JwtClaims, opts: SignOptions): Promise<string> {
  const key = new TextEncoder().encode(opts.secret);
  const builder = new SignJWT({ ...claims })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setSubject(claims.sub);

  if (opts.expiresIn !== undefined) builder.setExpirationTime(opts.expiresIn);
  if (opts.issuer) builder.setIssuer(opts.issuer);
  if (opts.audience) builder.setAudience(opts.audience);

  return builder.sign(key);
}

export async function verifyJwt(token: string, opts: VerifyOptions): Promise<JwtClaims> {
  const key = new TextEncoder().encode(opts.secret);
  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: opts.issuer,
      audience: opts.audience,
    });
    if (!payload.sub) throw new AppError('UNAUTHENTICATED', 'jwt missing subject');
    return payload as unknown as JwtClaims;
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      throw new AppError('UNAUTHENTICATED', 'jwt expired');
    }
    if (err instanceof AppError) throw err;
    throw new AppError('UNAUTHENTICATED', 'jwt invalid');
  }
}
