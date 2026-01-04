/**
 * @fileoverview Storage utilities for filter visibility persistence
 * @module hooks/use-filter-toggle-storage
 */

/**
 * Gets localStorage key for filter visibility based on user ID and feature
 *
 * @param userId - User ID for key generation
 * @param feature - Feature name (e.g., "companies", "users")
 * @returns localStorage key string
 */
export function getStorageKey(userId: string | null, feature: string): string {
  return `${feature}-filter-visibility-${userId ?? "anonymous"}`;
}

/**
 * Loads filter visibility from localStorage
 *
 * @param storageKey - localStorage key
 * @returns Filter visibility state (true = open, false = closed) or null if not found/invalid
 */
export function loadFilterVisibility(storageKey: string): boolean | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as unknown;

    // Validate structure - must be a boolean
    if (typeof parsed !== "boolean") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Saves filter visibility to localStorage
 *
 * @param storageKey - localStorage key
 * @param isOpen - Filter visibility state (true = open, false = closed)
 */
export function saveFilterVisibility(
  storageKey: string,
  isOpen: boolean
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(isOpen));
  } catch (error) {
    console.error("Failed to save filter visibility to localStorage:", error);
  }
}

