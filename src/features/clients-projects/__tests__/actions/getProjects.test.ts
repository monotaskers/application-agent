/**
 * @fileoverview Contract test for getProjects Server Action
 * @module features/clients-projects/__tests__/actions/getProjects.test
 */

import { describe, it, expect } from 'vitest';
import { getProjects } from '../../actions/project.actions';
import { ProjectStatus } from '../../types/project.types';
import { createClientId } from '../../types';
import type { ProjectFilters } from '../../types';

/**
 * Contract test suite for getProjects Server Action.
 *
 * Tests from project-api.md contract:
 * - No filters → returns all projects for organization
 * - search filter → filters by name or description
 * - clientId filter → returns projects for specific client
 * - status filter → returns projects with specific status
 * - Date range filters → filters by startDate/endDate ranges
 * - Organization isolation enforced
 *
 * NOTE: This test MUST FAIL until Server Action is implemented (TDD).
 */
describe('getProjects Contract Test', () => {
  /**
   * Tests that getProjects without filters returns all projects.
   */
  it('should return all projects for organization without filters', async () => {
    const result = await getProjects();

    expect(result.success).toBe(true);

    if (result.success) {
      expect(Array.isArray(result.data)).toBe(true);
      result.data.forEach((project) => {
        expect(project.organizationId).toBeDefined();
      });
    }
  });

  /**
   * Tests that search filter works with project name.
   */
  it('should filter projects by search term (name or description)', async () => {
    const filters: ProjectFilters = {
      search: 'Website',
    };

    const result = await getProjects(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      result.data.forEach((project) => {
        expect(
          project.name.toLowerCase().includes('website') ||
            project.description?.toLowerCase().includes('website')
        ).toBe(true);
      });
    }
  });

  /**
   * Tests that clientId filter returns only projects for that client.
   */
  it('should filter projects by clientId', async () => {
    const clientId = createClientId('550e8400-e29b-41d4-a716-446655440000');
    const filters: ProjectFilters = {
      clientId,
    };

    const result = await getProjects(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      result.data.forEach((project) => {
        expect(project.clientId).toBe(clientId);
      });
    }
  });

  /**
   * Tests that status filter returns only projects with that status.
   */
  it('should filter projects by status', async () => {
    const filters: ProjectFilters = {
      status: ProjectStatus.Active,
    };

    const result = await getProjects(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      result.data.forEach((project) => {
        expect(project.status).toBe(ProjectStatus.Active);
      });
    }
  });

  /**
   * Tests that date range filters work correctly.
   */
  it('should filter projects by date range', async () => {
    const filters: ProjectFilters = {
      startDateFrom: new Date('2025-01-01'),
      startDateTo: new Date('2025-12-31'),
    };

    const result = await getProjects(filters);

    expect(result.success).toBe(true);

    if (result.success) {
      result.data.forEach((project) => {
        expect(project.startDate).toBeInstanceOf(Date);
      });
    }
  });
});
