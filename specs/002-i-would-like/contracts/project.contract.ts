/**
 * Project Database Operations Contract
 *
 * @fileoverview Defines the expected interface for project database operations.
 * This contract serves as a specification for the database layer implementation.
 * Tests written against this contract must fail until implementation is complete.
 *
 * @module contracts/project.contract
 */

import type {
  Project,
  ProjectId,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilters,
  ProjectStatus,
  OrganizationId,
  ClientId,
} from '@/features/clients-projects/types';

/**
 * Project database operations contract.
 * Implementation must be in src/features/clients-projects/db/project.db.ts
 */
export interface ProjectDbContract {
  /**
   * Creates a new project in the database.
   *
   * @param orgId - Organization ID for multi-tenant isolation
   * @param data - Project data to create
   * @returns Promise resolving to the created project
   *
   * @throws {Error} If organization ID is invalid
   * @throws {Error} If data validation fails
   * @throws {Error} If client ID is invalid (when provided)
   * @throws {Error} If client not found (when provided)
   * @throws {Error} If database connection fails
   *
   * @example
   * ```ts
   * const project = await createProject(orgId, {
   *   name: 'Website Redesign',
   *   clientId: clientId,
   *   status: 'Planning',
   *   startDate: new Date('2025-01-01')
   * });
   * ```
   */
  createProject(
    orgId: OrganizationId,
    data: CreateProjectInput
  ): Promise<Project>;

  /**
   * Retrieves all projects for an organization.
   *
   * @param orgId - Organization ID for multi-tenant isolation
   * @param filters - Optional filters (search, clientId, status, date ranges)
   * @returns Promise resolving to array of projects
   *
   * @throws {Error} If organization ID is invalid
   * @throws {Error} If database connection fails
   *
   * @example
   * ```ts
   * const all = await getProjects(orgId);
   * const active = await getProjects(orgId, { status: 'Active' });
   * const forClient = await getProjects(orgId, { clientId });
   * const q1 = await getProjects(orgId, {
   *   startDateFrom: new Date('2025-01-01'),
   *   startDateTo: new Date('2025-03-31')
   * });
   * ```
   */
  getProjects(
    orgId: OrganizationId,
    filters?: ProjectFilters
  ): Promise<Project[]>;

  /**
   * Retrieves a single project by ID.
   *
   * @param orgId - Organization ID for multi-tenant isolation
   * @param projectId - Project ID to retrieve
   * @returns Promise resolving to project or null if not found
   *
   * @throws {Error} If organization ID is invalid
   * @throws {Error} If project ID is invalid
   * @throws {Error} If database connection fails
   *
   * @example
   * ```ts
   * const project = await getProjectById(orgId, projectId);
   * if (!project) {
   *   throw new Error('Project not found');
   * }
   * ```
   */
  getProjectById(
    orgId: OrganizationId,
    projectId: ProjectId
  ): Promise<Project | null>;

  /**
   * Updates a project with optimistic locking.
   *
   * @param orgId - Organization ID for multi-tenant isolation
   * @param projectId - Project ID to update
   * @param data - Partial project data to update
   * @param expectedVersion - Expected version for optimistic locking
   * @returns Promise resolving to updated project
   *
   * @throws {Error} If organization ID is invalid
   * @throws {Error} If project ID is invalid
   * @throws {Error} If data validation fails
   * @throws {Error} If version mismatch (concurrent edit conflict)
   * @throws {Error} If project not found
   * @throws {Error} If client ID invalid (when updating clientId)
   * @throws {Error} If status transition invalid
   * @throws {Error} If database connection fails
   *
   * @example
   * ```ts
   * try {
   *   const updated = await updateProject(orgId, projectId, {
   *     name: 'New Name',
   *     status: 'Active'
   *   }, currentVersion);
   * } catch (error) {
   *   if (error.message.includes('Conflict')) {
   *     // Handle concurrent edit conflict
   *   }
   * }
   * ```
   */
  updateProject(
    orgId: OrganizationId,
    projectId: ProjectId,
    data: UpdateProjectInput,
    expectedVersion: number
  ): Promise<Project>;

