"use client";

import {
  type ReactElement,
  useState,
  useCallback,
  type KeyboardEvent,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { RiGoogleLine } from "@remixicon/react";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";

/**
 * Google OAuth sign-in button component
 * Initiates Google OAuth flow when clicked
 *
 * Features:
 * - Loading states
 * - Accessibility (ARIA labels, keyboard navigation)
 * - WCAG AA compliant
 *
 * @returns React element containing the Google OAuth button
 */
export function GoogleOAuthButton(): ReactElement {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleSignIn = useCallback(async (): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthCallbackUrl(),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        setError("Unable to connect to Google. Please try again.");
        setLoading(false);
        console.error("Google OAuth error:", oauthError);
      }
      // User will be redirected on success, so no need to handle success case
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      console.error("Google OAuth error:", err);
    }
  }, [supabase.auth]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!loading) {
          handleGoogleSignIn();
        }
      }
    },
    [loading, handleGoogleSignIn]
  );

  return (
    <div className="w-full">
      {error && (
        <div
          className="mb-2 text-sm text-red-500 font-sans"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {error}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        onKeyDown={handleKeyDown}
        disabled={loading}
        className="w-full font-sans disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={loading}
        aria-label={loading ? "Connecting to Google" : "Sign in with Google"}
      >
        <RiGoogleLine className="mr-2 h-4 w-4" aria-hidden="true" />
        {loading ? "Connecting..." : "Continue with Google"}
      </Button>
    </div>
  );
}
