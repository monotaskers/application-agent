/**
 * @fileoverview Main data grid component for displaying tabular data
 * @module components/data-grid/data-grid
 */

"use client";

import React, { useMemo, useCallback, type ReactElement } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnSizingState,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DataGridProps } from "./types";
import { DataGridSortableHeader } from "./data-grid-sortable-header";
import { DataGridEmptyState } from "./data-grid-empty-state";
import {
  createDragEndHandler,
  createRowClickHandler,
  createKeyboardHandler,
  createScrollHandler,
} from "./data-grid-handlers";
import { useColumnSizingState } from "./data-grid-state";

/**
 * Default empty table row component
 */
function EmptyTableRow({ columnCount }: { columnCount: number }): ReactElement {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
}

/**
 * Default loading state component
 */
function DefaultLoadingState({
  columnCount = 5,
  columnWidths,
  columnIds,
}: {
  columnCount?: number;
  columnWidths?: Record<string, number>;
  columnIds?: string[];
}): ReactElement {
  // Generate column widths for skeleton - use actual widths if available
  const getColumnWidth = (index: number): number | undefined => {
    if (columnWidths && columnIds && columnIds[index]) {
      return columnWidths[columnIds[index]];
    }
    return undefined;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border max-h-[600px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => {
                const width = getColumnWidth(i);
                return (
                  <TableHead
                    key={i}
                    className="font-semibold relative whitespace-nowrap"
                    style={
                      width
                        ? {
                            width: `${width}px`,
                            minWidth: `${width}px`,
                            maxWidth: `${width}px`,
                          }
                        : undefined
                    }
                  >
                    <Skeleton className="h-5 w-24" />
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columnCount }).map((_, j) => {
                  const width = getColumnWidth(j);
                  return (
                    <TableCell
                      key={j}
                      className="whitespace-nowrap"
                      style={
                        width
                          ? {
                              width: `${width}px`,
                              minWidth: `${width}px`,
                              maxWidth: `${width}px`,
                            }
                          : undefined
                      }
                    >
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * Default error state component
 */
function DefaultErrorState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry?: () => void;
}): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-destructive mb-4 text-sm">
        {error instanceof Error ? error.message : "Failed to load data"}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}

/**
 * Main data grid component for displaying tabular data
 *
 * Provides a fully-featured data grid with infinite pagination, sorting,
 * filtering, column customization (drag, resize, visibility), and navigation.
 * Features are configurable via props.
 *
 * @param props - Component props
 * @returns React element containing data grid
 */
export function DataGrid<T = Record<string, unknown>>({
  data,
  columns,
  isLoading = false,
  isError = false,
  error = null,
  hasNextPage = false,
  isFetchingNextPage = false,
  onFetchNextPage,
  onRowClick,
  emptyState,
  loadingState,
  errorState,
  className = undefined,
  getRowId = (row: T) => {
    if (typeof row === "object" && row !== null && "id" in row) {
      return String((row as { id: unknown }).id);
    }
    return String(row);
  },
  enableColumnResizing = false,
  enableColumnReordering = false,
  enableColumnVisibility = false,
  enableSorting: _enableSorting = true,
  defaultColumnOrder,
  defaultColumnVisibility,
  sort: _sort,
  order: _order = "asc",
  onSortChange: _onSortChange,
  getSortColumn: _getSortColumn,
  renderSortIndicator: _renderSortIndicator,
  // Column management hooks (optional, can be passed from parent)
  columnOrder: externalColumnOrder,
  setColumnOrder: externalSetColumnOrder,
  columnWidths: externalColumnWidths = {},
  setColumnWidth: externalSetColumnWidth,
  columnVisibility: externalColumnVisibility,
}: DataGridProps<T> & {
  // Optional external column management
  columnOrder?: string[];
  setColumnOrder?: (order: string[]) => void;
  columnWidths?: Record<string, number>;
  setColumnWidth?: (columnId: string, width: number) => void;
  columnVisibility?: Record<string, boolean>;
}): ReactElement {
  // Get column ID helper (defined early for use in state initialization)
  const getColumnIdForInit = (col: ColumnDef<T>): string => {
    if (col.id) {
      return col.id;
    }
    if ("accessorKey" in col && typeof col.accessorKey === "string") {
      return col.accessorKey;
    }
    return "";
  };

  // Column management state (use external if provided, otherwise use defaults)
  const [internalColumnOrder, setInternalColumnOrder] = React.useState<
    string[]
  >(defaultColumnOrder ?? columns.map(getColumnIdForInit).filter(Boolean));
  const [internalColumnWidths, setInternalColumnWidth] = React.useState<
    Record<string, number>
  >(() => externalColumnWidths);
  const [internalColumnVisibility, _setInternalColumnVisibility] =
    React.useState<Record<string, boolean>>(
      defaultColumnVisibility ??
        columns.reduce(
          (acc, col) => {
            const id = getColumnIdForInit(col);
            if (id) acc[id] = true;
            return acc;
          },
          {} as Record<string, boolean>
        )
    );

  const columnOrder = externalColumnOrder ?? internalColumnOrder;
  const setColumnOrder = externalSetColumnOrder ?? setInternalColumnOrder;

  // Memoize columnWidths to prevent unnecessary re-renders
  const columnWidths = useMemo(
    () => externalColumnWidths ?? internalColumnWidths,
    [externalColumnWidths, internalColumnWidths]
  );

  const setColumnWidth = externalSetColumnWidth ?? setInternalColumnWidth;
  const columnVisibility = externalColumnVisibility ?? internalColumnVisibility;

  // Column sizing state management
  const { columnSizing, setColumnSizing } = useColumnSizingState({
    columnWidths,
  });

  // DnD sensors (only if reordering enabled)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get column ID from column definition
  const getColumnId = useCallback((col: ColumnDef<T>): string => {
    if (col.id) {
      return col.id;
    }
    if ("accessorKey" in col && typeof col.accessorKey === "string") {
      return col.accessorKey;
    }
    return "";
  }, []);

  // Identify the actions column (should be excluded from column management)
  const actionsColumn = useMemo(() => {
    return columns.find((col) => getColumnId(col) === "actions");
  }, [columns, getColumnId]);

  // Get regular columns (excluding actions)
  const regularColumns = useMemo(() => {
    return columns.filter((col) => getColumnId(col) !== "actions");
  }, [columns, getColumnId]);

  // Filter columns based on visibility and order (only if column management is enabled)
  // If features are disabled, use columns directly
  // Calculate visible columns early for skeleton matching
  // Actions column is always prepended at the beginning if it exists
  const visibleColumns = useMemo(() => {
    let orderedColumns: ColumnDef<T>[];

    // If column visibility/reordering is disabled, just use all regular columns
    if (!enableColumnVisibility && !enableColumnReordering) {
      orderedColumns = regularColumns;
    } else {
      // Otherwise, filter based on visibility and order
      // Build column order from column IDs if not provided
      const effectiveColumnOrder =
        columnOrder.length > 0
          ? columnOrder
          : regularColumns.map((col) => getColumnId(col)).filter(Boolean);

      orderedColumns = effectiveColumnOrder
        .filter((colId) => colId !== "actions") // Exclude actions from ordering
        .filter((colId) => columnVisibility[colId] !== false)
        .map((colId) =>
          regularColumns.find((col) => getColumnId(col) === colId)
        )
        .filter((col): col is ColumnDef<T> => col !== undefined);
    }

    // Always prepend actions column at the beginning if it exists
    if (actionsColumn) {
      return [actionsColumn, ...orderedColumns];
    }

    return orderedColumns;
  }, [
    regularColumns,
    actionsColumn,
    columnOrder,
    columnVisibility,
    getColumnId,
    enableColumnVisibility,
    enableColumnReordering,
  ]);

  const handleDragEnd = useMemo(
    () =>
      createDragEndHandler({
        setColumnOrder: (newOrder: string[]) => {
          // Ensure actions column is never in the order
          setColumnOrder(newOrder.filter((id) => id !== "actions"));
        },
        currentOrder: columnOrder.filter((id) => id !== "actions"),
      }),
    [setColumnOrder, columnOrder]
  );

  const handleRowClick = useMemo(() => {
    if (!onRowClick) return () => {};
    return createRowClickHandler({
      onNavigate: (_rowId, row) => {
        onRowClick(row);
      },
      getRowId,
    });
  }, [onRowClick, getRowId]);

  const handleRowKeyDown = useMemo(() => {
    if (!onRowClick) return () => {};
    return createKeyboardHandler({
      onNavigate: (_rowId, row) => {
        onRowClick(row);
      },
      getRowId,
    });
  }, [onRowClick, getRowId]);

  const handleScroll = useMemo(() => {
    if (!onFetchNextPage) return () => {};
    return createScrollHandler({
      hasNextPage,
      isFetchingNextPage: isFetchingNextPage ?? false,
      fetchNextPage: onFetchNextPage,
    });
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  /**
   * Handles column sizing change from TanStack Table
   */
  const handleColumnSizingChange = useCallback(
    (
      updater:
        | ColumnSizingState
        | ((prev: ColumnSizingState) => ColumnSizingState)
    ) => {
      setColumnSizing((prev) => {
        const newSizing =
          typeof updater === "function" ? updater(prev) : updater;

        // Sync to column width setter
        if (setColumnWidth && typeof setColumnWidth === "function") {
          Object.entries(newSizing).forEach(([columnId, width]) => {
            const prevWidth = prev[columnId];
            if (
              width !== prevWidth &&
              typeof width === "number" &&
              !Number.isNaN(width)
            ) {
              // Type assertion needed because setColumnWidth signature is (columnId: string, width: number) => void
              (setColumnWidth as (columnId: string, width: number) => void)(
                columnId,
                width
              );
            }
          });
        }

        return newSizing;
      });
    },
    [setColumnSizing, setColumnWidth]
  );

  const table = useReactTable({
    data,
    columns: visibleColumns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true, // We handle sorting server-side
    state: {
      ...(enableColumnResizing ? { columnSizing } : {}),
      columnVisibility,
    },
    ...(enableColumnResizing
      ? { onColumnSizingChange: handleColumnSizingChange }
      : {}),
    enableColumnResizing,
    columnResizeMode: "onChange",
    defaultColumn: {
      minSize: 50,
      maxSize: 500,
      size: 150,
    },
  });

  // Loading state
  if (isLoading && data.length === 0) {
    if (loadingState) {
      return <>{loadingState}</>;
    }
    // Use visible columns count and IDs for skeleton to match actual rendered table
    const skeletonColumnCount = visibleColumns.length;
    const skeletonColumnIds = visibleColumns.map((col) => getColumnId(col));
    return (
      <DefaultLoadingState
        columnCount={skeletonColumnCount}
        columnWidths={columnWidths}
        columnIds={skeletonColumnIds}
      />
    );
  }

  // Error state
  if (isError) {
    if (errorState) {
      return <>{errorState}</>;
    }
    return (
      <DefaultErrorState
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Empty state
  if (data.length === 0) {
    if (emptyState) {
      return <>{emptyState}</>;
    }
    return <DataGridEmptyState variant="no-data" />;
  }

  const tableContent = (
    <div
      className="h-full rounded-md border"
      onScroll={handleScroll}
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "auto",
        overflowY: "auto",
      }}
    >
      <table
        className="caption-bottom text-foreground text-sm"
        style={{ tableLayout: "auto", width: "max-content", minWidth: "100%" }}
      >
        <colgroup>
          {table.getHeaderGroups()[0]?.headers.map((header) => {
            const columnMeta = header.column.columnDef.meta as
              | { flexible?: boolean }
              | undefined;
            const isFlexible = columnMeta?.flexible ?? false;
            const columnSize = header.getSize();
            return (
              <col
                key={header.id}
                style={
                  isFlexible ? { width: "auto" } : { width: `${columnSize}px` }
                }
              />
            );
          })}
        </colgroup>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {enableColumnReordering ? (
                <SortableContext
                  items={headerGroup.headers
                    .filter((h) => h.column.id !== "actions") // Exclude actions from DnD
                    .map((h) => h.column.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => {
                    // Actions column is not draggable
                    const isActionsColumn = header.column.id === "actions";
                    return (
                      <DataGridSortableHeader
                        key={header.id}
                        header={header}
                        table={table}
                        enableReordering={
                          enableColumnReordering && !isActionsColumn
                        }
                        enableResizing={
                          enableColumnResizing && !isActionsColumn
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </DataGridSortableHeader>
                    );
                  })}
                </SortableContext>
              ) : (
                headerGroup.headers.map((header) => (
                  <DataGridSortableHeader
                    key={header.id}
                    header={header}
                    table={table}
                    enableReordering={false}
                    enableResizing={enableColumnResizing}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </DataGridSortableHeader>
                ))
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const rowData = row.original;
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for row ${getRowId(rowData)}`}
                  onClick={(e) => handleRowClick(rowData, e)}
                  onKeyDown={(e) => handleRowKeyDown(rowData, e)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    "hover:bg-muted/50 focus:bg-muted/50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnMeta = cell.column.columnDef.meta as
                      | { className?: string; flexible?: boolean }
                      | undefined;
                    const columnSize = cell.column.getSize();
                    const isFlexible = columnMeta?.flexible ?? false;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "whitespace-nowrap",
                          columnMeta?.className
                        )}
                        style={
                          isFlexible
                            ? {
                                width: "auto",
                                minWidth: `${cell.column.columnDef.minSize ?? 200}px`,
                              }
                            : {
                                width: `${columnSize}px`,
                                minWidth: `${columnSize}px`,
                                maxWidth: `${columnSize}px`,
                              }
                        }
                        {...(isFlexible && { "data-flexible": "true" })}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <EmptyTableRow columnCount={visibleColumns.length} />
          )}
        </TableBody>
      </table>
    </div>
  );

  return (
    <div
      data-slot="data-grid"
      className={cn(
        "flex h-full flex-col w-full max-w-full min-w-0",
        className ?? ""
      )}
    >
      {/* Table with optional DnD context */}
      <div className="flex-1 min-h-0 min-w-0 w-full max-w-full overflow-hidden">
        {enableColumnReordering ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {tableContent}
          </DndContext>
        ) : (
          tableContent
        )}
      </div>

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4 flex-shrink-0">
          <p className="text-muted-foreground text-sm">Loading more...</p>
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && data.length > 0 && (
        <div className="flex items-center justify-center py-4 flex-shrink-0">
          <p className="text-muted-foreground text-sm">End of results</p>
        </div>
      )}
    </div>
  );
}
