/**
 * Project Type Definitions
 *
 * @fileoverview Type definitions for Project entity with branded types and status enum.
 * @module features/clients-projects/types/project
 */

import type { ClientId } from './client.types';

/**
 * Branded type for Project IDs to prevent accidental ID mixing.
 *
 * @example
 * ```ts
 * const id = createProjectId('770e8400-e29b-41d4-a716-446655440000');
 * ```
 */
export type ProjectId = string & { readonly __brand: 'ProjectId' };

/**
 * Helper function to create a branded ProjectId.
 *
 * @param id - UUID string to brand as ProjectId
 * @returns Branded ProjectId
 */
export const createProjectId = (id: string): ProjectId => id as ProjectId;

/**
 * Project status enum defining valid lifecycle states.
 *
 * @enum {string}
 * @readonly
 */
export enum ProjectStatus {
  /** Initial planning phase */
  Planning = 'Planning',
  /** Currently in progress */
  Active = 'Active',
  /** Temporarily paused */
  OnHold = 'OnHold',
  /** Successfully finished */
  Completed = 'Completed',
  /** Terminated before completion */
  Cancelled = 'Cancelled',
}

/**
 * Project entity representing a project or engagement.
 *
 * @interface Project
 * @property {ProjectId} id - Unique identifier (UUID)
 * @property {OrganizationId} organizationId - Clerk organization ID
 * @property {string} name - Project name (1-200 chars)
 * @property {string} [description] - Optional description (max 2000 chars)
 * @property {ClientId | null} clientId - Optional reference to Client
 * @property {ProjectStatus} status - Current lifecycle status
 * @property {Date} startDate - Project start date
 * @property {Date | null} endDate - Optional end date
 * @property {number} [budget] - Optional budget (positive number, cents/smallest unit)
 * @property {string} [notes] - Optional notes (max 2000 chars)
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface Project {
  // Identity
  id: ProjectId;
  organizationId: string; // OrganizationId type defined in shared types

  // Core Information
  name: string;
  description?: string;

  // Relationships
  clientId: ClientId | null;

  // Status & Lifecycle
  status: ProjectStatus;
  startDate: Date;
  endDate: Date | null;

  // Financial (Optional)
  budget?: number;

  // Additional Details
  notes?: string;

  // Audit Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new project.
 * Omits auto-generated fields (id, timestamps, organizationId).
 * Status defaults to Planning if not provided.
 *
 * @interface CreateProjectInput
 */
export interface CreateProjectInput {
  name: string;
  description?: string;
  clientId?: ClientId | null;
  status?: ProjectStatus;
  startDate: Date;
  endDate?: Date | null;
  budget?: number;
  notes?: string;
}

/**
 * Input type for updating an existing project.
 * All fields are optional (partial update).
 *
 * @interface UpdateProjectInput
 */
export interface UpdateProjectInput {
  name?: string;
  description?: string;
  clientId?: ClientId | null;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date | null;
  budget?: number;
  notes?: string;
}

/**
 * Filters for querying projects.
 *
 * @interface ProjectFilters
 * @property {string} [search] - Search by name or description
 * @property {ClientId} [clientId] - Filter by client
 * @property {ProjectStatus} [status] - Filter by status
 * @property {Date} [startDateFrom] - Filter by start date range (from)
 * @property {Date} [startDateTo] - Filter by start date range (to)
 * @property {Date} [endDateFrom] - Filter by end date range (from)
 * @property {Date} [endDateTo] - Filter by end date range (to)
 */
export interface ProjectFilters {
  search?: string;
  clientId?: ClientId;
  status?: ProjectStatus;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
}
