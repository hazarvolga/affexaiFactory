import { AppError, type ErrorCode } from '@affex/shared-types';

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

export function wrapError(value: unknown, code: ErrorCode = 'INTERNAL_ERROR'): AppError {
  if (isAppError(value)) return value;
  if (value instanceof Error) {
    const wrapped = new AppError(code, value.message, { cause: value.name });
    wrapped.stack = value.stack;
    return wrapped;
  }
  return new AppError(code, typeof value === 'string' ? value : 'Unknown error');
}

export function serializeError(value: unknown): Record<string, unknown> {
  if (isAppError(value)) {
    return {
      type: 'AppError',
      code: value.code,
      message: value.message,
      details: value.details,
      stack: value.stack,
    };
  }
  if (value instanceof Error) {
    return {
      type: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return { type: 'Unknown', value };
}
