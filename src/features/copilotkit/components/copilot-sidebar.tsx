"use client";

import { CopilotSidebar as CopilotKitSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import { ReactElement, useEffect, useState } from "react";
import { useCopilotContext } from "../hooks/use-copilot-context";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

/**
 * CopilotSidebar component wrapper for CopilotKit chat interface.
 *
 * Provides a sidebar-based AI assistant chat interface that users can access
 * from anywhere in the application. The component uses CopilotKit's built-in
 * sidebar component with customizable labels and initial greeting. Automatically
 * injects application context (current page, user role, form data, recent actions)
 * to enable contextual assistance.
 *
 * Features:
 * - Theme system integration (light/dark mode)
 * - Responsive design (mobile/tablet/desktop)
 * - Network connectivity detection
 * - Session expiration handling
 * - Context-aware assistance
 *
 * @component
 * @example
 * ```tsx
 * <CopilotSidebar />
 * ```
 *
 * @returns React element containing the CopilotKit sidebar chat interface
 */
export function CopilotSidebar(): ReactElement {
  const context = useCopilotContext();
  const [isOnline, setIsOnline] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const supabase = createClient();

  // Only render on client to prevent hydration mismatches
  // CopilotKit's internal components can have different styles on server vs client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Inject context into CopilotKit for the AI agent
  useCopilotReadable({
    description:
      "Current application context including page, user role, and recent actions",
    value: context ?? undefined,
  });

  // Monitor network connectivity
  useEffect(() => {
    if (!isMounted) return;

    const handleOnline = (): void => {
      setIsOnline(true);
    };

    const handleOffline = (): void => {
      setIsOnline(false);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isMounted]);

  // Monitor authentication state for session expiration
  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = async (): Promise<void> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, isMounted]);

  // Don't render until mounted on client to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        className="copilot-sidebar-wrapper"
        aria-label="AI Assistant Chat Sidebar"
        role="complementary"
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      className={cn(
        "copilot-sidebar-wrapper",
        !isOnline && "opacity-50 pointer-events-none",
        !isAuthenticated && "hidden"
      )}
      aria-label="AI Assistant Chat Sidebar"
      role="complementary"
      suppressHydrationWarning
    >
      <CopilotKitSidebar
        labels={{
          title: "AI Assistant",
          initial: isOnline
            ? "Hi! I'm your AI assistant. How can I help you today?"
            : "You appear to be offline. Please check your internet connection.",
        }}
        defaultOpen={false}
      />
    </div>
  );
}
