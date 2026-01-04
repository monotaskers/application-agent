/**
 * @fileoverview Client component for profile view page interactivity
 * @module app/admin/profiles/[userId]/profile-view-client
 */

"use client";

import { type ReactElement } from "react";
import { ProfileViewForm } from "@/features/auth/components/profile-view-form";
import type { LimitedProfile } from "@/features/auth/types/auth.types";

/**
 * Props for ProfileViewClient component
 */
export interface ProfileViewClientProps {
  /** Limited profile data to display */
  profile: LimitedProfile;
}

/**
 * Client component for profile view page
 *
 * Handles rendering of read-only profile view.
 * Receives limited profile data as props from server component.
 *
 * @param props - Component props
 * @returns React element containing read-only profile view
 */
export function ProfileViewClient({
  profile,
}: ProfileViewClientProps): ReactElement {
  return (
    <div className="space-y-6">
      <ProfileViewForm profile={profile} />
    </div>
  );
}
