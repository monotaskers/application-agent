/**
 * @fileoverview Tests for useCopilotContext hook
 * @module hooks/__tests__/use-copilot-context.test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useCopilotContext } from "../use-copilot-context";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock Supabase client
vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(),
}));

/**
 * Test suite for useCopilotContext hook.
 *
 * Tests context gathering from various sources including current page,
 * user role, form data, and recent actions.
 */
describe("useCopilotContext", () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockReturnValue(mockSupabase as never);
  });

  /**
   * Tests that hook gathers current page from Next.js router.
   */
  it("should gather current page from Next.js router", async () => {
    const mockPathname = "/admin/overview";
    vi.mocked(usePathname).mockReturnValue(mockPathname);
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          user_metadata: {},
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useCopilotContext());

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    // Verify current page is included in context
    expect(result.current).not.toBeNull();
    expect(result.current!.currentPage).toBe(mockPathname);
  });

  /**
   * Tests that hook gathers user role from Supabase auth.
   */
  it("should gather user role from Supabase auth", async () => {
    vi.mocked(usePathname).mockReturnValue("/admin");
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          user_metadata: {
            role: "admin",
          },
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useCopilotContext());

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    // Verify user role is included in context
    expect(result.current).not.toBeNull();
    expect(result.current!.userRole).toBe("admin");
  });

  /**
   * Tests that hook gathers form data when provided.
   */
  it("should gather form data when provided", async () => {
    vi.mocked(usePathname).mockReturnValue("/admin");
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          user_metadata: {},
        },
      },
      error: null,
    });

    const mockFormData = { name: "Test User", email: "test@example.com" };

    const { result } = renderHook(() => useCopilotContext(mockFormData));

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    // Verify form data is included in context
    expect(result.current).not.toBeNull();
    expect(result.current!.formData).toEqual(mockFormData);
  });

  /**
   * Tests that hook gathers recent actions when provided.
   */
  it("should gather recent actions when provided", async () => {
    vi.mocked(usePathname).mockReturnValue("/admin");
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          user_metadata: {},
        },
      },
      error: null,
    });

    const mockRecentActions = ["viewed_users", "created_user"];

    const { result } = renderHook(() =>
      useCopilotContext(undefined, mockRecentActions)
    );

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    // Verify recent actions are included in context
    expect(result.current).not.toBeNull();
    expect(result.current!.recentActions).toEqual(mockRecentActions);
  });

  /**
   * Tests that context is validated with Zod schema.
   */
  it("should validate context with Zod schema", async () => {
    vi.mocked(usePathname).mockReturnValue("/admin");
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          user_metadata: {
            role: "user",
          },
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useCopilotContext());

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    // Verify context has all required fields
    expect(result.current).not.toBeNull();
    expect(result.current!.currentPage).toBeDefined();
    expect(result.current!.userRole).toBeDefined();
    expect(result.current!.userId).toBeDefined();
    expect(result.current!.userId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });
});
