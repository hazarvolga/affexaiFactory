import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../src/index.js';

describe('hashPassword + verifyPassword', () => {
  it('hashes a password and verifies the same plaintext', async () => {
    const hashed = await hashPassword('correct-horse-battery-staple');
    expect(hashed).toMatch(/^\$argon2/);
    expect(await verifyPassword('correct-horse-battery-staple', hashed)).toBe(true);
  });

  it('rejects a wrong plaintext', async () => {
    const hashed = await hashPassword('correct-horse-battery-staple');
    expect(await verifyPassword('wrong-password', hashed)).toBe(false);
  });

  it('refuses passwords shorter than 8 characters', async () => {
    await expect(hashPassword('short')).rejects.toThrow(/at least 8/);
  });

  it('returns false on empty inputs', async () => {
    expect(await verifyPassword('', 'whatever')).toBe(false);
    expect(await verifyPassword('whatever', '')).toBe(false);
  });
});
