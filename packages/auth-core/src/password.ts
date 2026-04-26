import { hash, verify } from '@node-rs/argon2';

export interface PasswordOptions {
  memoryCost?: number;
  timeCost?: number;
  parallelism?: number;
}

const defaults = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string, opts: PasswordOptions = {}): Promise<string> {
  if (!plain || plain.length < 8) {
    throw new Error('hashPassword: input must be at least 8 characters');
  }
  return hash(plain, { ...defaults, ...opts });
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  if (!plain || !hashed) return false;
  try {
    return await verify(hashed, plain);
  } catch {
    return false;
  }
}
