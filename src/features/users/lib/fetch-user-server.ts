/**
 * @fileoverview Server-side utility for fetching user data
 * @module features/users/lib/fetch-user-server
 */

import { z } from "zod";
import { getUserById } from "./user-service";
import type { User } from "../types/user.types";
import type { LimitedProfile } from "@/features/auth/types/auth.types";

/**
 * UUID validation schema for user ID
 */
const UserIdSchema = z.string().uuid("User ID must be a valid UUID");

/**
 * Options for fetching user data
 */
export interface FetchUserOptions {
  /** Optional viewer user ID for access control (if viewing another user's profile) */
  viewerUserId?: string;
  /** Whether to return limited profile data (for non-admin viewers) */
  limitedView?: boolean;
}

/**
 * Server-side function to fetch a user by ID
 *
 * Fetches user data directly from the database using the user service,
 * bypassing API routes. Supports both full admin view and limited profile view.
 *
 * @param id - User ID (UUID)
 * @param options - Optional configuration for access control and view mode
 * @returns Promise resolving to User or LimitedProfile if found, null if not found
 * @throws Error for invalid UUID or database errors
 *
 * @example
 * ```ts
 * // Full admin view
 * const user = await fetchUserServer("e79f5e8e-7e19-4f78-97f4-eba979362d39");
 *
 * // Limited profile view
 * const profile = await fetchUserServer(userId, {
 *   viewerUserId: currentUserId,
 *   limitedView: true
 * });
 * ```
 */
export async function fetchUserServer(
  id: string,
  options?: FetchUserOptions
): Promise<User | LimitedProfile | null> {
  // Validate user ID format
  const validatedId = UserIdSchema.parse(id);

  // Fetch user from service layer
  const user = await getUserById(validatedId);

  if (!user) {
    return null;
  }

  // If viewing own profile or admin view, return full user data
  if (!options?.limitedView || !options?.viewerUserId || options.viewerUserId === validatedId) {
    return user;
  }

  // Return limited profile data for non-admin viewers
  // Access control can be added here based on business relationships
  const limitedProfile: LimitedProfile = {
    id: user.id,
    full_name: user.full_name,
    phone: user.phone,
    avatar_url: user.avatar_url,
    title: user.title,
  };

  return limitedProfile;
}
