/**
 * @fileoverview Column definitions for user data grid
 * @module features/users/components/user-table-columns
 */

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { User } from "../types/user.types";

/**
 * Sortable column options
 */
export type UserSortColumn =
  | "full_name"
  | "email"
  | "role"
  | "created_at"
  | null;

/**
 * Maps column accessor key to sort column
 *
 * @param accessorKey - Column accessor key
 * @returns Sort column or null if not sortable
 */
export function getUserSortColumn(accessorKey: string): UserSortColumn {
  if (accessorKey === "full_name") return "full_name";
  if (accessorKey === "email") return "email";
  if (accessorKey === "role") return "role";
  if (accessorKey === "created_at") return "created_at";
  return null;
}

/**
 * Creates column definitions for user data grid
 *
 * @param options - Configuration options
 * @param options.onSort - Sort handler function
 * @param options.renderSortIndicator - Function to render sort indicator
 * @returns Array of column definitions
 */
export function createUserColumns(options: {
  onSort: (columnId: string) => void;
  renderSortIndicator: (columnId: string) => React.ReactNode;
}): ColumnDef<User>[] {
  const { onSort, renderSortIndicator } = options;

  return [
    {
      accessorKey: "full_name",
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
      cell: ({ row }) => (
        <div>
          {row.original.full_name || (
            <span className="text-muted-foreground">No name</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "email",
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
            Email
            {isSortable && renderSortIndicator(column.id)}
          </div>
        );
      },
      cell: ({ row }) => (
        <div>
          {row.original.email || (
            <span className="text-muted-foreground">No email</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "role",
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
            Role
            {isSortable && renderSortIndicator(column.id)}
          </div>
        );
      },
      cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <div>
          {row.original.company_name || (
            <span className="text-muted-foreground">No company</span>
          )}
        </div>
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
