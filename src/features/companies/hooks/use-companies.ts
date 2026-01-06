/**
 * @fileoverview TanStack Query hook for fetching companies with infinite pagination
 * @module features/companies/hooks/use-companies
 */

import type { Company } from "../lib/company-service";
import { z } from "zod";
import { useEntityQuery } from "@/hooks/use-entity-query";
import { useEntityList } from "@/hooks/use-entity-list";

/**
 * Company query response schema
 */
const CompaniesResponseSchema = z.object({
  companies: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      deleted_at: z.string().nullable(),
    })
  ),
  pagination: z.object({
    offset: z.number(),
    limit: z.number(),
    total: z.number(),
    has_next: z.boolean(),
  }),
});

type CompaniesResponse = z.infer<typeof CompaniesResponseSchema>;

/**
 * Filter parameters for company queries
 */
export interface CompanyFilters {
  search?: string;
  include_deleted?: boolean;
}

/**
 * Default page size for company queries
 */
const DEFAULT_PAGE_SIZE = 20;

/**
 * Custom hook for fetching companies with infinite pagination
 *
 * Uses TanStack Query's useInfiniteQuery to handle pagination,
 * loading states, and error states automatically.
 *
 * @param filters - Filter parameters for the query
 * @returns Infinite query result with companies data
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCompanies({
 *   search: 'Acme',
 * });
 * ```
 */
export function useCompanies(filters: CompanyFilters = {}) {
  return useEntityList<Company, CompanyFilters, number, CompaniesResponse>({
    filters,
    endpoint: "/api/admin/companies",
    buildParams: (filters, pageParam) => {
      const params = new URLSearchParams();

      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.include_deleted) {
        params.append("include_deleted", "true");
      }

      params.append("offset", pageParam.toString());
      params.append("limit", DEFAULT_PAGE_SIZE.toString());

      return params;
    },
    responseSchema: CompaniesResponseSchema as z.ZodSchema<CompaniesResponse>,
    queryKey: ["companies"],
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
 * Schema for company response (wraps company in response object)
 */
const CompanyResponseSchema = z.object({
  company: z.object({
    id: z.string().uuid(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable(),
  }),
});

/**
 * Custom hook for fetching a single company
 *
 * @param companyId - Company ID to fetch
 * @returns Query result with company data
 *
 * @example
 * ```tsx
 * const { data: company, isLoading } = useCompany('company-id');
 * ```
 */
export function useCompany(companyId: string | null) {
  return useEntityQuery<Company>({
    id: companyId,
    endpoint: (id) => `/api/admin/companies/${id}`,
    responseSchema: CompanyResponseSchema.transform((data) => ({
      entity: data.company as Company,
    })) as unknown as z.ZodSchema<{ entity: Company }>,
    queryKey: (id) => ["company", id],
    entityName: "company",
  });
}
