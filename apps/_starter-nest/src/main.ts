import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { createLogger } from '@affex/observability-core';
import { BaseEnvSchema, parseEnv } from '@affex/shared-types';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const env = parseEnv(BaseEnvSchema);
  const log = createLogger({
    service: 'starter-nest',
    level: env.LOG_LEVEL,
    pretty: env.NODE_ENV !== 'production',
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: false,
  });

  const port = env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  log.info({ port, env: env.NODE_ENV }, 'starter-nest listening');
}

bootstrap().catch((err) => {
  console.error('bootstrap failed', err);
  process.exit(1);
});
