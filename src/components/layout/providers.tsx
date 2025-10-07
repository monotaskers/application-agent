'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();

  // Create properly typed appearance object
  const clerkAppearance = resolvedTheme === 'dark'
    ? { baseTheme: dark } as const
    : undefined;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          <ClerkProvider
            {...(clerkAppearance ? { appearance: clerkAppearance } : {} as any)}
          >
            {children}
          </ClerkProvider>
        </ActiveThemeProvider>
      </QueryClientProvider>
    </>
  );
}
