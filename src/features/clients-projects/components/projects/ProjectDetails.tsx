/**
 * ProjectDetails Component
 *
 * @fileoverview Component for displaying detailed project information with actions.
 *
 * @module features/clients-projects/components/projects/ProjectDetails
 */

'use client';

import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClients } from '../../hooks/use-clients';
import { useProjectMutations } from '../../hooks/use-project-mutations';
import { Project, ProjectStatus } from '../../types/project.types';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface ProjectDetailsProps {
  /** Project data to display */
  project: Project;
}

/**
 * ProjectDetails component for displaying project information.
 *
 * @param props - Component props
 * @returns Detailed project view with edit and delete actions
 *
 * @example
 * ```tsx
 * <ProjectDetails project={project} />
 * ```
 */
export function ProjectDetails({ project }: ProjectDetailsProps): ReactElement {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: clients } = useClients({ includeDeleted: true });
  const { updateStatusMutation, deleteMutation } = useProjectMutations();

  const client = clients?.find((c) => c.id === project.clientId);
  const isClientDeleted = client?.deletedAt !== null;

  const handleStatusChange = async (newStatus: ProjectStatus): Promise<void> => {
    const result = await updateStatusMutation.mutateAsync({
      id: project.id,
      status: newStatus,
    });

    if (!result.success) {
      // Error handling - could show a toast notification
      console.error('Failed to update status:', result.error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    const result = await deleteMutation.mutateAsync(project.id);

    if (result.success) {
      router.push('/projects');
    } else {
      // Error handling - could show a toast notification
      console.error('Failed to delete project:', result.error);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            <Select
              value={project.status}
              onValueChange={(value) => handleStatusChange(value as ProjectStatus)}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProjectStatus.Planning}>Planning</SelectItem>
                <SelectItem value={ProjectStatus.Active}>Active</SelectItem>
                <SelectItem value={ProjectStatus.OnHold}>On Hold</SelectItem>
                <SelectItem value={ProjectStatus.Completed}>Completed</SelectItem>
                <SelectItem value={ProjectStatus.Cancelled}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${project.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 rounded-lg border p-6">
        <div className="grid gap-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Description
          </h3>
          <p className="text-base">
            {project.description || (
              <span className="text-gray-500 dark:text-gray-400">No description</span>
            )}
          </p>
        </div>

        <div className="grid gap-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Client
          </h3>
          {project.clientId && client ? (
            isClientDeleted ? (
              <p className="text-base text-gray-600 dark:text-gray-400">
                {client.companyName} (Deleted)
              </p>
            ) : (
              <Link
                href={`/clients/${project.clientId}`}
                className="text-base text-blue-600 hover:underline dark:text-blue-400"
              >
                {client.companyName}
              </Link>
            )
          ) : (
            <p className="text-base text-gray-500 dark:text-gray-400">No client assigned</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Start Date
            </h3>
            <p className="text-base">
              {new Date(project.startDate).toLocaleDateString()}
            </p>
          </div>

          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              End Date
            </h3>
            <p className="text-base">
              {project.endDate ? (
                new Date(project.endDate).toLocaleDateString()
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Not set</span>
              )}
            </p>
          </div>
        </div>

        {project.budget !== undefined && (
          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Budget
            </h3>
            <p className="text-base">
              ${project.budget.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        )}

        {project.notes && (
          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Notes
            </h3>
            <p className="whitespace-pre-wrap text-base">{project.notes}</p>
          </div>
        )}

        <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Created
            </h3>
            <p className="text-sm">
              {new Date(project.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last Updated
            </h3>
            <p className="text-sm">
              {new Date(project.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
