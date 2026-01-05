/**
 * @fileoverview Column definitions for company data grid
 * @module features/companies/components/company-table-columns
 */

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Company } from "../lib/company-service";

/**
 * Sortable column options
 */
export type CompanySortColumn = "name" | "created_at" | null;

/**
 * Maps column accessor key to sort column
 *
 * @param accessorKey - Column accessor key
 * @returns Sort column or null if not sortable
 */
export function getCompanySortColumn(accessorKey: string): CompanySortColumn {
  if (accessorKey === "name") return "name";
  if (accessorKey === "created_at") return "created_at";
  return null;
}

/**
 * Creates column definitions for company data grid
 *
 * @param options - Configuration options
 * @param options.onSort - Sort handler function
 * @param options.renderSortIndicator - Function to render sort indicator
 * @returns Array of column definitions
 */
export function createCompanyColumns(options: {
  onSort: (columnId: string) => void;
  renderSortIndicator: (columnId: string) => React.ReactNode;
}): ColumnDef<Company>[] {
  const { onSort, renderSortIndicator } = options;

  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        const isSortable = true;
        return (
          <div
            className={cn(
              "flex items-center",
              isSortable && "cursor-pointer select-none hover:text-foreground"
            )}
            onClick={() => isSortable && onSort(column.id)}
          >
            Name
            {isSortable && renderSortIndicator(column.id)}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        const isSortable = true;
        return (
          <div
            className={cn(
              "flex items-center",
              isSortable && "cursor-pointer select-none hover:text-foreground"
            )}
            onClick={() => isSortable && onSort(column.id)}
          >
            Created
            {isSortable && renderSortIndicator(column.id)}
          </div>
        );
      },
      cell: ({ row }) => (
        <div>{new Date(row.original.created_at).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isDeleted = !!row.original.deleted_at;
        return isDeleted ? (
          <Badge variant="destructive">Deleted</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        );
      },
    },
  ];
}
