/**
 * @fileoverview Custom role management utilities
 * @module lib/auth/custom-roles
 */

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  customRoleSchema,
  createCustomRoleSchema,
  type CreateCustomRoleInput,
  type CustomRole,
  type UpdateCustomRoleInput,
} from "@/features/auth/schemas/custom-role.schema";

/**
 * Table name for custom roles in Supabase
 */
const CUSTOM_ROLES_TABLE_NAME = "custom_roles";

/**
 * Retrieves a custom role by ID
 *
 * @param roleId - UUID of the custom role
 * @returns Promise resolving to CustomRole or null if not found
 * @throws Error if database query fails
 */
export async function getCustomRole(
  roleId: string
): Promise<CustomRole | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CUSTOM_ROLES_TABLE_NAME)
    .select("*")
    .eq("id", roleId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch custom role: ${error.message}`);
  }

  return customRoleSchema.parse(data);
}

/**
 * Retrieves a custom role by name
 *
 * @param name - Name of the custom role
 * @returns Promise resolving to CustomRole or null if not found
 * @throws Error if database query fails
 */
export async function getCustomRoleByName(
  name: string
): Promise<CustomRole | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CUSTOM_ROLES_TABLE_NAME)
    .select("*")
    .eq("name", name)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch custom role: ${error.message}`);
  }

  return customRoleSchema.parse(data);
}

/**
 * Lists all custom roles
 *
 * @returns Promise resolving to array of CustomRole
 * @throws Error if database query fails
 */
export async function listCustomRoles(): Promise<CustomRole[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CUSTOM_ROLES_TABLE_NAME)
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to list custom roles: ${error.message}`);
  }

  return data.map((role) => customRoleSchema.parse(role));
}

/**
 * Creates a new custom role
 * ⚠️ Requires superadmin authorization (check before calling)
 *
 * @param input - Custom role creation data
 * @param createdBy - User ID of the creator (must be superadmin)
 * @returns Promise resolving to created CustomRole
 * @throws Error if creation fails or validation fails
 */
export async function createCustomRole(
  input: CreateCustomRoleInput,
  createdBy: string
): Promise<CustomRole> {
  // Validate input
  const validatedInput = createCustomRoleSchema.parse(input);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CUSTOM_ROLES_TABLE_NAME)
    .insert({
      name: validatedInput.name,
      description: validatedInput.description ?? null,
      permissions: validatedInput.permissions,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error(`Role with name "${validatedInput.name}" already exists`);
    }
    throw new Error(`Failed to create custom role: ${error.message}`);
  }

  return customRoleSchema.parse(data);
}

/**
 * Updates an existing custom role
 * ⚠️ Requires superadmin authorization (check before calling)
 *
 * @param roleId - UUID of the custom role to update
 * @param input - Update data
 * @returns Promise resolving to updated CustomRole
 * @throws Error if update fails or role not found
 */
export async function updateCustomRole(
  roleId: string,
  input: UpdateCustomRoleInput
): Promise<CustomRole> {
  const supabase = await createClient();

  // Build update object (only include provided fields)
  const updateData: Partial<{
    description: string | null;
    permissions: string[];
  }> = {};

  if (input.description !== undefined) {
    updateData.description = input.description ?? null;
  }

  if (input.permissions !== undefined) {
    // Validate permissions if provided
    const validatedInput = createCustomRoleSchema.partial().parse({
      permissions: input.permissions,
    });
    if (validatedInput.permissions) {
      updateData.permissions = validatedInput.permissions;
    }
  }

  const { data, error } = await supabase
    .from(CUSTOM_ROLES_TABLE_NAME)
    .update(updateData)
    .eq("id", roleId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(`Custom role with id "${roleId}" not found`);
    }
    throw new Error(`Failed to update custom role: ${error.message}`);
  }

  return customRoleSchema.parse(data);
}

/**
 * Deletes a custom role
 * ⚠️ Requires superadmin authorization (check before calling)
 *
 * @param roleId - UUID of the custom role to delete
 * @returns Promise resolving to void
 * @throws Error if deletion fails or role not found
 */
export async function deleteCustomRole(roleId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from(CUSTOM_ROLES_TABLE_NAME)
    .delete()
    .eq("id", roleId);

  if (error) {
    throw new Error(`Failed to delete custom role: ${error.message}`);
  }
}

/**
 * Assigns a custom role to a user
 * ⚠️ Requires superadmin authorization (check before calling)
 *
 * @param userId - User ID to assign role to
 * @param customRoleId - Custom role ID to assign (null to remove custom role)
 * @returns Promise resolving to updated user
 * @throws Error if assignment fails
 */
export async function assignCustomRoleToUser(
  userId: string,
  customRoleId: string | null
): Promise<{ success: true } | { success: false; error: Error }> {
  try {
    const adminClient = createAdminClient();

    // Get current user metadata
    const { data: userData, error: getUserError } =
      await adminClient.auth.admin.getUserById(userId);

    if (getUserError || !userData.user) {
      return {
        success: false,
        error: new Error(
          `Failed to get user: ${getUserError?.message ?? "User not found"}`
        ),
      };
    }

    // Update app_metadata with custom role
    const existingMetadata = userData.user.app_metadata || {};
    const updateData: {
      app_metadata: Record<string, unknown> & {
        role?: string;
        custom_role_id?: string | null;
      };
    } = {
      app_metadata: {
        ...existingMetadata,
      } as Record<string, unknown> & {
        role?: string;
        custom_role_id?: string | null;
      },
    };

    if (customRoleId === null) {
      // Remove custom role, revert to system role
      delete updateData.app_metadata.custom_role_id;
      // If no system role, set to default
      if (!updateData.app_metadata.role) {
        updateData.app_metadata.role = "member";
      }
    } else {
      // Assign custom role
      updateData.app_metadata.custom_role_id = customRoleId;
    }

    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      userId,
      updateData
    );

    if (updateError) {
      return {
        success: false,
        error: new Error(`Failed to assign role: ${updateError.message}`),
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error assigning custom role"),
    };
  }
}
