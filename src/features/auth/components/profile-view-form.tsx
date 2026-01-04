/**
 * @fileoverview Read-only profile view component for viewing other users' profiles
 * @module features/auth/components/profile-view-form
 */

"use client";

import { type ReactElement } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { LimitedProfile } from "../types/auth.types";

/**
 * Props for ProfileViewForm component
 */
export interface ProfileViewFormProps {
  /** Limited profile data to display */
  profile: LimitedProfile;
}

/**
 * Read-only profile view component
 *
 * Displays limited profile information for other users.
 * Only shows fields visible to users with business relationships:
 * - Full name
 * - Company email
 * - Phone
 * - Avatar URL
 *
 * @param props - Component props
 * @returns React element containing read-only profile view
 */
export function ProfileViewForm({
  profile,
}: ProfileViewFormProps): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
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

        <div>
          <Label htmlFor="company_email" className="font-sans font-medium">
            Company Email
          </Label>
          <Input
            id="company_email"
            type="email"
            value={profile.company_email ?? ""}
            disabled
            className="font-sans bg-muted"
            aria-label="Company email (read-only)"
          />
        </div>

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
