/**
 * @fileoverview Integration test for soft-deleting client with projects
 * @module features/clients-projects/__tests__/integration/soft-delete-client.test
 */

import { describe, it, expect } from 'vitest';
import {
  createClient,
  getClients,
  softDeleteClient,
} from '../../actions/client.actions';
import { createProject, getProjectById } from '../../actions/project.actions';
import type {
  CreateClientInput,
  CreateProjectInput,
  OrganizationId,
  ProjectStatus,
} from '../../types';

// Import database layer functions for T019
import {
  createClient as dbCreateClient,
  getClients as dbGetClients,
  softDeleteClient as dbSoftDeleteClient,
  getClientById as dbGetClientById,
} from '../../db/client.db';
import {
  createProject as dbCreateProject,
  getProjectById as dbGetProjectById,
  getProjects as dbGetProjects,
} from '../../db/project.db';

/**
 * Integration test suite for soft-delete client with projects.
 *
 * Tests the soft-delete flow from quickstart.md:
 * - Create client and linked project
 * - Soft-delete client
 * - Verify client hidden from getClients()
 * - Verify project still accessible via getProjectById()
 * - Verify project shows client name (read-only)
 *
 * NOTE: This test MUST FAIL until Server Actions are implemented (TDD).
 */
describe('Soft-Delete Client Integration Test - Server Actions', () => {
  /**
   * End-to-end test: Create client → create project → soft-delete client → verify project intact.
   */
  it('should hide soft-deleted client but preserve project relationship', async () => {
    // Step 1: Create client
    const clientInput: CreateClientInput = {
      companyName: 'Beta Industries',
      contactPerson: 'Alice Brown',
      email: 'alice@beta.com',
      phone: '+1111111111',
    };

    const clientResult = await createClient(clientInput);

    expect(clientResult.success).toBe(true);

    if (!clientResult.success) {
      throw new Error('Failed to create client');
    }

    const client = clientResult.data;

    // Step 2: Create project linked to client
    const projectInput: CreateProjectInput = {
      name: 'Mobile App Development',
      description: 'Build mobile app for iOS and Android',
      clientId: client.id,
      startDate: new Date('2025-11-01'),
    };

    const projectResult = await createProject(projectInput);

    expect(projectResult.success).toBe(true);

    if (!projectResult.success) {
      throw new Error('Failed to create project');
    }

    const project = projectResult.data;

    // Step 3: Soft-delete client
    const deleteResult = await softDeleteClient(client.id);

    expect(deleteResult.success).toBe(true);

    // Step 4: Verify client hidden from getClients() (default excludes deleted)
    const activeClientsResult = await getClients();

    expect(activeClientsResult.success).toBe(true);

    if (activeClientsResult.success) {
      const foundClient = activeClientsResult.data.find(
        (c) => c.id === client.id
      );
      expect(foundClient).toBeUndefined();
    }

    // Step 5: Verify client visible when includeDeleted: true
    const allClientsResult = await getClients({ includeDeleted: true });

    expect(allClientsResult.success).toBe(true);

    if (allClientsResult.success) {
      const foundClient = allClientsResult.data.find(
        (c) => c.id === client.id
      );
      expect(foundClient).toBeDefined();
      expect(foundClient?.deletedAt).not.toBeNull();
    }

    // Step 6: Verify project still accessible
    const projectLookupResult = await getProjectById(project.id);

    expect(projectLookupResult.success).toBe(true);

    if (projectLookupResult.success) {
      // Project retains clientId reference
      expect(projectLookupResult.data.clientId).toBe(client.id);
      expect(projectLookupResult.data.id).toBe(project.id);
    }
  });
});

/**
 * T019: Database Layer Integration Test for Soft-Deleted Clients in Project Views
 *
 * Tests that soft-deleted clients are properly excluded from project views
 * and queries at the database layer.
 *
 * Following TDD approach: These tests are written BEFORE implementation
 * and are EXPECTED TO FAIL until database layer is implemented.
 */
