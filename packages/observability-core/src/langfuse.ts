export interface LangfuseHandle {
  flushAsync(): Promise<void>;
  shutdownAsync(): Promise<void>;
  trace(opts: { name: string; input?: unknown; metadata?: Record<string, unknown> }): {
    update(opts: { output?: unknown; metadata?: Record<string, unknown> }): void;
    end(): void;
  };
}

export interface LangfuseOptions {
  publicKey: string;
  secretKey: string;
  baseUrl?: string;
}

export function enableLangfuse(_opts: LangfuseOptions): LangfuseHandle {
  let mod: { Langfuse: new (o: LangfuseOptions) => unknown } | null = null;
  try {
    mod = require('langfuse') as typeof mod;
  } catch {
    throw new Error(
      "@affex/observability-core: enableLangfuse() requires the optional peer dependency 'langfuse'. Install it in the consuming app: pnpm add langfuse",
    );
  }

  const client = new mod.Langfuse(_opts) as {
    flushAsync(): Promise<void>;
    shutdownAsync(): Promise<void>;
    trace(o: { name: string; input?: unknown; metadata?: Record<string, unknown> }): {
      update(u: { output?: unknown; metadata?: Record<string, unknown> }): void;
      end(): void;
    };
  };

  return {
    flushAsync: () => client.flushAsync(),
    shutdownAsync: () => client.shutdownAsync(),
    trace: (opts) => client.trace(opts),
  };
}
