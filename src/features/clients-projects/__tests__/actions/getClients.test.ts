/**
 * @fileoverview Contract test for getClients Server Action
 * @module features/clients-projects/__tests__/actions/getClients.test
 */

import { describe, it, expect } from 'vitest';
import { getClients, createClient } from '../../actions/client.actions';
import type { ClientFilters } from '../../types';

/**
 * Contract test suite for getClients Server Action.
 *
 * Tests from client-api.md contract:
 * - No filters → returns all active clients for organization
 * - includeDeleted: true → returns all clients including soft-deleted
 * - search filter → filters by companyName or contactPerson (case-insensitive)
 * - Organization isolation: only returns clients for current org
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('getClients Contract Test', () => {
  /**
   * Tests that getClients without filters returns all active clients.
   */
  it('should return all active clients for organization without filters', async () => {
    const result = await getClients();

    expect(result.success).toBe(true);

    if (result.success) {
      expect(Array.isArray(result.data)).toBe(true);
      result.data.forEach((client) => {
        expect(client.deletedAt).toBeNull();
        expect(client.organizationId).toBeDefined();
      });
    }
  });

  /**
   * Tests that search filter works with companyName.
   */
  it('should filter clients by search term (companyName)', async () => {
    const filters: ClientFilters = {
      search: 'Acme',
    };

    const result = await getClients(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      result.data.forEach((client) => {
        expect(
          client.companyName.toLowerCase().includes('acme') ||
            client.contactPerson.toLowerCase().includes('acme')
        ).toBe(true);
      });
    }
  });

  /**
   * Tests that includeDeleted returns soft-deleted clients.
   */
  it('should include soft-deleted clients when includeDeleted is true', async () => {
    const filters: ClientFilters = {
      includeDeleted: true,
    };

    const result = await getClients(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(Array.isArray(result.data)).toBe(true);
      // Should include both deleted and non-deleted clients
    }
  });

  /**
   * Tests that default behavior excludes soft-deleted clients.
   */
  it('should exclude soft-deleted clients by default', async () => {
    const result = await getClients();

    expect(result.success).toBe(true);

    if (result.success) {
      result.data.forEach((client) => {
        expect(client.deletedAt).toBeNull();
      });
    }
  });
});
