/**
 * @fileoverview Event handlers for data grid components
 * @module components/data-grid/data-grid-handlers
 */

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  SortHandlerOptions,
  DragEndHandlerOptions,
  RowClickHandlerOptions,
  KeyboardHandlerOptions,
  ScrollHandlerOptions,
} from "./types";

/**
 * Creates a sort handler function
 *
 * @param options - Sort handler options
 * @returns Sort handler function
 */
export function createSortHandler(options: SortHandlerOptions) {
  const { sort, order, setSort, setOrder, getSortColumn } = options;

  return (columnId: string): void => {
    const sortColumn = getSortColumn
      ? getSortColumn(columnId)
      : (columnId as string | null);
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
  };
}

/**
 * Creates a drag end handler function
 *
 * @param options - Drag end handler options
 * @returns Drag end handler function
 */
export function createDragEndHandler(options: DragEndHandlerOptions) {
  const { setColumnOrder, currentOrder } = options;

  return (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);
      const newOrder = arrayMove([...currentOrder], oldIndex, newIndex);
      setColumnOrder(newOrder);
    }
  };
}

/**
 * Creates a row click handler function
 *
 * @param options - Row click handler options
 * @returns Row click handler function
 */
export function createRowClickHandler<T = unknown>(
  options: RowClickHandlerOptions<T>
) {
  const { onNavigate, getRowId } = options;

  return (row: T, event: React.MouseEvent<HTMLTableRowElement>): void => {
    // Don't navigate if clicking on a button or interactive element
    const target = event.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.closest("a")
    ) {
      return;
    }

    const rowId = getRowId(row);
    onNavigate(rowId, row);
  };
}

/**
 * Creates a keyboard navigation handler function
 *
 * @param options - Keyboard handler options
 * @returns Keyboard handler function
 */
export function createKeyboardHandler<T = unknown>(
  options: KeyboardHandlerOptions<T>
) {
  const { onNavigate, getRowId } = options;

  return (row: T, event: React.KeyboardEvent<HTMLTableRowElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const rowId = getRowId(row);
      onNavigate(rowId, row);
    }
  };
}

/**
 * Creates a scroll handler function for infinite pagination
 *
 * @param options - Scroll handler options
 * @returns Scroll handler function
 */
export function createScrollHandler(options: ScrollHandlerOptions) {
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = options;

  return (e: React.UIEvent<HTMLDivElement>): void => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
}
