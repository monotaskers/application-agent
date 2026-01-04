/**
 * @fileoverview API route handler for restoring soft-deleted users
 * @module app/api/admin/users/[userId]/restore/route
 *
 * Handles POST (restore user) operation.
 * All endpoints require authenticated user access.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/gateways/api";
import { restoreUser } from "@/features/users/lib/soft-delete";

/**
 * POST /api/admin/users/{userId}/restore
 *
 * Restore a soft-deleted user account by clearing deleted_at timestamp.
 * Reinstates access to the account.
 *
 * @param request - Next.js request object
 * @param context - Route context with userId parameter
 * @returns JSON response with restored user or error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  // Extract userId from params before passing to withAuth
  const { userId } = await params;

  return withAuth(async (_request: NextRequest) => {
    try {
      // Restore user
      const user = await restoreUser(userId);

      return NextResponse.json({ user }, { status: 200 });
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

        // User is not deleted
        if (errorMessage.includes("not soft-deleted")) {
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
          message:
            "An unexpected error occurred while restoring the user. Please try again or contact support if the problem persists.",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  })(request);
}
