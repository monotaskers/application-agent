/**
 * @fileoverview Tests for DataGrid component
 * @module components/data-grid/__tests__/data-grid.test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactElement } from "react";
import { DataGrid } from "../data-grid";
import type { ColumnDef } from "@tanstack/react-table";

/**
 * Test wrapper component with QueryClientProvider
 */
function createWrapper(): ({
  children,
}: {
  children: React.ReactNode;
}) => ReactElement {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
}

/**
 * Test data type
 */
type TestItem = Record<string, unknown> & {
  id: string;
  name: string;
  value: number;
};

/**
 * Test suite for DataGrid component.
 *
 * Tests rendering, loading states, error states, empty states,
 * and basic functionality.
 */
describe("DataGrid", () => {
  const mockData: TestItem[] = [
    { id: "1", name: "Item 1", value: 100 },
    { id: "2", name: "Item 2", value: 200 },
  ];

  const mockColumns: ColumnDef<TestItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => <div>{row.original.value}</div>,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render data grid with data", () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DataGrid data={mockData} columns={mockColumns} />
      </Wrapper>
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("should render loading state when isLoading is true", () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DataGrid data={[]} columns={mockColumns} isLoading={true} />
      </Wrapper>
    );

    // Should show loading skeletons
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should render error state when isError is true", () => {
    const Wrapper = createWrapper();
    const error = new Error("Test error");
    render(
      <Wrapper>
        <DataGrid
          data={[]}
          columns={mockColumns}
          isError={true}
          error={error}
        />
      </Wrapper>
    );

    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("should render empty state when data is empty", () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <DataGrid data={[]} columns={mockColumns} />
      </Wrapper>
    );

    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it("should render custom empty state when provided", () => {
    const Wrapper = createWrapper();
    const customEmpty = <div>Custom empty message</div>;
    render(
      <Wrapper>
        <DataGrid data={[]} columns={mockColumns} emptyState={customEmpty} />
      </Wrapper>
    );

    expect(screen.getByText("Custom empty message")).toBeInTheDocument();
  });

  it("should handle row click when onRowClick is provided", async () => {
    const Wrapper = createWrapper();
    const handleRowClick = vi.fn();
    render(
      <Wrapper>
        <DataGrid
          data={mockData}
          columns={mockColumns}
          onRowClick={handleRowClick}
        />
      </Wrapper>
    );

    const row = screen.getByText("Item 1").closest("tr");
    if (row) {
      row.click();
      await waitFor(() => {
        expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
      });
    }
  });

  // Note: Column visibility UI is handled externally (e.g., via FiltersSection/ColumnVisibilityButton)
  // DataGrid only handles column visibility state for filtering, not UI rendering
});

