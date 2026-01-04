/**
 * @fileoverview API route authentication and authorization wrappers
 * @module lib/auth/gateways/api
 *
 * Provides wrapper functions for API route handlers with consistent
 * error responses and type safety.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  requireAuth,
  requireRole,
  requireMinRole,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  type AuthResult,
} from "./server";
import type { UserRole } from "@/features/auth/schemas/role.schema";
import type { Permission } from "@/lib/auth/permissions";

/**
 * Error response schema for API routes
 */
interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}

/**
 * Creates a standardized error response
 *
 * @param error - Error code
 * @param message - Error message
 * @param status - HTTP status code
 * @returns NextResponse with error JSON
 */
function createErrorResponse(
  error: string,
  message: string,
  status: number
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Type for API route handler with auth context
 */
type AuthenticatedHandler = (
  request: NextRequest,
  context: AuthResult
) => Promise<NextResponse>;

/**
 * Wraps an API route handler to require authentication
 *
 * @param handler - API route handler function
 * @returns Wrapped handler that ensures authentication
 *
 * @example
 * ```typescript
 * export const GET = withAuth(async (request, { user, role }) => {
 *   return NextResponse.json({ userId: user.id });
 * });
 * ```
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const auth = await requireAuth();
      return await handler(request, auth);
    } catch (error) {
      if (error instanceof Response) {
        // Redirect was thrown, return it
        return error as NextResponse;
      }
      return createErrorResponse(
        "UNAUTHORIZED",
        "Authentication required",
        401
      );
    }
  };
}

/**
 * Wraps an API route handler to require a specific role
 *
 * @param requiredRole - Role required to access the route
 * @param handler - API route handler function
 * @returns Wrapped handler that ensures role
 *
 * @example
 * ```typescript
 * export const GET = withRole('admin', async (request, { user, role }) => {
 *   return NextResponse.json({ adminData: '...' });
 * });
 * ```
 */
export function withRole(
  requiredRole: UserRole,
  handler: AuthenticatedHandler
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const auth = await requireRole(requiredRole);
      return await handler(request, auth);
    } catch (error) {
      if (error instanceof Response) {
        // Redirect was thrown, return it
        return error as NextResponse;
      }
      return createErrorResponse(
        "FORBIDDEN",
        `Role '${requiredRole}' required`,
        403
      );
    }
  };
}

/**
 * Wraps an API route handler to require minimum role level
 *
 * @param minRole - Minimum role required
 * @param handler - API route handler function
 * @returns Wrapped handler that ensures minimum role
 *
 * @example
 * ```typescript
 * export const GET = withMinRole('admin', async (request, { user, role }) => {
 *   return NextResponse.json({ adminData: '...' });
 * });
 * ```
 */
export function withMinRole(minRole: UserRole, handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const auth = await requireMinRole(minRole);
      return await handler(request, auth);
    } catch (error) {
      if (error instanceof Response) {
        // Redirect was thrown, return it
        return error as NextResponse;
      }
      return createErrorResponse(
        "FORBIDDEN",
        `Minimum role '${minRole}' required`,
        403
      );
    }
  };
}

/**
 * Wraps an API route handler to require a specific permission
 *
 * @param permission - Permission required to access the route
 * @param handler - API route handler function
 * @returns Wrapped handler that ensures permission
 *
 * @example
 * ```typescript
 * export const DELETE = withPermission(
 *   PERMISSIONS.users.delete,
 *   async (request, { user, role }) => {
 *     // User has delete permission
 *   }
 * );
 * ```
 */
export function withPermission(
  permission: Permission,
  handler: AuthenticatedHandler
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const auth = await requirePermission(permission);
      return await handler(request, auth);
    } catch (error) {
      if (error instanceof Response) {
        return error as NextResponse;
      }
      return createErrorResponse(
        "FORBIDDEN",
        `Permission '${permission}' required`,
        403
      );
    }
  };
}

/**
 * Wraps an API route handler to require any of the specified permissions
 *
 * @param permissions - Array of permissions (user needs at least one)
 * @param handler - API route handler function
 * @returns Wrapped handler that ensures at least one permission
 */
export function withAnyPermission(
  permissions: Permission[],
  handler: AuthenticatedHandler
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const auth = await requireAnyPermission(permissions);
      return await handler(request, auth);
    } catch (error) {
      if (error instanceof Response) {
        return error as NextResponse;
      }
      return createErrorResponse("FORBIDDEN", "Insufficient permissions", 403);
    }
  };
}

/**
 * Wraps an API route handler to require all of the specified permissions
 *
 * @param permissions - Array of permissions (user needs all)
 * @param handler - API route handler function
 * @returns Wrapped handler that ensures all permissions
 */
export function withAllPermissions(
  permissions: Permission[],
  handler: AuthenticatedHandler
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const auth = await requireAllPermissions(permissions);
      return await handler(request, auth);
    } catch (error) {
      if (error instanceof Response) {
        return error as NextResponse;
      }
      return createErrorResponse("FORBIDDEN", "Insufficient permissions", 403);
    }
  };
}
