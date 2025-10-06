/**
 * useProjectMutations Hook
 *
 * @fileoverview React Query mutations for project CRUD operations.
 * Provides optimistic updates and automatic cache invalidation.
 *
 * @module features/clients-projects/hooks/use-project-mutations
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
} from '../actions/project.actions';
import { ProjectStatus } from '../types/project.types';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectId,
  Project,
} from '../types';

/**
 * Hook for project mutation operations.
 *
 * @returns Object with mutation functions and states
 *
 * @example
 * ```tsx
 * const {
 *   createMutation,
 *   updateMutation,
 *   updateStatusMutation,
 *   deleteMutation
 * } = useProjectMutations();
 *
 * // Create project
 * createMutation.mutate({
 *   name: 'Website Redesign',
 *   startDate: new Date('2025-10-15'),
 *   clientId: someClientId,
 * });
 *
 * // Update project
 * updateMutation.mutate({
 *   id: projectId,
 *   data: { status: ProjectStatus.Active },
 * });
 *
 * // Update status only
 * updateStatusMutation.mutate({
 *   id: projectId,
 *   status: ProjectStatus.Completed,
 * });
 *
 * // Delete project
 * deleteMutation.mutate(projectId);
 * ```
 */
export function useProjectMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateProjectInput): Promise<Project> => {
      const result = await createProject(data);

      if (!result.success) {
        throw new Error(
          result.error.type === 'ValidationError'
            ? result.error.message
            : 'Failed to create project'
        );
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate all projects queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: ProjectId;
      data: UpdateProjectInput;
    }): Promise<Project> => {
      const result = await updateProject(id, data);

      if (!result.success) {
        throw new Error(
          result.error.type === 'ValidationError' ||
            result.error.type === 'NotFoundError'
            ? result.error.message
            : 'Failed to update project'
        );
      }

      return result.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(['projects']);

      // Optimistically update
      queryClient.setQueriesData({ queryKey: ['projects'] }, (old: Project[] | undefined) => {
        if (!old) return old;
        return old.map((project) =>
          project.id === id
            ? { ...project, ...data, updatedAt: new Date() }
            : project
        );
      });

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: ProjectId;
      status: ProjectStatus;
    }): Promise<Project> => {
      const result = await updateProjectStatus(id, status);

      if (!result.success) {
        throw new Error(
          result.error.type === 'ValidationError' ||
            result.error.type === 'NotFoundError'
            ? result.error.message
            : 'Failed to update project status'
        );
      }

      return result.data;
    },
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(['projects']);

      // Optimistically update status
      queryClient.setQueriesData({ queryKey: ['projects'] }, (old: Project[] | undefined) => {
        if (!old) return old;
        return old.map((project) =>
          project.id === id
            ? { ...project, status, updatedAt: new Date() }
            : project
        );
      });

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: ProjectId): Promise<void> => {
      const result = await deleteProject(id);

      if (!result.success) {
        throw new Error(
          result.error.type === 'NotFoundError'
            ? result.error.message
            : 'Failed to delete project'
        );
      }
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(['projects']);

      // Optimistically remove
      queryClient.setQueriesData({ queryKey: ['projects'] }, (old: Project[] | undefined) => {
        if (!old) return old;
        return old.filter((project) => project.id !== id);
      });

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    updateStatusMutation,
    deleteMutation,
  };
}
