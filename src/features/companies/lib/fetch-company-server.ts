/**
 * @fileoverview Server-side utility for fetching company data
 * @module features/companies/lib/fetch-company-server
 *
 * Provides server-side data fetching for companies used in Server Components
 * and API routes. Follows the SSR pattern for optimal performance.
 */

import { fetchEntityServer } from "@/lib/fetch-entity-server";
import type { Company } from "./company-service";
import { z } from "zod";

/**
 * Zod schema for company validation
 */
const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

/**
 * Fetches a company by ID from the server
 *
 * Validates the ID format and fetches company data from Supabase.
 * Returns null if company doesn't exist or is soft-deleted.
 *
 * @param id - Company ID
 * @returns Promise resolving to Company or null if not found
 * @throws Error if database query fails or ID is invalid
 *
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function CompanyDetailPage({ params }) {
 *   const company = await fetchCompanyServer(params.companyId);
 *   if (!company) {
 *     notFound();
 *   }
 *   return <CompanyDetailClient company={company} />;
 * }
 * ```
 */
export async function fetchCompanyServer(
  id: string
): Promise<Company | null> {
  return fetchEntityServer<Company>(id, {
    table: "companies",
    schema: CompanySchema,
    additionalFilters: (query) => query.is("deleted_at", null),
    entityName: "company",
  });
}

