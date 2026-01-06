/**
 * @fileoverview Generic server-side utility for fetching entities from Supabase
 * @module lib/fetch-entity-server
 *
 * Provides a type-safe, reusable utility for fetching entities by ID with
 * UUID validation, error handling, and schema validation.
 */

import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

/**
 * Configuration for fetching an entity
 */
export interface FetchEntityConfig<T> {
  /** Table name in Supabase */
  table: string;
  /** Zod schema for validating the entity */
  schema: z.ZodSchema<T>;
  /** Optional custom UUID validation schema (defaults to z.string().uuid()) */
  idSchema?: z.ZodSchema<string>;
  /** Optional custom select query (defaults to "*") */
  select?: string;
  /** Optional additional query filters */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalFilters?: (query: any) => any;
  /** Optional entity name for error messages (defaults to "entity") */
  entityName?: string;
}

/**
 * Server-side function to fetch an entity by ID
 *
 * Fetches entity data directly from Supabase, bypassing API routes.
 * Handles UUID validation, error handling, and schema validation.
 *
 * @param id - Entity ID (UUID)
 * @param config - Configuration for fetching the entity
 * @param supabaseClient - Optional Supabase client (for testing/caching)
 * @returns Promise resolving to entity if found, null if not found
 * @throws Error for invalid UUID or database errors
 *
 * @example
 * ```ts
 * const user = await fetchEntityServer("e79f5e8e-7e19-4f78-97f4-eba979362d39", {
 *   table: "profiles",
 *   schema: UserSchema,
 *   additionalFilters: (query) => query.is("deleted_at", null),
 *   entityName: "user",
 * });
 * ```
 */
export async function fetchEntityServer<T>(
  id: string,
  config: FetchEntityConfig<T>,
  supabaseClient?: SupabaseClient
): Promise<T | null> {
  const {
    table,
    schema,
    idSchema = z.string().uuid(),
    select = "*",
    additionalFilters,
    entityName = "entity",
  } = config;

  // Validate entity ID format
  const validatedId = idSchema.parse(id);

  // Use provided client or create new one
  const supabase = supabaseClient ?? (await createClient());

  // Build query
  let query = supabase.from(table).select(select).eq("id", validatedId);

  // Apply additional filters if provided
  if (additionalFilters) {
    query = additionalFilters(query);
  }

  // Execute query
  const { data: entity, error } = await query.single();

  if (error) {
    // Handle not found error (PGRST116 is Supabase's "no rows returned" error)
    if (error.code === "PGRST116") {
      return null;
    }

    // Log and throw for other errors
    console.error(`Error fetching ${entityName}:`, error);
    throw new Error(`Failed to fetch ${entityName}: ${error.message}`);
  }

  if (!entity) {
    return null;
  }

  // Validate entity data with schema
  const validatedEntity = schema.parse(entity);

  return validatedEntity;
}
