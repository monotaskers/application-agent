/**
 * @fileoverview Soft delete utilities for user management
 * @module features/users/lib/soft-delete
 */

import { createAdminClient } from "@/utils/supabase/admin";
import type { User } from "../types/user.types";
import type { UserRole } from "@/features/auth/schemas/role.schema";

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

  // Fetch role and email from auth.users
  let role: UserRole = "member";
  let authEmail: string | null = null;
  try {
    const { data: authUserData } = await supabase.auth.admin.getUserById(
      profile.id
    );
    if (authUserData?.user) {
      const { getUserRole } = await import("@/lib/auth/roles");
      role = getUserRole(authUserData.user);
      authEmail = authUserData.user.email || null;
    }
  } catch {
    // If user not found in auth, use default role
    role = "member";
  }

  return {
    id: profile.id,
    // Use profiles.email if set, otherwise fallback to auth.users.email
    email: profile.email || authEmail || null,
    role,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    phone: profile.phone,
    company_id: (profile as { company_id?: string | null }).company_id || null,
    company_name: company?.name || null,
    address_1: (profile as { address_1?: string | null }).address_1 || null,
    address_2: (profile as { address_2?: string | null }).address_2 || null,
    city: (profile as { city?: string | null }).city || null,
    state: (profile as { state?: string | null }).state || null,
    postal_code: (profile as { postal_code?: string | null }).postal_code || null,
    country: (profile as { country?: string | null }).country || null,
    title: (profile as { title?: string | null }).title || null,
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

  // Fetch role and email from auth.users
  let role: UserRole = "member";
  let authEmail: string | null = null;
  try {
    const { data: authUserData } = await supabase.auth.admin.getUserById(
      profile.id
    );
    if (authUserData?.user) {
      const { getUserRole } = await import("@/lib/auth/roles");
      role = getUserRole(authUserData.user);
      authEmail = authUserData.user.email || null;
    }
  } catch {
    // If user not found in auth, use default role
    role = "member";
  }

  return {
    id: profile.id,
    // Use profiles.email if set, otherwise fallback to auth.users.email
    email: profile.email || authEmail || null,
    role,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    phone: profile.phone,
    company_id: (profile as { company_id?: string | null }).company_id || null,
    company_name: company?.name || null,
    address_1: (profile as { address_1?: string | null }).address_1 || null,
    address_2: (profile as { address_2?: string | null }).address_2 || null,
    city: (profile as { city?: string | null }).city || null,
    state: (profile as { state?: string | null }).state || null,
    postal_code: (profile as { postal_code?: string | null }).postal_code || null,
    country: (profile as { country?: string | null }).country || null,
    title: (profile as { title?: string | null }).title || null,
    deleted_at: null,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
}
