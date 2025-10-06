/**
 * Client Type Definitions
 *
 * @fileoverview Type definitions for Client entity with branded types for type safety.
 * @module features/clients-projects/types/client
 */

/**
 * Branded type for Client IDs to prevent accidental ID mixing.
 *
 * @example
 * ```ts
 * const id = createClientId('550e8400-e29b-41d4-a716-446655440000');
 * ```
 */
export type ClientId = string & { readonly __brand: 'ClientId' };

/**
 * Helper function to create a branded ClientId.
 *
 * @param id - UUID string to brand as ClientId
 * @returns Branded ClientId
 */
export const createClientId = (id: string): ClientId => id as ClientId;

/**
 * Client entity representing a business or individual client.
 *
 * @interface Client
 * @property {ClientId} id - Unique identifier (UUID)
 * @property {OrganizationId} organizationId - Clerk organization ID
 * @property {string} companyName - Company/organization name (1-200 chars)
 * @property {string} contactPerson - Primary contact person name (1-100 chars)
 * @property {string} email - Contact email address (validated format)
 * @property {string} phone - Contact phone number (E.164 format recommended)
 * @property {string} [address] - Optional address (max 500 chars)
 * @property {string} [notes] - Optional notes (max 2000 chars)
 * @property {Date | null} deletedAt - Soft delete timestamp (null = active)
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface Client {
  // Identity
  id: ClientId;
  organizationId: string; // OrganizationId type defined in shared types

  // Core Information
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;

  // Optional Details
  address?: string;
  notes?: string;

  // Soft Delete Support
  deletedAt: Date | null;

  // Audit Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new client.
 * Omits auto-generated fields (id, timestamps, organizationId, deletedAt).
 *
 * @interface CreateClientInput
 */
export interface CreateClientInput {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

/**
 * Input type for updating an existing client.
 * All fields are optional (partial update).
 *
 * @interface UpdateClientInput
 */
export interface UpdateClientInput {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

/**
 * Filters for querying clients.
 *
 * @interface ClientFilters
 * @property {string} [search] - Search by company name or contact person
 * @property {boolean} [includeDeleted] - Include soft-deleted clients (default: false)
 */
export interface ClientFilters {
  search?: string;
  includeDeleted?: boolean;
}
