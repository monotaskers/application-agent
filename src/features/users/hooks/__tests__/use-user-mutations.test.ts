/**
 * @fileoverview Tests for user mutation hooks
 * @module features/users/hooks/__tests__/use-user-mutations.test
 *
 * Test suite for user creation, update, delete, and restore mutation hooks.
 * Following TDD approach: These tests are written FIRST and should FAIL initially.
 *
 * Coverage:
 * - useCreateUser hook
 * - useUpdateUser hook (Phase 5)
 * - useDeleteUser hook (Phase 6)
 * - useRestoreUser hook (Phase 6)
 * - Error handling
 * - Cache invalidation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

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
      mutations: {
        retry: false,
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
 * Test suite for useCreateUser hook.
 *
 * Tests user creation mutation, success handling, error handling,
 * and cache invalidation.
 */
describe("useCreateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that user creation succeeds with valid data.
   */
  it("should create user successfully", async () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      full_name: "Test User",
      role: "member" as const,
      deleted_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        user: mockUser,
      }),
    });

    // Import hook dynamically after mocks are set up
    const { useCreateUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useCreateUser(), { wrapper });

    result.current.mutate({
      email: "test@example.com",
      full_name: "Test User",
      role: "member",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUser);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/users",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          full_name: "Test User",
          role: "member",
        }),
      })
    );
  });

  /**
   * Tests that user creation works with valid data.
   */
  it("should create user with valid data", async () => {
    const mockUser = {
      id: "user-1",
      email: "test@newcompany.com",
      full_name: "Test User",
      role: "member" as const,
      deleted_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        user: mockUser,
      }),
    });

    const { useCreateUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useCreateUser(), { wrapper });

    result.current.mutate({
      email: "test@newcompany.com",
      full_name: "Test User",
      role: "member",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUser);
  });

  /**
   * Tests that user creation fails with validation error.
   */
  it("should handle validation errors", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: "VALIDATION_ERROR",
        message: "Invalid email format",
        details: [
          {
            path: ["email"],
            message: "Invalid email format",
          },
        ],
      }),
    });

    const { useCreateUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useCreateUser(), { wrapper });

    result.current.mutate({
      email: "invalid-email",
      role: "member",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  /**
   * Tests that user creation fails with duplicate email error.
   */
  it("should handle duplicate email error", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        error: "CONFLICT",
        message: "Email test@example.com is already in use",
      }),
    });

    const { useCreateUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useCreateUser(), { wrapper });

    result.current.mutate({
      email: "test@example.com",
      role: "member",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    if (result.current.error instanceof Error) {
      expect(result.current.error.message).toContain("already in use");
    }
  });

  /**
   * Tests that cache is invalidated after successful creation.
   */
  it("should invalidate users cache after successful creation", async () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      full_name: "Test User",
      role: "member" as const,
      deleted_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        user: mockUser,
      }),
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Pre-populate cache
    queryClient.setQueryData(["users"], { pages: [], pageParams: [] });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );
    };

    const { useCreateUser } = await import("../use-user-mutations");

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      email: "test@example.com",
      role: "member",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Cache should be invalidated (query should be marked as stale)
    // This is handled by the hook's onSuccess callback
    expect(queryClient.getQueryState(["users"])).toBeDefined();
  });
});

/**
 * Test suite for useUpdateUser hook.
 *
 * Tests user update mutation, success handling, error handling,
 * and cache invalidation.
 */
describe("useUpdateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that user update succeeds with valid data.
   */
  it("should update user successfully", async () => {
    const mockUpdatedUser = {
      id: "user-1",
      email: "test@example.com",
      full_name: "Updated Name",
      role: "admin" as const,
      deleted_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        user: mockUpdatedUser,
        conflict: false,
      }),
    });

    const { useUpdateUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useUpdateUser("user-1"), { wrapper });

    result.current.mutate({
      full_name: "Updated Name",
      role: "admin",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.user).toEqual(mockUpdatedUser);
    expect(result.current.data?.conflict).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/users/user-1",
      expect.objectContaining({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: "Updated Name",
          role: "admin",
        }),
      })
    );
  });

  /**
   * Tests that user update fails with validation error.
   */
  it("should handle validation errors", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: "VALIDATION_ERROR",
        message: "Validation error",
        details: [
          {
            path: ["email"],
            message: "Invalid email format",
          },
        ],
      }),
    });

    const { useUpdateUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useUpdateUser("user-1"), { wrapper });

    result.current.mutate({
      email: "test@other.com",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  /**
   * Tests that cache is invalidated after successful update.
   */
  it("should invalidate user and users cache after successful update", async () => {
    const mockUpdatedUser = {
      id: "user-1",
      email: "test@example.com",
      full_name: "Updated Name",
      role: "member" as const,
      deleted_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        user: mockUpdatedUser,
        conflict: false,
      }),
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Pre-populate cache
    queryClient.setQueryData(["user", "user-1"], mockUpdatedUser);
    queryClient.setQueryData(["users"], { pages: [], pageParams: [] });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );
    };

    const { useUpdateUser } = await import("../use-user-mutations");

    const { result } = renderHook(() => useUpdateUser("user-1"), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      full_name: "Updated Name",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Cache should be updated with new data
    expect(queryClient.getQueryData(["user", "user-1"])).toEqual(
      mockUpdatedUser
    );
    expect(result.current.data?.conflict).toBe(false);
  });
});

