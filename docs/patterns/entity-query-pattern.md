# Entity Query Pattern

## Overview

This document describes the pattern for fetching single entities using the shared `useEntityQuery` hook. This pattern eliminates code duplication and ensures consistent error handling, retry logic, and caching across all entity types.

## DRY Pattern: useEntityQuery Hook

**Location**: `src/hooks/use-entity-query.ts`

The `useEntityQuery` hook provides a generic, reusable pattern for fetching single entities with TanStack Query. It handles:
- UUID validation
- Error handling (404s return null, not errors)
- Retry logic (configurable, defaults to no retry on 404s)
- Caching (5 minute default stale time)
- Type safety with Zod validation

### Hook Configuration

```typescript
interface UseEntityQueryConfig<TEntity> {
  id: string | null | undefined;
  endpoint: (id: string) => string;
  responseSchema: z.ZodSchema<{ entity: TEntity }>;
  queryKey: (id: string) => string[];
  entityName?: string;
  errorSchema?: z.ZodSchema<{ error: string; message: string }>;
  options?: {
    enabled?: boolean;
    staleTime?: number;
    retry?: boolean | number | ((failureCount: number, error: Error) => boolean);
  };
}
```

### Example: Feature-Specific Hook

```typescript
// src/features/users/hooks/use-users.ts
import { useEntityQuery } from "@/hooks/use-entity-query";

export function useUser(
  userId: string | null | undefined,
): ReturnType<typeof useEntityQuery<User>> {
  return useEntityQuery<User>({
    id: userId,
    endpoint: (id) => `/api/admin/users/${id}`,
    responseSchema: UserDetailResponseSchema.transform((data) => ({
      entity: data.user,
    })) as unknown as z.ZodSchema<{ entity: User }>,
    queryKey: (id) => ["user", id],
    entityName: "user",
    errorSchema: ErrorResponseSchema,
  });
}
```

## Usage in Components

```tsx
"use client";

import { useUser } from "@/features/users/hooks/use-users";

export function UserDetail({ userId }: { userId: string }): ReactElement {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  if (!user) return <NotFound />;

  return <UserDetailView user={user} />;
}
```

## Key Features

### 1. Automatic 404 Handling

The hook automatically handles 404 errors by returning `null` instead of throwing an error:

```typescript
// In the hook implementation
if (response.status === 404 || error.error === "NOT_FOUND") {
  throw new Error(`${entityName} not found`);
}

// In component
const { data: company } = useCompany(id);
if (!company) {
  // Company not found (404) - not an error state
  return <NotFound />;
}
```

### 2. Configurable Retry Logic

Default behavior: Don't retry 404s, retry other errors up to 3 times.

```typescript
// Custom retry logic example
export function useUser(userId: string | undefined) {
  return useEntityQuery<User>({
    // ... other config
    options: {
      retry: (failureCount, error) => {
        // Don't retry on permanent errors
        if (
          error.message.includes("not found") ||
          error.message.includes("FORBIDDEN")
        ) {
          return false;
        }
        // Retry transient errors up to 3 times
        if (
          error.message.includes("temporarily unavailable") ||
          error.message.includes("timeout")
        ) {
          return failureCount < 3;
        }
        return false;
      },
    },
  });
}
```

### 3. Query Enablement

The query automatically disables when `id` is `null` or `undefined`:

```typescript
const { data } = useUser(null); // Query disabled, won't fetch
const { data } = useUser(undefined); // Query disabled, won't fetch
const { data } = useUser("uuid"); // Query enabled, will fetch
```

### 4. Type Safety with Zod

All responses are validated with Zod schemas:

```typescript
responseSchema: UserDetailResponseSchema.transform((data) => ({
  entity: data.user,
}))
```

## Benefits

1. **Consistency**: All entity queries behave the same way
2. **Type Safety**: Full TypeScript support with generics
3. **Validation**: Built-in Zod schema validation
4. **Caching**: Automatic TanStack Query caching (5 min default stale time)
5. **Error Handling**: Consistent 404 handling (null vs error)
6. **Retry Logic**: Configurable retry behavior
7. **No Code Duplication**: Single source of truth for entity fetching

## When to Use

✅ **Use `useEntityQuery` when:**
- Fetching a single entity by ID
- Need consistent error handling
- Want automatic caching and refetching
- Need type-safe responses

❌ **Don't use `useEntityQuery` when:**
- Fetching lists of entities (use `useEntityList` instead)
- Need server-side fetching (use `fetchEntityServer` instead)
- Need complex query logic that doesn't fit the pattern

## Related Patterns

- **Entity Lists**: See `entity-list-pattern.md` for `useEntityList`
- **Server-Side Fetching**: See `server-side-fetching-pattern.md` for `fetchEntityServer`
- **Column Layout**: See `column-layout-pattern.md` for `useColumnLayout`

## Examples in Codebase

- `src/features/users/hooks/use-users.ts`
