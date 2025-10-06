/**
 * @fileoverview Contract test for createClient Server Action
 * @module features/clients-projects/__tests__/actions/createClient.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '../../actions/client.actions';
import type { CreateClientInput } from '../../types';

/**
 * Contract test suite for createClient Server Action.
 *
 * Tests from client-api.md contract:
 * - Valid input → success result with Client
 * - Invalid email → validation error
 * - Missing required fields → validation error
 * - Auto-generates UUID for id
 * - Sets organizationId from auth()
 * - Sets createdAt and updatedAt timestamps
 * - Sets deletedAt to null
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('createClient Contract Test', () => {
  /**
   * Tests that valid input returns success result with complete Client.
   */
  it('should create client with valid input and return success result', async () => {
    const input: CreateClientInput = {
      companyName: 'Acme Corporation',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '+1234567890',
      address: '123 Main St, Springfield',
      notes: 'Important client for Q4',
    };

    const result = await createClient(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBeDefined();
      expect(result.data.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      ); // UUID format
      expect(result.data.organizationId).toBeDefined();
      expect(result.data.companyName).toBe('Acme Corporation');
      expect(result.data.contactPerson).toBe('John Doe');
      expect(result.data.email).toBe('john@acme.com');
      expect(result.data.phone).toBe('+1234567890');
      expect(result.data.address).toBe('123 Main St, Springfield');
      expect(result.data.notes).toBe('Important client for Q4');
      expect(result.data.deletedAt).toBeNull();
      expect(result.data.createdAt).toBeInstanceOf(Date);
      expect(result.data.updatedAt).toBeInstanceOf(Date);
    }
  });

  /**
   * Tests that invalid email format returns validation error.
   */
  it('should return validation error for invalid email', async () => {
    const input: CreateClientInput = {
      companyName: 'Acme Corporation',
      contactPerson: 'John Doe',
      email: 'not-an-email',
      phone: '+1234567890',
    };

    const result = await createClient(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.message).toBeDefined();
      expect(result.error.fields?.email).toBeDefined();
    }
  });

  /**
   * Tests that missing required field (companyName) returns validation error.
   */
  it('should return validation error for missing companyName', async () => {
    const input = {
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '+1234567890',
    } as CreateClientInput;

    const result = await createClient(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.companyName).toBeDefined();
    }
  });

  /**
   * Tests that missing required field (contactPerson) returns validation error.
   */
  it('should return validation error for missing contactPerson', async () => {
    const input = {
      companyName: 'Acme Corporation',
      email: 'john@acme.com',
      phone: '+1234567890',
    } as CreateClientInput;

    const result = await createClient(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.contactPerson).toBeDefined();
    }
  });

  /**
   * Tests that missing required field (email) returns validation error.
   */
  it('should return validation error for missing email', async () => {
    const input = {
      companyName: 'Acme Corporation',
      contactPerson: 'John Doe',
      phone: '+1234567890',
    } as CreateClientInput;

    const result = await createClient(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.email).toBeDefined();
    }
  });

  /**
   * Tests that missing required field (phone) returns validation error.
   */
  it('should return validation error for missing phone', async () => {
    const input = {
      companyName: 'Acme Corporation',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
    } as CreateClientInput;

    const result = await createClient(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.phone).toBeDefined();
    }
  });

  /**
   * Tests that client is created without optional fields.
   */
  it('should create client without optional fields (address, notes)', async () => {
    const input: CreateClientInput = {
      companyName: 'Beta Industries',
      contactPerson: 'Jane Smith',
      email: 'jane@beta.com',
      phone: '+0987654321',
    };

    const result = await createClient(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.companyName).toBe('Beta Industries');
      expect(result.data.address).toBeUndefined();
      expect(result.data.notes).toBeUndefined();
    }
  });

  /**
   * Tests that auto-generated timestamps are set correctly.
   */
  it('should auto-generate createdAt and updatedAt timestamps', async () => {
    const input: CreateClientInput = {
      companyName: 'Acme Corporation',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '+1234567890',
    };

    const before = new Date();
    const result = await createClient(input);
    const after = new Date();

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(result.data.createdAt.getTime()).toBeLessThanOrEqual(
        after.getTime()
      );
      expect(result.data.updatedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(result.data.updatedAt.getTime()).toBeLessThanOrEqual(
        after.getTime()
      );
    }
  });
});
