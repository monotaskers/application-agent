/**
 * @fileoverview Tests for UserFilters component
 * @module features/users/components/__tests__/user-filters.test
 *
 * Test suite for user filters component (role filter).
 * Following TDD approach: These tests are written FIRST and should FAIL initially.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserFilters } from "../user-filters";

// Mock nuqs
const mockUseQueryState = vi.fn();
vi.mock("nuqs", () => ({
  useQueryState: (...args: unknown[]) => mockUseQueryState(...args),
}));


/**
 * Test suite for UserFilters component.
 *
 * Tests role filter and URL state synchronization.
 */
describe("UserFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests that role filter renders correctly.
   */
  it("should render role filter", () => {
    // Mock useQueryState to return different values for each call (role, include_deleted)
    mockUseQueryState
      .mockReturnValueOnce(["", vi.fn()]) // role
      .mockReturnValueOnce([false, vi.fn()]); // include_deleted

    render(<UserFilters />);

    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  /**
   * Tests that role filter updates URL state.
   */
  it("should update URL state when role filter changes", async () => {
    const mockSetRole = vi.fn();
    const mockSetIncludeDeleted = vi.fn();

    // Mock useQueryState to return different values for each call
    mockUseQueryState
      .mockReturnValueOnce(["", mockSetRole]) // role
      .mockReturnValueOnce([false, mockSetIncludeDeleted]); // include_deleted

    render(<UserFilters />);

    const roleSelectTrigger = screen.getByLabelText(/role/i);
    const user = userEvent.setup();

    // Click to open the select
    await user.click(roleSelectTrigger);

    // Wait for and click the admin option
    const adminOption = await screen.findByText("Admin");
    await user.click(adminOption);

    await waitFor(() => {
      expect(mockSetRole).toHaveBeenCalledWith("admin");
    });
  });


  /**
   * Tests that filters can be cleared.
   */
  it("should clear filters when clear button is clicked", async () => {
    const mockSetRole = vi.fn();
    const mockSetIncludeDeleted = vi.fn();

    // Mock useQueryState to return different values for each call
    mockUseQueryState
      .mockReturnValueOnce(["admin", mockSetRole]) // role
      .mockReturnValueOnce([false, mockSetIncludeDeleted]); // include_deleted

    render(<UserFilters />);

    const clearButton = screen.getByRole("button", { name: /clear/i });
    const user = userEvent.setup();

    await user.click(clearButton);

    await waitFor(() => {
      expect(mockSetRole).toHaveBeenCalledWith("");
    });
  });
});
