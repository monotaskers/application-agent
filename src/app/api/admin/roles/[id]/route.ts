/**
 * @fileoverview API routes for individual custom role operations (superadmin only)
 * @module app/api/admin/roles/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import { requireMinRole } from "@/lib/auth/gateways/server";
import {
  getCustomRole,
  updateCustomRole,
  deleteCustomRole,
} from "@/lib/auth/custom-roles";
import {
  createCustomRoleSchema,
  errorResponseSchema,
} from "@/features/auth/schemas/custom-role.schema";
import { z } from "zod";

/**
 * GET /api/admin/roles/[id]
 * Gets a specific custom role
 * Requires: superadmin
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireMinRole("superadmin");

    const { id } = await params;
    const role = await getCustomRole(id);

    if (!role) {
      return NextResponse.json(
        errorResponseSchema.parse({
          error: "NOT_FOUND",
          message: "Custom role not found",
        }),
        { status: 404 }
      );
    }

    return NextResponse.json({ role }, { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return NextResponse.json(
      errorResponseSchema.parse({
        error: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to get role",
      }),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/roles/[id]
 * Updates a custom role
 * Requires: superadmin
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireMinRole("superadmin");

    const { id } = await params;
    const body = await request.json();

    // Validate update input (all fields optional, but only description and permissions allowed)
    const updateInput: { description?: string; permissions?: string[] } = {};
    if (body.description !== undefined) {
      updateInput.description = body.description;
    }
    if (body.permissions !== undefined) {
      const validated = createCustomRoleSchema
        .partial()
        .parse({ permissions: body.permissions });
      if (validated.permissions) {
        updateInput.permissions = validated.permissions;
      }
    }

    const role = await updateCustomRole(id, updateInput);

    return NextResponse.json({ role }, { status: 200 });
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
          error instanceof Error ? error.message : "Failed to update role",
      }),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/roles/[id]
 * Deletes a custom role
 * Requires: superadmin
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireMinRole("superadmin");

    const { id } = await params;
    await deleteCustomRole(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return NextResponse.json(
      errorResponseSchema.parse({
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to delete role",
      }),
      { status: 500 }
    );
  }
}
