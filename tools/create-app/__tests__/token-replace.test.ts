import { describe, expect, it } from 'vitest';

function tokenReplace(content: string, tokens: Record<string, string>): string {
  return Object.entries(tokens).reduce(
    (acc, [key, value]) => acc.replaceAll(`__${key}__`, value),
    content,
  );
}

describe('tokenReplace', () => {
  it('replaces single tokens', () => {
    expect(tokenReplace('hello __NAME__', { NAME: 'world' })).toBe('hello world');
  });

  it('replaces multiple tokens and is idempotent on missing ones', () => {
    expect(tokenReplace('__A__-__B__-__C__', { A: 'one', B: 'two' })).toBe('one-two-__C__');
  });

  it('replaces multiple occurrences', () => {
    expect(tokenReplace('__X__ and __X__', { X: 'foo' })).toBe('foo and foo');
  });
});
