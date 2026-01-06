/**
 * @fileoverview API route handlers for user profile operations
 * @module app/api/auth/profile
 */

import { createClient } from "@/utils/supabase/server";
import { getProfile, updateProfile } from "@/lib/auth/profile";
import {
  updateProfileInputSchema,
  errorResponseSchema,
} from "@/features/auth/schemas/profile.schema";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";

/**
 * GET /api/auth/profile
 * Retrieves the current user's profile
 *
 * @returns JSON response with profile data or error
 */
export async function GET(): Promise<Response> {
  try {
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

    const profile = await getProfile();

    if (!profile) {
      return Response.json(
        errorResponseSchema.parse({
          error: "NOT_FOUND",
          message: "Profile not found",
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

/**
 * PUT /api/auth/profile
 * Updates the current user's profile
 *
 * @param request - Next.js request object with profile data in body
 * @returns JSON response with updated profile or error
 */
export async function PUT(request: NextRequest): Promise<Response> {
  try {
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

    const body = await request.json();

    // Validate request body with Zod schema
    const validatedData = updateProfileInputSchema.parse(body);

    // Update profile in database
    const profile = await updateProfile(validatedData);

    return Response.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return Response.json(
        errorResponseSchema.parse({
          error: "VALIDATION_ERROR",
          message: "Invalid profile data",
          details: { validation: error.errors },
        }),
        { status: 400 }
      );
    }

    return Response.json(
      errorResponseSchema.parse({
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to update profile",
      }),
      { status: 500 }
    );
  }
}
