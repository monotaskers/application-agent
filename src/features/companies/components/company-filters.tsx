/**
 * @fileoverview Filter controls component for company filtering
 * @module features/companies/components/company-filters
 */

"use client";

import React, { type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

/**
 * Props for CompanyFilters component
 */
export interface CompanyFiltersProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Filter controls component for company filtering
 *
 * Provides checkbox filter for including deleted companies that syncs with URL parameters.
 *
 * @param props - Component props
 * @returns React element containing filter controls
 *
 * @example
 * ```tsx
 * <CompanyFilters />
 * ```
 */
export function CompanyFilters({ className }: CompanyFiltersProps): ReactElement {
  const [includeDeleted, setIncludeDeleted] = useQueryState("include_deleted", {
    defaultValue: false,
    parse: (value) => value === "true",
    serialize: (value) => (value ? "true" : ""),
    clearOnDefault: true,
    history: "push",
  });

  const handleClearFilters = (): void => {
    setIncludeDeleted(false);
  };

  const hasActiveFilters = !!includeDeleted;

  return (
    <div
      data-slot="company-filters"
      className={cn("flex flex-col gap-4 sm:flex-row", className)}
    >
      <div className="flex-1 space-y-2">
        <Label htmlFor="include-deleted-filter">Filters</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-deleted-filter"
            checked={includeDeleted}
            onCheckedChange={(checked) => setIncludeDeleted(checked === true)}
            aria-label="Include deleted companies"
          />
          <Label
            htmlFor="include-deleted-filter"
            className="text-sm font-normal cursor-pointer"
          >
            Include deleted companies
          </Label>
        </div>
      </div>

      <div className="flex items-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          aria-label="Clear all filters"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}

