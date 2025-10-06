/**
 * Client Details Page
 *
 * @fileoverview Server Component page for displaying individual client details.
 *
 * @module app/dashboard/clients/[id]/page
 */

import { ReactElement } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClientById } from '@/features/clients-projects/actions/client.actions';
import { ClientDetails } from '@/features/clients-projects/components/clients/ClientDetails';
import { createClientId } from '@/features/clients-projects/types/client.types';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate metadata for the client details page.
 *
 * @param props - Page props containing client ID
 * @returns Metadata for the page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getClientById(createClientId(id));

  if (!result.success) {
    return {
      title: 'Client Not Found | Dashboard',
    };
  }

  return {
    title: `${result.data.companyName} | Clients`,
    description: `View details for ${result.data.companyName}`,
  };
}

/**
 * Client details page component.
 *
 * Server Component that fetches and displays details for a specific client.
 *
 * @param props - Page props containing client ID
 * @returns Client details page
 */
export default async function ClientDetailsPage({ params }: PageProps): Promise<ReactElement> {
  const { id } = await params;
  const result = await getClientById(createClientId(id));

  if (!result.success) {
    notFound();
  }

  return <ClientDetails client={result.data} />;
}
