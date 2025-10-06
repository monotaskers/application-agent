/**
 * useClients Hook
 *
 * @fileoverview React Query hook for fetching clients with optional filters.
 * Provides automatic caching, background refetching, and loading/error states.
 *
 * @module features/clients-projects/hooks/use-clients
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getClients } from '../actions/client.actions';
import type { ClientFilters, Client } from '../types';

/**
 * Hook for fetching clients with TanStack Query.
 *
 * @param filters - Optional filters for search and soft-deleted clients
 * @returns Query result with clients data, loading, and error states
 *
 * @example
 * ```tsx
 * // Fetch all active clients
 * const { data: clients, isLoading, error } = useClients();
 *
 * // Search for clients
 * const { data: searchResults } = useClients({ search: 'Acme' });
 *
 * // Include soft-deleted clients
 * const { data: allClients } = useClients({ includeDeleted: true });
 * ```
 */
export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: async (): Promise<Client[]> => {
      const result = await getClients(filters);

      if (!result.success) {
        throw new Error(
          result.error instanceof Error
            ? result.error.message
            : 'Failed to fetch clients'
        );
      }

      return result.data;
    },
    refetchOnWindowFocus: true, // Enable for collaboration
    staleTime: 30000, // 30 seconds
  });
}
