/**
 * @fileoverview Role management utilities for user authorization
 * @module lib/auth/roles
 */

import type { User } from "@supabase/supabase-js";
import {
  UserRoleSchema,
  type UserRole,
  ROLE_HIERARCHY,
  DEFAULT_ROLE,
  safeValidateRole,
} from "@/features/auth/schemas/role.schema";
import { createAdminClient } from "@/utils/supabase/admin";

/**
 * Extracts and validates user role from Supabase user metadata
 * Checks for custom role first, then falls back to system role
 *
 * @param user - Supabase user object
 * @returns UserRole or DEFAULT_ROLE if not set/invalid
 *
 * @example
 * ```typescript
 * const { data: { user } } = await supabase.auth.getUser();
 * const role = getUserRole(user);
 * ```
 */
export function getUserRole(user: User | null): UserRole {
  if (!user) {
    return DEFAULT_ROLE;
  }

  // Check for custom role first
  const customRoleId = user.app_metadata?.custom_role_id;
  if (customRoleId) {
    // User has a custom role assigned
    // Return the system role as base, custom role permissions handled separately
    const systemRole = user.app_metadata?.role;
    if (systemRole) {
      const validation = safeValidateRole(systemRole);
      if (validation.success) {
        return validation.data;
      }
    }
    // If custom role but no system role, default to member
    return DEFAULT_ROLE;
  }

  // Check app_metadata for system role (system-level, not user-editable)
  const roleFromMetadata = user.app_metadata?.role;
  if (roleFromMetadata) {
    const validation = safeValidateRole(roleFromMetadata);
    if (validation.success) {
      return validation.data;
    }
  }

  // Fallback to user_metadata if app_metadata doesn't have role
  const roleFromUserMetadata = user.user_metadata?.role;
  if (roleFromUserMetadata) {
    const validation = safeValidateRole(roleFromUserMetadata);
    if (validation.success) {
      return validation.data;
    }
  }

  return DEFAULT_ROLE;
}

/**
 * Checks if user has a specific role
 *
 * @param user - Supabase user object
 * @param role - Role to check for
 * @returns true if user has the role, false otherwise
 *
 * @example
 * ```typescript
 * const isAdmin = hasRole(user, 'admin');
 * ```
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  const userRole = getUserRole(user);
  return userRole === role;
}

/**
 * Checks if user meets minimum role requirement
 *
 * @param user - Supabase user object
 * @param minRole - Minimum role required
 * @returns true if user's role meets or exceeds minimum, false otherwise
 *
 * @example
 * ```typescript
 * const canAccessAdmin = hasMinRole(user, 'admin');
 * ```
 */
export function hasMinRole(user: User | null, minRole: UserRole): boolean {
  const userRole = getUserRole(user);
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}

/**
 * Compares two roles based on hierarchy
 *
 * @param role1 - First role to compare
 * @param role2 - Second role to compare
 * @returns -1 if role1 < role2, 0 if equal, 1 if role1 > role2
 *
 * @example
 * ```typescript
 * const comparison = compareRoles('member', 'admin'); // -1
 * ```
 */
export function compareRoles(role1: UserRole, role2: UserRole): number {
  const level1 = ROLE_HIERARCHY[role1];
  const level2 = ROLE_HIERARCHY[role2];

  if (level1 < level2) return -1;
  if (level1 > level2) return 1;
  return 0;
}

/**
 * Updates a user's role in Supabase auth metadata
 * ⚠️ WARNING: Only use in trusted server-side environments with proper authorization
 *
 * @param userId - User ID to update
 * @param role - New role to assign
 * @returns Promise resolving to updated user or error
 * @throws Error if update fails or user not found
 *
 * @example
 * ```typescript
 * // In an admin API route
 * await setUserRole(userId, 'admin');
 * ```
 */
export async function setUserRole(
  userId: string,
  role: UserRole
): Promise<{ data: User; error: null } | { data: null; error: Error }> {
  try {
    // Validate role
    UserRoleSchema.parse(role);

    const adminClient = createAdminClient();

    // Get current user metadata
    const { data: userData, error: getUserError } =
      await adminClient.auth.admin.getUserById(userId);

    if (getUserError || !userData.user) {
      return {
        data: null,
        error: new Error(
          `Failed to get user: ${getUserError?.message ?? "User not found"}`
        ),
      };
    }

    // Update app_metadata with new role
    const { data: updatedUser, error: updateError } =
      await adminClient.auth.admin.updateUserById(userId, {
        app_metadata: {
          ...userData.user.app_metadata,
          role,
        },
      });

    if (updateError) {
      return {
        data: null,
        error: new Error(`Failed to update role: ${updateError.message}`),
      };
    }

    if (!updatedUser.user) {
      return {
        data: null,
        error: new Error("User update returned no user data"),
      };
    }

    return { data: updatedUser.user, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error updating user role"),
    };
  }
}
