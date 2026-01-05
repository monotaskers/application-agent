/**
 * @fileoverview Mutation hooks for company operations
 * @module features/companies/hooks/use-company-mutations
 */

import {
  useCreateEntity,
  useUpdateEntity,
  useDeleteEntity,
} from "@/hooks/use-entity-mutations";
import type { Company } from "../lib/company-service";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
} from "../schemas/company.schema";
import { z } from "zod";

/**
 * Response schema for company operations
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
 * Error response schema
 */
const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
});

/**
 * Hook for creating a new company
 *
 * @returns Mutation hook for creating companies
 *
 * @example
 * ```tsx
 * const { mutate: createCompany, isPending } = useCreateCompany({
 *   onSuccess: (company) => {
 *     router.push(`/admin/companies/${company.id}`);
 *   },
 * });
 *
 * createCompany({ name: 'Acme Corp' });
 * ```
 */
export function useCreateCompany(options?: {
  onSuccess?: (company: Company) => void;
  onError?: (error: Error) => void;
}) {
  return useCreateEntity<Company, CreateCompanyInput>(
    {
      endpoint: "/api/admin/companies",
      responseSchema: CompanyResponseSchema.transform((data) => ({
        entity: data.company,
      })) as unknown as z.ZodSchema<{ entity: Company }>,
      errorSchema: ErrorResponseSchema,
      queryKeys: ["companies"],
      redirectPath: (company) => `/admin/companies/${company.id}`,
      entityName: "company",
    },
    options
  );
}

/**
 * Hook for updating an existing company
 *
 * @param companyId - Company ID to update
 * @param options - Optional mutation options
 * @returns Mutation hook for updating companies
 *
 * @example
 * ```tsx
 * const { mutate: updateCompany, isPending } = useUpdateCompany(companyId, {
 *   onSuccess: () => {
 *     toast.success('Company updated');
 *   },
 * });
 *
 * updateCompany({
 *   id: companyId,
 *   data: { name: 'New Name' }
 * });
 * ```
 */
export function useUpdateCompany(
  _companyId: string | null,
  options?: {
    onSuccess?: (company: Company) => void;
    onError?: (error: Error) => void;
  }
) {
  return useUpdateEntity<Company, UpdateCompanyInput>(
    {
      endpoint: (id) => `/api/admin/companies/${id}`,
      responseSchema: CompanyResponseSchema.transform((data) => ({
        entity: data.company,
      })) as unknown as z.ZodSchema<{ entity: Company }>,
      errorSchema: ErrorResponseSchema,
      queryKeys: {
        detail: (id) => ["company", id],
        list: ["companies"],
      },
      entityName: "company",
      handleConcurrentUpdate: true,
    },
    options
  );
}

/**
 * Hook for deleting a company
 *
 * @param options - Optional mutation options
 * @returns Mutation hook for deleting companies
 *
 * @example
 * ```tsx
 * const { mutate: deleteCompany, isPending } = useDeleteCompany({
 *   onSuccess: () => {
 *     router.push('/admin/companies');
 *   },
 * });
 *
 * deleteCompany(companyId);
 * ```
 */
export function useDeleteCompany(_options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useDeleteEntity({
    endpoint: (id) => `/api/admin/companies/${id}`,
    errorSchema: ErrorResponseSchema,
    queryKeys: {
      detail: ["company"],
      list: ["companies"],
    },
    redirectPath: "/admin/companies",
    entityName: "company",
  });
}
