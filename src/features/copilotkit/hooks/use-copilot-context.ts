"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { buildApplicationContext } from "../lib/context-builder";
import type { ApplicationContext } from "../types";

/**
 * Custom hook for gathering application context for CopilotKit.
 *
 * Collects current page, user role/permissions, form data, and recent actions
 * to provide contextual assistance to the AI agent. The context is validated
 * using the ApplicationContext Zod schema before being returned.
 *
 * @param formData - Optional active form data to include in context
 * @param recentActions - Optional array of recent user actions
 * @returns ApplicationContext object with current application state
 *
 * @example
 * ```tsx
 * const context = useCopilotContext();
 * // Use context with CopilotKit's useCopilotReadable or useCopilotAction
 * ```
 */
export function useCopilotContext(
  formData?: Record<string, unknown>,
  recentActions?: string[]
): ApplicationContext | null {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch user data on mount and listen for auth state changes
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Build context object when all data is available
  const context = useMemo(() => {
    if (loading || !user) {
      return null;
    }

    // Extract user role from metadata or default to "user"
    const userRole =
      (user.user_metadata?.role as string | undefined) ||
      (user.app_metadata?.role as string | undefined) ||
      "user";

    try {
      const contextData: {
        currentPage: string;
        userRole: string;
        userId: string;
        formData?: Record<string, unknown>;
        recentActions?: string[];
      } = {
        currentPage: pathname,
        userRole,
        userId: user.id,
      };

      if (formData !== undefined) {
        contextData.formData = formData;
      }

      if (recentActions !== undefined) {
        contextData.recentActions = recentActions;
      }

      return buildApplicationContext(contextData);
    } catch (error) {
      console.error("Failed to build application context:", error);
      return null;
    }
  }, [loading, user, pathname, formData, recentActions]);

  return context;
}
