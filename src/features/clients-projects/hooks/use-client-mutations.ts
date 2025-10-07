/**
 * useClientMutations Hook
 *
 * @fileoverview React Query mutations for client CRUD operations.
 * Provides optimistic updates and automatic cache invalidation.
 *
 * @module features/clients-projects/hooks/use-client-mutations
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createClient,
  updateClient,
  softDeleteClient,
} from '../actions/client.actions';
import type {
  CreateClientInput,
  UpdateClientInput,
  ClientId,
  Client,
} from '../types';

/**
 * Hook for client mutation operations.
 *
 * @returns Object with mutation functions and states
 *
 * @example
 * ```tsx
 * const { createMutation, updateMutation, deleteMutation } = useClientMutations();
 *
 * // Create client
 * createMutation.mutate({
 *   companyName: 'Acme Corp',
 *   contactPerson: 'John Doe',
 *   email: 'john@acme.com',
 *   phone: '+1234567890',
 * });
 *
 * // Update client
 * updateMutation.mutate({
 *   id: clientId,
 *   data: { contactPerson: 'Jane Doe' },
 * });
 *
 * // Delete client
 * deleteMutation.mutate(clientId);
 * ```
 */
export function useClientMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateClientInput): Promise<Client> => {
      const result = await createClient(data);

      if (!result.success) {
        throw new Error(
          result.error.type === 'ValidationError'
            ? result.error.message
            : 'Failed to create client'
        );
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate all clients queries
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
      expectedVersion,
    }: {
      id: ClientId;
      data: UpdateClientInput;
      expectedVersion: number;
    }): Promise<Client> => {
      const result = await updateClient(id, data, expectedVersion);

      if (!result.success) {
        throw new Error(
          result.error.type === 'ValidationError' ||
            result.error.type === 'NotFoundError' ||
            result.error.type === 'ConflictError'
            ? result.error.message
            : 'Failed to update client'
        );
      }

      return result.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['clients'] });

      // Snapshot previous value
      const previousClients = queryClient.getQueryData(['clients']);

      // Optimistically update
      queryClient.setQueriesData({ queryKey: ['clients'] }, (old: Client[] | undefined) => {
        if (!old) return old;
        return old.map((client) =>
          client.id === id ? { ...client, ...data, updatedAt: new Date() } : client
        );
      });

      return { previousClients };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: ClientId): Promise<void> => {
      const result = await softDeleteClient(id);

      if (!result.success) {
        throw new Error(
          result.error.type === 'NotFoundError'
            ? result.error.message
            : 'Failed to delete client'
        );
      }
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['clients'] });

      // Snapshot previous value
      const previousClients = queryClient.getQueryData(['clients']);

      // Optimistically remove (or mark as deleted)
      queryClient.setQueriesData({ queryKey: ['clients'] }, (old: Client[] | undefined) => {
        if (!old) return old;
        return old.filter((client) => client.id !== id);
      });

      return { previousClients };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
