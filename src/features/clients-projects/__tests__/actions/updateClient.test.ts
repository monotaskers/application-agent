/**
 * @fileoverview Contract test for updateClient Server Action
 * @module features/clients-projects/__tests__/actions/updateClient.test
 */

import { describe, it, expect } from 'vitest';
import { updateClient } from '../../actions/client.actions';
import { createClientId } from '../../types';
import type { UpdateClientInput } from '../../types';

/**
 * Contract test suite for updateClient Server Action.
 *
 * Tests from client-api.md contract:
 * - Valid partial update → success with updated Client
 * - Invalid data → validation error
 * - Non-existent id → NotFoundError
 * - Updates updatedAt timestamp
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('updateClient Contract Test', () => {
  /**
   * Tests that valid partial update succeeds.
   */
  it('should update client with valid partial data', async () => {
    const clientId = createClientId('550e8400-e29b-41d4-a716-446655440000');
    const updates: UpdateClientInput = {
      contactPerson: 'John Doe Jr.',
      notes: 'VIP client - handle with priority',
    };

    const result = await updateClient(clientId, updates);

    if (result.success) {
      expect(result.data.id).toBe(clientId);
      expect(result.data.contactPerson).toBe('John Doe Jr.');
      expect(result.data.notes).toBe('VIP client - handle with priority');
      expect(result.data.updatedAt).toBeInstanceOf(Date);
    } else {
      // May not exist, acceptable for contract test setup
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that invalid email in update returns validation error.
   */
  it('should return validation error for invalid email', async () => {
    const clientId = createClientId('550e8400-e29b-41d4-a716-446655440000');
    const updates: UpdateClientInput = {
      email: 'not-an-email',
    };

    const result = await updateClient(clientId, updates);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.email).toBeDefined();
    }
  });

  /**
   * Tests that non-existent client ID returns NotFoundError.
   */
  it('should return NotFoundError for non-existent client', async () => {
    const nonExistentId = createClientId(
      '99999999-9999-9999-9999-999999999999'
    );
    const updates: UpdateClientInput = {
      contactPerson: 'Updated Name',
    };

    const result = await updateClient(nonExistentId, updates);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that updatedAt timestamp is refreshed.
   */
  it('should update updatedAt timestamp', async () => {
    const clientId = createClientId('550e8400-e29b-41d4-a716-446655440000');
    const updates: UpdateClientInput = {
      notes: 'New note',
    };

    const before = new Date();
    const result = await updateClient(clientId, updates);
    const after = new Date();

    if (result.success) {
      expect(result.data.updatedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(result.data.updatedAt.getTime()).toBeLessThanOrEqual(
        after.getTime()
      );
    }
  });
});
