/**
 * @fileoverview Tests for UserForm component
 * @module features/users/components/__tests__/user-form.test
 *
 * Test suite for user creation form component.
 * Following TDD approach: These tests are written FIRST and should FAIL initially.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserForm } from "../user-form";
import type { ReactElement } from "react";

// Mock next/navigation
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));


// Mock user mutations hook
const mockCreateMutate = vi.fn();
const mockUpdateMutate = vi.fn();
vi.mock("../../hooks/use-user-mutations", () => ({
  useCreateUser: vi.fn(() => ({
    mutate: mockCreateMutate,
    isPending: false,
  })),
  useUpdateUser: vi.fn(() => ({
    mutate: mockUpdateMutate,
    isPending: false,
  })),
}));

// Mock useUser hook for edit mode
const mockUseUser = vi.fn();
vi.mock("../../hooks/use-users", () => ({
  useUser: (...args: unknown[]) => mockUseUser(...args),
}));

/**
 * Test wrapper component with QueryClientProvider
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({
    children,
  }: {
    children: React.ReactNode;
  }): ReactElement {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Test suite for UserForm component.
 *
 * Tests form rendering, field validation, submission,
 * company matching, and inline company creation.
 */
describe("UserForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for useUser (returns null for create mode)
    mockUseUser.mockReturnValue({
      data: null,
      isLoading: false,
    });
  });

  /**
   * Tests that form renders with all required fields.
   */
  it("should render form with required fields", () => {
    render(<UserForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  /**
   * Tests that form submission creates user with valid data.
   */
  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    render(<UserForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email address/i);
    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");


    const submitButton = screen.getByRole("button", { name: /create user/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalled();
    });
  });

  /**
   * Tests that form shows validation errors for invalid data.
   */
  it("should show validation errors for invalid email", async () => {
    const user = userEvent.setup();
    render(<UserForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email address/i);
    await user.clear(emailInput);
    await user.type(emailInput, "invalid-email");

    // Blur the field to trigger validation
    await user.tab();

    const submitButton = screen.getByRole("button", { name: /create user/i });
    await user.click(submitButton);

    await waitFor(
      () => {
        // Check for validation error - the schema uses "Invalid email format"
        const errorText = screen.queryByText(/invalid email format/i);
        expect(errorText).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  /**
   * Tests form validation.
   */
  it("should validate form fields", async () => {
    const user = userEvent.setup();
    render(<UserForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "test@newcompany.com");

    await waitFor(() => {
      expect(screen.getByText(/create new company/i)).toBeInTheDocument();
    });
  });

  /**
   * Tests that form renders in edit mode with pre-filled data.
   */
  it("should render form in edit mode with pre-filled data", () => {
    const initialData = {
      email: "existing@example.com",
      full_name: "Existing User",
      role: "admin" as const,
    };

    render(<UserForm userId="user-1" initialData={initialData} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByDisplayValue("existing@example.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing User")).toBeInTheDocument();
    expect(screen.getByText(/edit user/i)).toBeInTheDocument();
  });

  /**
   * Tests that form submits update in edit mode.
   */
  it("should submit form update in edit mode", async () => {
    const user = userEvent.setup();
    const initialData = {
      email: "existing@example.com",
      full_name: "Existing User",
      role: "member" as const,
    };

    // Mock useUser to return user data for edit mode
    mockUseUser.mockReturnValue({
      data: {
        id: "user-1",
        email: "existing@example.com",
        full_name: "Existing User",
        role: "member",
        updated_at: "2024-01-01T00:00:00Z",
        created_at: "2024-01-01T00:00:00Z",
        avatar_url: null,
        bio: null,
        phone: null,
        company_email: null,
        deleted_at: null,
      },
      isLoading: false,
    });

    render(<UserForm userId="user-1" initialData={initialData} />, {
      wrapper: createWrapper(),
    });

    const submitButton = screen.getByRole("button", { name: /update user/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalled();
    });
  });
});
