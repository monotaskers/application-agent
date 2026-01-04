/**
 * @fileoverview Mutation hook for updating user profile
 * @module features/auth/hooks/use-update-profile
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProfileInput } from "../types/auth.types";
import type { Profile } from "../types/auth.types";

/**
 * Response type for profile update API
 */
interface UpdateProfileResponse {
  profile: Profile;
}

/**
 * Hook for updating user profile
 *
 * Uses TanStack Query mutation to handle profile updates.
 * Invalidates profile queries on success to refresh data.
 *
 * @returns Mutation object with mutate, mutateAsync, and state properties
 *
 * @example
 * ```tsx
 * const updateProfile = useUpdateProfile();
 *
 * const handleSubmit = async (data: UpdateProfileInput) => {
 *   try {
 *     await updateProfile.mutateAsync(data);
 *     // Show success message
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, Error, UpdateProfileInput>({
    mutationFn: async (
      data: UpdateProfileInput
    ): Promise<UpdateProfileResponse> => {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Failed to update profile",
        }));
        throw new Error(errorData.message || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate profile queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
