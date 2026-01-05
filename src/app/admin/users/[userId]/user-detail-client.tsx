/**
 * @fileoverview Client component for user detail page interactivity
 * @module app/admin/users/[userId]/user-detail-client
 */

"use client";

import { type ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserForm } from "@/features/users/components/user-form";
import { DeleteUserDialog } from "@/features/users/components/delete-user-dialog";
import { useRestoreUser } from "@/features/users/hooks/use-user-mutations";
import { toast } from "sonner";
import { Trash2, RotateCcw } from "lucide-react";
import type { User } from "@/features/users/types/user.types";
import type { LimitedProfile } from "@/features/auth/types/auth.types";

/**
 * View mode for user detail page
 */
export type ViewMode = "admin" | "profile";

/**
 * Props for UserDetailClient component
 */
export interface UserDetailClientProps {
  /** User or profile data to display */
  user: User | LimitedProfile;
  /** View mode: 'admin' for full management, 'profile' for read-only limited view */
  viewMode: ViewMode;
  /** Whether user can edit (only applicable in admin mode) */
  canEdit: boolean;
  /** Whether user can delete (only applicable in admin mode) */
  canDelete: boolean;
}

/**
 * Client component for user detail page
 *
 * Handles all interactive elements including delete dialog and restore functionality.
 * Receives user data and permissions as props from server component.
 * Supports both admin view (full user management) and profile view (limited read-only).
 *
 * @param props - Component props
 * @returns React element containing user detail with interactive actions
 */
export function UserDetailClient({
  user,
  viewMode,
  canEdit,
  canDelete,
}: UserDetailClientProps): ReactElement {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: restoreUser, isPending: isRestoring } = useRestoreUser();

  // Type guard to check if user is full User type
  const isFullUser = (u: User | LimitedProfile): u is User => {
    return "email" in u && "role" in u;
  };

  // Profile view mode - read-only limited fields
  if (viewMode === "profile") {
    const profile = user as LimitedProfile;
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Contact information for this user
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name" className="font-sans font-medium">
              Full Name
            </Label>
            <Input
              id="full_name"
              type="text"
              value={profile.full_name ?? ""}
              disabled
              className="font-sans bg-muted"
              aria-label="Full name (read-only)"
            />
          </div>

          {profile.title && (
            <div>
              <Label htmlFor="title" className="font-sans font-medium">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                value={profile.title ?? ""}
                disabled
                className="font-sans bg-muted"
                aria-label="Title (read-only)"
              />
            </div>
          )}

          {profile.phone && (
            <div>
              <Label htmlFor="phone" className="font-sans font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone ?? ""}
                disabled
                className="font-sans bg-muted"
                aria-label="Phone number (read-only)"
              />
            </div>
          )}

          {profile.avatar_url && (
            <div>
              <Label htmlFor="avatar_url" className="font-sans font-medium">
                Avatar
              </Label>
              <div className="mt-2">
                <Image
                  src={profile.avatar_url}
                  alt={`${profile.full_name ?? "User"}'s avatar`}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin view mode - full user management
  const fullUser = user as User;

  // Convert user data to form initial data format
  const initialData = {
    email: fullUser.email || "",
    full_name: fullUser.full_name,
    role: fullUser.role,
    company_id: fullUser.company_id || undefined,
    avatar_url: fullUser.avatar_url,
    bio: fullUser.bio,
    phone: fullUser.phone,
    updated_at: fullUser.updated_at, // Include for optimistic locking
  };

  const handleRestore = (): void => {
    restoreUser(fullUser.id, {
      onSuccess: () => {
        toast.success("User restored successfully", {
          description: `${fullUser.full_name || fullUser.email} has been restored and can now log in.`,
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

  const isDeleted = !!fullUser.deleted_at;

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
      {canEdit && (
        <UserForm userId={fullUser.id} initialData={initialData} />
      )}
      {fullUser && isFullUser(fullUser) && (
        <DeleteUserDialog
          user={fullUser}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        />
      )}
    </div>
  );
}
