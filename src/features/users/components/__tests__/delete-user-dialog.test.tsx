/**
 * @fileoverview Tests for DeleteUserDialog component
 * @module features/users/components/__tests__/delete-user-dialog.test
 *
 * Test suite for delete user confirmation dialog component.
 * Following TDD approach: These tests are written FIRST and should FAIL initially.
 *
 * Coverage:
 * - Dialog rendering
 * - User information display
 * - Confirmation and cancellation
 * - Delete mutation integration
 * - Loading states
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { DeleteUserDialog } from "../delete-user-dialog";
import type { User } from "../../types/user.types";

// Test UUIDs for consistent test data
const TEST_USER_ID = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

// Mock useDeleteUser hook
const mockMutate = vi.fn();
const mockUseDeleteUser = vi.fn(
  (): {
    mutate: typeof mockMutate;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
  } => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
    error: null,
  })
);
vi.mock("../../hooks/use-user-mutations", () => ({
  useDeleteUser: () => mockUseDeleteUser(),
}));

/**
 * Test wrapper with QueryClient
 */
function createWrapper(): ({ children }: { children: ReactNode }) => ReactNode {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }): ReactNode => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";

  return Wrapper;
}

/**
 * Test suite for DeleteUserDialog component.
 *
 * Tests dialog rendering, user confirmation, and delete mutation.
 */
describe("DeleteUserDialog", () => {
  const mockUser: User = {
    id: TEST_USER_ID,
    email: "test@example.com",
    full_name: "Test User",
    role: "member",
    deleted_at: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    avatar_url: null,
    bio: null,
    phone: null,
    company_email: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDeleteUser.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  /**
   * Tests that dialog renders when open.
   */
  it("should render dialog when open", () => {
    render(
      <DeleteUserDialog user={mockUser} open={true} onOpenChange={vi.fn()} />,
      { wrapper: createWrapper() }
    );

    expect(
      screen.getByRole("alertdialog", { name: /delete user/i })
    ).toBeInTheDocument();
  });

  /**
   * Tests that dialog does not render when closed.
   */
  it("should not render dialog when closed", () => {
    render(
      <DeleteUserDialog user={mockUser} open={false} onOpenChange={vi.fn()} />,
      { wrapper: createWrapper() }
    );

    expect(
      screen.queryByRole("alertdialog", { name: /delete user/i })
    ).not.toBeInTheDocument();
  });

  /**
   * Tests that user information is displayed in dialog.
   */
  it("should display user information in dialog", () => {
    render(
      <DeleteUserDialog user={mockUser} open={true} onOpenChange={vi.fn()} />,
      { wrapper: createWrapper() }
    );

    // Check for user name or email in the dialog description
    expect(screen.getByText(/test user|test@example.com/i)).toBeInTheDocument();
  });

  /**
   * Tests that cancel button closes dialog.
   */
  it("should call onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={onOpenChange}
      />,
      { wrapper: createWrapper() }
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  /**
   * Tests that confirm button triggers delete mutation.
   */
  it("should call delete mutation when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={onOpenChange}
      />,
      { wrapper: createWrapper() }
    );

    const confirmButton = screen.getByRole("button", {
      name: /delete user/i,
    });
    await user.click(confirmButton);

    expect(mockMutate).toHaveBeenCalledWith(
      TEST_USER_ID,
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  /**
   * Tests that delete button is disabled during deletion.
   */
  it("should disable delete button during deletion", () => {
    mockUseDeleteUser.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    });

    render(
      <DeleteUserDialog user={mockUser} open={true} onOpenChange={vi.fn()} />,
      { wrapper: createWrapper() }
    );

    // When pending, button text changes to "Deleting..."
    const confirmButton = screen.getByRole("button", {
      name: /deleting/i,
    });
    expect(confirmButton).toBeDisabled();
  });

  /**
   * Tests that cancel button is disabled during deletion.
   */
  it("should disable cancel button during deletion", () => {
    mockUseDeleteUser.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    });

    render(
      <DeleteUserDialog user={mockUser} open={true} onOpenChange={vi.fn()} />,
      { wrapper: createWrapper() }
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeDisabled();
  });

  /**
   * Tests that error message is displayed when deletion fails.
   */
  it("should display error message when deletion fails", () => {
    const errorMessage = "Failed to delete user";
    mockUseDeleteUser.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: new Error(errorMessage),
    } as ReturnType<typeof mockUseDeleteUser>);

    render(
      <DeleteUserDialog user={mockUser} open={true} onOpenChange={vi.fn()} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(new RegExp(errorMessage, "i"))).toBeInTheDocument();
  });
});
