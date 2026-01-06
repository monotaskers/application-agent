/**
 * @fileoverview Client component for profile page interactivity
 * @module app/admin/profile/profile-client
 */

"use client";

import { type ReactElement } from "react";
import { UserProfileForm } from "@/features/auth/components/user-profile-form";
import type { Profile } from "@/features/auth/types/auth.types";

/**
 * Props for ProfileClient component
 */
export interface ProfileClientProps {
  /** Profile data to display */
  profile: Profile;
  /** Whether user can edit the profile */
  canEdit: boolean;
}

/**
 * Client component for profile page
 *
 * Handles all interactive elements including profile form.
 * Receives profile data and permissions as props from server component.
 *
 * @param props - Component props
 * @returns React element containing profile with interactive form
 */
export function ProfileClient({
  profile,
  canEdit,
}: ProfileClientProps): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your profile information and settings
        </p>
      </div>

      {canEdit ? (
        <UserProfileForm initialProfile={profile} />
      ) : (
        <div className="text-muted-foreground">
          You don&apos;t have permission to edit your profile.
        </div>
      )}
    </div>
  );
}
