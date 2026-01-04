"use client";

import { useEffect, useState, type ReactElement } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Maps error codes to user-friendly messages
 *
 * @param errorCode - Error code from URL query parameter
 * @param errorMessage - Optional detailed error message
 * @returns User-friendly error message
 */
function getErrorMessage(
  errorCode: string | null,
  errorMessage: string | null,
): string | null {
  if (!errorCode) {
    return null;
  }

  // If we have a detailed message, use it (for development/debugging)
  if (errorMessage && process.env.NODE_ENV === "development") {
    return `OAuth Error: ${decodeURIComponent(errorMessage)}`;
  }

  switch (errorCode) {
    case "oauth_error":
      return "Unable to sign in with Google. Please try again or use email sign-in.";
    case "invalid_link":
      return "This sign-in link is invalid or has expired. Please request a new one.";
    default:
      return "An error occurred during sign-in. Please try again.";
  }
}

/**
 * Auth error message component
 * Displays authentication errors from URL query parameters
 *
 * @returns React element containing error message or null
 */
export function AuthErrorMessage(): ReactElement | null {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorCode = searchParams.get("error");
    const errorMessage = searchParams.get("message");
    setError(getErrorMessage(errorCode, errorMessage));
  }, [searchParams]);

  if (!error) {
    return null;
  }

  return (
    <div
      className="w-full rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 font-sans"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <p className="font-medium">Sign-in Error</p>
      <p className="mt-1">{error}</p>
    </div>
  );
}

