/**
 * @fileoverview Unified component for search + filter toggle + filters layout
 * @module components/filters-section
 */

"use client";

import React, { useId, type ReactElement } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { FilterToggle } from "./filter-toggle";
import { ColumnVisibilityButton } from "./column-visibility-button";
import { useFilterToggle } from "@/hooks/use-filter-toggle";
import { cn } from "@/lib/utils";
import type { ColumnVisibilityButtonProps } from "./column-visibility-button";

/**
 * Props for FiltersSection component
 */
export interface FiltersSectionProps {
  /** Search input component */
  searchComponent: ReactElement;
  /** Filter controls component */
  filterComponent: ReactElement;
  /** Feature name for localStorage key (e.g., "companies", "users") */
  feature: string;
  /** Column visibility props (optional) - if provided, shows column control button */
  columnVisibility?: Pick<
    ColumnVisibilityButtonProps,
    "columns" | "columnVisibility" | "onToggleVisibility" | "onResetToDefaults"
  >;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Unified component for search + filter toggle + filters layout
 *
 * Provides a consistent layout with search input, filter toggle button,
 * and collapsible filter controls. Filter visibility is persisted to localStorage.
 *
 * @param props - Component props
 * @returns React element containing search and filters section
 *
 * @example
 * ```tsx
 * <FiltersSection
 *   searchComponent={<UserSearch />}
 *   filterComponent={<UserFilters />}
 *   feature="users"
 * />
 * ```
 */
export function FiltersSection({
  searchComponent,
  filterComponent,
  feature,
  columnVisibility,
  className,
}: FiltersSectionProps): ReactElement {
  const { isOpen, toggle, setOpen } = useFilterToggle(feature);
  const contentId = useId();

  return (
    <div
      data-slot="filters-section"
      className={cn("space-y-4 my-6", className)}
    >
      <Collapsible open={isOpen} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 flex-col sm:flex-row">
          <div className="flex-1 w-full">{searchComponent}</div>
          <div className="flex items-center gap-2 shrink-0">
            {columnVisibility && (
              <ColumnVisibilityButton
                columns={columnVisibility.columns}
                columnVisibility={columnVisibility.columnVisibility}
                onToggleVisibility={columnVisibility.onToggleVisibility}
                {...(columnVisibility.onResetToDefaults
                  ? { onResetToDefaults: columnVisibility.onResetToDefaults }
                  : {})}
              />
            )}
            <FilterToggle
              isOpen={isOpen}
              onToggle={toggle}
              contentId={contentId}
              className="hidden"
            />
          </div>
        </div>
        <CollapsibleContent
          id={contentId}
          className="motion-reduce:transition-none"
        >
          {filterComponent}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
