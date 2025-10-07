/**
 * @fileoverview Integration test for filtering and search across clients and projects
 * @module features/clients-projects/__tests__/integration/filtering.test
 */

import { describe, it, expect } from 'vitest';
import { createClient, getClients } from '../../actions/client.actions';
import { createProject, getProjects } from '../../actions/project.actions';
import { ProjectStatus } from '../../types/project.types';
import type {
  CreateClientInput,
  CreateProjectInput,
  ClientFilters,
  ProjectFilters,
  OrganizationId,
} from '../../types';

// Import database layer functions for T018
import {
  createClient as dbCreateClient,
  getClients as dbGetClients,
} from '../../db/client.db';
import {
  createProject as dbCreateProject,
  getProjects as dbGetProjects,
} from '../../db/project.db';

/**
 * Integration test suite for filtering and search.
 *
 * Tests the filtering flow from quickstart.md:
 * - Create multiple clients with varied names
 * - Create multiple projects with varied statuses and clients
 * - Test client search by company name
 * - Test project filter by status
 * - Test project filter by client
 * - Test project filter by date range
 *
 * NOTE: This test MUST FAIL until Server Actions are implemented (TDD).
 */
describe('Filtering Integration Test - Server Actions', () => {
  /**
   * Tests client search by company name.
   */
  it('should filter clients by search term', async () => {
    // Create multiple clients
    const client1Input: CreateClientInput = {
      companyName: 'Acme Corporation',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '+1111111111',
    };

    const client2Input: CreateClientInput = {
      companyName: 'Beta Industries',
      contactPerson: 'Jane Smith',
      email: 'jane@beta.com',
      phone: '+2222222222',
    };

    const client3Input: CreateClientInput = {
      companyName: 'Acme Solutions',
      contactPerson: 'Bob Johnson',
      email: 'bob@acmesolutions.com',
      phone: '+3333333333',
    };

    await createClient(client1Input);
    await createClient(client2Input);
    await createClient(client3Input);

    // Search for "Acme"
    const filters: ClientFilters = {
      search: 'Acme',
    };

    const result = await getClients(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      // Should return 2 clients (Acme Corporation and Acme Solutions)
      expect(result.data.length).toBeGreaterThanOrEqual(2);
      result.data.forEach((client) => {
        expect(
          client.companyName.toLowerCase().includes('acme') ||
            client.contactPerson.toLowerCase().includes('acme')
        ).toBe(true);
      });
    }
  });

  /**
   * Tests project filter by status.
   */
  it('should filter projects by status', async () => {
    // Create client first
    const clientInput: CreateClientInput = {
      companyName: 'Test Client',
      contactPerson: 'Test Person',
      email: 'test@example.com',
      phone: '+4444444444',
    };

    const clientResult = await createClient(clientInput);

    if (!clientResult.success) {
      throw new Error('Failed to create client');
    }

    // Create multiple projects with different statuses
    const project1Input: CreateProjectInput = {
      name: 'Project Alpha',
      clientId: clientResult.data.id,
      status: ProjectStatus.Planning,
      startDate: new Date('2025-10-01'),
    };

    const project2Input: CreateProjectInput = {
      name: 'Project Beta',
      clientId: clientResult.data.id,
      status: ProjectStatus.Active,
      startDate: new Date('2025-10-15'),
    };

    const project3Input: CreateProjectInput = {
      name: 'Project Gamma',
      clientId: clientResult.data.id,
      status: ProjectStatus.Active,
      startDate: new Date('2025-11-01'),
    };

    await createProject(project1Input);
    await createProject(project2Input);
    await createProject(project3Input);

    // Filter by status "Active"
    const filters: ProjectFilters = {
      status: ProjectStatus.Active,
    };

    const result = await getProjects(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      // Should return 2 active projects (Beta and Gamma)
      expect(result.data.length).toBeGreaterThanOrEqual(2);
      result.data.forEach((project) => {
        expect(project.status).toBe(ProjectStatus.Active);
      });
    }
  });

  /**
   * Tests project filter by client.
   */
  it('should filter projects by clientId', async () => {
    // Create two clients
    const client1Input: CreateClientInput = {
      companyName: 'Client One',
      contactPerson: 'Person One',
      email: 'one@example.com',
      phone: '+5555555555',
    };

    const client2Input: CreateClientInput = {
      companyName: 'Client Two',
      contactPerson: 'Person Two',
      email: 'two@example.com',
      phone: '+6666666666',
    };

    const client1Result = await createClient(client1Input);
    const client2Result = await createClient(client2Input);

    if (!client1Result.success || !client2Result.success) {
      throw new Error('Failed to create clients');
    }

    // Create projects for different clients
    const project1Input: CreateProjectInput = {
      name: 'Project for Client 1',
      clientId: client1Result.data.id,
      startDate: new Date('2025-10-01'),
    };

    const project2Input: CreateProjectInput = {
      name: 'Project for Client 2',
      clientId: client2Result.data.id,
      startDate: new Date('2025-10-15'),
    };

    await createProject(project1Input);
    await createProject(project2Input);

    // Filter by client 1
    const filters: ProjectFilters = {
      clientId: client1Result.data.id,
    };

    const result = await getProjects(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      // Should return only projects for client 1
      expect(result.data.length).toBeGreaterThanOrEqual(1);
      result.data.forEach((project) => {
        expect(project.clientId).toBe(client1Result.data.id);
      });
    }
  });

  /**
   * Tests project filter by date range.
   */
  it('should filter projects by date range', async () => {
    // Create projects with different start dates
    const project1Input: CreateProjectInput = {
      name: 'January Project',
      startDate: new Date('2025-01-15'),
    };

    const project2Input: CreateProjectInput = {
      name: 'June Project',
      startDate: new Date('2025-06-15'),
    };

    const project3Input: CreateProjectInput = {
      name: 'December Project',
      startDate: new Date('2025-12-15'),
    };

    await createProject(project1Input);
    await createProject(project2Input);
    await createProject(project3Input);

    // Filter by Q1 date range (Jan-Mar)
    const filters: ProjectFilters = {
      startDateFrom: new Date('2025-01-01'),
      startDateTo: new Date('2025-03-31'),
    };

    const result = await getProjects(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      // Should return only January project
      result.data.forEach((project) => {
        expect(project.startDate.getTime()).toBeGreaterThanOrEqual(
          filters.startDateFrom!.getTime()
        );
        expect(project.startDate.getTime()).toBeLessThanOrEqual(
          filters.startDateTo!.getTime()
        );
      });
    }
  });
});

