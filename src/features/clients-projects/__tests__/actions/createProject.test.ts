/**
 * @fileoverview Contract test for createProject Server Action
 * @module features/clients-projects/__tests__/actions/createProject.test
 */

import { describe, it, expect } from 'vitest';
import { createProject } from '../../actions/project.actions';
import { ProjectStatus } from '../../types/project.types';
import { createClientId } from '../../types';
import type { CreateProjectInput } from '../../types';

/**
 * Contract test suite for createProject Server Action.
 *
 * Tests from project-api.md contract:
 * - Valid input with client → success result with Project
 * - Valid input without client (clientId: null) → success
 * - Missing required fields → validation error
 * - End date before start date → validation error
 * - Defaults status to 'Planning' if not provided
 * - Auto-generates UUID for id
 * - Sets organizationId from auth()
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('createProject Contract Test', () => {
  /**
   * Tests that valid input with client creates project successfully.
   */
  it('should create project with valid input and client', async () => {
    const input: CreateProjectInput = {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      clientId: createClientId('550e8400-e29b-41d4-a716-446655440000'),
      status: ProjectStatus.Active,
      startDate: new Date('2025-10-15'),
      endDate: new Date('2025-12-31'),
      budget: 50000,
      notes: 'Phase 1 focus on mobile',
    };

    const result = await createProject(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBeDefined();
      expect(result.data.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
      expect(result.data.organizationId).toBeDefined();
      expect(result.data.name).toBe('Website Redesign');
      expect(result.data.description).toBe(
        'Complete overhaul of company website'
      );
      expect(result.data.clientId).toBe(input.clientId);
      expect(result.data.status).toBe(ProjectStatus.Active);
      expect(result.data.budget).toBe(50000);
      expect(result.data.createdAt).toBeInstanceOf(Date);
      expect(result.data.updatedAt).toBeInstanceOf(Date);
    }
  });

  /**
   * Tests that project can be created without client (clientId: null).
   */
  it('should create project without client (clientId null)', async () => {
    const input: CreateProjectInput = {
      name: 'Internal Tool Development',
      description: 'Build internal dashboard',
      clientId: null,
      startDate: new Date('2025-10-15'),
    };

    const result = await createProject(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe('Internal Tool Development');
      expect(result.data.clientId).toBeNull();
    }
  });

  /**
   * Tests that status defaults to 'Planning' if not provided.
   */
  it('should default status to Planning when not provided', async () => {
    const input: CreateProjectInput = {
      name: 'New Project',
      startDate: new Date('2025-10-15'),
    };

    const result = await createProject(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.status).toBe(ProjectStatus.Planning);
    }
  });

  /**
   * Tests that missing required field (name) returns validation error.
   */
  it('should return validation error for missing name', async () => {
    const input = {
      startDate: new Date('2025-10-15'),
    } as CreateProjectInput;

    const result = await createProject(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.name).toBeDefined();
    }
  });

  /**
   * Tests that missing required field (startDate) returns validation error.
   */
  it('should return validation error for missing startDate', async () => {
    const input = {
      name: 'Project Name',
    } as CreateProjectInput;

    const result = await createProject(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.startDate).toBeDefined();
    }
  });

  /**
   * Tests that endDate before startDate returns validation error.
   */
  it('should return validation error for endDate before startDate', async () => {
    const input: CreateProjectInput = {
      name: 'Project Name',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-11-01'),
    };

    const result = await createProject(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.endDate).toBeDefined();
      expect(result.error.message).toContain('greater than or equal');
    }
  });

  /**
   * Tests that timestamps are auto-generated.
   */
  it('should auto-generate createdAt and updatedAt timestamps', async () => {
    const input: CreateProjectInput = {
      name: 'Project Name',
      startDate: new Date('2025-10-15'),
    };

    const before = new Date();
    const result = await createProject(input);
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
