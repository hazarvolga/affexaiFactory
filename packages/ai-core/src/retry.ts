export interface RetryOptions {
  attempts?: number;
  baseMs?: number;
  factor?: number;
  maxMs?: number;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
}

const defaultShouldRetry = (err: unknown): boolean => {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes('429') || msg.includes('timeout') || msg.includes('network') || msg.includes('5')
    );
  }
  return false;
};

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const attempts = opts.attempts ?? 3;
  const baseMs = opts.baseMs ?? 250;
  const factor = opts.factor ?? 2;
  const maxMs = opts.maxMs ?? 8000;
  const shouldRetry = opts.shouldRetry ?? defaultShouldRetry;

  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === attempts || !shouldRetry(err, attempt)) throw err;
      const delay = Math.min(baseMs * factor ** (attempt - 1), maxMs);
      const jitter = Math.random() * delay * 0.2;
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }
  throw lastError;
}
