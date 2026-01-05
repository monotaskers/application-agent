/**
 * @fileoverview User service for CRUD operations
 * @module features/users/lib/user-service
 */

import { createAdminClient } from "@/utils/supabase/admin";
import type { User } from "../types/user.types";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserQueryInput,
} from "../schemas/user.schema";
import { getUserRole } from "@/lib/auth/roles";
import type { UserRole } from "@/features/auth/schemas/role.schema";
import { assignCompanyByEmail } from "@/features/companies/lib/company-service";

/**
 * Fetches a list of users with optional search, filters, and pagination
 *
 * @param query - Query parameters for filtering and pagination
 * @returns Promise resolving to users array and pagination info
 */
export async function getUsers(
  query: UserQueryInput
): Promise<{ users: User[]; total: number }> {
  const supabase = createAdminClient();

  // Join with companies table to fetch company name
  let queryBuilder = supabase
    .from("profiles")
    .select(
      "*, companies!profiles_company_id_fkey(id, name)",
      { count: "exact" }
    );

  // Filter deleted users
  if (!query.include_deleted) {
    queryBuilder = queryBuilder.is("deleted_at", null);
  }

  // Apply search filter (name or email)
  if (query.search) {
    queryBuilder = queryBuilder.or(
      `full_name.ilike.%${query.search}%,email.ilike.%${query.search}%`
    );
  }

  // Apply role filter (requires joining with auth.users)
  // Note: Role is stored in auth.users.app_metadata, so we'll filter in application layer
  // or use a database function/view if available

  // Apply pagination
  const from = query.offset;
  const to = from + query.limit - 1;
  queryBuilder = queryBuilder
    .range(from, to)
    .order("created_at", { ascending: false });

  const { data, error, count } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return {
      users: [],
      total: count || 0,
    };
  }

  // Fetch roles from auth.users for all profiles
  const userIds = data.map((profile) => profile.id);
  const authUsersMap = new Map<string, { role: UserRole }>();

  // Fetch auth users in batches (Supabase admin API has limits)
  for (const userId of userIds) {
    try {
      const { data: authUserData } =
        await supabase.auth.admin.getUserById(userId);
      if (authUserData?.user) {
        const role = getUserRole(authUserData.user);
        authUsersMap.set(userId, { role });
      }
    } catch {
      // If user not found in auth, use default role
      authUsersMap.set(userId, { role: "member" });
    }
  }

  // Transform data to include role from auth.users and company name
  let users: User[] = data.map((profile) => {
    const authUser = authUsersMap.get(profile.id);
    const company = (profile as { companies?: { name: string } | null }).companies;
    
    return {
      id: profile.id,
      email: profile.email || null,
      role: authUser?.role || ("member" as const),
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      phone: profile.phone,
      company_email: profile.company_email,
      company_id: (profile as { company_id?: string | null }).company_id || null,
      company_name: company?.name || null,
      deleted_at:
        (profile as { deleted_at?: string | null }).deleted_at || null,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  });

  // Apply role filter in application layer if needed
  if (query.role) {
    users = users.filter((user) => user.role === query.role);
  }

  return {
    users,
    total: count || 0,
  };
}

/**
 * Fetches a single user by ID
 *
 * @param userId - User ID to fetch
 * @returns Promise resolving to User or null if not found
 */
