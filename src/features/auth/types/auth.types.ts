/**
 * TypeScript types for authentication feature
 * Types are inferred from Zod schemas to ensure type safety
 */

import type {
  PasswordlessEmailInput,
  OtpVerificationInput,
} from "../schemas/auth.schema";
import type { Profile, UpdateProfileInput } from "../schemas/profile.schema";
import type { UserRole } from "../schemas/role.schema";
import type { User } from "@supabase/supabase-js";

export type {
  PasswordlessEmailInput,
  OtpVerificationInput,
  Profile,
  UpdateProfileInput,
  UserRole,
};

/**
 * Authenticated user with role information
 */
export interface AuthUser {
  user: User;
  role: UserRole;
}

/**
 * Auth context for gateways and utilities
 */
export interface AuthContext {
  user: User;
  role: UserRole;
}

/**
 * Limited profile information for viewing other users' profiles
 * Only includes fields visible to users with business relationships
 */
export interface LimitedProfile {
  id: string;
  full_name: string | null;
  company_email: string | null;
  phone: string | null;
  avatar_url: string | null;
}
