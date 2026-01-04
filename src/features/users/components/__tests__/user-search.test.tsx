/**
 * @fileoverview Tests for UserSearch component
 * @module features/users/components/__tests__/user-search.test
 *
 * Test suite for user search component with URL state management.
 * Following TDD approach: These tests are written FIRST and should FAIL initially.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserSearch } from "../user-search";

// Mock nuqs
const mockUseQueryState = vi.fn();
vi.mock("nuqs", () => ({
  useQueryState: (...args: unknown[]) => mockUseQueryState(...args),
}));

/**
 * Test suite for UserSearch component.
 *
 * Tests search input, URL state synchronization, and debouncing.
 */
describe("UserSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that search input renders correctly.
   */
  it("should render search input", () => {
    mockUseQueryState.mockReturnValue(["", vi.fn()]);

    render(<UserSearch />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  /**
   * Tests that search value is synced with URL state.
   */
  it("should sync search value with URL state", () => {
    const mockSetSearch = vi.fn();
    mockUseQueryState.mockReturnValue(["john", mockSetSearch]);

    render(<UserSearch />);

    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    expect(input.value).toBe("john");
  });

  /**
   * Tests that typing updates URL state.
   */
  it("should update URL state when typing", async () => {
    const mockSetSearch = vi.fn();
    mockUseQueryState.mockReturnValue(["", mockSetSearch]);

    render(<UserSearch />);

    const input = screen.getByPlaceholderText(/search/i);
    const user = userEvent.setup();

    await user.type(input, "john");

    await waitFor(() => {
      expect(mockSetSearch).toHaveBeenCalled();
    });
  });

  /**
   * Tests that clearing search clears URL state.
   */
  it("should clear URL state when search is cleared", async () => {
    const mockSetSearch = vi.fn();
    mockUseQueryState.mockReturnValue(["john", mockSetSearch]);

    render(<UserSearch />);

    const input = screen.getByPlaceholderText(/search/i);
    const user = userEvent.setup();

    await user.clear(input);

    await waitFor(() => {
      expect(mockSetSearch).toHaveBeenCalledWith("");
    });
  });
});