  /**
   * Updates project status with validation.
   *
   * @param orgId - Organization ID for multi-tenant isolation
   * @param projectId - Project ID to update
   * @param status - New status value
   * @param expectedVersion - Expected version for optimistic locking
   * @returns Promise resolving to updated project
   *
   * @throws {Error} If organization ID is invalid
   * @throws {Error} If project ID is invalid
   * @throws {Error} If status value invalid
   * @throws {Error} If status transition invalid (e.g., Completed → Planning)
   * @throws {Error} If version mismatch (concurrent edit conflict)
   * @throws {Error} If project not found
   * @throws {Error} If database connection fails
   *
   * @example
   * ```ts
   * const updated = await updateProjectStatus(
   *   orgId,
   *   projectId,
   *   'Active',
   *   currentVersion
   * );
   * ```
   */
  updateProjectStatus(
    orgId: OrganizationId,
    projectId: ProjectId,
    status: ProjectStatus,
    expectedVersion: number
  ): Promise<Project>;

  /**
   * Hard deletes a project from the database.
   *
   * @param orgId - Organization ID for multi-tenant isolation
   * @param projectId - Project ID to delete
   * @returns Promise resolving when deletion completes
   *
   * @throws {Error} If organization ID is invalid
   * @throws {Error} If project ID is invalid
   * @throws {Error} If project not found
   * @throws {Error} If database connection fails
   *
   * @example
   * ```ts
   * await deleteProject(orgId, projectId);
   * ```
   */
  deleteProject(
    orgId: OrganizationId,
    projectId: ProjectId
  ): Promise<void>;

  /**
   * Retrieves all projects for a specific client.
   *
   * @param orgId - Organization ID for multi-tenant isolation
   * @param clientId - Client ID to filter projects
   * @returns Promise resolving to array of projects for the client
   *
   * @throws {Error} If organization ID is invalid
   * @throws {Error} If client ID is invalid
   * @throws {Error} If database connection fails
   *
   * @example
   * ```ts
   * const clientProjects = await getProjectsByClient(orgId, clientId);
   * console.log(`Found ${clientProjects.length} projects for client`);
   * ```
   */
  getProjectsByClient(
    orgId: OrganizationId,
    clientId: ClientId
  ): Promise<Project[]>;
}

/**
 * Expected error types for project database operations.
 */
export const ProjectDbErrors = {
  INVALID_ORG_ID: 'Invalid organization ID',
  INVALID_PROJECT_ID: 'Invalid project ID',
  INVALID_CLIENT_ID: 'Invalid client ID',
  INVALID_STATUS: 'Invalid project status',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
  VALIDATION_FAILED: 'Project data validation failed',
  NOT_FOUND: 'Project not found',
  CLIENT_NOT_FOUND: 'Referenced client not found',
  VERSION_CONFLICT: 'Conflict: Project was modified by another user',
  CONNECTION_FAILED: 'Database connection failed',
  END_DATE_BEFORE_START: 'End date must be after start date',
} as const;

/**
 * Project status lifecycle specification.
 *
 * Valid transitions:
 * - Planning → Active, Cancelled
 * - Active → OnHold, Completed, Cancelled
 * - OnHold → Active, Cancelled
 * - Completed → (terminal state)
 * - Cancelled → (terminal state)
 */
export type ProjectStatusTransitions = {
  Planning: ['Active', 'Cancelled'];
  Active: ['OnHold', 'Completed', 'Cancelled'];
  OnHold: ['Active', 'Cancelled'];
  Completed: [];
  Cancelled: [];
};

/**
 * Validates if a status transition is allowed.
 *
 * @param currentStatus - Current project status
 * @param newStatus - Desired new status
 * @returns true if transition is valid, false otherwise
 */
export function isValidStatusTransition(
  currentStatus: ProjectStatus,
  newStatus: ProjectStatus
): boolean {
  if (currentStatus === newStatus) return true;

  const validTransitions: ProjectStatusTransitions = {
    Planning: ['Active', 'Cancelled'],
    Active: ['OnHold', 'Completed', 'Cancelled'],
    OnHold: ['Active', 'Cancelled'],
    Completed: [],
    Cancelled: [],
  };

  return validTransitions[currentStatus].includes(newStatus);
}

/**
 * Client-Project relationship specification.
 *
 * When client is deleted (soft delete):
 * - Projects remain in database
 * - Project.clientId becomes NULL (ON DELETE SET NULL)
 * - Projects can be reassigned to new client
 */
export type ClientProjectRelationship = {
  onClientDelete: 'SET NULL';
  allowNull: true;
  reassignable: true;
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
