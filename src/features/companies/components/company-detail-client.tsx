/**
 * @fileoverview Client component for company detail page interactivity
 * @module features/companies/components/company-detail-client
 */

"use client";

import { type ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CompanyForm } from "./company-form";
import { useDeleteCompany } from "../hooks/use-company-mutations";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Company } from "../lib/company-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Props for CompanyDetailClient component
 */
export interface CompanyDetailClientProps {
  /** Company data to display */
  company: Company;
  /** Whether user can edit */
  canEdit: boolean;
  /** Whether user can delete */
  canDelete: boolean;
}

/**
 * Client component for company detail page
 *
 * Handles all interactive elements including delete dialog.
 * Receives company data and permissions as props from server component.
 *
 * @param props - Component props
 * @returns React element containing company detail with interactive actions
 */
export function CompanyDetailClient({
  company,
  canEdit,
  canDelete,
}: CompanyDetailClientProps): ReactElement {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany({
    onSuccess: () => {
      toast.success("Company deleted successfully", {
        description: `Company "${company.name}" has been deleted.`,
        duration: 5000,
      });
      router.push("/admin/companies");
    },
    onError: (error) => {
      toast.error("Failed to delete company", {
        description:
          error.message || "An error occurred while deleting the company.",
        duration: 5000,
      });
    },
  });

  // Convert company data to form initial data format
  const initialData = {
    name: company.name,
    updated_at: company.updated_at, // Include for optimistic locking
  };

  const handleDelete = (): void => {
    deleteCompany(company.id);
    setIsDeleteDialogOpen(false);
  };

  const isDeleted = !!company.deleted_at;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isDeleted ? "View Deleted Company" : "Edit Company"}
        </h1>
        {!isDeleted && canDelete && (
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Company
          </Button>
        )}
      </div>
      {canEdit && (
        <CompanyForm companyId={company.id} initialData={initialData} />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{company.name}"? This action
              cannot be undone. All users associated with this company will have
              their company_id set to null.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
