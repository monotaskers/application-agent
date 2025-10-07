/**
 * Database Layer Public API
 *
 * @fileoverview Re-exports all database operations for clients and projects.
 * Provides a clean import interface for consumers.
 *
 * @module features/clients-projects/db
 */

// Client database operations
export {
  createClient,
  getClients,
  getClientById,
  updateClient,
  softDeleteClient,
  restoreClient,
} from './client.db';

// Project database operations
export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getProjectsByClient,
} from './project.db';
