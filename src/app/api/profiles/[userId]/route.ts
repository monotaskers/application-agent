/**
 * @fileoverview API route handlers for viewing other users' profiles
 * @module app/api/profiles/[userId]
 */

import { createClient } from "@/utils/supabase/server";
import { fetchProfileServer } from "@/features/auth/lib/fetch-profile-server";
import { errorResponseSchema } from "@/features/auth/schemas/profile.schema";
import type { NextRequest } from "next/server";

/**
 * GET /api/profiles/[userId]
 * Retrieves limited profile information for another user
 *
 * Requires authentication.
 *
 * Returns 404 for unauthorized access (privacy protection).
 *
 * @param _request - Next.js request object (unused, but required by Next.js route signature)
 * @param params - Route parameters containing userId
 * @returns JSON response with limited profile data or error
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<Response> {
  try {
    const { userId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        errorResponseSchema.parse({
          error: "UNAUTHORIZED",
          message: "User not authenticated",
        }),
        { status: 401 }
      );
    }

    // Fetch profile with access control (viewerUserId = current user)
    const profile = await fetchProfileServer(userId, user.id);

    if (!profile) {
      // Return 404 for privacy protection (not found or access denied)
      return Response.json(
        errorResponseSchema.parse({
          error: "NOT_FOUND",
          message: "Profile not found or access denied",
        }),
        { status: 404 }
      );
    }

    return Response.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);

    return Response.json(
      errorResponseSchema.parse({
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch profile",
      }),
      { status: 500 }
    );
  }
}
