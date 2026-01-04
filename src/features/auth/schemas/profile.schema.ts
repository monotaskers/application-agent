import { z } from "zod";

/**
 * Schema for Profile entity from database
 * Matches the profiles table structure
 *
 * Note: Supabase returns PostgreSQL timestamps as strings.
 * We use z.coerce.date() to handle various timestamp formats and convert to Date,
 * then transform back to ISO string for consistency.
 */
export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  full_name: z.string().max(255).nullable(),
  bio: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  company_email: z.string().email().nullable(),
  phone: z.string().min(5).max(20).nullable(),
  dashboard_layout_preferences: z.record(z.unknown()).nullable(),
  created_at: z
    .union([z.string(), z.date()])
    .transform((val) => {
      // Convert to Date if string, then to ISO string
      const date = val instanceof Date ? val : new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toISOString();
    })
    .pipe(z.string().datetime()),
  updated_at: z
    .union([z.string(), z.date()])
    .transform((val) => {
      // Convert to Date if string, then to ISO string
      const date = val instanceof Date ? val : new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toISOString();
    })
    .pipe(z.string().datetime()),
});

/**
 * Schema for updating profile information
 * All fields are optional since users may only update specific fields
 */
export const updateProfileInputSchema = z.object({
  full_name: z.string().max(255).nullable().optional(),
  bio: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  company_email: z.string().email().nullable().optional(),
  phone: z.string().min(5).max(20).nullable().optional(),
  dashboard_layout_preferences: z.record(z.unknown()).nullable().optional(),
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
 * TypeScript types inferred from Zod schemas
 */
export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
