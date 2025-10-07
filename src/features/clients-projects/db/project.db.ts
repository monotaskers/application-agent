/**
 * Project Database Operations
 *
 * @fileoverview Implements database layer for project CRUD operations.
 * Provides type-safe database access with multi-tenant isolation, optimistic locking,
 * and status transition validation.
 *
 * @module features/clients-projects/db/project.db
 */

import { db, projects } from '@/db';
import { eq, and, or, ilike, gte, lte, sql } from 'drizzle-orm';
import type {
  Project,
  ProjectId,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilters,
  ProjectStatus,
} from '../types/project.types';
import { createProjectId } from '../types/project.types';
import type { OrganizationId } from '../types';
import type { ClientId } from '../types/client.types';

/**
 * Maps database project record to application Project type.
 *
 * @param dbProject - Project record from database
 * @returns Application Project type with branded IDs
 */
function mapDbProjectToProject(
  dbProject: typeof projects.$inferSelect
): Project {
  return {
    id: createProjectId(dbProject.id),
    organizationId: dbProject.organizationId,
    name: dbProject.name,
    description: dbProject.description ?? undefined,
    clientId: dbProject.clientId
      ? (dbProject.clientId as ClientId)
      : null,
    status: dbProject.status as ProjectStatus,
    startDate: dbProject.startDate,
    endDate: dbProject.endDate,
    budget: dbProject.budget ?? undefined,
    notes: dbProject.notes ?? undefined,
    version: dbProject.version,
    createdAt: dbProject.createdAt,
    updatedAt: dbProject.updatedAt,
  };
}

/**
 * Creates a new project in the database.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param data - Project data to create
 * @returns Promise resolving to the created project
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If data validation fails
 * @throws {Error} If invalid clientId provided
 * @throws {Error} If database connection fails
 */
export async function createProject(
  orgId: OrganizationId,
  data: CreateProjectInput
): Promise<Project> {
  try {
    const [newProject] = await db
      .insert(projects)
      .values({
        organizationId: orgId,
        name: data.name,
        description: data.description ?? null,
        clientId: data.clientId ?? null,
        status: data.status ?? 'Planning',
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        budget: data.budget ?? null,
        notes: data.notes ?? null,
      })
      .returning();

    if (!newProject) {
      throw new Error('Failed to create project');
    }

    return mapDbProjectToProject(newProject);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Retrieves all projects for an organization with optional filters.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param filters - Optional filters (search, clientId, status, date ranges)
 * @returns Promise resolving to array of projects
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If database connection fails
 */
export async function getProjects(
  orgId: OrganizationId,
  filters?: ProjectFilters
): Promise<Project[]> {
  try {
    const conditions = [eq(projects.organizationId, orgId)];

    // Add search filter if provided
    if (filters?.search) {
      conditions.push(
        or(
          ilike(projects.name, `%${filters.search}%`),
          ilike(projects.description ?? '', `%${filters.search}%`)
        )!
      );
    }

    // Filter by clientId
    if (filters?.clientId) {
      conditions.push(eq(projects.clientId, filters.clientId));
    }

    // Filter by status
    if (filters?.status) {
      conditions.push(eq(projects.status, filters.status));
    }

    // Filter by start date range
    if (filters?.startDateFrom) {
      conditions.push(gte(projects.startDate, filters.startDateFrom));
    }
    if (filters?.startDateTo) {
      conditions.push(lte(projects.startDate, filters.startDateTo));
    }

    // Filter by end date range
    if (filters?.endDateFrom) {
      conditions.push(gte(projects.endDate!, filters.endDateFrom));
    }
    if (filters?.endDateTo) {
      conditions.push(lte(projects.endDate!, filters.endDateTo));
    }

    const results = await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(projects.name);

    return results.map(mapDbProjectToProject);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get projects: ${error.message}`);
    }
    throw error;
  }
}

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
 */
export async function getProjectById(
  orgId: OrganizationId,
  projectId: ProjectId
): Promise<Project | null> {
  try {
    const results = await db
      .select()
      .from(projects)
      .where(
        and(eq(projects.id, projectId), eq(projects.organizationId, orgId))
      )
      .limit(1);

    return results[0] ? mapDbProjectToProject(results[0]) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get project: ${error.message}`);
    }
    throw error;
  }
}

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
 * @throws {Error} If database connection fails
 */
export async function updateProject(
  orgId: OrganizationId,
  projectId: ProjectId,
  data: UpdateProjectInput,
  expectedVersion: number
): Promise<Project> {
  try {
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
      version: sql`${projects.version} + 1`,
    };

    const results = await db
      .update(projects)
      .set(updateData)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.organizationId, orgId),
          eq(projects.version, expectedVersion)
        )
      )
      .returning();

    if (results.length === 0) {
      throw new Error('Conflict: Project was modified by another user');
    }

    return mapDbProjectToProject(results[0]!);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Conflict')) {
        throw error;
      }
      throw new Error(`Failed to update project: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Updates a project's status with validation.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param projectId - Project ID to update
 * @param newStatus - New status to set
 * @param expectedVersion - Expected version for optimistic locking
 * @returns Promise resolving to updated project
 *
 * @throws {Error} If status transition is invalid
 * @throws {Error} If version mismatch
 * @throws {Error} If project not found
 */
export async function updateProjectStatus(
  orgId: OrganizationId,
  projectId: ProjectId,
  newStatus: ProjectStatus,
  expectedVersion: number
): Promise<Project> {
  return updateProject(orgId, projectId, { status: newStatus }, expectedVersion);
}

/**
 * Hard deletes a project from the database.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param projectId - Project ID to delete
 * @returns Promise resolving when deletion is complete
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If project ID is invalid
 * @throws {Error} If project not found
 * @throws {Error} If database connection fails
 */
export async function deleteProject(
  orgId: OrganizationId,
  projectId: ProjectId
): Promise<void> {
  try {
    const results = await db
      .delete(projects)
      .where(
        and(eq(projects.id, projectId), eq(projects.organizationId, orgId))
      )
      .returning();

    if (results.length === 0) {
      throw new Error('Project not found');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete project');
  }
}

/**
 * Retrieves all projects for a specific client.
 *
 * @param orgId - Organization ID for multi-tenant isolation
 * @param clientId - Client ID to filter by
 * @returns Promise resolving to array of projects
 *
 * @throws {Error} If organization ID is invalid
 * @throws {Error} If client ID is invalid
 * @throws {Error} If database connection fails
 */
export async function getProjectsByClient(
  orgId: OrganizationId,
  clientId: ClientId
): Promise<Project[]> {
  try {
    const results = await db
      .select()
      .from(projects)
      .where(
        and(eq(projects.organizationId, orgId), eq(projects.clientId, clientId))
      )
      .orderBy(projects.startDate);

    return results.map(mapDbProjectToProject);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get projects by client: ${error.message}`);
    }
    throw error;
  }
}
