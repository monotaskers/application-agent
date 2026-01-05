/**
 * @fileoverview API route handlers for company detail and update operations
 * @module app/api/admin/companies/[companyId]/route
 *
 * Handles GET (company detail), PUT (update company), and DELETE (soft delete company) operations.
 * All endpoints require authenticated user access.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/gateways/api";
import { updateCompany, softDeleteCompany } from "@/features/companies/lib/company-service";
import { updateCompanySchema } from "@/features/companies/schemas/company.schema";
import { fetchCompanyServer } from "@/features/companies/lib/fetch-company-server";
import { z } from "zod";

/**
 * GET /api/admin/companies/{companyId}
 *
 * Retrieve detailed information about a specific company.
 *
 * @param request - Next.js request object
 * @param context - Route context with companyId parameter
 * @returns JSON response with company detail or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
): Promise<NextResponse> {
  const { companyId } = await params;

  return withAuth(async (_request: NextRequest, { user: _authUser }) => {
    try {
      // Fetch company using shared utility
      const company = await fetchCompanyServer(companyId);

      if (!company) {
        return NextResponse.json(
          {
            error: "NOT_FOUND",
            message: "Company not found",
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );
      }

      return NextResponse.json({ company }, { status: 200 });
    } catch (error) {
      // Handle service errors
      if (error instanceof Error) {
        const userMessage = error.message.includes("Failed to fetch")
          ? "Unable to retrieve company details. Please try again or contact support if the problem persists."
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
            "An unexpected error occurred while loading company details. Please try again or contact support if the problem persists.",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  })(request);
}

/**
 * PUT /api/admin/companies/{companyId}
 *
 * Update company information.
 * Handles concurrent edit detection.
 *
 * Request body:
 * - name: Company name (optional)
 *
 * @param request - Next.js request object with update data in body
 * @param context - Route context with companyId parameter
 * @returns JSON response with updated company or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
): Promise<NextResponse> {
  const { companyId } = await params;

  return withAuth(async (request: NextRequest, { user: _authUser }) => {
    try {
      const body = await request.json();

      // Parse and validate request body
      const validatedData = updateCompanySchema.parse(body);

      // Update company via service
      const { company, conflict } = await updateCompany(companyId, validatedData);

      // Return updated company with conflict flag
      return NextResponse.json({ company, conflict }, { status: 200 });
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
            message: `Invalid company data. ${errorMessages.join(", ")}`,
            details: error.errors,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      // Handle service errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // Company not found
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

        // Company name already exists
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
 * DELETE /api/admin/companies/{companyId}
 *
 * Soft delete a company by setting deleted_at timestamp.
 * Preserves all data but marks company as deleted.
 *
 * @param request - Next.js request object
 * @param context - Route context with companyId parameter
 * @returns JSON response with success message or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
): Promise<NextResponse> {
  const { companyId } = await params;

  return withAuth(async (_request: NextRequest, { user: _authUser }) => {
    try {
      // Soft delete company
      await softDeleteCompany(companyId);

      return NextResponse.json(
        {
          message: "Company deleted successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      // Handle service errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // Company not found
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

        // Company already deleted
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

