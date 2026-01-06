/**
 * @fileoverview Type definitions for shared data grid components
 * @module components/data-grid/types
 */

import type { ColumnDef } from "@tanstack/react-table";
import type { ReactElement } from "react";

/**
 * Column definition for visibility menu and configuration
 */
export interface ColumnDefinition {
  /** Column ID (accessor key) */
  id: string;
  /** Display label for the column */
  label: string;
}

/**
 * Sort order options
 */
export type SortOrder = "asc" | "desc";

/**
 * Generic sort column type (can be string or specific enum per entity)
 */
export type SortColumn = string | null;

/**
 * Options for creating sort handler
 */
export interface SortHandlerOptions {
  /** Current sort column */
  sort: SortColumn | null;
  /** Current sort order */
  order: SortOrder;
  /** Function to set sort column */
  setSort: (value: SortColumn | null) => void;
  /** Function to set sort order */
  setOrder: (value: SortOrder) => void;
  /** Function to map column ID to sort column */
  getSortColumn?: (columnId: string) => SortColumn | null;
}

/**
 * Options for creating drag end handler
 */
export interface DragEndHandlerOptions {
  /** Function to update column order */
  setColumnOrder: (order: string[]) => void;
  /** Current column order */
  currentOrder: string[];
}

/**
 * Options for creating row click handler
 */
export interface RowClickHandlerOptions<T = unknown> {
  /** Navigation function */
  onNavigate: (rowId: string, row: T) => void;
  /** Function to extract row ID from row data */
  getRowId: (row: T) => string;
}

/**
 * Options for creating keyboard handler
 */
export interface KeyboardHandlerOptions<T = unknown> {
  /** Navigation function */
  onNavigate: (rowId: string, row: T) => void;
  /** Function to extract row ID from row data */
  getRowId: (row: T) => string;
}

/**
 * Options for creating scroll handler
 */
export interface ScrollHandlerOptions {
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether currently fetching next page */
  isFetchingNextPage: boolean;
  /** Function to fetch next page */
  fetchNextPage: () => void;
}

/**
 * Options for column sizing state
 */
export interface ColumnSizingStateOptions {
  /** Initial column widths */
  columnWidths: Record<string, number>;
}

/**
 * Options for flattening paginated data
 */
export interface FlattenDataOptions<T> {
  /** Infinite query data */
  data: { pages: Array<{ data: T[] } | T[]> } | undefined;
  /** Function to extract data array from page */
  getPageData?: (page: unknown) => T[];
}

/**
 * Options for filtering visible columns
 */
export interface VisibleColumnsOptions<T = unknown> {
  /** All column definitions */
  columns: T[];
  /** Column order */
  columnOrder: string[];
  /** Column visibility state */
  columnVisibility: Record<string, boolean>;
  /** Function to get column ID from column definition */
  getColumnId: (column: T) => string | undefined;
}

/**
 * Data grid feature flags
 */
export interface DataGridFeatures {
  /** Enable column resizing */
  enableColumnResizing?: boolean;
  /** Enable drag & drop column reordering */
  enableColumnReordering?: boolean;
  /** Enable column visibility toggle */
  enableColumnVisibility?: boolean;
  /** Enable column sorting */
  enableSorting?: boolean;
}

/**
 * Base props for DataGrid component
 */
export interface DataGridProps<T> extends DataGridFeatures {
  /** Array of data rows */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  isError?: boolean;
  /** Error object */
  error?: Error | null;
  /** Whether there is a next page */
  hasNextPage?: boolean;
  /** Whether currently fetching next page */
  isFetchingNextPage?: boolean;
  /** Function to fetch next page */
  onFetchNextPage?: () => void;
  /** Handler for row click */
  onRowClick?: (row: T) => void;
  /** Custom empty state component */
  emptyState?: ReactElement;
  /** Custom loading state component */
  loadingState?: ReactElement;
  /** Custom error state component */
  errorState?: ReactElement;
  /** Additional CSS classes */
  className?: string;
  /** Function to extract row ID from row data */
  getRowId?: (row: T) => string;
  /** Default column order (only if enableColumnReordering is true) */
  defaultColumnOrder?: string[];
  /** Default column visibility (only if enableColumnVisibility is true) */
  defaultColumnVisibility?: Record<string, boolean>;
  /** Sort state (only if enableSorting is true) */
  sort?: SortColumn | null;
  /** Sort order (only if enableSorting is true) */
  order?: SortOrder;
  /** Sort change handler (only if enableSorting is true) */
  onSortChange?: (columnId: string) => void;
  /** Function to map column ID to sort column (only if enableSorting is true) */
  getSortColumn?: (columnId: string) => SortColumn | null;
  /** Render sort indicator function (only if enableSorting is true) */
  renderSortIndicator?: (columnId: string) => React.ReactNode;
}
