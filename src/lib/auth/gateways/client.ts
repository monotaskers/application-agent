/**
 * @fileoverview Client-side authentication and authorization hooks
 * @module lib/auth/gateways/client
 *
 * Provides React hooks for authentication and authorization in Client Components.
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getUserRole, hasRole, hasMinRole } from "@/lib/auth/roles";
import {
  hasPermissionClient,
  getUserPermissionsClient,
} from "@/lib/auth/permission-checker-client";
import type { Permission } from "@/lib/auth/permissions";
import type { UserRole } from "@/features/auth/schemas/role.schema";
import type { User } from "@supabase/supabase-js";

/**
 * Auth state for client components
 */
export interface AuthState {
  user: User | null;
  role: UserRole;
  loading: boolean;
}

/**
 * Hook to get current user and role
 * Does not redirect, useful for conditional rendering
 *
 * @returns AuthState with user, role, and loading status
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { user, role, loading } = useAuth();
 *   if (loading) return <div>Loading...</div>;
 *   if (!user) return <div>Not signed in</div>;
 *   return <div>Welcome {user.email}</div>;
 * }
 * ```
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const role = useMemo(() => getUserRole(user), [user]);

  return { user, role, loading };
}

/**
 * Hook that redirects if user is not authenticated
 * Useful for protecting entire components
 *
 * @param redirectTo - Path to redirect to if not authenticated (default: /auth/sign-in)
 *
 * @example
 * ```typescript
 * function ProtectedComponent() {
 *   useRequireAuth();
 *   return <div>Protected content</div>;
 * }
 * ```
 */
export function useRequireAuth(redirectTo = "/auth/sign-in"): void {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);
}

/**
 * Hook that redirects if user doesn't have required role
 * Useful for role-protected components
 *
 * @param requiredRole - Role required to access the component
 * @param redirectTo - Path to redirect to if role insufficient (default: /admin)
 *
 * @example
 * ```typescript
 * function AdminPanel() {
 *   useRequireRole('admin');
 *   return <div>Admin content</div>;
 * }
 * ```
 */
export function useRequireRole(
  requiredRole: UserRole,
  redirectTo = "/admin?error=insufficient_permissions"
): void {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/sign-in");
      } else if (!hasRole(user, requiredRole)) {
        router.push(redirectTo);
      }
    }
  }, [user, role, loading, requiredRole, router, redirectTo]);
}

/**
 * Hook that redirects if user doesn't meet minimum role
 * Useful for components that require admin or higher
 *
 * @param minRole - Minimum role required
 * @param redirectTo - Path to redirect to if role insufficient (default: /admin)
 *
 * @example
 * ```typescript
 * function AdminContent() {
 *   useRequireMinRole('admin');
 *   return <div>Admin or superadmin content</div>;
 * }
 * ```
 */
export function useRequireMinRole(
  minRole: UserRole,
  redirectTo = "/admin?error=insufficient_permissions"
): void {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/sign-in");
      } else if (!hasMinRole(user, minRole)) {
        router.push(redirectTo);
      }
    }
  }, [user, role, loading, minRole, router, redirectTo]);
}

/**
 * Hook that returns boolean indicating if user has a specific role
 * Useful for conditional rendering
 *
 * @param role - Role to check for
 * @returns true if user has the role, false otherwise
 *
 * @example
 * ```typescript
 * function Dashboard() {
 *   const isAdmin = useHasRole('admin');
 *   return (
 *     <>
 *       <StandardContent />
 *       {isAdmin && <AdminPanel />}
 *     </>
 *   );
 * }
 * ```
 */
export function useHasRole(role: UserRole): boolean {
  const { user } = useAuth();
  return useMemo(() => hasRole(user, role), [user, role]);
}

/**
 * Hook that returns boolean indicating if user meets minimum role
 * Useful for conditional rendering
 *
 * @param minRole - Minimum role to check for
 * @returns true if user meets minimum role, false otherwise
 *
 * @example
 * ```typescript
 * function Dashboard() {
 *   const canAccessAdmin = useHasMinRole('admin');
 *   return (
 *     <>
 *       <StandardContent />
 *       {canAccessAdmin && <AdminContent />}
 *     </>
 *   );
 * }
 * ```
 */
export function useHasMinRole(minRole: UserRole): boolean {
  const { user } = useAuth();
  return useMemo(() => hasMinRole(user, minRole), [user, minRole]);
}

/**
 * Hook that returns boolean indicating if user has a specific permission
 * Useful for conditional rendering based on permissions
 *
 * @param permission - Permission to check for
 * @returns true if user has the permission, false otherwise
 *
 * @example
 * ```typescript
 * function UserManagement() {
 *   const canDelete = useHasPermission(PERMISSIONS.users.delete);
 *   return (
 *     <>
 *       <UserList />
 *       {canDelete && <DeleteButton />}
 *     </>
 *   );
 * }
 * ```
 */
export function useHasPermission(permission: Permission): boolean {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    // Use client-safe permission check (synchronous, only checks system roles)
    const result = hasPermissionClient(user, permission);
    setHasAccess(result);
    setLoading(false);
  }, [user, permission]);

  return hasAccess;
}

/**
 * Hook that returns all user permissions
 * Useful for complex permission checks
 *
 * @returns Array of permissions the user has, or empty array if loading/not authenticated
 *
 * @example
 * ```typescript
 * function Dashboard() {
 *   const permissions = usePermissions();
 *   const canManageUsers = permissions.includes(PERMISSIONS.users.edit);
 *   return <div>{canManageUsers && <UserManagement />}</div>;
 * }
 * ```
 */
export function usePermissions(): Permission[] {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    // Use client-safe permission check (synchronous, only checks system roles)
    const perms = getUserPermissionsClient(user);
    setPermissions(perms);
    setLoading(false);
  }, [user]);

  return permissions;
}
