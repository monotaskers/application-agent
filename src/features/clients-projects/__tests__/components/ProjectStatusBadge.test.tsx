/**
 * ProjectStatusBadge Component Tests
 *
 * @fileoverview Tests for the ProjectStatusBadge component.
 *
 * @module features/clients-projects/__tests__/components/ProjectStatusBadge.test
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectStatusBadge } from '../../components/projects/ProjectStatusBadge';
import { ProjectStatus } from '../../types/project.types';

/**
 * Test suite for ProjectStatusBadge component.
 *
 * Verifies correct rendering and styling for each project status.
 */
describe('ProjectStatusBadge', () => {
  /**
   * Tests that Planning status renders with correct text and color.
   */
  it('should render Planning status with blue color', () => {
    render(<ProjectStatusBadge status={ProjectStatus.Planning} />);

    const badge = screen.getByText('Planning');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });

  /**
   * Tests that Active status renders with correct text and color.
   */
  it('should render Active status with green color', () => {
    render(<ProjectStatusBadge status={ProjectStatus.Active} />);

    const badge = screen.getByText('Active');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  /**
   * Tests that OnHold status renders with correct text and color.
   */
  it('should render OnHold status with yellow color', () => {
    render(<ProjectStatusBadge status={ProjectStatus.OnHold} />);

    const badge = screen.getByText('On Hold');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
  });

  /**
   * Tests that Completed status renders with correct text and color.
   */
  it('should render Completed status with gray color', () => {
    render(<ProjectStatusBadge status={ProjectStatus.Completed} />);

    const badge = screen.getByText('Completed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
  });

  /**
   * Tests that Cancelled status renders with correct text and color.
   */
  it('should render Cancelled status with red color', () => {
    render(<ProjectStatusBadge status={ProjectStatus.Cancelled} />);

    const badge = screen.getByText('Cancelled');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  /**
   * Tests that the badge uses the Badge component from Shadcn/UI.
   */
  it('should use Shadcn/UI Badge component styles', () => {
    const { container } = render(
      <ProjectStatusBadge status={ProjectStatus.Active} />
    );

    const badge = container.querySelector('.inline-flex');
    expect(badge).toBeInTheDocument();
  });

  /**
   * Tests that status text is properly formatted (e.g., "OnHold" -> "On Hold").
   */
  it('should display status text correctly formatted', () => {
    render(<ProjectStatusBadge status={ProjectStatus.OnHold} />);
    expect(screen.getByText('On Hold')).toBeInTheDocument();
  });
});
