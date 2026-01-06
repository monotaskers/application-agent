"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { otpVerificationSchema } from "../schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OtpVerificationFormProps {
  email: string;
}

/**
 * Maps Supabase OTP verification errors to user-friendly messages
 *
 * @param error - Supabase error object
 * @returns User-friendly error message
 */
function getOtpErrorMessage(error: {
  message?: string;
  status?: number | undefined;
}): string {
  const message = error.message?.toLowerCase() || "";

  if (
    message.includes("expired") ||
    message.includes("invalid") ||
    message.includes("token")
  ) {
    return "This code has expired or is invalid. Please request a new code.";
  }
  if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }

  return "Invalid code. Please check the code and try again.";
}

/**
 * OTP verification form component
 * Allows users to enter the 6-digit code received via email
 *
 * Features:
 * - User-friendly error messages
 * - Loading states
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Auto-focus on input
 * - WCAG AA compliant
 *
 * @param props - Component props
 * @param props.email - User's email address
 * @returns React element containing the OTP verification form
 */
export function OtpVerificationForm({
  email,
}: OtpVerificationFormProps): React.JSX.Element {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      // Validate OTP
      const result = otpVerificationSchema.safeParse({
        email,
        token,
        type: "email",
      });
      if (!result.success) {
        setError(
          result.error.errors[0]?.message ||
            "Please enter a valid 6-digit code."
        );
        setLoading(false);
        inputRef.current?.focus();
        return;
      }

      try {
        // Verify OTP
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: result.data.email,
          token: result.data.token,
          type: "email",
        });

        if (verifyError) {
          setError(getOtpErrorMessage(verifyError));
          setLoading(false);
          setToken("");
          inputRef.current?.focus();
          return;
        }

        router.push("/admin/overview");
        router.refresh();
      } catch {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [email, token, supabase.auth, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>): void => {
      if (e.key === "Enter" && !loading && token.length === 6) {
        // Form submission is handled by onSubmit
        return;
      }
    },
    [loading, token.length]
  );

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="space-y-4"
      aria-label="Verify email code"
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
      <div>
        <Label htmlFor="otp" className="font-sans font-medium">
          Enter 6-digit code
        </Label>
        <Input
          ref={inputRef}
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          value={token}
          onChange={(e) =>
            setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          required
          maxLength={6}
          pattern="\d{6}"
          placeholder="123456"
          className="text-center text-2xl tracking-widest font-sans"
          aria-required="true"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "otp-error" : "otp-description"}
          disabled={loading}
          autoComplete="one-time-code"
        />
        <p
          id="otp-description"
          className="text-xs text-muted-foreground mt-1 font-sans"
        >
          Code sent to {email}
        </p>
        {error && (
          <span id="otp-error" className="sr-only">
            {error}
          </span>
        )}
      </div>
      <Button
        type="submit"
        disabled={loading || token.length !== 6}
        className="w-full bg-[#5EA500] hover:bg-[#4d8500] font-sans font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={loading}
        aria-label={loading ? "Verifying code" : "Verify code and sign in"}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  );
}
