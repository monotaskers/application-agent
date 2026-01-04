/**
 * @fileoverview Generic hook for fetching a single entity with TanStack Query
 * @module hooks/use-entity-query
 *
 * Provides a reusable pattern for fetching single entities with consistent
 * error handling, retry logic, and caching behavior.
 */

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

/**
 * Configuration for entity query hook
 */
export interface UseEntityQueryConfig<TEntity> {
  /** Entity ID (null/undefined to disable query) */
  id: string | null | undefined;
  /** Function to generate API endpoint from entity ID */
  endpoint: (id: string) => string;
  /** Zod schema for validating the response */
  responseSchema: z.ZodSchema<{ entity: TEntity }>;
  /** Function to generate query key from entity ID */
  queryKey: (id: string) => string[];
  /** Entity name for error messages */
  entityName?: string;
  /** Error response schema (optional) */
  errorSchema?: z.ZodSchema<{ error: string; message: string }>;
  /** Query options */
  options?: {
    /** Whether the query should run (default: true if id is provided) */
    enabled?: boolean;
    /** Stale time in milliseconds (default: 5 minutes) */
    staleTime?: number;
    /** Custom retry logic (default: don't retry 404s, retry others up to 3 times) */
    retry?:
      | boolean
      | number
      | ((failureCount: number, error: Error) => boolean);
  };
}

/**
 * Generic hook for fetching a single entity
 *
 * Provides consistent error handling, retry logic, and caching across all entity types.
 *
 * @param config - Configuration for the entity query
 * @returns Query result with entity data
 *
 * @example
 * ```tsx
 * const { data: user, isLoading, error } = useEntityQuery({
 *   id: userId,
 *   endpoint: (id) => `/api/admin/users/${id}`,
 *   responseSchema: UserDetailResponseSchema,
 *   queryKey: (id) => ["user", id],
 *   entityName: "user",
 * });
 * ```
 */
export function useEntityQuery<TEntity>(
  config: UseEntityQueryConfig<TEntity>
): UseQueryResult<TEntity | null, Error> {
  const {
    id,
    endpoint,
    responseSchema,
    queryKey,
    entityName = "entity",
    errorSchema,
    options = {},
  } = config;

  const {
    enabled: enabledOption,
    staleTime = 5 * 60 * 1000, // 5 minutes
    retry: retryOption,
  } = options;

  const enabled = enabledOption !== undefined ? enabledOption : !!id;

  // Default retry logic: don't retry 404s, retry others up to 3 times
  const retry =
    retryOption !== undefined
      ? retryOption
      : (failureCount: number, error: Error) => {
          // Don't retry on 404 (not found) errors
          if (
            error instanceof Error &&
            (error.message.includes("not found") ||
              error.message.includes("Not found") ||
              error.message.includes("NOT_FOUND"))
          ) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        };

  return useQuery<TEntity | null, Error>({
    queryKey: id ? queryKey(id) : [entityName, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await fetch(endpoint(id));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "UNKNOWN_ERROR",
          message: `Failed to fetch ${entityName}`,
        }));

        if (errorSchema) {
          const error = errorSchema.parse(errorData);

          // Handle 404 specifically
          if (response.status === 404 || error.error === "NOT_FOUND") {
            throw new Error(`${entityName} not found`);
          }

          throw new Error(error.message);
        }

        // Handle 404 specifically
        if (response.status === 404) {
          throw new Error(`${entityName} not found`);
        }

        throw new Error(errorData.message || `Failed to fetch ${entityName}`);
      }

      const data = await response.json();
      const validated = responseSchema.parse(data);
      return validated.entity;
    },
    enabled,
    staleTime,
    retry,
  });
}