describe('Soft-Delete Client Integration Test - Database Layer (T019)', () => {
  const testOrgId = 'org_soft_delete_test' as OrganizationId;

  /**
   * End-to-end test: Create client → create project → soft-delete client → verify behavior.
   */
  it('should hide soft-deleted client but preserve project relationship', async () => {
    // Step 1: Create client
    const client = await dbCreateClient(testOrgId, {
      companyName: 'Beta Industries',
      contactPerson: 'Alice Brown',
      email: 'alice@beta.com',
      phone: '+1111111111',
    });

    // Step 2: Create project linked to client
    const project = await dbCreateProject(testOrgId, {
      name: 'Mobile App Development',
      description: 'Build mobile app for iOS and Android',
      clientId: client.id,
      status: 'Active' as ProjectStatus,
      startDate: new Date('2025-11-01'),
    });

    // Step 3: Soft-delete client
    const deletedClient = await dbSoftDeleteClient(testOrgId, client.id);
    expect(deletedClient.deletedAt).toBeInstanceOf(Date);

    // Step 4: Verify client hidden from getClients() (default excludes deleted)
    const activeClients = await dbGetClients(testOrgId);
    const foundClient = activeClients.find((c) => c.id === client.id);
    expect(foundClient).toBeUndefined();

    // Step 5: Verify client visible when includeDeleted: true
    const allClients = await dbGetClients(testOrgId, { includeDeleted: true });
    const deletedClientFound = allClients.find((c) => c.id === client.id);
    expect(deletedClientFound).toBeDefined();
    expect(deletedClientFound?.deletedAt).not.toBeNull();

    // Step 6: Verify project still accessible
    const fetchedProject = await dbGetProjectById(testOrgId, project.id);
    expect(fetchedProject).toBeDefined();
    expect(fetchedProject?.id).toBe(project.id);

    // Step 7: Verify project.clientId is NULL (due to ON DELETE SET NULL)
    expect(fetchedProject?.clientId).toBeNull();
  });

  /**
   * Tests that soft-deleted clients are excluded from project filter results.
   */
  it('should exclude soft-deleted clients when filtering projects by client', async () => {
    // Create two clients
    const client1 = await dbCreateClient(testOrgId, {
      companyName: 'Active Client Corp',
      contactPerson: 'John Active',
      email: 'john@active.com',
      phone: '+2222222222',
    });

    const client2 = await dbCreateClient(testOrgId, {
      companyName: 'To Delete Corp',
      contactPerson: 'Jane Delete',
      email: 'jane@delete.com',
      phone: '+3333333333',
    });

    // Create projects for both clients
    const project1 = await dbCreateProject(testOrgId, {
      name: 'Active Client Project',
      clientId: client1.id,
      status: 'Active' as ProjectStatus,
      startDate: new Date('2025-01-01'),
    });

    const project2 = await dbCreateProject(testOrgId, {
      name: 'Deleted Client Project',
      clientId: client2.id,
      status: 'Active' as ProjectStatus,
      startDate: new Date('2025-02-01'),
    });

    // Soft-delete client2
    await dbSoftDeleteClient(testOrgId, client2.id);

    // Get all projects
    const allProjects = await dbGetProjects(testOrgId);

    // Both projects should still exist
    expect(allProjects.some((p) => p.id === project1.id)).toBe(true);
    expect(allProjects.some((p) => p.id === project2.id)).toBe(true);

    // But project2 should now have NULL clientId (ON DELETE SET NULL)
    const p1 = await dbGetProjectById(testOrgId, project1.id);
    const p2 = await dbGetProjectById(testOrgId, project2.id);

    expect(p1?.clientId).toBe(client1.id); // Still linked
    expect(p2?.clientId).toBeNull(); // Unlinked due to soft delete
  });

  /**
   * Tests that projects with soft-deleted clients show NULL clientId in list view.
   */
  it('should show NULL clientId for projects when client is soft-deleted', async () => {
    const client = await dbCreateClient(testOrgId, {
      companyName: 'Vanishing Corp',
      contactPerson: 'Test User',
      email: 'test@vanishing.com',
      phone: '+4444444444',
    });

    const project = await dbCreateProject(testOrgId, {
      name: 'Vanishing Client Project',
      description: 'Project that will lose its client',
      clientId: client.id,
      status: 'Planning' as ProjectStatus,
      startDate: new Date('2025-03-01'),
    });

    // Verify project has clientId before deletion
    const projectBefore = await dbGetProjectById(testOrgId, project.id);
    expect(projectBefore?.clientId).toBe(client.id);

    // Soft-delete the client
    await dbSoftDeleteClient(testOrgId, client.id);

    // Fetch all projects - the project should still appear
    const projects = await dbGetProjects(testOrgId);
    const foundProject = projects.find((p) => p.id === project.id);

    expect(foundProject).toBeDefined();
    expect(foundProject?.clientId).toBeNull(); // Client reference removed
    expect(foundProject?.name).toBe('Vanishing Client Project');
  });

  /**
   * Tests that multiple projects are updated when their shared client is soft-deleted.
   */
  it('should set clientId to NULL for all projects when shared client is deleted', async () => {
    const client = await dbCreateClient(testOrgId, {
      companyName: 'Shared Client Corp',
      contactPerson: 'Shared User',
      email: 'shared@client.com',
      phone: '+5555555555',
    });

    // Create multiple projects for the same client
    const project1 = await dbCreateProject(testOrgId, {
      name: 'Shared Project 1',
      clientId: client.id,
      status: 'Active' as ProjectStatus,
      startDate: new Date('2025-01-01'),
    });

    const project2 = await dbCreateProject(testOrgId, {
      name: 'Shared Project 2',
      clientId: client.id,
      status: 'Planning' as ProjectStatus,
      startDate: new Date('2025-02-01'),
    });

    const project3 = await dbCreateProject(testOrgId, {
      name: 'Shared Project 3',
      clientId: client.id,
      status: 'Completed' as ProjectStatus,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-01-15'),
    });

    // Verify all projects have the clientId
    const p1Before = await dbGetProjectById(testOrgId, project1.id);
    const p2Before = await dbGetProjectById(testOrgId, project2.id);
    const p3Before = await dbGetProjectById(testOrgId, project3.id);

    expect(p1Before?.clientId).toBe(client.id);
    expect(p2Before?.clientId).toBe(client.id);
    expect(p3Before?.clientId).toBe(client.id);

    // Soft-delete the client
    await dbSoftDeleteClient(testOrgId, client.id);

    // Verify all projects now have NULL clientId
    const p1After = await dbGetProjectById(testOrgId, project1.id);
    const p2After = await dbGetProjectById(testOrgId, project2.id);
    const p3After = await dbGetProjectById(testOrgId, project3.id);

    expect(p1After?.clientId).toBeNull();
    expect(p2After?.clientId).toBeNull();
    expect(p3After?.clientId).toBeNull();

    // Verify all projects still exist with their original data
    expect(p1After?.name).toBe('Shared Project 1');
    expect(p2After?.name).toBe('Shared Project 2');
    expect(p3After?.name).toBe('Shared Project 3');
  });

  /**
   * Tests that soft-deleted client cannot be retrieved by getClientById.
   */
  it('should return null when fetching soft-deleted client by ID (without includeDeleted)', async () => {
    const client = await dbCreateClient(testOrgId, {
      companyName: 'Gone Corp',
      contactPerson: 'Gone User',
      email: 'gone@corp.com',
      phone: '+6666666666',
    });

    // Verify client exists before deletion
    const clientBefore = await dbGetClientById(testOrgId, client.id);
    expect(clientBefore).toBeDefined();
    expect(clientBefore?.id).toBe(client.id);

    // Soft-delete the client
    await dbSoftDeleteClient(testOrgId, client.id);

    // Try to fetch without includeDeleted - should return null
    const clientAfter = await dbGetClientById(testOrgId, client.id);
    expect(clientAfter).toBeNull();

    // Verify it's in the database but marked as deleted
    const allClients = await dbGetClients(testOrgId, { includeDeleted: true });
    const deletedClient = allClients.find((c) => c.id === client.id);
    expect(deletedClient).toBeDefined();
    expect(deletedClient?.deletedAt).toBeInstanceOf(Date);
  });

  /**
   * Tests cascading effect: soft-delete client → projects lose clientId → getProjects still works.
   */
  it('should maintain project list integrity after client soft-delete', async () => {
    const client1 = await dbCreateClient(testOrgId, {
      companyName: 'Client A',
      contactPerson: 'User A',
      email: 'a@client.com',
      phone: '+7777777777',
    });

    const client2 = await dbCreateClient(testOrgId, {
      companyName: 'Client B',
      contactPerson: 'User B',
      email: 'b@client.com',
      phone: '+8888888888',
    });

    // Create projects for both clients
    const projectA = await dbCreateProject(testOrgId, {
      name: 'Project A',
      clientId: client1.id,
      status: 'Active' as ProjectStatus,
      startDate: new Date('2025-01-01'),
    });

    const projectB = await dbCreateProject(testOrgId, {
      name: 'Project B',
      clientId: client2.id,
      status: 'Active' as ProjectStatus,
      startDate: new Date('2025-02-01'),
    });

    // Get initial project count
    const projectsBefore = await dbGetProjects(testOrgId);
    const initialCount = projectsBefore.length;

    // Soft-delete client1
    await dbSoftDeleteClient(testOrgId, client1.id);

    // Get projects after deletion - count should be same
    const projectsAfter = await dbGetProjects(testOrgId);
    expect(projectsAfter.length).toBe(initialCount);

    // Verify projects still exist
    const pA = projectsAfter.find((p) => p.id === projectA.id);
    const pB = projectsAfter.find((p) => p.id === projectB.id);

    expect(pA).toBeDefined();
    expect(pB).toBeDefined();

    // Project A should have NULL clientId, Project B should still have client2
    expect(pA?.clientId).toBeNull();
    expect(pB?.clientId).toBe(client2.id);
  });
});
