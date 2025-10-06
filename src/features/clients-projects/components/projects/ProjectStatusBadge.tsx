/**
 * ProjectStatusBadge Component
 *
 * @fileoverview Badge component for displaying project status with color coding.
 *
 * @module features/clients-projects/components/projects/ProjectStatusBadge
 */

import { ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '../../types/project.types';

interface ProjectStatusBadgeProps {
  /** Project status to display */
  status: ProjectStatus;
}

/**
 * Badge component for displaying project status with color coding.
 *
 * @param props - Component props
 * @returns Colored badge based on project status
 *
 * @example
 * ```tsx
 * <ProjectStatusBadge status={ProjectStatus.Active} />
 * ```
 */
export function ProjectStatusBadge({
  status,
}: ProjectStatusBadgeProps): ReactElement {
  const variants: Record<ProjectStatus, string> = {
    [ProjectStatus.Planning]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [ProjectStatus.Active]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    [ProjectStatus.OnHold]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [ProjectStatus.Completed]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [ProjectStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const labels: Record<ProjectStatus, string> = {
    [ProjectStatus.Planning]: 'Planning',
    [ProjectStatus.Active]: 'Active',
    [ProjectStatus.OnHold]: 'On Hold',
    [ProjectStatus.Completed]: 'Completed',
    [ProjectStatus.Cancelled]: 'Cancelled',
  };

  return (
    <Badge variant="secondary" className={variants[status]}>
      {labels[status]}
    </Badge>
  );
}
