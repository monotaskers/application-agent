/**
 * @fileoverview API route for assigning custom roles to users (superadmin only)
 * @module app/api/admin/users/[userId]/role
 */

import { NextRequest, NextResponse } from "next/server";
import { requireMinRole } from "@/lib/auth/gateways/server";
import { assignCustomRoleToUser } from "@/lib/auth/custom-roles";
import { errorResponseSchema } from "@/features/auth/schemas/custom-role.schema";
import { z } from "zod";

const assignRoleSchema = z.object({
  custom_role_id: z.string().uuid().nullable(),
});

/**
 * PUT /api/admin/users/[userId]/role
 * Assigns a custom role to a user (or removes it if null)
 * Requires: superadmin
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<Response> {
  try {
    await requireMinRole("superadmin");

    const { userId } = await params;
    const body = await request.json();
    const { custom_role_id } = assignRoleSchema.parse(body);

    const result = await assignCustomRoleToUser(userId, custom_role_id);

    if (!result.success) {
      return NextResponse.json(
        errorResponseSchema.parse({
          error: "ASSIGNMENT_ERROR",
          message: result.error.message,
        }),
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Role assigned successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        errorResponseSchema.parse({
          error: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: { validation: error.errors },
        }),
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponseSchema.parse({
        error: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to assign role",
      }),
      { status: 500 }
    );
  }
}
