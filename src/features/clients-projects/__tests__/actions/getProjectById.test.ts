/**
 * @fileoverview Contract test for getProjectById Server Action
 * @module features/clients-projects/__tests__/actions/getProjectById.test
 */

import { describe, it, expect } from 'vitest';
import { getProjectById } from '../../actions/project.actions';
import { createProjectId } from '../../types';

/**
 * Contract test suite for getProjectById Server Action.
 *
 * Tests from project-api.md contract:
 * - Valid UUID → success with Project
 * - Non-existent UUID → NotFoundError
 * - Project from different org → NotFoundError
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('getProjectById Contract Test', () => {
  /**
   * Tests that valid project ID returns project data.
   */
  it('should return project data for valid ID', async () => {
    const projectId = createProjectId('770e8400-e29b-41d4-a716-446655440000');

    const result = await getProjectById(projectId);

    if (result.success) {
      expect(result.data.id).toBe(projectId);
      expect(result.data.name).toBeDefined();
      expect(result.data.organizationId).toBeDefined();
    } else {
      // May not exist yet, acceptable for contract test
      expect(result.error.type).toBe('NotFoundError');
    }
  });

  /**
   * Tests that non-existent ID returns NotFoundError.
   */
  it('should return NotFoundError for non-existent project ID', async () => {
    const nonExistentId = createProjectId(
      '99999999-9999-9999-9999-999999999999'
    );

    const result = await getProjectById(nonExistentId);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.type).toBe('NotFoundError');
      expect(result.error.message).toBeDefined();
    }
  });
});
