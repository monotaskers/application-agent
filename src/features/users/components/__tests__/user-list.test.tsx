/**
 * @fileoverview Tests for UserList component
 * @module features/users/components/__tests__/user-list.test
 *
 * Test suite for user list component with infinite scroll.
 * Following TDD approach: These tests are written FIRST and should FAIL initially.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { UserList } from "../user-list";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useUserSearch hook
vi.mock("../../hooks/use-user-search", () => ({
  useUserSearch: () => ["", vi.fn()],
}));

// Mock nuqs
vi.mock("nuqs", () => ({
  useQueryState: vi.fn((_key: string, options?: { defaultValue: unknown }) => {
    const defaultValue = options?.defaultValue ?? "";
    return [defaultValue, vi.fn()];
  }),
}));

// Mock useUsers hook
const mockUseUsers = vi.fn();
vi.mock("../../hooks/use-users", () => ({
  useUsers: (...args: unknown[]) => mockUseUsers(...args),
}));

/**
 * Test wrapper with QueryClient
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
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
 * Test suite for UserList component.
 *
 * Tests user list rendering, infinite scroll, loading states,
 * error states, and empty states.
 */
describe("UserList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that user list renders users correctly.
   */
  it("should render list of users", async () => {
    const mockUsers = [
      {
        id: "user-1",
        email: "user1@example.com",
        full_name: "User One",
        role: "member" as const,
        deleted_at: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        avatar_url: null,
        bio: null,
        phone: null,
        company_email: null,
      },
      {
        id: "user-2",
        email: "user2@example.com",
        full_name: "User Two",
        role: "admin" as const,
        deleted_at: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        avatar_url: null,
        bio: null,
        phone: null,
        company_email: null,
      },
    ];

    mockUseUsers.mockReturnValue({
      data: {
        pages: [
          {
            users: mockUsers,
            pagination: {
              offset: 0,
              limit: 20,
              total: 2,
              has_next: false,
            },
          },
        ],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<UserList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("User One")).toBeInTheDocument();
      expect(screen.getByText("User Two")).toBeInTheDocument();
    });
  });

  /**
   * Tests that loading state is displayed.
   */
  it("should display loading state", () => {
    mockUseUsers.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    const { container } = render(<UserList />, { wrapper: createWrapper() });

    // Loading state shows skeleton components, check for data-slot attribute
    const loadingContainer = container.querySelector(
      '[data-slot="user-list-loading"]'
    );
    expect(loadingContainer).toBeInTheDocument();

    // Check for skeleton components using data-slot attribute
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  /**
   * Tests that error state is displayed.
   */
  it("should display error state", () => {
    mockUseUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch users"),
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  /**
   * Tests that empty state is displayed when no users.
   */
  it("should display empty state when no users", () => {
    mockUseUsers.mockReturnValue({
      data: {
        pages: [
          {
            users: [],
            pagination: {
              offset: 0,
              limit: 20,
              total: 0,
              has_next: false,
            },
          },
        ],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  /**
   * Tests that infinite scroll triggers fetchNextPage.
   */
  it("should trigger fetchNextPage on scroll near bottom", async () => {
    const mockFetchNextPage = vi.fn();

    mockUseUsers.mockReturnValue({
      data: {
        pages: [
          {
            users: Array(20)
              .fill(null)
              .map((_, i) => ({
                id: `user-${i}`,
                email: `user${i}@example.com`,
                full_name: `User ${i}`,
                role: "member" as const,
                company_id: null,
                company: null,
                deleted_at: null,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
                avatar_url: null,
                bio: null,
                phone: null,
                company_email: null,
              })),
            pagination: {
              offset: 0,
              limit: 20,
              total: 25,
              has_next: true,
            },
          },
        ],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    const { container } = render(<UserList />, { wrapper: createWrapper() });

    // Find the scroll container by data-slot attribute
    const listContainer = container.querySelector(
      '[data-slot="user-list"]'
    ) as HTMLElement;
    if (!listContainer) {
      throw new Error("Container not found");
    }

    // Simulate scroll near bottom by triggering scroll event
    Object.defineProperty(listContainer, "scrollTop", {
      value: 1000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(listContainer, "scrollHeight", {
      value: 1200,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(listContainer, "clientHeight", {
      value: 200,
      writable: true,
      configurable: true,
    });

    // Trigger scroll event
    listContainer.dispatchEvent(new Event("scroll", { bubbles: true }));

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  /**
   * Tests that deleted users are marked with deleted indicator.
   */
  it("should display deleted indicator for soft-deleted users", () => {
    const mockUsers = [
      {
        id: "user-1",
        email: "user1@example.com",
        full_name: "User One",
        role: "member" as const,
        deleted_at: "2024-01-15T00:00:00Z",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        avatar_url: null,
        bio: null,
        phone: null,
        company_email: null,
      },
    ];

    mockUseUsers.mockReturnValue({
      data: {
        pages: [
          {
            users: mockUsers,
            pagination: {
              offset: 0,
              limit: 20,
              total: 1,
              has_next: false,
            },
          },
        ],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText(/deleted/i)).toBeInTheDocument();
  });
});
