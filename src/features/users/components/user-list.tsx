/**
 * @fileoverview User list component for displaying users
 * @module features/users/components/user-list
 */

"use client";

import React, { useMemo, useCallback, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { DataGrid } from "@/components/data-grid";
import { useUsers } from "../hooks/use-users";
import { useUserSearch } from "../hooks/use-user-search";
import { useColumnLayout } from "../hooks/use-column-layout";
import { EmptyState } from "./empty-state";
import { createUserColumns, getUserSortColumn } from "./user-table-columns";
import type { UserWithCompany } from "../types/user.types";
import { Icons } from "@/components/icons";
import type { UseColumnLayoutReturn } from "../hooks/use-column-layout";
// Flatten users from pages
function useFlattenedUsers(data: ReturnType<typeof useUsers>["data"]) {
  return useMemo(() => {
    if (!data?.pages) {
      return [];
    }
    return data.pages.flatMap((page) => page.users);
  }, [data]);
}

/**
 * Props for UserList component
 */
export interface UserListProps {
  /** Additional CSS classes */
  className?: string;
  /** Optional column layout state (if not provided, uses internal hook) */
  columnLayout?: Pick<
    UseColumnLayoutReturn,
    | "columnOrder"
    | "setColumnOrder"
    | "columnWidths"
    | "setColumnWidth"
    | "columnVisibility"
    | "toggleColumnVisibility"
  >;
}

/**
 * Default column IDs in order
 * Exported for use in page-level column layout management
 */
export const DEFAULT_COLUMN_IDS = [
  "full_name",
  "email",
  "role",
  "company",
  "status",
];

/**
 * Column definitions for visibility menu
 * Exported for use in FiltersSection
 */
export const COLUMN_DEFINITIONS = [
  { id: "full_name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "company", label: "Company" },
  { id: "status", label: "Status" },
];

/**
 * User list component for displaying users
 *
 * Provides a table view of users with infinite scroll pagination,
 * sorting, and column customization.
 *
 * @param props - Component props
 * @returns React element containing users list
 */
export function UserList({
  className: _className,
  columnLayout,
}: UserListProps): ReactElement {
  const router = useRouter();
  const [search] = useUserSearch();
  const [role] = useQueryState("role", { defaultValue: "" });
  const [includeDeleted] = useQueryState("include_deleted", {
    defaultValue: false,
    parse: (value) => value === "true",
  });

  // Sort state management
  const [sort, setSort] = useQueryState<
    "full_name" | "email" | "role" | "created_at"
  >("sort", {
    clearOnDefault: true,
    parse: (value) => {
      const validSorts = ["full_name", "email", "role", "created_at"] as const;
      return validSorts.includes(value as (typeof validSorts)[number])
        ? (value as (typeof validSorts)[number])
        : null;
    },
    serialize: (value) => value ?? "",
  });

  const [order, setOrder] = useQueryState<"asc" | "desc">("order", {
    clearOnDefault: true,
    parse: (value) => (value === "desc" ? "desc" : "asc"),
    serialize: (value) => value ?? "asc",
  });

  const filters = useMemo(() => {
    const filterObj: {
      search?: string;
      role?: "member" | "admin" | "superadmin";
      include_deleted?: boolean;
    } = {};

    if (search) filterObj.search = search;
    if (role) filterObj.role = role as "member" | "admin" | "superadmin";
    if (includeDeleted) filterObj.include_deleted = includeDeleted;

    return filterObj;
  }, [search, role, includeDeleted]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsers(filters);

  // Column layout management - use provided or internal
  const internalColumnLayout = useColumnLayout(DEFAULT_COLUMN_IDS);
  const {
    columnOrder,
    setColumnOrder,
    columnWidths,
    setColumnWidth,
    columnVisibility,
  } = columnLayout ?? internalColumnLayout;

  // Flatten all pages of users into a single array
  const users = useFlattenedUsers(data);

  /**
   * Renders sort indicator icon
   */
  const renderSortIndicator = useCallback(
    (columnId: string) => {
      const sortColumn = getUserSortColumn(columnId);
      if (!sortColumn || sort !== sortColumn) {
        return <Icons.arrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
      }

      if (order === "asc") {
        return <Icons.arrowUp className="ml-2 h-4 w-4" />;
      }
      return <Icons.arrowDown className="ml-2 h-4 w-4" />;
    },
    [sort, order]
  );

  // Handle navigation to user details page
  const handleNavigateToDetails = useCallback(
    (user: UserWithCompany) => {
      router.push(`/admin/users/${user.id}`);
    },
    [router]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (columnId: string) => {
      const sortColumn = getUserSortColumn(columnId);
      if (!sortColumn) return;

      // Toggle sort: none -> asc -> desc -> none
      if (!sort || sort !== sortColumn) {
        setSort(sortColumn);
        setOrder("asc");
      } else if (order === "asc") {
        setOrder("desc");
      } else {
        setSort(null);
        setOrder("asc");
      }
    },
    [sort, order, setSort, setOrder]
  );

  // Define table columns
  const columns = useMemo(
    () =>
      createUserColumns({
        onSort: handleSortChange,
        renderSortIndicator,
      }),
    [handleSortChange, renderSortIndicator]
  );

  // Determine if filters are applied
  const hasFilters = useMemo(() => {
    return !!(search || role || companyId || includeDeleted);
  }, [search, role, companyId, includeDeleted]);

  // Empty state component
  const emptyState = useMemo(
    () => (
      <EmptyState
        message={
          hasFilters ? "No users found matching your filters" : "No users found"
        }
      />
    ),
    [hasFilters]
  );

  return (
    <DataGrid<UserWithCompany>
      data={users}
      columns={columns}
      isLoading={isLoading}
      isError={isError}
      error={error}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onFetchNextPage={fetchNextPage}
      onRowClick={handleNavigateToDetails}
      emptyState={emptyState}
      getRowId={(row) => row.id}
      // Enable all column management features
      enableColumnResizing={true}
      enableColumnReordering={true}
      enableColumnVisibility={true}
      enableSorting={true}
      // Column management
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      columnWidths={columnWidths}
      setColumnWidth={setColumnWidth}
      columnVisibility={columnVisibility}
      // Sorting
      sort={sort as string | null}
      order={order ?? "asc"}
      onSortChange={handleSortChange}
      getSortColumn={getUserSortColumn}
      renderSortIndicator={renderSortIndicator}
      {...(_className ? { className: _className } : {})}
    />
  );
}
