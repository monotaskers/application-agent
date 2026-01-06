/**
 * @fileoverview Empty state component for user list
 * @module features/users/components/empty-state
 */

"use client";

import React, { type ReactElement } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for EmptyState component
 */
export interface EmptyStateProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom message to display */
  message?: string;
}

/**
 * Empty state component for user list
 *
 * Displays a message when no users are found.
 * Used when search/filters return no results or when list is empty.
 *
 * @param props - Component props
 * @returns React element containing empty state message
 *
 * @example
 * ```tsx
 * <EmptyState message="No users found matching your search" />
 * ```
 */
export function EmptyState({
  className,
  message = "No users found",
}: EmptyStateProps): ReactElement {
  return (
    <div
      data-slot="user-empty-state"
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
