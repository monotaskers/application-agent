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
import { v4 as uuidv4 } from 'uuid';
import {
  createClientInputSchema,
  updateClientInputSchema,
  clientFiltersSchema,
} from '../schemas/client.schema';
import { getClients as getClientsFromStorage, saveClient } from './storage';
import {
  createClientId,
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
): Promise<Result<Client, ValidationError | UnauthorizedError>> {
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

  // Create client
  const now = new Date();
  const client: Client = {
    id: createClientId(uuidv4()),
    organizationId: createOrganizationId(orgId),
    companyName: validation.data.companyName,
    contactPerson: validation.data.contactPerson,
    email: validation.data.email,
    phone: validation.data.phone,
    address: validation.data.address,
    notes: validation.data.notes,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  // Save to storage
  saveClient(createOrganizationId(orgId), client);

  // Revalidate clients list
  revalidatePath('/clients');

  return {
    success: true,
    data: client,
  };
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
): Promise<Result<Client[], Error | UnauthorizedError>> {
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
        error: new Error('Invalid filters'),
      };
    }
    filters = validation.data;
  }

  // Get clients from storage
  let clients = getClientsFromStorage(createOrganizationId(orgId));

  // Apply filters
  if (!filters?.includeDeleted) {
    clients = clients.filter((client) => client.deletedAt === null);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    clients = clients.filter(
      (client) =>
        client.companyName.toLowerCase().includes(searchLower) ||
        client.contactPerson.toLowerCase().includes(searchLower)
    );
  }

  return {
    success: true,
    data: clients,
  };
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
): Promise<Result<Client, NotFoundError | UnauthorizedError>> {
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

  // Get clients from storage
  const clients = getClientsFromStorage(createOrganizationId(orgId));

  // Find client
  const client = clients.find((c) => c.id === id);

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
}

/**
 * Updates an existing client.
 *
 * @param id - Client ID
 * @param data - Partial client data to update
 * @returns Result with updated Client or ValidationError/NotFoundError
 *
 * @example
 * ```ts
 * const result = await updateClient(clientId, {
 *   contactPerson: 'Jane Doe',
 *   notes: 'Updated notes',
 * });
 * ```
 */
export async function updateClient(
  id: ClientId,
  data: UpdateClientInput
): Promise<
  Result<Client, ValidationError | NotFoundError | UnauthorizedError>
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

  // Get existing client
  const clients = getClientsFromStorage(createOrganizationId(orgId));
  const existingClient = clients.find((c) => c.id === id);

  if (!existingClient) {
    return {
      success: false,
      error: {
        type: 'NotFoundError',
        message: 'Client not found',
      },
    };
  }

  // Merge updates
  const updatedClient: Client = {
    ...existingClient,
    ...validation.data,
    updatedAt: new Date(),
  };

  // Save to storage
  saveClient(createOrganizationId(orgId), updatedClient);

  // Revalidate paths
  revalidatePath('/clients');
  revalidatePath(`/clients/${id}`);

  return {
    success: true,
    data: updatedClient,
  };
}

/**
 * Soft-deletes a client (sets deletedAt timestamp).
 *
 * @param id - Client ID
 * @returns Result with void or NotFoundError
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
): Promise<Result<void, NotFoundError | UnauthorizedError>> {
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

  // Get existing client
  const clients = getClientsFromStorage(createOrganizationId(orgId));
  const existingClient = clients.find((c) => c.id === id);

  if (!existingClient) {
    return {
      success: false,
      error: {
        type: 'NotFoundError',
        message: 'Client not found',
      },
    };
  }

  // Soft delete
  const updatedClient: Client = {
    ...existingClient,
    deletedAt: new Date(),
    updatedAt: new Date(),
  };

  // Save to storage
  saveClient(createOrganizationId(orgId), updatedClient);

  // Revalidate paths
  revalidatePath('/clients');

  return {
    success: true,
    data: undefined,
  };
}
