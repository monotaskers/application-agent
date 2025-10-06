/**
 * ClientForm Component Tests
 *
 * @fileoverview Tests for the ClientForm component.
 *
 * @module features/clients-projects/__tests__/components/ClientForm.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientForm } from '../../components/clients/ClientForm';
import * as clientMutations from '../../hooks/use-client-mutations';
import { Client } from '../../types/client.types';
import { createClientId } from '../../types/client.types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

/**
 * Test suite for ClientForm component.
 *
 * Verifies form rendering, validation, submission, and loading states.
 */
describe('ClientForm', () => {
  let queryClient: QueryClient;
  const mockCreateMutation = {
    mutateAsync: vi.fn(),
    isPending: false,
  };
  const mockUpdateMutation = {
    mutateAsync: vi.fn(),
    isPending: false,
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.clearAllMocks();

    vi.spyOn(clientMutations, 'useClientMutations').mockReturnValue({
      createMutation: mockCreateMutation as never,
      updateMutation: mockUpdateMutation as never,
      deleteMutation: { mutateAsync: vi.fn(), isPending: false } as never,
    });
  });

  /**
   * Helper function to render ClientForm with QueryClientProvider.
   */
  function renderClientForm(
    mode: 'create' | 'edit' = 'create',
    initialData?: Client
  ) {
    return render(
      <QueryClientProvider client={queryClient}>
        <ClientForm mode={mode} initialData={initialData} />
      </QueryClientProvider>
    );
  }

  /**
   * Tests that all form fields are rendered in create mode.
   */
  it('should render all form fields in create mode', () => {
    renderClientForm('create');

    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact person/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create client/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  /**
   * Tests that validation errors are shown for invalid data.
   */
  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();
    renderClientForm('create');

    const submitButton = screen.getByRole('button', { name: /create client/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/contact person is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    });
  });

  /**
   * Tests that create mutation is called on submit in create mode.
   */
  it('should call create mutation on submit in create mode', async () => {
    const user = userEvent.setup();
    mockCreateMutation.mutateAsync.mockResolvedValue({
      success: true,
      data: {
        id: createClientId('test-id'),
        companyName: 'Acme Corp',
      },
    });

    renderClientForm('create');

    await user.type(screen.getByLabelText(/company name/i), 'Acme Corp');
    await user.type(screen.getByLabelText(/contact person/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@acme.com');
    await user.type(screen.getByLabelText(/phone/i), '555-1234');

    const submitButton = screen.getByRole('button', { name: /create client/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: 'Acme Corp',
          contactPerson: 'John Doe',
          email: 'john@acme.com',
          phone: '555-1234',
        })
      );
    });
  });

  /**
   * Tests that update mutation is called on submit in edit mode.
   */
  it('should call update mutation on submit in edit mode', async () => {
    const user = userEvent.setup();
    const initialData: Client = {
      id: createClientId('client-1'),
      organizationId: 'org-1',
      companyName: 'Acme Corp',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '555-1234',
      address: '123 Main St',
      notes: 'Important client',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUpdateMutation.mutateAsync.mockResolvedValue({
      success: true,
      data: initialData,
    });

    renderClientForm('edit', initialData);

    const companyNameInput = screen.getByLabelText(/company name/i);
    await user.clear(companyNameInput);
    await user.type(companyNameInput, 'Updated Corp');

    const submitButton = screen.getByRole('button', { name: /update client/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledWith({
        id: initialData.id,
        data: expect.objectContaining({
          companyName: 'Updated Corp',
        }),
      });
    });
  });

  /**
   * Tests that initial data is populated in edit mode.
   */
  it('should populate initial data in edit mode', () => {
    const initialData: Client = {
      id: createClientId('client-1'),
      organizationId: 'org-1',
      companyName: 'Acme Corp',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '555-1234',
      address: '123 Main St',
      notes: 'Important client',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    renderClientForm('edit', initialData);

    expect(screen.getByLabelText(/company name/i)).toHaveValue('Acme Corp');
    expect(screen.getByLabelText(/contact person/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@acme.com');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('555-1234');
    expect(screen.getByLabelText(/address/i)).toHaveValue('123 Main St');
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Important client');
  });

  /**
   * Tests that submit button is disabled during submission.
   */
  it('should show loading state during submission', () => {
    vi.spyOn(clientMutations, 'useClientMutations').mockReturnValue({
      createMutation: { ...mockCreateMutation, isPending: true } as never,
      updateMutation: mockUpdateMutation as never,
      deleteMutation: { mutateAsync: vi.fn(), isPending: false } as never,
    });

    renderClientForm('create');

    const submitButton = screen.getByRole('button', { name: /create client/i });
    expect(submitButton).toBeDisabled();
  });
});
