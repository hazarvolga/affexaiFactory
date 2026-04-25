import { createLogger, type Logger } from '@affex/observability-core';

export interface PrismaClientLike {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $on(event: string, listener: (...args: unknown[]) => void): void;
}

export interface CreatePrismaOptions {
  databaseUrl: string;
  service: string;
  logger?: Logger;
  logQueries?: boolean;
}

export function createPrisma(opts: CreatePrismaOptions): PrismaClientLike {
  let mod: { PrismaClient: new (cfg: unknown) => PrismaClientLike } | null = null;
  try {
    mod = require('@prisma/client') as typeof mod;
  } catch {
    throw new Error(
      "@affex/db-core: createPrisma() requires the optional peer dependency '@prisma/client'. Install it: pnpm add prisma @prisma/client && npx prisma generate",
    );
  }

  const log = opts.logger ?? createLogger({ service: `${opts.service}:db` });

  const client = new mod.PrismaClient({
    datasources: { db: { url: opts.databaseUrl } },
    log: opts.logQueries
      ? [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'event' },
          { level: 'warn', emit: 'event' },
        ]
      : [
          { level: 'error', emit: 'event' },
          { level: 'warn', emit: 'event' },
        ],
  });

  client.$on('error', (...args) => log.error({ args }, 'prisma error'));
  client.$on('warn', (...args) => log.warn({ args }, 'prisma warn'));
  if (opts.logQueries) {
    client.$on('query', (...args) => log.debug({ args }, 'prisma query'));
  }

  return client;
}
