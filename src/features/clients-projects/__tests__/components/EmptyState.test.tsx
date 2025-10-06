/**
 * EmptyState Component Tests
 *
 * @fileoverview Tests for the EmptyState component.
 *
 * @module features/clients-projects/__tests__/components/EmptyState.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../../components/shared/EmptyState';

/**
 * Test suite for EmptyState component.
 *
 * Verifies rendering of title, description, and optional action button,
 * as well as proper event handling.
 */
describe('EmptyState', () => {
  /**
   * Tests that the component renders title and description.
   */
  it('should render title and description', () => {
    render(
      <EmptyState
        title="No clients found"
        description="Get started by creating your first client"
      />
    );

    expect(screen.getByText('No clients found')).toBeInTheDocument();
    expect(
      screen.getByText('Get started by creating your first client')
    ).toBeInTheDocument();
  });

  /**
   * Tests that the action button is rendered when provided.
   */
  it('should render action button when provided', () => {
    const mockAction = vi.fn();

    render(
      <EmptyState
        title="No clients"
        description="Create one now"
        actionLabel="Create Client"
        onAction={mockAction}
      />
    );

    expect(screen.getByRole('button', { name: 'Create Client' })).toBeInTheDocument();
  });

  /**
   * Tests that onAction callback is called when button is clicked.
   */
  it('should call onAction when button is clicked', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn();

    render(
      <EmptyState
        title="No data"
        description="No data available"
        actionLabel="Add Data"
        onAction={mockAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Add Data' });
    await user.click(button);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  /**
   * Tests that no button is rendered when actionLabel or onAction is not provided.
   */
  it('should not render action button when actionLabel is not provided', () => {
    render(<EmptyState title="Empty" description="Nothing here" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  /**
   * Tests that no button is rendered when only actionLabel is provided without onAction.
   */
  it('should not render action button when onAction is not provided', () => {
    render(
      <EmptyState
        title="Empty"
        description="Nothing here"
        actionLabel="Action"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