/**
 * T018: Database Layer Integration Test for Filtering and Search
 *
 * Tests filtering and search functionality directly at the database layer.
 * This complements the Server Actions tests above by testing the DB layer in isolation.
 *
 * Following TDD approach: These tests are written BEFORE implementation
 * and are EXPECTED TO FAIL until database layer is implemented.
 */
describe('Filtering Integration Test - Database Layer (T018)', () => {
  const testOrgId = 'org_filter_test' as OrganizationId;

  /**
   * Tests client search by company name at DB layer.
   */
  it('should filter clients by search term', async () => {
    // Create multiple clients
    await dbCreateClient(testOrgId, {
      companyName: 'Acme Corporation',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '+1111111111',
    });

    await dbCreateClient(testOrgId, {
      companyName: 'Beta Industries',
      contactPerson: 'Jane Smith',
      email: 'jane@beta.com',
      phone: '+2222222222',
    });

    await dbCreateClient(testOrgId, {
      companyName: 'Acme Solutions',
      contactPerson: 'Bob Johnson',
      email: 'bob@acmesolutions.com',
      phone: '+3333333333',
    });

    // Search for "Acme"
    const results = await dbGetClients(testOrgId, { search: 'Acme' });

    // Should return 2 clients (Acme Corporation and Acme Solutions)
    expect(results.length).toBeGreaterThanOrEqual(2);
    results.forEach((client) => {
      expect(
        client.companyName.toLowerCase().includes('acme') ||
          client.contactPerson.toLowerCase().includes('acme')
      ).toBe(true);
    });
  });

  /**
   * Tests project filter by status at DB layer.
   */
  it('should filter projects by status', async () => {
    // Create client first
    const client = await dbCreateClient(testOrgId, {
      companyName: 'Test Client',
      contactPerson: 'Test Person',
      email: 'test@example.com',
      phone: '+4444444444',
    });

    // Create multiple projects with different statuses
    await dbCreateProject(testOrgId, {
      name: 'Project Alpha',
      clientId: client.id,
      status: ProjectStatus.Planning,
      startDate: new Date('2025-10-01'),
    });

    await dbCreateProject(testOrgId, {
      name: 'Project Beta',
      clientId: client.id,
      status: ProjectStatus.Active,
      startDate: new Date('2025-10-15'),
    });

    await dbCreateProject(testOrgId, {
      name: 'Project Gamma',
      clientId: client.id,
      status: ProjectStatus.Active,
      startDate: new Date('2025-11-01'),
    });

    // Filter by status "Active"
    const results = await dbGetProjects(testOrgId, {
      status: ProjectStatus.Active,
    });

    // Should return 2 active projects (Beta and Gamma)
    expect(results.length).toBeGreaterThanOrEqual(2);
    results.forEach((project) => {
      expect(project.status).toBe(ProjectStatus.Active);
    });
  });

  /**
   * Tests project filter by client at DB layer.
   */
  it('should filter projects by clientId', async () => {
    // Create two clients
    const client1 = await dbCreateClient(testOrgId, {
      companyName: 'Client One',
      contactPerson: 'Person One',
      email: 'one@example.com',
      phone: '+5555555555',
    });

    const client2 = await dbCreateClient(testOrgId, {
      companyName: 'Client Two',
      contactPerson: 'Person Two',
      email: 'two@example.com',
      phone: '+6666666666',
    });

    // Create projects for different clients
    await dbCreateProject(testOrgId, {
      name: 'Project for Client 1',
      clientId: client1.id,
      startDate: new Date('2025-10-01'),
    });

    await dbCreateProject(testOrgId, {
      name: 'Project for Client 2',
      clientId: client2.id,
      startDate: new Date('2025-10-15'),
    });

    // Filter by client 1
    const results = await dbGetProjects(testOrgId, {
      clientId: client1.id,
    });

    // Should return only projects for client 1
    expect(results.length).toBeGreaterThanOrEqual(1);
    results.forEach((project) => {
      expect(project.clientId).toBe(client1.id);
    });
  });

  /**
   * Tests project filter by date range at DB layer.
   */
  it('should filter projects by date range', async () => {
    // Create projects with different start dates
    await dbCreateProject(testOrgId, {
      name: 'January Project',
      startDate: new Date('2025-01-15'),
    });

    await dbCreateProject(testOrgId, {
      name: 'June Project',
      startDate: new Date('2025-06-15'),
    });

    await dbCreateProject(testOrgId, {
      name: 'December Project',
      startDate: new Date('2025-12-15'),
    });

    // Filter by Q1 date range (Jan-Mar)
    const results = await dbGetProjects(testOrgId, {
      startDateFrom: new Date('2025-01-01'),
      startDateTo: new Date('2025-03-31'),
    });

    // Should return only January project
    results.forEach((project) => {
      expect(project.startDate.getTime()).toBeGreaterThanOrEqual(
        new Date('2025-01-01').getTime()
      );
      expect(project.startDate.getTime()).toBeLessThanOrEqual(
        new Date('2025-03-31').getTime()
      );
    });
  });

  /**
   * Tests combined filters at DB layer.
   */
  it('should apply multiple filters simultaneously', async () => {
    const client = await dbCreateClient(testOrgId, {
      companyName: 'Multi Filter Client',
      contactPerson: 'Filter Test',
      email: 'filter@test.com',
      phone: '+7777777777',
    });

    // Create projects with various attributes
    await dbCreateProject(testOrgId, {
      name: 'Active January Project',
      clientId: client.id,
      status: ProjectStatus.Active,
      startDate: new Date('2025-01-15'),
    });

    await dbCreateProject(testOrgId, {
      name: 'Planning January Project',
      clientId: client.id,
      status: ProjectStatus.Planning,
      startDate: new Date('2025-01-20'),
    });

    await dbCreateProject(testOrgId, {
      name: 'Active June Project',
      clientId: client.id,
      status: ProjectStatus.Active,
      startDate: new Date('2025-06-15'),
    });

    // Filter by: clientId + status + date range
    const results = await dbGetProjects(testOrgId, {
      clientId: client.id,
      status: ProjectStatus.Active,
      startDateFrom: new Date('2025-01-01'),
      startDateTo: new Date('2025-03-31'),
    });

    // Should return only "Active January Project"
    expect(results.length).toBeGreaterThanOrEqual(1);
    results.forEach((project) => {
      expect(project.clientId).toBe(client.id);
      expect(project.status).toBe(ProjectStatus.Active);
      expect(project.startDate.getTime()).toBeGreaterThanOrEqual(
        new Date('2025-01-01').getTime()
      );
      expect(project.startDate.getTime()).toBeLessThanOrEqual(
        new Date('2025-03-31').getTime()
      );
    });
  });

  /**
   * Tests search by project name at DB layer.
   */
  it('should filter projects by search term', async () => {
    await dbCreateProject(testOrgId, {
      name: 'Website Redesign',
      description: 'Redesign company website',
      startDate: new Date('2025-01-15'),
    });

    await dbCreateProject(testOrgId, {
      name: 'Mobile App',
      description: 'Build mobile application',
      startDate: new Date('2025-02-15'),
    });

    await dbCreateProject(testOrgId, {
      name: 'Website Maintenance',
      description: 'Ongoing website updates',
      startDate: new Date('2025-03-15'),
    });

    // Search for "Website"
    const results = await dbGetProjects(testOrgId, { search: 'Website' });

    // Should return 2 projects (Website Redesign and Website Maintenance)
    expect(results.length).toBeGreaterThanOrEqual(2);
    results.forEach((project) => {
      expect(
        project.name.toLowerCase().includes('website') ||
          project.description?.toLowerCase().includes('website')
      ).toBe(true);
    });
  });
});
