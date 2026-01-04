import { createClient } from "@/utils/supabase/server";
import { createProfile } from "@/lib/auth/profile";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth callback route handler
 * Handles Magic Link and OAuth callbacks from Supabase Auth
 * Automatically creates a profile for new users on sign-up
 *
 * @param request - The incoming Next.js request
 * @returns NextResponse redirecting to dashboard or sign-in
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (code || (token_hash && type)) {
    // Validate environment variables before creating client
    const { validateEnv, env } = await import("@/lib/env");
    const envValidation = validateEnv();
    
    // Check if we're using placeholder values (indicates missing env vars)
    const isUsingPlaceholderKey = 
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "placeholder-key" ||
      env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder.supabase.co";
    
    if (isUsingPlaceholderKey) {
      console.error("CRITICAL: Using placeholder Supabase credentials. Environment variables are not set!");
      console.error("Required environment variables:");
      console.error("  - NEXT_PUBLIC_SUPABASE_URL");
      console.error("  - NEXT_PUBLIC_SUPABASE_ANON_KEY");
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/sign-in?error=oauth_error&message=${encodeURIComponent("Configuration error: Supabase credentials not configured")}`
      );
    }
    
    if (!envValidation.success) {
      console.error("Environment validation failed:", envValidation.error?.errors);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/sign-in?error=oauth_error&message=${encodeURIComponent("Configuration error: Invalid environment variables")}`
      );
    }

    // Log environment variable status (without exposing sensitive values)
    console.log("Supabase configuration check:", {
      url: env.NEXT_PUBLIC_SUPABASE_URL ? `✓ Set (${env.NEXT_PUBLIC_SUPABASE_URL})` : "✗ Missing",
      anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        ? `✓ Set (${env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...)` 
        : "✗ Missing",
    });

    const supabase = await createClient();

    if (token_hash && type) {
      // Magic Link callback
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as "email",
      });

      if (error) {
        // Log detailed error for debugging
        console.error("Magic Link callback error:", {
          message: error.message,
          status: error.status,
          code: error.code,
          name: error.name,
        });

        return NextResponse.redirect(
          `${requestUrl.origin}/auth/sign-in?error=invalid_link`
        );
      }
    } else if (code) {
      // OAuth callback (Google)
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        // Log detailed error for debugging
        console.error("OAuth callback error:", {
          message: error.message,
          status: error.status,
          code: error.code,
          name: error.name,
        });

        // Include error message in redirect for better debugging
        const errorMessage = encodeURIComponent(
          error.message || "OAuth authentication failed"
        );
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/sign-in?error=oauth_error&message=${errorMessage}`
        );
      }
    }

    // After successful authentication, check if user needs a profile created
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      try {
        // Check if profile exists
        const { error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        // If profile doesn't exist, create it
        if (profileError && profileError.code === "PGRST116") {
          // Extract full_name from user metadata (OAuth providers often set this)
          const fullName =
            user.user_metadata?.full_name || user.user_metadata?.name || null;

          // Create profile for new user
          await createProfile({
            full_name: fullName,
            avatar_url: user.user_metadata?.avatar_url || null,
          });
        }
      } catch (profileError) {
        // Log error but don't block authentication flow
        // Profile can be created later when user accesses their profile page
        console.error("Error creating profile on sign-up:", profileError);
      }
    }

    return NextResponse.redirect(`${requestUrl.origin}/admin/overview`);
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in`);
}
