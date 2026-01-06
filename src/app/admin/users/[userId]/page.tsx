/**
 * @fileoverview User detail page (Server Component)
 * @module app/admin/users/[userId]/page
 *
 * Page for viewing and editing user details.
 * Displays user information and allows updates to profile, role, and company association.
 * Supports both admin view (full user management) and profile view (limited read-only).
 */

import { type ReactElement } from "react";
import { notFound } from "next/navigation";
import { requireAnyPermission } from "@/lib/auth/gateways/server";
import { hasPermission } from "@/lib/auth/permission-checker";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { fetchUserServer } from "@/features/users/lib/fetch-user-server";
import { UserDetailClient } from "./user-detail-client";

/**
 * Revalidation time in seconds
 * User data is revalidated every 60 seconds
 */
export const revalidate = 60;

/**
 * User detail page component (Server Component)
 *
 * Fetches user data on the server and renders with client components
 * for interactivity. Handles authentication, authorization, and 404 errors.
 * Supports both admin view (users.view permission) and limited profile view
 * (profiles.view permission).
 *
 * @param props - Component props with route parameters
 * @param props.params - Route parameters containing user ID
 * @returns React element containing user detail page
 */
export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<ReactElement> {
  const { userId } = await params;

  // Check authentication - allow either users.view (admin) or profiles.view (member)
  const { user: currentUser } = await requireAnyPermission([
    PERMISSIONS.users.view,
    PERMISSIONS.profiles.view,
  ]);

  // Determine if user has admin view permission
  const hasAdminView = await hasPermission(currentUser, PERMISSIONS.users.view);

  // Fetch user data with appropriate view mode
  const userData = await fetchUserServer(userId, {
    viewerUserId: currentUser.id,
    limitedView: !hasAdminView,
  });

  // Handle not found (profile doesn't exist, soft-deleted, or no relationship)
  if (!userData) {
    notFound();
  }

  // Check action-level permissions (only for admin view)
  const canEdit =
    hasAdminView && (await hasPermission(currentUser, PERMISSIONS.users.edit));
  const canDelete =
    hasAdminView &&
    (await hasPermission(currentUser, PERMISSIONS.users.delete));

  // Determine view mode
  const viewMode = hasAdminView ? "admin" : "profile";

  // Render with client component for interactivity
  return (
    <UserDetailClient
      user={userData}
      viewMode={viewMode}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}
