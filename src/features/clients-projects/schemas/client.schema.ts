/**
 * Client Validation Schemas
 *
 * @fileoverview Zod schemas for Client entity validation with branded types.
 * @module features/clients-projects/schemas/client
 */

import { z } from 'zod';

/**
 * Complete Client schema with all fields and validation rules.
 *
 * Validation rules:
 * - companyName: Required, 1-200 chars, trimmed
 * - contactPerson: Required, 1-100 chars, trimmed
 * - email: Required, valid email format
 * - phone: Required, min 1 char
 * - address: Optional, max 500 chars
 * - notes: Optional, max 2000 chars
 * - deletedAt: Nullable date
 * - Timestamps: Required dates
 */
export const clientSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string(),
  companyName: z.string().min(1).max(200).trim(),
  contactPerson: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Inferred Client type from schema.
 * Use this for type-safe client objects validated by Zod.
 */
export type ClientSchema = z.infer<typeof clientSchema>;

/**
 * Input schema for creating a new client.
 * Omits auto-generated fields: id, organizationId, deletedAt, timestamps.
 *
 * @example
 * ```ts
 * const input = createClientInputSchema.parse({
 *   companyName: 'Acme Corp',
 *   contactPerson: 'John Doe',
 *   email: 'john@acme.com',
 *   phone: '+1234567890',
 * });
 * ```
 */
export const createClientInputSchema = clientSchema.pick({
  companyName: true,
  contactPerson: true,
  email: true,
  phone: true,
  address: true,
  notes: true,
});

/**
 * Inferred CreateClientInput type from schema.
 */
export type CreateClientInputSchema = z.infer<
  typeof createClientInputSchema
>;

/**
 * Input schema for updating an existing client.
 * All fields are optional (partial update).
 *
 * @example
 * ```ts
 * const input = updateClientInputSchema.parse({
 *   email: 'newemail@acme.com',
 *   phone: '+0987654321',
 * });
 * ```
 */
export const updateClientInputSchema = createClientInputSchema.partial();

/**
 * Inferred UpdateClientInput type from schema.
 */
export type UpdateClientInputSchema = z.infer<
  typeof updateClientInputSchema
>;

/**
 * Filter schema for querying clients.
 *
 * @example
 * ```ts
 * const filters = clientFiltersSchema.parse({
 *   search: 'Acme',
 *   includeDeleted: false,
 * });
 * ```
 */
export const clientFiltersSchema = z.object({
  search: z.string().optional(),
  includeDeleted: z.boolean().optional().default(false),
});

/**
 * Inferred ClientFilters type from schema.
 */
export type ClientFiltersSchema = z.infer<typeof clientFiltersSchema>;
