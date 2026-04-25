import { AppError } from '@affex/shared-types';
import { describe, expect, it } from 'vitest';
import { createLogger, isAppError, serializeError, wrapError } from '../src/index.js';

describe('createLogger', () => {
  it('returns a usable pino instance with service name', () => {
    const log = createLogger({ service: 'test-svc', level: 'info' });
    expect(log).toBeDefined();
    expect(typeof log.info).toBe('function');
    expect(log.bindings().service).toBe('test-svc');
  });
});

describe('error helpers', () => {
  it('wraps a plain Error into an AppError', () => {
    const wrapped = wrapError(new Error('boom'), 'UPSTREAM_ERROR');
    expect(isAppError(wrapped)).toBe(true);
    expect(wrapped.code).toBe('UPSTREAM_ERROR');
    expect(wrapped.message).toBe('boom');
  });

  it('does not double-wrap an AppError', () => {
    const original = new AppError('NOT_FOUND', 'missing');
    expect(wrapError(original)).toBe(original);
  });

  it('serializes AppError shape', () => {
    const out = serializeError(new AppError('CONFLICT', 'taken', { key: 'email' }));
    expect(out.type).toBe('AppError');
    expect(out.code).toBe('CONFLICT');
    expect(out.details).toEqual({ key: 'email' });
  });
});
