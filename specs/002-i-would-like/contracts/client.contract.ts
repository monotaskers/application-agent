/**
 * Client Database Operations Contract
 *
 * @fileoverview Defines the expected interface for client database operations.
 * This contract serves as a specification for the database layer implementation.
 * Tests written against this contract must fail until implementation is complete.
 *
 * @module contracts/client.contract
 */

import type {
  Client,
  ClientId,
  CreateClientInput,
  UpdateClientInput,
  ClientFilters,
  OrganizationId,
} from '@/features/clients-projects/types';

/**
 * Client database operations contract.
 * Implementation must be in src/features/clients-projects/db/client.db.ts
 */
export interface ClientDbContract {
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
  createClient(
    orgId: OrganizationId,
    data: CreateClientInput
  ): Promise<Client>;

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
  getClients(
    orgId: OrganizationId,
    filters?: ClientFilters
  ): Promise<Client[]>;

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
  getClientById(
    orgId: OrganizationId,
    clientId: ClientId
  ): Promise<Client | null>;

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
  updateClient(
    orgId: OrganizationId,
    clientId: ClientId,
    data: UpdateClientInput,
    expectedVersion: number
  ): Promise<Client>;

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
  softDeleteClient(
    orgId: OrganizationId,
    clientId: ClientId
  ): Promise<Client>;

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
  restoreClient(
    orgId: OrganizationId,
    clientId: ClientId
  ): Promise<Client>;
}

/**
 * Expected error types for client database operations.
 */
export const ClientDbErrors = {
  INVALID_ORG_ID: 'Invalid organization ID',
  INVALID_CLIENT_ID: 'Invalid client ID',
  VALIDATION_FAILED: 'Client data validation failed',
  NOT_FOUND: 'Client not found',
  ALREADY_DELETED: 'Client already deleted',
  NOT_DELETED: 'Client is not deleted',
  VERSION_CONFLICT: 'Conflict: Client was modified by another user',
  CONNECTION_FAILED: 'Database connection failed',
} as const;

/**
 * Optimistic locking behavior specification.
 *
 * When concurrent edits occur:
 * 1. User A loads client (version 1)
 * 2. User B loads client (version 1)
 * 3. User B saves changes → version becomes 2
 * 4. User A attempts to save with version 1 → CONFLICT
 * 5. User A must refresh and retry with version 2
 */
export type OptimisticLockingBehavior = {
  onConflict: 'throw' | 'retry';
  maxRetries?: number;
};

/**
 * Multi-tenant isolation specification.
 *
 * ALL database operations MUST:
 * 1. Accept organizationId as first parameter
 * 2. Include WHERE organization_id = ? in ALL queries
 * 3. Validate organizationId before query execution
 * 4. Never return data from other organizations
 */
export type MultiTenantIsolation = {
  enforced: 'application-level'; // Not database-level RLS
  filter: 'WHERE organization_id = ?';
  validation: 'Zod schema';
};
