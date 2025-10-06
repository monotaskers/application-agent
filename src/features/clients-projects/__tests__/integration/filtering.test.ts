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
} from '../../types';

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
describe('Filtering Integration Test', () => {
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
