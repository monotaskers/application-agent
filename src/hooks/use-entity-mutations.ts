/**
 * @fileoverview Generic mutation hooks factory for entity CRUD operations
 * @module hooks/use-entity-mutations
 *
 * Provides reusable mutation hooks for create, update, and delete operations
 * with automatic cache invalidation and optional redirects.
 */

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";

/**
 * Configuration for create mutation
 */
export interface CreateMutationConfig<TEntity> {
  /** API endpoint for creating entity */
  endpoint: string;
  /** Zod schema for validating the response */
  responseSchema: z.ZodSchema<{ entity: TEntity }>;
  /** Zod schema for validating error responses (optional) */
  errorSchema?: z.ZodSchema<{ error: string; message: string }>;
  /** Query keys to invalidate on success */
  queryKeys: string[];
  /** Optional function to generate redirect path from created entity */
  redirectPath?: (entity: TEntity) => string;
  /** Entity name for error messages */
  entityName?: string;
}

/**
 * Configuration for update mutation
 */
export interface UpdateMutationConfig<TEntity> {
  /** Function to generate API endpoint from entity ID */
  endpoint: (id: string) => string;
  /** Zod schema for validating the response */
  responseSchema: z.ZodSchema<{ entity: TEntity }>;
  /** Zod schema for validating error responses (optional) */
  errorSchema?: z.ZodSchema<{ error: string; message: string }>;
  /** Function to generate query keys to invalidate on success */
  queryKeys: {
    /** Query key for the entity detail */
    detail: (id: string) => string[];
    /** Query keys for entity lists */
    list: string[];
  };
  /** Optional function to generate redirect path from updated entity */
  redirectPath?: (entity: TEntity) => string;
  /** Entity name for error messages */
  entityName?: string;
  /** Whether to handle concurrent update errors (409 status) */
  handleConcurrentUpdate?: boolean;
}

/**
 * Configuration for delete mutation
 * @template TResponse - Response type from delete operation (used in function signature)
 */
export interface DeleteMutationConfig<TResponse = unknown> {
  /** Function to generate API endpoint from entity ID */
  endpoint: (id: string) => string;
  /** Zod schema for validating error responses (optional) */
  errorSchema?: z.ZodSchema<{ error: string; message: string }>;
  /** Query keys to invalidate on success */
  queryKeys: {
    /** Query key pattern for entity detail (will be invalidated for all entities) */
    detail: string[];
    /** Query keys for entity lists */
    list: string[];
  };
  /** Optional redirect path after deletion */
  redirectPath?: string;
  /** Entity name for error messages */
  entityName?: string;
  /** @internal Type parameter used for function signature inference */
  readonly _?: TResponse;
}

/**
 * Options for mutation hooks
 */
export interface MutationOptions<TEntity, TError = Error> {
  /** Callback when mutation succeeds */
  onSuccess?: (data: TEntity) => void;
  /** Callback when mutation fails */
  onError?: (error: TError) => void;
}

/**
 * Creates a mutation hook for creating entities
 *
 * @param config - Configuration for the create mutation
 * @param options - Optional mutation options
 * @returns Mutation hook result
 */
export function useCreateEntity<TEntity, TInput>(
  config: CreateMutationConfig<TEntity>,
  options?: MutationOptions<TEntity, Error>
): UseMutationResult<TEntity, Error, TInput> {
  const {
    endpoint,
    responseSchema,
    errorSchema,
    queryKeys,
    redirectPath,
    entityName = "entity",
  } = config;
  const { onSuccess, onError } = options ?? {};

  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<TEntity, Error, TInput>({
    mutationFn: async (data: TInput): Promise<TEntity> => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "UNKNOWN_ERROR",
          message: `Failed to create ${entityName}`,
        }));

        if (errorSchema) {
          const error = errorSchema.parse(errorData);
          throw new Error(error.message);
        }

        throw new Error(errorData.message || `Failed to create ${entityName}`);
      }

      const responseData = await response.json();
      const validated = responseSchema.parse(responseData);
      return validated.entity;
    },
    onSuccess: (entity) => {
      // Invalidate list queries
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Optionally redirect
      if (redirectPath) {
        router.push(redirectPath(entity));
      }

      // Call custom success callback
      onSuccess?.(entity);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}

