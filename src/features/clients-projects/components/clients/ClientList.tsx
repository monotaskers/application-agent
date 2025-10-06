/**
 * ClientList Component
 *
 * @fileoverview Component for displaying and managing list of clients.
 *
 * @module features/clients-projects/components/clients/ClientList
 */

'use client';

import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { useClients } from '../../hooks/use-clients';
import { EmptyState } from '../shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';

/**
 * ClientList component for displaying and managing clients.
 *
 * @returns Client list with search and create functionality
 *
 * @example
 * ```tsx
 * <ClientList />
 * ```
 */
export function ClientList(): ReactElement {
  const [search, setSearch] = useState('');
  const { data: clients, isLoading, error } = useClients({ search });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading clients...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-600 dark:text-red-400">
          Error loading clients: {error.message}
        </p>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Clients</h2>
          <Button asChild>
            <Link href="/clients/new">Create Client</Link>
          </Button>
        </div>
        <EmptyState
          title="No clients yet"
          description="Get started by creating your first client"
          actionLabel="Create Client"
          onAction={() => (window.location.href = '/clients/new')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button asChild>
          <Link href="/clients/new">Create Client</Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Search clients by company name or contact person..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.companyName}
                </TableCell>
                <TableCell>{client.contactPerson}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/clients/${client.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {clients.length} client{clients.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
