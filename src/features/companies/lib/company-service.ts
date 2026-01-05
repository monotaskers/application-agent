/**
 * @fileoverview Company service for CRUD operations
 * @module features/companies/lib/company-service
 */

import { createAdminClient } from "@/utils/supabase/admin";
import type { Tables } from "@/types/database.types";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyQueryInput,
} from "../schemas/company.schema";

/**
 * Company type from database
 */
export type Company = Tables<"companies">;

/**
 * Default Ocupop company name constant
 */
const OCUPOP_COMPANY_NAME = "Ocupop";

/**
 * Email domain for Ocupop company assignment
 */
const OCUPOP_EMAIL_DOMAIN = "@ocupop.com";

/**
 * Fetches a company by ID
 *
 * @param id - Company ID
 * @returns Promise resolving to Company or null if not found
 * @throws Error if database query fails
 */
export async function getCompanyById(id: string): Promise<Company | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch company: ${error.message}`);
  }

  return data;
}

/**
 * Gets or creates the default Ocupop company
 *
 * @returns Promise resolving to Ocupop company ID
 * @throws Error if company cannot be fetched or created
 */
export async function getDefaultOcupopCompany(): Promise<string | null> {
  const supabase = createAdminClient();

  // Try to fetch existing Ocupop company
  const { data: existingCompany, error: fetchError } = await supabase
    .from("companies")
    .select("id")
    .eq("name", OCUPOP_COMPANY_NAME)
    .is("deleted_at", null)
    .single();

  if (existingCompany) {
    return existingCompany.id;
  }

  // If not found, try to create it (handles race condition)
  if (fetchError && fetchError.code === "PGRST116") {
    const { data: newCompany, error: createError } = await supabase
      .from("companies")
      .insert({ name: OCUPOP_COMPANY_NAME })
      .select("id")
      .single();

    if (createError) {
      // If creation fails due to unique constraint (race condition),
      // fetch it again
      if (createError.code === "23505") {
        const { data: fetchedCompany, error: retryError } = await supabase
          .from("companies")
          .select("id")
          .eq("name", OCUPOP_COMPANY_NAME)
          .is("deleted_at", null)
          .single();

        if (fetchedCompany) {
          return fetchedCompany.id;
        }

        throw new Error(
          `Failed to fetch Ocupop company after creation conflict: ${retryError?.message || "Unknown error"}`
        );
      }

      throw new Error(
        `Failed to create Ocupop company: ${createError.message}`
      );
    }

    return newCompany.id;
  }

  throw new Error(
    `Failed to fetch Ocupop company: ${fetchError?.message || "Unknown error"}`
  );
}

/**
 * Determines company ID based on email domain
 *
 * @param email - User email address
 * @returns Promise resolving to company ID or null if no company should be assigned
 * @throws Error if company assignment fails
 */
export async function assignCompanyByEmail(
  email: string | null | undefined
): Promise<string | null> {
  if (!email) {
    return null;
  }

  // Check if email ends with @ocupop.com
  if (email.toLowerCase().endsWith(OCUPOP_EMAIL_DOMAIN)) {
    return await getDefaultOcupopCompany();
  }

  return null;
}

/**
 * Fetches a list of companies with optional search and pagination
 *
 * @param query - Query parameters for filtering and pagination
 * @returns Promise resolving to companies array and pagination info
 */
export async function getCompanies(
  query: CompanyQueryInput
): Promise<{ companies: Company[]; total: number }> {
  const supabase = createAdminClient();

  let queryBuilder = supabase.from("companies").select("*", { count: "exact" });

  // Filter deleted companies
  if (!query.include_deleted) {
    queryBuilder = queryBuilder.is("deleted_at", null);
  }

  // Apply search filter (name)
  if (query.search) {
    queryBuilder = queryBuilder.ilike("name", `%${query.search}%`);
  }

  // Apply pagination
  const from = query.offset;
  const to = from + query.limit - 1;
  queryBuilder = queryBuilder
    .range(from, to)
    .order("created_at", { ascending: false });

  const { data, error, count } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to fetch companies: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return {
      companies: [],
      total: count || 0,
    };
  }

  return {
    companies: data,
    total: count || 0,
  };
}

/**
 * Creates a new company
 *
 * @param input - Company creation data
 * @returns Promise resolving to created Company
 */
export async function createCompany(
  input: CreateCompanyInput
): Promise<Company> {
  const adminSupabase = createAdminClient();

  // Check name uniqueness (including soft-deleted companies)
  const { data: existingCompany } = await adminSupabase
    .from("companies")
    .select("id, deleted_at")
    .eq("name", input.name)
    .single();

  if (existingCompany) {
    if (existingCompany.deleted_at) {
      throw new Error(
        `Company name "${input.name}" belongs to a soft-deleted company. Please restore the company first.`
      );
    }
    throw new Error(`Company name "${input.name}" is already in use`);
  }

  // Create company
  const { data: company, error: companyError } = await adminSupabase
    .from("companies")
    .insert({
      name: input.name,
    })
    .select("*")
    .single();

  if (companyError) {
    throw new Error(`Failed to create company: ${companyError.message}`);
  }

  return company;
}

/**
 * Updates an existing company
 *
 * @param companyId - Company ID to update
 * @param input - Company update data
 * @returns Promise resolving to updated Company and conflict flag
 */
export async function updateCompany(
  companyId: string,
  input: UpdateCompanyInput
): Promise<{ company: Company; conflict: boolean }> {
  const adminSupabase = createAdminClient();

  // Fetch current company data
  const currentCompany = await getCompanyById(companyId);
  if (!currentCompany) {
    throw new Error("Company not found");
  }

  // Check for concurrent edits (compare updated_at timestamps)
  const hasConflict =
    input.updated_at &&
    input.updated_at !== currentCompany.updated_at &&
    new Date(input.updated_at) < new Date(currentCompany.updated_at);

  // Check name uniqueness if name is being updated
  if (input.name && input.name !== currentCompany.name) {
    const { data: existingCompany } = await adminSupabase
      .from("companies")
      .select("id, deleted_at")
      .eq("name", input.name)
      .single();

    if (existingCompany && existingCompany.id !== companyId) {
      if (existingCompany.deleted_at) {
        throw new Error(
          `Company name "${input.name}" belongs to a soft-deleted company. Please restore the company first.`
        );
      }
      throw new Error(`Company name "${input.name}" is already in use`);
    }
  }

  // Update company
  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name;

  const { data: company, error: companyError } = await adminSupabase
    .from("companies")
    .update(updateData)
    .eq("id", companyId)
    .select("*")
    .single();

  if (companyError) {
    throw new Error(`Failed to update company: ${companyError.message}`);
  }

  return { company, conflict: hasConflict || false };
}

/**
 * Soft deletes a company by setting deleted_at timestamp
 *
 * @param companyId - Company ID to delete
 * @returns Promise resolving when deletion is complete
 */
export async function softDeleteCompany(companyId: string): Promise<void> {
  const adminSupabase = createAdminClient();

  // Check if company exists
  const company = await getCompanyById(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  // Check if already soft-deleted
  if (company.deleted_at) {
    throw new Error("Company is already soft-deleted");
  }

  // Soft delete company
  const { error } = await adminSupabase
    .from("companies")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", companyId);

  if (error) {
    throw new Error(`Failed to delete company: ${error.message}`);
  }
}