/**
 * Creates a mutation hook for updating entities
 *
 * @param config - Configuration for the update mutation
 * @param options - Optional mutation options
 * @returns Mutation hook result
 */
export function useUpdateEntity<TEntity, TInput>(
  config: UpdateMutationConfig<TEntity>,
  options?: MutationOptions<TEntity, Error>
): UseMutationResult<TEntity, Error, { id: string; data: TInput }> {
  const {
    endpoint,
    responseSchema,
    errorSchema,
    queryKeys,
    redirectPath,
    entityName = "entity",
    handleConcurrentUpdate = false,
  } = config;
  const { onSuccess, onError } = options ?? {};

  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<TEntity, Error, { id: string; data: TInput }>({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TInput;
    }): Promise<TEntity> => {
      const response = await fetch(endpoint(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "UNKNOWN_ERROR",
          message: `Failed to update ${entityName}`,
        }));

        if (errorSchema) {
          const error = errorSchema.parse(errorData);

          // Handle concurrent update error specifically
          if (
            handleConcurrentUpdate &&
            response.status === 409 &&
            error.error === "CONCURRENT_UPDATE"
          ) {
            const concurrentError = new Error(error.message);
            (
              concurrentError as Error & { code: string; details?: unknown }
            ).code = "CONCURRENT_UPDATE";
            (
              concurrentError as Error & { code: string; details?: unknown }
            ).details = (errorData as { details?: unknown }).details;
            throw concurrentError;
          }

          throw new Error(error.message);
        }

        throw new Error(errorData.message || `Failed to update ${entityName}`);
      }

      const responseData = await response.json();
      const validated = responseSchema.parse(responseData);
      return validated.entity;
    },
    onSuccess: (entity) => {
      // Invalidate detail query
      queryClient.invalidateQueries({
        queryKey: queryKeys.detail((entity as { id: string }).id),
      });

      // Invalidate list queries
      queryKeys.list.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Optionally redirect
      if (redirectPath) {
        router.push(redirectPath(entity));
      }

      // Call custom success callback
      onSuccess?.(entity);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}

/**
 * Creates a mutation hook for deleting entities
 *
 * @param config - Configuration for the delete mutation
 * @param options - Optional mutation options
 * @returns Mutation hook result
 */
export function useDeleteEntity<TResponse = unknown>(
  config: DeleteMutationConfig<TResponse>,
  options?: MutationOptions<TResponse, Error>
): UseMutationResult<TResponse, Error, string> {
  const { queryKeys, redirectPath } = config;
  const { onSuccess, onError } = options ?? {};
  const entityName = config.entityName ?? "entity";

  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<TResponse, Error, string>({
    mutationFn: async (id: string): Promise<TResponse> => {
      const response = await fetch(config.endpoint(id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "UNKNOWN_ERROR",
          message: `Failed to delete ${entityName}`,
        }));

        if (config.errorSchema) {
          const error = config.errorSchema.parse(errorData);
          throw new Error(error.message);
        }

        throw new Error(errorData.message || `Failed to delete ${entityName}`);
      }

      // If response has body, parse it; otherwise return void
      if (response.headers.get("content-length") === "0") {
        return undefined as TResponse;
      }

      const data = await response.json();
      return data as TResponse;
    },
    onSuccess: (response) => {
      // Invalidate detail queries (all entities)
      queryKeys.detail.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Invalidate list queries
      queryKeys.list.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Optionally redirect
      if (redirectPath) {
        router.push(redirectPath);
      }

      // Call custom success callback
      onSuccess?.(response);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
}
