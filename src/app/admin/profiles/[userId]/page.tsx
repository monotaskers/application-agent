/**
 * @fileoverview Profile view page for other users (Server Component)
 * @module app/admin/profiles/[userId]/page
 */

import { type ReactElement } from "react";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/gateways/server";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { fetchProfileServer } from "@/features/auth/lib/fetch-profile-server";
import { ProfileViewClient } from "./profile-view-client";

/**
 * Revalidation time in seconds
 * Profile data is revalidated every 60 seconds
 */
export const revalidate = 60;

/**
 * Profile view page component (Server Component)
 *
 * Fetches another user's limited profile data on the server and renders with client components.
 * Handles authentication, authorization, relationship checks, and 404 errors.
 *
 * @param props - Component props with route parameters
 * @param props.params - Route parameters containing userId
 * @returns React element containing profile view page
 */
export default async function ProfileViewPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<ReactElement> {
  const { userId } = await params;

  // Check authentication and view permission
  const { user } = await requirePermission(PERMISSIONS.profiles.view);

  // Fetch profile data with access control (viewerUserId = current user)
  const profile = await fetchProfileServer(userId, user.id);

  // Handle not found (profile doesn't exist, soft-deleted, or no relationship)
  if (!profile) {
    notFound();
  }

  // Render with client component
  return <ProfileViewClient profile={profile} />;
}
