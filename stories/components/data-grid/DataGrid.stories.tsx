/**
 * @fileoverview DataGrid component stories demonstrating various configurations and states
 * @module stories/components/data-grid/DataGrid
 *
 * The DataGrid component provides a fully-featured data table with infinite pagination,
 * sorting, column customization (drag, resize, visibility), and navigation.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState, useCallback, useMemo } from "react";
import { DataGrid } from "@/components/data-grid";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  ColumnDefinition,
  SortOrder,
  SortColumn,
} from "@/components/data-grid/types";

// Mock data type
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

// Mock data generator
const generateMockUsers = (count: number): MockUser[] => {
  const roles = ["Admin", "User", "Manager", "Viewer"];
  const statuses: ("active" | "inactive")[] = ["active", "inactive"];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % 2],
    createdAt: new Date(2024, 0, i + 1).toISOString(),
  }));
};

// Column definitions
const createColumns = (): ColumnDef<MockUser>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
];

const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "status", label: "Status" },
  { id: "createdAt", label: "Created At" },
];

const DEFAULT_COLUMN_IDS = ["name", "email", "role", "status", "createdAt"];

const meta = {
  title: "Components/DataGrid",
  component: DataGrid,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
    },
    docs: {
      description: {
        component:
          "A fully-featured data grid component with infinite pagination, sorting, column customization (drag, resize, visibility), and navigation. Supports server-side sorting and filtering.",
      },
    },
    viewport: {
      defaultViewport: "desktop",
    },
  },
  argTypes: {
    enableColumnResizing: {
      control: "boolean",
      description: "Enable column resizing",
    },
    enableColumnReordering: {
      control: "boolean",
      description: "Enable column drag-and-drop reordering",
    },
    enableColumnVisibility: {
      control: "boolean",
      description: "Enable column visibility toggling",
    },
    enableSorting: {
      control: "boolean",
      description: "Enable column sorting",
    },
  },
} satisfies Meta<typeof DataGrid<MockUser>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic data grid with minimal features.
 * Shows a simple table with data and basic sorting.
 */
export const Basic: Story = {
  render: (args) => {
    const [sort, setSort] = useState<SortColumn | null>(null);
    const [order, setOrder] = useState<SortOrder>("asc");
    const mockData = useMemo(() => generateMockUsers(20), []);
    const columns = useMemo(() => createColumns(), []);

    const handleSortChange = useCallback(
      (columnId: string) => {
        if (sort === columnId) {
          setOrder(order === "asc" ? "desc" : "asc");
        } else {
          setSort(columnId);
          setOrder("asc");
        }
      },
      [sort, order]
    );

    const getSortColumn = useCallback(
      (columnId: string): SortColumn | null => {
        return columnId === sort ? columnId : null;
      },
      [sort]
    );

    const renderSortIndicator = useCallback(
      (columnId: string) => {
        const sortColumn = getSortColumn(columnId);
        if (!sortColumn || sort !== sortColumn) {
          return null;
        }
        return (
          <span className="ml-2 text-xs">{order === "asc" ? "↑" : "↓"}</span>
        );
      },
      [sort, order, getSortColumn]
    );

    return (
      <DataGrid
        {...args}
        columns={columns}
        data={mockData}
        isLoading={false}
        isError={false}
        hasNextPage={false}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        getSortColumn={getSortColumn}
        renderSortIndicator={renderSortIndicator}
      />
    );
  },
  args: {
    enableColumnResizing: false,
    enableColumnReordering: false,
    enableColumnVisibility: false,
    enableSorting: true,
  },
};

/**
 * Data grid with all column management features enabled.
 * Users can resize, reorder, and toggle column visibility.
 */
