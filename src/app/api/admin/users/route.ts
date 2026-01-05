/**
 * @fileoverview API route handlers for user management
 * @module app/api/admin/users/route
 *
 * Handles GET (list users) and POST (create user) operations.
 * All endpoints require authenticated user access.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/gateways/api";
import { getUsers, createUser } from "@/features/users/lib/user-service";
import {
  userQuerySchema,
  createUserSchema,
} from "@/features/users/schemas/user.schema";
import { z } from "zod";
import { createAdminClient } from "@/utils/supabase/admin";

/**
 * GET /api/admin/users
 *
 * List users with optional search, filters, and pagination.
 * Uses offset/limit pagination for infinite scroll support.
 *
 * Query parameters:
 * - offset: Number of records to skip (default: 0)
 * - limit: Maximum number of items per page (default: 20, max: 100)
 * - search: Search term (matches name or email)
 * - role: Filter by role (member, admin, superadmin)
 * - company_id: Filter by company UUID
 * - include_deleted: Include soft-deleted users (default: false)
 *
 * @param request - Next.js request object
 * @param context - Authentication context from withAuth
 * @returns JSON response with users array and pagination info
 */
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = {
      offset: searchParams.get("offset") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      role: searchParams.get("role") ?? undefined,
      company_id: searchParams.get("company_id") ?? undefined,
      include_deleted: searchParams.get("include_deleted") ?? undefined,
    };

    const query = userQuerySchema.parse(queryParams);

    // Fetch users from service
    const { users, total } = await getUsers(query);

    // Calculate pagination metadata
    const hasNext = query.offset + query.limit < total;

    return NextResponse.json(
      {
        users,
        pagination: {
          offset: query.offset,
          limit: query.limit,
          total,
          has_next: hasNext,
        },
      },
      { status: 200 }
    );
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
          message: `Invalid query parameters. ${errorMessages.join(", ")}`,
          details: error.errors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Handle service errors
    if (error instanceof Error) {
      // Provide user-friendly error messages
      const userMessage = error.message.includes("Failed to fetch")
        ? "Unable to retrieve users. Please try again or contact support if the problem persists."
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
          "An unexpected error occurred while loading users. Please try again or contact support if the problem persists.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/users
 *
 * Create a new user account with optional inline company creation.
 * Sends a passwordless magic link to the user's email after creation.
 *
 * Request body:
 * - email: User email address (required)
 * - full_name: User's full name (optional)
 * - role: User role (member, admin, superadmin) (required)
 * - company_id: Existing company ID (optional, if company not provided)
 * - company: Inline company creation data (optional, if company_id not provided)
 *   - legal_name: Company legal name (required if creating company)
 *   - domain: Company domain (required if creating company, must match email domain)
 * - avatar_url: User avatar URL (optional)
 * - bio: User bio (optional)
 * - phone: User phone number (optional)
 * - company_email: User's company email (optional)
 *
 * @param request - Next.js request object with user data in body
 * @param context - Authentication context from withAuth
 * @returns JSON response with created user and optional company
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Parse and validate request body
    const validatedData = createUserSchema.parse(body);

    // Create user via service (handles inline company creation, validation, etc.)
    const user = await createUser(validatedData);

    // Send magic link to user's email
    const adminSupabase = createAdminClient();
    const { error: linkError } = await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email: user.email || validatedData.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
      },
    });

    // Log error but don't fail user creation if magic link fails
    if (linkError) {
      console.error("Failed to send magic link:", linkError);
      // Continue with user creation success even if magic link fails
    }

    // Return created user
    return NextResponse.json({ user }, { status: 201 });
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

    // Handle service errors (email uniqueness, domain validation, etc.)
    if (error instanceof Error) {
      // Check for specific error types
      const errorMessage = error.message.toLowerCase();

      // Email already exists
      if (
        errorMessage.includes("already in use") ||
        errorMessage.includes("already exists")
      ) {
        return NextResponse.json(
          {
            error: "CONFLICT",
            message: error.message,
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
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

      // Company domain uniqueness errors
      if (errorMessage.includes("company with domain")) {
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
});
