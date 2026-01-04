/**
 * @fileoverview Client component for user detail page interactivity
 * @module app/admin/users/[userId]/user-detail-client
 */

"use client";

import { type ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserForm } from "@/features/users/components/user-form";
import { DeleteUserDialog } from "@/features/users/components/delete-user-dialog";
import { useRestoreUser } from "@/features/users/hooks/use-user-mutations";
import { toast } from "sonner";
import { Trash2, RotateCcw } from "lucide-react";
import type { UserWithCompany } from "@/features/users/types/user.types";

/**
 * Props for UserDetailClient component
 */
export interface UserDetailClientProps {
  /** User data to display */
  user: UserWithCompany;
  /** Whether user can edit */
  canEdit: boolean;
  /** Whether user can delete */
  canDelete: boolean;
}

/**
 * Client component for user detail page
 *
 * Handles all interactive elements including delete dialog and restore functionality.
 * Receives user data and permissions as props from server component.
 *
 * @param props - Component props
 * @returns React element containing user detail with interactive actions
 */
export function UserDetailClient({
  user,
  canEdit,
  canDelete,
}: UserDetailClientProps): ReactElement {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: restoreUser, isPending: isRestoring } = useRestoreUser();

  // Convert user data to form initial data format
  const initialData = {
    email: user.email || "",
    full_name: user.full_name,
    role: user.role,
    company_id: user.company_id || undefined,
    avatar_url: user.avatar_url,
    bio: user.bio,
    phone: user.phone,
    updated_at: user.updated_at, // Include for optimistic locking
  };

  const handleRestore = (): void => {
    restoreUser(user.id, {
      onSuccess: () => {
        toast.success("User restored successfully", {
          description: `${user.full_name || user.email} has been restored and can now log in.`,
          duration: 5000,
        });
        router.refresh();
      },
      onError: (error) => {
        toast.error("Failed to restore user", {
          description:
            error.message || "An error occurred while restoring the user.",
          duration: 5000,
        });
      },
    });
  };

  const isDeleted = !!user.deleted_at;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isDeleted ? "View Deleted User" : "Edit User"}
        </h1>
        <div className="flex gap-2">
          {isDeleted ? (
            <Button
              onClick={handleRestore}
              disabled={isRestoring}
              variant="outline"
            >
              <RotateCcw className="mr-2 size-4" />
              {isRestoring ? "Restoring..." : "Restore User"}
            </Button>
          ) : (
            canDelete && (
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                variant="destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete User
              </Button>
            )
          )}
        </div>
      </div>
      {canEdit && <UserForm userId={user.id} initialData={initialData} />}
      {user && (
        <DeleteUserDialog
          user={user}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        />
      )}
    </div>
  );
}
