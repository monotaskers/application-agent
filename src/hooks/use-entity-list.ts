/**
 * @fileoverview Generic hook for fetching entity lists with infinite pagination
 * @module hooks/use-entity-list
 *
 * Provides a reusable pattern for fetching paginated entity lists with
 * support for both cursor-based and offset-based pagination.
 */

import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";
import { z } from "zod";

/**
 * Pagination response structure for cursor-based pagination
 */
export interface CursorPaginationResponse {
  next_cursor: unknown;
  has_next: boolean;
  total?: number | undefined;
}

/**
 * Pagination response structure for offset-based pagination
 */
export interface OffsetPaginationResponse {
  pagination: {
    offset: number;
    limit: number;
    total: number;
    has_next: boolean;
  };
}

/**
 * Configuration for entity list query hook
 */
export interface UseEntityListConfig<TEntity, TFilters, TPageParam, TResponse> {
  /** Filter parameters */
  filters: TFilters;
  /** API endpoint */
  endpoint: string;
  /** Function to build URL search params from filters and page param */
  buildParams: (filters: TFilters, pageParam: TPageParam) => URLSearchParams;
  /** Zod schema for validating the response */
  responseSchema: z.ZodSchema<TResponse>;
  /** Query key array */
  queryKey: (string | TFilters)[];
  /** Function to get next page param from last page */
  getNextPageParam: (
    lastPage: TResponse,
    allPages: TResponse[]
  ) => TPageParam | undefined;
  /** Initial page param value */
  initialPageParam: TPageParam;
  /** Default page size */
  pageSize?: number;
  /** Stale time in milliseconds (default: 5 minutes) */
  staleTime?: number;
  /** Optional initial data from server-side rendering */
  initialData?: TEntity[];
}

/**
 * Generic hook for fetching entity lists with infinite pagination
 *
 * Supports both cursor-based and offset-based pagination patterns.
 *
 * @param config - Configuration for the entity list query
 * @returns Infinite query result with entities data
 *
 * @example
 * ```tsx
 * // Cursor-based pagination
 * const { data, fetchNextPage, hasNextPage } = useEntityList({
 *   filters: { search: 'john' },
 *   endpoint: '/api/admin/users',
 *   buildParams: (filters, cursor) => {
 *     const params = new URLSearchParams();
 *     if (filters.search) params.append('search', filters.search);
 *     if (cursor) params.append('cursor', JSON.stringify(cursor));
 *     return params;
 *   },
 *   responseSchema: UsersListResponseSchema,
 *   queryKey: ['users'],
 *   getNextPageParam: (lastPage) => lastPage.has_next ? lastPage.next_cursor : undefined,
 *   initialPageParam: null,
 * });
 * ```
 */
export function useEntityList<TEntity, TFilters, TPageParam, TResponse>(
  config: UseEntityListConfig<TEntity, TFilters, TPageParam, TResponse>
): UseInfiniteQueryResult<InfiniteData<TResponse, TPageParam>, Error> {
  const {
    filters,
    endpoint,
    buildParams,
    responseSchema,
    queryKey,
    getNextPageParam,
    initialPageParam,
    pageSize,
    staleTime = 5 * 60 * 1000, // 5 minutes
    initialData,
  } = config;

  // Build initial data structure if provided
  const initialDataValue: InfiniteData<TResponse, TPageParam> | undefined =
    initialData && initialData.length > 0
      ? ({
          pages: [
            {
              ...({
                has_next: initialData.length >= (pageSize ?? 50),
                next_cursor: null,
              } as TResponse),
            } as TResponse,
          ],
          pageParams: [initialPageParam],
        } as InfiniteData<TResponse, TPageParam>)
      : undefined;

  const queryOptions: Parameters<
    typeof useInfiniteQuery<
      TResponse,
      Error,
      InfiniteData<TResponse, TPageParam>,
      (string | TFilters)[],
      TPageParam
    >
  >[0] = {
    queryKey: [...queryKey, filters],
    queryFn: async ({ pageParam }) => {
      const params = buildParams(filters, pageParam as TPageParam);
      const response = await fetch(`${endpoint}?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "UNKNOWN_ERROR",
          message: "Failed to fetch entities",
        }));
        throw new Error(errorData.message || "Failed to fetch entities");
      }

      const data = await response.json();
      return responseSchema.parse(data);
    },
    getNextPageParam,
    initialPageParam,
    staleTime,
    refetchOnMount: initialDataValue ? false : true,
  };

  if (initialDataValue) {
    queryOptions.initialData = initialDataValue;
  }

  return useInfiniteQuery<
    TResponse,
    Error,
    InfiniteData<TResponse, TPageParam>,
    (string | TFilters)[],
    TPageParam
  >(queryOptions);
}
