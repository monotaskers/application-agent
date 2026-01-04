/**
 * @fileoverview API route handlers for user detail and update operations
 * @module app/api/admin/users/[userId]/route
 *
 * Handles GET (user detail) and PUT (update user) operations.
 * All endpoints require authenticated user access.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/gateways/api";
import { updateUser } from "@/features/users/lib/user-service";
import { updateUserSchema } from "@/features/users/schemas/user.schema";
import { softDeleteUser } from "@/features/users/lib/soft-delete";
import { fetchUserServer } from "@/features/users/lib/fetch-user-server";
import { z } from "zod";

/**
 * GET /api/admin/users/{userId}
 *
 * Retrieve detailed information about a specific user.
 *
 * @param request - Next.js request object
 * @param context - Route context with userId parameter
 * @returns JSON response with user detail or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  // Extract userId from params before passing to withAuth
  const { userId } = await params;

  return withAuth(async (_request: NextRequest, { user: _authUser }) => {
    try {
      // Fetch user using shared utility
      const user = await fetchUserServer(userId);

      if (!user) {
        return NextResponse.json(
          {
            error: "NOT_FOUND",
            message: "User not found",
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );
      }

      return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
      // Handle service errors
      if (error instanceof Error) {
        const userMessage = error.message.includes("Failed to fetch")
          ? "Unable to retrieve user details. Please try again or contact support if the problem persists."
          : error.message;

        return NextResponse.json(
          {
            error: "INTERNAL_SERVER_ERROR",
            message: userMessage,
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }

      // Unknown error
      return NextResponse.json(
        {
          error: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while loading user details. Please try again or contact support if the problem persists.",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  })(request);
}

/**
 * PUT /api/admin/users/{userId}
 *
 * Update user profile information, role, or company association.
 * Handles email domain validation, company validation, and concurrent edit detection.
 *
 * Request body:
 * - email: User email address (optional)
 * - full_name: User's full name (optional)
 * - role: User role (optional)
 * - company_id: Company ID (optional)
 * - company: Inline company creation data (optional)
 * - avatar_url: User avatar URL (optional)
 * - bio: User bio (optional)
 * - phone: User phone number (optional)
 * - company_email: User's company email (optional)
 *
 * @param request - Next.js request object with update data in body
 * @param context - Route context with userId parameter
 * @returns JSON response with updated user or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  // Extract userId from params before passing to withAuth
  const { userId } = await params;

  return withAuth(async (request: NextRequest, { user: _authUser }) => {
    try {
      const body = await request.json();

      // Parse and validate request body
      const validatedData = updateUserSchema.parse(body);

      // Update user via service (handles validation, domain matching, etc.)
      const { user, conflict } = await updateUser(userId, validatedData);

      // Return updated user with conflict flag
      return NextResponse.json({ user, conflict }, { status: 200 });
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((e) => {
          const field = e.path.join(".");
          return `${field}: ${e.message}`;
        });
        return NextResponse.json(
          {
            error: "VALIDATION_ERROR",
            message: `Invalid user data. ${errorMessages.join(", ")}`,
            details: error.errors,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // Handle service errors (validation, not found, etc.)
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // User not found
        if (errorMessage.includes("not found")) {
          return NextResponse.json(
            {
              error: "NOT_FOUND",
              message: error.message,
              timestamp: new Date().toISOString(),
            },
            { status: 404 }
          );
        }

        // Company association required
        if (errorMessage.includes("company association is required")) {
          return NextResponse.json(
            {
              error: "VALIDATION_ERROR",
              message: error.message,
              timestamp: new Date().toISOString(),
            },
            { status: 400 }
          );
        }

        // Soft-deleted company
        if (errorMessage.includes("soft-deleted company")) {
          return NextResponse.json(
            {
              error: "VALIDATION_ERROR",
              message: error.message,
              timestamp: new Date().toISOString(),
            },
            { status: 400 }
          );
        }

        // Email domain validation errors
        if (errorMessage.includes("domain must match")) {
          return NextResponse.json(
            {
              error: "VALIDATION_ERROR",
              message: error.message,
              timestamp: new Date().toISOString(),
            },
            { status: 400 }
          );
        }

        // Email uniqueness errors
        if (errorMessage.includes("already in use")) {
          return NextResponse.json(
            {
              error: "CONFLICT",
              message: error.message,
              timestamp: new Date().toISOString(),
            },
            { status: 409 }
          );
        }

        // Generic service error
        return NextResponse.json(
          {
            error: "INTERNAL_SERVER_ERROR",
            message: error.message,
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }

      // Unknown error
      return NextResponse.json(
        {
          error: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  })(request);
}

/**
 * DELETE /api/admin/users/{userId}
 *
 * Soft delete a user account by setting deleted_at timestamp.
 * Prevents self-deletion. Preserves all data but revokes access.
 *
 * @param request - Next.js request object
 * @param context - Route context with userId parameter
 * @returns JSON response with success message or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  // Extract userId from params before passing to withAuth
  const { userId } = await params;

  return withAuth(async (_request: NextRequest, { user: authUser }) => {
    try {
      // Prevent self-deletion
      if (authUser.id === userId) {
        return NextResponse.json(
          {
            error: "VALIDATION_ERROR",
            message: "Cannot delete your own account",
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // Soft delete user
      await softDeleteUser(userId);

      return NextResponse.json(
        {
          message: "User deleted successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      // Handle service errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // User not found
        if (errorMessage.includes("not found")) {
          return NextResponse.json(
            {
              error: "NOT_FOUND",
              message: error.message,
              timestamp: new Date().toISOString(),
            },
            { status: 404 }
          );
        }

        // User already deleted
        if (errorMessage.includes("already soft-deleted")) {
          return NextResponse.json(
            {
              error: "VALIDATION_ERROR",
              message: error.message,
              timestamp: new Date().toISOString(),
            },
            { status: 400 }
          );
        }

        // Generic service error
        return NextResponse.json(
          {
            error: "INTERNAL_SERVER_ERROR",
            message: error.message,
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }

      // Unknown error
      return NextResponse.json(
        {
          error: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  })(request);
}
