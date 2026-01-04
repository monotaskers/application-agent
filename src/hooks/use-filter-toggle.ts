/**
 * @fileoverview Hook for managing filter visibility state with localStorage persistence
 * @module hooks/use-filter-toggle
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  getStorageKey,
  loadFilterVisibility,
  saveFilterVisibility,
} from "./use-filter-toggle-storage";

/**
 * Return type for useFilterToggle hook
 */
export interface UseFilterToggleReturn {
  /** Whether filters are currently open */
  isOpen: boolean;
  /** Function to toggle filter visibility */
  toggle: () => void;
  /** Function to set filter visibility */
  setOpen: (open: boolean) => void;
}

/**
 * Custom hook for managing filter visibility state with localStorage persistence
 *
 * Manages filter visibility with user-specific persistence.
 * Automatically restores visibility from localStorage on mount and saves changes.
 *
 * @param feature - Feature name (e.g., "companies", "users")
 * @returns Filter visibility state and control functions
 *
 * @example
 * ```tsx
 * const { isOpen, toggle, setOpen } = useFilterToggle("companies");
 * ```
 */
export function useFilterToggle(feature: string): UseFilterToggleReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpenState] = useState<boolean>(false);

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

  // Restore visibility from localStorage on mount or user change
  useEffect(() => {
    if (userId === null) {
      // Wait for user ID to be determined
      return;
    }

    const storageKey = getStorageKey(userId, feature);
    const saved = loadFilterVisibility(storageKey);

    if (saved !== null) {
      setIsOpenState(saved);
    }
    // If saved is null, keep default (false = hidden)
  }, [userId, feature]);

  // Save visibility to localStorage when it changes
  useEffect(() => {
    if (userId === null) {
      return;
    }

    const storageKey = getStorageKey(userId, feature);

    // Debounce saves to avoid excessive localStorage writes
    const timeoutId = setTimeout(() => {
      saveFilterVisibility(storageKey, isOpen);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [userId, feature, isOpen]);

  /**
   * Toggles filter visibility
   */
  const toggle = useCallback(() => {
    setIsOpenState((prev) => !prev);
  }, []);

  /**
   * Sets filter visibility
   */
  const setOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
  }, []);

  return {
    isOpen,
    toggle,
    setOpen,
  };
}

