/**
 * @fileoverview Server-side authentication and authorization gateways
 * @module lib/auth/gateways/server
 *
 * Provides type-safe utilities for enforcing authentication and authorization
 * in Server Components, Server Actions, and API Route Handlers.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getUserRole, hasRole, hasMinRole } from "@/lib/auth/roles";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "@/lib/auth/permission-checker";
import type { UserRole } from "@/features/auth/schemas/role.schema";
import type { Permission } from "@/lib/auth/permissions";
import type { User } from "@supabase/supabase-js";

/**
 * Result type for auth gateway functions
 */
export interface AuthResult {
  user: User;
  role: UserRole;
}

/**
 * Ensures user is authenticated
 * Throws redirect if user is not authenticated
 *
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 *
 * @example
 * ```typescript
 * // In a Server Component or Server Action
 * const { user, role } = await requireAuth();
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  const role = getUserRole(user);

  return { user, role };
}

/**
 * Safely gets current user and role without throwing
 * Useful when you want to handle unauthenticated state gracefully
 *
 * @returns Promise resolving to AuthResult or null if not authenticated
 *
 * @example
 * ```typescript
 * const auth = await getAuth();
 * if (auth) {
 *   console.log(auth.user.id, auth.role);
 * }
 * ```
 */
export async function getAuth(): Promise<AuthResult | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const role = getUserRole(user);

  return { user, role };
}

/**
 * Ensures user has a specific role
 * Throws redirect if user is not authenticated or doesn't have the role
 *
 * @param requiredRole - Role required to access the resource
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /admin if role insufficient (or appropriate error page)
 *
 * @example
 * ```typescript
 * // In an admin API route
 * const { user, role } = await requireRole('admin');
 * ```
 */
export async function requireRole(requiredRole: UserRole): Promise<AuthResult> {
  const auth = await requireAuth();

  if (!hasRole(auth.user, requiredRole)) {
    // Redirect to admin or appropriate error page
    redirect("/admin?error=insufficient_permissions");
  }

  return auth;
}

/**
 * Ensures user has one of the specified roles
 * Throws redirect if user is not authenticated or doesn't have any of the roles
 *
 * @param allowedRoles - Array of roles that can access the resource
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /admin if role insufficient
 *
 * @example
 * ```typescript
 * // Allow both admin and superadmin
 * const { user, role } = await requireAnyRole(['admin', 'superadmin']);
 * ```
 */
export async function requireAnyRole(
  allowedRoles: UserRole[]
): Promise<AuthResult> {
  const auth = await requireAuth();

  const hasAllowedRole = allowedRoles.some((role) => hasRole(auth.user, role));

  if (!hasAllowedRole) {
    redirect("/admin?error=insufficient_permissions");
  }

  return auth;
}

/**
 * Ensures user has minimum role level
 * Throws redirect if user is not authenticated or doesn't meet minimum role
 *
 * @param minRole - Minimum role required (hierarchy: member < admin < superadmin)
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /admin if role insufficient
 *
 * @example
 * ```typescript
 * // Require admin or higher (admin, superadmin)
 * const { user, role } = await requireMinRole('admin');
 * ```
 */
export async function requireMinRole(minRole: UserRole): Promise<AuthResult> {
  const auth = await requireAuth();

  if (!hasMinRole(auth.user, minRole)) {
    redirect("/admin?error=insufficient_permissions");
  }

  return auth;
}

/**
 * Ensures user has a specific permission
 * Throws redirect if user is not authenticated or doesn't have the permission
 *
 * @param permission - Permission required to access the resource
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /admin if permission insufficient
 *
 * @example
 * ```typescript
 * // In an API route
 * const { user, role } = await requirePermission(PERMISSIONS.users.delete);
 * ```
 */
export async function requirePermission(
  permission: Permission
): Promise<AuthResult> {
  const auth = await requireAuth();

  const hasAccess = await hasPermission(auth.user, permission);
  if (!hasAccess) {
    redirect("/admin?error=insufficient_permissions");
  }

  return auth;
}

/**
 * Ensures user has any of the specified permissions
 * Throws redirect if user is not authenticated or doesn't have any permission
 *
 * @param permissions - Array of permissions (user needs at least one)
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /admin if permissions insufficient
 *
 * @example
 * ```typescript
 * // Allow users with either edit or delete permission
 * const { user, role } = await requireAnyPermission([
 *   PERMISSIONS.users.edit,
 *   PERMISSIONS.users.delete,
 * ]);
 * ```
 */
export async function requireAnyPermission(
  permissions: Permission[]
): Promise<AuthResult> {
  const auth = await requireAuth();

  const hasAccess = await hasAnyPermission(auth.user, permissions);
  if (!hasAccess) {
    redirect("/admin?error=insufficient_permissions");
  }

  return auth;
}

/**
 * Ensures user has all of the specified permissions
 * Throws redirect if user is not authenticated or doesn't have all permissions
 *
 * @param permissions - Array of permissions (user needs all)
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /admin if permissions insufficient
 *
 * @example
 * ```typescript
 * // Require both view and edit permissions
 * const { user, role } = await requireAllPermissions([
 *   PERMISSIONS.users.view,
 *   PERMISSIONS.users.edit,
 * ]);
 * ```
 */
export async function requireAllPermissions(
  permissions: Permission[]
): Promise<AuthResult> {
  const auth = await requireAuth();

  const hasAccess = await hasAllPermissions(auth.user, permissions);
  if (!hasAccess) {
    redirect("/admin?error=insufficient_permissions");
  }

  return auth;
}