export async function getUserById(
  userId: string
): Promise<User | null> {
  const supabase = createAdminClient();

  // Join with companies table to fetch company name
  const { data, error } = await supabase
    .from("profiles")
    .select("*, companies!profiles_company_id_fkey(id, name)")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  // Fetch role from auth.users.app_metadata
  let role: UserRole = "member";
  try {
    const { data: authUserData } = await supabase.auth.admin.getUserById(
      data.id
    );
    if (authUserData?.user) {
      role = getUserRole(authUserData.user);
    }
  } catch {
    // If user not found in auth, use default role
    role = "member";
  }

  const company = (data as { companies?: { name: string } | null }).companies;

  return {
    id: data.id,
    email: data.email || null,
    role,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    bio: data.bio,
    phone: data.phone,
    company_email: data.company_email,
    company_id: (data as { company_id?: string | null }).company_id || null,
    company_name: company?.name || null,
    deleted_at: (data as { deleted_at?: string | null }).deleted_at || null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Creates a new user account
 *
 * @param input - User creation data
 * @returns Promise resolving to created User
 */
export async function createUser(
  input: CreateUserInput
): Promise<User> {
  const adminSupabase = createAdminClient();

  // Check email uniqueness (including soft-deleted users)
  const { data: existingUser } = await adminSupabase
    .from("profiles")
    .select("id, deleted_at")
    .eq("email", input.email.toLowerCase())
    .single();

  if (existingUser) {
    if (existingUser.deleted_at) {
      throw new Error(
        `Email ${input.email} belongs to a soft-deleted user. Please restore the user first.`
      );
    }
    throw new Error(`Email ${input.email} is already in use`);
  }

  // Create user in Supabase Auth
  const { data: authUser, error: authError } =
    await adminSupabase.auth.admin.createUser({
      email: input.email,
      email_confirm: true,
      app_metadata: { role: input.role },
    });

  if (authError) {
    throw new Error(`Failed to create user: ${authError.message}`);
  }

  // Determine company assignment based on email domain
  const companyId = await assignCompanyByEmail(input.email);

  // Create profile with company join to fetch company name
  const { data: profile, error: profileError } = await adminSupabase
    .from("profiles")
    .insert({
      id: authUser.user.id,
      email: input.email,
      full_name: input.full_name || null,
      avatar_url: input.avatar_url || null,
      bio: input.bio || null,
      phone: input.phone || null,
      company_email: input.company_email || null,
      company_id: companyId,
    })
    .select("*, companies!profiles_company_id_fkey(id, name)")
    .single();

  if (profileError) {
    // Rollback: delete auth user if profile creation fails
    await adminSupabase.auth.admin.deleteUser(authUser.user.id);
    throw new Error(`Failed to create profile: ${profileError.message}`);
  }

  const company = (profile as { companies?: { name: string } | null }).companies;

  return {
    id: profile.id,
    email: profile.email || null,
    role: input.role,
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

/**
 * Updates an existing user
 *
 * @param userId - User ID to update
 * @param input - User update data
 * @returns Promise resolving to updated User
 */
export async function updateUser(
  userId: string,
  input: UpdateUserInput
): Promise<{ user: User; conflict: boolean }> {
  const adminSupabase = createAdminClient();

  // Fetch current user data
  const currentUser = await getUserById(userId);
  if (!currentUser) {
    throw new Error("User not found");
  }

  // Check for concurrent edits (compare updated_at timestamps)
  // If input.updated_at is provided and doesn't match current, there was a concurrent edit
  const hasConflict =
    input.updated_at &&
    input.updated_at !== currentUser.updated_at &&
    new Date(input.updated_at) < new Date(currentUser.updated_at);

  // Check email uniqueness if email is being updated
  if (input.email && input.email !== currentUser.email) {
    const { data: existingUser } = await adminSupabase
      .from("profiles")
      .select("id, deleted_at")
      .eq("email", input.email.toLowerCase())
      .single();

    if (existingUser && existingUser.id !== userId) {
      if (existingUser.deleted_at) {
        throw new Error(
          `Email ${input.email} belongs to a soft-deleted user. Please restore the user first.`
        );
      }
      throw new Error(`Email ${input.email} is already in use`);
    }
  }

  // Update profile
  const updateData: Record<string, unknown> = {};
  if (input.full_name !== undefined) updateData.full_name = input.full_name;
  if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url;
  if (input.bio !== undefined) updateData.bio = input.bio;
  if (input.phone !== undefined) updateData.phone = input.phone;
  if (input.company_email !== undefined)
    updateData.company_email = input.company_email;

  const { error: profileError } = await adminSupabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId);

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }

  // Update auth user email and role if provided
  if (input.email || input.role) {
    const updateMetadata: Record<string, unknown> = {};
    if (input.role) {
      updateMetadata.role = input.role;
    }

    const updateAuthData: {
      email?: string;
      app_metadata?: Record<string, unknown>;
    } = {};
    if (input.email) {
      updateAuthData.email = input.email;
    }
    if (Object.keys(updateMetadata).length > 0) {
      updateAuthData.app_metadata = updateMetadata;
    }

    if (Object.keys(updateAuthData).length > 0) {
      const { error: authError } =
        await adminSupabase.auth.admin.updateUserById(userId, updateAuthData);

      if (authError) {
        throw new Error(`Failed to update auth user: ${authError.message}`);
      }
    }
  }

  // Fetch updated user with role
  const updatedUser = await getUserById(userId);
  if (!updatedUser) {
    throw new Error("Failed to fetch updated user");
  }

  return { user: updatedUser, conflict: hasConflict || false };
}
