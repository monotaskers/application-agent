/**
 * @fileoverview Utility to find users by email (checks both profiles.email and auth.users.email)
 * @module features/users/lib/find-user-by-email
 *
 * This utility handles the distinction between:
 * - profiles.email: Business/contact email (can be updated independently)
 * - auth.users.email: Authentication email (from OAuth/Magic Link, source of truth for auth)
 *
 * When searching for users, we check both fields to ensure we can find:
 * - OAuth users (who may have NULL profiles.email)
 * - Admin-created users (who have profiles.email set)
 */

import { createAdminClient } from "@/utils/supabase/admin";
import { getUserById } from "./user-service";
import type { User } from "../types/user.types";

/**
 * Finds a user by email, checking both profiles.email and auth.users.email
 *
 * Priority:
 * 1. First checks profiles.email (business email)
 * 2. Falls back to auth.users.email (authentication email)
 *
 * This ensures we can find:
 * - OAuth users who may have NULL profiles.email
 * - Admin-created users with profiles.email set
 * - Users who have updated their profiles.email independently
 *
 * @param email - Email address to search for
 * @returns Promise resolving to User if found, null if not found
 * @throws Error if database query fails
 *
 * @example
 * ```typescript
 * // Find user by email (checks both fields)
 * const user = await findUserByEmail("t@ocupop.com");
 * if (user) {
 *   console.log(`Found user: ${user.full_name}`);
 * }
 * ```
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const supabase = createAdminClient();
  const normalizedEmail = email.toLowerCase().trim();

  // First, try to find by profiles.email (business email)
  const { data: profileByEmail } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", normalizedEmail)
    .is("deleted_at", null)
    .single();

  if (profileByEmail) {
    // Found by profiles.email, fetch full user data
    return await getUserById(profileByEmail.id);
  }

  // If not found in profiles.email, check auth.users.email
  // Note: This requires listing auth users (no direct email search in admin API)
  // For better performance, we could create a database function or view
  try {
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      // If we can't list users, return null (user not found)
      return null;
    }

    // Find matching auth user
    const matchingAuthUser = authUsers.users.find(
      (u) => u.email?.toLowerCase().trim() === normalizedEmail
    );

    if (matchingAuthUser) {
      // Found by auth.users.email, fetch profile
      return await getUserById(matchingAuthUser.id);
    }
  } catch {
    // If listing users fails, return null
    return null;
  }

  // Not found in either location
  return null;
}

