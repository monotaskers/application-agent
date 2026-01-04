# Entity List Component Pattern

## Overview

This document describes the common pattern used for entity list components across the application (users). All entity list components use the shared `useEntityList` hook to eliminate code duplication and ensure consistent behavior.

## Common Structure

All entity list components follow a similar structure:

1. **Data Fetching**: Use shared `useEntityList` hook (wraps TanStack Query's `useInfiniteQuery`)
2. **Column Layout**: Use shared `useColumnLayout` hook
3. **Sorting**: Use `useQueryState` for URL-based sort state
4. **Filtering**: Use feature-specific filter hooks
5. **DataGrid**: Use shared `DataGrid` component
6. **Empty States**: Feature-specific empty state components

## DRY Pattern: useEntityList Hook

**Location**: `src/hooks/use-entity-list.ts`

The `useEntityList` hook provides a generic, reusable pattern for fetching paginated entity lists with infinite scroll. It supports both cursor-based and offset-based pagination.

### Hook Configuration

```typescript
interface UseEntityListConfig<TEntity, TFilters, TPageParam, TResponse> {
  filters: TFilters;
  endpoint: string;
  buildParams: (filters: TFilters, pageParam: TPageParam) => URLSearchParams;
  responseSchema: z.ZodSchema<TResponse>;
  queryKey: (string | TFilters)[];
  getNextPageParam: (lastPage: TResponse, allPages: TResponse[]) => TPageParam | undefined;
  initialPageParam: TPageParam;
  pageSize?: number;
  staleTime?: number;
  initialData?: TEntity[];
}
```

### Example: Feature-Specific Hook

```typescript
// src/features/users/hooks/use-users.ts
import { useEntityList } from "@/hooks/use-entity-list";

export function useUsers(filters: UserFilters = {}) {
  return useEntityList<
    UsersResponse["users"][number],
    UserFilters,
    number,
    UsersResponse
  >({
    filters,
    endpoint: "/api/admin/users",
    buildParams: (filters, pageParam) => {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.role) params.append("role", filters.role);
      params.append("offset", pageParam.toString());
      params.append("limit", DEFAULT_PAGE_SIZE.toString());
      return params;
    },
    responseSchema: UsersResponseSchema,
    queryKey: ["users"],
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.pagination.has_next) {
        return undefined;
      }
      return allPages.length * DEFAULT_PAGE_SIZE;
    },
    initialPageParam: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
}
```

## Pattern Example

```tsx
"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { DataGrid } from "@/components/data-grid";
import { useUsers } from "@/features/users/hooks/use-users";
import { useColumnLayout } from "@/hooks/use-column-layout";
import { EmptyState } from "./empty-state";
import { createEntityColumns } from "./entity-table-columns";

export function EntityList(): ReactElement {
  const router = useRouter();
  
  // Sort state
  const [sort, setSort] = useQueryState<"name" | "created_at">("sort", {
    clearOnDefault: true,
    parse: (value) => {
      const validSorts = ["name", "created_at"] as const;
      return validSorts.includes(value as (typeof validSorts)[number])
        ? (value as (typeof validSorts)[number])
        : null;
    },
  });

  const [order, setOrder] = useQueryState<"asc" | "desc">("order", {
    clearOnDefault: true,
    parse: (value) => (value === "desc" ? "desc" : "asc"),
  });

  // Data fetching using shared hook
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsers({ search, role });

  // Column layout
  const DEFAULT_COLUMN_IDS = ["name", "type", "created_at"];
  const { columnOrder, setColumnOrder, columnWidths, setColumnWidth } =
    useColumnLayout(DEFAULT_COLUMN_IDS);

  // Flatten pages
  const entities = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.entities);
  }, [data]);

  // Navigation
  const handleEntityClick = useCallback(
    (entity: Entity) => {
      router.push(`/admin/entities/${entity.id}`);
    },
    [router],
  );

  // Render
  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  const columns = createEntityColumns({
    sort,
    order,
    onSortChange: setSort,
    onOrderChange: setOrder,
  });

  return (
    <DataGrid
      data={entities}
      columns={columns}
      columnOrder={columnOrder}
      onColumnOrderChange={setColumnOrder}
      columnWidths={columnWidths}
      onColumnWidthChange={setColumnWidth}
      onRowClick={handleEntityClick}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      onLoadMore={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      emptyState={<EmptyState />}
    />
  );
}
```

## Key Patterns

### 1. Infinite Scroll Pagination
- **Use shared `useEntityList` hook** - Handles all pagination logic
- Flatten pages with `useMemo`
- Pass `hasNextPage` and `onLoadMore` to DataGrid

### 2. URL-Based State
- Use `useQueryState` from `nuqs` for sort/filter state
- Enables shareable URLs and browser back/forward

### 3. Column Customization
- Use shared `useColumnLayout` hook (see `column-layout-pattern.md`)
- Export `DEFAULT_COLUMN_IDS` and `COLUMN_DEFINITIONS` for filters

### 4. Error Handling
- Check `isError` and display error message
- Use error boundaries for unexpected errors
- `useEntityList` provides consistent error handling

### 5. Loading States
- Pass `isLoading` to DataGrid for initial load
- Pass `isFetchingNextPage` for pagination loading
- `useEntityList` manages all loading states automatically

## Benefits of Using useEntityList

1. **Consistency**: All entity lists behave the same way
2. **Type Safety**: Full TypeScript support with generics
3. **Validation**: Built-in Zod schema validation
4. **Caching**: Automatic TanStack Query caching (5 min default stale time)
5. **Error Handling**: Consistent error handling across all lists
6. **SSR Support**: Optional `initialData` for server-side rendering
7. **Flexibility**: Supports both cursor and offset pagination

## Differences Between Features

While the pattern is similar, each feature has domain-specific differences:

- **Users**: Requires role fetching from auth.users

These differences are handled in:
- Feature-specific hooks that wrap `useEntityList` (e.g., `useUsers`)
- Feature-specific column definitions
- Feature-specific filter hooks

## When to Create a New List Component

1. **Create feature-specific hook** that wraps `useEntityList`:
   ```typescript
   // src/features/[feature]/hooks/use-[entities].ts
   export function useEntities(filters: EntityFilters = {}) {
     return useEntityList<...>({ ... });
   }
   ```

2. Use shared `useColumnLayout` hook (see `column-layout-pattern.md`)
3. Use shared `DataGrid` component
4. Create feature-specific column definitions
5. Create feature-specific empty states

## Related Patterns

- **Single Entity Fetching**: See `entity-query-pattern.md` for `useEntityQuery`
- **Server-Side Fetching**: See `server-side-fetching-pattern.md` for `fetchEntityServer`
- **Column Layout**: See `column-layout-pattern.md` for `useColumnLayout`
