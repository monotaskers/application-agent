---
title: "Permission System"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/auth/permissions.ts"
  - "src/lib/auth/permission-checker.ts"
  - "src/lib/auth/permission-checker-client.ts"
  - "src/lib/auth/custom-roles.ts"
---

# Permission System

## Overview

The SDG Application uses a **permission-based authorization system** that provides fine-grained access control. Permissions are organized hierarchically and support both system roles and custom roles.

## Permission Structure

### Permission Format

Permissions follow a dot-notation pattern: `resource.action`

Examples:
- `users.view` - View users
- `interviews.create` - Create interviews
- `surveys.delete` - Delete surveys

### Permission Registry

All permissions are defined in `src/lib/auth/permissions.ts`:

```typescript
export const PERMISSIONS = {
  // User management
  users: {
    view: "users.view",
    create: "users.create",
    edit: "users.edit",
    delete: "users.delete",
    assignRole: "users.assign_role",
    viewAll: "users.view_all",
  },
  
  // Survey management
  surveys: {
    view: "surveys.view",
    create: "surveys.create",
    edit: "surveys.edit",
    delete: "surveys.delete",
    submit: "surveys.submit",
    lock: "surveys.lock",
    viewAll: "surveys.view_all",
  },
  
  // Interview management
  interviews: {
    view: "interviews.view",
    create: "interviews.create",
    edit: "interviews.edit",
    delete: "interviews.delete",
    viewAll: "interviews.view_all",
  },
  
  // Role management (superadmin only)
  roles: {
    view: "roles.view",
    create: "roles.create",
    edit: "roles.edit",
    delete: "roles.delete",
    assign: "roles.assign",
  },
  
  // Settings management
  settings: {
    view: "settings.view",
    edit: "settings.edit",
    system: "settings.system",
  },
  
  // Wildcard permission (all permissions)
  all: "*",
} as const;
```

## Permission Matching

The system supports wildcard matching for flexible permission checks.

### Wildcard Rules

1. **Global Wildcard**: `PERMISSIONS.all` (or `"*"`) matches any permission
2. **Resource Wildcard**: `"users.*"` matches all user permissions
3. **Exact Match**: `"users.view"` matches only that specific permission

### Matching Logic

```typescript
export function matchesPermission(
  userPermission: Permission,
  requiredPermission: Permission,
): boolean {
  // Wildcard permission grants everything
  if (userPermission === PERMISSIONS.all) return true;

  // Exact match
  if (userPermission === requiredPermission) return true;

  // Wildcard matching: "users.*" matches "users.view"
  if (userPermission.endsWith(".*")) {
    const prefix = userPermission.slice(0, -2);
    return requiredPermission.startsWith(prefix + ".");
  }

  return false;
}
```

### Examples

```typescript
// User has "users.*"
matchesPermission("users.*", "users.view")     // true
matchesPermission("users.*", "users.create")  // true
matchesPermission("users.*", "interviews.view")        // false

// User has "*" (all permissions)
matchesPermission("*", "users.view")              // true
matchesPermission("*", "interviews.delete")                // true

// User has "users.view"
matchesPermission("users.view", "users.view") // true
matchesPermission("users.view", "users.edit") // false
```

## Permission Resolution

Permissions are resolved in a specific order based on user role and custom role assignments.

### Resolution Order

1. **Superadmin Check**: If user is superadmin, return `[PERMISSIONS.all]`
2. **Custom Role Check**: If user has `custom_role_id`, use custom role permissions
3. **System Role Fallback**: Use system role default permissions

### Implementation

```typescript
export async function getUserPermissions(
  user: User | null,
): Promise<Permission[]> {
  if (!user) {
    return [];
  }

  // Superadmin always has all permissions
  const systemRole = getUserRole(user);
  if (systemRole === "superadmin") {
    return [PERMISSIONS.all];
  }

  // Check for custom role
  const customRoleId = user.app_metadata?.custom_role_id;
  if (customRoleId) {
    const customRole = await getCustomRole(customRoleId);
    if (customRole) {
      // Custom role permissions override system role permissions
      return customRole.permissions as Permission[];
    }
    // If custom role not found, fall back to system role
  }

  // Return system role default permissions
  return [...ROLE_PERMISSIONS[systemRole]];
}
```

## System Role Permissions

Each system role has default permissions assigned.

### Member Role

Basic user permissions:

```typescript
member: [
  PERMISSIONS.interviews.view,
  PERMISSIONS.interviews.create,
]
```

### Admin Role

Administrative permissions (includes all member permissions plus):

```typescript
admin: [
  // All member permissions plus:
  PERMISSIONS.interviews.edit,
  PERMISSIONS.interviews.delete,
  PERMISSIONS.interviews.viewAll,
  PERMISSIONS.users.view,
  PERMISSIONS.users.viewAll,
  PERMISSIONS.settings.view,
]
```

