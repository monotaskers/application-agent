/**
 * Client Database Operations
 *
 * @fileoverview Implements database layer for client CRUD operations.
 * Provides type-safe database access with multi-tenant isolation and optimistic locking.
 *
 * @module features/clients-projects/db/client.db
 */

import { db, clients } from '@/db';
import { eq, and, isNull, or, ilike, sql } from 'drizzle-orm';
import type {
  Client,
  ClientId,
  CreateClientInput,
  UpdateClientInput,
  ClientFilters,
} from '../types/client.types';
import { createClientId } from '../types/client.types';
import type { OrganizationId } from '../types';

/**
 * Maps database client record to application Client type.
 *
 * @param dbClient - Client record from database
 * @returns Application Client type with branded IDs
 */
function mapDbClientToClient(
  dbClient: typeof clients.$inferSelect
): Client {
  return {
    id: createClientId(dbClient.id),
    organizationId: dbClient.organizationId,
    companyName: dbClient.companyName,
    contactPerson: dbClient.contactPerson,
    email: dbClient.email,
    phone: dbClient.phone,
    address: dbClient.address ?? undefined,
    notes: dbClient.notes ?? undefined,
    version: dbClient.version,
    deletedAt: dbClient.deletedAt,
    createdAt: dbClient.createdAt,
    updatedAt: dbClient.updatedAt,
  };
}

/**
 * Creates a new client in the database.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param data - Client data to create
 * @returns Promise resolving to the created client
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If data validation fails
 * @throws {Error} If database connection fails
 *
 * @example
 * ```ts
 * const client = await createClient(orgId, {
 *   companyName: 'Acme Corp',
 *   contactPerson: 'John Doe',
 *   email: 'john@acme.com',
 *   phone: '+1234567890'
 * });
 * ```
 */
export async function createClient(
  orgId: OrganizationId,
  data: CreateClientInput
): Promise<Client> {
  try {
    const [newClient] = await db
      .insert(clients)
      .values({
        organizationId: orgId,
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        address: data.address ?? null,
        notes: data.notes ?? null,
      })
      .returning();

    if (!newClient) {
      throw new Error('Failed to create client');
    }

    return mapDbClientToClient(newClient);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Retrieves all clients for an organization.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param filters - Optional filters (search, includeDeleted)
 * @returns Promise resolving to array of clients
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If database connection fails
 *
 * @example
 * ```ts
 * const clients = await getClients(orgId, { includeDeleted: false });
 * const searchResults = await getClients(orgId, { search: 'Acme' });
 * ```
 */
export async function getClients(
  orgId: OrganizationId,
  filters?: ClientFilters
): Promise<Client[]> {
  try {
    const conditions = [eq(clients.organizationId, orgId)];

    // Exclude soft-deleted clients by default
    if (!filters?.includeDeleted) {
      conditions.push(isNull(clients.deletedAt));
    }

    // Add search filter if provided
    if (filters?.search) {
      conditions.push(
        or(
          ilike(clients.companyName, `%${filters.search}%`),
          ilike(clients.contactPerson, `%${filters.search}%`)
        )!
      );
    }

    const results = await db
      .select()
      .from(clients)
      .where(and(...conditions))
      .orderBy(clients.companyName);

    return results.map(mapDbClientToClient);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get clients: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Retrieves a single client by ID.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param clientId - Client ID to retrieve
 * @returns Promise resolving to client or null if not found
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If client ID is invalid
 * @throws {Error} If database connection fails
 *
 * @example
 * ```ts
 * const client = await getClientById(orgId, clientId);
 * if (!client) {
 *   throw new Error('Client not found');
 * }
 * ```
 */
export async function getClientById(
  orgId: OrganizationId,
  clientId: ClientId
): Promise<Client | null> {
  try {
    const results = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, orgId)))
      .limit(1);

    return results[0] ? mapDbClientToClient(results[0]) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get client: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Updates a client with optimistic locking.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param clientId - Client ID to update
 * @param data - Partial client data to update
 * @param expectedVersion - Expected version for optimistic locking
 * @returns Promise resolving to updated client
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If client ID is invalid
 * @throws {Error} If data validation fails
 * @throws {Error} If version mismatch (concurrent edit conflict)
 * @throws {Error} If client not found
 * @throws {Error} If database connection fails
 *
 * @example
 * ```ts
 * try {
 *   const updated = await updateClient(orgId, clientId, {
 *     companyName: 'New Name'
 *   }, currentVersion);
 * } catch (error) {
 *   if (error.message.includes('Conflict')) {
 *     // Handle concurrent edit conflict
 *   }
 * }
 * ```
 */
export async function updateClient(
  orgId: OrganizationId,
  clientId: ClientId,
  data: UpdateClientInput,
  expectedVersion: number
): Promise<Client> {
  try {
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
      version: sql`${clients.version} + 1`,
    };

    const results = await db
      .update(clients)
      .set(updateData)
      .where(
        and(
          eq(clients.id, clientId),
          eq(clients.organizationId, orgId),
          eq(clients.version, expectedVersion)
        )
      )
      .returning();

    if (results.length === 0) {
      throw new Error('Conflict: Client was modified by another user');
    }

    return mapDbClientToClient(results[0]!);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Conflict')) {
        throw error;
      }
      throw new Error(`Failed to update client: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Soft deletes a client by setting deletedAt timestamp.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param clientId - Client ID to soft delete
 * @returns Promise resolving to soft deleted client
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If client ID is invalid
 * @throws {Error} If client not found
 * @throws {Error} If client already deleted
 * @throws {Error} If database connection fails
 *
 * @example
 * ```ts
 * const deleted = await softDeleteClient(orgId, clientId);
 * console.log(deleted.deletedAt); // Timestamp of deletion
 * ```
 */
export async function softDeleteClient(
  orgId: OrganizationId,
  clientId: ClientId
): Promise<Client> {
  try {
    // First check if client exists and is not already deleted
    const existing = await getClientById(orgId, clientId);
    if (!existing) {
      throw new Error('Client not found');
    }
    if (existing.deletedAt) {
      throw new Error('Client already deleted');
    }

    const results = await db
      .update(clients)
      .set({ deletedAt: new Date() })
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, orgId)))
      .returning();

    if (results.length === 0) {
      throw new Error('Client not found');
    }

    return mapDbClientToClient(results[0]!);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to soft delete client');
  }
}

/**
 * Restores a soft-deleted client.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param clientId - Client ID to restore
 * @returns Promise resolving to restored client
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If client ID is invalid
 * @throws {Error} If client not found
 * @throws {Error} If client not deleted
 * @throws {Error} If database connection fails
 *
 * @example
 * ```ts
 * const restored = await restoreClient(orgId, clientId);
 * console.log(restored.deletedAt); // null
 * ```
 */
export async function restoreClient(
  orgId: OrganizationId,
  clientId: ClientId
): Promise<Client> {
  try {
    // First check if client exists and is deleted
    const existing = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, orgId)))
      .limit(1);

    if (existing.length === 0) {
      throw new Error('Client not found');
    }

    if (!existing[0]!.deletedAt) {
      throw new Error('Client is not deleted');
    }

    const results = await db
      .update(clients)
      .set({ deletedAt: null })
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, orgId)))
      .returning();

    if (results.length === 0) {
      throw new Error('Client not found');
    }

    return mapDbClientToClient(results[0]!);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to restore client');
  }
}
