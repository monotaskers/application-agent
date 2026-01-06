/**
 * @fileoverview Server-side utility for fetching profile data
 * @module features/auth/lib/fetch-profile-server
 */

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { profileSchema } from "../schemas/profile.schema";
import type { Profile } from "../types/auth.types";
import type { LimitedProfile } from "../types/auth.types";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * UUID validation schema for profile ID
 */
const ProfileIdSchema = z.string().uuid("Profile ID must be a valid UUID");

/**
 * Server-side function to fetch a profile by ID
 *
 * Fetches profile data directly from Supabase, bypassing API routes.
 *
 * @param id - Profile ID (UUID)
 * @param viewerUserId - Optional viewer user ID for access control (if viewing another user's profile)
 * @param supabaseClient - Optional Supabase client (for testing/caching)
 * @returns Promise resolving to Profile or LimitedProfile if found, null if not found or access denied
 * @throws Error for invalid UUID or database errors
 *
 * @example
 * ```ts
 * // Fetch own profile
 * const profile = await fetchProfileServer(user.id);
 *
 * // Fetch another user's profile (with access control)
 * const limitedProfile = await fetchProfileServer(otherUserId, currentUserId);
 * ```
 */
export async function fetchProfileServer(
  id: string,
  viewerUserId?: string,
  supabaseClient?: SupabaseClient
): Promise<Profile | LimitedProfile | null> {
  // Validate profile ID format
  const validatedId = ProfileIdSchema.parse(id);

  // Use provided client or create new one
  const supabase = supabaseClient ?? (await createClient());

  // Fetch profile from database
  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", validatedId)
    .is("deleted_at", null) // Only return active (non-deleted) profiles
    .single();

  if (error) {
    // Handle not found error (PGRST116 is Supabase's "no rows returned" error)
    if (error.code === "PGRST116") {
      return null;
    }

    // Log and throw for other errors
    console.error("Error fetching profile:", error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  if (!profileData) {
    return null;
  }

  // If viewing own profile, return full profile
  if (!viewerUserId || viewerUserId === validatedId) {
    return profileSchema.parse(profileData);
  }

  // If viewing another user's profile, return limited profile
  // Access control can be added here based on new project requirements
  const limitedProfile: LimitedProfile = {
    id: profileData.id,
    full_name: profileData.full_name,
    phone: profileData.phone,
    avatar_url: profileData.avatar_url,
    title: (profileData as { title?: string | null }).title || null,
  };

  return limitedProfile;
}
