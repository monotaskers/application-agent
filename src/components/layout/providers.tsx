'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ClerkProvider type mismatch with exactOptionalPropertyTypes
  const clerkProps: any = resolvedTheme === 'dark'
    ? { appearance: { baseTheme: dark } }
    : {};

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <ClerkProvider {...clerkProps}>
          {children}
        </ClerkProvider>
      </ActiveThemeProvider>
    </>
  );
}
