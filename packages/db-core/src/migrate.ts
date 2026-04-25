import { spawn } from 'node:child_process';
import { type Logger, createLogger } from '@affex/observability-core';

export interface MigrationOptions {
  databaseUrl: string;
  schemaPath?: string;
  logger?: Logger;
}

export async function runMigrations(opts: MigrationOptions): Promise<void> {
  const log = opts.logger ?? createLogger({ service: 'db-core:migrate' });
  const args = ['prisma', 'migrate', 'deploy'];
  if (opts.schemaPath) args.push('--schema', opts.schemaPath);

  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', args, {
      env: { ...process.env, DATABASE_URL: opts.databaseUrl },
      stdio: 'inherit',
    });

    child.on('error', (err) => {
      log.error({ err }, 'failed to spawn prisma migrate');
      reject(err);
    });
    child.on('exit', (code) => {
      if (code === 0) {
        log.info('migrations applied');
        resolve();
      } else {
        reject(new Error(`prisma migrate deploy exited with code ${code}`));
      }
    });
  });
}
