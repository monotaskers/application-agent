/**
 * @fileoverview Column visibility menu component for data grid
 * @module components/data-grid/data-grid-column-visibility
 */

"use client";

import React, { type ReactElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { ColumnDefinition } from "./types";

/**
 * Props for DataGridColumnVisibility component
 */
export interface DataGridColumnVisibilityProps {
  /** Array of column definitions */
  columns: ColumnDefinition[];
  /** Current column visibility state */
  columnVisibility: Record<string, boolean>;
  /** Function to toggle column visibility */
  onToggleVisibility: (columnId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Column IDs that should be excluded from visibility management
 */
const EXCLUDED_COLUMN_IDS = ["actions"];

/**
 * Column visibility menu component
 *
 * Provides a dropdown menu to toggle column visibility in the data grid.
 * Prevents hiding all columns (minimum one must remain visible).
 * Excludes special columns like "actions" from visibility management.
 *
 * @param props - Component props
 * @returns React element containing column visibility menu
 */
export function DataGridColumnVisibility({
  columns,
  columnVisibility,
  onToggleVisibility,
  className,
}: DataGridColumnVisibilityProps): ReactElement {
  // Filter out columns that should not be in the visibility menu
  const manageableColumns = columns.filter(
    (col) => !EXCLUDED_COLUMN_IDS.includes(col.id)
  );

  /**
   * Handles column visibility toggle
   *
   * @param columnId - Column ID to toggle
   */
  const handleToggle = (columnId: string): void => {
    // Check if this is the last visible column
    const visibleCount = Object.values(columnVisibility).filter(
      (v) => v === true
    ).length;
    if (visibleCount === 1 && columnVisibility[columnId] === true) {
      // Don't allow hiding the last visible column
      return;
    }

    onToggleVisibility(columnId);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
          data-slot="column-visibility-trigger"
        >
          <Icons.settings className="h-4 w-4" />
          <span className="hidden sm:inline">Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        data-slot="column-visibility-menu"
      >
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {manageableColumns.map((column) => {
          const isVisible = columnVisibility[column.id] ?? true;
          const isLastVisible =
            Object.values(columnVisibility).filter((v) => v === true).length ===
              1 && isVisible;

          return (
            <DropdownMenuItem
              key={column.id}
              className="flex items-center gap-2"
              onSelect={(e) => {
                e.preventDefault();
                handleToggle(column.id);
              }}
              disabled={isLastVisible}
              data-slot={`column-visibility-item-${column.id}`}
            >
              <Checkbox
                checked={isVisible}
                onCheckedChange={() => handleToggle(column.id)}
                disabled={isLastVisible}
                className="pointer-events-none"
              />
              <span className={cn(isLastVisible && "text-muted-foreground")}>
                {column.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
