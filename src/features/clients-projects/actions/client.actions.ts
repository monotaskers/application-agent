/**
 * Client Server Actions
 *
 * @fileoverview Server Actions for client CRUD operations with Clerk authentication.
 * All actions enforce organization-level data isolation.
 *
 * @module features/clients-projects/actions/client
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import {
  createClientInputSchema,
  updateClientInputSchema,
  clientFiltersSchema,
} from '../schemas/client.schema';
import {
  createClient as createClientDb,
  getClients as getClientsDb,
  getClientById as getClientByIdDb,
  updateClient as updateClientDb,
  softDeleteClient as softDeleteClientDb,
} from '../db';
import {
  createOrganizationId,
  type Client,
  type CreateClientInput,
  type UpdateClientInput,
  type ClientFilters,
  type ClientId,
  type Result,
} from '../types';

/**
 * Error types for client operations.
 */
type ValidationError = {
  type: 'ValidationError';
  message: string;
  fields?: Record<string, string>;
};

type NotFoundError = {
  type: 'NotFoundError';
  message: string;
};

type UnauthorizedError = {
  type: 'UnauthorizedError';
  message: string;
};

type ConflictError = {
  type: 'ConflictError';
  message: string;
};

type DatabaseError = {
  type: 'DatabaseError';
  message: string;
};

/**
 * Creates a new client for the authenticated user's organization.
 *
 * @param data - Client creation input data
 * @returns Result with created Client or ValidationError
 *
 * @example
 * ```ts
 * const result = await createClient({
 *   companyName: 'Acme Corporation',
 *   contactPerson: 'John Doe',
 *   email: 'john@acme.com',
 *   phone: '+1234567890',
 * });
 *
 * if (result.success) {
 *   console.log('Client created:', result.data.id);
 * }
 * ```
 */
export async function createClient(
  data: CreateClientInput
): Promise<Result<Client, ValidationError | UnauthorizedError | DatabaseError>> {
  // Authenticate and get organization ID
  const { orgId } = await auth();

  if (!orgId) {
    return {
      success: false,
      error: {
        type: 'UnauthorizedError',
        message: 'User must belong to an organization',
      },
    };
  }

  // Validate input
  const validation = createClientInputSchema.safeParse(data);

  if (!validation.success) {
    const fields: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      fields[field] = issue.message;
    });

    return {
      success: false,
      error: {
        type: 'ValidationError',
        message: 'Invalid input data',
        fields,
      },
    };
  }

  try {
    // Create client in database
    const client = await createClientDb(
      createOrganizationId(orgId),
      validation.data
    );

    // Revalidate clients list
    revalidatePath('/clients');

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to create client',
      },
    };
  }
}

/**
 * Retrieves all clients for the authenticated user's organization.
 *
 * @param filters - Optional filters for search and soft-deleted clients
 * @returns Result with array of Clients or Error
 *
 * @example
 * ```ts
 * // Get all active clients
 * const result = await getClients();
 *
 * // Search for clients
 * const searchResult = await getClients({ search: 'Acme' });
 *
 * // Include soft-deleted clients
 * const allResult = await getClients({ includeDeleted: true });
 * ```
 */
export async function getClients(
  filters?: ClientFilters
): Promise<Result<Client[], ValidationError | UnauthorizedError | DatabaseError>> {
  // Authenticate and get organization ID
  const { orgId } = await auth();

  if (!orgId) {
    return {
      success: false,
      error: {
        type: 'UnauthorizedError',
        message: 'User must belong to an organization',
      },
    };
  }

  // Validate filters if provided
  if (filters) {
    const validation = clientFiltersSchema.safeParse(filters);
    if (!validation.success) {
      return {
        success: false,
        error: {
          type: 'ValidationError',
          message: 'Invalid filters',
        },
      };
    }
    filters = validation.data;
  }

  try {
    // Get clients from database
    const clients = await getClientsDb(
      createOrganizationId(orgId),
      filters
    );

    return {
      success: true,
      data: clients,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to fetch clients',
      },
    };
  }
}

