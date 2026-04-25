import { z } from 'zod';

export const IdSchema = z.string().min(1).max(64);
export type Id = z.infer<typeof IdSchema>;

export const SlugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be kebab-case');
export type Slug = z.infer<typeof SlugSchema>;

export const EmailSchema = z.string().email().toLowerCase();
export type Email = z.infer<typeof EmailSchema>;

export const TimestampSchema = z.coerce.date();
export type Timestamp = z.infer<typeof TimestampSchema>;

export const NonEmptyStringSchema = z.string().min(1);
export type NonEmptyString = z.infer<typeof NonEmptyStringSchema>;

export const UrlSchema = z.string().url();
export type Url = z.infer<typeof UrlSchema>;
