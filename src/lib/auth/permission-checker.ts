/**
 * @fileoverview Permission checking utilities
 * @module lib/auth/permission-checker
 */

import type { User } from "@supabase/supabase-js";
import { getUserRole } from "@/lib/auth/roles";
import { getCustomRole } from "@/lib/auth/custom-roles";
import {
  ROLE_PERMISSIONS,
  PERMISSIONS,
  matchesPermission,
  type Permission,
} from "@/lib/auth/permissions";

/**
 * Gets all permissions for a user
 * Resolves system role permissions or custom role permissions
 *
 * @param user - Supabase user object
 * @returns Promise resolving to array of permissions
 */
export async function getUserPermissions(
  user: User | null
): Promise<Permission[]> {
  if (!user) {
    return [];
  }

  // Superadmin always has all permissions
  const systemRole = getUserRole(user);
  if (systemRole === "superadmin") {
    return [PERMISSIONS.all];
  }

  // Check for custom role
  const customRoleId = user.app_metadata?.custom_role_id;
  if (customRoleId) {
    const customRole = await getCustomRole(customRoleId);
    if (customRole) {
      // Custom role permissions override system role permissions
      return customRole.permissions as Permission[];
    }
    // If custom role not found, fall back to system role
  }

  // Return system role default permissions
  return [...ROLE_PERMISSIONS[systemRole]];
}

/**
 * Checks if user has a specific permission
 *
 * @param user - Supabase user object
 * @param permission - Permission to check for
 * @returns Promise resolving to true if user has permission, false otherwise
 *
 * @example
 * ```typescript
 * const canDelete = await hasPermission(user, PERMISSIONS.users.delete);
 * ```
 */
export async function hasPermission(
  user: User | null,
  permission: Permission
): Promise<boolean> {
  if (!user) {
    return false;
  }

  const userPermissions = await getUserPermissions(user);

  // Check if any user permission matches the required permission
  return userPermissions.some((userPerm) =>
    matchesPermission(userPerm, permission)
  );
}

/**
 * Checks if user has any of the specified permissions
 *
 * @param user - Supabase user object
 * @param permissions - Array of permissions to check for
 * @returns Promise resolving to true if user has at least one permission
 */
export async function hasAnyPermission(
  user: User | null,
  permissions: Permission[]
): Promise<boolean> {
  if (!user || permissions.length === 0) {
    return false;
  }

  const userPermissions = await getUserPermissions(user);

  return permissions.some((requiredPerm) =>
    userPermissions.some((userPerm) =>
      matchesPermission(userPerm, requiredPerm)
    )
  );
}

/**
 * Checks if user has all of the specified permissions
 *
 * @param user - Supabase user object
 * @param permissions - Array of permissions to check for
 * @returns Promise resolving to true if user has all permissions
 */
export async function hasAllPermissions(
  user: User | null,
  permissions: Permission[]
): Promise<boolean> {
  if (!user || permissions.length === 0) {
    return false;
  }

  const userPermissions = await getUserPermissions(user);

  return permissions.every((requiredPerm) =>
    userPermissions.some((userPerm) =>
      matchesPermission(userPerm, requiredPerm)
    )
  );
}
