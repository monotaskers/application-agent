import {
  applicationContextSchema,
  type ApplicationContext,
} from "./schemas/context.schema";

/**
 * Builds an ApplicationContext object from gathered context data.
 *
 * Validates the context data against the ApplicationContext Zod schema
 * to ensure type safety and data integrity before passing to the AI agent.
 *
 * @param data - Raw context data to build into ApplicationContext
 * @returns Validated ApplicationContext object
 * @throws {z.ZodError} If context data is invalid
 *
 * @example
 * ```typescript
 * const context = buildApplicationContext({
 *   currentPage: "/admin/users",
 *   userRole: "admin",
 *   userId: "123e4567-e89b-12d3-a456-426614174000",
 *   formData: { name: "User Name" },
 *   recentActions: ["viewed_users"],
 * });
 * ```
 */
export function buildApplicationContext(data: {
  currentPage: string;
  userRole: string;
  userId: string;
  formData?: Record<string, unknown>;
  recentActions?: string[];
}): ApplicationContext {
  return applicationContextSchema.parse(data);
}
