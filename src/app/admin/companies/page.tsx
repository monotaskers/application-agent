/**
 * @fileoverview Companies list page
 * @module app/admin/companies/page
 *
 * Main page for viewing and managing companies.
 * Provides search, filters, and infinite scroll pagination.
 */

"use client";

import { type ReactElement } from "react";
import {
  CompanyList,
  COLUMN_DEFINITIONS,
  DEFAULT_COLUMN_IDS,
} from "@/features/companies/components/company-list";
import { CompanySearch } from "@/features/companies/components/company-search";
import { CompanyFilters } from "@/features/companies/components/company-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FiltersSection } from "@/components/filters-section";
import { useColumnLayout } from "@/features/companies/hooks/use-column-layout";

/**
 * Companies list page
 *
 * Displays a list of all companies with search, filters, and pagination.
 * Allows navigation to company detail pages and creation of new companies.
 *
 * @returns React element containing companies list page
 */
export default function CompaniesPage(): ReactElement {
  // Column layout management (shared between FiltersSection and CompanyList)
  const {
    columnOrder,
    setColumnOrder,
    columnWidths,
    setColumnWidth,
    columnVisibility,
    toggleColumnVisibility,
  } = useColumnLayout(DEFAULT_COLUMN_IDS);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Management</h1>
          <p className="text-muted-foreground">
            View and manage all companies in the system
          </p>
        </div>
        <Link href="/admin/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Company
          </Button>
        </Link>
      </div>

      <FiltersSection
        searchComponent={<CompanySearch />}
        filterComponent={<CompanyFilters />}
        feature="companies"
        columnVisibility={{
          columns: COLUMN_DEFINITIONS,
          columnVisibility,
          onToggleVisibility: toggleColumnVisibility,
        }}
      />

      <div className="flex-1 min-h-0">
        <CompanyList
          columnLayout={{
            columnOrder,
            setColumnOrder,
            columnWidths,
            setColumnWidth,
            columnVisibility,
            toggleColumnVisibility,
          }}
        />
      </div>
    </div>
  );
}

