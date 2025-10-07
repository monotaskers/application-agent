/**
 * Project Database Operations Contract Tests
 *
 * @fileoverview Tests for project database layer operations.
 * These tests verify the contract defined in contracts/project.contract.ts
 *
 * Following TDD approach: These tests are written BEFORE implementation
 * and are EXPECTED TO FAIL until project.db.ts is implemented.
 *
 * @module features/clients-projects/__tests__/db/project.db.test
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
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getProjectsByClient,
} from '@/features/clients-projects/db/project.db';

import { createClient } from '@/features/clients-projects/db/client.db';

/**
 * Test suite for project database operations
 *
 * Coverage:
 * - T011: createProject() functionality
 * - T012: getProjects() with filters
 * - T013: updateProject() with optimistic locking
 * - T014: deleteProject() (hard delete)
 */
describe('Project Database Operations', () => {
  // Test data
  const testOrgId = 'org_test123' as OrganizationId;
  const otherOrgId = 'org_other456' as OrganizationId;
  let testClientId: ClientId;

  beforeEach(async () => {
    // Setup: Create a test client for project relationships
    const client = await createClient(testOrgId, {
      companyName: 'Test Client Corp',
      contactPerson: 'Test Contact',
      email: 'test@client.com',
      phone: '+1111111111',
    });
    testClientId = client.id;
  });

  /**
   * T011: Contract test for createProject()
   *
   * Verifies:
   * - Project created with all required fields
   * - Version field defaults to 1
   * - Timestamps auto-populated
   * - clientId can be null (optional association)
   * - Invalid clientId throws error
   */
  describe('createProject', () => {
    it('should create project with all fields and default version=1', async () => {
      const projectData = {
        name: 'Website Redesign',
        description: 'Complete overhaul of company website',
        clientId: testClientId,
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-30'),
        budget: 50000, // in cents
        notes: 'High priority project',
      };

      const project = await createProject(testOrgId, projectData);

      // Verify all fields
      expect(project.id).toBeDefined();
      expect(project.organizationId).toBe(testOrgId);
      expect(project.name).toBe(projectData.name);
      expect(project.description).toBe(projectData.description);
      expect(project.clientId).toBe(testClientId);
      expect(project.status).toBe(projectData.status);
      expect(project.startDate).toEqual(projectData.startDate);
      expect(project.endDate).toEqual(projectData.endDate);
      expect(project.budget).toBe(projectData.budget);
      expect(project.notes).toBe(projectData.notes);

      // Verify optimistic locking version
      expect(project.version).toBe(1);

      // Verify timestamps
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
    });

    it('should create project without optional fields', async () => {
      const projectData = {
        name: 'Minimal Project',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-01-01'),
      };

      const project = await createProject(testOrgId, projectData);

      expect(project.id).toBeDefined();
      expect(project.name).toBe(projectData.name);
      expect(project.clientId).toBeUndefined();
      expect(project.description).toBeUndefined();
      expect(project.endDate).toBeUndefined();
      expect(project.budget).toBeUndefined();
      expect(project.notes).toBeUndefined();
      expect(project.version).toBe(1);
    });

    it('should allow clientId to be null (project not linked to client)', async () => {
      const projectData = {
        name: 'Internal Project',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        clientId: null,
      };

      const project = await createProject(testOrgId, projectData);

      expect(project.clientId).toBeNull();
    });

    it('should throw error for invalid clientId', async () => {
      const projectData = {
        name: 'Invalid Client Project',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        clientId: 'invalid-client-id' as ClientId,
      };

      await expect(createProject(testOrgId, projectData)).rejects.toThrow(/client not found/i);
    });

    it('should enforce multi-tenant isolation (orgId required)', async () => {
      const projectData = {
        name: 'Test Project',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-01-01'),
      };

      const project = await createProject(testOrgId, projectData);
      expect(project.organizationId).toBe(testOrgId);
    });

    it('should throw validation error for invalid data', async () => {
      const invalidData = {
        name: '', // Empty name - should fail
        status: 'InvalidStatus' as ProjectStatus, // Invalid status
        startDate: new Date('2025-01-01'),
      };

      await expect(createProject(testOrgId, invalidData)).rejects.toThrow();
    });
  });

  /**
   * T012: Contract test for getProjects() with filters
   *
   * Verifies:
   * - Returns all projects for organization
   * - Filter by clientId works
   * - Filter by status works
   * - Filter by date ranges works
   * - Search filter works
   * - Empty array for org with no projects
   */
  describe('getProjects', () => {
    beforeEach(async () => {
      // Setup: Create test projects
      await createProject(testOrgId, {
        name: 'Alpha Project',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        clientId: testClientId,
      });

      await createProject(testOrgId, {
        name: 'Beta Project',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-02-01'),
      });

      await createProject(testOrgId, {
        name: 'Gamma Project',
        status: 'Completed' as ProjectStatus,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-01-15'),
      });

      await createProject(otherOrgId, {
        name: 'Other Org Project',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-01-01'),
      });
    });

    it('should return all projects for the organization', async () => {
      const projects = await getProjects(testOrgId);

      expect(projects).toHaveLength(3);
      expect(projects.every(p => p.organizationId === testOrgId)).toBe(true);
    });

    it('should return empty array for org with no projects', async () => {
      const emptyOrgId = 'org_empty' as OrganizationId;
      const projects = await getProjects(emptyOrgId);

      expect(projects).toEqual([]);
    });

    it('should filter by clientId', async () => {
      const projects = await getProjects(testOrgId, { clientId: testClientId });

      expect(projects).toHaveLength(1);
      expect(projects[0]?.name).toBe('Alpha Project');
      expect(projects[0]?.clientId).toBe(testClientId);
    });

    it('should filter by status', async () => {
      const activeProjects = await getProjects(testOrgId, { status: 'Active' });
      const planningProjects = await getProjects(testOrgId, { status: 'Planning' });

      expect(activeProjects).toHaveLength(1);
      expect(activeProjects[0]?.status).toBe('Active');
      expect(planningProjects).toHaveLength(1);
      expect(planningProjects[0]?.status).toBe('Planning');
    });

    it('should filter by date range (startDateFrom, startDateTo)', async () => {
      const projects = await getProjects(testOrgId, {
        startDateFrom: new Date('2025-01-01'),
        startDateTo: new Date('2025-01-31'),
      });

      expect(projects).toHaveLength(1);
      expect(projects[0]?.name).toBe('Alpha Project');
    });

    it('should filter by search term (project name)', async () => {
      const projects = await getProjects(testOrgId, { search: 'Beta' });

      expect(projects).toHaveLength(1);
      expect(projects[0]?.name).toBe('Beta Project');
    });

    it('should enforce multi-tenant isolation', async () => {
      const testOrgProjects = await getProjects(testOrgId);
      const otherOrgProjects = await getProjects(otherOrgId);

      expect(testOrgProjects).toHaveLength(3);
      expect(otherOrgProjects).toHaveLength(1);
      expect(testOrgProjects.every(p => p.organizationId === testOrgId)).toBe(true);
      expect(otherOrgProjects.every(p => p.organizationId === otherOrgId)).toBe(true);
    });
  });

  /**
   * T013: Contract test for updateProject() with optimistic locking
   *
   * Verifies:
   * - Update succeeds with correct version
   * - Version increments after update
   * - Update fails with version conflict
   * - Status transition validation
   */
  describe('updateProject with optimistic locking', () => {
    let projectId: ProjectId;
    let currentVersion: number;

    beforeEach(async () => {
      const project = await createProject(testOrgId, {
        name: 'Update Test Project',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-01-01'),
      });
      projectId = project.id;
      currentVersion = project.version;
    });

    it('should update project with correct version and increment version', async () => {
      const updates = {
        name: 'Updated Project Name',
        status: 'Active' as ProjectStatus,
      };

      const updatedProject = await updateProject(
        testOrgId,
        projectId,
        updates,
        currentVersion
      );

      expect(updatedProject.name).toBe(updates.name);
      expect(updatedProject.status).toBe(updates.status);
      expect(updatedProject.version).toBe(currentVersion + 1);
    });

    it('should fail with version conflict error (concurrent edit)', async () => {
      const updates = { name: 'New Name' };
      const wrongVersion = currentVersion + 1;

      await expect(
        updateProject(testOrgId, projectId, updates, wrongVersion)
      ).rejects.toThrow(/Conflict.*modified by another user/i);
    });

    it('should validate status transitions', async () => {
      // Valid transition: Planning → Active
      const active = await updateProject(
        testOrgId,
        projectId,
        { status: 'Active' },
        currentVersion
      );
      expect(active.status).toBe('Active');

      // Valid transition: Active → Completed
      const completed = await updateProject(
        testOrgId,
        projectId,
        { status: 'Completed' },
        active.version
      );
      expect(completed.status).toBe('Completed');

      // Invalid transition: Completed → Planning (terminal state)
      await expect(
        updateProject(
          testOrgId,
          projectId,
          { status: 'Planning' },
          completed.version
        )
      ).rejects.toThrow(/Invalid status transition/i);
    });

    it('should update updatedAt timestamp on update', async () => {
      const originalProject = await getProjectById(testOrgId, projectId);
      const originalUpdatedAt = originalProject?.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedProject = await updateProject(
        testOrgId,
        projectId,
        { notes: 'Updated notes' },
        currentVersion
      );

      expect(updatedProject.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt?.getTime() || 0
      );
    });
  });

  /**
   * Contract test for updateProjectStatus()
   *
   * Verifies status-specific update with transition validation
   */
  describe('updateProjectStatus', () => {
    let projectId: ProjectId;
    let currentVersion: number;

    beforeEach(async () => {
      const project = await createProject(testOrgId, {
        name: 'Status Test Project',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-01-01'),
      });
      projectId = project.id;
      currentVersion = project.version;
    });

    it('should update project status with valid transition', async () => {
      const updated = await updateProjectStatus(
        testOrgId,
        projectId,
        'Active',
        currentVersion
      );

      expect(updated.status).toBe('Active');
      expect(updated.version).toBe(currentVersion + 1);
    });

    it('should fail with invalid status transition', async () => {
      await expect(
        updateProjectStatus(testOrgId, projectId, 'Completed', currentVersion)
      ).rejects.toThrow(/Invalid status transition/i);
    });
  });

  /**
   * T014: Contract test for deleteProject() (hard delete)
   *
   * Verifies:
   * - Project permanently removed from database
   * - Multi-tenant isolation enforced
   */
  describe('deleteProject (hard delete)', () => {
    let projectId: ProjectId;

    beforeEach(async () => {
      const project = await createProject(testOrgId, {
        name: 'Delete Test Project',
        status: 'Cancelled' as ProjectStatus,
        startDate: new Date('2025-01-01'),
      });
      projectId = project.id;
    });

    it('should permanently delete project from database', async () => {
      await deleteProject(testOrgId, projectId);

      // Project should no longer exist
      const deletedProject = await getProjectById(testOrgId, projectId);
      expect(deletedProject).toBeNull();

      // Should not appear in project list
      const projects = await getProjects(testOrgId);
      expect(projects.find(p => p.id === projectId)).toBeUndefined();
    });

    it('should fail when deleting non-existent project', async () => {
      const fakeId = 'fake-project-id' as ProjectId;
      await expect(deleteProject(testOrgId, fakeId)).rejects.toThrow(/not found/i);
    });

    it('should enforce multi-tenant isolation on delete', async () => {
      // Attempt to delete from wrong org
      await expect(deleteProject(otherOrgId, projectId)).rejects.toThrow(/not found/i);
    });
  });

  /**
   * Contract test for getProjectsByClient()
   *
   * Verifies retrieval of all projects for a specific client
   */
  describe('getProjectsByClient', () => {
    let client1Id: ClientId;
    let client2Id: ClientId;

    beforeEach(async () => {
      // Create two clients
      const client1 = await createClient(testOrgId, {
        companyName: 'Client 1',
        contactPerson: 'Contact 1',
        email: 'client1@test.com',
        phone: '+1111111111',
      });
      client1Id = client1.id;

      const client2 = await createClient(testOrgId, {
        companyName: 'Client 2',
        contactPerson: 'Contact 2',
        email: 'client2@test.com',
        phone: '+2222222222',
      });
      client2Id = client2.id;

      // Create projects for each client
      await createProject(testOrgId, {
        name: 'Client 1 Project A',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        clientId: client1Id,
      });

      await createProject(testOrgId, {
        name: 'Client 1 Project B',
        status: 'Planning' as ProjectStatus,
        startDate: new Date('2025-02-01'),
        clientId: client1Id,
      });

      await createProject(testOrgId, {
        name: 'Client 2 Project',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-01-01'),
        clientId: client2Id,
      });
    });

    it('should return all projects for a specific client', async () => {
      const client1Projects = await getProjectsByClient(testOrgId, client1Id);
      const client2Projects = await getProjectsByClient(testOrgId, client2Id);

      expect(client1Projects).toHaveLength(2);
      expect(client2Projects).toHaveLength(1);
      expect(client1Projects.every(p => p.clientId === client1Id)).toBe(true);
      expect(client2Projects.every(p => p.clientId === client2Id)).toBe(true);
    });

    it('should return empty array for client with no projects', async () => {
      const client3 = await createClient(testOrgId, {
        companyName: 'Client 3',
        contactPerson: 'Contact 3',
        email: 'client3@test.com',
        phone: '+3333333333',
      });

      const projects = await getProjectsByClient(testOrgId, client3.id);
      expect(projects).toEqual([]);
    });
  });
});
