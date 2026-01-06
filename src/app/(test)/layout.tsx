/**
 * @fileoverview Layout for test route group
 * @module app/(test)/layout
 *
 * Provides a layout that allows scrolling for test pages.
 * Overrides the root layout's overflow-hidden to enable page scrolling.
 */

import { type ReactElement, type ReactNode } from "react";

/**
 * Test layout component
 *
 * Wraps test pages with a container that allows scrolling.
 * This overrides the root layout's overflow-hidden behavior.
 *
 * @param props - Layout props
 * @returns Layout element
 */
export default function TestLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <div className="h-screen overflow-y-auto">{children}</div>;
}
