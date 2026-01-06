/**
 * @fileoverview Filter toggle button component
 * @module components/filter-toggle
 */

"use client";

import React, { type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Props for FilterToggle component
 */
export interface FilterToggleProps {
  /** Whether filters are currently open */
  isOpen: boolean;
  /** Function to toggle filter visibility */
  onToggle: () => void;
  /** ID of the collapsible content (for aria-controls) */
  contentId?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Filter toggle button component
 *
 * Provides a button with filter icon to toggle filter visibility.
 * Includes proper ARIA attributes for accessibility.
 *
 * @param props - Component props
 * @returns React element containing filter toggle button
 *
 * @example
 * ```tsx
 * <FilterToggle
 *   isOpen={isOpen}
 *   onToggle={toggle}
 *   contentId="filters-content"
 * />
 * ```
 */
export function FilterToggle({
  isOpen,
  onToggle,
  contentId,
  className,
}: FilterToggleProps): ReactElement {
  const ariaLabel = isOpen ? "Hide filters" : "Show filters";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls={contentId}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "shrink-0",
        isOpen && "bg-accent text-accent-foreground",
        className
      )}
    >
      <Icons.filter className="h-4 w-4" />
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );
}
