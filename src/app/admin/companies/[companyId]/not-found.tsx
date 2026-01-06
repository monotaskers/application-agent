/**
 * @fileoverview Not found page for company detail
 * @module app/admin/companies/[companyId]/not-found
 */

import { type ReactElement } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Not found page for company detail
 *
 * Displays when a company is not found.
 *
 * @returns React element containing not found message
 */
export default function CompanyNotFound(): ReactElement {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Company Not Found</h1>
      <p className="mb-8 text-muted-foreground">
        The company you&apos;re looking for doesn&apos;t exist or has been deleted.
      </p>
      <Link href="/admin/companies">
        <Button>Back to Companies</Button>
      </Link>
    </div>
  );
}
