---
title: "Authorization Patterns"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/auth/gateways/api.ts"
  - "src/lib/auth/gateways/server.ts"
  - "src/lib/auth/gateways/client.ts"
  - "src/lib/auth/gateways/components.ts"
---

# Authorization Patterns

## Overview

This document describes authorization patterns for protecting API routes, server components, and client components. The system provides type-safe authorization utilities for different contexts.

## Authorization Contexts

The authorization system provides different utilities for different contexts:

1. **API Routes**: Wrapper functions for route handlers
2. **Server Components**: Functions for server-side authorization
3. **Client Components**: Hooks for client-side authorization
4. **Component-Level**: Higher-order components for component protection

## API Route Authorization

API routes use wrapper functions to enforce authorization.

### Authentication Only

Require authentication without permission checks:

```typescript
import { withAuth } from '@/lib/auth/gateways/api';

export const GET = withAuth(async (request, { user, role }) => {
  // User is authenticated
  return NextResponse.json({ userId: user.id });
});
```

### Permission-Based Authorization

Require specific permission:

```typescript
import { withPermission } from '@/lib/auth/gateways/api';
import { PERMISSIONS } from '@/lib/auth/permissions';

export const GET = withPermission(
  PERMISSIONS.companies.view,
  async (request, { user, role }) => {
    // User has companies.view permission
    return NextResponse.json({ companies: [] });
  }
);
```

### Multiple Permissions

Require any of the specified permissions:

```typescript
import { withAnyPermission } from '@/lib/auth/gateways/api';

export const GET = withAnyPermission(
  [PERMISSIONS.companies.view, PERMISSIONS.companies.viewAll],
  async (request, { user, role }) => {
    // User has at least one permission
  }
);
```

Require all of the specified permissions:

```typescript
import { withAllPermissions } from '@/lib/auth/gateways/api';

export const DELETE = withAllPermissions(
  [PERMISSIONS.companies.view, PERMISSIONS.companies.delete],
  async (request, { user, role }) => {
    // User has all permissions
  }
);
```

### Role-Based Authorization

Require specific role:

```typescript
import { withRole } from '@/lib/auth/gateways/api';

export const GET = withRole('admin', async (request, { user, role }) => {
  // User has admin role
});
```

Require minimum role level:

```typescript
import { withMinRole } from '@/lib/auth/gateways/api';

export const GET = withMinRole('admin', async (request, { user, role }) => {
  // User has admin or superadmin role
});
```

### Available API Wrappers

- `withAuth(handler)`: Requires authentication only
- `withPermission(permission, handler)`: Requires specific permission
- `withAnyPermission(permissions[], handler)`: Requires any permission
- `withAllPermissions(permissions[], handler)`: Requires all permissions
- `withRole(role, handler)`: Requires specific role
- `withMinRole(role, handler)`: Requires minimum role

### Error Responses

Unauthorized requests return:

