/**
 * @fileoverview Permission registry and definitions
 * @module lib/auth/permissions
 *
 * Defines all available permissions in the system.
 * Permissions follow a dot-notation pattern: resource.action
 */

/**
 * Permission string type
 * Format: resource.action or resource.subresource.action
 */
export type Permission = string;

/**
 * Permission registry - all available permissions in the system
 * Organized by resource category for clarity
 */
export const PERMISSIONS = {
  // User management
  users: {
    view: "users.view",
    create: "users.create",
    edit: "users.edit",
    delete: "users.delete",
    assignRole: "users.assign_role",
    viewAll: "users.view_all",
  },

  // Interview management
  interviews: {
    view: "interviews.view",
    create: "interviews.create",
    edit: "interviews.edit",
    delete: "interviews.delete",
    viewAll: "interviews.view_all",
  },

  // Role management (superadmin only)
  roles: {
    view: "roles.view",
    create: "roles.create",
    edit: "roles.edit",
    delete: "roles.delete",
    assign: "roles.assign",
  },

  // Settings management
  settings: {
    view: "settings.view",
    edit: "settings.edit",
    system: "settings.system",
  },

  // Profile management
  profiles: {
    view: "profiles.view",
    edit: "profiles.edit",
  },

  // Wildcard permission (all permissions)
  all: "*",
} as const;

/**
 * Flattened array of all permissions for easy iteration
 */
export const ALL_PERMISSIONS: readonly Permission[] = Object.values(PERMISSIONS)
  .flatMap((category) => {
    if (typeof category === "string") {
      return [category];
    }
    return Object.values(category);
  })
  .filter((perm) => perm !== PERMISSIONS.all) as Permission[];

/**
 * Default permissions for system roles
 * These are the base permissions that each role gets by default
 */
export const ROLE_PERMISSIONS: Record<
  "member" | "admin" | "superadmin",
  readonly Permission[]
> = {
  member: [
    PERMISSIONS.interviews.view,
    PERMISSIONS.interviews.create,
    PERMISSIONS.profiles.view,
    PERMISSIONS.profiles.edit,
  ] as const,

  admin: [
    // All member permissions
    PERMISSIONS.interviews.view,
    PERMISSIONS.interviews.create,
    PERMISSIONS.interviews.edit,
    PERMISSIONS.interviews.delete,
    PERMISSIONS.interviews.viewAll,
    PERMISSIONS.users.view,
    PERMISSIONS.users.viewAll,
    PERMISSIONS.settings.view,
  ] as const,

  superadmin: [PERMISSIONS.all] as const,
} as const;

/**
 * Validates if a permission string is valid
 *
 * @param permission - Permission string to validate
 * @returns true if valid, false otherwise
 */
export function isValidPermission(permission: Permission): boolean {
  if (permission === PERMISSIONS.all) return true;
  return ALL_PERMISSIONS.includes(permission);
}

/**
 * Checks if a permission matches a pattern (supports wildcard)
 *
 * @param userPermission - Permission the user has
 * @param requiredPermission - Permission required
 * @returns true if user has the permission
 */
export function matchesPermission(
  userPermission: Permission,
  requiredPermission: Permission
): boolean {
  // Wildcard permission grants everything
  if (userPermission === PERMISSIONS.all) return true;

  // Exact match
  if (userPermission === requiredPermission) return true;

  // Wildcard matching: "users.*" matches "users.view"
  if (userPermission.endsWith(".*")) {
    const prefix = userPermission.slice(0, -2);
    return requiredPermission.startsWith(prefix + ".");
  }

  return false;
}
