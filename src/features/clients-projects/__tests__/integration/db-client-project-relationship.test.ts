/**
 * Database Layer: Client-Project Relationship Integration Tests
 *
 * @fileoverview Integration tests verifying client-project relationship behavior
 * at the database layer, specifically ON DELETE SET NULL constraint when clients
 * are soft-deleted.
 *
 * Following TDD approach: These tests are written BEFORE implementation
 * and are EXPECTED TO FAIL until database layer is implemented.
 *
 * @module features/clients-projects/__tests__/integration/db-client-project-relationship.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type {
  OrganizationId,
  ProjectId,
  ClientId,
  ProjectStatus,
} from '@/features/clients-projects/types';

// Import database functions that DON'T EXIST YET (will be created in Phase 3.3)
import {
  createClient,
  softDeleteClient,
} from '@/features/clients-projects/db/client.db';

import {
  createProject,
  getProjectById,
} from '@/features/clients-projects/db/project.db';

/**
 * Test suite for Client-Project relationship integrity at database layer
 *
 * Coverage:
 * - T015: ON DELETE SET NULL behavior when client is soft-deleted
 */
describe('DB Layer: Client-Project Relationship Integration', () => {
  const testOrgId = 'org_test123' as OrganizationId;

  /**
   * T015: Integration test for ON DELETE SET NULL
   *
   * Verifies that when a client is soft-deleted, all associated projects
   * have their clientId set to NULL rather than being deleted or left dangling.
   *
   * This maintains referential integrity while preserving project history.
   */
  describe('ON DELETE SET NULL behavior', () => {
    let clientId: ClientId;
    let projectId: ProjectId;

    beforeEach(async () => {
      // Create a test client
      const client = await createClient(testOrgId, {
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
      });
      clientId = client.id;

      // Create a project associated with this client
      const project = await createProject(testOrgId, {
        name: 'Acme Website Redesign',
        description: 'Complete website overhaul for Acme Corp',
        clientId: clientId,
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-30'),
      });
      projectId = project.id;
    });

    it('should set project.clientId to NULL when client is soft-deleted', async () => {
      // Verify project initially has clientId
      const projectBefore = await getProjectById(testOrgId, projectId);
      expect(projectBefore).toBeDefined();
      expect(projectBefore?.clientId).toBe(clientId);

      // Soft-delete the client
      await softDeleteClient(testOrgId, clientId);

      // Verify project still exists but clientId is now NULL
      const projectAfter = await getProjectById(testOrgId, projectId);
      expect(projectAfter).toBeDefined();
      expect(projectAfter?.id).toBe(projectId);
      expect(projectAfter?.clientId).toBeNull();
      expect(projectAfter?.name).toBe('Acme Website Redesign');
      expect(projectAfter?.status).toBe('Active');
    });

    it('should set multiple projects clientId to NULL when shared client is deleted', async () => {
      // Create additional projects for the same client
      const project2 = await createProject(testOrgId, {
        name: 'Acme Mobile App',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-03-01'),
        clientId: clientId,
      });

      const project3 = await createProject(testOrgId, {
        name: 'Acme Marketing Campaign',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-02-01'),
        clientId: clientId,
      });

      // Verify all projects have the clientId
      const p1Before = await getProjectById(testOrgId, projectId);
      const p2Before = await getProjectById(testOrgId, project2.id);
      const p3Before = await getProjectById(testOrgId, project3.id);

      expect(p1Before?.clientId).toBe(clientId);
      expect(p2Before?.clientId).toBe(clientId);
      expect(p3Before?.clientId).toBe(clientId);

      // Soft-delete the client
      await softDeleteClient(testOrgId, clientId);

      // Verify all projects now have NULL clientId
      const p1After = await getProjectById(testOrgId, projectId);
      const p2After = await getProjectById(testOrgId, project2.id);
      const p3After = await getProjectById(testOrgId, project3.id);

      expect(p1After?.clientId).toBeNull();
      expect(p2After?.clientId).toBeNull();
      expect(p3After?.clientId).toBeNull();

      // Verify projects still exist with original data
      expect(p1After?.name).toBe('Acme Website Redesign');
      expect(p2After?.name).toBe('Acme Mobile App');
      expect(p3After?.name).toBe('Acme Marketing Campaign');
    });

    it('should preserve project data except clientId when client is deleted', async () => {
      const originalProject = await getProjectById(testOrgId, projectId);

      // Soft-delete the client
      await softDeleteClient(testOrgId, clientId);

      // Get project after client deletion
      const updatedProject = await getProjectById(testOrgId, projectId);

      // Verify all fields preserved except clientId
      expect(updatedProject?.id).toBe(originalProject?.id);
      expect(updatedProject?.organizationId).toBe(originalProject?.organizationId);
      expect(updatedProject?.name).toBe(originalProject?.name);
      expect(updatedProject?.description).toBe(originalProject?.description);
      expect(updatedProject?.status).toBe(originalProject?.status);
      expect(updatedProject?.startDate).toEqual(originalProject?.startDate);
      expect(updatedProject?.endDate).toEqual(originalProject?.endDate);
      expect(updatedProject?.createdAt).toEqual(originalProject?.createdAt);
      expect(updatedProject?.version).toBe(originalProject?.version);

      // Only clientId should change
      expect(updatedProject?.clientId).toBeNull();
      expect(originalProject?.clientId).toBe(clientId);
    });

    it('should not affect projects with different clientId when one client is deleted', async () => {
      // Create another client with their own project
      const otherClient = await createClient(testOrgId, {
        companyName: 'Beta Inc',
        contactPerson: 'Jane Smith',
        email: 'jane@beta.com',
        phone: '+0987654321',
      });

      const otherProject = await createProject(testOrgId, {
        name: 'Beta Project',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        clientId: otherClient.id,
      });

      // Soft-delete the first client
      await softDeleteClient(testOrgId, clientId);

      // Verify first client's project has NULL clientId
      const acmeProject = await getProjectById(testOrgId, projectId);
      expect(acmeProject?.clientId).toBeNull();

      // Verify second client's project is unaffected
      const betaProject = await getProjectById(testOrgId, otherProject.id);
      expect(betaProject?.clientId).toBe(otherClient.id);
      expect(betaProject?.name).toBe('Beta Project');
    });

    it('should handle projects with NULL clientId (internal projects) when client is deleted', async () => {
      // Create an internal project (no client)
      const internalProject = await createProject(testOrgId, {
        name: 'Internal R&D Project',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        clientId: null,
      });

      // Soft-delete a client
      await softDeleteClient(testOrgId, clientId);

      // Verify internal project remains unaffected
      const project = await getProjectById(testOrgId, internalProject.id);
      expect(project?.clientId).toBeNull();
      expect(project?.name).toBe('Internal R&D Project');
    });
  });
});
