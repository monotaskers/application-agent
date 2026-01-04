/**
 * @fileoverview Hook for managing column layout state with localStorage persistence
 * @module hooks/use-column-layout
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  getStorageKey,
  loadLayoutFromStorage,
  saveLayoutToStorage,
  type ColumnLayoutConfig,
} from "./use-column-layout-storage";

/**
 * Return type for useColumnLayout hook
 */
export interface UseColumnLayoutReturn {
  /** Current column order */
  columnOrder: string[];
  /** Function to update column order */
  setColumnOrder: (order: string[]) => void;
  /** Current column widths */
  columnWidths: Record<string, number>;
  /** Function to update column width */
  setColumnWidth: (columnId: string, width: number) => void;
  /** Current column visibility */
  columnVisibility: Record<string, boolean>;
  /** Function to toggle column visibility */
  toggleColumnVisibility: (columnId: string) => void;
  /** Function to set column visibility */
  setColumnVisibility: (columnId: string, visible: boolean) => void;
  /** Function to reset all column layout to defaults */
  resetToDefaults: () => void;
}

/**
 * Options for useColumnLayout hook
 */
export interface UseColumnLayoutOptions {
  /** Storage key prefix (e.g., "companies", "users") */
  storagePrefix: string;
  /** Default visibility state for columns (optional, defaults to all visible) */
  defaultVisibility?: Record<string, boolean>;
}

/**
 * Custom hook for managing column layout state with localStorage persistence
 *
 * Manages column order, widths, and visibility with user-specific persistence.
 * Automatically restores layout from localStorage on mount and saves changes.
 *
 * @param defaultColumns - Array of default column IDs in order
 * @param options - Configuration options
 * @param options.storagePrefix - Storage key prefix for localStorage
 * @returns Column layout state and setter functions
 *
 * @example
 * ```tsx
 * const { columnOrder, setColumnOrder, columnWidths, setColumnWidth } = useColumnLayout(
 *   ['name', 'type', 'country'],
 *   { storagePrefix: 'users' }
 * );
 * ```
 */
export function useColumnLayout(
  defaultColumns: string[],
  options: UseColumnLayoutOptions
): UseColumnLayoutReturn {
  const { storagePrefix, defaultVisibility } = options;
  const [userId, setUserId] = useState<string | null>(null);
  const [columnOrder, setColumnOrderState] = useState<string[]>(defaultColumns);
  const [columnWidths, setColumnWidthsState] = useState<Record<string, number>>(
    {}
  );
  const [columnVisibility, setColumnVisibilityState] = useState<
    Record<string, boolean>
  >(
    defaultColumns.reduce(
      (acc, col) => {
        // Use defaultVisibility if provided, otherwise default to true
        acc[col] = defaultVisibility?.[col] ?? true;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  // Get user ID on mount
  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };

    fetchUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Restore layout from localStorage on mount or user change
  useEffect(() => {
    if (!userId) {
      return;
    }

    const storageKey = getStorageKey(userId, storagePrefix);
    const saved = loadLayoutFromStorage(storageKey, defaultColumns, defaultVisibility);

    if (saved) {
      setColumnOrderState(saved.columnOrder);
      setColumnWidthsState(saved.columnWidths);
      setColumnVisibilityState(saved.columnVisibility);
    }
  }, [userId, defaultColumns, storagePrefix, defaultVisibility]);

  // Save layout to localStorage when it changes
  useEffect(() => {
    if (!userId) {
      return;
    }

    const storageKey = getStorageKey(userId, storagePrefix);
    const config: ColumnLayoutConfig = {
      columnOrder,
      columnWidths,
      columnVisibility,
    };

    // Debounce saves to avoid excessive localStorage writes
    const timeoutId = setTimeout(() => {
      saveLayoutToStorage(storageKey, config);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [userId, columnOrder, columnWidths, columnVisibility, storagePrefix]);

  /**
   * Updates column order
   */
  const setColumnOrder = useCallback((order: string[]) => {
    setColumnOrderState(order);
  }, []);

  /**
   * Updates column width
   */
  const setColumnWidth = useCallback((columnId: string, width: number) => {
    setColumnWidthsState((prev) => ({
      ...prev,
      [columnId]: width,
    }));
  }, []);

  /**
   * Toggles column visibility
   */
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumnVisibilityState((prev) => {
      // Prevent hiding all columns (minimum one visible)
      const visibleCount = Object.values(prev).filter((v) => v === true).length;
      if (visibleCount === 1 && prev[columnId] === true) {
        // Last visible column, don't hide it
        return prev;
      }

      const newVisibility = { ...prev };
      newVisibility[columnId] = !prev[columnId];
      return newVisibility;
    });
  }, []);

  /**
   * Sets column visibility
   */
  const setColumnVisibility = useCallback(
    (columnId: string, visible: boolean) => {
      setColumnVisibilityState((prev) => {
        const newVisibility = { ...prev, [columnId]: visible };

        // Prevent hiding all columns (minimum one visible)
        const visibleCount = Object.values(newVisibility).filter(
          (v) => v === true
        ).length;
        if (visibleCount === 0) {
          // All columns hidden, restore previous state
          return prev;
        }

        return newVisibility;
      });
    },
    []
  );

  /**
   * Resets all column layout to defaults
   * Clears localStorage and resets order, widths, and visibility
   */
  const resetToDefaults = useCallback(() => {
    // Reset state to defaults
    setColumnOrderState(defaultColumns);
    setColumnWidthsState({});
    setColumnVisibilityState(
      defaultColumns.reduce(
        (acc, col) => {
          // Use defaultVisibility if provided, otherwise default to true
          acc[col] = defaultVisibility?.[col] ?? true;
          return acc;
        },
        {} as Record<string, boolean>
      )
    );

    // Clear localStorage
    if (userId) {
      const storageKey = getStorageKey(userId, storagePrefix);
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.warn("Failed to clear column layout from localStorage:", error);
      }
    }
  }, [defaultColumns, userId, storagePrefix, defaultVisibility]);

  return {
    columnOrder,
    setColumnOrder,
    columnWidths,
    setColumnWidth,
    columnVisibility,
    toggleColumnVisibility,
    setColumnVisibility,
    resetToDefaults,
  };
}
