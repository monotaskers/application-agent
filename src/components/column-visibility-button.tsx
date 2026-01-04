/**
 * @fileoverview Compact icon-only column visibility button component
 * @module components/column-visibility-button
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

/**
 * Column definition for visibility menu
 */
export interface ColumnDefinition {
  /** Column ID (accessor key) */
  id: string;
  /** Display label for the column */
  label: string;
}

/**
 * Props for ColumnVisibilityButton component
 */
export interface ColumnVisibilityButtonProps {
  /** Array of column definitions */
  columns: ColumnDefinition[];
  /** Current column visibility state */
  columnVisibility: Record<string, boolean>;
  /** Function to toggle column visibility */
  onToggleVisibility: (columnId: string) => void;
  /** Function to reset all column settings to defaults (optional) */
  onResetToDefaults?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Compact icon-only column visibility button component
 *
 * Provides a dropdown menu to toggle column visibility.
 * Prevents hiding all columns (minimum one must remain visible).
 * Uses only the gear icon (no text) for compact display.
 *
 * @param props - Component props
 * @returns React element containing column visibility button
 *
 * @example
 * ```tsx
 * <ColumnVisibilityButton
 *   columns={COLUMN_DEFINITIONS}
 *   columnVisibility={columnVisibility}
 *   onToggleVisibility={toggleColumnVisibility}
 * />
 * ```
 */
export function ColumnVisibilityButton({
  columns,
  columnVisibility,
  onToggleVisibility,
  onResetToDefaults,
  className,
}: ColumnVisibilityButtonProps): ReactElement {
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
          type="button"
          variant="outline"
          size="icon"
          className={cn("shrink-0", className)}
          aria-label="Toggle column visibility"
          data-slot="column-visibility-trigger"
        >
          <Icons.settings className="h-4 w-4" />
          <span className="sr-only">Toggle column visibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        data-slot="column-visibility-menu"
      >
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
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
        {onResetToDefaults && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onResetToDefaults();
              }}
              data-slot="column-reset-to-defaults"
              className="text-muted-foreground"
            >
              <Icons.refresh className="mr-2 h-4 w-4" />
              Reset to Default
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
