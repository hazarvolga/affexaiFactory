import { pino, type Logger as PinoLogger, type LoggerOptions as PinoLoggerOptions } from 'pino';
import type { LogLevel } from '@affex/shared-types';

export type Logger = PinoLogger;

export interface LoggerOptions {
  service: string;
  level?: LogLevel;
  pretty?: boolean;
  base?: Record<string, unknown>;
}

export function createLogger(opts: LoggerOptions): Logger {
  const { service, level = 'info', pretty = false, base = {} } = opts;

  const pinoOptions: PinoLoggerOptions = {
    name: service,
    level,
    base: { service, ...base },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token', '*.secret'],
      remove: true,
    },
  };

  if (pretty) {
    return pino({
      ...pinoOptions,
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:HH:MM:ss.l' },
      },
    });
  }

  return pino(pinoOptions);
}
