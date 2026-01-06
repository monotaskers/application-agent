"use client";
import React, { type ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActiveThemeProvider } from "../active-theme";

/**
 * QueryClient instance for TanStack Query
 * Configured with default options for optimal performance
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

/**
 * Providers component
 * Wraps the app with necessary context providers
 * Removed ClerkProvider - now using Supabase Auth
 *
 * @param props - Component props
 * @param props.activeThemeValue - Initial theme value
 * @param props.children - Child components
 * @returns React element containing providers
 */
export default function Providers({
  activeThemeValue,
  children,
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}): ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        {children}
      </ActiveThemeProvider>
    </QueryClientProvider>
  );
}
