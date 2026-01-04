/**
 * @fileoverview Delete user confirmation dialog component
 * @module features/users/components/delete-user-dialog
 *
 * Provides a confirmation dialog for deleting users with proper warnings.
 */

"use client";

import { type ReactElement } from "react";
import { toast } from "sonner";
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
import { useDeleteUser } from "../hooks/use-user-mutations";
import type { UserWithCompany } from "../types/user.types";

/**
 * Props for DeleteUserDialog component
 */
export interface DeleteUserDialogProps {
  /** User to delete */
  user: UserWithCompany;
  /** Whether dialog is open */
  open: boolean;
  /** Handler for open state changes */
  onOpenChange: (open: boolean) => void;
}

/**
 * Delete user confirmation dialog component
 *
 * Displays a warning dialog before deleting a user. Shows user information
 * and requires confirmation before proceeding with deletion.
 *
 * @param props - Component props
 * @returns React element containing delete confirmation dialog
 *
 * @example
 * ```tsx
 * <DeleteUserDialog
 *   user={user}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */
export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: DeleteUserDialogProps): ReactElement {
  const { mutate: deleteUser, isPending, isError, error } = useDeleteUser();

  const handleDelete = (): void => {
    deleteUser(user.id, {
      onSuccess: () => {
        toast.success("User deleted successfully", {
          description: `${user.full_name || user.email} has been deleted.`,
          duration: 5000,
        });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Failed to delete user", {
          description:
            error.message || "An error occurred while deleting the user.",
          duration: 5000,
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-slot="delete-user-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{user.full_name || user.email}</strong>? This action will
            mark the user as deleted (soft delete), revoke their access, but
            preserve all data for audit purposes. This action cannot be undone
            without restoring the user.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error?.message || "Failed to delete user. Please try again."}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
