/**
 * useProjects Hook
 *
 * @fileoverview React Query hook for fetching projects with optional filters.
 * Provides automatic caching, background refetching, and loading/error states.
 *
 * @module features/clients-projects/hooks/use-projects
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../actions/project.actions';
import type { ProjectFilters, Project } from '../types';

/**
 * Hook for fetching projects with TanStack Query.
 *
 * @param filters - Optional filters for search, client, status, and date ranges
 * @returns Query result with projects data, loading, and error states
 *
 * @example
 * ```tsx
 * // Fetch all projects
 * const { data: projects, isLoading, error } = useProjects();
 *
 * // Filter by status
 * const { data: activeProjects } = useProjects({ status: ProjectStatus.Active });
 *
 * // Filter by client
 * const { data: clientProjects } = useProjects({ clientId: someClientId });
 *
 * // Search projects
 * const { data: searchResults } = useProjects({ search: 'Website' });
 * ```
 */
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async (): Promise<Project[]> => {
      const result = await getProjects(filters);

      if (!result.success) {
        throw new Error(
          result.error instanceof Error
            ? result.error.message
            : 'Failed to fetch projects'
        );
      }

      return result.data;
    },
    staleTime: 30000, // 30 seconds
  });
}
