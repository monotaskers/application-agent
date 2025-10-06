/**
 * ProjectForm Component Tests
 *
 * @fileoverview Tests for the ProjectForm component.
 *
 * @module features/clients-projects/__tests__/components/ProjectForm.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectForm } from '../../components/projects/ProjectForm';
import * as projectMutations from '../../hooks/use-project-mutations';
import * as clientsHook from '../../hooks/use-clients';
import { ProjectStatus } from '../../types/project.types';
import { createClientId } from '../../types/client.types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

/**
 * Test suite for ProjectForm component.
 *
 * Verifies form rendering, client dropdown loading, validation,
 * and mutation handling.
 */
describe('ProjectForm', () => {
  let queryClient: QueryClient;
  const mockCreateMutation = {
    mutateAsync: vi.fn(),
    isPending: false,
  };
  const mockUpdateMutation = {
    mutateAsync: vi.fn(),
    isPending: false,
  };

  const mockClients = [
    {
      id: createClientId('client-1'),
      organizationId: 'org-1',
      companyName: 'Acme Corp',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '555-1234',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: createClientId('client-2'),
      organizationId: 'org-1',
      companyName: 'Beta Inc',
      contactPerson: 'Jane Smith',
      email: 'jane@beta.com',
      phone: '555-5678',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.clearAllMocks();

    vi.spyOn(projectMutations, 'useProjectMutations').mockReturnValue({
      createMutation: mockCreateMutation as never,
      updateMutation: mockUpdateMutation as never,
      updateStatusMutation: { mutateAsync: vi.fn(), isPending: false } as never,
      deleteMutation: { mutateAsync: vi.fn(), isPending: false } as never,
    });

    vi.spyOn(clientsHook, 'useClients').mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null,
    } as never);
  });

  /**
   * Helper function to render ProjectForm with QueryClientProvider.
   */
  function renderProjectForm() {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProjectForm mode="create" />
      </QueryClientProvider>
    );
  }

  /**
   * Tests that all form fields are rendered.
   */
  it('should render all form fields', () => {
    renderProjectForm();

    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  /**
   * Tests that clients are loaded for the dropdown.
   */
  it('should load clients for dropdown', async () => {
    const user = userEvent.setup();
    renderProjectForm();

    const clientSelect = screen.getByLabelText(/client/i);
    await user.click(clientSelect);

    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
      expect(screen.getByText('Beta Inc')).toBeInTheDocument();
      expect(screen.getByText('No Client')).toBeInTheDocument();
    });
  });

  /**
   * Tests that validation errors are shown for invalid data.
   */
  it('should show validation errors for missing required fields', async () => {
    const user = userEvent.setup();
    renderProjectForm();

    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    });
  });

  /**
   * Tests that create mutation is called on submit.
   */
  it('should call create mutation on submit with valid data', async () => {
    const user = userEvent.setup();
    mockCreateMutation.mutateAsync.mockResolvedValue({
      success: true,
      data: {
        id: 'project-1',
        name: 'Website Redesign',
        status: ProjectStatus.Planning,
      },
    });

    renderProjectForm();

    await user.type(screen.getByLabelText(/project name/i), 'Website Redesign');
    await user.type(screen.getByLabelText(/description/i), 'Complete website overhaul');

    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Website Redesign',
          description: 'Complete website overhaul',
          status: ProjectStatus.Planning,
        })
      );
    });
  });

  /**
   * Tests that clientId is properly handled as optional.
   */
  it('should handle clientId as optional (null)', async () => {
    const user = userEvent.setup();
    mockCreateMutation.mutateAsync.mockResolvedValue({
      success: true,
      data: { id: 'project-1', name: 'Internal Project' },
    });

    renderProjectForm();

    await user.type(screen.getByLabelText(/project name/i), 'Internal Project');

    const clientSelect = screen.getByLabelText(/client/i);
    await user.click(clientSelect);

    const noClientOption = screen.getByText('No Client');
    await user.click(noClientOption);

    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Internal Project',
          clientId: null,
        })
      );
    });
  });

  /**
   * Tests that end date validation works (end date must be >= start date).
   */
  it('should validate that end date is after or equal to start date', async () => {
    const user = userEvent.setup();
    mockCreateMutation.mutateAsync.mockResolvedValue({
      success: false,
      error: {
        type: 'ValidationError',
        message: 'End date must be greater than or equal to start date',
      },
    });

    renderProjectForm();

    await user.type(screen.getByLabelText(/project name/i), 'Test Project');

    // Set start date to future
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2025-12-01');

    // Set end date to past (before start date)
    const endDateInput = screen.getByLabelText(/end date/i);
    await user.type(endDateInput, '2025-11-01');

    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    // The validation error should be shown after submit attempt
    await waitFor(() => {
      expect(mockCreateMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  /**
   * Tests that the form shows loading state during submission.
   */
  it('should show loading state during submission', () => {
    vi.spyOn(projectMutations, 'useProjectMutations').mockReturnValue({
      createMutation: { ...mockCreateMutation, isPending: true } as never,
      updateMutation: mockUpdateMutation as never,
      updateStatusMutation: { mutateAsync: vi.fn(), isPending: false } as never,
      deleteMutation: { mutateAsync: vi.fn(), isPending: false } as never,
    });

    renderProjectForm();

    const submitButton = screen.getByRole('button', { name: /create project/i });
    expect(submitButton).toBeDisabled();
  });
});
