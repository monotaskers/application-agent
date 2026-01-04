"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileInputSchema } from "../schemas/profile.schema";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Profile, UpdateProfileInput } from "../types/auth.types";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Props for UserProfileForm component
 */
export interface UserProfileFormProps {
  /** Initial profile data (from SSR) */
  initialProfile?: Profile;
}

/**
 * User profile form component
 *
 * Features:
 * - User-friendly error messages
 * - Loading states
 * - Accessibility (ARIA labels, keyboard navigation)
 * - WCAG AA compliant
 * - Uses React Hook Form with Zod validation
 * - Uses TanStack Query mutation for updates
 *
 * @param props - Component props
 * @returns React element containing the profile form
 */
export function UserProfileForm({
  initialProfile,
}: UserProfileFormProps): React.JSX.Element {
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileInputSchema),
    defaultValues: {
      full_name: initialProfile?.full_name ?? null,
      bio: initialProfile?.bio ?? null,
      avatar_url: initialProfile?.avatar_url ?? null,
      company_email: initialProfile?.company_email ?? null,
      phone: initialProfile?.phone ?? null,
      dashboard_layout_preferences:
        initialProfile?.dashboard_layout_preferences ?? null,
    },
  });

  // Reset form when initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      reset({
        full_name: initialProfile.full_name ?? null,
        bio: initialProfile.bio ?? null,
        avatar_url: initialProfile.avatar_url ?? null,
        company_email: initialProfile.company_email ?? null,
        phone: initialProfile.phone ?? null,
        dashboard_layout_preferences:
          initialProfile.dashboard_layout_preferences ?? null,
      });
    }
  }, [initialProfile, reset]);

  const onSubmit = async (data: UpdateProfileInput): Promise<void> => {
    try {
      await updateProfile.mutateAsync(data);
      router.refresh();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      aria-label="Update profile information"
      noValidate
    >
      {updateProfile.isError && (
        <div
          className="text-sm text-red-500 font-sans"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {updateProfile.error?.message || "Failed to update profile"}
        </div>
      )}

      {updateProfile.isSuccess && (
        <div
          className="text-sm text-green-500 font-sans"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          Profile updated successfully
        </div>
      )}

      <div>
        <Label htmlFor="full_name" className="font-sans font-medium">
          Full Name
        </Label>
        <Input
          id="full_name"
          type="text"
          {...register("full_name")}
          maxLength={255}
          placeholder="Enter your full name"
          className="font-sans"
          aria-invalid={errors.full_name ? "true" : "false"}
          aria-describedby={errors.full_name ? "full-name-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.full_name && (
          <p id="full-name-error" className="text-sm text-red-500 mt-1">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="font-sans font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={initialProfile?.email ?? ""}
          disabled
          className="font-sans bg-muted"
          aria-label="Email address (read-only)"
        />
        <p className="text-xs text-muted-foreground mt-1 font-sans">
          Email cannot be changed
        </p>
      </div>

      <div>
        <Label htmlFor="bio" className="font-sans font-medium">
          Bio
        </Label>
        <Textarea
          id="bio"
          {...register("bio")}
          placeholder="Tell us about yourself"
          className="font-sans min-h-[100px]"
          aria-invalid={errors.bio ? "true" : "false"}
          aria-describedby={errors.bio ? "bio-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.bio && (
          <p id="bio-error" className="text-sm text-red-500 mt-1">
            {errors.bio.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="avatar_url" className="font-sans font-medium">
          Avatar URL
        </Label>
        <Input
          id="avatar_url"
          type="url"
          {...register("avatar_url")}
          placeholder="https://example.com/avatar.jpg"
          className="font-sans"
          aria-invalid={errors.avatar_url ? "true" : "false"}
          aria-describedby={errors.avatar_url ? "avatar-url-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.avatar_url && (
          <p id="avatar-url-error" className="text-sm text-red-500 mt-1">
            {errors.avatar_url.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="company_email" className="font-sans font-medium">
          Company Email
        </Label>
        <Input
          id="company_email"
          type="email"
          {...register("company_email")}
          placeholder="company@example.com"
          className="font-sans"
          aria-invalid={errors.company_email ? "true" : "false"}
          aria-describedby={
            errors.company_email ? "company-email-error" : undefined
          }
          disabled={isSubmitting}
        />
        {errors.company_email && (
          <p id="company-email-error" className="text-sm text-red-500 mt-1">
            {errors.company_email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="font-sans font-medium">
          Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          placeholder="+1234567890"
          className="font-sans"
          aria-invalid={errors.phone ? "true" : "false"}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-red-500 mt-1">
            {errors.phone.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1 font-sans">
          Phone number must be between 5 and 20 characters
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || updateProfile.isPending}
        className="bg-[#5EA500] hover:bg-[#4d8500] font-sans font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={isSubmitting || updateProfile.isPending}
        aria-label={
          isSubmitting || updateProfile.isPending
            ? "Saving profile changes"
            : "Save profile changes"
        }
      >
        {isSubmitting || updateProfile.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
