/**
 * @fileoverview Shared types for entity list components
 * @module components/entity-list/types
 */

import type { ReactElement } from "react";

/**
 * Common props for entity list components
 */
export interface EntityListProps<TEntity> {
  /** Additional CSS classes */
  className?: string;
  /** Entity data array */
  entities: TEntity[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Whether there are more pages to load */
  hasNextPage?: boolean;
  /** Whether next page is being fetched */
  isFetchingNextPage?: boolean;
  /** Callback to load next page */
  onLoadMore?: () => void;
  /** Callback when entity is clicked */
  onEntityClick?: (entity: TEntity) => void;
  /** Empty state component */
  emptyState?: ReactElement;
}

/**
 * Column definition for entity lists
 */
export interface ColumnDefinition {
  /** Unique column ID */
  id: string;
  /** Display label */
  label: string;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Whether column is visible by default */
  visible?: boolean;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  /** Column ID to sort by */
  column: string;
  /** Sort direction */
  direction: "asc" | "desc";
}
