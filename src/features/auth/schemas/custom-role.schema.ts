import { z } from "zod";
import { ALL_PERMISSIONS, PERMISSIONS } from "@/lib/auth/permissions";

/**
 * Schema for custom role creation/update
 */
export const createCustomRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(100, "Role name must be less than 100 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Role name can only contain lowercase letters, numbers, hyphens, and underscores"
    ),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  permissions: z
    .array(z.string())
    .min(1, "At least one permission is required")
    .refine(
      (permissions) => {
        // Allow wildcard permission
        if (permissions.includes(PERMISSIONS.all)) {
          return permissions.length === 1; // Wildcard must be alone
        }
        // Validate all permissions exist
        return permissions.every((perm) =>
          ALL_PERMISSIONS.includes(perm as (typeof ALL_PERMISSIONS)[number])
        );
      },
      {
        message: "Invalid permissions provided",
      }
    ),
});

/**
 * Schema for custom role in database
 */
export const customRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  permissions: z.array(z.string()),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Error response schema for API routes
 */
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
});

/**
 * TypeScript types inferred from schemas
 */
export type CreateCustomRoleInput = z.infer<typeof createCustomRoleSchema>;
export type CustomRole = z.infer<typeof customRoleSchema>;
export type UpdateCustomRoleInput = Partial<
  Pick<CreateCustomRoleInput, "description" | "permissions">
>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
