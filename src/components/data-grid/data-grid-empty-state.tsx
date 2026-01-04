/**
 * @fileoverview Empty state component for data grid
 * @module components/data-grid/data-grid-empty-state
 */

"use client";

import React, { type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for DataGridEmptyState component
 */
export interface DataGridEmptyStateProps {
  /** Custom message to display */
  message?: string;
  /** Variant of empty state */
  variant?: "no-data" | "no-results";
  /** Label for action button */
  actionLabel?: string;
  /** Callback when action button is clicked */
  onAction?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Custom empty state content */
  children?: React.ReactNode;
}

/**
 * Empty state component for data grid
 *
 * Displays a message when no data is found or when filters
 * return no results. Optionally includes an action button.
 *
 * @param props - Component props
 * @returns React element containing empty state UI
 */
export function DataGridEmptyState({
  message,
  variant = "no-data",
  actionLabel,
  onAction,
  className,
  children,
}: DataGridEmptyStateProps): ReactElement {
  const defaultMessage =
    variant === "no-results"
      ? "No results match your search criteria."
      : "No data available.";

  if (children) {
    return (
      <div
        data-slot="data-grid-empty-state"
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-slot="data-grid-empty-state"
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="mx-auto max-w-sm space-y-4">
        <p className="text-muted-foreground text-sm">
          {message ?? defaultMessage}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline" size="sm">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

