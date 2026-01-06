/**
 * @fileoverview Filter controls component for user filtering
 * @module features/users/components/user-filters
 */

"use client";

import React, { type ReactElement } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

/**
 * Props for UserFilters component
 */
export interface UserFiltersProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Filter controls component for user filtering
 *
 * Provides dropdown filters for role that sync with URL parameters.
 * Allows users to filter users by role.
 *
 * @param props - Component props
 * @returns React element containing filter controls
 *
 * @example
 * ```tsx
 * <UserFilters />
 * ```
 */
export function UserFilters({ className }: UserFiltersProps): ReactElement {
  const [role, setRole] = useQueryState("role", {
    defaultValue: "",
    clearOnDefault: true,
    history: "push",
  });
  const [includeDeleted, setIncludeDeleted] = useQueryState("include_deleted", {
    defaultValue: false,
    parse: (value) => value === "true",
    serialize: (value) => (value ? "true" : ""),
    clearOnDefault: true,
    history: "push",
  });

  const handleClearFilters = (): void => {
    setRole("");
    setIncludeDeleted(false);
  };

  const hasActiveFilters = !!role || includeDeleted;

  return (
    <div
      data-slot="user-filters"
      className={cn("flex flex-col gap-4 sm:flex-row", className)}
    >
      <div className="flex-1 space-y-2">
        <Label htmlFor="role-filter">Role</Label>
        {role ? (
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger id="role-filter" aria-label="Filter by role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superadmin">Superadmin</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select onValueChange={(value) => setRole(value)}>
            <SelectTrigger id="role-filter" aria-label="Filter by role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superadmin">Superadmin</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-end gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-deleted-filter"
            checked={includeDeleted}
            onCheckedChange={(checked) => setIncludeDeleted(checked === true)}
            aria-label="Include deleted users"
          />
          <Label
            htmlFor="include-deleted-filter"
            className="text-sm font-normal cursor-pointer"
          >
            Include deleted users
          </Label>
        </div>

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
