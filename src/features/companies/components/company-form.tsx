/**
 * @fileoverview Company creation/editing form component
 * @module features/companies/components/company-form
 *
 * Form for creating and editing companies.
 * Handles form submission and validation.
 */

"use client";

import React, { type ReactElement, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import {
  useCreateCompany,
  useUpdateCompany,
} from "../hooks/use-company-mutations";
import { useCompany } from "../hooks/use-companies";
import {
  createCompanySchema,
  updateCompanySchema,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from "../schemas/company.schema";

/**
 * Props for CompanyForm component
 */
export interface CompanyFormProps {
  /** Optional initial company data for edit mode */
  initialData?: Partial<CreateCompanyInput>;
  /** Company ID for edit mode (if provided, form operates in edit mode) */
  companyId?: string | null;
  /** Callback when form is successfully submitted */
  onSuccess?: () => void;
  /** Callback when form submission is cancelled */
  onCancel?: () => void;
}

/**
 * Company creation/editing form component
 *
 * Provides a form for creating and editing companies with:
 * - Name field (required)
 *
 * @param props - Component props
 * @returns React element containing the company form
 *
 * @example
 * ```tsx
 * <CompanyForm
 *   onSuccess={() => router.push('/admin/companies')}
 *   onCancel={() => router.back()}
 * />
 * ```
 */
export function CompanyForm({
  initialData,
  companyId,
  onSuccess,
  onCancel,
}: CompanyFormProps): ReactElement {
  const router = useRouter();
  const isEditMode = !!companyId;
  const { mutate: createCompany, isPending: isCreating } = useCreateCompany();
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany(
    companyId ?? null
  );
  const isPending = isCreating || isUpdating;

  // Fetch company data in edit mode for updated_at timestamp
  const { data: company } = useCompany(companyId ?? null);

  // Initialize form with appropriate schema based on mode
  const formSchema = useMemo(
    () => (isEditMode ? updateCompanySchema : createCompanySchema),
    [isEditMode]
  );
  const form = useForm<CreateCompanyInput | UpdateCompanyInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  // Handle form submission
  const onSubmit = (data: CreateCompanyInput | UpdateCompanyInput): void => {
    if (isEditMode && companyId) {
      // Include updated_at for optimistic locking (concurrent edit detection)
      const updateData = {
        ...data,
        updated_at:
          (initialData as { updated_at?: string })?.updated_at ||
          company?.updated_at,
      } as UpdateCompanyInput;

      // Update existing company
      updateCompany(
        { id: companyId, data: updateData },
        {
          onSuccess: (updatedCompany) => {
            toast.success("Company updated successfully", {
              description: `Company "${updatedCompany.name}" has been updated.`,
              duration: 5000,
            });
            onSuccess?.();
            router.push("/admin/companies");
          },
          onError: (error) => {
            toast.error("Failed to update company", {
              description:
                error.message ||
                "An error occurred while updating the company.",
              duration: 5000,
            });
          },
        }
      );
    } else {
      // Create new company
      createCompany(data as CreateCompanyInput, {
        onSuccess: (newCompany) => {
          toast.success("Company created successfully", {
            description: `Company "${newCompany.name}" has been created.`,
            duration: 5000,
          });
          onSuccess?.();
          router.push("/admin/companies");
        },
        onError: (error) => {
          toast.error("Failed to create company", {
            description:
              error.message || "An error occurred while creating the company.",
            duration: 5000,
          });
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Company" : "Create New Company"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormInput
                control={form.control}
                name="name"
                label="Company Name"
                description="The name of the company"
                required
                placeholder="Acme Corporation"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Company"
                    : "Create Company"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
