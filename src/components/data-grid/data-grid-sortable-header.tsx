/**
 * @fileoverview Sortable header component for data grid columns
 * @module components/data-grid/data-grid-sortable-header
 */

"use client";

import React, { type ReactElement } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableHead } from "@/components/ui/table";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Header, Table } from "@tanstack/react-table";

/**
 * Props for DataGridSortableHeader component
 */
export interface DataGridSortableHeaderProps<T = unknown> {
  /** TanStack Table header object */
  header: Header<T, unknown>;
  /** Table instance for resize calculations */
  table: Table<T>;
  /** Child content to render */
  children: React.ReactNode;
  /** Whether drag & drop is enabled */
  enableReordering?: boolean;
  /** Whether column resizing is enabled */
  enableResizing?: boolean;
}

/**
 * Sortable header component for drag-and-drop column reordering
 *
 * Provides drag handles and resize handles for table columns.
 * Integrates with @dnd-kit for drag-and-drop functionality.
 *
 * @param props - Component props
 * @returns React element containing sortable header
 */
export function DataGridSortableHeader<T = unknown>({
  header,
  table,
  children,
  enableReordering = false,
  enableResizing = false,
}: DataGridSortableHeaderProps<T>): ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: header.column.id,
    disabled: !enableReordering,
  });

  const dragStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    ...(transition && { transition }),
    opacity: isDragging ? 0.5 : 1,
  };

  const columnMeta = header.column.columnDef.meta as
    | { className?: string; flexible?: boolean }
    | undefined;

  const columnSize = header.getSize();
  const isFlexible = columnMeta?.flexible ?? false;

  return (
    <TableHead
      className={cn(
        "relative whitespace-nowrap font-semibold",
        isDragging && "ring-2 ring-primary",
        columnMeta?.className
      )}
      style={
        isFlexible
          ? { width: "auto", minWidth: `${header.column.columnDef.minSize ?? 200}px` }
          : { width: `${columnSize}px`, minWidth: `${columnSize}px`, maxWidth: `${columnSize}px` }
      }
      {...(isFlexible && { "data-flexible": "true" })}
    >
      <div
        ref={setNodeRef}
        style={enableReordering ? dragStyle : undefined}
        {...(enableReordering ? attributes : {})}
      >
        <div className="flex items-center gap-2">
          {enableReordering && (
            <button
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none"
              aria-label={`Drag to reorder column ${header.column.id}`}
            >
              <Icons.draggable className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {children}
        </div>
        {/* Resize handle */}
        {enableResizing && (
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={cn(
              "absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none",
              "hover:bg-primary/50 active:bg-primary",
              "transition-colors"
            )}
            style={{
              ...(header.column.getIsResizing() && {
                transform: `translateX(${table.getState().columnSizingInfo.deltaOffset ?? 0}px)`,
              }),
            }}
          />
        )}
      </div>
    </TableHead>
  );
}
