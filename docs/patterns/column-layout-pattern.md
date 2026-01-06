# Column Layout Pattern

## Overview

This document describes the pattern for managing column layouts (order, width, visibility) using the shared `useColumnLayout` hook. This pattern provides consistent column customization across all data grids with localStorage persistence.

## DRY Pattern: useColumnLayout Hook

**Location**: `src/hooks/use-column-layout.ts`

The `useColumnLayout` hook provides a generic, reusable pattern for managing column layouts with user-specific localStorage persistence. It handles:
- Column order management
- Column width management
- Column visibility toggling
- User-specific persistence
- Automatic save/restore

### Hook Configuration

```typescript
interface UseColumnLayoutOptions {
  storagePrefix: string; // e.g., "companies", "users"
}

interface UseColumnLayoutReturn {
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
  columnWidths: Record<string, number>;
  setColumnWidth: (columnId: string, width: number) => void;
  columnVisibility: Record<string, boolean>;
  toggleColumnVisibility: (columnId: string) => void;
  setColumnVisibility: (columnId: string, visible: boolean) => void;
}
```

### Example: Feature-Specific Hook

```typescript
// src/features/users/hooks/use-column-layout.ts
import {
  useColumnLayout as useSharedColumnLayout,
  type UseColumnLayoutReturn,
} from "@/hooks/use-column-layout";

export function useUsersColumnLayout(
  defaultColumns: string[],
): UseColumnLayoutReturn {
  return useSharedColumnLayout(defaultColumns, {
    storagePrefix: "users",
  });
}
```

## Usage in Components

```tsx
"use client";

import { useUsersColumnLayout } from "@/features/users/hooks/use-column-layout";
import { DataGrid } from "@/components/data-grid";

const DEFAULT_COLUMN_IDS = ["email", "full_name", "role", "created_at"];

export function UsersList(): ReactElement {
  const {
    columnOrder,
    setColumnOrder,
    columnWidths,
    setColumnWidth,
    columnVisibility,
    toggleColumnVisibility,
  } = useUsersColumnLayout(DEFAULT_COLUMN_IDS);

  // ... data fetching logic

  return (
    <DataGrid
      data={assessments}
      columns={columns}
      columnOrder={columnOrder}
      onColumnOrderChange={setColumnOrder}
      columnWidths={columnWidths}
      onColumnWidthChange={setColumnWidth}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={toggleColumnVisibility}
    />
  );
}
```

## Key Features

### 1. User-Specific Persistence

Layout preferences are saved per user in localStorage:

```typescript
// Storage key format: `column-layout-${userId}-${storagePrefix}`
// Example: `column-layout-abc123-users`
```

### 2. Automatic Save/Restore

Layout changes are automatically saved with debouncing (300ms):

```typescript
// Changes are debounced to avoid excessive localStorage writes
useEffect(() => {
  const timeoutId = setTimeout(() => {
    saveLayoutToStorage(storageKey, config);
  }, 300);
  return () => clearTimeout(timeoutId);
}, [columnOrder, columnWidths, columnVisibility]);
```

### 3. Minimum Visibility Constraint

At least one column must always be visible:

```typescript
// Prevents hiding all columns
toggleColumnVisibility("name"); // Won't hide if it's the last visible column
```

### 4. Default Column Restoration

If no saved layout exists, uses default column order:

```typescript
const saved = loadLayoutFromStorage(storageKey, defaultColumns);
if (saved) {
  // Use saved layout
} else {
  // Use defaultColumns
}
```

## Benefits

1. **Consistency**: All data grids have the same column customization behavior
2. **Persistence**: User preferences are saved automatically
3. **User-Specific**: Each user has their own layout preferences
4. **Type Safety**: Full TypeScript support
5. **No Code Duplication**: Single source of truth for column layout logic

## When to Use

✅ **Use `useColumnLayout` when:**
- Building a data grid with customizable columns
- Need column order, width, or visibility management
- Want user-specific persistence

❌ **Don't use `useColumnLayout` when:**
- Columns are fixed and not customizable
- Don't need persistence
- Need different layout behavior than the standard pattern

## Storage Structure

Layout is stored in localStorage with this structure:

```typescript
interface ColumnLayoutConfig {
  columnOrder: string[];
  columnWidths: Record<string, number>;
  columnVisibility: Record<string, boolean>;
}
```

Storage key format: `column-layout-${userId}-${storagePrefix}`

## Related Patterns

- **Entity Lists**: See `entity-list-pattern.md` for complete list component pattern
- **Entity Query**: See `entity-query-pattern.md` for single entity fetching
- **Server-Side Fetching**: See `server-side-fetching-pattern.md` for server-side utilities

## Examples in Codebase

- `src/features/users/hooks/use-column-layout.ts`
