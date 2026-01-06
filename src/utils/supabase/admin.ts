import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Creates a Supabase client with service role key (bypasses RLS)
 *
 * ⚠️ WARNING: Only use in trusted server-side environments
 * Never expose service role key to client-side code
 *
 * This client bypasses Row Level Security (RLS) policies and should only be used for:
 * - Admin operations (user management, bulk updates)
 * - Background jobs that need to bypass RLS
 * - System-level operations
 *
 * For regular user operations, use `createClient()` from `@/utils/supabase/server` instead.
 *
 * @returns Supabase client with admin privileges
 * @throws Error if SUPABASE_SERVICE_ROLE_KEY is not configured
 *
 * @example
 * ```typescript
 * // In an API route or server action
 * const adminClient = createAdminClient();
 * const { data } = await adminClient.auth.admin.listUsers();
 * ```
 */
export function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations. " +
        "Please add it to your environment variables."
    );
  }

  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
