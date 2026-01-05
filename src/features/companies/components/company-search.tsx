/**
 * @fileoverview Search input component for company filtering
 * @module features/companies/components/company-search
 */

"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  type ReactElement,
} from "react";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

/**
 * Props for CompanySearch component
 */
export interface CompanySearchProps {
  /** Additional CSS classes */
  className?: string;
  /** Debounce delay in milliseconds @default 500 */
  debounceMs?: number;
}

/**
 * Search input component for company filtering
 *
 * Provides a debounced search input that syncs with URL parameters.
 * Updates are debounced to reduce API calls while typing.
 *
 * @param props - Component props
 * @returns React element containing search input
 *
 * @example
 * ```tsx
 * <CompanySearch debounceMs={500} />
 * ```
 */
export function CompanySearch({
  className,
  debounceMs = 500,
}: CompanySearchProps): ReactElement {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
    history: "push",
  });
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
    <div data-slot="company-search" className={cn("w-full", className)}>
      <Input
        type="search"
        placeholder="Search companies by name..."
        value={localValue}
        onChange={handleChange}
        aria-label="Search companies"
        className="w-full"
      />
    </div>
  );
}

