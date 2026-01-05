/**
 * @fileoverview API route handlers for company management
 * @module app/api/admin/companies/route
 *
 * Handles GET (list companies) and POST (create company) operations.
 * All endpoints require authenticated user access.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/gateways/api";
import {
  getCompanies,
  createCompany,
} from "@/features/companies/lib/company-service";
import {
  companyQuerySchema,
  createCompanySchema,
} from "@/features/companies/schemas/company.schema";
import { z } from "zod";

/**
 * GET /api/admin/companies
 *
 * List companies with optional search, filters, and pagination.
 * Uses offset/limit pagination for infinite scroll support.
 *
 * Query parameters:
 * - offset: Number of records to skip (default: 0)
 * - limit: Maximum number of items per page (default: 20, max: 100)
 * - search: Search term (matches name)
 * - include_deleted: Include soft-deleted companies (default: false)
 *
 * @param request - Next.js request object
 * @returns JSON response with companies array and pagination info
 */
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = {
      offset: searchParams.get("offset") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      include_deleted: searchParams.get("include_deleted") ?? undefined,
    };

    const query = companyQuerySchema.parse(queryParams);

    // Fetch companies from service
    const { companies, total } = await getCompanies(query);

    // Calculate pagination metadata
    const hasNext = query.offset + query.limit < total;

    return NextResponse.json(
      {
        companies,
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
      const userMessage = error.message.includes("Failed to fetch")
        ? "Unable to retrieve companies. Please try again or contact support if the problem persists."
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
          "An unexpected error occurred while loading companies. Please try again or contact support if the problem persists.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/companies
 *
 * Create a new company.
 *
 * Request body:
 * - name: Company name (required)
 *
 * @param request - Next.js request object with company data in body
 * @returns JSON response with created company
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Parse and validate request body
    const validatedData = createCompanySchema.parse(body);

    // Create company via service
    const company = await createCompany(validatedData);

    return NextResponse.json({ company }, { status: 201 });
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

      // Company name already exists
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
