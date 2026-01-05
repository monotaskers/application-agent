/**
 * @fileoverview Server-side utility for fetching user data
 * @module features/users/lib/fetch-user-server
 */

import { z } from "zod";
import { getUserById } from "./user-service";
import type { User } from "../types/user.types";

/**
 * UUID validation schema for user ID
 */
const UserIdSchema = z.string().uuid("User ID must be a valid UUID");

/**
 * Server-side function to fetch a user by ID
 *
 * Fetches user data directly from the database using the user service,
 * bypassing API routes.
 *
 * @param id - User ID (UUID)
 * @returns Promise resolving to User if found, null if not found
 * @throws Error for invalid UUID or database errors
 *
 * @example
 * ```ts
 * const user = await fetchUserServer("e79f5e8e-7e19-4f78-97f4-eba979362d39");
 * if (!user) {
 *   // User not found
 * }
 * ```
 */
export async function fetchUserServer(id: string): Promise<User | null> {
  // Validate user ID format
  const validatedId = UserIdSchema.parse(id);

  // Fetch user from service layer
  const user = await getUserById(validatedId);

  return user;
}
