/**
 * @fileoverview Search input component for user filtering
 * @module features/users/components/user-search
 */

"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  type ReactElement,
} from "react";
import { Input } from "@/components/ui/input";
import { useUserSearch } from "../hooks/use-user-search";
import { cn } from "@/lib/utils";

/**
 * Props for UserSearch component
 */
export interface UserSearchProps {
  /** Additional CSS classes */
  className?: string;
  /** Debounce delay in milliseconds @default 500 */
  debounceMs?: number;
}

/**
 * Search input component for user filtering
 *
 * Provides a debounced search input that syncs with URL parameters.
 * Updates are debounced to reduce API calls while typing.
 *
 * @param props - Component props
 * @returns React element containing search input
 *
 * @example
 * ```tsx
 * <UserSearch debounceMs={500} />
 * ```
 */
export function UserSearch({
  className,
  debounceMs = 500,
}: UserSearchProps): ReactElement {
  const [search, setSearch] = useUserSearch();
  const [localValue, setLocalValue] = useState(search ?? "");

  // Update local value when URL search changes (e.g., browser back/forward)
  useEffect(() => {
    setLocalValue(search ?? "");
  }, [search]);

  // Debounced update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== (search ?? "")) {
        setSearch(localValue);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [localValue, search, setSearch, debounceMs]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <div data-slot="user-search" className={cn("w-full", className)}>
      <Input
        type="search"
        placeholder="Search users by name or email..."
        value={localValue}
        onChange={handleChange}
        aria-label="Search users"
        className="w-full"
      />
    </div>
  );
}
