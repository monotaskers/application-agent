/**
 * @fileoverview User creation/editing form component
 * @module features/users/components/user-form
 *
 * Comprehensive form for creating and editing users.
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
import { FormSelect, type FormOption } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { useCreateUser, useUpdateUser } from "../hooks/use-user-mutations";
import { useUser } from "../hooks/use-users";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "../schemas/user.schema";

/**
 * Props for UserForm component
 */
export interface UserFormProps {
  /** Optional initial user data for edit mode */
  initialData?: Partial<CreateUserInput>;
  /** User ID for edit mode (if provided, form operates in edit mode) */
  userId?: string | null;
  /** Callback when form is successfully submitted */
  onSuccess?: () => void;
  /** Callback when form submission is cancelled */
  onCancel?: () => void;
}

/**
 * Role options for the role select field
 */
const ROLE_OPTIONS: FormOption[] = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Superadmin" },
];

/**
 * User creation/editing form component
 *
 * Provides a comprehensive form for creating new users with:
 * - Email and name fields
 * - Role selection
 * - Optional profile fields (avatar, bio, phone)
 *
 * @param props - Component props
 * @returns React element containing the user form
 *
 * @example
 * ```tsx
 * <UserForm
 *   onSuccess={() => router.push('/admin/users')}
 *   onCancel={() => router.back()}
 * />
 * ```
 */
export function UserForm({
  initialData,
  userId,
  onSuccess,
  onCancel,
}: UserFormProps): ReactElement {
  const router = useRouter();
  const isEditMode = !!userId;
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(
    userId ?? null
  );
  const isPending = isCreating || isUpdating;

  // Fetch user data in edit mode for updated_at timestamp
  const { data: user } = useUser(userId ?? null);

  // Initialize form with appropriate schema based on mode
  const formSchema = useMemo(
    () => (isEditMode ? updateUserSchema : createUserSchema),
    [isEditMode]
  );
  const form = useForm<CreateUserInput | UpdateUserInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      email: initialData?.email || "",
      full_name: initialData?.full_name || null,
      role: initialData?.role || "member",
      avatar_url: initialData?.avatar_url || null,
      bio: initialData?.bio || null,
      phone: initialData?.phone || null,
    },
  });

  // Handle form submission
  const onSubmit = (data: CreateUserInput | UpdateUserInput): void => {
    if (isEditMode && userId) {
      // Include updated_at for optimistic locking (concurrent edit detection)
      // Use initialData.updated_at if available, otherwise fetch from user hook
      const updateData = {
        ...data,
        updated_at:
          (initialData as { updated_at?: string })?.updated_at ||
          user?.updated_at,
      } as UpdateUserInput;

      // Update existing user
      updateUser(updateData, {
        onSuccess: (result) => {
          if (result.conflict) {
            toast.warning("User updated with conflicts", {
              description:
                "This user was modified by another admin while you were editing. Your changes have been saved, but you may want to review the latest data.",
              duration: 7000,
            });
          } else {
            toast.success("User updated successfully", {
              description: `User ${result.user.email} has been updated.`,
              duration: 5000,
            });
          }
          onSuccess?.();
          router.push("/admin/users");
        },
        onError: (error) => {
          toast.error("Failed to update user", {
            description:
              error.message || "An error occurred while updating the user.",
            duration: 5000,
          });
        },
      });
    } else {
      // Create new user
      createUser(data as CreateUserInput, {
        onSuccess: (user) => {
          toast.success("User created successfully", {
            description: `User ${user.email} has been created and a magic link has been sent to their email.`,
            duration: 5000,
          });
          onSuccess?.();
          router.push("/admin/users");
        },
        onError: (error) => {
          toast.error("Failed to create user", {
            description:
              error.message || "An error occurred while creating the user.",
            duration: 5000,
          });
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit User" : "Create New User"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Required Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Required Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email Address"
                  description="User's email address"
                  required
                  type="email"
                  placeholder="user@example.com"
                />

                <FormInput
                  control={form.control}
                  name="full_name"
                  label="Full Name"
                  description="User's full name"
                  placeholder="John Doe"
                />
              </div>

              <FormSelect
                control={form.control}
                name="role"
                label="Role"
                description="User's system role"
                required
                options={ROLE_OPTIONS}
                placeholder="Select a role"
              />
            </div>

            {/* Optional Profile Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                Optional Profile Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  control={form.control}
                  name="avatar_url"
                  label="Avatar URL"
                  description="URL to user's avatar image"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                />

                <FormInput
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  description="User's phone number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <FormTextarea
                control={form.control}
                name="bio"
                label="Bio"
                description="User's biography or description"
                placeholder="Enter a brief bio..."
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
                    ? "Update User"
                    : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
