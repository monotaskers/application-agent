/**
 * @fileoverview TanStack Query mutation hooks for user operations
 * @module features/users/hooks/use-user-mutations
 *
 * Provides mutation hooks for creating, updating, deleting, and restoring users.
 * All hooks use TanStack Query for server state management and automatic cache invalidation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserInput, UpdateUserInput } from "../schemas/user.schema";
import type { User } from "../types/user.types";

/**
 * Creates a new user via the API
 *
 * @param data - User creation data
 * @returns Promise resolving to created user
 * @throws Error if creation fails
 */
async function createUserAPI(data: CreateUserInput): Promise<User> {
  const response = await fetch("/api/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "UNKNOWN_ERROR",
      message: "Failed to create user",
    }));

    throw new Error(errorData.message || "Failed to create user");
  }

  const responseData = await response.json();
  return responseData.user;
}

/**
 * Custom hook for creating users with TanStack Query
 *
 * Provides mutation functionality with automatic cache invalidation.
 * Invalidates the users list cache after successful creation.
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const { mutate: createUser, isPending, error } = useCreateUser();
 *
 * createUser({
 *   email: "user@example.com",
 *   role: "member",
 *   email: "user@example.com",
 * });
 * ```
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserAPI,
    onSuccess: () => {
      // Invalidate users list to refetch with new user
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/**
 * Updates an existing user via the API
 *
 * @param userId - User ID to update
 * @param data - User update data
 * @returns Promise resolving to updated user and conflict flag
 * @throws Error if update fails
 */
async function updateUserAPI(
  userId: string,
  data: UpdateUserInput
): Promise<{ user: User; conflict: boolean }> {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "UNKNOWN_ERROR",
      message: "Failed to update user",
    }));

    throw new Error(errorData.message || "Failed to update user");
  }

  const responseData = await response.json();
  return {
    user: responseData.user,
    conflict: responseData.conflict || false,
  };
}

/**
 * Custom hook for updating users with TanStack Query
 *
 * Provides mutation functionality with automatic cache invalidation.
 * Invalidates both the specific user cache and the users list cache after successful update.
 *
 * @param userId - User ID to update
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const { mutate: updateUser, isPending, error } = useUpdateUser('user-id');
 *
 * updateUser({
 *   full_name: "Updated Name",
 *   role: "admin",
 * });
 * ```
 */
export function useUpdateUser(userId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => {
      if (!userId) {
        throw new Error("User ID is required for updates");
      }
      return updateUserAPI(userId, data);
    },
    onSuccess: (result) => {
      if (!userId) return;
      // Invalidate specific user cache
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      // Invalidate users list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Update the cache with the new data
      queryClient.setQueryData(["user", userId], result.user);
    },
  });
}

/**
 * Deletes a user via the API
 *
 * @param userId - User ID to delete
 * @returns Promise resolving to success message
 * @throws Error if deletion fails
 */
async function deleteUserAPI(userId: string): Promise<void> {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "UNKNOWN_ERROR",
      message: "Failed to delete user",
    }));

    throw new Error(errorData.message || "Failed to delete user");
  }
}

/**
 * Custom hook for deleting users with TanStack Query
 *
 * Provides mutation functionality with automatic cache invalidation.
 * Invalidates both the specific user cache and the users list cache after successful deletion.
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const { mutate: deleteUser, isPending, error } = useDeleteUser();
 *
 * deleteUser("user-id");
 * ```
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserAPI,
    onSuccess: (_, userId) => {
      // Invalidate specific user cache
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      // Invalidate users list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Remove the deleted user from cache
      queryClient.removeQueries({ queryKey: ["user", userId] });
    },
  });
}

/**
 * Restores a soft-deleted user via the API
 *
 * @param userId - User ID to restore
 * @returns Promise resolving to restored user
 * @throws Error if restoration fails
 */
async function restoreUserAPI(userId: string): Promise<User> {
  const response = await fetch(`/api/admin/users/${userId}/restore`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "UNKNOWN_ERROR",
      message: "Failed to restore user",
    }));

    throw new Error(errorData.message || "Failed to restore user");
  }

  const responseData = await response.json();
  return responseData.user;
}

/**
 * Custom hook for restoring users with TanStack Query
 *
 * Provides mutation functionality with automatic cache invalidation.
 * Invalidates both the specific user cache and the users list cache after successful restoration.
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const { mutate: restoreUser, isPending, error } = useRestoreUser();
 *
 * restoreUser("user-id");
 * ```
 */
export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreUserAPI,
    onSuccess: (user) => {
      // Invalidate specific user cache
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      // Invalidate users list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Update the cache with the restored user
      queryClient.setQueryData(["user", user.id], user);
    },
  });
}
