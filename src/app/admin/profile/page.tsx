/**
 * @fileoverview Profile page (Server Component)
 * @module app/admin/profile/page
 */

import { type ReactElement } from "react";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/gateways/server";
import { hasPermission } from "@/lib/auth/permission-checker";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { fetchProfileServer } from "@/features/auth/lib/fetch-profile-server";
import type { Profile } from "@/features/auth/types/auth.types";
import { ProfileClient } from "./profile-client";

/**
 * Revalidation time in seconds
 * Profile data is revalidated every 60 seconds
 */
export const revalidate = 60;

/**
 * Profile page component (Server Component)
 *
 * Fetches current user's profile data on the server and renders with client components
 * for interactivity. Handles authentication, authorization, and 404 errors.
 *
 * @returns React element containing profile page
 */
export default async function ProfilePage(): Promise<ReactElement> {
  // Check authentication and view permission
  const { user } = await requirePermission(PERMISSIONS.profiles.view);

  // Fetch profile data (own profile, so it will always be Profile, not LimitedProfile)
  const profile = await fetchProfileServer(user.id);

  // Handle not found
  if (!profile) {
    notFound();
  }

  // Type assertion: when fetching own profile (no viewerUserId), result is always Profile
  // This is safe because fetchProfileServer returns Profile when viewerUserId is not provided
  const fullProfile = profile as Profile;

  // Check action-level permissions
  const canEdit = await hasPermission(user, PERMISSIONS.profiles.edit);

  // Render with client component for interactivity
  return <ProfileClient profile={fullProfile} canEdit={canEdit} />;
}
