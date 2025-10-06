/**
 * ClientDetails Component
 *
 * @fileoverview Component for displaying client details and associated projects.
 *
 * @module features/clients-projects/components/clients/ClientDetails
 */

'use client';

import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjects } from '../../hooks/use-projects';
import { useClientMutations } from '../../hooks/use-client-mutations';
import type { Client } from '../../types';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientDetailsProps {
  /** Client data to display */
  client: Client;
}

/**
 * ClientDetails component for displaying client information and actions.
 *
 * @param props - Component props
 * @returns Client details with edit/delete actions and associated projects
 *
 * @example
 * ```tsx
 * <ClientDetails client={client} />
 * ```
 */
export function ClientDetails({ client }: ClientDetailsProps): ReactElement {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteMutation } = useClientMutations();
  const { data: projects } = useProjects({ clientId: client.id });

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteMutation.mutateAsync(client.id);
      router.push('/clients');
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{client.companyName}</h2>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/clients/${client.id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Contact Person</p>
            <p className="text-base">{client.contactPerson}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-base">{client.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-base">{client.phone}</p>
          </div>
          {client.address && (
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-base">{client.address}</p>
            </div>
          )}
          {client.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-base">{client.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Associated Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects && projects.length > 0 ? (
            <div className="space-y-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block rounded-md border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <p className="font-medium">{project.name}</p>
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No projects associated with this client
            </p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{client.companyName}&quot;? This action
              will soft-delete the client. Associated projects will remain intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
