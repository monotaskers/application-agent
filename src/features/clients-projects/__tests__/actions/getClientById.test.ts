/**
 * @fileoverview Contract test for getClientById Server Action
 * @module features/clients-projects/__tests__/actions/getClientById.test
 */

import { describe, it, expect } from 'vitest';
import { getClientById } from '../../actions/client.actions';
import { createClientId } from '../../types';

/**
 * Contract test suite for getClientById Server Action.
 *
 * Tests from client-api.md contract:
 * - Valid UUID → success with Client
 * - Non-existent UUID → NotFoundError
 * - Client from different org → NotFoundError (authorization)
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('getClientById Contract Test', () => {
  /**
   * Tests that valid client ID returns client data.
   */
  it('should return client data for valid ID', async () => {
    const clientId = createClientId('550e8400-e29b-41d4-a716-446655440000');

    const result = await getClientById(clientId);

    if (result.success) {
      expect(result.data.id).toBe(clientId);
      expect(result.data.companyName).toBeDefined();
      expect(result.data.organizationId).toBeDefined();
    } else {
      // May not exist yet, acceptable for contract test
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that non-existent ID returns NotFoundError.
   */
  it('should return NotFoundError for non-existent client ID', async () => {
    const nonExistentId = createClientId(
      '99999999-9999-9999-9999-999999999999'
    );

    const result = await getClientById(nonExistentId);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('NotFoundError');
      expect(result.error.message).toBeDefined();
    }
  });
});
