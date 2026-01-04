/**
 * @fileoverview Server Component authentication and authorization utilities
 * @module lib/auth/gateways/components
 *
 * Provides utilities for enforcing authentication and authorization
 * in Server Components with proper redirects.
 */

import { requireAuth, requireRole, requireMinRole } from "./server";
import type { UserRole } from "@/features/auth/schemas/role.schema";
import type { AuthResult } from "./server";

/**
 * Ensures user is authenticated in a Server Component
 * Redirects to sign-in if not authenticated
 *
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 *
 * @example
 * ```typescript
 * // In a Server Component
 * export default async function DashboardPage() {
 *   const { user, role } = await requireAuthServer();
 *   return <div>Welcome {user.email}</div>;
 * }
 * ```
 */
export async function requireAuthServer(): Promise<AuthResult> {
  return await requireAuth();
}

/**
 * Ensures user has a specific role in a Server Component
 * Redirects if user is not authenticated or doesn't have the role
 *
 * @param role - Role required to access the component
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /admin if role insufficient
 *
 * @example
 * ```typescript
 * // In an admin Server Component
 * export default async function AdminPage() {
 *   const { user, role } = await requireRoleServer('admin');
 *   return <div>Admin Dashboard</div>;
 * }
 * ```
 */
export async function requireRoleServer(role: UserRole): Promise<AuthResult> {
  return await requireRole(role);
}

/**
 * Ensures user has minimum role level in a Server Component
 * Redirects if user is not authenticated or doesn't meet minimum role
 *
 * @param minRole - Minimum role required
 * @returns Promise resolving to AuthResult with user and role
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to /admin if role insufficient
 *
 * @example
 * ```typescript
 * // Require admin or higher
 * export default async function AdminPage() {
 *   const { user, role } = await requireMinRoleServer('admin');
 *   return <div>Admin Content</div>;
 * }
 * ```
 */
export async function requireMinRoleServer(
  minRole: UserRole
): Promise<AuthResult> {
  return await requireMinRole(minRole);
}
