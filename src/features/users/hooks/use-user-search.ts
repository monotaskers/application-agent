/**
 * @fileoverview Hook for managing user search state with URL synchronization
 * @module features/users/hooks/use-user-search
 */

import { useQueryState } from "nuqs";

/**
 * Custom hook for managing user search state with URL synchronization
 *
 * Uses nuqs to sync search state with URL query parameters.
 * This allows users to share search URLs and use browser back/forward.
 *
 * @returns Tuple of [search, setSearch] where search is the current search term
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useUserSearch();
 *
 * <input
 *   value={search || ''}
 *   onChange={(e) => setSearch(e.target.value)}
 * />
 * ```
 */
export function useUserSearch() {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
    history: "push",
  });

  return [search || "", setSearch] as const;
}
