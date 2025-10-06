/**
 * @fileoverview Integration test for client-project relationship
 * @module features/clients-projects/__tests__/integration/client-project-relationship.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createClient, getClientById } from '../../actions/client.actions';
import {
  createProject,
  getProjectById,
  getProjects,
} from '../../actions/project.actions';
import type { CreateClientInput, CreateProjectInput } from '../../types';

/**
 * Integration test suite for client-project relationship.
 *
 * Tests the end-to-end flow from quickstart.md:
 * - Create client
 * - Create project linked to client
 * - Verify client appears in project details
 * - Verify project appears in client's projects list
 *
 * NOTE: This test MUST FAIL until Server Actions are implemented (TDD).
 */
describe('Client-Project Relationship Integration Test', () => {
  /**
   * End-to-end test: Create client → create project → verify relationship.
   */
  it('should maintain client-project relationship throughout lifecycle', async () => {
    // Step 1: Create client
    const clientInput: CreateClientInput = {
      companyName: 'Acme Corporation',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '+1234567890',
      address: '123 Main St, Springfield',
    };

    const clientResult = await createClient(clientInput);

    expect(clientResult.success).toBe(true);

    if (!clientResult.success) {
      throw new Error('Failed to create client');
    }

    const client = clientResult.data;

    // Step 2: Create project linked to client
    const projectInput: CreateProjectInput = {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      clientId: client.id,
      startDate: new Date('2025-10-15'),
      endDate: new Date('2025-12-31'),
    };

    const projectResult = await createProject(projectInput);

    expect(projectResult.success).toBe(true);

    if (!projectResult.success) {
      throw new Error('Failed to create project');
    }

    const project = projectResult.data;

    // Step 3: Verify client appears in project details
    const fetchedProjectResult = await getProjectById(project.id);

    expect(fetchedProjectResult.success).toBe(true);

    if (fetchedProjectResult.success) {
      expect(fetchedProjectResult.data.clientId).toBe(client.id);
    }

    // Step 4: Verify project appears in client's projects list
    const projectsForClientResult = await getProjects({
      clientId: client.id,
    });

    expect(projectsForClientResult.success).toBe(true);

    if (projectsForClientResult.success) {
      expect(projectsForClientResult.data.length).toBeGreaterThan(0);
      expect(
        projectsForClientResult.data.some((p) => p.id === project.id)
      ).toBe(true);
    }
  });

  /**
   * Tests that project without client (clientId: null) works correctly.
   */
  it('should handle project without client association', async () => {
    // Create project without client
    const projectInput: CreateProjectInput = {
      name: 'Internal Tool Development',
      description: 'Build internal dashboard',
      clientId: null,
      startDate: new Date('2025-10-15'),
    };

    const projectResult = await createProject(projectInput);

    expect(projectResult.success).toBe(true);

    if (projectResult.success) {
      expect(projectResult.data.clientId).toBeNull();
    }
  });
});
