/**
 * @fileoverview API routes for custom role management (superadmin only)
 * @module app/api/admin/roles
 */

import { NextRequest, NextResponse } from "next/server";
import { requireMinRole } from "@/lib/auth/gateways/server";
import { listCustomRoles, createCustomRole } from "@/lib/auth/custom-roles";
import {
  createCustomRoleSchema,
  errorResponseSchema,
} from "@/features/auth/schemas/custom-role.schema";
import { z } from "zod";

/**
 * GET /api/admin/roles
 * Lists all custom roles
 * Requires: superadmin
 */
export async function GET(): Promise<Response> {
  try {
    await requireMinRole("superadmin");

    const roles = await listCustomRoles();

    return NextResponse.json({ roles }, { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return NextResponse.json(
      errorResponseSchema.parse({
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to list roles",
      }),
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/roles
 * Creates a new custom role
 * Requires: superadmin
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { user } = await requireMinRole("superadmin");

    const body = await request.json();
    const validatedInput = createCustomRoleSchema.parse(body);

    const role = await createCustomRole(validatedInput, user.id);

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        errorResponseSchema.parse({
          error: "VALIDATION_ERROR",
          message: "Invalid role data",
          details: { validation: error.errors },
        }),
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponseSchema.parse({
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to create role",
      }),
      { status: 500 }
    );
  }
}
