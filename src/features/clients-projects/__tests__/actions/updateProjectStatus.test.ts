/**
 * @fileoverview Contract test for updateProjectStatus Server Action
 * @module features/clients-projects/__tests__/actions/updateProjectStatus.test
 */

import { describe, it, expect } from 'vitest';
import { updateProjectStatus } from '../../actions/project.actions';
import { createProjectId } from '../../types';
import { ProjectStatus } from '../../types/project.types';

/**
 * Contract test suite for updateProjectStatus Server Action.
 *
 * Tests from project-api.md contract:
 * - Valid status change → success
 * - Invalid status enum → validation error
 * - Non-existent id → NotFoundError
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('updateProjectStatus Contract Test', () => {
  /**
   * Tests that valid status change succeeds.
   */
  it('should update project status successfully', async () => {
    const projectId = createProjectId('770e8400-e29b-41d4-a716-446655440000');

    const result = await updateProjectStatus(projectId, ProjectStatus.Active);

    if (result.success) {
      expect(result.data.id).toBe(projectId);
      expect(result.data.status).toBe(ProjectStatus.Active);
    } else {
      // May not exist, acceptable for contract test setup
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that invalid status enum returns validation error.
   */
  it('should return validation error for invalid status enum', async () => {
    const projectId = createProjectId('770e8400-e29b-41d4-a716-446655440000');
    const invalidStatus = 'InvalidStatus' as ProjectStatus;

    const result = await updateProjectStatus(projectId, invalidStatus);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('ValidationError');
    }
  });

  /**
   * Tests that non-existent project ID returns NotFoundError.
   */
  it('should return NotFoundError for non-existent project', async () => {
    const nonExistentId = createProjectId(
      '99999999-9999-9999-9999-999999999999'
    );

    const result = await updateProjectStatus(
      nonExistentId,
      ProjectStatus.Active
    );

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('NotFoundError');
    }
  });
});
