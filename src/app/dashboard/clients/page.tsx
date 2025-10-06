/**
 * Clients List Page
 *
 * @fileoverview Server Component page for displaying the list of clients.
 *
 * @module app/dashboard/clients/page
 */

import { ReactElement } from 'react';
import { Metadata } from 'next';
import { ClientList } from '@/features/clients-projects/components/clients/ClientList';

/**
 * Metadata for the clients list page.
 */
export const metadata: Metadata = {
  title: 'Clients | Dashboard',
  description: 'View and manage your clients',
};

/**
 * Clients list page component.
 *
 * Server Component that renders the ClientList component for displaying
 * and managing clients.
 *
 * @returns Clients list page
 */
export default function ClientsPage(): ReactElement {
  return <ClientList />;
}
