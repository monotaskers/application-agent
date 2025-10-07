/**
 * Database client singleton
 *
 * @fileoverview Exports the Drizzle database client for use across the application.
 * Uses lazy initialization pattern for optimal serverless performance with Neon.
 *
 * @module db
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@/lib/env';
import * as schema from './schema';

/**
 * Neon SQL client
 *
 * Creates a connection to Neon Serverless Postgres using the DATABASE_URL
 * from validated environment variables.
 */
const sql = neon(env.DATABASE_URL);

/**
 * Drizzle database client
 *
 * Provides type-safe database operations with full schema inference.
 * This instance is reused across all database operations for connection pooling.
 *
 * @example
 * ```ts
 * import { db } from '@/db';
 * import { clients } from '@/db/schema';
 *
 * const allClients = await db.select().from(clients);
 * ```
 */
export const db = drizzle(sql, { schema });

/**
 * Re-export schema for convenient imports
 */
export * from './schema';
