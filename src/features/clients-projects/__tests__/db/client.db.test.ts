/**
 * Client Database Operations Contract Tests
 *
 * @fileoverview Tests for client database layer operations.
 * These tests verify the contract defined in contracts/client.contract.ts
 *
 * Following TDD approach: These tests are written BEFORE implementation
 * and are EXPECTED TO FAIL until client.db.ts is implemented.
 *
 * @module features/clients-projects/__tests__/db/client.db.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { OrganizationId, ClientId } from '@/features/clients-projects/types';

// Import database functions that DON'T EXIST YET (will be created in Phase 3.3)
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  softDeleteClient,
  restoreClient,
} from '@/features/clients-projects/db/client.db';

/**
 * Test suite for client database operations
 *
 * Coverage:
 * - T006: createClient() functionality
 * - T007: getClients() functionality
 * - T008: getClientById() functionality
 * - T009: updateClient() with optimistic locking
 * - T010: softDeleteClient() functionality
 */
describe('Client Database Operations', () => {
  // Test data
  const testOrgId = 'org_test123' as OrganizationId;
  const otherOrgId = 'org_other456' as OrganizationId;

  /**
   * T006: Contract test for createClient()
   *
   * Verifies:
   * - Client created with all required fields
   * - Version field defaults to 1
   * - Timestamps (createdAt, updatedAt) auto-populated
   * - Multi-tenant isolation (orgId required)
   * - Validation errors throw appropriately
   */
  describe('createClient', () => {
    it('should create a client with all fields and default version=1', async () => {
      const clientData = {
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        address: '123 Main St, Anytown, USA',
        notes: 'Important client',
      };

      const client = await createClient(testOrgId, clientData);

      // Verify all fields
      expect(client.id).toBeDefined();
      expect(client.organizationId).toBe(testOrgId);
      expect(client.companyName).toBe(clientData.companyName);
      expect(client.contactPerson).toBe(clientData.contactPerson);
      expect(client.email).toBe(clientData.email);
      expect(client.phone).toBe(clientData.phone);
      expect(client.address).toBe(clientData.address);
      expect(client.notes).toBe(clientData.notes);

      // Verify optimistic locking version
      expect(client.version).toBe(1);

      // Verify timestamps
      expect(client.createdAt).toBeInstanceOf(Date);
      expect(client.updatedAt).toBeInstanceOf(Date);
      expect(client.deletedAt).toBeNull();
    });

    it('should create client without optional fields', async () => {
      const clientData = {
        companyName: 'Minimal Corp',
        contactPerson: 'Jane Smith',
        email: 'jane@minimal.com',
        phone: '+0987654321',
      };

      const client = await createClient(testOrgId, clientData);

      expect(client.id).toBeDefined();
      expect(client.companyName).toBe(clientData.companyName);
      expect(client.address).toBeUndefined();
      expect(client.notes).toBeUndefined();
      expect(client.version).toBe(1);
    });

    it('should enforce multi-tenant isolation (orgId required)', async () => {
      const clientData = {
        companyName: 'Test Corp',
        contactPerson: 'Test User',
        email: 'test@test.com',
        phone: '+1111111111',
      };

      // Should accept valid orgId
      const client = await createClient(testOrgId, clientData);
      expect(client.organizationId).toBe(testOrgId);
    });

    it('should throw validation error for invalid data', async () => {
      const invalidData = {
        companyName: '', // Empty company name - should fail validation
        contactPerson: 'Test User',
        email: 'invalid-email', // Invalid email format
        phone: 'abc', // Invalid phone
      };

      await expect(createClient(testOrgId, invalidData as any)).rejects.toThrow();
    });
  });

  /**
   * T007: Contract test for getClients()
   *
   * Verifies:
   * - Returns all clients for the organization
   * - Filters work (search, includeDeleted)
   * - Empty array for org with no clients
   * - Multi-tenant isolation
   */
  describe('getClients', () => {
    beforeEach(async () => {
      // Setup: Create test clients
      await createClient(testOrgId, {
        companyName: 'Alpha Corp',
        contactPerson: 'Alice',
        email: 'alice@alpha.com',
        phone: '+1111111111',
      });

      await createClient(testOrgId, {
        companyName: 'Beta Inc',
        contactPerson: 'Bob',
        email: 'bob@beta.com',
        phone: '+2222222222',
      });

      await createClient(otherOrgId, {
        companyName: 'Other Org Client',
        contactPerson: 'Charlie',
        email: 'charlie@other.com',
        phone: '+3333333333',
      });
    });

    it('should return all clients for the organization', async () => {
      const clients = await getClients(testOrgId);

      expect(clients).toHaveLength(2);
      expect(clients.every(c => c.organizationId === testOrgId)).toBe(true);
    });

    it('should return empty array for org with no clients', async () => {
      const emptyOrgId = 'org_empty' as OrganizationId;
      const clients = await getClients(emptyOrgId);

      expect(clients).toEqual([]);
    });

    it('should filter by search term (company name)', async () => {
      const clients = await getClients(testOrgId, { search: 'Alpha' });

      expect(clients).toHaveLength(1);
      expect(clients[0]?.companyName).toBe('Alpha Corp');
    });

    it('should exclude soft-deleted clients by default', async () => {
      // Create and soft-delete a client
      const client = await createClient(testOrgId, {
        companyName: 'To Delete',
        contactPerson: 'Delete Me',
        email: 'delete@test.com',
        phone: '+4444444444',
      });

      await softDeleteClient(testOrgId, client.id);

      // Should not include deleted client
      const clients = await getClients(testOrgId);
      expect(clients.find(c => c.id === client.id)).toBeUndefined();
    });

    it('should include soft-deleted clients when includeDeleted=true', async () => {
      // Create and soft-delete a client
      const client = await createClient(testOrgId, {
        companyName: 'Deleted Client',
        contactPerson: 'Deleted',
        email: 'deleted@test.com',
        phone: '+5555555555',
      });

      await softDeleteClient(testOrgId, client.id);

      // Should include deleted client with flag
      const clients = await getClients(testOrgId, { includeDeleted: true });
      const deletedClient = clients.find(c => c.id === client.id);

      expect(deletedClient).toBeDefined();
      expect(deletedClient?.deletedAt).toBeInstanceOf(Date);
    });

    it('should enforce multi-tenant isolation', async () => {
      const testOrgClients = await getClients(testOrgId);
      const otherOrgClients = await getClients(otherOrgId);

      // Each org should only see their own clients
      expect(testOrgClients).toHaveLength(2);
      expect(otherOrgClients).toHaveLength(1);
      expect(testOrgClients.every(c => c.organizationId === testOrgId)).toBe(true);
      expect(otherOrgClients.every(c => c.organizationId === otherOrgId)).toBe(true);
    });
  });

  /**
   * T008: Contract test for getClientById()
   *
   * Verifies:
   * - Returns client by ID or null if not found
   * - Multi-tenant isolation (cannot access other org's clients)
   */
  describe('getClientById', () => {
    let testClientId: ClientId;
    let otherOrgClientId: ClientId;

    beforeEach(async () => {
      const testClient = await createClient(testOrgId, {
        companyName: 'Test Client',
        contactPerson: 'Test',
        email: 'test@test.com',
        phone: '+1111111111',
      });
      testClientId = testClient.id;

      const otherClient = await createClient(otherOrgId, {
        companyName: 'Other Client',
        contactPerson: 'Other',
        email: 'other@test.com',
        phone: '+2222222222',
      });
      otherOrgClientId = otherClient.id;
    });

    it('should return client by ID', async () => {
      const client = await getClientById(testOrgId, testClientId);

      expect(client).toBeDefined();
      expect(client?.id).toBe(testClientId);
      expect(client?.organizationId).toBe(testOrgId);
    });

    it('should return null for non-existent client', async () => {
      const fakeId = 'fake-client-id' as ClientId;
      const client = await getClientById(testOrgId, fakeId);

      expect(client).toBeNull();
    });

    it('should enforce multi-tenant isolation (cannot access other org clients)', async () => {
      // Attempt to access other org's client
      const client = await getClientById(testOrgId, otherOrgClientId);

      // Should return null (not authorized)
      expect(client).toBeNull();
    });
  });

  /**
   * T009: Contract test for updateClient() with optimistic locking
   *
   * Verifies:
   * - Update succeeds with correct version
   * - Version increments after update
   * - updatedAt timestamp changes
   * - Update fails with incorrect version (conflict error)
   */
  describe('updateClient with optimistic locking', () => {
    let clientId: ClientId;
    let currentVersion: number;

    beforeEach(async () => {
      const client = await createClient(testOrgId, {
        companyName: 'Update Test Corp',
        contactPerson: 'Update Test',
        email: 'update@test.com',
        phone: '+1111111111',
      });
      clientId = client.id;
      currentVersion = client.version;
    });

    it('should update client with correct version and increment version', async () => {
      const updates = {
        companyName: 'Updated Corp Name',
        phone: '+9999999999',
      };

      const updatedClient = await updateClient(
        testOrgId,
        clientId,
        updates,
        currentVersion
      );

      expect(updatedClient.companyName).toBe(updates.companyName);
      expect(updatedClient.phone).toBe(updates.phone);
      expect(updatedClient.version).toBe(currentVersion + 1);
      expect(updatedClient.updatedAt.getTime()).toBeGreaterThan(
        (await getClientById(testOrgId, clientId))?.createdAt.getTime() || 0
      );
    });

    it('should fail with version conflict error (concurrent edit)', async () => {
      const updates = { companyName: 'New Name' };
      const wrongVersion = currentVersion + 1; // Simulate stale version

      await expect(
        updateClient(testOrgId, clientId, updates, wrongVersion)
      ).rejects.toThrow(/Conflict.*modified by another user/i);
    });

    it('should update updatedAt timestamp on update', async () => {
      const originalClient = await getClientById(testOrgId, clientId);
      const originalUpdatedAt = originalClient?.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedClient = await updateClient(
        testOrgId,
        clientId,
        { notes: 'Updated notes' },
        currentVersion
      );

      expect(updatedClient.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt?.getTime() || 0
      );
    });

    it('should enforce multi-tenant isolation on update', async () => {
      // Attempt to update client from wrong org
      await expect(
        updateClient(otherOrgId, clientId, { companyName: 'Hack' }, currentVersion)
      ).rejects.toThrow(/not found/i);
    });
  });

  /**
   * T010: Contract test for softDeleteClient()
   *
   * Verifies:
   * - Soft delete sets deletedAt timestamp
   * - Soft-deleted client excluded from default queries
   * - Soft-deleted client included with includeDeleted=true
   * - Cannot soft-delete already deleted client
   */
  describe('softDeleteClient', () => {
    let clientId: ClientId;

    beforeEach(async () => {
      const client = await createClient(testOrgId, {
        companyName: 'Delete Test Corp',
        contactPerson: 'Delete Test',
        email: 'delete@test.com',
        phone: '+1111111111',
      });
      clientId = client.id;
    });

    it('should set deletedAt timestamp on soft delete', async () => {
      const deletedClient = await softDeleteClient(testOrgId, clientId);

      expect(deletedClient.deletedAt).toBeInstanceOf(Date);
      expect(deletedClient.deletedAt?.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should exclude soft-deleted client from default queries', async () => {
      await softDeleteClient(testOrgId, clientId);

      const clients = await getClients(testOrgId);
      expect(clients.find(c => c.id === clientId)).toBeUndefined();
    });

    it('should include soft-deleted client when includeDeleted=true', async () => {
      await softDeleteClient(testOrgId, clientId);

      const clients = await getClients(testOrgId, { includeDeleted: true });
      const deletedClient = clients.find(c => c.id === clientId);

      expect(deletedClient).toBeDefined();
      expect(deletedClient?.deletedAt).toBeInstanceOf(Date);
    });

    it('should fail when attempting to soft-delete already deleted client', async () => {
      // Delete once
      await softDeleteClient(testOrgId, clientId);

      // Attempt to delete again
      await expect(softDeleteClient(testOrgId, clientId)).rejects.toThrow(/already deleted/i);
    });

    it('should allow restoring soft-deleted client', async () => {
      // Soft delete
      await softDeleteClient(testOrgId, clientId);

      // Restore
      const restoredClient = await restoreClient(testOrgId, clientId);

      expect(restoredClient.deletedAt).toBeNull();

      // Should appear in default queries again
      const clients = await getClients(testOrgId);
      expect(clients.find(c => c.id === clientId)).toBeDefined();
    });

    it('should enforce multi-tenant isolation on soft delete', async () => {
      // Attempt to delete client from wrong org
      await expect(softDeleteClient(otherOrgId, clientId)).rejects.toThrow(/not found/i);
    });
  });
});
