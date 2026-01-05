/**
 * @fileoverview Profile service functions for user profile operations
 * @module lib/auth/profile
 */

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  profileSchema,
  updateProfileInputSchema,
} from "@/features/auth/schemas/profile.schema";
import { DEFAULT_ROLE } from "@/features/auth/schemas/role.schema";
import type {
  Profile,
  UpdateProfileInput,
} from "@/features/auth/types/auth.types";
import { assignCompanyByEmail } from "@/features/companies/lib/company-service";

/**
 * Table name for profiles in Supabase
 */
const PROFILES_TABLE_NAME = "profiles";

/**
 * Retrieves the current user's profile
 *
 * @returns Promise resolving to Profile or null if not found
 * @throws Error if database query fails
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from(PROFILES_TABLE_NAME)
    .select("*")
    .eq("id", user.id)
    .is("deleted_at", null) // Only return active (non-deleted) profiles
    .single();

  if (error) {
    // Profile doesn't exist yet - return null
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return profileSchema.parse(data);
}

/**
 * Updates the current user's profile
 *
 * @param input - Profile update data
 * @returns Promise resolving to updated Profile
 * @throws Error if update fails or user is not authenticated
 */
export async function updateProfile(
  input: UpdateProfileInput
): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Validate input
  const validatedInput = updateProfileInputSchema.parse(input);

  const { data, error } = await supabase
    .from(PROFILES_TABLE_NAME)
    .update(validatedInput)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return profileSchema.parse(data);
}

/**
 * Creates a profile for the current user
 * Called automatically when a user signs up
 * Also sets default role 'member' in app_metadata
 *
 * @param input - Initial profile data (optional)
 * @returns Promise resolving to created Profile
 * @throws Error if creation fails or user is not authenticated
 */
export async function createProfile(
  input?: Partial<UpdateProfileInput>
): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Set default role in app_metadata for new users
  // Only set if role doesn't already exist
  if (!user.app_metadata?.role) {
    try {
      const adminClient = createAdminClient();
      await adminClient.auth.admin.updateUserById(user.id, {
        app_metadata: {
          ...user.app_metadata,
          role: DEFAULT_ROLE,
        },
      });
    } catch (error) {
      // Log but don't fail profile creation if role assignment fails
      // Role can be set manually later if needed
      console.warn(
        `Failed to set default role for user ${user.id}:`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  // Determine company assignment based on email domain
  const companyId = await assignCompanyByEmail(user.email);

  const profileData = {
    id: user.id,
    full_name: input?.full_name ?? null,
    bio: input?.bio ?? null,
    avatar_url: input?.avatar_url ?? null,
    company_email: input?.company_email ?? null,
    phone: input?.phone ?? null,
    dashboard_layout_preferences: input?.dashboard_layout_preferences ?? null,
    company_id: companyId,
  };

  const { data, error } = await supabase
    .from(PROFILES_TABLE_NAME)
    .insert(profileData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  return profileSchema.parse(data);
}
