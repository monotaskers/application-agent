/**
 * @fileoverview Error boundary for company detail page
 * @module app/admin/companies/[companyId]/error
 */

"use client";

import { type ReactElement, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Error boundary component for company detail page
 *
 * Displays error message and allows retry or navigation back.
 *
 * @param props - Error boundary props
 * @param props.error - Error object
 * @param props.reset - Function to reset error boundary
 * @returns React element containing error message
 */
export default function CompanyDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactElement {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Company detail error:", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
      <p className="mb-8 text-muted-foreground">
        {error.message || "An error occurred while loading the company."}
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Link href="/admin/companies">
          <Button variant="outline">Back to Companies</Button>
        </Link>
      </div>
    </div>
  );
}