```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

Forbidden requests return:

```json
{
  "error": "FORBIDDEN",
  "message": "Permission 'companies.view' required",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

## Server Component Authorization

Server components use functions to enforce authorization.

### Authentication Only

```typescript
import { requireAuth } from '@/lib/auth/gateways/server';

export default async function Page() {
  const { user, role } = await requireAuth();
  // User is authenticated
  return <div>Welcome {user.email}</div>;
}
```

### Permission-Based Authorization

Route-level permission check:

```typescript
import { requirePermission } from '@/lib/auth/gateways/server';
import { PERMISSIONS } from '@/lib/auth/permissions';

export default async function Page() {
  // Throws redirect if user doesn't have permission
  const { user } = await requirePermission(PERMISSIONS.companies.view);
  return <CompanyList />;
}
```

Action-level permission checks:

```typescript
import { requireAuth, hasPermission } from '@/lib/auth/gateways/server';
import { PERMISSIONS } from '@/lib/auth/permissions';

export default async function Page() {
  const { user } = await requireAuth();
  
  // Check permissions for actions
  const canEdit = await hasPermission(user, PERMISSIONS.companies.edit);
  const canDelete = await hasPermission(user, PERMISSIONS.companies.delete);
  
  // Pass permissions to client component
  return (
    <CompanyDetailClient
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}
```

### Multiple Permissions

```typescript
import { requireAnyPermission, requireAllPermissions } from '@/lib/auth/gateways/server';

// Require any permission
const { user } = await requireAnyPermission([
  PERMISSIONS.companies.view,
  PERMISSIONS.companies.viewAll,
]);

// Require all permissions
const { user } = await requireAllPermissions([
  PERMISSIONS.companies.view,
  PERMISSIONS.companies.edit,
]);
```

### Role-Based Authorization

```typescript
import { requireRole, requireMinRole } from '@/lib/auth/gateways/server';

// Require specific role
const { user } = await requireRole('admin');

// Require minimum role
const { user } = await requireMinRole('admin'); // admin or superadmin
```

### Available Server Functions

- `requireAuth()`: Requires authentication, throws redirect if not authenticated
- `getAuth()`: Gets auth state without throwing (returns null if not authenticated)
- `requirePermission(permission)`: Requires specific permission
- `requireAnyPermission(permissions[])`: Requires any permission
- `requireAllPermissions(permissions[])`: Requires all permissions
- `requireRole(role)`: Requires specific role
- `requireMinRole(role)`: Requires minimum role
- `hasPermission(user, permission)`: Returns boolean (non-throwing)
- `hasAnyPermission(user, permissions[])`: Returns boolean
- `hasAllPermissions(user, permissions[])`: Returns boolean

### Redirect Behavior

- **Not Authenticated**: Redirects to `/auth/sign-in`
- **Insufficient Permissions**: Redirects to `/admin?error=insufficient_permissions`

## Client Component Authorization

Client components use hooks for authorization.

### Authentication State

```typescript
"use client";
import { useAuth } from '@/lib/auth/gateways/client';

export function Component() {
  const { user, role, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;
  
  return <div>Welcome {user.email}</div>;
}
```

### Permission-Based Authorization

```typescript
"use client";
import { useHasPermission } from '@/lib/auth/gateways/client';
import { PERMISSIONS } from '@/lib/auth/permissions';

export function Component() {
  const canEdit = useHasPermission(PERMISSIONS.companies.edit);
  const canDelete = useHasPermission(PERMISSIONS.companies.delete);
  
  return (
    <>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </>
  );
}
```

### Require Authentication

```typescript
"use client";
import { useRequireAuth } from '@/lib/auth/gateways/client';

export function ProtectedComponent() {
  useRequireAuth(); // Redirects if not authenticated
  return <div>Protected content</div>;
}
```

### Role-Based Authorization

```typescript
"use client";
import { useHasRole, useHasMinRole } from '@/lib/auth/gateways/client';

export function Component() {
  const isAdmin = useHasRole('admin');
  const canAccessAdmin = useHasMinRole('admin');
  
  return (
    <>
      {isAdmin && <AdminPanel />}
      {canAccessAdmin && <AdminContent />}
    </>
  );
}
```

### Available Client Hooks

- `useAuth()`: Returns `{ user, role, loading }`
- `useRequireAuth(redirectTo?)`: Redirects if not authenticated
- `useHasPermission(permission)`: Returns boolean
- `usePermissions()`: Returns array of permissions
- `useHasRole(role)`: Returns boolean
- `useHasMinRole(role)`: Returns boolean
- `useRequireRole(role, redirectTo?)`: Redirects if role insufficient
- `useRequireMinRole(role, redirectTo?)`: Redirects if role insufficient

## Authorization Patterns

### Pattern 1: Route-Level Protection

Protect entire routes with permission checks:

```typescript
// API Route
export const GET = withPermission(
  PERMISSIONS.companies.view,
  async (request, { user }) => {
    // Handler code
  }
);

// Server Component
export default async function Page() {
  const { user } = await requirePermission(PERMISSIONS.companies.view);
  // Page content
}
```

### Pattern 2: Action-Level Protection

Check permissions for specific actions:

```typescript
// Server Component
export default async function Page() {
  const { user } = await requireAuth();
  
  const canEdit = await hasPermission(user, PERMISSIONS.companies.edit);
  const canDelete = await hasPermission(user, PERMISSIONS.companies.delete);
  
  return (
    <CompanyDetailClient
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}

// Client Component
export function CompanyDetailClient({ canEdit, canDelete }) {
  return (
    <>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </>
  );
}
```

### Pattern 3: Conditional Rendering

Use permission hooks for conditional UI:

```typescript
"use client";
import { useHasPermission } from '@/lib/auth/gateways/client';

export function Component() {
  const canEdit = useHasPermission(PERMISSIONS.companies.edit);
  
  return (
    <div>
      <CompanyInfo />
      {canEdit && <EditForm />}
    </div>
  );
}
```

### Pattern 4: Hybrid Server/Client

Combine server-side permission checks with client-side UI:

```typescript
// Server Component
export default async function Page() {
  const { user } = await requirePermission(PERMISSIONS.companies.view);
  const canEdit = await hasPermission(user, PERMISSIONS.companies.edit);
  
  return <CompanyDetailClient canEdit={canEdit} />;
}

// Client Component
"use client";
export function CompanyDetailClient({ canEdit }) {
  // Additional client-side checks if needed
  const canDelete = useHasPermission(PERMISSIONS.companies.delete);
  
  return (
    <>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </>
  );
}
```

## Best Practices

### ✅ DO

- **Check Permissions Server-Side**: Always validate permissions server-side
- **Use Permission Checks**: Prefer permission checks over role checks
- **Pass Permissions as Props**: Pass permission flags to client components
- **Use Action-Level Checks**: Check permissions for specific actions
- **Handle Loading States**: Show loading states while checking permissions

### ❌ DON'T

- **Don't Trust Client Checks Alone**: Always verify server-side
- **Don't Expose Sensitive Data**: Based on client-side checks
- **Don't Skip Permission Checks**: In API routes or server components
- **Don't Use Role Checks**: When permission checks are available
- **Don't Hardcode Permissions**: Use `PERMISSIONS` constants

## Error Handling

### API Routes

Unauthorized/forbidden requests return JSON error responses:

```typescript
{
  error: "UNAUTHORIZED" | "FORBIDDEN",
  message: string,
  timestamp: string
}
```

### Server Components

Unauthorized access redirects:
- Not authenticated → `/auth/sign-in`
- Insufficient permissions → `/admin?error=insufficient_permissions`

### Client Components

- Hooks return `false` if user doesn't have permission
- Redirect hooks redirect if permission insufficient

## Related Documentation

- [Permission System](./permissions.md) - Permission system details
- [Authentication Overview](./overview.md) - Authentication system
- [Authentication & Authorization Pattern](../patterns/authentication-authorization.md) - Implementation patterns
