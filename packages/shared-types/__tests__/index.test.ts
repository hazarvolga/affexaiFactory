import { describe, expect, it } from 'vitest';
import {
  AppError,
  BaseEnvSchema,
  EmailSchema,
  PaginationQuerySchema,
  SlugSchema,
  parseEnv,
} from '../src/index.js';

describe('common schemas', () => {
  it('accepts valid email and lowercases it', () => {
    expect(EmailSchema.parse('Foo@Bar.com')).toBe('foo@bar.com');
  });

  it('rejects non-kebab slug', () => {
    expect(() => SlugSchema.parse('Bad_Slug')).toThrow();
    expect(SlugSchema.parse('good-slug')).toBe('good-slug');
  });
});

describe('env helper', () => {
  it('applies defaults', () => {
    const env = parseEnv(BaseEnvSchema, {});
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
  });

  it('throws with detailed message on invalid input', () => {
    expect(() => parseEnv(BaseEnvSchema, { PORT: 'not-a-number' })).toThrow(/PORT/);
  });
});

describe('pagination', () => {
  it('coerces and clamps limit', () => {
    const q = PaginationQuerySchema.parse({ limit: '50' });
    expect(q.limit).toBe(50);
    expect(() => PaginationQuerySchema.parse({ limit: 9999 })).toThrow();
  });
});

describe('AppError', () => {
  it('serializes to ApiError', () => {
    const err = new AppError('NOT_FOUND', 'no such thing', { id: '123' });
    expect(err.toJSON()).toEqual({
      code: 'NOT_FOUND',
      message: 'no such thing',
      details: { id: '123' },
    });
  });
});
