/**
 * @fileoverview TanStack Query hook for fetching users with infinite pagination
 * @module features/users/hooks/use-users
 */

import type { User } from "../types/user.types";
import { z } from "zod";
import { useEntityQuery } from "@/hooks/use-entity-query";
import { useEntityList } from "@/hooks/use-entity-list";

/**
 * User query response schema
 */
const UsersResponseSchema = z.object({
  users: z.array(
    z.object({
      id: z.string().uuid(),
      email: z.preprocess(
        (val) => (val === "" ? null : val),
        z.union([z.string().email(), z.null()])
      ),
      full_name: z.string().nullable(),
      role: z.enum(["member", "admin", "superadmin"]),
      avatar_url: z.string().nullable(),
      bio: z.string().nullable(),
      phone: z.string().nullable(),
      company_id: z.string().uuid().nullable(),
      company_name: z.string().nullable(),
      address_1: z.string().nullable(),
      address_2: z.string().nullable(),
      city: z.string().nullable(),
      state: z.string().nullable(),
      postal_code: z.string().nullable(),
      country: z.string().nullable(),
      title: z.string().nullable(),
      deleted_at: z.string().nullable(),
      created_at: z.string(),
      updated_at: z.string(),
    })
  ),
  pagination: z.object({
    offset: z.number(),
    limit: z.number(),
    total: z.number(),
    has_next: z.boolean(),
  }),
});

type UsersResponse = z.infer<typeof UsersResponseSchema>;

/**
 * Filter parameters for user queries
 */
export interface UserFilters {
  search?: string;
  role?: "member" | "admin" | "superadmin";
  include_deleted?: boolean;
}

/**
 * Default page size for user queries
 */
const DEFAULT_PAGE_SIZE = 20;

/**
 * Custom hook for fetching users with infinite pagination
 *
 * Uses TanStack Query's useInfiniteQuery to handle pagination,
 * loading states, and error states automatically.
 *
 * @param filters - Filter parameters for the query
 * @returns Infinite query result with users data
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsers({
 *   search: 'john',
 *   role: 'admin',
 * });
 * ```
 */
export function useUsers(filters: UserFilters = {}) {
  return useEntityList<User, UserFilters, number, UsersResponse>({
    filters,
    endpoint: "/api/admin/users",
    buildParams: (filters, pageParam) => {
      const params = new URLSearchParams();

      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.role) {
        params.append("role", filters.role);
      }
      if (filters.include_deleted) {
        params.append("include_deleted", "true");
      }

      params.append("offset", pageParam.toString());
      params.append("limit", DEFAULT_PAGE_SIZE.toString());

      return params;
    },
    responseSchema: UsersResponseSchema as z.ZodSchema<UsersResponse>,
    queryKey: ["users"],
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.pagination.has_next) {
        return undefined;
      }
      return allPages.length * DEFAULT_PAGE_SIZE;
    },
    initialPageParam: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
}

/**
 * Schema for user response (wraps user in response object)
 */
const UserResponseSchema = z.object({
  user: z.any(), // UserWithCompany type
});

/**
 * Custom hook for fetching a single user
 *
 * @param userId - User ID to fetch
 * @returns Query result with user data
 *
 * @example
 * ```tsx
 * const { data: user, isLoading } = useUser('user-id');
 * ```
 */
export function useUser(userId: string | null) {
  return useEntityQuery<User>({
    id: userId,
    endpoint: (id) => `/api/admin/users/${id}`,
    responseSchema: UserResponseSchema.transform((data) => ({
      entity: data.user as User,
    })) as unknown as z.ZodSchema<{ entity: User }>,
    queryKey: (id) => ["user", id],
    entityName: "user",
  });
}
