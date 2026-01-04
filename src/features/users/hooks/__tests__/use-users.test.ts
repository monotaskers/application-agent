/**
 * @fileoverview Tests for useUsers hook
 * @module features/users/hooks/__tests__/use-users.test
 *
 * Test suite for user list hook with infinite scroll pagination.
 * Following TDD approach: These tests are written FIRST and should FAIL initially.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useUsers, useUser } from "../use-users";

// Mock fetch for API calls
global.fetch = vi.fn();

/**
 * Test wrapper component with QueryClientProvider
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

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
  return Wrapper;
}

/**
 * Test suite for useUsers hook.
 *
 * Tests infinite query setup, data fetching, loading states,
 * error states, pagination, search, filters, and deleted users toggle.
 */
describe("useUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that users are fetched on mount.
   */
  it("should fetch users on mount", async () => {
    const mockResponse = {
      users: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
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
      ],
      pagination: {
        offset: 0,
        limit: 20,
        total: 1,
        has_next: false,
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useUsers({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/users")
    );
  });

  /**
   * Tests that search parameter is included in API call.
   */
  it("should include search parameter in API call", async () => {
    const mockResponse = {
      users: [],
      pagination: {
        offset: 0,
        limit: 20,
        total: 0,
        has_next: false,
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    renderHook(() => useUsers({ search: "john" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("search=john")
      );
    });
  });

  /**
   * Tests that role filter is included in API call.
   */
  it("should include role filter in API call", async () => {
    const mockResponse = {
      users: [],
      pagination: {
        offset: 0,
        limit: 20,
        total: 0,
        has_next: false,
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    renderHook(() => useUsers({ role: "admin" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("role=admin")
      );
    });
  });


  /**
   * Tests that infinite scroll pagination works correctly.
   */
  it("should support infinite scroll pagination", async () => {
    // Generate valid UUIDs for users
    const generateUUID = (index: number): string => {
      // Simple UUID v4 generator for testing
      const hex = index.toString(16).padStart(8, "0");
      return `550e8400-e29b-41d4-a716-${hex}00000000`.substring(0, 36);
    };

    const firstPageResponse = {
      users: Array(20)
        .fill(null)
        .map((_, i) => ({
          id: generateUUID(i),
          email: `user${i}@example.com`,
          full_name: `User ${i}`,
          role: "member" as const,
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
    };

    const secondPageResponse = {
      users: Array(5)
        .fill(null)
        .map((_, i) => ({
          id: generateUUID(i + 20),
          email: `user${i + 20}@example.com`,
          full_name: `User ${i + 20}`,
          role: "member" as const,
          deleted_at: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          avatar_url: null,
          bio: null,
          phone: null,
          company_email: null,
        })),
      pagination: {
        offset: 20,
        limit: 20,
        total: 25,
        has_next: false,
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => firstPageResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => secondPageResponse,
      });

    const { result } = renderHook(() => useUsers({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.isSuccess).toBe(true);

    // Fetch next page
    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
      expect(result.current.data?.pages[1]).toEqual(secondPageResponse);
    });
  });

  /**
   * Tests that deleted users toggle is included in API call.
   */
  it("should include deleted users when include_deleted is true", async () => {
    const mockResponse = {
      users: [],
      pagination: {
        offset: 0,
        limit: 20,
        total: 0,
        has_next: false,
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    renderHook(() => useUsers({ include_deleted: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("include_deleted=true")
      );
    });
  });

  /**
   * Tests that loading state is handled correctly.
   */
  it("should handle loading state", () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useUsers({}), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
  });

  /**
   * Tests that error state is handled correctly.
   */
  it("should handle error state", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
      }),
    });

    const { result } = renderHook(() => useUsers({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

/**
 * Test suite for useUser hook.
 *
 * Tests single user fetching, loading states, error states, and caching.
 */
describe("useUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that user is fetched when userId is provided.
   */
  it("should fetch user when userId is provided", async () => {
    const mockUser = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "test@example.com",
      full_name: "Test User",
      role: "member" as const,
      deleted_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      avatar_url: null,
      bio: null,
      phone: null,
      company_email: null,
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const { result } = renderHook(
      () => useUser("550e8400-e29b-41d4-a716-446655440000"),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(mockUser);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/users/550e8400-e29b-41d4-a716-446655440000"
    );
  });

  /**
   * Tests that user is not fetched when userId is null.
   */
  it("should not fetch user when userId is null", () => {
    const { result } = renderHook(() => useUser(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  /**
   * Tests that error is handled when user fetch fails.
   */
  it("should handle error when user fetch fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Failed to fetch user")
    );

    const { result } = renderHook(
      () => useUser("550e8400-e29b-41d4-a716-446655440000"),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  /**
   * Tests that 404 error is handled when user not found.
   */
  it("should handle 404 error when user not found", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        error: "NOT_FOUND",
        message: "User not found",
      }),
    });

    const { result } = renderHook(
      () => useUser("7c9e6679-7425-40de-944b-e07fc1f90ae7"),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });
});
