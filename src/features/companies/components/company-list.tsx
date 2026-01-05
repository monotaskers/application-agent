/**
 * @fileoverview Company list component for displaying companies
 * @module features/companies/components/company-list
 */

"use client";

import React, { useMemo, useCallback, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { DataGrid } from "@/components/data-grid";
import { useCompanies } from "../hooks/use-companies";
import { useColumnLayout } from "../hooks/use-column-layout";
import { EmptyState } from "./empty-state";
import { createCompanyColumns, getCompanySortColumn } from "./company-table-columns";
import type { Company } from "../lib/company-service";
import { Icons } from "@/components/icons";
import type { UseColumnLayoutReturn } from "../hooks/use-column-layout";

// Flatten companies from pages
function useFlattenedCompanies(data: ReturnType<typeof useCompanies>["data"]) {
  return useMemo(() => {
    if (!data?.pages) {
      return [];
    }
    return data.pages.flatMap((page) => page.companies);
  }, [data]);
}

/**
 * Props for CompanyList component
 */
export interface CompanyListProps {
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
export const DEFAULT_COLUMN_IDS = ["name", "created_at", "status"];

/**
 * Column definitions for visibility menu
 * Exported for use in FiltersSection
 */
export const COLUMN_DEFINITIONS = [
  { id: "name", label: "Name" },
  { id: "created_at", label: "Created" },
  { id: "status", label: "Status" },
];

/**
 * Company list component for displaying companies
 *
 * Provides a table view of companies with infinite scroll pagination,
 * sorting, and column customization.
 *
 * @param props - Component props
 * @returns React element containing companies list
 */
export function CompanyList({
  className: _className,
  columnLayout,
}: CompanyListProps): ReactElement {
  const router = useRouter();
  const [search] = useQueryState("search", { defaultValue: "" });
  const [includeDeleted] = useQueryState("include_deleted", {
    defaultValue: false,
    parse: (value) => value === "true",
  });

  // Sort state management
  const [sort, setSort] = useQueryState<"name" | "created_at">("sort", {
    clearOnDefault: true,
    parse: (value) => {
      const validSorts = ["name", "created_at"] as const;
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
      include_deleted?: boolean;
    } = {};

    if (search) filterObj.search = search;
    if (includeDeleted) filterObj.include_deleted = includeDeleted;

    return filterObj;
  }, [search, includeDeleted]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCompanies(filters);

  // Column layout management - use provided or internal
  const internalColumnLayout = useColumnLayout(DEFAULT_COLUMN_IDS);
  const {
    columnOrder,
    setColumnOrder,
    columnWidths,
    setColumnWidth,
    columnVisibility,
  } = columnLayout ?? internalColumnLayout;

  // Flatten all pages of companies into a single array
  const companies = useFlattenedCompanies(data);

  /**
   * Renders sort indicator icon
   */
  const renderSortIndicator = useCallback(
    (columnId: string) => {
      const sortColumn = getCompanySortColumn(columnId);
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

  // Handle navigation to company details page
  const handleNavigateToDetails = useCallback(
    (company: Company) => {
      router.push(`/admin/companies/${company.id}`);
    },
    [router]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (columnId: string) => {
      const sortColumn = getCompanySortColumn(columnId);
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
      createCompanyColumns({
        onSort: handleSortChange,
        renderSortIndicator,
      }),
    [handleSortChange, renderSortIndicator]
  );

  // Determine if filters are applied
  const hasFilters = useMemo(() => {
    return !!(search || includeDeleted);
  }, [search, includeDeleted]);

  // Empty state component
  const emptyState = useMemo(
    () => (
      <EmptyState
        message={
          hasFilters ? "No companies found matching your filters" : "No companies found"
        }
      />
    ),
    [hasFilters]
  );

  return (
    <DataGrid<Company>
      data={companies}
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
      getSortColumn={getCompanySortColumn}
      renderSortIndicator={renderSortIndicator}
      {...(_className ? { className: _className } : {})}
    />
  );
}

