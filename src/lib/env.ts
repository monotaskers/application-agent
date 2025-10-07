/**
 * Environment variable validation using Zod
 *
 * @fileoverview Validates and provides type-safe access to environment variables.
 * Follows the Fail Fast principle - validates at application startup.
 *
 * @module lib/env
 */

import { z } from 'zod';

/**
 * Environment variable schema
 *
 * All required environment variables must be defined here with appropriate validation.
 * The schema is parsed at module initialization to fail fast if configuration is invalid.
 */
export const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Database configuration
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (url) => url.startsWith('postgres://') || url.startsWith('postgresql://'),
      {
        message: 'DATABASE_URL must be a valid PostgreSQL connection string (postgres:// or postgresql://)',
      }
    ),
});

/**
 * Validated and type-safe environment variables
 *
 * @throws {z.ZodError} If environment variables fail validation
 *
 * @example
 * ```ts
 * import { env } from '@/lib/env';
 *
 * // Type-safe access to validated env vars
 * const dbUrl = env.DATABASE_URL;
 * ```
 */
export const env = envSchema.parse(process.env);

/**
 * Type of validated environment variables
 */
export type Env = z.infer<typeof envSchema>;
