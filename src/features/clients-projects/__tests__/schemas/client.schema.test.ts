/**
 * @fileoverview Tests for Client schema validation
 * @module features/clients-projects/__tests__/schemas/client.schema.test
 */

import { describe, it, expect } from 'vitest';
import {
  clientSchema,
  createClientInputSchema,
  updateClientInputSchema,
  clientFiltersSchema,
} from '../../schemas/client.schema';

/**
 * Test suite for Client Zod schemas.
 *
 * Tests validation rules from data-model.md:
 * - companyName: Required, min 1 char, max 200 chars, trimmed
 * - contactPerson: Required, min 1 char, max 100 chars, trimmed
 * - email: Required, valid email format
 * - phone: Required, min 1 char
 * - address: Optional, max 500 chars
 * - notes: Optional, max 2000 chars
 */
describe('Client Schema Validation', () => {
  describe('clientSchema', () => {
    /**
     * Tests that valid client data passes validation.
     */
    it('should validate complete client data successfully', () => {
      const validClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        address: '123 Main St, Springfield',
        notes: 'Important client for Q4',
        deletedAt: null,
        createdAt: new Date('2025-10-06T12:00:00Z'),
        updatedAt: new Date('2025-10-06T12:00:00Z'),
      };

      const result = clientSchema.safeParse(validClient);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.companyName).toBe('Acme Corporation');
      }
    });

    /**
     * Tests that invalid email format fails validation.
     */
    it('should fail validation for invalid email format', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'not-an-email',
        phone: '+1234567890',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('email');
      }
    });

    /**
     * Tests that missing required field (companyName) fails validation.
     */
    it('should fail validation for missing companyName', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('companyName');
      }
    });

    /**
     * Tests that missing required field (contactPerson) fails validation.
     */
    it('should fail validation for missing contactPerson', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        email: 'john@acme.com',
        phone: '+1234567890',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('contactPerson');
      }
    });

    /**
     * Tests that missing required field (email) fails validation.
     */
    it('should fail validation for missing email', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        phone: '+1234567890',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('email');
      }
    });

    /**
     * Tests that missing required field (phone) fails validation.
     */
    it('should fail validation for missing phone', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('phone');
      }
    });

    /**
     * Tests that companyName exceeding max length (200 chars) fails.
     */
    it('should fail validation for companyName exceeding 200 characters', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'A'.repeat(201),
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('companyName');
      }
    });

    /**
     * Tests that contactPerson exceeding max length (100 chars) fails.
     */
    it('should fail validation for contactPerson exceeding 100 characters', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        contactPerson: 'A'.repeat(101),
        email: 'john@acme.com',
        phone: '+1234567890',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('contactPerson');
      }
    });

    /**
     * Tests that optional address exceeding max length (500 chars) fails.
     */
    it('should fail validation for address exceeding 500 characters', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        address: 'A'.repeat(501),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('address');
      }
    });

    /**
     * Tests that optional notes exceeding max length (2000 chars) fails.
     */
    it('should fail validation for notes exceeding 2000 characters', () => {
      const invalidClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        notes: 'A'.repeat(2001),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(invalidClient);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('notes');
      }
    });

    /**
     * Tests that optional fields can be omitted.
     */
    it('should validate client without optional fields (address, notes)', () => {
      const validClient = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = clientSchema.safeParse(validClient);

      expect(result.success).toBe(true);
    });
  });

  describe('createClientInputSchema', () => {
    /**
     * Tests that valid create input passes validation.
     */
    it('should validate valid create input', () => {
      const validInput = {
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        address: '123 Main St',
        notes: 'Important client',
      };

      const result = createClientInputSchema.safeParse(validInput);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that invalid email fails validation.
     */
    it('should fail validation for invalid email in create input', () => {
      const invalidInput = {
        companyName: 'Acme Corporation',
        contactPerson: 'John Doe',
        email: 'not-an-email',
        phone: '+1234567890',
      };

      const result = createClientInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });
  });

  describe('updateClientInputSchema', () => {
    /**
     * Tests that partial update input passes validation.
     */
    it('should validate partial update input', () => {
      const partialInput = {
        contactPerson: 'Jane Doe',
      };

      const result = updateClientInputSchema.safeParse(partialInput);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that empty update input passes validation (all fields optional).
     */
    it('should validate empty update input (all fields optional)', () => {
      const emptyInput = {};

      const result = updateClientInputSchema.safeParse(emptyInput);

      expect(result.success).toBe(true);
    });
  });

  describe('clientFiltersSchema', () => {
    /**
     * Tests that valid filters pass validation.
     */
    it('should validate filters with search and includeDeleted', () => {
      const validFilters = {
        search: 'Acme',
        includeDeleted: true,
      };

      const result = clientFiltersSchema.safeParse(validFilters);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that default value for includeDeleted is false.
     */
    it('should default includeDeleted to false', () => {
      const filters = {
        search: 'Acme',
      };

      const result = clientFiltersSchema.safeParse(filters);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.includeDeleted).toBe(false);
      }
    });

    /**
     * Tests that empty filters pass validation.
     */
    it('should validate empty filters', () => {
      const emptyFilters = {};

      const result = clientFiltersSchema.safeParse(emptyFilters);

      expect(result.success).toBe(true);
    });
  });
});
