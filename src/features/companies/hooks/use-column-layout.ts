/**
 * @fileoverview Hook for managing column layout state with localStorage persistence
 * @module features/companies/hooks/use-column-layout
 *
 * Re-exports the shared useColumnLayout hook with companies-specific storage prefix.
 */

import {
  useColumnLayout as useSharedColumnLayout,
  type UseColumnLayoutReturn,
} from "@/hooks/use-column-layout";

/**
 * Return type for useColumnLayout hook
 */
export type { UseColumnLayoutReturn };

/**
 * Custom hook for managing column layout state with localStorage persistence
 *
 * Manages column order, widths, and visibility with company-specific persistence.
 * Automatically restores layout from localStorage on mount and saves changes.
 *
 * @param defaultColumns - Array of default column IDs in order
 * @returns Column layout state and setter functions
 */
export function useColumnLayout(
  defaultColumns: string[]
): UseColumnLayoutReturn {
  return useSharedColumnLayout(defaultColumns, {
    storagePrefix: "companies",
  });
}

