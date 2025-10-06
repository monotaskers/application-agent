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
import { v4 as uuidv4 } from 'uuid';
import {
  createProjectInputSchema,
  updateProjectInputSchema,
  projectFiltersSchema,
} from '../schemas/project.schema';
import {
  getProjects as getProjectsFromStorage,
  saveProject,
  deleteProject as deleteProjectFromStorage,
} from './storage';
import { getClients as getClientsFromStorage } from './storage';
import {
  createProjectId,
  createOrganizationId,
  ProjectStatus,
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
): Promise<Result<Project, ValidationError | UnauthorizedError>> {
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
    const clients = getClientsFromStorage(createOrganizationId(orgId));
    const client = clients.find((c) => c.id === validation.data.clientId);

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
  }

  // Create project
  const now = new Date();
  const project: Project = {
    id: createProjectId(uuidv4()),
    organizationId: createOrganizationId(orgId),
    name: validation.data.name,
    description: validation.data.description,
    clientId: validation.data.clientId ?? null,
    status: validation.data.status ?? ProjectStatus.Planning,
    startDate: validation.data.startDate,
    endDate: validation.data.endDate ?? null,
    budget: validation.data.budget,
    notes: validation.data.notes,
    createdAt: now,
    updatedAt: now,
  };

  // Save to storage
  saveProject(createOrganizationId(orgId), project);

  // Revalidate projects list
  revalidatePath('/projects');

  return {
    success: true,
    data: project,
  };
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
): Promise<Result<Project[], Error | UnauthorizedError>> {
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
        error: new Error('Invalid filters'),
      };
    }
    filters = validation.data;
  }

  // Get projects from storage
  let projects = getProjectsFromStorage(createOrganizationId(orgId));

  // Apply filters
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    projects = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower)
    );
  }

  if (filters?.clientId) {
    projects = projects.filter(
      (project) => project.clientId === filters.clientId
    );
  }

  if (filters?.status) {
    projects = projects.filter((project) => project.status === filters.status);
  }

  if (filters?.startDateFrom) {
    projects = projects.filter(
      (project) => project.startDate >= filters.startDateFrom!
    );
  }

  if (filters?.startDateTo) {
    projects = projects.filter(
      (project) => project.startDate <= filters.startDateTo!
    );
  }

  if (filters?.endDateFrom) {
    projects = projects.filter(
      (project) => project.endDate && project.endDate >= filters.endDateFrom!
    );
  }

  if (filters?.endDateTo) {
    projects = projects.filter(
      (project) => project.endDate && project.endDate <= filters.endDateTo!
    );
  }

  return {
    success: true,
    data: projects,
  };
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
): Promise<Result<Project, NotFoundError | UnauthorizedError>> {
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

  // Get projects from storage
  const projects = getProjectsFromStorage(createOrganizationId(orgId));

  // Find project
  const project = projects.find((p) => p.id === id);

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
}

/**
 * Updates an existing project.
 *
 * @param id - Project ID
 * @param data - Partial project data to update
 * @returns Result with updated Project or ValidationError/NotFoundError
 *
 * @example
 * ```ts
 * const result = await updateProject(projectId, {
 *   status: ProjectStatus.Active,
 *   notes: 'Updated notes',
 * });
 * ```
 */
export async function updateProject(
  id: ProjectId,
  data: UpdateProjectInput
): Promise<
  Result<Project, ValidationError | NotFoundError | UnauthorizedError>
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

  // Get existing project
  const projects = getProjectsFromStorage(createOrganizationId(orgId));
  const existingProject = projects.find((p) => p.id === id);

  if (!existingProject) {
    return {
      success: false,
      error: {
        type: 'NotFoundError',
        message: 'Project not found',
      },
    };
  }

  // Merge updates
  const updatedProject: Project = {
    ...existingProject,
    ...validation.data,
    updatedAt: new Date(),
  };

  // Save to storage
  saveProject(createOrganizationId(orgId), updatedProject);

  // Revalidate paths
  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);

  return {
    success: true,
    data: updatedProject,
  };
}

/**
 * Updates only the status of a project (convenience method).
 *
 * @param id - Project ID
 * @param status - New project status
 * @returns Result with updated Project or NotFoundError
 *
 * @example
 * ```ts
 * const result = await updateProjectStatus(projectId, ProjectStatus.Active);
 * ```
 */
export async function updateProjectStatus(
  id: ProjectId,
  status: ProjectStatus
): Promise<
  Result<Project, ValidationError | NotFoundError | UnauthorizedError>
> {
  // Delegate to updateProject
  return updateProject(id, { status });
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
): Promise<Result<void, NotFoundError | UnauthorizedError>> {
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

  // Get existing project
  const projects = getProjectsFromStorage(createOrganizationId(orgId));
  const existingProject = projects.find((p) => p.id === id);

  if (!existingProject) {
    return {
      success: false,
      error: {
        type: 'NotFoundError',
        message: 'Project not found',
      },
    };
  }

  // Delete from storage
  deleteProjectFromStorage(createOrganizationId(orgId), id);

  // Revalidate paths
  revalidatePath('/projects');

  return {
    success: true,
    data: undefined,
  };
}
