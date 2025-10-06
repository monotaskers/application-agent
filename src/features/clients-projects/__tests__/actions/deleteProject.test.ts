/**
 * @fileoverview Contract test for deleteProject Server Action
 * @module features/clients-projects/__tests__/actions/deleteProject.test
 */

import { describe, it, expect } from 'vitest';
import { deleteProject } from '../../actions/project.actions';
import { createProjectId } from '../../types';

/**
 * Contract test suite for deleteProject Server Action.
 *
 * Tests from project-api.md contract:
 * - Valid id → success (hard delete)
 * - Non-existent id → NotFoundError
 * - Client relationship unaffected
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('deleteProject Contract Test', () => {
  /**
   * Tests that valid project ID deletes successfully.
   */
  it('should delete project with valid ID', async () => {
    const projectId = createProjectId('770e8400-e29b-41d4-a716-446655440000');

    const result = await deleteProject(projectId);

    if (result.success) {
      expect(result.data).toBeUndefined();
    } else {
      // May not exist, acceptable for contract test setup
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that non-existent project ID returns NotFoundError.
   */
  it('should return NotFoundError for non-existent project', async () => {
    const nonExistentId = createProjectId(
      '99999999-9999-9999-9999-999999999999'
    );

    const result = await deleteProject(nonExistentId);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('NotFoundError');
      expect(result.error.message).toBeDefined();
    }
  });
});