/**
 * Retrieves a single client by ID.
 *
 * @param id - Client ID
 * @returns Result with Client or NotFoundError
 *
 * @example
 * ```ts
 * const result = await getClientById(clientId);
 *
 * if (result.success) {
 *   console.log('Client:', result.data.companyName);
 * }
 * ```
 */
export async function getClientById(
  id: ClientId
): Promise<Result<Client, NotFoundError | UnauthorizedError | DatabaseError>> {
  // Authenticate and get organization ID
  const { orgId } = await auth();

  if (!orgId) {
    return {
      success: false,
      error: {
        type: 'UnauthorizedError',
        message: 'User must belong to an organization',
      },
    };
  }

  try {
    // Get client from database
    const client = await getClientByIdDb(createOrganizationId(orgId), id);

    if (!client) {
      return {
        success: false,
        error: {
          type: 'NotFoundError',
          message: 'Client not found',
        },
      };
    }

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to fetch client',
      },
    };
  }
}

/**
 * Updates an existing client with optimistic locking.
 *
 * @param id - Client ID
 * @param data - Partial client data to update
 * @param expectedVersion - Expected version for optimistic locking
 * @returns Result with updated Client or ValidationError/NotFoundError/ConflictError
 *
 * @example
 * ```ts
 * const result = await updateClient(clientId, {
 *   contactPerson: 'Jane Doe',
 *   notes: 'Updated notes',
 * }, currentVersion);
 *
 * if (!result.success && result.error.type === 'ConflictError') {
 *   // Handle concurrent edit conflict
 * }
 * ```
 */
export async function updateClient(
  id: ClientId,
  data: UpdateClientInput,
  expectedVersion: number
): Promise<
  Result<Client, ValidationError | NotFoundError | UnauthorizedError | ConflictError | DatabaseError>
> {
  // Authenticate and get organization ID
  const { orgId } = await auth();

  if (!orgId) {
    return {
      success: false,
      error: {
        type: 'UnauthorizedError',
        message: 'User must belong to an organization',
      },
    };
  }

  // Validate input
  const validation = updateClientInputSchema.safeParse(data);

  if (!validation.success) {
    const fields: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      fields[field] = issue.message;
    });

    return {
      success: false,
      error: {
        type: 'ValidationError',
        message: 'Invalid input data',
        fields,
      },
    };
  }

  try {
    // Update client in database with optimistic locking
    const updatedClient = await updateClientDb(
      createOrganizationId(orgId),
      id,
      validation.data,
      expectedVersion
    );

    // Revalidate paths
    revalidatePath('/clients');
    revalidatePath(`/clients/${id}`);

    return {
      success: true,
      data: updatedClient,
    };
  } catch (error) {
    if (error instanceof Error) {
      // Handle optimistic locking conflict
      if (error.message.includes('Conflict')) {
        return {
          success: false,
          error: {
            type: 'ConflictError',
            message: 'Client was modified by another user. Please refresh and try again.',
          },
        };
      }

      // Handle not found error
      if (error.message.includes('not found')) {
        return {
          success: false,
          error: {
            type: 'NotFoundError',
            message: 'Client not found',
          },
        };
      }
    }

    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to update client',
      },
    };
  }
}

/**
 * Soft-deletes a client (sets deletedAt timestamp).
 *
 * @param id - Client ID
 * @returns Result with soft-deleted Client or NotFoundError
 *
 * @example
 * ```ts
 * const result = await softDeleteClient(clientId);
 *
 * if (result.success) {
 *   console.log('Client soft-deleted');
 * }
 * ```
 */
export async function softDeleteClient(
  id: ClientId
): Promise<Result<Client, NotFoundError | UnauthorizedError | DatabaseError>> {
  // Authenticate and get organization ID
  const { orgId } = await auth();

  if (!orgId) {
    return {
      success: false,
      error: {
        type: 'UnauthorizedError',
        message: 'User must belong to an organization',
      },
    };
  }

  try {
    // Soft delete client in database
    const deletedClient = await softDeleteClientDb(
      createOrganizationId(orgId),
      id
    );

    // Revalidate paths
    revalidatePath('/clients');

    return {
      success: true,
      data: deletedClient,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return {
        success: false,
        error: {
          type: 'NotFoundError',
          message: 'Client not found',
        },
      };
    }

    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to delete client',
      },
    };
  }
}
