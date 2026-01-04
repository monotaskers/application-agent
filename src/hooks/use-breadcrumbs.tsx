"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  "/admin": [], // Admin is not a navigatable route, so no breadcrumbs
  "/admin/employee": [{ title: "Employee", link: "/admin/employee" }],
  // Add more custom mappings as needed
};

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split("/").filter(Boolean);
    // Filter out "admin" segment as it's not a navigatable route
    const filteredSegments = segments.filter((segment) => segment !== "admin");

    return filteredSegments.map((segment, index) => {
      // Reconstruct path including "admin" prefix for navigation, but don't show it in breadcrumbs
      const pathSegments = ["admin", ...filteredSegments.slice(0, index + 1)];
      const path = `/${pathSegments.join("/")}`;

      // Default: capitalize first letter
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
