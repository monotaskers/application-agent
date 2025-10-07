/**
 * Project Server Actions
 *
 * @fileoverview Server Actions for project CRUD operations with Clerk authentication.
 * All actions enforce organization-level data isolation.
 *
 * @module features/clients-projects/actions/project
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import {
  createProjectInputSchema,
  updateProjectInputSchema,
  projectFiltersSchema,
} from '../schemas/project.schema';
import {
  createProject as createProjectDb,
  getProjects as getProjectsDb,
  getProjectById as getProjectByIdDb,
  updateProject as updateProjectDb,
  updateProjectStatus as updateProjectStatusDb,
  deleteProject as deleteProjectDb,
} from '../db';
import { getClientById as getClientByIdDb } from '../db';
import {
  createOrganizationId,
  type Project,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ProjectFilters,
  type ProjectId,
  type Result,
} from '../types';

/**
 * Error types for project operations.
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

type ConflictError = {
  type: 'ConflictError';
  message: string;
};

type DatabaseError = {
  type: 'DatabaseError';
  message: string;
};

/**
 * Creates a new project for the authenticated user's organization.
 *
 * @param data - Project creation input data
 * @returns Result with created Project or ValidationError
 *
 * @example
 * ```ts
 * const result = await createProject({
 *   name: 'Website Redesign',
 *   description: 'Complete overhaul',
 *   clientId: someClientId,
 *   startDate: new Date('2025-10-15'),
 * });
 *
 * if (result.success) {
 *   console.log('Project created:', result.data.id);
 * }
 * ```
 */
export async function createProject(
  data: CreateProjectInput
): Promise<Result<Project, ValidationError | UnauthorizedError | DatabaseError>> {
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
  const validation = createProjectInputSchema.safeParse(data);

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

  // If clientId provided, verify client exists and belongs to org
  if (validation.data.clientId) {
    try {
      const client = await getClientByIdDb(
        createOrganizationId(orgId),
        validation.data.clientId
      );

      if (!client) {
        return {
          success: false,
          error: {
            type: 'ValidationError',
            message: 'Invalid client assignment',
            fields: {
              clientId: 'Client not found or does not belong to organization',
            },
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'DatabaseError',
          message: error instanceof Error ? error.message : 'Failed to verify client',
        },
      };
    }
  }

  try {
    // Create project in database
    const project = await createProjectDb(
      createOrganizationId(orgId),
      validation.data
    );

    // Revalidate projects list
    revalidatePath('/projects');

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to create project',
      },
    };
  }
}

/**
 * Retrieves all projects for the authenticated user's organization.
 *
 * @param filters - Optional filters for search, client, status, and date ranges
 * @returns Result with array of Projects or Error
 *
 * @example
 * ```ts
 * // Get all projects
 * const result = await getProjects();
 *
 * // Filter by status
 * const activeResult = await getProjects({ status: ProjectStatus.Active });
 *
 * // Filter by client
 * const clientResult = await getProjects({ clientId: someClientId });
 * ```
 */
export async function getProjects(
  filters?: ProjectFilters
): Promise<Result<Project[], ValidationError | UnauthorizedError | DatabaseError>> {
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
    const validation = projectFiltersSchema.safeParse(filters);
    if (!validation.success) {
      return {
        success: false,
        error: {
          type: 'ValidationError',
          message: 'Invalid filters',
        },
      };
    }
    filters = validation.data;
  }

  try {
    // Get projects from database with filters applied
    const projects = await getProjectsDb(
      createOrganizationId(orgId),
      filters
    );

    return {
      success: true,
      data: projects,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to fetch projects',
      },
    };
  }
}

/**
 * Retrieves a single project by ID.
 *
 * @param id - Project ID
 * @returns Result with Project or NotFoundError
 *
 * @example
 * ```ts
 * const result = await getProjectById(projectId);
 *
 * if (result.success) {
 *   console.log('Project:', result.data.name);
 * }
 * ```
 */
export async function getProjectById(
  id: ProjectId
): Promise<Result<Project, NotFoundError | UnauthorizedError | DatabaseError>> {
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

  try {
    // Get project from database
    const project = await getProjectByIdDb(createOrganizationId(orgId), id);

    if (!project) {
      return {
        success: false,
        error: {
          type: 'NotFoundError',
          message: 'Project not found',
        },
      };
    }

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to fetch project',
      },
    };
  }
}

