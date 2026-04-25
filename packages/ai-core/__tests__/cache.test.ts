import { describe, expect, it } from 'vitest';
import { LRUCache, withRetry } from '../src/index.js';

describe('LRUCache', () => {
  it('returns undefined for missing keys', () => {
    const c = new LRUCache<string, number>(2);
    expect(c.get('x')).toBeUndefined();
  });

  it('evicts the least-recently-used entry when full', () => {
    const c = new LRUCache<string, number>(2);
    c.set('a', 1);
    c.set('b', 2);
    c.get('a');
    c.set('c', 3);
    expect(c.has('a')).toBe(true);
    expect(c.has('b')).toBe(false);
    expect(c.has('c')).toBe(true);
  });

  it('updates existing keys without changing size', () => {
    const c = new LRUCache<string, number>(2);
    c.set('a', 1);
    c.set('a', 2);
    expect(c.size).toBe(1);
    expect(c.get('a')).toBe(2);
  });
});

describe('withRetry', () => {
  it('returns on first success', async () => {
    const result = await withRetry(async () => 'ok');
    expect(result).toBe('ok');
  });

  it('retries on retryable errors and eventually succeeds', async () => {
    let n = 0;
    const result = await withRetry(
      async () => {
        n++;
        if (n < 2) throw new Error('timeout');
        return 'ok';
      },
      { attempts: 3, baseMs: 1 },
    );
    expect(result).toBe('ok');
    expect(n).toBe(2);
  });

  it('throws after exhausting attempts', async () => {
    let n = 0;
    await expect(
      withRetry(
        async () => {
          n++;
          throw new Error('timeout');
        },
        { attempts: 2, baseMs: 1 },
      ),
    ).rejects.toThrow();
    expect(n).toBe(2);
  });

  it('does not retry non-retryable errors', async () => {
    let n = 0;
    await expect(
      withRetry(
        async () => {
          n++;
          throw new Error('bad request');
        },
        { attempts: 3, baseMs: 1, shouldRetry: () => false },
      ),
    ).rejects.toThrow();
    expect(n).toBe(1);
  });
});
