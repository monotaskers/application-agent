/**
 * @fileoverview Zod schemas for User validation
 * @module features/users/schemas/user.schema
 */

import { z } from "zod";
import { UserRoleSchema } from "@/features/auth/schemas/role.schema";

/**
 * Schema for creating a new user
 * Validates user creation input
 */
export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  full_name: z.string().max(255).nullable().optional(),
  role: UserRoleSchema,
  avatar_url: z
    .string()
    .url("Avatar URL must be a valid URL")
    .nullable()
    .optional(),
  bio: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  company_email: z
    .string()
    .email("Company email must be a valid email")
    .nullable()
    .optional(),
});

/**
 * Schema for updating an existing user
 * All fields are optional except validation rules
 */
export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  full_name: z.string().max(255).nullable().optional(),
  role: UserRoleSchema.optional(),
  avatar_url: z
    .string()
    .url("Avatar URL must be a valid URL")
    .nullable()
    .optional(),
  bio: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  company_email: z
    .string()
    .email("Company email must be a valid email")
    .nullable()
    .optional(),
  // Optional updated_at for optimistic locking (concurrent edit detection)
  updated_at: z.string().datetime().optional(),
});

/**
 * Schema for querying users (list/search/filter)
 * Used for GET /api/admin/users endpoint
 */
export const userQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: UserRoleSchema.optional(),
  include_deleted: z.coerce.boolean().default(false),
});

/**
 * TypeScript types inferred from schemas
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
