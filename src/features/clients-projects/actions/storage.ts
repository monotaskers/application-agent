/**
 * LocalStorage Service for Client and Project Management
 *
 * @fileoverview Provides localStorage-based storage for clients and projects.
 * This is a temporary MVP solution that will be replaced with server-side
 * database storage in future iterations.
 *
 * @module features/clients-projects/actions/storage
 */

import type { Client, Project, OrganizationId } from '../types';

/**
 * Storage keys format for localStorage.
 */
const STORAGE_KEYS = {
  clients: (orgId: OrganizationId): string => `clients:${orgId}`,
  projects: (orgId: OrganizationId): string => `projects:${orgId}`,
} as const;

/**
 * Retrieves all clients for an organization from localStorage.
 *
 * @param orgId - The organization ID
 * @returns Array of clients for the organization
 *
 * @example
 * ```ts
 * const clients = getClients(orgId);
 * console.log(clients.length); // Number of clients
 * ```
 */
export function getClients(orgId: OrganizationId): Client[] {
  try {
    const key = STORAGE_KEYS.clients(orgId);
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data) as Client[];

    // Deserialize Date objects
    return parsed.map((client) => ({
      ...client,
      createdAt: new Date(client.createdAt),
      updatedAt: new Date(client.updatedAt),
      deletedAt: client.deletedAt ? new Date(client.deletedAt) : null,
    }));
  } catch (error) {
    console.error('Failed to get clients from localStorage:', error);
    return [];
  }
}

/**
 * Saves or updates a client in localStorage.
 *
 * @param orgId - The organization ID
 * @param client - The client to save
 *
 * @example
 * ```ts
 * saveClient(orgId, newClient);
 * ```
 */
export function saveClient(orgId: OrganizationId, client: Client): void {
  try {
    const clients = getClients(orgId);
    const index = clients.findIndex((c) => c.id === client.id);

    if (index >= 0) {
      // Update existing client
      clients[index] = client;
    } else {
      // Add new client
      clients.push(client);
    }

    const key = STORAGE_KEYS.clients(orgId);
    localStorage.setItem(key, JSON.stringify(clients));
  } catch (error) {
    console.error('Failed to save client to localStorage:', error);
    throw new Error('Failed to save client');
  }
}

/**
 * Retrieves all projects for an organization from localStorage.
 *
 * @param orgId - The organization ID
 * @returns Array of projects for the organization
 *
 * @example
 * ```ts
 * const projects = getProjects(orgId);
 * console.log(projects.length); // Number of projects
 * ```
 */
export function getProjects(orgId: OrganizationId): Project[] {
  try {
    const key = STORAGE_KEYS.projects(orgId);
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data) as Project[];

    // Deserialize Date objects
    return parsed.map((project) => ({
      ...project,
      startDate: new Date(project.startDate),
      endDate: project.endDate ? new Date(project.endDate) : null,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to get projects from localStorage:', error);
    return [];
  }
}

/**
 * Saves or updates a project in localStorage.
 *
 * @param orgId - The organization ID
 * @param project - The project to save
 *
 * @example
 * ```ts
 * saveProject(orgId, newProject);
 * ```
 */
export function saveProject(orgId: OrganizationId, project: Project): void {
  try {
    const projects = getProjects(orgId);
    const index = projects.findIndex((p) => p.id === project.id);

    if (index >= 0) {
      // Update existing project
      projects[index] = project;
    } else {
      // Add new project
      projects.push(project);
    }

    const key = STORAGE_KEYS.projects(orgId);
    localStorage.setItem(key, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
    throw new Error('Failed to save project');
  }
}

/**
 * Deletes a project from localStorage (hard delete).
 *
 * @param orgId - The organization ID
 * @param projectId - The project ID to delete
 *
 * @example
 * ```ts
 * deleteProject(orgId, projectId);
 * ```
 */
export function deleteProject(
  orgId: OrganizationId,
  projectId: string
): void {
  try {
    const projects = getProjects(orgId);
    const filtered = projects.filter((p) => p.id !== projectId);

    const key = STORAGE_KEYS.projects(orgId);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete project from localStorage:', error);
    throw new Error('Failed to delete project');
  }
}
