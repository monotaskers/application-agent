"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { passwordlessEmailSchema } from "../schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";

/**
 * Maps Supabase auth errors to user-friendly messages
 *
 * @param error - Supabase error object
 * @returns User-friendly error message
 */
function getErrorMessage(error: {
  message?: string;
  status?: number | undefined;
}): string {
  const message = error.message?.toLowerCase() || "";

  if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (message.includes("invalid email") || message.includes("email")) {
    return "Please enter a valid email address.";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }
  if (message.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  return "Unable to send email. Please check your email address and try again.";
}

/**
 * Passwordless authentication form component
 * Supports Magic Link and OTP email flows
 *
 * Features:
 * - User-friendly error messages
 * - Loading states
 * - Accessibility (ARIA labels, keyboard navigation)
 * - WCAG AA compliant
 *
 * @returns React element containing the passwordless auth form
 */
export function PasswordlessAuthForm(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      // Validate email
      const result = passwordlessEmailSchema.safeParse({ email });
      if (!result.success) {
        setError(
          result.error.errors[0]?.message ||
            "Please enter a valid email address."
        );
        setLoading(false);
        return;
      }

      try {
        // Send Magic Link or OTP
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: result.data.email,
          options: {
            shouldCreateUser: true, // Auto-create user if doesn't exist
            emailRedirectTo: getAuthCallbackUrl(),
          },
        });

        if (otpError) {
          setError(getErrorMessage(otpError));
          setLoading(false);
          return;
        }

        setEmailSent(true);
        setLoading(false);
      } catch {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    },
    [email, supabase.auth]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>): void => {
      if (e.key === "Enter" && !loading) {
        // Form submission is handled by onSubmit
        return;
      }
    },
    [loading]
  );

  if (emailSent) {
    return (
      <div className="space-y-4" role="status" aria-live="polite">
        <p className="text-sm text-muted-foreground font-sans">
          Check your email! We&apos;ve sent you a Magic Link. Click the link in
          the email to sign in.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setEmailSent(false);
            setEmail("");
            setError(null);
          }}
          className="w-full font-sans"
          aria-label="Send another magic link email"
        >
          Send another email
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="space-y-4"
      aria-label="Sign in with email"
      noValidate
    >
      {error && (
        <div
          className="text-sm text-red-500 font-sans"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="email" className="sr-only font-sans font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="font-sans"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "email-error" : undefined}
            disabled={loading}
          />
          {error && (
            <span id="email-error" className="sr-only">
              {error}
            </span>
          )}
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !email.trim()}
          className="font-sans font-bold shrink-0"
          aria-busy={loading}
          aria-label={
            loading ? "Sending magic link" : "Send magic link to sign in"
          }
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </Button>
      </div>
    </form>
  );
}
