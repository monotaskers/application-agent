/**
 * @fileoverview Simple hook to fetch all companies for dropdown/select
 * @module features/companies/hooks/use-companies-simple
 */

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

/**
 * Companies response schema for simple list
 */
const CompaniesSimpleResponseSchema = z.object({
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

type CompaniesSimpleResponse = z.infer<typeof CompaniesSimpleResponseSchema>;

/**
 * Custom hook to fetch all active companies for dropdown/select
 *
 * Fetches all active (non-deleted) companies with a high limit to get all at once.
 * Suitable for dropdown/select components where pagination isn't needed.
 *
 * @returns Query result with all companies
 *
 * @example
 * ```tsx
 * const { data: companiesData, isLoading } = useCompaniesSimple();
 * const companies = companiesData?.companies || [];
 * ```
 */
export function useCompaniesSimple() {
  return useQuery<CompaniesSimpleResponse>({
    queryKey: ["companies", "simple"],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/companies?offset=0&limit=1000&include_deleted=false`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }

      const data = await response.json();
      return CompaniesSimpleResponseSchema.parse(data);
    },
  });
}

/**
 * Hook to get companies as FormOption array for FormSelect
 *
 * @returns Array of companies formatted as FormOption, or empty array if loading/error
 *
 * @example
 * ```tsx
 * const companyOptions = useCompanyOptions();
 * <FormSelect control={control} name="company_id" options={companyOptions} />
 * ```
 */
export function useCompanyOptions(): Array<{ value: string; label: string }> {
  const { data } = useCompaniesSimple();

  if (!data?.companies) {
    return [];
  }

  return data.companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));
}

