/**
 * Shared Type Definitions
 *
 * @fileoverview Shared types and re-exports for the clients-projects feature.
 * @module features/clients-projects/types
 */

/**
 * Branded type for Organization IDs (from Clerk).
 * Prevents accidental mixing of organization IDs with other ID types.
 *
 * @example
 * ```ts
 * const orgId = createOrganizationId('org_2abc123');
 * ```
 */
export type OrganizationId = string & { readonly __brand: 'OrganizationId' };

/**
 * Helper function to create a branded OrganizationId.
 *
 * @param id - Organization ID string from Clerk
 * @returns Branded OrganizationId
 */
export const createOrganizationId = (id: string): OrganizationId =>
  id as OrganizationId;

/**
 * Result type for error handling in Server Actions.
 * Represents either a successful result with data or a failure with an error.
 *
 * @template T - Type of the success data
 * @template E - Type of the error (defaults to Error)
 *
 * @example
 * ```ts
 * const result: Result<Client, ValidationError> = await createClient(data);
 * if (result.success) {
 *   console.log(result.data); // Client
 * } else {
 *   console.error(result.error); // ValidationError
 * }
 * ```
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Re-export client types
export type {
  ClientId,
  Client,
  CreateClientInput,
  UpdateClientInput,
  ClientFilters,
} from './client.types';
export { createClientId } from './client.types';

// Re-export project types
export type {
  ProjectId,
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilters,
} from './project.types';
export { createProjectId, ProjectStatus } from './project.types';
