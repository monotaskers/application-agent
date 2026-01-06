import { z } from "zod";

/**
 * Zod schema for validating application context.
 *
 * Represents the context information passed to the AI agent for contextual
 * assistance, including current page, user role, form data, and recent actions.
 *
 * @module schemas/context
 */
export const applicationContextSchema = z.object({
  currentPage: z.string().min(1, "Current page must be a non-empty string"),
  userRole: z.string().min(1, "User role must be a non-empty string"),
  userId: z.string().uuid("User ID must be a valid UUID"),
  formData: z.record(z.unknown()).optional(),
  recentActions: z.array(z.string()).optional(),
});

/**
 * TypeScript type inferred from application context schema.
 */
export type ApplicationContext = z.infer<typeof applicationContextSchema>;
