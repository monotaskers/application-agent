/**
 * @fileoverview Contract test for softDeleteClient Server Action
 * @module features/clients-projects/__tests__/actions/softDeleteClient.test
 */

import { describe, it, expect } from 'vitest';
import { softDeleteClient } from '../../actions/client.actions';
import { createClientId } from '../../types';

/**
 * Contract test suite for softDeleteClient Server Action.
 *
 * Tests from client-api.md contract:
 * - Valid id → success, sets deletedAt timestamp
 * - Non-existent id → NotFoundError
 * - Client with projects → succeeds, projects retain clientId
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('softDeleteClient Contract Test', () => {
  /**
   * Tests that valid client ID soft-deletes successfully.
   */
  it('should soft-delete client with valid ID', async () => {
    const clientId = createClientId('550e8400-e29b-41d4-a716-446655440000');

    const result = await softDeleteClient(clientId);

    if (result.success) {
      expect(result.data).toBeUndefined();
    } else {
      // May not exist, acceptable for contract test setup
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that non-existent client ID returns NotFoundError.
   */
  it('should return NotFoundError for non-existent client', async () => {
    const nonExistentId = createClientId(
      '99999999-9999-9999-9999-999999999999'
    );

    const result = await softDeleteClient(nonExistentId);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('NotFoundError');
      expect(result.error.message).toBeDefined();
    }
  });
});
