import { z } from 'zod';

export const NodeEnvSchema = z.enum(['development', 'test', 'production']);
export type NodeEnv = z.infer<typeof NodeEnvSchema>;

export const LogLevelSchema = z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']);
export type LogLevel = z.infer<typeof LogLevelSchema>;

export const BaseEnvSchema = z.object({
  NODE_ENV: NodeEnvSchema.default('development'),
  LOG_LEVEL: LogLevelSchema.default('info'),
  PORT: z.coerce.number().int().positive().default(3000),
});
export type BaseEnv = z.infer<typeof BaseEnvSchema>;

export function parseEnv<T extends z.ZodTypeAny>(schema: T, source: NodeJS.ProcessEnv = process.env): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return result.data;
}
