/**
 * @fileoverview Client-side permission checking utilities
 * @module lib/auth/permission-checker-client
 *
 * Client-safe version that only checks system role permissions.
 * For custom role permissions, use server-side permission-checker.ts
 */

import type { User } from "@supabase/supabase-js";
import { getUserRole } from "@/lib/auth/roles";
import {
  ROLE_PERMISSIONS,
  PERMISSIONS,
  matchesPermission,
  type Permission,
} from "@/lib/auth/permissions";

/**
 * Gets system role permissions for a user (client-safe)
 * Does not check custom roles - use server-side getUserPermissions for that
 *
 * @param user - Supabase user object
 * @returns Array of permissions based on system role only
 */
export function getUserPermissionsClient(user: User | null): Permission[] {
  if (!user) {
    return [];
  }

  // Superadmin always has all permissions
  const systemRole = getUserRole(user);
  if (systemRole === "superadmin") {
    return [PERMISSIONS.all];
  }

  // Return system role default permissions
  // Note: This doesn't check custom roles - for that, use server-side getUserPermissions
  return [...ROLE_PERMISSIONS[systemRole]];
}

/**
 * Checks if user has a specific permission (client-safe)
 * Only checks system role permissions, not custom roles
 *
 * @param user - Supabase user object
 * @param permission - Permission to check for
 * @returns true if user has permission based on system role, false otherwise
 *
 * @example
 * ```typescript
 * const canDelete = hasPermissionClient(user, PERMISSIONS.users.delete);
 * ```
 */
export function hasPermissionClient(
  user: User | null,
  permission: Permission
): boolean {
  if (!user) {
    return false;
  }

  const userPermissions = getUserPermissionsClient(user);

  // Check if any user permission matches the required permission
  return userPermissions.some((userPerm) =>
    matchesPermission(userPerm, permission)
  );
}

/**
 * Checks if user has any of the specified permissions (client-safe)
 * Only checks system role permissions, not custom roles
 *
 * @param user - Supabase user object
 * @param permissions - Array of permissions to check for
 * @returns true if user has at least one permission
 */
export function hasAnyPermissionClient(
  user: User | null,
  permissions: Permission[]
): boolean {
  if (!user || permissions.length === 0) {
    return false;
  }

  const userPermissions = getUserPermissionsClient(user);

  return permissions.some((requiredPerm) =>
    userPermissions.some((userPerm) =>
      matchesPermission(userPerm, requiredPerm)
    )
  );
}

/**
 * Checks if user has all of the specified permissions (client-safe)
 * Only checks system role permissions, not custom roles
 *
 * @param user - Supabase user object
 * @param permissions - Array of permissions to check for
 * @returns true if user has all permissions
 */
export function hasAllPermissionsClient(
  user: User | null,
  permissions: Permission[]
): boolean {
  if (!user || permissions.length === 0) {
    return false;
  }

  const userPermissions = getUserPermissionsClient(user);

  return permissions.every((requiredPerm) =>
    userPermissions.some((userPerm) =>
      matchesPermission(userPerm, requiredPerm)
    )
  );
}
