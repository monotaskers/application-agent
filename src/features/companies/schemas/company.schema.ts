/**
 * @fileoverview Zod schemas for Company validation
 * @module features/companies/schemas/company.schema
 */

import { z } from "zod";

/**
 * Schema for creating a new company
 * Validates company creation input
 */
export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be 255 characters or less"),
});

/**
 * Schema for updating an existing company
 * All fields are optional except validation rules
 */
export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be 255 characters or less")
    .optional(),
  // Optional updated_at for optimistic locking (concurrent edit detection)
  updated_at: z.string().datetime().optional(),
});

/**
 * Schema for querying companies (list/search/filter)
 * Used for GET /api/admin/companies endpoint
 */
export const companyQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  include_deleted: z.coerce.boolean().default(false),
});

/**
 * TypeScript types inferred from schemas
 */
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanyQueryInput = z.infer<typeof companyQuerySchema>;
