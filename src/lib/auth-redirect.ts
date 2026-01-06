import { getAppUrl } from "@/lib/env";

/**
 * Gets the redirect URL for authentication callbacks
 *
 * Uses NEXT_PUBLIC_APP_URL if set, otherwise falls back to window.location.origin
 * This ensures correct redirects in both development and production environments.
 *
 * @returns The base URL for auth redirects
 */
export function getAuthRedirectUrl(): string {
  // Use the validated getAppUrl function which handles both client and server cases
  try {
    return getAppUrl();
  } catch (error) {
    // Fallback for client-side if env is not set
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    throw error;
  }
}

/**
 * Gets the full callback URL for authentication
 *
 * @returns The full callback URL (e.g., https://your-app.vercel.app/auth/callback)
 */
export function getAuthCallbackUrl(): string {
  return `${getAuthRedirectUrl()}/auth/callback`;
}