export const WithColumnManagement: Story = {
  render: (args) => {
    const [sort, setSort] = useState<SortColumn | null>(null);
    const [order, setOrder] = useState<SortOrder>("asc");
    const [columnOrder, setColumnOrder] =
      useState<string[]>(DEFAULT_COLUMN_IDS);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
      name: 200,
      email: 250,
      role: 150,
      status: 120,
      createdAt: 150,
    });
    const [columnVisibility, setColumnVisibility] = useState<
      Record<string, boolean>
    >({
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    });

    const mockData = useMemo(() => generateMockUsers(20), []);
    const columns = useMemo(() => createColumns(), []);

    const handleSortChange = useCallback(
      (columnId: string) => {
        if (sort === columnId) {
          setOrder(order === "asc" ? "desc" : "asc");
        } else {
          setSort(columnId);
          setOrder("asc");
        }
      },
      [sort, order]
    );

    const getSortColumn = useCallback(
      (columnId: string): SortColumn | null => {
        return columnId === sort ? columnId : null;
      },
      [sort]
    );

    const renderSortIndicator = useCallback(
      (columnId: string) => {
        const sortColumn = getSortColumn(columnId);
        if (!sortColumn || sort !== sortColumn) {
          return null;
        }
        return (
          <span className="ml-2 text-xs">{order === "asc" ? "↑" : "↓"}</span>
        );
      },
      [sort, order, getSortColumn]
    );

    const toggleColumnVisibility = useCallback((columnId: string) => {
      setColumnVisibility((prev) => {
        const visibleCount = Object.values(prev).filter(
          (v) => v === true
        ).length;
        if (visibleCount === 1 && prev[columnId] === true) {
          return prev; // Don't hide last visible column
        }
        return { ...prev, [columnId]: !prev[columnId] };
      });
    }, []);

    const handleSetColumnWidth = useCallback(
      (columnId: string, width: number) => {
        setColumnWidths((prev) => ({ ...prev, [columnId]: width }));
      },
      []
    );

    return (
      <DataGrid
        {...args}
        columns={columns}
        data={mockData}
        isLoading={false}
        isError={false}
        hasNextPage={false}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        getSortColumn={getSortColumn}
        renderSortIndicator={renderSortIndicator}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        columnWidths={columnWidths}
        setColumnWidth={handleSetColumnWidth}
        columnVisibility={columnVisibility}
        toggleColumnVisibility={toggleColumnVisibility}
        columnDefinitions={COLUMN_DEFINITIONS}
      />
    );
  },
  args: {
    enableColumnResizing: true,
    enableColumnReordering: true,
    enableColumnVisibility: true,
    enableSorting: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verify table is rendered
    const table = canvas.getByRole("table");
    await expect(table).toBeInTheDocument();
  },
};

/**
 * Loading state showing skeleton placeholders.
 * Displays while data is being fetched.
 */
export const Loading: Story = {
  render: (args) => {
    const columns = useMemo(() => createColumns(), []);
    return (
      <DataGrid
        {...args}
        columns={columns}
        data={[]}
        isLoading={true}
        isError={false}
        hasNextPage={false}
      />
    );
  },
  args: {
    enableColumnResizing: true,
    enableColumnReordering: true,
    enableColumnVisibility: true,
    enableSorting: true,
  },
};

/**
 * Empty state when no data is available.
 * Shows a helpful message to the user.
 */
export const Empty: Story = {
  render: (args) => {
    const columns = useMemo(() => createColumns(), []);
    return (
      <DataGrid
        {...args}
        columns={columns}
        data={[]}
        isLoading={false}
        isError={false}
        hasNextPage={false}
      />
    );
  },
  args: {
    enableColumnResizing: false,
    enableColumnReordering: false,
    enableColumnVisibility: false,
    enableSorting: true,
  },
};

/**
 * Error state when data fetching fails.
 * Displays error message with retry option.
 */
export const Error: Story = {
  render: (args) => {
    const columns = useMemo(() => createColumns(), []);
    return (
      <DataGrid
        {...args}
        columns={columns}
        data={[]}
        isLoading={false}
        isError={true}
        error={new Error("Failed to load data")}
        hasNextPage={false}
      />
    );
  },
  args: {
    enableColumnResizing: false,
    enableColumnReordering: false,
    enableColumnVisibility: false,
    enableSorting: true,
  },
};

/**
 * Data grid with infinite scroll pagination.
 * Simulates loading more data as user scrolls.
 */
