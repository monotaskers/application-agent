# Server-Side Fetching Pattern

## Overview

This document describes the pattern for server-side entity fetching using the shared `fetchEntityServer` utility. This pattern is used in Server Components, API routes, and server-side utilities to eliminate code duplication and ensure consistent data fetching behavior.

## DRY Pattern: fetchEntityServer Utility

**Location**: `src/lib/fetch-entity-server.ts`

The `fetchEntityServer` utility provides a generic, reusable pattern for fetching entities directly from Supabase on the server. It handles:
- UUID validation
- Error handling
- Schema validation with Zod
- Optional custom filters
- Type safety

### Utility Configuration

```typescript
interface FetchEntityConfig<T> {
  table: string;
  schema: z.ZodSchema<T>;
  idSchema?: z.ZodSchema<string>;
  select?: string;
  additionalFilters?: (query: any) => any;
  entityName?: string;
}
```

### Example: Feature-Specific Server Utility

```typescript
// src/features/users/lib/fetch-user-server.ts
import { fetchEntityServer } from "@/lib/fetch-entity-server";
import { UserSchema } from "../schemas/user.schema";

export async function fetchUserServer(
  id: string,
  supabaseClient?: SupabaseClient,
): Promise<User | null> {
  return fetchEntityServer(
    id,
    {
      table: "profiles",
      schema: UserSchema,
      additionalFilters: (query) => query.is("deleted_at", null),
      entityName: "user",
    },
    supabaseClient,
  );
}
```

## Usage in Server Components

```tsx
// src/app/admin/users/[userId]/page.tsx
import { fetchUserServer } from "@/features/users/lib/fetch-user-server";
import { requirePermission } from "@/lib/auth/permissions";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<ReactElement> {
  const { userId } = await params;
  
  // Auth check
  const { user } = await requirePermission(PERMISSIONS.users.view);
  
  // Fetch data server-side
  const userData = await fetchUserServer(userId);
  
  if (!userData) {
    notFound();
  }
  
  return <UserDetailClient user={userData} />;
}
```

## Usage in API Routes

```typescript
// src/app/api/admin/users/[userId]/route.ts
import { fetchUserServer } from "@/features/users/lib/fetch-user-server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  
  const user = await fetchUserServer(userId);
  
  if (!user) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "User not found" },
      { status: 404 },
    );
  }
  
  return NextResponse.json({ user });
}
```

## Key Features

### 1. UUID Validation

The utility automatically validates UUID format:

```typescript
// Invalid UUID throws error
await fetchUserServer("invalid-id"); // Throws Zod validation error

// Valid UUID proceeds
await fetchUserServer("e79f5e8e-7e19-4f78-97f4-eba979362d39"); // OK
```

### 2. Custom Filters

Add additional query filters for soft deletes, permissions, etc.:

```typescript
export async function fetchUserServer(id: string) {
  return fetchEntityServer(id, {
    table: "profiles",
    schema: UserSchema,
    // Only fetch non-deleted users
    additionalFilters: (query) => query.is("deleted_at", null),
    entityName: "user",
  });
}
```

### 3. Custom Select Queries

Specify which columns to fetch:

```typescript
export async function fetchUserServer(id: string) {
  return fetchEntityServer(id, {
    table: "profiles",
    schema: UserSchema,
    select: "id, email, full_name, role",
    entityName: "user",
  });
}
```

### 4. Schema Validation

All data is validated with Zod schemas before returning:

```typescript
// Invalid data throws error
const user = await fetchUserServer(id);
// User data is validated and typed as User
```

### 5. Null Returns for Not Found

Returns `null` for 404 errors (PGRST116), not exceptions:

```typescript
const user = await fetchUserServer(id);
if (!user) {
  // User not found
  notFound();
}
```

## Benefits

1. **Consistency**: All server-side fetching behaves the same way
2. **Type Safety**: Full TypeScript support with generics
3. **Validation**: Built-in Zod schema validation
4. **Reusability**: Single utility used by Server Components and API routes
5. **Error Handling**: Consistent error handling (null for 404s)
6. **No Code Duplication**: Single source of truth for server-side fetching

## When to Use

✅ **Use `fetchEntityServer` when:**
- Fetching data in Server Components
- Fetching data in API routes
- Need direct Supabase access (bypassing API)
- Want consistent validation and error handling

❌ **Don't use `fetchEntityServer` when:**
- Fetching data in Client Components (use `useEntityQuery` instead)
- Need client-side caching/refetching (use `useEntityQuery` instead)
- Need complex joins or aggregations (create custom utility)

## SSR Pattern Integration

This utility is a key part of the SSR pattern:

1. **Server Component** (`page.tsx`) - Uses `fetchEntityServer` to fetch data
2. **Client Component** (`*-client.tsx`) - Receives data as props
3. **Shared Utility** (`fetch-*-server.ts`) - Wraps `fetchEntityServer` with feature-specific config

See `server-side-rendering.md` for complete SSR pattern documentation.

## Related Patterns

- **Entity Query (Client)**: See `entity-query-pattern.md` for `useEntityQuery`
- **Entity Lists**: See `entity-list-pattern.md` for `useEntityList`
- **Server-Side Rendering**: See `server-side-rendering.md` for complete SSR pattern

## Examples in Codebase

- `src/features/users/lib/fetch-user-server.ts`
