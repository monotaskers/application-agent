/**
 * Database Layer: Optimistic Locking Integration Tests
 *
 * @fileoverview Integration tests verifying concurrent edit conflict detection
 * using optimistic locking (version-based concurrency control) at the database layer.
 *
 * Following TDD approach: These tests are written BEFORE implementation
 * and are EXPECTED TO FAIL until database layer is implemented.
 *
 * @module features/clients-projects/__tests__/integration/db-optimistic-locking.test
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
  getClientById,
  updateClient,
} from '@/features/clients-projects/db/client.db';

import {
  createProject,
  getProjectById,
  updateProject,
} from '@/features/clients-projects/db/project.db';

/**
 * Test suite for optimistic locking (concurrent edit detection)
 *
 * Coverage:
 * - T016: Concurrent edit conflict detection for both clients and projects
 */
describe('DB Layer: Optimistic Locking Integration', () => {
  const testOrgId = 'org_test123' as OrganizationId;

  /**
   * T016: Integration test for concurrent edit conflict detection
   *
   * Simulates two users editing the same resource simultaneously.
   * The second update should fail with a conflict error due to version mismatch.
   */
  describe('Concurrent edit conflict detection', () => {
    describe('Client concurrent edits', () => {
      let clientId: ClientId;
      let initialVersion: number;

      beforeEach(async () => {
        const client = await createClient(testOrgId, {
          companyName: 'Concurrent Test Corp',
          contactPerson: 'Test User',
          email: 'test@concurrent.com',
          phone: '+1111111111',
        });
        clientId = client.id;
        initialVersion = client.version;
      });

      it('should allow sequential updates with correct version', async () => {
        // User A fetches client
        const clientA = await getClientById(testOrgId, clientId);
        expect(clientA?.version).toBe(initialVersion);

        // User A updates successfully
        const updatedA = await updateClient(
          testOrgId,
          clientId,
          { companyName: 'Updated by A' },
          initialVersion
        );
        expect(updatedA.version).toBe(initialVersion + 1);
        expect(updatedA.companyName).toBe('Updated by A');

        // User B fetches the latest version
        const clientB = await getClientById(testOrgId, clientId);
        expect(clientB?.version).toBe(initialVersion + 1);

        // User B updates successfully with correct version
        const updatedB = await updateClient(
          testOrgId,
          clientId,
          { companyName: 'Updated by B' },
          initialVersion + 1
        );
        expect(updatedB.version).toBe(initialVersion + 2);
        expect(updatedB.companyName).toBe('Updated by B');
      });

      it('should reject concurrent update with stale version', async () => {
        // User A and User B both fetch the client
        const clientA = await getClientById(testOrgId, clientId);
        const clientB = await getClientById(testOrgId, clientId);

        expect(clientA?.version).toBe(initialVersion);
        expect(clientB?.version).toBe(initialVersion);

        // User A updates first (succeeds)
        const updatedA = await updateClient(
          testOrgId,
          clientId,
          { companyName: 'Updated by A' },
          initialVersion
        );
        expect(updatedA.version).toBe(initialVersion + 1);

        // User B attempts to update with stale version (should fail)
        await expect(
          updateClient(
            testOrgId,
            clientId,
            { companyName: 'Updated by B' },
            initialVersion // Stale version!
          )
        ).rejects.toThrow(/Conflict.*modified by another user/i);

        // Verify client still has User A's update
        const finalClient = await getClientById(testOrgId, clientId);
        expect(finalClient?.companyName).toBe('Updated by A');
        expect(finalClient?.version).toBe(initialVersion + 1);
      });

      it('should detect conflict even with version off by one', async () => {
        // Update once
        const updated1 = await updateClient(
          testOrgId,
          clientId,
          { companyName: 'First Update' },
          initialVersion
        );
        const version1 = updated1.version;

        // Update again
        const updated2 = await updateClient(
          testOrgId,
          clientId,
          { companyName: 'Second Update' },
          version1
        );
        const version2 = updated2.version;

        expect(version2).toBe(version1 + 1);

        // Attempt update with version1 (one behind) - should fail
        await expect(
          updateClient(
            testOrgId,
            clientId,
            { companyName: 'Conflicting Update' },
            version1
          )
        ).rejects.toThrow(/Conflict.*modified by another user/i);
      });
    });

    describe('Project concurrent edits', () => {
      let projectId: ProjectId;
      let initialVersion: number;

      beforeEach(async () => {
        const project = await createProject(testOrgId, {
          name: 'Concurrent Edit Project',
          status: 'Planning' as ProjectStatus,
          startDate: new Date('2025-01-01'),
        });
        projectId = project.id;
        initialVersion = project.version;
      });

      it('should allow sequential updates with correct version', async () => {
        // User A updates
        const updatedA = await updateProject(
          testOrgId,
          projectId,
          { name: 'Updated by A' },
          initialVersion
        );
        expect(updatedA.version).toBe(initialVersion + 1);

        // User B updates with new version
        const updatedB = await updateProject(
          testOrgId,
          projectId,
          { name: 'Updated by B' },
          initialVersion + 1
        );
        expect(updatedB.version).toBe(initialVersion + 2);
      });

      it('should reject concurrent update with stale version', async () => {
        // Both users fetch project
        const projectA = await getProjectById(testOrgId, projectId);
        const projectB = await getProjectById(testOrgId, projectId);

        expect(projectA?.version).toBe(initialVersion);
        expect(projectB?.version).toBe(initialVersion);

        // User A updates first (succeeds)
        const updatedA = await updateProject(
          testOrgId,
          projectId,
          { name: 'Updated by A', status: 'Active' as ProjectStatus },
          initialVersion
        );
        expect(updatedA.version).toBe(initialVersion + 1);

        // User B attempts to update with stale version (should fail)
        await expect(
          updateProject(
            testOrgId,
            projectId,
            { name: 'Updated by B' },
            initialVersion // Stale!
          )
        ).rejects.toThrow(/Conflict.*modified by another user/i);

        // Verify project has User A's changes
        const finalProject = await getProjectById(testOrgId, projectId);
        expect(finalProject?.name).toBe('Updated by A');
        expect(finalProject?.status).toBe('Active');
        expect(finalProject?.version).toBe(initialVersion + 1);
      });

      it('should handle rapid successive updates correctly', async () => {
        // Simulate rapid updates from multiple users
        let currentVersion = initialVersion;

        // Update 1
        const update1 = await updateProject(
          testOrgId,
          projectId,
          { name: 'Update 1' },
          currentVersion
        );
        currentVersion = update1.version;
        expect(currentVersion).toBe(initialVersion + 1);

        // Update 2
        const update2 = await updateProject(
          testOrgId,
          projectId,
          { name: 'Update 2' },
          currentVersion
        );
        currentVersion = update2.version;
        expect(currentVersion).toBe(initialVersion + 2);

        // Update 3
        const update3 = await updateProject(
          testOrgId,
          projectId,
          { name: 'Update 3' },
          currentVersion
        );
        currentVersion = update3.version;
        expect(currentVersion).toBe(initialVersion + 3);

        // Attempt update with very stale version (initialVersion) - should fail
        await expect(
          updateProject(
            testOrgId,
            projectId,
            { name: 'Stale Update' },
            initialVersion
          )
        ).rejects.toThrow(/Conflict.*modified by another user/i);

        // Verify final state
        const final = await getProjectById(testOrgId, projectId);
        expect(final?.name).toBe('Update 3');
        expect(final?.version).toBe(initialVersion + 3);
      });
    });

    describe('Cross-entity conflict scenarios', () => {
      it('should handle client update while associated project is being updated', async () => {
        // Create client and project
        const client = await createClient(testOrgId, {
          companyName: 'Cross Entity Corp',
          contactPerson: 'Test User',
          email: 'cross@entity.com',
          phone: '+2222222222',
        });

        const project = await createProject(testOrgId, {
          name: 'Cross Entity Project',
          status: 'Active' as ProjectStatus,
          startDate: new Date('2025-01-01'),
          clientId: client.id,
        });

        // User A fetches both
        const clientA = await getClientById(testOrgId, client.id);
        const projectA = await getProjectById(testOrgId, project.id);

        // User A updates client
        await updateClient(
          testOrgId,
          client.id,
          { companyName: 'Updated Client' },
          clientA!.version
        );

        // User B (with stale client version) tries to update client - should fail
        await expect(
          updateClient(
            testOrgId,
            client.id,
            { phone: '+9999999999' },
            clientA!.version // Stale!
          )
        ).rejects.toThrow(/Conflict.*modified by another user/i);

        // User B can still update project (different entity, different version)
        const updatedProject = await updateProject(
          testOrgId,
          project.id,
          { name: 'Updated Project' },
          projectA!.version
        );
        expect(updatedProject.name).toBe('Updated Project');
      });
    });
  });
});