### Superadmin Role

All permissions:

```typescript
superadmin: [PERMISSIONS.all]
```

## Custom Roles

Custom roles allow fine-grained permission control beyond system roles.

### Custom Role Structure

```typescript
interface CustomRole {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

### Custom Role Permissions

- **Override System Role**: Custom role permissions completely replace system role permissions
- **Flexible Permissions**: Any combination of permissions can be assigned
- **Wildcard Support**: Custom roles can use wildcard permissions

### Custom Role Assignment

Users are assigned custom roles via `app_metadata.custom_role_id`:

```typescript
// Assign custom role to user
await assignCustomRoleToUser(userId, customRoleId);

// Remove custom role (revert to system role)
await assignCustomRoleToUser(userId, null);
```

### Custom Role Management

Custom roles are managed by superadmins:

- **Create**: `createCustomRole(input, createdBy)`
- **Update**: `updateCustomRole(roleId, input)`
- **Delete**: `deleteCustomRole(roleId)`
- **List**: `listCustomRoles()`
- **Get**: `getCustomRole(roleId)` or `getCustomRoleByName(name)`

## Permission Checking

### Server-Side Permission Checks

Use `hasPermission()` for server-side permission checks:

```typescript
import { hasPermission } from '@/lib/auth/permission-checker';
import { PERMISSIONS } from '@/lib/auth/permissions';

// Check single permission
const canEdit = await hasPermission(user, PERMISSIONS.users.edit);

// Check multiple permissions
const canManage = await hasAllPermissions(user, [
  PERMISSIONS.users.view,
  PERMISSIONS.users.edit,
]);
```

**Available Functions:**
- `hasPermission(user, permission)`: Check single permission
- `hasAnyPermission(user, permissions[])`: Check if user has any permission
- `hasAllPermissions(user, permissions[])`: Check if user has all permissions
- `getUserPermissions(user)`: Get all user permissions

### Client-Side Permission Checks

Use client-safe permission checks (only checks system roles, not custom roles):

```typescript
import { hasPermissionClient } from '@/lib/auth/permission-checker-client';

// Check permission (synchronous, system roles only)
const canEdit = hasPermissionClient(user, PERMISSIONS.users.edit);
```

**Note**: Client-side checks only work with system roles. For custom role permissions, use server-side checks.

## Permission Validation

### Validating Permission Strings

```typescript
import { isValidPermission } from '@/lib/auth/permissions';

const isValid = isValidPermission("users.view"); // true
const isInvalid = isValidPermission("invalid.permission"); // false
```

### Permission Type Safety

All permissions are typed using TypeScript:

```typescript
export type Permission = string;

// Permission constants are strongly typed
const permission: Permission = PERMISSIONS.users.view;
```

## Best Practices

### ✅ DO

- **Use Permission Constants**: Always use `PERMISSIONS` constants, never hardcode strings
- **Check Server-Side**: Always validate permissions server-side
- **Use Specific Permissions**: Prefer specific permissions over wildcards when possible
- **Document Permission Requirements**: Document which permissions are required for features

### ❌ DON'T

- **Don't Hardcode Permissions**: Never hardcode permission strings
- **Don't Trust Client Checks Alone**: Always verify permissions server-side
- **Don't Skip Permission Checks**: Always check permissions before allowing actions
- **Don't Use Role Checks**: Use permission checks instead of role checks when possible

## Examples

### API Route Protection

```typescript
import { withPermission } from '@/lib/auth/gateways/api';
import { PERMISSIONS } from '@/lib/auth/permissions';

export const GET = withPermission(
  PERMISSIONS.users.view,
  async (request, { user, role }) => {
    // User has users.view permission
    return NextResponse.json({ users: [] });
  }
);
```

### Server Component Permission Check

```typescript
import { requirePermission, hasPermission } from '@/lib/auth/gateways/server';
import { PERMISSIONS } from '@/lib/auth/permissions';

export default async function Page() {
  // Route-level check
  const { user } = await requirePermission(PERMISSIONS.users.view);
  
  // Action-level checks
  const canEdit = await hasPermission(user, PERMISSIONS.users.edit);
  const canDelete = await hasPermission(user, PERMISSIONS.users.delete);
  
  return <Component canEdit={canEdit} canDelete={canDelete} />;
}
```

### Client Component Permission Check

```typescript
"use client";
import { useHasPermission } from '@/lib/auth/gateways/client';
import { PERMISSIONS } from '@/lib/auth/permissions';

export function Component() {
  const canEdit = useHasPermission(PERMISSIONS.users.edit);
  
  return (
    <>
      {canEdit && <EditButton />}
    </>
  );
}
```

## Related Documentation

- [Authorization Patterns](./authorization.md) - How to use permissions for authorization
- [Authentication Overview](./overview.md) - Authentication system overview
- [Custom Roles](../schemas/custom-role.md) - Custom role schema documentation
