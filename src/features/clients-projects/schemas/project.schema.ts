/**
 * Project Validation Schemas
 *
 * @fileoverview Zod schemas for Project entity validation with branded types.
 * @module features/clients-projects/schemas/project
 */

import { z } from 'zod';
import { ProjectStatus } from '../types/project.types';

/**
 * Complete Project schema with all fields and validation rules.
 *
 * Validation rules:
 * - name: Required, 1-200 chars, trimmed
 * - description: Optional, max 2000 chars
 * - clientId: Nullable UUID string
 * - status: One of enum values (Planning, Active, OnHold, Completed, Cancelled)
 * - startDate: Required date
 * - endDate: Nullable date, must be >= startDate if provided
 * - budget: Optional positive number (cents/smallest currency unit)
 * - notes: Optional, max 2000 chars
 * - Timestamps: Required dates
 */
export const projectSchema = z
  .object({
    id: z.string().uuid(),
    organizationId: z.string(),
    name: z.string().min(1).max(200).trim(),
    description: z.string().max(2000).optional(),
    clientId: z.string().uuid().nullable(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.date(),
    endDate: z.date().nullable(),
    budget: z.number().positive().optional(),
    notes: z.string().max(2000).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'End date must be greater than or equal to start date',
    path: ['endDate'],
  });

/**
 * Inferred Project type from schema.
 * Use this for type-safe project objects validated by Zod.
 */
export type ProjectSchema = z.infer<typeof projectSchema>;

/**
 * Input schema for creating a new project.
 * Omits auto-generated fields: id, organizationId, timestamps.
 * Status defaults to Planning if not provided.
 *
 * @example
 * ```ts
 * const input = createProjectInputSchema.parse({
 *   name: 'Website Redesign',
 *   clientId: 'client-uuid',
 *   status: ProjectStatus.Active,
 *   startDate: new Date('2025-01-01'),
 * });
 * ```
 */
export const createProjectInputSchema = projectSchema
  .pick({
    name: true,
    description: true,
    clientId: true,
    status: true,
    startDate: true,
    endDate: true,
    budget: true,
    notes: true,
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'End date must be greater than or equal to start date',
    path: ['endDate'],
  });

/**
 * Inferred CreateProjectInput type from schema.
 */
export type CreateProjectInputSchema = z.infer<
  typeof createProjectInputSchema
>;

/**
 * Input schema for updating an existing project.
 * All fields are optional (partial update).
 * Validates endDate >= startDate if both are provided in the update.
 *
 * @example
 * ```ts
 * const input = updateProjectInputSchema.parse({
 *   status: ProjectStatus.Completed,
 *   endDate: new Date('2025-12-31'),
 * });
 * ```
 */
export const updateProjectInputSchema = createProjectInputSchema.partial();

/**
 * Inferred UpdateProjectInput type from schema.
 */
export type UpdateProjectInputSchema = z.infer<
  typeof updateProjectInputSchema
>;

/**
 * Filter schema for querying projects.
 *
 * @example
 * ```ts
 * const filters = projectFiltersSchema.parse({
 *   search: 'Website',
 *   status: ProjectStatus.Active,
 *   startDateFrom: new Date('2025-01-01'),
 * });
 * ```
 */
export const projectFiltersSchema = z.object({
  search: z.string().optional(),
  clientId: z.string().uuid().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  endDateFrom: z.date().optional(),
  endDateTo: z.date().optional(),
});

/**
 * Inferred ProjectFilters type from schema.
 */
export type ProjectFiltersSchema = z.infer<typeof projectFiltersSchema>;
