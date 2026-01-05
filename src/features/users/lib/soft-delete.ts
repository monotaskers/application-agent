/**
 * @fileoverview Soft delete utilities for user management
 * @module features/users/lib/soft-delete
 */

import { createAdminClient } from "@/utils/supabase/admin";
import type { User } from "../types/user.types";

/**
 * Soft deletes a user by setting deleted_at timestamp
 * Preserves all data but revokes access
 *
 * @param userId - User ID to soft delete
 * @returns Promise resolving to soft-deleted User
 * @throws Error if user not found or already deleted
 */
export async function softDeleteUser(userId: string): Promise<User> {
  const supabase = createAdminClient();

  // Check if user exists and is not already deleted
  const { data: existingUser, error: fetchError } = await supabase
    .from("profiles")
    .select("id, deleted_at")
    .eq("id", userId)
    .single();

  if (fetchError) {
    if (fetchError.code === "PGRST116") {
      throw new Error("User not found");
    }
    throw new Error(`Failed to fetch user: ${fetchError.message}`);
  }

  if (existingUser.deleted_at) {
    throw new Error("User is already soft-deleted");
  }

  // Soft delete: set deleted_at timestamp (with company join)
  const { data: profile, error: updateError } = await supabase
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", userId)
    .select("*, companies!profiles_company_id_fkey(id, name)")
    .single();

  if (updateError) {
    throw new Error(`Failed to soft delete user: ${updateError.message}`);
  }

  const company = (profile as { companies?: { name: string } | null }).companies;

  // TODO: Fetch role from auth.users.app_metadata
  return {
    id: profile.id,
    email: profile.email || null,
    role: "member" as const,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    phone: profile.phone,
    company_email: profile.company_email,
    company_id: (profile as { company_id?: string | null }).company_id || null,
    company_name: company?.name || null,
    deleted_at: (profile as { deleted_at?: string | null }).deleted_at || null,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
}

/**
 * Restores a soft-deleted user by clearing deleted_at timestamp
 * Reinstates access to the account
 *
 * @param userId - User ID to restore
 * @returns Promise resolving to restored User
 * @throws Error if user not found or not deleted
 */
export async function restoreUser(userId: string): Promise<User> {
  const supabase = createAdminClient();

  // Check if user exists and is deleted
  const { data: existingUser, error: fetchError } = await supabase
    .from("profiles")
    .select("id, deleted_at")
    .eq("id", userId)
    .single();

  if (fetchError) {
    if (fetchError.code === "PGRST116") {
      throw new Error("User not found");
    }
    throw new Error(`Failed to fetch user: ${fetchError.message}`);
  }

  if (!existingUser.deleted_at) {
    throw new Error("User is not soft-deleted");
  }

  // Restore: clear deleted_at timestamp (with company join)
  const { data: profile, error: updateError } = await supabase
    .from("profiles")
    .update({ deleted_at: null })
    .eq("id", userId)
    .select("*, companies!profiles_company_id_fkey(id, name)")
    .single();

  if (updateError) {
    throw new Error(`Failed to restore user: ${updateError.message}`);
  }

  const company = (profile as { companies?: { name: string } | null }).companies;

  // TODO: Fetch role from auth.users.app_metadata
  return {
    id: profile.id,
    email: profile.email || null,
    role: "member" as const,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    phone: profile.phone,
    company_email: profile.company_email,
    company_id: (profile as { company_id?: string | null }).company_id || null,
    company_name: company?.name || null,
    deleted_at: null,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
}
