import { z } from "zod";

/**
 * User role enum schema
 * Defines the three role levels in the system
 */
export const UserRoleSchema = z.enum(["member", "admin", "superadmin"]);

/**
 * TypeScript type for user roles
 */
export type UserRole = z.infer<typeof UserRoleSchema>;

/**
 * Role hierarchy mapping
 * Higher numbers indicate higher privilege levels
 * Used for role comparison and minimum role checks
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  member: 1,
  admin: 2,
  superadmin: 3,
} as const;

/**
 * Default role assigned to new users
 */
export const DEFAULT_ROLE: UserRole = "member";

/**
 * Validates a role string and returns a UserRole
 *
 * @param role - Role string to validate
 * @returns Validated UserRole or throws ZodError
 * @throws {z.ZodError} If role is invalid
 *
 * @example
 * ```typescript
 * const role = validateRole("admin"); // Returns "admin"
 * const invalid = validateRole("invalid"); // Throws ZodError
 * ```
 */
export function validateRole(role: unknown): UserRole {
  return UserRoleSchema.parse(role);
}

/**
 * Safely validates a role string and returns result
 *
 * @param role - Role string to validate
 * @returns Success result with UserRole or error details
 *
 * @example
 * ```typescript
 * const result = safeValidateRole("admin");
 * if (result.success) {
 *   console.log(result.data); // "admin"
 * }
 * ```
 */
export function safeValidateRole(
  role: unknown
): { success: true; data: UserRole } | { success: false; error: z.ZodError } {
  const result = UserRoleSchema.safeParse(role);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
