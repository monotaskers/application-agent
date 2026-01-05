"use client";

import { cn } from "@/lib/utils";
import type { ReactElement } from "react";

interface LogoProps {
  /**
   * Size variant of the logo
   * @default "default"
   */
  size?: "small" | "default" | "large";
  /**
   * Custom className for additional styling
   */
  className?: string;
  /**
   * Whether this is the sidebar logo variant (smaller, different viewBox)
   * @default false
   */
  variant?: "default" | "sidebar";
}

/**
 * AppName logo component with theme-aware colors
 *
 * Uses brand primary color on light theme and brand accent color on dark theme.
 * Renders the logo as an inline SVG to support CSS variable theming.
 *
 * @component
 * @example
 * ```tsx
 * <Logo size="large" />
 * <Logo variant="sidebar" size="small" />
 * ```
 */
export function Logo({
  size = "default",
  className,
  variant = "default",
}: LogoProps): ReactElement {
  const sizeClasses = {
    small: variant === "sidebar" ? "h-6 w-6" : "h-16 w-16",
    default: variant === "sidebar" ? "h-6 w-6" : "h-24 w-24",
    large: variant === "sidebar" ? "h-8 w-8" : "h-[115px] w-[115px]",
  };

  if (variant === "sidebar") {
    return (
      <svg
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        overflow="visible"
        style={{ display: "block" }}
        viewBox="0 0 16 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size], className)}
        aria-label="AppName"
        role="img"
      >
        <path
          id="Vector"
          d="M8 1L15 20L8 16L1 20L8 1Z"
          fill="var(--logo-icon-color)"
          stroke="var(--logo-icon-color)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      overflow="visible"
      style={{ display: "block" }}
      viewBox="0 0 77 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
      aria-label="AppName"
      role="img"
    >
      <path
        id="Vector"
        d="M38.587 5L72.1739 96.1646L38.587 76.9721L5 96.1646L38.587 5Z"
        fill="var(--logo-icon-color)"
        stroke="var(--logo-icon-color)"
        strokeWidth="9.59627"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
