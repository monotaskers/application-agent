/**
 * Database Layer: Multi-Tenant Data Isolation Integration Tests
 *
 * @fileoverview Integration tests verifying strict data isolation between
 * organizations at the database layer. Ensures one organization cannot access,
 * modify, or delete another organization's data.
 *
 * Following TDD approach: These tests are written BEFORE implementation
 * and are EXPECTED TO FAIL until database layer is implemented.
 *
 * @module features/clients-projects/__tests__/integration/db-multi-tenant-isolation.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type {
  OrganizationId,
  ClientId,
  ProjectId,
  ProjectStatus,
} from '@/features/clients-projects/types';

// Import database functions that DON'T EXIST YET (will be created in Phase 3.3)
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  softDeleteClient,
} from '@/features/clients-projects/db/client.db';

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByClient,
} from '@/features/clients-projects/db/project.db';

/**
 * Test suite for multi-tenant data isolation at database layer
 *
 * Coverage:
 * - T017: Multi-tenant data isolation across all operations
 */
describe('DB Layer: Multi-Tenant Data Isolation Integration', () => {
  const org1Id = 'org_tenant1' as OrganizationId;
  const org2Id = 'org_tenant2' as OrganizationId;
  const org3Id = 'org_tenant3' as OrganizationId;

  let org1ClientId: ClientId;
  let org2ClientId: ClientId;
  let org1ProjectId: ProjectId;
  let org2ProjectId: ProjectId;

  beforeEach(async () => {
    // Create clients for each organization
    const client1 = await createClient(org1Id, {
      companyName: 'Org1 Client',
      contactPerson: 'User 1',
      email: 'user1@org1.com',
      phone: '+1111111111',
    });
    org1ClientId = client1.id;

    const client2 = await createClient(org2Id, {
      companyName: 'Org2 Client',
      contactPerson: 'User 2',
      email: 'user2@org2.com',
      phone: '+2222222222',
    });
    org2ClientId = client2.id;

    // Create projects for each organization
    const project1 = await createProject(org1Id, {
      name: 'Org1 Project',
      status: 'Active' as ProjectStatus,
      startDate: new Date('2025-01-01'),
      clientId: org1ClientId,
    });
    org1ProjectId = project1.id;

    const project2 = await createProject(org2Id, {
      name: 'Org2 Project',
      status: 'Planning' as ProjectStatus,
      startDate: new Date('2025-02-01'),
      clientId: org2ClientId,
    });
    org2ProjectId = project2.id;
  });

  /**
   * T017: Client isolation tests
   */
  describe('Client data isolation', () => {
    it('should only return clients belonging to the organization', async () => {
      const org1Clients = await getClients(org1Id);
      const org2Clients = await getClients(org2Id);

      // Each org should only see their own clients
      expect(org1Clients).toHaveLength(1);
      expect(org2Clients).toHaveLength(1);

      expect(org1Clients[0]?.id).toBe(org1ClientId);
      expect(org1Clients[0]?.organizationId).toBe(org1Id);

      expect(org2Clients[0]?.id).toBe(org2ClientId);
      expect(org2Clients[0]?.organizationId).toBe(org2Id);
    });

    it('should return null when accessing client from different organization', async () => {
      // Org2 tries to access Org1's client
      const client = await getClientById(org2Id, org1ClientId);
      expect(client).toBeNull();

      // Org1 tries to access Org2's client
      const client2 = await getClientById(org1Id, org2ClientId);
      expect(client2).toBeNull();
    });

    it('should prevent updating client from different organization', async () => {
      const client = await getClientById(org1Id, org1ClientId);

      // Org2 tries to update Org1's client
      await expect(
        updateClient(
          org2Id,
          org1ClientId,
          { companyName: 'Hacked!' },
          client!.version
        )
      ).rejects.toThrow(/not found/i);

      // Verify client was not modified
      const unchanged = await getClientById(org1Id, org1ClientId);
      expect(unchanged?.companyName).toBe('Org1 Client');
    });

    it('should prevent soft-deleting client from different organization', async () => {
      // Org2 tries to delete Org1's client
      await expect(softDeleteClient(org2Id, org1ClientId)).rejects.toThrow(
        /not found/i
      );

      // Verify client still exists and is not deleted
      const client = await getClientById(org1Id, org1ClientId);
      expect(client).toBeDefined();
      expect(client?.deletedAt).toBeNull();
    });

    it('should return empty array for organization with no clients', async () => {
      const org3Clients = await getClients(org3Id);
      expect(org3Clients).toEqual([]);
    });
  });

  /**
   * Project isolation tests
   */
  describe('Project data isolation', () => {
    it('should only return projects belonging to the organization', async () => {
      const org1Projects = await getProjects(org1Id);
      const org2Projects = await getProjects(org2Id);

      // Each org should only see their own projects
      expect(org1Projects).toHaveLength(1);
      expect(org2Projects).toHaveLength(1);

      expect(org1Projects[0]?.id).toBe(org1ProjectId);
      expect(org1Projects[0]?.organizationId).toBe(org1Id);

      expect(org2Projects[0]?.id).toBe(org2ProjectId);
      expect(org2Projects[0]?.organizationId).toBe(org2Id);
    });

    it('should return null when accessing project from different organization', async () => {
      // Org2 tries to access Org1's project
      const project = await getProjectById(org2Id, org1ProjectId);
      expect(project).toBeNull();

      // Org1 tries to access Org2's project
      const project2 = await getProjectById(org1Id, org2ProjectId);
      expect(project2).toBeNull();
    });

    it('should prevent updating project from different organization', async () => {
      const project = await getProjectById(org1Id, org1ProjectId);

      // Org2 tries to update Org1's project
      await expect(
        updateProject(
          org2Id,
          org1ProjectId,
          { name: 'Hacked Project!' },
          project!.version
        )
      ).rejects.toThrow(/not found/i);

      // Verify project was not modified
      const unchanged = await getProjectById(org1Id, org1ProjectId);
      expect(unchanged?.name).toBe('Org1 Project');
    });

    it('should prevent deleting project from different organization', async () => {
      // Org2 tries to delete Org1's project
      await expect(deleteProject(org2Id, org1ProjectId)).rejects.toThrow(
        /not found/i
      );

      // Verify project still exists
      const project = await getProjectById(org1Id, org1ProjectId);
      expect(project).toBeDefined();
      expect(project?.id).toBe(org1ProjectId);
    });

    it('should return empty array for organization with no projects', async () => {
      const org3Projects = await getProjects(org3Id);
      expect(org3Projects).toEqual([]);
    });
  });

  /**
   * Client-Project relationship isolation tests
   */
  describe('Client-Project relationship isolation', () => {
    it('should only return projects for clients within the same organization', async () => {
      const org1ProjectsForClient = await getProjectsByClient(org1Id, org1ClientId);
      const org2ProjectsForClient = await getProjectsByClient(org2Id, org2ClientId);

      // Each should see only their own projects
      expect(org1ProjectsForClient).toHaveLength(1);
      expect(org1ProjectsForClient[0]?.id).toBe(org1ProjectId);

      expect(org2ProjectsForClient).toHaveLength(1);
      expect(org2ProjectsForClient[0]?.id).toBe(org2ProjectId);
    });

    it('should return empty when querying projects for client from different org', async () => {
      // Org2 tries to get projects for Org1's client
      const projects = await getProjectsByClient(org2Id, org1ClientId);
      expect(projects).toEqual([]);
    });

    it('should prevent creating project with clientId from different organization', async () => {
      // Org2 tries to create project with Org1's client
      await expect(
        createProject(org2Id, {
          name: 'Cross-Org Project',
          status: 'Planning' as ProjectStatus,
          startDate: new Date('2025-01-01'),
          clientId: org1ClientId, // Org1's client!
        })
      ).rejects.toThrow(/client not found/i);
    });
  });

  /**
   * Filter isolation tests
   */
  describe('Filter operations respect multi-tenancy', () => {
    beforeEach(async () => {
      // Create additional data for filtering tests
      await createClient(org1Id, {
        companyName: 'Alpha Corp',
        contactPerson: 'Alice Alpha',
        email: 'alice@alpha.com',
        phone: '+3333333333',
      });

      await createClient(org2Id, {
        companyName: 'Alpha Industries',
        contactPerson: 'Bob Beta',
        email: 'bob@alpha.com',
        phone: '+4444444444',
      });

      await createProject(org1Id, {
        name: 'Alpha Project',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-03-01'),
      });

      await createProject(org2Id, {
        name: 'Beta Project',
        status: 'Active' as ProjectStatus,
        startDate: new Date('2025-03-01'),
      });
    });

    it('should only search within organization when filtering clients', async () => {
      // Search for "Alpha" in both orgs
      const org1Results = await getClients(org1Id, { search: 'Alpha' });
      const org2Results = await getClients(org2Id, { search: 'Alpha' });

      // Both should find "Alpha" results, but only within their org
      expect(org1Results.length).toBeGreaterThanOrEqual(1);
      expect(org2Results.length).toBeGreaterThanOrEqual(1);

      // Verify all results belong to correct org
      expect(org1Results.every((c) => c.organizationId === org1Id)).toBe(true);
      expect(org2Results.every((c) => c.organizationId === org2Id)).toBe(true);

      // Verify results are different
      const org1Ids = org1Results.map((c) => c.id);
      const org2Ids = org2Results.map((c) => c.id);
      expect(org1Ids.some((id) => org2Ids.includes(id))).toBe(false);
    });

    it('should only filter within organization for projects by status', async () => {
      const org1Active = await getProjects(org1Id, { status: 'Active' });
      const org2Active = await getProjects(org2Id, { status: 'Active' });

      // Both should find active projects, but only within their org
      expect(org1Active.length).toBeGreaterThanOrEqual(1);
      expect(org2Active.length).toBeGreaterThanOrEqual(1);

      // Verify all results belong to correct org
      expect(org1Active.every((p) => p.organizationId === org1Id)).toBe(true);
      expect(org2Active.every((p) => p.organizationId === org2Id)).toBe(true);

      // Verify results don't overlap
      const org1Ids = org1Active.map((p) => p.id);
      const org2Ids = org2Active.map((p) => p.id);
      expect(org1Ids.some((id) => org2Ids.includes(id))).toBe(false);
    });

    it('should only filter within organization for projects by date range', async () => {
      const filters = {
        startDateFrom: new Date('2025-03-01'),
        startDateTo: new Date('2025-03-31'),
      };

      const org1Results = await getProjects(org1Id, filters);
      const org2Results = await getProjects(org2Id, filters);

      // Verify all results belong to correct org
      expect(org1Results.every((p) => p.organizationId === org1Id)).toBe(true);
      expect(org2Results.every((p) => p.organizationId === org2Id)).toBe(true);
    });
  });

  /**
   * Soft-delete isolation tests
   */
  describe('Soft-delete respects multi-tenancy', () => {
    it('should only include deleted clients from same organization with includeDeleted flag', async () => {
      // Soft-delete clients from both orgs
      await softDeleteClient(org1Id, org1ClientId);
      await softDeleteClient(org2Id, org2ClientId);

      // Query with includeDeleted flag
      const org1Clients = await getClients(org1Id, { includeDeleted: true });
      const org2Clients = await getClients(org2Id, { includeDeleted: true });

      // Each should see only their deleted clients
      const org1DeletedClients = org1Clients.filter((c) => c.deletedAt !== null);
      const org2DeletedClients = org2Clients.filter((c) => c.deletedAt !== null);

      expect(org1DeletedClients.some((c) => c.id === org1ClientId)).toBe(true);
      expect(org1DeletedClients.some((c) => c.id === org2ClientId)).toBe(false);

      expect(org2DeletedClients.some((c) => c.id === org2ClientId)).toBe(true);
      expect(org2DeletedClients.some((c) => c.id === org1ClientId)).toBe(false);
    });
  });
});