/**
 * Updates an existing project with optimistic locking.
 *
 * @param id - Project ID
 * @param data - Partial project data to update
 * @param expectedVersion - Expected version for optimistic locking
 * @returns Result with updated Project or ValidationError/NotFoundError/ConflictError
 *
 * @example
 * ```ts
 * const result = await updateProject(projectId, {
 *   status: ProjectStatus.Active,
 *   notes: 'Updated notes',
 * }, currentVersion);
 *
 * if (!result.success && result.error.type === 'ConflictError') {
 *   // Handle concurrent edit conflict
 * }
 * ```
 */
export async function updateProject(
  id: ProjectId,
  data: UpdateProjectInput,
  expectedVersion: number
): Promise<
  Result<Project, ValidationError | NotFoundError | UnauthorizedError | ConflictError | DatabaseError>
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
  const validation = updateProjectInputSchema.safeParse(data);

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

  try {
    // Update project in database with optimistic locking
    const updatedProject = await updateProjectDb(
      createOrganizationId(orgId),
      id,
      validation.data,
      expectedVersion
    );

    // Revalidate paths
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);

    return {
      success: true,
      data: updatedProject,
    };
  } catch (error) {
    if (error instanceof Error) {
      // Handle optimistic locking conflict
      if (error.message.includes('Conflict')) {
        return {
          success: false,
          error: {
            type: 'ConflictError',
            message: 'Project was modified by another user. Please refresh and try again.',
          },
        };
      }

      // Handle not found error
      if (error.message.includes('not found')) {
        return {
          success: false,
          error: {
            type: 'NotFoundError',
            message: 'Project not found',
          },
        };
      }
    }

    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to update project',
      },
    };
  }
}

/**
 * Updates only the status of a project (convenience method).
 *
 * @param id - Project ID
 * @param status - New project status
 * @param expectedVersion - Expected version for optimistic locking
 * @returns Result with updated Project or NotFoundError/ConflictError
 *
 * @example
 * ```ts
 * const result = await updateProjectStatus(projectId, ProjectStatus.Active, currentVersion);
 * ```
 */
export async function updateProjectStatus(
  id: ProjectId,
  status: string,
  expectedVersion: number
): Promise<
  Result<Project, ValidationError | NotFoundError | UnauthorizedError | ConflictError | DatabaseError>
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

  try {
    // Update project status in database with optimistic locking
    const updatedProject = await updateProjectStatusDb(
      createOrganizationId(orgId),
      id,
      status,
      expectedVersion
    );

    // Revalidate paths
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);

    return {
      success: true,
      data: updatedProject,
    };
  } catch (error) {
    if (error instanceof Error) {
      // Handle optimistic locking conflict
      if (error.message.includes('Conflict')) {
        return {
          success: false,
          error: {
            type: 'ConflictError',
            message: 'Project was modified by another user. Please refresh and try again.',
          },
        };
      }

      // Handle not found error
      if (error.message.includes('not found')) {
        return {
          success: false,
          error: {
            type: 'NotFoundError',
            message: 'Project not found',
          },
        };
      }

      // Handle invalid status transition
      if (error.message.includes('Invalid status transition')) {
        return {
          success: false,
          error: {
            type: 'ValidationError',
            message: error.message,
          },
        };
      }
    }

    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to update project status',
      },
    };
  }
}

/**
 * Permanently deletes a project (hard delete).
 *
 * @param id - Project ID
 * @returns Result with void or NotFoundError
 *
 * @example
 * ```ts
 * const result = await deleteProject(projectId);
 *
 * if (result.success) {
 *   console.log('Project deleted');
 * }
 * ```
 */
export async function deleteProject(
  id: ProjectId
): Promise<Result<void, NotFoundError | UnauthorizedError | DatabaseError>> {
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

  try {
    // Delete project from database
    await deleteProjectDb(createOrganizationId(orgId), id);

    // Revalidate paths
    revalidatePath('/projects');

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return {
        success: false,
        error: {
          type: 'NotFoundError',
          message: 'Project not found',
        },
      };
    }

    return {
      success: false,
      error: {
        type: 'DatabaseError',
        message: error instanceof Error ? error.message : 'Failed to delete project',
      },
    };
  }
}
