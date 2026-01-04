/**
 * @fileoverview User detail page (Server Component)
 * @module app/admin/users/[userId]/page
 *
 * Page for viewing and editing user details.
 * Displays user information and allows updates to profile, role, and company association.
 */

import { type ReactElement } from "react";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/gateways/server";
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

  // Check authentication and view permission
  const { user } = await requirePermission(PERMISSIONS.users.view);

  // Fetch user data
  const userData = await fetchUserServer(userId);

  // Handle not found
  if (!userData) {
    notFound();
  }

  // Check action-level permissions
  const canEdit = await hasPermission(user, PERMISSIONS.users.edit);
  const canDelete = await hasPermission(user, PERMISSIONS.users.delete);

  // Render with client component for interactivity
  return (
    <UserDetailClient user={userData} canEdit={canEdit} canDelete={canDelete} />
  );
}
