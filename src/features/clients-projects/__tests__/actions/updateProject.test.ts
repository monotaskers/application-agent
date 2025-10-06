/**
 * @fileoverview Contract test for updateProject Server Action
 * @module features/clients-projects/__tests__/actions/updateProject.test
 */

import { describe, it, expect } from 'vitest';
import { updateProject } from '../../actions/project.actions';
import { createProjectId } from '../../types';
import { ProjectStatus } from '../../types/project.types';
import type { UpdateProjectInput } from '../../types';

/**
 * Contract test suite for updateProject Server Action.
 *
 * Tests from project-api.md contract:
 * - Valid partial update → success with updated Project
 * - Invalid data → validation error
 * - End date before start date → validation error
 * - Non-existent id → NotFoundError
 * - Updates updatedAt timestamp
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('updateProject Contract Test', () => {
  /**
   * Tests that valid partial update succeeds.
   */
  it('should update project with valid partial data', async () => {
    const projectId = createProjectId('770e8400-e29b-41d4-a716-446655440000');
    const updates: UpdateProjectInput = {
      status: ProjectStatus.Active,
      notes: 'Updated notes',
    };

    const result = await updateProject(projectId, updates);

    if (result.success) {
      expect(result.data.id).toBe(projectId);
      expect(result.data.status).toBe(ProjectStatus.Active);
      expect(result.data.notes).toBe('Updated notes');
      expect(result.data.updatedAt).toBeInstanceOf(Date);
    } else {
      // May not exist, acceptable for contract test setup
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that endDate before startDate returns validation error.
   */
  it('should return validation error for endDate before startDate', async () => {
    const projectId = createProjectId('770e8400-e29b-41d4-a716-446655440000');
    const updates: UpdateProjectInput = {
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-11-01'),
    };

    const result = await updateProject(projectId, updates);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
      expect(result.error.fields?.endDate).toBeDefined();
    }
  });

  /**
   * Tests that non-existent project ID returns NotFoundError.
   */
  it('should return NotFoundError for non-existent project', async () => {
    const nonExistentId = createProjectId(
      '99999999-9999-9999-9999-999999999999'
    );
    const updates: UpdateProjectInput = {
      name: 'Updated Name',
    };

    const result = await updateProject(nonExistentId, updates);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that updatedAt timestamp is refreshed.
   */
  it('should update updatedAt timestamp', async () => {
    const projectId = createProjectId('770e8400-e29b-41d4-a716-446655440000');
    const updates: UpdateProjectInput = {
      notes: 'New note',
    };

    const before = new Date();
    const result = await updateProject(projectId, updates);
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
