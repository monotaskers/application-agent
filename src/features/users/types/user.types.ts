/**
 * @fileoverview TypeScript types for User entity
 * @module features/users/types/user.types
 */

import type { UserRole } from "@/features/auth/schemas/role.schema";
import type { Tables } from "@/types/database.types";

/**
 * User profile data from profiles table
 * Extends the database type with additional computed fields
 */
export type UserProfile = Tables<"profiles"> & {
  deleted_at: string | null;
};

/**
 * Complete user entity combining auth.users and profiles data
 */
export interface User {
  id: string;
  email: string | null;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  company_email: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * User role enum values
 */
export type UserRoleType = UserRole;
