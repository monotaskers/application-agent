/**
 * @fileoverview Tests for Project schema validation
 * @module features/clients-projects/__tests__/schemas/project.schema.test
 */

import { describe, it, expect } from 'vitest';
import {
  projectSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  projectFiltersSchema,
} from '../../schemas/project.schema';
import { ProjectStatus } from '../../types/project.types';

/**
 * Test suite for Project Zod schemas.
 *
 * Tests validation rules from data-model.md:
 * - name: Required, min 1 char, max 200 chars, trimmed
 * - description: Optional, max 2000 chars
 * - status: Required, valid enum value
 * - startDate: Required, valid Date
 * - endDate: Optional, valid Date, must be >= startDate
 * - budget: Optional, positive number
 * - notes: Optional, max 2000 chars
 */
describe('Project Schema Validation', () => {
  describe('projectSchema', () => {
    /**
     * Tests that valid project data passes validation.
     */
    it('should validate complete project data successfully', () => {
      const validProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        description: 'Complete overhaul of company website',
        clientId: '550e8400-e29b-41d4-a716-446655440000',
        status: ProjectStatus.Active,
        startDate: new Date('2025-10-15'),
        endDate: new Date('2025-12-31'),
        budget: 50000,
        notes: 'Phase 1 focus on mobile',
        createdAt: new Date('2025-10-06T12:00:00Z'),
        updatedAt: new Date('2025-10-06T12:00:00Z'),
      };

      const result = projectSchema.safeParse(validProject);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Website Redesign');
      }
    });

    /**
     * Tests that invalid status enum value fails validation.
     */
    it('should fail validation for invalid status enum value', () => {
      const invalidProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        clientId: null,
        status: 'InvalidStatus',
        startDate: new Date('2025-10-15'),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(invalidProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('status');
      }
    });

    /**
     * Tests that endDate before startDate fails refinement validation.
     */
    it('should fail validation for endDate before startDate', () => {
      const invalidProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        clientId: null,
        status: ProjectStatus.Planning,
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-11-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(invalidProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('endDate');
        expect(result.error.issues[0]?.message).toContain('greater than or equal');
      }
    });

    /**
     * Tests that missing required field (name) fails validation.
     */
    it('should fail validation for missing name', () => {
      const invalidProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        clientId: null,
        status: ProjectStatus.Planning,
        startDate: new Date('2025-10-15'),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(invalidProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('name');
      }
    });

    /**
     * Tests that missing required field (startDate) fails validation.
     */
    it('should fail validation for missing startDate', () => {
      const invalidProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        clientId: null,
        status: ProjectStatus.Planning,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(invalidProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('startDate');
      }
    });

    /**
     * Tests that optional fields can be omitted.
     */
    it('should validate project without optional fields', () => {
      const validProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        clientId: null,
        status: ProjectStatus.Planning,
        startDate: new Date('2025-10-15'),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(validProject);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that optional description validates when provided.
     */
    it('should validate project with optional description', () => {
      const validProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        description: 'Complete overhaul',
        clientId: null,
        status: ProjectStatus.Planning,
        startDate: new Date('2025-10-15'),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(validProject);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that description exceeding max length (2000 chars) fails.
     */
    it('should fail validation for description exceeding 2000 characters', () => {
      const invalidProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        description: 'A'.repeat(2001),
        clientId: null,
        status: ProjectStatus.Planning,
        startDate: new Date('2025-10-15'),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(invalidProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('description');
      }
    });

    /**
     * Tests that positive budget constraint is enforced.
     */
    it('should fail validation for negative budget', () => {
      const invalidProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        clientId: null,
        status: ProjectStatus.Planning,
        startDate: new Date('2025-10-15'),
        endDate: null,
        budget: -1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(invalidProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('budget');
      }
    });

    /**
     * Tests that zero budget fails validation (must be positive).
     */
    it('should fail validation for zero budget', () => {
      const invalidProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        clientId: null,
        status: ProjectStatus.Planning,
        startDate: new Date('2025-10-15'),
        endDate: null,
        budget: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(invalidProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('budget');
      }
    });

    /**
     * Tests that notes exceeding max length (2000 chars) fails.
     */
    it('should fail validation for notes exceeding 2000 characters', () => {
      const invalidProject = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        organizationId: 'org_2abc123',
        name: 'Website Redesign',
        clientId: null,
        status: ProjectStatus.Planning,
        startDate: new Date('2025-10-15'),
        endDate: null,
        notes: 'A'.repeat(2001),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = projectSchema.safeParse(invalidProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('notes');
      }
    });
  });

  describe('createProjectInputSchema', () => {
    /**
     * Tests that valid create input passes validation.
     */
    it('should validate valid create input', () => {
      const validInput = {
        name: 'Website Redesign',
        description: 'Complete overhaul',
        clientId: '550e8400-e29b-41d4-a716-446655440000',
        status: ProjectStatus.Planning,
        startDate: new Date('2025-10-15'),
        endDate: new Date('2025-12-31'),
        budget: 50000,
        notes: 'Phase 1 focus',
      };

      const result = createProjectInputSchema.safeParse(validInput);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that endDate before startDate fails in create input.
     */
    it('should fail validation for endDate before startDate in create input', () => {
      const invalidInput = {
        name: 'Website Redesign',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-11-01'),
      };

      const result = createProjectInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('endDate');
      }
    });
  });

  describe('updateProjectInputSchema', () => {
    /**
     * Tests that partial update input passes validation.
     */
    it('should validate partial update input', () => {
      const partialInput = {
        status: ProjectStatus.Active,
      };

      const result = updateProjectInputSchema.safeParse(partialInput);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that empty update input passes validation (all fields optional).
     */
    it('should validate empty update input (all fields optional)', () => {
      const emptyInput = {};

      const result = updateProjectInputSchema.safeParse(emptyInput);

      expect(result.success).toBe(true);
    });
  });

  describe('projectFiltersSchema', () => {
    /**
     * Tests that valid filters pass validation.
     */
    it('should validate filters with all options', () => {
      const validFilters = {
        search: 'Website',
        clientId: '550e8400-e29b-41d4-a716-446655440000',
        status: ProjectStatus.Active,
        startDateFrom: new Date('2025-01-01'),
        startDateTo: new Date('2025-12-31'),
        endDateFrom: new Date('2025-06-01'),
        endDateTo: new Date('2025-12-31'),
      };

      const result = projectFiltersSchema.safeParse(validFilters);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that empty filters pass validation.
     */
    it('should validate empty filters', () => {
      const emptyFilters = {};

      const result = projectFiltersSchema.safeParse(emptyFilters);

      expect(result.success).toBe(true);
    });

    /**
     * Tests that partial filters pass validation.
     */
    it('should validate partial filters', () => {
      const partialFilters = {
        status: ProjectStatus.Planning,
      };

      const result = projectFiltersSchema.safeParse(partialFilters);

      expect(result.success).toBe(true);
    });
  });
});
