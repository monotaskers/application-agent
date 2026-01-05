/**
 * @fileoverview New company creation page
 * @module app/admin/companies/new/page
 *
 * Page for creating new companies.
 */

import { type ReactElement } from "react";
import { CompanyForm } from "@/features/companies/components/company-form";

/**
 * New company creation page
 *
 * Displays a form for creating new companies.
 *
 * @returns React element containing the new company form page
 */
export default function NewCompanyPage(): ReactElement {
  return (
    <div className="mx-auto max-w-3xl">
      <CompanyForm />
    </div>
  );
}