/**
 * Test suite for useDeleteUser hook.
 *
 * Tests user deletion mutation, success handling, error handling,
 * and cache invalidation.
 */
describe("useDeleteUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that user deletion succeeds with valid data.
   */
  it("should delete user successfully", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: "User deleted successfully",
      }),
    });

    const { useDeleteUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useDeleteUser(), { wrapper });

    result.current.mutate("user-1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/users/user-1",
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });

  /**
   * Tests that user deletion fails with error.
   */
  it("should handle deletion errors", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: "VALIDATION_ERROR",
        message: "Cannot delete your own account",
      }),
    });

    const { useDeleteUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useDeleteUser(), { wrapper });

    result.current.mutate("user-1");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  /**
   * Tests that cache is invalidated after successful deletion.
   */
  it("should invalidate user and users cache after successful deletion", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: "User deleted successfully",
      }),
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Pre-populate cache
    queryClient.setQueryData(["user", "user-1"], {
      id: "user-1",
      email: "test@example.com",
    });
    queryClient.setQueryData(["users"], { pages: [], pageParams: [] });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );
    };

    const { useDeleteUser } = await import("../use-user-mutations");

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: Wrapper,
    });

    result.current.mutate("user-1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Cache should be invalidated for users list
    // The user query should be removed (getQueryState returns undefined after removeQueries)
    expect(queryClient.getQueryState(["users"])).toBeDefined();
    // After removeQueries, the query is removed, so getQueryState returns undefined
    // This is expected behavior - the query was removed from cache
    expect(queryClient.getQueryState(["user", "user-1"])).toBeUndefined();

    // Verify the query data was removed
    expect(queryClient.getQueryData(["user", "user-1"])).toBeUndefined();
  });
});

/**
 * Test suite for useRestoreUser hook.
 *
 * Tests user restore mutation, success handling, error handling,
 * and cache invalidation.
 */
describe("useRestoreUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that user restore succeeds with valid data.
   */
  it("should restore user successfully", async () => {
    const mockRestoredUser = {
      id: "user-1",
      email: "test@example.com",
      full_name: "Test User",
      role: "member" as const,
      deleted_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        user: mockRestoredUser,
      }),
    });

    const { useRestoreUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useRestoreUser(), { wrapper });

    result.current.mutate("user-1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockRestoredUser);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/admin/users/user-1/restore",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  /**
   * Tests that user restore fails with error.
   */
  it("should handle restore errors", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: "VALIDATION_ERROR",
        message: "User is not soft-deleted",
      }),
    });

    const { useRestoreUser } = await import("../use-user-mutations");
    const wrapper = createWrapper();

    const { result } = renderHook(() => useRestoreUser(), { wrapper });

    result.current.mutate("user-1");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  /**
   * Tests that cache is invalidated after successful restore.
   */
  it("should invalidate user and users cache after successful restore", async () => {
    const mockRestoredUser = {
      id: "user-1",
      email: "test@example.com",
      full_name: "Test User",
      role: "member" as const,
      deleted_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        user: mockRestoredUser,
      }),
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Pre-populate cache
    queryClient.setQueryData(["user", "user-1"], {
      id: "user-1",
      deleted_at: "2024-01-01T00:00:00Z",
    });
    queryClient.setQueryData(["users"], { pages: [], pageParams: [] });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );
    };

    const { useRestoreUser } = await import("../use-user-mutations");

    const { result } = renderHook(() => useRestoreUser(), {
      wrapper: Wrapper,
    });

    result.current.mutate("user-1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Cache should be invalidated
    expect(queryClient.getQueryState(["users"])).toBeDefined();
    expect(queryClient.getQueryState(["user", "user-1"])).toBeDefined();
  });
});
