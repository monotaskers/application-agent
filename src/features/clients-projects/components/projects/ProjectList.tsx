/**
 * ProjectList Component
 *
 * @fileoverview Component for displaying and managing list of projects.
 *
 * @module features/clients-projects/components/projects/ProjectList
 */

'use client';

import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { useProjects } from '../../hooks/use-projects';
import { useClients } from '../../hooks/use-clients';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { EmptyState } from '../shared/EmptyState';
import { ProjectStatus } from '../../types/project.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
 * ProjectList component for displaying and managing projects.
 *
 * @returns Project list with search, filters, and create functionality
 *
 * @example
 * ```tsx
 * <ProjectList />
 * ```
 */
export function ProjectList(): ReactElement {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const { data: projects, isLoading, error } = useProjects({
    search,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const { data: clients } = useClients({ includeDeleted: true });

  const getClientName = (clientId: string | null): string => {
    if (!clientId) return 'No Client';
    const client = clients?.find((c) => c.id === clientId);
    if (!client) return 'Unknown Client';
    return client.deletedAt ? `${client.companyName} (Deleted)` : client.companyName;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-600 dark:text-red-400">
          Error loading projects: {error.message}
        </p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Button asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </div>
        <EmptyState
          title="No projects yet"
          description="Get started by creating your first project"
          actionLabel="Create Project"
          onAction={() => (window.location.href = '/projects/new')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button asChild>
          <Link href="/projects/new">Create Project</Link>
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search projects by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as ProjectStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={ProjectStatus.Planning}>Planning</SelectItem>
            <SelectItem value={ProjectStatus.Active}>Active</SelectItem>
            <SelectItem value={ProjectStatus.OnHold}>On Hold</SelectItem>
            <SelectItem value={ProjectStatus.Completed}>Completed</SelectItem>
            <SelectItem value={ProjectStatus.Cancelled}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  {project.clientId && clients?.find((c) => c.id === project.clientId && !c.deletedAt) ? (
                    <Link
                      href={`/clients/${project.clientId}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {getClientName(project.clientId)}
                    </Link>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">
                      {getClientName(project.clientId)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <ProjectStatusBadge status={project.status} />
                </TableCell>
                <TableCell>
                  {new Date(project.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/projects/${project.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
