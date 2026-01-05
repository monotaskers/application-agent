/**
 * @fileoverview State management utilities for data grid components
 * @module components/data-grid/data-grid-state
 */

import { useMemo, useState, useEffect, useRef } from "react";
import type { ColumnSizingState } from "@tanstack/react-table";
import type {
  ColumnSizingStateOptions,
  FlattenDataOptions,
  VisibleColumnsOptions,
} from "./types";

/**
 * Creates and manages column sizing state synchronized with column widths
 *
 * @param options - Column sizing state options
 * @returns Column sizing state and setter
 */
export function useColumnSizingState(options: ColumnSizingStateOptions) {
  const { columnWidths } = options;

  // Use ref to track previous columnWidths for comparison
  const prevColumnWidthsRef = useRef<Record<string, number>>(columnWidths);

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    return Object.entries(columnWidths).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as ColumnSizingState);
  });

  // Sync columnSizing when columnWidths change (only if actually different)
  useEffect(() => {
    // Deep comparison to check if columnWidths actually changed
    const prev = prevColumnWidthsRef.current;
    const current = columnWidths;

    // Check if keys or values changed
    const prevKeys = Object.keys(prev).sort().join(",");
    const currentKeys = Object.keys(current).sort().join(",");
    const keysChanged = prevKeys !== currentKeys;

    let valuesChanged = false;
    if (!keysChanged) {
      // Only check values if keys are the same
      for (const key in current) {
        if (prev[key] !== current[key]) {
          valuesChanged = true;
          break;
        }
      }
    } else {
      valuesChanged = true;
    }

    // Only update if something actually changed
    if (!keysChanged && !valuesChanged) {
      return;
    }

    // Update ref
    prevColumnWidthsRef.current = { ...columnWidths };

    // Update state only if there are actual changes
    setColumnSizing((prevState) => {
      const updated = { ...prevState };
      let hasStateChanges = false;

      Object.entries(columnWidths).forEach(([key, value]) => {
        if (updated[key] !== value) {
          updated[key] = value;
          hasStateChanges = true;
        }
      });

      // Only return new object if there were actual changes
      return hasStateChanges ? updated : prevState;
    });
  }, [columnWidths]);

  return { columnSizing, setColumnSizing };
}

/**
 * Flattens all pages of data into a single array
 *
 * @param options - Flatten options
 * @returns Array of data items
 */
export function useFlattenedData<T>(options: FlattenDataOptions<T>): T[] {
  const { data, getPageData } = options;

  return useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    if (getPageData) {
      return data.pages.flatMap((page) => getPageData(page));
    }

    // Default: assume pages are arrays or have a data property
    return data.pages.flatMap((page) => {
      if (Array.isArray(page)) {
        return page;
      }
      if (typeof page === "object" && page !== null && "data" in page) {
        return (page as { data: T[] }).data;
      }
      return [];
    });
  }, [data, getPageData]);
}

/**
 * Filters and orders columns based on visibility and order state
 *
 * @param options - Visible columns options
 * @returns Filtered and ordered columns
 */
export function useVisibleColumns<T = unknown>(
  options: VisibleColumnsOptions<T>
) {
  const { columns, columnOrder, columnVisibility, getColumnId } = options;

  return useMemo(() => {
    return columnOrder
      .filter((colId) => columnVisibility[colId] !== false)
      .map((colId) => columns.find((col) => getColumnId(col) === colId))
      .filter((col): col is T => col !== undefined);
  }, [columns, columnOrder, columnVisibility, getColumnId]);
}
