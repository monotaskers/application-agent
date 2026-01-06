/**
 * @fileoverview Company detail page (Server Component)
 * @module app/admin/companies/[companyId]/page
 *
 * Page for viewing and editing company details.
 */

import { type ReactElement } from "react";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/gateways/server";
import { hasPermission } from "@/lib/auth/permission-checker";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { fetchCompanyServer } from "@/features/companies/lib/fetch-company-server";
import { CompanyDetailClient } from "@/features/companies/components/company-detail-client";

/**
 * Revalidation time in seconds
 * Company data is revalidated every 60 seconds
 */
export const revalidate = 60;

/**
 * Company detail page component (Server Component)
 *
 * Fetches company data on the server and renders with client components
 * for interactivity. Handles authentication, authorization, and 404 errors.
 *
 * @param props - Component props with route parameters
 * @param props.params - Route parameters containing company ID
 * @returns React element containing company detail page
 */
export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}): Promise<ReactElement> {
  const { companyId } = await params;

  // Check authentication and view permission
  const { user } = await requirePermission(PERMISSIONS.users.view);

  // Fetch company data
  const company = await fetchCompanyServer(companyId);

  // Handle not found
  if (!company) {
    notFound();
  }

  // Check action-level permissions
  const canEdit = await hasPermission(user, PERMISSIONS.users.edit);
  const canDelete = await hasPermission(user, PERMISSIONS.users.delete);

  // Render with client component for interactivity
  return (
    <CompanyDetailClient
      company={company}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}
