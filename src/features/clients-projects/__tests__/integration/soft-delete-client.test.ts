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
import type { CreateClientInput, CreateProjectInput } from '../../types';

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
describe('Soft-Delete Client Integration Test', () => {
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
