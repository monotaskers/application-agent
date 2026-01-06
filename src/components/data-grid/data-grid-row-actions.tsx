/**
 * @fileoverview Row actions dropdown menu component for data grid
 * @module components/data-grid/data-grid-row-actions
 */

"use client";

import React, { type ReactElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Action item configuration for row actions menu
 */
export interface RowActionItem {
  /** Unique identifier for the action */
  id: string;
  /** Display label for the action */
  label: string;
  /** Icon component to display (optional) */
  icon?: React.ReactNode;
  /** Click handler for the action */
  onClick: () => void;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Whether to show a separator after this item */
  separator?: boolean;
  /** Variant for styling (e.g., destructive for delete actions) */
  variant?: "default" | "destructive";
}

/**
 * Props for DataGridRowActions component
 */
export interface DataGridRowActionsProps {
  /** Array of action items to display in the menu */
  actions: RowActionItem[];
  /** Additional CSS classes */
  className?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

/**
 * Row actions dropdown menu component
 *
 * Provides a standardized dropdown menu for row-level actions in data grids.
 * Uses an ellipsis icon trigger and stops event propagation to prevent row click.
 *
 * @param props - Component props
 * @returns React element containing the row actions dropdown
 *
 * @example
 * ```tsx
 * <DataGridRowActions
 *   actions={[
 *     { id: "view", label: "View Details", onClick: () => handleView(row) },
 *     { id: "edit", label: "Edit", onClick: () => handleEdit(row) },
 *     { id: "delete", label: "Delete", onClick: () => handleDelete(row), variant: "destructive" },
 *   ]}
 *   ariaLabel={`Actions for ${row.name}`}
 * />
 * ```
 */
export function DataGridRowActions({
  actions,
  className,
  ariaLabel = "Row actions",
}: DataGridRowActionsProps): ReactElement {
  /**
   * Handles click events to stop propagation to parent row
   */
  const handleTriggerClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  /**
   * Handles action item click
   */
  const handleActionClick = (
    e: React.MouseEvent,
    action: RowActionItem
  ): void => {
    e.stopPropagation();
    if (!action.disabled) {
      action.onClick();
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary",
            className
          )}
          onClick={handleTriggerClick}
          aria-label={ariaLabel}
          data-slot="row-actions-trigger"
        >
          <Icons.ellipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48"
        data-slot="row-actions-menu"
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action, index) => (
          <React.Fragment key={action.id}>
            <DropdownMenuItem
              onClick={(e) => handleActionClick(e, action)}
              disabled={action.disabled ?? false}
              className={cn(
                "focus:bg-primary/10 focus:text-primary",
                action.variant === "destructive" &&
                  "text-destructive focus:bg-destructive/10 focus:text-destructive"
              )}
              data-slot={`row-action-${action.id}`}
            >
              {action.icon && (
                <span className="mr-2 h-4 w-4">{action.icon}</span>
              )}
              {action.label}
            </DropdownMenuItem>
            {action.separator && index < actions.length - 1 && (
              <DropdownMenuSeparator />
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
