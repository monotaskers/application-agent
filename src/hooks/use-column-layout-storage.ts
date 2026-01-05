/**
 * @fileoverview Storage utilities for column layout persistence
 * @module hooks/use-column-layout-storage
 */

/**
 * Column layout configuration stored in localStorage
 */
export interface ColumnLayoutConfig {
  /** Column order array */
  columnOrder: string[];
  /** Column widths mapping */
  columnWidths: Record<string, number>;
  /** Column visibility mapping */
  columnVisibility: Record<string, boolean>;
}

/**
 * Gets the storage key for a user's column layout
 *
 * @param userId - User ID (null for anonymous)
 * @param prefix - Storage key prefix (e.g., "companies", "users")
 * @returns Storage key string
 */
export function getStorageKey(userId: string | null, prefix: string): string {
  const userPart = userId ?? "anonymous";
  return `column-layout-${prefix}-${userPart}`;
}

/**
 * Loads column layout from localStorage
 *
 * @param storageKey - Storage key to load from
 * @param defaultColumns - Default column order if no saved layout exists
 * @param defaultVisibility - Default visibility state for columns (optional)
 * @returns Column layout config or null if not found/invalid
 */
export function loadLayoutFromStorage(
  storageKey: string,
  defaultColumns: string[],
  defaultVisibility?: Record<string, boolean>
): ColumnLayoutConfig | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<ColumnLayoutConfig>;

    // Validate structure
    if (
      !parsed.columnOrder ||
      !Array.isArray(parsed.columnOrder) ||
      !parsed.columnWidths ||
      typeof parsed.columnWidths !== "object" ||
      !parsed.columnVisibility ||
      typeof parsed.columnVisibility !== "object"
    ) {
      return null;
    }

    // Ensure all default columns are present
    const validOrder = defaultColumns.filter((col) =>
      parsed.columnOrder?.includes(col)
    );
    const missingColumns = defaultColumns.filter(
      (col) => !parsed.columnOrder?.includes(col)
    );
    const completeOrder = [...validOrder, ...missingColumns];

    // Build visibility state, ensuring at least one column is visible
    const visibility = defaultColumns.reduce(
      (acc, col) => {
        // Use saved visibility if available, otherwise use defaultVisibility, otherwise true
        acc[col] =
          parsed.columnVisibility?.[col] ?? defaultVisibility?.[col] ?? true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    // Ensure at least one column is visible (safeguard against corrupted state)
    const visibleCount = Object.values(visibility).filter(
      (v) => v === true
    ).length;
    if (visibleCount === 0 && defaultColumns.length > 0) {
      // If all columns are hidden, make the first column visible
      visibility[defaultColumns[0] ?? ""] = true;
    }

    return {
      columnOrder: completeOrder,
      columnWidths: parsed.columnWidths ?? {},
      columnVisibility: visibility,
    };
  } catch {
    return null;
  }
}

/**
 * Saves column layout to localStorage
 *
 * @param storageKey - Storage key to save to
 * @param config - Column layout config to save
 */
export function saveLayoutToStorage(
  storageKey: string,
  config: ColumnLayoutConfig
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(config));
  } catch (error) {
    // Silently fail if localStorage is full or unavailable
    console.warn("Failed to save column layout to localStorage:", error);
  }
}