export const WithPagination: Story = {
  render: (args) => {
    const [sort, setSort] = useState<SortColumn | null>(null);
    const [order, setOrder] = useState<SortOrder>("asc");
    const [page, setPage] = useState(1);
    const [allData, setAllData] = useState<MockUser[]>(() =>
      generateMockUsers(10)
    );

    const mockData = useMemo(() => {
      return allData.slice(0, page * 10);
    }, [allData, page]);

    const hasNextPage = page < 3; // Simulate 3 pages of data

    const columns = useMemo(() => createColumns(), []);

    const handleFetchNextPage = useCallback(() => {
      if (hasNextPage) {
        setPage((prev) => prev + 1);
        // Simulate loading more data
        setTimeout(() => {
          setAllData((prev) => [...prev, ...generateMockUsers(10)]);
        }, 500);
      }
    }, [hasNextPage]);

    const handleSortChange = useCallback(
      (columnId: string) => {
        if (sort === columnId) {
          setOrder(order === "asc" ? "desc" : "asc");
        } else {
          setSort(columnId);
          setOrder("asc");
        }
      },
      [sort, order]
    );

    const getSortColumn = useCallback(
      (columnId: string): SortColumn | null => {
        return columnId === sort ? columnId : null;
      },
      [sort]
    );

    const renderSortIndicator = useCallback(
      (columnId: string) => {
        const sortColumn = getSortColumn(columnId);
        if (!sortColumn || sort !== sortColumn) {
          return null;
        }
        return (
          <span className="ml-2 text-xs">{order === "asc" ? "↑" : "↓"}</span>
        );
      },
      [sort, order, getSortColumn]
    );

    return (
      <DataGrid
        {...args}
        columns={columns}
        data={mockData}
        isLoading={false}
        isError={false}
        hasNextPage={hasNextPage}
        isFetchingNextPage={false}
        onFetchNextPage={handleFetchNextPage}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        getSortColumn={getSortColumn}
        renderSortIndicator={renderSortIndicator}
      />
    );
  },
  args: {
    enableColumnResizing: false,
    enableColumnReordering: false,
    enableColumnVisibility: false,
    enableSorting: true,
  },
};

/**
 * Data grid with row click navigation.
 * Clicking a row triggers navigation callback.
 */
export const WithRowClick: Story = {
  render: (args) => {
    const [sort, setSort] = useState<SortColumn | null>(null);
    const [order, setOrder] = useState<SortOrder>("asc");
    const [clickedRow, setClickedRow] = useState<MockUser | null>(null);
    const mockData = useMemo(() => generateMockUsers(20), []);
    const columns = useMemo(() => createColumns(), []);

    const handleSortChange = useCallback(
      (columnId: string) => {
        if (sort === columnId) {
          setOrder(order === "asc" ? "desc" : "asc");
        } else {
          setSort(columnId);
          setOrder("asc");
        }
      },
      [sort, order]
    );

    const getSortColumn = useCallback(
      (columnId: string): SortColumn | null => {
        return columnId === sort ? columnId : null;
      },
      [sort]
    );

    const renderSortIndicator = useCallback(
      (columnId: string) => {
        const sortColumn = getSortColumn(columnId);
        if (!sortColumn || sort !== sortColumn) {
          return null;
        }
        return (
          <span className="ml-2 text-xs">{order === "asc" ? "↑" : "↓"}</span>
        );
      },
      [sort, order, getSortColumn]
    );

    const handleRowClick = useCallback((row: MockUser) => {
      setClickedRow(row);
      // In a real app, this would navigate to the detail page
      console.log("Row clicked:", row);
    }, []);

    return (
      <div className="space-y-4">
        {clickedRow && (
          <div className="rounded-md border bg-muted p-4">
            <p className="text-sm font-medium">Last clicked row:</p>
            <p className="text-sm text-muted-foreground">
              {clickedRow.name} ({clickedRow.email})
            </p>
          </div>
        )}
        <DataGrid
          {...args}
          columns={columns}
          data={mockData}
          isLoading={false}
          isError={false}
          hasNextPage={false}
          sort={sort}
          order={order}
          onSortChange={handleSortChange}
          getSortColumn={getSortColumn}
          renderSortIndicator={renderSortIndicator}
          onRowClick={handleRowClick}
        />
      </div>
    );
  },
  args: {
    enableColumnResizing: false,
    enableColumnReordering: false,
    enableColumnVisibility: false,
    enableSorting: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table");
    await expect(table).toBeInTheDocument();

    // Click first row
    const firstRow = canvas.getAllByRole("row")[1]; // Skip header row
    await userEvent.click(firstRow);
  },
};

