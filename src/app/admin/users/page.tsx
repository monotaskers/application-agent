/**
 * @fileoverview Users list page
 * @module app/admin/users/page
 *
 * Main page for viewing and managing users.
 * Provides search, filters, and infinite scroll pagination.
 */

"use client";

import { type ReactElement } from "react";
import {
  UserList,
  COLUMN_DEFINITIONS,
  DEFAULT_COLUMN_IDS,
} from "@/features/users/components/user-list";
import { UserSearch } from "@/features/users/components/user-search";
import { UserFilters } from "@/features/users/components/user-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FiltersSection } from "@/components/filters-section";
import { useColumnLayout } from "@/features/users/hooks/use-column-layout";

/**
 * Users list page
 *
 * Displays a list of all users with search, filters, and pagination.
 * Allows navigation to user detail pages and creation of new users.
 *
 * @returns React element containing users list page
 */
export default function UsersPage(): ReactElement {
  // Column layout management (shared between FiltersSection and UserList)
  const {
    columnOrder,
    setColumnOrder,
    columnWidths,
    setColumnWidth,
    columnVisibility,
    toggleColumnVisibility,
  } = useColumnLayout(DEFAULT_COLUMN_IDS);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            View and manage all users in the system
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </Link>
      </div>

      <FiltersSection
        searchComponent={<UserSearch />}
        filterComponent={<UserFilters />}
        feature="users"
        columnVisibility={{
          columns: COLUMN_DEFINITIONS,
          columnVisibility,
          onToggleVisibility: toggleColumnVisibility,
        }}
      />

      <div className="flex-1 min-h-0">
        <UserList
          columnLayout={{
            columnOrder,
            setColumnOrder,
            columnWidths,
            setColumnWidth,
            columnVisibility,
            toggleColumnVisibility,
          }}
        />
      </div>
    </div>
  );
}
